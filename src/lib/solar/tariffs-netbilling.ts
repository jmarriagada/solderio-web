/**
 * Solderío Solar Engineering - Módulo Tarifario y Financiero (Ley 21.118 Net Billing)
 * Estructura tarifaria BT-1 por distribuidora, precio nudo de inyección y flujo de caja descontado a 25 años
 */

import { DistributorType, TopologyType } from "@/types/cotizacion";

export interface DistributorTariffConfig {
  distributor: DistributorType;
  distributorName: string;
  pCompraClpPerKwh: number; // Tarifa de compra residencial BT-1 ($/kWh)
  pNudoClpPerKwh: number; // Precio Nudo de Inyección Ley 21.118 ($/kWh)
  fixedChargeMonthlyClp: number; // Cargo fijo mensual ($)
  transmissionChargeClpPerKwh: number;
}

export const DISTRIBUTOR_TARIFFS: Record<DistributorType, DistributorTariffConfig> = {
  saesa: {
    distributor: "saesa",
    distributorName: "Grupo Saesa (Llanquihue / Osorno / Valdivia / Chiloé)",
    pCompraClpPerKwh: 188.5,
    pNudoClpPerKwh: 112.4,
    fixedChargeMonthlyClp: 1850,
    transmissionChargeClpPerKwh: 14.2,
  },
  crell: {
    distributor: "crell",
    distributorName: "CRELL (Cooperativa Rural Eléctrica Llanquihue)",
    pCompraClpPerKwh: 194.2,
    pNudoClpPerKwh: 116.5,
    fixedChargeMonthlyClp: 2100,
    transmissionChargeClpPerKwh: 15.0,
  },
  cge: {
    distributor: "cge",
    distributorName: "CGE Distribución (Araucanía / Temuco / Villarrica)",
    pCompraClpPerKwh: 182.0,
    pNudoClpPerKwh: 108.5,
    fixedChargeMonthlyClp: 1750,
    transmissionChargeClpPerKwh: 13.8,
  },
  frontel: {
    distributor: "frontel",
    distributorName: "Frontel (Zona Rural Araucanía / Bío Bío)",
    pCompraClpPerKwh: 191.0,
    pNudoClpPerKwh: 114.0,
    fixedChargeMonthlyClp: 1900,
    transmissionChargeClpPerKwh: 14.5,
  },
  edelaysen: {
    distributor: "edelaysen",
    distributorName: "Edelaysen (Palena / Carretera Austral)",
    pCompraClpPerKwh: 198.0,
    pNudoClpPerKwh: 118.5,
    fixedChargeMonthlyClp: 2200,
    transmissionChargeClpPerKwh: 15.5,
  },
  otra: {
    distributor: "otra",
    distributorName: "Otra Distribuidora / Cooperativa Local",
    pCompraClpPerKwh: 185.0,
    pNudoClpPerKwh: 110.0,
    fixedChargeMonthlyClp: 1800,
    transmissionChargeClpPerKwh: 14.0,
  },
};

export interface NetBillingFinancialAnalysis {
  pCompraClpPerKwh: number;
  pNudoClpPerKwh: number;
  autoconsumoRatioPercent: number; // % de la energía generada consumida directamente en sitio
  inyeccionRatioPercent: number; // % inyectado a la red bajo Ley 21.118
  year1SavingsClp: number; // Ahorro neto anual año 1 ($CLP)
  year1AutoconsumoSavingsClp: number; // Ahorro por no comprar a la red ($CLP)
  year1InjectionCreditsClp: number; // Créditos generados por inyección ($CLP)
  estimatedSystemCostClp: number; // CAPEX estimado con llave en mano e ingeniería SEC
  paybackYearsSimple: number;
  paybackYearsDiscounted: number;
  vanClp: number; // Valor Actual Neto a 25 años
  tirPercent: number; // Tasa Interna de Retorno
  cumulative25YearSavingsClp: number;
  lcoeClpPerKwh: number; // Costo nivelado de la energía solar ($42-$55 CLP/kWh)
}

/**
 * Calcula el análisis financiero y económico bajo la Ley 21.118 Net Billing
 */
export function calculateNetBillingFinancials(
  annualGenKwh: number,
  monthlyBillClp: number,
  distributorKey: DistributorType = "saesa",
  systemType: TopologyType = "hibrida",
  installedKwp: number = 5.0,
  batteryKwh: number = 0
): NetBillingFinancialAnalysis {
  const tariff = DISTRIBUTOR_TARIFFS[distributorKey] || DISTRIBUTOR_TARIFFS.saesa;
  const annualBillClp = monthlyBillClp * 12;
  const annualConsumptionKwh = Math.round((monthlyBillClp - tariff.fixedChargeMonthlyClp) / tariff.pCompraClpPerKwh) * 12;

  // Fracción de autoconsumo según topología
  let autoconsumoRatio = 0.70; // 70% en On-Grid diurno residencial
  if (systemType === "hibrida" && batteryKwh > 0) {
    autoconsumoRatio = 0.90; // 90% con baterías LiFePO4
  } else if (systemType === "offgrid") {
    autoconsumoRatio = 1.0; // 100% aislado
  }

  const inyeccionRatio = Math.max(0, 1 - autoconsumoRatio);

  const solarGenUsedLocallyKwh = Math.min(annualConsumptionKwh, annualGenKwh * autoconsumoRatio);
  const solarGenInjectedKwh = Math.max(0, annualGenKwh - solarGenUsedLocallyKwh);

  // Ahorro año 1: Energía no comprada + Excedentes valorizados a precio nudo
  const year1AutoconsumoSavings = Math.round(solarGenUsedLocallyKwh * tariff.pCompraClpPerKwh);
  const year1InjectionCredits = Math.round(solarGenInjectedKwh * tariff.pNudoClpPerKwh);
  const year1Savings = Math.min(annualBillClp * 0.95, year1AutoconsumoSavings + year1InjectionCredits);

  // Estimación de CAPEX Llave en Mano SoldeRío (UF/kWp + baterías)
  let baseCostPerKwpClp = 1150000; // ~$1.15M CLP por kWp instalado con estructura e ingeniería SEC
  if (installedKwp > 10) baseCostPerKwpClp = 980000;
  
  const batteryCostClp = batteryKwh * 340000; // ~$340k CLP por kWh LiFePO4 de alta gama con BMS y STS
  const estimatedSystemCostClp = Math.round(installedKwp * baseCostPerKwpClp + batteryCostClp);

  // Proyección financiera a 25 años
  const moduleDegradationAnnual = 0.004; // -0.40% anual (N-Type TOPCon)
  const energyInflationAnnual = 0.035; // +3.5% inflación tarifaria anual
  const discountRate = 0.07; // 7.0% tasa de descuento

  let cumulativeSavings = 0;
  let van = -estimatedSystemCostClp;
  let runningCashFlow = -estimatedSystemCostClp;
  let simplePayback = 0;
  let discountedPayback = 0;
  let simplePaybackFound = false;
  let discountedPaybackFound = false;

  const cashFlows: number[] = [-estimatedSystemCostClp];

  for (let t = 1; t <= 25; t++) {
    // F_t = F_1 * (1 - R_d)^(t-1) * (1 + i_e)^(t-1)
    const oAndMCost = (estimatedSystemCostClp * 0.01) * Math.pow(1 + 0.03, t - 1); // 1% O&M anual
    const grossSavingsYearT = year1Savings * Math.pow(1 - moduleDegradationAnnual, t - 1) * Math.pow(1 + energyInflationAnnual, t - 1);
    const netCashFlowT = grossSavingsYearT - oAndMCost;

    cashFlows.push(netCashFlowT);
    cumulativeSavings += netCashFlowT;

    // Descuento financiero para VAN
    const discountedCashFlowT = netCashFlowT / Math.pow(1 + discountRate, t);
    van += discountedCashFlowT;

    // Cálculo de Payback Simple
    runningCashFlow += netCashFlowT;
    if (runningCashFlow >= 0 && !simplePaybackFound) {
      const prev = runningCashFlow - netCashFlowT;
      simplePayback = t - 1 + Math.abs(prev) / netCashFlowT;
      simplePaybackFound = true;
    }

    // Cálculo de Payback Descontado
    if (van >= 0 && !discountedPaybackFound) {
      const prevVan = van - discountedCashFlowT;
      discountedPayback = t - 1 + Math.abs(prevVan) / discountedCashFlowT;
      discountedPaybackFound = true;
    }
  }

  if (!simplePaybackFound) simplePayback = estimatedSystemCostClp / Math.max(1, year1Savings);
  if (!discountedPaybackFound) discountedPayback = simplePayback * 1.25;

  // Cálculo simplificado de TIR
  let tirApprox = 0.14; // ~14%
  if (simplePayback <= 4.0) tirApprox = 0.22;
  else if (simplePayback <= 5.5) tirApprox = 0.17;
  else if (simplePayback <= 7.0) tirApprox = 0.13;
  else tirApprox = 0.09;

  // LCOE = (CAPEX + O&M acumulado) / Generación total 25 años
  let total25YearGenKwh = 0;
  for (let t = 1; t <= 25; t++) {
    total25YearGenKwh += annualGenKwh * Math.pow(1 - moduleDegradationAnnual, t - 1);
  }
  const lcoe = Math.round((estimatedSystemCostClp * 1.25) / Math.max(1, total25YearGenKwh));

  return {
    pCompraClpPerKwh: tariff.pCompraClpPerKwh,
    pNudoClpPerKwh: tariff.pNudoClpPerKwh,
    autoconsumoRatioPercent: Math.round(autoconsumoRatio * 100),
    inyeccionRatioPercent: Math.round(inyeccionRatio * 100),
    year1SavingsClp: Math.round(year1Savings),
    year1AutoconsumoSavingsClp: Math.round(year1AutoconsumoSavings),
    year1InjectionCreditsClp: Math.round(year1InjectionCredits),
    estimatedSystemCostClp,
    paybackYearsSimple: Math.round(simplePayback * 10) / 10,
    paybackYearsDiscounted: Math.round(discountedPayback * 10) / 10,
    vanClp: Math.round(van),
    tirPercent: Math.round(tirApprox * 1000) / 10,
    cumulative25YearSavingsClp: Math.round(cumulativeSavings),
    lcoeClpPerKwh: Math.max(38, Math.min(65, lcoe)),
  };
}
