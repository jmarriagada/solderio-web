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

  const isB2B = Boolean(sizing.isB2B || formData.propertyType === "comercial" || formData.propertyType === "agricola");
  const isOffGrid = formData.systemType === "offgrid";

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
                {isB2B 
                  ? "Ingeniería Solar Corporativa • Macrozona Sur de Chile" 
                  : isOffGrid 
                    ? "Micro-Redes Aisladas & Almacenamiento • Macrozona Sur de Chile" 
                    : "Ingeniería Solar & Micro-Redes • Macrozona Sur de Chile"}
              </div>
            </div>

            <div className="text-right">
              <div className={`inline-block px-3 py-1 rounded-md text-xs font-mono font-bold border ${
                isB2B 
                  ? "bg-blue-50 text-blue-800 border-blue-200" 
                  : isOffGrid 
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                    : "bg-orange-50 text-orange-800 border-orange-200"
              }`}>
                {isB2B ? `DOSSIER B2B N° ${leadId}` : isOffGrid ? `PRE-INFORME PLANTA AISLADA N° ${leadId}` : `PRE-INFORME N° ${leadId}`}
              </div>
              <div className="text-xs text-slate-500 mt-1">Fecha: {currentDateStr}</div>
              <div className="text-[11px] text-slate-400">Validez comercial: 15 días</div>
            </div>
          </div>

          {/* Grid 1: Cliente vs Ingeniería */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
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
                  <span className="text-slate-500">Comuna / Ubicación:</span>
                  <span className="font-semibold text-slate-900">{formData.comuna}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Tipo de Propiedad:</span>
                  <span className="font-semibold text-slate-900 uppercase">{formData.propertyType}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Distribuidora / Conexión:</span>
                  <span className="font-semibold text-slate-900 uppercase">
                    {isOffGrid ? "SITIO AISLADO (OFF-GRID 100% AUTÓNOMO)" : `${formData.distributor} (${sizing.requiresThreePhase ? "Trifásico" : "Monofásico"})`}
                  </span>
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
                  <span className="font-semibold text-slate-900">{sizing.recommendedKwp} kWp ({sizing.panelsCount} Módulos)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Módulos Tier 1:</span>
                  <span className="font-semibold text-slate-900">N-Type TOPCon {sizing.panelWatts}W (25 Años Rendimiento)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">{isOffGrid ? "Inversor Cargador Off-Grid:" : "Inversor Inteligente:"}</span>
                  <span className="font-semibold text-slate-900">
                    {sizing.inverterKw} kW {isOffGrid ? "(Con ATS Generador Aux)" : `(${sizing.recommendedPhaseType?.toUpperCase() || "MONOFÁSICO"})`}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">{isOffGrid ? "Banco Baterías LiFePO4:" : sizing.batteryKwh > 0 ? "Batería LiFePO4:" : "Topología de Red:"}</span>
                  <span className="font-semibold text-emerald-700">
                    {isOffGrid
                      ? `${sizing.batteryKwh} kWh (${sizing.usableBatteryKwh || Math.round(sizing.batteryKwh * 0.85)} kWh Útil 24/7)`
                      : sizing.batteryKwh > 0 
                        ? `${sizing.batteryKwh} kWh (${sizing.usableBatteryKwh || Math.round(sizing.batteryKwh * 0.85)} kWh Útil)` 
                        : isB2B ? "On-Grid Industrial (Autoconsumo & Inyección)" : "On-Grid Residencial (Net Billing)"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid 2: Finanzas (03) & Normativa SEC (04) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {/* Finanzas (03) */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>{isB2B ? "03. Indicadores Financieros & Tributarios (B2B)" : "03. Indicadores Financieros a 25 Años"}</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Ahorro Anual Estimado:</span>
                  <span className="font-bold text-emerald-700 font-mono">{formatCurrency(sizing.estimatedAnnualSavingsClp)} / año</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Período de Retorno (Payback):</span>
                  <span className="font-semibold text-slate-900">{sizing.paybackYears} años (TIR: {sizing.tirPercent || 15}%)</span>
                </div>
                {isB2B ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Crédito Art. 33 bis LIR (5%):</span>
                      <span className="font-bold text-emerald-700 font-mono">{formatCurrency(sizing.taxShieldArt33BisClp || 0)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">IVA Crédito Fiscal (19%):</span>
                      <span className="font-bold text-emerald-700 font-mono">{formatCurrency(sizing.recoverableVatClp || 0)} (F29)</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Valor Actual Neto (VAN):</span>
                      <span className="font-semibold text-slate-900 font-mono">{sizing.vanClp ? formatCurrency(sizing.vanClp) : "Positivo"}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Costo Nivelado (LCOE):</span>
                      <span className="font-semibold text-slate-900 font-mono">${sizing.lcoeClpPerKwh || 52} CLP / kWh</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Normativa SEC (04) */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>04. Garantía & Cumplimiento Normativo SEC</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {isOffGrid ? (
                    <>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                        RIC N°09 (Almacenamiento)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                        RIC N°10 (Inst. Autónomas)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-semibold border border-orange-200">
                        Declaración TE-1 SEC
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                        Pliego RIC N°09
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                        PE Nº 1/26 Anti-Isla
                      </span>
                      <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-semibold border border-orange-200">
                        Trámite TE-4 SEC
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {isB2B 
                    ? `Vía Regulatoria: ${sizing.regulatoryTitle || "Ley 21.118 Netbilling"}. Provisión de recambio de inversor año 12 incluída en modelo.` 
                    : isOffGrid
                      ? "Proyecto autónomo 100% aislado de la red diseñado bajo estricta normativa SEC (RIC N°09 y N°10). Incluye banco LiFePO4 de ciclo profundo, protecciones DC/AC integradas y tramitación formal TE-1."
                      : "Proyecto llave en mano diseñado bajo estricta normativa chilena con tramitación formal ante la SEC y medidor bidireccional."}
                </p>
              </div>

              <div className="pt-2.5 mt-2.5 border-t border-slate-200 text-[10px] text-slate-400 font-mono">
                {isOffGrid 
                  ? "Banco LiFePO4: +6.000 ciclos de vida útil • Garantía solar 25 Años al 84.8%"
                  : "Garantía de potencia solar: 25 Años al 84.8% • Tier 1 TOPCon"}
              </div>
            </div>
          </div>

          {/* Spotlight Ahorro Banner */}
          <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl mb-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#ea580c] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isB2B 
                    ? "IMPACTO FINANCIERO OPERACIONAL (B2B)" 
                    : isOffGrid 
                      ? "INDEPENDENCIA ENERGÉTICA TOTAL (OFF-GRID 24/7)" 
                      : "NUEVA REALIDAD TARIFARIA (LEY 21.118)"}
                </span>
              </div>
              <div className="text-base sm:text-lg font-medium mt-1">
                {isB2B ? (
                  <>
                    Inversión Neta: <strong className="text-sky-300 font-mono">{formatCurrency(sizing.estimatedSystemCostNetoClp || 0)}</strong> • Costo Neto Efectivo con Escudo Fiscal: <strong className="text-emerald-400 font-mono">{formatCurrency((sizing.estimatedSystemCostNetoClp || 0) - (sizing.taxShieldArt33BisClp || 0))}</strong>
                  </>
                ) : isOffGrid ? (
                  <>
                    Gasto de referencia reemplazado: <span className="line-through text-slate-400">{formatCurrency(formData.monthlyBillClp)}</span> a solo{" "}
                    <strong className="text-emerald-400">$0 / mes (Autosuficiencia 100%)</strong>
                  </>
                ) : (
                  <>
                    Tu boleta mensual baja de <span className="line-through text-slate-400">{formatCurrency(formData.monthlyBillClp)}</span> a solo{" "}
                    <strong className="text-emerald-400">{formatCurrency(sizing.estimatedNewMonthlyBillClp || 14500)} / mes</strong>
                  </>
                )}
              </div>
            </div>

            <div className="text-right flex-shrink-0 bg-white/10 px-4 py-2 rounded-lg border border-white/10">
              <span className="text-[10px] uppercase text-slate-300 block font-mono">
                {isOffGrid ? "Ahorro Operacional Anual" : "Ahorro Anual Estimado"}
              </span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {formatCurrency(sizing.estimatedAnnualSavingsClp)}
              </span>
            </div>
          </div>

          {/* Tabla de Balance Energético Mes a Mes (05) */}
          <div className="mb-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>
                {isOffGrid 
                  ? `05. Balance de Autonomía & Generación Mensual TMY (${formData.comuna})` 
                  : `05. Balance Energético Mensual TMY (${formData.comuna})`}
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-[10px] uppercase tracking-wider">
                    <th className="p-2 rounded-tl-md">Mes</th>
                    <th className="p-2 text-center">POA (kWh/m²/día)</th>
                    <th className="p-2 text-center">Generación (kWh)</th>
                    <th className="p-2 text-center">Consumo (kWh)</th>
                    <th className="p-2 text-right rounded-tr-md">
                      {isOffGrid ? "Balance / Autonomía" : "Balance / Excedentes"}
                    </th>
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
                          {isOffGrid ? (
                            isSurplus ? (
                              <span className="text-emerald-700 font-semibold">+{m.monthlyGenKwh - m.monthlyDemandKwh} kWh (Baterías 100% / Autonomía)</span>
                            ) : (
                              <span className="text-amber-700 font-semibold">-{m.monthlyDemandKwh - m.monthlyGenKwh} kWh (Respaldo BESS / Aux)</span>
                            )
                          ) : (
                            isSurplus ? (
                              <span className="text-emerald-700 font-semibold">+{m.monthlyGenKwh - m.monthlyDemandKwh} kWh (Inyección)</span>
                            ) : (
                              <span className="text-blue-700">-{m.monthlyDemandKwh - m.monthlyGenKwh} kWh (Red/BESS)</span>
                            )
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
