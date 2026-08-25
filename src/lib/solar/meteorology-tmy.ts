/**
 * Solderío Solar Engineering - Módulo Meteorológico TMY
 * Macro-zona Sur de Chile (Araucanía, Los Ríos, Los Lagos)
 * Base de datos de irradiación en el plano del generador (POA a 30° Norte) y temperaturas medias
 */

export interface MonthlyMeteorology {
  month: number; // 1 to 12
  monthName: string;
  ghiKwhM2Day: number; // Global Horizontal Irradiance (kWh/m²/día)
  poaKwhM2Day: number; // Plane of Array Irradiance a inclinación óptima (kWh/m²/día)
  dhiKwhM2Day?: number; // Radiación Difusa Horizontal (kWh/m²/día) - Explorador Solar MinEnergía
  avgTempCelsius: number; // Temperatura ambiente media (°C)
  daysInMonth: number;
}

export interface CommuneMeteorologicalProfile {
  commune: string;
  region: "Araucanía" | "Los Ríos" | "Los Lagos" | "Aysén";
  latitude: number;
  optimalTiltDeg: number; // Inclinación óptima anual recomendada (° Norte) según SIG MinEnergía
  annualGhiKwhM2: number;
  annualPoaKwhM2: number;
  specificYieldKwhKwp: number; // Yield específico anual proyectado (kWh/kWp/año)
  soilingLossPct: number; // Pérdida por suciedad calibrada con régimen pluvial del sur (~1.8%)
  albedoDefault: number; // Albedo medio de superficie (0.20 - 0.25 en zona sur)
  dataSource: string; // "Explorador Solar MinEnergía (Resolución 1km)"
  monthlyData: MonthlyMeteorology[];
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Perfiles TMY calibrados con datos SIG del Explorador Solar MinEnergía (Resolución 1km)
const METEOROLOGY_DATABASE: Record<string, CommuneMeteorologicalProfile> = {
  temuco: {
    commune: "Temuco",
    region: "Araucanía",
    latitude: -38.74,
    optimalTiltDeg: 32,
    annualGhiKwhM2: 1420,
    annualPoaKwhM2: 1590,
    specificYieldKwhKwp: 1320,
    soilingLossPct: 1.8,
    albedoDefault: 0.22,
    dataSource: "Explorador Solar MinEnergía (Resolución 1km)",
    monthlyData: [
      { month: 1, monthName: "Enero", ghiKwhM2Day: 7.1, poaKwhM2Day: 7.4, dhiKwhM2Day: 2.1, avgTempCelsius: 17.5, daysInMonth: 31 },
      { month: 2, monthName: "Febrero", ghiKwhM2Day: 6.2, poaKwhM2Day: 6.8, dhiKwhM2Day: 1.9, avgTempCelsius: 16.8, daysInMonth: 28 },
      { month: 3, monthName: "Marzo", ghiKwhM2Day: 4.8, poaKwhM2Day: 5.6, dhiKwhM2Day: 1.7, avgTempCelsius: 14.5, daysInMonth: 31 },
      { month: 4, monthName: "Abril", ghiKwhM2Day: 3.1, poaKwhM2Day: 3.9, dhiKwhM2Day: 1.4, avgTempCelsius: 11.8, daysInMonth: 30 },
      { month: 5, monthName: "Mayo", ghiKwhM2Day: 1.8, poaKwhM2Day: 2.4, dhiKwhM2Day: 1.1, avgTempCelsius: 9.5, daysInMonth: 31 },
      { month: 6, monthName: "Junio", ghiKwhM2Day: 1.3, poaKwhM2Day: 1.8, dhiKwhM2Day: 0.9, avgTempCelsius: 7.8, daysInMonth: 30 },
      { month: 7, monthName: "Julio", ghiKwhM2Day: 1.5, poaKwhM2Day: 2.0, dhiKwhM2Day: 1.0, avgTempCelsius: 7.4, daysInMonth: 31 },
      { month: 8, monthName: "Agosto", ghiKwhM2Day: 2.3, poaKwhM2Day: 3.0, dhiKwhM2Day: 1.2, avgTempCelsius: 8.5, daysInMonth: 31 },
      { month: 9, monthName: "Septiembre", ghiKwhM2Day: 3.6, poaKwhM2Day: 4.4, dhiKwhM2Day: 1.5, avgTempCelsius: 10.2, daysInMonth: 30 },
      { month: 10, monthName: "Octubre", ghiKwhM2Day: 5.1, poaKwhM2Day: 5.7, dhiKwhM2Day: 1.8, avgTempCelsius: 12.4, daysInMonth: 31 },
      { month: 11, monthName: "Noviembre", ghiKwhM2Day: 6.4, poaKwhM2Day: 6.8, dhiKwhM2Day: 2.0, avgTempCelsius: 14.6, daysInMonth: 30 },
      { month: 12, monthName: "Diciembre", ghiKwhM2Day: 7.2, poaKwhM2Day: 7.5, dhiKwhM2Day: 2.2, avgTempCelsius: 16.5, daysInMonth: 31 },
    ],
  },
  valdivia: {
    commune: "Valdivia",
    region: "Los Ríos",
    latitude: -39.81,
    optimalTiltDeg: 33,
    annualGhiKwhM2: 1310,
    annualPoaKwhM2: 1475,
    specificYieldKwhKwp: 1210,
    soilingLossPct: 1.6,
    albedoDefault: 0.20,
    dataSource: "Explorador Solar MinEnergía (Resolución 1km)",
    monthlyData: [
      { month: 1, monthName: "Enero", ghiKwhM2Day: 6.6, poaKwhM2Day: 7.0, dhiKwhM2Day: 2.2, avgTempCelsius: 16.8, daysInMonth: 31 },
      { month: 2, monthName: "Febrero", ghiKwhM2Day: 5.8, poaKwhM2Day: 6.4, dhiKwhM2Day: 1.9, avgTempCelsius: 16.2, daysInMonth: 28 },
      { month: 3, monthName: "Marzo", ghiKwhM2Day: 4.4, poaKwhM2Day: 5.2, dhiKwhM2Day: 1.6, avgTempCelsius: 14.1, daysInMonth: 31 },
      { month: 4, monthName: "Abril", ghiKwhM2Day: 2.7, poaKwhM2Day: 3.5, dhiKwhM2Day: 1.3, avgTempCelsius: 11.2, daysInMonth: 30 },
      { month: 5, monthName: "Mayo", ghiKwhM2Day: 1.6, poaKwhM2Day: 2.2, dhiKwhM2Day: 1.0, avgTempCelsius: 9.1, daysInMonth: 31 },
      { month: 6, monthName: "Junio", ghiKwhM2Day: 1.1, poaKwhM2Day: 1.5, dhiKwhM2Day: 0.8, avgTempCelsius: 7.5, daysInMonth: 30 },
      { month: 7, monthName: "Julio", ghiKwhM2Day: 1.3, poaKwhM2Day: 1.8, dhiKwhM2Day: 0.9, avgTempCelsius: 7.1, daysInMonth: 31 },
      { month: 8, monthName: "Agosto", ghiKwhM2Day: 2.0, poaKwhM2Day: 2.7, dhiKwhM2Day: 1.1, avgTempCelsius: 8.0, daysInMonth: 31 },
      { month: 9, monthName: "Septiembre", ghiKwhM2Day: 3.2, poaKwhM2Day: 4.0, dhiKwhM2Day: 1.4, avgTempCelsius: 9.8, daysInMonth: 30 },
      { month: 10, monthName: "Octubre", ghiKwhM2Day: 4.6, poaKwhM2Day: 5.3, dhiKwhM2Day: 1.8, avgTempCelsius: 11.9, daysInMonth: 31 },
      { month: 11, monthName: "Noviembre", ghiKwhM2Day: 5.9, poaKwhM2Day: 6.4, dhiKwhM2Day: 2.0, avgTempCelsius: 14.0, daysInMonth: 30 },
      { month: 12, monthName: "Diciembre", ghiKwhM2Day: 6.7, poaKwhM2Day: 7.1, dhiKwhM2Day: 2.2, avgTempCelsius: 15.9, daysInMonth: 31 },
    ],
  },
  osorno: {
    commune: "Osorno",
    region: "Los Lagos",
    latitude: -40.57,
    optimalTiltDeg: 34,
    annualGhiKwhM2: 1260,
    annualPoaKwhM2: 1420,
    specificYieldKwhKwp: 1160,
    soilingLossPct: 1.7,
    albedoDefault: 0.20,
    dataSource: "Explorador Solar MinEnergía (Resolución 1km)",
    monthlyData: [
      { month: 1, monthName: "Enero", ghiKwhM2Day: 6.4, poaKwhM2Day: 6.8, dhiKwhM2Day: 2.2, avgTempCelsius: 16.2, daysInMonth: 31 },
      { month: 2, monthName: "Febrero", ghiKwhM2Day: 5.6, poaKwhM2Day: 6.2, dhiKwhM2Day: 1.9, avgTempCelsius: 15.6, daysInMonth: 28 },
      { month: 3, monthName: "Marzo", ghiKwhM2Day: 4.2, poaKwhM2Day: 5.0, dhiKwhM2Day: 1.6, avgTempCelsius: 13.5, daysInMonth: 31 },
      { month: 4, monthName: "Abril", ghiKwhM2Day: 2.5, poaKwhM2Day: 3.3, dhiKwhM2Day: 1.3, avgTempCelsius: 10.6, daysInMonth: 30 },
      { month: 5, monthName: "Mayo", ghiKwhM2Day: 1.4, poaKwhM2Day: 2.0, dhiKwhM2Day: 0.9, avgTempCelsius: 8.5, daysInMonth: 31 },
      { month: 6, monthName: "Junio", ghiKwhM2Day: 1.0, poaKwhM2Day: 1.4, dhiKwhM2Day: 0.7, avgTempCelsius: 6.9, daysInMonth: 30 },
      { month: 7, monthName: "Julio", ghiKwhM2Day: 1.2, poaKwhM2Day: 1.7, dhiKwhM2Day: 0.8, avgTempCelsius: 6.5, daysInMonth: 31 },
      { month: 8, monthName: "Agosto", ghiKwhM2Day: 1.8, poaKwhM2Day: 2.5, dhiKwhM2Day: 1.1, avgTempCelsius: 7.4, daysInMonth: 31 },
      { month: 9, monthName: "Septiembre", ghiKwhM2Day: 3.0, poaKwhM2Day: 3.8, dhiKwhM2Day: 1.4, avgTempCelsius: 9.1, daysInMonth: 30 },
      { month: 10, monthName: "Octubre", ghiKwhM2Day: 4.4, poaKwhM2Day: 5.1, dhiKwhM2Day: 1.7, avgTempCelsius: 11.2, daysInMonth: 31 },
      { month: 11, monthName: "Noviembre", ghiKwhM2Day: 5.7, poaKwhM2Day: 6.2, dhiKwhM2Day: 2.0, avgTempCelsius: 13.4, daysInMonth: 30 },
      { month: 12, monthName: "Diciembre", ghiKwhM2Day: 6.5, poaKwhM2Day: 6.9, dhiKwhM2Day: 2.2, avgTempCelsius: 15.3, daysInMonth: 31 },
    ],
  },
  puerto_varas: {
    commune: "Puerto Varas",
    region: "Los Lagos",
    latitude: -41.32,
    optimalTiltDeg: 35,
    annualGhiKwhM2: 1230,
    annualPoaKwhM2: 1390,
    specificYieldKwhKwp: 1140,
    soilingLossPct: 1.5,
    albedoDefault: 0.20,
    dataSource: "Explorador Solar MinEnergía (Resolución 1km)",
    monthlyData: [
      { month: 1, monthName: "Enero", ghiKwhM2Day: 6.3, poaKwhM2Day: 6.7, dhiKwhM2Day: 2.2, avgTempCelsius: 15.8, daysInMonth: 31 },
      { month: 2, monthName: "Febrero", ghiKwhM2Day: 5.5, poaKwhM2Day: 6.1, dhiKwhM2Day: 1.9, avgTempCelsius: 15.3, daysInMonth: 28 },
      { month: 3, monthName: "Marzo", ghiKwhM2Day: 4.1, poaKwhM2Day: 4.9, dhiKwhM2Day: 1.6, avgTempCelsius: 13.1, daysInMonth: 31 },
      { month: 4, monthName: "Abril", ghiKwhM2Day: 2.4, poaKwhM2Day: 3.2, dhiKwhM2Day: 1.2, avgTempCelsius: 10.3, daysInMonth: 30 },
      { month: 5, monthName: "Mayo", ghiKwhM2Day: 1.3, poaKwhM2Day: 1.9, dhiKwhM2Day: 0.9, avgTempCelsius: 8.2, daysInMonth: 31 },
      { month: 6, monthName: "Junio", ghiKwhM2Day: 0.9, poaKwhM2Day: 1.3, dhiKwhM2Day: 0.7, avgTempCelsius: 6.7, daysInMonth: 30 },
      { month: 7, monthName: "Julio", ghiKwhM2Day: 1.1, poaKwhM2Day: 1.6, dhiKwhM2Day: 0.8, avgTempCelsius: 6.3, daysInMonth: 31 },
      { month: 8, monthName: "Agosto", ghiKwhM2Day: 1.7, poaKwhM2Day: 2.4, dhiKwhM2Day: 1.1, avgTempCelsius: 7.1, daysInMonth: 31 },
      { month: 9, monthName: "Septiembre", ghiKwhM2Day: 2.9, poaKwhM2Day: 3.7, dhiKwhM2Day: 1.4, avgTempCelsius: 8.8, daysInMonth: 30 },
      { month: 10, monthName: "Octubre", ghiKwhM2Day: 4.3, poaKwhM2Day: 5.0, dhiKwhM2Day: 1.7, avgTempCelsius: 10.9, daysInMonth: 31 },
      { month: 11, monthName: "Noviembre", ghiKwhM2Day: 5.6, poaKwhM2Day: 6.1, dhiKwhM2Day: 2.0, avgTempCelsius: 13.0, daysInMonth: 30 },
      { month: 12, monthName: "Diciembre", ghiKwhM2Day: 6.4, poaKwhM2Day: 6.8, dhiKwhM2Day: 2.2, avgTempCelsius: 14.9, daysInMonth: 31 },
    ],
  },
  puerto_montt: {
    commune: "Puerto Montt",
    region: "Los Lagos",
    latitude: -41.47,
    optimalTiltDeg: 35,
    annualGhiKwhM2: 1210,
    annualPoaKwhM2: 1365,
    specificYieldKwhKwp: 1120,
    soilingLossPct: 1.5,
    albedoDefault: 0.20,
    dataSource: "Explorador Solar MinEnergía (Resolución 1km)",
    monthlyData: [
      { month: 1, monthName: "Enero", ghiKwhM2Day: 6.2, poaKwhM2Day: 6.6, dhiKwhM2Day: 2.2, avgTempCelsius: 15.5, daysInMonth: 31 },
      { month: 2, monthName: "Febrero", ghiKwhM2Day: 5.4, poaKwhM2Day: 6.0, dhiKwhM2Day: 1.9, avgTempCelsius: 15.0, daysInMonth: 28 },
      { month: 3, monthName: "Marzo", ghiKwhM2Day: 4.0, poaKwhM2Day: 4.8, dhiKwhM2Day: 1.6, avgTempCelsius: 12.8, daysInMonth: 31 },
      { month: 4, monthName: "Abril", ghiKwhM2Day: 2.3, poaKwhM2Day: 3.1, dhiKwhM2Day: 1.2, avgTempCelsius: 10.1, daysInMonth: 30 },
      { month: 5, monthName: "Mayo", ghiKwhM2Day: 1.2, poaKwhM2Day: 1.8, dhiKwhM2Day: 0.9, avgTempCelsius: 8.0, daysInMonth: 31 },
      { month: 6, monthName: "Junio", ghiKwhM2Day: 0.8, poaKwhM2Day: 1.2, dhiKwhM2Day: 0.6, avgTempCelsius: 6.5, daysInMonth: 30 },
      { month: 7, monthName: "Julio", ghiKwhM2Day: 1.0, poaKwhM2Day: 1.5, dhiKwhM2Day: 0.8, avgTempCelsius: 6.1, daysInMonth: 31 },
      { month: 8, monthName: "Agosto", ghiKwhM2Day: 1.6, poaKwhM2Day: 2.3, dhiKwhM2Day: 1.1, avgTempCelsius: 6.9, daysInMonth: 31 },
      { month: 9, monthName: "Septiembre", ghiKwhM2Day: 2.8, poaKwhM2Day: 3.6, dhiKwhM2Day: 1.4, avgTempCelsius: 8.5, daysInMonth: 30 },
      { month: 10, monthName: "Octubre", ghiKwhM2Day: 4.2, poaKwhM2Day: 4.9, dhiKwhM2Day: 1.7, avgTempCelsius: 10.6, daysInMonth: 31 },
      { month: 11, monthName: "Noviembre", ghiKwhM2Day: 5.5, poaKwhM2Day: 6.0, dhiKwhM2Day: 2.0, avgTempCelsius: 12.7, daysInMonth: 30 },
      { month: 12, monthName: "Diciembre", ghiKwhM2Day: 6.3, poaKwhM2Day: 6.7, dhiKwhM2Day: 2.2, avgTempCelsius: 14.6, daysInMonth: 31 },
    ],
  },
  castro: {
    commune: "Castro",
    region: "Los Lagos",
    latitude: -42.48,
    optimalTiltDeg: 36,
    annualGhiKwhM2: 1150,
    annualPoaKwhM2: 1290,
    specificYieldKwhKwp: 1050,
    soilingLossPct: 1.5,
    albedoDefault: 0.20,
    dataSource: "Explorador Solar MinEnergía (Resolución 1km)",
    monthlyData: [
      { month: 1, monthName: "Enero", ghiKwhM2Day: 5.8, poaKwhM2Day: 6.2, dhiKwhM2Day: 2.1, avgTempCelsius: 15.0, daysInMonth: 31 },
      { month: 2, monthName: "Febrero", ghiKwhM2Day: 5.0, poaKwhM2Day: 5.6, dhiKwhM2Day: 1.8, avgTempCelsius: 14.6, daysInMonth: 28 },
      { month: 3, monthName: "Marzo", ghiKwhM2Day: 3.7, poaKwhM2Day: 4.5, dhiKwhM2Day: 1.5, avgTempCelsius: 12.4, daysInMonth: 31 },
      { month: 4, monthName: "Abril", ghiKwhM2Day: 2.1, poaKwhM2Day: 2.9, dhiKwhM2Day: 1.1, avgTempCelsius: 9.8, daysInMonth: 30 },
      { month: 5, monthName: "Mayo", ghiKwhM2Day: 1.1, poaKwhM2Day: 1.6, dhiKwhM2Day: 0.8, avgTempCelsius: 7.8, daysInMonth: 31 },
      { month: 6, monthName: "Junio", ghiKwhM2Day: 0.7, poaKwhM2Day: 1.0, dhiKwhM2Day: 0.5, avgTempCelsius: 6.3, daysInMonth: 30 },
      { month: 7, monthName: "Julio", ghiKwhM2Day: 0.9, poaKwhM2Day: 1.3, dhiKwhM2Day: 0.7, avgTempCelsius: 5.9, daysInMonth: 31 },
      { month: 8, monthName: "Agosto", ghiKwhM2Day: 1.4, poaKwhM2Day: 2.0, dhiKwhM2Day: 0.9, avgTempCelsius: 6.6, daysInMonth: 31 },
      { month: 9, monthName: "Septiembre", ghiKwhM2Day: 2.5, poaKwhM2Day: 3.3, dhiKwhM2Day: 1.3, avgTempCelsius: 8.1, daysInMonth: 30 },
      { month: 10, monthName: "Octubre", ghiKwhM2Day: 3.9, poaKwhM2Day: 4.6, dhiKwhM2Day: 1.6, avgTempCelsius: 10.1, daysInMonth: 31 },
      { month: 11, monthName: "Noviembre", ghiKwhM2Day: 5.1, poaKwhM2Day: 5.6, dhiKwhM2Day: 1.9, avgTempCelsius: 12.1, daysInMonth: 30 },
      { month: 12, monthName: "Diciembre", ghiKwhM2Day: 5.9, poaKwhM2Day: 6.3, dhiKwhM2Day: 2.1, avgTempCelsius: 14.1, daysInMonth: 31 },
    ],
  },
  coyhaique: {
    commune: "Coyhaique",
    region: "Aysén",
    latitude: -45.57,
    optimalTiltDeg: 38,
    annualGhiKwhM2: 1140,
    annualPoaKwhM2: 1280,
    specificYieldKwhKwp: 1040,
    soilingLossPct: 1.4,
    albedoDefault: 0.22,
    dataSource: "Explorador Solar MinEnergía (Resolución 1km)",
    monthlyData: [
      { month: 1, monthName: "Enero", ghiKwhM2Day: 6.0, poaKwhM2Day: 6.4, dhiKwhM2Day: 2.0, avgTempCelsius: 14.2, daysInMonth: 31 },
      { month: 2, monthName: "Febrero", ghiKwhM2Day: 5.1, poaKwhM2Day: 5.7, dhiKwhM2Day: 1.8, avgTempCelsius: 13.8, daysInMonth: 28 },
      { month: 3, monthName: "Marzo", ghiKwhM2Day: 3.6, poaKwhM2Day: 4.3, dhiKwhM2Day: 1.4, avgTempCelsius: 11.2, daysInMonth: 31 },
      { month: 4, monthName: "Abril", ghiKwhM2Day: 1.9, poaKwhM2Day: 2.6, dhiKwhM2Day: 1.0, avgTempCelsius: 7.9, daysInMonth: 30 },
      { month: 5, monthName: "Mayo", ghiKwhM2Day: 0.9, poaKwhM2Day: 1.4, dhiKwhM2Day: 0.6, avgTempCelsius: 5.2, daysInMonth: 31 },
      { month: 6, monthName: "Junio", ghiKwhM2Day: 0.5, poaKwhM2Day: 0.8, dhiKwhM2Day: 0.4, avgTempCelsius: 3.1, daysInMonth: 30 },
      { month: 7, monthName: "Julio", ghiKwhM2Day: 0.7, poaKwhM2Day: 1.1, dhiKwhM2Day: 0.5, avgTempCelsius: 2.8, daysInMonth: 31 },
      { month: 8, monthName: "Agosto", ghiKwhM2Day: 1.3, poaKwhM2Day: 1.9, dhiKwhM2Day: 0.8, avgTempCelsius: 4.4, daysInMonth: 31 },
      { month: 9, monthName: "Septiembre", ghiKwhM2Day: 2.4, poaKwhM2Day: 3.2, dhiKwhM2Day: 1.2, avgTempCelsius: 6.8, daysInMonth: 30 },
      { month: 10, monthName: "Octubre", ghiKwhM2Day: 3.9, poaKwhM2Day: 4.7, dhiKwhM2Day: 1.6, avgTempCelsius: 9.2, daysInMonth: 31 },
      { month: 11, monthName: "Noviembre", ghiKwhM2Day: 5.3, poaKwhM2Day: 5.9, dhiKwhM2Day: 1.9, avgTempCelsius: 11.5, daysInMonth: 30 },
      { month: 12, monthName: "Diciembre", ghiKwhM2Day: 6.1, poaKwhM2Day: 6.6, dhiKwhM2Day: 2.0, avgTempCelsius: 13.4, daysInMonth: 31 },
    ],
  },
};

// Catálogo oficial completo de Regiones y Comunas de la Macrozona Sur (Araucanía, Los Ríos, Los Lagos y Aysén)
export const SOUTHERN_REGIONS_AND_COMUNAS: Record<string, string[]> = {
  "Región de Los Lagos": [
    "Puerto Varas",
    "Puerto Montt",
    "Osorno",
    "Frutillar",
    "Llanquihue",
    "Castro",
    "Ancud",
    "Calbuco",
    "Chaitén",
    "Chonchi",
    "Cochamó",
    "Curaco de Vélez",
    "Dalcahue",
    "Fresia",
    "Futaleufú",
    "Hualaihué",
    "Los Muermos",
    "Maullín",
    "Palena",
    "Puerto Octay",
    "Puqueldón",
    "Purranque",
    "Puyehue",
    "Queilén",
    "Quellón",
    "Quemchi",
    "Quinchao",
    "Río Negro",
    "San Juan de la Costa",
    "San Pablo",
  ],
  "Región de Los Ríos": [
    "Valdivia",
    "Panguipulli",
    "La Unión",
    "Río Bueno",
    "Corral",
    "Futrono",
    "Lago Ranco",
    "Lanco",
    "Los Lagos",
    "Máfil",
    "Mariquina",
    "Paillaco",
  ],
  "Región de La Araucanía": [
    "Temuco",
    "Padre Las Casas",
    "Villarrica",
    "Pucón",
    "Angol",
    "Victoria",
    "Lautaro",
    "Nueva Imperial",
    "Carahue",
    "Cholchol",
    "Collipulli",
    "Cunco",
    "Curacautín",
    "Curarrehue",
    "Ercilla",
    "Freire",
    "Galvarino",
    "Gorbea",
    "Loncoche",
    "Lonquimay",
    "Los Sauces",
    "Lumaco",
    "Melipeuco",
    "Perquenco",
    "Pitrufquén",
    "Purén",
    "Renaico",
    "Saavedra",
    "Teodoro Schmidt",
    "Toltén",
    "Traiguén",
    "Vilcún",
  ],
  "Región de Aysén": [
    "Coyhaique",
    "Aysén",
    "Chile Chico",
    "Cisnes",
    "Cochrane",
    "Guaitecas",
    "Lago Verde",
    "O'Higgins",
    "Río Ibáñez",
    "Tortel",
  ],
};

// Aliases para comunas cercanas de toda la macrozona sur (Araucanía, Los Ríos, Los Lagos y Aysén)
const COMMUNE_ALIASES: Record<string, string> = {
  // Cuenca del Lago Llanquihue y Seno de Reloncaví
  llanquihue: "puerto_varas",
  frutillar: "puerto_varas",
  puerto_octay: "osorno",
  calbuco: "puerto_montt",
  los_muermos: "puerto_montt",
  fresia: "puerto_varas",
  maullin: "puerto_montt",
  cochamo: "puerto_montt",

  // Provincia de Osorno
  san_pablo: "osorno",
  puyehue: "osorno",
  entre_lagos: "osorno",
  purranque: "osorno",
  rio_negro: "osorno",
  san_juan_de_la_costa: "osorno",

  // Región de Los Ríos
  rio_bueno: "osorno",
  la_union: "valdivia",
  panguipulli: "valdivia",
  los_lagos: "valdivia",
  futrono: "valdivia",
  lago_ranco: "osorno",
  paillaco: "valdivia",
  mariquina: "valdivia",
  san_jose_de_la_mariquina: "valdivia",
  lanco: "valdivia",
  mafil: "valdivia",
  corral: "valdivia",

  // Provincia de Chiloé y Palena
  ancud: "castro",
  chonchi: "castro",
  quellon: "castro",
  dalcahue: "castro",
  curaco_de_velez: "castro",
  quinchao: "castro",
  achao: "castro",
  puqueldon: "castro",
  queilen: "castro",
  quemchi: "castro",
  chaiten: "castro",
  futaleufu: "castro",
  palena: "castro",
  hualaihue: "puerto_montt",
  horno_piren: "puerto_montt",

  // Región de La Araucanía
  pucon: "temuco",
  villarrica: "temuco",
  lautaro: "temuco",
  padre_las_casas: "temuco",
  nueva_imperial: "temuco",
  carahue: "temuco",
  victoria: "temuco",
  angol: "temuco",
  gorbea: "temuco",
  loncoche: "temuco",
  curarrehue: "temuco",
  cunco: "temuco",
  melipeuco: "temuco",
  freire: "temuco",
  pitrufquen: "temuco",
  cholchol: "temuco",
  saavedra: "temuco",
  puerto_saavedra: "temuco",
  teodoro_schmidt: "temuco",
  tolten: "temuco",
  traiguen: "temuco",
  galvarino: "temuco",
  lumaco: "temuco",
  puren: "temuco",
  renaico: "temuco",
  collipulli: "temuco",
  curacautin: "temuco",
  lonquimay: "temuco",
  ercilla: "temuco",
  los_sauces: "temuco",
  perquenco: "temuco",
  vilcun: "temuco",

  // Región de Aysén
  puerto_aysen: "coyhaique",
  aysen: "coyhaique",
  chile_chico: "coyhaique",
  cochrane: "coyhaique",
  cisnes: "coyhaique",
  guaitecas: "coyhaique",
  lago_verde: "coyhaique",
  ohiggins: "coyhaique",
  rio_ibanez: "coyhaique",
  tortel: "coyhaique",
};

export function getMeteorologicalProfile(communeName?: string): CommuneMeteorologicalProfile {
  if (!communeName) return METEOROLOGY_DATABASE.puerto_varas;

  const normalized = communeName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s-']/g, "_");

  if (METEOROLOGY_DATABASE[normalized]) {
    return METEOROLOGY_DATABASE[normalized];
  }

  const aliasTarget = COMMUNE_ALIASES[normalized];
  if (aliasTarget && METEOROLOGY_DATABASE[aliasTarget]) {
    return METEOROLOGY_DATABASE[aliasTarget];
  }

  // Default para la macrozona sur
  return METEOROLOGY_DATABASE.puerto_varas;
}

