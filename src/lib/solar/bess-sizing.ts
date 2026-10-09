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
    // En sistemas híbridos residenciales (Huawei LUNA2000 modular de 5.12 kWh):
    if (backupPriority === "total_casa") {
      // Respaldo completo: 2 módulos LUNA (10.24 kWh) para hogares estándar (hasta 8.5 kWp),
      // escalando a 15.36 kWh para consumos mayores (>8.5 kWp)
      if (installedKwp <= 8.5) {
        nominalBatteryKwh = 10.24;
      } else if (installedKwp <= 15.0) {
        nominalBatteryKwh = 15.36;
      } else {
        nominalBatteryKwh = Math.min(30.72, Math.max(15.36, Math.ceil(dailyKwhDemand / 5.12) * 5.12));
      }
    } else {
      // Cargas críticas / Respaldo esencial: 1 módulo LUNA de 5.12 kWh para la mayoría de hogares (<= 8.5 kWp)
      if (installedKwp <= 8.5) {
        nominalBatteryKwh = 5.12;
      } else if (installedKwp <= 15.0) {
        nominalBatteryKwh = 10.24;
      } else {
        nominalBatteryKwh = 15.36;
      }
    }
  } else if (systemType === "offgrid") {
    // En sistemas Off-Grid asistidos por motogenerador:
    // La batería LiFePO4 cubre la noche y el ciclo diurno nublado normal (autonomía 1.0 a 1.5 días).
    // El respaldo para periodos de temporal prolongado se gestiona con generador auxiliar con arranque ATS.
    // - Para Cargas Críticas (refrigerador, luces, Starlink, bomba, estufa pellet): 10.24 kWh (2 módulos de 5.12 kWh)
    // - Para Total Casa: 10.24 kWh para consumos pequeños (<=320 kWh/mes), 15.36 kWh para consumos medianos (<=600 kWh/mes),
    //   y 20.48 kWh en parcelas mayores con alto consumo
    if (backupPriority === "total_casa") {
      if (monthlyKwhDemand <= 400) {
        nominalBatteryKwh = 10.24; // 2 módulos LiFePO4 (~9.2 kWh útiles, ideal cabañas hasta ~$110k/mes)
      } else if (monthlyKwhDemand <= 800) {
        nominalBatteryKwh = 15.36; // 3 módulos LiFePO4 (~13.8 kWh útiles, casas familiares ~$120k a ~$220k/mes)
      } else {
        nominalBatteryKwh = 20.48; // 4 módulos LiFePO4 (~18.4 kWh útiles, parcelas de alto consumo)
      }
    } else {
      // Cargas críticas en aislada
      if (monthlyKwhDemand <= 450) {
        nominalBatteryKwh = 10.24; // 2 módulos LiFePO4
      } else {
        nominalBatteryKwh = 15.36; // 3 módulos LiFePO4
      }
    }
  } else if (systemType === "bess") {
    // Peak Shaving comercial / industrial: cubre ventana punta de 4 horas (~40% demanda diaria)
    const targetPeakKwh = Math.max(15.36, dailyKwhDemand * 0.40);
    const modulesCount = Math.max(3, Math.ceil(targetPeakKwh / 5.12));
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
      ? systemType === "bess"
        ? `SoldeRío LiFePO4 Commercial BESS ${nominalBatteryKwh} kWh (${modulesCount}x 5.12 kWh Rack Industrial)`
        : `SoldeRío LiFePO4 SafeVault ${nominalBatteryKwh} kWh (${modulesCount}x 5.12 kWh BMS Dual)`
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
