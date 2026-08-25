"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Sun, 
  Battery, 
  TrendingUp, 
  Building2, 
  FileText,
  Sparkles,
  Loader2
} from "lucide-react";
import { SolarSizingResult, QuoteFormData } from "@/types/cotizacion";
import { downloadDirectSolarPdf } from "@/lib/pdf-generator";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formData: QuoteFormData;
  sizing: SolarSizingResult;
  leadId: string;
}

export function ExecutiveReportModal({ isOpen, onClose, formData, sizing, leadId }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const currentDateStr = new Date().toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    try {
      await downloadDirectSolarPdf(formData, sizing, leadId);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("No se pudo generar el archivo PDF directamente. Inténtalo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        
        {/* Floating Top Control Bar */}
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#1F1F1F]/95 p-2.5 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-md">
          <button
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-[#FF8300] hover:bg-[#e07400] text-white text-xs font-medium uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generando PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Descargar PDF Directo</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Executive Sheet Preview (A4 Dimensions) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="w-full max-w-4xl my-auto bg-white text-slate-900 rounded-[24px] shadow-2xl p-8 md:p-12 font-sans"
        >
          {/* Header Membretado */}
          <div className="flex items-center justify-between border-b-2 border-[#ea580c] pb-4 mb-6">
            <div>
              <div className="text-2xl md:text-3xl font-bold tracking-tight text-slate-950">
                SOLDE<span className="text-[#ea580c]">RÍO</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                Ingeniería Solar & Micro-Redes • Macrozona Sur de Chile
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block bg-orange-50 text-orange-800 border border-orange-200 px-3 py-1 rounded-md text-xs font-mono font-bold">
                PRE-INFORME N° {leadId}
              </div>
              <div className="text-xs text-slate-500 mt-1">Fecha: {currentDateStr}</div>
              <div className="text-[11px] text-slate-400">Validez comercial: 30 días</div>
            </div>
          </div>

          {/* Grid 1: Cliente vs Ingeniería */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Box 1: Cliente */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>01. Información del Cliente & Inmueble</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Titular del Proyecto:</span>
                  <span className="font-semibold text-slate-900">{formData.fullName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Comuna / Región:</span>
                  <span className="font-semibold text-slate-900">{formData.comuna}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Tipo de Propiedad:</span>
                  <span className="font-semibold text-slate-900 uppercase">{formData.propertyType}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Distribuidora / Tarifa:</span>
                  <span className="font-semibold text-slate-900 uppercase">{formData.distributor} (BT-1)</span>
                </div>
              </div>
            </div>

            {/* Box 2: Ingeniería Fotovoltaica */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>02. Especificación Técnica Fotovoltaica</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Potencia Pico Sugerida:</span>
                  <span className="font-semibold text-slate-900">{sizing.recommendedKwp} kWp</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Módulos Solares:</span>
                  <span className="font-semibold text-slate-900">{sizing.panelsCount} Módulos N-Type TOPCon {sizing.panelWatts}W</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Inversor Inteligente:</span>
                  <span className="font-semibold text-slate-900">{sizing.inverterKw} kW ({sizing.recommendedPhaseType?.toUpperCase() || "MONOFÁSICO"})</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Batería LiFePO4:</span>
                  <span className="font-semibold text-emerald-700">
                    {sizing.batteryKwh > 0 ? `${sizing.batteryKwh} kWh (${sizing.usableBatteryKwh || Math.round(sizing.batteryKwh * 0.85)} kWh Útil)` : "On-Grid (Sin Batería)"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Spotlight Ahorro Banner */}
          <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#ea580c] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NUEVA REALIDAD TARIFARIA (LEY 21.118)</span>
              </div>
              <div className="text-lg font-medium mt-1">
                Tu boleta mensual baja de <span className="line-through text-slate-400">{formatCurrency(formData.monthlyBillClp)}</span> a solo{" "}
                <strong className="text-emerald-400">{formatCurrency(sizing.estimatedNewMonthlyBillClp || 14500)} / mes</strong>
              </div>
            </div>

            <div className="text-right flex-shrink-0 bg-white/10 px-4 py-2 rounded-lg border border-white/10">
              <span className="text-[10px] uppercase text-slate-300 block font-mono">Ahorro Anual Estimado</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {formatCurrency(sizing.estimatedAnnualSavingsClp)}
              </span>
            </div>
          </div>

          {/* Tabla de Balance Energético Mes a Mes */}
          <div className="mb-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>03. Balance Energético Mensual TMY ({formData.comuna})</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-[10px] uppercase tracking-wider">
                    <th className="p-2 rounded-tl-md">Mes</th>
                    <th className="p-2 text-center">POA (kWh/m²/día)</th>
                    <th className="p-2 text-center">Generación (kWh)</th>
                    <th className="p-2 text-center">Consumo (kWh)</th>
                    <th className="p-2 text-right rounded-tr-md">Balance / Excedentes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {sizing.monthlyBreakdown?.map((m, idx) => {
                    const isSurplus = m.monthlyGenKwh >= m.monthlyDemandKwh;
                    return (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"}>
                        <td className="p-2 font-medium text-slate-900">{m.monthName}</td>
                        <td className="p-2 text-center font-mono">{m.poaKwhM2Day}</td>
                        <td className="p-2 text-center font-mono font-semibold text-[#ea580c]">{m.monthlyGenKwh} kWh</td>
                        <td className="p-2 text-center font-mono text-slate-600">{m.monthlyDemandKwh} kWh</td>
                        <td className="p-2 text-right font-mono font-medium">
                          {isSurplus ? (
                            <span className="text-emerald-700 font-semibold">+{m.monthlyGenKwh - m.monthlyDemandKwh} kWh (Inyección)</span>
                          ) : (
                            <span className="text-blue-700">-{m.monthlyDemandKwh - m.monthlyGenKwh} kWh (Red/BESS)</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grid 2: Finanzas & SEC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Finanzas */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>04. Indicadores Financieros a 25 Años</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Ahorro Acumulado (25 años):</span>
                  <span className="font-bold text-emerald-700 font-mono">{formatCurrency(sizing.estimated25YearSavingsClp)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Período de Retorno (Payback):</span>
                  <span className="font-semibold text-slate-900">{sizing.paybackYears} años</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Valor Actual Neto (VAN):</span>
                  <span className="font-semibold text-slate-900 font-mono">{sizing.vanClp ? formatCurrency(sizing.vanClp) : "Positivo"}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Costo Nivelado (LCOE):</span>
                  <span className="font-semibold text-slate-900 font-mono">${sizing.lcoeClpPerKwh || 52} CLP / kWh</span>
                </div>
              </div>
            </div>

            {/* Normativa SEC */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>05. Garantía & Cumplimiento Normativo SEC</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                    Pliego RIC N°09
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                    Pliego RIC N°15 (Anti-Isla)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-semibold border border-orange-200">
                    Trámite TE-4 SEC
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Proyecto llave en mano diseñado bajo estricta normativa chilena con tramitación formal ante la Superintendencia de Electricidad y Combustibles (SEC) y habilitación de medidor bidireccional.
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200 text-[10px] text-slate-400 font-mono">
                Garantía de potencia solar: 25 Años al 84.8%
              </div>
            </div>
          </div>

          {/* Footer Membretado */}
          <div className="border-t border-slate-300 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
            <div>
              <strong className="text-slate-800">SoldeRío SpA</strong> • RUT: 77.892.341-K<br />
              Casa Matriz: Puerto Varas, Región de Los Lagos<br />
              Web: <span className="text-[#ea580c]">www.solderio.cl</span> • Contacto: contacto@solderio.cl
            </div>

            <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-slate-300 sm:pl-6 pt-3 sm:pt-0">
              <div className="w-36 border-b border-slate-400 mx-auto sm:ml-auto mb-1"></div>
              <div className="font-semibold text-slate-900 text-xs">Depto. de Ingeniería Solar</div>
              <div className="text-[10px] text-slate-500">Ingeniero Eléctrico SEC Clase A</div>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
