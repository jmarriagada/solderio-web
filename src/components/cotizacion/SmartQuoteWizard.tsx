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
  Info
} from "lucide-react";
import { QuoteFormData, SolarSizingResult, PropertyType, TopologyType, DistributorType } from "@/types/cotizacion";
import { calculateSolarSizing } from "@/lib/solar-calculator";
import { QuoteReportView } from "./QuoteReportView";

const SOUTHERN_COMUNAS = [
  "Puerto Varas",
  "Osorno",
  "Valdivia",
  "Frutillar",
  "Llanquihue",
  "Puerto Montt",
  "Panguipulli",
  "Villarrica",
  "Pucón",
  "Temuco",
  "Castro",
  "Ancud",
  "Río Bueno",
  "La Unión",
  "Coyhaique",
  "Otra Comuna",
];

export function SmartQuoteWizard() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    sizing: SolarSizingResult;
    leadId: string;
  } | null>(null);

  const [formData, setFormData] = useState<QuoteFormData>({
    propertyType: "residencial",
    comuna: "Puerto Varas",
    address: "",
    monthlyBillClp: 120000,
    distributor: "saesa",
    hasPhases: "monofasico",
    systemType: "hibrida",
    includeEvCharger: false,
    backupPriority: "cargas_criticas",
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

              {/* Comuna Selector */}
              <div>
                <label className="text-xs text-white/70 font-light block mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF8300]" />
                  <span>Comuna en la Macrozona Sur *</span>
                </label>
                <select
                  value={formData.comuna}
                  onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300]"
                >
                  {SOUTHERN_COMUNAS.map((c) => (
                    <option key={c} value={c} className="bg-[#1F1F1F] text-white">
                      {c}
                    </option>
                  ))}
                </select>
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

          {/* STEP 2: MONTHLY BILL & DISTRIBUTOR */}
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
                  02. Consumo & Tarifa
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-white mb-2">
                  ¿Cuánto pagas mensualmente en electricidad?
                </h2>
                <p className="text-white/60 text-xs md:text-sm font-light">
                  Mueve el control para ajustar tu gasto promedio mensual en tu boleta eléctrica.
                </p>
              </div>

              {/* Interactive Bill Slider & Display Box */}
              <div className="p-5 sm:p-8 rounded-2xl bg-black/40 border border-white/10 text-center space-y-5 sm:space-y-6">
                <div className="text-xs font-mono uppercase tracking-widest text-white/50">
                  Gasto Promedio Mensual
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
                    onChange={(e) => setFormData({ ...formData, monthlyBillClp: Number(e.target.value) })}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#FF8300]"
                  />
                </div>

                <div className="flex justify-between text-[11px] sm:text-xs font-mono text-white/40">
                  <span>$40.000</span>
                  <span>$500.000</span>
                  <span>$1.500.000+</span>
                </div>

                {/* Instant Sizing Badge */}
                <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-mono text-white/70">
                  <span>⚡ Demanda: ~{Math.max(80, Math.round(formData.monthlyBillClp / (formData.distributor === "crell" ? 194 : formData.distributor === "cge" ? 182 : 188)))} kWh</span>
                  <span>☀️ Potencia: <strong className="text-white">{instantSizing.recommendedKwp} kWp</strong></span>
                  <span>🔋 Batería: <strong className="text-emerald-400">{instantSizing.batteryKwh > 0 ? `${instantSizing.batteryKwh} kWh` : "On-Grid"}</strong></span>
                  <span>🌱 Ahorro: <strong className="text-[#FF8300]">{formatCurrency(instantSizing.estimatedAnnualSavingsClp)}/año</strong></span>
                </div>
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
                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300]"
                  >
                    <option value="saesa">Grupo Saesa (Llanquihue, Osorno, Los Ríos)</option>
                    <option value="crell">Crell (Puerto Varas, Frutillar, Llanquihue)</option>
                    <option value="frontel">Frontel (La Araucanía)</option>
                    <option value="cge">CGE (Villarrica, Pucón, Macrozona)</option>
                    <option value="edelaysen">Edelaysen (Aysén)</option>
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
                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300]"
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
