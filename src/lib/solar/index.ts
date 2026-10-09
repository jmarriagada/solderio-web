/**
 * Solderío Solar Engineering - Motor de Cálculo Solar de Alta Fidelidad
 * Macrozona Sur de Chile (Araucanía, Los Ríos, Los Lagos)
 */

import { QuoteFormData, SolarSizingResult, MonthlyGenBreakdown } from "@/types/cotizacion";
import { getMeteorologicalProfile } from "./meteorology-tmy";
import { simulateSolarPlantGeneration, TOPCON_580W_SPECS } from "./solar-physics";
import { calculateBessSizing } from "./bess-sizing";
import { 
  calculateNetBillingFinancials, 
  calculateSouthernSeasonalDemand,
  calculateDemandFromAnnualKwh,
  calculateDemandFromMonthlyKwh,
  DISTRIBUTOR_TARIFFS,
  MonthlyDemandProfile,
  OM_PACKAGES,
  generateTypicalDayHourlyProfile,
  generateNetBillingMonthlyLedger,
  generateRightsAndCommitments
} from "./tariffs-netbilling";
import { validateSecCompliance } from "./sec-compliance";

export * from "./meteorology-tmy";
export * from "./solar-physics";
export * from "./bess-sizing";
export * from "./tariffs-netbilling";
export * from "./tariffs-config";
export * from "./sec-compliance";

/**
 * Función Maestra de Cálculo Solar Fotovoltaico de Alta Fidelidad
 */
export function calculateSolarSizing(data: Partial<QuoteFormData>): SolarSizingResult {
  const consumptionMode = data.consumptionMode || "monthly_bill_clp";
  let monthlyBill = data.monthlyBillClp || 120000;
  const systemType = data.systemType || "hibrida";
  const propertyType = data.propertyType || "residencial";
  const comuna = data.comuna || "Puerto Varas";
  const distributor = data.distributor || "saesa";
  const hasPhases = data.hasPhases === "trifasico" ? "trifasico" : "monofasico";
  const backupPriority = data.backupPriority === "hogar_completo" ? "total_casa" : "cargas_criticas";

  // 1. Obtener perfil meteorológico TMY de la comuna y tarifas
  const meteoProfile = getMeteorologicalProfile(comuna);
  const tariff = DISTRIBUTOR_TARIFFS[distributor] || DISTRIBUTOR_TARIFFS.saesa;

  // 2. Calcular la Curva Estacional de Demanda Real según el modo de ingreso
  let seasonalDemands: MonthlyDemandProfile[];

  if (consumptionMode === "monthly_kwh" && data.monthlyKwhBreakdown && data.monthlyKwhBreakdown.length === 12) {
    seasonalDemands = calculateDemandFromMonthlyKwh(data.monthlyKwhBreakdown, distributor);
    const totalKwh = data.monthlyKwhBreakdown.reduce((acc, k) => acc + (k || 0), 0);
    const avgKwh = totalKwh / 12;
    monthlyBill = Math.round((avgKwh * tariff.pCompraClpPerKwh) + tariff.fixedChargeMonthlyClp);
  } else if (consumptionMode === "annual_kwh" && data.annualKwh && data.annualKwh > 0) {
    seasonalDemands = calculateDemandFromAnnualKwh(data.annualKwh, distributor);
    const avgKwh = data.annualKwh / 12;
    monthlyBill = Math.round((avgKwh * tariff.pCompraClpPerKwh) + tariff.fixedChargeMonthlyClp);
  } else {
    seasonalDemands = calculateSouthernSeasonalDemand(monthlyBill, distributor);
  }

  const totalAnnualDemandKwh = seasonalDemands.reduce((acc, d) => acc + d.demandKwh, 0);
  const avgMonthlyDemandKwh = Math.round(totalAnnualDemandKwh / 12);

  // 3. Ratio de cobertura objetivo
  let coverageRatio = 0.85; // 85% estándar residencial
  if (systemType === "offgrid") coverageRatio = 1.25; // Sobredimensionar para invierno
  if (propertyType === "comercial" || propertyType === "agricola") coverageRatio = 0.90;

  const targetAnnualGenKwh = totalAnnualDemandKwh * coverageRatio;

  // 4. Dimensionamiento de potencia DC y conteo de módulos N-Type TOPCon 585W
  const isBessOnly = systemType === "bess";
  const rawKwp = isBessOnly ? 0 : targetAnnualGenKwh / meteoProfile.specificYieldKwhKwp;
  const rawPanelsCount = isBessOnly ? 0 : Math.ceil((rawKwp * 1000) / TOPCON_580W_SPECS.pStcWatts);
  const panelsCount = isBessOnly ? 0 : Math.max(6, rawPanelsCount); // Mínimo 6 paneles para tensión de arranque MPPT (~220V)

  // 5. Simulación Física Solar (Termodinámica TOPCon + BOS + Pérdidas)
  const physicalSim = isBessOnly
    ? {
        installedKwp: 0,
        panelsCount: 0,
        inverterKw: Math.min(30, Math.max(5, Math.ceil(avgMonthlyDemandKwh / 150))),
        ilrRatio: 0,
        annualGenKwh: 0,
        summerAvgMonthlyGenKwh: 0,
        winterAvgMonthlyGenKwh: 0,
        seasonalVariationRatio: 1,
        avgPerformanceRatioPercent: 0,
        monthlyBreakdown: meteoProfile.monthlyData.map((m) => ({
          month: m.month,
          monthName: m.monthName,
          poaKwhM2Day: m.poaKwhM2Day,
          tCellCelsius: m.avgTempCelsius,
          thermalDeratingFactor: 1,
          performanceRatioPercent: 0,
          monthlyGenKwh: 0,
        })),
      }
    : simulateSolarPlantGeneration(panelsCount, meteoProfile);

  // 6. Dimensionamiento BESS LiFePO4
  const bessResult = calculateBessSizing(
    avgMonthlyDemandKwh,
    systemType,
    physicalSim.installedKwp,
    backupPriority
  );

  // Clasificación B2C vs B2B
  const isB2B = propertyType === "comercial" || propertyType === "agricola" || monthlyBill >= 450000 || physicalSim.installedKwp >= 15;

  // 7. Simulación Financiera Net Billing y Pricing Oficial SoldeRío (con O&M, recambio año 12 y Art. 33 bis)
  const financials = calculateNetBillingFinancials(
    physicalSim.annualGenKwh,
    monthlyBill,
    distributor,
    systemType,
    physicalSim.installedKwp,
    bessResult.nominalBatteryKwh,
    seasonalDemands,
    isB2B
  );

  // 8. Validación de Normativa SEC
  const secValidation = validateSecCompliance(
    physicalSim.inverterKw,
    systemType,
    data.includeEvCharger || false,
    hasPhases
  );

  // Cruce mensual Generación Solar vs Demanda Real de la Casa / Empresa
  const monthlyBreakdown: MonthlyGenBreakdown[] = physicalSim.monthlyBreakdown.map((m, idx) => {
    const demand = seasonalDemands[idx]?.demandKwh || avgMonthlyDemandKwh;
    const surplusKwh = Math.max(0, m.monthlyGenKwh - demand);
    const gridImportKwh = Math.max(0, demand - m.monthlyGenKwh);

    return {
      month: m.month,
      monthName: m.monthName,
      monthlyGenKwh: m.monthlyGenKwh,
      monthlyDemandKwh: demand,
      poaKwhM2Day: m.poaKwhM2Day,
      tCellCelsius: m.tCellCelsius,
      surplusKwh,
      gridImportKwh,
    };
  });

  // Clasificación Regulatoria Oficial (DFL 4/2006 LGSE + DS 57/2019 + DS 8/2019)
  let regulatoryTrack: "netbilling_ley21118" | "inyeccion_cero_ric09" | "aislada_ric9.1" | "bess_almacenamiento" = "netbilling_ley21118";
  let regulatoryTitle = "Ley 21.118 Netbilling (Generación Distribuida ≤ 300 kW)";
  let regulatoryDecree = "DFL 4/2006 + DS 57/2019 + DS 8/2019";
  let regulatoryNorm = "Pliegos RIC N° 01-19 + NTCO-EG + RGR 01/2024";
  let regulatoryTramite = "Trámite Eléctrico TE4 vía Plataforma GDA SEC (F1 a F5)";

  if (systemType === "offgrid") {
    regulatoryTrack = "aislada_ric9.1";
    regulatoryTitle = "Instalación Aislada Off-Grid (Sin Conexión a Red)";
    regulatoryDecree = "Pliego Técnico RIC N° 09.1 - Autogeneración Aislada";
    regulatoryNorm = "RIC 01 al RIC 19 + Protecciones Atmosféricas";
    regulatoryTramite = "Declaración Eléctrica TE1 ante SEC";
  } else if (data.includeZeroInjection) {
    regulatoryTrack = "inyeccion_cero_ric09";
    regulatoryTitle = "Autoconsumo Industrial con Inyección Cero";
    regulatoryDecree = "DS 57/2019 + Pliego Técnico RIC N° 09";
    regulatoryNorm = "Relé de Inyección Cero Certificado SEC + Smart Power Sensor";
    regulatoryTramite = "Trámite Eléctrico TE4 / TE1 Simplificado";
  } else if (isBessOnly) {
    regulatoryTrack = "bess_almacenamiento";
    regulatoryTitle = "Sistema de Almacenamiento Puro BESS";
    regulatoryDecree = "Ley 21.505 de Almacenamiento + DS 8/2019";
    regulatoryNorm = "Pliegos RIC N° 09 y RIC N° 10 (Sistemas de Baterías)";
    regulatoryTramite = "Declaración TE4 BESS ante SEC";
  } else if (physicalSim.installedKwp > 300) {
    regulatoryTitle = "PMGD / Pequeño Medio de Generación Distribuida (DS 88/2019)";
    regulatoryDecree = "DFL 4/2006 + DS 88/2019 + Norma Técnica CNE";
    regulatoryNorm = "Coordinador Eléctrico Nacional + SEC";
    regulatoryTramite = "Conexión PMGD ante Distribuidora e ICC CNE";
  }

  // Generación de Perfiles para "Saber más" (Imágenes de la industria)
  const dailySolarGenKwh = physicalSim.annualGenKwh / 365;
  const dailyDemandKwh = totalAnnualDemandKwh / 365;
  const hourlyProfileSample = generateTypicalDayHourlyProfile(dailySolarGenKwh, dailyDemandKwh, isB2B);
  const netBillingMonthlyLedger = generateNetBillingMonthlyLedger(monthlyBreakdown, tariff);
  const rightsAndCommitments = generateRightsAndCommitments();

  // Ahorro por mitigación de horas punta para clientes comerciales/agrícolas (BT2/BT3/AT)
  const peakHourDemandSavingsClp = isB2B ? Math.round((monthlyBill * 12) * 0.18) : undefined;

  // Impacto ambiental (0.385 kg CO2 por kWh evitado en matriz chilena SEN)
  const co2TonsAvoidedPerYear = Math.round(((physicalSim.annualGenKwh * 0.385) / 1000) * 10) / 10;
  const equivalentTreesPlanted = Math.round(co2TonsAvoidedPerYear * 16);

  const secNormsList = secValidation.rulesValidated.map((r) => `${r.code} - ${r.title}`);
  secNormsList.push(`Trámite Certificación ${secValidation.teFormCode} SEC`);

  // Equivalencias amigables para el usuario ("Con peras y manzanas")
  const applianceEquivalencies = [
    {
      title: "Refrigerador + Freezer No-Frost",
      description: "Alimentado 24/7 sin cortes, incluso durante temporales y caídas de red.",
      icon: "Refrigerator",
    },
    {
      title: "Conectividad Starlink & Iluminación",
      description: "Mantiene internet de alta velocidad, teletrabajo y toda la casa iluminada.",
      icon: "Wifi",
    },
    {
      title: "Calefacción / Pellet & Bombas de Pozo",
      description: "Respaldo continuo para motores de estufas a pellet y extracción de agua.",
      icon: "Flame",
    },
    {
      title: "Electrodomésticos & Lavado",
      description: "Lavadora, lavavajillas, microondas y hervidor cubiertos con energía solar.",
      icon: "Zap",
    },
  ];

  if (data.includeEvCharger) {
    applianceEquivalencies.push({
      title: "Carga de Vehículo Eléctrico (Wallbox)",
      description: "Hasta 250 km de autonomía semanal cargado 100% con excedentes solares.",
      icon: "Car",
    });
  }

  const coberturaTotalAnualPct = Math.min(100, Math.round((physicalSim.annualGenKwh / totalAnnualDemandKwh) * 100));

  const selectedOm = OM_PACKAGES[data.omPackage || "basic"] || OM_PACKAGES.basic;

  // Simulación Crédito Verde BancoEstado (Matemática Mock basada en API de referencia)
  let financingSimulation = undefined;
  if (data.financingSplit === "50_50" || data.financingSplit === "100_credit") {
    let principal = financials.estimatedSystemCostIvaClp;
    if (data.financingSplit === "50_50") {
      principal = principal / 2;
    }
    
    const r = 0.0089; // 0.89% tasa mensual
    const n = data.creditInstallments || 60;
    
    // Aprox impuestos (0.8065% sobre el monto líquido)
    const principalReal = principal * 1.008065;
    
    // Seguro de desgravamen aprox
    const seguroMensual = data.creditInsurance === "sin_seguro" ? 0 : 3500;
    
    const rawCuota = principalReal * (r / (1 - Math.pow(1 + r, -n)));
    const valorCuota = Math.round(rawCuota + seguroMensual);
    
    const montoTotalCredito = valorCuota * n;
    
    financingSimulation = {
      valorCuota,
      montoLiquido: Math.round(principal),
      numeroCuotas: n,
      tasaInteresMensual: 0.89,
      tasaInteresAnual: 10.68,
      cae: 10.73, // Promedio 
      montoTotalCredito,
      costoTotalCredito: Math.round(montoTotalCredito - principal),
    };
  }

  return {
    recommendedKwp: physicalSim.installedKwp,
    panelsCount: physicalSim.panelsCount,
    panelWatts: TOPCON_580W_SPECS.pStcWatts,
    inverterKw: physicalSim.inverterKw,
    batteryKwh: bessResult.nominalBatteryKwh,
    estimatedMonthlyGenKwh: Math.round(physicalSim.annualGenKwh / 12),
    estimatedAnnualGenKwh: physicalSim.annualGenKwh,
    estimatedAnnualSavingsClp: financials.year1SavingsClp,
    estimated25YearSavingsClp: financials.cumulative25YearSavingsClp,
    paybackYears: financials.paybackYearsSimple,
    co2TonsAvoidedPerYear,
    equivalentTreesPlanted,
    autoconsumoPct: financials.autoconsumoRatioPercent,
    averageMonthlyDemandKwh: Math.round(totalAnnualDemandKwh / 12),
    secNorms: secNormsList,

    // Turnkey Pricing & Cashflow Milestones (Huawei + Jinko + BOS + Flete Sur)
    estimatedSystemCostNetoClp: financials.estimatedSystemCostClp,
    estimatedSystemCostIvaClp: financials.estimatedSystemCostIvaClp,
    downpaymentHito1Clp: financials.downpaymentHito1Clp,
    faenaHito2Clp: financials.faenaHito2Clp,
    finalHito3Clp: financials.finalHito3Clp,
    margenBrutoPct: financials.margenBrutoPct,

    // Paquete O&M Seleccionado
    selectedOmPackage: selectedOm,

    // Métricas avanzadas
    usableBatteryKwh: bessResult.usableBatteryKwh,
    seasonalVariationRatio: physicalSim.seasonalVariationRatio,
    summerAvgMonthlyGenKwh: physicalSim.summerAvgMonthlyGenKwh,
    winterAvgMonthlyGenKwh: physicalSim.winterAvgMonthlyGenKwh,
    monthlyBreakdown,
    vanClp: financials.vanClp,
    tirPercent: financials.tirPercent,
    lcoeClpPerKwh: financials.lcoeClpPerKwh,
    requiresThreePhase: secValidation.requiresThreePhase,
    recommendedPhaseType: secValidation.recommendedPhaseType,

    // Indicadores amigables para el Lead
    estimatedNewMonthlyBillClp: financials.estimatedNewMonthlyBillClp,
    winterLimitSavingsClp: financials.winterLimitSavingsClp,
    coberturaTotalAnualPct,
    applianceEquivalencies,
    
    // Simulación Crédito
    financingSimulation,

    // Métricas Financieras y Tributarias B2B (Corporativo / Agrícola / Pymes)
    taxShieldArt33BisClp: financials.taxShieldArt33BisClp,
    recoverableVatClp: financials.recoverableVatClp,
    peakHourDemandSavingsClp,
    annualOpexClp: financials.annualOpexClp,
    inverterReplacementCostYear12Clp: financials.inverterReplacementCostYear12Clp,
    isB2B,

    // Mapa Regulatorio Oficial Chileno (DFL 4/2006 LGSE)
    regulatoryTrack,
    regulatoryTitle,
    regulatoryDecree,
    regulatoryNorm,
    regulatoryTramite,

    // Perfiles Gráficos e Indicadores "Saber más"
    hourlyProfileSample,
    netBillingMonthlyLedger,
    rightsAndCommitments,
  };
}
