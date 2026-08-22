"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Zap, Sun, Battery, Car, Home, Radio, Cpu } from "lucide-react";

export function HogarSmartEnergy() {
  const nodes = [
    { label: "PLANTA SOLAR", icon: Sun, top: "18%", left: "62%" },
    { label: "CASA", icon: Home, top: "45%", left: "30%" },
    { label: "SMART CONTROL", icon: Cpu, top: "52%", left: "46%" },
    { label: "INVERSOR HÍBRIDO", icon: Zap, top: "48%", left: "75%" },
    { label: "CARGA EV", icon: Car, top: "72%", left: "48%" },
    { label: "BATERÍAS (ESS)", icon: Battery, top: "74%", left: "68%" },
    { label: "RED ELÉCTRICA", icon: Radio, top: "58%", left: "88%" },
  ];

  return (
    <section className="bg-transparent py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF8300]/10 border border-[#FF8300]/30 text-[#FF8300] text-xs font-medium uppercase tracking-wider mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF8300] animate-ping" />
            <span>Arquitectura Inteligente</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-light text-brand-fg tracking-tight mb-4">
            Energía inteligente
          </h2>
          <p className="text-brand-muted text-base md:text-lg font-light leading-relaxed">
            A medida que el clima nublado se vuelve más frecuente y la red eléctrica menos confiable, puedes asegurar tu suministro eléctrico con una planta solar híbrida.
          </p>
        </motion.div>

        {/* Grand 3D House Visual with Interactive Connected Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl border border-black/10 bg-[#1F1F1F]"
        >
          {/* Main Visual Image */}
          <div className="relative w-full aspect-[16/9] min-h-[440px] md:min-h-[580px]">
            <Image
              src="/images/solderio-planta-solar-residencial-valdivia.png"
              alt="Diagrama 3D de Casa Solar Híbrida SoldeRío"
              fill
              className="object-cover object-center opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 pointer-events-none" />

            {/* Interactive Connected Circuit Nodes */}
            <div className="absolute inset-0 z-10 hidden sm:block pointer-events-none">
              {nodes.map((node, i) => {
                const Icon = node.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 * i + 0.3, type: "spring", stiffness: 300 }}
                    style={{ top: node.top, left: node.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-[#1F1F1F]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#FF8300]/60 shadow-[0_0_20px_rgba(255,131,0,0.35)]"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#FF8300] animate-ping" />
                    <Icon className="w-3.5 h-3.5 text-[#FF8300]" />
                    <span className="text-[10px] md:text-xs font-mono font-semibold text-white tracking-wider">
                      {node.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Bottom Caption Box */}
          <div className="relative z-20 bg-[#1F1F1F]/95 backdrop-blur-xl border-t border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF8300]" />
                <h3 className="text-xl md:text-2xl font-normal text-white">
                  Planta Solar Híbrida
                </h3>
              </div>
              <p className="text-white/80 text-sm md:text-base font-light max-w-2xl leading-relaxed">
                Genera, consume, almacena e inyecta energía a la red de forma sincronizada.
              </p>
            </div>

            <div className="text-left md:text-right border-l md:border-l-0 md:border-r border-white/20 pl-4 md:pl-0 md:pr-6">
              <p className="text-xs text-white/60 font-light max-w-xs leading-relaxed">
                Diseñadas para ampliar su capacidad solar, de almacenamiento e incluir cargador EV.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
