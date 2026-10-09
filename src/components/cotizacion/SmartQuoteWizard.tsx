"use client";

import { useState, useEffect, useCallback } from "react";
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
  BatteryCharging,
  ChevronRight
} from "lucide-react";
import { QuoteFormData, SolarSizingResult, PropertyType, TopologyType, DistributorType, ConsumptionInputMode } from "@/types/cotizacion";
import { calculateSolarSizing } from "@/lib/solar-calculator";
import { SOUTHERN_REGIONS_AND_COMUNAS } from "@/lib/solar/meteorology-tmy";
import { QuoteReportView } from "./QuoteReportView";
import { PlantTypeModal, PlantModalType } from "./PlantTypeModal";
import { TurnstileWidget } from "@/components/security/TurnstileWidget";

const DEFAULT_REGION = "Región de Los Lagos";

const WHATSAPP_COTIZACION_URL = `https://wa.me/56966186667?text=${encodeURIComponent(
  "Necesito realizar una cotizacion solar asistida por un Ingeniero de SoldeRío."
)}`;

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.886-9.888 9.886m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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
  businessIndustry?: string;
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
    sysRaw.includes("bess") ||
    sysRaw.includes("solo-bateria") ||
    sysRaw.includes("peak-shaving")
  ) {
    systemType = "bess";
  } else if (
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

  const indRaw = params.get("industria") || params.get("rubro") || params.get("industry");
  const businessIndustry = indRaw ? decodeURIComponent(indRaw).trim() : undefined;

  const stepRaw = params.get("paso") || params.get("step");
  const step =
    stepRaw && !isNaN(Number(stepRaw))
      ? Math.min(4, Math.max(1, Number(stepRaw)))
      : undefined;

  return { propertyType, systemType, includeEvCharger, comuna, region, step, businessIndustry };
}

export function SmartQuoteWizard() {
  const searchParams = useSearchParams();
  const initialParams = parseQuoteUrlParams(searchParams);

  const [currentStep, setCurrentStep] = useState<number>(initialParams.step || 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>(initialParams.region || DEFAULT_REGION);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [emailMismatch, setEmailMismatch] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const handleTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);
  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken("");
  }, []);
  const [submissionResult, setSubmissionResult] = useState<{
    sizing: SolarSizingResult;
    leadId: string;
  } | null>(null);
  const [activePlantModal, setActivePlantModal] = useState<PlantModalType | null>(null);

  const isInitialEnterprise = initialParams.propertyType === "comercial" || initialParams.propertyType === "agricola";

  const [formData, setFormData] = useState<QuoteFormData>({
    propertyType: initialParams.propertyType || "residencial",
    businessIndustry: initialParams.businessIndustry || "",
    region: initialParams.region || DEFAULT_REGION,
    comuna: initialParams.comuna || "Puerto Varas",
    address: "",
    consumptionMode: "monthly_bill_clp",
    monthlyBillClp: isInitialEnterprise ? 500000 : 120000,
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

  const [showAdvancedMode, setShowAdvancedMode] = useState(false);
  const isEnterprise = formData.propertyType === "comercial" || formData.propertyType === "agricola";

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
      if (parsed.businessIndustry && parsed.businessIndustry !== prev.businessIndustry) {
        updated.businessIndustry = parsed.businessIndustry;
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

  const propertyCategories: { id: PropertyType; title: string; desc: string; icon: any }[] = [
    {
      id: "residencial",
      title: "Hogar o Parcela",
      desc: "Casas en ciudad, condominios, campo o parcelas de agrado",
      icon: Home,
    },
    {
      id: "comercial",
      title: "Empresa o Negocio",
      desc: "Comercio, talleres, turismo, agrícola o industrias",
      icon: Building2,
    },
  ];

  const residentialSystems: { id: TopologyType; title: string; tag: string; desc: string }[] = [
    {
      id: "hibrida",
      title: "Independencia y Respaldo (Anti-Cortes)",
      tag: "Sistema Híbrido (El Más Popular)",
      desc: "Genera tu propia energía, inyecta el sobrante a la red para ahorrar y mantén tu casa iluminada con baterías aunque haya cortes de luz.",
    },
    {
      id: "ongrid",
      title: "Máximo Ahorro Mensual en tu Boleta",
      tag: "On-Grid (Sin Baterías)",
      desc: "La opción más económica. Reduce tu cuenta de luz hasta un 95% inyectando a la red. (Se desactiva por seguridad si hay un apagón en el sector).",
    },
    {
      id: "offgrid",
      title: "Autonomía Total (Aislado de la red)",
      tag: "Off-Grid (Con Baterías)",
      desc: "Ideal para zonas rurales sin tendido eléctrico. Funciona 100% desconectado, apoyado con baterías y generador. Nunca le pagarás a la compañía.",
    },
  ];

  const enterpriseSystems: { id: TopologyType; title: string; tag: string; desc: string }[] = [
    {
      id: "ongrid",
      title: "Reducción de Costo Eléctrico Diurno",
      tag: "Solar con Máximo ROI Comercial",
      desc: "Solución On-Grid: Inyecta y autoconsume energía solar durante las horas de operación de tu empresa. Amortización acelerada y deducción de gasto tributario.",
    },
    {
      id: "hibrida",
      title: "Energía Continua & Respaldo Crítico",
      tag: "Solar + Respaldo Grado UPS",
      desc: "Solución Híbrida: Protege servidores, cámaras frigoríficas o líneas de producción frente a microcortes y apagones prolongados, reduciendo tu consumo de red.",
    },
    {
      id: "bess",
      title: "Banco de Baterías Inteligente (Sin Paneles)",
      tag: "Ahorro en Horas Punta & Tarifa BT3/AT4",
      desc: "Solución BESS (Solo Baterías): Almacena energía en horario económico de red y descárgala en Horas Punta (18:00 a 22:00 hrs) para evitar el recargo por potencia máxima contratada.",
    },
  ];

  const systems = isEnterprise ? enterpriseSystems : residentialSystems;

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
        body: JSON.stringify({
          ...formData,
          turnstileToken,
          website_url: honeypot,
        }),
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
                  ¿Para qué tipo de proyecto cotizas?
                </h2>
                <p className="text-white/60 text-xs md:text-sm font-light">
                  Selecciona la categoría para adaptar el cálculo de potencia, consumo y fijaciones mecánicas.
                </p>
              </div>

              {/* Property Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {propertyCategories.map((prop) => {
                  const Icon = prop.icon;
                  const isSelected =
                    prop.id === "residencial"
                      ? !isEnterprise
                      : isEnterprise;
                  return (
                    <button
                      key={prop.id}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          propertyType: prop.id,
                          monthlyBillClp:
                            prop.id === "comercial"
                              ? prev.monthlyBillClp < 50000
                                ? 500000
                                : prev.monthlyBillClp === 120000
                                ? 500000
                                : prev.monthlyBillClp
                              : prev.monthlyBillClp === 500000
                              ? 120000
                              : prev.monthlyBillClp,
                          systemType:
                            prop.id === "comercial" && prev.systemType === "offgrid"
                              ? "ongrid"
                              : prop.id === "residencial" && prev.systemType === "bess"
                              ? "hibrida"
                              : prev.systemType,
                        }));
                      }}
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
                  ¿Cuánto pagas de luz? (Aproximado)
                </h2>
                <p className="text-white/60 text-xs md:text-sm font-light">
                  No necesitas la boleta exacta, un aproximado es suficiente. Selecciona la opción más cómoda para tu proyecto.
                </p>
              </div>

              {/* Mode Switcher Tabs (Visible for Enterprise or when activated via subtle button) */}
              {(isEnterprise || showAdvancedMode) && (
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
              )}

              {/* MODE 1: MONTHLY BILL IN CLP */}
              {(formData.consumptionMode || "monthly_bill_clp") === "monthly_bill_clp" && (
                <div className="p-5 sm:p-8 rounded-2xl bg-black/40 border border-white/10 text-center space-y-5 sm:space-y-6">
                  <div className="text-xs font-mono uppercase tracking-widest text-white/50">
                    {isEnterprise ? "Gasto Promedio Mensual Comercial" : "Gasto Promedio Mensual en Boleta"}
                  </div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-light font-mono text-[#FF8300] tracking-tight">
                    {formatCurrency(formData.monthlyBillClp)}
                    <span className="text-xs sm:text-sm font-normal text-white/50 ml-2">/ mes</span>
                  </div>

                  <div className="px-1 py-2">
                    <input
                      type="range"
                      min={isEnterprise ? "50000" : "40000"}
                      max={isEnterprise ? "10000000" : "1500000"}
                      step={isEnterprise ? "50000" : "10000"}
                      value={formData.monthlyBillClp}
                      onChange={(e) => handleMonthlyBillChange(Number(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#FF8300]"
                    />
                  </div>

                  <div className="flex justify-between text-[11px] sm:text-xs font-mono text-white/40">
                    <span>{isEnterprise ? "$50.000" : "$40.000"}</span>
                    <span>{isEnterprise ? "$5.000.000" : "$500.000"}</span>
                    <span>{isEnterprise ? "$10.000.000+" : "$1.500.000+"}</span>
                  </div>

                  {!isEnterprise && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAdvancedMode((prev) => !prev)}
                        className="text-xs text-white/40 hover:text-white/70 transition-colors underline font-light cursor-pointer"
                      >
                        {showAdvancedMode
                          ? "Ocultar opciones avanzadas (kWh)"
                          : "¿Tienes tu boleta a mano o prefieres ingresar tus kWh exactos?"}
                      </button>
                    </div>
                  )}
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

              {/* Selector de Rubro / Tipo de Empresa (Sólo para Empresas) */}
              {isEnterprise && (
                <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                  <label className="text-xs text-white/70 font-light block flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#FF8300]" />
                    <span>Rubro o Tipo de Empresa *</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={
                        [
                          "Agroindustria / Packing / Fundo",
                          "Acuicultura / Salmonicultura / Plantas",
                          "Comercio / Retail / Supermercado",
                          "Hotelería / Cabañas / Gastronomía",
                          "Industria / Manufactura / Bodegaje",
                          "Salud / Clínicas / Residencias",
                          "Servicios / Oficinas Corporativas",
                        ].includes(formData.businessIndustry || "")
                          ? formData.businessIndustry
                          : formData.businessIndustry
                          ? "Otro"
                          : ""
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "Otro") {
                          setFormData({ ...formData, businessIndustry: "Otro Rubro" });
                        } else {
                          setFormData({ ...formData, businessIndustry: val });
                        }
                      }}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs sm:text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300] cursor-pointer"
                    >
                      <option value="" disabled className="text-white/40">Selecciona el rubro de tu empresa...</option>
                      <option value="Agroindustria / Packing / Fundo" className="bg-[#1F1F1F] text-white">Agroindustria / Packing / Fundo Lechero</option>
                      <option value="Acuicultura / Salmonicultura / Plantas" className="bg-[#1F1F1F] text-white">Acuicultura / Salmonicultura / Plantas</option>
                      <option value="Comercio / Retail / Supermercado" className="bg-[#1F1F1F] text-white">Comercio / Retail / Supermercado</option>
                      <option value="Hotelería / Cabañas / Gastronomía" className="bg-[#1F1F1F] text-white">Hotelería / Cabañas / Gastronomía</option>
                      <option value="Industria / Manufactura / Bodegaje" className="bg-[#1F1F1F] text-white">Industria / Manufactura / Bodegaje</option>
                      <option value="Salud / Clínicas / Residencias" className="bg-[#1F1F1F] text-white">Salud / Clínicas / Residencias</option>
                      <option value="Servicios / Oficinas Corporativas" className="bg-[#1F1F1F] text-white">Servicios / Oficinas Corporativas</option>
                      <option value="Otro" className="bg-[#1F1F1F] text-white">Otro Rubro Comercial / Industrial</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Especifica actividad (opcional, ej: Lechera, Frigorífico)"
                      value={
                        [
                          "Agroindustria / Packing / Fundo",
                          "Acuicultura / Salmonicultura / Plantas",
                          "Comercio / Retail / Supermercado",
                          "Hotelería / Cabañas / Gastronomía",
                          "Industria / Manufactura / Bodegaje",
                          "Salud / Clínicas / Residencias",
                          "Servicios / Oficinas Corporativas",
                        ].includes(formData.businessIndustry || "")
                          ? ""
                          : formData.businessIndustry || ""
                      }
                      onChange={(e) => setFormData({ ...formData, businessIndustry: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-white/30 text-xs sm:text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300]"
                    />
                  </div>
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
                    onChange={(e) => {
                      const dist = e.target.value as DistributorType;
                      setFormData((prev) => ({
                        ...prev,
                        distributor: dist,
                        ...(dist === "aislada" ? { systemType: "offgrid" } : prev.systemType === "offgrid" ? { systemType: "ongrid" } : {}),
                      }));
                    }}
                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300] cursor-pointer"
                  >
                    <option value="saesa">Grupo Saesa (Llanquihue, Osorno, Los Ríos, Chiloé)</option>
                    <option value="crell">Crell (Puerto Varas, Frutillar, Llanquihue Rural)</option>
                    <option value="frontel">Frontel (La Araucanía Rural / Malleco)</option>
                    <option value="cge">CGE (Temuco, Villarrica, Pucón)</option>
                    <option value="edelaysen">Edelaysen (Palena / Chaitén)</option>
                    <option value="aislada">Sitio Aislado / Sin Red Eléctrica (Off-Grid 100%)</option>
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
                  {isEnterprise ? "¿Qué solución energética necesita tu empresa?" : "¿Qué buscas lograr con la energía solar?"}
                </h2>
                <p className="text-white/60 text-xs md:text-sm font-light">
                  {isEnterprise
                    ? "Selecciona la tecnología según tus requerimientos de ahorro, operación diurna y respaldo continuo."
                    : "Selecciona la alternativa que mejor se adapte a tus necesidades. No te preocupes por el tecnicismo, un ingeniero ajustará los detalles contigo luego."}
                </p>
              </div>

              {/* System Selector Cards */}
              <div className="space-y-3.5 sm:space-y-4">
                {systems.map((sys) => {
                  const isSelected = formData.systemType === sys.id;
                  return (
                    <div
                      key={sys.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          systemType: sys.id,
                          distributor: sys.id === "offgrid" ? "aislada" : prev.distributor === "aislada" ? "saesa" : prev.distributor,
                        }));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setFormData((prev) => ({
                            ...prev,
                            systemType: sys.id,
                            distributor: sys.id === "offgrid" ? "aislada" : prev.distributor === "aislada" ? "saesa" : prev.distributor,
                          }));
                        }
                      }}
                      className={`w-full p-4 sm:p-6 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 ${
                        isSelected
                          ? "bg-white text-black border-white shadow-xl scale-[1.01]"
                          : "bg-black/30 border-white/10 text-white hover:bg-black/50"
                      }`}
                    >
                      {/* Contenido Principal: Ocupa todo el contenedor en Mobile */}
                      <div className="flex-1 w-full">
                        {/* Cabecera de la tarjeta: Título + Tag en ambos; en Mobile se incluye el radio selector en la esquina superior derecha */}
                        <div className="flex items-start justify-between gap-2.5 mb-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base sm:text-lg font-medium leading-snug">{sys.title}</h3>
                            <span
                              className={`text-[10px] sm:text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                isSelected
                                  ? "bg-[#FF8300] text-white"
                                  : "bg-white/10 text-white/60"
                              }`}
                            >
                              {sys.tag}
                            </span>
                          </div>

                          {/* Selector circular SOLO en Mobile (esquina superior derecha) */}
                          <div
                            className={`sm:hidden w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              isSelected ? "border-[#FF8300] bg-[#FF8300] text-white" : "border-white/30"
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                        </div>

                        {/* Descripción completa que aprovecha todo el ancho del contenedor */}
                        <p className={`text-xs md:text-sm font-light leading-relaxed ${isSelected ? "text-black/70" : "text-white/60"}`}>
                          {sys.desc}
                        </p>

                        {/* Botón Saber Más SOLO en Mobile (ubicado en la esquina inferior derecha) */}
                        <div className="flex sm:hidden justify-end pt-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePlantModal(sys.id as PlantModalType);
                            }}
                            className={`text-[11px] font-normal px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 shadow-xs ${
                              isSelected
                                ? "border-black/15 bg-black/[0.04] text-black/75 hover:text-black hover:border-black/30 hover:bg-black/[0.08]"
                                : "border-white/15 bg-white/[0.04] text-white/70 hover:text-[#FF8300] hover:border-[#FF8300]/40 hover:bg-white/[0.08]"
                            }`}
                            title={`Ver detalles de ${sys.title}`}
                          >
                            <span>Saber más</span>
                            <ChevronRight className="w-3 h-3 opacity-70" />
                          </button>
                        </div>
                      </div>

                      {/* Controles en Desktop: Saber Más y Selector Circular juntos a la derecha */}
                      <div className="hidden sm:flex items-center gap-2 sm:gap-3 flex-shrink-0 mt-0.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePlantModal(sys.id as PlantModalType);
                          }}
                          className={`text-[11px] sm:text-xs font-normal px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 shadow-xs ${
                            isSelected
                              ? "border-black/15 bg-black/[0.04] text-black/75 hover:text-black hover:border-black/30 hover:bg-black/[0.08]"
                              : "border-white/15 bg-white/[0.04] text-white/70 hover:text-[#FF8300] hover:border-[#FF8300]/40 hover:bg-white/[0.08]"
                          }`}
                          title={`Ver detalles de ${sys.title}`}
                        >
                          <span>Saber más</span>
                          <ChevronRight className="w-3 h-3 opacity-70" />
                        </button>

                        <div
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "border-[#FF8300] bg-[#FF8300] text-white" : "border-white/30"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PRIORIDAD DE RESPALDO (Hogar con Sistema Híbrido) */}
              {!isEnterprise && formData.systemType === "hibrida" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 sm:p-6 rounded-2xl bg-black/30 border border-white/10 space-y-3.5"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm text-white font-medium flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#FF8300]" />
                      <span>¿Qué nivel de respaldo necesitas ante cortes de luz?</span>
                    </label>
                    <span className="text-[10px] font-mono text-[#FF8300] uppercase tracking-wider">
                      Respaldo Inteligente
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          backupPriority: "cargas_criticas",
                          batteryObjectives: ["Respaldo ante cortes", "Consumo nocturno"],
                        }))
                      }
                      className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        (formData.backupPriority || "cargas_criticas") === "cargas_criticas"
                          ? "bg-white text-black border-white shadow-lg"
                          : "bg-black/40 border-white/10 text-white/80 hover:bg-black/60 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium">
                          Respaldo Esencial (Recomendado)
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                            (formData.backupPriority || "cargas_criticas") === "cargas_criticas"
                              ? "bg-[#FF8300] border-[#FF8300] text-white"
                              : "border-white/30"
                          }`}
                        >
                          {(formData.backupPriority || "cargas_criticas") === "cargas_criticas" && (
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          )}
                        </div>
                      </div>
                      <p
                        className={`text-[11px] sm:text-xs font-light leading-relaxed ${
                          (formData.backupPriority || "cargas_criticas") === "cargas_criticas"
                            ? "text-black/70"
                            : "text-white/50"
                        }`}
                      >
                        Mantiene refrigerador, iluminación LED, WiFi/Starlink, portón y enchufes clave durante todo el corte.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          backupPriority: "total_casa",
                          batteryObjectives: ["Respaldo ante cortes", "Full independencia de la red"],
                        }))
                      }
                      className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        formData.backupPriority === "total_casa"
                          ? "bg-white text-black border-white shadow-lg"
                          : "bg-black/40 border-white/10 text-white/80 hover:bg-black/60 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium">Respaldo Total</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                            formData.backupPriority === "total_casa"
                              ? "bg-[#FF8300] border-[#FF8300] text-white"
                              : "border-white/30"
                          }`}
                        >
                          {formData.backupPriority === "total_casa" && (
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          )}
                        </div>
                      </div>
                      <p
                        className={`text-[11px] sm:text-xs font-light leading-relaxed ${
                          formData.backupPriority === "total_casa"
                            ? "text-black/70"
                            : "text-white/50"
                        }`}
                      >
                        Mantiene toda la casa 100% operativa en el corte, incluyendo bombas de pozo profundo y climatización.
                      </p>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* AVISO ESPECIAL PARA BESS INDUSTRIAL (Sin Paneles en Techo) */}
              {isEnterprise && formData.systemType === "bess" && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                  <Battery className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm font-light text-white/80 leading-relaxed">
                    <strong className="text-white font-medium">Instalación en Sala Eléctrica o Bodega:</strong> El sistema BESS no requiere montaje en techos ni paneles solares. Se conecta directamente al tablero general de tu empresa (TGBT) mediante racks modulares LiFePO4 de alta densidad energética para Peak Shaving y respaldo UPS.
                  </div>
                </div>
              )}

              {/* EV Charger Add-on Checkbox (Sólo Hogar) */}
              {!isEnterprise && (
                <div
                  className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between cursor-pointer gap-3 hover:bg-black/40 transition-colors"
                  onClick={() => setFormData({ ...formData, includeEvCharger: !formData.includeEvCharger })}
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-[#FF8300] flex-shrink-0" />
                    <h4 className="text-xs sm:text-sm font-medium text-white">
                      ¿Deseas incluir Cargador para Vehículo Eléctrico?
                    </h4>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.includeEvCharger}
                    onChange={() => {}}
                    className="w-5 h-5 accent-[#FF8300] rounded cursor-pointer flex-shrink-0"
                  />
                </div>
              )}

              {/* TIPO DE INSTALACIÓN & MATERIAL DE TECHO (Solo si el sistema incluye paneles solares) */}
              {formData.systemType !== "bess" && (
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
              )}

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
                  ¿A dónde enviamos tu pre-informe?
                </h2>
                <p className="text-white/60 text-xs md:text-sm font-light">
                  Tus datos están 100% seguros y odiamos el spam tanto como tú. Solo los utilizaremos para generar tu pre-informe y enviártelo por WhatsApp o correo.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Honeypot Anti-Bot Shield (Invisible para usuarios legítimos) */}
                <div className="hidden" aria-hidden="true" style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
                  <label htmlFor="quote_website_url">No completar este campo</label>
                  <input
                    type="text"
                    id="quote_website_url"
                    name="website_url"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

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

                {/* Consent Checkbox Conforme Ley N° 19.628 */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    aria-required="true"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                    className="w-4 h-4 mt-0.5 accent-[#FF8300] rounded cursor-pointer flex-shrink-0"
                  />
                  <label htmlFor="terms" className="text-xs text-white/70 font-light cursor-pointer leading-relaxed">
                    He leído y acepto las{" "}
                    <a
                      href="/politicas-de-privacidad"
                      className="text-[#FF8300] underline hover:text-[#e07400] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      políticas de privacidad
                    </a>{" "}
                    y autorizo a SoldeRío SpA a contactarme para presentar la propuesta técnica conforme a la Ley N° 19.628. *
                  </label>
                </div>

                {/* Cloudflare Turnstile Anti-Bot Shield */}
                <TurnstileWidget
                  theme="dark"
                  onSuccess={handleTurnstileSuccess}
                  onExpire={handleTurnstileExpire}
                  className="my-3"
                />

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

        {/* Modal Explicativo de Tipos de Planta Solar */}
        <PlantTypeModal
          type={activePlantModal}
          context={isEnterprise ? "empresa" : "hogar"}
          onClose={() => setActivePlantModal(null)}
          onSelect={(selectedType) => {
            setFormData((prev) => ({ ...prev, systemType: selectedType }));
          }}
        />

      </div>

      {/* Mobile-Only CTA: Cotización Asistida vía WhatsApp (Ubicado abajo de la caja de contenido del cotizador) */}
      <div className="md:hidden mt-4 pt-1 flex flex-col items-center">
        <a
          href={WHATSAPP_COTIZACION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-6 rounded-full bg-transparent hover:bg-[#25D366]/10 text-white border border-[#25D366] text-xs sm:text-sm font-light tracking-wide transition-all shadow-[0_0_12px_rgba(37,211,102,0.12)] hover:shadow-[0_0_20px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <WhatsAppIcon className="w-4 h-4 text-[#25D366] flex-shrink-0" />
          <span className="font-light">Realizar Cotización Asistida</span>
        </a>
      </div>
    </div>
  );
}
