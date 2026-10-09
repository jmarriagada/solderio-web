import { FinancialCashflowYear, SizingScenarioResult } from './solar-types'

export interface CashflowEngineOptions {
  inflationRatePct?: number // e.g. 3.0%
  tariffEscalationRatePct?: number // e.g. 3.5%
  discountRatePct?: number // e.g. 6.0% (residencial) o 10.0% (comercial)
  moduleDegradationPctPerYear?: number // e.g. 0.4% - 0.5%
  gridTariffClpKwh?: number // e.g. 175
  injectionTariffClpKwh?: number // e.g. 95
  inverterReplacementYear?: number // año 12 estándar industrial
  inverterReplacementCostPct?: number // ~12% del CAPEX
  includeTaxShieldArt33Bis?: boolean // true para B2B
  taxShieldPct?: number // 4% o 6% sobre activo fijo
}

export function generate25YearCashflow(
  scenario: SizingScenarioResult,
  options: CashflowEngineOptions = {}
): FinancialCashflowYear[] {
  const {
    tariffEscalationRatePct = 3.2,
    discountRatePct = 6.0,
    moduleDegradationPctPerYear = 0.5,
    gridTariffClpKwh = 175,
    injectionTariffClpKwh = 95,
    inverterReplacementYear = 12,
    inverterReplacementCostPct = 0.12,
    includeTaxShieldArt33Bis = false,
    taxShieldPct = 0.05,
  } = options

  const discountRate = discountRatePct / 100
  const escalationRate = tariffEscalationRatePct / 100
  const degradationRate = moduleDegradationPctPerYear / 100

  const cashflow: FinancialCashflowYear[] = []
  let cumulativeCashflow = -scenario.capexClp
  let cumulativeDiscounted = -scenario.capexClp

  // Year 0 (Investment)
  cashflow.push({
    year: 0,
    generationKwh: 0,
    gridTariffClpKwh: gridTariffClpKwh,
    injectionTariffClpKwh: injectionTariffClpKwh,
    directSavingsClp: 0,
    injectionIncomeClp: 0,
    grossSavingsClp: 0,
    opexClp: 0,
    netSavingsClp: -scenario.capexClp,
    cumulativeCashflowClp: Math.round(cumulativeCashflow),
    discountedCashflowClp: Math.round(cumulativeDiscounted),
  })

  // Years 1 to 25
  const baseSelfConsumedKwh = scenario.annualGenerationKwh * (scenario.selfConsumptionPct / 100)
  const baseInjectedKwh = scenario.annualGenerationKwh * (scenario.gridInjectionPct / 100)

  for (let yr = 1; yr <= 25; yr++) {
    const degradation = Math.pow(1 - degradationRate, yr - 1)
    const yearGenKwh = Math.round(scenario.annualGenerationKwh * degradation)
    
    const yearGridTariff = gridTariffClpKwh * Math.pow(1 + escalationRate, yr - 1)
    const yearInjectionTariff = injectionTariffClpKwh * Math.pow(1 + escalationRate, yr - 1)

    const yearSelfConsumed = baseSelfConsumedKwh * degradation
    const yearInjected = baseInjectedKwh * degradation

    const directSavings = Math.round(yearSelfConsumed * yearGridTariff)
    const injectionIncome = Math.round(yearInjected * yearInjectionTariff)
    const grossSavings = directSavings + injectionIncome

    // Costo extraordinario de recambio de inversor en el año 12 (~12% CAPEX)
    const inverterReplacementCost = (yr === inverterReplacementYear)
      ? Math.round(scenario.capexClp * inverterReplacementCostPct)
      : 0

    // OPEX base escalado por inflación + recambio de inversor si corresponde
    const baseOpex = Math.round(scenario.opexAnnualClp * Math.pow(1 + 0.03, yr - 1))
    const yearOpex = baseOpex + inverterReplacementCost

    // Escudo tributario Art. 33 bis LIR (Crédito tributario 4%-6% sobre activo fijo en año 1 para B2B)
    const taxShieldArt33Bis = (includeTaxShieldArt33Bis && yr === 1)
      ? Math.round(scenario.capexClp * taxShieldPct)
      : 0

    const netSavings = grossSavings - yearOpex + taxShieldArt33Bis

    cumulativeCashflow += netSavings
    const discountedYearNet = netSavings / Math.pow(1 + discountRate, yr)
    cumulativeDiscounted += discountedYearNet

    cashflow.push({
      year: yr,
      generationKwh: yearGenKwh,
      gridTariffClpKwh: Math.round(yearGridTariff),
      injectionTariffClpKwh: Math.round(yearInjectionTariff),
      directSavingsClp: directSavings,
      injectionIncomeClp: injectionIncome,
      grossSavingsClp: grossSavings,
      opexClp: yearOpex,
      netSavingsClp: netSavings,
      cumulativeCashflowClp: Math.round(cumulativeCashflow),
      discountedCashflowClp: Math.round(cumulativeDiscounted),
    })
  }

  return cashflow
}
