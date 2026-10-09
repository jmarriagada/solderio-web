/**
 * Solderío Solar Engineering - Configuración Dinámica de Tarifas Eléctricas
 * Macrozona Sur de Chile (SAESA, CRELL, CGE, FRONTEL, EDELAYSEN)
 * 
 * Regulación y Marco Legal:
 * - Ley 21.118 de Generación Distribuida (Net Billing)
 * - Ley 21.667 de Estabilización Tarifaria (Descongelamiento y Normalización CNE 2024-2026)
 * - Decretos CNE de Fijación de Precios de Nudo Promedio y Tarifas de Suministro
 * 
 * Este módulo desacopla totalmente las variables tarifarias de mercado respecto al motor
 * físico solar. Cualquier modificación o nuevo decreto tarifario se actualiza aquí sin riesgo
 * de alterar los cálculos físicos.
 */

import { DistributorType } from "@/types/cotizacion";

export interface DistributorTariffConfig {
  key: DistributorType;
  name: string;
  coverageArea: string;
  pCompraClpPerKwh: number; // Tarifa BT1 residencial con IVA ($/kWh)
  pNudoClpPerKwh: number;   // Precio nudo inyección a la red Ley 21.118 ($/kWh)
  pInviernoClpPerKwh: number; // Tarifa con recargo de Límite de Invierno ($/kWh)
  winterLimitThresholdKwh: number; // Umbral de sobreconsumo invernal (350 o 400 kWh/mes)
  winterLimitMonths: number[]; // [4, 5, 6, 7, 8, 9] (Abril a Septiembre)
  fixedChargeMonthlyClp: number; // Cargo fijo mensual ($CLP)
  vatRate: number; // 19% IVA
  b2bEnergyBasePriceNetClp: number; // Tarifa comercial neta sin IVA ($/kWh)
  b2bDemandChargeClpPerKwMonth: number; // Cargo por potencia leída diurna ($/kW-mes)
}

export interface TariffSystemMetadata {
  version: string;
  effectiveDate: string;
  decreeReference: string;
  annualInflationIndex: number; // Proyección IPC/Indexador CNE (3.5% anual)
  art33BisTaxCreditPct: number; // 5% crédito tributario sobre activo fijo en año 1 (Art. 33 bis LIR)
  corporateDiscountRatePct: number; // 9.0% tasa descuento B2B
  residentialDiscountRatePct: number; // 7.0% tasa descuento B2C
}

export const TARIFF_SYSTEM_METADATA: TariffSystemMetadata = {
  version: "2026.2-OCT-CNE",
  effectiveDate: "2026-10-01",
  decreeReference: "Decreto CNE / Proyección Ley 21.667 Descongelamiento Macrozona Sur",
  annualInflationIndex: 0.035, // 3.5% anual
  art33BisTaxCreditPct: 0.05,  // 5%
  corporateDiscountRatePct: 0.09, // 9.0%
  residentialDiscountRatePct: 0.07, // 7.0%
};

export const DISTRIBUTOR_TARIFFS: Record<DistributorType, DistributorTariffConfig> = {
  saesa: {
    key: "saesa",
    name: "Grupo SAESA",
    coverageArea: "Osorno, Llanquihue, Chiloé, Valdivia",
    pCompraClpPerKwh: 270.0,
    pNudoClpPerKwh: 125.0,
    pInviernoClpPerKwh: 345.0,
    winterLimitThresholdKwh: 350,
    winterLimitMonths: [4, 5, 6, 7, 8, 9],
    fixedChargeMonthlyClp: 1850,
    vatRate: 0.19,
    b2bEnergyBasePriceNetClp: 226.9, // 270 / 1.19
    b2bDemandChargeClpPerKwMonth: 7500,
  },
  crell: {
    key: "crell",
    name: "Cooperativa CRELL",
    coverageArea: "Frutillar, Puerto Varas rural, Fresia, Llanquihue rural",
    pCompraClpPerKwh: 285.0,
    pNudoClpPerKwh: 132.0,
    pInviernoClpPerKwh: 360.0,
    winterLimitThresholdKwh: 350,
    winterLimitMonths: [4, 5, 6, 7, 8, 9],
    fixedChargeMonthlyClp: 2100,
    vatRate: 0.19,
    b2bEnergyBasePriceNetClp: 239.5,
    b2bDemandChargeClpPerKwMonth: 7800,
  },
  cge: {
    key: "cge",
    name: "CGE Distribución",
    coverageArea: "Temuco Urbano, Villarrica, Pucón",
    pCompraClpPerKwh: 265.0,
    pNudoClpPerKwh: 120.0,
    pInviernoClpPerKwh: 338.0,
    winterLimitThresholdKwh: 350,
    winterLimitMonths: [4, 5, 6, 7, 8, 9],
    fixedChargeMonthlyClp: 1750,
    vatRate: 0.19,
    b2bEnergyBasePriceNetClp: 222.7,
    b2bDemandChargeClpPerKwMonth: 7200,
  },
  frontel: {
    key: "frontel",
    name: "FRONTEL",
    coverageArea: "Malleco, Cautín, Araucanía Rural",
    pCompraClpPerKwh: 275.0,
    pNudoClpPerKwh: 128.0,
    pInviernoClpPerKwh: 350.0,
    winterLimitThresholdKwh: 350,
    winterLimitMonths: [4, 5, 6, 7, 8, 9],
    fixedChargeMonthlyClp: 1900,
    vatRate: 0.19,
    b2bEnergyBasePriceNetClp: 231.1,
    b2bDemandChargeClpPerKwMonth: 7600,
  },
  edelaysen: {
    key: "edelaysen",
    name: "Edelaysen",
    coverageArea: "Coyhaique, Aysén, Palena",
    pCompraClpPerKwh: 295.0,
    pNudoClpPerKwh: 140.0,
    pInviernoClpPerKwh: 375.0,
    winterLimitThresholdKwh: 400,
    winterLimitMonths: [4, 5, 6, 7, 8, 9],
    fixedChargeMonthlyClp: 2400,
    vatRate: 0.19,
    b2bEnergyBasePriceNetClp: 247.9,
    b2bDemandChargeClpPerKwMonth: 8200,
  },
  otra: {
    key: "otra",
    name: "Otra Distribuidora / Cooperativa",
    coverageArea: "Macrozona Sur General",
    pCompraClpPerKwh: 270.0,
    pNudoClpPerKwh: 125.0,
    pInviernoClpPerKwh: 345.0,
    winterLimitThresholdKwh: 350,
    winterLimitMonths: [4, 5, 6, 7, 8, 9],
    fixedChargeMonthlyClp: 1850,
    vatRate: 0.19,
    b2bEnergyBasePriceNetClp: 226.9,
    b2bDemandChargeClpPerKwMonth: 7500,
  },
  aislada: {
    key: "aislada",
    name: "Sitio Aislado (Sin Red Eléctrica)",
    coverageArea: "Zonas Rurales Macrozona Sur",
    pCompraClpPerKwh: 270.0,
    pNudoClpPerKwh: 0,
    pInviernoClpPerKwh: 270.0,
    winterLimitThresholdKwh: 9999,
    winterLimitMonths: [],
    fixedChargeMonthlyClp: 0,
    vatRate: 0.19,
    b2bEnergyBasePriceNetClp: 226.9,
    b2bDemandChargeClpPerKwMonth: 0,
  },
};

export function getDistributorTariff(distributorKey?: string): DistributorTariffConfig {
  if (!distributorKey) return DISTRIBUTOR_TARIFFS.saesa;
  const key = distributorKey.toLowerCase() as DistributorType;
  return DISTRIBUTOR_TARIFFS[key] || DISTRIBUTOR_TARIFFS.saesa;
}
