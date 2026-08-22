"use client";

import { motion } from "framer-motion";
import { NUESTRA_GARANTIA_DATA } from "@/lib/constants";
import { ShieldCheck, Home, PackageCheck, Umbrella } from "lucide-react";

export function NuestraGarantiaPillars() {
  const { protectionLevels } = NUESTRA_GARANTIA_DATA;
  const icons = [ShieldCheck, Home, PackageCheck, Umbrella];

  return (
    <section id="coberturas" className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[#FF8300] mb-2 block">
          Protección en Cuatro Capas
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-fg tracking-tight">
          La Garantía Total de SoldeRío
        </h2>
        <p className="mt-4 text-sm md:text-base text-[#4A4A4A]">
          Diseñamos una arquitectura de aseguramiento integral que cubre desde la física del silicio hasta la mano de obra y eventualidades climáticas en el sur de Chile.
        </p>
      </div>

      {/* 4 Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {protectionLevels.map((lvl, idx) => {
          const Icon = icons[idx];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-8 md:p-10 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between group hover:border-[#FF8300]/40 transition-all duration-300 relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3.5 rounded-2xl bg-[#FF8300]/10 text-[#FF8300] group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-[#FF8300] bg-[#FF8300]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    {lvl.badge}
                  </span>
                </div>

                <span className="text-[11px] font-semibold text-black/40 uppercase tracking-widest block mb-1">
                  {lvl.level}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-brand-fg mb-1">
                  {lvl.title}
                </h3>
                <span className="text-xs font-medium text-[#FF8300] block mb-4">
                  {lvl.subtitle}
                </span>

                <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed">
                  {lvl.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-black/5 flex items-center justify-between text-xs font-semibold text-brand-fg">
                <span className="text-emerald-600 font-medium">✓ Cobertura Certificada</span>
                <span className="text-[#6B7280]">Estándar SEC Clase A</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
