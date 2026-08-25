'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Sparkles, 
  Layers, 
  Battery, 
  Sun, 
  Wrench, 
  ShieldCheck, 
  DollarSign, 
  Plus, 
  Trash2,
  Check,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react'
import { 
  CapexTemplate, 
  EquipmentItem, 
  PRECONFIGURED_CAPEX_TEMPLATES, 
  calculateTotalCapex 
} from '@/lib/solar/capex-templates'

interface Props {
  initialPvKwp: number
  roofType: string
  isCoplanar: boolean
  onEquipmentChange: (items: EquipmentItem[], totalCapexClp: number, templateName?: string) => void
}

export function EquipmentCapexTab({
  initialPvKwp,
  roofType,
  isCoplanar,
  onEquipmentChange,
}: Props) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('TEMPLATE_RES_HYBRID_4KWP_14KWH')
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>(() => {
    return PRECONFIGURED_CAPEX_TEMPLATES[0].items
  })

  const { totalClp, totalUsd, usdExchangeRate } = calculateTotalCapex(equipmentList)

  const handleApplyTemplate = (template: CapexTemplate) => {
    setSelectedTemplateId(template.id)
    setEquipmentList([...template.items])
    const calculated = calculateTotalCapex(template.items)
    onEquipmentChange(template.items, calculated.totalClp, template.name)
  }

  const handleQuantityChange = (itemId: string, qty: number) => {
    const updated = equipmentList.map((it) => (it.id === itemId ? { ...it, quantity: Math.max(0, qty) } : it))
    setEquipmentList(updated)
    const calculated = calculateTotalCapex(updated)
    onEquipmentChange(updated, calculated.totalClp)
  }

  const handleUnitCostChange = (itemId: string, cost: number) => {
    const updated = equipmentList.map((it) => (it.id === itemId ? { ...it, unitCostClp: Math.max(0, cost) } : it))
    setEquipmentList(updated)
    const calculated = calculateTotalCapex(updated)
    onEquipmentChange(updated, calculated.totalClp)
  }

  const handleRemoveItem = (itemId: string) => {
    const updated = equipmentList.filter((it) => it.id !== itemId)
    setEquipmentList(updated)
    const calculated = calculateTotalCapex(updated)
    onEquipmentChange(updated, calculated.totalClp)
  }

  const handleAddCustomItem = () => {
    const newItem: EquipmentItem = {
      id: `CUSTOM_${Date.now()}`,
      category: 'BOS_ELECTRICAL',
      brand: 'Genérico',
      model: 'Partida Personalizada',
      description: 'Material o servicio complementario',
      unitCostClp: 150000,
      quantity: 1,
      unit: 'unidad',
    }
    const updated = [...equipmentList, newItem]
    setEquipmentList(updated)
    const calculated = calculateTotalCapex(updated)
    onEquipmentChange(updated, calculated.totalClp)
  }

  return (
    <div className="space-y-6">
      {/* 1. Selector de Templates Preconfiguradas */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-[#FF8300]" /> Plantillas Preconfiguradas SoldeRío (Recomendadas)
          </Label>
          <span className="text-xs text-gray-500">Selecciona una base para autocompletar el equipamiento</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRECONFIGURED_CAPEX_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplateId === tmpl.id
            const tmplCapex = calculateTotalCapex(tmpl.items)

            return (
              <div
                key={tmpl.id}
                onClick={() => handleApplyTemplate(tmpl)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#FF8300] bg-orange-50/40 shadow-sm ring-1 ring-[#FF8300]'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-[#1F1F1F] block">{tmpl.name}</span>
                    {isSelected ? (
                      <Badge className="bg-[#FF8300] text-white text-[9px] h-4 font-bold">Activa</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[9px] text-gray-500">
                        {tmpl.category}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{tmpl.tagline}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 flex justify-between items-center text-xs">
                  <span className="text-[10px] text-gray-400">
                    PV: {tmpl.pvKwp} kWp • {tmpl.batteryKwh > 0 ? `Batería: ${tmpl.batteryKwh} kWh` : 'On-Grid'}
                  </span>
                  <strong className="text-emerald-700 font-black">
                    ${tmplCapex.totalClp.toLocaleString('es-CL')} CLP
                  </strong>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. Tabla Detallada de Equipamiento & Partidas CAPEX */}
      <Card className="rounded-[24px] border-gray-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="pb-3 border-b border-gray-50">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-[#FF8300]" />
              <div>
                <CardTitle className="text-base font-bold text-[#1F1F1F]">
                  Desglose de Partidas, Equipamiento & Servicios (CAPEX Llave en Mano)
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Edita cantidades, precios unitarios o agrega partidas a medida
                </CardDescription>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleAddCustomItem}
              className="rounded-xl text-xs border-gray-200 text-gray-700 h-8"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Agregar Partida
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="py-2.5 px-4">Categoría</th>
                  <th className="py-2.5 px-4">Descripción del Equipo / Servicio</th>
                  <th className="py-2.5 px-3 text-center">Cant.</th>
                  <th className="py-2.5 px-3">Precio Unitario ($CLP)</th>
                  <th className="py-2.5 px-4 text-right">Subtotal ($CLP)</th>
                  <th className="py-2.5 px-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {equipmentList.map((item) => {
                  const subtotal = item.unitCostClp * item.quantity

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-2.5 px-4">
                        <Badge
                          variant="secondary"
                          className="text-[9px] font-normal uppercase bg-gray-100 text-gray-700"
                        >
                          {item.category}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-4">
                        <strong className="text-gray-900 block">{item.brand} - {item.model}</strong>
                        <span className="text-[10px] text-gray-400 block">{item.description}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center w-20">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          className="h-7 text-xs text-center font-bold bg-white rounded-lg"
                        />
                      </td>
                      <td className="py-2.5 px-3 w-36">
                        <Input
                          type="number"
                          step="10000"
                          value={item.unitCostClp}
                          onChange={(e) => handleUnitCostChange(item.id, parseInt(e.target.value) || 0)}
                          className="h-7 text-xs font-semibold bg-white rounded-lg"
                        />
                      </td>
                      <td className="py-2.5 px-4 text-right font-black text-gray-900">
                        ${subtotal.toLocaleString('es-CL')}
                      </td>
                      <td className="py-2.5 px-3 text-center w-12">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>

        {/* Resumen Total de Inversión */}
        <CardFooter className="bg-gray-50/70 p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-xs text-gray-500">
            * Tipo de cambio referencia: <strong>${usdExchangeRate} CLP / USD</strong> • Incluye suministro, montaje y TE4
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Inversión CAPEX</span>
              <span className="text-xl font-black text-emerald-600 block">
                ${totalClp.toLocaleString('es-CL')} <span className="text-xs font-normal text-gray-500">CLP</span>
              </span>
            </div>
            <div className="border-l border-gray-200 pl-4">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">En Dólares</span>
              <span className="text-base font-black text-gray-800 block">
                ${totalUsd.toLocaleString('es-CL')} <span className="text-[10px] font-normal text-gray-500">USD</span>
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
