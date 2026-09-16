"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MorphIcon } from "morphicons/react";
import {
  Sun as SunIconNode,
  Droplets as DropletsIconNode,
  TrendingUp as TrendingUpIconNode,
  ShieldCheck as ShieldCheckIconNode,
  Check as CheckIconNode,
  type IconNode,
} from "lucide";
import {
  ArrowRight,
  ChevronDown,
} from "lucide-react";

interface LifestyleBenefit {
  id: string;
  icon: IconNode;
  badge: string;
  metric: string;
  metricSub: string;
  title: string;
  shortSummary: string;
  expandedDetail: string;
  tags: string[];
}

const LIFESTYLE_BENEFITS: LifestyleBenefit[] = [
  {
    id: "calefaccion",
    icon: SunIconNode,
    badge: "Confort Térmico",
    metric: "Climatización 100% limpia",
    metricSub: "Cero Humo",
    title: "Calefacción sin culpa en los inviernos más fríos",
    shortSummary:
      "Alimenta bombas de calor aerotérmicas y aire acondicionado sin disparar tu boleta a fin de mes.",
    expandedDetail:
      "Despídete del hollín de la leña, del costo mensual del pellet y almacenaje. La generación solar cubre la demanda de tus equipos de climatización durante las horas diurnas y compensa el consumo nocturno bajo la Ley Net Billing.",
    tags: ["Aerotermia / Inverter", "Reemplazo de Leña", "Costo Cero Diurno"],
  },
  {
    id: "blindaje",
    icon: ShieldCheckIconNode,
    badge: "Estabilidad",
    metric: "Tarifa Fija",
    metricSub: "Por los próximos 25+ años",
    title: "Blindaje total ante las alzas históricas de luz",
    shortSummary:
      "Congela tu costo energético a costo marginal cero y protégete de las subidas de más del 50% en la distribuidora.",
    expandedDetail:
      "Frente al descongelamiento tarifario a nivel nacional, generar tu propia energía solar te independiza de las fluctuaciones de la distribuidora, garantizando estabilidad financiera para el presupuesto familiar a largo plazo.",
    tags: ["Inmune a distribuidora", "Ley Netbilling", "Retorno 4.5-5.5a"],
  },
  {
    id: "plusvalia",
    icon: TrendingUpIconNode,
    badge: "Patrimonio",
    metric: "+3% a +5%",
    metricSub: "Mayor tasación comercial",
    title: "Incremento inmediato en el valor de tu propiedad",
    shortSummary:
      "Tu casa o parcela se valoriza en el mercado inmobiliario como un inmueble moderno, autónomo y eficiente.",
    expandedDetail:
      "Las viviendas con plantas solares inscritas formalmente ante la SEC (TE-1 y TE-4) y equipamiento de respaldo LiFePO4 tienen una plusvalía superior y costos operacionales mínimos, haciéndolas sumamente atractivas para compradores.",
    tags: ["Tasación Inmobiliaria", "Certificación SEC TE-4", "Vida Útil 30 Años"],
  },
  {
    id: "agua",
    icon: DropletsIconNode,
    badge: "Seguridad Hídrica",
    metric: "Respaldo instantáneo",
    metricSub: "En menos de 0,01 segundos",
    title: "Agua de pozo garantizada aunque un temporal corte la red",
    shortSummary:
      "Tu bomba de pozo profundo, refrigerador, caldera y wifi continúan activos ante caídas de árboles o postes.",
    expandedDetail:
      "El corazón de una parcela es su pozo de agua potable. Con baterías de litio LiFePO4 y conmutación automática STS en menos de 10 milisegundos, tu familia mantiene presión constante y autonomía hídrica de 1 a 3 días durante temporales.",
    tags: ["Bomba de Pozo", "Batería LiFePO4", "Autonomía en Temporal"],
  },
];

export function HogarLifestyleBenefits() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [checkedCards, setCheckedCards] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleCheck = (id: string) => {
    setCheckedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="w-full py-16 md:py-24 px-3 md:px-5 box-border bg-[#F7F8FA] overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section - Minimal & Graphical */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center mb-12 md:mb-16"
        >
          <span className="text-xs md:text-sm font-light uppercase tracking-widest text-[#FF8300] mb-3 md:mb-4 block">
            Confort y Estilo de Vida
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight leading-[1.1] mb-4">
            La tranquilidad de un hogar cálido y protegido de las alzas de luz
          </h2>
          <p className="text-base md:text-lg text-black/60 font-light leading-relaxed max-w-3xl mx-auto">
            Energía pensada para la vida real en el sur: calefacción limpia sin culpa, agua de pozo garantizada en temporales y bloqueo definitivo de tarifas eléctricas.
          </p>
        </motion.div>

        {/* 4 Graphical Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {LIFESTYLE_BENEFITS.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            const isHovered = hoveredId === item.id;
            const isChecked = !!checkedCards[item.id] || isHovered;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="bg-[#FDFFFE] rounded-[24px] border border-black/5 p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#FF8300]/20 transition-all duration-300 group cursor-default"
              >
                <div>
                  {/* Top Row: Badge + MorphIcon */}
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF8300] bg-[#FF8300]/10 px-3 py-1 rounded-full">
                      {item.badge}
                    </span>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCheck(item.id);
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={isChecked ? `Beneficio ${item.badge} verificado` : `Verificar beneficio ${item.badge}`}
                      className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all duration-300 cursor-pointer select-none ${
                        isChecked
                          ? "bg-[#FF8300]/15 border-[#FF8300]/30 text-[#FF8300] shadow-[0_0_15px_rgba(255,131,0,0.15)] scale-105"
                          : "bg-[#F7F8FA] border-black/5 text-[#1F1F1F] group-hover:text-[#FF8300] group-hover:border-[#FF8300]/20"
                      }`}
                      title={isChecked ? "Beneficio verificado (click para alternar)" : "Click o sitúa el cursor para animar con MorphIcon"}
                    >
                      <MorphIcon
                        icon={isChecked ? CheckIconNode : item.icon}
                        spring="snappy"
                        size={20}
                        strokeWidth={2}
                        className="transition-colors"
                      />
                    </div>
                  </div>

                  {/* Prominent Visual Metric */}
                  <div className="mb-3">
                    <span className="text-2xl md:text-3xl font-medium text-[#1F1F1F] tracking-tight block">
                      {item.metric}
                    </span>
                    <span className="text-xs font-mono text-[#FF8300]">
                      {item.metricSub}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-normal text-[#1F1F1F] tracking-tight leading-snug mb-2">
                    {item.title}
                  </h3>

                  {/* Short Summary */}
                  <p className="text-[13px] md:text-[15px] text-black/60 font-light leading-relaxed mb-4">
                    {item.shortSummary}
                  </p>

                  {/* Quick Feature Pills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-mono text-black/60 bg-[#F7F8FA] border border-black/5 px-2.5 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Collapsible Detail Paragraph */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-[13px] text-black/70 font-light leading-relaxed pt-2 pb-3 border-t border-black/5">
                          {item.expandedDetail}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom Toggle Bar */}
                <div className="pt-3 border-t border-black/5 flex items-center">
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className="text-xs font-mono text-black/40 hover:text-[#FF8300] transition-colors flex items-center gap-1 cursor-pointer select-none py-1"
                  >
                    <span>{isExpanded ? "Ocultar detalle" : "Ver detalle"}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Banner CTA "Calcula el ahorro exacto para tu casa o parcela en 2 minutos"
            Exact style of "¿Quieres dimensionar tu proyecto solar?" in HogarAttributes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 md:p-10 rounded-[24px] bg-gradient-to-r from-[#1F1F1F] to-[#2B2B2B] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl border border-white/10 relative overflow-hidden"
        >
          {/* Subtle Orange Glow Ambient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8300]/15 rounded-full blur-3xl pointer-events-none" />

          {/* SoldeRío Official Watermark Icon over orange glow, behind button, cut at the bottom-right corner with 10% opacity */}
          <div className="absolute -bottom-16 -right-16 md:-bottom-24 md:-right-24 pointer-events-none z-0 opacity-10 flex items-center justify-center select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-solderio.svg"
              alt=""
              aria-hidden="true"
              className="w-[280px] sm:w-[340px] md:w-[440px] h-auto object-contain pointer-events-none"
            />
          </div>

          <div className="relative z-10 text-center sm:text-left">
            <h4 className="text-xl md:text-2xl font-light mb-1.5">
              Calcula el ahorro exacto para tu casa o parcela en 2 minutos
            </h4>
            <p className="text-white/70 text-base font-light">
              Ingresa el monto de tu última cuenta de luz y nuestro algoritmo diseñará una planta solar preliminar según la radiación de tu comuna.
            </p>
          </div>

          <Link
            href="/cotizacion"
            className="group relative z-10 whitespace-nowrap px-8 py-3.5 rounded-full bg-white text-black font-light text-[14px] md:text-sm hover:bg-[#FF8300] hover:text-white transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(255,131,0,0.4)] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Iniciar Cotización</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
