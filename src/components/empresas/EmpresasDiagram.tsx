"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Info, X, Zap, Sun, Battery, Cpu, ShieldCheck, Activity } from "lucide-react";

interface HotspotData {
  id: string;
  badgeTitle: string;
  badgeType: "primary" | "secondary";
  topPosition: string;
  leftPosition: string;
  title: string;
  category: string;
  icon: any;
  description: string;
  spec: string;
  hasTag?: string;
  hasDot?: boolean;
}

const HOTSPOTS: HotspotData[] = [
  {
    id: "solar",
    badgeTitle: "Generación Solar",
    badgeType: "primary",
    topPosition: "top-[22%] md:top-[26%]",
    leftPosition: "left-[14%] md:left-[28%]",
    title: "Generación Solar FV",
    category: "Captación Limpia",
    icon: Sun,
    description:
      "Arreglo de módulos fotovoltaicos N-Type TOPCon de alta eficiencia instalados en techos comerciales e industriales. Capturan radiación directa y difusa propia del sur de Chile.",
    spec: "Módulos N-Type TOPCon 580W • Eficiencia >22.5%",
  },
  {
    id: "optimizer",
    badgeTitle: "Optimizador de Panel",
    badgeType: "secondary",
    topPosition: "top-[32%] md:top-[30%]",
    leftPosition: "left-[45%] md:left-[58%]",
    title: "Optimizador de Panel",
    category: "Rendimiento a Nivel Módulo",
    icon: Cpu,
    description:
      "Dispositivos de electrónica de potencia (MPPT individual) que liberan el máximo potencial de cada panel independientemente, eliminando pérdidas por sombras parciales o inclinaciones complejas.",
    spec: "Monitoreo en tiempo real por módulo • Apagado rápido de seguridad",
    hasDot: true,
  },
  {
    id: "electrical_room",
    badgeTitle: "Sala Eléctrica",
    badgeType: "secondary",
    topPosition: "top-[48%] md:top-[48%]",
    leftPosition: "left-[8%] md:left-[14%]",
    title: "Sala Eléctrica Normalizada",
    category: "Control & Protecciones",
    icon: ShieldCheck,
    description:
      "Tableros de potencia, protecciones AC/DC y conmutación automática construidos bajo pliegos técnicos RIC N°01 a N°19 de la SEC para resguardar la infraestructura.",
    spec: "Protecciones AFCI + SPD • Pliegos RIC SEC Clase A",
  },
  {
    id: "ess",
    badgeTitle: "Energy Storage System - ESS",
    badgeType: "secondary",
    topPosition: "top-[62%] md:top-[58%]",
    leftPosition: "left-[14%] md:left-[24%]",
    title: "Energy Storage System (ESS)",
    category: "Almacenamiento BESS",
    icon: Battery,
    description:
      "Banco de baterías industriales LiFePO4 de alta densidad. Permite almacenar excedentes solares para abastecer picos de consumo nocturnos o respaldar ante cortes de la red pública.",
    spec: "Química LiFePO4 • +6.000 ciclos • Autonomía industrial",
  },
  {
    id: "ev_chargers",
    badgeTitle: "Cargadores Rápidos",
    badgeType: "secondary",
    topPosition: "top-[74%] md:top-[68%]",
    leftPosition: "left-[38%] md:left-[48%]",
    title: "Cargadores Rápidos para Flotas EV",
    category: "Electromovilidad Empresarial",
    icon: Zap,
    description:
      "Estaciones de carga electromóvil alimentadas directamente por la generación solar, optimizando la recarga de vehículos corporativos y logística empresarial.",
    spec: "Carga Inteligente AC/DC • Protocolo OCPI / ISO 15118",
    hasTag: "EV",
  },
  {
    id: "grid",
    badgeTitle: "Red",
    badgeType: "secondary",
    topPosition: "top-[82%] md:top-[78%]",
    leftPosition: "left-[70%] md:left-[78%]",
    title: "Interconexión a Red Pública",
    category: "Net Billing Ley 21.118",
    icon: Activity,
    description:
      "Enlace bidireccional certificado ante distribuidoras (Saesa, Crell, CGE) que inyecta excedentes valorizados y suministra respaldo complementario cuando la demanda lo requiere.",
    spec: "Inyección Net Billing • Trámite SEC TE-4 • Medición Bidireccional",
    hasDot: true,
  },
];

export function EmpresasDiagram() {
  const [activeModal, setActiveModal] = useState<HotspotData | null>(null);

  return (
    <section className="w-full py-16 md:py-24 px-3 md:px-5 box-border bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Solar, baterías y la red sincronizadas, minimizando el costo eléctrico.
          </h2>
        </motion.div>

        {/* Diagram Area - Spans full width matching Hero global margins */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[16/9] md:aspect-[21/9] min-h-[380px] md:min-h-[520px] rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#F7F8FA] border border-black/10 shadow-xl"
        >
          {/* Base Isometric Diagram Image */}
          <Image
            src="/images/planta-solar-empresas-solderio.jpeg"
            alt="Diagrama Planta Solar Comercial e Industrial SoldeRío"
            fill
            priority
            className="object-cover opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

          {/* Interactive Infobutton Hotspots */}
          {HOTSPOTS.map((hotspot) => {
            const isPrimary = hotspot.badgeType === "primary";

            return (
              <div
                key={hotspot.id}
                className={`absolute ${hotspot.topPosition} ${hotspot.leftPosition} z-20`}
              >
                <motion.button
                  onClick={() => setActiveModal(hotspot)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-xl transition-all duration-300 cursor-pointer select-none ${
                    isPrimary
                      ? "bg-[#FF8300] text-white hover:bg-[#e07300] shadow-[0_4px_20px_rgba(255,131,0,0.4)]"
                      : "bg-white/95 backdrop-blur-md text-[#1F1F1F] hover:bg-white border border-black/10 hover:border-[#FF8300]/40 shadow-lg"
                  }`}
                >
                  {hotspot.hasDot && (
                    <span className="w-2 h-2 rounded-full bg-[#FF8300] shadow-[0_0_8px_#FF8300]" />
                  )}

                  <span className="text-xs sm:text-sm font-medium tracking-tight whitespace-nowrap">
                    {hotspot.badgeTitle}
                  </span>

                  {hotspot.hasTag && (
                    <span className="text-[10px] bg-black/5 text-[#6B7280] px-1.5 py-0.5 rounded-full uppercase font-mono">
                      {hotspot.hasTag}
                    </span>
                  )}

                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12 ${
                    isPrimary ? "bg-white/20 text-white" : "bg-black/5 text-[#6B7280] group-hover:text-[#FF8300]"
                  }`}>
                    <Info className="w-3 h-3" />
                  </div>
                </motion.button>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Informative Modal Dialog on Hotspot Click */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-[#1F1F1F] text-white p-6 sm:p-8 rounded-[28px] border border-white/15 shadow-2xl overflow-hidden"
            >
              {/* Subtle Ambient Orange Radial Glow */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#FF8300]/20 rounded-full blur-3xl pointer-events-none" />

              {/* Modal Top Bar */}
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF8300]/15 border border-[#FF8300]/30 flex items-center justify-center text-[#FF8300]">
                    <activeModal.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF8300]">
                      {activeModal.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-light text-white leading-tight">
                      {activeModal.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                  title="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Description Body */}
              <p className="text-white/80 text-sm sm:text-base leading-relaxed font-light mb-6 relative z-10">
                {activeModal.description}
              </p>

              {/* Spec Badge Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
                <span className="text-xs text-white/60 font-mono">
                  {activeModal.spec}
                </span>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-xs text-[#FF8300] font-medium hover:underline cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
