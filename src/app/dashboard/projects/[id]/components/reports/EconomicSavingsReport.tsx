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
  Layers
} from 'lucide-react'
import { MinEnergiaSimInputs, MinEnergiaSimResults } from '@/lib/solar/minenergia-models'

interface Props {
  clientName: string
  clientRut?: string | null
  comunaName: string
  distributorName: string
  tariffType: string
  averageMonthlyKwh: number
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
  averageMonthlyKwh,
  simInputs,
  simResults,
  capexClp,
}: Props) {
  const injectionRateClp = 95
  const consumptionRateClp = 175

  // Rango de Ahorro según Ley 20.571:
  // Límite Inferior: 100% Inyectado a la red
  const minAnnualSavingsClp = Math.round(simResults.annualGenerationKwh * injectionRateClp)
  // Límite Superior: 100% Autoconsumido
  const maxAnnualSavingsClp = Math.round(simResults.annualGenerationKwh * consumptionRateClp)
  // Escenario Real Ponderado (65% Autoconsumo / 35% Inyección)
  const realisticAnnualSavingsClp = Math.round(
    simResults.annualGenerationKwh * (0.65 * consumptionRateClp + 0.35 * injectionRateClp)
  )

  const simplePaybackMinYears = (capexClp / maxAnnualSavingsClp).toFixed(1)
  const simplePaybackMaxYears = (capexClp / minAnnualSavingsClp).toFixed(1)
  const simplePaybackRealYears = (capexClp / realisticAnnualSavingsClp).toFixed(1)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Barra de Acciones */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm print:hidden">
        <div>
          <Badge className="bg-orange-50 text-[#FF8300] border-orange-200 text-xs">
            Formato Oficial Calculadora Solar MinEnergía / SoldeRío
          </Badge>
          <p className="text-xs text-gray-500 mt-1">Reporte de Prefactibilidad Económica & Ahorro en Boleta</p>
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
            <span className="text-xl font-black text-[#1F1F1F] block">SoldeRío Hub</span>
            <h1 className="text-lg font-bold text-gray-800 mt-0.5">
              Reporte: Estimación de Ahorro en la Cuenta de Luz (Ley 20.571)
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Generado el {new Date().toLocaleDateString('es-CL')} • Modelo de Transferencia Radiativa CLIRAD-SW
            </p>
          </div>
          <div className="text-left sm:text-right">
            <Badge variant="outline" className="text-xs border-gray-300">
              Cliente: {clientName}
            </Badge>
            {clientRut && <p className="text-[11px] text-gray-500 mt-1">RUT: {clientRut}</p>}
          </div>
        </div>

        {/* 1. Introducción */}
        <div className="space-y-2 text-xs text-gray-600 leading-relaxed bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
          <h3 className="font-bold text-[#1F1F1F] uppercase tracking-wider text-[11px]">1. Introducción</h3>
          <p>
            Este reporte contiene un resumen de los resultados del análisis de prefactibilidad económica de un sistema fotovoltaico,
            obtenido con datos de radiación satelital y generación eléctrica basados en el modelo del <strong>Ministerio de Energía</strong>.
          </p>
          <ul className="list-disc pl-4 space-y-1 text-gray-500 text-[11px] mt-2">
            <li>El ahorro considera el valor del kWh de la distribuidora <strong>{distributorName}</strong> para tarifa <strong>{tariffType}</strong>.</li>
            <li>Se calculan los límites de ahorro considerando la inyección de excedentes y el autoconsumo diurno instantáneo.</li>
            <li>Estimación bajo Ley 20.571 de Generación Distribuida y Pliegos Técnicos SEC.</li>
          </ul>
        </div>

        {/* 2. Ubicación e Instalación */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-2">
            <h3 className="font-bold text-[#1F1F1F] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#FF8300]" /> 2. Ubicación del Sitio
            </h3>
            <div className="flex justify-between py-1 border-b border-gray-50"><span className="text-gray-500">Comuna:</span><strong>{comunaName}</strong></div>
            <div className="flex justify-between py-1 border-b border-gray-50"><span className="text-gray-500">Distribuidora Eléctrica:</span><strong>{distributorName}</strong></div>
            <div className="flex justify-between py-1"><span className="text-gray-500">Tarifa Regulada:</span><strong>{tariffType}</strong></div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-2">
            <h3 className="font-bold text-[#1F1F1F] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-[#FF8300]" /> 3. Arreglo Fotovoltaico
            </h3>
            <div className="flex justify-between py-1 border-b border-gray-50"><span className="text-gray-500">Potencia Instalada:</span><strong>{simInputs.installedCapacityKwp} kWp</strong></div>
            <div className="flex justify-between py-1 border-b border-gray-50"><span className="text-gray-500">Inclinación / Azimut:</span><strong>{simInputs.tiltDeg}° / {simInputs.azimuthDeg}°</strong></div>
            <div className="flex justify-between py-1"><span className="text-gray-500">Tipo de Montaje:</span><strong>{simInputs.isCoplanar ? 'Coplanar al Techo' : 'Estructura Inclinada'} ({simInputs.roofType})</strong></div>
          </div>
        </div>

        {/* 4. Cálculo de Ahorro y Rango Económico */}
        <div className="space-y-4">
          <h3 className="font-bold text-[#1F1F1F] uppercase tracking-wider text-xs">
            4. Cálculo del Ahorro Anual en Cuenta de Luz
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100">
              <span className="text-[10px] text-gray-500 uppercase font-bold block">Generación Anual</span>
              <span className="text-xl font-black text-[#1F1F1F] block mt-1">
                {simResults.annualGenerationKwh.toLocaleString('es-CL')} <span className="text-xs font-normal">kWh/año</span>
              </span>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Rendimiento: {simResults.specificYieldKwhKwp} kWh/kWp
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <span className="text-[10px] text-emerald-800 uppercase font-bold block">Ahorro Real Ponderado (Año 1)</span>
              <span className="text-xl font-black text-emerald-600 block mt-1">
                +\${realisticAnnualSavingsClp.toLocaleString('es-CL')}
              </span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">
                (65% Autoconsumo + 35% Inyección)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100">
              <span className="text-[10px] text-blue-800 uppercase font-bold block">Emisiones Evitadas</span>
              <span className="text-xl font-black text-blue-600 block mt-1">
                {simResults.co2AvoidedTonsPerYear} ton
              </span>
              <span className="text-[10px] text-blue-700 block mt-0.5">
                CO₂ equivalente / año
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 text-xs">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="p-3">Concepto</th>
                  <th className="p-3">Límite Inferior (100% Inyección)</th>
                  <th className="p-3 bg-orange-50/30 text-[#FF8300]">Estimado SoldeRío (Mixto)</th>
                  <th className="p-3">Límite Superior (100% Autoconsumo)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr>
                  <td className="p-3 font-semibold text-gray-700">Valor de Valorización (\$/kWh)</td>
                  <td className="p-3 text-gray-600">\${injectionRateClp} CLP</td>
                  <td className="p-3 font-bold text-gray-900 bg-orange-50/20">~\${Math.round(0.65 * consumptionRateClp + 0.35 * injectionRateClp)} CLP</td>
                  <td className="p-3 text-gray-600">\${consumptionRateClp} CLP</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-gray-700">Ahorro Anual Estimado (\$CLP)</td>
                  <td className="p-3 text-gray-600">+\${minAnnualSavingsClp.toLocaleString('es-CL')}</td>
                  <td className="p-3 font-black text-emerald-600 bg-orange-50/20">+\${realisticAnnualSavingsClp.toLocaleString('es-CL')}</td>
                  <td className="p-3 font-semibold text-emerald-600">+\${maxAnnualSavingsClp.toLocaleString('es-CL')}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-gray-700">Periodo de Retorno Simple</td>
                  <td className="p-3 text-gray-600">{simplePaybackMaxYears} Años</td>
                  <td className="p-3 font-black text-[#FF8300] bg-orange-50/20">{simplePaybackRealYears} Años</td>
                  <td className="p-3 text-gray-600">{simplePaybackMinYears} Años</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Evaluación Económica de Inversión */}
        <div className="space-y-3 bg-gray-50/70 p-4 rounded-2xl border border-gray-100 text-xs">
          <h3 className="font-bold text-[#1F1F1F] uppercase tracking-wider text-[11px]">5. Información de la Inversión</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div><span className="text-gray-400 block">Inversión Llave en Mano:</span><strong className="text-gray-900">\${capexClp.toLocaleString('es-CL')} CLP</strong></div>
            <div><span className="text-gray-400 block">Vida Útil Estimada:</span><strong className="text-gray-900">25 Años</strong></div>
            <div><span className="text-gray-400 block">Tasa de Descuento:</span><strong className="text-gray-900">6.0% Anual</strong></div>
            <div><span className="text-gray-400 block">Garantía Potencia:</span><strong className="text-emerald-600">25 Años al 80%</strong></div>
          </div>
        </div>
      </Card>
    </div>
  )
}
