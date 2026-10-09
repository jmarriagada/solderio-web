"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  TrendingUp, 
  Wallet, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Calendar,
  AlertCircle,
  Info
} from "lucide-react";
import { SolarSizingResult, QuoteFormData } from "@/types/cotizacion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sizing: SolarSizingResult;
  formData: QuoteFormData;
}

export function NetBillingLedgerDrawer({ isOpen, onClose, sizing, formData }: Props) {
  const ledger = sizing.netBillingMonthlyLedger || [];
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const selectedMonth = ledger[selectedMonthIdx] || ledger[0] || {
    monthName: "Enero",
    boughtKwh: 0,
    boughtClp: 0,
    injectedKwh: 0,
    creditClp: 0,
    initialBalanceClp: 0,
    finalBalanceClp: 0,
    customerPaysClp: 0,
  };

  const maxFinancialVal = Math.max(
    ...ledger.map((l) => Math.max(l.boughtClp, l.creditClp, l.finalBalanceClp)),
    50000
  );

  const zeroVariableMonthsCount = ledger.filter((l) => l.customerPaysClp <= 3000).length;
  const annualSurplus = ledger[11]?.annualSurplusPayoutClp || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="w-full max-w-4xl max-h-[92vh] flex flex-col p-5 sm:p-8 rounded-[28px] bg-gradient-to-b from-[#1E1E1E] via-[#161616] to-[#111111] border border-white/15 shadow-2xl relative text-white overflow-hidden"
          >
            {/* Ambient background blur */}
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#FF8300]/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer z-10"
              title="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="mb-4 pr-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 text-xs font-mono font-medium mb-2 border border-blue-500/30">
                <Wallet className="w-3.5 h-3.5" />
                <span>MECÁNICA FINANCIERA • LEY 21.118 NET BILLING</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight">
                Balance Mensual y Compensación de Invierno
              </h3>
              <p className="text-xs sm:text-sm text-white/60 font-light mt-1">
                Cómo tus excedentes de verano se acumulan como saldo a favor en dinero para pagar tus cuentas en invierno.
              </p>
            </div>

            {/* Quick KPI Stat Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-[10px] uppercase font-mono text-white/40 block">Meses Boleta Variable $0</span>
                <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-0.5">
                  {zeroVariableMonthsCount} de 12 meses
                </div>
                <span className="text-[10px] text-white/50 block">Solo pagas cargo fijo de red</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-[10px] uppercase font-mono text-white/40 block">Saldo Máximo Acumulado</span>
                <div className="text-lg sm:text-xl font-bold font-mono text-blue-400 mt-0.5">
                  {formatCurrency(Math.max(...ledger.map((l) => l.finalBalanceClp), 0))}
                </div>
                <span className="text-[10px] text-white/50 block">Pozo protector para el invierno</span>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-[10px] uppercase font-mono text-white/40 block">Reliquidación Anual</span>
                <div className="text-lg sm:text-xl font-bold font-mono text-[#FF8300] mt-0.5">
                  {annualSurplus > 0 ? formatCurrency(annualSurplus) : "Compensado 100%"}
                </div>
                <span className="text-[10px] text-white/50 block">Devolución en cheque o transferencia</span>
              </div>
            </div>

            {/* Scrollable Container */}
            <div className="overflow-y-auto pr-1 space-y-4 flex-1">
              {/* Monthly Stacked Comparison Chart */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/10">
                <div className="flex items-center justify-between text-xs text-white/60 mb-3 font-mono">
                  <span>Flujo Mensual en Dinero ($CLP)</span>
                  <span className="text-[11px] text-[#FF8300]">Haz clic en cualquier mes</span>
                </div>

                <div className="h-44 sm:h-52 flex items-end gap-1.5 sm:gap-2 pt-4 pb-2 border-b border-white/10">
                  {ledger.map((m, idx) => {
                    const isSelected = selectedMonthIdx === idx;
                    const creditHeightPct = Math.min(100, Math.round((m.creditClp / maxFinancialVal) * 100));
                    const boughtHeightPct = Math.min(100, Math.round((m.boughtClp / maxFinancialVal) * 100));
                    const balanceHeightPct = Math.min(100, Math.round((m.finalBalanceClp / maxFinancialVal) * 100));

                    return (
                      <div
                        key={m.monthName}
                        onClick={() => setSelectedMonthIdx(idx)}
                        className={`flex-1 flex flex-col justify-end items-center h-full cursor-pointer group transition-all relative ${
                          isSelected ? "opacity-100" : "opacity-75 hover:opacity-100"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#38bdf8]" />
                        )}

                        <div className="w-full flex items-end justify-center gap-[2px] h-full">
                          {/* Credit bar (Orange) */}
                          <div
                            className="w-1/3 rounded-t-sm bg-[#FF8300] transition-all"
                            style={{ height: `${creditHeightPct}%` }}
                            title={`Crédito Inyección: ${formatCurrency(m.creditClp)}`}
                          />

                          {/* Purchase bar (Blue) */}
                          <div
                            className="w-1/3 rounded-t-sm bg-blue-500 transition-all"
                            style={{ height: `${boughtHeightPct}%` }}
                            title={`Compra Red: ${formatCurrency(m.boughtClp)}`}
                          />

                          {/* Cumulative balance bar (Emerald) */}
                          <div
                            className="w-1/3 rounded-t-sm bg-emerald-400 transition-all"
                            style={{ height: `${balanceHeightPct}%` }}
                            title={`Saldo Acumulado: ${formatCurrency(m.finalBalanceClp)}`}
                          />
                        </div>

                        <span className={`text-[9px] sm:text-[10px] font-mono mt-1 ${
                          isSelected ? "text-blue-400 font-bold" : "text-white/40"
                        }`}>
                          {m.monthName.slice(0, 3)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-3 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#FF8300]" />
                    <span className="text-white/70">Crédito Inyectado ($)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                    <span className="text-white/70">Consumo Red Facturado ($)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                    <span className="text-white/70">Saldo a Favor Acumulado ($)</span>
                  </div>
                </div>
              </div>

              {/* Inspected Month Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="border-r border-white/10 pr-2">
                  <span className="text-[10px] uppercase font-mono text-white/40 block">Mes Seleccionado</span>
                  <div className="text-base font-semibold text-white mt-0.5">
                    {selectedMonth.monthName}
                  </div>
                  <span className="text-[10px] text-white/50 block mt-0.5">
                    {selectedMonthIdx >= 3 && selectedMonthIdx <= 8 ? "Temporada Fría / Límite Invierno" : "Temporada Alta Solar"}
                  </span>
                </div>

                <div className="border-r border-white/10 pr-2">
                  <span className="text-[10px] uppercase font-mono text-[#FF8300] block">Crédito del Mes</span>
                  <div className="text-base font-semibold text-[#FF8300] mt-0.5 font-mono">
                    {formatCurrency(selectedMonth.creditClp)}
                  </div>
                  <span className="text-[10px] text-white/50 block mt-0.5">
                    {selectedMonth.injectedKwh} kWh inyectados
                  </span>
                </div>

                <div className="border-r border-white/10 pr-2">
                  <span className="text-[10px] uppercase font-mono text-emerald-400 block">Saldo Acumulado Final</span>
                  <div className="text-base font-semibold text-emerald-400 mt-0.5 font-mono">
                    {formatCurrency(selectedMonth.finalBalanceClp)}
                  </div>
                  <span className="text-[10px] text-white/50 block mt-0.5">
                    Pasa al mes siguiente
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono text-white/80 block">Monto a Pagar en Boleta</span>
                  <div className="text-base font-semibold text-white mt-0.5 font-mono">
                    {formatCurrency(selectedMonth.customerPaysClp)}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">
                    {selectedMonth.customerPaysClp <= 2500 ? "✓ Solo cargo fijo ($0 variable)" : "Tarifa compensada"}
                  </span>
                </div>
              </div>

              {/* Full Ledger Table */}
              <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
                <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-white">
                    Detalle Mes a Mes del Ciclo Anual (Ley 21.118)
                  </span>
                  <span className="text-[10px] font-mono text-white/40">Valores en $CLP</span>
                </div>

                <div className="overflow-x-auto max-h-56">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-black/60 text-white/50 text-[10px] uppercase border-b border-white/5 sticky top-0">
                      <tr>
                        <th className="py-2.5 px-3">Mes</th>
                        <th className="py-2.5 px-3">Compra Red</th>
                        <th className="py-2.5 px-3">Crédito Inyección</th>
                        <th className="py-2.5 px-3">Saldo a Favor</th>
                        <th className="py-2.5 px-3 text-right">Pagas en Boleta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/70">
                      {ledger.map((row, rIdx) => (
                        <tr 
                          key={rIdx} 
                          className={`hover:bg-white/5 transition-colors cursor-pointer ${
                            selectedMonthIdx === rIdx ? "bg-white/10 text-white" : ""
                          }`}
                          onClick={() => setSelectedMonthIdx(rIdx)}
                        >
                          <td className="py-2 px-3 font-medium text-white">{row.monthName}</td>
                          <td className="py-2 px-3">{formatCurrency(row.boughtClp)}</td>
                          <td className="py-2 px-3 text-[#FF8300]">{formatCurrency(row.creditClp)}</td>
                          <td className="py-2 px-3 text-emerald-400">{formatCurrency(row.finalBalanceClp)}</td>
                          <td className="py-2 px-3 text-right">
                            <span className={row.customerPaysClp <= 2500 ? "text-emerald-400 font-bold" : "text-white"}>
                              {formatCurrency(row.customerPaysClp)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Legal explanation */}
              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 text-xs text-white/80 font-light leading-relaxed flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-medium block mb-0.5">
                    ¿Qué dice la Ley 21.118 sobre los saldos a favor?
                  </strong>
                  Los créditos generados por inyección a la red no se pierden al finalizar el mes: se acumulan monetariamente en tu cuenta. Si al cierre del ciclo anual de facturación (o 12 meses) mantienes un remanente a favor que no alcanzaste a consumir, la distribuidora está obligada a pagártelo o reliquidarlo directamente en tu cuenta corriente o vale vista (Art. 149 bis Ley General de Servicios Eléctricos).
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-white/40 text-[11px] font-mono">
                Regulado por SEC y Ministerio de Energía.
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
