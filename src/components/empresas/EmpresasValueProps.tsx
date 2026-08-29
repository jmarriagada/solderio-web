"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

function CashflowChart() {
  return (
    <div className="w-full bg-['#F7F8FA'] p-5 rounded-2xl border border-black/5 my-5">
      { /* Header & Legend */ }
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-['&FF8300'] block mb-0.5">
            Retorno Proyectado
          </span>
          <h4 className="text-xs font-medium text-['&1F1F1F']">
            Flujo de Caja Acumulado ($)
          </h4>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-black/60">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-['&FF8300']" />
            Payback (~Año 4)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Flujo Positivo
          </span>
        </div>
      </div>

      { /* Responsive SVG Chart with un-distorted vector curve */ }
      <div className="relative w-full h-32 my-1">
        { /* Zero baseline label HTML overlay */ }
        <div className="absolute top-[52%] left-1 -translate-y-1/2 pointer-events-none z-10">
          <span className="text-[10px] font-mono text-black/40 bg-['&F7F8FA']/80 px-1 rounded">
            $0 (Punto de Equilibrio)
          </span>
        </div>

        <svg
          viewBox="0 0 500 120"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="cashflowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#10B981" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#FF8300" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          { /* Dash Zero Line */ }
          <line
            x1="0"
            y1="62"
            x2="500"
            y2="62"
            stroke="#D1D5DB"
            strokeWidth="1"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />

          { /* Area Fill */ }
          <path
            d="M115 95 Q 110 82 180 62 T485 12 L485 62 L15 62 Z"
            fill="url(#cashflowGrad)"
          />

          { /* Main Curve Line */ }
          <path
            d="M15 95 Q 110 82 180 62 T485 12"
            fill="none"
            stroke="#FF8300"
            strokeWidth="3.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          { /* Break-even point circle */ }
          <circle cx="180" cy="62" r="5" fill="#FF8300" stroke="#FFFFFF" strokeWidth="2" />
        </svg>
      </div>

      { /* HTML Year Markers - Crisp typography with 0% distortion */ }
      <div className="grid grid-cols-5 text-center text-[10px] font-mono mt-1 pt-2 border-t border-black/5">
        <span className="text-black/50">Año 0</span>
        <span className="text-black/50">Año 2</span>
        <span className="text-['&FF8300'] font-semibold">Año 4 (★ Flujo +)</span>
        <span className="text-emerald-600">Año 10</span>
        <span className="text-emerald-600 font-medium">Año 25</span>
      </div>

      { /* Footer hint */ }
      <div className="mt-3 flex items-center justify-between text-[11px] text-black/50 font-light">
        <span>Inversión CAPEX / Leasing</span>
        <span className="font-normal text-emerald-600">★ Flujo Neto Positivo &amp; Ganancia Neta</span>
      </div>
    </div>
  );
}

export function EmpresasValueProps() {
  const financialData = {
    title: "Impacto Financiero & ROI",
    subtitle: "Rentabilidad directa sobre el balance operacional",
    badge: "Retorno a Mediano Plazo",
    yields: [
      {
        label: "Payback Promedio",
        value: "3.5 - 4.5 años",
        desc: "Vida útil del sistema de 25+ años",
      },
      {
        label: "TIR Estimada",
        value: "16% - 24%",
        desc: "Tasa interna de retorno libre de riesgo",
      },
      {
        label: "Ahorro OPEX",
        value: "Hasta 75%",
        desc: "Mitigación de alzas de tarifa eléctrica",
      },
    ],
    points: [
      "Protección contra la inflación tarifaria eléctrica en horas punta (BT-4.3 / AT).",
      "Depreciación acelerada instantánea reconocida por el SII.",
      "Reducción del costo nivelado de energéa (LCOE) por debajo de $65/kwh.",
    ],
  };

  return (
    <section className="w-full py-20 md:py-28 px-3 md:px-5 box-border bg-[#F7F8FA] overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-12 md:mb-16"
        >
          <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-[#FF8300] mb-3 block">
            Evaluación para Tomadores de Decisión
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight leading-[1.1] mb-6">
            Por qué la energía solar es una decisión financiera estratégica
          </h2>
          <p className="text-brand-muted text-base md:text-lg font-light leading-relaxed">
            Analizamos los indicadores de retorno, estructuración tributaria y opciones de financiamiento verde que maximizan el valor patrimonial de tu empresa.
          </p>
        </motion.div>

        {/* Financial ROI Standalone Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-[28px] border border-black/5 p-6 md:p-10 shadow-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Context & Bullet points (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] bg-[#FF8300]/10 px-3 py-1 rounded-full">
                    {financialData.badge}
                  </span>
                  <span className="text-xs text-brand-muted font-light">
                    {financialData.subtitle}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-light text-[#1F1F1F] mb-4">
                  {financialData.title}
                </h3>

                {/* Cashflow Curve Chart */}
                <CashflowChart />

                <div className="space-y-3">
                  {financialData.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#FF8300]/10 text-[#FF8300] flex items-center justify-center shrink-0 mt-0.5">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm md:text-base text-[#1F1F1F] font-normal leading-snug">
                        {pt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Key Financial / Performance Metrics (5 cols) */}
            <div className="lg:col-span-5 bg-[#F7F8FA] p-6 md:p-8 rounded-[24px] border border-black/5 flex flex-col justify-between space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-black/50 block mb-2">
                Indicadores Clave del Proyecto
              </span>

              <div className="space-y-4">
                {financialData.yields.map((hl, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 md:p-5 rounded-2xl border border-black/5 shadow-xs flex flex-col"
                  >
                    <span className="text-xs text-brand-muted font-light mb-1">
                      {hl.label}
                    </span>
                    <span className="text-2xl md:text-3xl font-medium text-[#1F1F1F] tracking-tight mb-1">
                      {hl.value}
                    </span>
                    <span className="text-xs text-black/50 font-light">
                      {hl.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
