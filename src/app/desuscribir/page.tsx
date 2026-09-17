import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { FloatingNav } from "@/components/FloatingNav";
import { HeroHeaderNav } from "@/components/HeroHeaderNav";
import { Footer } from "@/components/Footer";
import { CheckCircle2, ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Baja de Comunicaciones | SoldeRío Energía SpA",
  description: "Confirmación de baja de comunicaciones informativas y comerciales.",
  robots: {
    index: false,
    follow: false,
  },
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DesuscribirPage({ searchParams }: Props) {
  const params = await searchParams;
  const leadId = typeof params.leadId === "string" ? params.leadId : null;

  return (
    <main className="w-full min-h-screen relative bg-[#141414] text-white">
      <FloatingNav />

      <div className="w-full relative z-30 bg-transparent">
        <HeroHeaderNav locationText="Sur de Chile" />
      </div>

      {/* Ambient Radial Lights */}
      <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#FF8300]/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="px-4 sm:px-6 md:px-8 py-20 relative z-10">
        <div className="max-w-xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 text-center backdrop-blur-xl shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
            Baja procesada correctamente
          </h1>

          <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
            Conforme a la Ley N° 19.496 (Art. 28 B), tu solicitud de exclusión ha quedado registrada. No recibirás nuevos correos informativos ni recordatorios comerciales de <strong>SoldeRío Energía SpA</strong>.
          </p>

          {leadId && (
            <div className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-white/10 text-white/60 mb-6">
              Registro asociado al Folio: {leadId}
            </div>
          )}

          <div className="pt-4 border-t border-white/10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a solderio.cl
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
