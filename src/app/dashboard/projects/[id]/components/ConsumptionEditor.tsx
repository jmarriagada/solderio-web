'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Save, Loader2, CheckCircle2, TrendingUp, Sparkles, RefreshCw } from 'lucide-react'
import { updateProjectConsumptionAction } from '@/app/dashboard/project-actions'

interface MonthlyItem {
  month: string
  kwh: number
  costClp: number
}

interface Props {
  projectId: string
  initialTariffType?: string
  initialConnectedPowerKw?: number
  initialMonthlyData?: MonthlyItem[]
  distributorName?: string
}

const DEFAULT_MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export function ConsumptionEditor({
  projectId,
  initialTariffType = 'BT1',
  initialConnectedPowerKw = 10,
  initialMonthlyData,
  distributorName = 'SAESA',
}: Props) {
  const [isPending, startTransition] = useTransition()
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [tariffType, setTariffType] = useState(initialTariffType)
  const [connectedPowerKw, setConnectedPowerKw] = useState(initialConnectedPowerKw)

  const [monthlyData, setMonthlyData] = useState<MonthlyItem[]>(() => {
    if (initialMonthlyData && initialMonthlyData.length === 12) {
      return initialMonthlyData
    }
    // Baseline 400 kWh/month
    return DEFAULT_MONTHS.map((m, i) => {
      const winterMultiplier = [1.0, 0.95, 1.05, 1.15, 1.30, 1.40, 1.45, 1.35, 1.15, 1.05, 0.98, 1.02][i]
      const kwh = Math.round(380 * winterMultiplier)
      return {
        month: m,
        kwh,
        costClp: Math.round(kwh * 175),
      }
    })
  })

  const handleKwhChange = (index: number, value: string) => {
    const num = parseFloat(value) || 0
    const updated = [...monthlyData]
    updated[index] = {
      ...updated[index],
      kwh: num,
      costClp: Math.round(num * 175),
    }
    setMonthlyData(updated)
  }

  const handleCostChange = (index: number, value: string) => {
    const num = parseFloat(value) || 0
    const updated = [...monthlyData]
    updated[index] = {
      ...updated[index],
      costClp: num,
    }
    setMonthlyData(updated)
  }

  const applyPresetProfile = (preset: 'RESIDENTIAL_BASE' | 'RESIDENTIAL_ELECTRIC' | 'COMMERCIAL_CNI') => {
    if (preset === 'RESIDENTIAL_BASE') {
      const base = [350, 330, 360, 390, 440, 480, 490, 460, 410, 380, 350, 360]
      setMonthlyData(DEFAULT_MONTHS.map((m, i) => ({ month: m, kwh: base[i], costClp: Math.round(base[i] * 175) })))
    } else if (preset === 'RESIDENTIAL_ELECTRIC') {
      // High winter heating/heat pump
      const base = [450, 420, 480, 650, 920, 1150, 1200, 1050, 780, 580, 460, 470]
      setMonthlyData(DEFAULT_MONTHS.map((m, i) => ({ month: m, kwh: base[i], costClp: Math.round(base[i] * 175) })))
    } else {
      // Commercial 2,500 kWh/month constant
      const base = [2200, 2100, 2600, 2700, 2800, 2900, 2950, 2850, 2700, 2600, 2400, 2300]
      setMonthlyData(DEFAULT_MONTHS.map((m, i) => ({ month: m, kwh: base[i], costClp: Math.round(base[i] * 165) })))
    }
  }

  const totalAnnualKwh = monthlyData.reduce((acc, curr) => acc + (Number(curr.kwh) || 0), 0)
  const totalAnnualCostClp = monthlyData.reduce((acc, curr) => acc + (Number(curr.costClp) || 0), 0)
  const averageMonthlyKwh = Math.round(totalAnnualKwh / 12)
  const effectiveRateClpKwh = totalAnnualKwh > 0 ? Math.round(totalAnnualCostClp / totalAnnualKwh) : 175

  // Winter vs Summer seasonality ratio
  const summerKwh = (monthlyData[0].kwh + monthlyData[1].kwh + monthlyData[11].kwh) / 3
  const winterKwh = (monthlyData[5].kwh + monthlyData[6].kwh + monthlyData[7].kwh) / 3
  const seasonalityFactor = summerKwh > 0 ? Math.round((winterKwh / summerKwh) * 10) / 10 : 1.0

  const handleSave = () => {
    startTransition(async () => {
      await updateProjectConsumptionAction(projectId, tariffType, connectedPowerKw, monthlyData)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    })
  }

  return (
    <Card className="rounded-2xl border-gray-100 shadow-sm bg-white overflow-hidden">
      <CardHeader className="pb-4 border-b border-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF8300]">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-[#1F1F1F]">
                Curva de Consumo Eléctrico & Tarifa ({distributorName})
              </CardTitle>
              <CardDescription className="text-xs text-gray-500 mt-0.5">
                Ingresa el historial de boletas para determinar la curva de carga y dimensionar los 4 escenarios
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedSuccess && (
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Guardado
              </Badge>
            )}
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isPending}
              className="rounded-xl bg-[#FF8300] hover:bg-[#E67600] text-white font-semibold text-xs h-9 px-4 shadow-sm cursor-pointer"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
              Guardar Consumo
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* KPI Summaries */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Consumo Total Anual</span>
            <span className="text-xl font-black text-[#1F1F1F] block mt-0.5">
              {totalAnnualKwh.toLocaleString('es-CL')} <span className="text-xs font-normal text-gray-500">kWh</span>
            </span>
          </div>

          <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Facturación Anual</span>
            <span className="text-xl font-black text-emerald-600 block mt-0.5">
              ${totalAnnualCostClp.toLocaleString('es-CL')}
            </span>
          </div>

          <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Tarifa Media Ponderada</span>
            <span className="text-xl font-black text-[#FF8300] block mt-0.5">
              ${effectiveRateClpKwh} <span className="text-xs font-normal text-gray-500">CLP/kWh</span>
            </span>
          </div>

          <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Estacionalidad Inv/Ver</span>
            <span className="text-xl font-black text-blue-600 block mt-0.5">
              {seasonalityFactor}x <span className="text-xs font-normal text-gray-500">pico invernal</span>
            </span>
          </div>
        </div>

        {/* Tarifa y Perfiles Preconfigurados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-orange-50/20 p-4 rounded-xl border border-orange-100/60">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-700">Tarifa Eléctrica</Label>
            <select
              value={tariffType}
              onChange={(e) => setTariffType(e.target.value)}
              className="w-full h-9 rounded-xl border border-gray-200 bg-white px-3 text-xs focus:ring-[#FF8300] focus:border-[#FF8300]"
            >
              <option value="BT1">BT1 (Residencial Simple Monofásico/Trifásico)</option>
              <option value="BT2">BT2 (Potencia Contratada en Baja Tensión)</option>
              <option value="BT3">BT3 (Potencia Leída en Baja Tensión)</option>
              <option value="BT4_3">BT4.3 (Doble Horario Punta / Fuera de Punta)</option>
              <option value="AT3">AT3 (Media Tensión)</option>
              <option value="AT4_3">AT4.3 (Media Tensión Horaria)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-700">Cargar Perfil Típico</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyPresetProfile('RESIDENTIAL_BASE')}
                className="rounded-lg text-[11px] h-9 flex-1 border-gray-200 bg-white"
              >
                Residencial Base
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyPresetProfile('RESIDENTIAL_ELECTRIC')}
                className="rounded-lg text-[11px] h-9 flex-1 border-gray-200 bg-white"
              >
                Bomba Calor / Clima
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyPresetProfile('COMMERCIAL_CNI')}
                className="rounded-lg text-[11px] h-9 flex-1 border-gray-200 bg-white"
              >
                Comercial C&I
              </Button>
            </div>
          </div>
        </div>

        {/* Tabla Mensual 12 Meses */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Desglose Mes a Mes (kWh y \$ Facturación)
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {monthlyData.map((item, idx) => (
              <div key={item.month} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#1F1F1F]">{item.month}</span>
                  <span className="text-[10px] text-gray-400">Mes {idx + 1}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 block">Consumo (kWh)</span>
                  <Input
                    type="number"
                    value={item.kwh}
                    onChange={(e) => handleKwhChange(idx, e.target.value)}
                    className="h-8 text-xs font-semibold rounded-lg bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 block">Factura (\$CLP)</span>
                  <Input
                    type="number"
                    value={item.costClp}
                    onChange={(e) => handleCostChange(idx, e.target.value)}
                    className="h-8 text-xs rounded-lg bg-white border-gray-200 text-gray-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
