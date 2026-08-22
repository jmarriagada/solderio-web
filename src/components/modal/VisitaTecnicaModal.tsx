"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Home,
  FileText,
  User,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Plane,
  Sun,
  Sparkles,
  Zap,
} from "lucide-react";
import { useVisitaModal, TipoVisita } from "@/context/VisitaModalContext";

export function VisitaTecnicaModal() {
  const { isOpen, selectedType, closeModal, setSelectedType } = useVisitaModal();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    comuna: "Valdivia",
    direccion: "",
    tipoPropiedad: "Parcela",
    montoBoleta: "100.000 - 200.000",
    fechaSeleccionada: "",
    bloqueHorario: "manana", // "manana" | "tarde"
    notas: "",
  });

  const [folio, setFolio] = useState("");

  // Generate the next 12 business days for the interactive calendar
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    let current = new Date(today);
    current.setDate(current.getDate() + 1); // start from tomorrow

    while (dates.length < 10) {
      const dayOfWeek = current.getDay();
      // Skip Sundays (0)
      if (dayOfWeek !== 0) {
        const dayName = current.toLocaleDateString("es-CL", { weekday: "short" });
        const dayNumber = current.getDate();
        const monthName = current.toLocaleDateString("es-CL", { month: "short" });
        const fullIso = current.toISOString().split("T")[0];
        const formattedDate = `${dayName.toUpperCase()} ${dayNumber} ${monthName.toUpperCase()}`;
        dates.push({ fullIso, dayName, dayNumber, monthName, formattedDate });
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, []);

  // Set default selected date once availableDates are ready
  if (availableDates.length > 0 && !formData.fechaSeleccionada) {
    setFormData((prev) => ({
      ...prev,
      fechaSeleccionada: availableDates[0].formattedDate,
    }));
  }

  const handleSelectType = (type: TipoVisita) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomFolio = `SOL-VIS-${Math.floor(1000 + Math.random() * 9000)}`;
    setFolio(randomFolio);
    setStep(3);
  };

  const handleResetAndClose = () => {
    closeModal();
    setTimeout(() => {
      setStep(1);
      setFormData({
        nombre: "",
        telefono: "",
        email: "",
        comuna: "Valdivia",
        direccion: "",
        tipoPropiedad: "Parcela",
        montoBoleta: "100.000 - 200.000",
        fechaSeleccionada: availableDates[0]?.formattedDate || "",
        bloqueHorario: "manana",
        notas: "",
      });
    }, 300);
  };

  const getWhatsAppUrl = () => {
    const tipoTexto =
      selectedType === "ingenieria"
        ? "Visita de Ingeniería Avanzada con Dron & 3D (1.5 UF - 100% Reembolsable)"
        : "Visita Preliminar Gratuita ($0 CLP)";

    const horarioTexto = formData.bloqueHorario === "manana" ? "Mañana (09:30 - 12:30 hrs)" : "Tarde (14:30 - 18:00 hrs)";

    const msg = `Hola SoldeRío, he solicitado una ${tipoTexto}.%0A%0A📋 *Folio:* ${folio}%0A👤 *Nombre:* ${formData.nombre}%0A📞 *Teléfono:* ${formData.telefono}%0A📍 *Ubicación:* ${formData.direccion}, ${formData.comuna}%0A🏡 *Propiedad:* ${formData.tipoPropiedad}%0A📅 *Fecha solicitada:* ${formData.fechaSeleccionada}%0A⏰ *Horario:* ${horarioTexto}%0A%0AQuedo atento para coordinar la llegada del equipo técnico.`;

    return `https://wa.me/56987654321?text=${msg}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Dark Blur Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleResetAndClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl bg-[#FFFFFF] rounded-3xl md:rounded-[32px] shadow-2xl border border-black/10 overflow-hidden z-10 flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Bar */}
        <div className="p-6 md:px-8 md:pt-7 pb-4 border-b border-black/5 flex items-center justify-between bg-white relative">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FF8300]" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#FF8300]">
                SoldeRío • Servicios de Terreno
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-brand-fg">
              {step === 1 && "Selecciona el Tipo de Visita Técnica"}
              {step === 2 && "Coordinación y Datos de la Visita"}
              {step === 3 && "¡Solicitud Registrada con Éxito!"}
            </h2>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-full bg-black/5 hover:bg-black/10 text-brand-fg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="px-6 md:px-8 py-2.5 bg-[#F7F8FA] border-b border-black/5 flex items-center justify-between text-xs font-light text-[#6B7280]">
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 1 ? "bg-[#FF8300] text-white" : "bg-black/10 text-brand-fg"
              }`}
            >
              1
            </span>
            <span className={step === 1 ? "font-semibold text-brand-fg" : ""}>Tipo de Visita</span>
          </div>
          <div className="h-[1px] w-8 sm:w-16 bg-black/10" />
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 2 ? "bg-[#FF8300] text-white" : "bg-black/10 text-brand-fg"
              }`}
            >
              2
            </span>
            <span className={step === 2 ? "font-semibold text-brand-fg" : ""}>Datos & Calendario</span>
          </div>
          <div className="h-[1px] w-8 sm:w-16 bg-black/10" />
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 3 ? "bg-emerald-600 text-white" : "bg-black/10 text-brand-fg"
              }`}
            >
              3
            </span>
            <span className={step === 3 ? "font-semibold text-brand-fg" : ""}>Confirmación</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
          {/* STEP 1: SELECT VISIT TYPE */}
          {step === 1 && (
            <div className="space-y-6">
              <p className="text-sm text-[#4A4A4A] font-light">
                Diseñamos dos modalidades de evaluación técnica para adaptarnos a tu etapa de decisión. Elige la opción que mejor se ajuste a tus necesidades:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Option A: Visita Gratuita */}
                <div
                  onClick={() => handleSelectType("gratuita")}
                  className={`rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative ${
                    selectedType === "gratuita"
                      ? "border-[#FF8300] bg-[#FFF9F3] shadow-md"
                      : "border-black/10 hover:border-[#FF8300]/40 bg-white hover:bg-[#FDFDFE]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                        <Sun className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Sin Costo • $0 CLP
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-brand-fg mb-1">
                      Visita Preliminar en Terreno
                    </h3>
                    <p className="text-xs text-[#6B7280] font-light mb-4">
                      Diagnóstico inicial de viabilidad solar y perfil de consumo in situ.
                    </p>

                    <div className="space-y-2.5 pt-3 border-t border-black/5 mb-6 text-xs text-[#4A4A4A] font-light">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Evaluación de boleta, consumo mensual y estacional.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Cálculo solar según la estación meteorológica más cercana.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Inspección visual de cubierta, orientación y empalme.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Propuesta técnico-comercial preliminar.</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                    <span className="text-[11px] text-[#6B7280]">Duración: ~30-45 min</span>
                    <button className="text-xs font-semibold text-[#FF8300] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Seleccionar Gratuita</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Option B: Visita de Pago con Dron 3D */}
                <div
                  onClick={() => handleSelectType("ingenieria")}
                  className={`rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative ${
                    selectedType === "ingenieria"
                      ? "border-[#FF8300] bg-[#FFF9F3] shadow-md"
                      : "border-black/10 hover:border-[#FF8300]/40 bg-white hover:bg-[#FDFDFE]"
                  }`}
                >
                  {/* Top highlight ribbon */}
                  <div className="absolute -top-3 right-6 bg-[#FF8300] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>100% Reembolsable</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-[#FF8300]/10 text-[#FF8300]">
                        <Plane className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-[#FF8300] bg-[#FF8300]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        1.5 UF (~$55.000 CLP)
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-brand-fg mb-1">
                      Visita de Ingeniería & Dron 3D
                    </h3>
                    <p className="text-xs text-[#6B7280] font-light mb-4">
                      Levantamiento aerofotogramétrico 3D y auditoría eléctrica rigurosa.
                    </p>

                    <div className="space-y-2.5 pt-3 border-t border-black/5 mb-6 text-xs text-[#4A4A4A] font-light">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF8300] flex-shrink-0 mt-0.5" />
                        <span>Vuelo de Dron & Fotogrametría aérea de alta definición.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF8300] flex-shrink-0 mt-0.5" />
                        <span>Modelado 3D de techumbre y análisis de sombras milimétrico.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF8300] flex-shrink-0 mt-0.5" />
                        <span>Auditoría de tablero eléctrico y capacidad SEC RIC.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF8300] flex-shrink-0 mt-0.5" />
                        <span className="font-medium text-brand-fg">
                          Dossier ejecutivo 100% abonable a la compra de tu planta.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                    <span className="text-[11px] text-[#6B7280]">Duración: ~60-90 min</span>
                    <button className="text-xs font-semibold text-[#FF8300] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Seleccionar Ingeniería</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FORM & CALENDAR */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selected Plan Summary Banner */}
              <div className="bg-[#F7F8FA] rounded-2xl p-4 border border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white border border-black/10 text-[#FF8300]">
                    {selectedType === "ingenieria" ? (
                      <Plane className="w-5 h-5" />
                    ) : (
                      <Sun className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-fg block">
                      {selectedType === "ingenieria"
                        ? "Visita de Ingeniería & Dron 3D (1.5 UF - Reembolsable)"
                        : "Visita Preliminar en Terreno ($0 CLP - Gratuita)"}
                    </span>
                    <span className="text-[11px] text-[#6B7280]">
                      {selectedType === "ingenieria"
                        ? "Levantamiento fotogramétrico, sombras 3D y auditoría SEC"
                        : "Evaluación de boleta y recurso solar por estación meteorológica"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-medium text-[#FF8300] hover:underline cursor-pointer"
                >
                  Cambiar
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-brand-fg block mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#FF8300]" />
                    Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej. Jorge Arriagada"
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white text-xs text-brand-fg focus:outline-none focus:border-[#FF8300] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-brand-fg block mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#FF8300]" />
                    WhatsApp / Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="+56 9 1234 5678"
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white text-xs text-brand-fg focus:outline-none focus:border-[#FF8300] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-brand-fg block mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#FF8300]" />
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contacto@ejemplo.cl"
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white text-xs text-brand-fg focus:outline-none focus:border-[#FF8300] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-brand-fg block mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF8300]" />
                    Comuna en el Sur *
                  </label>
                  <select
                    name="comuna"
                    value={formData.comuna}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white text-xs text-brand-fg focus:outline-none focus:border-[#FF8300] transition-colors"
                  >
                    <option value="Valdivia">Valdivia</option>
                    <option value="Osorno">Osorno</option>
                    <option value="Puerto Varas">Puerto Varas</option>
                    <option value="Frutillar">Frutillar</option>
                    <option value="Llanquihue">Llanquihue</option>
                    <option value="Panguipulli">Panguipulli</option>
                    <option value="Puerto Montt">Puerto Montt</option>
                    <option value="La Unión">La Unión</option>
                    <option value="Río Bueno">Río Bueno</option>
                    <option value="Villarrica">Villarrica</option>
                    <option value="Pucón">Pucón</option>
                    <option value="Temuco">Temuco</option>
                    <option value="Otra Comuna">Otra Comuna del Sur</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-brand-fg block mb-1.5 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-[#FF8300]" />
                    Dirección / Sector o Condominio *
                  </label>
                  <input
                    type="text"
                    required
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    placeholder="Ej. Parcela 14, Camino a Niebla Km 8"
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white text-xs text-brand-fg focus:outline-none focus:border-[#FF8300] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-brand-fg block mb-1.5">
                    Tipo de Propiedad
                  </label>
                  <select
                    name="tipoPropiedad"
                    value={formData.tipoPropiedad}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white text-xs text-brand-fg focus:outline-none focus:border-[#FF8300] transition-colors"
                  >
                    <option value="Parcela">Parcela de Agrado</option>
                    <option value="Casa Residencial">Casa Residencial Urbana</option>
                    <option value="Comercial">Empresa / Comercial</option>
                    <option value="Agrícola">Predio Agrícola / Lechero</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-brand-fg block mb-1.5">
                    Gasto Mensual Boleta de Luz (Promedio)
                  </label>
                  <select
                    name="montoBoleta"
                    value={formData.montoBoleta}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white text-xs text-brand-fg focus:outline-none focus:border-[#FF8300] transition-colors"
                  >
                    <option value="Menos de 60.000">Menos de $60.000 CLP</option>
                    <option value="60.000 - 120.000">$60.000 a $120.000 CLP</option>
                    <option value="120.000 - 250.000">$120.000 a $250.000 CLP</option>
                    <option value="250.000 - 500.000">$250.000 a $500.000 CLP</option>
                    <option value="Más de 500.000">Más de $500.000 CLP</option>
                  </select>
                </div>
              </div>

              {/* Interactive Calendar Section */}
              <div className="pt-4 border-t border-black/5">
                <label className="text-xs font-bold text-brand-fg block mb-2 flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-[#FF8300]" />
                  Selecciona la Fecha Preferida de Visita
                </label>

                {/* Date buttons carousels */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {availableDates.map((item) => {
                    const isSelected = formData.fechaSeleccionada === item.formattedDate;
                    return (
                      <button
                        type="button"
                        key={item.fullIso}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            fechaSeleccionada: item.formattedDate,
                          }))
                        }
                        className={`flex-shrink-0 px-3.5 py-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#FF8300] text-white border-[#FF8300] shadow-sm scale-105"
                            : "bg-white text-brand-fg border-black/10 hover:border-black/20"
                        }`}
                      >
                        <span className="text-[10px] font-semibold uppercase block opacity-80">
                          {item.dayName}
                        </span>
                        <span className="text-base font-bold block leading-tight my-0.5">
                          {item.dayNumber}
                        </span>
                        <span className="text-[9px] uppercase block opacity-80">
                          {item.monthName}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Time Slot Selection */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, bloqueHorario: "manana" }))
                    }
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      formData.bloqueHorario === "manana"
                        ? "border-[#FF8300] bg-[#FFF9F3] text-brand-fg font-medium"
                        : "border-black/10 bg-white text-[#6B7280] font-light"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sun className="w-4 h-4 text-[#FF8300]" />
                      <div>
                        <span className="text-xs font-bold block">Bloque Mañana</span>
                        <span className="text-[11px] text-[#6B7280]">09:30 - 12:30 hrs</span>
                      </div>
                    </div>
                    {formData.bloqueHorario === "manana" && (
                      <CheckCircle2 className="w-4 h-4 text-[#FF8300]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, bloqueHorario: "tarde" }))
                    }
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      formData.bloqueHorario === "tarde"
                        ? "border-[#FF8300] bg-[#FFF9F3] text-brand-fg font-medium"
                        : "border-black/10 bg-white text-[#6B7280] font-light"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#FF8300]" />
                      <div>
                        <span className="text-xs font-bold block">Bloque Tarde</span>
                        <span className="text-[11px] text-[#6B7280]">14:30 - 18:00 hrs</span>
                      </div>
                    </div>
                    {formData.bloqueHorario === "tarde" && (
                      <CheckCircle2 className="w-4 h-4 text-[#FF8300]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-black/5 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-full border border-black/10 text-brand-fg text-xs font-light hover:bg-black/5 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver a Planes</span>
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-[#FF8300] hover:bg-[#e07400] text-white text-xs font-semibold shadow-md hover:shadow-[0_0_20px_rgba(255,131,0,0.4)] flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Confirmar Solicitud de Visita</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 3 && (
            <div className="text-center py-6 space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>

              <div>
                <span className="text-xs font-bold text-[#FF8300] bg-[#FF8300]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  Folio de Reserva: {folio}
                </span>
                <h3 className="text-2xl font-bold text-brand-fg mt-3 mb-2">
                  ¡Visita Técnica Solicitada!
                </h3>
                <p className="text-xs md:text-sm text-[#4A4A4A] max-w-md mx-auto font-light leading-relaxed">
                  Hemos registrado tu solicitud para el día{" "}
                  <strong className="text-brand-fg">{formData.fechaSeleccionada}</strong> en la jornada de la{" "}
                  <strong className="text-brand-fg">
                    {formData.bloqueHorario === "manana" ? "Mañana" : "Tarde"}
                  </strong>{" "}
                  en <strong className="text-brand-fg">{formData.comuna}</strong>.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-[#F7F8FA] rounded-2xl p-5 border border-black/5 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-[#6B7280]">Modalidad:</span>
                  <span className="font-semibold text-brand-fg">
                    {selectedType === "ingenieria"
                      ? "Ingeniería Avanzada & Dron 3D (1.5 UF Reembolsable)"
                      : "Preliminar Gratuita ($0 CLP)"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-[#6B7280]">Cliente:</span>
                  <span className="font-medium text-brand-fg">{formData.nombre}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-[#6B7280]">Dirección:</span>
                  <span className="font-medium text-brand-fg">
                    {formData.direccion}, {formData.comuna}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#6B7280]">Teléfono:</span>
                  <span className="font-medium text-brand-fg">{formData.telefono}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Enviar Comprobante por WhatsApp</span>
                </a>
                <button
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-black/5 hover:bg-black/10 text-brand-fg text-xs font-medium transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
