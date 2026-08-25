'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Sun, 
  Zap, 
  TrendingUp, 
  Maximize2, 
  PiggyBank, 
  Sparkles, 
  Check, 
  Sliders, 
  Battery, 
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react'
import { computeSolarScenarios } from '@/lib/solar/sizing-engine'
import { MonthlyConsumptionRecord, SizingScenarioResult } from '@/lib/solar/solar-types'

interface Props {
  annualConsumptionKwh: number
  monthlyConsumption: MonthlyConsumptionRecord[]
  comunaName: string
  distributorName: string
  onSelectScenario?: (scenario: SizingScenarioResult) => void
}

export function SizingEngineTab({
  annualConsumptionKwh,
  monthlyConsumption,
  comunaName,
  distributorName,
  onSelectScenario,
}: Props) {
  const [tiltDeg, setTiltDeg] = useState(35)
  const [azimuthDeg, setAzimuthDeg] = useState(0) // 0 = North
  const [systemLossPct, setSystemLossPct] = useState(16)
  const [gridTariffClpKwh, setGridTariffClpKwh] = useState(175)
  const [injectionTariffClpKwh, setInjectionTariffClpKwh] = useState(95)
  const [fixedCapexTargetClp, setFixedCapexTargetClp] = useState(4500000)
  const [selectedScenarioId, setSelectedScenarioId] = useState(2)

  // Compute 4 scenarios dynamically
  const scenarios = computeSolarScenarios({
    annualConsumptionKwh,
    monthlyConsumption,
    comunaName,
    distributorName,
    gridTariffClpKwh,
    injectionTariffClpKwh,
    tiltDeg,
    azimuthDeg,
    systemLossPct,
    fixedCapexTargetClp,
  })

  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[1]

  const handleSelect = (sc: SizingScenarioResult) => {
    setSelectedScenarioId(sc.id)
    if (onSelectScenario) {
      onSelectScenario(sc)
    }
  }

  return (
    <div className="space-y-6">
      {/* Controles de Ingeniería y Calibración en Vivo */}
      <Card className="rounded-2xl border-gray-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="pb-3 border-b border-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF8300]">
                <Sliders className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-[#1F1F1F]">
                  Parámetros Técnicos de Dimensionamiento & Orientación
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Ajusta los ángulos de instalación, pérdidas y tarifas para recalcular los 4 escenarios en tiempo real
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs text-gray-600 bg-gray-50 border-gray-200">
              Recálculo Dinámico Activo
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Inclinación */}
            <div className="space-y-1.5 bg-gray-50/60 p-3 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-700">Inclinación (Tilt)</span>
                <span className="font-bold text-[#FF8300]">{tiltDeg}°</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={tiltDeg}
                onChange={(e) => setTiltDeg(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF8300]"
              />
              <span className="text-[10px] text-gray-400 block">Óptimo anual en {comunaName}: ~35°</span>
            </div>

            {/* Azimut */}
            <div className="space-y-1.5 bg-gray-50/60 p-3 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-700">Azimut / Orientación</span>
                <span className="font-bold text-[#FF8300]">
                  {azimuthDeg === 0 ? '0° (Norte)' : azimuthDeg < 0 ? `${Math.abs(azimuthDeg)}° Este` : `${azimuthDeg}° Oeste`}
                </span>
              </div>
              <input
                type="range"
                min="-90"
                max="90"
                value={azimuthDeg}
                onChange={(e) => setAzimuthDeg(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF8300]"
              />
              <span className="text-[10px] text-gray-400 block">Norte geográfico (0°) maximiza producción</span>
            </div>

            {/* Pérdidas del Sistema */}
            <div className="space-y-1.5 bg-gray-50/60 p-3 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-700">Pérdidas del Sistema</span>
                <span className="font-bold text-gray-900">{systemLossPct}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="25"
                step="0.5"
                value={systemLossPct}
                onChange={(e) => setSystemLossPct(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF8300]"
              />
              <span className="text-[10px] text-gray-400 block">Soiling, temperatura, cableado DC/AC</span>
            </div>

            {/* Valorización Net Billing */}
            <div className="space-y-1.5 bg-gray-50/60 p-3 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-700">Inyección Ley 20.571</span>
                <span className="font-bold text-emerald-600">\${injectionTariffClpKwh} CLP</span>
              </div>
              <Input
                type="number"
                value={injectionTariffClpKwh}
                onChange={(e) => setInjectionTariffClpKwh(Number(e.target.value))}
                className="h-7 text-xs bg-white border-gray-200 rounded-lg"
              />
              <span className="text-[10px] text-gray-400 block">Costo de nudo de energía ({distributorName})</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de 4 Escenarios SoldeRío */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {scenarios.map((sc) => {
          const isSelected = selectedScenarioId === sc.id
          const Icon = sc.id === 1 ? Zap : sc.id === 2 ? TrendingUp : sc.id === 3 ? Maximize2 : PiggyBank

          return (
            <Card
              key={sc.id}
              onClick={() => handleSelect(sc)}
              className={`rounded-2xl transition-all relative overflow-hidden cursor-pointer bg-white ${
                isSelected
                  ? 'border-2 border-[#FF8300] shadow-lg ring-2 ring-orange-100'
                  : 'border border-gray-100 shadow-sm hover:border-gray-200'
              }`}
            >
              {sc.recommended && (
                <div className="absolute top-0 right-0 bg-[#FF8300] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
                  <Sparkles className="h-3 w-3" /> Recomendado SoldeRío
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    sc.id === 2 ? 'bg-orange-100 text-[#FF8300]' : 'bg-gray-100 text-gray-700'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-[#1F1F1F]">
                      {sc.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500 mt-0.5">
                      {sc.tagline}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  {sc.description}
                </p>

                {/* Métricas Principales */}
                <div className="grid grid-cols-3 gap-2 bg-gray-50/70 p-3 rounded-xl border border-gray-100 text-center">
                  <div>
                    <span className="text-[10px] text-gray-400 font-medium uppercase block">Capacidad</span>
                    <span className="text-sm font-black text-[#1F1F1F]">{sc.kwp} kWp</span>
                    <span className="text-[10px] text-gray-500 block">({sc.numPanels} paneles)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-medium uppercase block">Generación</span>
                    <span className="text-sm font-black text-emerald-600">{sc.annualGenerationKwh.toLocaleString('es-CL')}</span>
                    <span className="text-[10px] text-gray-500 block">kWh / año</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-medium uppercase block">Payback</span>
                    <span className="text-sm font-black text-[#FF8300]">{sc.simplePaybackYears}</span>
                    <span className="text-[10px] text-gray-500 block">Años</span>
                  </div>
                </div>

                {/* Balance Autoconsumo vs Inyección */}
                <div className="space-y-1 bg-white p-2.5 rounded-xl border border-gray-100">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Autoconsumo: <strong className="text-gray-900">{sc.selfConsumptionPct}%</strong></span>
                    <span>Inyección Red: <strong className="text-emerald-700">{sc.gridInjectionPct}%</strong></span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-[#FF8300]" style={{ width: `${sc.selfConsumptionPct}%` }} />
                    <div className="h-full bg-emerald-500" style={{ width: `${sc.gridInjectionPct}%` }} />
                  </div>
                </div>

                {/* Resumen Económico */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Ahorro Anual Estimado:</span>
                    <span className="font-bold text-emerald-600">+\${sc.totalAnnualSavingsClp.toLocaleString('es-CL')} CLP</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Inversión Llave en Mano:</span>
                    <span className="font-bold text-gray-900">\${sc.capexClp.toLocaleString('es-CL')} CLP</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Inversor Sugerido:</span>
                    <span className="text-[11px] font-medium text-gray-700 truncate max-w-[210px]" title={sc.inverterSpec.model}>
                      {sc.inverterSpec.brand} {sc.inverterSpec.nominalPowerKw}kW (SEC)
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button
                  size="sm"
                  className={`w-full rounded-xl text-xs font-semibold cursor-pointer ${
                    isSelected
                      ? 'bg-[#FF8300] hover:bg-[#E67600] text-white shadow-sm'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelect(sc)
                  }}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1.5" /> Escenario Activo en Propuesta
                    </>
                  ) : (
                    'Seleccionar este Escenario'
                  )}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
