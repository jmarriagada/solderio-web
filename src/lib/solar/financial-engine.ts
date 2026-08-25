import { FinancialCashflowYear, SizingScenarioResult } from './solar-types'

export interface CashflowEngineOptions {
  inflationRatePct?: number // e.g. 3.0%
  tariffEscalationRatePct?: number // e.g. 3.5%
  discountRatePct?: number // e.g. 6.0%
  moduleDegradationPctPerYear?: number // e.g. 0.5%
  gridTariffClpKwh?: number // e.g. 175
  injectionTariffClpKwh?: number // e.g. 95
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

    // OPEX escalates with general inflation
    const yearOpex = Math.round(scenario.opexAnnualClp * Math.pow(1 + 0.03, yr - 1))
    const netSavings = grossSavings - yearOpex

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
