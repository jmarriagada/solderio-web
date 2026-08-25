/**
 * Solderío Solar Engineering - Módulo Tarifario y Financiero (Ley 21.118 Net Billing)
 * Curva Estacional de Demanda del Sur, Mitigación de Límite de Invierno y Flujo de Caja Descontado
 */

import { DistributorType, TopologyType } from "@/types/cotizacion";

export interface DistributorTariffConfig {
  distributor: DistributorType;
  distributorName: string;
  pCompraClpPerKwh: number; // Tarifa de compra residencial BT-1 ($/kWh)
  pNudoClpPerKwh: number; // Precio Nudo de Inyección Ley 21.118 ($/kWh)
  pInviernoClpPerKwh: number; // Tarifa con recargo por Límite de Invierno ($/kWh)
  winterLimitThresholdKwh: number; // Umbral de límite de invierno (350 a 430 kWh)
  fixedChargeMonthlyClp: number; // Cargo fijo mensual ($)
  transmissionChargeClpPerKwh: number;
}

export const DISTRIBUTOR_TARIFFS: Record<DistributorType, DistributorTariffConfig> = {
  saesa: {
    distributor: "saesa",
    distributorName: "Grupo Saesa (Llanquihue / Osorno / Valdivia / Chiloé)",
    pCompraClpPerKwh: 228.0,
    pNudoClpPerKwh: 132.5,
    pInviernoClpPerKwh: 295.0,
    winterLimitThresholdKwh: 350,
    fixedChargeMonthlyClp: 2150,
    transmissionChargeClpPerKwh: 16.5,
  },
  crell: {
    distributor: "crell",
    distributorName: "CRELL (Cooperativa Rural Eléctrica Llanquihue)",
    pCompraClpPerKwh: 236.5,
    pNudoClpPerKwh: 138.0,
    pInviernoClpPerKwh: 305.0,
    winterLimitThresholdKwh: 350,
    fixedChargeMonthlyClp: 2400,
    transmissionChargeClpPerKwh: 17.2,
  },
  cge: {
    distributor: "cge",
    distributorName: "CGE Distribución (Araucanía / Temuco / Villarrica)",
    pCompraClpPerKwh: 222.0,
    pNudoClpPerKwh: 129.5,
    pInviernoClpPerKwh: 288.0,
    winterLimitThresholdKwh: 430,
    fixedChargeMonthlyClp: 1950,
    transmissionChargeClpPerKwh: 15.8,
  },
  frontel: {
    distributor: "frontel",
    distributorName: "Frontel (Zona Rural Araucanía / Bío Bío)",
    pCompraClpPerKwh: 232.0,
    pNudoClpPerKwh: 135.0,
    pInviernoClpPerKwh: 298.0,
    winterLimitThresholdKwh: 350,
    fixedChargeMonthlyClp: 2200,
    transmissionChargeClpPerKwh: 16.8,
  },
  edelaysen: {
    distributor: "edelaysen",
    distributorName: "Edelaysen (Palena / Carretera Austral)",
    pCompraClpPerKwh: 242.0,
    pNudoClpPerKwh: 140.0,
    pInviernoClpPerKwh: 310.0,
    winterLimitThresholdKwh: 350,
    fixedChargeMonthlyClp: 2500,
    transmissionChargeClpPerKwh: 18.0,
  },
  otra: {
    distributor: "otra",
    distributorName: "Otra Distribuidora / Cooperativa Local",
    pCompraClpPerKwh: 225.0,
    pNudoClpPerKwh: 132.0,
    pInviernoClpPerKwh: 290.0,
    winterLimitThresholdKwh: 350,
    fixedChargeMonthlyClp: 2100,
    transmissionChargeClpPerKwh: 16.0,
  },
};

// Ponderadores de demanda mensual para la macrozona sur (12 meses: Ene a Dic)
// Refleja el incremento por calefacción/pellet/iluminación invernal
export const SOUTHERN_CHILE_DEMAND_WEIGHTS = [
  0.82, // Ene (Verano)
  0.80, // Feb (Verano)
  0.88, // Mar (Otoño temprano)
  1.05, // Abr (Inicio frío / Límite Invierno)
  1.25, // May (Invierno frío)
  1.40, // Jun (Pico invernal)
  1.45, // Jul (Pico invernal)
  1.32, // Ago (Invierno tardío)
  1.10, // Sep (Fin de Límite Invierno)
  0.95, // Oct (Primavera)
  0.88, // Nov (Primavera)
  0.84, // Dic (Verano)
];

export interface MonthlyDemandProfile {
  month: number;
  monthName: string;
  demandKwh: number;
  isWinterLimitPeriod: boolean;
  hasWinterLimitSurchargeWithoutSolar: boolean;
}

export interface NetBillingFinancialAnalysis {
  pCompraClpPerKwh: number;
  pNudoClpPerKwh: number;
  autoconsumoRatioPercent: number; // % de la energía generada consumida directamente en sitio
  inyeccionRatioPercent: number; // % inyectado a la red bajo Ley 21.118
  year1SavingsClp: number; // Ahorro neto anual año 1 ($CLP)
  year1AutoconsumoSavingsClp: number; // Ahorro por no comprar a la red ($CLP)
  year1InjectionCreditsClp: number; // Créditos generados por inyección ($CLP)
  winterLimitSavingsClp: number; // Ahorro específico por eliminar recargo de límite de invierno
  estimatedNewMonthlyBillClp: number; // Nueva boleta promedio ($12.000 - $25.000 cargo fijo y remanente)
  estimatedSystemCostClp: number; // CAPEX estimado con llave en mano e ingeniería SEC
  paybackYearsSimple: number;
  paybackYearsDiscounted: number;
  vanClp: number; // Valor Actual Neto a 25 años
  tirPercent: number; // Tasa Interna de Retorno
  cumulative25YearSavingsClp: number;
  lcoeClpPerKwh: number; // Costo nivelado de la energía solar ($42-$55 CLP/kWh)
}

/**
 * Calcula la demanda estacional mensual de una vivienda en el sur
 */
export function calculateSouthernSeasonalDemand(
  monthlyBillClp: number,
  distributorKey: DistributorType = "saesa"
): MonthlyDemandProfile[] {
  const tariff = DISTRIBUTOR_TARIFFS[distributorKey] || DISTRIBUTOR_TARIFFS.saesa;
  const baseAvgMonthlyKwh = Math.max(80, Math.round((monthlyBillClp - tariff.fixedChargeMonthlyClp) / tariff.pCompraClpPerKwh));
  const sumWeights = SOUTHERN_CHILE_DEMAND_WEIGHTS.reduce((a, b) => a + b, 0);
  const avgWeight = sumWeights / 12;

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return SOUTHERN_CHILE_DEMAND_WEIGHTS.map((weight, idx) => {
    const month = idx + 1;
    const isWinterLimitPeriod = month >= 4 && month <= 9; // Abril a Septiembre
    const demandKwh = Math.round(baseAvgMonthlyKwh * (weight / avgWeight));
    const hasWinterLimitSurchargeWithoutSolar = isWinterLimitPeriod && demandKwh > tariff.winterLimitThresholdKwh;

    return {
      month,
      monthName: monthNames[idx],
      demandKwh,
      isWinterLimitPeriod,
      hasWinterLimitSurchargeWithoutSolar,
    };
  });
}

/**
 * Calcula el análisis financiero y económico bajo la Ley 21.118 Net Billing con Límite de Invierno
 */
export function calculateNetBillingFinancials(
  annualGenKwh: number,
  monthlyBillClp: number,
  distributorKey: DistributorType = "saesa",
  systemType: TopologyType = "hibrida",
  installedKwp: number = 5.0,
  batteryKwh: number = 0,
  monthlyDemandList?: MonthlyDemandProfile[]
): NetBillingFinancialAnalysis {
  const tariff = DISTRIBUTOR_TARIFFS[distributorKey] || DISTRIBUTOR_TARIFFS.saesa;
  const annualBillClp = monthlyBillClp * 12;

  const seasonalDemands = monthlyDemandList || calculateSouthernSeasonalDemand(monthlyBillClp, distributorKey);
  const totalAnnualDemandKwh = seasonalDemands.reduce((acc, d) => acc + d.demandKwh, 0);

  // Fracción de autoconsumo según topología
  let autoconsumoRatio = 0.70; // 70% en On-Grid diurno residencial
  if (systemType === "hibrida" && batteryKwh > 0) {
    autoconsumoRatio = 0.90; // 90% con baterías LiFePO4
  } else if (systemType === "offgrid") {
    autoconsumoRatio = 1.0; // 100% aislado
  }

  const inyeccionRatio = Math.max(0, 1 - autoconsumoRatio);

  const solarGenUsedLocallyKwh = Math.min(totalAnnualDemandKwh, annualGenKwh * autoconsumoRatio);
  const solarGenInjectedKwh = Math.max(0, annualGenKwh - solarGenUsedLocallyKwh);

  // Cálculo del recargo de Límite de Invierno evitado
  let winterLimitPenaltyWithoutSolarClp = 0;
  seasonalDemands.forEach((d) => {
    if (d.hasWinterLimitSurchargeWithoutSolar) {
      const excessKwh = d.demandKwh - tariff.winterLimitThresholdKwh;
      const penaltyPerKwh = tariff.pInviernoClpPerKwh - tariff.pCompraClpPerKwh;
      winterLimitPenaltyWithoutSolarClp += excessKwh * penaltyPerKwh;
    }
  });

  const winterLimitSavingsClp = Math.round(winterLimitPenaltyWithoutSolarClp);

  // Ahorro año 1: Energía no comprada + Excedentes valorizados a precio nudo + Multas de invierno evitadas
  let year1AutoconsumoSavings = Math.round(solarGenUsedLocallyKwh * tariff.pCompraClpPerKwh);
  let year1InjectionCredits = Math.round(solarGenInjectedKwh * tariff.pNudoClpPerKwh);
  
  // En sistemas Off-Grid, la energía generada reemplaza el 100% del gasto energético/generador diésel
  if (systemType === "offgrid") {
    year1AutoconsumoSavings = Math.round(annualBillClp);
    year1InjectionCredits = 0;
  }

  // Ahorro neto año 1 (con tope de seguridad)
  let grossSavings = year1AutoconsumoSavings + year1InjectionCredits + winterLimitSavingsClp;
  let maxPossibleSavings = Math.max(0, annualBillClp - (tariff.fixedChargeMonthlyClp * 12));
  
  if (systemType === "offgrid") {
    maxPossibleSavings = annualBillClp; // En offgrid el ahorro es el 100% del presupuesto energético anual
    grossSavings = annualBillClp;
  }

  const year1Savings = Math.min(maxPossibleSavings, grossSavings);

  // Nueva boleta estimada que pagará el cliente ($0 en Off-Grid, solo cargo fijo en On-Grid/Híbrida)
  const estimatedNewAnnualBill = systemType === "offgrid" 
    ? 0 
    : Math.max(tariff.fixedChargeMonthlyClp * 12, annualBillClp - year1Savings);
  const estimatedNewMonthlyBillClp = Math.round(estimatedNewAnnualBill / 12);

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
    winterLimitSavingsClp,
    estimatedNewMonthlyBillClp,
    estimatedSystemCostClp,
    paybackYearsSimple: Math.round(simplePayback * 10) / 10,
    paybackYearsDiscounted: Math.round(discountedPayback * 10) / 10,
    vanClp: Math.round(van),
    tirPercent: Math.round(tirApprox * 1000) / 10,
    cumulative25YearSavingsClp: Math.round(cumulativeSavings),
    lcoeClpPerKwh: Math.max(38, Math.min(65, lcoe)),
  };
}
