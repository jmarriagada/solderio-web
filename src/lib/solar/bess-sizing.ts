/**
 * Solderío Solar Engineering - Módulo de Almacenamiento BESS (LiFePO4)
 * Dimensionamiento por energía útil, profundidad de descarga (DoD), autonomía y conmutación STS
 */

import { TopologyType } from "@/types/cotizacion";

export interface BessBatterySpecs {
  chemistry: "LiFePO4 (Fosfato de Hierro y Litio)";
  dodMaxPercent: number; // 90%
  roundTripEfficiencyPercent: number; // 95%
  cRateStandard: number; // 0.5C (ej: 10 kWh -> 5 kW de descarga continua)
  cycleLifeTo80Soh: number; // >= 6,000 ciclos (~15 años a 1 ciclo/día)
  operatingTempMinCelsius: number; // -10°C (con BMS inteligente autocalefaccionado)
  stsSwitchTimeMs: number; // < 10 ms (grado UPS en inversor híbrido)
}

export const SOL_LIFEPO4_SPECS: BessBatterySpecs = {
  chemistry: "LiFePO4 (Fosfato de Hierro y Litio)",
  dodMaxPercent: 90,
  roundTripEfficiencyPercent: 95,
  cRateStandard: 0.5,
  cycleLifeTo80Soh: 6000,
  operatingTempMinCelsius: -10,
  stsSwitchTimeMs: 10,
};

export interface BessSizingResult {
  systemType: TopologyType;
  nominalBatteryKwh: number;
  usableBatteryKwh: number;
  maxContinuousDischargeKw: number;
  estimatedAutonomyHoursCriticalLoads: number;
  estimatedWinterAutonomyDays: number;
  estimatedCyclesLifeYears: number;
  hasStsFastSwitch: boolean;
  recommendedModulesCount: number; // Módulos modulares de 5.12 kWh
  recommendedModelName: string;
}

/**
 * Dimensiona el banco BESS LiFePO4 en función del consumo, topología y potencia instalada
 */
export function calculateBessSizing(
  monthlyKwhDemand: number,
  systemType: TopologyType,
  installedKwp: number,
  backupPriority: "cargas_criticas" | "total_casa" | "cero_inyeccion" = "cargas_criticas"
): BessSizingResult {
  const dailyKwhDemand = monthlyKwhDemand / 30;

  // En el sur, la demanda nocturna representa ~55% del consumo diario
  const nocturnalDailyKwh = dailyKwhDemand * 0.55;

  // Cargas críticas (refrigerador, iluminación LED, routers/Starlink, estufa de pellet, bomba de pozo)
  const criticalLoadsDailyKwh = backupPriority === "total_casa" ? dailyKwhDemand : dailyKwhDemand * 0.40;

  let nominalBatteryKwh = 0;

  if (systemType === "hibrida") {
    // En sistemas híbridos, se busca cubrir el consumo nocturno y dar respaldo de 12-24h
    if (backupPriority === "total_casa") {
      nominalBatteryKwh = Math.max(10.0, Math.ceil(dailyKwhDemand / 5.12) * 5.12);
    } else {
      // Cargas críticas: 1 a 2 módulos de 5.12 kWh
      if (installedKwp <= 5.0) nominalBatteryKwh = 5.12;
      else if (installedKwp <= 9.0) nominalBatteryKwh = 10.24;
      else nominalBatteryKwh = 15.36;
    }
  } else if (systemType === "offgrid") {
    // En sistemas Off-Grid, se exige una autonomía invernal mínima de 2 a 3 días
    const targetAutonomyDays = 2.5;
    const requiredUsableKwh = dailyKwhDemand * targetAutonomyDays;
    const requiredNominalKwh = requiredUsableKwh / ((SOL_LIFEPO4_SPECS.dodMaxPercent / 100) * (SOL_LIFEPO4_SPECS.roundTripEfficiencyPercent / 100));

    // Escalar en múltiplos de 5.12 kWh
    const modulesCount = Math.max(3, Math.ceil(requiredNominalKwh / 5.12));
    nominalBatteryKwh = modulesCount * 5.12;
  } else {
    // On-Grid puro no lleva baterías
    nominalBatteryKwh = 0;
  }

  // Redondeo comercial a 1 decimal
  nominalBatteryKwh = Math.round(nominalBatteryKwh * 10) / 10;

  const usableBatteryKwh = Math.round(
    (nominalBatteryKwh * (SOL_LIFEPO4_SPECS.dodMaxPercent / 100) * (SOL_LIFEPO4_SPECS.roundTripEfficiencyPercent / 100)) * 10
  ) / 10;

  const maxContinuousDischargeKw = Math.round(nominalBatteryKwh * SOL_LIFEPO4_SPECS.cRateStandard * 10) / 10;

  const estimatedAutonomyHoursCriticalLoads =
    criticalLoadsDailyKwh > 0 ? Math.round((usableBatteryKwh / (criticalLoadsDailyKwh / 24)) * 10) / 10 : 0;

  const estimatedWinterAutonomyDays =
    dailyKwhDemand > 0 ? Math.round((usableBatteryKwh / dailyKwhDemand) * 10) / 10 : 0;

  const modulesCount = nominalBatteryKwh > 0 ? Math.round(nominalBatteryKwh / 5.12) : 0;

  const modelName =
    nominalBatteryKwh > 0
      ? `SoldeRío LiFePO4 SafeVault ${nominalBatteryKwh} kWh (${modulesCount}x 5.12 kWh BMS Dual)`
      : "Sin almacenamiento (On-Grid puro)";

  return {
    systemType,
    nominalBatteryKwh,
    usableBatteryKwh,
    maxContinuousDischargeKw,
    estimatedAutonomyHoursCriticalLoads,
    estimatedWinterAutonomyDays,
    estimatedCyclesLifeYears: 15,
    hasStsFastSwitch: systemType !== "ongrid",
    recommendedModulesCount: modulesCount,
    recommendedModelName: modelName,
  };
}
