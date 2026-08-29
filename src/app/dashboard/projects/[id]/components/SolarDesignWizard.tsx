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
  Building2, 
  Battery, 
  UploadCloud, 
  FileUp, 
  CheckCircle2, 
  AlertCircle, 
  Lock,
  Activity,
  Calculator,
  Compass,
  Thermometer,
  Wind,
  DollarSign,
  Package,
  Wrench,
  Eye,
  Box
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
import { InteractiveLocationMap } from './InteractiveLocationMap'
import { Scanifly3DStudio } from './Scanifly3DStudio'
import { EquipmentCapexTab } from './EquipmentCapexTab'
import { EconomicSavingsReport } from './reports/EconomicSavingsReport'
import { PvGenerationReport } from './reports/PvGenerationReport'
import { ExecutiveCommercialReport } from './reports/ExecutiveCommercialReport'
import { ScaniflyShadingReport } from './reports/ScaniflyShadingReport'
import { SecComplianceChecklist } from './SecComplianceChecklist'
import { updateProjectLocationAction, updateProjectConsumptionAction } from '@/app/dashboard/project-actions'
import { EquipmentItem, PRECONFIGURED_CAPEX_TEMPLATES, calculateTotalCapex } from '@/lib/solar/capex-templates'
import { StringConfiguration, validateStringing, DEFAULT_MODULE_SPEC, DEFAULT_INVERTER_SPEC } from '@/lib/solar/stringing-validator'

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
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1)
  const [isPending, startTransition] = useTransition()

  // ================= PASO 1: CLIENTE Y EMPLAZAMIENTO CON MAPA GPS =================
  const [clientName, setClientName] = useState(project.clientName || '')
  const [clientRut, setClientRut] = useState(project.clientRut || '')
  const [projectType, setProjectType] = useState(project.projectType || 'RESIDENTIAL')
  const [roofType, setRoofType] = useState<RoofType>('ZINC_METAL')
  const [isCoplanar, setIsCoplanar] = useState(true)
  const [roofAngleDeg, setRoofAngleDeg] = useState(30)
  const [comunaName, setComunaName] = useState(project.location?.comuna || 'Valdivia')
  const [latitude, setLatitude] = useState(Number(project.location?.latitude) || -39.8142)
  const [longitude, setLongitude] = useState(Number(project.location?.longitude) || -73.2459)
  const [distributorName, setDistributorName] = useState(project.location?.distributor || 'SAESA')

  // ================= PASO 2: CONSUMO ELÉCTRICO Y TARIFA MANUAL =================
  const [tariffType, setTariffType] = useState(project.consumption?.tariffType || 'BT1')
  const [gridTariffClpKwh, setGridTariffClpKwh] = useState(175)
  const [injectionTariffClpKwh, setInjectionTariffClpKwh] = useState(95)
  const [connectedPowerKw, setConnectedPowerKw] = useState(Number(project.consumption?.connectedPowerKw) || 10)
  const [monthlyKwh, setMonthlyKwh] = useState<number[]>(() => {
    if (project.consumption?.monthlyData && Array.isArray(project.consumption.monthlyData)) {
      return (project.consumption.monthlyData as any[]).map((d) => Number(d.kwh) || 380)
    }
    return [380, 360, 400, 440, 500, 550, 560, 520, 440, 400, 370, 380]
  })
  const [isScrapingBill, setIsScrapingBill] = useState(false)
  const [billScrapedSuccess, setBillScrapedSuccess] = useState(false)

  // ================= PASO 3: ESTUDIO 3D SCANIFLY (SOMBRAS, LAYOUT & STRINGS) =================
  const [installedCapacityKwp, setInstalledCapacityKwp] = useState(6.6)
  const [totalModules, setTotalModules] = useState(12)
  const [shadingLossPct, setShadingLossPct] = useState(3.5)
  const [solarAccessPct, setSolarAccessPct] = useState(96.5)
  const [tiltDeg, setTiltDeg] = useState(30)
  const [azimuthDeg, setAzimuthDeg] = useState(0)
  const [strings, setStrings] = useState<StringConfiguration[]>([
    { id: 'STRING_1', name: 'String 1 (MPPT 1)', mpptIndex: 1, colorHex: '#2563eb', moduleCount: 6, moduleIndices: [] },
    { id: 'STRING_2', name: 'String 2 (MPPT 2)', mpptIndex: 2, colorHex: '#f97316', moduleCount: 6, moduleIndices: [] },
  ])

  // ================= PASO 4: MODELOS FÍSICOS MINENERGÍA =================
  const [operationModel, setOperationModel] = useState<PvOperationModel>('BIFACIAL')
  const [tempCoefficientPctPerC, setTempCoefficientPctPerC] = useState(-0.29)
  const [bifacialityFactor, setBifacialityFactor] = useState(0.80)
  const [albedoType, setAlbedoType] = useState<AlbedoType>('GRASS')
  const [trackingType, setTrackingType] = useState<TrackingType>('FIXED')
  const [inverterEfficiencyPct, setInverterEfficiencyPct] = useState(98)
  const [systemLossesPct, setSystemLossesPct] = useState(18)
  const [mismatchLossesPct, setMismatchLossesPct] = useState(6)

  // ================= PASO 5: EQUIPAMIENTO & CAPEX =================
  const [selectedTemplateName, setSelectedTemplateName] = useState<string>('Residencial Híbrida_PV[4kWp]_ESS[14kWh]_Coplanar_Zinc')
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>(PRECONFIGURED_CAPEX_TEMPLATES[0].items)
  const [capexClp, setCapexClp] = useState(calculateTotalCapex(PRECONFIGURED_CAPEX_TEMPLATES[0].items).totalClp)

  // ================= PASO 6: SELECTOR DE REPORTES =================
  const [activeReportTab, setActiveReportTab] = useState<'SHADING_3D' | 'SAVINGS' | 'PV_GENERATION' | 'COMMERCIAL'>('SHADING_3D')

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
    systemLossesPct: Math.min(30, systemLossesPct + shadingLossPct), // Includes 3D shading
    mismatchLossesPct,
    annualGhiKwhM2: weatherDataset.annualGhiKwhM2,
    annualDniKwhM2: 1480,
    monthlyResources: weatherDataset.monthlyResources,
  }

  const simResults = calculateMinEnergiaPvGeneration(simInputs)
  const annualConsumptionKwh = monthlyKwh.reduce((a, b) => a + b, 0)
  const averageMonthlyKwh = Math.round(annualConsumptionKwh / 12)

  // Stringing Validation Result
  const stringingValidation = validateStringing(strings, DEFAULT_MODULE_SPEC, DEFAULT_INVERTER_SPEC, -5, 65)

  // Manejo de cambio de tarifa manual
  const handleGridTariffChange = (value: number) => {
    const val = Math.max(0, value)
    setGridTariffClpKwh(val)
    setInjectionTariffClpKwh(Math.round(val * 0.54))
  }

  // ================= VALIDACIONES ESTRICTAS =================
  const isStep1Valid = clientName.trim().length > 0 && roofAngleDeg >= 0 && comunaName.length > 0
  const isStep2Valid = annualConsumptionKwh > 0 && connectedPowerKw > 0 && gridTariffClpKwh > 0
  const isStep3Valid = installedCapacityKwp > 0 && totalModules > 0
  const isStep4Valid = inverterEfficiencyPct > 0
  const isStep5Valid = capexClp > 0 && equipmentList.length > 0

  // Simulación de Scrapping de Boleta SAESA
  const handleScrapeSaesaBill = () => {
    setIsScrapingBill(true)
    setTimeout(() => {
      const saesaExtractedKwh = [410, 390, 425, 480, 560, 620, 640, 590, 490, 440, 400, 415]
      setMonthlyKwh(saesaExtractedKwh)
      setGridTariffClpKwh(182)
      setInjectionTariffClpKwh(98)
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
          latitude,
          longitude,
        })
        setCurrentStep(2)
      })
    } else if (currentStep === 2 && isStep2Valid) {
      startTransition(async () => {
        const monthlyData = DEFAULT_MONTHS.map((m, i) => ({
          month: m,
          kwh: monthlyKwh[i],
          costClp: Math.round(monthlyKwh[i] * gridTariffClpKwh),
        }))
        await updateProjectConsumptionAction(project.id, tariffType, connectedPowerKw, monthlyData)
        setCurrentStep(3)
      })
    } else if (currentStep === 3 && isStep3Valid) {
      setCurrentStep(4)
    } else if (currentStep === 4 && isStep4Valid) {
      setCurrentStep(5)
    } else if (currentStep === 5 && isStep5Valid) {
      setCurrentStep(6)
    } else if (currentStep === 6) {
      setCurrentStep(7)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any)
    }
  }

  return (
    <div className="space-y-6">
      {/* Wizard Header Stepper con 7 Pasos */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between overflow-x-auto pb-2 sm:pb-0 gap-2">
          {[
            { step: 1, label: '1. Cliente & GPS', icon: MapPin, valid: isStep1Valid },
            { step: 2, label: '2. Consumo & Tarifa', icon: Zap, valid: isStep2Valid },
            { step: 3, label: '3. Estudio 3D Scanifly', icon: Box, valid: isStep3Valid },
            { step: 4, label: '4. Motor MinEnergía', icon: Sun, valid: isStep4Valid },
            { step: 5, label: '5. Equipamiento & CAPEX', icon: Package, valid: isStep5Valid },
            { step: 6, label: '6. Informes & Reportes', icon: FileText, valid: true },
            { step: 7, label: '7. Tramitación SEC', icon: ShieldCheck, valid: true },
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
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all select-none whitespace-nowrap ${
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
      {/* PASO 1: CLIENTE, EMPLAZAMIENTO & MAPA INTERACTIVO                         */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <Card className="rounded-[24px] border-gray-100 shadow-sm bg-white overflow-hidden animate-in fade-in-50 duration-200">
          <CardHeader className="border-b border-gray-50 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF8300]">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-[#1F1F1F]">
                  Paso 1: Información del Cliente, Emplazamiento & Coordenadas GPS
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 mt-0.5">
                  Selecciona la ubicación en el mapa o ingresa latitud/longitud para consultar el recurso solar a 1 km²
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-[#FF8300]" /> Ubicación Geográfica & Coordenadas de Muestreo (1 km²)
              </Label>
              <InteractiveLocationMap
                latitude={latitude}
                longitude={longitude}
                comunaName={comunaName}
                onChangeLocation={(lat, lng, name) => {
                  setLatitude(lat)
                  setLongitude(lng)
                  setComunaName(name)
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
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
            </div>
          </CardContent>

          <CardFooter className="border-t border-gray-50 p-4 flex justify-between">
            <span className="text-xs text-gray-400">
              {!isStep1Valid ? '⚠️ Completa el nombre del cliente para continuar' : '✓ Coordenadas y datos validados'}
            </span>
            <Button
              onClick={handleNext}
              disabled={!isStep1Valid || isPending}
              className="rounded-xl bg-[#FF8300] hover:bg-[#E67600] text-white font-semibold text-xs h-10 px-6 cursor-pointer"
            >
              Continuar al Paso 2 (Consumo)
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* PASO 2: CONSUMO ELÉCTRICO Y TARIFA MANUAL                                 */}
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
                    Paso 2: Carga de Información de Consumo Eléctrico & Tarifa
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500 mt-0.5">
                    Configura la tarifa manual $/kWh para recalcular automáticamente el precio nudo de inyección y los costos mensuales
                  </CardDescription>
                </div>
              </div>

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
                  {isScrapingBill ? 'Extrayendo Boleta...' : 'Cargar Boleta SAESA (OCR)'}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-orange-50/30 p-4 rounded-2xl border border-orange-100">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-gray-800">Distribuidora</Label>
                <select
                  value={distributorName}
                  onChange={(e) => setDistributorName(e.target.value)}
                  className="w-full h-9 rounded-xl border border-gray-200 bg-white px-3 text-xs"
                >
                  <option value="SAESA">SAESA (Sociedad Austral)</option>
                  <option value="FRONTEL">FRONTEL</option>
                  <option value="ENEL">ENEL Distribución</option>
                  <option value="CGE">CGE</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-gray-800">Tipo de Tarifa</Label>
                <select
                  value={tariffType}
                  onChange={(e) => setTariffType(e.target.value)}
                  className="w-full h-9 rounded-xl border border-gray-200 bg-white px-3 text-xs"
                >
                  <option value="BT1">BT1 (Residencial Simple)</option>
                  <option value="BT2">BT2 (Potencia Contratada)</option>
                  <option value="BT3">BT3 (Potencia Leída)</option>
                  <option value="BT4_3">BT4.3 (Horaria Punta/Fuera)</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-gray-800 flex items-center justify-between">
                  <span>Costo Suministro ($/kWh)</span>
                  <span className="text-[10px] text-[#FF8300] font-normal">Compra a Red</span>
                </Label>
                <Input
                  type="number"
                  value={gridTariffClpKwh}
                  onChange={(e) => handleGridTariffChange(Number(e.target.value))}
                  className="h-9 rounded-xl bg-white border-gray-200 text-xs font-black text-[#1F1F1F]"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-gray-800 flex items-center justify-between">
                  <span>Precio Inyección ($/kWh)</span>
                  <span className="text-[10px] text-emerald-600 font-normal">Autocalculado</span>
                </Label>
                <Input
                  type="number"
                  value={injectionTariffClpKwh}
                  onChange={(e) => setInjectionTariffClpKwh(Number(e.target.value))}
                  className="h-9 rounded-xl bg-white border-gray-200 text-xs font-black text-emerald-600"
                />
              </div>
            </div>

            {/* Matriz 12 Meses */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Consumo Mes a Mes (kWh) & Costo Facturación Calculado (${gridTariffClpKwh} /kWh)
                </Label>
                <span className="text-xs font-bold text-[#FF8300]">
                  Total Anual: {annualConsumptionKwh.toLocaleString('es-CL')} kWh/año (~${Math.round(annualConsumptionKwh * gridTariffClpKwh).toLocaleString('es-CL')} CLP)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {DEFAULT_MONTHS.map((m, idx) => {
                  const monthlyCost = Math.round(monthlyKwh[idx] * gridTariffClpKwh)
                  return (
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
                      <span className="text-[10px] font-semibold text-emerald-700 block">
                        ${monthlyCost.toLocaleString('es-CL')}
                      </span>
                    </div>
                  )
                })}
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
              Continuar al Paso 3 (Estudio 3D Scanifly)
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* PASO 3: ESTUDIO 3D SCANIFLY (TECHUMBRE, SOMBRAS, LAYOUT & STRINGS)        */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <Card className="rounded-[24px] border-gray-100 shadow-sm bg-white overflow-hidden animate-in fade-in-50 duration-200">
          <CardHeader className="border-b border-gray-50 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF8300]">
                <Box className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-[#1F1F1F]">
                  Paso 3: Estudio 3D Scanifly - Techumbre, Sombras & Stringing Eléctrico
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 mt-0.5">
                  Modela la techumbre en 3D, agrega obstáculos con sombras dinámicas en tiempo real y asigna strings eléctricos
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <Scanifly3DStudio
              latitude={latitude}
              longitude={longitude}
              initialTiltDeg={roofAngleDeg}
              initialAzimuthDeg={0}
              roofType={roofType}
              isCoplanar={isCoplanar}
              onDesignChange={(res) => {
                setInstalledCapacityKwp(res.installedCapacityKwp)
                setTotalModules(res.totalModules)
                setShadingLossPct(res.shadingFactorPct)
                setSolarAccessPct(res.solarAccessPct)
                setTiltDeg(res.tiltDeg)
                setAzimuthDeg(res.azimuthDeg)
                setStrings(res.strings)
              }}
            />
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
              Continuar al Paso 4 (Motor MinEnergía)
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* PASO 4: FORMULARIO DE GENERACIÓN FV (MODELOS MINENERGÍA / NREL)           */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <Card className="rounded-[24px] border-gray-100 shadow-sm bg-white overflow-hidden animate-in fade-in-50 duration-200">
          <CardHeader className="border-b border-gray-50 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF8300]">
                <Sun className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-[#1F1F1F]">
                  Paso 4: Simulación de Rendimiento Físico (MinEnergía / NREL / Sandia)
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 mt-0.5">
                  El motor físico integra la potencia real ({installedCapacityKwp} kWp) y las pérdidas por sombreado 3D ({shadingLossPct}%)
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
                2. Calibración de Albedo & Coeficientes Térmicos
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                  <Label className="text-xs text-gray-600">Pérdidas Totales (Con Sombreado 3D)</Label>
                  <Input
                    type="text"
                    disabled
                    value={`${(systemLossesPct + shadingLossPct).toFixed(1)}% (18% BOS + ${shadingLossPct}% Sombras 3D)`}
                    className="h-9 rounded-xl bg-gray-100 text-xs font-bold text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Resumen de Generación Calculada en Vivo */}
            <div className="p-4 bg-orange-50/40 rounded-2xl border border-orange-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-[#FF8300]" /> Generación Estimada Neta (MinEnergía):
                </span>
                <p className="text-xs text-gray-600">
                  Rendimiento Específico: <strong>{simResults.specificYieldKwhKwp} kWh/kWp/año</strong> • Factor de Planta: <strong>{simResults.capacityFactorPct}%</strong> • Solar Access: <strong>{solarAccessPct}%</strong>
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
              disabled={!isStep4Valid || isPending}
              className="rounded-xl bg-[#FF8300] hover:bg-[#E67600] text-white font-semibold text-xs h-10 px-6 cursor-pointer"
            >
              Continuar al Paso 5 (Equipamiento & CAPEX)
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* PASO 5: EQUIPAMIENTO, SERVICIOS & CAPEX A MEDIDA (TEMPLATES)              */}
      {/* ========================================================================= */}
      {currentStep === 5 && (
        <Card className="rounded-[24px] border-gray-100 shadow-sm bg-white overflow-hidden animate-in fade-in-50 duration-200">
          <CardHeader className="border-b border-gray-50 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF8300]">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-[#1F1F1F]">
                  Paso 5: Selección de Equipamiento, Servicios & Presupuesto CAPEX
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 mt-0.5">
                  Elige una plantilla preconfigurada SoldeRío o personaliza las partidas de módulos, inversores, baterías y montaje
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <EquipmentCapexTab
              initialPvKwp={installedCapacityKwp}
              roofType={roofType}
              isCoplanar={isCoplanar}
              onEquipmentChange={(items, total, tmplName) => {
                setEquipmentList(items)
                setCapexClp(total)
                if (tmplName) setSelectedTemplateName(tmplName)
              }}
            />
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
              disabled={!isStep5Valid || isPending}
              className="rounded-xl bg-[#FF8300] hover:bg-[#E67600] text-white font-semibold text-xs h-10 px-6 cursor-pointer"
            >
              Continuar al Paso 6 (Informes & Reportes)
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* PASO 6: GENERADOR DE INFORMES (4 INFORMES: SCANIFLY 3D, AHORRO, PV, EPC)  */}
      {/* ========================================================================= */}
      {currentStep === 6 && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                onClick={() => setActiveReportTab('SHADING_3D')}
                className={`rounded-xl text-xs font-semibold cursor-pointer ${
                  activeReportTab === 'SHADING_3D'
                    ? 'bg-[#FF8300] hover:bg-[#E67600] text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Box className="h-3.5 w-3.5 mr-1.5" />
                1. Sombreado 3D & Strings (Scanifly)
              </Button>

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
                2. Ahorro en Boleta (MinEnergía)
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
                3. Generación FV (Explorador)
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
                4. Propuesta Llave en Mano EPC
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
                Ir a Tramitación SEC (Paso 7)
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* Renderizado de Reporte Seleccionado */}
          {activeReportTab === 'SHADING_3D' && (
            <ScaniflyShadingReport
              clientName={clientName}
              clientRut={clientRut}
              comunaName={comunaName}
              latitude={latitude}
              longitude={longitude}
              installedCapacityKwp={installedCapacityKwp}
              totalModules={totalModules}
              tiltDeg={tiltDeg}
              azimuthDeg={azimuthDeg}
              shadingLossPct={shadingLossPct}
              solarAccessPct={solarAccessPct}
              strings={strings}
              stringingValidation={stringingValidation}
            />
          )}

          {activeReportTab === 'SAVINGS' && (
            <EconomicSavingsReport
              clientName={clientName}
              clientRut={clientRut}
              comunaName={comunaName}
              distributorName={distributorName}
              tariffType={tariffType}
              gridTariffClpKwh={gridTariffClpKwh}
              injectionTariffClpKwh={injectionTariffClpKwh}
              monthlyKwh={monthlyKwh}
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
              equipmentList={equipmentList}
              capexClp={capexClp}
              templateName={selectedTemplateName}
            />
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PASO 7: TRAMITACIÓN SEC & DISTRIBUIDORA (LEY 20.571 / 21.118)             */}
      {/* ========================================================================= */}
      {currentStep === 7 && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <Badge className="bg-orange-50 text-[#FF8300] border-orange-200 text-xs">
                Paso 7: Cumplimiento Regulatorio & Trámites SEC (Ley 20.571 / 21.118)
              </Badge>
              <p className="text-xs text-gray-500 mt-1">
                Sube la documentación de respaldo y genera los antecedentes para el e-Declarador SEC (TE4)
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(6)}
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
