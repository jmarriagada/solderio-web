import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { FloatingNav } from "@/components/FloatingNav";
import { HeroHeaderNav } from "@/components/HeroHeaderNav";
import { Footer } from "@/components/Footer";
import { ProposalClientWrapper } from "./ProposalClientWrapper";
import { Clock, AlertTriangle, ArrowRight, Phone, RotateCcw } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Propuesta Solar Fotovoltaica ${id} | SoldeRío Energía SpA`,
    description: `Estudio técnico fotovoltaico y dimensionamiento solar personalizado para el Folio ${id}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PropuestaPage({ params }: Props) {
  const { id } = await params;

  // 1. Limpieza automática de propuestas que hayan superado los 15 días de validez
  try {
    await prisma.publicProposal.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  } catch (err) {
    console.warn("[Propuesta] Limpieza de expiradas omitida:", err);
  }

  // 2. Búsqueda de la propuesta por Folio / ID
  let proposal: any = null;
  try {
    proposal = await prisma.publicProposal.findUnique({
      where: { id },
    });
  } catch (err) {
    console.error("[Propuesta] Error buscando propuesta en BD:", err);
  }

  const now = new Date();
  const isExpired = !proposal || new Date(proposal.expiresAt) < now;

  // Si está expirada, si aún existe en BD la eliminamos de inmediato
  if (proposal && isExpired) {
    try {
      await prisma.publicProposal.delete({
        where: { id },
      });
    } catch {}
  }

  return (
    <main className="w-full min-h-screen relative bg-[#141414] text-white">
      <FloatingNav />
      
      <div className="w-full relative z-30 bg-transparent">
        <HeroHeaderNav locationText="Sur de Chile" />
      </div>

      {/* Ambient Radial Lights */}
      <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#FF8300]/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="px-4 sm:px-6 md:px-8 pt-8 pb-24 relative z-10">
        {isExpired ? (
          /* Expired / Not Found Screen */
          <div className="max-w-2xl mx-auto my-12 bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 text-center backdrop-blur-xl shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-[#FF8300]" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-white/10 text-white/70 mb-4">
              Folio: {id}
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
              Esta propuesta técnica ha expirado
            </h1>

            <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
              Nuestras propuestas solares fotovoltaicas tienen una <strong>validez estricta de 15 días corridos</strong> desde su fecha de emisión. Debido a las actualizaciones de precios de módulos solares N-Type, equipamiento de inversores e indexación de tarifas de las distribuidoras eléctricas en el sur de Chile, es necesario realizar un nuevo cálculo actualizado.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/cotizacion"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF8300] hover:bg-[#FF8300]/90 text-white font-bold px-7 py-3.5 rounded-full text-sm shadow-lg shadow-[#FF8300]/25 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Generar Nueva Cotización Inmediata
              </Link>

              <a
                href={`https://wa.me/56966186667?text=${encodeURIComponent(
                  `Hola SoldeRío, tenía la propuesta Folio ${id} que ya expiró y me gustaría renovarla con un ingeniero.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold px-6 py-3.5 rounded-full text-sm transition-all"
              >
                <Phone className="w-4 h-4" />
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        ) : (
          /* Active Proposal Screen */
          <ProposalClientWrapper
            leadId={proposal.id}
            formData={proposal.formData}
            sizingResult={proposal.sizingResult}
            expiresAtIso={new Date(proposal.expiresAt).toISOString()}
            daysRemaining={Math.max(
              1,
              Math.ceil(
                (new Date(proposal.expiresAt).getTime() - now.getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            )}
          />
        )}
      </div>

      <Footer />
    </main>
  );
}
