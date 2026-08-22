import { QuoteFormData, SolarSizingResult } from "@/types/cotizacion";

const TARIFF_CLP_PER_KWH = 165; // Average tariff in Los Lagos / Los Ríos / Araucanía
const ANNUAL_SPECIFIC_YIELD_KWH_PER_KWP = 1180; // Solar irradiance yield in Southern Chile (kWh/kWp/year)
const PANEL_POWER_WATTS = 580; // SoldeRío Tier 1 N-Type TOPCon module

export function calculateSolarSizing(data: Partial<QuoteFormData>): SolarSizingResult {
  const monthlyBill = data.monthlyBillClp || 120000;
  const systemType = data.systemType || "hibrida";
  const propertyType = data.propertyType || "residencial";

  // 1. Calculate monthly and annual kWh demand
  const estimatedMonthlyKwh = Math.round(monthlyBill / TARIFF_CLP_PER_KWH);
  const estimatedAnnualKwh = estimatedMonthlyKwh * 12;

  // 2. Sizing ratio based on property and topology
  let coverageRatio = 0.85; // Target 85% solar coverage
  if (systemType === "offgrid") coverageRatio = 1.15; // Over-dimension for winter autonomy
  if (propertyType === "comercial" || propertyType === "agricola") coverageRatio = 0.90;

  const targetAnnualGenKwh = estimatedAnnualKwh * coverageRatio;

  // 3. Recommended kWp
  const rawKwp = targetAnnualGenKwh / ANNUAL_SPECIFIC_YIELD_KWH_PER_KWP;
  const recommendedKwp = Math.max(3.0, Math.round(rawKwp * 10) / 10);

  // 4. Panels count (580W modules)
  const panelsCount = Math.max(6, Math.ceil((recommendedKwp * 1000) / PANEL_POWER_WATTS));
  const finalKwp = Math.round(((panelsCount * PANEL_POWER_WATTS) / 1000) * 10) / 10;

  // 5. Inverter capacity (kW)
  let inverterKw = 5;
  if (finalKwp <= 4.0) inverterKw = 3.6;
  else if (finalKwp <= 6.5) inverterKw = 5.0;
  else if (finalKwp <= 9.0) inverterKw = 8.0;
  else if (finalKwp <= 12.0) inverterKw = 10.0;
  else if (finalKwp <= 17.0) inverterKw = 15.0;
  else inverterKw = Math.ceil(finalKwp);

  // 6. Battery capacity LiFePO4 (kWh)
  let batteryKwh = 0;
  if (systemType === "hibrida") {
    if (finalKwp <= 5.0) batteryKwh = 5.0;
    else if (finalKwp <= 9.0) batteryKwh = 10.0;
    else batteryKwh = 15.0;
  } else if (systemType === "offgrid") {
    if (finalKwp <= 5.0) batteryKwh = 15.0;
    else if (finalKwp <= 9.0) batteryKwh = 20.0;
    else batteryKwh = 30.0;
  }

  // 7. Generation & Financial Metrics
  const estimatedAnnualGenKwh = Math.round(finalKwp * ANNUAL_SPECIFIC_YIELD_KWH_PER_KWP);
  const estimatedMonthlyGenKwh = Math.round(estimatedAnnualGenKwh / 12);

  // Annual savings calculation
  const savingsRatio = systemType === "offgrid" ? 1.0 : 0.88;
  const estimatedAnnualSavingsClp = Math.round(monthlyBill * 12 * savingsRatio);
  
  // 25 Year savings with conservative 3.5% annual energy inflation
  let cumulative25YearSavings = 0;
  let currentYearSavings = estimatedAnnualSavingsClp;
  for (let i = 0; i < 25; i++) {
    cumulative25YearSavings += currentYearSavings;
    currentYearSavings *= 1.035;
  }
  const estimated25YearSavingsClp = Math.round(cumulative25YearSavings);

  // Payback estimation (4.2 to 6.2 years depending on topology)
  let paybackYears = 4.8;
  if (systemType === "ongrid") paybackYears = 4.2;
  else if (systemType === "hibrida") paybackYears = 5.4;
  else if (systemType === "offgrid") paybackYears = 6.2;

  // Environmental impact (0.385 kg CO2 per kWh in Chilean SEN)
  const co2TonsAvoidedPerYear = Math.round(((estimatedAnnualGenKwh * 0.385) / 1000) * 10) / 10;
  const equivalentTreesPlanted = Math.round(co2TonsAvoidedPerYear * 16);

  const autoconsumoPct = systemType === "hibrida" ? 92 : systemType === "offgrid" ? 100 : 75;

  const secNorms = [
    "Pliego Técnico RIC N°09 (Instalaciones Fotovoltaicas)",
    "Pliego Técnico RIC N°15 (Protección Anti-Isla & Interconexión)",
    "Ley N° 21.118 (Generación Distribuida Net Billing)",
    systemType !== "ongrid" ? "RIC N°09 Sección BESS (Almacenamiento LiFePO4)" : "Certificado TE-4 SEC",
  ];

  return {
    recommendedKwp: finalKwp,
    panelsCount,
    panelWatts: PANEL_POWER_WATTS,
    inverterKw,
    batteryKwh,
    estimatedMonthlyGenKwh,
    estimatedAnnualGenKwh,
    estimatedAnnualSavingsClp,
    estimated25YearSavingsClp,
    paybackYears,
    co2TonsAvoidedPerYear,
    equivalentTreesPlanted,
    autoconsumoPct,
    secNorms,
  };
}
