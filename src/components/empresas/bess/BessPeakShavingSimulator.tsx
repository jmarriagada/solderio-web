"use client";

import { useState, useId } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, ShieldCheck, Fuel, DollarSign, ArrowRight } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";

const DISTRIBUIDORAS = [
  { id: "saesa", name: "Grupo Saesa (Saesa / Frontel / Luz Osorno)", defaultRate: 23500 },
  { id: "crell", name: "Crell (Llanquihue / Frutillar / Puerto Varas)", defaultRate: 22800 },
  { id: "cge", name: "CGE Distribución", defaultRate: 21500 },
  { id: "otra", name: "Otra Distribuidora / Cooperativa Rural", defaultRate: 22000 },
];

const TARIFAS = [
  { id: "bt43", name: "BT4.3 (Baja Tensión con Horario Punta)", multiplier: 1.0 },
  { id: "at43", name: "AT4.3 (Alta Tensión con Horario Punta)", multiplier: 0.85 },
  { id: "libre", name: "Cliente Libre / Contrato Bilateral", multiplier: 0.75 },
];

export function BessPeakShavingSimulator() {
  const peakKwId = useId();
  const dieselHoursId = useId();

  const [distribuidora, setDistribuidora] = useState("saesa");
  const [tarifa, setTarifa] = useState("bt43");
  const [peakKw, setPeakKw] = useState(100);
  const [dieselHoursMonth, setDieselHoursMonth] = useState(40);

  // Economic calculations
  const selectedDist = DISTRIBUIDORAS.find((d) => d.id === distribuidora) || DISTRIBUIDORAS[0];
  const selectedTarifa = TARIFAS.find((t) => t.id === tarifa) || TARIFAS[0];

  const ratePerKwMonth = Math.round(selectedDist.defaultRate * selectedTarifa.multiplier);

  // 1. Annual Power Savings: The peak recorded in winter is billed every month (12 months)
  const annualPowerSavings = peakKw * ratePerKwMonth * 12;

  // 2. Annual Diesel Displacement Savings:
  // Assuming average load factor 0.65, diesel generation costs ~ $390 CLP/kWh
  const monthlyDieselKwh = dieselHoursMonth * (peakKw * 0.65);
  const annualDieselSavings = monthlyDieselKwh * 390 * 12;

  // 3. Total Annual OpEx Savings
  const totalAnnualSavings = annualPowerSavings + annualDieselSavings;

  // 4. Estimated BESS CAPEX (Containerized LiFePO4, GFM Inverters, STS, SEC TE-4, Turnkey)
  // Sizing ~ 2 hours of duration for Peak Shaving: kWh = kW * 2
  const bessKwh = peakKw * 2;
  const capexBess = bessKwh * 680000; // ~$680k CLP per kWh installed turnkey

  // 5. Tax Shield (100% Instant Depreciation - Art. 31 N°5 bis LIR): 27% effective cash credit in year 1
  const taxShieldCashCredit = Math.round(capexBess * 0.27);

  // 6. Net Payback with Tax Shield
  const netCapex = capexBess - taxShieldCashCredit;
  const paybackYears = totalAnnualSavings > 0 ? (netCapex / totalAnnualSavings).toFixed(1) : "0";

  // 7. 15-Year Cumulative Net Savings (including battery degradation ~0.5%/year)
  const fifteenYearCumulativeSavings = Math.round(totalAnnualSavings * 13.5 - capexBess);

  const formatCLP = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="simulador-bess" className="w-full py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#141414] text-white relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#FF8300]/10 rounded-full blur-[190px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-light tracking-tight leading-[1.15] mb-5 text-white">
            Simulador de Peak Shaving &amp; Retorno BTM
          </h2>
          <p className="text-base md:text-lg text-white/70 font-light leading-relaxed">
            Modela en tiempo real el ahorro en potencia facturada en Horario Punta (18:00 a 22:00 hrs), las horas de marcha diésel evitadas y el impacto del escudo tributario del SII.
          </p>
        </motion.div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Controls (5 cols) */}
          <div className="lg:col-span-5 bg-[#1A1A1A] rounded-[28px] border border-white/15 p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
              <Calculator className="w-5 h-5 text-[#FF8300]" />
              <h3 className="text-base md:text-lg font-medium text-white">Parámetros de tu Faena</h3>
            </div>

            {/* Selector Distribuidora */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-white/60 block mb-2">
                Distribuidora Eléctrica
              </label>
              <select
                value={distribuidora}
                onChange={(e) => setDistribuidora(e.target.value)}
                className="w-full bg-[#242424] border border-white/15 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-[#FF8300] transition-colors"
              >
                {DISTRIBUIDORAS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector Tarifa */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-white/60 block mb-2">
                Tarifa de Conexión
              </label>
              <select
                value={tarifa}
                onChange={(e) => setTarifa(e.target.value)}
                className="w-full bg-[#242424] border border-white/15 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-[#FF8300] transition-colors"
              >
                {TARIFAS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Slider: Potencia Peak en Punta (kW) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor={peakKwId} className="text-xs font-mono uppercase tracking-wider text-white/60">
                  Demanda en Horario Punta (18-22h)
                </label>
                <span className="text-sm font-mono font-medium text-[#FF8300]">
                  {peakKw} kW
                </span>
              </div>
              <input
                id={peakKwId}
                type="range"
                min="30"
                max="400"
                step="10"
                value={peakKw}
                onChange={(e) => setPeakKw(Number(e.target.value))}
                className="w-full accent-[#FF8300] bg-white/10 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/40 mt-1">
                <span>30 kW (Lechería pequeña)</span>
                <span>400 kW (Planta RAS / Frigorífico)</span>
              </div>
            </div>

            {/* Slider: Horas Diésel Mensuales Evitadas */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor={dieselHoursId} className="text-xs font-mono uppercase tracking-wider text-white/60">
                  Horas Marcha Diésel / Mes
                </label>
                <span className="text-sm font-mono font-medium text-amber-400">
                  {dieselHoursMonth} hrs/mes
                </span>
              </div>
              <input
                id={dieselHoursId}
                type="range"
                min="0"
                max="150"
                step="5"
                value={dieselHoursMonth}
                onChange={(e) => setDieselHoursMonth(Number(e.target.value))}
                className="w-full accent-amber-400 bg-white/10 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/40 mt-1">
                <span>0 hrs (Solo red)</span>
                <span>150 hrs (Uso intensivo diésel)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-[11px] text-white/60 font-light leading-relaxed">
              <span className="text-white/80 font-medium block mb-0.5">Cargo Estimado por Potencia:</span>
              {formatCLP(ratePerKwMonth)} / kW mensual facturado en los 12 meses del año según Decreto Tarifario vigente.
            </div>
          </div>

          {/* Right Column: Dynamic Financial Results (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Row: 2 Big Result Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Annual Power Peak Savings */}
              <div className="bg-gradient-to-br from-[#1F1F1F] to-[#171717] rounded-2xl border border-[#FF8300]/30 p-6 shadow-xl relative overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-[#FF8300]/15 border border-[#FF8300]/25 flex items-center justify-center text-[#FF8300] mb-4">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-xs text-white/60 font-light block mb-1">
                  Ahorro Anual Cargo Potencia (Peak Shaving)
                </span>
                <span className="text-2xl md:text-3xl font-mono font-light text-white tracking-tight block mb-2">
                  {formatCLP(annualPowerSavings)}
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  + {formatCLP(Math.round(annualPowerSavings / 12))}/mes constante
                </span>
              </div>

              {/* Card 2: Annual Diesel Avoided */}
              <div className="bg-gradient-to-br from-[#1F1F1F] to-[#171717] rounded-2xl border border-white/10 p-6 shadow-xl relative overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-4">
                  <Fuel className="w-5 h-5" />
                </div>
                <span className="text-xs text-white/60 font-light block mb-1">
                  Ahorro Anual Sustitución Diésel
                </span>
                <span className="text-2xl md:text-3xl font-mono font-light text-white tracking-tight block mb-2">
                  {formatCLP(annualDieselSavings)}
                </span>
                <span className="text-[11px] font-mono text-amber-400">
                  Desplaza {Math.round(dieselHoursMonth * 12)} horas diésel/año
                </span>
              </div>
            </div>

            {/* Total Annual OpEx Reduction Banner */}
            <div className="bg-gradient-to-r from-[#1F1F1F] via-[#242424] to-[#1F1F1F] rounded-2xl border border-white/15 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#FF8300] block mb-1">
                  Ahorro Total OpEx al Año
                </span>
                <span className="text-3xl md:text-4xl font-mono font-light text-white tracking-tight">
                  {formatCLP(totalAnnualSavings)}
                  <span className="text-xs font-mono text-white/60 font-normal ml-1">/ año</span>
                </span>
              </div>

              <div className="flex items-center gap-4 text-center sm:text-right">
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                  <span className="text-[10px] font-mono text-white/50 uppercase block">Payback Neto</span>
                  <span className="text-xl md:text-2xl font-mono font-medium text-emerald-400">
                    {paybackYears} Años
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                  <span className="text-[10px] font-mono text-white/50 uppercase block">Crédito SII (27%)</span>
                  <span className="text-sm md:text-base font-mono font-medium text-white">
                    {formatCLP(taxShieldCashCredit)}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Highlights Pill List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/70 font-light">
              <div className="bg-black/30 border border-white/10 rounded-xl p-3.5 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#FF8300] shrink-0 mt-0.5" />
                <span>
                  <strong>Escudo Fiscal Art. 31 N°5 bis:</strong> Depreciación Instantánea 100% que reduce directamente el pago de Impuesto de Primera Categoría en el año 1.
                </span>
              </div>
              <div className="bg-black/30 border border-white/10 rounded-xl p-3.5 flex items-start gap-2.5">
                <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Flujo de Caja Acumulado (15 Años):</strong> Estimado en{" "}
                  <strong className="text-white">{formatCLP(fifteenYearCumulativeSavings)}</strong> de liquidez neta libre para reinversión operativa.
                </span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2 flex justify-start sm:justify-end">
              <CtaButton
                onClick={() => scrollToSection("auditoria-bess")}
                variant="white"
                className="w-full sm:w-auto"
              >
                Validar Cifras con Analizador de Redes (15 Días Sin Costo)
              </CtaButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
