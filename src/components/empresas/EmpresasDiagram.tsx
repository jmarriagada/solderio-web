"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Info, X, Zap, Sun, Battery, Cpu, ShieldCheck, Activity, CheckCircle2 } from "lucide-react";

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
  hasTag?: string;
  hasDot?: boolean;
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
      "Arreglo de módulos fotovoltaicos N-Type TOPCon de alta eficiencia instalados en cubiertas industriales. Diseñados para maximizar la captación tanto en radiación directa como difusa en el clima del sur de Chile.",
    specs: [
      "Módulos N-Type TOPCon 580W+",
      "Eficiencia de celda >22.5%",
      "Bifacialidad con ganancia difusa +15%",
    ],
    secNorm: "Pliego Técnico RIC N°09 (Instalaciones Fotovoltaicas)",
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
    hasDot: true,
  },
  {
    id: "grid",
    badgeTitle: "Red",
    topPosition: "top-[18%] md:top-[20%]",
    leftPosition: "left-[10%] md:left-[15%]",
    title: "Interconexión y Empalme a Red Pública",
    category: "Net Billing Ley 21.118",
    icon: Activity,
    description:
      "Enlace bidireccional certificado ante la distribuidora eléctrica (Saesa, Crell o CGE). Inyecta y valoriza los excedentes generados y asegura suministro de respaldo de red ante demandas punta.",
    specs: [
      "Inyección bajo Ley Net Billing 21.118",
      "Medición Inteligente Bidireccional",
      "Trámite oficial SEC TE-4",
    ],
    secNorm: "Pliego Técnico RIC N°15 & NTSyCS (Coordinador Eléctrico)",
    hasDot: true,
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
    secNorm: "Pliegos Técnicos RIC N°02 (Tableros) y RIC N°03",
  },
  {
    id: "ess",
    badgeTitle: "Energy Storage System - ESS",
    topPosition: "top-[58%] md:top-[60%]",
    leftPosition: "left-[24%] md:left-[30%]",
    title: "Sistema de Almacenamiento BESS LiFePO4",
    category: "Respaldo & Peak Shaving",
    icon: Battery,
    description:
      "Banco de baterías industriales de litio ferrofosfato (LiFePO4). Almacena excedentes solares para descarga en horarios de tarifa punta comercial (Peak Shaving) y brinda respaldo ininterrumpido (UPS) ante blackouts.",
    specs: [
      "Química segura LiFePO4 (+6.000 ciclos)",
      "Zero riesgo de embalamiento térmico",
      "Conmutación STS ultrarrápida (<10ms)",
    ],
    secNorm: "RIC N°09 Sección Almacenamiento Electroquímico BESS",
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
    specs: [
      "Cargadores rápidos DC / Wallbox AC",
      "Gestión dinámica de potencia (DLB)",
      "Protocolo de interoperabilidad OCPP 1.6J",
    ],
    secNorm: "Declaración Oficial SEC TE-6 (Electromovilidad)",
    hasTag: "EV",
  },
];

export function EmpresasDiagram() {
  const [activeHotspot, setActiveHotspot] = useState<HotspotData | null>(null);

  return (
    <section className="w-full py-16 md:py-24 px-3 md:px-5 box-border bg-white overflow-hidden">
      <div className="w-full flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 md:mb-16 max-w-4xl px-4"
        >
          <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight leading-[1.1]">
            Solar, baterías y la red sincronizadas, minimizando el costo eléctrico.
          </h2>
        </motion.div>

        {/* Diagram Area - Extends to cover full section width */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[16/9] md:aspect-[21/9] min-h-[400px] md:min-h-[580px] rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#F7F8FA] border border-black/10 shadow-xl"
        >
          {/* Base Isometric Diagram Image */}
          <Image
            src="/images/diagrama-planta-solar-empresas-solderio.jpeg"
            alt="Diagrama Planta Solar Comercial e Industrial SoldeRío"
            fill
            priority
            className="object-cover opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

          {/* Interactive Infobutton Hotspots */}
          {HOTSPOTS.map((hotspot) => {
            const isSelected = activeHotspot?.id === hotspot.id;

            return (
              <div
                key={hotspot.id}
                className={`absolute ${hotspot.topPosition} ${hotspot.leftPosition} z-20`}
              >
                <motion.button
                  onClick={() => setActiveHotspot(isSelected ? null : hotspot)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-xl transition-all duration-300 cursor-pointer select-none ${
                    isSelected
                      ? "bg-[#FF8300] text-white ring-4 ring-[#FF8300]/40 scale-105 shadow-[0_0_25px_rgba(255,131,0,0.5)]"
                      : "bg-white/95 hover:bg-white text-[#1F1F1F] border border-black/10 hover:border-[#FF8300]/40 shadow-lg"
                  }`}
                >
                  {hotspot.hasDot && !isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#FF8300] shadow-[0_0_8px_#FF8300]" />
                  )}

                  <span className="text-xs sm:text-sm font-medium tracking-tight whitespace-nowrap">
                    {hotspot.badgeTitle}
                  </span>

                  {hotspot.hasTag && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-mono ${
                      isSelected ? "bg-white/20 text-white" : "bg-black/5 text-[#6B7280]"
                    }`}>
                      {hotspot.hasTag}
                    </span>
                  )}

                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12 ${
                    isSelected ? "bg-white/20 text-white" : "bg-black/5 text-[#6B7280] group-hover:text-[#FF8300]"
                  }`}>
                    <Info className="w-3 h-3" />
                  </div>
                </motion.button>
              </div>
            );
          })}

          {/* Floating Details HUD Card inside Canvas on click (Matching Simulador Interactivo) */}
          <AnimatePresence>
            {activeHotspot && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-8 sm:max-w-md bg-[#1F1F1F]/95 backdrop-blur-2xl text-white p-5 sm:p-6 rounded-2xl border border-white/15 shadow-2xl z-30"
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

                <p className="text-white/80 text-xs sm:text-sm font-light leading-relaxed mb-4">
                  {activeHotspot.description}
                </p>

                <div className="space-y-1.5 mb-4 border-t border-white/10 pt-3">
                  {activeHotspot.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 text-xs text-white/90 font-light">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8300] flex-shrink-0" />
                      <span className="font-light">{spec}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-black/30 px-3 py-2 rounded-xl border border-white/10 flex items-center justify-between text-[11px] text-white/70">
                  <span className="font-light text-[#FF8300]">Norma SEC:</span>
                  <span className="font-light">{activeHotspot.secNorm}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Helper Footer Bar inside Diagram */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#1F1F1F]/90 backdrop-blur-md px-6 py-2.5 border-t border-white/10 flex items-center justify-between text-[12px] sm:text-[13px] text-white/60 font-light z-10">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#FF8300]" />
              <span className="font-light">Haz clic en los pines sobre la imagen para inspeccionar cada componente industrial.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
