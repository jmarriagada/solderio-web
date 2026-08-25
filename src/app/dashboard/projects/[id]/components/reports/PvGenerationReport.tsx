'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Sun, 
  CloudSun, 
  Thermometer, 
  Compass, 
  Printer, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Wind,
  Percent,
  Zap
} from 'lucide-react'
import { MinEnergiaSimInputs, MinEnergiaSimResults } from '@/lib/solar/minenergia-models'

interface Props {
  clientName: string
  comunaName: string
  simInputs: MinEnergiaSimInputs
  simResults: MinEnergiaSimResults
}

export function PvGenerationReport({
  clientName,
  comunaName,
  simInputs,
  simResults,
}: Props) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Barra de Acciones */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm print:hidden">
        <div>
          <Badge className="bg-orange-50 text-[#FF8300] border-orange-200 text-xs">
            Formato Reporte Generación Fotovoltaica Explorador Solar (MinEnergía / DGF U.Chile)
          </Badge>
          <p className="text-xs text-gray-500 mt-1">
            Modelación Física de Transferencia Radiativa & Rendimiento Energético (1 km GeoTIFF)
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
            <span className="text-xl font-black text-[#1F1F1F] block">SoldeRío Hub</span>
            <h1 className="text-lg font-bold text-gray-800 mt-0.5">
              Reporte de Generación Eléctrica Fotovoltaica y Datos Meteorológicos
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {comunaName}, Chile • Modelo Radiativo CLIRAD-SW + GOES Satelital • Fecha: {new Date().toLocaleDateString('es-CL')}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <Badge variant="outline" className="text-xs border-gray-300">
              Proyecto: {clientName}
            </Badge>
          </div>
        </div>

        {/* 1. Resumen Técnico del Sistema */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Capacidad Instalada</span>
            <span className="text-lg font-black text-[#1F1F1F] block mt-0.5">{simInputs.installedCapacityKwp} kWp</span>
            <span className="text-[10px] text-gray-500 block">Potencia DC (STC)</span>
          </div>

          <div className="p-3.5 bg-orange-50/50 rounded-2xl border border-orange-100">
            <span className="text-[10px] text-orange-800 uppercase font-bold block">Generación Anual</span>
            <span className="text-lg font-black text-[#FF8300] block mt-0.5">
              {simResults.annualGenerationKwh.toLocaleString('es-CL')}
            </span>
            <span className="text-[10px] text-orange-700 block">kWh / año</span>
          </div>

          <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
            <span className="text-[10px] text-emerald-800 uppercase font-bold block">Rendimiento Específico</span>
            <span className="text-lg font-black text-emerald-600 block mt-0.5">
              {simResults.specificYieldKwhKwp}
            </span>
            <span className="text-[10px] text-emerald-700 block">kWh / kWp / año</span>
          </div>

          <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100">
            <span className="text-[10px] text-blue-800 uppercase font-bold block">Factor de Planta (CF)</span>
            <span className="text-lg font-black text-blue-600 block mt-0.5">
              {simResults.capacityFactorPct}%
            </span>
            <span className="text-[10px] text-blue-700 block">PR: {simResults.performanceRatioPct}%</span>
          </div>
        </div>

        {/* 2. Parámetros de Operación y Modelo Físico */}
        <div className="space-y-3 bg-gray-50/60 p-5 rounded-2xl border border-gray-100 text-xs">
          <h3 className="font-bold text-[#1F1F1F] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-[#FF8300]" /> Configuración de la Instalación & Pérdidas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-xl border border-gray-100">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Modelo de Simulación</span>
              <strong className="text-gray-900 block mt-0.5">
                {simInputs.operationModel === 'BIFACIAL' ? 'Bifacial (Frontal + Albedo)' :
                 simInputs.operationModel === 'ADVANCED_SANDIA' ? 'Avanzado Sandia (King 2004)' :
                 simInputs.operationModel === 'FLOATING' ? 'Flotante FPV (Cooling Water)' : 'Básico NREL PVWatts'}
              </strong>
            </div>

            <div className="bg-white p-3 rounded-xl border border-gray-100">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Tipo de Arreglo & Montaje</span>
              <strong className="text-gray-900 block mt-0.5">
                {simInputs.trackingType === 'HSAT' ? 'Seguimiento 1-Eje (HSAT)' : 'Fijo Inclinado'} ({simInputs.tiltDeg}° Tilt, {simInputs.azimuthDeg}° Azimut)
              </strong>
            </div>

            <div className="bg-white p-3 rounded-xl border border-gray-100">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Coeficiente Temperatura Panel</span>
              <strong className="text-gray-900 block mt-0.5">{simInputs.tempCoefficientPctPerC}% / °C</strong>
            </div>

            <div className="bg-white p-3 rounded-xl border border-gray-100">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Eficiencia Inversor</span>
              <strong className="text-gray-900 block mt-0.5">{simInputs.inverterEfficiencyPct}%</strong>
            </div>

            <div className="bg-white p-3 rounded-xl border border-gray-100">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Pérdidas del Sistema</span>
              <strong className="text-gray-900 block mt-0.5">{simInputs.systemLossesPct}% (Soiling + Cableado)</strong>
            </div>

            <div className="bg-white p-3 rounded-xl border border-gray-100">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Pérdidas por Mismatch</span>
              <strong className="text-gray-900 block mt-0.5">{simInputs.mismatchLossesPct}%</strong>
            </div>
          </div>
        </div>

        {/* 3. Desglose Mensual de Radiación y Generación */}
        <div className="space-y-3">
          <h3 className="font-bold text-[#1F1F1F] uppercase tracking-wider text-xs flex items-center justify-between">
            <span>3. Generación Mensual & Radiación Incidente (12 Meses)</span>
            <span className="text-[11px] font-normal text-gray-500">Resolución 1 km MinEnergía</span>
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 text-xs">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="p-2.5">Mes</th>
                  <th className="p-2.5">GHI Horiz. (kWh/m²)</th>
                  <th className="p-2.5">POA Inclinado (kWh/m²)</th>
                  <th className="p-2.5">HSP Diario (h)</th>
                  <th className="p-2.5">Temp. Media (°C)</th>
                  <th className="p-2.5 text-right pr-4 font-bold text-[#1F1F1F]">Generación (kWh)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {simResults.monthlyGenerationKwh.map((m) => (
                  <tr key={m.month} className="hover:bg-gray-50/50">
                    <td className="p-2.5 font-bold text-[#1F1F1F]">{m.month}</td>
                    <td className="p-2.5 text-gray-600">{m.ghiKwhM2}</td>
                    <td className="p-2.5 text-gray-600">{m.poaKwhM2}</td>
                    <td className="p-2.5 font-medium text-[#FF8300]">{m.hspDaily} h</td>
                    <td className="p-2.5 text-gray-600">{m.tempAvgC} °C</td>
                    <td className="p-2.5 text-right pr-4 font-black text-emerald-600">
                      {m.generationKwh.toLocaleString('es-CL')} kWh
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  )
}
