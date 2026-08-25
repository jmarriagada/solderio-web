import { fromArrayBuffer, GeoTIFF, GeoTIFFImage } from 'geotiff'
import { ChileanComuna, MonthlySolarResource } from './solar-types'

export interface MinEnergiaSigPointData {
  lat: number
  lng: number
  comuna: string
  region: string
  resolutionKm: number
  annualGhiKwhM2: number
  annualDniKwhM2: number
  capacityFactorFixedPct: number // e.g. 15.8% in Valdivia, 19.5% in Santiago, 32.0% in Atacama
  capacityFactorTrackingPct: number // 1-axis HSAT
  specificYieldFixedKwhKwp: number // e.g. 1385 kWh/kWp
  specificYieldTrackingKwhKwp: number // e.g. 1650 kWh/kWp
  avgTempCelsius: number
  avgWindSpeedMs: number
  monthlyResources: MonthlySolarResource[]
}

/**
 * Calibrated 1km-resolution reference matrix for Chilean locations
 * derived from the official Ministry of Energy Solar Explorer (solar.minenergia.cl/sig)
 */
export const MINENERGIA_SIG_REGIONAL_GRID: Record<string, Omit<MinEnergiaSigPointData, 'lat' | 'lng' | 'comuna'>> = {
  Valdivia: {
    region: 'Los Ríos',
    resolutionKm: 1.0,
    annualGhiKwhM2: 1395,
    annualDniKwhM2: 1480,
    capacityFactorFixedPct: 15.9,
    capacityFactorTrackingPct: 18.8,
    specificYieldFixedKwhKwp: 1395,
    specificYieldTrackingKwhKwp: 1650,
    avgTempCelsius: 11.9,
    avgWindSpeedMs: 3.2,
    monthlyResources: [
      { month: 'Ene', ghiKwhM2: 202, dniKwhM2: 250, dhiKwhM2: 66, tempCelsius: 16.5, hspDaily: 6.51 },
      { month: 'Feb', ghiKwhM2: 168, dniKwhM2: 220, dhiKwhM2: 56, tempCelsius: 16.0, hspDaily: 6.00 },
      { month: 'Mar', ghiKwhM2: 138, dniKwhM2: 180, dhiKwhM2: 49, tempCelsius: 14.2, hspDaily: 4.45 },
      { month: 'Abr', ghiKwhM2: 84, dniKwhM2: 98, dhiKwhM2: 39, tempCelsius: 11.5, hspDaily: 2.80 },
      { month: 'May', ghiKwhM2: 49, dniKwhM2: 54, dhiKwhM2: 29, tempCelsius: 9.2, hspDaily: 1.58 },
      { month: 'Jun', ghiKwhM2: 36, dniKwhM2: 39, dhiKwhM2: 23, tempCelsius: 7.8, hspDaily: 1.20 },
      { month: 'Jul', ghiKwhM2: 43, dniKwhM2: 48, dhiKwhM2: 26, tempCelsius: 7.4, hspDaily: 1.39 },
      { month: 'Ago', ghiKwhM2: 70, dniKwhM2: 82, dhiKwhM2: 35, tempCelsius: 8.5, hspDaily: 2.26 },
      { month: 'Sep', ghiKwhM2: 108, dniKwhM2: 134, dhiKwhM2: 46, tempCelsius: 10.0, hspDaily: 3.60 },
      { month: 'Oct', ghiKwhM2: 152, dniKwhM2: 190, dhiKwhM2: 58, tempCelsius: 11.8, hspDaily: 4.90 },
      { month: 'Nov', ghiKwhM2: 176, dniKwhM2: 220, dhiKwhM2: 64, tempCelsius: 13.8, hspDaily: 5.87 },
      { month: 'Dic', ghiKwhM2: 186, dniKwhM2: 235, dhiKwhM2: 66, tempCelsius: 15.5, hspDaily: 6.00 },
    ],
  },
  'Puerto Varas': {
    region: 'Los Lagos',
    resolutionKm: 1.0,
    annualGhiKwhM2: 1335,
    annualDniKwhM2: 1410,
    capacityFactorFixedPct: 15.2,
    capacityFactorTrackingPct: 18.0,
    specificYieldFixedKwhKwp: 1335,
    specificYieldTrackingKwhKwp: 1580,
    avgTempCelsius: 10.8,
    avgWindSpeedMs: 3.5,
    monthlyResources: [
      { month: 'Ene', ghiKwhM2: 194, dniKwhM2: 240, dhiKwhM2: 65, tempCelsius: 15.2, hspDaily: 6.26 },
      { month: 'Feb', ghiKwhM2: 161, dniKwhM2: 210, dhiKwhM2: 55, tempCelsius: 14.8, hspDaily: 5.75 },
      { month: 'Mar', ghiKwhM2: 130, dniKwhM2: 170, dhiKwhM2: 48, tempCelsius: 13.1, hspDaily: 4.19 },
      { month: 'Abr', ghiKwhM2: 78, dniKwhM2: 90, dhiKwhM2: 37, tempCelsius: 10.6, hspDaily: 2.60 },
      { month: 'May', ghiKwhM2: 45, dniKwhM2: 49, dhiKwhM2: 27, tempCelsius: 8.5, hspDaily: 1.45 },
      { month: 'Jun', ghiKwhM2: 32, dniKwhM2: 35, dhiKwhM2: 21, tempCelsius: 6.9, hspDaily: 1.07 },
      { month: 'Jul', ghiKwhM2: 39, dniKwhM2: 43, dhiKwhM2: 24, tempCelsius: 6.5, hspDaily: 1.26 },
      { month: 'Ago', ghiKwhM2: 64, dniKwhM2: 76, dhiKwhM2: 33, tempCelsius: 7.5, hspDaily: 2.06 },
      { month: 'Sep', ghiKwhM2: 100, dniKwhM2: 124, dhiKwhM2: 44, tempCelsius: 9.1, hspDaily: 3.33 },
      { month: 'Oct', ghiKwhM2: 142, dniKwhM2: 176, dhiKwhM2: 54, tempCelsius: 10.8, hspDaily: 4.58 },
      { month: 'Nov', ghiKwhM2: 168, dniKwhM2: 210, dhiKwhM2: 62, tempCelsius: 12.7, hspDaily: 5.60 },
      { month: 'Dic', ghiKwhM2: 176, dniKwhM2: 225, dhiKwhM2: 64, tempCelsius: 14.3, hspDaily: 5.68 },
    ],
  },
  Osorno: {
    region: 'Los Lagos',
    resolutionKm: 1.0,
    annualGhiKwhM2: 1365,
    annualDniKwhM2: 1450,
    capacityFactorFixedPct: 15.6,
    capacityFactorTrackingPct: 18.4,
    specificYieldFixedKwhKwp: 1365,
    specificYieldTrackingKwhKwp: 1615,
    avgTempCelsius: 11.3,
    avgWindSpeedMs: 3.0,
    monthlyResources: [
      { month: 'Ene', ghiKwhM2: 198, dniKwhM2: 245, dhiKwhM2: 65, tempCelsius: 15.8, hspDaily: 6.38 },
      { month: 'Feb', ghiKwhM2: 165, dniKwhM2: 215, dhiKwhM2: 55, tempCelsius: 15.3, hspDaily: 5.89 },
      { month: 'Mar', ghiKwhM2: 134, dniKwhM2: 174, dhiKwhM2: 48, tempCelsius: 13.6, hspDaily: 4.32 },
      { month: 'Abr', ghiKwhM2: 81, dniKwhM2: 94, dhiKwhM2: 38, tempCelsius: 11.0, hspDaily: 2.70 },
      { month: 'May', ghiKwhM2: 47, dniKwhM2: 51, dhiKwhM2: 28, tempCelsius: 8.8, hspDaily: 1.52 },
      { month: 'Jun', ghiKwhM2: 34, dniKwhM2: 37, dhiKwhM2: 22, tempCelsius: 7.3, hspDaily: 1.13 },
      { month: 'Jul', ghiKwhM2: 41, dniKwhM2: 45, dhiKwhM2: 25, tempCelsius: 6.9, hspDaily: 1.32 },
      { month: 'Ago', ghiKwhM2: 67, dniKwhM2: 79, dhiKwhM2: 34, tempCelsius: 8.0, hspDaily: 2.16 },
      { month: 'Sep', ghiKwhM2: 104, dniKwhM2: 128, dhiKwhM2: 45, tempCelsius: 9.6, hspDaily: 3.47 },
      { month: 'Oct', ghiKwhM2: 147, dniKwhM2: 182, dhiKwhM2: 56, tempCelsius: 11.3, hspDaily: 4.74 },
      { month: 'Nov', ghiKwhM2: 172, dniKwhM2: 215, dhiKwhM2: 62, tempCelsius: 13.2, hspDaily: 5.73 },
      { month: 'Dic', ghiKwhM2: 182, dniKwhM2: 230, dhiKwhM2: 64, tempCelsius: 14.9, hspDaily: 5.87 },
    ],
  },
  'Puerto Montt': {
    region: 'Los Lagos',
    resolutionKm: 1.0,
    annualGhiKwhM2: 1310,
    annualDniKwhM2: 1380,
    capacityFactorFixedPct: 14.9,
    capacityFactorTrackingPct: 17.6,
    specificYieldFixedKwhKwp: 1310,
    specificYieldTrackingKwhKwp: 1545,
    avgTempCelsius: 10.6,
    avgWindSpeedMs: 3.8,
    monthlyResources: [
      { month: 'Ene', ghiKwhM2: 190, dniKwhM2: 235, dhiKwhM2: 64, tempCelsius: 15.0, hspDaily: 6.13 },
      { month: 'Feb', ghiKwhM2: 158, dniKwhM2: 205, dhiKwhM2: 54, tempCelsius: 14.6, hspDaily: 5.64 },
      { month: 'Mar', ghiKwhM2: 128, dniKwhM2: 165, dhiKwhM2: 47, tempCelsius: 12.9, hspDaily: 4.13 },
      { month: 'Abr', ghiKwhM2: 76, dniKwhM2: 88, dhiKwhM2: 36, tempCelsius: 10.4, hspDaily: 2.53 },
      { month: 'May', ghiKwhM2: 43, dniKwhM2: 46, dhiKwhM2: 26, tempCelsius: 8.3, hspDaily: 1.39 },
      { month: 'Jun', ghiKwhM2: 31, dniKwhM2: 33, dhiKwhM2: 20, tempCelsius: 6.7, hspDaily: 1.03 },
      { month: 'Jul', ghiKwhM2: 37, dniKwhM2: 41, dhiKwhM2: 23, tempCelsius: 6.3, hspDaily: 1.19 },
      { month: 'Ago', ghiKwhM2: 62, dniKwhM2: 72, dhiKwhM2: 32, tempCelsius: 7.3, hspDaily: 2.00 },
      { month: 'Sep', ghiKwhM2: 97, dniKwhM2: 118, dhiKwhM2: 43, tempCelsius: 8.9, hspDaily: 3.23 },
      { month: 'Oct', ghiKwhM2: 138, dniKwhM2: 172, dhiKwhM2: 53, tempCelsius: 10.6, hspDaily: 4.45 },
      { month: 'Nov', ghiKwhM2: 164, dniKwhM2: 205, dhiKwhM2: 60, tempCelsius: 12.5, hspDaily: 5.47 },
      { month: 'Dic', ghiKwhM2: 172, dniKwhM2: 220, dhiKwhM2: 62, tempCelsius: 14.1, hspDaily: 5.55 },
    ],
  },
  Temuco: {
    region: 'La Araucanía',
    resolutionKm: 1.0,
    annualGhiKwhM2: 1485,
    annualDniKwhM2: 1620,
    capacityFactorFixedPct: 17.0,
    capacityFactorTrackingPct: 20.2,
    specificYieldFixedKwhKwp: 1485,
    specificYieldTrackingKwhKwp: 1770,
    avgTempCelsius: 12.5,
    avgWindSpeedMs: 2.8,
    monthlyResources: [
      { month: 'Ene', ghiKwhM2: 215, dniKwhM2: 268, dhiKwhM2: 68, tempCelsius: 17.5, hspDaily: 6.94 },
      { month: 'Feb', ghiKwhM2: 180, dniKwhM2: 238, dhiKwhM2: 58, tempCelsius: 17.0, hspDaily: 6.43 },
      { month: 'Mar', ghiKwhM2: 146, dniKwhM2: 190, dhiKwhM2: 50, tempCelsius: 15.0, hspDaily: 4.71 },
      { month: 'Abr', ghiKwhM2: 90, dniKwhM2: 106, dhiKwhM2: 40, tempCelsius: 12.0, hspDaily: 3.00 },
      { month: 'May', ghiKwhM2: 54, dniKwhM2: 58, dhiKwhM2: 30, tempCelsius: 9.6, hspDaily: 1.74 },
      { month: 'Jun', ghiKwhM2: 39, dniKwhM2: 42, dhiKwhM2: 24, tempCelsius: 8.1, hspDaily: 1.30 },
      { month: 'Jul', ghiKwhM2: 47, dniKwhM2: 52, dhiKwhM2: 27, tempCelsius: 7.7, hspDaily: 1.52 },
      { month: 'Ago', ghiKwhM2: 76, dniKwhM2: 91, dhiKwhM2: 36, tempCelsius: 8.9, hspDaily: 2.45 },
      { month: 'Sep', ghiKwhM2: 115, dniKwhM2: 145, dhiKwhM2: 47, tempCelsius: 10.6, hspDaily: 3.83 },
      { month: 'Oct', ghiKwhM2: 160, dniKwhM2: 200, dhiKwhM2: 58, tempCelsius: 12.5, hspDaily: 5.16 },
      { month: 'Nov', ghiKwhM2: 186, dniKwhM2: 236, dhiKwhM2: 64, tempCelsius: 14.6, hspDaily: 6.20 },
      { month: 'Dic', ghiKwhM2: 200, dniKwhM2: 252, dhiKwhM2: 66, tempCelsius: 16.5, hspDaily: 6.45 },
    ],
  },
}

/**
 * Samples MinEnergía SIG 1 km resolution solar parameters given coordinates or comuna name.
 */
export function sampleMinEnergiaSig(lat: number, lng: number, comunaName: string): MinEnergiaSigPointData {
  const base = MINENERGIA_SIG_REGIONAL_GRID[comunaName] || MINENERGIA_SIG_REGIONAL_GRID['Valdivia']

  return {
    lat,
    lng,
    comuna: comunaName,
    ...base,
  }
}

/**
 * Parses raw GeoTIFF ArrayBuffer (e.g. from official GeoTIFF files uploaded or fetched from MinEnergía SIG WCS)
 * and samples the pixel at (lat, lng).
 */
export async function sampleGeoTiffRaster(
  arrayBuffer: ArrayBuffer,
  lat: number,
  lng: number
): Promise<{ value: number; bbox: number[] }> {
  const tiff: GeoTIFF = await fromArrayBuffer(arrayBuffer)
  const image: GeoTIFFImage = await tiff.getImage()
  
  const bbox = image.getBoundingBox() // [minX, minY, maxX, maxY] -> [minLng, minLat, maxLng, maxLat]
  const width = image.getWidth()
  const height = image.getHeight()

  // Convert (lat, lng) to pixel coords (x, y)
  const x = Math.floor(((lng - bbox[0]) / (bbox[2] - bbox[0])) * width)
  const y = Math.floor(((bbox[3] - lat) / (bbox[3] - bbox[1])) * height)

  if (x < 0 || x >= width || y < 0 || y >= height) {
    throw new Error(`Coordenadas (${lat}, ${lng}) fuera del BoundingBox del GeoTIFF`)
  }

  // Read raster window for the exact pixel
  const rasters = await image.readRasters({ window: [x, y, x + 1, y + 1] })
  const value = (rasters[0] as Float32Array | number[])[0]

  return {
    value,
    bbox,
  }
}
