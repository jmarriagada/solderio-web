import zlib from "zlib";
import { QuoteFormData, SolarSizingResult } from "@/types/cotizacion";

export interface ProposalPayload {
  id: string;
  createdAt: number;
  expiresAt: number;
  formData: QuoteFormData;
  sizingResult: SolarSizingResult;
}

export function encodeProposalToken(payload: ProposalPayload): string {
  try {
    const json = JSON.stringify(payload);
    return zlib.deflateRawSync(Buffer.from(json, "utf-8")).toString("base64url");
  } catch (e) {
    console.error("[ProposalToken] Error al comprimir token:", e);
    return "";
  }
}

export function decodeProposalToken(token: string): ProposalPayload | null {
  try {
    if (!token || typeof token !== "string") return null;
    const buffer = Buffer.from(token, "base64url");
    const decompressed = zlib.inflateRawSync(buffer).toString("utf-8");
    return JSON.parse(decompressed) as ProposalPayload;
  } catch (e) {
    console.warn("[ProposalToken] Falló decodificación de token comprimido:", e);
    return null;
  }
}
