import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { validateAndNormalizeEmail } from "@/lib/email-validator";
import { sendVisitaTecnicaEmail } from "@/lib/mailer";
import { notifyInternalVisitaLead } from "@/lib/notifier";

const VISITAS_FILE_PATH = path.join(process.cwd(), "data", "visitas-tecnicas.json");

interface VisitaRequestBody {
  nombre: string;
  telefono: string;
  email: string;
  region: string;
  comuna: string;
  direccion: string;
  latitud?: number | null;
  longitud?: number | null;
  coordenadasTexto?: string;
  tipoPropiedad?: string;
  montoBoleta?: string;
  fechaSeleccionada: string;
  fechaIso?: string;
  bloqueHorario: "manana" | "tarde";
  notas?: string;
  folio?: string;
}

async function ensureLocalVisitasFile(): Promise<void> {
  try {
    const dir = path.dirname(VISITAS_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.access(VISITAS_FILE_PATH);
  } catch {
    try {
      await fs.writeFile(VISITAS_FILE_PATH, JSON.stringify([], null, 2), "utf-8");
    } catch {}
  }
}

async function saveVisitaLocally(visita: any): Promise<void> {
  try {
    await ensureLocalVisitasFile();
    const raw = await fs.readFile(VISITAS_FILE_PATH, "utf-8");
    const visitas = JSON.parse(raw) as any[];
    visitas.unshift(visita);
    await fs.writeFile(VISITAS_FILE_PATH, JSON.stringify(visitas, null, 2), "utf-8");
  } catch (err) {
    console.warn("[Local Visitas] Servidor de solo lectura (Vercel), omitiendo respaldo en disco.");
  }
}

async function saveVisitaToFirestore(visita: any): Promise<boolean> {
  if (!process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    return false;
  }
  try {
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();
    if (db) {
      await db.collection("visitas_tecnicas").doc(visita.folio).set(visita);
      return true;
    }
  } catch (err) {
    console.warn("Firestore no configurado o offline para visita técnica:", err);
  }
  return false;
}

async function dispatchWebhookToN8n(visita: any): Promise<void> {
  const candidateUrls: string[] = [];
  if (process.env.EXTERNAL_WEBHOOK_URL) {
    candidateUrls.push(process.env.EXTERNAL_WEBHOOK_URL);
  } else if (process.env.NODE_ENV !== "production") {
    candidateUrls.push("http://localhost:5678/webhook-test/solderio-leads");
    candidateUrls.push("http://localhost:5678/webhook/solderio-leads");
  }

  const payload = {
    event: "visita_tecnica.created",
    folio: visita.folio,
    createdAt: visita.createdAt,
    cliente: visita,
  };

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-solderio-secret": process.env.WEBHOOK_SECRET || "solde_rio_sec_2026",
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) break;
    } catch {}
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VisitaRequestBody;

    // 1. Validaciones básicas
    if (!body.nombre || body.nombre.trim().length < 2) {
      return NextResponse.json(
        { error: "Nombre completo es requerido." },
        { status: 400 }
      );
    }

    if (!body.telefono || body.telefono.trim().length < 7) {
      return NextResponse.json(
        { error: "Teléfono de contacto válido es requerido." },
        { status: 400 }
      );
    }

    const emailValidation = validateAndNormalizeEmail(body.email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.error || "Correo electrónico válido es requerido." },
        { status: 400 }
      );
    }

    const hasAddress = body.direccion && body.direccion.trim().length > 0;
    const hasCoords = body.latitud !== undefined && body.latitud !== null && body.longitud !== undefined && body.longitud !== null;

    if (!hasAddress && !hasCoords) {
      return NextResponse.json(
        { error: "Dirección o punto en mapa es requerido para la visita." },
        { status: 400 }
      );
    }

    // 2. Generación o preservación de Folio
    const timestamp = new Date().toISOString();
    const folio = body.folio?.trim() || `SOL-VIS-${Math.floor(1000 + Math.random() * 9000)}`;

    // Normalizar fecha ISO si no vino directamente
    let calculatedFechaIso = body.fechaIso;
    if (!calculatedFechaIso) {
      // Fallback: siguiente día hábil
      const d = new Date();
      d.setDate(d.getDate() + 1);
      calculatedFechaIso = d.toISOString().split("T")[0];
    }

    const visitaRecord = {
      folio,
      createdAt: timestamp,
      nombre: body.nombre.trim(),
      telefono: body.telefono.trim(),
      email: emailValidation.normalizedEmail,
      region: body.region || "Región de Los Lagos",
      comuna: body.comuna || "Puerto Varas",
      direccion: body.direccion?.trim() || "",
      latitud: body.latitud ?? null,
      longitud: body.longitud ?? null,
      coordenadasTexto: body.coordenadasTexto || "",
      tipoPropiedad: body.tipoPropiedad || "Parcela",
      montoBoleta: body.montoBoleta || "100.000 - 200.000",
      fechaSeleccionada: body.fechaSeleccionada,
      fechaIso: calculatedFechaIso,
      bloqueHorario: body.bloqueHorario || "manana",
      notas: body.notas || "",
      costoClp: 14990,
      reembolsable: true,
      estado: "AGENDADA",
    };

    // 3. Persistencia (Firestore + Local)
    await Promise.all([
      saveVisitaToFirestore(visitaRecord),
      saveVisitaLocally(visitaRecord),
    ]);

    // 4. Notificaciones internas para el equipo de SoldeRío (Telegram Bot + Correo Interno)
    try {
      await notifyInternalVisitaLead({
        folio,
        nombre: visitaRecord.nombre,
        telefono: visitaRecord.telefono,
        email: visitaRecord.email,
        direccion: visitaRecord.direccion,
        comuna: visitaRecord.comuna,
        region: visitaRecord.region,
        latitud: visitaRecord.latitud,
        longitud: visitaRecord.longitud,
        coordenadasTexto: visitaRecord.coordenadasTexto,
        fechaSeleccionada: visitaRecord.fechaSeleccionada,
        bloqueHorario: visitaRecord.bloqueHorario,
        tipoPropiedad: visitaRecord.tipoPropiedad,
        montoBoleta: visitaRecord.montoBoleta,
        notas: visitaRecord.notas,
      });
    } catch (notifErr) {
      console.warn("[Notificación Interna Visita Falló]:", notifErr);
    }

    // 5. Webhook en segundo plano (n8n)
    dispatchWebhookToN8n(visitaRecord).catch((err) =>
      console.warn("Webhook visita background err:", err)
    );

    // 6. Envío de correo con .ics de calendario al cliente
    let emailDelivery: any = null;
    try {
      emailDelivery = await sendVisitaTecnicaEmail({
        folio,
        nombre: visitaRecord.nombre,
        email: visitaRecord.email,
        telefono: visitaRecord.telefono,
        direccion: visitaRecord.direccion,
        comuna: visitaRecord.comuna,
        region: visitaRecord.region,
        latitud: visitaRecord.latitud,
        longitud: visitaRecord.longitud,
        coordenadasTexto: visitaRecord.coordenadasTexto,
        fechaIso: visitaRecord.fechaIso,
        fechaTexto: visitaRecord.fechaSeleccionada,
        bloqueHorario: visitaRecord.bloqueHorario,
        tipoPropiedad: visitaRecord.tipoPropiedad,
        notas: visitaRecord.notas,
      });
      console.log(`[Visita API] Resultado de correo para ${visitaRecord.email}:`, emailDelivery);
    } catch (mailErr: any) {
      console.error("[Visita API Error Correo]:", mailErr);
      emailDelivery = { success: false, error: mailErr?.message || String(mailErr) };
    }

    return NextResponse.json({
      success: true,
      folio,
      visita: visitaRecord,
      emailDelivery,
      message: "Visita técnica registrada y confirmada exitosamente.",
    });
  } catch (error: any) {
    console.error("Error al procesar agendamiento de visita técnica:", error);
    return NextResponse.json(
      {
        error: "Error interno al procesar agendamiento de visita técnica.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    try {
      const { getAdminDb } = await import("@/lib/firebase-admin");
      const db = getAdminDb();
      if (db) {
        const snap = await db.collection("visitas_tecnicas").orderBy("createdAt", "desc").limit(50).get();
        const visitas = snap.docs.map((d: any) => d.data());
        return NextResponse.json({ total: visitas.length, visitas });
      }
    } catch {}
  }

  try {
    await ensureLocalVisitasFile();
    const raw = await fs.readFile(VISITAS_FILE_PATH, "utf-8");
    const visitas = JSON.parse(raw) as any[];
    return NextResponse.json({ total: visitas.length, visitas: visitas.slice(0, 50) });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener visitas técnicas" }, { status: 500 });
  }
}
