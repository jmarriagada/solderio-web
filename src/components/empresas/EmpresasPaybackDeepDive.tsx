"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MorphIcon } from "morphicons/react";
import {
  Coins as CoinsIconNode,
  Sun as SunIconNode,
  Zap as ZapIconNode,
  FileText as FileTextIconNode,
  Check as CheckIconNode,
  type IconNode,
} from "lucide";
import {
  ChevronDown,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface FactorItem {
  id: string;
  icon: IconNode;
  badge: string;
  title: string;
  description: string;
  highlight: string;
  impactTag: string;
}

const FACTORS: FactorItem[] = [
  {
    id: "capex",
    icon: CoinsIconNode,
    badge: "Factor 1 · Inversión Inicial",
    title: "Costo Inicial del Sistema (CAPEX Llave en Mano)",
    description:
      "Considera el suministro e instalación de módulos N-Type TOPCon bifaciales de alta eficiencia, inversores industriales certificados, protecciones AC/DC normadas y la tramitación integral de conexión SEC TE-4 ante la distribuidora.",
    highlight:
      "Financiable 100% vía Leasing Solar o Crédito Verde bancario: el ahorro mensual paga la cuota desde el primer día.",
    impactTag: "Impacto en Payback: Base de amortización",
  },
  {
    id: "consumo",
    icon: SunIconNode,
    badge: "Factor 2 · Perfil Operacional",
    title: "Perfil y Horario de Consumo Energético",
    description:
      "A mayor concentración del consumo eléctrico durante las horas de luz diurna (8:00 a 18:00 hrs), mayor es el porcentaje de autoconsumo directo in-situ. Cada kWh generado reemplaza la compra a tarifa completa de red.",
    highlight:
      "Empresas con operación diurna constante (lecherías, talleres, oficinas, frigoríficos, packing) logran las mayores tasas de autoconsumo.",
    impactTag: "Impacto en Payback: Acelera entre 6 a 12 meses",
  },
  {
    id: "tarifas",
    icon: ZapIconNode,
    badge: "Factor 3 · Estructura Tarifaria",
    title: "Tarifas Eléctricas y Horario Punta (BT-4.3 / AT)",
    description:
      "En el sur, las tarifas comerciales de la distribuidora eléctrica con medición horaria aplican severos recargos por demanda de potencia máxima en horario punta de invierno (18:00 a 22:00 hrs de abril a septiembre).",
    highlight:
      "Integrar almacenamiento BESS inteligente permite 'Peak Shaving': descargar baterías en horas punta eliminando el sobrecargo en la factura.",
    impactTag: "Impacto en Payback: Ahorro de hasta 40% adicional en OpEx",
  },
  {
    id: "sii",
    icon: FileTextIconNode,
    badge: "Factor 4 · Acelerador Fiscal",
    title: "Escudo Tributario: Depreciación Instantánea (SII Art. 31 LIR)",
    description:
      "Bajo la Ley de Modernización Tributaria de Chile, las empresas pueden rebajar el 100% del valor de la planta solar de su base imponible de Primera Categoría (tasa del 27%) en el primer ejercicio comercial en que se adquiere el activo.",
    highlight:
      "Representa una inyección de liquidez fiscal inmediata que acorta drásticamente el período de recuperación del capital invertido.",
    impactTag: "Impacto en Payback: Reduce el retorno a menos de 3 años",
  },
];

export function EmpresasPaybackDeepDive() {
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
    <section className="w-full py-20 md:py-28 px-3 md:px-5 box-border bg-[#F7F8FA] overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mb-14"
        >
          <span className="text-xs md:text-sm font-light uppercase tracking-widest text-[#FF8300] mb-3 md:mb-4 block">
            Rentabilidad y Retorno de Capital
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight leading-[1.1] mb-6">
            ¿Cuánto tiempo se tarda una empresa en recuperar su inversión en paneles solares?
          </h2>
          <p className="text-base md:text-lg text-black/60 font-light leading-relaxed">
            En la macrozona sur de Chile, una planta solar comercial e industrial amortiza su costo de capital en un período promedio de <strong className="font-medium text-[#1F1F1F]">3.2 a 4.5 años</strong>. Considerando el beneficio tributario de depreciación instantánea ante el SII, el retorno efectivo se reduce a <strong className="font-medium text-[#1F1F1F]">menos de 3 años</strong>.
          </p>
        </motion.div>

        {/* 4 Pillars Grid (Original con MorphIcon y descripción colapsable) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {FACTORS.map((factor, idx) => {
            const isExpanded = expandedId === factor.id;
            const isHovered = hoveredId === factor.id;
            const isChecked = !!checkedCards[factor.id] || isHovered;

            return (
              <motion.div
                key={factor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                onMouseEnter={() => setHoveredId(factor.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="bg-[#FDFFFE] rounded-[24px] border border-black/5 p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#FF8300]/20 transition-all duration-300 group"
              >
                <div>
                  {/* Top Badge & Icon with MorphIcon */}
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF8300] bg-[#FF8300]/10 px-3 py-1 rounded-full">
                      {factor.badge}
                    </span>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCheck(factor.id);
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={isChecked ? `Factor ${factor.badge} verificado` : `Verificar factor ${factor.badge}`}
                      className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all duration-300 cursor-pointer select-none ${
                        isChecked
                          ? "bg-[#FF8300]/15 border-[#FF8300]/30 text-[#FF8300] shadow-[0_0_15px_rgba(255,131,0,0.15)] scale-105"
                          : "bg-[#F7F8FA] border-black/5 text-[#1F1F1F] group-hover:text-[#FF8300] group-hover:border-[#FF8300]/20"
                      }`}
                      title={isChecked ? "Factor verificado (click para alternar)" : "Click o sitúa el cursor para animar con MorphIcon"}
                    >
                      <MorphIcon
                        icon={isChecked ? CheckIconNode : factor.icon}
                        spring="snappy"
                        size={20}
                        strokeWidth={2}
                        className="transition-colors"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-light text-[#1F1F1F] tracking-tight leading-snug mb-3">
                    {factor.title}
                  </h3>

                  {/* Collapsible Description under Title */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs md:text-sm text-black/60 font-light leading-relaxed mb-3">
                          {factor.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={() => toggleExpand(factor.id)}
                    className="text-xs font-mono text-black/40 hover:text-[#FF8300] transition-colors flex items-center gap-1 cursor-pointer select-none mb-4"
                  >
                    <span>{isExpanded ? "Ocultar detalle" : "Ver detalle"}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Highlight pill */}
                  <div className="bg-[#F7F8FA] border border-black/5 rounded-xl p-3.5 mb-5 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-black/80 font-normal leading-relaxed">
                      {factor.highlight}
                    </p>
                  </div>
                </div>

                {/* Bottom Tag */}
                <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-black/50">
                    {factor.impactTag}
                  </span>
                  <span className="text-[#FF8300] opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Benchmark Box: Planta C&I Típica de 100 kWp en el Sur */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-br from-[#1F1F1F] to-[#141414] text-white rounded-[28px] p-6 md:p-10 lg:p-12 shadow-xl border border-white/10 mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Case Analysis (7 cols) */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] bg-[#FF8300]/20 px-3 py-1 rounded-full border border-[#FF8300]/30">
                  Caso Modelo · Planta Solar 100 kWp en el Sur
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight leading-[1.2] mb-4 text-white">
                Una vez recuperada la inversión, tu empresa disfruta de más de 20 años de electricidad a costo marginal cero.
              </h3>
              <p className="text-xs md:text-sm text-white/70 font-light leading-relaxed mb-6">
                Los módulos solares N-Type TOPCon de SoldeRío cuentan con garantía de rendimiento lineal por 30 años. Tras el período de amortización, el costo nivelado de energía (LCOE) desciende por debajo de <strong className="text-white font-medium">$48 por kWh</strong>, protegiendo a la empresa de la inflación eléctrica de la red que ya supera los <strong className="text-white font-medium">$190 - $240 por kWh</strong>.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-light text-white/80">
                <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>30 Años de Garantía de Generación</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
                  <TrendingUp className="w-4 h-4 text-[#FF8300]" />
                  <span>Flujo de Caja Positivo desde el Año 4</span>
                </div>
              </div>
            </div>

            {/* Right Col: Comparative Metrics Table (5 cols) */}
            <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 md:p-6 space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs text-white/60 font-light">Inversión Llave en Mano</span>
                <span className="text-sm md:text-base font-mono font-medium text-white">$65M - $78M CLP</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs text-white/60 font-light">Ahorro Anual Estimado</span>
                <span className="text-sm md:text-base font-mono font-medium text-emerald-400">+$18M - $22M CLP/año</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs text-white/60 font-light">Payback Simple (Sin Escudo)</span>
                <span className="text-sm md:text-base font-mono font-medium text-white/90">3.8 - 4.2 años</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 bg-[#FF8300]/15 -mx-2 px-2 py-2 rounded-xl border border-[#FF8300]/30">
                <span className="text-xs text-white font-medium">★ Payback con Depreciación SII</span>
                <span className="text-sm md:text-base font-mono font-bold text-[#FF8300]">2.8 - 3.2 años</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-white/60 font-light">Beneficio Neto Acumulado (25a)</span>
                <span className="text-base md:text-lg font-mono font-bold text-emerald-400">+$380M+ CLP</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Banner CTA "Simular Retorno de Mi Empresa" (Clonado idéntico a HogarLifestyleBenefits con isotipo) */}
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

          <div className="relative z-10 flex-1">
            <h4 className="text-lg sm:text-xl lg:text-2xl font-light mb-1.5 text-white xl:whitespace-nowrap">
              ¿Quieres saber la amortización de un proyecto solar con tu última factura de luz?
            </h4>
            <p className="text-white/70 text-sm md:text-base font-light max-w-3xl">
              Nuestros ingenieros calculan y simulan tu curva horaria de carga, tarifa de la distribuidora eléctrica y escudo tributario.
            </p>
          </div>

          <Link
            href="/cotizacion"
            className="group relative z-10 whitespace-nowrap px-8 py-3.5 rounded-full bg-white text-black font-light text-xs md:text-sm hover:bg-[#FF8300] hover:text-white transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(255,131,0,0.4)] cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <span>Simular Proyecto Solar</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
