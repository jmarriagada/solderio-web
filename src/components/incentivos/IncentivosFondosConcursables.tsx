"use client";

import { motion } from "framer-motion";
import { Award, Droplets, Landmark, Sparkles, ArrowRight, ExternalLink } from "lucide-react";
import { useVisitaModal } from "@/context/VisitaModalContext";

export function IncentivosFondosConcursables() {
  const { openModal } = useVisitaModal();

  const funds = [
    {
      icon: Award,
      title: "Ponle Energía a tu Pyme / Mi PyME Energía",
      entity: "Ministerio de Energía & AgenciaSE",
      desc: "Fondos concursables no reembolsables dirigidos a micro, pequeñas y medianas empresas para cofinanciar proyectos de eficiencia energética y sistemas fotovoltaicos de autoconsumo hasta en un 50% a 70% del costo total del proyecto.",
      eligibility: "Pymes con iniciación de actividades y ventas < 100.000 UF.",
    },
    {
      icon: Droplets,
      title: "Ley de Fomento al Riego N° 18.450",
      entity: "Comisión Nacional de Riego (CNR)",
      desc: "Bonificaciones estatales de hasta un 70% a 90% del costo de proyectos de electrificación solar fotovoltaica para bombas de riego, acumulación de agua y tecnificación agrícola en predios de la Macrozona Sur.",
      eligibility: "Agricultores, cooperativas y predios agrícolas inscritos en CNR/INDAP.",
    },
    {
      icon: Landmark,
      title: "Líneas de Crédito Verde & Corfo I+D",
      entity: "Corfo & Banca Comercial (BancoEstado, BCI, Santander)",
      desc: "Líneas de financiamiento verde con tasas de interés preferenciales y garantías estatales (FOGAPE Verde) amortizables directamente con los ahorros generados en la boleta de electricidad.",
      eligibility: "Personas naturales con giro comercial y empresas.",
    },
  ];

  return (
    <section className="bg-transparent py-20 md:py-32 relative overflow-hidden">
      <div className="w-full px-3 md:px-5 box-border">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-xs md:text-sm font-light uppercase tracking-widest text-[#FF8300] mb-3 md:mb-4 block">
              Fondos del Estado & Financiamiento
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight mb-6">
              Subsidios & Concursos Públicos
            </h2>
            <p className="text-brand-muted text-base md:text-lg font-light leading-relaxed">
              En SoldeRío asesoramos y preparamos la ingeniería eléctrica y memoria técnica necesaria para postular a los fondos públicos y subsidios disponibles en Chile.
            </p>
          </motion.div>

          {/* Funds Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {funds.map((fund, fIdx) => {
              const Icon = fund.icon;
              return (
                <div
                  key={fIdx}
                  className="p-8 rounded-[24px] bg-[#F7F8FA] border border-black/5 flex flex-col justify-between hover:shadow-xl hover:border-[#FF8300]/30 transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#FF8300]/10 text-[#FF8300] flex items-center justify-center transition-transform group-hover:scale-110">
                        <Icon className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <span className="text-[10px] font-mono text-[#6B7280] bg-white px-2.5 py-1 rounded-full border border-black/5">
                        {fund.entity}
                      </span>
                    </div>

                    <h3 className="text-xl font-normal text-[#1F1F1F] mb-3">
                      {fund.title}
                    </h3>

                    <p className="text-sm text-[#6B7280] font-light leading-relaxed mb-6">
                      {fund.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-black/5 text-xs text-[#1F1F1F]/80 font-light">
                    <strong className="font-semibold text-[#1F1F1F]">Requisito:</strong> {fund.eligibility}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner Help Box */}
          <div className="p-8 md:p-10 rounded-[24px] bg-white border border-black/5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-lg font-normal text-[#1F1F1F]">
                  ¿Quieres postular tu proyecto solar a un fondo del Estado?
                </h4>
                <p className="text-sm text-[#6B7280] font-light">
                  Nuestros ingenieros SEC Clase A elaboran la memoria técnica, dimensionamiento y presupuestos exigidos en las bases.
                </p>
              </div>
            </div>

            <button
              onClick={() => openModal()}
              className="px-8 py-3.5 rounded-full bg-[#FF8300] text-white font-light text-xs md:text-sm hover:bg-[#e07400] transition-all duration-300 shadow-lg cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <span>Consultar Asesoría</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
