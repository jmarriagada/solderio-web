"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Zap, Moon, Clock, Fuel, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

type ChargingMode = "solar" | "fast" | "night";

export function CargaEvModesVisualizer() {
  const [selectedMode, setSelectedMode] = useState<ChargingMode>("solar");
  const [batteryKwh, setBatteryKwh] = useState<number>(60);
  const [chargerPower, setChargerPower] = useState<7.4 | 22>(7.4);

  // Calculations based on Chilean real data
  // Electric consumption avg: 18 kWh / 100 km (0.18 kWh / km)
  // Gas car avg: 12 km/L with 95 octane at $1,350 CLP/L => ~$112.5 CLP / km
  // Grid electricity: ~$160 CLP / kWh => ~$28.8 CLP / km
  // Off-peak grid electricity: ~$110 CLP / kWh => ~$19.8 CLP / km
  // Solar: $0 CLP / kWh => $0 CLP / km

  const kmPerKwh = 5.5; // ~18.1 kWh per 100 km
  const totalRangeKm = Math.round(batteryKwh * kmPerKwh);

  // Charging time 20% to 80% (60% of battery capacity)
  const chargeEnergyKwh = batteryKwh * 0.6;
  const chargingHours = Number((chargeEnergyKwh / (selectedMode === "solar" ? (chargerPower === 7.4 ? 4.5 : 9.0) : chargerPower)).toFixed(1));
  const kmPerHour = Math.round((selectedMode === "solar" ? (chargerPower === 7.4 ? 4.5 : 9.0) : chargerPower) * kmPerKwh);

  const costSolar = 0;
  const costFast = Math.round(chargeEnergyKwh * 160);
  const costNight = Math.round(chargeEnergyKwh * 115);
  const costGasolineEquivalent = Math.round((chargeEnergyKwh * kmPerKwh / 12) * 1350);

  const currentCost =
    selectedMode === "solar" ? costSolar : selectedMode === "fast" ? costFast : costNight;
  const annualSavingsEstimated = Math.round((15000 / 12 * 1350) - (selectedMode === "solar" ? 0 : 15000 * 0.18 * 140));

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Container Frame */}
      <div className="bg-[#1F1F1F] text-white rounded-[28px] md:rounded-[36px] p-6 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#FF8300]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#FF8300] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulador de Recarga Inteligente</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Elige Cómo y Cuándo Cargar
          </h2>
          <p className="mt-3 text-sm md:text-base text-white/70">
            Controla tu flujo de energía desde la App. Selecciona el modo que mejor se adapte a tu rutina y evalúa el ahorro en tiempo real.
          </p>
        </div>

        {/* Mode Selector Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 relative z-10">
          {/* Mode 1: Solar */}
          <button
            onClick={() => setSelectedMode("solar")}
            className={`p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
              selectedMode === "solar"
                ? "bg-[#FF8300] border-[#FF8300] text-black shadow-[0_0_25px_rgba(255,131,0,0.4)]"
                : "bg-white/5 border-white/10 text-white hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Sun className={`w-6 h-6 ${selectedMode === "solar" ? "text-black" : "text-[#FF8300]"}`} />
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                selectedMode === "solar" ? "bg-black text-[#FF8300]" : "bg-[#FF8300]/20 text-[#FF8300]"
              }`}>
                $0 / km
              </span>
            </div>
            <h3 className="font-bold text-lg">100% Solar Verde</h3>
            <p className={`text-xs mt-1 ${selectedMode === "solar" ? "text-black/80" : "text-white/60"}`}>
              Carga exclusiva con excedentes fotovoltaicos. Costo de energía cero.
            </p>
          </button>

          {/* Mode 2: Fast */}
          <button
            onClick={() => setSelectedMode("fast")}
            className={`p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
              selectedMode === "fast"
                ? "bg-[#FF8300] border-[#FF8300] text-black shadow-[0_0_25px_rgba(255,131,0,0.4)]"
                : "bg-white/5 border-white/10 text-white hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Zap className={`w-6 h-6 ${selectedMode === "fast" ? "text-black" : "text-[#FF8300]"}`} />
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                selectedMode === "fast" ? "bg-black text-[#FF8300]" : "bg-white/10 text-white/80"
              }`}>
                Máxima Velocidad
              </span>
            </div>
            <h3 className="font-bold text-lg">Carga Rápida Máxima</h3>
            <p className={`text-xs mt-1 ${selectedMode === "fast" ? "text-black/80" : "text-white/60"}`}>
              Combina generación solar y red eléctrica para recargar al 100% en tiempo récord.
            </p>
          </button>

          {/* Mode 3: Night */}
          <button
            onClick={() => setSelectedMode("night")}
            className={`p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
              selectedMode === "night"
                ? "bg-[#FF8300] border-[#FF8300] text-black shadow-[0_0_25px_rgba(255,131,0,0.4)]"
                : "bg-white/5 border-white/10 text-white hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Moon className={`w-6 h-6 ${selectedMode === "night" ? "text-black" : "text-[#FF8300]"}`} />
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                selectedMode === "night" ? "bg-black text-[#FF8300]" : "bg-white/10 text-white/80"
              }`}>
                Tarifa Valle
              </span>
            </div>
            <h3 className="font-bold text-lg">Nocturno Programado</h3>
            <p className={`text-xs mt-1 ${selectedMode === "night" ? "text-black/80" : "text-white/60"}`}>
              Carga automática de noche con tarifas reducidas o respaldo de batería LUNA2000.
            </p>
          </button>
        </div>

        {/* Interactive Controls & Output Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-black/40 rounded-3xl p-6 md:p-8 border border-white/10 relative z-10">
          {/* Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-white/70">Capacidad de Batería del Auto:</span>
                <span className="font-bold text-[#FF8300] text-sm">{batteryKwh} kWh (~{totalRangeKm} km)</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="5"
                value={batteryKwh}
                onChange={(e) => setBatteryKwh(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#FF8300]"
              />
              <div className="flex justify-between text-[10px] text-white/40 mt-1">
                <span>30 kWh (Compacto)</span>
                <span>60 kWh (Sedán/SUV)</span>
                <span>100 kWh (Premium)</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-white/70 block mb-2">Potencia del Smart Charger:</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setChargerPower(7.4)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    chargerPower === 7.4
                      ? "bg-[#FF8300] text-black border-[#FF8300]"
                      : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                  }`}
                >
                  7.4 kW (Monofásico)
                </button>
                <button
                  onClick={() => setChargerPower(22)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    chargerPower === 22
                      ? "bg-[#FF8300] text-black border-[#FF8300]"
                      : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                  }`}
                >
                  22 kW (Trifásico)
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70">
              <span className="font-semibold text-white">💡 Simulación:</span> Recarga típica de 20% a 80% ({chargeEnergyKwh.toFixed(1)} kWh recuperados para ~{Math.round(chargeEnergyKwh * kmPerKwh)} km de autonomía).
            </div>
          </div>

          {/* Results Grid (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <Clock className="w-5 h-5 text-[#FF8300] mx-auto mb-1.5" />
              <div className="text-2xl md:text-3xl font-bold text-white">
                {chargingHours} <span className="text-sm font-normal text-white/60">hrs</span>
              </div>
              <div className="text-[11px] text-white/60 mt-1">Tiempo de recarga (20% a 80%)</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <Zap className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <div className="text-2xl md:text-3xl font-bold text-white">
                +{kmPerHour} <span className="text-sm font-normal text-white/60">km/h</span>
              </div>
              <div className="text-[11px] text-white/60 mt-1">Autonomía recuperada por hora</div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-[#FF8300]/10 border border-[#FF8300]/30 text-center">
              <Fuel className="w-5 h-5 text-[#FF8300] mx-auto mb-1.5" />
              <div className="text-2xl md:text-3xl font-bold text-[#FF8300]">
                ${currentCost.toLocaleString("es-CL")}
              </div>
              <div className="text-[11px] text-white/80 mt-1">Costo de recarga (vs ${costGasolineEquivalent.toLocaleString("es-CL")} en bencina)</div>
            </div>

            {/* Bottom highlight pill */}
            <div className="col-span-2 sm:col-span-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div className="text-xs text-emerald-300">
                <span className="font-bold">Ahorro anual estimado (15.000 km/año):</span> Ahorras hasta <span className="text-white font-bold">${annualSavingsEstimated.toLocaleString("es-CL")} CLP/año</span> en combustible.
              </div>
              <Link
                href="/cotizacion"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#FF8300] px-3.5 py-1.5 rounded-full hover:bg-[#e07400] transition-colors flex-shrink-0"
              >
                <span>Cotizar Proyecto</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
