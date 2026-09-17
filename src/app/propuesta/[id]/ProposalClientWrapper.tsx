"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { QuoteReportView } from "@/components/cotizacion/QuoteReportView";
import { QuoteFormData, SolarSizingResult } from "@/types/cotizacion";
import { ShieldCheck, Clock, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  leadId: string;
  formData: QuoteFormData;
  sizingResult: SolarSizingResult;
  expiresAtIso: string;
  daysRemaining: number;
}

export function ProposalClientWrapper({
  leadId,
  formData,
  sizingResult,
  expiresAtIso,
  daysRemaining,
}: Props) {
  const router = useRouter();

  const formattedExpiry = new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(expiresAtIso));

  return (
    <div className="w-full">
      {/* Validity Notification Banner */}
      <div className="max-w-5xl mx-auto mb-8 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF8300]/20 border border-[#FF8300]/40 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-[#FF8300]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#FF8300]/20 text-[#FF8300] border border-[#FF8300]/30">
                Folio: {leadId}
              </span>
              <span className="text-xs text-white/60 font-medium">
                Propuesta Técnica Oficial SoldeRío
              </span>
            </div>
            <p className="text-sm text-white/90 font-medium mt-1">
              Validez de 15 días: Activa hasta el{" "}
              <strong className="text-white capitalize">{formattedExpiry}</strong>{" "}
              <span className="text-[#FF8300] font-semibold">
                ({daysRemaining === 1 ? "Último día" : `quedan ${daysRemaining} días`})
              </span>
            </p>
          </div>
        </div>

        <Link
          href="/cotizacion"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl transition-all border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Nueva Cotización
        </Link>
      </div>

      {/* Main Interactive Proposal */}
      <QuoteReportView
        formData={formData}
        sizing={sizingResult}
        leadId={leadId}
        onReset={() => router.push("/cotizacion")}
      />
    </div>
  );
}
