'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  TrendingUp, 
  Leaf, 
  Printer, 
  ShieldCheck, 
  MapPin, 
  Zap, 
  Info,
  Calendar,
  Layers,
  ArrowDownRight,
  Sparkles,
  BarChart3
} from 'lucide-react'
import { MinEnergiaSimInputs, MinEnergiaSimResults } from '@/lib/solar/minenergia-models'

interface Props {
  clientName: string
  clientRut?: string | null
  comunaName: string
  distributorName: string
  tariffType: string
  gridTariffClpKwh: number
  injectionTariffClpKwh: number
  monthlyKwh: number[]
  simInputs: MinEnergiaSimInputs
  simResults: MinEnergiaSimResults
  capexClp: number
}

export function EconomicSavingsReport({
  clientName,
  clientRut,
  comunaName,
  distributorName,
  tariffType,
  gridTariffClpKwh,
  injectionTariffClpKwh,
  monthlyKwh,
  simInputs,
  simResults,
  capexClp,
}: Props) {
  const totalAnnualConsumptionKwh = monthlyKwh.reduce((a, b) => a + b, 0)
  const annualBillWithoutSolarClp = Math.round(totalAnnualConsumptionKwh * gridTariffClpKwh)

  // Rango de Ahorro según Ley 20.571 (Calculadora MinEnergía):
  // Límite Inferior: 100% Inyectado a la red (Solo se valoriza a precio de nudo de inyección)
  const minAnnualSavingsClp = Math.round(simResults.annualGenerationKwh * injectionTariffClpKwh)
  // Límite Superior: 100% Autoconsumido (Ahorro total a tarifa de suministro)
  const maxAnnualSavingsClp = Math.round(simResults.annualGenerationKwh * gridTariffClpKwh)
  // Escenario Real Ponderado SoldeRío (65% Autoconsumo / 35% Inyección)
  const realisticAnnualSavingsClp = Math.round(
    simResults.annualGenerationKwh * (0.65 * gridTariffClpKwh + 0.35 * injectionTariffClpKwh)
  )

  const newAnnualBillWithSolarClp = Math.max(0, annualBillWithoutSolarClp - realisticAnnualSavingsClp)
  const billReductionPct = Math.min(95, Math.round((realisticAnnualSavingsClp / annualBillWithoutSolarClp) * 100))

  const simplePaybackYears = (capexClp / Math.max(1, realisticAnnualSavingsClp)).toFixed(1)
  const netSavings25YearsClp = realisticAnnualSavingsClp * 25 - capexClp

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Barra de Acciones */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm print:hidden">
        <div>
          <Badge className="bg-orange-50 text-[#FF8300] border-orange-200 text-xs">
            Formato Oficial Calculadora Solar MinEnergía / SoldeRío
          </Badge>
          <p className="text-xs text-gray-500 mt-1">
            Reporte de Prefactibilidad Económica, Ahorro en Boleta & Retorno (Ley 20.571)
          </p>
        </div>
        <Button
          onClick={() => window.print()}
          size="sm"
          className="rounded-xl bg-[#FF8300] hover:bg-[#E67600] text-white text-xs font-semibold"
        >
          <Printer className="h-4 w-4 mr-1.5" />
          Imprimir / Exportar PDF
        </Button>
      </div>

      {/* Documento Imprimible */}
      <Card className="rounded-[24px] border-gray-100 shadow-md bg-white p-8 space-y-8 print:shadow-none print:border-0 print:p-0">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b border-gray-100 pb-6 gap-4">
          <div>
            <span className="text-xl font-black text-[#1F1F1F] block">SoldeRío</span>
            <h1 className="text-lg font-bold text-gray-800 mt-0.5">
              Reporte: Estimación de Ahorro en la Cuenta de Luz (Ley 20.571)
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Generado el {new Date().toLocaleDateString('es-CL')} • Modelo de Prefactibilidad Económica MinEnergía
            </p>
          </div>
          <div className="text-left sm:text-right">
            <Badge variant="outline" className="text-xs border-gray-300">
              Cliente: {clientName}
            </Badge>
            {clientRut && <p className="text-[11px] text-gray-500 mt-1">RUT: {clientRut}</p>}
          </div>
        </div>

        {/* 1. Resumen Comparativo de Facturación Antes vs Después */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Gasto Eléctrico Actual (Sin Solar)</span>
            <span className="text-lg font-black text-[#1F1F1F] block mt-1">
              ${annualBillWithoutSolarClp.toLocaleString('es-CL')} <span className="text-xs font-normal text-gray-500">/año</span>
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">~${Math.round(annualBillWithoutSolarClp / 12).toLocaleString('es-CL')}/mes</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-[10px] text-emerald-800 uppercase font-bold block">Ahorro Anual Estimado (Año 1)</span>
            <span className="text-xl font-black text-emerald-600 block mt-1">
              +${realisticAnnualSavingsClp.toLocaleString('es-CL')}
            </span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
              Reducción del {billReductionPct}% en la boleta
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
            <span className="text-[10px] text-orange-800 uppercase font-bold block">Retorno de Inversión (Payback)</span>
            <span className="text-xl font-black text-[#FF8300] block mt-1">
              {simplePaybackYears} Años
            </span>
            <span className="text-[10px] text-orange-700 block mt-0.5">
              CAPEX: ${capexClp.toLocaleString('es-CL')} CLP
            </span>
          </div>
        </div>

        {/* 2. Parámetros del Sitio & Tarifas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-100 space-y-2">
            <h3 className="font-bold text-[#1F1F1F] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#FF8300]" /> Parámetros Eléctricos & Tarifarios
            </h3>
            <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Distribuidora Eléctrica:</span><strong>{distributorName}</strong></div>
            <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Tarifa Regulada:</span><strong>{tariffType}</strong></div>
            <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Costo Suministro Compra:</span><strong className="text-gray-900">${gridTariffClpKwh} CLP/kWh</strong></div>
            <div className="flex justify-between py-1"><span className="text-gray-500">Valor Inyección Ley 20.571:</span><strong className="text-emerald-600">${injectionTariffClpKwh} CLP/kWh</strong></div>
          </div>

          <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-100 space-y-2">
            <h3 className="font-bold text-[#1F1F1F] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-[#FF8300]" /> Arreglo Fotovoltaico Diseñado
            </h3>
            <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Capacidad Instalada:</span><strong>{simInputs.installedCapacityKwp} kWp</strong></div>
            <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Generación Anual (MinEnergía):</span><strong>{simResults.annualGenerationKwh.toLocaleString('es-CL')} kWh/año</strong></div>
            <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Inclinación / Azimut:</span><strong>{simInputs.tiltDeg}° / {simInputs.azimuthDeg}° (Norte)</strong></div>
            <div className="flex justify-between py-1"><span className="text-gray-500">Tipo de Montaje:</span><strong>{simInputs.isCoplanar ? 'Coplanar' : 'Inclinado'} ({simInputs.roofType})</strong></div>
          </div>
        </div>

        {/* 3. Tabla Oficial de Rangos de Ahorro (Calculadora MinEnergía) */}
        <div className="space-y-3">
          <h3 className="font-bold text-[#1F1F1F] uppercase tracking-wider text-xs">
            3. Rango de Ahorro Anual Estimado (Ley 20.571)
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 text-xs">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="p-3">Escenario de Consumo</th>
                  <th className="p-3">Tarifa Ponderada</th>
                  <th className="p-3">Ahorro Anual ($CLP)</th>
                  <th className="p-3">Retorno Simple</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr>
                  <td className="p-3">
                    <strong className="text-gray-800 block">Límite Inferior (100% Inyección a Red)</strong>
                    <span className="text-[10px] text-gray-400">Si toda la energía se inyecta sin autoconsumo</span>
                  </td>
                  <td className="p-3 text-gray-600">${injectionTariffClpKwh} /kWh</td>
                  <td className="p-3 font-semibold text-gray-800">+${minAnnualSavingsClp.toLocaleString('es-CL')}</td>
                  <td className="p-3 text-gray-600">{(capexClp / minAnnualSavingsClp).toFixed(1)} Años</td>
                </tr>
                <tr className="bg-orange-50/20">
                  <td className="p-3">
                    <strong className="text-[#FF8300] block">Estimado Real SoldeRío (65% Autoconsumo / 35% Inyección)</strong>
                    <span className="text-[10px] text-gray-500">Curva de carga real típica con Net Billing</span>
                  </td>
                  <td className="p-3 font-bold text-[#FF8300]">~${Math.round(0.65 * gridTariffClpKwh + 0.35 * injectionTariffClpKwh)} /kWh</td>
                  <td className="p-3 font-black text-emerald-600">+${realisticAnnualSavingsClp.toLocaleString('es-CL')}</td>
                  <td className="p-3 font-black text-[#FF8300]">{simplePaybackYears} Años</td>
                </tr>
                <tr>
                  <td className="p-3">
                    <strong className="text-gray-800 block">Límite Superior (100% Autoconsumo Instantáneo)</strong>
                    <span className="text-[10px] text-gray-400">Si el 100% de la generación se consume diurnamente</span>
                  </td>
                  <td className="p-3 text-gray-600">${gridTariffClpKwh} /kWh</td>
                  <td className="p-3 font-semibold text-emerald-600">+${maxAnnualSavingsClp.toLocaleString('es-CL')}</td>
                  <td className="p-3 text-gray-600">{(capexClp / maxAnnualSavingsClp).toFixed(1)} Años</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Ganancia Neta a 25 Años & Balance Ambiental */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
            <span className="text-[10px] font-bold uppercase text-emerald-800 block">Ganancia Neta Libre (25 Años)</span>
            <span className="text-xl font-black text-emerald-600 block">
              +${netSavings25YearsClp.toLocaleString('es-CL')} CLP
            </span>
            <p className="text-[11px] text-emerald-700">
              Ahorro neto total después de amortizar el 100% del costo de instalación.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1">
            <span className="text-[10px] font-bold uppercase text-blue-800 block">Mitigación Ambiental</span>
            <span className="text-xl font-black text-blue-600 block">
              {simResults.co2AvoidedTonsPerYear} Ton CO₂ / año
            </span>
            <p className="text-[11px] text-blue-700">
              Equivalente a plantar ~{Math.round(simResults.co2AvoidedTonsPerYear * 15)} árboles nativos al año.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
