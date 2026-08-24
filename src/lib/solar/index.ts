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
  DISTRIBUTOR_TARIFFS 
} from "./tariffs-netbilling";
import { validateSecCompliance } from "./sec-compliance";

export * from "./meteorology-tmy";
export * from "./solar-physics";
export * from "./bess-sizing";
export * from "./tariffs-netbilling";
export * from "./sec-compliance";

/**
 * Función Maestra de Cálculo Solar Fotovoltaico de Alta Fidelidad
 */
export function calculateSolarSizing(data: Partial<QuoteFormData>): SolarSizingResult {
  const monthlyBill = data.monthlyBillClp || 120000;
  const systemType = data.systemType || "hibrida";
  const propertyType = data.propertyType || "residencial";
  const comuna = data.comuna || "Puerto Varas";
  const distributor = data.distributor || "saesa";
  const hasPhases = data.hasPhases === "trifasico" ? "trifasico" : "monofasico";
  const backupPriority = data.backupPriority === "hogar_completo" ? "total_casa" : "cargas_criticas";

  // 1. Obtener perfil meteorológico TMY de la comuna y tarifas
  const meteoProfile = getMeteorologicalProfile(comuna);
  const tariff = DISTRIBUTOR_TARIFFS[distributor] || DISTRIBUTOR_TARIFFS.saesa;

  // 2. Calcular la Curva Estacional de Demanda Real del Sur (Ene a Dic)
  const seasonalDemands = calculateSouthernSeasonalDemand(monthlyBill, distributor);
  const totalAnnualDemandKwh = seasonalDemands.reduce((acc, d) => acc + d.demandKwh, 0);
  const avgMonthlyDemandKwh = Math.round(totalAnnualDemandKwh / 12);

  // 3. Ratio de cobertura objetivo
  let coverageRatio = 0.85; // 85% estándar residencial
  if (systemType === "offgrid") coverageRatio = 1.25; // Sobredimensionar para invierno
  if (propertyType === "comercial" || propertyType === "agricola") coverageRatio = 0.90;

  const targetAnnualGenKwh = totalAnnualDemandKwh * coverageRatio;

  // 4. Dimensionamiento de potencia DC y conteo de módulos N-Type TOPCon 580W
  const rawKwp = targetAnnualGenKwh / meteoProfile.specificYieldKwhKwp;
  const rawPanelsCount = Math.ceil((rawKwp * 1000) / TOPCON_580W_SPECS.pStcWatts);
  const panelsCount = Math.max(6, rawPanelsCount); // Mínimo 6 paneles para tensión de arranque MPPT (~220V)

  // 5. Simulación Física Solar (Termodinámica TOPCon + BOS + Pérdidas)
  const physicalSim = simulateSolarPlantGeneration(panelsCount, meteoProfile);

  // 6. Dimensionamiento BESS LiFePO4
  const bessResult = calculateBessSizing(
    avgMonthlyDemandKwh,
    systemType,
    physicalSim.installedKwp,
    backupPriority
  );

  // 7. Simulación Financiera Net Billing a 25 años con Límite de Invierno
  const financials = calculateNetBillingFinancials(
    physicalSim.annualGenKwh,
    monthlyBill,
    distributor,
    systemType,
    physicalSim.installedKwp,
    bessResult.nominalBatteryKwh,
    seasonalDemands
  );

  // 8. Validación de Normativa SEC
  const secValidation = validateSecCompliance(
    physicalSim.inverterKw,
    systemType,
    data.includeEvCharger || false,
    hasPhases
  );

  // Cruce mensual Generación Solar vs Demanda Real de la Casa
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
    secNorms: secNormsList,

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
  };
}
