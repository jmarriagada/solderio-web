"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Sun, BatteryCharging, Power, AlertTriangle, ShieldCheck, ArrowRight, Info } from "lucide-react";

interface OperatingMode {
  id: string;
  number: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  flows: {
    solar: "charging" | "direct" | "idle";
    bess: "discharging" | "charging" | "standby";
    grid: "importing" | "zero" | "disconnected";
    diesel: "off" | "running_optimum" | "standby";
  };
  metrics: {
    label: string;
    value: string;
    info?: string;
  }[];
  insight: string;
}

const MODES: OperatingMode[] = [
  {
    id: "peak-shaving",
    number: "01",
    name: "Recorte Horario Punta (Peak Shaving)",
    badge: "18:00 - 22:00 HRS · TARIFAS BT4.3 / AT4.3",
    tagline: "Suprime el peak de demanda máxima que factura la distribuidora.",
    description:
      "Durante la ventana crítica de Horario Punta (18:00 a 22:00 hrs de abril a septiembre), el sistema de gestión de almacenamiento (BMS), instruye la descarga programada del BESS para abastecer los motores, bombas y estanques de frío. Ante el medidor de la distribuidora, la potencia demandada desciende a su mínimo de valle, eliminando el cargo de potencia que oscila entre $15.000 y $40.000 CLP/kW/mes.",
    flows: {
      solar: "idle",
      bess: "discharging",
      grid: "zero",
      diesel: "off",
    },
    metrics: [
      {
        label: "Cargo $/kW en Punta",
        value: "$0 Facturado",
        info: "Al reducir a 0 kW la potencia registrada por el medidor entre las 18:00 y 22:00 hrs (abril a septiembre), se elimina el sobrecargo anual de potencia facturado en tarifas BT4.3 y AT4.3.",
      },
      {
        label: "Tiempo de Respuesta",
        value: "<10 ms",
        info: "Velocidad de conmutación estática (STS) para asumir la demanda interna sin interrupciones operativas ni caídas de tensión.",
      },
      {
        label: "Potencia Inyectada antes del medidor (BTM)",
        value: "Hasta 300 kW",
        info: "Potencia suministrada directamente a las cargas de la faena antes del medidor de la distribuidora, eliminando peajes y cargos de distribución.",
      },
    ],
    insight:
      "En una lechería u operadora de frío con 80 kW de potencia máxima en punta, este modo ahorra entre $14.4M y $38.4M CLP al año de forma 100% automatizada.",
  },
  {
    id: "arbitraje-tou",
    number: "02",
    name: "Arbitraje Energético (Tarifas TOU)",
    badge: "CICLO DIURNO / NOCTURNO 24/7",
    tagline: "Carga a costo marginal $0 o tarifa valle; descarga en turnos de alto costo.",
    description:
      "El sistema almacena los excedentes de generación solar diurna (11:00 a 16:00 hrs) a costo marginal $0, o carga desde la red durante la madrugada en bloques de tarifa valle barata. La energía almacenada se inyecta en los turnos productivos vespertinos y nocturnos, evitando pagar peajes de transmisión y distribución ($160 a $210 CLP/kWh).",
    flows: {
      solar: "charging",
      bess: "charging",
      grid: "zero",
      diesel: "off",
    },
    metrics: [
      {
        label: "Margen de Arbitraje",
        value: "+$110-$145 CLP/kWh",
        info: "Diferencial económico neto entre el costo de generar o almacenar energía en horario de bajo costo y el valor evitado al consumirla en bloques horarios de alta tarifa ($160 a $210 CLP/kWh).",
      },
      {
        label: "Eficiencia Round-Trip",
        value: "≥ 95% RTE",
        info: "La Eficiencia de Ida y Vuelta o Round-Trip Efficiency (RTE) representa el porcentaje de energía que se puede recuperar de un sistema de almacenamiento tras un ciclo completo de carga y descarga. Alcanzar un RTE ≥ 95% es un estándar de rendimiento extremadamente alto en la industria energética.",
      },
      {
        label: "Degradación Cíclica",
        value: "<0.02% / ciclo",
        info: "Pérdida porcentual de capacidad por ciclo completo de carga y descarga a 0.5C. Permite proyectar más de 6.000 ciclos manteniendo más del 80% de capacidad retenida.",
      },
    ],
    insight:
      "Captura hasta 3 veces más valor por cada kWh solar respecto a inyectarlo a la red bajo Net Billing ($55-$65 CLP/kWh al precio nudo).",
  },
  {
    id: "microred-isla",
    number: "03",
    name: "Microred Autónoma (STS <10ms)",
    badge: "PERTURBACIÓN O CORTE DE RED EXTERNA",
    tagline: "Transferencia estática ultra-rápida sin caída de tensión ni parada de PLCs.",
    description:
      "Ante una caída de tensión («sag»), fluctuación de frecuencia o corte intempestivo en la línea de distribución, el conmutador estático STS abre el interruptor de acople en menos de 10 milisegundos (<10ms). El inversor Grid-Forming asume la referencia de voltaje y frecuencia instantáneamente, sosteniendo la oxigenación forzada, compresores y control sin que la maquinaria lo perciba.",
    flows: {
      solar: "direct",
      bess: "discharging",
      grid: "disconnected",
      diesel: "standby",
    },
    metrics: [
      {
        label: "Tiempo Conmutación STS",
        value: "< 10 ms",
        info: "Velocidad de transferencia del conmutador estático (<10ms). Al ser inferior a un semiciclo de red (20ms a 50Hz), los variadores de frecuencia y PLCs no experimentan reinicio.",
      },
      {
        label: "Estabilidad de Frecuencia",
        value: "50 Hz ±0.05 Hz",
        info: "Capacidad del inversor Grid-Forming para crear y sostener una referencia de frecuencia ultraestable de 50 Hz durante la operación en isla.",
      },
      {
        label: "THD Tensión en Isla",
        value: "< 2.5%",
        info: "Distorsión armónica total de voltaje inferior al 2.5%, garantizando una onda sinusoidal pura que protege motores y electrónica de potencia sensible.",
      },
    ],
    insight:
      "Vital para pisciculturas RAS y salas de ordeño robótico: previene mortandades biológicas masivas y bloqueos de variadores de frecuencia.",
  },
  {
    id: "hibridacion-diesel",
    number: "04",
    name: "Hibridación Diésel Inteligente",
    badge: "CORTE PROLONGADO Y GESTIÓN DE EMERGENCIA",
    tagline: "El generador diésel opera solo en su punto óptimo (>75% de carga), ahorrando 85% de combustible.",
    description:
      "Si el corte de red se prolonga y el estado de carga (SoC) de la batería desciende al 20%, el sistema BESS envía comando de arranque automático (ATS) al grupo electrógeno. El generador nunca alimenta cargas fluctuantes directamente: opera a carga constante y máxima eficiencia térmica (>75%), recargando el BESS y apagándose de inmediato una vez completado el ciclo.",
    flows: {
      solar: "idle",
      bess: "charging",
      grid: "disconnected",
      diesel: "running_optimum",
    },
    metrics: [
      {
        label: "Reducción Horas Diésel",
        value: "Hasta 85%",
        info: "Reducción en horas de marcha del generador al utilizarlo únicamente para recargar el BESS a régimen óptimo en lugar de alimentar cargas variables continuas.",
      },
      {
        label: "Eficiencia Combustible",
        value: "+38% kWh/L",
        info: "Mejora en los kWh generados por cada litro de diésel al operar el grupo electrógeno en su punto de mayor eficiencia térmica (>75% de carga nominal).",
      },
      {
        label: "Costo Diésel Evitado",
        value: "$380-$460 CLP/kWh",
        info: "Ahorro económico directo por cada kWh generado por el sistema Solar + BESS frente al costo de generación con combustible diésel.",
      },
    ],
    insight:
      "Elimina la operación ineficiente a baja carga del generador (que produce carbonización y fallas) y minimiza el riesgo logístico de camiones cisterna en faenas rurales.",
  },
];

export function BessOperatingModes() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeInfoMetric, setActiveInfoMetric] = useState<string | null>(null);
  const current = MODES[activeTab];

  return (
    <section id="modos-operacion" className="w-full py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#141414] text-white relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/3 right-1/4 w-[700px] h-[400px] bg-[#FF8300]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-light tracking-tight leading-[1.15] mb-5 text-white">
            4 Modos Operativos
          </h2>
          <p className="text-base md:text-lg text-white/70 font-light leading-relaxed">
            Arquitectura de control multinivel: sincronización instantánea entre generación solar, almacenamiento LiFePO4, red de distribución y respaldo diésel.
          </p>
        </motion.div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {MODES.map((mode, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setActiveTab(idx);
                  setActiveInfoMetric(null);
                }}
                className={`px-5 py-3 rounded-full text-xs md:text-sm font-light whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-2.5 ${
                  isActive
                    ? "bg-[#FF8300] text-white shadow-lg shadow-[#FF8300]/25 font-normal"
                    : "bg-[#1F1F1F] text-white/70 hover:text-white hover:bg-[#252525] border border-white/10"
                }`}
              >
                <span className="font-mono text-[11px] opacity-70">{mode.number}</span>
                <span>{mode.name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Mode Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#1A1A1A] rounded-[28px] border border-white/15 p-6 md:p-10 shadow-2xl">
          {/* Left: Mode Description & Real-Time Node Flow (7 cols) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF8300]/15 border border-[#FF8300]/30 text-[11px] font-mono text-[#FF8300] uppercase mb-4">
                  {current.badge}
                </div>
                <h3 className="text-2xl md:text-3xl font-light text-white tracking-tight leading-snug mb-3">
                  {current.tagline}
                </h3>
                <p className="text-xs md:text-sm text-white/70 font-light leading-relaxed mb-6 whitespace-pre-line">
                  {current.description}
                </p>

                {/* Flow Indicators Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {/* Solar Node */}
                  <div className="bg-black/30 border border-white/10 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-white/60 mb-1">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Solar FV</span>
                    </div>
                    <span
                      className={`text-[11px] font-mono font-medium block uppercase ${
                        current.flows.solar === "charging"
                          ? "text-emerald-400"
                          : current.flows.solar === "direct"
                          ? "text-amber-400"
                          : "text-white/40"
                      }`}
                    >
                      {current.flows.solar === "charging" ? "Genera & Carga" : current.flows.solar === "direct" ? "Alimenta Carga" : "Standby"}
                    </span>
                  </div>

                  {/* BESS Node */}
                  <div className="bg-black/30 border border-white/10 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-white/60 mb-1">
                      <BatteryCharging className="w-3.5 h-3.5 text-[#FF8300]" />
                      <span>BESS LiFePO4</span>
                    </div>
                    <span
                      className={`text-[11px] font-mono font-medium block uppercase ${
                        current.flows.bess === "discharging"
                          ? "text-[#FF8300]"
                          : current.flows.bess === "charging"
                          ? "text-emerald-400"
                          : "text-white/40"
                      }`}
                    >
                      {current.flows.bess === "discharging" ? "Descargando" : current.flows.bess === "charging" ? "Cargando" : "Standby"}
                    </span>
                  </div>

                  {/* Grid Node */}
                  <div className="bg-black/30 border border-white/10 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-white/60 mb-1">
                      <Power className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Red Pública</span>
                    </div>
                    <span
                      className={`text-[11px] font-mono font-medium block uppercase ${
                        current.flows.grid === "zero"
                          ? "text-emerald-400"
                          : current.flows.grid === "disconnected"
                          ? "text-rose-400"
                          : "text-cyan-400"
                      }`}
                    >
                      {current.flows.grid === "zero" ? "Demanda 0 kW" : current.flows.grid === "disconnected" ? "Aislada (STS)" : "Conectada"}
                    </span>
                  </div>

                  {/* Diesel Node */}
                  <div className="bg-black/30 border border-white/10 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-white/60 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Grupo Diésel</span>
                    </div>
                    <span
                      className={`text-[11px] font-mono font-medium block uppercase ${
                        current.flows.diesel === "running_optimum"
                          ? "text-amber-400"
                          : current.flows.diesel === "standby"
                          ? "text-white/60"
                          : "text-white/40"
                      }`}
                    >
                      {current.flows.diesel === "running_optimum" ? "Óptimo >75%" : current.flows.diesel === "standby" ? "Listo ATS" : "Apagado"}
                    </span>
                  </div>
                </div>

                {/* Insight Callout */}
                <div className="bg-[#FF8300]/10 border border-[#FF8300]/25 rounded-2xl p-4 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#FF8300] shrink-0 mt-0.5" />
                  <p className="text-xs md:text-sm text-white/90 font-light leading-relaxed">
                    {current.insight}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Technical Metrics Display (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#232323] to-[#1C1C1C] rounded-2xl border border-white/10 p-6 md:p-8 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-6">
              Métricas Operativas del Modo {current.number}
            </span>

            <div className="space-y-4 mb-6">
              {current.metrics.map((m) => {
                const isOpen = activeInfoMetric === `${current.id}-${m.label}`;
                return (
                  <div
                    key={m.label}
                    className="flex items-center justify-between gap-4 pb-3 border-b border-white/10 relative"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs text-white/70 font-light">{m.label}</span>
                      {m.info && (
                        <div className="relative inline-flex items-center shrink-0">
                          <button
                            type="button"
                            onMouseEnter={() => setActiveInfoMetric(`${current.id}-${m.label}`)}
                            onMouseLeave={() => setActiveInfoMetric(null)}
                            onClick={() =>
                              setActiveInfoMetric(
                                isOpen ? null : `${current.id}-${m.label}`
                              )
                            }
                            className="text-white/40 hover:text-[#FF8300] transition-colors p-1 rounded-full hover:bg-white/10 cursor-pointer focus:outline-none"
                            aria-label={`Información sobre ${m.label}`}
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                                transition={{ duration: 0.15 }}
                                className="absolute bottom-full left-0 mb-2.5 z-50 w-72 sm:w-80 p-3.5 rounded-xl bg-[#141414] border border-[#FF8300]/40 shadow-[0_12px_40px_rgba(0,0,0,0.85)] text-white/90 text-xs font-light leading-relaxed backdrop-blur-xl pointer-events-none"
                              >
                                <div className="font-mono text-[10px] uppercase tracking-wider text-[#FF8300] font-medium mb-1.5 flex items-center gap-1.5">
                                  <Info className="w-3 h-3 text-[#FF8300]" />
                                  <span>{m.label}</span>
                                </div>
                                <p className="text-white/80 text-[11px] leading-relaxed">
                                  {m.info}
                                </p>
                                <div className="absolute -bottom-1 left-2.5 w-2.5 h-2.5 bg-[#141414] border-b border-r border-[#FF8300]/40 rotate-45" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                    <span className="text-sm md:text-base font-mono font-medium text-white shrink-0 text-right">
                      {m.value}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="bg-black/40 rounded-xl p-4 border border-white/10">
              <span className="text-[11px] font-medium text-white/80 block mb-1">
                Conmutador Estático STS Integrado
              </span>
              <p className="text-[11px] text-white/60 font-light leading-relaxed">
                Transición sincrónica sin corte mecánico. Mantiene el ángulo de fase y voltaje nominal durante la conmutación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
