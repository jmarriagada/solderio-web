'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Download, 
  Printer, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Sun, 
  Zap, 
  TrendingUp, 
  Building,
  UserCheck
} from 'lucide-react'
import { SizingScenarioResult } from '@/lib/solar/solar-types'

interface Props {
  clientName: string
  clientRut?: string | null
  comunaName: string
  distributorName: string
  scenario: SizingScenarioResult
  annualConsumptionKwh: number
}

export function ProjectReportsTab({
  clientName,
  clientRut,
  comunaName,
  distributorName,
  scenario,
  annualConsumptionKwh,
}: Props) {
  const [activeReport, setActiveReport] = useState<'COMMERCIAL' | 'ENGINEERING_SEC'>('COMMERCIAL')

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Selector de Reporte & Botones de Acción */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setActiveReport('COMMERCIAL')}
            className={`rounded-xl text-xs font-semibold cursor-pointer ${
              activeReport === 'COMMERCIAL'
                ? 'bg-[#FF8300] hover:bg-[#E67600] text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Propuesta Comercial Ejecutiva
          </Button>

          <Button
            size="sm"
            onClick={() => setActiveReport('ENGINEERING_SEC')}
            className={`rounded-xl text-xs font-semibold cursor-pointer ${
              activeReport === 'ENGINEERING_SEC'
                ? 'bg-[#FF8300] hover:bg-[#E67600] text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
            Memoria Técnica & Ficha TE4 SEC
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="rounded-xl border-gray-200 text-xs font-medium text-gray-700"
          >
            <Printer className="h-3.5 w-3.5 mr-1.5" />
            Imprimir / Guardar PDF
          </Button>
        </div>
      </div>

      {/* Vista de Reporte 1: Propuesta Comercial Ejecutiva */}
      {activeReport === 'COMMERCIAL' && (
        <Card className="rounded-[24px] border-gray-100 shadow-md bg-white p-8 space-y-8 max-w-4xl mx-auto print:shadow-none print:border-0 print:p-0">
          {/* Header de Propuesta */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-gray-100 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sun className="h-6 w-6 text-[#FF8300]" />
                <span className="text-xl font-black text-[#1F1F1F]">SoldeRío</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Ingeniería & Soluciones Fotovoltaicas • Zona Sur</p>
            </div>
            <div className="text-left sm:text-right">
              <Badge className="bg-orange-50 text-[#FF8300] border-orange-200 text-xs font-bold mb-1">
                PROPUESTA TÉCNICO-COMERCIAL
              </Badge>
              <p className="text-xs text-gray-500">Fecha: {new Date().toLocaleDateString('es-CL')}</p>
            </div>
          </div>

          {/* Datos del Cliente y Proyecto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 p-5 rounded-2xl border border-gray-100 text-xs">
            <div className="space-y-1">
              <span className="text-gray-400 font-bold uppercase text-[10px] block">Cliente</span>
              <p className="text-sm font-bold text-[#1F1F1F]">{clientName}</p>
              {clientRut && <p className="text-gray-500">RUT: {clientRut}</p>}
              <p className="text-gray-500">Ubicación: {comunaName} • Distribuidora: {distributorName}</p>
            </div>
            <div className="space-y-1 sm:text-right">
              <span className="text-gray-400 font-bold uppercase text-[10px] block">Solución Diseñada</span>
              <p className="text-sm font-bold text-[#FF8300]">{scenario.title}</p>
              <p className="text-gray-600 font-semibold">{scenario.kwp} kWp ({scenario.numPanels} Paneles Bifaciales Tier 1)</p>
              <p className="text-gray-500">Ley 20.571 de Generación Distribuida (Net Billing)</p>
            </div>
          </div>

          {/* Cuadro de Métricas de Alto Impacto */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Generación Anual</span>
              <span className="text-lg font-black text-[#1F1F1F] block mt-0.5">
                {scenario.annualGenerationKwh.toLocaleString('es-CL')} <span className="text-xs font-normal">kWh</span>
              </span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Ahorro Anual (Año 1)</span>
              <span className="text-lg font-black text-emerald-600 block mt-0.5">
                +\${scenario.totalAnnualSavingsClp.toLocaleString('es-CL')}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Retorno Estimado</span>
              <span className="text-lg font-black text-blue-600 block mt-0.5">
                {scenario.simplePaybackYears} Años
              </span>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Inversión Llave en Mano</span>
              <span className="text-lg font-black text-gray-900 block mt-0.5">
                \${scenario.capexClp.toLocaleString('es-CL')}
              </span>
            </div>
          </div>

          {/* Alcance EPC Llave en Mano */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Alcance del Servicio Llave en Mano (EPC SoldeRío)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{scenario.numPanels}x Módulos Tier 1 {scenario.moduleSpec.powerW}W Bifaciales (Garantía 25 años)</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>1x Inversor {scenario.inverterSpec.brand} {scenario.inverterSpec.nominalPowerKw}kW Homologado SEC</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Estructura de montaje en aluminio anodizado e inoxidable calidad marina</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Tramitación TE4 oficial ante SEC y contrato de inyección ante {distributorName}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Vista de Reporte 2: Memoria Técnica & Ficha TE4 SEC */}
      {activeReport === 'ENGINEERING_SEC' && (
        <Card className="rounded-[24px] border-gray-100 shadow-md bg-white p-8 space-y-6 max-w-4xl mx-auto print:shadow-none print:border-0 print:p-0">
          <div className="flex justify-between items-start border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span className="text-base font-bold text-[#1F1F1F]">Ficha Técnica de Declaración SEC (Trámite TE4)</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Pliegos Técnicos RPTD / RIC N°01 a N°19 • Ley 20.571</p>
            </div>
            <Badge variant="outline" className="text-xs border-emerald-200 bg-emerald-50 text-emerald-700">
              Formato e-Declarador SEC
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-gray-50 rounded-xl space-y-2">
              <span className="font-bold text-gray-800 block text-xs border-b pb-1">1. Parámetros del Generador FV</span>
              <div className="flex justify-between"><span className="text-gray-500">Potencia Pico Total DC:</span><strong className="text-gray-900">{scenario.kwp} kWp</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Potencia Nominal AC:</span><strong className="text-gray-900">{scenario.inverterSpec.nominalPowerKw} kW</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Número de Módulos:</span><strong className="text-gray-900">{scenario.numPanels} unidades</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Marca/Modelo Módulos:</span><strong className="text-gray-900">{scenario.moduleSpec.brand} {scenario.moduleSpec.powerW}W</strong></div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-2">
              <span className="font-bold text-gray-800 block text-xs border-b pb-1">2. Inversor & Interconexión</span>
              <div className="flex justify-between"><span className="text-gray-500">Marca/Modelo Inversor:</span><strong className="text-gray-900">{scenario.inverterSpec.brand} {scenario.inverterSpec.model}</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Función Anti-Isla:</span><strong className="text-emerald-600">Activa y Homologada SEC</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Tipo de Fase:</span><strong className="text-gray-900">{scenario.inverterSpec.phase === 'MONO' ? 'Monofásico 220V' : 'Trifásico 380V'}</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Distribuidora Conexión:</span><strong className="text-gray-900">{distributorName}</strong></div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-2">
              <span className="font-bold text-gray-800 block text-xs border-b pb-1">3. Criterios de Caída de Tensión</span>
              <div className="flex justify-between"><span className="text-gray-500">Caída Tensión DC Máxima:</span><strong className="text-emerald-600">&lt; 1.5% (Cumple RIC N°09)</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Caída Tensión AC Máxima:</span><strong className="text-emerald-600">&lt; 3.0% (Cumple RIC N°03)</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Resistencia Malla PAT:</span><strong className="text-gray-900">&le; 20 Ohms</strong></div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-2">
              <span className="font-bold text-gray-800 block text-xs border-b pb-1">4. Protecciones Eléctricas</span>
              <div className="flex justify-between"><span className="text-gray-500">Descargador Sobretensión:</span><strong className="text-gray-900">DPS Tipo II 1000V DC / 275V AC</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Protección Diferencial:</span><strong className="text-gray-900">Diferencial Superinmunizado Tipo A/B</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Interruptor Corte AC:</span><strong className="text-gray-900">Termomagnético Curva C</strong></div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
