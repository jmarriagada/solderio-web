"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Info,
  X,
  Zap,
  Sun,
  Battery,
  Cpu,
  ShieldCheck,
  Activity,
  CheckCircle2,
} from "lucide-react";

interface HotspotData {
  id: string;
  badgeTitle: string;
  topPosition: string;
  leftPosition: string;
  title: string;
  category: string;
  icon: any;
  description: string;
  specs: string[];
  secNorm: string;
}

const HOTSPOTS: HotspotData[] = [
  {
    id: "solar",
    badgeTitle: "Generación Solar",
    topPosition: "top-[15%] md:top-[18%]",
    leftPosition: "left-[30%] md:left-[38%]",
    title: "Generación Solar Fotovoltaica",
    category: "Captación Limpia",
    icon: Sun,
    description:
      "Arreglo de módulos fotovoltaicos de alta eficiencia instalados en cubiertas industriales. Diseñados para maximizar la captación tanto en radiación directa como difusa en el clima del sur de Chile.",
    specs: [
      "Módulos N-Type TOPCon 580W+",
      "Eficiencia de celda >22.5%",
      "Bifacialidad con ganancia difusa +15%",
    ],
    secNorm: "",
  },
  {
    id: "optimizer",
    badgeTitle: "Optimizador de Panel",
    topPosition: "top-[26%] md:top-[28%]",
    leftPosition: "left-[52%] md:left-[58%]",
    title: "Optimizador de Potencia a Nivel Módulo",
    category: "Rendimiento Individual",
    icon: Cpu,
    description:
      "Dispositivos de electrónica de potencia (MPPT individual) que liberan el máximo potencial de cada panel independientemente, eliminando pérdidas por sombras parciales, inclinaciones o suciedad.",
    specs: [
      "MPPT individual por módulo",
      "Apagado rápido de seguridad (Rapid Shutdown)",
      "Telemetría celda a celda 24/7",
    ],
    secNorm: "RIC N°09 & Protocolos de Seguridad AFCI",
  },
  {
    id: "grid",
    badgeTitle: "Red",
    topPosition: "top-[18%] md:top-[20%]",
    leftPosition: "left-[10%] md:left-[15%]",
    title: "Interconexión y Empalme a Red Pública",
    category: "Net Billing Ley 21.118",
    icon: Activity,
    description: "",
    specs: [
      "Inyección bajo Ley Net Billing 21.118",
      "Medición Inteligente Bidireccional",
      "Trámite oficial SEC TE-4",
    ],
    secNorm: "Pliego Técnico RIC N°15 & NTSyCS (Coordinador Eléctrico)",
  },
  {
    id: "electrical_room",
    badgeTitle: "Sala Eléctrica",
    topPosition: "top-[36%] md:top-[38%]",
    leftPosition: "left-[25%] md:left-[30%]",
    title: "Sala Eléctrica & Tableros de Potencia",
    category: "Control & Protecciones",
    icon: ShieldCheck,
    description:
      "Centro de control normalizado con tableros de transferencia, protecciones diferenciales tipo A, supresores de sobretensiones transitorias (SPD) y desconexión rápida contra fallas de arco.",
    specs: [
      "Inversores industriales string / central",
      "Protección AFCI integrada con IA",
      "Monitoreo SCADA y telemetría industrial",
    ],
    secNorm: "",
  },
  {
    id: "ess",
    badgeTitle: "Energy Storage System - ESS",
    topPosition: "top-[58%] md:top-[60%]",
    leftPosition: "left-[24%] md:left-[30%]",
    title: "Smart String ESS C&I",
    category: "Almacenamiento & Grid-Forming",
    icon: Battery,
    description:
      "Sistema de almacenamiento C&I con arquitectura de refrigeración híbrida (líquida + aire) y seguridad dual C2C (Cell-to-Consumption). Almacena excedentes solares para descarga en horas punta (Peak Shaving), elimina desbalances de celda e integra capacidad Grid-Forming para respaldo ininterrumpido.",
    specs: [],
    secNorm: "",
  },
  {
    id: "ev_chargers",
    badgeTitle: "Cargadores Rápidos",
    topPosition: "top-[72%] md:top-[70%]",
    leftPosition: "left-[45%] md:left-[50%]",
    title: "Infraestructura de Carga Rápida EV",
    category: "Electromovilidad Corporativa",
    icon: Zap,
    description:
      "Estaciones de carga rápida y semirápida inteligentes alimentadas directamente con energía solar, optimizando la recarga de flotas comerciales, camionetas operativas y vehículos corporativos.",
    specs: [],
    secNorm: "",
  },
];

function SolarPanelItem({
  hasShade = false,
  percentage,
  isOptimized = false,
}: {
  hasShade?: boolean;
  percentage: string;
  isOptimized?: boolean;
}) {
  const isHundred = percentage === "100%";
  return (
    <div className="flex flex-col items-center flex-1">
      {/* Solar Panel Box */}
      <div className="relative w-full aspect-[9/16] max-w-[48px] bg-gradient-to-b from-[#1c2438] to-[#0d1322] rounded-[4px] border border-white/25 overflow-hidden shadow-inner p-[1px] flex flex-col justify-between">
        {/* PV Grid Lines */}
        <div className="w-full h-full grid grid-cols-2 grid-rows-5 gap-[1px] opacity-75">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="border border-white/10 bg-[#162032]/80" />
          ))}
        </div>

        {/* Leaves / Shade Overlay for Panel 1 */}
        {hasShade && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Subtle shadow tint */}
            <div className="absolute inset-0 bg-black/45" />
            {/* Foliage / Leaves Vector */}
            <svg
              viewBox="0 0 48 64"
              className="absolute -top-1 -left-1 w-[85%] h-auto text-[#10B981] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              fill="currentColor"
            >
              {/* Leaf 1 */}
              <path
                d="M4 8 C12 2, 22 8, 20 18 C10 22, 2 16, 4 8 Z"
                fill="#10B981"
                opacity="0.95"
              />
              {/* Leaf 2 */}
              <path
                d="M14 14 C26 10, 32 20, 24 30 C16 32, 10 24, 14 14 Z"
                fill="#059669"
                opacity="0.95"
              />
              {/* Leaf 3 */}
              <path
                d="M2 22 C10 18, 18 24, 14 34 C6 36, 0 30, 2 22 Z"
                fill="#34D399"
                opacity="0.9"
              />
              {/* Stem / Vine */}
              <path
                d="M0 2 Q 14 16, 18 36"
                stroke="#047857"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Percentage Value */}
      <span
        className={`text-[11px] sm:text-xs font-mono font-medium mt-1.5 tracking-tight ${
          isHundred
            ? "text-[#2DD4BF]"
            : hasShade
            ? "text-white/70"
            : isOptimized
            ? "text-white/90"
            : "text-white/60"
        }`}
      >
        {percentage}
      </span>
    </div>
  );
}

function OptimizerComparisonIllustration() {
  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-xl p-3 sm:p-4 mb-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        {/* Grupo 1: Sin Optimizador */}
        <div className="flex flex-col">
          <div className="text-center mb-2 pb-1 border-b border-white/10">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/70 font-semibold block">
              Sin Optimizador
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 justify-between">
            <SolarPanelItem hasShade={true} percentage="85%" />
            <SolarPanelItem percentage="90%" />
            <SolarPanelItem percentage="90%" />
            <SolarPanelItem percentage="90%" />
          </div>
        </div>

        {/* Grupo 2: Con Optimizador */}
        <div className="flex flex-col">
          <div className="text-center mb-2 pb-1 border-b border-[#2DD4BF]/30">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#2DD4BF] font-semibold block">
              Con Optimizador
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 justify-between">
            <SolarPanelItem hasShade={true} percentage="85%" isOptimized={true} />
            <SolarPanelItem percentage="100%" isOptimized={true} />
            <SolarPanelItem percentage="100%" isOptimized={true} />
            <SolarPanelItem percentage="100%" isOptimized={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmpresasDiagram() {
  const [activeHotspot, setActiveHotspot] = useState<HotspotData | null>(null);

  return (
    <section className="w-full py-16 md:py-24 px-3 md:px-5 box-border bg-transparent overflow-hidden">
      <div className="w-full flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 md:mb-14 max-w-4xl px-4"
        >
          <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight leading-[1.1]">
            Solar, baterías y la red sincronizadas, minimizando el costo eléctrico operacional de tu empresa.
          </h2>
        </motion.div>

        {/* Diagram Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[16/9] md:aspect-[21/9] min-h-[420px] md:min-h-[580px] rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#F7F8FA] border border-black/10 shadow-xl"
        >
          {/* Base Isometric Diagram Image */}
          <Image
            src="/images/diagrama-planta-solar-empresas-solderio.jpeg"
            alt="Diagrama Planta Solar Comercial e Industrial SoldeRío"
            fill
            priority
            className="object-cover opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

          {/* Interactive Uniform Pin Boxes */}
          {HOTSPOTS.map((hotspot) => {
            const isSelected = activeHotspot?.id === hotspot.id;

            return (
              <div
                key={hotspot.id}
                className={`absolute ${hotspot.topPosition} ${hotspot.leftPosition} z-20`}
              >
                <motion.button
                  onClick={() => setActiveHotspot(isSelected ? null : hotspot)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg transition-all duration-300 cursor-pointer select-none ${
                    isSelected
                      ? "bg-[#FF8300] text-white ring-4 ring-[#FF8300]/40 scale-105 shadow-[0_0_25px_rgba(255,131,0,0.5)]"
                      : "bg-white/95 hover:bg-white text-[#1F1F1F] border border-black/10 hover:border-[#FF8300]/40 backdrop-blur-md"
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium tracking-tight whitespace-nowrap">
                    {hotspot.badgeTitle}
                  </span>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12 ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-black/5 text-[#6B7280] group-hover:text-[#FF8300]"
                    }`}
                  >
                    <Info className="w-3 h-3" />
                  </div>
                </motion.button>
              </div>
            );
          })}

          {/* Floating Details HUD Card on Hotspot Click */}
          <AnimatePresence>
            {activeHotspot && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-8 sm:max-w-lg bg-[#1F1F1F]/95 backdrop-blur-2xl text-white p-5 sm:p-6 rounded-2xl border border-white/15 shadow-2xl z-30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-light uppercase tracking-widest text-[#FF8300] block mb-1 font-mono">
                      {activeHotspot.category}
                    </span>
                    <h4 className="text-base sm:text-lg font-light text-white">
                      {activeHotspot.title}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveHotspot(null)}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#FF8300] text-white/70 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm flex-shrink-0 ml-3"
                    title="Cerrar"
                    aria-label="Cerrar detalles"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2]" />
                  </button>
                </div>

                {activeHotspot.description && (
                  <p className="text-white/80 text-xs sm:text-sm font-light leading-relaxed mb-4">
                    {activeHotspot.description}
                  </p>
                )}

                {/* Bullets OR Optimizer Comparison Illustration */}
                {activeHotspot.id === "optimizer" ? (
                  <OptimizerComparisonIllustration />
                ) : activeHotspot.specs && activeHotspot.specs.length > 0 ? (
                  <div className="space-y-1.5 mb-4 border-t border-white/10 pt-3">
                    {activeHotspot.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-xs text-white/90 font-light">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8300] flex-shrink-0" />
                        <span className="font-light">{spec}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {activeHotspot.id !== "optimizer" && activeHotspot.secNorm && (
                  <div className="bg-black/30 px-3 py-2 rounded-xl border border-white/10 flex items-center justify-between text-[11px] text-white/70">
                    <span className="font-light text-[#FF8300]">Norma SEC:</span>
                    <span className="font-light">{activeHotspot.secNorm}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
