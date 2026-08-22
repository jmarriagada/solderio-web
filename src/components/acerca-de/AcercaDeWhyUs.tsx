"use client";

import { motion } from "framer-motion";
import { ACERCA_DE_DATA } from "@/lib/constants";
import { Check, X, ShieldAlert, ShieldCheck } from "lucide-react";

export function AcercaDeWhyUs() {
  const { whyUsComparison } = ACERCA_DE_DATA;

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[#FF8300] mb-2 block">
          Diferenciación & Valor Real
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-fg tracking-tight">
          SoldeRío vs Instaladores Tradicionales
        </h2>
        <p className="mt-4 text-sm md:text-base text-[#4A4A4A]">
          La energía solar es una inversión a 25 años. Conoce por qué nuestro estándar de ingeniería y software marca la diferencia.
        </p>
      </div>

      {/* Comparison Matrix Table / Cards */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-black/10 shadow-[0_15px_40px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-6 border-b border-black/10 text-xs md:text-sm font-bold items-center">
          <div className="md:col-span-4 text-[#6B7280] uppercase tracking-wider">
            Criterio de Ingeniería
          </div>
          <div className="md:col-span-4 flex items-center gap-2 text-brand-fg bg-[#F7F8FA] p-3 rounded-2xl md:bg-transparent md:p-0">
            <ShieldCheck className="w-5 h-5 text-[#FF8300]" />
            <span className="text-base text-[#FF8300]">Estándar SoldeRío</span>
          </div>
          <div className="md:col-span-4 flex items-center gap-2 text-[#6B7280] bg-black/5 p-3 rounded-2xl md:bg-transparent md:p-0">
            <ShieldAlert className="w-5 h-5 text-gray-400" />
            <span>Instalador Genérico</span>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-black/5">
          {whyUsComparison.map((row, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 items-start hover:bg-[#FAFAF5] transition-colors rounded-2xl px-2"
            >
              {/* Feature Name */}
              <div className="md:col-span-4 font-semibold text-brand-fg text-sm md:text-base flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF8300]" />
                <span>{row.feature}</span>
              </div>

              {/* SoldeRío Benefit */}
              <div className="md:col-span-4 flex items-start gap-2.5 text-xs md:text-sm text-brand-fg bg-emerald-500/[0.04] p-3.5 rounded-2xl border border-emerald-500/10">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{row.solderio}</span>
              </div>

              {/* Traditional Disadvantage */}
              <div className="md:col-span-4 flex items-start gap-2.5 text-xs md:text-sm text-[#6B7280] bg-black/[0.02] p-3.5 rounded-2xl">
                <X className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{row.traditional}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
