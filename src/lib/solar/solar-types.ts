export type ChileanRegion = 
  | 'Los Ríos'
  | 'Los Lagos'
  | 'La Araucanía'
  | 'Aysén'
  | 'Biobío'
  | 'Metropolitana'

export type ChileanComuna = 
  | 'Valdivia'
  | 'Puerto Varas'
  | 'Puerto Montt'
  | 'Osorno'
  | 'Castro'
  | 'Temuco'
  | 'Villarrica'
  | 'Panguipulli'
  | 'La Unión'
  | 'Río Bueno'
  | 'Ancud'
  | 'Santiago'

export type ChileanDistributor = 
  | 'SAESA'
  | 'FRONTEL'
  | 'LUZ_OSORNO'
  | 'CRELL'
  | 'CGE'
  | 'ENEL'
  | 'EDELAYSEN'

export type ChileanTariff = 
  | 'BT1'
  | 'BT2'
  | 'BT3'
  | 'BT4_1'
  | 'BT4_2'
  | 'BT4_3'
  | 'AT3'
  | 'AT4_3'

export interface MonthlyConsumptionRecord {
  month: string // 'Ene', 'Feb', etc.
  kwh: number
  costClp: number
  peakKw?: number
}

export interface MonthlySolarResource {
  month: string
  ghiKwhM2: number // Global Horizontal Irradiation
  dniKwhM2: number // Direct Normal Irradiation
  dhiKwhM2: number // Diffuse Horizontal Irradiation
  tempCelsius: number
  hspDaily: number // Peak Sun Hours (h/day)
}

export interface SolarModuleSpec {
  id: string
  brand: string
  model: string
  powerW: number
  efficiencyPct: number
  tempCoeffPctPerC: number // e.g. -0.35%/C
  widthM: number
  heightM: number
  bifacialGainPct: number // e.g. 10%
  tier1: boolean
  warrantyYears: number
}

export interface InverterSpec {
  id: string
  brand: string
  model: string
  nominalPowerKw: number
  type: 'STRING' | 'MICRO' | 'HYBRID'
  phase: 'MONO' | 'TRI'
  efficiencyPct: number
  secCertified: boolean
  antiIslaCertified: boolean
  mpptCount: number
}

export interface SizingScenarioResult {
  id: number
  title: string
  tagline: string
  description: string
  recommended?: boolean
  kwp: number
  numPanels: number
  moduleSpec: SolarModuleSpec
  inverterSpec: InverterSpec
  tiltDeg: number
  azimuthDeg: number
  systemLossPct: number
  annualGenerationKwh: number
  monthlyGenerationKwh: { month: string; kwh: number }[]
  selfConsumptionPct: number
  gridInjectionPct: number
  directSavingsAnnualClp: number
  injectionIncomeAnnualClp: number
  totalAnnualSavingsClp: number
  capexClp: number
  capexUsd: number
  opexAnnualClp: number
  simplePaybackYears: number
  dynamicPaybackYears: number
  npv25yClp: number
  irrPct: number
  lcoeClpKwh: number
  co2AvoidedTonsPerYear: number
}

export interface FinancialCashflowYear {
  year: number
  generationKwh: number
  gridTariffClpKwh: number
  injectionTariffClpKwh: number
  directSavingsClp: number
  injectionIncomeClp: number
  grossSavingsClp: number
  opexClp: number
  netSavingsClp: number
  cumulativeCashflowClp: number
  discountedCashflowClp: number
}
