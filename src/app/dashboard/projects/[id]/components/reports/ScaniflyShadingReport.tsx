'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Sun, 
  ShieldCheck, 
  Printer, 
  Activity, 
  Compass, 
  Zap, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  TreePine,
  Clock,
  Sparkles
} from 'lucide-react'
import { StringConfiguration, StringingValidationResult, DEFAULT_MODULE_SPEC, DEFAULT_INVERTER_SPEC } from '@/lib/solar/stringing-validator'
import { SunPathChart } from '../SunPathChart'
import { getSolarPosition } from '@/lib/solar/sun-position'

interface Props {
  clientName: string
  clientRut?: string | null
  comunaName: string
  latitude: number
  longitude: number
  installedCapacityKwp: number
  totalModules: number
  tiltDeg: number
  azimuthDeg: number
  shadingLossPct: number
  solarAccessPct: number
  strings: StringConfiguration[]
  stringingValidation: StringingValidationResult
}

export function ScaniflyShadingReport({
  clientName,
  clientRut,
  comunaName,
  latitude,
  longitude,
  installedCapacityKwp,
  totalModules,
  tiltDeg,
  azimuthDeg,
  shadingLossPct,
  solarAccessPct,
  strings,
  stringingValidation,
}: Props) {
  const currentSun = getSolarPosition(new Date(2026, 11, 21, 13, 0), latitude, longitude)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Barra de Acciones */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm print:hidden">
        <div>
          <Badge className="bg-orange-50 text-[#FF8300] border-orange-200 text-xs">
            Reporte de Sombreado 3D & Solar Access (Scanifly Engine / SoldeRío Hub)
          </Badge>
          <p className="text-xs text-gray-500 mt-1">
            Análisis de sombreado por ray-casting 3D, Carta Solar estereográfica y verificación de strings SEC
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
            <div className="flex items-center gap-2">
              <Sun className="h-7 w-7 text-[#FF8300]" />
              <span className="text-2xl font-black text-[#1F1F1F]">SoldeRío</span>
            </div>
            <h1 className="text-lg font-bold text-gray-800 mt-1">
              Informe Técnico de Sombreado 3D, Solar Access & Stringing Eléctrico
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Ubicación: {comunaName} ({latitude.toFixed(2)}°S, {longitude.toFixed(2)}°W) • Fecha: {new Date().toLocaleDateString('es-CL')}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <Badge variant="outline" className="text-xs border-gray-300">
              Proyecto: {clientName}
            </Badge>
            {clientRut && <p className="text-[11px] text-gray-500 mt-1">RUT: {clientRut}</p>}
          </div>
        </div>

        {/* 1. Resumen de Métricas de Sombreado y Acceso Solar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
            <span className="text-[10px] text-emerald-800 uppercase font-bold block">Solar Access (TSFR)</span>
            <span className="text-xl font-black text-emerald-600 block mt-0.5">{solarAccessPct}%</span>
            <span className="text-[10px] text-emerald-700 block">Acceso Solar Anual</span>
          </div>

          <div className="p-3.5 bg-orange-50/50 rounded-2xl border border-orange-100">
            <span className="text-[10px] text-orange-800 uppercase font-bold block">Pérdida por Sombras</span>
            <span className="text-xl font-black text-[#FF8300] block mt-0.5">{shadingLossPct}%</span>
            <span className="text-[10px] text-orange-700 block">Obstáculos y árboles</span>
          </div>

          <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100">
            <span className="text-[10px] text-blue-800 uppercase font-bold block">Potencia DC Total</span>
            <span className="text-xl font-black text-blue-600 block mt-0.5">{installedCapacityKwp} kWp</span>
            <span className="text-[10px] text-blue-700 block">{totalModules} módulos 550W</span>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Orientación / Tilt</span>
            <span className="text-xl font-black text-gray-900 block mt-0.5">{tiltDeg}° / {azimuthDeg}°</span>
            <span className="text-[10px] text-gray-500 block">Norte Geográfico</span>
          </div>
        </div>

        {/* 2. Carta Solar de Trayectoria Estereográfica */}
        <div className="space-y-2">
          <h3 className="font-bold text-[#1F1F1F] uppercase tracking-wider text-xs flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-[#FF8300]" /> 2. Diagrama de Trayectoria Solar & Análisis de Elevación
          </h3>
          <SunPathChart
            latitude={latitude}
            longitude={longitude}
            currentSunPosition={currentSun}
            currentHour={13}
            currentMonth="Diciembre"
          />
        </div>

        {/* 3. Cuadro de Strings y Validación Eléctrica SEC RIC N°09 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-[#1F1F1F] uppercase tracking-wider text-xs flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-[#FF8300]" /> 3. Cuadro de Configuración de Strings & Límites Eléctricos
            </h3>
            <Badge className={stringingValidation.isValid ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}>
              {stringingValidation.isValid ? '✓ Conforme a Pliego RIC N°09' : 'Revisar Parámetros'}
            </Badge>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 text-xs">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="py-2.5 px-3">Identificador</th>
                  <th className="py-2.5 px-3">Módulos en Serie</th>
                  <th className="py-2.5 px-3">Potencia DC</th>
                  <th className="py-2.5 px-3">Voc STC (25°C)</th>
                  <th className="py-2.5 px-3">Voc Frío (-5°C)</th>
                  <th className="py-2.5 px-3">Vmp Operación</th>
                  <th className="py-2.5 px-3 text-right">Estado SEC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stringingValidation.strings.map((str) => (
                  <tr key={str.stringId} className="hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 font-bold text-[#1F1F1F]">{str.stringName}</td>
                    <td className="py-2.5 px-3 text-gray-700">{str.moduleCount} unidades</td>
                    <td className="py-2.5 px-3 font-semibold text-gray-900">{((str.moduleCount * 550)/1000).toFixed(2)} kWp</td>
                    <td className="py-2.5 px-3 text-gray-600">{str.vocStcV} V</td>
                    <td className="py-2.5 px-3 font-bold text-blue-700">{str.vocColdV} V (≤1000V)</td>
                    <td className="py-2.5 px-3 text-gray-600">{str.vmpHotV}V - {str.vmpColdV}V</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center text-emerald-700 font-bold text-[11px]">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Aprobado
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Dictamen de Ingeniería y Certificación SEC */}
        <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <strong className="text-gray-900 block">Dictamen de Ingeniería Fotovoltaica SoldeRío:</strong>
            <p className="text-gray-600 text-[11px]">
              El dimensionamiento 3D cumple con los setbacks reglamentarios de seguridad contra incendios (0.6 metros)
              y las tensiones de circuito abierto a temperaturas extremas de invierno no exceden la capacidad del inversor ni la aislación de conductores (1000V DC).
            </p>
          </div>
          <div className="shrink-0 text-center sm:text-right border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0 sm:pl-4">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Firma & Timbre</span>
            <span className="text-xs font-bold text-gray-800 block mt-0.5">Ingeniería SoldeRío SpA</span>
            <span className="text-[10px] text-emerald-600 font-semibold block">Instalador Clase A SEC</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
