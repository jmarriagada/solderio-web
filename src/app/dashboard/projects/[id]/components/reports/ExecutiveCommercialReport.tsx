'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Sun, 
  Zap, 
  CheckCircle2, 
  Printer, 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  FileText,
  Sparkles,
  Calendar,
  Building,
  Award
} from 'lucide-react'
import { MinEnergiaSimInputs, MinEnergiaSimResults } from '@/lib/solar/minenergia-models'

interface Props {
  clientName: string
  clientRut?: string | null
  comunaName: string
  distributorName: string
  simInputs: MinEnergiaSimInputs
  simResults: MinEnergiaSimResults
  capexClp: number
}

export function ExecutiveCommercialReport({
  clientName,
  clientRut,
  comunaName,
  distributorName,
  simInputs,
  simResults,
  capexClp,
}: Props) {
  const realisticAnnualSavingsClp = Math.round(
    simResults.annualGenerationKwh * (0.65 * 175 + 0.35 * 95)
  )
  const paybackYears = (capexClp / Math.max(1, realisticAnnualSavingsClp)).toFixed(1)
  const total25YearSavingsNetClp = realisticAnnualSavingsClp * 25 - capexClp

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Barra de Acciones */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm print:hidden">
        <div>
          <Badge className="bg-orange-50 text-[#FF8300] border-orange-200 text-xs">
            Propuesta Técnico-Comercial Llave en Mano (EPC SoldeRío)
          </Badge>
          <p className="text-xs text-gray-500 mt-1">
            Resumen Ejecutivo Combinado para Cierre Comercial y Evaluación Directiva
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
            <p className="text-xs text-gray-400 mt-1">
              Ingeniería, Suministro y Construcción Fotovoltaica • Especialistas en Zona Sur
            </p>
          </div>
          <div className="text-left sm:text-right">
            <Badge className="bg-orange-50 text-[#FF8300] border-orange-200 text-xs font-bold mb-1">
              PROPUESTA TÉCNICO-COMERCIAL
            </Badge>
            <p className="text-xs text-gray-500">Fecha de Emisión: {new Date().toLocaleDateString('es-CL')}</p>
          </div>
        </div>

        {/* Datos Cliente & Alcance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 p-5 rounded-2xl border border-gray-100 text-xs">
          <div className="space-y-1">
            <span className="text-gray-400 font-bold uppercase text-[10px] block">Cliente & Ubicación</span>
            <p className="text-sm font-bold text-[#1F1F1F]">{clientName}</p>
            {clientRut && <p className="text-gray-500">RUT: {clientRut}</p>}
            <p className="text-gray-500">{comunaName} • Distribuidora: {distributorName}</p>
          </div>
          <div className="space-y-1 sm:text-right">
            <span className="text-gray-400 font-bold uppercase text-[10px] block">Solución Diseñada</span>
            <p className="text-sm font-bold text-[#FF8300]">
              Planta Solar Fotovoltaica {simInputs.installedCapacityKwp} kWp
            </p>
            <p className="text-gray-600 font-medium">
              {simInputs.isCoplanar ? 'Coplanar' : 'Estructura Inclinada'} ({simInputs.roofType}) • {simInputs.operationModel}
            </p>
            <p className="text-gray-500">Ley 20.571 de Generación Distribuida (Net Billing)</p>
          </div>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Generación Anual</span>
            <span className="text-xl font-black text-[#1F1F1F] block mt-0.5">
              {simResults.annualGenerationKwh.toLocaleString('es-CL')} <span className="text-xs font-normal">kWh</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Ahorro Anual (Año 1)</span>
            <span className="text-xl font-black text-emerald-600 block mt-0.5">
              +\${realisticAnnualSavingsClp.toLocaleString('es-CL')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Retorno Simple</span>
            <span className="text-xl font-black text-blue-600 block mt-0.5">
              {paybackYears} Años
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Inversión EPC Total</span>
            <span className="text-xl font-black text-gray-900 block mt-0.5">
              \${capexClp.toLocaleString('es-CL')}
            </span>
          </div>
        </div>

        {/* Alcance EPC y Garantías */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Alcance del Servicio Llave en Mano (EPC SoldeRío)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block">Módulos Solares Tier 1 Bifaciales N-Type</strong>
                <span className="text-gray-500">Garantía de potencia de 25 años al 84% de rendimiento.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block">Inversores Homologados SEC</strong>
                <span className="text-gray-500">Eficiencia 98%, monitoreo WiFi y función anti-isla certificada.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block">Estructura de Montaje Marina</strong>
                <span className="text-gray-500">Aluminio anodizado y fijaciones en acero inoxidable A2/A4.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block">Tramitación Integral SEC (TE4) y Distribuidora</strong>
                <span className="text-gray-500">F1/F3, F4, Declaración TE4 SEC, Contrato F5 y cambio de medidor F6.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen Financiero a 25 Años */}
        <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-bold text-emerald-800 text-sm block">
              Ganancia Neta Libre de Energía (25 Años)
            </span>
            <p className="text-emerald-700 mt-0.5 text-[11px]">
              Ahorro neto tras descontar el 100% de la inversión y mantenimiento.
            </p>
          </div>
          <span className="text-xl font-black text-emerald-600">
            +\${total25YearSavingsNetClp.toLocaleString('es-CL')} CLP
          </span>
        </div>
      </Card>
    </div>
  )
}
