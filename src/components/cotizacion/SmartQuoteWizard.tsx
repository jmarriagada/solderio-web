"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Trees, 
  Building2, 
  Factory, 
  MapPin, 
  Zap, 
  Battery, 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Loader2,
  FileText,
  Sparkles,
  Info,
  Wallet,
  Calendar,
  BarChart3,
  RotateCcw,
  Sliders,
  Hash,
  Check,
  BatteryCharging
} from "lucide-react";
import { QuoteFormData, SolarSizingResult, PropertyType, TopologyType, DistributorType, ConsumptionInputMode } from "@/types/cotizacion";
import { calculateSolarSizing } from "@/lib/solar-calculator";
import { SOUTHERN_REGIONS_AND_COMUNAS } from "@/lib/solar/meteorology-tmy";
import { QuoteReportView } from "./QuoteReportView";

const DEFAULT_REGION = "Región de Los Lagos";

const DEFAULT_MONTHLY_KWH = [420, 400, 450, 550, 680, 780, 810, 720, 590, 500, 460, 430];

const MONTH_LABELS = [
  { short: "Ene", full: "Enero" },
  { short: "Feb", full: "Febrero" },
  { short: "Mar", full: "Marzo" },
  { short: "Abr", full: "Abril" },
  { short: "May", full: "Mayo" },
  { short: "Jun", full: "Junio" },
  { short: "Jul", full: "Julio" },
  { short: "Ago", full: "Agosto" },
  { short: "Sep", full: "Septiembre" },
  { short: "Oct", full: "Octubre" },
  { short: "Nov", full: "Noviembre" },
  { short: "Dic", full: "Diciembre" },
];

interface ParsedQuoteParams {
  propertyType?: PropertyType;
  systemType?: TopologyType;
  includeEvCharger?: boolean;
  comuna?: string;
  region?: string;
  step?: number;
}

function parseQuoteUrlParams(params: URLSearchParams | null): ParsedQuoteParams {
  if (!params) return {};

  const propRaw = (
    params.get("propiedad") ||
    params.get("propertyType") ||
    params.get("tipo") ||
    ""
  )
    .toLowerCase()
    .trim();

  let propertyType: PropertyType | undefined;
  if (
    propRaw.includes("parcela") ||
    propRaw.includes("rural") ||
    propRaw.includes("campo")
  ) {
    propertyType = "parcela";
  } else if (
    propRaw.includes("comercial") ||
    propRaw.includes("pyme") ||
    propRaw.includes("empresa") ||
    propRaw.includes("bodega") ||
    propRaw.includes("hotel")
  ) {
    propertyType = "comercial";
  } else if (
    propRaw.includes("agricola") ||
    propRaw.includes("agrícola") ||
    propRaw.includes("fundo") ||
    propRaw.includes("riego") ||
    propRaw.includes("lecheria")
  ) {
    propertyType = "agricola";
  } else if (
    propRaw.includes("residencial") ||
    propRaw.includes("urbana") ||
    propRaw.includes("casa") ||
    propRaw.includes("hogar") ||
    propRaw.includes("ciudad")
  ) {
    propertyType = "residencial";
  }

  const sysRaw = (
    params.get("sistema") ||
    params.get("systemType") ||
    ""
  )
    .toLowerCase()
    .trim();

  let systemType: TopologyType | undefined;
  if (
    sysRaw.includes("offgrid") ||
    sysRaw.includes("off-grid") ||
    sysRaw.includes("aislada") ||
    sysRaw.includes("autonoma") ||
    sysRaw.includes("autónoma")
  ) {
    systemType = "offgrid";
  } else if (
    sysRaw.includes("ongrid") ||
    sysRaw.includes("on-grid") ||
    sysRaw.includes("red") ||
    sysRaw.includes("conectada")
  ) {
    systemType = "ongrid";
  } else if (
    sysRaw.includes("hibrida") ||
    sysRaw.includes("híbrida") ||
    sysRaw.includes("bateria") ||
    sysRaw.includes("batería") ||
    sysRaw.includes("respaldo")
  ) {
    systemType = "hibrida";
  }

  const evRaw = params.get("ev") || params.get("cargador");
  const includeEvCharger =
    evRaw === "true" || evRaw === "1" || evRaw === "si" ? true : undefined;

  const comuna = params.get("comuna") || undefined;
  const region = params.get("region") || undefined;

  const stepRaw = params.get("paso") || params.get("step");
  const step =
    stepRaw && !isNaN(Number(stepRaw))
      ? Math.min(4, Math.max(1, Number(stepRaw)))
      : undefined;

  return { propertyType, systemType, includeEvCharger, comuna, region, step };
}

export function SmartQuoteWizard() {
  const searchParams = useSearchParams();
  const initialParams = parseQuoteUrlParams(searchParams);

  const [currentStep, setCurrentStep] = useState<number>(initialParams.step || 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>(initialParams.region || DEFAULT_REGION);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [emailMismatch, setEmailMismatch] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    sizing: SolarSizingResult;
    leadId: string;
  } | null>(null);

  const [formData, setFormData] = useState<QuoteFormData>({
    propertyType: initialParams.propertyType || "residencial",
    region: initialParams.region || DEFAULT_REGION,
    comuna: initialParams.comuna || "Puerto Varas",
    address: "",
    consumptionMode: "monthly_bill_clp",
    monthlyBillClp: 120000,
    annualKwh: 6000,
    monthlyKwhBreakdown: DEFAULT_MONTHLY_KWH,
    distributor: "saesa",
    hasPhases: "monofasico",
    systemType: initialParams.systemType,
    batteryObjectives: [],
    roofType: undefined,
    roofMaterial: "",
    includeEvCharger: initialParams.includeEvCharger ?? false,
    backupPriority: "cargas_criticas",
    omPackage: "basic",
    billFile: null,
    fullName: "",
    whatsapp: "",
    email: "",
    acceptTerms: true,
  });

  // Re-sync if URL search params change dynamically
  useEffect(() => {
    if (!searchParams) return;
    const parsed = parseQuoteUrlParams(searchParams);

    setFormData((prev) => {
      const updated = { ...prev };
      let changed = false;
      if (parsed.propertyType && parsed.propertyType !== prev.propertyType) {
        updated.propertyType = parsed.propertyType;
        changed = true;
      }
      if (parsed.systemType && parsed.systemType !== prev.systemType) {
        updated.systemType = parsed.systemType;
        changed = true;
      }
      if (parsed.includeEvCharger !== undefined && parsed.includeEvCharger !== prev.includeEvCharger) {
        updated.includeEvCharger = parsed.includeEvCharger;
        changed = true;
      }
      if (parsed.comuna && parsed.comuna !== prev.comuna) {
        updated.comuna = parsed.comuna;
        changed = true;
      }
      if (parsed.region && parsed.region !== prev.region) {
        updated.region = parsed.region;
        changed = true;
      }
      return changed ? updated : prev;
    });

    if (parsed.region) {
      setSelectedRegion(parsed.region);
    }
    if (parsed.step) {
      setCurrentStep(parsed.step);
    }
  }, [searchParams]);

  const propertyTypes: { id: PropertyType; title: string; desc: string; icon: any }[] = [
    { id: "residencial", title: "Casa Urbana", desc: "Residencia en ciudad o condominio", icon: Home },
    { id: "parcela", title: "Parcela de Agrado", desc: "Casa de campo o zona periurbana", icon: Trees },
    { id: "comercial", title: "Comercial / Pyme", desc: "Local, taller, hotel o bodega", icon: Building2 },
    { id: "agricola", title: "Industria", desc: "Agrícola, Lechería, Packing, Riego, Acuícola", icon: Factory },
  ];

  const systems: { id: TopologyType; title: string; tag: string; desc: string }[] = [
    {
      id: "hibrida",
      title: "Planta Solar Híbrida",
      tag: "Con respaldo",
      desc: "Genera, autoconsume, respalda ante cortes (<10ms) y vende excedentes (Ley 21.118).",
    },
    {
      id: "ongrid",
      title: "Planta Solar On-Grid",
      tag: "Ahorro + Retorno Acelerado",
      desc: "Autoconsumo directo y venta de excedentes a la distribuidora. Sin baterías.",
    },
    {
      id: "offgrid",
      title: "Planta Solar Off-Grid",
      tag: "100% Autónoma",
      desc: "Autonomía total para parcelas sin conexión a la red eléctrica de distribución.",
    },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Sizing preview in real-time for Step 2 and 3
  const instantSizing = calculateSolarSizing(formData);

  const handleModeChange = (mode: ConsumptionInputMode) => {
    setFormData((prev) => ({
      ...prev,
      consumptionMode: mode,
    }));
  };

  const handleMonthlyBillChange = (val: number) => {
    setFormData((prev) => ({
      ...prev,
      monthlyBillClp: val,
    }));
  };

  const handleAnnualKwhChange = (val: number) => {
    const annual = Math.max(100, val);
    const avg = annual / 12;
    const weights = [0.82, 0.80, 0.88, 1.05, 1.25, 1.40, 1.45, 1.32, 1.10, 0.95, 0.88, 0.84];
    const sumW = weights.reduce((a, b) => a + b, 0);
    const distributed = weights.map((w) => Math.round(avg * (w / (sumW / 12))));
    setFormData((prev) => ({
      ...prev,
      annualKwh: annual,
      monthlyKwhBreakdown: distributed,
    }));
  };

  const handleMonthKwhChange = (idx: number, val: number) => {
    const current = formData.monthlyKwhBreakdown ? [...formData.monthlyKwhBreakdown] : [...DEFAULT_MONTHLY_KWH];
    current[idx] = Math.max(0, val);
    const total = current.reduce((a, b) => a + b, 0);
    setFormData((prev) => ({
      ...prev,
      monthlyKwhBreakdown: current,
      annualKwh: total,
    }));
  };

  const applySeasonalProfileToMonthly = () => {
    const total = (formData.monthlyKwhBreakdown || DEFAULT_MONTHLY_KWH).reduce((a, b) => a + b, 0);
    const avg = total / 12;
    const weights = [0.82, 0.80, 0.88, 1.05, 1.25, 1.40, 1.45, 1.32, 1.10, 0.95, 0.88, 0.84];
    const sumW = weights.reduce((a, b) => a + b, 0);
    const distributed = weights.map((w) => Math.round(avg * (w / (sumW / 12))));
    setFormData((prev) => ({
      ...prev,
      monthlyKwhBreakdown: distributed,
      annualKwh: total,
    }));
  };

  const applyFlatAverageToMonthly = (flatVal: number = 500) => {
    const flatArray = Array(12).fill(flatVal);
    setFormData((prev) => ({
      ...prev,
      monthlyKwhBreakdown: flatArray,
      annualKwh: flatVal * 12,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        billFile: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.whatsapp || !formData.email || !confirmEmail) {
      alert("Por favor completa tu nombre, WhatsApp, correo y confirmación de correo para generar tu pre-informe.");
      return;
    }

    if (formData.email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      setEmailMismatch(true);
      alert("Los correos electrónicos ingresados no coinciden. Por favor verifícalos.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/cotizacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissionResult({
          sizing: data.sizingResult,
          leadId: data.leadId,
        });
      } else {
        // Fallback local sizing if API fails
        setSubmissionResult({
          sizing: instantSizing,
          leadId: `SOL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        });
      }
    } catch (err) {
      // Offline fallback
      setSubmissionResult({
        sizing: instantSizing,
        leadId: `SOL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionResult) {
    return (
      <QuoteReportView
        formData={formData}
        sizing={submissionResult.sizing}
        leadId={submissionResult.leadId}
        onReset={() => {
          setSubmissionResult(null);
          setCurrentStep(1);
        }}
        onBack={() => {
          setSubmissionResult(null);
          setCurrentStep(4);
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-6 text-white box-border">
      
      {/* Top Header for Wizard Steps */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white mb-3">
          Cotizador SoldeRío
        </h1>
        <p className="text-white/65 text-xs sm:text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed">
          Simula tu proyecto solar con los datos de radiación real de tu comuna y obtén una pre-evaluación instantánea.
        </p>
      </div>

      {/* Progress Header Bar */}
      <div className="mb-8 bg-[#1A1A1A] p-4 rounded-2xl border border-white/10 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] font-semibold">
            Paso {currentStep} de 4
          </span>
          <span className="text-xs text-white/50 hidden sm:inline font-light">
            {currentStep === 1 && "• Tipo de Inmueble & Comuna"}
            {currentStep === 2 && "• Gasto Mensual & Distribuidora"}
            {currentStep === 3 && "• Objetivos de tu Proyecto Solar"}
            {currentStep === 4 && "• Datos de Contacto"}
          </span>
        </div>

        {/* 4-Step Indicators */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === currentStep
                  ? "w-8 bg-[#FF8300]"
                  : s < currentStep
                  ? "w-3 bg-emerald-400"
                  : "w-3 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Form Container */}
      <div className="p-5 sm:p-8 md:p-12 rounded-[24px] sm:rounded-[28px] bg-[#1F1F1F]/95 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          {/* STEP 1: PROPERTY TYPE & COMUNA */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="space-y-6 sm:space-y-8"
            >
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-white mb-2">
                  ¿Dónde instalaremos la planta solar?
                </h2>
                <p className="text-white/60 text-xs md:text-sm font-light">
                  Selecciona el tipo de inmueble para adaptar el cálculo de cubiertas y fijaciones mecánicas.
                </p>
              </div>

              {/* Property Types Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {propertyTypes.map((prop) => {
                  const Icon = prop.icon;
                  const isSelected = formData.propertyType === prop.id;
                  return (
                    <button
                      key={prop.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, propertyType: prop.id })}
                      className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex items-start gap-3.5 sm:gap-4 ${
                        isSelected
                          ? "bg-white text-black border-white shadow-xl scale-[1.02]"
                          : "bg-black/30 border-white/10 text-white hover:bg-black/50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isSelected ? "bg-[#FF8300] text-white" : "bg-white/10 text-[#FF8300]"
                        }`}
                      >
                        <Icon className="w-5 h-5 stroke-[1.5]" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium leading-snug">{prop.title}</h3>
                        <p className={`text-xs font-light mt-1 ${isSelected ? "text-black/70" : "text-white/50"}`}>
                          {prop.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Region and Comuna Selectors (Cascading Dropdowns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Region Selector */}
                <div>
                  <label className="text-xs text-white/70 font-light block mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF8300]" />
                    <span>Región en la Macrozona Sur *</span>
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => {
                      const newRegion = e.target.value;
                      setSelectedRegion(newRegion);
                      const comunasInRegion = SOUTHERN_REGIONS_AND_COMUNAS[newRegion] || [];
                      const defaultComuna = comunasInRegion[0] || "Puerto Varas";
                      setFormData({
                        ...formData,
                        region: newRegion,
                        comuna: defaultComuna,
                      });
                    }}
                    className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300] cursor-pointer"
                  >
                    {Object.keys(SOUTHERN_REGIONS_AND_COMUNAS).map((regionName) => (
                      <option key={regionName} value={regionName} className="bg-[#1F1F1F] text-white">
                        {regionName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Comuna Selector (Filtered by Region) */}
                <div>
                  <label className="text-xs text-white/70 font-light block mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Comuna de Instalación *</span>
                  </label>
                  <select
                    value={formData.comuna}
                    onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300] cursor-pointer"
                  >
                    {(SOUTHERN_REGIONS_AND_COMUNAS[selectedRegion] || []).map((c) => (
                      <option key={c} value={c} className="bg-[#1F1F1F] text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Forward Action */}
              <div className="pt-6 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3.5 rounded-full bg-[#FF8300] text-white font-light text-xs md:text-sm uppercase tracking-wider hover:bg-[#e07400] transition-all shadow-lg flex items-center gap-2 cursor-pointer group"
                >
                  <span>Siguiente: Consumo Eléctrico</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: MONTHLY BILL & CONSUMPTION MODES & DISTRIBUTOR */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="space-y-6 sm:space-y-8"
            >
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-white mb-2">
                  Ingresa tu consumo eléctrico
                </h2>
                <p className="text-white/60 text-xs md:text-sm font-light">
                  Selecciona la opción que te sea más cómoda: boleta mensual en pesos, consumo anual total en kWh o desglose mes a mes.
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-2xl bg-black/50 border border-white/10">
                <button
                  type="button"
                  onClick={() => handleModeChange("monthly_bill_clp")}
                  className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-light flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    (formData.consumptionMode || "monthly_bill_clp") === "monthly_bill_clp"
                      ? "bg-[#FF8300] text-white shadow-lg font-normal"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span>Boleta Mensual ($ CLP)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange("annual_kwh")}
                  className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-light flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    formData.consumptionMode === "annual_kwh"
                      ? "bg-[#FF8300] text-white shadow-lg font-normal"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Total Anual (kWh)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange("monthly_kwh")}
                  className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-light flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    formData.consumptionMode === "monthly_kwh"
                      ? "bg-[#FF8300] text-white shadow-lg font-normal"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Mes a Mes (el más exacto)</span>
                </button>
              </div>

              {/* MODE 1: MONTHLY BILL IN CLP */}
              {(formData.consumptionMode || "monthly_bill_clp") === "monthly_bill_clp" && (
                <div className="p-5 sm:p-8 rounded-2xl bg-black/40 border border-white/10 text-center space-y-5 sm:space-y-6">
                  <div className="text-xs font-mono uppercase tracking-widest text-white/50">
                    Gasto Promedio Mensual en Boleta
                  </div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-light font-mono text-[#FF8300] tracking-tight">
                    {formatCurrency(formData.monthlyBillClp)}
                    <span className="text-xs sm:text-sm font-normal text-white/50 ml-2">/ mes</span>
                  </div>

                  <div className="px-1 py-2">
                    <input
                      type="range"
                      min="40000"
                      max="1500000"
                      step="10000"
                      value={formData.monthlyBillClp}
                      onChange={(e) => handleMonthlyBillChange(Number(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#FF8300]"
                    />
                  </div>

                  <div className="flex justify-between text-[11px] sm:text-xs font-mono text-white/40">
                    <span>$40.000</span>
                    <span>$500.000</span>
                    <span>$1.500.000+</span>
                  </div>
                </div>
              )}

              {/* MODE 2: TOTAL ANNUAL KWH */}
              {formData.consumptionMode === "annual_kwh" && (
                <div className="p-5 sm:p-8 rounded-2xl bg-black/40 border border-white/10 text-center space-y-5 sm:space-y-6">
                  <div className="text-xs font-mono uppercase tracking-widest text-white/50">
                    Consumo Total Anual en Energía
                  </div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-light font-mono text-emerald-400 tracking-tight">
                    {new Intl.NumberFormat("es-CL").format(formData.annualKwh || 6000)}
                    <span className="text-xs sm:text-sm font-normal text-white/50 ml-2">kWh / año</span>
                  </div>
                  <p className="text-xs font-mono text-white/60">
                    Equivalente a ~{Math.round((formData.annualKwh || 6000) / 12)} kWh/mes promedio (~{formatCurrency(Math.round(((formData.annualKwh || 6000) / 12) * 228 + 2150))}/mes estimado sin solar)
                  </p>

                  <div className="px-1 py-2">
                    <input
                      type="range"
                      min="1000"
                      max="40000"
                      step="250"
                      value={formData.annualKwh || 6000}
                      onChange={(e) => handleAnnualKwhChange(Number(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    />
                  </div>

                  <div className="flex justify-between text-[11px] sm:text-xs font-mono text-white/40">
                    <span>1.000 kWh</span>
                    <span>20.000 kWh</span>
                    <span>40.000+ kWh</span>
                  </div>

                  {/* Preset Chips */}
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                    {[
                      { label: "3.500 kWh (Casa Compacta)", val: 3500 },
                      { label: "6.000 kWh (Casa Estándar)", val: 6000 },
                      { label: "10.000 kWh (Casa Grande / Clima)", val: 10000 },
                      { label: "18.000 kWh (Parcela / Taller)", val: 18000 },
                      { label: "30.000 kWh (Comercial / Bombeo)", val: 30000 },
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() => handleAnnualKwhChange(preset.val)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all cursor-pointer ${
                          formData.annualKwh === preset.val
                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* MODE 3: MONTH BY MONTH KWH (12 MONTHS) */}
              {formData.consumptionMode === "monthly_kwh" && (
                <div className="p-4 sm:p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4 sm:space-y-6">
                  {/* Top Bar Summary & Helpers */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div>
                      <div className="text-xs font-mono text-white/50 uppercase tracking-wider">
                        Lectura de Consumo Mes a Mes
                      </div>
                      <div className="text-lg sm:text-xl font-light text-white flex items-center gap-3">
                        <span>Total: <strong className="text-[#FF8300] font-mono">{new Intl.NumberFormat("es-CL").format((formData.monthlyKwhBreakdown || DEFAULT_MONTHLY_KWH).reduce((a,b)=>a+b, 0))} kWh/año</strong></span>
                        <span className="text-xs text-white/50 font-mono">(Promedio: ~{Math.round(((formData.monthlyKwhBreakdown || DEFAULT_MONTHLY_KWH).reduce((a,b)=>a+b, 0))/12)} kWh/mes)</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={applySeasonalProfileToMonthly}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Ajusta los 12 meses con la curva típica de invierno del sur"
                      >
                        <RotateCcw className="w-3 h-3 text-[#FF8300]" />
                        <span>Curva Invernal Sur</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyFlatAverageToMonthly(500)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Iguala todos los meses a 500 kWh"
                      >
                        <span>500 kWh Plano</span>
                      </button>
                    </div>
                  </div>

                  {/* 12 Months Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
                    {MONTH_LABELS.map((m, idx) => {
                      const isWinterMonth = idx >= 3 && idx <= 8; // Abr a Sep
                      const currentVal = formData.monthlyKwhBreakdown ? formData.monthlyKwhBreakdown[idx] : DEFAULT_MONTHLY_KWH[idx];

                      return (
                        <div
                          key={m.short}
                          className={`p-3 rounded-xl border transition-all ${
                            isWinterMonth
                              ? "bg-cyan-950/20 border-cyan-500/20 hover:border-cyan-400/50"
                              : "bg-black/30 border-white/10 hover:border-white/25"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono text-white/60 mb-1.5">
                            <span className="font-semibold text-white/80">{m.full}</span>
                            {isWinterMonth && (
                              <span className="text-[10px] text-cyan-400 flex items-center" title="Mes dentro de Límite de Invierno">
                                ❄️
                              </span>
                            )}
                          </div>
                          <div className="relative flex items-center">
                            <input
                              type="number"
                              min="0"
                              max="15000"
                              step="10"
                              value={currentVal ?? 400}
                              onChange={(e) => handleMonthKwhChange(idx, Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300]"
                            />
                            <span className="absolute right-2 text-[10px] font-mono text-white/40 pointer-events-none">
                              kWh
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-white/40 font-light flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Los meses marcados con ❄️ corresponden al período de Límite de Invierno regulado por la SEC (Abril a Septiembre).</span>
                  </p>
                </div>
              )}


              {/* Distributor Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="text-xs text-white/70 font-light block mb-2">
                    Compañía Distribuidora Eléctrica *
                  </label>
                  <select
                    value={formData.distributor}
                    onChange={(e) => setFormData({ ...formData, distributor: e.target.value as DistributorType })}
                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300] cursor-pointer"
                  >
                    <option value="saesa">Grupo Saesa (Llanquihue, Osorno, Los Ríos, Chiloé)</option>
                    <option value="crell">Crell (Puerto Varas, Frutillar, Llanquihue Rural)</option>
                    <option value="frontel">Frontel (La Araucanía Rural / Malleco)</option>
                    <option value="cge">CGE (Temuco, Villarrica, Pucón)</option>
                    <option value="edelaysen">Edelaysen (Palena / Chaitén)</option>
                    <option value="otra">Otra Distribuidora / Cooperativa</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/70 font-light block mb-2">
                    Tipo de Empalme Eléctrico
                  </label>
                  <select
                    value={formData.hasPhases}
                    onChange={(e) => setFormData({ ...formData, hasPhases: e.target.value as any })}
                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300] cursor-pointer"
                  >
                    <option value="monofasico">Monofásico (220V - Residencial Típico)</option>
                    <option value="trifasico">Trifásico (380V - Bombas / Comercial)</option>
                    <option value="desconoce">No estoy seguro / A revisar en visita</option>
                  </select>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="pt-6 border-t border-white/10 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-light text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Atrás</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#FF8300] text-white font-light text-xs md:text-sm uppercase tracking-wider hover:bg-[#e07400] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Siguiente: Tipo de planta</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SYSTEM TOPOLOGY & OBJECTIVE */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="space-y-6 sm:space-y-8"
            >
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-white mb-2">
                  Objetivos de tu Proyecto Solar
                </h2>
                <p className="text-white/60 text-xs md:text-sm font-light">
                  Configura si requieres almacenamiento en baterías LiFePO4 para continuidad ante cortes.
                </p>
              </div>

              {/* System Selector Cards */}
              <div className="space-y-3.5 sm:space-y-4">
                {systems.map((sys) => {
                  const isSelected = formData.systemType === sys.id;
                  return (
                    <button
                      key={sys.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, systemType: sys.id })}
                      className={`w-full p-4 sm:p-6 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex items-start justify-between gap-3.5 sm:gap-4 ${
                        isSelected
                          ? "bg-white text-black border-white shadow-xl scale-[1.01]"
                          : "bg-black/30 border-white/10 text-white hover:bg-black/50"
                      }`}
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h3 className="text-base sm:text-lg font-medium leading-snug">{sys.title}</h3>
                          <span
                            className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              isSelected
                                ? "bg-[#FF8300] text-white"
                                : "bg-white/10 text-white/60"
                            }`}
                          >
                            {sys.tag}
                          </span>
                        </div>
                        <p className={`text-xs md:text-sm font-light ${isSelected ? "text-black/70" : "text-white/60"}`}>
                          {sys.desc}
                        </p>
                      </div>

                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border flex items-center justify-center flex-shrink-0 mt-1 ${
                          isSelected ? "border-[#FF8300] bg-[#FF8300] text-white" : "border-white/30"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* BATTERY OBJECTIVES (Only for Híbrida or Off-Grid) */}
              {(formData.systemType === "hibrida" || formData.systemType === "offgrid") && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm text-white font-medium flex items-center gap-2">
                      <BatteryCharging className="w-4 h-4 text-[#FF8300]" />
                      <span>Objetivo de batería</span>
                    </label>
                    <span className="text-[10px] font-mono text-white/50">Selecciona una o más</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      "Respaldo ante cortes",
                      "Consumo nocturno",
                      "Full independencia de la red",
                      "Bajar consumo en horas punta",
                    ].map((opt) => {
                      const isChecked = (formData.batteryObjectives || []).includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            const current = formData.batteryObjectives || [];
                            const next = current.includes(opt)
                              ? current.filter((item) => item !== opt)
                              : [...current, opt];
                            setFormData({ ...formData, batteryObjectives: next });
                          }}
                          className={`px-3.5 py-2.5 rounded-xl border text-left text-xs font-light transition-all flex items-center justify-between gap-2 cursor-pointer ${
                            isChecked
                              ? "bg-[#FF8300]/15 border-[#FF8300] text-white shadow-sm font-normal"
                              : "bg-black/20 border-white/10 text-white/70 hover:bg-white/5 hover:border-white/20"
                          }`}
                        >
                          <span>{opt}</span>
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                              isChecked
                                ? "bg-[#FF8300] border-[#FF8300] text-white"
                                : "border-white/30 bg-transparent"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[2.5]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* EV Charger Add-on Checkbox */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between cursor-pointer gap-3" onClick={() => setFormData({ ...formData, includeEvCharger: !formData.includeEvCharger })}>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-[#FF8300] flex-shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-white">¿Deseas incluir Cargador para Vehículo Eléctrico?</h4>
                    <p className="text-[11px] sm:text-xs text-white/50 font-light">Wallbox inteligente 7.4 kW / 22 kW con certificación SEC TE-6.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.includeEvCharger}
                  onChange={() => {}}
                  className="w-5 h-5 accent-[#FF8300] rounded cursor-pointer flex-shrink-0"
                />
              </div>

              {/* TIPO DE INSTALACIÓN & MATERIAL DE TECHO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-1">
                {/* Tipo de Instalación */}
                <div>
                  <label className="text-xs text-white/70 font-light block mb-2">
                    Tipo de instalación
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, roofType: "inclinado" })}
                      className={`p-3 sm:p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer text-center ${
                        formData.roofType === "inclinado"
                          ? "bg-white text-black border-white shadow-lg font-medium"
                          : "bg-black/30 border-white/10 text-white/80 hover:bg-black/50 hover:border-white/20"
                      }`}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 11L12 3L21 11" />
                        <path d="M5 10V20H19V10" />
                      </svg>
                      <span className="text-[11px] sm:text-xs leading-tight">Techo inclinado</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, roofType: "plano" })}
                      className={`p-3 sm:p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer text-center ${
                        formData.roofType === "plano"
                          ? "bg-white text-black border-white shadow-lg font-medium"
                          : "bg-black/30 border-white/10 text-white/80 hover:bg-black/50 hover:border-white/20"
                      }`}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 8H21" />
                        <rect x="4" y="8" width="16" height="12" rx="1" />
                      </svg>
                      <span className="text-[11px] sm:text-xs leading-tight">Techo plano</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, roofType: "suelo", roofMaterial: "En suelo" })}
                      className={`p-3 sm:p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer text-center ${
                        formData.roofType === "suelo"
                          ? "bg-white text-black border-white shadow-lg font-medium"
                          : "bg-black/30 border-white/10 text-white/80 hover:bg-black/50 hover:border-white/20"
                      }`}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 20h20" />
                        <path d="M6 20v-4" />
                        <path d="M18 20v-4" />
                        <path d="M4 16l16-4" />
                        <path d="M12 14v6" />
                      </svg>
                      <span className="text-[11px] sm:text-xs leading-tight">En Suelo</span>
                    </button>
                  </div>
                </div>

                {/* Material de Techo */}
                <div>
                  <label className="text-xs text-white/70 font-light block mb-2">
                    Material de techo
                  </label>
                  <select
                    disabled={formData.roofType === "suelo"}
                    value={formData.roofType === "suelo" ? "En suelo" : (formData.roofMaterial || "")}
                    onChange={(e) => setFormData({ ...formData, roofMaterial: e.target.value })}
                    className="w-full px-4 py-3.5 sm:py-4 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formData.roofType === "suelo" ? (
                      <option value="En suelo" className="bg-[#1F1F1F] text-white">No aplica (Estructura en suelo)</option>
                    ) : (
                      <>
                        <option value="" disabled className="text-white/40">Selecciona el material de tu techo...</option>
                        <option value="Zinc" className="bg-[#1F1F1F] text-white">Zinc</option>
                        <option value="Teja Asfáltica" className="bg-[#1F1F1F] text-white">Teja Asfáltica</option>
                        <option value="Teja Chilena" className="bg-[#1F1F1F] text-white">Teja Chilena</option>
                        <option value="Hormigón/Losa" className="bg-[#1F1F1F] text-white">Hormigón/Losa</option>
                        <option value="Madera" className="bg-[#1F1F1F] text-white">Madera</option>
                        <option value="Fibrocemento" className="bg-[#1F1F1F] text-white">Fibrocemento</option>
                        <option value="No estoy seguro" className="bg-[#1F1F1F] text-white">No estoy seguro</option>
                        <option value="Otro" className="bg-[#1F1F1F] text-white">Otro</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Navigation Actions Step 3 */}
              <div className="pt-6 border-t border-white/10 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-light text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Atrás</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!formData.systemType) {
                      alert("Por favor selecciona un tipo de planta solar antes de continuar.");
                      return;
                    }
                    setCurrentStep(4);
                  }}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#FF8300] text-white font-light text-xs md:text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 ${
                    !formData.systemType
                      ? "opacity-60 cursor-pointer"
                      : "hover:bg-[#e07400] cursor-pointer group"
                  }`}
                >
                  <span>Siguiente: Datos de Contacto</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: CONTACT INFO & SUBMISSION */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="space-y-6 sm:space-y-8"
            >
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-white mb-2">
                  ¿A dónde enviamos tu propuesta solar?
                </h2>
                <p className="text-white/60 text-xs md:text-sm font-light">
                  Ingresa tus datos para desplegar inmediatamente tu pre-informe técnico y recibirlo por WhatsApp.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="text-xs text-white/70 font-light block mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Carolina Muñoz"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-white/30 text-xs sm:text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/70 font-light block mb-2">
                      Teléfono WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+56 9 8765 4321"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-white/30 text-xs sm:text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="text-xs text-white/70 font-light block mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nombre@ejemplo.cl"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (emailMismatch) setEmailMismatch(false);
                      }}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-white/30 text-xs sm:text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-white/70 font-light block">
                        Confirmar Correo Electrónico *
                      </label>
                      {confirmEmail.length > 0 && (
                        <span
                          className={`text-[10px] font-mono ${
                            confirmEmail.trim().toLowerCase() === formData.email.trim().toLowerCase()
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }`}
                        >
                          {confirmEmail.trim().toLowerCase() === formData.email.trim().toLowerCase()
                            ? "✓ Coinciden"
                            : "No coinciden"}
                        </span>
                      )}
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="Confirma tu correo electrónico"
                      value={confirmEmail}
                      onChange={(e) => {
                        setConfirmEmail(e.target.value);
                        if (emailMismatch) setEmailMismatch(false);
                      }}
                      className={`w-full px-4 py-3 sm:py-3.5 rounded-xl bg-black/40 border text-white placeholder:text-white/30 text-xs sm:text-sm font-light focus:outline-none transition-colors ${
                        confirmEmail.length > 0 && confirmEmail.trim().toLowerCase() !== formData.email.trim().toLowerCase()
                          ? "border-rose-500/70 focus:border-rose-500"
                          : "border-white/15 focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300]"
                      }`}
                    />
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                    className="w-4 h-4 mt-0.5 accent-[#FF8300] rounded cursor-pointer flex-shrink-0"
                  />
                  <label htmlFor="terms" className="text-xs text-white/60 font-light cursor-pointer">
                    Acepto las <a href="/politicas-de-privacidad" className="text-[#FF8300] underline" target="_blank">políticas de privacidad</a> y autorizo a SoldeRío a contactarme para presentar la propuesta técnica.
                  </label>
                </div>

                {/* Navigation Actions */}
                <div className="pt-6 border-t border-white/10 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-light text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Atrás</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#FF8300] text-white font-light text-xs md:text-sm uppercase tracking-wider hover:bg-[#e07400] transition-all shadow-xl hover:shadow-[0_0_30px_rgba(255,131,0,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Calculando Pre-Informe...</span>
                      </>
                    ) : (
                      <>
                        <span>Generar Pre-Informe Solar</span>
                        <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
