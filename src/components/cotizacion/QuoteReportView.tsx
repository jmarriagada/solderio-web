"use client";

import { motion } from "framer-motion";
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
  Download
} from "lucide-react";
import { SolarSizingResult, QuoteFormData } from "@/types/cotizacion";
import { useVisitaModal } from "@/context/VisitaModalContext";

interface Props {
  formData: QuoteFormData;
  sizing: SolarSizingResult;
  leadId: string;
  onReset: () => void;
}

export function QuoteReportView({ formData, sizing, leadId, onReset }: Props) {
  const { openModal } = useVisitaModal();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 text-white space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Banner */}
      <div className="p-8 md:p-10 rounded-[28px] bg-gradient-to-br from-[#1F1F1F] via-[#181818] to-black border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF8300]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono mb-3 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Pre-Informe Técnico Generado • ID: {leadId}</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-light tracking-tight text-white mb-2">
              Propuesta Solar para {formData.fullName}
            </h2>
            <p className="text-white/60 text-xs md:text-sm font-light">
              Ubicación: <span className="text-white capitalize">{formData.comuna}</span> • Gasto Base:{" "}
              <span className="text-[#FF8300] font-mono">{formatCurrency(formData.monthlyBillClp)} / mes</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onReset}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Calcular de nuevo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <a
              href={`https://wa.me/56987654321?text=Hola%20SoldeR%C3%ADo,%20acabo%20de%20generar%20mi%20pre-informe%20solar%20(${leadId})%20y%20deseo%20agendar%20la%20visita%20t%C3%A9cnica.`}
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

      {/* 4 Main Technical & Financial Metrics Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Potencia Peak */}
        <div className="p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF8300] font-semibold">
                POTENCIA SUGERIDA
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
          <div className="pt-4 mt-4 border-t border-white/10 text-[11px] text-white/40 font-mono">
            Gen: ~{sizing.estimatedAnnualGenKwh.toLocaleString("es-CL")} kWh/año
          </div>
        </div>

        {/* Metric 2: Batería LiFePO4 */}
        <div className="p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                ALMACENAMIENTO BESS
              </span>
              <Battery className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-light font-mono text-white mb-1">
              {sizing.batteryKwh > 0 ? `${sizing.batteryKwh} kWh` : "On-Grid"}
            </div>
            <p className="text-xs text-white/60 font-light">
              {sizing.batteryKwh > 0
                ? "Banco LiFePO4 seguro (+6.000 ciclos)"
                : "Inyección directa Ley 21.118"}
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-white/10 text-[11px] text-emerald-400 font-mono">
            {sizing.batteryKwh > 0 ? "Respaldo <10ms en cortes" : "Sin costo de baterías"}
          </div>
        </div>

        {/* Metric 3: Ahorro Anual Proyectado */}
        <div className="p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold">
                AHORRO ANUAL ESTIMADO
              </span>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-2xl lg:text-3xl font-light font-mono text-emerald-400 mb-1">
              {formatCurrency(sizing.estimatedAnnualSavingsClp)}
            </div>
            <p className="text-xs text-white/60 font-light">
              Hasta {sizing.autoconsumoPct}% de reducción en tu boleta
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-white/10 text-[11px] text-white/40 font-mono">
            A 25 años: {formatCurrency(sizing.estimated25YearSavingsClp)}
          </div>
        </div>

        {/* Metric 4: Retorno & Medioambiente */}
        <div className="p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                RETORNO & IMPACTO
              </span>
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-light font-mono text-white mb-1">
              {sizing.paybackYears} <span className="text-base text-white/50">años</span>
            </div>
            <p className="text-xs text-white/60 font-light">
              -{sizing.co2TonsAvoidedPerYear} Ton CO2/año ({sizing.equivalentTreesPlanted} árboles)
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-white/10 text-[11px] text-amber-400 font-mono">
            Garantía módulos: 25 Años
          </div>
        </div>
      </div>

      {/* SEC Normative Compliance & Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Engineering & Normative Badges (7 cols) */}
        <div className="lg:col-span-7 p-8 rounded-[28px] bg-[#1A1A1A] border border-white/10 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#FF8300] text-xs font-mono uppercase mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Estándar Normativo Obligatorio SEC</span>
            </div>
            <h3 className="text-xl font-light text-white mb-4">
              Instalación Certificada Llave en Mano
            </h3>
            <p className="text-xs md:text-sm text-white/70 font-light leading-relaxed mb-6">
              Tu proyecto será dimensionado al detalle y declarado formalmente ante la SEC por nuestro equipo de ingenieros Clase A, garantizando cumplimiento de los pliegos RIC y la Ley Net Billing.
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
            <span>Sistema: <strong className="text-[#FF8300] uppercase font-mono">{formData.systemType}</strong></span>
          </div>
        </div>

        {/* Right: Schedule Technical Visit CTA Box (5 cols) */}
        <div className="lg:col-span-5 p-8 rounded-[28px] bg-gradient-to-br from-[#FF8300]/20 via-[#1F1F1F] to-[#141414] border border-[#FF8300]/40 shadow-2xl flex flex-col justify-between text-center">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#FF8300] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#FF8300]/30">
              <Calendar className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-normal text-white mb-2">
              Siguiente Paso: Visita a Terreno
            </h3>
            <p className="text-xs text-white/70 font-light leading-relaxed mb-6">
              Un Ingeniero Eléctrico SEC visitará tu propiedad para realizar el levantamiento de techumbre, medición de sombras y verificar tu empalme.
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

    </div>
  );
}
