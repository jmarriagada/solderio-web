export type PropertyType = "residencial" | "parcela" | "comercial" | "agricola";

export type TopologyType = "hibrida" | "ongrid" | "offgrid";

export type DistributorType = "saesa" | "crell" | "cge" | "frontel" | "edelaysen" | "otra";

export interface QuoteFormData {
  // Step 1: Property & Location
  propertyType: PropertyType;
  comuna: string;
  address?: string;

  // Step 2: Consumption & Distributor
  monthlyBillClp: number;
  distributor: DistributorType;
  hasPhases: "monofasico" | "trifasico" | "desconoce";

  // Step 3: Objective & System
  systemType: TopologyType;
  includeEvCharger: boolean;
  backupPriority: "cargas_criticas" | "hogar_completo" | "solo_ahorro";

  // Step 4: Bill Upload
  billFile?: {
    name: string;
    size: number;
    type: string;
    dataUrl?: string;
  } | null;

  // Step 5: Contact Info
  fullName: string;
  whatsapp: string;
  email: string;
  acceptTerms: boolean;
}

export interface MonthlyGenBreakdown {
  month: number;
  monthName: string;
  monthlyGenKwh: number;
  poaKwhM2Day: number;
  tCellCelsius?: number;
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
