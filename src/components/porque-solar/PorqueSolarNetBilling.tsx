"use client";

import { motion } from "framer-motion";
import { PORQUE_SOLAR_DATA } from "@/lib/constants";
import { Sun, ArrowRight, DollarSign, FileCheck2, Cpu } from "lucide-react";

export function PorqueSolarNetBilling() {
  const { netBilling } = PORQUE_SOLAR_DATA;
  const stepIcons = [Sun, Cpu, DollarSign, FileCheck2];

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[#FF8300] mb-2 block">
          Marco Regulatorio & Ley 21.118
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-fg tracking-tight">
          {netBilling.title}
        </h2>
        <p className="mt-4 text-sm md:text-base text-[#4A4A4A]">
          {netBilling.subtitle}
        </p>
      </div>

      {/* 4 Steps Process Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {netBilling.steps.map((step, idx) => {
          const Icon = stepIcons[idx];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between relative group hover:border-[#FF8300]/40 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-2xl bg-[#FF8300]/10 text-[#FF8300]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-bold text-black/15 group-hover:text-[#FF8300]/30 transition-colors">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-brand-fg mb-3">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-black/5 flex items-center gap-1.5 text-[11px] font-semibold text-[#FF8300]">
                <span>Paso {idx + 1} del Proceso</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Info Callout */}
      <div className="mt-12 p-6 md:p-8 rounded-3xl bg-[#F7F8FA] border border-black/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 flex-shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm md:text-base font-bold text-brand-fg">
              100% Tramitación Incluida ante Distribuidoras
            </h4>
            <p className="text-xs text-[#6B7280]">
              Coordinamos directamente con Saesa, Crell, Frontel, CGE y la SEC para el cambio de medidor bidireccional y la vigencia del contrato Net Billing.
            </p>
          </div>
        </div>
        <a
          href="/cotizacion"
          className="text-xs font-semibold text-[#FF8300] hover:text-[#e07400] whitespace-nowrap bg-white px-5 py-2.5 rounded-full border border-black/10 shadow-xs"
        >
          Consultar por mi sector &rarr;
        </a>
      </div>
    </section>
  );
}
