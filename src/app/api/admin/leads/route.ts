import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { LeadSubmission } from "@/types/cotizacion";
import { getAdminDb } from "@/lib/firebase-admin";

const LEADS_FILE_PATH = path.join(process.cwd(), "data", "leads.json");

async function getLeads(): Promise<LeadSubmission[]> {
  try {
    const db = getAdminDb();
    if (db && process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
      const snap = await db.collection("leads").orderBy("createdAt", "desc").get();
      if (!snap.empty) {
        return snap.docs.map((d: any) => d.data() as LeadSubmission);
      }
    }
  } catch (e) {
    console.warn("Error leyendo Firestore en admin, usando almacenamiento local:", e);
  }

  try {
    const raw = await fs.readFile(LEADS_FILE_PATH, "utf-8");
    return JSON.parse(raw) as LeadSubmission[];
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const leads = await getLeads();

    // Compute Executive Dashboard KPIs
    const totalLeads = leads.length;
    const totalKwp = leads.reduce((acc, l) => acc + (l.sizingResult?.recommendedKwp || 0), 0);
    const totalEstimatedSavingsAnnual = leads.reduce(
      (acc, l) => acc + (l.sizingResult?.estimatedAnnualSavingsClp || 0),
      0
    );
    const leadsNuevos = leads.filter((l) => l.status === "NUEVO").length;
    const leadsVisita = leads.filter((l) => l.status === "VISITA_AGENDADA").length;
    const leadsCerrados = leads.filter((l) => l.status === "CERRADO").length;

    return NextResponse.json({
      success: true,
      stats: {
        totalLeads,
        totalKwp: Math.round(totalKwp * 10) / 10,
        totalEstimatedSavingsAnnual,
        leadsNuevos,
        leadsVisita,
        leadsCerrados,
      },
      leads,
    });
  } catch (error) {
    console.error("Error al obtener leads de admin:", error);
    return NextResponse.json({ error: "Error interno al obtener leads" }, { status: 500 });
  }
}
