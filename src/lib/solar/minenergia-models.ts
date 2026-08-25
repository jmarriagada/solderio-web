import { MonthlySolarResource } from './solar-types'

export type PvOperationModel = 'BASIC_PVWATTS' | 'ADVANCED_SANDIA' | 'BIFACIAL' | 'FLOATING'

export type TrackingType = 
  | 'FIXED' // Fijo inclinado / Coplanar
  | 'HSAT'  // Horizontal Single Axis Tracking (1 Eje Horizontal E-O)
  | 'HTSAT' // Horizontal Tracking with Tilted Axis
  | 'VSAT'  // Vertical Single Axis Tracking
  | 'TSAT'  // Two-Axis Tracking (2 Ejes)

export type AlbedoType = 
  | 'GRASS'         // Césped = 0.18
  | 'DRY_GRASS'     // Césped seco = 0.33
  | 'NEW_GRASS'     // Césped nuevo = 0.26
  | 'SNOW'          // Nieve = 0.98
  | 'DESERT_SAND'   // Arena desierto = 0.40
  | 'WATER_SAND'    // Arena agua = 0.08
  | 'DRY_ASPHALT'   // Asfalto seco = 0.12
  | 'WET_ASPHALT'   // Asfalto mojado = 0.18
  | 'CONCRETE'      // Hormigón / Concreto = 0.25
  | 'ROOF_ZINC'     // Techo Zinc / Chapa = 0.22

export const ALBEDO_VALUES: Record<AlbedoType, { name: string; value: number }> = {
  GRASS: { name: 'Césped estándar', value: 0.18 },
  DRY_GRASS: { name: 'Césped seco / rastrojo', value: 0.33 },
  NEW_GRASS: { name: 'Césped nuevo', value: 0.26 },
  SNOW: { name: 'Nieve fresca', value: 0.98 },
  DESERT_SAND: { name: 'Arena de desierto', value: 0.40 },
  WATER_SAND: { name: 'Arena húmeda / orilla', value: 0.08 },
  DRY_ASPHALT: { name: 'Asfalto seco', value: 0.12 },
  WET_ASPHALT: { name: 'Asfalto mojado', value: 0.18 },
  CONCRETE: { name: 'Losa u hormigón', value: 0.25 },
  ROOF_ZINC: { name: 'Cubierta metálica / Zinc', value: 0.22 },
}

export type RoofType = 
  | 'ZINC_METAL'
  | 'CLAY_TILE'
  | 'ASPHALT_SHINGLE'
  | 'CONCRETE_SLAB'
  | 'FIBROCEMENT'
  | 'GROUND_MOUNT'

export interface MinEnergiaSimInputs {
  // Capacidad y Módulos
  installedCapacityKwp: number
  operationModel: PvOperationModel
  tempCoefficientPctPerC: number // e.g. -0.29 %/°C for TOPCon, -0.35 %/°C for PERC
  bifacialityFactor: number // e.g. 0.80
  albedoType: AlbedoType
  customAlbedoValue?: number
  
  // Geometría y Arreglo
  trackingType: TrackingType
  tiltDeg: number
  azimuthDeg: number // 0 = North, -90 = East, +90 = West
  isCoplanar: boolean
  roofType: RoofType
  roofAngleDeg: number
  
  // Pérdidas
  inverterEfficiencyPct: number // standard 98%
  systemLossesPct: number // standard 18%
  mismatchLossesPct: number // standard 6%

  // Recurso meteorológico local
  annualGhiKwhM2: number
  annualDniKwhM2: number
  monthlyResources: MonthlySolarResource[]
}

export interface MinEnergiaSimResults {
  annualGenerationKwh: number
  specificYieldKwhKwp: number // kWh/kWp/año
  capacityFactorPct: number
  performanceRatioPct: number
  monthlyGenerationKwh: Array<{
    month: string
    ghiKwhM2: number
    poaKwhM2: number
    rearGainKwhM2: number
    tempAvgC: number
    generationKwh: number
    hspDaily: number
  }>
  bifacialGainPct: number
  floatingCoolingGainPct: number
  totalLossesPct: number
  co2AvoidedTonsPerYear: number
}

/**
 * Calculates physical PV Generation according to the official Chilean Solar Explorer
 * (MinEnergía / NREL PVWatts / Sandia King / Bifacial / Floating models)
 */
export function calculateMinEnergiaPvGeneration(inputs: MinEnergiaSimInputs): MinEnergiaSimResults {
  const albedo = inputs.customAlbedoValue ?? ALBEDO_VALUES[inputs.albedoType].value

  // Total system efficiency factor combining inverter, system losses and mismatch
  const inverterEff = inputs.inverterEfficiencyPct / 100 // e.g. 0.98
  const sysLoss = inputs.systemLossesPct / 100 // e.g. 0.18
  const mismatchLoss = inputs.mismatchLossesPct / 100 // e.g. 0.06
  const derateFactor = inverterEff * (1 - sysLoss) * (1 - mismatchLoss) // ~ 0.755

  // Tracking Gain
  let trackingMultiplier = 1.0
  if (inputs.trackingType === 'HSAT') trackingMultiplier = 1.22
  else if (inputs.trackingType === 'HTSAT') trackingMultiplier = 1.26
  else if (inputs.trackingType === 'VSAT') trackingMultiplier = 1.15
  else if (inputs.trackingType === 'TSAT') trackingMultiplier = 1.35

  // Transposition to plane of array (POA)
  const optimalTilt = 35
  const tiltRad = (inputs.tiltDeg * Math.PI) / 180
  const optTiltRad = (optimalTilt * Math.PI) / 180
  const azRad = (inputs.azimuthDeg * Math.PI) / 180

  const tiltPenalty = Math.cos(tiltRad - optTiltRad)
  const azPenalty = Math.max(0.5, Math.cos(azRad))
  const poaGainFactor = (1.14 - 1) * tiltPenalty * azPenalty + 1

  // Bifacial Gain calculation
  let bifacialGainPct = 0
  if (inputs.operationModel === 'BIFACIAL') {
    // Rear side receives ground-reflected direct + diffuse radiation:
    // Rear irradiance ≈ GHI * Albedo * (1 - cos(tilt))/2 * bifaciality
    const groundViewFactor = (1 - Math.cos(tiltRad)) / 2 + 0.15 // diffuse reflection fraction
    bifacialGainPct = albedo * groundViewFactor * inputs.bifacialityFactor * 100
  }

  // Floating PV Cooling Gain
  let floatingCoolingGainPct = 0
  if (inputs.operationModel === 'FLOATING') {
    // Water body lowers cell temperature by 6°C - 9°C, boosting efficiency:
    // ~ +9% annual yield increase
    floatingCoolingGainPct = 9.5
  }

  // Calculate month by month
  let totalAnnualGenKwh = 0
  const monthlyGeneration = inputs.monthlyResources.map((res) => {
    // Plane of array irradiance
    const poaMonthlyKwhM2 = res.ghiKwhM2 * poaGainFactor * trackingMultiplier

    // Cell temperature model: Tcell = Tamb + (NOCT - 20) * (POA / 800)
    // For coplanar roof, cell is hotter (+15°C NOCT delta) than ground/tilted rack
    const noctDelta = inputs.isCoplanar ? 33 : 25
    const avgCellTempC = res.tempCelsius + (noctDelta * (poaMonthlyKwhM2 / (30 * 5.5 * 1000))) * 800

    // Temperature derate: 1 + gamma * (Tcell - 25°C)
    // tempCoefficient is negative, e.g. -0.29 %/°C = -0.0029
    const tempDerate = 1 + (inputs.tempCoefficientPctPerC / 100) * (avgCellTempC - 25)

    // Rear side energy in bifacial
    const rearGainKwhM2 = (inputs.operationModel === 'BIFACIAL')
      ? poaMonthlyKwhM2 * (bifacialGainPct / 100)
      : 0

    // Effective POA considering rear gain and floating cooling
    const effectivePoa = (poaMonthlyKwhM2 + rearGainKwhM2) * (1 + floatingCoolingGainPct / 100)

    // Generation: (Effective POA / 1000 W/m² STC) * Pdc0 * derateFactor * tempDerate
    const genKwh = Math.round(effectivePoa * inputs.installedCapacityKwp * derateFactor * Math.max(0.85, tempDerate))

    totalAnnualGenKwh += genKwh

    return {
      month: res.month,
      ghiKwhM2: res.ghiKwhM2,
      poaKwhM2: Math.round(poaMonthlyKwhM2),
      rearGainKwhM2: Math.round(rearGainKwhM2),
      tempAvgC: res.tempCelsius,
      generationKwh: genKwh,
      hspDaily: res.hspDaily,
    }
  })

  const specificYieldKwhKwp = Math.round(totalAnnualGenKwh / Math.max(0.1, inputs.installedCapacityKwp))
  const capacityFactorPct = Math.round((totalAnnualGenKwh / (inputs.installedCapacityKwp * 8760)) * 1000) / 10
  const performanceRatioPct = Math.round(derateFactor * 1000) / 10
  const totalLossesPct = Math.round((1 - derateFactor) * 1000) / 10
  const co2AvoidedTonsPerYear = Math.round((totalAnnualGenKwh * 0.395) / 100) / 10

  return {
    annualGenerationKwh: totalAnnualGenKwh,
    specificYieldKwhKwp,
    capacityFactorPct,
    performanceRatioPct,
    monthlyGenerationKwh: monthlyGeneration,
    bifacialGainPct: Math.round(bifacialGainPct * 10) / 10,
    floatingCoolingGainPct,
    totalLossesPct,
    co2AvoidedTonsPerYear,
  }
}
