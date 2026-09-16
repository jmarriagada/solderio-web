"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplet,
  Wheat,
  Fish,
  TreePine,
  Fuel,
  Utensils,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";

interface IndustryData {
  id: string;
  name: string;
  shortName: string;
  icon: React.ElementType;
  badge: string;
  headline: string;
  image: string;
  painPoint: string;
  solution: string;
  systemConfig: string;
  metrics: {
    label: string;
    value: string;
    subtext: string;
  }[];
  quoteIndustry: string;
}

const INDUSTRIES: IndustryData[] = [
  {
    id: "lecherias",
    name: "Lecherías y Queserías",
    shortName: "Lecherías",
    icon: Droplet,
    badge: "Sector Lácteo · Osorno, Llanquihue y Frutillar",
    headline: "Continuidad total en salas de ordeña y estanques de frío",
    image: "/images/Paneles-solares-lecherias.jpeg",
    painPoint:
      "Cortes intempestivos de la distribuidora eléctrica que arriesgan miles de litros por pérdida de frío o detención de ordeña matutina (5:00-8:00 AM) y vespertina (16:00-19:00 PM), sumado a penalizaciones por potencia en horario punta.",
    solution:
      "Planta solar acoplada a BESS Grid-Forming con conmutación instantánea (<10ms). Suministro ininterrumpido a bombas de vacío y frío de leche, con Peak Shaving para eliminar el sobrecargo de invierno.",
    systemConfig: "Planta C&I 80-250 kWp + BESS LiFePO4 100-300 kWh",
    metrics: [
      { label: "Ahorro Tarifa Global", value: "Hasta 65%", subtext: "Corte de horario punta BT-4.3" },
      { label: "Respaldo en Ordeña", value: "<10 ms", subtext: "Cero detención en frío de estanque" },
      { label: "Retorno Estimado", value: "3.2 - 3.8 años", subtext: "Con depreciación instantánea SII" },
    ],
    quoteIndustry: "Lechería",
  },
  {
    id: "agricola",
    name: "Agrícola, Frutícola y Riego",
    shortName: "Agrícola & Riego",
    icon: Wheat,
    badge: "Berries, Cerezos y Cultivos · Los Ríos y Los Lagos",
    headline: "Máxima potencia solar durante los meses críticos de riego estival",
    image: "/images/agricola-proyectos-solares-energia-limpia-solderio.jpeg",
    painPoint:
      "Bombas de pozo profundo de 25 a 100 HP operando a plena marcha en verano (diciembre a marzo). Costos eléctricos que se disparan en cosecha, coincidiendo con períodos de alta sequía estacional.",
    solution:
      "Generación fotovoltaica en suelo o cubiertas de packing. La curva de bombeo coincide en un 95% con la radiación solar estival del sur, produciendo energía directa a costo cero en el momento de mayor consumo.",
    systemConfig: "Parque Solar en Suelo / Packing 100-300 kWp On-Grid TE-4",
    metrics: [
      { label: "Ahorro en Riego Diurno", value: "Hasta 80%", subtext: "Autoconsumo in-situ directo" },
      { label: "Inyección Excedentes", value: "Ley 21.118", subtext: "Net Billing valorizado a Precio Nudo" },
      { label: "Payback Proyectado", value: "3.0 - 3.6 años", subtext: "Alta utilización en temporada alta" },
    ],
    quoteIndustry: "Agrícola y Riego",
  },
  {
    id: "acuicola",
    name: "Acuicultura y Frigoríficos",
    shortName: "Acuicultura & Frío",
    icon: Fish,
    badge: "Salmoneras, Pisciculturas RAS y Procesadoras · Puerto Montt y Chiloé",
    headline: "Resiliencia operativa crítica y reducción masiva de huella de carbono",
    image: "/images/Salmon-solar_panels-solderio.jpeg",
    painPoint:
      "Cero margen para fallas en plantas salmoneras y centros acuícolas: la detención de sopladores de oxígeno, bombas de recirculación o cámaras de congelado provoca mortandades millonarias. Alto gasto mensual en diésel para grupos electrógenos.",
    solution:
      "Microred industrial híbrida (Solar + BESS con transferencia instantánea STS <10ms + respaldo diésel). Reduce hasta un 60% las horas de marcha diésel en instalaciones salmoneras, asegurando autonomía energética y estándares de exportación.",
    systemConfig: "Sistema Híbrido C&I 100-300 kWp + BESS 150-400 kWh",
    metrics: [
      { label: "Reducción de Diésel", value: "Hasta 60%", subtext: "Menor consumo de combustible fósil" },
      { label: "Huella de Carbono", value: "Scope 1 & 2", subtext: "Trazabilidad para mercados externos" },
      { label: "Continuidad Crítica", value: "0 interrupción", subtext: "Transferencia estática STS en oxigenación" },
    ],
    quoteIndustry: "Acuícola / Procesadora",
  },
  {
    id: "aserraderos",
    name: "Aserraderos y Madereras",
    shortName: "Madereras",
    icon: TreePine,
    badge: "Industria Forestal y Aserrío · Valdivia, La Unión y Osorno",
    headline: "Transforma cubiertas industriales ociosas en centros de autogeneración",
    image: "/images/Solar_panels_on_industrial_aserradero_solderio.jpeg",
    painPoint:
      "Picos de potencia de motores de corte y secado en grandes galpones. Además, el polvo y aserrín en suspensión de la faena satura rápidamente los paneles, provocando severas pérdidas por ensuciamiento (soiling) si no se interviene a tiempo.",
    solution:
      "Instalación fotovoltaica sobre galpones con telemetría de rendimiento: el sistema detecta mermas por aserrín y emite alertas automáticas para limpiezas reactivas, integradas a un plan de mantenimiento preventivo más recurrente que asegura máxima captación continua.",
    systemConfig: "Planta Solar en Techo Galpón 100-300 kWp Net Billing",
    metrics: [
      { label: "Valorización de Techos", value: "100%", subtext: "Activo financiero sobre cubierta libre" },
      { label: "Atenuación de Potencia", value: "Demanda Base", subtext: "Baja cobro por potencia máxima en faena" },
      { label: "Plan Anti-Ensuciamiento", value: "Alertas 24/7", subtext: "Limpiezas preventivas y reactivas por aserrín" },
    ],
    quoteIndustry: "Aserradero / Industria Maderera",
  },
  {
    id: "servicentros",
    name: "Servicentros y Gasolineras",
    shortName: "Gasolineras & Retail",
    icon: Fuel,
    badge: "Estaciones de Servicio & Strip Centers · Ruta 5 Sur",
    headline: "Carports solares en estacionamientos y suministro 24/7 con carga EV",
    image: "/images/Solar_carport-bencineras-chile.jpeg",
    painPoint:
      "Operación continua día y noche, alto consumo en cámaras de bebidas, iluminación perimetral de marquesina y la necesidad de ofrecer cargadores rápidos para flotas y clientes en tránsito.",
    solution:
      "Marquesinas solares (Carports) para estacionamientos combinadas con plantas de techo. Alimenta la tienda de conveniencia y suministra energía limpia directa a electrolineras de carga rápida.",
    systemConfig: "Carport Solar 60-150 kWp + Cargadores Rápidos EV + BESS",
    metrics: [
      { label: "Doble Funcionalidad", value: "Sombra + Energía", subtext: "Confort para clientes y autogeneración" },
      { label: "Carga Eléctrica EV", value: "Hasta 120 kW", subtext: "Nuevo flujo de ingresos por recarga" },
      { label: "Amortización", value: "3.4 - 4.1 años", subtext: "Elevado autoconsumo diurno y nocturno" },
    ],
    quoteIndustry: "Estación de Servicio / Retail",
  },
  {
    id: "hoteleria",
    name: "Hotelería, Turismo y Gastronomía",
    shortName: "Turismo & Gastronomía",
    icon: Utensils,
    badge: "Lodges, Hoteles y Restaurantes · Lago Llanquihue y Chiloé",
    headline: "Calefacción, bombas de calor y cocinas con sello 100% sustentable",
    image: "/images/Eco-friendly_hotel-solar-solderio-surdechile.jpeg",
    painPoint:
      "Altos consumos en climatización (bombas de calor aerotérmicas/geotérmicas), agua caliente sanitaria y frío comercial. Turistas extranjeros y nacionales prefieren operadores con compromiso ambiental real.",
    solution:
      "Sistema solar integrado estética y acústicamente con bombas de calor y baterías LiFePO4. Protege la experiencia del huésped ante temporales invernales y posiciona al negocio como referente eco-friendly.",
    systemConfig: "Planta Solar Híbrida 40-120 kWp + BESS Respaldo 60-150 kWh",
    metrics: [
      { label: "Ahorro en Climatización", value: "Hasta 70%", subtext: "Acople con bombas de calor aerotérmicas" },
      { label: "Distintivo Verde", value: "Sello Sustentable", subtext: "Mayor atractivo y tarifa por noche" },
      { label: "Respaldo Turístico", value: "Cero Cortes", subtext: "Servicio ininterrumpido en temporales" },
    ],
    quoteIndustry: "Hotel / Restaurante",
  },
  {
    id: "educacion",
    name: "Colegios e Instituciones",
    shortName: "Colegios & Escuelas",
    icon: GraduationCap,
    badge: "Colegios, Universidades e Institutos · Macrozona Sur",
    headline: "Alineación perfecta entre la jornada escolar y la radiación solar",
    image: "/images/colegio-solar-autosustentable-solderio-sur-de-chile.jpeg",
    painPoint:
      "Presupuestos institucionales presionados por facturas eléctricas durante el año académico. En verano las aulas están vacías pero la radiación es máxima.",
    solution:
      "Curva de consumo escolar (8:00 a 17:00 hrs) que calza con la ventana de producción solar. Durante las vacaciones de verano, la totalidad de la energía se inyecta a la red bajo Net Billing generando saldos a favor para el invierno.",
    systemConfig: "Planta Solar en Techumbre 50-200 kWp On-Grid TE-4",
    metrics: [
      { label: "Ahorro Anual Global", value: "Hasta 75%", subtext: "Compensación de verano e invierno" },
      { label: "Cero Costo Diurno", value: "100% Solar", subtext: "Aulas, laboratorios e iluminación" },
      { label: "Valor Educativo", value: "Pantalla IoT", subtext: "Monitoreo en vivo para los alumnos" },
    ],
    quoteIndustry: "Colegio / Institución",
  },
];

export function EmpresasIndustries() {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = INDUSTRIES[activeIdx];

  return (
    <section className="w-full py-20 md:py-28 px-3 md:px-5 box-border bg-[#F7F8FA] overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-12"
        >
          <span className="text-xs md:text-sm font-light uppercase tracking-widest text-[#FF8300] mb-3 md:mb-4 block">
            Sectores Productivos del Sur
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight leading-[1.1] mb-5">
            Ingeniería diseñada para los desafíos reales de tu industria
          </h2>
          <p className="text-base md:text-lg text-black/60 font-light leading-relaxed">
            Cada sector productivo en el sur de Chile enfrenta dinámicas energéticas y operativas únicas. Selecciona tu industria para descubrir la configuración y beneficios exactos de implementar sistemas SoldeRío.
          </p>
        </motion.div>

        {/* Horizontal Scrollable Tabs / Pills Selector */}
        <div className="w-full overflow-x-auto pt-2.5 pb-5 mb-8 no-scrollbar -mx-2 px-2">
          <div className="flex items-center gap-2.5 min-w-max py-2 px-2">
            {INDUSTRIES.map((ind, idx) => {
              const IconComp = ind.icon;
              const isActive = idx === activeIdx;

              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-xs md:text-sm font-medium transition-all duration-300 cursor-pointer select-none border shrink-0 transform-gpu ${
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
                  <span>{ind.shortName}</span>
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
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Left Column: Context, Pains, Solutions & Metrics (7 cols) */}
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
                      <div className="text-[14px] md:text-sm text-black/80 font-light leading-relaxed">
                        <strong className="font-medium text-amber-900 mr-1.5">El Desafío:</strong>
                        {current.painPoint}
                      </div>
                    </div>

                    {/* Solución - Dark BG Protagonista */}
                    <div className="bg-[#1A1A1A] border border-black/10 rounded-xl p-3.5 md:p-4 flex items-start gap-3 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#FF8300] shrink-0 mt-0.5" />
                      <div className="text-[14px] md:text-sm text-white/90 font-light leading-relaxed">
                        <strong className="font-medium text-[#FF8300] mr-1.5">Solución SoldeRío:</strong>
                        {current.solution}
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {current.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="bg-[#F7F8FA] p-4 rounded-2xl border border-black/5 flex flex-col"
                      >
                        <span className="text-[14px] sm:text-xs text-black/50 font-light mb-1">
                          {metric.label}
                        </span>
                        <span className="text-xl md:text-2xl font-medium text-[#1F1F1F] tracking-tight mb-1">
                          {metric.value}
                        </span>
                        <span className="text-[13px] sm:text-[11px] font-mono text-black/40">
                          {metric.subtext}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-black/5">
                  <CtaButton
                    href={`/cotizacion?tipo=empresa&industria=${encodeURIComponent(current.quoteIndustry)}`}
                    className="text-[14px] md:text-sm"
                  >
                    Cotizar para {current.name}
                  </CtaButton>

                  <div className="flex items-center gap-2 text-xs text-black/50 font-light px-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Ingeniería certificada SEC Pliego RIC N°15 &amp; N°09</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Showcase & System Specs (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="relative aspect-[4/3] md:aspect-[16/11] rounded-[24px] overflow-hidden border border-black/10 shadow-lg bg-black/5">
                  <Image
                    src={current.image}
                    alt={`Solución solar SoldeRío para ${current.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  {/* Floating glass badge inside image (Matching /hogar hero glass button style) */}
                  <div className="absolute bottom-5 left-5 right-5 z-10 bg-black/40 border border-white/40 backdrop-blur-md rounded-2xl p-4 md:p-5 text-white shadow-2xl">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF8300] block mb-1 drop-shadow-sm">
                      Arquitectura Recomendada
                    </span>
                    <p className="text-xs md:text-sm font-medium leading-snug drop-shadow-sm">
                      {current.systemConfig}
                    </p>
                  </div>
                </div>

                {/* Micro-Features Row */}
                <div className="grid grid-cols-2 gap-3 text-xs font-light text-black/70">
                  <div className="bg-[#F7F8FA] p-3 rounded-xl border border-black/5 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-[#FF8300]" />
                    <span>Inyección Net Billing 21.118</span>
                  </div>
                  <div className="bg-[#F7F8FA] p-3 rounded-xl border border-black/5 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#FF8300]" />
                    <span>Monitoreo en tiempo real 24/7</span>
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
