import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { FloatingNav } from "@/components/FloatingNav";
import { HeroHeaderNav } from "@/components/HeroHeaderNav";
import { Footer } from "@/components/Footer";
import { ProposalClientWrapper } from "./ProposalClientWrapper";
import { decodeProposalToken } from "@/lib/proposal-token";
import { Clock, Phone, RotateCcw } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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

export default async function PropuestaPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sParams = await searchParams;
  const token =
    typeof sParams.t === "string"
      ? sParams.t
      : typeof sParams.token === "string"
      ? sParams.token
      : null;

  const now = new Date();
  let proposalData: {
    id: string;
    formData: any;
    sizingResult: any;
    createdAt: Date;
    expiresAt: Date;
  } | null = null;

  // 1. Limpieza oportuna y búsqueda en base de datos PostgreSQL
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.publicProposal.deleteMany({
      where: {
        expiresAt: { lt: now },
      },
    }).catch(() => {});

    const dbProposal = await prisma.publicProposal.findUnique({
      where: { id },
    });

    if (dbProposal) {
      proposalData = {
        id: dbProposal.id,
        formData: dbProposal.formData,
        sizingResult: dbProposal.sizingResult,
        createdAt: new Date(dbProposal.createdAt),
        expiresAt: new Date(dbProposal.expiresAt),
      };
    }
  } catch (err) {
    console.warn("[Propuesta] Base de datos no disponible o sin conexión:", err);
  }

  // 2. Si no se encontró en la BD (o no configurada en Vercel), decodificar el token resiliente URL
  if (!proposalData && token) {
    const decoded = decodeProposalToken(token);
    if (decoded && decoded.id === id) {
      proposalData = {
        id: decoded.id,
        formData: decoded.formData,
        sizingResult: decoded.sizingResult,
        createdAt: new Date(decoded.createdAt),
        expiresAt: new Date(decoded.expiresAt),
      };

      // Si la BD está disponible, respaldar para futuras consultas
      try {
        const { prisma } = await import("@/lib/prisma");
        prisma.publicProposal
          .upsert({
            where: { id: decoded.id },
            create: {
              id: decoded.id,
              clientName: decoded.formData.fullName,
              clientEmail: decoded.formData.email,
              clientPhone: decoded.formData.whatsapp,
              comuna: decoded.formData.comuna,
              formData: decoded.formData as any,
              sizingResult: decoded.sizingResult as any,
              createdAt: new Date(decoded.createdAt),
              expiresAt: new Date(decoded.expiresAt),
            },
            update: {},
          })
          .catch(() => {});
      } catch {}
    }
  }

  // 3. Verificación estricta de expiración (15 días)
  const isExpired = !proposalData || proposalData.expiresAt.getTime() < now.getTime();

  // Si está expirada, si aún existe en la base de datos la eliminamos
  if (proposalData && isExpired) {
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.publicProposal.delete({ where: { id } }).catch(() => {});
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
              Nuestras propuestas solares fotovoltaicas tienen una{" "}
              <strong>validez de 15 días corridos</strong> desde su fecha de emisión. Debido a las variaciones periódicas de costos de equipamiento fotovoltaico e indexación de tarifas eléctricas en el sur de Chile, es necesario realizar una nueva estimación actualizada.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/cotizacion"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF8300] hover:bg-[#FF8300]/90 text-white font-bold px-7 py-3.5 rounded-full text-sm shadow-lg shadow-[#FF8300]/25 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Generar Nueva Cotización
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
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        ) : (
          /* Active Proposal Screen */
          <ProposalClientWrapper
            leadId={proposalData.id}
            formData={proposalData.formData}
            sizingResult={proposalData.sizingResult}
            expiresAtIso={proposalData.expiresAt.toISOString()}
            daysRemaining={Math.max(
              1,
              Math.ceil(
                (proposalData.expiresAt.getTime() - now.getTime()) /
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
