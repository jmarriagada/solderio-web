'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  TrendingUp, 
  PiggyBank, 
  BarChart3, 
  Calendar, 
  Leaf, 
  Sparkles,
  ShieldCheck
} from 'lucide-react'
import { SizingScenarioResult } from '@/lib/solar/solar-types'
import { generate25YearCashflow } from '@/lib/solar/financial-engine'

interface Props {
  scenario: SizingScenarioResult
  distributorName: string
}

export function FinancialAnalysisTab({ scenario, distributorName }: Props) {
  const [discountRatePct, setDiscountRatePct] = useState(6.0)
  const [tariffEscalationRatePct, setTariffEscalationRatePct] = useState(3.2)

  const cashflow = generate25YearCashflow(scenario, {
    discountRatePct,
    tariffEscalationRatePct,
  })

  const year25NetCumulative = cashflow[cashflow.length - 1].cumulativeCashflowClp

  return (
    <div className="space-y-6">
      {/* Resumen de Retorno & Métricas Clave */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-gray-100 shadow-sm p-4 bg-white text-center">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Inversión Llave en Mano</span>
          <span className="text-xl font-black text-[#1F1F1F] block mt-1">
            \${scenario.capexClp.toLocaleString('es-CL')}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">~\${scenario.capexUsd.toLocaleString('es-CL')} USD</span>
        </Card>

        <Card className="rounded-2xl border-gray-100 shadow-sm p-4 bg-white text-center">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Ahorro Anual Año 1</span>
          <span className="text-xl font-black text-emerald-600 block mt-1">
            +\${scenario.totalAnnualSavingsClp.toLocaleString('es-CL')}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">Autoconsumo + Net Billing</span>
        </Card>

        <Card className="rounded-2xl border-gray-100 shadow-sm p-4 bg-white text-center">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Payback Simple / Dinámico</span>
          <span className="text-xl font-black text-[#FF8300] block mt-1">
            {scenario.simplePaybackYears} / {scenario.dynamicPaybackYears}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">Años de retorno</span>
        </Card>

        <Card className="rounded-2xl border-gray-100 shadow-sm p-4 bg-white text-center">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">VPN 25 Años / TIR</span>
          <span className="text-xl font-black text-blue-600 block mt-1">
            +\${scenario.npv25yClp.toLocaleString('es-CL')}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">TIR: {scenario.irrPct}% anual</span>
        </Card>
      </div>

      {/* Parámetros Financieros & LCOE */}
      <Card className="rounded-2xl border-gray-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="pb-3 border-b border-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-[#1F1F1F]">
                  Evaluación Económica Proyectada (Escenario: {scenario.title})
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Modelo financiero Ley 20.571 considerando degradación anual de módulos ({0.5}%) e inflación energética
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                <Leaf className="h-3 w-3 mr-1" /> Evita {scenario.co2AvoidedTonsPerYear} ton CO₂/año
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* LCOE & Ahorro Total */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                Costo Nivelado de Energía (LCOE)
              </span>
              <span className="text-lg font-black text-emerald-600 block mt-0.5">
                \${scenario.lcoeClpKwh} CLP/kWh
              </span>
              <span className="text-[10px] text-gray-500 block">
                vs ~\$175 CLP/kWh de compra a {distributorName}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                Ahorro Neto Acumulado (25 Años)
              </span>
              <span className="text-lg font-black text-[#1F1F1F] block mt-0.5">
                +\${year25NetCumulative.toLocaleString('es-CL')} CLP
              </span>
              <span className="text-[10px] text-gray-500 block">
                Ganancia neta libre tras pagar el CAPEX
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                Tasa de Descuento (WACC)
              </span>
              <span className="text-lg font-black text-gray-800 block mt-0.5">
                {discountRatePct}% anual
              </span>
              <span className="text-[10px] text-gray-500 block">
                Criterio estándar evaluación C&I / Residencial
              </span>
            </div>
          </div>

          {/* Tabla de Flujo de Caja (Muestra años clave: 0, 1, 3, 5, 10, 15, 20, 25) */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Proyección de Flujos de Caja (Años Seleccionados)
            </span>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50/80 text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Año</th>
                    <th className="py-2.5 px-3 font-semibold">Generación (kWh)</th>
                    <th className="py-2.5 px-3 font-semibold">Tarifa Red (\$/kWh)</th>
                    <th className="py-2.5 px-3 font-semibold">Ahorro Bruto (\$CLP)</th>
                    <th className="py-2.5 px-3 font-semibold">OPEX (\$CLP)</th>
                    <th className="py-2.5 px-3 font-semibold text-right pr-4">Flujo Acumulado (\$CLP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[0, 1, 2, 3, 5, 10, 15, 20, 25].map((yr) => {
                    const row = cashflow[yr]
                    if (!row) return null
                    const isPositive = row.cumulativeCashflowClp >= 0

                    return (
                      <tr key={yr} className="hover:bg-gray-50/50">
                        <td className="py-2 px-3 font-bold text-[#1F1F1F]">
                          {yr === 0 ? 'Año 0 (Inversión)' : `Año ${yr}`}
                        </td>
                        <td className="py-2 px-3 text-gray-600">
                          {yr === 0 ? '-' : `${row.generationKwh.toLocaleString('es-CL')} kWh`}
                        </td>
                        <td className="py-2 px-3 text-gray-600">
                          \${row.gridTariffClpKwh}
                        </td>
                        <td className="py-2 px-3 font-semibold text-emerald-600">
                          {yr === 0 ? '-' : `+\$${row.grossSavingsClp.toLocaleString('es-CL')}`}
                        </td>
                        <td className="py-2 px-3 text-gray-500">
                          {yr === 0 ? '-' : `-\$${row.opexClp.toLocaleString('es-CL')}`}
                        </td>
                        <td className={`py-2 px-3 text-right pr-4 font-black ${
                          isPositive ? 'text-emerald-600' : 'text-red-500'
                        }`}>
                          {row.cumulativeCashflowClp < 0 ? '-' : '+'}\${Math.abs(row.cumulativeCashflowClp).toLocaleString('es-CL')}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
