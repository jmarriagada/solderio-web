"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, 
  Zap, 
  Battery, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  Leaf, 
  Calendar, 
  PhoneCall, 
  ArrowRight, 
  Sparkles,
  HelpCircle,
  X,
  Download,
  FileText,
  FileCheck2,
  Wrench,
  Award,
  Wallet,
  ArrowLeft,
  RotateCcw,
  ChevronDown
} from "lucide-react";
import { SolarSizingResult, QuoteFormData, MonthlyGenBreakdown } from "@/types/cotizacion";
import { useVisitaModal } from "@/context/VisitaModalContext";

import { ExecutiveReportModal } from "./ExecutiveReportModal";
import { downloadDirectSolarPdf } from "@/lib/pdf-generator";
import { SolarSeasonalChart } from "./SolarSeasonalChart";

interface Props {
  formData: QuoteFormData;
  sizing: SolarSizingResult;
  leadId: string;
  onReset: () => void;
  onBack?: () => void;
}

interface ExplanatoryModalContent {
  title: string;
  subtitle: string;
  analogy: string;
  details: string[];
}

const EXPLANATORY_MODALS: Record<string, ExplanatoryModalContent> = {
  kwp: {
    title: "¿Qué significa Potencia en kWp y cuántos paneles son?",
    subtitle: "Explicación sencilla con peras y manzanas",
    analogy: "El 'kWp' (Kilowatt pico) es como la cilindrada o tamaño del motor de tu planta solar. Representa la cantidad máxima de energía limpia que tus paneles generan bajo el sol del mediodía.",
    details: [
      "Cada panel fotovoltaico SoldeRío es de última tecnología N-Type TOPCon de 580 Watts (alta captación incluso en días nublados).",
      "Si tu propuesta indica 8.7 kWp, significa que instalaremos 15 módulos en tu techo orientados hacia el norte.",
      "Toda esa energía alimenta primero el consumo instantáneo de tu casa y el resto carga tus baterías o se vende a la red.",
    ],
  },
  bess: {
    title: "¿Cómo funciona la Batería LiFePO4 y el respaldo en cortes?",
    subtitle: "Tu propia reserva de energía inteligente sin ruido ni bencina",
    analogy: "Es como tener un estanque de agua purificada en altura: cuando la distribuidora corta la luz por temporal o choque de poste, tu casa ni se entera. La batería toma el control en 0.01 segundos.",
    details: [
      "Química LiFePO4 (Fosfato de Hierro y Litio): No se calienta, no es inflamable y dura más de 15 años (+6.000 ciclos).",
      "Conmutación ultra-rápida STS (<10 ms): Tus computadores, Wi-Fi de Starlink y refrigerador no se apagan ni parpadean.",
      "En días normales, la batería se llena gratis con el sol de la tarde y alimenta tu casa durante la noche para no comprarle luz cara a Saesa/Crell.",
    ],
  },
  netbilling: {
    title: "¿Cómo funciona la Ley Net Billing y por qué baja tanto mi cuenta?",
    subtitle: "Generas en verano, guardas saldo a favor y descuentas en invierno",
    analogy: "Imagina que tu medidor gira hacia adelante cuando consumes y hacia atrás cuando el sol brilla y no estás en casa. Todo lo que te sobra se lo vendes a la distribuidora por ley.",
    details: [
      "Ley 21.118: La compañía eléctrica está obligada por ley a recibir tus excedentes y pagártelos como saldo en tu boleta.",
      "En los meses de verano (enero a marzo) generarás mucha más energía de la que gastas, acumulando un pozo de plata a favor.",
      "Ese saldo acumulado se utiliza automáticamente en invierno para pagar tus consumos de los meses más fríos.",
    ],
  },
  limiteInvierno: {
    title: "¿Qué es el 'Límite de Invierno' y cómo te protege SoldeRío?",
    subtitle: "El sobrecargo oculto de las distribuidoras en los meses fríos",
    analogy: "Entre abril y septiembre, si gastas más de 350 kWh al mes en prender estufas o luces, la distribuidora te aplica un castigo y te cobra el kWh hasta un 40% más caro ($245+ CLP).",
    details: [
      "Tu planta solar reduce tu consumo directo de la red eléctrica, manteniéndote siempre bajo el umbral de castigo.",
      "Esto te ahorra entre $15.000 y $45.000 pesos mensuales solo en multas y sobrecargos evitados durante el invierno.",
    ],
  },
  retorno: {
    title: "¿En cuánto tiempo se paga el proyecto y cuánto dura?",
    subtitle: "Una inversión tangible que valoriza tu propiedad",
    analogy: "En lugar de regalarle $150.000 mensuales a la compañía eléctrica para siempre, esa misma plata paga tu propia planta solar en 5 a 6 años. A partir de ahí, tienes 20 años de electricidad gratis.",
    details: [
      "Garantía de rendimiento solar: 25 Años en generación garantizada por escrito.",
      "Aumento inmediato de la plusvalía de tu casa o parcela en el sur.",
      "Protección total contra las futuras alzas de la tarifa eléctrica en Chile.",
    ],
  },
};

const RESIDENTIAL_INCLUDED_SERVICES = [
  {
    title: "Monitoreo 24/7",
    desc: "Nuestro Call Center está disponible todos los días, a toda hora, para resolver tus dudas y acompañarte en cada etapa del proceso.",
    icon: PhoneCall,
    badge: "Soporte Continuo",
  },
  {
    title: "Diseño de Proyecto",
    desc: "Máxima eficiencia energética en tu proyecto solar hogar para ubicaciones en el Sur de Chile.",
    icon: Sun,
    badge: "A Medida",
  },
  {
    title: "Ingeniería",
    desc: "Cada detalle diseñado para funcionar sin problemas. Con instaladores certificados.",
    icon: Wrench,
    badge: "Instaladores SEC",
  },
  {
    title: "Instalación y construcción",
    desc: "Proyecto llave en mano, nuestros expertos se encargarán de todo.",
    icon: Zap,
    badge: "Llave en Mano",
  },
  {
    title: "Certificación",
    desc: "Gestionamos la certificación de tu proyecto solar frente a la SEC, y el cambio de medidor con la distribuidora electrica para activar la inyección bajo Ley Netbilling.",
    icon: Award,
    badge: "Ley Netbilling",
  },
  {
    title: "Garantía Extendida",
    desc: "3 años de garantía en la instalación. Además, todos los productos incluyen garantía del fabricante.",
    icon: ShieldCheck,
    badge: "Garantía 3 Años",
  },
  {
    title: "Servicios de O&M",
    desc: "Contamos con planes para el mantenimiento preventivo y correctivo. Nuestro personal se ubica en el sur y trabajamos con equipamiento especializado.",
    icon: Sparkles,
    badge: "Mantenimiento Local",
  },
];

const FAQ_ITEMS = [
  {
    question: "¿En cuánto tiempo estará operativa mi planta solar?",
    answer: "Una vez firmado el contrato, la instalación física en tu techo o terreno toma entre 3 y 5 días hábiles. La puesta en marcha para autoconsumo directo es inmediata tras finalizar el montaje. Luego, la tramitación del certificado TE-4 ante la SEC y la activación del nuevo medidor bidireccional con tu distribuidora eléctrica (Saesa, Crell o CGE) toma entre 30 y 60 días para comenzar a inyectar excedentes bajo la Ley Netbilling.",
  },
  {
    question: "¿En qué consiste una visita técnica?",
    answer: "Un Ingeniero visita tu propiedad para inspeccionar la orientación e inclinación de la techumbre o terreno, medir sombras de árboles o construcciones cercanas, y revisar el empalme y tablero eléctrico principal. Con estos datos calculamos las dimensiones exactas de canalizaciones, protecciones y cableado para entregarte el diseño definitivo.",
  },
  {
    question: "¿Por qué es importante la visita técnica?",
    answer: "Es fundamental porque permite verificar la factibilidad técnica real in situ, resolver todas tus dudas de forma personalizada y definir la ubicación exacta de los módulos e inversores. Además, nos permite entregarte un presupuesto 100% cerrado y llave en mano, garantizando que no existan sobrecostos ocultos el día del montaje.",
  },
  {
    question: "¿Mis paneles solares funcionan cuando hay un corte de electricidad?",
    answer: "En una planta On-Grid tradicional conectada a la red, los paneles se desconectan automáticamente por normativa de seguridad SEC (para proteger a los técnicos que reparan las líneas eléctricas). Si buscas tener electricidad y luz durante apagones, tu planta debe ser Híbrida o Aislada (Off-Grid) con Baterías, las cuales conmutan automáticamente para alimentar tus consumos esenciales sin interrupción.",
  },
  {
    question: "¿Mi generación de energía es constante durante todo el año?",
    answer: "No, en el Sur de Chile la radiación solar varía según la estación: durante primavera y verano generas una gran cantidad de energía, acumulando saldos a favor en dinero en tu boleta gracias a la Ley Netbilling. En otoño e invierno la producción baja debido a días más cortos, pero los excedentes que acumulaste en los meses soleados ayudan a compensar las cuentas de los meses fríos.",
  },
  {
    question: "¿Qué pasa en los días nublados o con lluvia en el Sur?",
    answer: "Nuestros paneles fotovoltaicos N-Type TOPCon captan radiación difusa de mejor forma que los paneles convencionales y continúan generando energía incluso con cielo nublado o lluvia moderada. Además, el clima lluvioso del sur beneficia a tu sistema al limpiar el polvo y la suciedad superficial de los paneles de manera 100% natural.",
  },
];

export function QuoteReportView({ formData, sizing, leadId, onReset, onBack }: Props) {
  const { openModal } = useVisitaModal();
  const [activeModalKey, setActiveModalKey] = useState<string | null>(null);
  const [isExecutiveReportOpen, setIsExecutiveReportOpen] = useState(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatNumber = (val: number) => {
    return Math.round(val).toLocaleString("es-CL");
  };

  const monthlyData = sizing.monthlyBreakdown || [];

  const activeModal = activeModalKey ? EXPLANATORY_MODALS[activeModalKey] : null;

  return (
    <div className="w-full max-w-6xl 2xl:max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 md:px-8 text-white space-y-6 sm:space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Banner */}
      <div className="p-5 sm:p-8 md:p-10 rounded-[24px] sm:rounded-[28px] bg-gradient-to-br from-[#1F1F1F] via-[#181818] to-black border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF8300]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono mb-3 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Pre-Informe de Ingeniería • ID: {leadId}</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-white mb-2">
              Propuesta Solar para {formData.fullName}
            </h2>
            <p className="text-white/60 text-xs md:text-sm font-light">
              Ubicación: <span className="text-white capitalize">{formData.comuna}</span> • Gasto Actual:{" "}
              <span className="text-[#FF8300] font-mono font-medium">{formatCurrency(formData.monthlyBillClp)} / mes</span> • Distribuidora:{" "}
              <span className="text-white capitalize">{formData.distributor}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto no-print">
            <button
              onClick={async () => {
                try {
                  await downloadDirectSolarPdf(formData, sizing, leadId);
                } catch (e) {
                  setIsExecutiveReportOpen(true);
                }
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#FF8300] hover:bg-[#e07400] text-white transition-all text-xs font-medium tracking-wide shadow-lg hover:shadow-[0_0_20px_rgba(255,131,0,0.4)] flex items-center justify-center gap-2 cursor-pointer"
              title="Descargar archivo PDF oficial del pre-informe"
            >
              <Download className="w-4 h-4" />
              <span>Descargar en PDF</span>
            </button>

            <button
              onClick={() => openModal()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-light text-xs md:text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Coordinar Visita</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main Technical & Financial Metrics Bento with Help Modals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 items-stretch">
        {/* Metric 1: Potencia Peak & Módulos */}
        <div className="p-5 sm:p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-lg flex flex-col justify-between relative group min-h-[210px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF8300] font-semibold flex items-center gap-1.5">
                POTENCIA SUGERIDA
                <button
                  type="button"
                  onClick={() => setActiveModalKey("kwp")}
                  className="text-white/40 hover:text-[#FF8300] transition-colors cursor-pointer"
                  title="¿Qué es esto? (Ver explicación sencilla)"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </span>
              <Sun className="w-5 h-5 text-[#FF8300] flex-shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-light font-mono text-white mb-1">
              {sizing.recommendedKwp} <span className="text-sm sm:text-base text-white/50">kWp</span>
            </div>
            <p className="text-xs text-white/60 font-light leading-snug">
              {sizing.panelsCount} Módulos Tier 1 N-Type TOPCon {sizing.panelWatts}W
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-white/10 text-[11px] text-white/60 font-mono flex items-center justify-between gap-1 flex-wrap">
            <span className="text-[#FF8300]">Inversor: <strong className="text-white font-medium">{sizing.inverterKw} kW</strong></span>
            <button
              onClick={() => setActiveModalKey("kwp")}
              className="text-[#FF8300] hover:underline text-[10px] cursor-pointer"
            >
              ¿Cómo funciona?
            </button>
          </div>
        </div>

        {/* Metric 2: Batería LiFePO4 & Capacidad Útil */}
        <div className="p-5 sm:p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-lg flex flex-col justify-between relative group min-h-[210px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                ALMACENAMIENTO BESS
                <button
                  type="button"
                  onClick={() => setActiveModalKey("bess")}
                  className="text-white/40 hover:text-emerald-400 transition-colors cursor-pointer"
                  title="¿Qué es esto? (Ver explicación sencilla)"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </span>
              <Battery className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-light font-mono text-white mb-1">
              {sizing.batteryKwh > 0 ? `${sizing.batteryKwh} kWh` : "Sin Baterías"}
            </div>
            <p className="text-xs text-white/60 font-light leading-snug">
              {sizing.batteryKwh > 0
                ? `Capacidad útil: ${sizing.usableBatteryKwh || Math.round(sizing.batteryKwh * 0.85)} kWh (DoD 90%)`
                : "Inyección directa Ley Net Billing"}
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-white/10 text-[11px] font-mono flex items-center justify-between gap-1 flex-wrap">
            <span className={sizing.batteryKwh > 0 ? "text-white" : "text-emerald-400"}>
              {sizing.batteryKwh > 0 ? "Respaldo en cortes" : "On-Grid"}
            </span>
            <button
              onClick={() => setActiveModalKey("bess")}
              className="text-emerald-400 hover:underline text-[10px] cursor-pointer"
            >
              ¿Cómo funciona?
            </button>
          </div>
        </div>

        {/* Metric 3: Ahorro Anual Net Billing */}
        <div className="p-5 sm:p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-lg flex flex-col justify-between relative group min-h-[210px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold flex items-center gap-1.5">
                AHORRO AÑO 1
                <button
                  type="button"
                  onClick={() => setActiveModalKey("netbilling")}
                  className="text-white/40 hover:text-blue-400 transition-colors cursor-pointer"
                  title="¿Qué es esto? (Ver explicación sencilla)"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </span>
              <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl lg:text-[22px] xl:text-2xl 2xl:text-3xl font-light font-mono text-white mb-1">
              {formatCurrency(sizing.estimatedAnnualSavingsClp)}
            </div>
            <p className="text-xs text-white/60 font-light leading-snug">
              Autoconsumo {sizing.autoconsumoPct}% + Excedentes
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-white/10 text-[10px] sm:text-[11px] text-blue-400 font-mono flex items-center justify-between gap-1 flex-wrap">
            <span>A 25 años: <strong className="text-white font-medium">{formatCurrency(sizing.estimated25YearSavingsClp)}</strong></span>
            <button
              onClick={() => setActiveModalKey("netbilling")}
              className="text-blue-400 hover:underline text-[10px] cursor-pointer"
            >
              ¿Cómo funciona?
            </button>
          </div>
        </div>

        {/* Metric 4: Retorno Financiero & VAN */}
        <div className="p-5 sm:p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-lg flex flex-col justify-between relative group min-h-[210px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                RETORNO & GARANTÍA
                <button
                  type="button"
                  onClick={() => setActiveModalKey("retorno")}
                  className="text-white/40 hover:text-amber-400 transition-colors cursor-pointer"
                  title="¿Qué es esto? (Ver explicación sencilla)"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </span>
              <Leaf className="w-5 h-5 text-amber-400 flex-shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-light font-mono text-white mb-1">
              {sizing.paybackYears} <span className="text-sm sm:text-base text-white/50">años</span>
            </div>
            <p className="text-xs text-white/60 font-light leading-snug">
              Garantía 25 Años • -{sizing.co2TonsAvoidedPerYear} Ton CO2
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-white/10 text-[10px] sm:text-[11px] text-amber-400 font-mono flex items-center justify-between gap-1 flex-wrap">
            <span>VAN: <strong className="text-white font-medium">{sizing.vanClp ? formatCurrency(sizing.vanClp) : "Positivo"}</strong></span>
            <button
              onClick={() => setActiveModalKey("retorno")}
              className="text-amber-400 hover:underline text-[10px] cursor-pointer"
            >
              ¿Cómo se paga?
            </button>
          </div>
        </div>
      </div>

      {/* PRESUPUESTO LLAVE EN MANO & Hitos 50/35/15 */}
      <div className="w-full">
        {/* Turnkey Pricing & Cashflow Milestones */}
        <div className="w-full p-6 sm:p-8 rounded-[24px] sm:rounded-[28px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-lg space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] font-semibold flex items-center gap-1.5">
                <Wallet className="w-4 h-4" />
                PRESUPUESTO LLAVE EN MANO
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mt-3 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs text-white/50 font-light block">Inversión Total Estimada (IVA incluído)</span>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  {formatCurrency(sizing.estimatedSystemCostIvaClp || Math.round((sizing.estimatedSystemCostNetoClp || 0) * 1.19))}
                </div>
              </div>
              <div className="sm:text-right">
                <span className="text-xs text-white/50 font-light block">Precio Neto</span>
                <span className="text-lg sm:text-xl font-mono text-[#FF8300] font-bold">
                  {formatCurrency(sizing.estimatedSystemCostNetoClp || 0)}
                </span>
                <span className="text-[11px] text-white/40 block font-mono">
                  ~{formatCurrency(Math.round((sizing.estimatedSystemCostNetoClp || 0) / Math.max(1, sizing.recommendedKwp)))} / kWp
                </span>
              </div>
            </div>

            {/* 50 / 35 / 15 Milestones */}
            <div className="mt-5 space-y-3">
              <span className="text-[11px] font-mono text-white/60 uppercase tracking-wider block">
                Esquema de Cobranza por Hitos de Avance
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-black/40 border border-orange-500/30 space-y-1">
                  <div className="flex items-center justify-between text-[#FF8300] font-bold font-mono text-[11px]">
                    <span>1. Anticipo 50%</span>
                    <span>Firma</span>
                  </div>
                  <div className="text-sm font-black text-white font-mono">
                    {formatCurrency(sizing.downpaymentHito1Clp || Math.round((sizing.estimatedSystemCostNetoClp || 0) * 0.5))}
                  </div>
                  <p className="text-[10px] text-white/50 leading-tight">
                    Reserva y compra de Inversor, Paneles, Estructura y protecciones.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-amber-500/30 space-y-1">
                  <div className="flex items-center justify-between text-amber-400 font-bold font-mono text-[11px]">
                    <span>2. En Obra 35%</span>
                    <span>Montaje</span>
                  </div>
                  <div className="text-sm font-black text-white font-mono">
                    {formatCurrency(sizing.faenaHito2Clp || Math.round((sizing.estimatedSystemCostNetoClp || 0) * 0.35))}
                  </div>
                  <p className="text-[10px] text-white/50 leading-tight">
                    Llegada a terreno, canalización Conduit EMT y montaje eléctrico.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/30 space-y-1">
                  <div className="flex items-center justify-between text-emerald-400 font-bold font-mono text-[11px]">
                    <span>3. Final 15%</span>
                    <span>Certificación Netbilling</span>
                  </div>
                  <div className="text-sm font-black text-white font-mono">
                    {formatCurrency(sizing.finalHito3Clp || Math.round((sizing.estimatedSystemCostNetoClp || 0) * 0.15))}
                  </div>
                  <p className="text-[10px] text-white/50 leading-tight">
                    Puesta en marcha, entrega de carpeta SEC y cambio de medidor.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 text-[11px] text-white/50 font-light flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span>El precio es estimado y se ajustará según las condiciones de la instalación. Esta cotización tiene una validez de 15 días.</span>
            <span className="shrink-0">✓ Cero sobrecostos ocultos</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Chart: Generación Solar vs Consumo Real de tu Casa (Sur de Chile) */}
      {monthlyData.length > 0 && (
        <SolarSeasonalChart
          monthlyData={monthlyData}
          comuna={formData.comuna}
          distributor={formData.distributor}
          sizing={sizing}
        />
      )}

      {/* Spotlight: Tu Nueva Realidad Energética */}
      <div className="w-full p-6 sm:p-8 rounded-[24px] sm:rounded-[28px] bg-gradient-to-r from-orange-950/30 via-[#1F1F1F] to-black border border-[#FF8300]/30 shadow-xl flex flex-col items-center justify-center text-center">
        <div className="space-y-3 flex flex-col items-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF8300]/10 border border-[#FF8300]/30 text-[#FF8300] text-xs font-mono font-medium">
            <Zap className="w-3.5 h-3.5" />
            <span>TU NUEVA REALIDAD ENERGÉTICA</span>
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-white tracking-tight">
            Ahorras aproximadamente <strong className="text-white font-medium">{formatCurrency(sizing.estimatedAnnualSavingsClp)} al año</strong>.
          </h3>
          <p className="text-xs sm:text-sm text-white/60 font-light max-w-2xl mx-auto">
            Generarás aproximadamente <strong className="text-white font-medium">{formatNumber(sizing.estimatedAnnualGenKwh)} kWh/año</strong> limpios en tu techo en {formData.comuna}, reduciendo drásticamente tus cuentas eléctricas.
          </p>

          <button
            type="button"
            onClick={() => setIsServicesModalOpen(true)}
            className="mt-2 px-6 py-2.5 rounded-full border border-white/20 hover:border-[#FF8300] bg-white/5 hover:bg-[#FF8300]/10 text-white/90 hover:text-white text-xs font-light tracking-wide transition-all shadow-md hover:shadow-[0_0_20px_rgba(255,131,0,0.2)] flex items-center gap-2 cursor-pointer group"
          >
            <ShieldCheck className="w-4 h-4 text-[#FF8300] group-hover:scale-110 transition-transform" />
            <span>Ver Servicios Incluídos</span>
          </button>
        </div>
      </div>

      {/* Checklist del Proceso Residencial (Paso a Paso) */}
      <div className="p-5 sm:p-8 rounded-[24px] sm:rounded-[28px] bg-[#1A1A1A] border border-white/10 shadow-xl">
        <div className="mb-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-light text-white">
            Checklist del Proceso Residencial Llave en Mano
          </h3>
          <p className="text-xs text-white/60 font-light mt-1">
            Así es la ruta sin complicaciones para transformar tu casa o parcela en un hogar solar autosuficiente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {[
            {
              step: "01",
              title: "Pre-Informe Digital",
              desc: "Cálculo técnico con meteorología local y dimensionamiento preliminar de la planta solar.",
              status: "COMPLETADO",
              icon: FileCheck2,
            },
            {
              step: "02",
              title: "Visita en Terreno",
              desc: "Inspección de techos, sombras y empalme con Ingeniero.",
              status: "SIGUIENTE PASO",
              icon: Calendar,
            },
            {
              step: "03",
              title: "Firma de Contrato",
              desc: "Con la propuesta revisada y cuando estés listo para avanzar, te enviaremos el contrato.",
              status: "PENDIENTE",
              icon: FileText,
            },
            {
              step: "04",
              title: "Ejecución del Proyecto",
              desc: "Ingeniería de detalle, planos ejecutivos, montaje e instalación eléctrica.",
              status: "PENDIENTE",
              icon: Wrench,
            },
            {
              step: "05",
              title: "Proceso de Certificación SEC",
              desc: "Tramitación legal ante distribuidora y cambio/activación de medidor para Netbilling.",
              status: "PENDIENTE",
              icon: Award,
            },
          ].map((item, i) => {
            const Icon = item.icon;
            const isCurrent = item.status === "SIGUIENTE PASO";
            const isDone = item.status === "COMPLETADO";

            return (
              <div
                key={i}
                className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? "bg-[#FF8300]/10 border-[#FF8300] shadow-lg shadow-[#FF8300]/10 scale-[1.01]"
                    : isDone
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-black/30 border-white/10 text-white/70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-white/40">{item.step}</span>
                    <Icon className={`w-4 h-4 ${isCurrent ? "text-[#FF8300]" : isDone ? "text-emerald-400" : "text-white/30"}`} />
                  </div>
                  <h4 className="text-sm font-medium text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-white/60 font-light leading-snug">{item.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-[10px] font-mono">
                  <span className={isCurrent ? "text-[#FF8300] font-bold" : isDone ? "text-emerald-400" : "text-white/30"}>
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Crédito Verde BancoEstado (If user selected credit) */}
      {sizing.financingSimulation && (
        <div className="p-5 sm:p-8 rounded-[24px] sm:rounded-[28px] bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-black border border-emerald-500/40 shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 flex-1 text-center md:text-left">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center justify-center md:justify-start gap-1.5">
                <Leaf className="w-4 h-4" />
                <span>Simulación Crédito Verde BancoEstado</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-light text-white">
                Cuota Mensual Estimada: <strong className="text-emerald-400 font-mono text-2xl sm:text-3xl font-medium">{formatCurrency(sizing.financingSimulation.valorCuota)}</strong>
              </h3>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-xs text-white/70 font-light">
                <span>RUT: {formData.rut}</span>
                <span className="hidden sm:inline text-white/30">•</span>
                <span>Monto Líquido: {formatCurrency(sizing.financingSimulation.montoLiquido)}</span>
                <span className="hidden sm:inline text-white/30">•</span>
                <span>{sizing.financingSimulation.numeroCuotas} Cuotas</span>
                <span className="hidden sm:inline text-white/30">•</span>
                <span>Tasa Mensual: {sizing.financingSimulation.tasaInteresMensual}%</span>
                <span className="hidden sm:inline text-white/30">•</span>
                <span>CAE: {sizing.financingSimulation.cae}%</span>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col gap-3 flex-shrink-0 no-print">
              <button
                type="button"
                className="w-full px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-light text-xs uppercase tracking-wide shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                onClick={() => alert("El PDF oficial de simulación se encuentra en proceso de extracción por parte de nuestros sistemas (RPA) y se adjuntará pronto a su portal.")}
              >
                <Download className="w-4 h-4" />
                <span>Descargar Simulación Oficial (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Technical Visit CTA Box */}
      <div className="w-full p-6 sm:p-10 md:p-12 rounded-[24px] sm:rounded-[28px] bg-gradient-to-br from-[#FF8300]/20 via-[#1F1F1F] to-[#141414] border border-[#FF8300]/40 shadow-2xl flex flex-col items-center justify-center text-center no-print">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FF8300] text-white flex items-center justify-center mb-4 shadow-lg shadow-[#FF8300]/30">
            <Calendar className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-normal text-white mb-2">
            Siguiente Paso: Visita en Terreno
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-white/70 font-light leading-relaxed mb-6 max-w-xl mx-auto">
            Un Ingeniero te contactará para coordinar una Visita Técnica en tu propiedad en {formData.comuna}, también puedes adelantarte y coordinarla en el siguiente botón:
          </p>

          <button
            type="button"
            onClick={() => openModal()}
            className="w-full max-w-lg mx-auto py-3.5 sm:py-4 px-8 rounded-full bg-[#FF8300] hover:bg-[#e07400] text-white font-medium text-xs md:text-sm uppercase tracking-wider transition-all duration-300 shadow-xl shadow-[#FF8300]/25 cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>Agendar Visita Técnica</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Secondary Actions: Volver & Crear Nueva Cotización */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-5 w-full max-w-lg mx-auto">
            <button
              type="button"
              onClick={onBack || onReset}
              className="px-5 py-2.5 rounded-full border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-light tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="px-5 py-2.5 rounded-full border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-light tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Crear Nueva Cotización</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preguntas Frecuentes (FAQ) */}
      <div className="w-full p-6 sm:p-10 rounded-[24px] sm:rounded-[28px] bg-[#1A1A1A] border border-white/10 shadow-xl space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-6 sm:mb-8">
          <h3 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Preguntas Frecuentes
          </h3>
          <p className="text-xs sm:text-sm text-white/60 font-light">
            Todo lo que necesitas saber antes de dar el paso hacia la energía solar en tu hogar.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer transition-colors"
                >
                  <span className="text-sm sm:text-base font-medium text-white pr-4 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "bg-[#FF8300]/20 text-[#FF8300] rotate-180"
                        : "bg-white/5 text-white/50"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-sm sm:text-base text-white/70 font-light leading-relaxed border-t border-white/5 mt-1">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanatory Modal Dialog ("Con peras y manzanas") */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-8 rounded-[28px] bg-[#1F1F1F] border border-white/15 shadow-2xl relative text-white space-y-6"
            >
              <button
                onClick={() => setActiveModalKey(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] font-semibold block mb-1">
                  {activeModal.subtitle}
                </span>
                <h3 className="text-xl md:text-2xl font-light text-white leading-snug">
                  {activeModal.title}
                </h3>
              </div>

              {/* Analogy Box */}
              <div className="p-4 rounded-2xl bg-[#FF8300]/10 border border-[#FF8300]/30 text-xs md:text-sm text-white/90 font-light leading-relaxed">
                💡 <strong>En palabras simples:</strong> {activeModal.analogy}
              </div>

              {/* Details List */}
              <div className="space-y-2.5">
                {activeModal.details.map((det, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-2 text-xs text-white/70 font-light">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{det}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveModalKey(null)}
                  className="px-6 py-2.5 rounded-full bg-white text-black text-xs uppercase tracking-wider font-light hover:bg-[#FF8300] hover:text-white transition-all cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Servicios Incluídos en el Proyecto Residencial */}
      <AnimatePresence>
        {isServicesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl max-h-[90vh] flex flex-col p-6 sm:p-8 rounded-[28px] bg-[#1A1A1A] border border-white/15 shadow-2xl relative text-white"
            >
              <button
                onClick={() => setIsServicesModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="mb-6 pr-8">
                <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] font-semibold flex items-center gap-1.5 mb-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>PROYECTO SOLAR RESIDENCIAL LLAVE EN MANO</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight">
                  Servicios Incluídos en tu Proyecto
                </h3>
                <p className="text-xs sm:text-sm text-white/60 font-light mt-1 leading-relaxed">
                  Con SoldeRío no compras solo equipos: obtienes una solución integral garantizada de inicio a fin.
                </p>
              </div>

              {/* Body: List of 7 services */}
              <div className="overflow-y-auto pr-1 space-y-3 flex-1 max-h-[55vh]">
                {RESIDENTIAL_INCLUDED_SERVICES.map((serv, sIdx) => {
                  const Icon = serv.icon;
                  return (
                    <div
                      key={sIdx}
                      className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-[#FF8300]/40 transition-colors flex items-start gap-3.5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#FF8300]/10 border border-[#FF8300]/25 flex items-center justify-center text-[#FF8300] flex-shrink-0 mt-0.5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h4 className="text-sm font-medium text-white">{serv.title}</h4>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {serv.badge}
                          </span>
                        </div>
                        <p className="text-xs text-white/70 font-light leading-relaxed">
                          {serv.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="pt-5 mt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-white/50 font-light text-center sm:text-left">
                  ✓ Estándar SEC y garantía directa en el Sur de Chile.
                </span>
                <button
                  type="button"
                  onClick={() => setIsServicesModalOpen(false)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#FF8300] hover:bg-[#e07400] text-white text-xs font-medium tracking-wider uppercase transition-all shadow-md cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Printable Executive Report Modal (A4 Light-Theme Pixel-Perfect Layout) */}
      <ExecutiveReportModal
        isOpen={isExecutiveReportOpen}
        onClose={() => setIsExecutiveReportOpen(false)}
        formData={formData}
        sizing={sizing}
        leadId={leadId}
      />

    </div>
  );
}

