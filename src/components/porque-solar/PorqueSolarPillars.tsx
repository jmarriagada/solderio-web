"use client";

import { motion } from "framer-motion";
import { PORQUE_SOLAR_DATA } from "@/lib/constants";
import { TrendingDown, Zap, Home } from "lucide-react";

export function PorqueSolarPillars() {
  const { pillars } = PORQUE_SOLAR_DATA;
  const icons = [TrendingDown, Zap, Home];

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-brand-fg tracking-tight">
          Tres Razones Inmediatas para Cambiarte a Solar
        </h2>
        <p className="mt-4 text-sm md:text-base text-[#4A4A4A] font-light leading-relaxed">
          La energía solar fotovoltaica ya no es una tecnología del futuro: es la decisión financiera y de seguridad energética más inteligente que puedes tomar hoy.
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pillars.map((pillar, idx) => {
          const Icon = icons[idx];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="bg-white rounded-3xl p-8 md:p-10 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex flex-col justify-start group hover:border-[#FF8300]/40 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <Icon className="w-8 h-8 text-[#FF8300] transition-transform duration-300 group-hover:scale-105" />
                <span className="text-xs uppercase tracking-wider text-[#FF8300] font-light">
                  {pillar.tag}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-light text-brand-fg mb-3 leading-snug">
                {pillar.title}
              </h3>
              <p className="text-xs md:text-sm text-[#4A4A4A] font-light leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
