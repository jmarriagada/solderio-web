export interface EquipmentItem {
  id: string
  category: 'MODULE' | 'INVERTER' | 'BATTERY' | 'STRUCTURE' | 'BOS_ELECTRICAL' | 'SERVICES'
  brand: string
  model: string
  description: string
  unitCostClp: number
  quantity: number
  unit: string
}

export interface CapexTemplate {
  id: string
  name: string
  tagline: string
  category: 'RESIDENTIAL' | 'COMMERCIAL' | 'OFF_GRID'
  pvKwp: number
  inverterKw: number
  batteryKwh: number
  roofType: string
  structureType: string
  items: EquipmentItem[]
}

export const PRECONFIGURED_CAPEX_TEMPLATES: CapexTemplate[] = [
  {
    id: 'TEMPLATE_RES_HYBRID_4KWP_14KWH',
    name: 'Residencial Híbrida_PV[4kWp]_ESS[14kWh]_Coplanar_Zinc',
    tagline: 'Autosuficiencia 24/7 con respaldo ante cortes de red y batería LiFePO4 de 14.3 kWh',
    category: 'RESIDENTIAL',
    pvKwp: 4.4,
    inverterKw: 5.0,
    batteryKwh: 14.3,
    roofType: 'Zinc / Chapa Metálica',
    structureType: 'Coplanar con rieles de aluminio anodizado',
    items: [
      {
        id: 'MOD_550W_BIFACIAL',
        category: 'MODULE',
        brand: 'Jinko Solar / Longi',
        model: 'Tiger Neo N-Type 550W Bifacial',
        description: 'Módulo fotovoltaico N-Type TOPCon bifacial de alta eficiencia (22.5%)',
        unitCostClp: 95000,
        quantity: 8,
        unit: 'unidades',
      },
      {
        id: 'INV_HYBRID_5KW',
        category: 'INVERTER',
        brand: 'Deye / GoodWe',
        model: 'SUN-5K-SG04LP1-EU (5kW Híbrido)',
        description: 'Inversor cargador híbrido monofásico con función UPS (<4ms) y homologación SEC',
        unitCostClp: 1650000,
        quantity: 1,
        unit: 'unidad',
      },
      {
        id: 'BAT_LIFEPO4_14KWH',
        category: 'BATTERY',
        brand: 'Deye / Pylontech',
        model: 'SE-G5.1 Pro x3 (14.3 kWh LiFePO4)',
        description: 'Banco de baterías litio ferrofosfato 51.2V 280Ah con BMS inteligente (6000 ciclos)',
        unitCostClp: 3200000,
        quantity: 1,
        unit: 'sistema',
      },
      {
        id: 'STRUCT_COPLANAR_ZINC',
        category: 'STRUCTURE',
        brand: 'SoldeRío Mounting',
        model: 'Estructura Coplanar Zinc Kalzip/Trapezoidal',
        description: 'Rieles de aluminio marino 6005-T5 y fijaciones autoperforantes con EPDM',
        unitCostClp: 280000,
        quantity: 1,
        unit: 'kit',
      },
      {
        id: 'BOS_ELECTRICAL_HYBRID',
        category: 'BOS_ELECTRICAL',
        brand: 'Schneider / Noark',
        model: 'Tablero Protecciones DC/AC + Respaldo Crítico (EPS)',
        description: 'DPS Clase II 1000V DC, diferenciales tipo A, automáticos y cable solar 6mm²',
        unitCostClp: 480000,
        quantity: 1,
        unit: 'kit',
      },
      {
        id: 'SERVICES_EPC_HYBRID',
        category: 'SERVICES',
        brand: 'SoldeRío Engineering',
        model: 'Instalación EPC + Ensayos PAT + Trámite SEC TE4',
        description: 'Montaje electromecánico certificado, protocolo de puesta en marcha y declaración SEC',
        unitCostClp: 1100000,
        quantity: 1,
        unit: 'servicio',
      },
    ],
  },
  {
    id: 'TEMPLATE_RES_ONGRID_5KWP_TEJA',
    name: 'Residencial On-Grid_PV[5kWp]_Coplanar_Teja',
    tagline: 'Sistema On-Grid Net Billing para máxima reducción de boleta con SAESA/Frontel',
    category: 'RESIDENTIAL',
    pvKwp: 5.5,
    inverterKw: 5.0,
    batteryKwh: 0,
    roofType: 'Teja Colonial / Arcilla',
    structureType: 'Coplanar con ganchos salvatejas de acero inoxidable',
    items: [
      {
        id: 'MOD_550W_BIFACIAL',
        category: 'MODULE',
        brand: 'Jinko Solar / Longi',
        model: 'Tiger Neo N-Type 550W Bifacial',
        description: 'Módulo fotovoltaico N-Type TOPCon bifacial Tier 1',
        unitCostClp: 95000,
        quantity: 10,
        unit: 'unidades',
      },
      {
        id: 'INV_ONGRID_5KW',
        category: 'INVERTER',
        brand: 'Huawei / Growatt',
        model: 'SUN2000-5KTL-L1 (5kW On-Grid)',
        description: 'Inversor string monofásico con 2 MPPTs independientes, WiFi y homologación SEC',
        unitCostClp: 1150000,
        quantity: 1,
        unit: 'unidad',
      },
      {
        id: 'STRUCT_TEJA',
        category: 'STRUCTURE',
        brand: 'SoldeRío Mounting',
        model: 'Estructura con Ganchos Salvatejas Inox A2',
        description: 'Ganchos regulables de acero inoxidable para teja chilena/colonial sin perforar tejado',
        unitCostClp: 350000,
        quantity: 1,
        unit: 'kit',
      },
      {
        id: 'BOS_ELECTRICAL_ONGRID',
        category: 'BOS_ELECTRICAL',
        brand: 'Schneider / Noark',
        model: 'Tablero de Protecciones DC/AC Normalizado SEC',
        description: 'Descargadores de sobretensión DPS, diferencial superinmunizado y cable solar',
        unitCostClp: 380000,
        quantity: 1,
        unit: 'kit',
      },
      {
        id: 'SERVICES_EPC_ONGRID',
        category: 'SERVICES',
        brand: 'SoldeRío Engineering',
        model: 'Montaje EPC + Trámite SEC TE4 + Contrato F5',
        description: 'Instalación llave en mano, protocolo de conexión distribuidora y cambio de medidor F6',
        unitCostClp: 950000,
        quantity: 1,
        unit: 'servicio',
      },
    ],
  },
  {
    id: 'TEMPLATE_COM_ONGRID_30KWP_LOSA',
    name: 'Comercial C&I On-Grid_PV[30kWp]_Inclinado_Losa',
    tagline: 'Planta C&I trifásica para empresas, lecherías y frigoríficos en Ley 21.118 (≤300 kW)',
    category: 'COMMERCIAL',
    pvKwp: 30.25,
    inverterKw: 30.0,
    batteryKwh: 0,
    roofType: 'Losa de Hormigón Plana',
    structureType: 'Estructura triangular lastrada de aluminio a 30°',
    items: [
      {
        id: 'MOD_550W_BIFACIAL',
        category: 'MODULE',
        brand: 'Jinko Solar / Longi',
        model: 'Tiger Neo N-Type 550W Bifacial',
        description: '55 módulos bifaciales con ganancia por albedo en losa blanca',
        unitCostClp: 92000,
        quantity: 55,
        unit: 'unidades',
      },
      {
        id: 'INV_TRIFASICO_30KW',
        category: 'INVERTER',
        brand: 'Huawei / SMA',
        model: 'SUN2000-30KTL-M3 (30kW Trifásico 380V)',
        description: 'Inversor trifásico con 4 MPPTs, desconexión rápida AFCI y certificación SEC',
        unitCostClp: 3450000,
        quantity: 1,
        unit: 'unidad',
      },
      {
        id: 'STRUCT_TRIANGULO_LOSA',
        category: 'STRUCTURE',
        brand: 'SoldeRío Mounting',
        model: 'Triángulos de Aluminio 30° con Lastres de Hormigón',
        description: 'Estructura autoportante lastrada para viento sur hasta 140 km/h sin perforar losa',
        unitCostClp: 1850000,
        quantity: 1,
        unit: 'kit',
      },
      {
        id: 'BOS_ELECTRICAL_CI',
        category: 'BOS_ELECTRICAL',
        brand: 'Schneider Electric',
        model: 'Tablero General Auxiliar FV Trifásico C&I',
        description: 'Interruptor termomagnético en caja moldeada, DPS Tipo 1+2, medidor de energía indirecto',
        unitCostClp: 1600000,
        quantity: 1,
        unit: 'kit',
      },
      {
        id: 'SERVICES_EPC_CI',
        category: 'SERVICES',
        brand: 'SoldeRío Engineering',
        model: 'Ingeniería de Detalle + Montaje C&I + Gestiones F1 a F6',
        description: 'Memoria de cálculo eléctrica, estudio de inyección, trámite TE4 e interconexión',
        unitCostClp: 3800000,
        quantity: 1,
        unit: 'servicio',
      },
    ],
  },
  {
    id: 'TEMPLATE_OFFGRID_RURAL_6KWP_20KWH',
    name: 'Off-Grid Rural_PV[6kWp]_ESS[20kWh]_Suelo',
    tagline: 'Sistema 100% aislado de la red con generador de respaldo automático para parcelas',
    category: 'OFF_GRID',
    pvKwp: 6.6,
    inverterKw: 6.0,
    batteryKwh: 20.4,
    roofType: 'Montaje en Suelo / Parque',
    structureType: 'Estructura biposte hincada en suelo a 35° Norte',
    items: [
      {
        id: 'MOD_550W_BIFACIAL',
        category: 'MODULE',
        brand: 'Jinko Solar',
        model: 'Tiger Neo N-Type 550W Bifacial',
        description: '12 módulos solares N-Type de alto rendimiento',
        unitCostClp: 95000,
        quantity: 12,
        unit: 'unidades',
      },
      {
        id: 'INV_OFFGRID_6KW',
        category: 'INVERTER',
        brand: 'Victron Energy / Deye',
        model: 'MultiPlus-II 48/8000 / Deye 6kW Off-Grid',
        description: 'Inversor-cargador de onda senoidal pura con relé de arranque automático de generador (ATS)',
        unitCostClp: 2100000,
        quantity: 1,
        unit: 'unidad',
      },
      {
        id: 'BAT_LIFEPO4_20KWH',
        category: 'BATTERY',
        brand: 'Pylontech / Deye',
        model: 'Banco LiFePO4 48V 400Ah (20.4 kWh)',
        description: 'Almacenamiento de litio de ciclo profundo con 8000 ciclos de vida útil',
        unitCostClp: 4400000,
        quantity: 1,
        unit: 'sistema',
      },
      {
        id: 'STRUCT_GROUND_MOUNT',
        category: 'STRUCTURE',
        brand: 'SoldeRío GroundMount',
        model: 'Estructura Biposte de Acero Galvanizado en Caliente',
        description: 'Hincada en terreno con perfiles C y zapatas de hormigón',
        unitCostClp: 850000,
        quantity: 1,
        unit: 'kit',
      },
      {
        id: 'BOS_OFFGRID',
        category: 'BOS_ELECTRICAL',
        brand: 'Victron / Noark',
        model: 'Regulador MPPT 250/100 + Tablero de Transferencia ATS',
        description: 'Controlador de carga solar ultrarrápido y tablero de distribución con protecciones',
        unitCostClp: 750000,
        quantity: 1,
        unit: 'kit',
      },
      {
        id: 'SERVICES_OFFGRID',
        category: 'SERVICES',
        brand: 'SoldeRío Engineering',
        model: 'Montaje Off-Grid + Puesta en Marcha + Capacitación',
        description: 'Instalación en sitio rural, calibración de baterías y sistema de monitoreo remoto 4G',
        unitCostClp: 1250000,
        quantity: 1,
        unit: 'servicio',
      },
    ],
  },
]

export function calculateTotalCapex(items: EquipmentItem[]): { totalClp: number; totalUsd: number; usdExchangeRate: number } {
  const usdExchangeRate = 960
  const totalClp = items.reduce((acc, item) => acc + item.unitCostClp * item.quantity, 0)
  const totalUsd = Math.round(totalClp / usdExchangeRate)
  return {
    totalClp,
    totalUsd,
    usdExchangeRate,
  }
}
