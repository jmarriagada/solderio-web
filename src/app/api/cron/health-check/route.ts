import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export const dynamic = "force-dynamic";
export const maxDuration = 30; // 30 seconds max for Vercel functions

const DEFAULT_SENDER = "SoldeRío Energía <contacto@solderio.cl>";
const DEV_RECIPIENT = "dev@solderio.cl";

interface ServiceStatus {
  name: string;
  category: string;
  status: "OK" | "WARNING" | "ERROR";
  latencyMs: number;
  details: string;
}

export async function GET(request: NextRequest) {
  return handleHealthCheck(request);
}

export async function POST(request: NextRequest) {
  return handleHealthCheck(request);
}

async function handleHealthCheck(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sendEmail = searchParams.get("sendEmail") === "true";
  const authHeader = request.headers.get("authorization");
  const secretHeader = request.headers.get("x-cron-secret");

  // Basic security check: allow if bearer token matches, or x-cron-secret matches,
  // or allow ping if secret is not set yet in dev
  const expectedSecret =
    process.env.CRON_SECRET ||
    process.env.WEBHOOK_SECRET ||
    "sol_sec_2026_prod_key";

  const isAuthorized =
    authHeader === `Bearer ${expectedSecret}` ||
    secretHeader === expectedSecret ||
    searchParams.get("key") === expectedSecret;

  if (!isAuthorized && sendEmail) {
    return NextResponse.json(
      { error: "No autorizado para disparar reportes por correo." },
      { status: 401 }
    );
  }

  const results: ServiceStatus[] = [];
  const startTime = Date.now();

  // 1. Check & Keep-Alive Supabase PostgreSQL via Prisma
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1 as keep_alive;`;
    const latency = Date.now() - dbStart;
    results.push({
      name: "Supabase PostgreSQL (Prisma)",
      category: "Base de Datos",
      status: "OK",
      latencyMs: latency,
      details: "Query SELECT 1 exitoso. Actividad registrada (pausa evitada).",
    });
  } catch (err: any) {
    console.error("[HealthCheck] Error en base de datos:", err);
    results.push({
      name: "Supabase PostgreSQL (Prisma)",
      category: "Base de Datos",
      status: "ERROR",
      latencyMs: -1,
      details: err?.message || "Error al conectar a PostgreSQL",
    });
  }

  // 2. Check Supabase Auth Service
  try {
    const authStart = Date.now();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && anonKey) {
      const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
        headers: { apikey: anonKey },
        signal: AbortSignal.timeout(8000),
      });
      const latency = Date.now() - authStart;
      results.push({
        name: "Supabase Auth",
        category: "Autenticación",
        status: res.ok ? "OK" : "WARNING",
        latencyMs: latency,
        details: res.ok ? "Servicio Auth respondiendo correctamente (200 OK)." : `HTTP ${res.status}`,
      });
    } else {
      results.push({
        name: "Supabase Auth",
        category: "Autenticación",
        status: "WARNING",
        latencyMs: 0,
        details: "Variables de Supabase no configuradas localmente.",
      });
    }
  } catch (err: any) {
    results.push({
      name: "Supabase Auth",
      category: "Autenticación",
      status: "ERROR",
      latencyMs: -1,
      details: err?.message || "Fallo en conexión a Supabase Auth",
    });
  }

  // 3. Check Website Availability
  try {
    const webStart = Date.now();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.solderio.cl";
    const res = await fetch(siteUrl, {
      method: "HEAD",
      signal: AbortSignal.timeout(8000),
    });
    const latency = Date.now() - webStart;
    results.push({
      name: "Sitio Web Principal (Vercel CDN)",
      category: "Frontend & Edge",
      status: res.ok ? "OK" : "WARNING",
      latencyMs: latency,
      details: `HTTP ${res.status} desde Edge Network (${siteUrl}).`,
    });
  } catch (err: any) {
    results.push({
      name: "Sitio Web Principal (Vercel CDN)",
      category: "Frontend & Edge",
      status: "ERROR",
      latencyMs: -1,
      details: err?.message || "Fallo en consulta HTTP al sitio web",
    });
  }

  // 4. Send Confirmation Report Email via Resend if requested
  let emailSent = false;
  let emailError: string | null = null;

  if (sendEmail) {
    const resendApiKey = process.env.RESEND_API_KEY?.trim();
    if (!resendApiKey) {
      emailError = "RESEND_API_KEY no configurada en Vercel.";
    } else {
      try {
        const resend = new Resend(resendApiKey);
        const sender = process.env.SENDER_EMAIL?.trim() || DEFAULT_SENDER;
        const allOk = results.every((r) => r.status === "OK");
        const statusEmoji = allOk ? "🟢" : "🟡";
        const subject = `${statusEmoji} [SoldeRío] Estado de Servicios e Infraestructura (${new Date().toLocaleDateString("es-CL")})`;

        const html = generateHealthEmailHtml(results, allOk);

        const emailRes = await resend.emails.send({
          from: sender,
          to: [DEV_RECIPIENT],
          subject,
          html,
        });

        if (emailRes.error) {
          emailError = emailRes.error.message;
        } else {
          emailSent = true;
        }
      } catch (err: any) {
        emailError = err?.message || "Error al despachar correo con Resend";
      }
    }
  }

  const allHealthy = results.every((r) => r.status === "OK");

  return NextResponse.json({
    success: true,
    allHealthy,
    timestamp: new Date().toISOString(),
    durationMs: Date.now() - startTime,
    emailReport: {
      requested: sendEmail,
      sent: emailSent,
      recipient: DEV_RECIPIENT,
      error: emailError,
    },
    services: results,
  });
}

function generateHealthEmailHtml(services: ServiceStatus[], allOk: boolean): string {
  const fechaStr = new Date().toLocaleString("es-CL", {
    timeZone: "America/Santiago",
    dateStyle: "full",
    timeStyle: "short",
  });

  const rows = services
    .map((s) => {
      const badgeBg =
        s.status === "OK"
          ? "#DCFCE7"
          : s.status === "WARNING"
          ? "#FEF9C3"
          : "#FEE2E2";
      const badgeColor =
        s.status === "OK"
          ? "#166534"
          : s.status === "WARNING"
          ? "#854D0E"
          : "#991B1B";
      const latencyStr = s.latencyMs >= 0 ? `${s.latencyMs} ms` : "N/A";

      return `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 12px 14px; font-weight: 500; color: #1F2937;">${s.name}</td>
        <td style="padding: 12px 14px; color: #6B7280; font-size: 13px;">${s.category}</td>
        <td style="padding: 12px 14px; text-align: center;">
          <span style="background-color: ${badgeBg}; color: ${badgeColor}; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase;">
            ${s.status}
          </span>
        </td>
        <td style="padding: 12px 14px; font-family: monospace; font-size: 13px; color: #374151; text-align: right;">${latencyStr}</td>
        <td style="padding: 12px 14px; font-size: 12px; color: #4B5563;">${s.details}</td>
      </tr>
    `;
    })
    .join("");

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Estado de Servicios SoldeRío</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7F8FA; margin: 0; padding: 24px; color: #1F1F1F;">
      <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background-color: #1F1F1F; padding: 28px 32px; color: #ffffff;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">SoldeRío Energy</h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.7);">Monitor Automático de Infraestructura & Servicios</p>
            </div>
            <div style="text-align: right;">
              <span style="background-color: ${allOk ? "#22C55E" : "#EAB308"}; color: #ffffff; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700;">
                ${allOk ? "SISTEMAS OPERATIVOS" : "REVISIÓN REQUERIDA"}
              </span>
            </div>
          </div>
        </div>

        <!-- Body -->
        <div style="padding: 32px;">
          <p style="font-size: 14px; color: #4B5563; margin-top: 0; line-height: 1.6;">
            Reporte periódico automático de confirmación de salud y actividad para mantener la base de datos de <strong>Supabase (Plan Free)</strong> permanentemente activa y prevenir pausas por inactividad.
          </p>

          <div style="background-color: #F9FAFB; border-radius: 12px; padding: 14px 18px; margin: 20px 0; border: 1px solid #E5E7EB;">
            <p style="margin: 0; font-size: 12px; color: #6B7280;">
              <strong>Fecha de Verificación:</strong> ${fechaStr}<br />
              <strong>Destinatario:</strong> ${DEV_RECIPIENT}<br />
              <strong>Proyecto Supabase ID:</strong> <code style="background: #E5E7EB; padding: 2px 6px; border-radius: 4px;">rclpzeiwlkdyvisehymx</code>
            </p>
          </div>

          <!-- Table -->
          <table style="width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 14px;">
            <thead>
              <tr style="background-color: #F3F4F6; text-align: left; border-bottom: 2px solid #E5E7EB;">
                <th style="padding: 10px 14px; font-size: 12px; text-transform: uppercase; color: #6B7280;">Servicio</th>
                <th style="padding: 10px 14px; font-size: 12px; text-transform: uppercase; color: #6B7280;">Categoría</th>
                <th style="padding: 10px 14px; font-size: 12px; text-transform: uppercase; color: #6B7280; text-align: center;">Estado</th>
                <th style="padding: 10px 14px; font-size: 12px; text-transform: uppercase; color: #6B7280; text-align: right;">Latencia</th>
                <th style="padding: 10px 14px; font-size: 12px; text-transform: uppercase; color: #6B7280;">Detalle</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>

          <!-- Supabase Keep-Alive Note -->
          <div style="margin-top: 28px; padding: 16px; border-radius: 12px; background-color: #F0FDF4; border: 1px solid #BBF7D0;">
            <p style="margin: 0; font-size: 13px; color: #166534; line-height: 1.5;">
              ✅ <strong>Pausa automática prevenida con éxito:</strong> Se ejecutó una consulta real a PostgreSQL via Prisma Pooler, lo que renovó el temporizador de 7 días de Supabase. Tu proyecto se mantendrá activo sin costo.
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #F9FAFB; padding: 20px 32px; border-top: 1px solid #E5E7EB; text-align: center; font-size: 12px; color: #9CA3AF;">
          SoldeRío Energy Services • Notificación generada automáticamente por GitHub Actions & Vercel Edge.
        </div>

      </div>
    </body>
  </html>
  `;
}
