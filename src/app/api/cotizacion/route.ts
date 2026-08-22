import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { calculateSolarSizing } from "@/lib/solar-calculator";
import { LeadSubmission, QuoteFormData } from "@/types/cotizacion";
import { getAdminDb } from "@/lib/firebase-admin";

const LEADS_FILE_PATH = path.join(process.cwd(), "data", "leads.json");

async function ensureLocalLeadsFile(): Promise<void> {
  const dir = path.dirname(LEADS_FILE_PATH);
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.access(LEADS_FILE_PATH);
  } catch {
    await fs.writeFile(LEADS_FILE_PATH, JSON.stringify([], null, 2), "utf-8");
  }
}

async function saveLeadLocally(lead: LeadSubmission): Promise<void> {
  await ensureLocalLeadsFile();
  try {
    const raw = await fs.readFile(LEADS_FILE_PATH, "utf-8");
    const leads = JSON.parse(raw) as LeadSubmission[];
    leads.unshift(lead);
    await fs.writeFile(LEADS_FILE_PATH, JSON.stringify(leads, null, 2), "utf-8");
  } catch (err) {
    console.error("Error guardando lead localmente:", err);
  }
}

async function saveLeadToFirestore(lead: LeadSubmission): Promise<boolean> {
  try {
    const db = getAdminDb();
    if (db && process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
      await db.collection("leads").doc(lead.id).set(lead);
      return true;
    }
  } catch (err) {
    console.warn("Firestore no configurado o offline, usando almacenamiento local:", err);
  }
  return false;
}

async function dispatchWebhookToN8n(lead: LeadSubmission): Promise<void> {
  // Webhook targets to attempt in local / production
  const candidateUrls: string[] = [];
  if (process.env.EXTERNAL_WEBHOOK_URL) {
    candidateUrls.push(process.env.EXTERNAL_WEBHOOK_URL);
  }
  // Local fallback endpoints
  candidateUrls.push("http://localhost:5678/webhook-test/solderio-leads");
  candidateUrls.push("http://localhost:5678/webhook/solderio-leads");

  const payload = {
    event: "lead.created",
    leadId: lead.id,
    createdAt: lead.createdAt,
    cliente: lead.formData,
    dimensionamiento: lead.sizingResult,
  };

  for (const url of candidateUrls) {
    try {
      console.log(`[Webhook Dispatcher] Enviando lead ${lead.id} a: ${url}`);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-solderio-secret": process.env.WEBHOOK_SECRET || "solde_rio_sec_2026",
        },
        body: JSON.stringify(payload),
      });
      console.log(`[Webhook Dispatcher] Respuesta de ${url}: Status ${res.status}`);
      if (res.ok) {
        break; // Successfully received by n8n
      }
    } catch (err: any) {
      console.warn(`[Webhook Dispatcher] Falló conexión con ${url}: ${err.message}`);
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuoteFormData;

    // Basic Validation
    if (!body.fullName || body.fullName.trim().length < 2) {
      return NextResponse.json(
        { error: "Nombre completo es requerido" },
        { status: 400 }
      );
    }

    if (!body.whatsapp || body.whatsapp.trim().length < 7) {
      return NextResponse.json(
        { error: "Número de teléfono WhatsApp válido es requerido" },
        { status: 400 }
      );
    }

    if (!body.email || !body.email.includes("@")) {
      return NextResponse.json(
        { error: "Correo electrónico válido es requerido" },
        { status: 400 }
      );
    }

    // Compute instant technical sizing
    const sizingResult = calculateSolarSizing(body);

    // Create unique lead entry
    const timestamp = new Date().toISOString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const leadId = `SOL-${new Date().getFullYear()}-${randomSuffix}`;

    const newLead: LeadSubmission = {
      id: leadId,
      createdAt: timestamp,
      formData: {
        ...body,
        billFile: body.billFile ? {
          name: body.billFile.name,
          size: body.billFile.size,
          type: body.billFile.type,
        } : null,
      },
      sizingResult,
      status: "NUEVO",
    };

    // 1. Save to Firestore (Cloud) & Local backup
    await Promise.all([
      saveLeadToFirestore(newLead),
      saveLeadLocally(newLead),
    ]);

    // 2. Dispatch event to n8n for WhatsApp, Email and Telegram
    dispatchWebhookToN8n(newLead).catch((e) => console.error("Webhook background error:", e));

    return NextResponse.json({
      success: true,
      leadId,
      sizingResult,
      message: "Cotización procesada exitosamente y sincronizada.",
    });
  } catch (error) {
    console.error("Error al procesar cotización:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la cotización solar." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = getAdminDb();
    if (db && process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
      const snap = await db.collection("leads").orderBy("createdAt", "desc").limit(50).get();
      const leads = snap.docs.map((d: any) => d.data() as LeadSubmission);
      return NextResponse.json({ total: leads.length, leads });
    }
  } catch {}

  try {
    await ensureLocalLeadsFile();
    const raw = await fs.readFile(LEADS_FILE_PATH, "utf-8");
    const leads = JSON.parse(raw) as LeadSubmission[];
    return NextResponse.json({ total: leads.length, leads: leads.slice(0, 50) });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener leads" }, { status: 500 });
  }
}
