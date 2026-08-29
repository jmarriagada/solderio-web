export interface ModuleElectricalSpec {
  brand: string
  model: string
  powerW: number // e.g. 550W
  vmp: number // e.g. 42.1V
  imp: number // e.g. 13.06A
  voc: number // e.g. 49.8V
  isc: number // e.g. 13.90A
  tempCoeffVocPctPerC: number // e.g. -0.26 %/°C
  tempCoeffVmpPctPerC: number // e.g. -0.30 %/°C
}

export interface InverterElectricalSpec {
  brand: string
  model: string
  nominalPowerKw: number // e.g. 5.0 kW
  numMppts: number // e.g. 2
  maxDcVoltageV: number // e.g. 1000V (or 550V/600V)
  mpptMinVoltageV: number // e.g. 120V
  mpptMaxVoltageV: number // e.g. 500V (or 850V)
  maxInputCurrentPerMpptA: number // e.g. 15A or 26A
}

export interface StringConfiguration {
  id: string
  name: string
  mpptIndex: number
  colorHex: string
  moduleCount: number
  moduleIndices: number[]
}

export interface StringingValidationResult {
  isValid: boolean
  totalModules: number
  totalDcPowerKwp: number
  dcAcRatio: number
  strings: Array<{
    stringId: string
    stringName: string
    moduleCount: number
    vocStcV: number
    vocColdV: number // at Tmin = -5°C
    vmpHotV: number // at Tmax = 65°C
    vmpColdV: number // at Tmin = -5°C
    iscA: number
    isVocSafe: boolean
    isMpptRangeValid: boolean
    isCurrentSafe: boolean
    messages: string[]
  }>
  overallMessages: string[]
}

export const DEFAULT_MODULE_SPEC: ModuleElectricalSpec = {
  brand: 'Jinko Solar',
  model: 'Tiger Neo N-Type 550W Bifacial',
  powerW: 550,
  vmp: 42.1,
  imp: 13.06,
  voc: 49.8,
  isc: 13.9,
  tempCoeffVocPctPerC: -0.26,
  tempCoeffVmpPctPerC: -0.30,
}

export const DEFAULT_INVERTER_SPEC: InverterElectricalSpec = {
  brand: 'Huawei / Deye',
  model: 'SUN2000-5KTL / Deye 5kW',
  nominalPowerKw: 5.0,
  numMppts: 2,
  maxDcVoltageV: 1000,
  mpptMinVoltageV: 140,
  mpptMaxVoltageV: 560,
  maxInputCurrentPerMpptA: 15.0,
}

/**
 * Validates electrical stringing configurations according to Chilean SEC RIC N°09
 * and manufacturer equipment limits.
 */
export function validateStringing(
  strings: StringConfiguration[],
  moduleSpec: ModuleElectricalSpec = DEFAULT_MODULE_SPEC,
  inverterSpec: InverterElectricalSpec = DEFAULT_INVERTER_SPEC,
  minAmbientTempC: number = -5, // Southern Chile extreme minimum
  maxCellTempC: number = 65 // Typical summer cell operating peak
): StringingValidationResult {
  const totalModules = strings.reduce((acc, s) => acc + s.moduleCount, 0)
  const totalDcPowerKwp = Math.round(((totalModules * moduleSpec.powerW) / 1000) * 100) / 100
  const dcAcRatio = Math.round((totalDcPowerKwp / Math.max(0.1, inverterSpec.nominalPowerKw)) * 100) / 100

  let isOverallValid = true
  const overallMessages: string[] = []

  if (totalModules === 0) {
    return {
      isValid: false,
      totalModules: 0,
      totalDcPowerKwp: 0,
      dcAcRatio: 0,
      strings: [],
      overallMessages: ['No se han asignado paneles a ningún string.'],
    }
  }

  // Check DC/AC ratio
  if (dcAcRatio < 0.8) {
    overallMessages.push(`Cuociente DC/AC bajo (${dcAcRatio}). Se recomienda al menos 1.0 para aprovechar el inversor.`)
  } else if (dcAcRatio > 1.35) {
    overallMessages.push(`Cuociente DC/AC alto (${dcAcRatio} > 1.35). Podría ocurrir recorte (clipping) en horas punta.`)
  }

  const stringResults = strings.map((s) => {
    const messages: string[] = []
    const count = s.moduleCount

    if (count === 0) {
      return {
        stringId: s.id,
        stringName: s.name,
        moduleCount: 0,
        vocStcV: 0,
        vocColdV: 0,
        vmpHotV: 0,
        vmpColdV: 0,
        iscA: 0,
        isVocSafe: true,
        isMpptRangeValid: true,
        isCurrentSafe: true,
        messages: ['String sin módulos asignados.'],
      }
    }

    // 1. Voc at Standard Test Conditions (STC 25°C)
    const vocStcV = Math.round(count * moduleSpec.voc * 10) / 10

    // 2. Voc at Coldest Winter Temperature (-5°C)
    // Voc(T) = Voc_STC * [1 + beta_Voc * (T - 25)]
    const vocDeltaTemp = minAmbientTempC - 25
    const vocColdFactor = 1 + (moduleSpec.tempCoeffVocPctPerC / 100) * vocDeltaTemp
    const vocColdV = Math.round(vocStcV * vocColdFactor * 10) / 10

    // 3. Vmp at Coldest and Hottest Cell Temperatures
    const vmpStcV = count * moduleSpec.vmp
    const vmpColdV = Math.round(vmpStcV * (1 + (moduleSpec.tempCoeffVmpPctPerC / 100) * vocDeltaTemp) * 10) / 10
    const vmpHotV = Math.round(vmpStcV * (1 + (moduleSpec.tempCoeffVmpPctPerC / 100) * (maxCellTempC - 25)) * 10) / 10

    // 4. Current
    const iscA = moduleSpec.isc

    // Validations:
    const isVocSafe = vocColdV <= inverterSpec.maxDcVoltageV
    if (!isVocSafe) {
      isOverallValid = false
      messages.push(`¡Peligro! Voc frío (${vocColdV}V) supera la tensión máxima admisible del inversor (${inverterSpec.maxDcVoltageV}V). Riesgo de daño según RIC N°09.`)
    }

    const isMpptMinValid = vmpHotV >= inverterSpec.mpptMinVoltageV
    const isMpptMaxValid = vmpColdV <= inverterSpec.mpptMaxVoltageV
    const isMpptRangeValid = isMpptMinValid && isMpptMaxValid

    if (!isMpptMinValid) {
      isOverallValid = false
      messages.push(`Tensión en caliente (${vmpHotV}V) cae por debajo del rango de arranque MPPT (${inverterSpec.mpptMinVoltageV}V). Agrega más paneles en serie.`)
    }
    if (!isMpptMaxValid) {
      isOverallValid = false
      messages.push(`Tensión en frío (${vmpColdV}V) supera el rango MPPT superior (${inverterSpec.mpptMaxVoltageV}V).`)
    }

    const isCurrentSafe = iscA <= inverterSpec.maxInputCurrentPerMpptA
    if (!isCurrentSafe) {
      messages.push(`Corriente Isc (${iscA}A) supera la corriente nominal del MPPT (${inverterSpec.maxInputCurrentPerMpptA}A).`)
    }

    return {
      stringId: s.id,
      stringName: s.name,
      moduleCount: count,
      vocStcV,
      vocColdV,
      vmpHotV,
      vmpColdV,
      iscA,
      isVocSafe,
      isMpptRangeValid,
      isCurrentSafe,
      messages,
    }
  })

  return {
    isValid: isOverallValid,
    totalModules,
    totalDcPowerKwp,
    dcAcRatio,
    strings: stringResults,
    overallMessages,
  }
}
