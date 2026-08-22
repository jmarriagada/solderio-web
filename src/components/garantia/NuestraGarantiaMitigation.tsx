"use client";

import { motion } from "framer-motion";
import { NUESTRA_GARANTIA_DATA } from "@/lib/constants";
import { AlertTriangle, ShieldCheck, FileCheck, Layers, Award, LifeBuoy } from "lucide-react";

export function NuestraGarantiaMitigation() {
  const { mitigation } = NUESTRA_GARANTIA_DATA;
  const icons = [FileCheck, Award, Layers, LifeBuoy];

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="bg-[#F7F8FA] rounded-3xl md:rounded-[36px] p-8 md:p-14 border border-black/5">
        {/* Header with Warning Callout */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Riesgo Crítico del Mercado Solar Chileno</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-fg tracking-tight mb-4">
            {mitigation.title}
          </h2>
          <p className="text-sm md:text-base text-[#4A4A4A] leading-relaxed">
            {mitigation.subtitle}
          </p>
        </div>

        {/* 4 Mitigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {mitigation.points.map((point, idx) => {
            const Icon = icons[idx];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-6 md:p-8 border border-black/5 shadow-xs flex items-start gap-4 hover:border-[#FF8300]/30 transition-all"
              >
                <div className="p-3 rounded-2xl bg-[#FF8300]/10 text-[#FF8300] flex-shrink-0 mt-1">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-brand-fg mb-2">
                    {point.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#6B7280] leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Assurance Banner */}
        <div className="bg-white rounded-2xl p-6 border border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <span className="text-xs md:text-sm text-brand-fg font-medium">
              ¿Tu instalador anterior desapareció? Auditamos y rescatamos plantas solares de terceros en Los Ríos, Los Lagos y La Araucanía.
            </span>
          </div>
          <a
            href="https://wa.me/56987654321?text=Hola,%20tengo%20una%20planta%20solar%20instalada%20por%20otra%20empresa%20y%20necesito%20mantenimiento"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#FF8300] hover:text-[#e07400] whitespace-nowrap px-4 py-2 rounded-full bg-[#FF8300]/10 hover:bg-[#FF8300]/20 transition-all flex-shrink-0"
          >
            Solicitar Auditoría de Rescate &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
