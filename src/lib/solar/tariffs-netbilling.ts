/**
 * Solderío Solar Engineering - Tarifas Eléctricas, Ley Net Billing 21.118, Límite de Invierno y Pricing Oficial
 * Macrozona Sur de Chile (SAESA, CRELL, CGE, FRONTEL, EDELAYSEN)
 */

import { DistributorType, TopologyType, OMPackageType, OMPackageDetail } from "@/types/cotizacion";

import { 
  DistributorTariffConfig, 
  DISTRIBUTOR_TARIFFS, 
  getDistributorTariff, 
  TARIFF_SYSTEM_METADATA,
  TariffSystemMetadata 
} from "./tariffs-config";

export type DistributorTariff = DistributorTariffConfig;
export type { TariffSystemMetadata };
export { DISTRIBUTOR_TARIFFS, getDistributorTariff, TARIFF_SYSTEM_METADATA };

// Ponderadores de demanda mensual para la macrozona sur (12 meses: Ene a Dic)
export const SOUTHERN_CHILE_DEMAND_WEIGHTS = [
  0.82, // Ene (Verano)
  0.80, // Feb (Verano)
  0.88, // Mar (Otoño temprano)
  1.05, // Abr (Inicio frío / Límite Invierno)
  1.25, // May (Invierno frío)
  1.40, // Jun (Pico invernal)
  1.45, // Jul (Pico invernal)
  1.32, // Ago (Invierno tardío)
  1.10, // Sep (Fin de Límite Invierno)
  0.95, // Oct (Primavera)
  0.88, // Nov (Primavera)
  0.84, // Dic (Verano)
];

export interface MonthlyDemandProfile {
  month: number;
  monthName: string;
  demandKwh: number;
  isWinterLimitPeriod: boolean;
  hasWinterLimitSurchargeWithoutSolar: boolean;
}

export interface NetBillingFinancialAnalysis {
  pCompraClpPerKwh: number;
  pNudoClpPerKwh: number;
  autoconsumoRatioPercent: number; // % de la energía generada consumida directamente en sitio
  inyeccionRatioPercent: number; // % inyectado a la red bajo Ley 21.118
  year1SavingsClp: number; // Ahorro neto anual año 1 ($CLP)
  year1AutoconsumoSavingsClp: number; // Ahorro por no comprar a la red ($CLP)
  year1InjectionCreditsClp: number; // Créditos generados por inyección ($CLP)
  winterLimitSavingsClp: number; // Ahorro específico por eliminar recargo de límite de invierno
  estimatedNewMonthlyBillClp: number; // Nueva boleta promedio ($12.000 - $25.000 cargo fijo y remanente)
  estimatedSystemCostClp: number; // CAPEX estimado con llave en mano e ingeniería SEC (Neto)
  estimatedSystemCostIvaClp: number; // Precio con IVA
  downpaymentHito1Clp: number; // 50%
  faenaHito2Clp: number;       // 35%
  finalHito3Clp: number;       // 15%
  margenBrutoPct: number;
  paybackYearsSimple: number;
  paybackYearsDiscounted: number;
  vanClp: number; // Valor Actual Neto a 25 años
  tirPercent: number; // Tasa Interna de Retorno
  cumulative25YearSavingsClp: number;
  lcoeClpPerKwh: number; // Costo nivelado de la energía solar ($42-$55 CLP/kWh)
  annualOpexClp: number; // O&M anual estimado (~1% CAPEX)
  inverterReplacementCostYear12Clp: number; // Recambio de inversor proyectado año 12 (~12% CAPEX)
  taxShieldArt33BisClp: number; // Crédito tributario Art. 33 bis LIR (5% activo fijo B2B)
  recoverableVatClp: number; // IVA recuperable 19% en F29 para empresas
  isB2B: boolean;
}

/**
 * Catálogo Oficial de Paquetes de O&M y Garantías SoldeRío
 */
export const OM_PACKAGES: Record<OMPackageType, OMPackageDetail> = {
  basic: {
    id: "basic",
    name: "Garantía Estándar SoldeRío",
    badge: "Incluida",
    monthlyPriceClp: 0,
    monthlyPriceUf: 0,
    tagline: "Garantía de producto de fábrica y soporte de instalación",
    features: [
      "25 Años de Garantía de Rendimiento en Módulos Tier 1 (≥85%)",
      "10 a 15 Años de Garantía de Inversores y Baterías LUNA Huawei",
      "1 Año de Garantía de Mano de Obra y Estanqueidad de Techo",
      "Monitoreo Básico en App Huawei FusionSolar Cloud",
      "Certificado TE-4 SEC y Tramitación Net Billing ante Distribuidora"
    ],
    isDefault: true,
  },
  essential: {
    id: "essential",
    name: "Plan Essential Care",
    badge: "Popular",
    monthlyPriceClp: 18000,
    monthlyPriceUf: 0.48,
    tagline: "Monitoreo telemático activo y mantenimiento anual",
    features: [
      "Todo lo de la Garantía Estándar",
      "Monitoreo Telemático Activo 24/7 con detección de anomalías por IA",
      "1 Visita Anual de Mantenimiento Preventivo (Lavado con agua desmineralizada y torqueo)",
      "Informe Técnico de Rendimiento Anual y Ahorro Auditado",
      "Gestión prioritaria de garantías ante el fabricante sin costo de servicio"
    ],
  },
  total_guard: {
    id: "total_guard",
    name: "Plan Total Guard (Seguro SoldeRío)",
    badge: "Recomendado",
    monthlyPriceClp: 25000,
    monthlyPriceUf: 0.67,
    tagline: "Mano de obra correctiva 100% cubierta y reemplazo express de equipos",
    features: [
      "Todo lo del Plan Essential Care",
      "2 Visitas Preventivas al año (Pre-verano y Post-invierno)",
      "Mano de Obra Correctiva 100% Cubierta (Cero costo en visitas técnicas por fallas)",
      "Inspección Termográfica Infrarroja (Detección de puntos calientes en celdas)",
      "Servicio Inversor Swap Express (<48 hrs en caso de falla de hardware)",
      "SLA de atención en terreno preferente <24 horas en el sur de Chile"
    ],
  },
};

/**
 * Motor de Precios Oficial SoldeRío (Huawei FusionSolar + Jinko 585Wp + BOS Eléctrico + Flete Sur)
 */
export function calculateTurnkeySystemPrice(
  installedKwp: number,
  batteryKwh: number = 0,
  isB2B: boolean = false
): {
  costoDirectoNetoClp: number;
  precioVentaNetoClp: number;
  precioVentaIvaClp: number;
  downpaymentHito1Clp: number; // 50%
  faenaHito2Clp: number;       // 35%
  finalHito3Clp: number;       // 15%
  margenBrutoPct: number;
  costoDirectoPerKwp: number;
  precioVentaPerKwpNeto: number;
} {
  const panelWp = 585;
  const isZeroKwp = installedKwp <= 0;
  const numPanels = isZeroKwp ? 0 : Math.max(6, Math.round((installedKwp * 1000) / panelWp));
  const realKwp = isZeroKwp ? 0 : (numPanels * panelWp) / 1000;
  const isCommercial = isB2B || realKwp > 12.0;

  // 1. Costo Módulos Fotovoltaicos Tier 1 N-Type TOPCon
  let costoPanelUnitario = 87000; // Residencial por panel
  if (realKwp > 50.0) {
    costoPanelUnitario = 78000; // Escala C&I mayor (contenedor)
  } else if (isCommercial) {
    costoPanelUnitario = 82000; // Escala C&I mediana (pallets cerrados)
  }
  const costoPaneles = numPanels * costoPanelUnitario;

  // 2. Estructura y Anclajes Certificados (Techo Residencial vs Galpón/Cubierta Industrial)
  const costoEstructuraPorKwp = isCommercial ? 52000 : 55000;
  const costoEstructura = Math.round(realKwp * costoEstructuraPorKwp);

  // 3. Cableado Solar DC y Protecciones de String (H1Z2Z2-K 6mm² + Conectores MC4)
  let costoCablesDC = 100000;
  if (isZeroKwp) {
    costoCablesDC = 0;
  } else if (realKwp <= 4.0) {
    costoCablesDC = 100000;
  } else if (realKwp <= 6.5) {
    costoCablesDC = 140000;
  } else if (realKwp <= 9.0) {
    costoCablesDC = 250000;
  } else if (realKwp <= 12.0) {
    costoCablesDC = 320000;
  } else if (realKwp <= 25.0) {
    costoCablesDC = 480000;
  } else if (realKwp <= 50.0) {
    costoCablesDC = 750000;
  } else {
    costoCablesDC = Math.round(realKwp * 15000);
  }

  // 4. Inversores Solares Certificados SEC (Huawei FusionSolar / Sungrow)
  let costoInversor = 580000;
  if (isZeroKwp) {
    costoInversor = 0;
  } else if (realKwp <= 4.0) {
    costoInversor = 460000; // Huawei SUN2000-3KTL-L1 Monofásico
  } else if (realKwp <= 6.5) {
    costoInversor = 580000; // Huawei SUN2000-5KTL-L1 Monofásico
  } else if (realKwp <= 9.0) {
    costoInversor = 1180000; // Huawei SUN2000-8KTL-M1 Trifásico
  } else if (realKwp <= 12.0) {
    costoInversor = 1320000; // Huawei SUN2000-10KTL-M1 Trifásico
  } else if (realKwp <= 20.0) {
    costoInversor = 1650000; // Huawei SUN2000-15KTL / 17KTL Trifásico
  } else if (realKwp <= 32.0) {
    costoInversor = 2450000; // Huawei SUN2000-25KTL / 30KTL-M3 Trifásico
  } else if (realKwp <= 50.0) {
    costoInversor = 3550000; // Huawei SUN2000-36KTL / 40KTL / 50KTL-M3 Trifásico C&I
  } else if (realKwp <= 100.0) {
    costoInversor = 7200000; // Inversores comerciales 60KTL a 100KTL-M2
  } else {
    costoInversor = Math.round(realKwp * 78000); // 78.000 CLP/kWp para inversores trifásicos comerciales en paralelo
  }

  // 5. BOS Eléctrico, Tablero TGA & Protecciones (Interruptores, DPS 1+2, Smart Meter Janitza/Chint)
  let costoBOS = 600000;
  if (isZeroKwp) {
    costoBOS = 350000;
  } else if (realKwp <= 4.0) {
    costoBOS = 520000;
  } else if (realKwp <= 6.5) {
    costoBOS = 600000;
  } else if (realKwp <= 9.0) {
    costoBOS = 980000; // TGA Trifásico + Smart Meter DTSU666-H + Protecciones trifásicas
  } else if (realKwp <= 12.0) {
    costoBOS = 1100000;
  } else if (realKwp <= 25.0) {
    costoBOS = 1650000; // TGA Comercial con automáticos industriales, DPS 1+2 y Smart Meter 3F
  } else if (realKwp <= 50.0) {
    costoBOS = 2850000; // TGA Autosoportado IP65, MCCB, DPS 1+2, analizador redes con CTs, relé anti-isla
  } else if (realKwp <= 100.0) {
    costoBOS = 5200000;
  } else {
    costoBOS = Math.round(realKwp * 55000);
  }

  // 6. Mano de Obra, Montaje y Seguridad (Cuadrilla Residencial vs Faena C&I en Galpón con Líneas de Vida)
  let costoMO = 950000;
  if (isZeroKwp) {
    costoMO = 500000;
  } else if (realKwp <= 4.0) {
    costoMO = 850000; // 3 Días cuadrilla residencial en techo (hasta 7 paneles)
  } else if (realKwp <= 6.5) {
    costoMO = 960000; // 3 Días cuadrilla residencial en techo (8 a 11 paneles)
  } else if (realKwp <= 9.0) {
    costoMO = 1520000; // 4-5 Días cuadrilla residencial/parcela (14 paneles en cubierta + zanja AC)
  } else if (realKwp <= 12.0) {
    costoMO = 1800000; // 5 Días cuadrilla residencial/parcela (15 a 20 paneles)
  } else if (realKwp <= 25.0) {
    costoMO = 2200000; // Cuadrilla C&I 4 técnicos, 5 días
  } else if (realKwp <= 50.0) {
    costoMO = 3450000; // Cuadrilla C&I 5 técnicos, 8-10 días, faena en altura sobre galpón
  } else if (realKwp <= 100.0) {
    costoMO = 6200000; // Cuadrilla C&I 6 técnicos, 15 días
  } else {
    costoMO = Math.round(realKwp * 65000);
  }

  // 7. Ingeniería SEC Clase A, Planos Unilineales, Memoria Estructural y Trámite TE-4 (F1 a F5)
  let costoSEC = 210000;
  if (realKwp <= 6.5) {
    costoSEC = 210000; // Trámite TE-4 residencial monofásico
  } else if (realKwp <= 12.0) {
    costoSEC = 360000; // Trámite TE-4 residencial/parcela trifásico o ampliación
  } else if (realKwp <= 25.0) {
    costoSEC = 680000; // Planos comerciales + F1 a F5 Saesa/CGE + TE-4 SEC
  } else if (realKwp <= 50.0) {
    costoSEC = 1350000; // Memoria estructural viento galpón + Estudio conexión F1-F5 + TE-4 SEC Clase A
  } else if (realKwp <= 100.0) {
    costoSEC = 2400000; // Coordinación de protecciones + Armónicos + F1-F5 + TE-4
  } else {
    costoSEC = Math.round(realKwp * 25000);
  }

  // 8. Flete y Logística Especializada al Sur
  let fleteSur = 120000;
  if (isZeroKwp) {
    fleteSur = 90000;
  } else if (realKwp <= 4.0) {
    fleteSur = 90000;
  } else if (realKwp <= 6.5) {
    fleteSur = 120000;
  } else if (realKwp <= 9.0) {
    fleteSur = 180000;
  } else if (realKwp <= 12.0) {
    fleteSur = 210000;
  } else if (realKwp <= 25.0) {
    fleteSur = 350000;
  } else if (realKwp <= 50.0) {
    fleteSur = 650000; // Camión con grúa/plataforma para pallets pesados (~2 toneladas en paneles)
  } else if (realKwp <= 100.0) {
    fleteSur = 1200000;
  } else {
    fleteSur = Math.round(realKwp * 14000);
  }

  // 9. Banco de Baterías BESS (si aplica)
  let costoBateriaKit = 0;
  if (batteryKwh > 0) {
    if (batteryKwh <= 7.0) {
      costoBateriaKit = 2650000; // Huawei LUNA2000 5.12 kWh (BMS + 1 módulo + Backup Box monofásica)
      fleteSur += 50000;
    } else if (batteryKwh <= 12.0) {
      costoBateriaKit = 4850000; // Huawei LUNA2000 10.24 kWh (BMS + 2 módulos + Backup Box)
      fleteSur += 100000;
    } else if (batteryKwh <= 16.0) {
      costoBateriaKit = 6800000; // Huawei LUNA2000 15.36 kWh (BMS + 3 módulos)
      fleteSur += 140000;
    } else {
      costoBateriaKit = Math.round(batteryKwh * 420000);
      fleteSur += 180000;
    }
  }

  const costoDirectoNetoClp = Math.round(
    costoPaneles + costoEstructura + costoCablesDC + costoMO + costoSEC + costoInversor + costoBOS + fleteSur + costoBateriaKit
  );

  // Margen diferenciado:
  // - 18.5% con Baterías BESS (competitivo en almacenamiento)
  // - 24.5% en C&I Comercial / B2B (>12 kWp)
  // - 28.0% en Residencial On-Grid (<= 12 kWp)
  let margenBrutoPct = 0.280;
  if (batteryKwh > 0) {
    margenBrutoPct = 0.185;
  } else if (isCommercial) {
    margenBrutoPct = 0.245;
  }

  const precioVentaNetoClp = Math.round(costoDirectoNetoClp / (1.0 - margenBrutoPct));
  const precioVentaIvaClp = Math.round(precioVentaNetoClp * 1.19);

  // Hitos de pago 50 / 35 / 15
  const downpaymentHito1Clp = Math.round(precioVentaNetoClp * 0.50);
  const faenaHito2Clp = Math.round(precioVentaNetoClp * 0.35);
  const finalHito3Clp = Math.round(precioVentaNetoClp * 0.15);

  return {
    costoDirectoNetoClp,
    precioVentaNetoClp,
    precioVentaIvaClp,
    downpaymentHito1Clp,
    faenaHito2Clp,
    finalHito3Clp,
    margenBrutoPct: Math.round(margenBrutoPct * 1000) / 10,
    costoDirectoPerKwp: realKwp > 0 ? Math.round(costoDirectoNetoClp / realKwp) : 0,
    precioVentaPerKwpNeto: realKwp > 0 ? Math.round(precioVentaNetoClp / realKwp) : 0,
  };
}

/**
 * Calcula la demanda estacional mensual de una vivienda en el sur
 */
export function calculateSouthernSeasonalDemand(
  monthlyBillClp: number,
  distributorKey: DistributorType = "saesa"
): MonthlyDemandProfile[] {
  const tariff = DISTRIBUTOR_TARIFFS[distributorKey] || DISTRIBUTOR_TARIFFS.saesa;
  const baseAvgMonthlyKwh = Math.max(80, Math.round((monthlyBillClp - tariff.fixedChargeMonthlyClp) / tariff.pCompraClpPerKwh));
  const sumWeights = SOUTHERN_CHILE_DEMAND_WEIGHTS.reduce((a, b) => a + b, 0);
  const avgWeight = sumWeights / 12;

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return SOUTHERN_CHILE_DEMAND_WEIGHTS.map((weight, idx) => {
    const month = idx + 1;
    const isWinterLimitPeriod = month >= 4 && month <= 9; // Abril a Septiembre
    const demandKwh = Math.round(baseAvgMonthlyKwh * (weight / avgWeight));
    const hasWinterLimitSurchargeWithoutSolar = isWinterLimitPeriod && demandKwh > tariff.winterLimitThresholdKwh;

    return {
      month,
      monthName: monthNames[idx],
      demandKwh,
      isWinterLimitPeriod,
      hasWinterLimitSurchargeWithoutSolar,
    };
  });
}

/**
 * Calcula el perfil de demanda estacional a partir de un consumo total anual en kWh
 */
export function calculateDemandFromAnnualKwh(
  annualKwh: number,
  distributorKey: DistributorType = "saesa"
): MonthlyDemandProfile[] {
  const tariff = DISTRIBUTOR_TARIFFS[distributorKey] || DISTRIBUTOR_TARIFFS.saesa;
  const baseAvgMonthlyKwh = Math.max(50, annualKwh / 12);
  const sumWeights = SOUTHERN_CHILE_DEMAND_WEIGHTS.reduce((a, b) => a + b, 0);
  const avgWeight = sumWeights / 12;

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return SOUTHERN_CHILE_DEMAND_WEIGHTS.map((weight, idx) => {
    const month = idx + 1;
    const isWinterLimitPeriod = month >= 4 && month <= 9;
    const demandKwh = Math.round(baseAvgMonthlyKwh * (weight / avgWeight));
    const hasWinterLimitSurchargeWithoutSolar = isWinterLimitPeriod && demandKwh > tariff.winterLimitThresholdKwh;

    return {
      month,
      monthName: monthNames[idx],
      demandKwh,
      isWinterLimitPeriod,
      hasWinterLimitSurchargeWithoutSolar,
    };
  });
}

/**
 * Genera el perfil de demanda exacto a partir del desglose mes a mes ingresado por el usuario (12 meses en kWh)
 */
export function calculateDemandFromMonthlyKwh(
  monthlyKwh: number[],
  distributorKey: DistributorType = "saesa"
): MonthlyDemandProfile[] {
  const tariff = DISTRIBUTOR_TARIFFS[distributorKey] || DISTRIBUTOR_TARIFFS.saesa;
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return monthNames.map((monthName, idx) => {
    const month = idx + 1;
    const isWinterLimitPeriod = month >= 4 && month <= 9;
    const demandKwh = Math.max(10, Math.round(monthlyKwh[idx] || 250));
    const hasWinterLimitSurchargeWithoutSolar = isWinterLimitPeriod && demandKwh > tariff.winterLimitThresholdKwh;

    return {
      month,
      monthName,
      demandKwh,
      isWinterLimitPeriod,
      hasWinterLimitSurchargeWithoutSolar,
    };
  });
}

/**
 * Calcula el análisis financiero y económico bajo la Ley 21.118 Net Billing con Límite de Invierno
 */
export function calculateNetBillingFinancials(
  annualGenKwh: number,
  monthlyBillClp: number,
  distributorKey: DistributorType = "saesa",
  systemType: TopologyType = "hibrida",
  installedKwp: number = 5.0,
  batteryKwh: number = 0,
  monthlyDemandList?: MonthlyDemandProfile[],
  isB2B: boolean = false
): NetBillingFinancialAnalysis {
  const tariff = DISTRIBUTOR_TARIFFS[distributorKey] || DISTRIBUTOR_TARIFFS.saesa;
  const annualBillClp = monthlyBillClp * 12;

  const seasonalDemands = monthlyDemandList || calculateSouthernSeasonalDemand(monthlyBillClp, distributorKey);
  const totalAnnualDemandKwh = seasonalDemands.reduce((acc, d) => acc + d.demandKwh, 0);

  // Fracción de autoconsumo según topología y hábitos de carga solar activa
  let autoconsumoRatio = 0.52;
  if (isB2B) {
    autoconsumoRatio = 0.78; // 78% en empresas/talleres/lecherías (consumo diurno comercial)
  } else if (systemType === "ongrid") {
    if (installedKwp <= 4.5) {
      autoconsumoRatio = 0.53; // 53% en hogares con hasta 7 paneles (gestión activa diurna)
    } else if (installedKwp <= 7.0) {
      autoconsumoRatio = 0.48; // 48% en casas medianas
    } else {
      autoconsumoRatio = 0.41; // 41% en parcelas/casas grandes sin baterías (excedente diurno alto inyectado a la red)
    }
  } else if (systemType === "hibrida" && batteryKwh > 0) {
    // Con baterías LiFePO4: almacena excedente diurno para consumo vespertino y nocturno
    if (batteryKwh <= 7.0) {
      autoconsumoRatio = installedKwp <= 5.0 ? 0.82 : 0.65; // Respaldo Esencial (5.12 kWh)
    } else {
      autoconsumoRatio = installedKwp <= 6.0 ? 0.90 : 0.65; // Respaldo Total (10.24 kWh)
    }
  } else if (systemType === "offgrid") {
    autoconsumoRatio = 1.0; // 100% aislado
  }

  const inyeccionRatio = Math.max(0, 1 - autoconsumoRatio);

  const solarGenUsedLocallyKwh = Math.min(totalAnnualDemandKwh, annualGenKwh * autoconsumoRatio);
  const solarGenInjectedKwh = Math.max(0, annualGenKwh - solarGenUsedLocallyKwh);

  // Cálculo del recargo de Límite de Invierno evitado (Sin doble contabilización):
  // En Chile, el Límite de Invierno (abril a septiembre) aplica a tarifa BT1 residencial
  // cuando el consumo base mensual supera los 350 kWh.
  // La energía solar generada y autoconsumida durante esos 6 meses invernales
  // evita comprar a la tarifa con recargo ($pInviernoClpPerKwh).
  // El diferencial ($pInvierno - $pCompra) se reconoce ÚNICAMENTE sobre los kWh solares
  // generados y autoconsumidos en el período de invierno (abril a septiembre) para clientes que superan el umbral.
  let winterLimitSavingsClp = 0;
  if (!isB2B && systemType !== "offgrid") {
    const hasWinterExcess = seasonalDemands.some((d) => d.hasWinterLimitSurchargeWithoutSolar);
    if (hasWinterExcess) {
      const winterSolarGenKwh = annualGenKwh * 0.25; // ~25% de la generación anual ocurre en el semestre abr-sep en el sur
      const winterSolarSelfConsumedKwh = winterSolarGenKwh * autoconsumoRatio;
      const penaltyPerKwh = tariff.pInviernoClpPerKwh - tariff.pCompraClpPerKwh; // ej. $345 - $270 = $75/kWh
      winterLimitSavingsClp = Math.round(winterSolarSelfConsumedKwh * penaltyPerKwh);
    }
  }

  // Valorización de energía evitada e inyectada:
  // Para B2C: tarifa BT1 completa con IVA (~$270 a $295/kWh).
  // Para B2B: tarifa comercial neta sin IVA de energía activa (~$210 a $230/kWh) ya que la empresa recupera el IVA en F29.
  const effectiveEnergyBuyPrice = isB2B ? Math.round(tariff.pCompraClpPerKwh / 1.19) : tariff.pCompraClpPerKwh;

  let year1AutoconsumoSavings = Math.round(solarGenUsedLocallyKwh * effectiveEnergyBuyPrice);
  let year1InjectionCredits = Math.round(solarGenInjectedKwh * tariff.pNudoClpPerKwh);

  // En B2B, la generación solar en horas de sol reduce la potencia demandada diurna (Peak Shaving diurno)
  const peakShavingDemandSavingsClp = isB2B
    ? Math.round(installedKwp * 0.40 * 12 * 7500) // ~7.500 CLP/kW-mes de potencia diurna mitigada
    : 0;

  if (systemType === "offgrid") {
    // En sistemas Off-Grid (Aislados) no existe conexión a red eléctrica ni inyección de excedentes.
    // La planta solar fotovoltaica con almacenamiento LiFePO4 cubre entre el 88% y 95% del consumo energético del predio
    // (el porcentaje restante en temporales cerrados de invierno lo aporta el motogenerador auxiliar con partida ATS).
    // El ahorro económico anual corresponde al gasto energético que deja de incurrirse (hasta el 95% del gasto anual).
    const solarCoverageFraction = batteryKwh >= 15 ? 0.95 : (batteryKwh >= 10 ? 0.90 : 0.85);
    year1AutoconsumoSavings = Math.round(annualBillClp * solarCoverageFraction);
    year1InjectionCredits = 0;
  }

  // Ahorro neto año 1 con tope realista de mercado:
  // - En B2B On-Grid: entre 45% y 58% de la cuenta anual de la empresa (retención por potencia y consumo nocturno)
  // - En On-Grid residencial: hasta 78% de la cuenta anual (cargos fijos y consumo nocturno invernal)
  // - En Híbrido residencial: hasta 90% de la cuenta anual (baterías cubren noche)
  // - En Off-Grid: desplazamiento de combustible diésel
  let grossSavings = year1AutoconsumoSavings + year1InjectionCredits + winterLimitSavingsClp + peakShavingDemandSavingsClp;
  let maxPossibleSavings = Math.max(0, annualBillClp - (tariff.fixedChargeMonthlyClp * 12));
  if (isB2B) {
    maxPossibleSavings = Math.round(annualBillClp * 0.58);
  } else if (systemType === "ongrid") {
    maxPossibleSavings = Math.round(annualBillClp * 0.78);
  } else if (systemType === "hibrida") {
    maxPossibleSavings = Math.round(annualBillClp * 0.90);
  } else if (systemType === "offgrid") {
    maxPossibleSavings = year1AutoconsumoSavings;
    grossSavings = year1AutoconsumoSavings;
  }

  const year1Savings = Math.min(maxPossibleSavings, grossSavings);

  const estimatedNewAnnualBill = systemType === "offgrid" 
    ? 0 
    : Math.max(tariff.fixedChargeMonthlyClp * 12, annualBillClp - year1Savings);
  const estimatedNewMonthlyBillClp = Math.round(estimatedNewAnnualBill / 12);

  // CÁLCULO EXACTO DE PRECIO LLAVE EN MANO SOLDE RÍO (pasando isB2B)
  const pricing = calculateTurnkeySystemPrice(installedKwp, batteryKwh, isB2B);
  const estimatedSystemCostClp = pricing.precioVentaNetoClp;
  const estimatedSystemCostIvaClp = pricing.precioVentaIvaClp;

  // Proyección financiera a 25 años
  const moduleDegradationAnnual = 0.004; // -0.40% anual (N-Type TOPCon)
  const energyInflationAnnual = 0.035; // +3.5% inflación tarifaria anual
  const discountRate = isB2B ? 0.09 : 0.07; // 9.0% tasa descuento corporativa, 7.0% residencial

  let cumulativeSavings = 0;
  let van = -estimatedSystemCostClp;
  let runningCashFlow = -estimatedSystemCostClp;
  let simplePayback = 0;
  let discountedPayback = 0;
  let simplePaybackFound = false;
  let discountedPaybackFound = false;

  const cashFlows: number[] = [-estimatedSystemCostClp];

  for (let t = 1; t <= 25; t++) {
    const oAndMCost = (estimatedSystemCostClp * 0.01) * Math.pow(1 + 0.03, t - 1);
    // Recambio de inversor en el año 12 (~12% CAPEX)
    const inverterReplacementCost = t === 12 ? Math.round(estimatedSystemCostClp * 0.12) : 0;
    // Escudo tributario Art. 33 bis LIR (5% crédito tributario sobre activo fijo en año 1)
    const taxShieldArt33Bis = (isB2B && t === 1) ? Math.round(estimatedSystemCostClp * 0.05) : 0;

    const grossSavingsYearT = year1Savings * Math.pow(1 - moduleDegradationAnnual, t - 1) * Math.pow(1 + energyInflationAnnual, t - 1);
    const netCashFlowT = grossSavingsYearT - (oAndMCost + inverterReplacementCost) + taxShieldArt33Bis;

    cashFlows.push(netCashFlowT);
    cumulativeSavings += netCashFlowT;

    const discountedCashFlowT = netCashFlowT / Math.pow(1 + discountRate, t);
    van += discountedCashFlowT;

    runningCashFlow += netCashFlowT;
    if (runningCashFlow >= 0 && !simplePaybackFound) {
      const prev = runningCashFlow - netCashFlowT;
      simplePayback = t - 1 + Math.abs(prev) / netCashFlowT;
      simplePaybackFound = true;
    }

    if (van >= 0 && !discountedPaybackFound) {
      const prevVan = van - discountedCashFlowT;
      discountedPayback = t - 1 + Math.abs(prevVan) / discountedCashFlowT;
      discountedPaybackFound = true;
    }
  }

  if (!simplePaybackFound) simplePayback = estimatedSystemCostClp / Math.max(1, year1Savings);
  if (!discountedPaybackFound) discountedPayback = simplePayback * 1.25;

  let tirApprox = 0.14;
  if (simplePayback <= 3.5) tirApprox = 0.28;
  else if (simplePayback <= 4.5) tirApprox = 0.22;
  else if (simplePayback <= 6.0) tirApprox = 0.16;
  else if (simplePayback <= 8.0) tirApprox = 0.12;
  else tirApprox = 0.09;

  let total25YearGenKwh = 0;
  for (let t = 1; t <= 25; t++) {
    total25YearGenKwh += annualGenKwh * Math.pow(1 - moduleDegradationAnnual, t - 1);
  }
  const lcoe = Math.round((estimatedSystemCostClp * 1.25) / Math.max(1, total25YearGenKwh));

  return {
    pCompraClpPerKwh: tariff.pCompraClpPerKwh,
    pNudoClpPerKwh: tariff.pNudoClpPerKwh,
    autoconsumoRatioPercent: Math.round(autoconsumoRatio * 100),
    inyeccionRatioPercent: Math.round(inyeccionRatio * 100),
    year1SavingsClp: Math.round(year1Savings),
    year1AutoconsumoSavingsClp: Math.round(year1AutoconsumoSavings),
    year1InjectionCreditsClp: Math.round(year1InjectionCredits),
    winterLimitSavingsClp,
    estimatedNewMonthlyBillClp,
    estimatedSystemCostClp,
    estimatedSystemCostIvaClp,
    downpaymentHito1Clp: pricing.downpaymentHito1Clp,
    faenaHito2Clp: pricing.faenaHito2Clp,
    finalHito3Clp: pricing.finalHito3Clp,
    margenBrutoPct: pricing.margenBrutoPct,
    paybackYearsSimple: Math.round(simplePayback * 10) / 10,
    paybackYearsDiscounted: Math.round(discountedPayback * 10) / 10,
    vanClp: Math.round(van),
    tirPercent: Math.round(tirApprox * 1000) / 10,
    cumulative25YearSavingsClp: Math.round(cumulativeSavings),
    lcoeClpPerKwh: Math.max(38, Math.min(65, lcoe)),
    annualOpexClp: Math.round(estimatedSystemCostClp * 0.01),
    inverterReplacementCostYear12Clp: Math.round(estimatedSystemCostClp * 0.12),
    taxShieldArt33BisClp: isB2B ? Math.round(estimatedSystemCostClp * 0.05) : 0,
    recoverableVatClp: isB2B ? Math.round(estimatedSystemCostClp * 0.19) : 0,
    isB2B,
  };
}

/**
 * Curva horaria de un día representativo (24 horas)
 * Basada en la mecánica oficial de Netbilling (Imagen 1):
 * - Autoconsumo (verde): se ahorra el valor total de compra con IVA ($240-$285/kWh)
 * - Inyección (naranja): excedentaria a precio nudo sin IVA ($110-$125/kWh)
 * - Compra a la red (azul): déficit nocturno o madrugador a tarifa completa
 */
export function generateTypicalDayHourlyProfile(
  dailySolarGenKwh: number,
  dailyDemandKwh: number,
  isB2B: boolean = false
): Array<{
  hour: number;
  solarGenKwh: number;
  consumptionKwh: number;
  selfConsumedKwh: number;
  injectedKwh: number;
  gridImportKwh: number;
}> {
  // Distribución solar horaria normalizada (campana de radiación solar en Chile Central/Sur)
  const solarFractions: Record<number, number> = {
    6: 0.01,
    7: 0.03,
    8: 0.06,
    9: 0.09,
    10: 0.12,
    11: 0.14,
    12: 0.15,
    13: 0.14,
    14: 0.11,
    15: 0.08,
    16: 0.05,
    17: 0.02,
  };

  // Distribución de demanda horaria:
  // Residencial: picks a las 8:00 y 20:00-22:00
  // B2B: consumo concentrado en horario laboral de 8:30 a 18:30
  const demandFractionsResidential: Record<number, number> = {
    0: 0.025, 1: 0.020, 2: 0.018, 3: 0.018, 4: 0.020, 5: 0.025,
    6: 0.035, 7: 0.055, 8: 0.065, 9: 0.050, 10: 0.045, 11: 0.045,
    12: 0.050, 13: 0.055, 14: 0.050, 15: 0.045, 16: 0.050, 17: 0.055,
    18: 0.065, 19: 0.075, 20: 0.085, 21: 0.080, 22: 0.065, 23: 0.047
  };

  const demandFractionsB2B: Record<number, number> = {
    0: 0.010, 1: 0.010, 2: 0.010, 3: 0.010, 4: 0.010, 5: 0.015,
    6: 0.025, 7: 0.040, 8: 0.070, 9: 0.085, 10: 0.095, 11: 0.095,
    12: 0.085, 13: 0.070, 14: 0.085, 15: 0.090, 16: 0.085, 17: 0.075,
    18: 0.050, 19: 0.025, 20: 0.015, 21: 0.010, 22: 0.010, 23: 0.010
  };

  const demandFractions = isB2B ? demandFractionsB2B : demandFractionsResidential;

  const profile = [];

  for (let h = 0; h < 24; h++) {
    const sFrac = solarFractions[h] || 0;
    const dFrac = demandFractions[h] || 0.04;

    const solarGenKwh = Math.round(dailySolarGenKwh * sFrac * 100) / 100;
    const consumptionKwh = Math.round(dailyDemandKwh * dFrac * 100) / 100;

    const selfConsumedKwh = Math.round(Math.min(solarGenKwh, consumptionKwh) * 100) / 100;
    const injectedKwh = Math.round(Math.max(0, solarGenKwh - consumptionKwh) * 100) / 100;
    const gridImportKwh = Math.round(Math.max(0, consumptionKwh - solarGenKwh) * 100) / 100;

    profile.push({
      hour: h,
      solarGenKwh,
      consumptionKwh,
      selfConsumedKwh,
      injectedKwh,
      gridImportKwh,
    });
  }

  return profile;
}

/**
 * Balance contable mensual de Net Billing bajo Ley 21.118 (Imagen 2 de referencia)
 * Muestra mes a mes:
 * 1. Compra de energía a la distribuidora
 * 2. Crédito generado por inyección a precio de nudo
 * 3. Saldo acumulado estacional que financia el consumo en invierno
 * 4. Boletas variables en $0 en primavera/verano y reliquidación final en ciclo anual
 */
export function generateNetBillingMonthlyLedger(
  monthlyBreakdown: Array<{ month: number; monthName: string; monthlyGenKwh: number; monthlyDemandKwh: number }>,
  tariff: DistributorTariff
): Array<{
  monthName: string;
  boughtKwh: number;
  boughtClp: number;
  injectedKwh: number;
  creditClp: number;
  initialBalanceClp: number;
  finalBalanceClp: number;
  customerPaysClp: number;
  annualSurplusPayoutClp?: number;
}> {
  let accumulatedBalanceClp = 0;
  const ledger = [];

  for (let idx = 0; idx < monthlyBreakdown.length; idx++) {
    const item = monthlyBreakdown[idx];
    const gen = item.monthlyGenKwh;
    const demand = item.monthlyDemandKwh;

    // Autoconsumo directo en sitio ~ 70% de la generación
    const selfConsumedKwh = Math.min(demand, gen * 0.70);
    const boughtKwh = Math.max(0, Math.round(demand - selfConsumedKwh));
    const injectedKwh = Math.max(0, Math.round(gen - selfConsumedKwh));

    // Compra valorizada con tarifa plena (incluye recargo de invierno si aplica)
    const isWinter = item.month >= 4 && item.month <= 9;
    const priceKwh = (isWinter && demand > tariff.winterLimitThresholdKwh) 
      ? tariff.pInviernoClpPerKwh 
      : tariff.pCompraClpPerKwh;

    const boughtClp = Math.round(boughtKwh * priceKwh);
    const creditClp = Math.round(injectedKwh * tariff.pNudoClpPerKwh);

    const initialBalanceClp = accumulatedBalanceClp;
    const totalCreditAvailable = creditClp + initialBalanceClp;

    let customerPaysClp = 0;
    let finalBalanceClp = 0;

    if (totalCreditAvailable >= boughtClp) {
      // El crédito cubre 100% de la energía comprada
      customerPaysClp = tariff.fixedChargeMonthlyClp; // Solo paga cargo fijo de red
      finalBalanceClp = totalCreditAvailable - boughtClp;
    } else {
      // El crédito reduce parcialmente la boleta
      customerPaysClp = Math.round(boughtClp - totalCreditAvailable + tariff.fixedChargeMonthlyClp);
      finalBalanceClp = 0;
    }

    accumulatedBalanceClp = finalBalanceClp;

    // Si es diciembre (fin del ciclo anual de facturación), la distribuidora liquida excedentes no consumidos
    let annualSurplusPayoutClp: number | undefined = undefined;
    if (idx === 11 && accumulatedBalanceClp > 0) {
      annualSurplusPayoutClp = accumulatedBalanceClp;
      finalBalanceClp = 0;
      accumulatedBalanceClp = 0;
    }

    ledger.push({
      monthName: item.monthName,
      boughtKwh,
      boughtClp,
      injectedKwh,
      creditClp,
      initialBalanceClp,
      finalBalanceClp,
      customerPaysClp,
      annualSurplusPayoutClp,
    });
  }

  return ledger;
}

/**
 * Módulo de Transparencia Oficial de SoldeRío (Imagen 3 de referencia)
 * "Qué puede exigir quien contrata" vs "Compromisos del propietario"
 */
export function generateRightsAndCommitments(): {
  whatYouCanDemand: Array<{
    step: number;
    question: string;
    title: string;
    details: string;
  }>;
  ownerCommitments: Array<{
    title: string;
    details: string;
  }>;
} {
  return {
    whatYouCanDemand: [
      {
        step: 1,
        question: "¿Qué tecnología y certificaciones respaldan los equipos?",
        title: "Tecnología Tier 1 y Certificación SEC",
        details: "Módulos Tier 1 N-Type TOPCon con 25 años de garantía de producto y 30 años de potencia lineal. Inversores híbridos certificados SEC con protocolo PE Nº 1/26 anti-isla y monitoreo WiFi/4G integrado.",
      },
      {
        step: 2,
        question: "¿Quién asume la responsabilidad del servicio técnico local?",
        title: "Soporte Técnico Local & Estanqueidad Garantizada",
        details: "Garantía formal por escrito de 1 año en estanqueidad de techumbre (cero filtraciones) y mano de obra. Cuadrilla técnica propia en el sur de Chile (Llanquihue, Osorno, Valdivia, Chiloé).",
      },
      {
        step: 3,
        question: "¿Cómo se legaliza la inyección y el cambio de medidor?",
        title: "Tramitación SEC TE4 y Proceso Net Billing Completo",
        details: "Ingreso formal de Formularios F1 a F5 ante la distribuidora (SAESA, CRELL, etc.) y obtención del Certificado TE4 SEC por instalador eléctrico autorizado Clase A o B. Medidor bidireccional gestionado.",
      },
      {
        step: 4,
        question: "¿Cuáles son los hitos de pago contra avance real?",
        title: "Hitos Transparentes 50% / 35% / 15%",
        details: "50% de anticipo para orden de compra y reserva de hardware. 35% contra arribo a faena y montaje en techo. 15% final únicamente contra puesta en marcha conforme y TE4 ingresado a la SEC.",
      },
    ],
    ownerCommitments: [
      {
        title: "Condiciones de Acceso y Empalme Eléctrico",
        details: "Facilitar acceso seguro a techumbre, tablero general y empalme en las fechas acordadas de montaje e inspección.",
      },
      {
        title: "Mantenimiento Periódico de Módulos",
        details: "Realizar o programar 1 a 2 lavados anuales con agua desmineralizada y mantener despejado el entorno de sombras por vegetación.",
      },
      {
        title: "Integridad de las Instalaciones",
        details: "No intervenir el inversor, protecciones DC/AC ni conexionado eléctrico sin la presencia o autorización escrita de personal técnico calificado.",
      },
      {
        title: "Monitoreo Proactivo de la Planta",
        details: "Mantener el inversor conectado a internet y revisar periódicamente la App FusionSolar para alertar anomalías o desconexiones.",
      },
    ],
  };
}
