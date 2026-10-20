import { NextResponse } from "next/server";
import { bessAuditFormSchema } from "@/lib/validation/schemas";
import { getClientIp, checkRateLimit } from "@/lib/rate-limiter";
import { validateAndNormalizeEmail } from "@/lib/email-validator";
import { notifyInternalBessAudit } from "@/lib/notifier";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { sendBessAuditConfirmationEmail } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    // 0. Rate Limiting por IP (Máx 5 peticiones por minuto)
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp, { maxRequests: 5, windowSeconds: 60 });
    if (!rateLimit.isAllowed) {
      return NextResponse.json(
        {
          error:
            "Has realizado demasiadas solicitudes en poco tiempo. Por favor espera un momento antes de volver a intentar.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetSeconds),
          },
        }
      );
    }

    const rawBody = await request.json();

    // 1. Validación y Sanitización con Zod (Anti-XSS / Anti-Injection)
    const validationResult = bessAuditFormSchema.safeParse(rawBody);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || "Datos de solicitud inválidos";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    // 2. Honeypot check: Si un bot llenó el campo trampa, descartamos en silencio
    if (validationResult.data.website_url && validationResult.data.website_url.trim().length > 0) {
      console.log(`[Honeypot Triggered - BESS C&I] Descartando bot silenciosamente desde IP: ${clientIp}`);
      return NextResponse.json({
        success: true,
        message: "Solicitud de auditoría recibida exitosamente.",
      });
    }

    // 2.1 Verificación Anti-Bot de Cloudflare Turnstile
    const turnstileCheck = await verifyTurnstileToken(validationResult.data.turnstileToken, clientIp);
    if (!turnstileCheck.success) {
      return NextResponse.json({ error: turnstileCheck.message }, { status: 403 });
    }

    const body = validationResult.data;

    // Validación complementaria de correo electrónico corporativo
    const emailValidation = validateAndNormalizeEmail(body.email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.error || "Correo corporativo válido es requerido." },
        { status: 400 }
      );
    }

    const normalizedEmail = emailValidation.normalizedEmail;

    // 3. Notificación externa opcional a Webhook / CRM (n8n / Odoo)
    if (process.env.EXTERNAL_WEBHOOK_URL) {
      try {
        fetch(process.env.EXTERNAL_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "lead.bess_audit",
            leadType: "BESS_C&I",
            timestamp: new Date().toISOString(),
            data: {
              ...body,
              email: normalizedEmail,
            },
          }),
        }).catch((err) => console.warn("[Webhook BESS Sync Warning]:", err));
      } catch (webhookErr) {
        // No bloquear la respuesta al usuario
      }
    }

    // 4. Notificación interna (Telegram + Correo oficial a contacto@solderio.cl)
    try {
      await notifyInternalBessAudit({
        empresa: body.empresa,
        contacto: body.contacto,
        cargo: body.cargo,
        telefono: body.telefono,
        email: normalizedEmail,
        comuna: body.comuna,
        tarifa: body.tarifa,
        potenciaKva: body.potenciaKva,
        comentarios: body.comentarios,
      });
    } catch (notifErr) {
      console.warn("[Notificación Interna BESS Falló]:", notifErr);
    }

    // 5. Correo oficial de confirmación para el cliente
    try {
      await sendBessAuditConfirmationEmail({
        to: normalizedEmail,
        contacto: body.contacto,
        empresa: body.empresa,
        cargo: body.cargo,
        comuna: body.comuna,
        tarifa: body.tarifa,
        potenciaKva: body.potenciaKva,
      });
    } catch (confErr) {
      console.warn("[Confirmación Cliente BESS Falló]:", confErr);
    }

    return NextResponse.json({
      success: true,
      message: "Solicitud de auditoría de redes recibida exitosamente. Un ingeniero eléctrico te contactará a la brevedad.",
    });
  } catch (error: any) {
    console.error("Error al procesar solicitud BESS:", error);
    return NextResponse.json(
      {
        error: "Error interno al procesar tu solicitud. Por favor intenta nuevamente.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
