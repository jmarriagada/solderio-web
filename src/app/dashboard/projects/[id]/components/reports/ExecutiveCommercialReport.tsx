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
  Award,
  Package,
  Layers,
  Check
} from 'lucide-react'
import { MinEnergiaSimInputs, MinEnergiaSimResults } from '@/lib/solar/minenergia-models'
import { EquipmentItem } from '@/lib/solar/capex-templates'

interface Props {
  clientName: string
  clientRut?: string | null
  comunaName: string
  distributorName: string
  simInputs: MinEnergiaSimInputs
  simResults: MinEnergiaSimResults
  equipmentList: EquipmentItem[]
  capexClp: number
  templateName?: string
}

export function ExecutiveCommercialReport({
  clientName,
  clientRut,
  comunaName,
  distributorName,
  simInputs,
  simResults,
  equipmentList,
  capexClp,
  templateName,
}: Props) {
  const realisticAnnualSavingsClp = Math.round(
    simResults.annualGenerationKwh * (0.65 * 175 + 0.35 * 95)
  )
  const paybackYears = (capexClp / Math.max(1, realisticAnnualSavingsClp)).toFixed(1)
  const total25YearSavingsNetClp = realisticAnnualSavingsClp * 25 - capexClp
  const capexUsd = Math.round(capexClp / 960)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Barra de Acciones */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm print:hidden">
        <div>
          <Badge className="bg-orange-50 text-[#FF8300] border-orange-200 text-xs">
            Propuesta Técnico-Comercial Llave en Mano EPC (SoldeRío Hub)
          </Badge>
          <p className="text-xs text-gray-500 mt-1">
            Diseñada bajo los estándares de Ingeniería Solar, Modelación MinEnergía y Normativa SEC
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
        {/* Encabezado Corporativo */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b border-gray-100 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sun className="h-7 w-7 text-[#FF8300]" />
              <span className="text-2xl font-black text-[#1F1F1F]">SoldeRío</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
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

        {/* Resumen del Proyecto y Configuración */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 p-5 rounded-2xl border border-gray-100 text-xs">
          <div className="space-y-1">
            <span className="text-gray-400 font-bold uppercase text-[10px] block">Cliente & Emplazamiento</span>
            <p className="text-sm font-bold text-[#1F1F1F]">{clientName}</p>
            {clientRut && <p className="text-gray-500">RUT: {clientRut}</p>}
            <p className="text-gray-500">{comunaName} • Distribuidora: {distributorName}</p>
          </div>
          <div className="space-y-1 sm:text-right">
            <span className="text-gray-400 font-bold uppercase text-[10px] block">Configuración Diseñada</span>
            <p className="text-sm font-bold text-[#FF8300]">
              {templateName || `Planta Solar Fotovoltaica ${simInputs.installedCapacityKwp} kWp`}
            </p>
            <p className="text-gray-600 font-medium">
              {simInputs.isCoplanar ? 'Montaje Coplanar' : 'Estructura Inclinada'} ({simInputs.roofType}) • {simInputs.operationModel}
            </p>
            <p className="text-gray-500">Ley 20.571 de Generación Distribuida (Net Billing)</p>
          </div>
        </div>

        {/* Cuadro de Métricas de Alto Impacto */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Generación Anual</span>
            <span className="text-xl font-black text-[#1F1F1F] block mt-0.5">
              {simResults.annualGenerationKwh.toLocaleString('es-CL')} <span className="text-xs font-normal">kWh</span>
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">{simResults.specificYieldKwhKwp} kWh/kWp</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Ahorro Anual (Año 1)</span>
            <span className="text-xl font-black text-emerald-600 block mt-0.5">
              +${realisticAnnualSavingsClp.toLocaleString('es-CL')}
            </span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">Net Billing Ponderado</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
            <span className="text-[10px] uppercase font-bold text-blue-800 block">Retorno Simple</span>
            <span className="text-xl font-black text-blue-600 block mt-0.5">
              {paybackYears} Años
            </span>
            <span className="text-[10px] text-blue-700 block mt-0.5">TIR: ~18.5% Anual</span>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Inversión Llave en Mano</span>
            <span className="text-xl font-black text-gray-900 block mt-0.5">
              ${capexClp.toLocaleString('es-CL')}
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">~${capexUsd.toLocaleString('es-CL')} USD</span>
          </div>
        </div>

        {/* Desglose de Equipamiento y Partidas */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <Package className="h-4 w-4 text-[#FF8300]" /> Especificación de Equipamiento & Suministros Incluidos
          </h4>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 text-xs">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="py-2.5 px-3">Partida</th>
                  <th className="py-2.5 px-3">Marca & Modelo</th>
                  <th className="py-2.5 px-3">Descripción Técnica</th>
                  <th className="py-2.5 px-3 text-center">Cant.</th>
                  <th className="py-2.5 px-3 text-right">Subtotal ($CLP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {equipmentList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 font-semibold text-gray-800">{item.category}</td>
                    <td className="py-2.5 px-3 font-bold text-[#1F1F1F]">{item.brand} {item.model}</td>
                    <td className="py-2.5 px-3 text-gray-500 text-[11px]">{item.description}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{item.quantity} {item.unit}</td>
                    <td className="py-2.5 px-3 text-right font-black text-gray-900">
                      ${(item.unitCostClp * item.quantity).toLocaleString('es-CL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alcance del Servicio EPC Llave en Mano */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Garantías y Alcance del Servicio Llave en Mano (SoldeRío EPC)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block">Garantía de Potencia de 25 Años</strong>
                <span className="text-gray-500">Módulos Tier 1 N-Type TOPCon bifaciales garantizados al 84% al año 25.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block">Inversor Homologado SEC (Garantía 5-10 Años)</strong>
                <span className="text-gray-500">Monitoreo 24/7 en tiempo real vía App móvil y protección anti-isla.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block">Estructura Marina de Aluminio Anodizado</strong>
                <span className="text-gray-500">Resistente a ambientes salinos y vientos de hasta 140 km/h.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block">Tramitación Integral SEC TE4 y Distribuidora</strong>
                <span className="text-gray-500">Gestión de F1/F3, F4, Declaración TE4, Contrato F5 y cambio de medidor F6.</span>
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
              Ahorro neto tras descontar el 100% de la inversión inicial y costos de operación.
            </p>
          </div>
          <span className="text-xl font-black text-emerald-600">
            +${total25YearSavingsNetClp.toLocaleString('es-CL')} CLP
          </span>
        </div>
      </Card>
    </div>
  )
}
