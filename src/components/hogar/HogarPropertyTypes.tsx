"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Trees,
  Mountain,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  BatteryCharging,
  Sun,
  ChevronDown,
} from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";

interface PropertyType {
  id: string;
  name: string;
  shortName: string;
  icon: React.ElementType;
  badge: string;
  headline: string;
  image: string;
  painShort: string;
  solutionShort: string;
  painFull: string;
  solutionFull: string;
  systemConfig: string;
  metrics: {
    label: string;
    value: string;
    subtext: string;
  }[];
  quoteParam: string;
  quoteHref: string;
  secCertification?: string;
}

const PROPERTY_TYPES: PropertyType[] = [
  {
    id: "urbana",
    name: "Casas Urbanas & Residenciales",
    shortName: "Casas Urbanas",
    icon: Home,
    badge: "Valdivia, Osorno, Puerto Varas, Temuco",
    headline: "Reduce tu cuenta de luz a cero y protégete de las alzas de tarifa",
    image: "/images/casa-solar-fotovoltaica-solderio-min.jpg",
    painShort: "Alzas superiores al 50% en el $/kWh y alto consumo eléctrico en invierno.",
    solutionShort: "Sobredimensión calculada para inyección NetBilling. Generando excedentes en verano que pagan tu consumo de invierno.",
    painFull:
      "El descongelamiento tarifario a nivel nacional ha significado alzas acumuladas superiores al 50% en las cuentas de luz residenciales (BT-1) en el sur, presionando el presupuesto familiar en los meses de mayor demanda.",
    solutionFull:
      "Instalación de planta On-Grid con medidor bidireccional. La energía generada en primavera y verano se inyecta a la red valorizada a Precio Nudo, generando saldos monetarios que descuentan tus boletas invernales.",
    systemConfig: "Planta On-Grid de 3 a 6 kWp · 6 a 12 Módulos bifaciales + Inversor Inteligente",
    metrics: [
      { label: "Ahorro Anual Boleta", value: "Hasta 90%", subtext: "Compensación estival Ley 21.118" },
      { label: "Retorno Estimado", value: "4.5 - 5.5 años", subtext: "Acelerado por alzas tarifarias" },
      { label: "Garantía de Potencia", value: "25 - 30 años", subtext: "Módulos Tier-1 N-Type TOPCon" },
    ],
    quoteParam: "Casa Urbana",
    quoteHref: "/cotizacion?propiedad=residencial&sistema=ongrid",
    secCertification: "Instalación certificada SEC TE-1 y TE-4",
  },
  {
    id: "parcela",
    name: "Parcelas de Agrado & Zonas Rurales",
    shortName: "Parcelas con Red",
    icon: Trees,
    badge: "Puerto Varas rural, Llanquihue, Frutillar, Panguipulli",
    headline: "Agua de pozo garantizada y respaldo instantáneo ante cortes y temporales",
    image: "/images/planta-solar-residencial-sur-chile-solderio-min.jpg",
    painShort: "Cortes de 24 hasta 72h por caídas de árboles que dejan la parcela sin agua de pozo ni calefacción.",
    solutionShort: "Planta Solar Híbrida con Baterías de Litio y reactivación imperceptible ante cortes (menor a 0,01 seg) para los consumos esenciales. Sistema que genera, almacena e inyecta a la red",
    painFull:
      "En parcelaciones rurales, los temporales de viento y lluvia suelen botar ramas sobre el tendido eléctrico, generando cortes prolongados que dejan a tu familia sin agua potable de pozo, sin portón automático y sin calefacción.",
    solutionFull:
      "Un Sistema Híbrido con Baterías de Litio y Backup Smart (STS) en menos de 10 milisegundos (0,01s). Al fallar la red pública, la casa pasa a modo microred automática, manteniendo energizadas las cargas críticas de forma 100% silenciosa.",
    systemConfig: "Planta Híbrida de 5 a 10 kWp + Batería de 7 a 14 kWh + Backup <0.01s",
    metrics: [
      { label: "Conmutación en Corte", value: "<10 ms", subtext: "Imperceptible para bomba y electrónica" },
      { label: "Autonomía en Temporal", value: "1 a 3 días", subtext: "Suministro vital ininterrumpido" },
      { label: "Operación Limpia", value: "100% Silenciosa", subtext: "Sin diésel, olores ni mantención" },
    ],
    quoteParam: "Parcela de Agrado",
    quoteHref: "/cotizacion?propiedad=parcela&sistema=hibrida",
    secCertification: "Instalación certificada SEC TE-1 y TE-4",
  },
  {
    id: "offgrid",
    name: "Casas de Campo Autónomas (Off-Grid)",
    shortName: "Casas Aisladas",
    icon: Mountain,
    badge: "Chiloé rural, Zonas Cordilleranas y Predios sin Red",
    headline: "Soberanía eléctrica total cuando la red pública no llega",
    image: "/images/planta-solar-residencial-offgrid-valdivia-min.jpg",
    painShort: "Costos millonarios de postación eléctrica para empalme o dependencia de generadores ruidosos.",
    solutionShort: "100% Autónoma: Banco de baterías y partida automática de generador de respaldo.",
    painFull:
      "Llevar un empalme de red eléctrica a parcelas alejadas puede costar varios millones de pesos y demorar meses en tramitaciones. Mantener generadores a combustión implica compras constantes de combustible y ruido molesto.",
    solutionFull:
      "Planta solar Off-Grid aislada con banco de baterías LiFePO4 de 6.000+ ciclos de vida útil e inversor-cargador de onda senoidal pura de 230V. Cuenta con puerto para partida automática de generador (ATS) que solo entra como apoyo en días críticos de invierno.",
    systemConfig: "Planta Off-Grid de 4 a 12 kWp + Batería de 14 a 28 kWh + Inversor Off-Grid + Sistema de partida automática ATS",
    metrics: [
      { label: "Dependencia de Red", value: "0%", subtext: "Cero cuentas de luz de por vida" },
      { label: "Energía Continua", value: "230V Estable", subtext: "Onda senoidal pura para toda la casa" },
      { label: "Vida Útil Baterías", value: ">15 años", subtext: "Química segura LiFePO4 de alto ciclado" },
    ],
    quoteParam: "Casa de Campo Off-Grid",
    quoteHref: "/cotizacion?propiedad=parcela&sistema=offgrid",
  },
  {
    id: "sustentable",
    name: "Hogares Sustentables con Climatización & EV",
    shortName: "Transición 100% Eléctrica",
    icon: Zap,
    badge: "Eficiencia Energética, Bombas de Calor y Electromovilidad",
    headline: "Calefacción limpia por aerotermia y carga de tu vehículo eléctrico",
    image: "/images/solderio-planta-solar-residencial-valdivia-min.jpg",
    painShort: "Electrificar la calefacción (bomba de calor o aire acondicionado) y cargar el auto en casa dispara el consumo de energía desde la red.",
    solutionShort: "Ecosistema solar dimensionado para abastecer climatización y carga de auto a costo cero.",
    painFull:
      "La transición moderna hacia bombas de calor y autos eléctricos elimina el gasto en leña y bencina, pero aumenta el consumo de electricidad si se depende exclusivamente de la red convencional.",
    solutionFull:
      "Diseño de ingeniería solar acoplado a cargadores inteligentes de vehículos eléctricos (7.4 a 22 kW) y bombas de calor aerotérmicas. Maximiza la carga diurna con excedentes solares directos, logrando un hogar con huella de carbono neutral.",
    systemConfig: "Planta Híbrida 6 a 12 kWp + BESS + Cargador EV Inteligente 7.4 kW",
    metrics: [
      { label: "Gasto en Combustible", value: "-100%", subtext: "Carga solar directa en tu garaje" },
      { label: "Climatización Limpia", value: "Cero Humo", subtext: "Desacople de leña, pellet y gas licuado" },
      { label: "Huella de Carbono", value: "Net Zero", subtext: "Hogar 100% carbono neutral" },
    ],
    quoteParam: "Hogar Sustentable",
    quoteHref: "/cotizacion?propiedad=residencial&sistema=hibrida&ev=true",
    secCertification: "Instalación certificada SEC TE-1, TE-4 y TE-6",
  },
];

export function HogarPropertyTypes() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const current = PROPERTY_TYPES[activeIdx];

  return (
    <section className="w-full py-16 md:py-24 px-3 md:px-5 box-border bg-[#F7F8FA] overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-10"
        >
          <span className="text-xs md:text-sm font-light uppercase tracking-widest text-[#FF8300] mb-3 md:mb-4 block">
            Tipos de Vivienda en el Sur
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight leading-[1.1] mb-4">
            Soluciones a la medida de tu propiedad y estilo de vida
          </h2>
          <p className="text-base md:text-lg text-black/60 font-light leading-relaxed">
            Una casa en la ciudad no tiene los mismos requerimientos que una parcela con bomba de pozo o un refugio aislado. Selecciona tu propiedad para ver la solución recomendada.
          </p>
        </motion.div>

        {/* Horizontal Scrollable Tabs */}
        <div className="w-full overflow-x-auto pt-1.5 pb-4 mb-8 no-scrollbar">
          <div className="flex items-center gap-2.5 min-w-max px-2 py-1">
            {PROPERTY_TYPES.map((prop, idx) => {
              const IconComp = prop.icon;
              const isActive = idx === activeIdx;

              return (
                <button
                  key={prop.id}
                  onClick={() => {
                    setActiveIdx(idx);
                    setShowTechnicalDetails(false);
                  }}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-xs md:text-sm font-medium transition-all duration-300 cursor-pointer select-none border ${
                    isActive
                      ? "bg-[#1F1F1F] text-white border-[#1F1F1F] shadow-lg shadow-black/10 scale-[1.02]"
                      : "bg-white text-black/70 border-black/10 hover:border-black/20 hover:text-black hover:bg-black/[0.02]"
                  }`}
                >
                  <IconComp
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-[#FF8300]" : "text-black/40"
                    }`}
                  />
                  <span>{prop.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Showcase Card */}
        <div className="bg-[#FDFFFE] rounded-[28px] border border-black/5 p-6 md:p-10 lg:p-12 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch"
            >
              {/* Left Column: Compact Graphical Info & Metrics (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  {/* Headline */}
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1F1F1F] tracking-tight leading-[1.15] mb-6">
                    {current.headline}
                  </h3>

                  {/* Concise Summary Strip: Desafío vs Solución */}
                  <div className="space-y-3 mb-6">
                    {/* Desafío - Short & Punchy */}
                    <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3.5 flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div className="text-xs md:text-sm text-black/80 font-light leading-relaxed">
                        <strong className="font-medium text-amber-900 mr-1.5">El Desafío:</strong>
                        {current.painShort}
                      </div>
                    </div>

                    {/* Solución - Dark BG Protagonista */}
                    <div className="bg-[#1A1A1A] border border-black/10 rounded-xl p-3.5 md:p-4 flex items-start gap-3 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#FF8300] shrink-0 mt-0.5" />
                      <div className="text-xs md:text-sm text-white/90 font-light leading-relaxed">
                        <strong className="font-medium text-[#FF8300] mr-1.5">Solución SoldeRío:</strong>
                        {current.solutionShort}
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Technical Detail Accordion */}
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                      className="text-xs font-mono text-black/40 hover:text-[#FF8300] transition-colors flex items-center gap-1.5 cursor-pointer select-none py-1"
                    >
                      <span>{showTechnicalDetails ? "Ocultar análisis técnico" : "Ver análisis técnico detallado"}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          showTechnicalDetails ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {showTechnicalDetails && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-[#F7F8FA] p-4 rounded-xl border border-black/5 mt-2 space-y-2 text-[13px] text-black/70 font-light leading-relaxed">
                            <p>
                              <strong className="font-medium text-black">Contexto:</strong> {current.painFull}
                            </p>
                            <p>
                              <strong className="font-medium text-black">Ingeniería:</strong> {current.solutionFull}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Key Metrics Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
                    {current.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="bg-[#F7F8FA] p-3.5 rounded-2xl border border-black/5 flex flex-col"
                      >
                        <span className="text-xs text-black/50 font-light mb-0.5">
                          {metric.label}
                        </span>
                        <span className="text-xl md:text-2xl font-medium text-[#1F1F1F] tracking-tight mb-0.5">
                          {metric.value}
                        </span>
                        <span className="text-[11px] font-mono text-black/40">
                          {metric.subtext}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-black/5">
                  <CtaButton href={current.quoteHref}>
                    Cotizar para {current.name}
                  </CtaButton>

                  {current.secCertification && (
                    <div className="flex items-center gap-2 text-xs text-black/50 font-light px-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{current.secCertification}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: High-Res Real Photography of Southern Chile (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full min-h-[360px] md:min-h-[440px] gap-3">
                <div className="relative flex-1 w-full min-h-[300px] md:min-h-[380px] rounded-[24px] overflow-hidden border border-black/10 shadow-lg bg-black/5 group">
                  <Image
                    src={current.image}
                    alt={`Planta solar residencial SoldeRío para ${current.name}`}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Floating badge inside image */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 bg-black/70 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 text-white">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF8300] block mb-0.5">
                      Configuración Sugerida
                    </span>
                    <p className="text-xs md:text-sm font-medium leading-snug">
                      {current.systemConfig}
                    </p>
                  </div>
                </div>

                {/* Micro-Features Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-light text-black/70 shrink-0">
                  <div className="bg-[#F7F8FA] p-2.5 rounded-xl border border-black/5 flex items-center gap-2">
                    <Sun className="w-3.5 h-3.5 text-[#FF8300] shrink-0" />
                    <span className="text-[11px] leading-tight">Mejor captación solar en nubosidad vs paneles convencionales</span>
                  </div>
                  <div className="bg-[#F7F8FA] p-2.5 rounded-xl border border-black/5 flex items-center gap-2">
                    <BatteryCharging className="w-3.5 h-3.5 text-[#FF8300] shrink-0" />
                    <span className="text-[11px] leading-tight">Baterías de Litio seguras y con vida útil mayor a 13 años</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
