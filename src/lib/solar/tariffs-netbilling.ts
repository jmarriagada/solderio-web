/**
 * Solderío Solar Engineering - Tarifas Eléctricas, Ley Net Billing 21.118, Límite de Invierno y Pricing Oficial
 * Macrozona Sur de Chile (SAESA, CRELL, CGE, FRONTEL, EDELAYSEN)
 */

import { DistributorType, TopologyType, OMPackageType, OMPackageDetail } from "@/types/cotizacion";

export interface DistributorTariff {
  key: DistributorType;
  name: string;
  pCompraClpPerKwh: number; // Precio compra energía desde la red ($CLP/kWh)
  pNudoClpPerKwh: number; // Precio nudo de inyección a la red bajo Ley 21.118 ($CLP/kWh)
  pInviernoClpPerKwh: number; // Precio con recargo de Límite de Invierno ($CLP/kWh)
  winterLimitThresholdKwh: number; // Umbral de sobreconsumo invernal (350 a 430 kWh/mes)
  fixedChargeMonthlyClp: number; // Cargo fijo mensual ($CLP)
  vatRate: number; // 19% IVA
}

export const DISTRIBUTOR_TARIFFS: Record<DistributorType, DistributorTariff> = {
  saesa: {
    key: "saesa",
    name: "Grupo SAESA (Osorno, Llanquihue, Chiloé, Valdivia)",
    pCompraClpPerKwh: 270.0, // Alzas 2024-2026 en el sur
    pNudoClpPerKwh: 125.0, // Valorización promedio de inyección
    pInviernoClpPerKwh: 345.0, // Recargo límite invierno SAESA
    winterLimitThresholdKwh: 350,
    fixedChargeMonthlyClp: 1850,
    vatRate: 0.19,
  },
  crell: {
    key: "crell",
    name: "Cooperativa CRELL (Frutillar, Puerto Varas, Fresia)",
    pCompraClpPerKwh: 285.0,
    pNudoClpPerKwh: 132.0,
    pInviernoClpPerKwh: 360.0,
    winterLimitThresholdKwh: 350,
    fixedChargeMonthlyClp: 2100,
    vatRate: 0.19,
  },
  cge: {
    key: "cge",
    name: "CGE Distribución (Temuco, Pucón, Villarrica)",
    pCompraClpPerKwh: 265.0,
    pNudoClpPerKwh: 120.0,
    pInviernoClpPerKwh: 338.0,
    winterLimitThresholdKwh: 350,
    fixedChargeMonthlyClp: 1750,
    vatRate: 0.19,
  },
  frontel: {
    key: "frontel",
    name: "FRONTEL (Malleco, Cautín, Araucanía Rural)",
    pCompraClpPerKwh: 275.0,
    pNudoClpPerKwh: 128.0,
    pInviernoClpPerKwh: 350.0,
    winterLimitThresholdKwh: 350,
    fixedChargeMonthlyClp: 1900,
    vatRate: 0.19,
  },
  edelaysen: {
    key: "edelaysen",
    name: "Edelaysen (Coyhaique, Aysén)",
    pCompraClpPerKwh: 295.0,
    pNudoClpPerKwh: 140.0,
    pInviernoClpPerKwh: 375.0,
    winterLimitThresholdKwh: 400,
    fixedChargeMonthlyClp: 2400,
    vatRate: 0.19,
  },
  otra: {
    key: "otra",
    name: "Otra Distribuidora / Cooperativa Local",
    pCompraClpPerKwh: 270.0,
    pNudoClpPerKwh: 125.0,
    pInviernoClpPerKwh: 345.0,
    winterLimitThresholdKwh: 350,
    fixedChargeMonthlyClp: 1850,
    vatRate: 0.19,
  },
};

// Ponderadores de demanda mensual para la macrozona sur (12 meses: Ene a Dic)
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
  estimatedSystemCostClp: number; // CAPEX estimado con llave en mano e ingeniería SEC (Neto)
  estimatedSystemCostIvaClp: number; // Precio con IVA
  downpaymentHito1Clp: number; // 50%
  faenaHito2Clp: number;       // 35%
  finalHito3Clp: number;       // 15%
  margenBrutoPct: number;
  paybackYearsSimple: number;
  paybackYearsDiscounted: number;
  vanClp: number; // Valor Actual Neto a 25 años
  tirPercent: number; // Tasa Interna de Retorno
  cumulative25YearSavingsClp: number;
  lcoeClpPerKwh: number; // Costo nivelado de la energía solar ($42-$55 CLP/kWh)
}

/**
 * Catálogo Oficial de Paquetes de O&M y Garantías SoldeRío
 */
export const OM_PACKAGES: Record<OMPackageType, OMPackageDetail> = {
  basic: {
    id: "basic",
    name: "Garantía Estándar SoldeRío",
    badge: "Incluida",
    monthlyPriceClp: 0,
    monthlyPriceUf: 0,
    tagline: "Garantía de producto de fábrica y soporte de instalación",
    features: [
      "25 Años de Garantía de Rendimiento en Módulos Tier 1 (≥85%)",
      "10 a 15 Años de Garantía de Inversores y Baterías LUNA Huawei",
      "1 Año de Garantía de Mano de Obra y Estanqueidad de Techo",
      "Monitoreo Básico en App Huawei FusionSolar Cloud",
      "Certificado TE-4 SEC y Tramitación Net Billing ante Distribuidora"
    ],
    isDefault: true,
  },
  essential: {
    id: "essential",
    name: "Plan Essential Care",
    badge: "Popular",
    monthlyPriceClp: 18000,
    monthlyPriceUf: 0.48,
    tagline: "Monitoreo telemático activo y mantenimiento anual",
    features: [
      "Todo lo de la Garantía Estándar",
      "Monitoreo Telemático Activo 24/7 con detección de anomalías por IA",
      "1 Visita Anual de Mantenimiento Preventivo (Lavado con agua desmineralizada y torqueo)",
      "Informe Técnico de Rendimiento Anual y Ahorro Auditado",
      "Gestión prioritaria de garantías ante el fabricante sin costo de servicio"
    ],
  },
  total_guard: {
    id: "total_guard",
    name: "Plan Total Guard (Seguro SoldeRío)",
    badge: "Recomendado",
    monthlyPriceClp: 25000,
    monthlyPriceUf: 0.67,
    tagline: "Mano de obra correctiva 100% cubierta y reemplazo express de equipos",
    features: [
      "Todo lo del Plan Essential Care",
      "2 Visitas Preventivas al año (Pre-verano y Post-invierno)",
      "Mano de Obra Correctiva 100% Cubierta (Cero costo en visitas técnicas por fallas)",
      "Inspección Termográfica Infrarroja (Detección de puntos calientes en celdas)",
      "Servicio Inversor Swap Express (<48 hrs en caso de falla de hardware)",
      "SLA de atención en terreno preferente <24 horas en el sur de Chile"
    ],
  },
};

/**
 * Motor de Precios Oficial SoldeRío (Huawei FusionSolar + Jinko 585Wp + BOS Eléctrico + Flete Sur)
 */
export function calculateTurnkeySystemPrice(
  installedKwp: number,
  batteryKwh: number = 0
): {
  costoDirectoNetoClp: number;
  precioVentaNetoClp: number;
  precioVentaIvaClp: number;
  downpaymentHito1Clp: number; // 50%
  faenaHito2Clp: number;       // 35%
  finalHito3Clp: number;       // 15%
  margenBrutoPct: number;
  costoDirectoPerKwp: number;
  precioVentaPerKwpNeto: number;
} {
  const panelWp = 585;
  const numPanels = Math.max(6, Math.round((installedKwp * 1000) / panelWp));
  const realKwp = (numPanels * panelWp) / 1000;

  // 1. Costo Hardware Mayor
  const costoPaneles = numPanels * 87000;
  const costoEstructura = realKwp * 50000;
  const costoCablesDC = 100000;
  const costoMO = 860000; // 3 Días Techo + Eléctrico
  const costoSEC = 200000; // TE-4 + F1-F5

  let costoInversor = 765000; // Huawei 10KTL
  let costoBOS = 700000;      // BOS 3F
  let fleteSur = 160000;      // Flete 10KTL BESS

  if (realKwp <= 4.0) {
    costoInversor = 460000; // 3KTL
    costoBOS = 540000;
    fleteSur = 90000;
  } else if (realKwp <= 6.5) {
    costoInversor = 540000; // 5KTL
    costoBOS = 560000;
    fleteSur = 120000;
  } else if (realKwp <= 9.0) {
    costoInversor = 680000; // 8KTL
    costoBOS = 660000;
    fleteSur = 140000;
  } else if (realKwp <= 12.0) {
    costoInversor = 765000; // 10KTL
    costoBOS = 700000;
    fleteSur = 160000;
  } else {
    costoInversor = 1100000; // 15K-MB0
    costoBOS = 860000;
    fleteSur = 220000;
  }

  let costoBateriaKit = 0;
  if (batteryKwh > 0) {
    if (batteryKwh <= 7.0) {
      // 1 Módulo 7 kWh ($2.565k) + DC/DC ($940k) + SmartGuard ($580k) + Intercon ($60k)
      costoBateriaKit = 4145000;
      fleteSur += 50000;
    } else {
      // 2 Módulos 7 kWh = 14 kWh ($5.130k) + DC/DC ($940k) + SmartGuard ($580k) + Intercon ($100k)
      costoBateriaKit = 6750000;
      fleteSur += 100000;
    }
  }

  const costoDirectoNetoClp = Math.round(
    costoPaneles + costoEstructura + costoCablesDC + costoMO + costoSEC + costoInversor + costoBOS + fleteSur + costoBateriaKit
  );

  // Margen diferenciado: 27.5% en BESS-Ready vs 19.5% en Híbridas con Batería
  const margenBrutoPct = batteryKwh > 0 ? 0.195 : 0.275;
  const precioVentaNetoClp = Math.round(costoDirectoNetoClp / (1.0 - margenBrutoPct));
  const precioVentaIvaClp = Math.round(precioVentaNetoClp * 1.19);

  // Hitos de pago 50 / 35 / 15
  const downpaymentHito1Clp = Math.round(precioVentaNetoClp * 0.50);
  const faenaHito2Clp = Math.round(precioVentaNetoClp * 0.35);
  const finalHito3Clp = Math.round(precioVentaNetoClp * 0.15);

  return {
    costoDirectoNetoClp,
    precioVentaNetoClp,
    precioVentaIvaClp,
    downpaymentHito1Clp,
    faenaHito2Clp,
    finalHito3Clp,
    margenBrutoPct: Math.round(margenBrutoPct * 1000) / 10,
    costoDirectoPerKwp: Math.round(costoDirectoNetoClp / realKwp),
    precioVentaPerKwpNeto: Math.round(precioVentaNetoClp / realKwp),
  };
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
 * Calcula el perfil de demanda estacional a partir de un consumo total anual en kWh
 */
export function calculateDemandFromAnnualKwh(
  annualKwh: number,
  distributorKey: DistributorType = "saesa"
): MonthlyDemandProfile[] {
  const tariff = DISTRIBUTOR_TARIFFS[distributorKey] || DISTRIBUTOR_TARIFFS.saesa;
  const baseAvgMonthlyKwh = Math.max(50, annualKwh / 12);
  const sumWeights = SOUTHERN_CHILE_DEMAND_WEIGHTS.reduce((a, b) => a + b, 0);
  const avgWeight = sumWeights / 12;

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return SOUTHERN_CHILE_DEMAND_WEIGHTS.map((weight, idx) => {
    const month = idx + 1;
    const isWinterLimitPeriod = month >= 4 && month <= 9;
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
 * Genera el perfil de demanda exacto a partir del desglose mes a mes ingresado por el usuario (12 meses en kWh)
 */
export function calculateDemandFromMonthlyKwh(
  monthlyKwh: number[],
  distributorKey: DistributorType = "saesa"
): MonthlyDemandProfile[] {
  const tariff = DISTRIBUTOR_TARIFFS[distributorKey] || DISTRIBUTOR_TARIFFS.saesa;
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return monthNames.map((monthName, idx) => {
    const month = idx + 1;
    const isWinterLimitPeriod = month >= 4 && month <= 9;
    const demandKwh = Math.max(10, Math.round(monthlyKwh[idx] || 250));
    const hasWinterLimitSurchargeWithoutSolar = isWinterLimitPeriod && demandKwh > tariff.winterLimitThresholdKwh;

    return {
      month,
      monthName,
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
  
  if (systemType === "offgrid") {
    year1AutoconsumoSavings = Math.round(annualBillClp);
    year1InjectionCredits = 0;
  }

  // Ahorro neto año 1 (con tope de seguridad)
  let grossSavings = year1AutoconsumoSavings + year1InjectionCredits + winterLimitSavingsClp;
  let maxPossibleSavings = Math.max(0, annualBillClp - (tariff.fixedChargeMonthlyClp * 12));
  
  if (systemType === "offgrid") {
    maxPossibleSavings = annualBillClp;
    grossSavings = annualBillClp;
  }

  const year1Savings = Math.min(maxPossibleSavings, grossSavings);

  const estimatedNewAnnualBill = systemType === "offgrid" 
    ? 0 
    : Math.max(tariff.fixedChargeMonthlyClp * 12, annualBillClp - year1Savings);
  const estimatedNewMonthlyBillClp = Math.round(estimatedNewAnnualBill / 12);

  // CÁLCULO EXACTO DE PRECIO LLAVE EN MANO SOLDE RÍO
  const pricing = calculateTurnkeySystemPrice(installedKwp, batteryKwh);
  const estimatedSystemCostClp = pricing.precioVentaNetoClp;
  const estimatedSystemCostIvaClp = pricing.precioVentaIvaClp;

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
    const oAndMCost = (estimatedSystemCostClp * 0.01) * Math.pow(1 + 0.03, t - 1);
    const grossSavingsYearT = year1Savings * Math.pow(1 - moduleDegradationAnnual, t - 1) * Math.pow(1 + energyInflationAnnual, t - 1);
    const netCashFlowT = grossSavingsYearT - oAndMCost;

    cashFlows.push(netCashFlowT);
    cumulativeSavings += netCashFlowT;

    const discountedCashFlowT = netCashFlowT / Math.pow(1 + discountRate, t);
    van += discountedCashFlowT;

    runningCashFlow += netCashFlowT;
    if (runningCashFlow >= 0 && !simplePaybackFound) {
      const prev = runningCashFlow - netCashFlowT;
      simplePayback = t - 1 + Math.abs(prev) / netCashFlowT;
      simplePaybackFound = true;
    }

    if (van >= 0 && !discountedPaybackFound) {
      const prevVan = van - discountedCashFlowT;
      discountedPayback = t - 1 + Math.abs(prevVan) / discountedCashFlowT;
      discountedPaybackFound = true;
    }
  }

  if (!simplePaybackFound) simplePayback = estimatedSystemCostClp / Math.max(1, year1Savings);
  if (!discountedPaybackFound) discountedPayback = simplePayback * 1.25;

  let tirApprox = 0.14;
  if (simplePayback <= 4.0) tirApprox = 0.22;
  else if (simplePayback <= 5.5) tirApprox = 0.17;
  else if (simplePayback <= 7.0) tirApprox = 0.13;
  else tirApprox = 0.09;

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
    estimatedSystemCostIvaClp,
    downpaymentHito1Clp: pricing.downpaymentHito1Clp,
    faenaHito2Clp: pricing.faenaHito2Clp,
    finalHito3Clp: pricing.finalHito3Clp,
    margenBrutoPct: pricing.margenBrutoPct,
    paybackYearsSimple: Math.round(simplePayback * 10) / 10,
    paybackYearsDiscounted: Math.round(discountedPayback * 10) / 10,
    vanClp: Math.round(van),
    tirPercent: Math.round(tirApprox * 1000) / 10,
    cumulative25YearSavingsClp: Math.round(cumulativeSavings),
    lcoeClpPerKwh: Math.max(38, Math.min(65, lcoe)),
  };
}
