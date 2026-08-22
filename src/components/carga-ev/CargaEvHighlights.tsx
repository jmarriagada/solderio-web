"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Zap, ShieldCheck, Smartphone, Gauge, Radio, CheckCircle2, ChevronRight, Lock } from "lucide-react";

interface HighlightItem {
  id: string;
  icon: typeof Sun;
  tag: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  metric: string;
  metricLabel: string;
  technicalNote: string;
}

const HIGHLIGHTS: HighlightItem[] = [
  {
    id: "pv-preferred",
    icon: Sun,
    tag: "Prioridad Solar",
    title: "Carga 100% Fotovoltaica con Excedentes",
    tagline: "Aprovecha al máximo cada rayo de sol desde 1.4 kW",
    description:
      "El Smart Charger monitorea la generación de tu planta solar en tiempo real. Cuando tus paneles generan excedentes, el cargador los dirige automáticamente a la batería del vehículo, reduciendo el costo de combustible a $0.",
    features: [
      "Conmutación automática de trifásico a monofásico",
      "Umbral mínimo de carga solar ultra-bajo: solo 1.4 kW",
      "Maximización del autoconsumo sin depender de la red",
    ],
    metric: "1.4 kW",
    metricLabel: "Potencia solar mínima de inicio",
    technicalNote: "Conmutación 1F/3F dinámica compatible con inversores Huawei FusionSolar.",
  },
  {
    id: "dynamic-balancing",
    icon: Gauge,
    tag: "Balanceo Inteligente",
    title: "Gestión Dinámica de Carga Anti-Sobrecarga",
    tagline: "Cero caídas del automático general en tu empalme",
    description:
      "Ajusta automáticamente la corriente entregada al auto según los artefactos encendidos en el hogar o la demanda de tu empresa. Si enciendes bombas de calor, hornos o maquinaria, el cargador reduce su potencia temporalmente para proteger tu instalación.",
    features: [
      "Monitoreo continuo de la capacidad del empalme eléctrico",
      "Evita sobrecostos por aumento de potencia contratada",
      "Carga continua y segura sin interrupciones",
    ],
    metric: "32A",
    metricLabel: "Ajuste dinámico continuo (6A a 32A)",
    technicalNote: "Medición mediante Smart Power Sensor trifásico/monofásico con comunicación Modbus.",
  },
  {
    id: "auth-modes",
    icon: Smartphone,
    tag: "Acceso y Control",
    title: "3 Métodos de Autenticación Flexibles",
    tagline: "Control total vía App, Tarjeta RFID o Bluetooth",
    description:
      "Inicia, pausa o programa tus sesiones de carga con total comodidad. Concede permisos temporales o permanentes a familiares, amigos o colaboradores de tu empresa mediante autorización en la nube.",
    features: [
      "App Móvil: Telemetría en vivo, programación y estadísticas",
      "Tarjetas RFID: Desbloqueo instantáneo 'Tap-to-Charge'",
      "Bluetooth Local: Conexión directa incluso sin señal de internet",
    ],
    metric: "3 en 1",
    metricLabel: "Modos de autenticación integrados",
    technicalNote: "Incluye 2 tarjetas RFID de grado industrial y gestión de usuarios por app.",
  },
  {
    id: "weather-protection",
    icon: ShieldCheck,
    tag: "Seguridad y Clima",
    title: "Protección IP54 & RCD DC 6mA Integrado",
    tagline: "Diseñado para resistir la lluvia y humedad del sur",
    description:
      "Carcasa sellada contra agua y polvo (IP54) con patrón laberíntico de drenaje. Incorpora protección diferencial Tipo A con detección de corriente de fuga en corriente continua (DC 6mA), garantizando seguridad total bajo la norma chilena.",
    features: [
      "Grado de protección IP54 e impacto IK10 para intemperie",
      "Detección de fuga DC 6mA integrada (elimina RCD Tipo B costoso)",
      "Sensores térmicos multi-punto que previenen sobrecalentamientos",
    ],
    metric: "IP54",
    metricLabel: "Resistencia certificada a la lluvia",
    technicalNote: "Cumple con las exigencias de seguridad del Pliego Técnico SEC RIC N°15.",
  },
];

export function CargaEvHighlights() {
  const [activeId, setActiveId] = useState<string>("pv-preferred");
  const activeItem = HIGHLIGHTS.find((h) => h.id === activeId) || HIGHLIGHTS[0];

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[#FF8300] mb-2 block">
          Ingeniería de Vanguardia
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-fg tracking-tight">
          Inteligencia y Seguridad en Cada Kilovatio
        </h2>
        <p className="mt-4 text-sm md:text-base text-[#4A4A4A] leading-relaxed">
          Tecnología de recarga de vehículos eléctricos de alta gama, integrada de forma nativa a tu planta fotovoltaica y sistema de baterías.
        </p>
      </div>

      {/* Interactive Tabs + Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Tab Cards (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {HIGHLIGHTS.map((item) => {
            const Icon = item.icon;
            const isSelected = item.id === activeId;
            return (
              <button
                key={item.id}
                onClick={() => setActiveId(item.id)}
                className={`text-left p-5 rounded-2xl md:rounded-3xl transition-all duration-300 flex items-start gap-4 border cursor-pointer ${
                  isSelected
                    ? "bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] border-[#FF8300]/40 scale-[1.02]"
                    : "bg-white/60 hover:bg-white border-black/5 hover:border-black/10"
                }`}
              >
                <div
                  className={`p-3 rounded-xl transition-colors ${
                    isSelected
                      ? "bg-[#FF8300] text-white shadow-[0_0_15px_rgba(255,131,0,0.3)]"
                      : "bg-black/5 text-brand-fg"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FF8300]">
                      {item.tag}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#FF8300] shadow-[0_0_8px_#FF8300]" />
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-brand-fg mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] line-clamp-1 mt-1">
                    {item.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Card Display (7 cols) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl p-6 md:p-10 border border-black/10 shadow-[0_15px_40px_rgba(0,0,0,0.06)] flex flex-col justify-between"
            >
              {/* Card top */}
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-black/5 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-[#FF8300]/10 text-[#FF8300]">
                      <activeItem.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#FF8300]">
                        {activeItem.tag}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-brand-fg">
                        {activeItem.title}
                      </h3>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <div className="text-2xl font-bold text-brand-fg">{activeItem.metric}</div>
                    <div className="text-[11px] text-[#6B7280] font-light">{activeItem.metricLabel}</div>
                  </div>
                </div>

                <p className="text-sm md:text-base text-[#4A4A4A] leading-relaxed mb-6">
                  {activeItem.description}
                </p>

                {/* Features list */}
                <div className="space-y-3 mb-8">
                  {activeItem.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs md:text-sm text-brand-fg font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card bottom banner */}
              <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <ShieldCheck className="w-4 h-4 text-[#FF8300]" />
                  <span>{activeItem.technicalNote}</span>
                </div>
                <span className="text-xs font-medium text-[#FF8300] hidden sm:inline">
                  Estándar SoldeRío
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
