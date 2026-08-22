import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { LeadSubmission } from "@/types/cotizacion";
import { getAdminDb } from "@/lib/firebase-admin";

const LEADS_FILE_PATH = path.join(process.cwd(), "data", "leads.json");

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 1. Update in Firestore if available
    try {
      const db = getAdminDb();
      if (db && process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
        await db.collection("leads").doc(id).update({
          status: body.status,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn("Error actualizando Firestore:", e);
    }

    // 2. Update local storage backup
    try {
      const raw = await fs.readFile(LEADS_FILE_PATH, "utf-8");
      const leads = JSON.parse(raw) as LeadSubmission[];

      const leadIndex = leads.findIndex((l) => l.id === id);
      if (leadIndex !== -1) {
        if (body.status) {
          leads[leadIndex].status = body.status;
        }
        await fs.writeFile(LEADS_FILE_PATH, JSON.stringify(leads, null, 2), "utf-8");
        return NextResponse.json({
          success: true,
          lead: leads[leadIndex],
        });
      }
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar lead" }, { status: 500 });
  }
}
