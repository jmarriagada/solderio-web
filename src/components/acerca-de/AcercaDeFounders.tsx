"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ACERCA_DE_DATA } from "@/lib/constants";
import { Award, Zap, Code, ShieldCheck } from "lucide-react";

export function AcercaDeFounders() {
  const { founders } = ACERCA_DE_DATA;

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[#FF8300] mb-2 block">
          Liderazgo & Experiencia
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-fg tracking-tight">
          El Equipo Detrás de SoldeRío
        </h2>
        <p className="mt-4 text-sm md:text-base text-[#4A4A4A]">
          La convergencia única entre más de 30 años de ingeniería eléctrica de potencia y la vanguardia en software y telemetría solar.
        </p>
      </div>

      {/* Founders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {founders.map((founder, index) => (
          <motion.div
            key={founder.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="bg-white rounded-3xl p-8 md:p-10 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex flex-col justify-between group hover:border-[#FF8300]/40 transition-all"
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#FF8300]/10 text-[#FF8300] flex items-center justify-center flex-shrink-0">
                  {index === 0 ? <Code className="w-8 h-8" /> : <Award className="w-8 h-8" />}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-brand-fg">{founder.name}</h3>
                  <span className="text-xs font-semibold text-[#FF8300] uppercase tracking-wider block">
                    {founder.role}
                  </span>
                  <span className="text-xs text-[#6B7280] font-light">{founder.tagline}</span>
                </div>
              </div>

              <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed mb-6">
                {founder.bio}
              </p>
            </div>

            <div className="pt-6 border-t border-black/5 flex items-center justify-between text-xs text-[#6B7280]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{index === 0 ? "Ex-CMO/CCO SUNAI (7 países)" : "Certificación SEC Clase A"}</span>
              </div>
              <span className="font-semibold text-brand-fg">SoldeRío</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Synergies Banner */}
      <div className="bg-[#1F1F1F] text-white rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl relative z-10">
          <span className="text-xs uppercase tracking-widest text-[#FF8300] font-semibold block mb-2">
            La Fórmula SoldeRío
          </span>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            Ingeniería de terreno + Software en tiempo real
          </h3>
          <p className="text-xs md:text-sm text-white/70 leading-relaxed">
            Unimos la precisión de la ingeniería eléctrica de potencia con la agilidad y transparencia del software moderno. No dependemos de fórmulas teóricas ajenas: diseñamos, montamos y monitoreamos tu planta con tecnología propia y respaldo humano de excelencia.
          </p>
        </div>

        <div className="flex items-center gap-6 relative z-10 flex-shrink-0">
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-2xl md:text-3xl font-bold text-[#FF8300]">30+</span>
            <span className="text-[10px] text-white/60 uppercase tracking-wider mt-0.5">Años de Trayectoria</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-2xl md:text-3xl font-bold text-emerald-400">24/7</span>
            <span className="text-[10px] text-white/60 uppercase tracking-wider mt-0.5">Monitoreo IoT</span>
          </div>
        </div>
      </div>
    </section>
  );
}
