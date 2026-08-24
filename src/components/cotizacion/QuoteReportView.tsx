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
  RotateCcw,
  Sparkles,
  CloudSun,
  HelpCircle,
  X,
  Printer,
  Refrigerator,
  Wifi,
  Flame,
  Tv,
  Car,
  Clock,
  FileCheck2,
  Wrench,
  Award,
  AlertCircle
} from "lucide-react";
import { SolarSizingResult, QuoteFormData, MonthlyGenBreakdown } from "@/types/cotizacion";
import { useVisitaModal } from "@/context/VisitaModalContext";

interface Props {
  formData: QuoteFormData;
  sizing: SolarSizingResult;
  leadId: string;
  onReset: () => void;
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

export function QuoteReportView({ formData, sizing, leadId, onReset }: Props) {
  const { openModal } = useVisitaModal();
  const [hoveredMonth, setHoveredMonth] = useState<MonthlyGenBreakdown | null>(null);
  const [activeModalKey, setActiveModalKey] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const monthlyData = sizing.monthlyBreakdown || [];
  const maxMonthlyVal = Math.max(
    ...monthlyData.map((m) => Math.max(m.monthlyGenKwh, m.monthlyDemandKwh)),
    1
  );

  const activeModal = activeModalKey ? EXPLANATORY_MODALS[activeModalKey] : null;

  return (
    <div className="w-full max-w-5xl mx-auto py-8 text-white space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Banner */}
      <div className="p-8 md:p-10 rounded-[28px] bg-gradient-to-br from-[#1F1F1F] via-[#181818] to-black border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF8300]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono mb-3 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Pre-Informe de Ingeniería • ID: {leadId}</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-light tracking-tight text-white mb-2">
              Propuesta Solar para {formData.fullName}
            </h2>
            <p className="text-white/60 text-xs md:text-sm font-light">
              Ubicación: <span className="text-white capitalize">{formData.comuna}</span> • Gasto Actual:{" "}
              <span className="text-[#FF8300] font-mono">{formatCurrency(formData.monthlyBillClp)} / mes</span> • Distribuidora:{" "}
              <span className="text-white capitalize">{formData.distributor}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 no-print">
            <button
              onClick={() => window.print()}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Descargar o Imprimir Ficha PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onReset}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Calcular de nuevo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <a
              href={`https://wa.me/56987654321?text=Hola%20SoldeR%C3%ADo,%20acabo%20de%20generar%20mi%20pre-informe%20solar%20(${leadId})%20para%20${formData.comuna}%20y%20deseo%20coordinar%20mi%20visita%20t%C3%A9cnica.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#FF8300] text-white font-light text-xs md:text-sm hover:bg-[#e07400] transition-all shadow-lg hover:shadow-[0_0_25px_rgba(255,131,0,0.5)] flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hablar con un Ingeniero</span>
            </a>
          </div>
        </div>
      </div>

      {/* Spotlight: "¿Cuánto vas a pagar ahora?" (Comparativa de Boleta) */}
      <div className="p-8 rounded-[28px] bg-gradient-to-r from-emerald-950/40 via-[#181818] to-emerald-900/20 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>TU NUEVA REALIDAD ENERGÉTICA</span>
            </span>
            <h3 className="text-2xl md:text-3xl font-light text-white">
              Tu cuenta mensual baja de{" "}
              <span className="line-through text-white/50">{formatCurrency(formData.monthlyBillClp)}</span> a solo{" "}
              <strong className="text-emerald-400 font-mono font-normal">
                {formatCurrency(sizing.estimatedNewMonthlyBillClp || 14500)} / mes
              </strong>
            </h3>
            <p className="text-xs md:text-sm text-white/70 font-light">
              Ahorras aproximadamente <strong className="text-white font-medium">{formatCurrency(sizing.estimatedAnnualSavingsClp)} al año</strong> que antes regalabas a {formData.distributor}.
              {sizing.winterLimitSavingsClp ? ` (Incluye ~$${sizing.winterLimitSavingsClp.toLocaleString("es-CL")} ahorrados al eliminar el Límite de Invierno).` : ""}
            </p>
          </div>

          <div className="flex-shrink-0 bg-emerald-500/10 border border-emerald-500/30 px-6 py-4 rounded-2xl text-center">
            <span className="text-[11px] font-mono text-emerald-300 uppercase block">COBERTURA SOLAR ANUAL</span>
            <span className="text-3xl md:text-4xl font-light font-mono text-emerald-400">
              {sizing.coberturaTotalAnualPct || 88}%
            </span>
          </div>
        </div>
      </div>

      {/* 4 Main Technical & Financial Metrics Bento with Help Modals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Potencia Peak & Módulos */}
        <div className="p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-lg flex flex-col justify-between relative group">
          <div>
            <div className="flex items-center justify-between mb-4">
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
              <Sun className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-light font-mono text-white mb-1">
              {sizing.recommendedKwp} <span className="text-base text-white/50">kWp</span>
            </div>
            <p className="text-xs text-white/60 font-light">
              {sizing.panelsCount} Módulos Tier 1 N-Type TOPCon {sizing.panelWatts}W
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-white/10 text-[11px] text-white/50 font-mono flex items-center justify-between">
            <span>Inversor: {sizing.inverterKw} kW</span>
            <button
              onClick={() => setActiveModalKey("kwp")}
              className="text-[#FF8300] hover:underline text-[10px]"
            >
              ¿Cómo funciona?
            </button>
          </div>
        </div>

        {/* Metric 2: Batería LiFePO4 & Capacidad Útil */}
        <div className="p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-lg flex flex-col justify-between relative group">
          <div>
            <div className="flex items-center justify-between mb-4">
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
              <Battery className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-light font-mono text-white mb-1">
              {sizing.batteryKwh > 0 ? `${sizing.batteryKwh} kWh` : "On-Grid"}
            </div>
            <p className="text-xs text-white/60 font-light">
              {sizing.batteryKwh > 0
                ? `Capacidad útil: ${sizing.usableBatteryKwh || Math.round(sizing.batteryKwh * 0.85)} kWh (DoD 90%)`
                : "Inyección directa Ley Net Billing"}
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-white/10 text-[11px] text-emerald-400 font-mono flex items-center justify-between">
            <span>{sizing.batteryKwh > 0 ? "Respaldo <10ms en cortes" : "Sin baterías"}</span>
            <button
              onClick={() => setActiveModalKey("bess")}
              className="text-emerald-400 hover:underline text-[10px]"
            >
              ¿Cómo funciona?
            </button>
          </div>
        </div>

        {/* Metric 3: Ahorro Anual Net Billing */}
        <div className="p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-lg flex flex-col justify-between relative group">
          <div>
            <div className="flex items-center justify-between mb-4">
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
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-2xl lg:text-3xl font-light font-mono text-emerald-400 mb-1">
              {formatCurrency(sizing.estimatedAnnualSavingsClp)}
            </div>
            <p className="text-xs text-white/60 font-light">
              Autoconsumo {sizing.autoconsumoPct}% + Excedentes a tu favor
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-white/10 text-[11px] text-white/50 font-mono flex items-center justify-between">
            <span>25 Años: {formatCurrency(sizing.estimated25YearSavingsClp)}</span>
            <button
              onClick={() => setActiveModalKey("netbilling")}
              className="text-blue-400 hover:underline text-[10px]"
            >
              Ley 21.118
            </button>
          </div>
        </div>

        {/* Metric 4: Retorno Financiero & VAN */}
        <div className="p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-lg flex flex-col justify-between relative group">
          <div>
            <div className="flex items-center justify-between mb-4">
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
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-light font-mono text-white mb-1">
              {sizing.paybackYears} <span className="text-base text-white/50">años</span>
            </div>
            <p className="text-xs text-white/60 font-light">
              Garantía de 25 Años • -{sizing.co2TonsAvoidedPerYear} Ton CO2/año
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-white/10 text-[11px] text-amber-400 font-mono flex items-center justify-between">
            <span>VAN: {sizing.vanClp ? formatCurrency(sizing.vanClp) : "Positivo"}</span>
            <button
              onClick={() => setActiveModalKey("retorno")}
              className="text-amber-400 hover:underline text-[10px]"
            >
              ¿Cómo se paga?
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Chart: Generación Solar vs Consumo Real de tu Casa (Sur de Chile) */}
      <div className="p-8 rounded-[28px] bg-[#1A1A1A] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-[#FF8300] text-xs font-mono uppercase mb-1">
              <CloudSun className="w-4 h-4" />
              <span>Simulación Física Mensual ({formData.comuna})</span>
            </div>
            <h3 className="text-xl md:text-2xl font-light text-white">
              Generación Solar vs Consumo de tu Hogar (Mes a Mes)
            </h3>
            <p className="text-xs text-white/60 font-light mt-1">
              Compara mes a mes tu generación solar estimada con la demanda real de tu vivienda en el sur.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono bg-black/40 px-4 py-2 rounded-xl border border-white/5">
            <div className="text-center">
              <span className="text-white/40 block text-[10px]">VERANO SOLAR</span>
              <span className="text-amber-400 font-semibold">
                {sizing.summerAvgMonthlyGenKwh || Math.round(sizing.estimatedAnnualGenKwh / 8)} kWh/mes
              </span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="text-center">
              <span className="text-white/40 block text-[10px]">INVIERNO SOLAR</span>
              <span className="text-blue-400 font-semibold">
                {sizing.winterAvgMonthlyGenKwh || Math.round(sizing.estimatedAnnualGenKwh / 26)} kWh/mes
              </span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="text-center">
              <span className="text-white/40 block text-[10px]">VARIACIÓN SUR</span>
              <span className="text-[#FF8300] font-semibold">{sizing.seasonalVariationRatio || 3.4}x</span>
            </div>
          </div>
        </div>

        {/* 12-Month Side-by-Side Visualizer */}
        <div className="pt-6 pb-2">
          <div className="grid grid-cols-12 gap-1.5 md:gap-3 items-end h-56 border-b border-white/10 pb-2">
            {monthlyData.map((m) => {
              const genHeightPercent = Math.max(8, Math.round((m.monthlyGenKwh / maxMonthlyVal) * 100));
              const demandHeightPercent = Math.max(8, Math.round((m.monthlyDemandKwh / maxMonthlyVal) * 100));
              const isHovered = hoveredMonth?.month === m.month;
              const hasSurplus = m.monthlyGenKwh >= m.monthlyDemandKwh;

              return (
                <div
                  key={m.month}
                  className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                  onMouseEnter={() => setHoveredMonth(m)}
                  onMouseLeave={() => setHoveredMonth(null)}
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-20 z-30 bg-black/95 text-white text-[11px] font-mono px-3.5 py-2 rounded-xl border border-white/20 shadow-2xl pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-90 duration-200">
                      <span className="text-[#FF8300] font-bold block">{m.monthName}</span>
                      <span className="text-amber-400">☀️ Generación: {m.monthlyGenKwh} kWh</span>
                      <span className="text-white/70 block">🏠 Consumo casa: {m.monthlyDemandKwh} kWh</span>
                      <span className={hasSurplus ? "text-emerald-400 font-bold block" : "text-blue-300 block"}>
                        {hasSurplus ? `+${m.monthlyGenKwh - m.monthlyDemandKwh} kWh Excedente inyectado` : `-${m.monthlyDemandKwh - m.monthlyGenKwh} kWh Red/Batería`}
                      </span>
                    </div>
                  )}

                  {/* Dual Bars Container */}
                  <div className="flex items-end gap-1 w-full justify-center h-full">
                    {/* Solar Generation Bar */}
                    <div
                      style={{ height: `${genHeightPercent}%` }}
                      className={`w-1/2 rounded-t-md transition-all duration-300 ${
                        isHovered
                          ? "bg-[#FF8300] shadow-[0_0_15px_rgba(255,131,0,0.6)]"
                          : "bg-gradient-to-t from-amber-600 to-amber-400"
                      }`}
                      title={`Generación: ${m.monthlyGenKwh} kWh`}
                    />
                    
                    {/* Home Demand Bar */}
                    <div
                      style={{ height: `${demandHeightPercent}%` }}
                      className="w-1/2 rounded-t-md bg-white/25 hover:bg-white/40 transition-all duration-300"
                      title={`Consumo casa: ${m.monthlyDemandKwh} kWh`}
                    />
                  </div>
                  
                  {/* Month Label */}
                  <span className={`text-[10px] font-mono mt-2 transition-colors ${isHovered ? "text-[#FF8300] font-bold" : "text-white/50"}`}>
                    {m.monthName.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-white/50 font-mono mt-4 gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Generación Solar</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-white/30" /> Consumo Estimado de tu Hogar</span>
            </div>
            <span className="text-emerald-400">
              ⚡ En verano acumulas saldos para cubrir el invierno
            </span>
          </div>
        </div>
      </div>

      {/* Everyday Appliances Powered ("Con peras y manzanas") */}
      <div className="p-8 rounded-[28px] bg-[#1F1F1F]/90 border border-white/10 shadow-xl">
        <div className="mb-6">
          <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] block mb-1">
            CONTINUIDAD OPERATIVA EN TU HOGAR
          </span>
          <h3 className="text-xl md:text-2xl font-light text-white">
            ¿Qué podrás mantener funcionando con tu planta solar?
          </h3>
          <p className="text-xs text-white/60 font-light mt-1">
            Equipamiento cotidiano respaldado por tu sistema fotovoltaico con y sin cortes de luz.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sizing.applianceEquivalencies?.map((app, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FF8300]/10 text-[#FF8300] flex items-center justify-center flex-shrink-0">
                {idx === 0 && <Refrigerator className="w-5 h-5" />}
                {idx === 1 && <Wifi className="w-5 h-5" />}
                {idx === 2 && <Flame className="w-5 h-5" />}
                {idx === 3 && <Zap className="w-5 h-5" />}
                {idx >= 4 && <Car className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">{app.title}</h4>
                <p className="text-xs text-white/60 font-light mt-1 leading-snug">{app.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist del Proceso Residencial (Paso a Paso) */}
      <div className="p-8 rounded-[28px] bg-[#1A1A1A] border border-white/10 shadow-xl">
        <div className="mb-6">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block mb-1">
            TRANSPARENCIA TOTAL
          </span>
          <h3 className="text-xl md:text-2xl font-light text-white">
            Checklist del Proceso Residencial Llave en Mano
          </h3>
          <p className="text-xs text-white/60 font-light mt-1">
            Así es la ruta sin complicaciones para transformar tu casa o parcela en un hogar solar autosuficiente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: "01",
              title: "Pre-Informe Digital",
              desc: "Cálculo técnico con TMY y dimensionamiento preliminar.",
              status: "COMPLETADO",
              icon: FileCheck2,
            },
            {
              step: "02",
              title: "Visita en Terreno",
              desc: "Inspección de techos, sombras y empalme con Ingeniero SEC.",
              status: "SIGUIENTE PASO",
              icon: Calendar,
            },
            {
              step: "03",
              title: "Ingeniería y Planos",
              desc: "Diseño eléctrico ejecutivo y cálculo estructural para viento sur.",
              status: "PENDIENTE",
              icon: ShieldCheck,
            },
            {
              step: "04",
              title: "Montaje en 48-72h",
              desc: "Instalación limpia, sin cables a la vista y con fijación sellada.",
              status: "PENDIENTE",
              icon: Wrench,
            },
            {
              step: "05",
              title: "Certificado TE-4 SEC",
              desc: "Tramitación legal ante distribuidora y cambio de medidor.",
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
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? "bg-[#FF8300]/10 border-[#FF8300] shadow-lg shadow-[#FF8300]/10 scale-[1.02]"
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

      {/* SEC Normative Compliance & Technical Visit CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Engineering & SEC Badges (7 cols) */}
        <div className="lg:col-span-7 p-8 rounded-[28px] bg-[#1A1A1A] border border-white/10 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#FF8300] text-xs font-mono uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Cumplimiento Normativo SEC (Pliegos RIC)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-mono text-[11px] uppercase">
                {sizing.recommendedPhaseType === "trifasico" ? "Trifásico 380V" : "Monofásico 220V"}
              </span>
            </div>
            <h3 className="text-xl font-light text-white mb-4">
              Ingeniería y Certificación SEC Llave en Mano
            </h3>
            <p className="text-xs md:text-sm text-white/70 font-light leading-relaxed mb-6">
              Tu instalación solar será proyectada y declarada formalmente ante la SEC por nuestro equipo de ingenieros Clase A, asegurando total compatibilidad con la red de {formData.distributor} y habilitando la Ley Net Billing.
            </p>

            <div className="space-y-2.5">
              {sizing.secNorms.map((norm, nIdx) => (
                <div key={nIdx} className="flex items-center gap-2 text-xs text-white/90 font-light">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{norm}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 text-xs text-white/50 font-light flex items-center justify-between">
            <span>Distribuidora: <strong className="text-white capitalize">{formData.distributor}</strong></span>
            <span>Topología: <strong className="text-[#FF8300] uppercase font-mono">{formData.systemType}</strong></span>
          </div>
        </div>

        {/* Right: Schedule Technical Visit CTA Box (5 cols) */}
        <div className="lg:col-span-5 p-8 rounded-[28px] bg-gradient-to-br from-[#FF8300]/20 via-[#1F1F1F] to-[#141414] border border-[#FF8300]/40 shadow-2xl flex flex-col justify-between text-center no-print">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#FF8300] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#FF8300]/30">
              <Calendar className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-normal text-white mb-2">
              Siguiente Paso: Visita en Terreno
            </h3>
            <p className="text-xs text-white/70 font-light leading-relaxed mb-6">
              Un Ingeniero Eléctrico SEC visitará tu propiedad en {formData.comuna} para verificar la orientación de techumbres, inclinación, pérdidas por sombreado y tablero general.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openModal()}
            className="w-full py-4 rounded-full bg-white text-black font-light text-xs md:text-sm uppercase tracking-wider hover:bg-[#FF8300] hover:text-white transition-all duration-300 shadow-xl cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>Agendar Visita Técnica</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
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

    </div>
  );
}
