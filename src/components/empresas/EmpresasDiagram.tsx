"use client";

import { useState, useEffect } from "react";
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
  Clock,
  Car,
  Play,
  Pause,
  AlertTriangle,
  TrendingDown,
  Sparkles,
} from "lucide-react";

export type ScenarioId =
  | "self_consumption"
  | "peak_shaving"
  | "time_of_use"
  | "off_grid"
  | "ev_fleet";

interface ScenarioConfig {
  id: ScenarioId;
  label: string;
  badge: string;
  tagline: string;
  icon: any;
  description: string;
  metrics: {
    solarPower: string;
    essPower: string;
    essSoc: string;
    loadPower: string;
    evPower: string;
    gridPower: string;
    gridStatus: "neutral" | "exporting" | "importing" | "disconnected";
    gridLabel: string;
  };
  paths: {
    solarMain: boolean;
    solarOpt: boolean;
    essCharging: boolean;
    essDischarging: boolean;
    gridImport: boolean;
    gridExport: boolean;
    gridDisconnected: boolean;
    loadActive: boolean;
    evActive: boolean;
  };
}

const SCENARIOS: ScenarioConfig[] = [
  {
    id: "self_consumption",
    label: "Máximo Autoconsumo",
    badge: "Generación Solar Diurna",
    tagline: "Prioridad Solar & Autonomía",
    icon: Sparkles,
    description:
      "La generación solar fotovoltaica abastece el 100% de la fábrica y cargadores EV. El excedente se almacena en el BESS Huawei LUNA2000. Cero costo de la red pública.",
    metrics: {
      solarPower: "145 kW",
      essPower: "+45 kW",
      essSoc: "78%",
      loadPower: "75 kW",
      evPower: "25 kW",
      gridPower: "0 kW",
      gridStatus: "neutral",
      gridLabel: "Standby (100% Solar)",
    },
    paths: {
      solarMain: true,
      solarOpt: true,
      essCharging: true,
      essDischarging: false,
      gridImport: false,
      gridExport: false,
      gridDisconnected: false,
      loadActive: true,
      evActive: true,
    },
  },
  {
    id: "peak_shaving",
    label: "Peak Shaving",
    badge: "Límites de Invierno / Punta",
    tagline: "Recorte de Potencia Contratada",
    icon: TrendingDown,
    description:
      "En horario de alta demanda y tarifa punta (18h a 22h), el BESS descarga 95 kW para alimentar la planta y recortar el pico de la red, evitando multas y recargos por potencia punta.",
    metrics: {
      solarPower: "5 kW",
      essPower: "-95 kW",
      essSoc: "62%",
      loadPower: "105 kW",
      evPower: "0 kW",
      gridPower: "10 kW",
      gridStatus: "importing",
      gridLabel: "Base Mínima (Afeitado)",
    },
    paths: {
      solarMain: false,
      solarOpt: false,
      essCharging: false,
      essDischarging: true,
      gridImport: true,
      gridExport: false,
      gridDisconnected: false,
      loadActive: true,
      evActive: false,
    },
  },
  {
    id: "time_of_use",
    label: "Tiempo de Uso",
    badge: "Arbitraje Tarifario",
    tagline: "Carga Inteligente Horas Valle",
    icon: Clock,
    description:
      "Carga programada del banco BESS y de la flota de camiones durante horas de tarifa eléctrica económica (valle) para abastecer las operaciones en las horas más caras.",
    metrics: {
      solarPower: "0 kW",
      essPower: "+80 kW",
      essSoc: "48%",
      loadPower: "35 kW",
      evPower: "45 kW",
      gridPower: "160 kW",
      gridStatus: "importing",
      gridLabel: "Tarifa Valle Económica",
    },
    paths: {
      solarMain: false,
      solarOpt: false,
      essCharging: true,
      essDischarging: false,
      gridImport: true,
      gridExport: false,
      gridDisconnected: false,
      loadActive: true,
      evActive: true,
    },
  },
  {
    id: "off_grid",
    label: "Suministro Anti-Corte",
    badge: "Blackout / Grid-Forming",
    tagline: "Respaldo Ininterrumpido <5ms",
    icon: ShieldCheck,
    description:
      "Corte intencional o falla en la red pública de Saesa/Crell/CGE. Conmutación STS instantánea (<5ms): la planta opera en isla 100% segura alimentada por Solar + BESS.",
    metrics: {
      solarPower: "90 kW",
      essPower: "-30 kW",
      essSoc: "85%",
      loadPower: "85 kW",
      evPower: "35 kW",
      gridPower: "0 kW",
      gridStatus: "disconnected",
      gridLabel: "Red Desconectada (Blackout)",
    },
    paths: {
      solarMain: true,
      solarOpt: true,
      essCharging: false,
      essDischarging: true,
      gridImport: false,
      gridExport: false,
      gridDisconnected: true,
      loadActive: true,
      evActive: true,
    },
  },
  {
    id: "ev_fleet",
    label: "Carga Flotas EV",
    badge: "Electromovilidad Corporativa",
    tagline: "Potencia Rápida sin Sobrecarga",
    icon: Car,
    description:
      "Descarga de alta potencia coordinada entre paneles solares y BESS para abastecer simultáneamente cargadores rápidos de furgones y camiones sin saturar el empalme.",
    metrics: {
      solarPower: "115 kW",
      essPower: "-40 kW",
      essSoc: "68%",
      loadPower: "65 kW",
      evPower: "90 kW",
      gridPower: "0 kW",
      gridStatus: "neutral",
      gridLabel: "Solar + BESS Pura",
    },
    paths: {
      solarMain: true,
      solarOpt: true,
      essCharging: false,
      essDischarging: true,
      gridImport: false,
      gridExport: false,
      gridDisconnected: false,
      loadActive: true,
      evActive: true,
    },
  },
];

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
    title: "Smart String ESS Huawei LUNA2000 C&I",
    category: "Almacenamiento & Grid-Forming",
    icon: Battery,
    description:
      "Sistema de almacenamiento C&I con arquitectura de refrigeración híbrida (líquida + aire) y seguridad dual C2C (Cell-to-Consumption). Almacena excedentes solares para descarga en horas punta (Peak Shaving), elimina desbalances de celda e integra capacidad Grid-Forming para respaldo ininterrumpido.",
    specs: [
      "Seguridad C2C en 5 niveles y desconexión ultrarrápida en <5ms",
      "Refrigeración híbrida inteligente con eficiencia RTE >91.3%",
      "Optimizador por pack: +2% energía usable y balanceo activo 24/7",
    ],
    secNorm: "Pliego RIC N°09 BESS & Certificación IEC 62619 / UL 9540A",
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
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<HotspotData | null>(null);

  const currentScenario = SCENARIOS[selectedScenarioIndex];

  // Auto-play timer (cycles every 6.5 seconds if playing)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSelectedScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section className="w-full py-16 md:py-24 px-3 md:px-5 box-border bg-transparent overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8 md:mb-10 max-w-4xl px-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF8300] bg-[#FF8300]/10 px-3.5 py-1 rounded-full inline-block mb-3">
            Simulador de Gestión Energética C&I
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight leading-[1.1] mb-3">
            Solar, baterías y la red sincronizadas, minimizando el costo eléctrico.
          </h2>
          <p className="text-sm md:text-base text-black/60 font-light max-w-2xl mx-auto">
            Explora cómo interactúan la generación solar, el almacenamiento BESS y las cargas industriales según el escenario operacional de tu empresa.
          </p>
        </motion.div>

        {/* 1. SCENARIO SELECTOR BAR (Tesla Home / Apple style pill selector) */}
        <div className="w-full flex items-center justify-center mb-6 overflow-x-auto no-scrollbar py-1 px-2">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-[#1F1F1F]/90 backdrop-blur-xl p-1.5 rounded-full border border-black/10 shadow-lg">
            {SCENARIOS.map((sc, idx) => {
              const Icon = sc.icon;
              const isActive = selectedScenarioIndex === idx;

              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    setSelectedScenarioIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-light transition-all duration-300 cursor-pointer select-none whitespace-nowrap ${
                    isActive
                      ? "bg-[#FF8300] text-white font-medium shadow-[0_2px_15px_rgba(255,131,0,0.5)] scale-100"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
                  <span>{sc.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. MAIN SIMULATOR CANVAS CONTAINER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[16/9] md:aspect-[21/9] min-h-[420px] md:min-h-[600px] rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#0F141C] border border-black/10 shadow-2xl"
        >
          {/* Base Isometric Diagram Image */}
          <Image
            src="/images/diagrama-planta-solar-empresas-solderio.jpeg"
            alt="Diagrama Planta Solar Comercial e Industrial SoldeRío"
            fill
            priority
            className="object-cover opacity-90 transition-opacity duration-700"
          />

          {/* Ambient Lighting Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* 3. SVG ANIMATED ENERGY CONDUITS & GLOWING FLOW PARTICLES */}
          <svg
            viewBox="0 0 1000 500"
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Glow Filters */}
              <filter id="neonGlowOrange" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur1" />
                <feGaussianBlur stdDeviation="8" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="neonGlowGreen" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur1" />
                <feGaussianBlur stdDeviation="7" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="neonGlowBlue" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur1" />
                <feGaussianBlur stdDeviation="7" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="2.5" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Gradients */}
              <linearGradient id="gradSolar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFA033" />
                <stop offset="100%" stopColor="#FF8300" />
              </linearGradient>

              <linearGradient id="gradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>

              <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>

              <linearGradient id="gradRed" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F87171" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
            </defs>

            {/* PATH 1: Optimizadores -> Generación Solar (90° Orthogonal) */}
            {/* Base Conduit */}
            <path
              d="M 600 140 L 600 90 L 400 90"
              fill="none"
              stroke="#FF8300"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={currentScenario.paths.solarOpt ? 0.4 : 0.1}
            />
            {currentScenario.paths.solarOpt && (
              <path
                d="M 600 140 L 600 90 L 400 90"
                fill="none"
                stroke="#FF8300"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="40 250"
                filter="url(#neonGlowOrange)"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-250"
                  dur="2.8s"
                  repeatCount="indefinite"
                />
              </path>
            )}

            {/* PATH 2: Generación Solar -> Sala Eléctrica (90° Orthogonal) */}
            {/* Base Conduit */}
            <path
              d="M 400 90 L 310 90 L 310 190"
              fill="none"
              stroke="#FF8300"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={currentScenario.paths.solarMain ? 0.45 : 0.1}
            />
            {currentScenario.paths.solarMain && (
              <path
                d="M 400 90 L 310 90 L 310 190"
                fill="none"
                stroke="#FF8300"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="35 190"
                filter="url(#neonGlowOrange)"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-190"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </path>
            )}

            {/* PATH 3: Sala Eléctrica <-> ESS Baterías (90° Orthogonal Vertical) */}
            {/* Base Conduit */}
            <path
              d="M 310 190 L 310 300"
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={
                currentScenario.paths.essCharging || currentScenario.paths.essDischarging
                  ? 0.45
                  : 0.1
              }
            />
            {/* Charging ESS: Sala Eléctrica -> ESS */}
            {currentScenario.paths.essCharging && (
              <path
                d="M 310 190 L 310 300"
                fill="none"
                stroke="#10B981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="30 110"
                filter="url(#neonGlowGreen)"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-110"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </path>
            )}
            {/* Discharging ESS (Peak Shaving / Off-Grid): ESS -> Sala Eléctrica */}
            {currentScenario.paths.essDischarging && (
              <path
                d="M 310 300 L 310 190"
                fill="none"
                stroke="#10B981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="30 110"
                filter="url(#neonGlowGreen)"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-110"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </path>
            )}

            {/* PATH 4: Red Eléctrica <-> Sala Eléctrica (90° Orthogonal) */}
            {/* Base Conduit */}
            <path
              d="M 165 100 L 165 190 L 310 190"
              fill="none"
              stroke={
                currentScenario.paths.gridDisconnected
                  ? "#EF4444"
                  : "#3B82F6"
              }
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={currentScenario.paths.gridDisconnected ? "6 6" : "none"}
              strokeOpacity={
                currentScenario.paths.gridImport || currentScenario.paths.gridExport
                  ? 0.45
                  : currentScenario.paths.gridDisconnected
                  ? 0.75
                  : 0.12
              }
            />
            {/* Importing from Grid -> Sala Eléctrica */}
            {currentScenario.paths.gridImport && (
              <path
                d="M 165 100 L 165 190 L 310 190"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="35 235"
                filter="url(#neonGlowBlue)"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-235"
                  dur="2.8s"
                  repeatCount="indefinite"
                />
              </path>
            )}

            {/* PATH 5: Sala Eléctrica -> Cargadores Rápidos EV (90° Orthogonal) */}
            {/* Base Conduit */}
            <path
              d="M 310 190 L 310 360 L 520 360"
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={currentScenario.paths.evActive ? 0.45 : 0.1}
            />
            {currentScenario.paths.evActive && (
              <path
                d="M 310 190 L 310 360 L 520 360"
                fill="none"
                stroke="#10B981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="45 380"
                filter="url(#neonGlowGreen)"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-380"
                  dur="3.0s"
                  repeatCount="indefinite"
                />
              </path>
            )}

            {/* PATH 6: Sala Eléctrica -> Consumo Fábrica / Maquinaria (90° Orthogonal) */}
            {/* Base Conduit */}
            <path
              d="M 310 190 L 720 190 L 720 260"
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={currentScenario.paths.loadActive ? 0.45 : 0.1}
            />
            {currentScenario.paths.loadActive && (
              <path
                d="M 310 190 L 720 190 L 720 260"
                fill="none"
                stroke="#10B981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="50 480"
                filter="url(#neonGlowGreen)"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-480"
                  dur="3.2s"
                  repeatCount="indefinite"
                />
              </path>
            )}
          </svg>

          {/* 4. INTERACTIVE INFOBUTTON HOTSPOT PINS */}
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
                      : "bg-white/95 hover:bg-white text-[#1F1F1F] border border-black/10 hover:border-[#FF8300]/40 shadow-lg backdrop-blur-md"
                  }`}
                >
                  {hotspot.hasDot && !isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#FF8300] shadow-[0_0_8px_#FF8300]" />
                  )}

                  <span className="text-xs sm:text-sm font-medium tracking-tight whitespace-nowrap">
                    {hotspot.badgeTitle}
                  </span>

                  {hotspot.hasTag && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-mono ${
                        isSelected ? "bg-white/20 text-white" : "bg-black/5 text-[#6B7280]"
                      }`}
                    >
                      {hotspot.hasTag}
                    </span>
                  )}

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

          {/* 5. TOP-LEFT SCENARIO DESCRIPTION OVERLAY */}
          <div className="absolute top-4 left-4 z-20 max-w-xs sm:max-w-md bg-black/65 backdrop-blur-xl border border-white/15 p-3.5 sm:p-4 rounded-2xl text-white shadow-2xl pointer-events-none">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#FF8300] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#FF8300] font-semibold">
                {currentScenario.badge}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-medium text-white mb-1">
              {currentScenario.tagline}
            </h4>
            <p className="text-xs text-white/80 font-light leading-relaxed hidden sm:block">
              {currentScenario.description}
            </p>
          </div>

          {/* 6. BOTTOM-LEFT PLAY/PAUSE DEMO BUTTON (Tesla Home style) */}
          <div className="absolute bottom-4 left-4 z-20">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-xl border border-white/20 text-white text-xs font-light shadow-xl transition-all duration-300 cursor-pointer"
              title={isPlaying ? "Pausar simulación automática" : "Iniciar simulación automática"}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#FF8300] fill-[#FF8300]" />
                  <span className="hidden sm:inline font-mono text-[11px]">Pausar Auto</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#10B981] fill-[#10B981]" />
                  <span className="hidden sm:inline font-mono text-[11px]">Reproducir</span>
                </>
              )}
            </button>
          </div>

          {/* 7. FLOATING LIVE TELEMETRY DASHBOARD (Tesla Home style metrics) */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <div className="bg-black/70 backdrop-blur-xl border border-white/15 p-3 sm:p-4 rounded-2xl text-white shadow-2xl min-w-[170px] sm:min-w-[210px]">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-white/50 block mb-2">
                Telemetría en Tiempo Real
              </span>

              <div className="space-y-2 text-xs">
                {/* Solar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white/75">
                    <Sun className="w-3.5 h-3.5 text-[#FF8300]" />
                    <span>Solar FV</span>
                  </div>
                  <span className="font-mono font-medium text-[#FF8300]">
                    {currentScenario.metrics.solarPower}
                  </span>
                </div>

                {/* ESS BESS */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white/75">
                    <Battery className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>BESS LUNA</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-medium text-[#10B981] block">
                      {currentScenario.metrics.essPower}
                    </span>
                    <span className="text-[9px] text-white/50">
                      SOC {currentScenario.metrics.essSoc}
                    </span>
                  </div>
                </div>

                {/* Planta / Fábrica */}
                <div className="flex items-center justify-between border-t border-white/10 pt-1.5">
                  <div className="flex items-center gap-1.5 text-white/75">
                    <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Planta Industrial</span>
                  </div>
                  <span className="font-mono font-medium text-white/90">
                    {currentScenario.metrics.loadPower}
                  </span>
                </div>

                {/* Cargadores EV */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white/75">
                    <Car className="w-3.5 h-3.5 text-[#34D399]" />
                    <span>Cargadores EV</span>
                  </div>
                  <span className="font-mono font-medium text-[#34D399]">
                    {currentScenario.metrics.evPower}
                  </span>
                </div>

                {/* Red Pública */}
                <div className="flex items-center justify-between border-t border-white/10 pt-1.5">
                  <div className="flex items-center gap-1.5 text-white/75">
                    <Activity
                      className={`w-3.5 h-3.5 ${
                        currentScenario.metrics.gridStatus === "disconnected"
                          ? "text-[#EF4444]"
                          : "text-[#60A5FA]"
                      }`}
                    />
                    <span>Red Saesa/Crell</span>
                  </div>
                  <span
                    className={`font-mono font-medium text-[11px] ${
                      currentScenario.metrics.gridStatus === "disconnected"
                        ? "text-[#EF4444] font-bold"
                        : "text-[#60A5FA]"
                    }`}
                  >
                    {currentScenario.metrics.gridPower}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 8. FLOATING DETAILS HUD CARD (on Hotspot Pin Click) */}
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

                <p className="text-white/80 text-xs sm:text-sm font-light leading-relaxed mb-4">
                  {activeHotspot.description}
                </p>

                {/* Bullets OR Optimizer Comparison Illustration */}
                {activeHotspot.id === "optimizer" ? (
                  <OptimizerComparisonIllustration />
                ) : (
                  <div className="space-y-1.5 mb-4 border-t border-white/10 pt-3">
                    {activeHotspot.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-xs text-white/90 font-light">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8300] flex-shrink-0" />
                        <span className="font-light">{spec}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeHotspot.id !== "optimizer" && (
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
