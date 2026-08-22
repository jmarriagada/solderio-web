"use client";

import { motion } from "framer-motion";
import { NUESTRA_GARANTIA_DATA } from "@/lib/constants";
import { Radio, BarChart3, BellRing, Wrench } from "lucide-react";

export function NuestraGarantiaMonitoring() {
  const { monitoringSteps } = NUESTRA_GARANTIA_DATA;
  const icons = [Radio, BarChart3, BellRing, Wrench];

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[#FF8300] mb-2 block">
          Supervisión Inteligente 24/7
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-fg tracking-tight">
          Cómo Cuidamos Tu Planta Solar
        </h2>
        <p className="mt-4 text-sm md:text-base text-[#4A4A4A]">
          Nuestro equipo de ingeniería monitorea constantemente la producción para identificar mermas de generación antes de que se reflejen en tu boleta.
        </p>
      </div>

      {/* 4 Steps Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {monitoringSteps.map((step, idx) => {
          const Icon = icons[idx];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between group hover:border-[#FF8300]/40 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-2xl bg-[#FF8300]/10 text-[#FF8300]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-bold text-black/15 group-hover:text-[#FF8300]/30 transition-colors">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-brand-fg mb-3">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-black/5 flex items-center gap-1.5 text-[11px] font-semibold text-[#FF8300]">
                <span>Fase {idx + 1} de Monitoreo</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
