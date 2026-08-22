/**
 * Solderío Solar Engineering - Motor de Cálculo Solar de Alta Fidelidad
 * Macrozona Sur de Chile (Araucanía, Los Ríos, Los Lagos)
 */

import { QuoteFormData, SolarSizingResult } from "@/types/cotizacion";
import { getMeteorologicalProfile } from "./meteorology-tmy";
import { simulateSolarPlantGeneration, TOPCON_580W_SPECS } from "./solar-physics";
import { calculateBessSizing } from "./bess-sizing";
import { calculateNetBillingFinancials, DISTRIBUTOR_TARIFFS } from "./tariffs-netbilling";
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

  // 1. Obtener perfil meteorológico TMY de la comuna
  const meteoProfile = getMeteorologicalProfile(comuna);
  const tariff = DISTRIBUTOR_TARIFFS[distributor] || DISTRIBUTOR_TARIFFS.saesa;

  // 2. Estimar demanda mensual y anual en kWh
  const estimatedMonthlyKwh = Math.max(80, Math.round((monthlyBill - tariff.fixedChargeMonthlyClp) / tariff.pCompraClpPerKwh));
  const estimatedAnnualKwh = estimatedMonthlyKwh * 12;

  // 3. Ratio de cobertura objetivo
  let coverageRatio = 0.85; // 85% estándar residencial
  if (systemType === "offgrid") coverageRatio = 1.25; // Sobredimensionar para invierno
  if (propertyType === "comercial" || propertyType === "agricola") coverageRatio = 0.90;

  const targetAnnualGenKwh = estimatedAnnualKwh * coverageRatio;

  // 4. Dimensionamiento de potencia DC y conteo de módulos N-Type TOPCon 580W
  const rawKwp = targetAnnualGenKwh / meteoProfile.specificYieldKwhKwp;
  const rawPanelsCount = Math.ceil((rawKwp * 1000) / TOPCON_580W_SPECS.pStcWatts);
  const panelsCount = Math.max(6, rawPanelsCount); // Mínimo 6 paneles para tensión de arranque MPPT (~220V)

  // 5. Simulación Física Solar (Termodinámica TOPCon + BOS + Pérdidas)
  const physicalSim = simulateSolarPlantGeneration(panelsCount, meteoProfile);

  // 6. Dimensionamiento BESS LiFePO4
  const bessResult = calculateBessSizing(
    estimatedMonthlyKwh,
    systemType,
    physicalSim.installedKwp,
    backupPriority
  );

  // 7. Simulación Financiera Net Billing a 25 años
  const financials = calculateNetBillingFinancials(
    physicalSim.annualGenKwh,
    monthlyBill,
    distributor,
    systemType,
    physicalSim.installedKwp,
    bessResult.nominalBatteryKwh
  );

  // 8. Validación de Normativa SEC
  const secValidation = validateSecCompliance(
    physicalSim.inverterKw,
    systemType,
    data.includeEvCharger || false,
    hasPhases
  );

  // Impacto ambiental (0.385 kg CO2 por kWh evitado en matriz chilena SEN)
  const co2TonsAvoidedPerYear = Math.round(((physicalSim.annualGenKwh * 0.385) / 1000) * 10) / 10;
  const equivalentTreesPlanted = Math.round(co2TonsAvoidedPerYear * 16);

  const secNormsList = secValidation.rulesValidated.map((r) => `${r.code} - ${r.title}`);
  secNormsList.push(`Trámite Certificación ${secValidation.teFormCode} SEC`);

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
    monthlyBreakdown: physicalSim.monthlyBreakdown.map((m) => ({
      month: m.month,
      monthName: m.monthName,
      monthlyGenKwh: m.monthlyGenKwh,
      poaKwhM2Day: m.poaKwhM2Day,
      tCellCelsius: m.tCellCelsius,
    })),
    vanClp: financials.vanClp,
    tirPercent: financials.tirPercent,
    lcoeClpPerKwh: financials.lcoeClpPerKwh,
    requiresThreePhase: secValidation.requiresThreePhase,
    recommendedPhaseType: secValidation.recommendedPhaseType,
  };
}
