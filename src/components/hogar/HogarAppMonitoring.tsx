"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Sun,
  Battery,
  Home,
  Zap,
  Car,
  ShieldCheck,
  Activity,
  TrendingUp,
  AlertTriangle,
  Flame,
  Wifi,
  Sparkles,
  CheckCircle2,
  Lock,
  Radio,
  Sliders,
  ChevronRight,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

type ScenarioType = "day" | "night" | "outage" | "ev";

interface ScenarioData {
  id: ScenarioType;
  label: string;
  sublabel: string;
  time: string;
  icon: typeof Sun;
  description: string;
  solarKw: number;
  homeKw: number;
  batterySoc: number;
  batteryKw: number;
  batteryState: "Cargando" | "Descargando" | "Standby" | "Respaldo Activo";
  batteryAutonomy: string;
  gridKw: number;
  gridState: "Inyectando (Net Billing)" | "Standby ($0 consumo)" | "DESCONECTADA (Corte)" | "Cero Importación";
  gridIsOutage: boolean;
  evKw: number;
  evState: string;
  hvacKw: number;
  savingsTodayClp: string;
  selfSufficiencyPct: number;
  appStatusBadge: string;
  appStatusColor: string;
}

const SCENARIOS: Record<ScenarioType, ScenarioData> = {
  day: {
    id: "day",
    label: "Día Soleado",
    sublabel: "Peak de Generación Solar",
    time: "14:00 hrs",
    icon: Sun,
    description:
      "Tus paneles generan máxima potencia limpia. Abastecen el 100% de la casa, recargan la batería LiFePO4 al tope e inyectan excedentes a la red pública generando saldo a favor.",
    solarKw: 6.8,
    homeKw: 2.2,
    batterySoc: 94,
    batteryKw: 2.0,
    batteryState: "Cargando",
    batteryAutonomy: "Carga completa en 35 min",
    gridKw: 2.6,
    gridState: "Inyectando (Net Billing)",
    gridIsOutage: false,
    evKw: 0.0,
    evState: "Standby (Programado 16:00)",
    hvacKw: 0.8,
    savingsTodayClp: "$16.850 CLP",
    selfSufficiencyPct: 100,
    appStatusBadge: "Autoconsumo & Venta Activa",
    appStatusColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  },
  night: {
    id: "night",
    label: "Noche en Batería",
    sublabel: "Autonomía Silenciosa",
    time: "21:30 hrs",
    icon: Battery,
    description:
      "Sin radiación solar, el inversor híbrido conmuta a la batería LiFePO4 para alimentar toda la iluminación, cocina, calefacción y multimedia sin consumir un solo peso de la red.",
    solarKw: 0.0,
    homeKw: 2.4,
    batterySoc: 84,
    batteryKw: -2.4,
    batteryState: "Descargando",
    batteryAutonomy: "14.2 hrs de respaldo continuo",
    gridKw: 0.0,
    gridState: "Standby ($0 consumo)",
    gridIsOutage: false,
    evKw: 0.0,
    evState: "Standby nocturno",
    hvacKw: 1.1,
    savingsTodayClp: "$21.400 CLP",
    selfSufficiencyPct: 100,
    appStatusBadge: "100% Batería • $0 Red Saesa",
    appStatusColor: "text-[#FF8300] bg-[#FF8300]/10 border-[#FF8300]/30",
  },
  outage: {
    id: "outage",
    label: "Corte de Red (Modo Isla)",
    sublabel: "Respaldo Instantáneo <10ms",
    time: "18:45 hrs",
    icon: AlertTriangle,
    description:
      "La red pública (Saesa/Crell) sufre una caída masiva. El sistema activa el Modo Isla en menos de 10 milisegundos: refrigeradores, bombas de agua, WiFi y luces siguen funcionando sin parpadeos.",
    solarKw: 1.6,
    homeKw: 2.1,
    batterySoc: 76,
    batteryKw: -0.5,
    batteryState: "Respaldo Activo",
    batteryAutonomy: "12.5 hrs a plena carga",
    gridKw: 0.0,
    gridState: "DESCONECTADA (Corte)",
    gridIsOutage: true,
    evKw: 0.0,
    evState: "Pausado por prioridad",
    hvacKw: 0.6,
    savingsTodayClp: "$19.200 CLP",
    selfSufficiencyPct: 100,
    appStatusBadge: "MODO ISLA • Respaldo Activo",
    appStatusColor: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  },
  ev: {
    id: "ev",
    label: "Carga Inteligente EV",
    sublabel: "Auto Eléctrico 100% Solar",
    time: "16:15 hrs",
    icon: Car,
    description:
      "Tu auto eléctrico se conecta y la app deriva automáticamente todos los excedentes solares al cargador y a la bomba de calor, cargando tu vehículo a costo cero antes de inyectar.",
    solarKw: 7.4,
    homeKw: 1.8,
    batterySoc: 98,
    batteryKw: 0.6,
    batteryState: "Cargando",
    batteryAutonomy: "Batería casi al 100%",
    gridKw: 0.0,
    gridState: "Cero Importación",
    gridIsOutage: false,
    evKw: 3.8,
    evState: "Carga Rápida Solar (3.8 kW)",
    hvacKw: 1.2,
    savingsTodayClp: "$25.900 CLP",
    selfSufficiencyPct: 100,
    appStatusBadge: "Optimización Solar EV Activa",
    appStatusColor: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  },
};

export function HogarAppMonitoring() {
  const [activeTab, setActiveTab] = useState<ScenarioType>("day");
  const current = SCENARIOS[activeTab];

  return (
    <section className="bg-[#141414] text-white py-20 md:py-32 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#FF8300]/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-blue-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#FF8300] text-xs font-mono uppercase tracking-wider mb-4 shadow-sm">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Telemetría & Control Móvil 24/7</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight mb-4">
            Monitorea y controla por app
          </h2>
          <p className="text-white/70 text-base md:text-lg font-light leading-relaxed">
            Gestiona en tiempo real tu planta solar híbrida desde tu smartphone. Visualiza flujos de energía, simula cortes de red y automatiza el ahorro con ingeniería inteligente en el sur.
          </p>
        </motion.div>

        {/* 4-Scenario Interactive State Selector Bar */}
        <div className="flex items-center justify-center mb-10 md:mb-14 overflow-x-auto pb-2 scrollbar-none">
          <div className="inline-flex p-1.5 rounded-2xl md:rounded-full bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-xl max-w-full">
            {(Object.keys(SCENARIOS) as ScenarioType[]).map((key) => {
              const tab = SCENARIOS[key];
              const Icon = tab.icon;
              const isActive = activeTab === key;

              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`relative flex items-center gap-2.5 px-4 md:px-6 py-2.5 rounded-xl md:rounded-full text-xs md:text-sm font-light transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "text-white shadow-lg font-normal"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeAppScenarioPill"
                      className="absolute inset-0 bg-[#FF8300] rounded-xl md:rounded-full shadow-[0_0_25px_rgba(255,131,0,0.4)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? "text-white"
                          : key === "outage"
                          ? "text-amber-400"
                          : "text-[#FF8300]"
                      }`}
                    />
                    <span>{tab.label}</span>
                    <span
                      className={`hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive ? "bg-black/20 text-white" : "bg-white/5 text-white/50"
                      }`}
                    >
                      {tab.time}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Elongated Smartphone Mockup (Left) + Bento Control Widgets (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT: Elongated Smartphone App Mockup (5 Cols - Matching Full Height) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex flex-col justify-between items-center h-full"
          >
            {/* Phone Mother Frame */}
            <div className="w-full max-w-[340px] sm:max-w-[370px] h-full min-h-[640px] rounded-[44px] border-[7px] border-[#2B2B2B] bg-[#0E0E0E] p-4 sm:p-5 shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative overflow-hidden text-white flex flex-col justify-between transition-all group">
              {/* Top Speaker / Camera Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#1F1F1F] rounded-full flex items-center justify-end pr-3 z-30">
                <span className="w-2 h-2 rounded-full bg-black border border-white/20" />
              </div>

              {/* Status Bar */}
              <div className="relative z-20 flex items-center justify-between text-[11px] font-mono text-white/70 pt-1 pb-3 px-1 border-b border-white/10">
                <span>{current.time}</span>
                <div className="flex items-center gap-2">
                  <Wifi className="w-3.5 h-3.5 text-white/80" />
                  <span className="text-[10px]">5G</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-semibold">{current.batterySoc}%</span>
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* App Internal Header */}
              <div className="relative z-20 pt-3 pb-2 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF8300] animate-pulse" />
                    <span className="text-xs font-semibold tracking-wide text-white">SoldeRío Híbrida</span>
                  </div>
                  <span className="text-[11px] font-mono text-white/50 block">Parcela Los Riscos • 8.5 kWp</span>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-medium border ${current.appStatusColor}`}>
                  {current.appStatusBadge}
                </div>
              </div>

              {/* Central Power Flow Radial Diagram with Energy Particle Flashes */}
              <div className="relative z-20 my-auto flex-1 flex flex-col items-center justify-center py-4">
                {/* SVG Animated Flow Lines Container */}
                <div className="relative w-[270px] h-[250px] flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 270 250">
                    <defs>
                      <linearGradient id="solarFlowGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#FF8300" stopOpacity="0.9" />
                      </linearGradient>
                      <linearGradient id="homeFlowGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF8300" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
                      </linearGradient>
                      <linearGradient id="batteryFlowGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#FF8300" stopOpacity="0.9" />
                      </linearGradient>
                      <linearGradient id="gridFlowGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#FF8300" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.9" />
                      </linearGradient>
                      <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="3.5" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Static Background Guideline Tracks */}
                    <line x1="135" y1="46" x2="135" y2="92" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="135" y1="158" x2="135" y2="204" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="48" y1="125" x2="102" y2="125" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="168" y1="125" x2="222" y2="125" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="3 3" />

                    {/* 1. Solar to Inverter Flow Line + Coordinated Particle Flash (Phase 1: 0.0s -> 1.5s) */}
                    {current.solarKw > 0 && (
                      <g>
                        <line
                          x1="135"
                          y1="46"
                          x2="135"
                          y2="92"
                          stroke="url(#solarFlowGrad)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray="4 4"
                          filter="url(#neonGlow)"
                          opacity="0.85"
                        />
                        {/* Coordinated Inflow Energy Particle */}
                        <circle r="4" fill="#FBBF24" filter="url(#neonGlow)">
                          <animateMotion
                            path="M 135 46 L 135 92"
                            dur="3s"
                            repeatCount="indefinite"
                            keyPoints="0; 1; 1"
                            keyTimes="0; 0.5; 1"
                            calcMode="linear"
                          />
                          <animate
                            attributeName="opacity"
                            values="0; 1; 1; 0; 0"
                            keyTimes="0; 0.08; 0.45; 0.5; 1"
                            dur="3s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle r="2.2" fill="#FFFFFF">
                          <animateMotion
                            path="M 135 46 L 135 92"
                            dur="3s"
                            repeatCount="indefinite"
                            keyPoints="0; 1; 1"
                            keyTimes="0; 0.5; 1"
                            calcMode="linear"
                          />
                          <animate
                            attributeName="opacity"
                            values="0; 1; 1; 0; 0"
                            keyTimes="0; 0.08; 0.45; 0.5; 1"
                            dur="3s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </g>
                    )}

                    {/* 2. Inverter to Home Flow Line + Coordinated Particle Flash (Phase 2: 1.5s -> 3.0s) */}
                    {current.homeKw > 0 && (
                      <g>
                        <line
                          x1="135"
                          y1="158"
                          x2="135"
                          y2="204"
                          stroke="url(#homeFlowGrad)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray="4 4"
                          filter="url(#neonGlow)"
                          opacity="0.85"
                        />
                        {/* Coordinated Outflow Energy Particle */}
                        <circle r="4" fill="#34D399" filter="url(#neonGlow)">
                          <animateMotion
                            path="M 135 158 L 135 204"
                            dur="3s"
                            repeatCount="indefinite"
                            keyPoints="0; 0; 1"
                            keyTimes="0; 0.5; 1"
                            calcMode="linear"
                          />
                          <animate
                            attributeName="opacity"
                            values="0; 0; 1; 1; 0"
                            keyTimes="0; 0.5; 0.58; 0.95; 1"
                            dur="3s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle r="2.2" fill="#FFFFFF">
                          <animateMotion
                            path="M 135 158 L 135 204"
                            dur="3s"
                            repeatCount="indefinite"
                            keyPoints="0; 0; 1"
                            keyTimes="0; 0.5; 1"
                            calcMode="linear"
                          />
                          <animate
                            attributeName="opacity"
                            values="0; 0; 1; 1; 0"
                            keyTimes="0; 0.5; 0.58; 0.95; 1"
                            dur="3s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </g>
                    )}

                    {/* 3. Battery <-> Inverter Flow Line + Coordinated Particle Flash */}
                    {current.batteryKw !== 0 && (
                      <g>
                        <line
                          x1="48"
                          y1="125"
                          x2="102"
                          y2="125"
                          stroke="url(#batteryFlowGrad)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray="4 4"
                          filter="url(#neonGlow)"
                          opacity="0.85"
                        />
                        {current.batteryKw < 0 ? (
                          /* Discharging: Battery -> Inverter (Phase 1: 0.0s -> 1.5s) */
                          <>
                            <circle r="4" fill="#10B981" filter="url(#neonGlow)">
                              <animateMotion
                                path="M 48 125 L 102 125"
                                dur="3s"
                                repeatCount="indefinite"
                                keyPoints="0; 1; 1"
                                keyTimes="0; 0.5; 1"
                                calcMode="linear"
                              />
                              <animate
                                attributeName="opacity"
                                values="0; 1; 1; 0; 0"
                                keyTimes="0; 0.08; 0.45; 0.5; 1"
                                dur="3s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle r="2.2" fill="#FFFFFF">
                              <animateMotion
                                path="M 48 125 L 102 125"
                                dur="3s"
                                repeatCount="indefinite"
                                keyPoints="0; 1; 1"
                                keyTimes="0; 0.5; 1"
                                calcMode="linear"
                              />
                              <animate
                                attributeName="opacity"
                                values="0; 1; 1; 0; 0"
                                keyTimes="0; 0.08; 0.45; 0.5; 1"
                                dur="3s"
                                repeatCount="indefinite"
                              />
                            </circle>
                          </>
                        ) : (
                          /* Charging: Inverter -> Battery (Phase 2: 1.5s -> 3.0s) */
                          <>
                            <circle r="4" fill="#FF8300" filter="url(#neonGlow)">
                              <animateMotion
                                path="M 102 125 L 48 125"
                                dur="3s"
                                repeatCount="indefinite"
                                keyPoints="0; 0; 1"
                                keyTimes="0; 0.5; 1"
                                calcMode="linear"
                              />
                              <animate
                                attributeName="opacity"
                                values="0; 0; 1; 1; 0"
                                keyTimes="0; 0.5; 0.58; 0.95; 1"
                                dur="3s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle r="2.2" fill="#FFFFFF">
                              <animateMotion
                                path="M 102 125 L 48 125"
                                dur="3s"
                                repeatCount="indefinite"
                                keyPoints="0; 0; 1"
                                keyTimes="0; 0.5; 1"
                                calcMode="linear"
                              />
                              <animate
                                attributeName="opacity"
                                values="0; 0; 1; 1; 0"
                                keyTimes="0; 0.5; 0.58; 0.95; 1"
                                dur="3s"
                                repeatCount="indefinite"
                              />
                            </circle>
                          </>
                        )}
                      </g>
                    )}

                    {/* 4. Inverter -> Grid (Net Billing) Flow Line + Coordinated Particle Flash (Phase 2: 1.5s -> 3.0s) */}
                    {current.gridKw > 0 && !current.gridIsOutage && (
                      <g>
                        <line
                          x1="168"
                          y1="125"
                          x2="222"
                          y2="125"
                          stroke="url(#gridFlowGrad)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray="4 4"
                          filter="url(#neonGlow)"
                          opacity="0.85"
                        />
                        <circle r="4" fill="#60A5FA" filter="url(#neonGlow)">
                          <animateMotion
                            path="M 168 125 L 222 125"
                            dur="3s"
                            repeatCount="indefinite"
                            keyPoints="0; 0; 1"
                            keyTimes="0; 0.5; 1"
                            calcMode="linear"
                          />
                          <animate
                            attributeName="opacity"
                            values="0; 0; 1; 1; 0"
                            keyTimes="0; 0.5; 0.58; 0.95; 1"
                            dur="3s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle r="2.2" fill="#FFFFFF">
                          <animateMotion
                            path="M 168 125 L 222 125"
                            dur="3s"
                            repeatCount="indefinite"
                            keyPoints="0; 0; 1"
                            keyTimes="0; 0.5; 1"
                            calcMode="linear"
                          />
                          <animate
                            attributeName="opacity"
                            values="0; 0; 1; 1; 0"
                            keyTimes="0; 0.5; 0.58; 0.95; 1"
                            dur="3s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </g>
                    )}

                    {/* Central Hub Synchronization Pulse Ring at 1.5s */}
                    <circle cx="135" cy="125" r="28" fill="none" stroke="#FF8300" strokeWidth="1.5" opacity="0">
                      <animate
                        attributeName="r"
                        values="24; 38; 44"
                        keyTimes="0; 0.7; 1"
                        dur="3s"
                        begin="1.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.8; 0.3; 0"
                        keyTimes="0; 0.7; 1"
                        dur="3s"
                        begin="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Outage State Red Pulsing Cross on Grid Line */}
                    {current.gridIsOutage && (
                      <g>
                        <line x1="168" y1="125" x2="222" y2="125" stroke="#EF4444" strokeWidth="2" strokeDasharray="2 4" opacity="0.6" />
                        <circle cx="195" cy="125" r="5" fill="#EF4444" opacity="0.8">
                          <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2s" repeatCount="indefinite" />
                        </circle>
                      </g>
                    )}
                  </svg>

                  {/* Central Inverter / Hub Node */}
                  <div className="relative z-20 w-16 h-16 rounded-2xl bg-[#181818] border-2 border-[#FF8300]/70 shadow-[0_0_35px_rgba(255,131,0,0.4)] flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
                    <Activity className="w-5 h-5 text-[#FF8300] animate-pulse" />
                    <span className="text-[9px] font-mono text-white/80 font-semibold mt-0.5">INVERSOR</span>
                  </div>

                  {/* Satellite 1: Top (Solar FV) */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                    <div className="w-11 h-11 rounded-full bg-amber-500/15 border border-amber-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                      <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-amber-400 mt-1">
                      {current.solarKw} kW
                    </span>
                  </div>

                  {/* Satellite 2: Left (Batería LiFePO4) */}
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 flex flex-col items-center z-20">
                    <div className={`w-11 h-11 rounded-full border flex items-center justify-center ${
                      current.batteryKw < 0
                        ? "bg-emerald-500/15 border-emerald-400/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                        : "bg-[#FF8300]/15 border-[#FF8300]/50 text-[#FF8300] shadow-[0_0_20px_rgba(255,131,0,0.25)]"
                    }`}>
                      <Battery className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-white mt-1">
                      {current.batterySoc}%
                    </span>
                    <span className="text-[8px] font-mono text-white/50">
                      {current.batteryKw > 0 ? `+${current.batteryKw} kW` : `${current.batteryKw} kW`}
                    </span>
                  </div>

                  {/* Satellite 3: Right (Red Eléctrica Saesa) */}
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 flex flex-col items-center z-20">
                    <div className={`w-11 h-11 rounded-full border flex items-center justify-center ${
                      current.gridIsOutage
                        ? "bg-red-500/25 border-red-500 text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.4)] animate-pulse"
                        : current.gridKw > 0
                        ? "bg-blue-500/15 border-blue-400/50 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                        : "bg-white/5 border-white/20 text-white/40"
                    }`}>
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-mono font-semibold mt-1 ${
                      current.gridIsOutage ? "text-red-400" : "text-blue-400"
                    }`}>
                      {current.gridIsOutage ? "CORTE" : `${current.gridKw} kW`}
                    </span>
                  </div>

                  {/* Satellite 4: Bottom (Consumo Hogar) */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                    <span className="text-[10px] font-mono font-semibold text-emerald-400 mb-1">
                      {current.homeKw} kW
                    </span>
                    <div className="w-11 h-11 rounded-full bg-emerald-500/15 border border-emerald-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                      <Home className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Phone Cards (Elongated Structure) */}
              <div className="relative z-20 space-y-2 pt-3 border-t border-white/10 mt-auto">
                {/* Battery Status Pill */}
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-[11px] font-light">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FF8300]" />
                    <span className="text-white/80">{current.batteryState}</span>
                  </div>
                  <span className="text-white/50 font-mono text-[10px]">{current.batteryAutonomy}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: 4 Bento Cards of Advanced Telemetry & Value (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch">
            {/* Card 1: Balance Energético & Potencia Instantánea */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 hover:border-[#FF8300]/40 transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF8300] font-semibold">
                    01 • FLUJO DE POTENCIA
                  </span>
                  <Activity className="w-4 h-4 text-white/40 group-hover:text-[#FF8300] transition-colors" />
                </div>

                <h3 className="text-lg font-normal text-white mb-2">
                  Balance Energético en Vivo
                </h3>
                <p className="text-xs text-white/70 font-light mb-5 leading-relaxed">
                  El inversor híbrido inteligente prioriza el consumo del hogar. El excedente solar carga el banco de baterías. Una vez cargadas al 100%, el sobrante se inyecta a la red. Si se corta la red pública, el sistema conmuta en menos de 10ms para mantener tu hogar 100% operativo.
                </p>

                {/* Mini Power Metrics Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-amber-400">☀️ Generación Solar</span>
                      <span className="text-white font-semibold">{current.solarKw} kW</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (current.solarKw / 8) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-emerald-400">🏠 Consumo Hogar</span>
                      <span className="text-white font-semibold">{current.homeKw} kW</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (current.homeKw / 5) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-[#FF8300]">🔋 Batería LiFePO4</span>
                      <span className="text-white font-semibold">{current.batterySoc}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FF8300] rounded-full transition-all duration-500"
                        style={{ width: `${current.batterySoc}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/50">
                <span>Autosuficiencia</span>
                <span className="text-emerald-400 font-semibold">{current.selfSufficiencyPct}% Renovable</span>
              </div>
            </motion.div>

            {/* Card 2: Centro de Respaldo Anti-Cortes (STS <10ms) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border transition-all duration-300 flex flex-col justify-between group shadow-lg ${
                current.gridIsOutage
                  ? "border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.15)]"
                  : "border-white/10 hover:border-[#FF8300]/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF8300] font-semibold">
                    02 • RESILENCIA SEC
                  </span>
                  <ShieldCheck className="w-4 h-4 text-white/40 group-hover:text-[#FF8300] transition-colors" />
                </div>

                <h3 className="text-lg font-normal text-white mb-2">
                  Protección Anti-Cortes (UPS)
                </h3>
                <p className="text-xs text-white/60 font-light mb-4 leading-relaxed">
                  Conmutación automática en &lt;10ms. Tu familia no se entera cuando la red eléctrica local falla.
                </p>

                {/* Status Indicator Box */}
                <div className={`p-3 rounded-2xl border mb-4 ${
                  current.gridIsOutage
                    ? "bg-amber-500/10 border-amber-400/40 text-amber-300"
                    : "bg-emerald-500/10 border-emerald-400/30 text-emerald-300"
                }`}>
                  <div className="flex items-center gap-2 text-xs font-semibold mb-1">
                    <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                    <span>{current.gridIsOutage ? "MODO ISLA ACTIVO" : "RED NORMAL CONECTADA"}</span>
                  </div>
                  <span className="text-[11px] opacity-80 font-light block">
                    {current.gridIsOutage
                      ? "Saesa/Crell sin servicio. Batería suministrando cargas críticas."
                      : "Sistema en standby listo para respaldo inmediato."}
                  </span>
                </div>

                {/* Critical Backed-up Loads List */}
                <div className="space-y-1.5 text-xs text-white/70 font-light">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8300]" />
                    <span>Refrigeración & Alimentos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8300]" />
                    <span>Bombas de Agua & Presurización</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8300]" />
                    <span>Iluminación & Internet / WiFi</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/50">
                <span>Tiempo de Transferencia</span>
                <span className="text-white font-semibold">&lt;10 ms (Sin corte)</span>
              </div>
            </motion.div>

            {/* Card 3: Rendimiento Financiero Net Billing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 hover:border-[#FF8300]/40 transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF8300] font-semibold">
                    03 • NET BILLING LEY 21.118
                  </span>
                  <TrendingUp className="w-4 h-4 text-white/40 group-hover:text-[#FF8300] transition-colors" />
                </div>

                <h3 className="text-lg font-normal text-white mb-2">
                  Ahorro & Venta de Excedentes
                </h3>
                <p className="text-xs text-white/60 font-light mb-5 leading-relaxed">
                  Inyectas energía a la red eléctrica oficial y recibes abonos directos en tu boleta mensual.
                </p>

                {/* Financial KPI Display */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 mb-4">
                  <span className="text-[10px] font-mono text-white/50 block mb-1">
                    ESTADO DE INYECCIÓN ACTUAL
                  </span>
                  <div className="text-xl font-medium text-white font-mono flex items-center gap-2">
                    {current.gridKw > 0 ? (
                      <>
                        <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                        <span>+{current.gridKw} kW Inyectando</span>
                      </>
                    ) : (
                      <>
                        <span className="text-white/60 text-sm font-light">{current.gridState}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-xs font-light text-white/70">
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span>Ahorro proyectado mensual:</span>
                    <span className="text-white font-mono font-medium">~$145.000 CLP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Blindaje tarifario SEC:</span>
                    <span className="text-emerald-400 font-mono font-medium">100% Protegido</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/50">
                <span>Certificación Medidor</span>
                <span className="text-white font-semibold">Bidireccional TE-4</span>
              </div>
            </motion.div>

            {/* Card 4: Automatización de Cargas Inteligentes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 hover:border-[#FF8300]/40 transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF8300] font-semibold">
                    04 • SMART LOADS
                  </span>
                  <Sliders className="w-4 h-4 text-white/40 group-hover:text-[#FF8300] transition-colors" />
                </div>

                <h3 className="text-lg font-normal text-white mb-2">
                  Climatización & Cargador EV
                </h3>
                <p className="text-xs text-white/60 font-light mb-5 leading-relaxed">
                  Deriva automáticamente los picos solares hacia la bomba de calor y el vehículo eléctrico.
                </p>

                {/* Smart Appliances Toggles / Status */}
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Flame className="w-4 h-4 text-[#FF8300]" />
                      <div>
                        <span className="text-xs font-medium text-white block">Bomba de Calor</span>
                        <span className="text-[10px] font-mono text-white/50">Consumo: {current.hvacKw} kW</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 text-[10px] font-mono">
                      Solar Auto
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Car className="w-4 h-4 text-blue-400" />
                      <div>
                        <span className="text-xs font-medium text-white block">Cargador EV</span>
                        <span className="text-[10px] font-mono text-white/50">{current.evState}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      current.evKw > 0
                        ? "bg-blue-400/20 text-blue-300 font-semibold"
                        : "bg-white/5 text-white/40"
                    }`}>
                      {current.evKw > 0 ? `${current.evKw} kW` : "Standby"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/50">
                <span>Control por Algoritmos</span>
                <span className="text-[#FF8300] font-semibold">Prioridad Solar</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
