"use client";

import { useState } from "react";
import { 
  CloudSun, 
  Sun, 
  Snowflake, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap, 
  Sparkles, 
  Thermometer 
} from "lucide-react";
import { MonthlyGenBreakdown, SolarSizingResult } from "@/types/cotizacion";

interface Props {
  monthlyData: MonthlyGenBreakdown[];
  comuna: string;
  distributor: string;
  sizing: SolarSizingResult;
}

export function SolarSeasonalChart({ monthlyData, comuna, distributor, sizing }: Props) {
  const [activeViewMode, setActiveViewMode] = useState<"dual" | "net">("dual");
  const [selectedMonth, setSelectedMonth] = useState<MonthlyGenBreakdown | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<MonthlyGenBreakdown | null>(null);

  const currentMonth = hoveredMonth || selectedMonth || monthlyData[11] || monthlyData[0];

  const maxVal = Math.max(
    ...monthlyData.map((m) => Math.max(m.monthlyGenKwh, m.monthlyDemandKwh)),
    1
  );

  // Calcular marcas dinámicas para el Eje Y (4 niveles de escala)
  const yAxisMax = Math.ceil(maxVal / 250) * 250;
  const yAxisSteps = [
    yAxisMax,
    Math.round(yAxisMax * 0.75),
    Math.round(yAxisMax * 0.50),
    Math.round(yAxisMax * 0.25),
    0,
  ];

  const totalAnnualGen = sizing.estimatedAnnualGenKwh;

  return (
    <div className="p-5 sm:p-8 rounded-[24px] sm:rounded-[28px] bg-gradient-to-b from-[#1C1C1C] to-[#141414] border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Background atmospheric ambient light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF8300]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-[#FF8300] text-xs font-mono uppercase tracking-wider mb-1.5">
            <CloudSun className="w-4 h-4 text-[#FF8300]" />
            <span>Simulación Física Mensual TMY • {comuna}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight">
            Curva de Generación Solar vs Demanda Real
          </h3>
          <p className="text-xs text-white/60 font-light mt-1 max-w-xl">
            Modelado con datos meteorológicos de alta resolución, termodinámica TOPCon y curva estacional de consumo en el sur.
          </p>
        </div>

        {/* Top Controls & KPI Pills */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switcher */}
          <div className="bg-black/50 p-1 rounded-xl border border-white/10 flex items-center gap-1 text-xs font-mono">
            <button
              onClick={() => setActiveViewMode("dual")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeViewMode === "dual"
                  ? "bg-[#FF8300] text-white shadow-md font-medium"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              ☀️ Comparativa Dual
            </button>
            <button
              onClick={() => setActiveViewMode("net")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeViewMode === "net"
                  ? "bg-emerald-600 text-white shadow-md font-medium"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              ⚡ Balance Neto
            </button>
          </div>

          {/* Quick Metrics Badge */}
          <div className="hidden sm:flex items-center gap-3 bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/5 text-[11px] font-mono">
            <div>
              <span className="text-white/40 block text-[9px]">VERANO</span>
              <span className="text-amber-400 font-semibold">{sizing.summerAvgMonthlyGenKwh || Math.round(totalAnnualGen / 8)} kWh</span>
            </div>
            <div className="h-5 w-px bg-white/10" />
            <div>
              <span className="text-white/40 block text-[9px]">INVIERNO</span>
              <span className="text-blue-400 font-semibold">{sizing.winterAvgMonthlyGenKwh || Math.round(totalAnnualGen / 26)} kWh</span>
            </div>
            <div className="h-5 w-px bg-white/10" />
            <div>
              <span className="text-white/40 block text-[9px]">ESTACIONAL</span>
              <span className="text-[#FF8300] font-semibold">{sizing.seasonalVariationRatio || 3.4}x</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Detail Card (Current Inspected Month) */}
      <div className="mb-6 bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs relative z-10 backdrop-blur-md">
        <div className="col-span-2 sm:col-span-1 border-r border-white/10 pr-3">
          <span className="text-[10px] uppercase font-mono text-white/40 block">Mes Seleccionado</span>
          <div className="text-base font-semibold text-white mt-0.5 flex items-center gap-2">
            <span>{currentMonth.monthName}</span>
            {currentMonth.month === 12 || currentMonth.month <= 2 ? (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Verano</span>
            ) : currentMonth.month >= 6 && currentMonth.month <= 8 ? (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Invierno</span>
            ) : null}
          </div>
          <span className="text-[10px] text-white/50 block mt-0.5">Pasa el cursor por las barras</span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-mono text-amber-400 block flex items-center gap-1">
            <Sun className="w-3 h-3" /> Generación Solar
          </span>
          <div className="text-base font-mono font-bold text-amber-400 mt-0.5">
            {currentMonth.monthlyGenKwh.toLocaleString("es-CL")} <span className="text-xs font-normal text-white/50">kWh</span>
          </div>
          <span className="text-[10px] text-white/50 block mt-0.5 font-mono">
            {currentMonth.poaKwhM2Day ? `${currentMonth.poaKwhM2Day} kWh/m²/día` : ""}
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-mono text-slate-300 block flex items-center gap-1">
            <Zap className="w-3 h-3 text-slate-400" /> Consumo Casa
          </span>
          <div className="text-base font-mono font-bold text-slate-200 mt-0.5">
            {currentMonth.monthlyDemandKwh.toLocaleString("es-CL")} <span className="text-xs font-normal text-white/50">kWh</span>
          </div>
          <span className="text-[10px] text-white/50 block mt-0.5 font-mono">
            {currentMonth.monthlyGenKwh >= currentMonth.monthlyDemandKwh ? "100% Autoconsumo" : `${Math.round((currentMonth.monthlyGenKwh / currentMonth.monthlyDemandKwh) * 100)}% Cobertura`}
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 lg:col-span-2">
          <span className="text-[10px] uppercase font-mono text-white/40 block">Balance Ley 21.118</span>
          {currentMonth.monthlyGenKwh >= currentMonth.monthlyDemandKwh ? (
            <div className="text-emerald-400 font-mono font-semibold text-sm sm:text-base mt-0.5 flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              <span>+{ (currentMonth.monthlyGenKwh - currentMonth.monthlyDemandKwh).toLocaleString("es-CL") } kWh Inyectados</span>
            </div>
          ) : (
            <div className="text-blue-300 font-mono font-semibold text-sm sm:text-base mt-0.5 flex items-center gap-1">
              <ArrowDownRight className="w-4 h-4 text-blue-300" />
              <span>-{ (currentMonth.monthlyDemandKwh - currentMonth.monthlyGenKwh).toLocaleString("es-CL") } kWh Red / Batería</span>
            </div>
          )}
          <span className="text-[10px] text-white/50 block mt-0.5">
            {currentMonth.monthlyGenKwh >= currentMonth.monthlyDemandKwh 
              ? "Genera saldo a favor para compensar meses fríos" 
              : "Consumo cubierto con saldo acumulado y batería"}
          </span>
        </div>

        <div className="hidden lg:block text-right">
          <span className="text-[10px] uppercase font-mono text-white/40 block">Temp. Celda Prom.</span>
          <div className="text-sm font-mono font-semibold text-white/80 mt-1 flex items-center justify-end gap-1">
            <Thermometer className="w-3.5 h-3.5 text-orange-400" />
            <span>{currentMonth.tCellCelsius ? `${currentMonth.tCellCelsius}°C` : "18.5°C"}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">Alta Eficiencia</span>
        </div>
      </div>

      {/* Main Chart Graphic Canvas with Y-Axis & Gridlines */}
      <div className="relative pt-6 pb-2 select-none">
        {/* Y-Axis Reference Scale & Horizontal Dotted Gridlines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pr-2">
          {yAxisSteps.map((stepVal, idx) => (
            <div key={idx} className="w-full flex items-center gap-2">
              <span className="text-[10px] font-mono text-white/30 w-14 text-right flex-shrink-0">
                {stepVal > 0 ? `${stepVal.toLocaleString("es-CL")} kWh` : "0"}
              </span>
              <div className="w-full h-px border-b border-white/5 border-dashed" />
            </div>
          ))}
        </div>

        {/* 12-Month Bars Container */}
        <div className="overflow-x-auto pb-2 pl-16 scrollbar-none">
          <div className="min-w-[540px] sm:min-w-0">
            <div className="grid grid-cols-12 gap-2 sm:gap-3 lg:gap-4 items-end h-64 sm:h-72 border-b border-white/15 pb-2 relative z-10">
              {monthlyData.map((m) => {
                const genHeightPercent = Math.max(6, Math.min(100, Math.round((m.monthlyGenKwh / yAxisMax) * 100)));
                const demandHeightPercent = Math.max(6, Math.min(100, Math.round((m.monthlyDemandKwh / yAxisMax) * 100)));
                const isHovered = currentMonth.month === m.month;
                const hasSurplus = m.monthlyGenKwh >= m.monthlyDemandKwh;
                const surplusDiff = m.monthlyGenKwh - m.monthlyDemandKwh;
                const netPercent = Math.max(6, Math.min(100, Math.round((Math.abs(surplusDiff) / yAxisMax) * 100)));

                return (
                  <div
                    key={m.month}
                    className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    onMouseEnter={() => setHoveredMonth(m)}
                    onMouseLeave={() => setHoveredMonth(null)}
                    onClick={() => setSelectedMonth(m)}
                  >
                    {isHovered && (
                      <div className="absolute inset-x-0 -inset-y-2 bg-white/[0.04] rounded-xl border border-white/10 pointer-events-none transition-all duration-200" />
                    )}

                    {activeViewMode === "dual" ? (
                      <div className="flex items-end gap-1 sm:gap-1.5 w-full justify-center h-full z-10 px-0.5">
                        {/* 1. Solar Generation Bar */}
                        <div
                          style={{ height: `${genHeightPercent}%` }}
                          className={`w-1/2 rounded-t-lg transition-all duration-300 relative ${
                            isHovered
                              ? "bg-gradient-to-t from-[#ea580c] via-[#FF8300] to-amber-300 shadow-[0_0_20px_rgba(255,131,0,0.7)] scale-x-105"
                              : "bg-gradient-to-t from-amber-600/90 via-amber-500/90 to-amber-300/80 hover:brightness-110"
                          }`}
                        >
                          <div className="absolute top-0 inset-x-0 h-1 bg-amber-200/60 rounded-t-lg" />
                        </div>

                        {/* 2. Home Demand Bar */}
                        <div
                          style={{ height: `${demandHeightPercent}%` }}
                          className={`w-1/2 rounded-t-lg transition-all duration-300 border relative ${
                            isHovered
                              ? "bg-slate-600/80 border-white/40 shadow-lg"
                              : "bg-slate-700/50 border-white/15 hover:bg-slate-600/60"
                          }`}
                        >
                          <div className="absolute top-0 inset-x-0 h-1 bg-white/40 rounded-t-lg" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-end w-full justify-center h-full z-10 px-1">
                        <div
                          style={{ height: `${netPercent}%` }}
                          className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 relative ${
                            hasSurplus
                              ? isHovered
                                ? "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.7)]"
                                : "bg-gradient-to-t from-emerald-700/80 to-emerald-500/80"
                              : isHovered
                              ? "bg-gradient-to-t from-blue-700 to-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.7)]"
                              : "bg-gradient-to-t from-blue-800/80 to-blue-600/80"
                          }`}
                        >
                          <div className={`absolute top-0 inset-x-0 h-1 rounded-t-lg ${hasSurplus ? "bg-emerald-200" : "bg-blue-200"}`} />
                        </div>
                      </div>
                    )}

                    <div className="mt-2.5 flex flex-col items-center gap-0.5">
                      <span className={`text-[10px] sm:text-[11px] font-mono transition-colors ${
                        isHovered ? "text-[#FF8300] font-bold" : "text-white/60"
                      }`}>
                        {m.monthName.slice(0, 3)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend & Seasonal Compensation Insight */}
      <div className="flex flex-col md:flex-row md:items-center justify-between text-xs text-white/60 font-mono mt-4 pt-3 border-t border-white/10 gap-3">
        {activeViewMode === "dual" ? (
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-amber-600 to-amber-300 shadow-[0_0_8px_rgba(255,131,0,0.5)]" />
              <strong className="text-white font-medium">Generación Solar Estimada</strong>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-slate-700 border border-white/20" />
              <strong className="text-white/80 font-normal">Consumo del Hogar</strong>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <strong className="text-emerald-400 font-medium">+ Excedente Inyectado (Saldo a Favor)</strong>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-blue-500" />
              <strong className="text-blue-300 font-normal">- Déficit Cubierto con Red / Batería</strong>
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Ley 21.118: En verano acumulas saldos a precio nudo que descuentan tus boletas de invierno.</span>
        </div>
      </div>
    </div>
  );
}
