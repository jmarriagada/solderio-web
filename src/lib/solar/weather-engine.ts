import { ChileanComuna, MonthlySolarResource } from './solar-types'

export interface CitySolarDataset {
  comuna: ChileanComuna
  region: string
  lat: number
  lng: number
  elevationM: number
  optimalTiltDeg: number
  annualGhiKwhM2: number
  monthlyResources: MonthlySolarResource[]
  sourcesAvailable: Array<{
    source: 'SOLCAST_API' | 'NASA_POWER' | 'MINENERGIA_EXPLORER' | 'METEONORM'
    name: string
    annualGhi: number
    uncertaintyPct: number
  }>
}

export const CHILE_SOLAR_DATABASE: Record<string, CitySolarDataset> = {
  Valdivia: {
    comuna: 'Valdivia',
    region: 'Los Ríos',
    lat: -39.8142,
    lng: -73.2459,
    elevationM: 14,
    optimalTiltDeg: 35,
    annualGhiKwhM2: 1380,
    sourcesAvailable: [
      { source: 'SOLCAST_API', name: 'Solcast Satellite High-Res (1-2km)', annualGhi: 1380, uncertaintyPct: 2.5 },
      { source: 'NASA_POWER', name: 'NASA POWER Climatology v2.0', annualGhi: 1345, uncertaintyPct: 4.0 },
      { source: 'MINENERGIA_EXPLORER', name: 'Explorador Solar MinEnergía', annualGhi: 1395, uncertaintyPct: 3.0 },
      { source: 'METEONORM', name: 'Meteonorm 8.1 TMY', annualGhi: 1360, uncertaintyPct: 3.5 },
    ],
    monthlyResources: [
      { month: 'Ene', ghiKwhM2: 198, dniKwhM2: 245, dhiKwhM2: 65, tempCelsius: 16.5, hspDaily: 6.38 },
      { month: 'Feb', ghiKwhM2: 165, dniKwhM2: 215, dhiKwhM2: 55, tempCelsius: 16.0, hspDaily: 5.89 },
      { month: 'Mar', ghiKwhM2: 135, dniKwhM2: 175, dhiKwhM2: 48, tempCelsius: 14.2, hspDaily: 4.35 },
      { month: 'Abr', ghiKwhM2: 82, dniKwhM2: 95, dhiKwhM2: 38, tempCelsius: 11.5, hspDaily: 2.73 },
      { month: 'May', ghiKwhM2: 48, dniKwhM2: 52, dhiKwhM2: 28, tempCelsius: 9.2, hspDaily: 1.55 },
      { month: 'Jun', ghiKwhM2: 35, dniKwhM2: 38, dhiKwhM2: 22, tempCelsius: 7.8, hspDaily: 1.17 },
      { month: 'Jul', ghiKwhM2: 42, dniKwhM2: 46, dhiKwhM2: 25, tempCelsius: 7.4, hspDaily: 1.35 },
      { month: 'Ago', ghiKwhM2: 68, dniKwhM2: 80, dhiKwhM2: 34, tempCelsius: 8.5, hspDaily: 2.19 },
      { month: 'Sep', ghiKwhM2: 105, dniKwhM2: 130, dhiKwhM2: 45, tempCelsius: 10.0, hspDaily: 3.50 },
      { month: 'Oct', ghiKwhM2: 148, dniKwhM2: 185, dhiKwhM2: 56, tempCelsius: 11.8, hspDaily: 4.77 },
      { month: 'Nov', ghiKwhM2: 172, dniKwhM2: 215, dhiKwhM2: 62, tempCelsius: 13.8, hspDaily: 5.73 },
      { month: 'Dic', ghiKwhM2: 182, dniKwhM2: 230, dhiKwhM2: 64, tempCelsius: 15.5, hspDaily: 5.87 },
    ],
  },
  'Puerto Varas': {
    comuna: 'Puerto Varas',
    region: 'Los Lagos',
    lat: -41.3195,
    lng: -72.9854,
    elevationM: 65,
    optimalTiltDeg: 36,
    annualGhiKwhM2: 1320,
    sourcesAvailable: [
      { source: 'SOLCAST_API', name: 'Solcast Satellite High-Res (1-2km)', annualGhi: 1320, uncertaintyPct: 2.5 },
      { source: 'NASA_POWER', name: 'NASA POWER Climatology v2.0', annualGhi: 1290, uncertaintyPct: 4.0 },
      { source: 'MINENERGIA_EXPLORER', name: 'Explorador Solar MinEnergía', annualGhi: 1335, uncertaintyPct: 3.0 },
      { source: 'METEONORM', name: 'Meteonorm 8.1 TMY', annualGhi: 1305, uncertaintyPct: 3.5 },
    ],
    monthlyResources: [
      { month: 'Ene', ghiKwhM2: 190, dniKwhM2: 235, dhiKwhM2: 64, tempCelsius: 15.2, hspDaily: 6.13 },
      { month: 'Feb', ghiKwhM2: 158, dniKwhM2: 205, dhiKwhM2: 54, tempCelsius: 14.8, hspDaily: 5.64 },
      { month: 'Mar', ghiKwhM2: 128, dniKwhM2: 165, dhiKwhM2: 47, tempCelsius: 13.1, hspDaily: 4.13 },
      { month: 'Abr', ghiKwhM2: 76, dniKwhM2: 88, dhiKwhM2: 36, tempCelsius: 10.6, hspDaily: 2.53 },
      { month: 'May', ghiKwhM2: 44, dniKwhM2: 48, dhiKwhM2: 26, tempCelsius: 8.5, hspDaily: 1.42 },
      { month: 'Jun', ghiKwhM2: 31, dniKwhM2: 34, dhiKwhM2: 20, tempCelsius: 6.9, hspDaily: 1.03 },
      { month: 'Jul', ghiKwhM2: 38, dniKwhM2: 42, dhiKwhM2: 23, tempCelsius: 6.5, hspDaily: 1.23 },
      { month: 'Ago', ghiKwhM2: 62, dniKwhM2: 74, dhiKwhM2: 32, tempCelsius: 7.5, hspDaily: 2.00 },
      { month: 'Sep', ghiKwhM2: 98, dniKwhM2: 120, dhiKwhM2: 43, tempCelsius: 9.1, hspDaily: 3.27 },
      { month: 'Oct', ghiKwhM2: 139, dniKwhM2: 172, dhiKwhM2: 53, tempCelsius: 10.8, hspDaily: 4.48 },
      { month: 'Nov', ghiKwhM2: 164, dniKwhM2: 205, dhiKwhM2: 60, tempCelsius: 12.7, hspDaily: 5.47 },
      { month: 'Dic', ghiKwhM2: 172, dniKwhM2: 220, dhiKwhM2: 62, tempCelsius: 14.3, hspDaily: 5.55 },
    ],
  },
  Osorno: {
    comuna: 'Osorno',
    region: 'Los Lagos',
    lat: -40.5739,
    lng: -73.1335,
    elevationM: 35,
    optimalTiltDeg: 35,
    annualGhiKwhM2: 1350,
    sourcesAvailable: [
      { source: 'SOLCAST_API', name: 'Solcast Satellite High-Res', annualGhi: 1350, uncertaintyPct: 2.5 },
      { source: 'MINENERGIA_EXPLORER', name: 'Explorador Solar MinEnergía', annualGhi: 1365, uncertaintyPct: 3.0 },
    ],
    monthlyResources: [
      { month: 'Ene', ghiKwhM2: 194, dniKwhM2: 240, dhiKwhM2: 64, tempCelsius: 15.8, hspDaily: 6.26 },
      { month: 'Feb', ghiKwhM2: 162, dniKwhM2: 210, dhiKwhM2: 54, tempCelsius: 15.3, hspDaily: 5.79 },
      { month: 'Mar', ghiKwhM2: 132, dniKwhM2: 170, dhiKwhM2: 47, tempCelsius: 13.6, hspDaily: 4.26 },
      { month: 'Abr', ghiKwhM2: 79, dniKwhM2: 92, dhiKwhM2: 37, tempCelsius: 11.0, hspDaily: 2.63 },
      { month: 'May', ghiKwhM2: 46, dniKwhM2: 50, dhiKwhM2: 27, tempCelsius: 8.8, hspDaily: 1.48 },
      { month: 'Jun', ghiKwhM2: 33, dniKwhM2: 36, dhiKwhM2: 21, tempCelsius: 7.3, hspDaily: 1.10 },
      { month: 'Jul', ghiKwhM2: 40, dniKwhM2: 44, dhiKwhM2: 24, tempCelsius: 6.9, hspDaily: 1.29 },
      { month: 'Ago', ghiKwhM2: 65, dniKwhM2: 77, dhiKwhM2: 33, tempCelsius: 8.0, hspDaily: 2.10 },
      { month: 'Sep', ghiKwhM2: 102, dniKwhM2: 125, dhiKwhM2: 44, tempCelsius: 9.6, hspDaily: 3.40 },
      { month: 'Oct', ghiKwhM2: 144, dniKwhM2: 178, dhiKwhM2: 55, tempCelsius: 11.3, hspDaily: 4.65 },
      { month: 'Nov', ghiKwhM2: 168, dniKwhM2: 210, dhiKwhM2: 61, tempCelsius: 13.2, hspDaily: 5.60 },
      { month: 'Dic', ghiKwhM2: 178, dniKwhM2: 225, dhiKwhM2: 63, tempCelsius: 14.9, hspDaily: 5.74 },
    ],
  },
  'Puerto Montt': {
    comuna: 'Puerto Montt',
    region: 'Los Lagos',
    lat: -41.4693,
    lng: -72.9424,
    elevationM: 14,
    optimalTiltDeg: 36,
    annualGhiKwhM2: 1290,
    sourcesAvailable: [
      { source: 'SOLCAST_API', name: 'Solcast Satellite High-Res', annualGhi: 1290, uncertaintyPct: 2.5 },
      { source: 'MINENERGIA_EXPLORER', name: 'Explorador Solar MinEnergía', annualGhi: 1310, uncertaintyPct: 3.0 },
    ],
    monthlyResources: [
      { month: 'Ene', ghiKwhM2: 186, dniKwhM2: 230, dhiKwhM2: 63, tempCelsius: 15.0, hspDaily: 6.00 },
      { month: 'Feb', ghiKwhM2: 154, dniKwhM2: 200, dhiKwhM2: 53, tempCelsius: 14.6, hspDaily: 5.50 },
      { month: 'Mar', ghiKwhM2: 125, dniKwhM2: 160, dhiKwhM2: 46, tempCelsius: 12.9, hspDaily: 4.03 },
      { month: 'Abr', ghiKwhM2: 74, dniKwhM2: 85, dhiKwhM2: 35, tempCelsius: 10.4, hspDaily: 2.47 },
      { month: 'May', ghiKwhM2: 42, dniKwhM2: 45, dhiKwhM2: 25, tempCelsius: 8.3, hspDaily: 1.35 },
      { month: 'Jun', ghiKwhM2: 30, dniKwhM2: 32, dhiKwhM2: 19, tempCelsius: 6.7, hspDaily: 1.00 },
      { month: 'Jul', ghiKwhM2: 36, dniKwhM2: 40, dhiKwhM2: 22, tempCelsius: 6.3, hspDaily: 1.16 },
      { month: 'Ago', ghiKwhM2: 60, dniKwhM2: 70, dhiKwhM2: 31, tempCelsius: 7.3, hspDaily: 1.94 },
      { month: 'Sep', ghiKwhM2: 95, dniKwhM2: 115, dhiKwhM2: 42, tempCelsius: 8.9, hspDaily: 3.17 },
      { month: 'Oct', ghiKwhM2: 135, dniKwhM2: 168, dhiKwhM2: 52, tempCelsius: 10.6, hspDaily: 4.35 },
      { month: 'Nov', ghiKwhM2: 160, dniKwhM2: 200, dhiKwhM2: 59, tempCelsius: 12.5, hspDaily: 5.33 },
      { month: 'Dic', ghiKwhM2: 168, dniKwhM2: 215, dhiKwhM2: 61, tempCelsius: 14.1, hspDaily: 5.42 },
    ],
  },
  Temuco: {
    comuna: 'Temuco',
    region: 'La Araucanía',
    lat: -38.7359,
    lng: -72.5904,
    elevationM: 115,
    optimalTiltDeg: 34,
    annualGhiKwhM2: 1460,
    sourcesAvailable: [
      { source: 'SOLCAST_API', name: 'Solcast Satellite High-Res', annualGhi: 1460, uncertaintyPct: 2.5 },
      { source: 'MINENERGIA_EXPLORER', name: 'Explorador Solar MinEnergía', annualGhi: 1485, uncertaintyPct: 3.0 },
    ],
    monthlyResources: [
      { month: 'Ene', ghiKwhM2: 210, dniKwhM2: 260, dhiKwhM2: 66, tempCelsius: 17.5, hspDaily: 6.77 },
      { month: 'Feb', ghiKwhM2: 175, dniKwhM2: 230, dhiKwhM2: 56, tempCelsius: 17.0, hspDaily: 6.25 },
      { month: 'Mar', ghiKwhM2: 142, dniKwhM2: 185, dhiKwhM2: 49, tempCelsius: 15.0, hspDaily: 4.58 },
      { month: 'Abr', ghiKwhM2: 88, dniKwhM2: 102, dhiKwhM2: 39, tempCelsius: 12.0, hspDaily: 2.93 },
      { month: 'May', ghiKwhM2: 52, dniKwhM2: 56, dhiKwhM2: 29, tempCelsius: 9.6, hspDaily: 1.68 },
      { month: 'Jun', ghiKwhM2: 38, dniKwhM2: 40, dhiKwhM2: 23, tempCelsius: 8.1, hspDaily: 1.27 },
      { month: 'Jul', ghiKwhM2: 46, dniKwhM2: 50, dhiKwhM2: 26, tempCelsius: 7.7, hspDaily: 1.48 },
      { month: 'Ago', ghiKwhM2: 74, dniKwhM2: 88, dhiKwhM2: 35, tempCelsius: 8.9, hspDaily: 2.39 },
      { month: 'Sep', ghiKwhM2: 112, dniKwhM2: 140, dhiKwhM2: 46, tempCelsius: 10.6, hspDaily: 3.73 },
      { month: 'Oct', ghiKwhM2: 156, dniKwhM2: 195, dhiKwhM2: 57, tempCelsius: 12.5, hspDaily: 5.03 },
      { month: 'Nov', ghiKwhM2: 182, dniKwhM2: 230, dhiKwhM2: 63, tempCelsius: 14.6, hspDaily: 6.07 },
      { month: 'Dic', ghiKwhM2: 195, dniKwhM2: 245, dhiKwhM2: 65, tempCelsius: 16.5, hspDaily: 6.29 },
    ],
  },
}

export function getSolarDataset(comunaName?: string): CitySolarDataset {
  if (!comunaName || !CHILE_SOLAR_DATABASE[comunaName]) {
    return CHILE_SOLAR_DATABASE['Valdivia']
  }
  return CHILE_SOLAR_DATABASE[comunaName]
}

/**
 * Calculates Plane-of-Array (POA) transposition factor given tilt beta and azimuth gamma.
 * For Southern Hemisphere (Chile):
 * Optimal Azimuth = 0 deg (True North).
 * South = 180 deg, East = -90 deg, West = +90 deg.
 */
export function calculateTranspositionFactor(
  optimalTilt: number,
  actualTilt: number,
  azimuthDeg: number = 0
): number {
  // Transposition gain vs horizontal:
  // At optimal tilt and North azimuth, Southern Chile yields ~12-15% more annual irradiation on the plane.
  const tiltRad = (actualTilt * Math.PI) / 180
  const optTiltRad = (optimalTilt * Math.PI) / 180
  const azRad = (azimuthDeg * Math.PI) / 180

  const tiltPenalty = Math.cos(tiltRad - optTiltRad)
  const azPenalty = Math.max(0.5, Math.cos(azRad))

  const baseGain = 1.14 // 14% boost at optimal tilt facing North
  const factor = (baseGain - 1) * tiltPenalty * azPenalty + 1

  return Math.max(0.7, Math.min(1.2, factor))
}
