export type PropertyType = "residencial" | "parcela" | "comercial" | "agricola";

export type TopologyType = "hibrida" | "ongrid" | "offgrid";

export type DistributorType = "saesa" | "crell" | "cge" | "frontel" | "edelaysen" | "otra";

export type OMPackageType = "basic" | "essential" | "total_guard";

export type ConsumptionInputMode = "monthly_bill_clp" | "annual_kwh" | "monthly_kwh";

export interface QuoteFormData {
  // Step 1: Property & Location
  propertyType: PropertyType;
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
  systemType: TopologyType;
  includeEvCharger: boolean;
  backupPriority: "cargas_criticas" | "hogar_completo" | "solo_ahorro";
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
