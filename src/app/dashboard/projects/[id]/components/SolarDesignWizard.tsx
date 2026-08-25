'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  MapPin, 
  Zap, 
  Sun, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Sliders, 
  Layers, 
  Building, 
  Battery, 
  UploadCloud, 
  FileUp, 
  CheckCircle2, 
  AlertCircle,
  FileCheck2,
  Lock,
  Activity,
  Calculator,
  Compass,
  Thermometer,
  Wind,
  DollarSign
} from 'lucide-react'
import { 
  PvOperationModel, 
  TrackingType, 
  AlbedoType, 
  RoofType, 
  ALBEDO_VALUES,
  MinEnergiaSimInputs,
  calculateMinEnergiaPvGeneration
} from '@/lib/solar/minenergia-models'
import { getSolarDataset } from '@/lib/solar/weather-engine'
import { EconomicSavingsReport } from './reports/EconomicSavingsReport'
import { PvGenerationReport } from './reports/PvGenerationReport'
import { ExecutiveCommercialReport } from './reports/ExecutiveCommercialReport'
import { SecComplianceChecklist } from './SecComplianceChecklist'
import { updateProjectLocationAction, updateProjectConsumptionAction } from '@/app/dashboard/project-actions'

interface Props {
  project: {
    id: string
    clientName: string
    clientRut: string | null
    projectType: string | null
    configuration: string | null
    status: string
    location: {
      comuna: string | null
      region: string | null
      distributor: string | null
      address: string | null
      latitude: any
      longitude: any
    } | null
    consumption: {
      tariffType: string
      annualTotal: any
      connectedPowerKw: any
      monthlyData: any
    } | null
    secCompliance: any
  }
}

const DEFAULT_MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export function SolarDesignWizard({ project }: Props) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [isPending, startTransition] = useTransition()

  // ================= PASO 1: CLIENTE Y EMPLAZAMIENTO =================
  const [clientName, setClientName] = useState(project.clientName || '')
  const [clientRut, setClientRut] = useState(project.clientRut || '')
  const [projectType, setProjectType] = useState(project.projectType || 'RESIDENTIAL')
  const [roofType, setRoofType] = useState<RoofType>('ZINC_METAL')
  const [isCoplanar, setIsCoplanar] = useState(true)
  const [roofAngleDeg, setRoofAngleDeg] = useState(30)
  const [comunaName, setComunaName] = useState(project.location?.comuna || 'Valdivia')
  const [distributorName, setDistributorName] = useState(project.location?.distributor || 'SAESA')

  // ================= PASO 2: CONSUMO ELÉCTRICO =================
  const [tariffType, setTariffType] = useState(project.consumption?.tariffType || 'BT1')
  const [connectedPowerKw, setConnectedPowerKw] = useState(Number(project.consumption?.connectedPowerKw) || 10)
  const [monthlyKwh, setMonthlyKwh] = useState<number[]>(() => {
    if (project.consumption?.monthlyData && Array.isArray(project.consumption.monthlyData)) {
      return (project.consumption.monthlyData as any[]).map((d) => Number(d.kwh) || 380)
    }
    return [380, 360, 400, 440, 500, 550, 560, 520, 440, 400, 370, 380]
  })
  const [isScrapingBill, setIsScrapingBill] = useState(false)
  const [billScrapedSuccess, setBillScrapedSuccess] = useState(false)

  // ================= PASO 3: MODELOS Y GENERACIÓN FV =================
  const [operationModel, setOperationModel] = useState<PvOperationModel>('BIFACIAL')
  const [installedCapacityKwp, setInstalledCapacityKwp] = useState(5.0)
  const [tempCoefficientPctPerC, setTempCoefficientPctPerC] = useState(-0.29)
  const [bifacialityFactor, setBifacialityFactor] = useState(0.80)
  const [albedoType, setAlbedoType] = useState<AlbedoType>('GRASS')
  const [trackingType, setTrackingType] = useState<TrackingType>('FIXED')
  const [tiltDeg, setTiltDeg] = useState(30)
  const [azimuthDeg, setAzimuthDeg] = useState(0) // 0 = North
  const [inverterEfficiencyPct, setInverterEfficiencyPct] = useState(98)
  const [systemLossesPct, setSystemLossesPct] = useState(18)
  const [mismatchLossesPct, setMismatchLossesPct] = useState(6)

  // ================= PASO 4: SELECTOR DE REPORTES =================
  const [activeReportTab, setActiveReportTab] = useState<'SAVINGS' | 'PV_GENERATION' | 'COMMERCIAL'>('SAVINGS')

  // Obtener recurso meteorológico
  const weatherDataset = getSolarDataset(comunaName)

  // Cálculo físico MinEnergía
  const simInputs: MinEnergiaSimInputs = {
    installedCapacityKwp,
    operationModel,
    tempCoefficientPctPerC,
    bifacialityFactor,
    albedoType,
    trackingType,
    tiltDeg,
    azimuthDeg,
    isCoplanar,
    roofType,
    roofAngleDeg,
    inverterEfficiencyPct,
    systemLossesPct,
    mismatchLossesPct,
    annualGhiKwhM2: weatherDataset.annualGhiKwhM2,
    annualDniKwhM2: 1480,
    monthlyResources: weatherDataset.monthlyResources,
  }

  const simResults = calculateMinEnergiaPvGeneration(simInputs)
  const annualConsumptionKwh = monthlyKwh.reduce((a, b) => a + b, 0)
  const averageMonthlyKwh = Math.round(annualConsumptionKwh / 12)
  const capexClp = Math.round(installedCapacityKwp * 850000)

  // ================= VALIDACIONES ESTRICTAS POR PASO =================
  const isStep1Valid = clientName.trim().length > 0 && roofAngleDeg >= 0 && comunaName.length > 0
  const isStep2Valid = annualConsumptionKwh > 0 && connectedPowerKw > 0
  const isStep3Valid = installedCapacityKwp > 0 && inverterEfficiencyPct > 0

  // Simulación de Scrapping de Boleta SAESA
  const handleScrapeSaesaBill = () => {
    setIsScrapingBill(true)
    setTimeout(() => {
      // Extracción automática desde historial de 12 meses
      const saesaExtractedKwh = [410, 390, 425, 480, 560, 620, 640, 590, 490, 440, 400, 415]
      setMonthlyKwh(saesaExtractedKwh)
      setIsScrapingBill(false)
      setBillScrapedSuccess(true)
      setTimeout(() => setBillScrapedSuccess(false), 4000)
    }, 1200)
  }

  const handleNext = () => {
    if (currentStep === 1 && isStep1Valid) {
      startTransition(async () => {
        await updateProjectLocationAction(project.id, {
          clientName,
          clientRut,
          projectType,
          comuna: comunaName,
          region: 'Los Ríos',
          distributor: distributorName,
          address: project.location?.address || `${comunaName}, Chile`,
          latitude: weatherDataset.lat,
          longitude: weatherDataset.lng,
        })
        setCurrentStep(2)
      })
    } else if (currentStep === 2 && isStep2Valid) {
      startTransition(async () => {
        const monthlyData = DEFAULT_MONTHS.map((m, i) => ({
          month: m,
          kwh: monthlyKwh[i],
          costClp: Math.round(monthlyKwh[i] * 175),
        }))
        await updateProjectConsumptionAction(project.id, tariffType, connectedPowerKw, monthlyData)
        setCurrentStep(3)
      })
    } else if (currentStep === 3 && isStep3Valid) {
      setCurrentStep(4)
    } else if (currentStep === 4) {
      setCurrentStep(5)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any)
    }
  }

  return (
    <div className="space-y-6">
      {/* Wizard Header Stepper */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between overflow-x-auto pb-2 sm:pb-0 gap-2">
          {[
            { step: 1, label: '1. Cliente & Techo', icon: User, valid: isStep1Valid },
            { step: 2, label: '2. Consumo Eléctrico', icon: Zap, valid: isStep2Valid },
            { step: 3, label: '3. Generación FV (MinEnergía)', icon: Sun, valid: isStep3Valid },
            { step: 4, label: '4. Informes & Ahorro', icon: FileText, valid: true },
            { step: 5, label: '5. Tramitación SEC', icon: ShieldCheck, valid: true },
          ].map((s) => {
            const isActive = currentStep === s.step
            const isCompleted = currentStep > s.step
            const Icon = s.icon

            return (
              <div
                key={s.step}
                onClick={() => {
                  if (s.step < currentStep || (s.step === currentStep + 1 && s.valid)) {
                    setCurrentStep(s.step as any)
                  }
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all select-none whitespace-nowrap ${
                  isActive
                    ? 'bg-orange-50 text-[#FF8300] font-bold ring-1 ring-orange-200'
                    : isCompleted
                    ? 'text-emerald-700 font-semibold cursor-pointer hover:bg-gray-50'
                    : 'text-gray-400 font-medium opacity-60 cursor-not-allowed'
                }`}
              >
                <div
                  className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                    isActive
                      ? 'bg-[#FF8300] text-white font-bold'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : s.step}
                </div>
                <span className="text-xs">{s.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PASO 1: CLIENTE Y EMPLAZAMIENTO                                           */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <Card className="rounded-[24px] border-gray-100 shadow-sm bg-white overflow-hidden animate-in fade-in-50 duration-200">
          <CardHeader className="border-b border-gray-50 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF8300]">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-[#1F1F1F]">
                  Paso 1: Información Específica del Cliente y Emplazamiento
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 mt-0.5">
                  Ingresa los datos del titular y la geometría de la techumbre o suelo donde se montará la planta
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">Nombre del Cliente *</Label>
                <Input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej: Agrícola y Ganadera Los Ríos SpA"
                  className="rounded-xl h-10 text-xs bg-gray-50/50"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">RUT del Cliente (Opcional)</Label>
                <Input
                  value={clientRut}
                  onChange={(e) => setClientRut(e.target.value)}
                  placeholder="Ej: 76.543.210-K"
                  className="rounded-xl h-10 text-xs bg-gray-50/50"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">Tipo de Planta</Label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50/50 px-3 text-xs focus:ring-[#FF8300]"
                >
                  <option value="RESIDENTIAL">Residencial (≤ 20 kWp - Ley 20.571)</option>
                  <option value="COMMERCIAL">Comercial e Industrial C&I (≤ 300 kWp - Ley 21.118)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">Comuna del Proyecto</Label>
                <select
                  value={comunaName}
                  onChange={(e) => setComunaName(e.target.value)}
                  className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50/50 px-3 text-xs focus:ring-[#FF8300]"
                >
                  <option value="Valdivia">Valdivia (Los Ríos)</option>
                  <option value="Puerto Varas">Puerto Varas (Los Lagos)</option>
                  <option value="Osorno">Osorno (Los Lagos)</option>
                  <option value="Puerto Montt">Puerto Montt (Los Lagos)</option>
                  <option value="Temuco">Temuco (La Araucanía)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">Tipo de Cubierta / Techo</Label>
                <select
                  value={roofType}
                  onChange={(e) => setRoofType(e.target.value as any)}
                  className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50/50 px-3 text-xs focus:ring-[#FF8300]"
                >
                  <option value="ZINC_METAL">Zinc / Chapa Metálica Trapezoidal o Seam</option>
                  <option value="CLAY_TILE">Teja Colonial / Arcilla</option>
                  <option value="ASPHALT_SHINGLE">Teja Asfáltica</option>
                  <option value="CONCRETE_SLAB">Losa de Hormigón Plana</option>
                  <option value="FIBROCEMENT">Fibrocemento / Pizarreño</option>
                  <option value="GROUND_MOUNT">Montaje en Suelo / Parque</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">Tipo de Arreglo</Label>
                <select
                  value={isCoplanar ? 'COPLANAR' : 'INCLINADO'}
                  onChange={(e) => setIsCoplanar(e.target.value === 'COPLANAR')}
                  className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50/50 px-3 text-xs focus:ring-[#FF8300]"
                >
                  <option value="COPLANAR">Coplanar (Paralelo a la cubierta)</option>
                  <option value="INCLINADO">Inclinado con Estructura Triangular</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2 bg-orange-50/30 p-4 rounded-xl border border-orange-100">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-gray-700">Inclinación de la Cubierta (Ángulo del Techo) *</span>
                  <span className="font-bold text-[#FF8300]">{roofAngleDeg}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={roofAngleDeg}
                  onChange={(e) => setRoofAngleDeg(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF8300]"
                />
                <span className="text-[10px] text-gray-400 block mt-1">
                  En la zona sur de Chile las pendientes típicas de techumbre varían entre 20° y 35°.
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-gray-50 p-4 flex justify-between">
            <span className="text-xs text-gray-400">
              {!isStep1Valid ? '⚠️ Completa el nombre del cliente para continuar' : '✓ Datos validados'}
            </span>
            <Button
              onClick={handleNext}
              disabled={!isStep1Valid || isPending}
              className="rounded-xl bg-[#FF8300] hover:bg-[#E67600] text-white font-semibold text-xs h-10 px-6 cursor-pointer"
            >
              Continuar al Paso 2
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* PASO 2: CONSUMO ELÉCTRICO                                                 */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <Card className="rounded-[24px] border-gray-100 shadow-sm bg-white overflow-hidden animate-in fade-in-50 duration-200">
          <CardHeader className="border-b border-gray-50 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF8300]">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-[#1F1F1F]">
                    Paso 2: Carga de Información de Consumo Eléctrico
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500 mt-0.5">
                    Ingresa el consumo mes a mes, carga tu boleta SAESA para scrapping o define un promedio mensual
                  </CardDescription>
                </div>
              </div>

              {/* Botón Scrapping Boleta SAESA */}
              <div className="flex items-center gap-2">
                {billScrapedSuccess && (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Boleta SAESA Procesada
                  </Badge>
                )}
                <Button
                  size="sm"
                  type="button"
                  onClick={handleScrapeSaesaBill}
                  disabled={isScrapingBill}
                  variant="outline"
                  className="rounded-xl border-orange-200 text-[#FF8300] bg-orange-50/50 hover:bg-orange-100 text-xs font-semibold h-9"
                >
                  <UploadCloud className="h-4 w-4 mr-1.5" />
                  {isScrapingBill ? 'Analizando Boleta...' : 'Cargar Boleta SAESA (OCR)'}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Parámetros de Red & Distribuidora */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50/60 p-4 rounded-xl border border-gray-100">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-gray-700">Distribuidora Eléctrica</Label>
                <select
                  value={distributorName}
                  onChange={(e) => setDistributorName(e.target.value)}
                  className="w-full h-9 rounded-xl border border-gray-200 bg-white px-3 text-xs"
                >
                  <option value="SAESA">SAESA (Sociedad Austral de Electricidad)</option>
                  <option value="FRONTEL">FRONTEL</option>
                  <option value="ENEL">ENEL Distribución</option>
                  <option value="CGE">CGE</option>
                  <option value="CHILQUINTA">Chilquinta</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-gray-700">Tipo de Tarifa</Label>
                <select
                  value={tariffType}
                  onChange={(e) => setTariffType(e.target.value)}
                  className="w-full h-9 rounded-xl border border-gray-200 bg-white px-3 text-xs"
                >
                  <option value="BT1">BT1 (Residencial Simple)</option>
                  <option value="BT2">BT2 (Baja Tensión con Potencia)</option>
                  <option value="BT3">BT3 (Potencia Leída)</option>
                  <option value="BT4_3">BT4.3 (Horaria)</option>
                  <option value="AT3">AT3 (Media Tensión)</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-gray-700">Potencia Conectada (kW)</Label>
                <Input
                  type="number"
                  value={connectedPowerKw}
                  onChange={(e) => setConnectedPowerKw(Number(e.target.value))}
                  className="h-9 rounded-xl bg-white border-gray-200 text-xs"
                />
              </div>
            </div>

            {/* Matriz 12 Meses */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Consumo Mes a Mes (kWh / Mes)
                </Label>
                <span className="text-xs font-bold text-[#FF8300]">
                  Total Anual: {annualConsumptionKwh.toLocaleString('es-CL')} kWh/año (Promedio: {averageMonthlyKwh} kWh/mes)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {DEFAULT_MONTHS.map((m, idx) => (
                  <div key={m} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1 text-center">
                    <span className="font-bold text-xs text-[#1F1F1F] block">{m}</span>
                    <Input
                      type="number"
                      value={monthlyKwh[idx]}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0
                        const copy = [...monthlyKwh]
                        copy[idx] = val
                        setMonthlyKwh(copy)
                      }}
                      className="h-8 text-center text-xs font-bold bg-white border-gray-200 rounded-lg"
                    />
                    <span className="text-[10px] text-gray-400 block">
                      ~${Math.round(monthlyKwh[idx] * 175).toLocaleString('es-CL')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-gray-50 p-4 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              className="rounded-xl text-xs h-10 px-5"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStep2Valid || isPending}
              className="rounded-xl bg-[#FF8300] hover:bg-[#E67600] text-white font-semibold text-xs h-10 px-6 cursor-pointer"
            >
              Continuar al Paso 3 (Generación FV)
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* PASO 3: FORMULARIO DE GENERACIÓN FV (MODELOS FÍSICOS MINENERGÍA)           */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <Card className="rounded-[24px] border-gray-100 shadow-sm bg-white overflow-hidden animate-in fade-in-50 duration-200">
          <CardHeader className="border-b border-gray-50 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF8300]">
                <Sun className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-[#1F1F1F]">
                  Paso 3: Formulario de Generación FV & Modelos Físicos (MinEnergía / NREL)
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 mt-0.5">
                  Selecciona el modelo de operación y calibra las pérdidas, albedo y bifacialidad del arreglo
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* 1. Selección de Modelo de Operación */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                1. Selección de Modelo de Operación (Explorador Solar)
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    id: 'BASIC_PVWATTS',
                    title: 'Modelo Básico (PVWatts)',
                    desc: 'Desarrollado por NREL. Cálculo rápido con coeficientes estándar.',
                  },
                  {
                    id: 'ADVANCED_SANDIA',
                    title: 'Modelo Avanzado (Sandia)',
                    desc: 'Basado en King (2004) y los 5 parámetros de la curva I-V.',
                  },
                  {
                    id: 'BIFACIAL',
                    title: 'Modelo Bifacial',
                    desc: 'Cara frontal + ganancia trasera por albedo y radiación difusa.',
                    highlight: true,
                  },
                  {
                    id: 'FLOATING',
                    title: 'Modelo Flotante (FPV)',
                    desc: 'Sobre cuerpo de agua con enfriamiento por evaporación.',
                  },
                ].map((mod) => {
                  const isSelected = operationModel === mod.id
                  return (
                    <div
                      key={mod.id}
                      onClick={() => setOperationModel(mod.id as any)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#FF8300] bg-orange-50/40 ring-1 ring-[#FF8300]'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-[#1F1F1F]">{mod.title}</span>
                        {mod.highlight && <Badge className="bg-[#FF8300] text-white text-[9px] h-4">Recomendado</Badge>}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">{mod.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 2. Características del Arreglo Fotovoltaico */}
            <div className="space-y-3 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                2. Características del Arreglo & Entorno
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Capacidad Instalada (kWp)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={installedCapacityKwp}
                    onChange={(e) => setInstalledCapacityKwp(Number(e.target.value))}
                    className="h-9 rounded-xl bg-white text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Coeficiente Temp. Panel (%/°C)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={tempCoefficientPctPerC}
                    onChange={(e) => setTempCoefficientPctPerC(Number(e.target.value))}
                    className="h-9 rounded-xl bg-white text-xs"
                  />
                  <span className="text-[10px] text-gray-400">Estándar TOPCon: -0.29 %/°C</span>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Factor de Bifacialidad</Label>
                  <Input
                    type="number"
                    step="0.05"
                    min="0.5"
                    max="1.0"
                    value={bifacialityFactor}
                    onChange={(e) => setBifacialityFactor(Number(e.target.value))}
                    className="h-9 rounded-xl bg-white text-xs"
                  />
                  <span className="text-[10px] text-gray-400">PmaxTrasera / PmaxFrontal (0.80)</span>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Tipo de Albedo del Suelo</Label>
                  <select
                    value={albedoType}
                    onChange={(e) => setAlbedoType(e.target.value as any)}
                    className="w-full h-9 rounded-xl border border-gray-200 bg-white px-3 text-xs"
                  >
                    {Object.entries(ALBEDO_VALUES).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.name} (Albedo = {v.value})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Tipo de Arreglo / Seguimiento</Label>
                  <select
                    value={trackingType}
                    onChange={(e) => setTrackingType(e.target.value as any)}
                    className="w-full h-9 rounded-xl border border-gray-200 bg-white px-3 text-xs"
                  >
                    <option value="FIXED">Fijo Inclinado / Coplanar</option>
                    <option value="HSAT">HSAT (Seguimiento 1-Eje Horizontal E-O)</option>
                    <option value="HTSAT">HTSAT (Seguimiento con Inclinación)</option>
                    <option value="VSAT">VSAT (Seguimiento 1-Eje Vertical)</option>
                    <option value="TSAT">TSAT (Seguimiento 2 Ejes)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Inclinación (Tilt °) / Azimut (°)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={tiltDeg}
                      onChange={(e) => setTiltDeg(Number(e.target.value))}
                      className="h-9 rounded-xl bg-white text-xs w-1/2"
                      placeholder="Tilt"
                    />
                    <Input
                      type="number"
                      value={azimuthDeg}
                      onChange={(e) => setAzimuthDeg(Number(e.target.value))}
                      className="h-9 rounded-xl bg-white text-xs w-1/2"
                      placeholder="Azimut (0°=N)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Pérdidas del Sistema */}
            <div className="space-y-3 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                3. Pérdidas del Sistema Fotovoltaico
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Eficiencia Inversor (%)</Label>
                  <Input
                    type="number"
                    value={inverterEfficiencyPct}
                    onChange={(e) => setInverterEfficiencyPct(Number(e.target.value))}
                    className="h-9 rounded-xl bg-white text-xs font-semibold"
                  />
                  <span className="text-[10px] text-gray-400">Estándar: 98%</span>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Pérdidas del Sistema (%)</Label>
                  <Input
                    type="number"
                    value={systemLossesPct}
                    onChange={(e) => setSystemLossesPct(Number(e.target.value))}
                    className="h-9 rounded-xl bg-white text-xs font-semibold"
                  />
                  <span className="text-[10px] text-gray-400">Cableado, suciedad, soiling (18%)</span>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Pérdidas por Mismatch (%)</Label>
                  <Input
                    type="number"
                    value={mismatchLossesPct}
                    onChange={(e) => setMismatchLossesPct(Number(e.target.value))}
                    className="h-9 rounded-xl bg-white text-xs font-semibold"
                  />
                  <span className="text-[10px] text-gray-400">Desajuste de módulos (6%)</span>
                </div>
              </div>
            </div>

            {/* Resumen de Generación Calculada en Vivo */}
            <div className="p-4 bg-orange-50/40 rounded-2xl border border-orange-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-[#FF8300]" /> Generación Estimada (MinEnergía):
                </span>
                <p className="text-xs text-gray-600">
                  Rendimiento Específico: <strong>{simResults.specificYieldKwhKwp} kWh/kWp/año</strong> • Factor de Planta: <strong>{simResults.capacityFactorPct}%</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-[#FF8300]">
                  {simResults.annualGenerationKwh.toLocaleString('es-CL')} <span className="text-sm font-normal text-gray-600">kWh/año</span>
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-gray-50 p-4 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              className="rounded-xl text-xs h-10 px-5"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStep3Valid || isPending}
              className="rounded-xl bg-[#FF8300] hover:bg-[#E67600] text-white font-semibold text-xs h-10 px-6 cursor-pointer"
            >
              Continuar al Paso 4 (Informes & Reportes)
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* PASO 4: GENERADOR DE INFORMES (3 INFORMES MINENERGÍA / SOLDERÍO)          */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Header de Navegación de Reportes */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setActiveReportTab('SAVINGS')}
                className={`rounded-xl text-xs font-semibold cursor-pointer ${
                  activeReportTab === 'SAVINGS'
                    ? 'bg-[#FF8300] hover:bg-[#E67600] text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                1. Reporte Ahorro en Boleta
              </Button>

              <Button
                size="sm"
                onClick={() => setActiveReportTab('PV_GENERATION')}
                className={`rounded-xl text-xs font-semibold cursor-pointer ${
                  activeReportTab === 'PV_GENERATION'
                    ? 'bg-[#FF8300] hover:bg-[#E67600] text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Sun className="h-3.5 w-3.5 mr-1.5" />
                2. Reporte Generación FV
              </Button>

              <Button
                size="sm"
                onClick={() => setActiveReportTab('COMMERCIAL')}
                className={`rounded-xl text-xs font-semibold cursor-pointer ${
                  activeReportTab === 'COMMERCIAL'
                    ? 'bg-[#FF8300] hover:bg-[#E67600] text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                3. Propuesta Ejecutiva SoldeRío
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                className="rounded-xl text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Paso Anterior
              </Button>
              <Button
                size="sm"
                onClick={handleNext}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                Ir a Tramitación SEC (Paso 5)
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* Renderizado de Reporte Seleccionado */}
          {activeReportTab === 'SAVINGS' && (
            <EconomicSavingsReport
              clientName={clientName}
              clientRut={clientRut}
              comunaName={comunaName}
              distributorName={distributorName}
              tariffType={tariffType}
              averageMonthlyKwh={averageMonthlyKwh}
              simInputs={simInputs}
              simResults={simResults}
              capexClp={capexClp}
            />
          )}

          {activeReportTab === 'PV_GENERATION' && (
            <PvGenerationReport
              clientName={clientName}
              comunaName={comunaName}
              simInputs={simInputs}
              simResults={simResults}
            />
          )}

          {activeReportTab === 'COMMERCIAL' && (
            <ExecutiveCommercialReport
              clientName={clientName}
              clientRut={clientRut}
              comunaName={comunaName}
              distributorName={distributorName}
              simInputs={simInputs}
              simResults={simResults}
              capexClp={capexClp}
            />
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PASO 5: TRAMITACIÓN SEC & DISTRIBUIDORA                                   */}
      {/* ========================================================================= */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <Badge className="bg-orange-50 text-[#FF8300] border-orange-200 text-xs">
                Paso 5: Cumplimiento Regulatorio & Trámites SEC (Ley 20.571 / 21.118)
              </Badge>
              <p className="text-xs text-gray-500 mt-1">
                Sube la documentación de respaldo y genera los antecedentes para el e-Declarador SEC
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(4)}
              className="rounded-xl text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Volver a Informes
            </Button>
          </div>

          <SecComplianceChecklist
            projectId={project.id}
            secCompliance={project.secCompliance}
          />
        </div>
      )}
    </div>
  )
}
