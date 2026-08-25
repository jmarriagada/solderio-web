/**
 * Solderío Solar Engineering - Módulo de Física Solar & BOS
 * Modela la termodinámica de celdas N-Type TOPCon 580W, pérdidas BOS y curvas de generación
 */

import { CommuneMeteorologicalProfile, MonthlyMeteorology } from "./meteorology-tmy";

export interface PVModuleSpecs {
  model: string;
  technology: "N-Type TOPCon Bifacial" | "Mono PERC";
  pStcWatts: number;
  gammaPmpPercentPerCelsius: number; // Coeficiente térmico de potencia (-0.30%/°C para TOPCon)
  noctCelsius: number; // Temperatura de Operación Nominal de Celda (43°C)
  efficiencyPercent: number; // 22.5%
  areaM2: number; // ~2.58 m² por módulo 580W
}

export const TOPCON_580W_SPECS: PVModuleSpecs = {
  model: "SoldeRío Tier 1 N-Type TOPCon 580W Bifacial",
  technology: "N-Type TOPCon Bifacial",
  pStcWatts: 580,
  gammaPmpPercentPerCelsius: -0.30,
  noctCelsius: 43.0,
  efficiencyPercent: 22.5,
  areaM2: 2.58,
};

export interface SystemLossesBOS {
  soilingLossPercent: number; // Ensuciamiento (2.0% en el sur con lluvia frecuente)
  mismatchLossPercent: number; // Mismatch y tolerancia de fábrica (1.5%)
  dcWiringLossPercent: number; // Caída de tensión DC (1.2% <= 1.5% RIC N°09)
  acWiringLossPercent: number; // Caída de tensión AC (1.8% <= 3.0% RIC N°09)
  inverterEfficiencyPercent: number; // Eficiencia europea inversor string (97.5%)
}

export const DEFAULT_BOS_LOSSES: SystemLossesBOS = {
  soilingLossPercent: 2.0,
  mismatchLossPercent: 1.5,
  dcWiringLossPercent: 1.2,
  acWiringLossPercent: 1.8,
  inverterEfficiencyPercent: 97.5,
};

export interface MonthlyGenerationResult {
  month: number;
  monthName: string;
  poaKwhM2Day: number;
  tCellCelsius: number;
  thermalDeratingFactor: number;
  performanceRatioPercent: number;
  monthlyGenKwh: number;
}

export interface PhysicalSimulationResult {
  installedKwp: number;
  panelsCount: number;
  inverterKw: number;
  ilrRatio: number; // Inverter Loading Ratio (DC/AC Overclocking)
  annualGenKwh: number;
  summerAvgMonthlyGenKwh: number; // Promedio Diciembre-Febrero
  winterAvgMonthlyGenKwh: number; // Promedio Junio-Agosto
  seasonalVariationRatio: number; // Ratio Verano / Invierno (~4.5x a 5x en el sur)
  avgPerformanceRatioPercent: number;
  monthlyBreakdown: MonthlyGenerationResult[];
}

/**
 * Calcula la temperatura media de celda en función de la irradiación y temperatura ambiente
 */
export function calculateCellTemperature(
  tAmbCelsius: number,
  poaKwhM2Day: number,
  noctCelsius: number = TOPCON_580W_SPECS.noctCelsius
): number {
  // Pico de irradiación equivalente medio diario (W/m²)
  const effectivePeakIrradianceW = Math.min(1000, Math.max(200, (poaKwhM2Day / 4.5) * 1000));
  return Math.round((tAmbCelsius + ((noctCelsius - 20) / 800) * effectivePeakIrradianceW) * 10) / 10;
}

/**
 * Simula la generación física de una planta solar con tecnología N-Type TOPCon en el sur
 */
export function simulateSolarPlantGeneration(
  panelsCount: number,
  communeProfile: CommuneMeteorologicalProfile,
  moduleSpecs: PVModuleSpecs = TOPCON_580W_SPECS,
  bosLosses: SystemLossesBOS = DEFAULT_BOS_LOSSES
): PhysicalSimulationResult {
  const installedKwp = Math.round(((panelsCount * moduleSpecs.pStcWatts) / 1000) * 10) / 10;

  // Selección óptima del inversor con Overclocking (ILR objetivo: 1.18 - 1.33 en el sur)
  let inverterKw = 5.0;
  if (installedKwp <= 3.8) inverterKw = 3.0;
  else if (installedKwp <= 5.2) inverterKw = 4.0;
  else if (installedKwp <= 6.6) inverterKw = 5.0;
  else if (installedKwp <= 8.0) inverterKw = 6.0;
  else if (installedKwp <= 10.5) inverterKw = 8.0;
  else if (installedKwp <= 13.5) inverterKw = 10.0;
  else if (installedKwp <= 16.5) inverterKw = 12.0;
  else if (installedKwp <= 20.5) inverterKw = 15.0;
  else inverterKw = Math.ceil(installedKwp / 1.25);

  const ilrRatio = Math.round((installedKwp / inverterKw) * 100) / 100;

  const effectiveSoiling = communeProfile.soilingLossPct || bosLosses.soilingLossPercent;

  // Factor de pérdidas no térmicas (calibrado con régimen pluvial de la macrozona sur)
  const nonThermalLossesFactor =
    (1 - effectiveSoiling / 100) *
    (1 - bosLosses.mismatchLossPercent / 100) *
    (1 - bosLosses.dcWiringLossPercent / 100) *
    (1 - bosLosses.acWiringLossPercent / 100) *
    (bosLosses.inverterEfficiencyPercent / 100);

  let annualGenKwh = 0;
  const monthlyBreakdown: MonthlyGenerationResult[] = [];

  communeProfile.monthlyData.forEach((m: MonthlyMeteorology) => {
    const tCell = calculateCellTemperature(m.avgTempCelsius, m.poaKwhM2Day, moduleSpecs.noctCelsius);

    // Derating térmico: P_DC = P_STC * [1 + gamma * (T_cell - 25)]
    // En invierno en el sur T_cell puede ser < 25°C, incrementando la eficiencia del módulo
    const thermalDeratingFactor = 1 + (moduleSpecs.gammaPmpPercentPerCelsius / 100) * (tCell - 25);

    const monthlyPR = Math.round(nonThermalLossesFactor * thermalDeratingFactor * 1000) / 10;

    // Generación mensual: E = P_DC_kW * HSP_diarias * días * PR
    const monthlyGen = Math.round(installedKwp * m.poaKwhM2Day * m.daysInMonth * (monthlyPR / 100));

    annualGenKwh += monthlyGen;

    monthlyBreakdown.push({
      month: m.month,
      monthName: m.monthName,
      poaKwhM2Day: m.poaKwhM2Day,
      tCellCelsius: tCell,
      thermalDeratingFactor: Math.round(thermalDeratingFactor * 1000) / 1000,
      performanceRatioPercent: monthlyPR,
      monthlyGenKwh: monthlyGen,
    });
  });

  // Cálculo de estacionalidad (Verano: Dic, Ene, Feb vs Invierno: Jun, Jul, Ago)
  const summerGen = monthlyBreakdown[11].monthlyGenKwh + monthlyBreakdown[0].monthlyGenKwh + monthlyBreakdown[1].monthlyGenKwh;
  const winterGen = monthlyBreakdown[5].monthlyGenKwh + monthlyBreakdown[6].monthlyGenKwh + monthlyBreakdown[7].monthlyGenKwh;

  const summerAvgMonthlyGenKwh = Math.round(summerGen / 3);
  const winterAvgMonthlyGenKwh = Math.round(winterGen / 3);
  const seasonalVariationRatio = Math.round((summerAvgMonthlyGenKwh / Math.max(1, winterAvgMonthlyGenKwh)) * 10) / 10;

  const avgPerformanceRatioPercent = Math.round(
    (monthlyBreakdown.reduce((acc, m) => acc + m.performanceRatioPercent, 0) / 12) * 10
  ) / 10;

  return {
    installedKwp,
    panelsCount,
    inverterKw,
    ilrRatio,
    annualGenKwh,
    summerAvgMonthlyGenKwh,
    winterAvgMonthlyGenKwh,
    seasonalVariationRatio,
    avgPerformanceRatioPercent,
    monthlyBreakdown,
  };
}
