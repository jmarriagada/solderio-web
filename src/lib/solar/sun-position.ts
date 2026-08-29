import * as SunCalcLib from 'suncalc'
const SunCalc: any = (SunCalcLib as any).default || SunCalcLib

export interface SolarPositionVector {
  azimuthDeg: number // 0 = North, 90 = East, 180 = South, 270 = West
  elevationDeg: number // Altitude above horizon in degrees (-90 to +90)
  zenithDeg: number // 90 - elevation
  isDaylight: boolean
}

export interface SunPathHourPoint {
  hour: number // 6 to 20
  azimuthDeg: number
  elevationDeg: number
}

export interface SunPathSeasonCurve {
  seasonName: string
  dateLabel: string
  points: SunPathHourPoint[]
}

/**
 * Calculates high-precision solar position (azimuth, elevation) for a given date/time and geographic location.
 * Uses PSA / NREL SPA conventions standard in solar engineering.
 */
export function getSolarPosition(
  date: Date,
  latitude: number,
  longitude: number
): SolarPositionVector {
  const sunPos = SunCalc.getPosition(date, latitude, longitude)
  
  // SunCalc returns:
  // altitude in radians (-PI/2 to PI/2)
  // azimuth in radians (South = 0, West = PI/2, North = PI or -PI, East = -PI/2)
  // We convert to standard solar engineering coordinates:
  // North = 0°, East = 90°, South = 180°, West = 270°
  const elevationDeg = (sunPos.altitude * 180) / Math.PI
  const zenithDeg = 90 - elevationDeg
  
  // Convert SunCalc azimuth (South=0) to North=0 (clockwise)
  let azimuthDeg = ((sunPos.azimuth * 180) / Math.PI + 180) % 360
  if (azimuthDeg < 0) azimuthDeg += 360

  return {
    azimuthDeg: Math.round(azimuthDeg * 10) / 10,
    elevationDeg: Math.round(elevationDeg * 10) / 10,
    zenithDeg: Math.round(zenithDeg * 10) / 10,
    isDaylight: elevationDeg > 0,
  }
}

/**
 * Generates the key annual sun path curves (Winter Solstice June 21, Equinox Sept 21, Summer Solstice Dec 21)
 * for the stereographic / Sun Path chart.
 */
export function getAnnualSunPathCurves(latitude: number, longitude: number): SunPathSeasonCurve[] {
  const year = 2026

  const curvesConfig = [
    { name: 'Solsticio de Invierno', date: new Date(year, 5, 21), label: '21 de Junio (Mínima Elevación / Peor Sombra)' },
    { name: 'Equinoccio de Primavera / Otoño', date: new Date(year, 8, 21), label: '21 de Septiembre / 21 de Marzo' },
    { name: 'Solsticio de Verano', date: new Date(year, 11, 21), label: '21 de Diciembre (Máxima Elevación / Pico Solar)' },
  ]

  return curvesConfig.map((cfg) => {
    const points: SunPathHourPoint[] = []
    for (let h = 6; h <= 20; h++) {
      const d = new Date(cfg.date)
      d.setHours(h, 0, 0, 0)
      const pos = getSolarPosition(d, latitude, longitude)
      if (pos.elevationDeg >= 0) {
        points.push({
          hour: h,
          azimuthDeg: pos.azimuthDeg,
          elevationDeg: pos.elevationDeg,
        })
      }
    }

    return {
      seasonName: cfg.name,
      dateLabel: cfg.label,
      points,
    }
  })
}

/**
 * Calculates 3D Solar Access / Total Solar Resource Fraction (TSFR)
 * taking into account shading factor from nearby obstacles (trees, chimneys, parapets).
 */
export function calculateSolarAccess(
  unshadedAnnualYieldKwh: number,
  averageShadingLossPct: number,
  tiltDeg: number,
  azimuthDeg: number
): {
  solarAccessPct: number // e.g. 94.5%
  tsfrPct: number
  effectiveAnnualYieldKwh: number
  annualShadedEnergyLossKwh: number
} {
  // Solar Access is the percentage of available solar energy not blocked by obstructions
  const solarAccessPct = Math.max(0, Math.min(100, 100 - averageShadingLossPct))
  
  // Tilt & Orientation Factor (TOF)
  const optTilt = 35
  const tiltPenalty = Math.cos(((tiltDeg - optTilt) * Math.PI) / 180)
  const azPenalty = Math.cos((azimuthDeg * Math.PI) / 180)
  const tofPct = Math.max(60, Math.min(100, Math.round(100 * (1 - (1 - tiltPenalty * Math.max(0.5, azPenalty)) * 0.5))))

  // TSFR = Solar Access * TOF
  const tsfrPct = Math.round((solarAccessPct * (tofPct / 100)) * 10) / 10

  const effectiveAnnualYieldKwh = Math.round(unshadedAnnualYieldKwh * (solarAccessPct / 100))
  const annualShadedEnergyLossKwh = Math.round(unshadedAnnualYieldKwh - effectiveAnnualYieldKwh)

  return {
    solarAccessPct: Math.round(solarAccessPct * 10) / 10,
    tsfrPct,
    effectiveAnnualYieldKwh,
    annualShadedEnergyLossKwh,
  }
}
