"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Trees, 
  Building2, 
  Tractor, 
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
  Hash
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

export function SmartQuoteWizard() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>(DEFAULT_REGION);
  const [submissionResult, setSubmissionResult] = useState<{
    sizing: SolarSizingResult;
    leadId: string;
  } | null>(null);

  const [formData, setFormData] = useState<QuoteFormData>({
    propertyType: "residencial",
    region: DEFAULT_REGION,
    comuna: "Puerto Varas",
    address: "",
    consumptionMode: "monthly_bill_clp",
    monthlyBillClp: 120000,
    annualKwh: 6000,
    monthlyKwhBreakdown: DEFAULT_MONTHLY_KWH,
    distributor: "saesa",
    hasPhases: "monofasico",
    systemType: "hibrida",
    includeEvCharger: false,
    backupPriority: "cargas_criticas",
    omPackage: "basic",
    billFile: null,
    fullName: "",
    whatsapp: "",
    email: "",
    acceptTerms: true,
  });

  const propertyTypes: { id: PropertyType; title: string; desc: string; icon: any }[] = [
    { id: "residencial", title: "Casa Urbana", desc: "Residencia en ciudad o condominio", icon: Home },
    { id: "parcela", title: "Parcela de Agrado", desc: "Casa de campo o zona periurbana", icon: Trees },
    { id: "comercial", title: "Comercial / Pyme", desc: "Local, taller, hotel o bodega", icon: Building2 },
    { id: "agricola", title: "Agrícola / Fundo", desc: "Lechería, packing o riego", icon: Tractor },
  ];

  const systems: { id: TopologyType; title: string; tag: string; desc: string }[] = [
    {
      id: "hibrida",
      title: "Planta Solar Híbrida",
      tag: "Recomendada",
      desc: "Genera, autoconsume, respalda ante cortes (<10ms) y vende excedentes (Ley 21.118).",
    },
    {
      id: "ongrid",
      title: "Planta Solar On-Grid",
      tag: "Económica",
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
    if (!formData.fullName || !formData.whatsapp || !formData.email) {
      alert("Por favor completa tu nombre, WhatsApp y correo para generar tu pre-informe.");
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
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-6 text-white box-border">
      
      {/* Progress Header Bar */}
      <div className="mb-8 bg-[#1A1A1A] p-4 rounded-2xl border border-white/10 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] font-semibold">
            Paso {currentStep} de 5
          </span>
          <span className="text-xs text-white/50 hidden sm:inline font-light">
            {currentStep === 1 && "• Tipo de Inmueble & Comuna"}
            {currentStep === 2 && "• Gasto Mensual & Distribuidora"}
            {currentStep === 3 && "• Objetivo & Topología Solar"}
            {currentStep === 4 && "• Boleta Eléctrica"}
            {currentStep === 5 && "• Datos de Contacto"}
          </span>
        </div>

        {/* 5-Step Indicators */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
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
                <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] block mb-2">
                  01. Tipo de Propiedad
                </span>
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
                <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] block mb-2">
                  02. Consumo & Tarifa Eléctrica
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-white mb-2">
                  ¿Cómo prefieres ingresar tu consumo eléctrico?
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
                  <span>Mes a Mes (12 Meses)</span>
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

              {/* Instant Sizing Badge */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-black/60 via-[#1F1F1F]/60 to-black/60 border border-white/10 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs font-mono text-white/80">
                <span>⚡ Demanda: <strong className="text-white">{instantSizing.averageMonthlyDemandKwh} kWh/mes</strong></span>
                <span>☀️ Potencia: <strong className="text-white">{instantSizing.recommendedKwp} kWp</strong></span>
                <span>🔋 Batería: <strong className="text-emerald-400">{instantSizing.batteryKwh > 0 ? `${instantSizing.batteryKwh} kWh` : "BESS-Ready"}</strong></span>
                <span>🌱 Ahorro: <strong className="text-[#FF8300]">{formatCurrency(instantSizing.estimatedAnnualSavingsClp)}/año</strong></span>
              </div>

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
                  <span>Siguiente: Topología Solar</span>
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
                <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] block mb-2">
                  03. Configuración del Sistema
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-white mb-2">
                  ¿Qué objetivo priorizas en tu proyecto?
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

              {/* O&M Package & Warranty Selector */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block">
                      Protección y Cobertura
                    </span>
                    <h3 className="text-sm sm:text-base font-medium text-white">
                      ¿Qué nivel de garantía y mantenimiento deseas incluir?
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                    Básica siempre incluida
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Basic Option */}
                  <div
                    onClick={() => setFormData({ ...formData, omPackage: "basic" })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      (formData.omPackage || "basic") === "basic"
                        ? "bg-white/10 border-white text-white shadow-lg"
                        : "bg-black/20 border-white/10 text-white/70 hover:bg-black/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                          Incluida $0
                        </span>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">Garantía Estándar</h4>
                      <p className="text-[11px] text-white/60 font-light leading-snug">
                        25 años paneles, 10-15 años Huawei y 1 año mano de obra.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10 text-[10px] font-mono text-white/50">
                      Costo: <strong className="text-white">$0 / mes</strong>
                    </div>
                  </div>

                  {/* Essential Care Option */}
                  <div
                    onClick={() => setFormData({ ...formData, omPackage: "essential" })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      formData.omPackage === "essential"
                        ? "bg-white/10 border-[#FF8300] text-white shadow-lg"
                        : "bg-black/20 border-white/10 text-white/70 hover:bg-black/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FF8300]/20 text-[#FF8300] font-bold">
                          Essential Care
                        </span>
                        <Sparkles className="w-4 h-4 text-[#FF8300]" />
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">Telemetría + 1 Lavado/Año</h4>
                      <p className="text-[11px] text-white/60 font-light leading-snug">
                        Monitoreo activo 24/7 con IA + 1 mantenimiento anual preventivo.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10 text-[10px] font-mono text-[#FF8300]">
                      Suscripción: <strong>$18.000 / mes</strong>
                    </div>
                  </div>

                  {/* Total Guard Option */}
                  <div
                    onClick={() => setFormData({ ...formData, omPackage: "total_guard" })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      formData.omPackage === "total_guard"
                        ? "bg-white/10 border-emerald-400 text-white shadow-lg"
                        : "bg-black/20 border-white/10 text-white/70 hover:bg-black/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                          Total Guard
                        </span>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">Seguro SoldeRío 100%</h4>
                      <p className="text-[11px] text-white/60 font-light leading-snug">
                        2 visitas/año + Mano de obra correctiva 100% + Inversor Swap &lt;48h.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10 text-[10px] font-mono text-emerald-400">
                      Suscripción: <strong>$25.000 / mes</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
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
                  onClick={() => setCurrentStep(4)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#FF8300] text-white font-light text-xs md:text-sm uppercase tracking-wider hover:bg-[#e07400] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Siguiente: Boleta Eléctrica</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: BILL UPLOAD */}
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
                <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] block mb-2">
                  04. Boleta Eléctrica (Opcional)
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-white mb-2">
                  Sube tu boleta para un dimensionamiento exacto
                </h2>
                <p className="text-white/60 text-xs md:text-sm font-light">
                  Nuestros ingenieros analizan tu número de cliente, tarifa y curva horaria para calcular tu retorno con 100% de precisión.
                </p>
              </div>

              {/* Upload Box */}
              <label className="border-2 border-dashed border-white/20 hover:border-[#FF8300] rounded-[24px] p-6 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 bg-black/20 group text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FF8300]/15 text-[#FF8300] flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-sm sm:text-base font-normal text-white mb-1">
                  {formData.billFile ? formData.billFile.name : "Haz clic para subir tu boleta o arrástrala aquí"}
                </h3>
                <p className="text-xs text-white/50 font-light max-w-sm mb-4">
                  {formData.billFile
                    ? `Archivo cargado exitosamente (${(formData.billFile.size / 1024).toFixed(0)} KB)`
                    : "Aceptamos archivos PDF o fotografías JPG/PNG de tu boleta Saesa, Crell o CGE."}
                </p>
                <span className="px-5 py-2 rounded-full bg-white/10 text-xs font-mono text-white/80 group-hover:bg-[#FF8300] group-hover:text-white transition-colors">
                  {formData.billFile ? "Cambiar Archivo" : "Seleccionar Archivo"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Privacy Notice */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 text-xs text-white/60 font-light">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Tus datos de boleta están protegidos bajo estricta confidencialidad (Ley 19.628).</span>
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
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#FF8300] text-white font-light text-xs md:text-sm uppercase tracking-wider hover:bg-[#e07400] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>{formData.billFile ? "Continuar con Boleta" : "Omitir y Continuar"}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: CONTACT INFO & SUBMISSION */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="space-y-6 sm:space-y-8"
            >
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] block mb-2">
                  05. Generación del Pre-Informe
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-white mb-2">
                  ¿A dónde enviamos tu propuesta solar?
                </h2>
                <p className="text-white/60 text-xs md:text-sm font-light">
                  Ingresa tus datos para desplegar inmediatamente tu pre-informe técnico y recibirlo por WhatsApp.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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

                  <div>
                    <label className="text-xs text-white/70 font-light block mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nombre@ejemplo.cl"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-white/30 text-xs sm:text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300]"
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
                    onClick={() => setCurrentStep(4)}
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
