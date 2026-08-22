"use client";

import { motion } from "framer-motion";
import { PORQUE_SOLAR_DATA } from "@/lib/constants";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";

export function PorqueSolarMythsVsFacts() {
  const { mythsVsFacts } = PORQUE_SOLAR_DATA;

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[#FF8300] mb-2 block">
          Claridad & Transparencia
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-fg tracking-tight">
          Mitos vs Realidades de la Energía Solar en el Sur
        </h2>
        <p className="mt-4 text-sm md:text-base text-[#4A4A4A]">
          Separamos las dudas comunes de los hechos técnicos comprobados por nuestros ingenieros en terreno.
        </p>
      </div>

      {/* Myths Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mythsVsFacts.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-white rounded-3xl p-8 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#FF8300]/40 transition-all duration-300"
          >
            <div>
              {/* Myth */}
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/[0.05] border border-rose-500/10 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block mb-1">
                    Mito Común
                  </span>
                  <p className="text-xs md:text-sm font-semibold text-brand-fg italic">
                    {item.myth}
                  </p>
                </div>
              </div>

              {/* Fact */}
              <div className="p-4 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/10 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                    La Realidad Técnica
                  </span>
                  <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed">
                    {item.fact}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
