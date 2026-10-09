"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Sun, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Info,
  Clock,
  Sparkles
} from "lucide-react";
import { SolarSizingResult, QuoteFormData } from "@/types/cotizacion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sizing: SolarSizingResult;
  formData: QuoteFormData;
}

export function HourlyProfileDrawer({ isOpen, onClose, sizing, formData }: Props) {
  const profile = sizing.hourlyProfileSample || [];
  const [selectedHourIndex, setSelectedHourIndex] = useState<number>(13); // Default mediodía

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const selectedItem = profile[selectedHourIndex] || profile[12] || {
    hour: 12,
    solarGenKwh: 0,
    consumptionKwh: 0,
    selfConsumedKwh: 0,
    injectedKwh: 0,
    gridImportKwh: 0,
  };

  const maxVal = Math.max(
    ...profile.map((p) => Math.max(p.solarGenKwh, p.consumptionKwh)),
    1.5
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="w-full max-w-4xl max-h-[92vh] flex flex-col p-5 sm:p-8 rounded-[28px] bg-gradient-to-b from-[#1E1E1E] via-[#171717] to-[#121212] border border-white/15 shadow-2xl relative text-white overflow-hidden"
          >
            {/* Ambient glow */}
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#FF8300]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer z-10"
              title="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="mb-5 pr-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF8300]/15 text-[#FF8300] text-xs font-mono font-medium mb-2 border border-[#FF8300]/30">
                <Clock className="w-3.5 h-3.5" />
                <span>DINÁMICA HORARIA 24 HORAS • DÍA TÍPICO</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight">
                Curva de Generación Solar vs Consumo
              </h3>
              <p className="text-xs sm:text-sm text-white/60 font-light mt-1">
                Visualiza cómo interactúa tu techo solar en {formData.comuna} con tus artefactos y con la red de {formData.distributor?.toUpperCase()}.
              </p>
            </div>

            {/* Key Principle Alert (Industry Insight) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-white/10 mb-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs relative z-10">
              <div className="flex items-start gap-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-emerald-400 font-medium block">Autoconsumo Directo</strong>
                  <span className="text-white/60 text-[11px] leading-snug">
                    Se valoriza al precio de compra con IVA <strong>(~$270/kWh)</strong>. Cero costo de red.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-3 h-3 rounded-full bg-[#FF8300] mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-[#FF8300] font-medium block">Inyección a la Red</strong>
                  <span className="text-white/60 text-[11px] leading-snug">
                    Se liquida a precio nudo de energía y potencia <strong>(~$125/kWh)</strong> bajo Ley 21.118.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-3 h-3 rounded-full bg-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-blue-400 font-medium block">Compra a la Red</strong>
                  <span className="text-white/60 text-[11px] leading-snug">
                    Consumo nocturno o madrugador cubierto por la distribuidora o batería LiFePO4.
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable Area */}
            <div className="overflow-y-auto pr-1 space-y-4 flex-1">
              {/* 24-Hour Interactive Bar Chart */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/10 relative">
                <div className="flex items-center justify-between text-xs text-white/60 mb-3 font-mono">
                  <span>Potencia / Energía (kWh por hora)</span>
                  <span className="text-[11px] text-[#FF8300]">Haz clic en cualquier hora para inspeccionar</span>
                </div>

                <div className="h-44 sm:h-52 flex items-end gap-1 sm:gap-1.5 pt-4 pb-2 border-b border-white/10">
                  {profile.map((p, idx) => {
                    const isSelected = selectedHourIndex === idx;
                    const genHeightPct = Math.min(100, Math.round((p.solarGenKwh / maxVal) * 100));
                    const consHeightPct = Math.min(100, Math.round((p.consumptionKwh / maxVal) * 100));
                    const selfHeightPct = Math.min(100, Math.round((p.selfConsumedKwh / maxVal) * 100));
                    const injectHeightPct = Math.min(100, Math.round((p.injectedKwh / maxVal) * 100));

                    return (
                      <div
                        key={p.hour}
                        onClick={() => setSelectedHourIndex(idx)}
                        className={`flex-1 flex flex-col justify-end items-center h-full cursor-pointer group transition-all relative ${
                          isSelected ? "opacity-100" : "opacity-80 hover:opacity-100"
                        }`}
                      >
                        {/* Selected Indicator Pin */}
                        {isSelected && (
                          <div className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-[#FF8300] shadow-[0_0_8px_#FF8300]" />
                        )}

                        <div className="w-full flex items-end justify-center gap-[1px] sm:gap-[2px] h-full">
                          {/* Solar Bar (Stacked Self-consumed green + Injected orange) */}
                          <div 
                            className="w-1/2 flex flex-col justify-end rounded-t-sm overflow-hidden transition-all"
                            style={{ height: `${genHeightPct}%` }}
                          >
                            {injectHeightPct > 0 && (
                              <div 
                                className="w-full bg-[#FF8300] transition-all"
                                style={{ height: `${Math.max(15, Math.round((p.injectedKwh / Math.max(0.01, p.solarGenKwh)) * 100))}%` }}
                                title={`Inyección: ${p.injectedKwh} kWh`}
                              />
                            )}
                            <div 
                              className="w-full bg-emerald-500 transition-all"
                              style={{ height: `${Math.max(15, Math.round((p.selfConsumedKwh / Math.max(0.01, p.solarGenKwh)) * 100))}%` }}
                              title={`Autoconsumo: ${p.selfConsumedKwh} kWh`}
                            />
                          </div>

                          {/* Consumption Bar (Blue) */}
                          <div 
                            className={`w-1/2 rounded-t-sm transition-all ${
                              isSelected ? "bg-blue-400" : "bg-blue-500/60 group-hover:bg-blue-400"
                            }`}
                            style={{ height: `${consHeightPct}%` }}
                            title={`Consumo: ${p.consumptionKwh} kWh`}
                          />
                        </div>

                        {/* Hour Label */}
                        <span className={`text-[9px] sm:text-[10px] font-mono mt-1 ${
                          isSelected ? "text-[#FF8300] font-bold" : "text-white/40"
                        }`}>
                          {p.hour % 3 === 0 ? `${p.hour}h` : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-3 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                    <span className="text-white/70">Autoconsumo Solar</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#FF8300]" />
                    <span className="text-white/70">Inyección a Red (Ley 21.118)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                    <span className="text-white/70">Demanda / Compra de Red</span>
                  </div>
                </div>
              </div>

              {/* Inspected Hour Breakdown Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="border-r border-white/10 pr-2">
                  <span className="text-[10px] uppercase font-mono text-white/40 block">Hora Seleccionada</span>
                  <div className="text-base font-semibold text-white mt-0.5 font-mono">
                    {selectedItem.hour}:00 hrs
                  </div>
                  <span className="text-[10px] text-white/50 block mt-0.5">
                    {selectedItem.hour >= 9 && selectedItem.hour <= 17 ? "Horario Solar Pico" : "Horario Nocturno/Bajo"}
                  </span>
                </div>

                <div className="border-r border-white/10 pr-2">
                  <span className="text-[10px] uppercase font-mono text-emerald-400 block">Autoconsumo Directo</span>
                  <div className="text-base font-semibold text-emerald-400 mt-0.5 font-mono">
                    {selectedItem.selfConsumedKwh} kWh
                  </div>
                  <span className="text-[10px] text-white/50 block mt-0.5">
                    Ahorraste {formatCurrency(Math.round(selectedItem.selfConsumedKwh * 270))}
                  </span>
                </div>

                <div className="border-r border-white/10 pr-2">
                  <span className="text-[10px] uppercase font-mono text-[#FF8300] block">Inyección a Red</span>
                  <div className="text-base font-semibold text-[#FF8300] mt-0.5 font-mono">
                    {selectedItem.injectedKwh} kWh
                  </div>
                  <span className="text-[10px] text-white/50 block mt-0.5">
                    Crédito {formatCurrency(Math.round(selectedItem.injectedKwh * 125))}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono text-blue-400 block">Compra a la Red</span>
                  <div className="text-base font-semibold text-blue-400 mt-0.5 font-mono">
                    {selectedItem.gridImportKwh} kWh
                  </div>
                  <span className="text-[10px] text-white/50 block mt-0.5">
                    {sizing.batteryKwh > 0 ? "Mitigado por Batería" : "Comprado a distribuidora"}
                  </span>
                </div>
              </div>

              {/* Economic Recommendation Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/20 to-black border border-[#FF8300]/25 text-xs text-white/80 font-light leading-relaxed flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#FF8300] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-medium block mb-0.5">
                    Conclusión de Ingeniería: ¿Por qué priorizamos el Autoconsumo?
                  </strong>
                  En Chile, cada kWh que consumes de tus propios paneles te ahorra ~$270 CLP (tarifa final con IVA y transmisión). Si lo inyectas, la ley lo liquida a precio nudo (~$125 CLP). Por ello, el autoconsumo es <strong>2,2 veces más rentable</strong> que venderle a la distribuidora. Diseñamos tu planta para que aproveches al máximo tu propia energía en casa o empresa.
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-white/40 text-[11px] font-mono">
                Datos calculados con simulación física N-Type TOPCon en {formData.comuna}.
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-full bg-[#FF8300] hover:bg-[#e07400] text-white text-xs font-medium uppercase tracking-wider transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
