export type PropertyType = "residencial" | "parcela" | "comercial" | "agricola";

export type TopologyType = "hibrida" | "ongrid" | "offgrid" | "bess";

export type DistributorType = "saesa" | "crell" | "cge" | "frontel" | "edelaysen" | "otra" | "aislada";

export type OMPackageType = "basic" | "essential" | "total_guard";

export type ConsumptionInputMode = "monthly_bill_clp" | "annual_kwh" | "monthly_kwh";

export interface QuoteFormData {
  // Step 1: Property & Location
  propertyType: PropertyType;
  businessIndustry?: string;
  region?: string;
  comuna: string;
  address?: string;

  // Step 2: Consumption & Distributor
  consumptionMode?: ConsumptionInputMode;
  monthlyBillClp: number;
  annualKwh?: number;
  monthlyKwhBreakdown?: number[]; // Array de 12 meses (Ene a Dic) en kWh
  distributor: DistributorType;
  hasPhases: "monofasico" | "trifasico" | "desconoce";

  // Step 3: Objective & System
  systemType?: TopologyType;
  batteryObjectives?: string[];
  roofType?: "inclinado" | "plano" | "suelo";
  roofMaterial?: string;
  includeEvCharger: boolean;
  includeZeroInjection?: boolean;
  backupPriority: "cargas_criticas" | "hogar_completo" | "total_casa" | "solo_ahorro";
  omPackage?: OMPackageType;

  // Step 4: Bill Upload
  billFile?: {
    name: string;
    size: number;
    type: string;
    dataUrl?: string;
  } | null;

  // Step 5: Financing (Crédito Verde)
  rut?: string;
  financingSplit?: "100_cash" | "50_50" | "100_credit" | "custom";
  creditAmountClp?: number;
  creditInstallments?: number; // e.g., 24, 36, 48, 60
  creditInsurance?: "con_seguro" | "sin_seguro";

  // Step 6: Contact Info
  fullName: string;
  whatsapp: string;
  email: string;
  acceptTerms: boolean;
}

export interface MonthlyGenBreakdown {
  month: number;
  monthName: string;
  monthlyGenKwh: number;
  monthlyDemandKwh: number;
  poaKwhM2Day: number;
  tCellCelsius?: number;
  surplusKwh?: number;
  gridImportKwh?: number;
}

export interface OMPackageDetail {
  id: OMPackageType;
  name: string;
  badge?: string;
  monthlyPriceClp: number;
  monthlyPriceUf: number;
  tagline: string;
  features: string[];
  isDefault?: boolean;
}

export interface SolarSizingResult {
  recommendedKwp: number;
  panelsCount: number;
  panelWatts: number;
  inverterKw: number;
  batteryKwh: number;
  estimatedMonthlyGenKwh: number;
  estimatedAnnualGenKwh: number;
  estimatedAnnualSavingsClp: number;
  estimated25YearSavingsClp: number;
  paybackYears: number;
  co2TonsAvoidedPerYear: number;
  equivalentTreesPlanted: number;
  autoconsumoPct: number;
  averageMonthlyDemandKwh?: number;
  secNorms: string[];

  // Advanced High-Fidelity Physical & Financial Metrics
  usableBatteryKwh?: number;
  seasonalVariationRatio?: number;
  summerAvgMonthlyGenKwh?: number;
  winterAvgMonthlyGenKwh?: number;
  monthlyBreakdown?: MonthlyGenBreakdown[];
  vanClp?: number;
  tirPercent?: number;
  lcoeClpPerKwh?: number;
  requiresThreePhase?: boolean;
  recommendedPhaseType?: "monofasico" | "trifasico";

  // Turnkey Pricing & Cashflow Milestones (Huawei + Jinko + BOS + Flete Sur)
  estimatedSystemCostNetoClp?: number;
  estimatedSystemCostIvaClp?: number;
  downpaymentHito1Clp?: number; // 50%
  faenaHito2Clp?: number;       // 35%
  finalHito3Clp?: number;       // 15%
  margenBrutoPct?: number;

  // O&M Package Selected
  selectedOmPackage?: OMPackageDetail;

  // Friendly Lead Experience Indicators ("Con peras y manzanas")
  estimatedNewMonthlyBillClp?: number; // Lo que pagará el cliente (ej: $15.000 cargo fijo)
  winterLimitSavingsClp?: number; // Ahorro por evitar recargo de límite de invierno
  coberturaTotalAnualPct?: number; // % de cobertura solar sobre el año completo
  applianceEquivalencies?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;

  // Financiamiento Crédito Verde (BancoEstado)
  financingSimulation?: {
    valorCuota: number;
    montoLiquido: number;
    numeroCuotas: number;
    tasaInteresMensual: number;
    tasaInteresAnual: number;
    cae: number;
    montoTotalCredito: number;
    costoTotalCredito: number;
    pdfBase64?: string; // If we can fetch the PDF
  };

  // Métricas Financieras y Tributarias B2B (Corporativo / Agrícola / Pymes)
  taxShieldArt33BisClp?: number; // 4% a 6% crédito tributario sobre activo fijo (Art. 33 bis LIR)
  recoverableVatClp?: number; // 19% IVA crédito fiscal F29
  peakHourDemandSavingsClp?: number; // Ahorro proyectado por mitigación de horas punta (BT2/BT3/AT)
  annualOpexClp?: number; // O&M anual estimado (~1% CAPEX con escalamiento)
  inverterReplacementCostYear12Clp?: number; // Costo proyectado de recambio de inversor en año 12
  isB2B?: boolean;

  // Mapa Regulatorio Oficial Chileno (DFL 4/2006 LGSE)
  regulatoryTrack?: "netbilling_ley21118" | "inyeccion_cero_ric09" | "aislada_ric9.1" | "bess_almacenamiento";
  regulatoryTitle?: string; // Ej: "Ley 21.118 Netbilling (≤ 300 kW)"
  regulatoryDecree?: string; // Ej: "DS 57/2019 + DS 8/2019"
  regulatoryNorm?: string; // Ej: "Pliegos RIC + NTCO-EG + RGR 01/2024"
  regulatoryTramite?: string; // Ej: "Trámite Eléctrico TE4 vía Plataforma GDA SEC"

  // Perfil Horario de Día Típico (Para gráfico "Saber más": Generación, Consumo, Autoconsumo, Inyección, Compra)
  hourlyProfileSample?: Array<{
    hour: number; // 0 a 24
    solarGenKwh: number;
    consumptionKwh: number;
    selfConsumedKwh: number;
    injectedKwh: number;
    gridImportKwh: number;
  }>;

  // Desglose Mensual Net Billing (Para gráfico "Saber más": Compra, Crédito, Saldo a favor, Paga $0)
  netBillingMonthlyLedger?: Array<{
    monthName: string;
    boughtKwh: number;
    boughtClp: number;
    injectedKwh: number;
    creditClp: number;
    initialBalanceClp: number;
    finalBalanceClp: number;
    customerPaysClp: number;
    annualSurplusPayoutClp?: number;
  }>;

  // Transparencia y Alcance ("Qué puede exigir quien contrata" vs "Compromisos del propietario")
  rightsAndCommitments?: {
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
  };
}

export interface LeadSubmission {
  id: string;
  createdAt: string;
  formData: QuoteFormData;
  sizingResult: SolarSizingResult;
  status: "NUEVO" | "PRE_DIMENSIONADO" | "VISITA_AGENDADA" | "PRESUPUESTO_ENVIADO" | "CERRADO";
  notes?: string;
  assignedEngineer?: string;
}
