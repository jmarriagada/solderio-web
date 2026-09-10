"use client";

import { motion } from "framer-motion";
import { ACERCA_DE_DATA } from "@/lib/constants";
import { Quote } from "lucide-react";

export function AcercaDeFounders() {
  const { founders } = ACERCA_DE_DATA;

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-brand-fg tracking-tight">
          El Equipo Detrás de SoldeRío
        </h2>
        <p className="mt-4 text-sm md:text-base text-[#4A4A4A] font-light leading-relaxed">
          La convergencia única entre más de 30 años de ingeniería eléctrica de potencia y la vanguardia en software y telemetría solar.
        </p>
      </div>

      {/* Founders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {founders.map((founder, index) => (
          <motion.div
            key={founder.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="bg-white rounded-3xl p-8 md:p-10 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex flex-col justify-start group hover:border-[#FF8300]/40 transition-all"
          >
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-brand-fg">{founder.name}</h3>
              <span className="text-xs font-semibold text-[#FF8300] uppercase tracking-wider block mt-1">
                {founder.role}
              </span>
              <span className="text-xs text-[#6B7280] font-light mt-0.5 block">{founder.tagline}</span>
            </div>

            <p className="text-xs md:text-sm text-[#4A4A4A] font-light leading-relaxed">
              {founder.bio}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CEO Quote Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-12 md:mt-16 bg-[#FAFAF8] rounded-3xl p-8 md:p-12 border border-black/10 relative overflow-hidden text-center max-w-4xl mx-auto shadow-[0_4px_25px_rgba(0,0,0,0.03)]"
      >
        <Quote className="w-8 h-8 md:w-10 md:h-10 text-[#FF8300] mx-auto mb-6 opacity-80" />
        <blockquote className="text-base sm:text-lg md:text-xl font-light text-brand-fg leading-relaxed tracking-tight mb-6">
          “Unimos la precisión de la ingeniería eléctrica de potencia con la agilidad y transparencia del software moderno. No dependemos de fórmulas teóricas ajenas: diseñamos, modelamos escenarios, construímos, instalamos y monitoreamos plantas solares con tecnología de vanguardia y respaldo humano de excelencia.”
        </blockquote>
        <div className="flex items-center justify-center gap-2 text-xs md:text-sm">
          <span className="text-brand-fg font-normal">Jorge Arriagada</span>
          <span className="text-black/30 font-light">•</span>
          <span className="text-[#FF8300] font-light">Co-Fundador & CEO · SoldeRío</span>
        </div>
      </motion.div>
    </section>
  );
}
