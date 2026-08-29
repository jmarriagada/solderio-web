"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Landmark, ShieldCheck, Award, ArrowUpRight } from "lucide-react";

function CashflowChart() {
  return (
    <div className="w-full bg-[#F7F8FA] p-4 md:p-5 rounded-2xl border border-black/5 my-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF8300] block mb-0.5">
            Retorno Proyectado
          </span>
          <h4 className="text-xs font-medium text-[#1F1F1F]">
            Flujo de Caja Acumulado ($)
          </h4>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-black/60">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#FF8300]" />
            Payback (~Año 4)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Flujo Positivo
          </span>
        </div>
      </div>

      <div className="relative w-full h-28">
        <svg
          viewBox="0 0 400 120"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="cashflowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Dash Zero Line */}
          <line
            x1="0"
            y1="75"
            x2="400"
            y2="75"
            stroke="#D1D5DB"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x="5" y="70" fill="#9CA3AF" fontSize="9" fontFamily="monospace">
            $0 (Punto de Equilibrio)
          </text>

          {/* Area Fill under curve */}
          <path
            d="M 15 105 Q 80 95 140 75 T 390 15 L 390 75 L 15 75 Z"
            fill="url(#cashflowGrad)"
          />

          {/* Main Curve Line */}
          <path
            d="M 15 105 Q 80 95 140 75 T 390 15"
            fill="none"
            stroke="#FF8300"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Break-even point */}
          <circle cx="140" cy="75" r="5" fill="#FF8300" stroke="#FFFFFF" strokeWidth="2" />

          {/* Year Labels */}
          <text x="15" y="116" fill="#6B7280" fontSize="9" textAnchor="middle">Año 0</text>
          <text x="80" y="116" fill="#6B7280" fontSize="9" textAnchor="middle">Año 2</text>
          <text x="140" y="116" fill="#FF8300" fontSize="9" fontWeight="bold" textAnchor="middle">Año 4 (★ Flujo +)</text>
          <text x="260" y="116" fill="#10B981" fontSize="9" textAnchor="middle">Año 10</text>
          <text x="385" y="116" fill="#10B981" fontSize="9" textAnchor="middle">Año 25</text>
        </svg>
      </div>

      <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between text-[11px] text-black/50 font-light">
        <span>CAPEX / Cuota Leasing</span>
        <span className="font-normal text-emerald-600">★ Flujo Neto Positivo & Ganancia Neta</span>
      </div>
    </div>
  );
}

export function EmpresasValueProps() {
  const [activeTab, setActiveTab] = useState(0);

  const drivers = [
    {
      id: "finanzas",
      icon: TrendingUp,
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
      description:
        "Transforma un gasto operacional rígido y creciente en un activo patrimonial depreciable. Aprovecha incentivos tributarios como la depreciación acelerada instantánea para reducir la carga de Impuesto a la Renta de tu empresa.",
      points: [
        "Protección contra la inflación tarifaria eléctrica en horas punta (BT-4.3 / AT).",
        "Depreciación acelerada instantánea reconocida por el SII.",
        "Reducción del costo nivelado de energía (LCOE) por debajo de $65/kWh.",
      ],
    },
    {
      id: "financiamiento",
      icon: Landmark,
      title: "Financiamiento & Créditos Verdes",
      subtitle: "Estructuración de flujo de caja neutro desde el Día 1",
      badge: "Inversión Inteligente",
      yields: [
        {
          label: "Tasa Preferencial",
          value: "Crédito Verde",
          desc: "Convenios bancarios y subsidios CORFO",
        },
        {
          label: "Flujo de Caja",
          value: "Neutro o Positivo",
          desc: "La cuota del leasing se paga con el ahorro",
        },
        {
          label: "Opción PPA",
          value: "$0 CAPEX",
          desc: "Inversión inicial 100% financiada por SoldeRío",
        },
      ],
      description:
        "Implementa tu planta solar sin descapitalizar la empresa ni comprometer líneas de crédito operacionales. Evaluamos la estructuración con leasing verde bancario o modelos PPA de compra de energía a tarifa garantizada.",
      points: [
        "Acceso a líneas de Leasing Verde con amortización tributaria acelerada.",
        "Sin impacto en la liquidez ni capital de trabajo para la operación diaria.",
        "Modelos PPA (Power Purchase Agreement) para proyectos >100 kWp sin inversión inicial.",
      ],
    },
    {
      id: "operacion",
      icon: ShieldCheck,
      title: "Continuidad Operacional",
      subtitle: "Protección ante fallas de suministro y cortes de red",
      badge: "Resiliencia Industrial",
      yields: [
        {
          label: "Conmutación",
          value: "<10 ms",
          desc: "Cero micro-cortes en maquinaria crítica",
        },
        {
          label: "Resguardo",
          value: "100% Automatizado",
          desc: "Gestión inteligente de cargas con BESS",
        },
        {
          label: "Pérdidas Evitadas",
          value: "Cero Mermas",
          desc: "Protección de cadena de frío y procesos",
        },
      ],
      description:
        "En el sur de Chile, los cortes de luz por eventos climáticos o fallas de transmisión paralizan frigoríficos, lecherías y líneas de envasado. Los sistemas híbridos BESS respaldan instantáneamente las cargas críticas.",
      points: [
        "Respaldo instantáneo para sistemas SCADA, cámaras de frío y ordenanzas automáticas.",
        "Eliminación de mermas por materias primas deterioradas durante cortes prolongados.",
        "Estabilización de voltaje y supresión de armónicos para proteger equipamiento delicado.",
      ],
    },
    {
      id: "esg",
      icon: Award,
      title: "Sostenibilidad & Reporte ESG",
      subtitle: "Valor de marca y cumplimiento de estándares de exportación",
      badge: "Descarbonización",
      yields: [
        {
          label: "Certificación",
          value: "100% Renovable",
          desc: "Certificados I-REC auditables",
        },
        {
          label: "Huella Carbono",
          value: "-tCO2e / año",
          desc: "Reducción directa de emisiones Scope 2",
        },
        {
          label: "Exportación",
          value: "Estándar UE/EEUU",
          desc: "Acreditación para exigencias de clientes",
        },
      ],
      description:
        "Demuestra el compromiso ambiental de tu empresa con métricas verificadas. Entregamos reportabilidad mensual de mitigación de CO2 y certificados de energía renovable para memorias de sostenibilidad corporativa.",
      points: [
        "Certificación de energía limpia para valorizar el producto final ante clientes corporativos.",
        "Cumplimiento de metas ESG y normativas de reporte climático internacional.",
        "Posicionamiento de marca como referente de innovación y responsabilidad ambiental en la región.",
      ],
    },
  ];

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

        {/* Minimalist Tabs Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {drivers.map((driver, index) => {
            const Icon = driver.icon;
            const isActive = activeTab === index;

            return (
              <button
                key={driver.id}
                onClick={() => setActiveTab(index)}
                className={`p-4 md:p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? "bg-[#1F1F1F] text-white border-[#1F1F1F] shadow-lg"
                    : "bg-white text-[#1F1F1F] border-black/5 hover:border-[#FF8300]/30 hover:bg-white/80"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isActive ? "bg-[#FF8300] text-white" : "bg-[#FF8300]/10 text-[#FF8300]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isActive ? "bg-white/10 text-white/70" : "bg-black/5 text-black/50"
                    }`}
                  >
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-sm md:text-base font-medium leading-snug">
                  {driver.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Active Driver Content Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-[28px] border border-black/5 p-6 md:p-10 shadow-sm"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Context & Bullet points (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] bg-[#FF8300]/10 px-3 py-1 rounded-full">
                      {drivers[activeTab].badge}
                    </span>
                    <span className="text-xs text-brand-muted font-light">
                      {drivers[activeTab].subtitle}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-light text-[#1F1F1F] mb-4">
                    {drivers[activeTab].title}
                  </h3>

                  {/* Cashflow Curve Chart */}
                  <CashflowChart />

                  <div className="space-y-3">
                    {drivers[activeTab].points.map((pt, i) => (
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
                  {drivers[activeTab].yields.map((hl, idx) => (
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
        </AnimatePresence>
      </div>
    </section>
  );
}
