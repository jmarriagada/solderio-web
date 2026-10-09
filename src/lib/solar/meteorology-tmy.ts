/**
 * Solderío Solar Engineering - Módulo Meteorológico TMY
 * Macrozona Sur de Chile (La Araucanía, Los Ríos, Los Lagos)
 * 
 * DATOS OFICIALES 100% AUDITADOS:
 * Extraídos directamente de los archivos horarios TMY (.csv) y reportes (.pdf) oficiales
 * del Explorador Solar de Chile (Ministerio de Energía / FCFM Universidad de Chile)
 * para los 8 puntos geográficos de referencia de la macrozona sur.
 */

export interface MonthlyMeteorology {
  month: number; // 1 to 12
  monthName: string;
  ghiKwhM2Day: number; // Global Horizontal Irradiance (kWh/m²/día)
  poaKwhM2Day: number; // Plane of Array Irradiance a inclinación óptima (kWh/m²/día)
  avgTempCelsius: number; // Temperatura ambiente media 24h (°C)
  daysInMonth: number;
}

export interface CommuneMeteorologicalProfile {
  key: string;
  commune: string;
  region: "Araucanía" | "Los Ríos" | "Los Lagos";
  subzoneDescription: string;
  latitude: number;
  longitude: number;
  elevationM: number;
  optimalTiltDeg: number; // Inclinación óptima recomendada (° Norte) según Explorador Solar
  annualGhiKwhM2: number;
  annualPoaKwhM2: number;
  exploradorBaselinePvKwh: number; // Generación anual 3.5 kWp con supuestos conservadores 2014-2016
  specificYieldKwhKwp: number; // Yield específico anual calibrado SoldeRío (N-Type TOPCon + Huawei 2026)
  soilingLossPct: number; // Pérdida por suciedad con régimen pluvial del sur (1.5% a 1.8%)
  albedoDefault: number; // Albedo medio de superficie (0.20 - 0.24 en zona sur)
  dataSource: string;
  monthlyData: MonthlyMeteorology[];
}

export const METEOROLOGY_DATABASE: Record<string, CommuneMeteorologicalProfile> = {
  temuco: {
    key: "temuco",
    commune: "Temuco",
    region: "Araucanía",
    subzoneDescription: "Valle Central de La Araucanía",
    latitude: -38.74,
    longitude: -72.59,
    elevationM: 123,
    optimalTiltDeg: 31,
    annualGhiKwhM2: 1546.7,
    annualPoaKwhM2: 1719.8,
    exploradorBaselinePvKwh: 4232.3,
    specificYieldKwhKwp: 1332.8,
    soilingLossPct: 1.8,
    albedoDefault: 0.20,
    dataSource: "Explorador Solar MinEnergía / FCFM U. de Chile (TMY Oficial)",
    monthlyData: [
      { month: 1, monthName: "Enero", ghiKwhM2Day: 7.87, poaKwhM2Day: 7.62, avgTempCelsius: 17.5, daysInMonth: 31 },
      { month: 2, monthName: "Febrero", ghiKwhM2Day: 6.69, poaKwhM2Day: 6.99, avgTempCelsius: 17.5, daysInMonth: 28 },
      { month: 3, monthName: "Marzo", ghiKwhM2Day: 4.95, poaKwhM2Day: 5.84, avgTempCelsius: 14.7, daysInMonth: 31 },
      { month: 4, monthName: "Abril", ghiKwhM2Day: 2.88, poaKwhM2Day: 3.88, avgTempCelsius: 12.6, daysInMonth: 30 },
      { month: 5, monthName: "Mayo", ghiKwhM2Day: 1.84, poaKwhM2Day: 2.77, avgTempCelsius: 11.3, daysInMonth: 31 },
      { month: 6, monthName: "Junio", ghiKwhM2Day: 1.25, poaKwhM2Day: 2.14, avgTempCelsius: 7.4, daysInMonth: 30 },
      { month: 7, monthName: "Julio", ghiKwhM2Day: 1.44, poaKwhM2Day: 2.25, avgTempCelsius: 7.3, daysInMonth: 31 },
      { month: 8, monthName: "Agosto", ghiKwhM2Day: 2.03, poaKwhM2Day: 2.91, avgTempCelsius: 9.3, daysInMonth: 31 },
      { month: 9, monthName: "Septiembre", ghiKwhM2Day: 3.64, poaKwhM2Day: 4.31, avgTempCelsius: 9.4, daysInMonth: 30 },
      { month: 10, monthName: "Octubre", ghiKwhM2Day: 4.59, poaKwhM2Day: 4.75, avgTempCelsius: 11.8, daysInMonth: 31 },
      { month: 11, monthName: "Noviembre", ghiKwhM2Day: 6.23, poaKwhM2Day: 6.11, avgTempCelsius: 11.6, daysInMonth: 30 },
      { month: 12, monthName: "Diciembre", ghiKwhM2Day: 7.59, poaKwhM2Day: 7.12, avgTempCelsius: 13.9, daysInMonth: 31 },
    ],
  },
  villarrica: {
    key: "villarrica",
    commune: "Villarrica",
    region: "Araucanía",
    subzoneDescription: "Zona Lacustre Andina",
    latitude: -39.28,
    longitude: -72.23,
    elevationM: 230,
    optimalTiltDeg: 31,
    annualGhiKwhM2: 1550.9,
    annualPoaKwhM2: 1731.4,
    exploradorBaselinePvKwh: 4035.9,
    specificYieldKwhKwp: 1341.8,
    soilingLossPct: 1.8,
    albedoDefault: 0.20,
    dataSource: "Explorador Solar MinEnergía / FCFM U. de Chile (TMY Oficial)",
    monthlyData: [
      { month: 1, monthName: "Enero", ghiKwhM2Day: 7.87, poaKwhM2Day: 7.47, avgTempCelsius: 15.4, daysInMonth: 31 },
      { month: 2, monthName: "Febrero", ghiKwhM2Day: 6.59, poaKwhM2Day: 6.8, avgTempCelsius: 17.8, daysInMonth: 28 },
      { month: 3, monthName: "Marzo", ghiKwhM2Day: 4.54, poaKwhM2Day: 5.4, avgTempCelsius: 15, daysInMonth: 31 },
      { month: 4, monthName: "Abril", ghiKwhM2Day: 3, poaKwhM2Day: 4.04, avgTempCelsius: 12.8, daysInMonth: 30 },
      { month: 5, monthName: "Mayo", ghiKwhM2Day: 1.84, poaKwhM2Day: 2.85, avgTempCelsius: 11.4, daysInMonth: 31 },
      { month: 6, monthName: "Junio", ghiKwhM2Day: 1.3, poaKwhM2Day: 2.19, avgTempCelsius: 5.6, daysInMonth: 30 },
      { month: 7, monthName: "Julio", ghiKwhM2Day: 1.53, poaKwhM2Day: 2.48, avgTempCelsius: 7.1, daysInMonth: 31 },
      { month: 8, monthName: "Agosto", ghiKwhM2Day: 2.18, poaKwhM2Day: 3.12, avgTempCelsius: 7.7, daysInMonth: 31 },
      { month: 9, monthName: "Septiembre", ghiKwhM2Day: 3.87, poaKwhM2Day: 4.71, avgTempCelsius: 10.2, daysInMonth: 30 },
      { month: 10, monthName: "Octubre", ghiKwhM2Day: 4.76, poaKwhM2Day: 5.03, avgTempCelsius: 11.8, daysInMonth: 31 },
      { month: 11, monthName: "Noviembre", ghiKwhM2Day: 6.12, poaKwhM2Day: 5.97, avgTempCelsius: 11.6, daysInMonth: 30 },
      { month: 12, monthName: "Diciembre", ghiKwhM2Day: 7.51, poaKwhM2Day: 6.99, avgTempCelsius: 13.5, daysInMonth: 31 },
    ],
  },
  valdivia: {
    key: "valdivia",
    commune: "Valdivia",
    region: "Los Ríos",
    subzoneDescription: "Costa y Valles Fluviales de Los Ríos",
    latitude: -39.81,
    longitude: -73.24,
    elevationM: 1,
    optimalTiltDeg: 30,
    annualGhiKwhM2: 1499.2,
    annualPoaKwhM2: 1655,
    exploradorBaselinePvKwh: 3872,
    specificYieldKwhKwp: 1282.6,
    soilingLossPct: 1.5,
    albedoDefault: 0.20,
    dataSource: "Explorador Solar MinEnergía / FCFM U. de Chile (TMY Oficial)",
    monthlyData: [
      { month: 1, monthName: "Enero", ghiKwhM2Day: 7.87, poaKwhM2Day: 7.69, avgTempCelsius: 18.6, daysInMonth: 31 },
      { month: 2, monthName: "Febrero", ghiKwhM2Day: 6.52, poaKwhM2Day: 6.86, avgTempCelsius: 14.7, daysInMonth: 28 },
      { month: 3, monthName: "Marzo", ghiKwhM2Day: 4.61, poaKwhM2Day: 5.57, avgTempCelsius: 14.9, daysInMonth: 31 },
      { month: 4, monthName: "Abril", ghiKwhM2Day: 2.72, poaKwhM2Day: 3.45, avgTempCelsius: 11.6, daysInMonth: 30 },
      { month: 5, monthName: "Mayo", ghiKwhM2Day: 1.43, poaKwhM2Day: 2.11, avgTempCelsius: 11, daysInMonth: 31 },
      { month: 6, monthName: "Junio", ghiKwhM2Day: 1.08, poaKwhM2Day: 1.83, avgTempCelsius: 8, daysInMonth: 30 },
      { month: 7, monthName: "Julio", ghiKwhM2Day: 1.24, poaKwhM2Day: 1.91, avgTempCelsius: 8, daysInMonth: 31 },
      { month: 8, monthName: "Agosto", ghiKwhM2Day: 1.71, poaKwhM2Day: 2.16, avgTempCelsius: 10.1, daysInMonth: 31 },
      { month: 9, monthName: "Septiembre", ghiKwhM2Day: 3.61, poaKwhM2Day: 4.39, avgTempCelsius: 9.4, daysInMonth: 30 },
      { month: 10, monthName: "Octubre", ghiKwhM2Day: 4.65, poaKwhM2Day: 5.02, avgTempCelsius: 11.3, daysInMonth: 31 },
      { month: 11, monthName: "Noviembre", ghiKwhM2Day: 6.46, poaKwhM2Day: 6.43, avgTempCelsius: 12.8, daysInMonth: 30 },
      { month: 12, monthName: "Diciembre", ghiKwhM2Day: 7.53, poaKwhM2Day: 7.16, avgTempCelsius: 13.6, daysInMonth: 31 },
    ],
  },
  la_union: {
    key: "la_union",
    commune: "La Unión",
    region: "Los Ríos",
    subzoneDescription: "Cuenca del Lago Ranco y Llanura Sur",
    latitude: -40.29,
    longitude: -73.08,
    elevationM: 42,
    optimalTiltDeg: 33,
    annualGhiKwhM2: 1448.3,
    annualPoaKwhM2: 1615.2,
    exploradorBaselinePvKwh: 3795.8,
    specificYieldKwhKwp: 1251.8,
    soilingLossPct: 1.5,
    albedoDefault: 0.20,
    dataSource: "Explorador Solar MinEnergía / FCFM U. de Chile (TMY Oficial)",
    monthlyData: [
      { month: 1, monthName: "Enero", ghiKwhM2Day: 7.41, poaKwhM2Day: 7.22, avgTempCelsius: 15.9, daysInMonth: 31 },
      { month: 2, monthName: "Febrero", ghiKwhM2Day: 6.1, poaKwhM2Day: 6.3, avgTempCelsius: 17.5, daysInMonth: 28 },
      { month: 3, monthName: "Marzo", ghiKwhM2Day: 4.39, poaKwhM2Day: 5.22, avgTempCelsius: 15.2, daysInMonth: 31 },
      { month: 4, monthName: "Abril", ghiKwhM2Day: 2.51, poaKwhM2Day: 3.37, avgTempCelsius: 11, daysInMonth: 30 },
      { month: 5, monthName: "Mayo", ghiKwhM2Day: 1.54, poaKwhM2Day: 2.35, avgTempCelsius: 8.2, daysInMonth: 31 },
      { month: 6, monthName: "Junio", ghiKwhM2Day: 1.09, poaKwhM2Day: 1.8, avgTempCelsius: 8.4, daysInMonth: 30 },
      { month: 7, monthName: "Julio", ghiKwhM2Day: 1.3, poaKwhM2Day: 2.08, avgTempCelsius: 12.1, daysInMonth: 31 },
      { month: 8, monthName: "Agosto", ghiKwhM2Day: 1.99, poaKwhM2Day: 2.92, avgTempCelsius: 5.2, daysInMonth: 31 },
      { month: 9, monthName: "Septiembre", ghiKwhM2Day: 3.19, poaKwhM2Day: 3.9, avgTempCelsius: 10.3, daysInMonth: 30 },
      { month: 10, monthName: "Octubre", ghiKwhM2Day: 4.34, poaKwhM2Day: 4.64, avgTempCelsius: 11.2, daysInMonth: 31 },
      { month: 11, monthName: "Noviembre", ghiKwhM2Day: 5.94, poaKwhM2Day: 5.88, avgTempCelsius: 12.9, daysInMonth: 30 },
      { month: 12, monthName: "Diciembre", ghiKwhM2Day: 7.91, poaKwhM2Day: 7.51, avgTempCelsius: 16, daysInMonth: 31 },
    ],
  },
  osorno: {
    key: "osorno",
    commune: "Osorno",
    region: "Los Lagos",
    subzoneDescription: "Llano Central de la Provincia de Osorno",
    latitude: -40.57,
    longitude: -73.13,
    elevationM: 24,
    optimalTiltDeg: 32,
    annualGhiKwhM2: 1412.8,
    annualPoaKwhM2: 1553.7,
    exploradorBaselinePvKwh: 3638.2,
    specificYieldKwhKwp: 1204.1,
    soilingLossPct: 1.5,
    albedoDefault: 0.20,
    dataSource: "Explorador Solar MinEnergía / FCFM U. de Chile (TMY Oficial)",
    monthlyData: [
      { month: 1, monthName: "Enero", ghiKwhM2Day: 7.26, poaKwhM2Day: 7.11, avgTempCelsius: 17.4, daysInMonth: 31 },
      { month: 2, monthName: "Febrero", ghiKwhM2Day: 6.19, poaKwhM2Day: 6.43, avgTempCelsius: 17.2, daysInMonth: 28 },
      { month: 3, monthName: "Marzo", ghiKwhM2Day: 4.34, poaKwhM2Day: 5.07, avgTempCelsius: 14.9, daysInMonth: 31 },
      { month: 4, monthName: "Abril", ghiKwhM2Day: 2.37, poaKwhM2Day: 3.05, avgTempCelsius: 10.7, daysInMonth: 30 },
      { month: 5, monthName: "Mayo", ghiKwhM2Day: 1.38, poaKwhM2Day: 2.1, avgTempCelsius: 9.3, daysInMonth: 31 },
      { month: 6, monthName: "Junio", ghiKwhM2Day: 1.01, poaKwhM2Day: 1.76, avgTempCelsius: 7, daysInMonth: 30 },
      { month: 7, monthName: "Julio", ghiKwhM2Day: 1.18, poaKwhM2Day: 1.77, avgTempCelsius: 6.8, daysInMonth: 31 },
      { month: 8, monthName: "Agosto", ghiKwhM2Day: 1.74, poaKwhM2Day: 2.38, avgTempCelsius: 7.1, daysInMonth: 31 },
      { month: 9, monthName: "Septiembre", ghiKwhM2Day: 3.25, poaKwhM2Day: 3.81, avgTempCelsius: 8.7, daysInMonth: 30 },
      { month: 10, monthName: "Octubre", ghiKwhM2Day: 4.26, poaKwhM2Day: 4.56, avgTempCelsius: 11.1, daysInMonth: 31 },
      { month: 11, monthName: "Noviembre", ghiKwhM2Day: 5.68, poaKwhM2Day: 5.64, avgTempCelsius: 12.7, daysInMonth: 30 },
      { month: 12, monthName: "Diciembre", ghiKwhM2Day: 7.92, poaKwhM2Day: 7.51, avgTempCelsius: 15.9, daysInMonth: 31 },
    ],
  },
  puerto_varas: {
    key: "puerto_varas",
    commune: "Puerto Varas",
    region: "Los Lagos",
    subzoneDescription: "Cuenca del Lago Llanquihue",
    latitude: -41.31647510666213,
    longitude: -72.98984597862899,
    elevationM: 71,
    optimalTiltDeg: 33,
    annualGhiKwhM2: 1301.3,
    annualPoaKwhM2: 1470.2,
    exploradorBaselinePvKwh: 3692.4,
    specificYieldKwhKwp: 1139.4,
    soilingLossPct: 1.5,
    albedoDefault: 0.20,
    dataSource: "Explorador Solar MinEnergía / FCFM U. de Chile (TMY Oficial)",
    monthlyData: [
      { month: 1, monthName: "Enero", ghiKwhM2Day: 6.95, poaKwhM2Day: 6.86, avgTempCelsius: 15.6, daysInMonth: 31 },
      { month: 2, monthName: "Febrero", ghiKwhM2Day: 5.52, poaKwhM2Day: 5.98, avgTempCelsius: 14.2, daysInMonth: 28 },
      { month: 3, monthName: "Marzo", ghiKwhM2Day: 3.85, poaKwhM2Day: 4.54, avgTempCelsius: 14.4, daysInMonth: 31 },
      { month: 4, monthName: "Abril", ghiKwhM2Day: 2.29, poaKwhM2Day: 3.12, avgTempCelsius: 10.9, daysInMonth: 30 },
      { month: 5, monthName: "Mayo", ghiKwhM2Day: 1.45, poaKwhM2Day: 2.18, avgTempCelsius: 9, daysInMonth: 31 },
      { month: 6, monthName: "Junio", ghiKwhM2Day: 0.99, poaKwhM2Day: 1.54, avgTempCelsius: 6.3, daysInMonth: 30 },
      { month: 7, monthName: "Julio", ghiKwhM2Day: 1.23, poaKwhM2Day: 2.02, avgTempCelsius: 6.8, daysInMonth: 31 },
      { month: 8, monthName: "Agosto", ghiKwhM2Day: 1.77, poaKwhM2Day: 2.62, avgTempCelsius: 9, daysInMonth: 31 },
      { month: 9, monthName: "Septiembre", ghiKwhM2Day: 3.18, poaKwhM2Day: 3.89, avgTempCelsius: 9.6, daysInMonth: 30 },
      { month: 10, monthName: "Octubre", ghiKwhM2Day: 4.12, poaKwhM2Day: 4.46, avgTempCelsius: 10.5, daysInMonth: 31 },
      { month: 11, monthName: "Noviembre", ghiKwhM2Day: 5.33, poaKwhM2Day: 5.36, avgTempCelsius: 11.1, daysInMonth: 30 },
      { month: 12, monthName: "Diciembre", ghiKwhM2Day: 6.22, poaKwhM2Day: 5.89, avgTempCelsius: 13.4, daysInMonth: 31 },
    ],
  },
  puerto_montt: {
    key: "puerto_montt",
    commune: "Puerto Montt",
    region: "Los Lagos",
    subzoneDescription: "Seno de Reloncaví y Carretera Austral",
    latitude: -41.47,
    longitude: -72.94,
    elevationM: 17,
    optimalTiltDeg: 33,
    annualGhiKwhM2: 1293,
    annualPoaKwhM2: 1430.1,
    exploradorBaselinePvKwh: 3434.3,
    specificYieldKwhKwp: 1108.3,
    soilingLossPct: 1.5,
    albedoDefault: 0.20,
    dataSource: "Explorador Solar MinEnergía / FCFM U. de Chile (TMY Oficial)",
    monthlyData: [
      { month: 1, monthName: "Enero", ghiKwhM2Day: 6.71, poaKwhM2Day: 6.59, avgTempCelsius: 14.7, daysInMonth: 31 },
      { month: 2, monthName: "Febrero", ghiKwhM2Day: 5.52, poaKwhM2Day: 5.79, avgTempCelsius: 16, daysInMonth: 28 },
      { month: 3, monthName: "Marzo", ghiKwhM2Day: 3.85, poaKwhM2Day: 4.56, avgTempCelsius: 14, daysInMonth: 31 },
      { month: 4, monthName: "Abril", ghiKwhM2Day: 2.09, poaKwhM2Day: 2.79, avgTempCelsius: 11.2, daysInMonth: 30 },
      { month: 5, monthName: "Mayo", ghiKwhM2Day: 1.32, poaKwhM2Day: 1.91, avgTempCelsius: 9.6, daysInMonth: 31 },
      { month: 6, monthName: "Junio", ghiKwhM2Day: 1.02, poaKwhM2Day: 1.68, avgTempCelsius: 7.3, daysInMonth: 30 },
      { month: 7, monthName: "Julio", ghiKwhM2Day: 1.09, poaKwhM2Day: 1.62, avgTempCelsius: 8.8, daysInMonth: 31 },
      { month: 8, monthName: "Agosto", ghiKwhM2Day: 1.69, poaKwhM2Day: 2.25, avgTempCelsius: 7.4, daysInMonth: 31 },
      { month: 9, monthName: "Septiembre", ghiKwhM2Day: 3.09, poaKwhM2Day: 3.71, avgTempCelsius: 9.6, daysInMonth: 30 },
      { month: 10, monthName: "Octubre", ghiKwhM2Day: 4.04, poaKwhM2Day: 4.34, avgTempCelsius: 10.5, daysInMonth: 31 },
      { month: 11, monthName: "Noviembre", ghiKwhM2Day: 5.64, poaKwhM2Day: 5.69, avgTempCelsius: 10.5, daysInMonth: 30 },
      { month: 12, monthName: "Diciembre", ghiKwhM2Day: 6.55, poaKwhM2Day: 6.2, avgTempCelsius: 12.7, daysInMonth: 31 },
    ],
  },
  castro: {
    key: "castro",
    commune: "Castro",
    region: "Los Lagos",
    subzoneDescription: "Archipiélago de Chiloé y Palena",
    latitude: -42.48,
    longitude: -73.77,
    elevationM: 31,
    optimalTiltDeg: 32,
    annualGhiKwhM2: 1239.1,
    annualPoaKwhM2: 1366.3,
    exploradorBaselinePvKwh: 3288.9,
    specificYieldKwhKwp: 1058.9,
    soilingLossPct: 1.5,
    albedoDefault: 0.20,
    dataSource: "Explorador Solar MinEnergía / FCFM U. de Chile (TMY Oficial)",
    monthlyData: [
      { month: 1, monthName: "Enero", ghiKwhM2Day: 6.78, poaKwhM2Day: 6.53, avgTempCelsius: 14.8, daysInMonth: 31 },
      { month: 2, monthName: "Febrero", ghiKwhM2Day: 5.44, poaKwhM2Day: 5.63, avgTempCelsius: 14, daysInMonth: 28 },
      { month: 3, monthName: "Marzo", ghiKwhM2Day: 3.56, poaKwhM2Day: 4.05, avgTempCelsius: 12.8, daysInMonth: 31 },
      { month: 4, monthName: "Abril", ghiKwhM2Day: 2.18, poaKwhM2Day: 2.86, avgTempCelsius: 10.5, daysInMonth: 30 },
      { month: 5, monthName: "Mayo", ghiKwhM2Day: 1.35, poaKwhM2Day: 2.03, avgTempCelsius: 9.1, daysInMonth: 31 },
      { month: 6, monthName: "Junio", ghiKwhM2Day: 1, poaKwhM2Day: 1.78, avgTempCelsius: 7.7, daysInMonth: 30 },
      { month: 7, monthName: "Julio", ghiKwhM2Day: 1.12, poaKwhM2Day: 1.68, avgTempCelsius: 6.5, daysInMonth: 31 },
      { month: 8, monthName: "Agosto", ghiKwhM2Day: 1.66, poaKwhM2Day: 2.27, avgTempCelsius: 7.3, daysInMonth: 31 },
      { month: 9, monthName: "Septiembre", ghiKwhM2Day: 2.91, poaKwhM2Day: 3.44, avgTempCelsius: 8.9, daysInMonth: 30 },
      { month: 10, monthName: "Octubre", ghiKwhM2Day: 3.85, poaKwhM2Day: 4.07, avgTempCelsius: 10.3, daysInMonth: 31 },
      { month: 11, monthName: "Noviembre", ghiKwhM2Day: 5.38, poaKwhM2Day: 5.34, avgTempCelsius: 11, daysInMonth: 30 },
      { month: 12, monthName: "Diciembre", ghiKwhM2Day: 5.64, poaKwhM2Day: 5.39, avgTempCelsius: 12.4, daysInMonth: 31 },
    ],
  },
};

// Catálogo oficial completo de Regiones y Comunas de la Macrozona Sur (Araucanía, Los Ríos y Los Lagos)
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
};

// Mapeo exhaustivo de las 74 comunas del sur a los 8 perfiles TMY calibrados
export const COMMUNE_ALIASES: Record<string, string> = {
  // 1. Cuenca Lago Llanquihue (puerto_varas)
  puerto_varas: "puerto_varas",
  llanquihue: "puerto_varas",
  frutillar: "puerto_varas",
  fresia: "puerto_varas",

  // 2. Seno de Reloncaví & Carretera Austral (puerto_montt)
  puerto_montt: "puerto_montt",
  calbuco: "puerto_montt",
  los_muermos: "puerto_montt",
  maullin: "puerto_montt",
  cochamo: "puerto_montt",
  hualaihue: "puerto_montt",
  horno_piren: "puerto_montt",

  // 3. Provincia de Osorno (osorno)
  osorno: "osorno",
  puerto_octay: "osorno",
  san_pablo: "osorno",
  puyehue: "osorno",
  entre_lagos: "osorno",
  purranque: "osorno",
  rio_negro: "osorno",
  san_juan_de_la_costa: "osorno",

  // 4. Cuenca del Lago Ranco & Llanura Sur (la_union)
  la_union: "la_union",
  rio_bueno: "la_union",
  lago_ranco: "la_union",
  futrono: "la_union",
  paillaco: "la_union",

  // 5. Costa y Valles Fluviales de Los Ríos (valdivia)
  valdivia: "valdivia",
  corral: "valdivia",
  mariquina: "valdivia",
  san_jose_de_la_mariquina: "valdivia",
  mafil: "valdivia",
  los_lagos: "valdivia",
  lanco: "valdivia",
  panguipulli: "valdivia",

  // 6. Archipiélago de Chiloé y Palena (castro)
  castro: "castro",
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

  // 7. Zona Lacustre Andina (villarrica)
  villarrica: "villarrica",
  pucon: "villarrica",
  curarrehue: "villarrica",
  loncoche: "villarrica",
  cunco: "villarrica",
  melipeuco: "villarrica",

  // 8. Valle Central de La Araucanía (temuco)
  temuco: "temuco",
  padre_las_casas: "temuco",
  lautaro: "temuco",
  nueva_imperial: "temuco",
  carahue: "temuco",
  victoria: "temuco",
  angol: "temuco",
  gorbea: "temuco",
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
};

export function getMeteorologicalProfile(communeName?: string): CommuneMeteorologicalProfile {
  if (!communeName) return METEOROLOGY_DATABASE.puerto_varas;

  const normalized = communeName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[\s-']/g, "_");

  if (METEOROLOGY_DATABASE[normalized]) {
    return METEOROLOGY_DATABASE[normalized];
  }

  const aliasTarget = COMMUNE_ALIASES[normalized];
  if (aliasTarget && METEOROLOGY_DATABASE[aliasTarget]) {
    return METEOROLOGY_DATABASE[aliasTarget];
  }

  // Default de referencia para la macrozona sur
  return METEOROLOGY_DATABASE.puerto_varas;
}
