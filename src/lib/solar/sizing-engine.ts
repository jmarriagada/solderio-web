import { 
  MonthlyConsumptionRecord, 
  SizingScenarioResult, 
  SolarModuleSpec, 
  InverterSpec 
} from './solar-types'
import { getSolarDataset, calculateTranspositionFactor } from './weather-engine'

// Default standard Tier 1 hardware in Chile
export const DEFAULT_MODULE_SPEC: SolarModuleSpec = {
  id: 'MOD_TIER1_550W',
  brand: 'Trina Solar / Jinko',
  model: 'Vertex S+ / Tiger Neo 550W Bifacial',
  powerW: 550,
  efficiencyPct: 21.8,
  tempCoeffPctPerC: -0.34,
  widthM: 1.134,
  heightM: 2.278,
  bifacialGainPct: 8.0,
  tier1: true,
  warrantyYears: 25,
}

export const DEFAULT_INVERTERS: Record<string, InverterSpec> = {
  MICRO: {
    id: 'INV_ENPHASE_IQ8',
    brand: 'Enphase / Hoymiles',
    model: 'Microinversor IQ8 / HMS-2000 Homologado SEC',
    nominalPowerKw: 2.0,
    type: 'MICRO',
    phase: 'MONO',
    efficiencyPct: 97.2,
    secCertified: true,
    antiIslaCertified: true,
    mpptCount: 4,
  },
  STRING_3KW: {
    id: 'INV_FRONIUS_PRIMO_3',
    brand: 'Fronius',
    model: 'Primo 3.0-1 Monofásico con Anti-Isla SEC',
    nominalPowerKw: 3.0,
    type: 'STRING',
    phase: 'MONO',
    efficiencyPct: 98.0,
    secCertified: true,
    antiIslaCertified: true,
    mpptCount: 2,
  },
  STRING_5KW: {
    id: 'INV_HUAWEI_5KTL',
    brand: 'Huawei',
    model: 'SUN2000-5KTL-L1 Monofásico / Híbrido SEC',
    nominalPowerKw: 5.0,
    type: 'HYBRID',
    phase: 'MONO',
    efficiencyPct: 98.4,
    secCertified: true,
    antiIslaCertified: true,
    mpptCount: 2,
  },
  STRING_10KW: {
    id: 'INV_HUAWEI_10KTL',
    brand: 'Huawei',
    model: 'SUN2000-10KTL-M1 Trifásico 380V Certificado SEC',
    nominalPowerKw: 10.0,
    type: 'STRING',
    phase: 'TRI',
    efficiencyPct: 98.6,
    secCertified: true,
    antiIslaCertified: true,
    mpptCount: 2,
  },
}

export interface SizingEngineParams {
  annualConsumptionKwh: number
  monthlyConsumption: MonthlyConsumptionRecord[]
  comunaName: string
  distributorName: string
  gridTariffClpKwh?: number // e.g. 175 CLP/kWh
  injectionTariffClpKwh?: number // e.g. 95 CLP/kWh (costo de nudo de energía SEC)
  tiltDeg?: number
  azimuthDeg?: number
  systemLossPct?: number // e.g. 16%
  fixedCapexTargetClp?: number
}

export function computeSolarScenarios(params: SizingEngineParams): SizingScenarioResult[] {
  const {
    annualConsumptionKwh,
    monthlyConsumption,
    comunaName,
    distributorName,
    gridTariffClpKwh = 175,
    injectionTariffClpKwh = 95,
    tiltDeg = 35,
    azimuthDeg = 0,
    systemLossPct = 16.0,
    fixedCapexTargetClp = 4500000,
  } = params

  const weather = getSolarDataset(comunaName)
  const transFactor = calculateTranspositionFactor(weather.optimalTiltDeg, tiltDeg, azimuthDeg)

  // Annual specific yield (kWh/kWp/year)
  const derateFactor = (1 - systemLossPct / 100) * (1 + DEFAULT_MODULE_SPEC.bifacialGainPct / 100)
  const baseAnnualYieldKwhKwp = (weather.annualGhiKwhM2 * transFactor * derateFactor)

  // EPC turnkey cost benchmarks in Chile (CLP per Wp installed)
  // Residential: ~$850 - $950 CLP/Wp. C&I: ~$700 - $800 CLP/Wp.
  const costPerWpClp = annualConsumptionKwh > 25000 ? 750 : 880
  const usdExchangeRate = 950

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  const calculateScenario = (
    id: number,
    title: string,
    tagline: string,
    description: string,
    targetKwp: number,
    inverter: InverterSpec,
    recommended: boolean = false
  ): SizingScenarioResult => {
    const kwp = Math.max(1.1, Math.round(targetKwp * 10) / 10)
    const numPanels = Math.ceil((kwp * 1000) / DEFAULT_MODULE_SPEC.powerW)

    // Monthly generation calculation
    const monthlyGenerationKwh = weather.monthlyResources.map((res, idx) => {
      const monthGen = Math.round(kwp * res.hspDaily * daysInMonth[idx] * transFactor * derateFactor)
      return {
        month: res.month,
        kwh: monthGen,
      }
    })

    const annualGenerationKwh = monthlyGenerationKwh.reduce((acc, m) => acc + m.kwh, 0)

    // Self-consumption vs Grid injection balance
    // Diurnal factor in Chile: residential ~45-60%, commercial ~70-85%
    const isCommercial = annualConsumptionKwh > 25000
    const diurnalRatio = isCommercial ? 0.75 : 0.50

    let totalDirectSavingsClp = 0
    let totalInjectionIncomeClp = 0
    let totalSelfConsumedKwh = 0

    monthlyGenerationKwh.forEach((gen, idx) => {
      const cons = monthlyConsumption[idx]?.kwh || (annualConsumptionKwh / 12)
      const daytimeCons = cons * diurnalRatio
      
      const selfConsumed = Math.min(gen.kwh, daytimeCons)
      const injected = Math.max(0, gen.kwh - selfConsumed)

      totalSelfConsumedKwh += selfConsumed
      totalDirectSavingsClp += selfConsumed * gridTariffClpKwh
      totalInjectionIncomeClp += injected * injectionTariffClpKwh
    })

    const selfConsumptionPct = Math.round((totalSelfConsumedKwh / annualGenerationKwh) * 100)
    const gridInjectionPct = 100 - selfConsumptionPct
    const totalAnnualSavingsClp = totalDirectSavingsClp + totalInjectionIncomeClp

    // CAPEX and OPEX
    const capexClp = Math.round(kwp * 1000 * costPerWpClp)
    const capexUsd = Math.round(capexClp / usdExchangeRate)
    const opexAnnualClp = Math.round(capexClp * 0.012) // 1.2% annual maintenance & insurance

    // Financial Metrics
    const netYear1Savings = totalAnnualSavingsClp - opexAnnualClp
    const simplePaybackYears = Math.round((capexClp / Math.max(1, netYear1Savings)) * 10) / 10

    // Discounted Payback & NPV @ 6% discount rate over 25 years
    const discountRate = 0.06
    let npv25yClp = -capexClp
    let dynamicPaybackYears = 25
    let cumulativeDiscounted = -capexClp

    for (let yr = 1; yr <= 25; yr++) {
      const degradation = Math.pow(1 - 0.005, yr - 1) // 0.5% degradation
      const tariffEscalation = Math.pow(1 + 0.03, yr - 1) // 3.0% tariff inflation
      const yearCashflow = (netYear1Savings * degradation * tariffEscalation)
      const discountedYear = yearCashflow / Math.pow(1 + discountRate, yr)
      
      npv25yClp += discountedYear
      cumulativeDiscounted += discountedYear

      if (cumulativeDiscounted >= 0 && dynamicPaybackYears === 25) {
        dynamicPaybackYears = Math.round((yr - 1 + (-cumulativeDiscounted + discountedYear) / discountedYear) * 10) / 10
      }
    }

    // IRR (TIR) approximation
    const irrPct = Math.round(((netYear1Savings / capexClp) * 100 + 3.5) * 10) / 10

    // LCOE: Total lifecycle cost / Total lifecycle generation
    const totalLifecycleGeneration = annualGenerationKwh * 23.5 // 25 years with degradation
    const totalLifecycleCost = capexClp + opexAnnualClp * 25
    const lcoeClpKwh = Math.round(totalLifecycleCost / totalLifecycleGeneration)

    // CO2 avoided (Chile SEN grid factor: ~0.385 kg CO2e / kWh)
    const co2AvoidedTonsPerYear = Math.round((annualGenerationKwh * 0.385) / 100) / 10

    return {
      id,
      title,
      tagline,
      description,
      recommended,
      kwp,
      numPanels,
      moduleSpec: DEFAULT_MODULE_SPEC,
      inverterSpec: inverter,
      tiltDeg,
      azimuthDeg,
      systemLossPct,
      annualGenerationKwh,
      monthlyGenerationKwh,
      selfConsumptionPct,
      gridInjectionPct,
      directSavingsAnnualClp: Math.round(totalDirectSavingsClp),
      injectionIncomeAnnualClp: Math.round(totalInjectionIncomeClp),
      totalAnnualSavingsClp: Math.round(totalAnnualSavingsClp),
      capexClp,
      capexUsd,
      opexAnnualClp,
      simplePaybackYears,
      dynamicPaybackYears,
      npv25yClp: Math.round(npv25yClp),
      irrPct,
      lcoeClpKwh,
      co2AvoidedTonsPerYear,
    }
  }

  // 1. Escenario 100% Autoconsumo Diurno (Cero o mínima inyección)
  const sc1Kwp = (annualConsumptionKwh * 0.50) / baseAnnualYieldKwhKwp
  const sc1 = calculateScenario(
    1,
    '100% Autoconsumo Diurno',
    'Cero Inyección / Independencia Inmediata',
    'Dimensionado para abastecer exclusivamente el consumo diurno del cliente sin depender de la venta de excedentes a la distribuidora.',
    sc1Kwp,
    sc1Kwp <= 3.5 ? DEFAULT_INVERTERS.STRING_3KW : DEFAULT_INVERTERS.STRING_5KW,
    false
  )

  // 2. Escenario Net Billing Óptimo (Ley 20.571 - Maximizar VAN)
  const sc2Kwp = (annualConsumptionKwh * 0.95) / baseAnnualYieldKwhKwp
  const sc2 = calculateScenario(
    2,
    'Net Billing Óptimo (Ley 20.571)',
    'Máxima Rentabilidad & Retorno de Inversión',
    'Equilibrio financiero perfecto entre autoconsumo directo e inyección valorizada a red bajo la Ley 20.571 ante SAESA/Frontel.',
    sc2Kwp,
    sc2Kwp <= 5.5 ? DEFAULT_INVERTERS.STRING_5KW : DEFAULT_INVERTERS.STRING_10KW,
    true
  )

  // 3. Escenario Máximo Espacio Disponible / Electrificación
  const sc3Kwp = (annualConsumptionKwh * 1.55) / baseAnnualYieldKwhKwp
  const sc3 = calculateScenario(
    3,
    'Máximo Espacio / Futura Carga EV',
    'Generación Total & Transición Energética',
    'Aprovecha toda la superficie disponible de techumbre o suelo para maximizar la venta de excedentes y futura carga de vehículos eléctricos.',
    sc3Kwp,
    DEFAULT_INVERTERS.STRING_10KW,
    false
  )

  // 4. Escenario Presupuesto Fijo (CAPEX Objetivo)
  const sc4Kwp = (fixedCapexTargetClp / costPerWpClp) / 1000
  const sc4 = calculateScenario(
    4,
    'Presupuesto Fijo (CAPEX Objetivo)',
    'Entrada Accesible con Expansión Modular',
    'Ajusta la capacidad fotovoltaica exactamente al capital de inversión disponible del cliente, con arquitectura escalable.',
    sc4Kwp,
    sc4Kwp <= 2.5 ? DEFAULT_INVERTERS.MICRO : DEFAULT_INVERTERS.STRING_3KW,
    false
  )

  return [sc1, sc2, sc3, sc4]
}
