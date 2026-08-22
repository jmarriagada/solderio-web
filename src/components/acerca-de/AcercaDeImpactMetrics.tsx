"use client";

import { motion } from "framer-motion";
import { Award, ShieldCheck, Leaf, FileCheck2 } from "lucide-react";

export function AcercaDeImpactMetrics() {
  const metrics = [
    {
      icon: Award,
      value: "30+",
      unit: "años",
      label: "Experiencia Acumulada",
      description: "De trayectoria de nuestros socios fundadores en ingeniería eléctrica y potencia en Chile.",
    },
    {
      icon: ShieldCheck,
      value: "25",
      unit: "años",
      label: "Garantía de Generación",
      description: "Rendimiento asegurado al 84.8%+ respaldado directamente por fabricantes globales Tier 1.",
    },
    {
      icon: Leaf,
      value: "4.2",
      unit: "toneladas",
      label: "CO₂ Evitado al Año",
      description: "Por cada planta solar residencial promedio instalada en el sur de Chile.",
    },
    {
      icon: FileCheck2,
      value: "100%",
      unit: "legal",
      label: "Conformidad SEC",
      description: "Declaraciones TE-1, TE-4 y TE-6 formalmente aprobadas ante la autoridad regulatoria.",
    },
  ];

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="bg-[#F7F8FA] rounded-3xl md:rounded-[36px] p-8 md:p-14 border border-black/5">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[#FF8300] mb-2 block">
            Impacto & Confianza
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-fg tracking-tight">
            Nuestros Números Hablan de Compromiso
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m, index) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 border border-black/5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="p-2.5 rounded-2xl bg-[#FF8300]/10 text-[#FF8300] w-fit mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-3xl md:text-4xl font-bold text-brand-fg">
                      {m.value}
                    </span>
                    <span className="text-xs font-semibold text-[#FF8300] uppercase tracking-wider">
                      {m.unit}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-brand-fg mb-2">
                    {m.label}
                  </h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
