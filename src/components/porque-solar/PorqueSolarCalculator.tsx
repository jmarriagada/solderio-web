"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowRight, DollarSign, Zap, Clock, Leaf } from "lucide-react";
import Link from "next/link";

export function PorqueSolarCalculator() {
  const [monthlyBill, setMonthlyBill] = useState<number>(150000);

  // Constants for South of Chile (Average tariff ~270 CLP/kWh, specific yield ~1,150 kWh/kWp/yr)
  const tariffPerKwh = 270;
  const annualSpecificYield = 1150;
  const savingsRate = 0.85; // 85% average bill reduction

  // Calculations
  const annualSpending = monthlyBill * 12;
  const annualSavings = Math.round(annualSpending * savingsRate);
  
  // 25-Year cumulative savings with conservative 3.5% annual energy tariff inflation
  let cumulative25Years = 0;
  let currentYearSavings = annualSavings;
  for (let y = 1; y <= 25; y++) {
    cumulative25Years += currentYearSavings;
    currentYearSavings *= 1.035;
  }
  cumulative25Years = Math.round(cumulative25Years);

  // Suggested system size (kWp)
  const requiredAnnualKwh = annualSpending / tariffPerKwh;
  const suggestedKwp = Math.max(3.0, Math.round((requiredAnnualKwh / annualSpecificYield) * 10) / 10);

  // Estimated Payback (years)
  const estimatedPayback = suggestedKwp <= 5 ? "5.4 - 6.2" : suggestedKwp <= 10 ? "4.8 - 5.5" : "4.2 - 4.9";

  // CO2 avoided (kg/year)
  const co2AvoidedTons = Math.round((requiredAnnualKwh * 0.385) / 100) / 10;

  const formatCLP = (val: number) => {
    return "$" + val.toLocaleString("es-CL");
  };

  return (
    <section id="calculadora" className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="bg-[#1F1F1F] text-white rounded-3xl md:rounded-[36px] p-8 md:p-14 border border-white/10 relative overflow-hidden shadow-2xl">
        {/* Background Ambient Glow */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FF8300]/15 rounded-full blur-[120px] pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#FF8300] text-xs font-semibold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulador de Rentabilidad Energética</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            ¿Cuánto Puedes Ahorrar con SoldeRío?
          </h2>
          <p className="mt-3 text-xs md:text-sm text-white/70">
            Ajusta tu gasto promedio mensual en la boleta de luz para calcular tu ahorro proyectado.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Interactive Slider (6 cols) */}
          <div className="lg:col-span-6 bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-white/60 uppercase tracking-wider">
                Gasto Mensual Actual
              </span>
              <span className="text-2xl md:text-3xl font-bold text-[#FF8300]">
                {formatCLP(monthlyBill)}
                <span className="text-xs font-light text-white/60"> /mes</span>
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={50000}
              max={800000}
              step={10000}
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(Number(e.target.value))}
              className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#FF8300] mb-4"
            />

            <div className="flex justify-between text-[11px] text-white/40 mb-6">
              <span>$50.000 CLP</span>
              <span>$400.000 CLP</span>
              <span>$800.000 CLP+</span>
            </div>

            {/* Quick selectors */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[80000, 150000, 300000, 600000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setMonthlyBill(preset)}
                  className={`py-2 text-xs rounded-xl border transition-all cursor-pointer ${
                    monthlyBill === preset
                      ? "bg-[#FF8300] text-white border-[#FF8300] font-semibold"
                      : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {formatCLP(preset)}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/70 leading-relaxed">
              <span className="text-emerald-400 font-semibold">⚡ Tarifa de referencia:</span> Calculado con tarifa media del sur de Chile (~$270 CLP/kWh) y 3.5% de inflación tarifaria anual proyectada.
            </div>
          </div>

          {/* Right Column: Dynamic KPIs & Summary (6 cols) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* KPI 1: Ahorro Anual */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-xs text-white/60 mb-1">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Ahorro Estimado Anual</span>
              </div>
              <span className="text-2xl md:text-3xl font-bold text-white block mb-1">
                {formatCLP(annualSavings)}
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">
                ~85% de reducción en boleta
              </span>
            </div>

            {/* KPI 2: Ahorro a 25 Años */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-xs text-white/60 mb-1">
                <Zap className="w-4 h-4 text-[#FF8300]" />
                <span>Ahorro Total a 25 Años</span>
              </div>
              <span className="text-2xl md:text-3xl font-bold text-[#FF8300] block mb-1">
                {formatCLP(cumulative25Years)}
              </span>
              <span className="text-[11px] text-white/50">
                Garantía de generación 25 años
              </span>
            </div>

            {/* KPI 3: Payback */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-xs text-white/60 mb-1">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Retorno de Inversión (ROI)</span>
              </div>
              <span className="text-2xl md:text-3xl font-bold text-white block mb-1">
                {estimatedPayback}
              </span>
              <span className="text-[11px] text-white/50">
                Años promedio de amortización
              </span>
            </div>

            {/* KPI 4: CO2 Evitado */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-xs text-white/60 mb-1">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>CO₂ Evitado Anual</span>
              </div>
              <span className="text-2xl md:text-3xl font-bold text-emerald-400 block mb-1">
                {co2AvoidedTons} ton
              </span>
              <span className="text-[11px] text-white/50">
                Planta recomendada: ~{suggestedKwp} kWp
              </span>
            </div>

            {/* Direct CTA */}
            <div className="sm:col-span-2 mt-2">
              <Link
                href="/cotizacion"
                className="w-full bg-[#FF8300] hover:bg-[#e07400] text-white text-xs md:text-sm font-semibold py-4 rounded-2xl transition-all shadow-lg hover:shadow-[0_0_25px_rgba(255,131,0,0.5)] flex items-center justify-center gap-2 group"
              >
                <span>Solicitar Estudio y Cotización Exacta con mi Boleta</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
