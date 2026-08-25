'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Sun, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  DollarSign, 
  Maximize2, 
  PiggyBank 
} from 'lucide-react'

interface Props {
  annualConsumptionKwh: number
  connectedPowerKw: number
  comuna: string
  distributor: string
}

export function ScenariosTab({ 
  annualConsumptionKwh = 4800, 
  connectedPowerKw = 10,
  comuna = 'Valdivia',
  distributor = 'SAESA'
}: Props) {
  const [selectedScenario, setSelectedScenario] = useState<number>(2)

  // Solar yield in Southern Chile (Valdivia / Los Ríos / Los Lagos): ~1,100 - 1,250 kWh/kWp/year
  const specificYield = 1180 // kWh/kWp/year in Valdivia
  const panelPowerW = 550 // Tier 1 Bi-facial 550Wp
  const kwhRateClp = 175 // $175 CLP per kWh average SAESA BT1

  // 4 Scenarios calculation
  const scenarios = [
    {
      id: 1,
      title: '100% Autoconsumo Diurno',
      tagline: 'Cero inyecciones / Máxima eficiencia inmediata',
      icon: Zap,
      accentColor: 'text-amber-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      kwp: Math.round((annualConsumptionKwh * 0.55 / specificYield) * 10) / 10, // covers 55% daytime base
      selfConsumptionPct: 95,
      gridInjectionPct: 5,
      paybackYears: 4.8,
      inverterSpec: 'Inversor Monofásico 3.0 kW (Fronius Primo / Deye) con Anti-Isla SEC',
      description: 'Dimensionado para cubrir exclusivamente la curva de consumo diurno sin depender de la venta de excedentes a la distribuidora.',
    },
    {
      id: 2,
      title: 'Net Billing Óptimo (Ley 20.571)',
      tagline: 'Máxima Rentabilidad & Retorno de Inversión',
      icon: TrendingUp,
      recommended: true,
      accentColor: 'text-[#FF8300]',
      badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
      kwp: Math.round((annualConsumptionKwh * 0.95 / specificYield) * 10) / 10, // ~100% offset
      selfConsumptionPct: 65,
      gridInjectionPct: 35,
      paybackYears: 4.2,
      inverterSpec: 'Inversor Red 5.0 kW (Huawei SUN2000 / Fronius) Homologado SEC',
      description: 'Equilibrio perfecto entre ahorro directo en boleta e inyección valorizada de excedentes bajo Ley 20.571 ante SAESA.',
    },
    {
      id: 3,
      title: 'Máximo Espacio Disponible',
      tagline: 'Generación Total & Futura Electrificación / EV',
      icon: Maximize2,
      accentColor: 'text-blue-600',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      kwp: Math.min(connectedPowerKw, Math.round((annualConsumptionKwh * 1.6 / specificYield) * 10) / 10),
      selfConsumptionPct: 45,
      gridInjectionPct: 55,
      paybackYears: 5.6,
      inverterSpec: 'Inversor Trifásico / Híbrido 8.0-10.0 kW Certificado SEC',
      description: 'Aprovecha toda la superficie disponible para maximizar la generación neta, venta de excedentes y futura carga de vehículos eléctricos.',
    },
    {
      id: 4,
      title: 'Presupuesto Fijo (CAPEX Base)',
      tagline: 'Entrada Accesible con Escalabilidad Modular',
      icon: PiggyBank,
      accentColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      kwp: 2.2, // ~4 panels starter
      selfConsumptionPct: 98,
      gridInjectionPct: 2,
      paybackYears: 4.5,
      inverterSpec: 'Microinversores / Inversor String 2.5 kW Homologado SEC',
      description: 'Solución compacta de bajo costo inicial con microinversores que permite ampliaciones futuras en etapas.',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#1F1F1F]">
            Matriz de 4 Escenarios de Dimensionamiento SoldeRío
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Cálculo basado en radiación solar de <span className="font-semibold text-gray-700">{comuna}</span> ({specificYield} kWh/kWp/año) y tarifa <span className="font-semibold text-gray-700">{distributor}</span>.
          </p>
        </div>
        <Badge variant="outline" className="border-orange-200 bg-orange-50 text-[#FF8300] text-xs h-7 px-3">
          <Sun className="h-3.5 w-3.5 mr-1" /> Módulos Tier 1 550W Bifaciales
        </Badge>
      </div>

      {/* Grid de Escenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {scenarios.map((sc) => {
          const numPanels = Math.ceil((sc.kwp * 1000) / panelPowerW)
          const annualGeneration = Math.round(sc.kwp * specificYield)
          const annualSavings = Math.round(annualGeneration * kwhRateClp * 0.88)
          const capexClp = Math.round(sc.kwp * 1000 * 850) // ~$850 CLP per Wp installed full EPC
          const isSelected = selectedScenario === sc.id
          const Icon = sc.icon

          return (
            <Card 
              key={sc.id} 
              className={`rounded-2xl transition-all relative overflow-hidden cursor-pointer ${
                isSelected 
                  ? 'border-2 border-[#FF8300] shadow-md bg-white ring-2 ring-orange-100' 
                  : 'border border-gray-100 shadow-sm hover:border-gray-200 bg-white'
              }`}
              onClick={() => setSelectedScenario(sc.id)}
            >
              {sc.recommended && (
                <div className="absolute top-0 right-0 bg-[#FF8300] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Recomendado SoldeRío
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${sc.badgeBg}`}>
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
                    <span className="text-[10px] text-gray-400 font-medium uppercase block">Potencia</span>
                    <span className="text-sm font-black text-[#1F1F1F]">{sc.kwp} kWp</span>
                    <span className="text-[10px] text-gray-500 block">({numPanels} paneles)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-medium uppercase block">Generación</span>
                    <span className="text-sm font-black text-emerald-600">{annualGeneration.toLocaleString('es-CL')}</span>
                    <span className="text-[10px] text-gray-500 block">kWh / año</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-medium uppercase block">Payback</span>
                    <span className="text-sm font-black text-[#FF8300]">{sc.paybackYears}</span>
                    <span className="text-[10px] text-gray-500 block">Años</span>
                  </div>
                </div>

                {/* Costos y Ahorro */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Ahorro Estimado Anual:</span>
                    <span className="font-bold text-emerald-600">+${annualSavings.toLocaleString('es-CL')} CLP</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Inversión Llave en Mano (EPC):</span>
                    <span className="font-semibold text-gray-800">${capexClp.toLocaleString('es-CL')} CLP</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Inversor Propuesto:</span>
                    <span className="text-[11px] font-medium text-gray-700 truncate max-w-[200px]" title={sc.inverterSpec}>
                      {sc.inverterSpec}
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
                  onClick={() => setSelectedScenario(sc.id)}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1.5" /> Escenario Seleccionado para Propuesta
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
