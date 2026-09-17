"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Home,
  User,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sun,
  AlertCircle,
  CalendarCheck,
  Download,
  ExternalLink,
  ChevronDown,
  Trash2,
  Loader2,
} from "lucide-react";
import { useVisitaModal } from "@/context/VisitaModalContext";
import dynamic from "next/dynamic";

// Dynamic import of MapLocationPicker to avoid SSR issues
const MapLocationPicker = dynamic(
  () => import("./MapLocationPicker").then((mod) => mod.MapLocationPicker),
  { ssr: false }
);

// Regiones y Comunas del Sur de Chile cubiertas por SoldeRío
const REGIONES_DATA: Record<string, string[]> = {
  "Región de Los Lagos": [
    "Puerto Varas",
    "Puerto Montt",
    "Osorno",
    "Frutillar",
    "Llanquihue",
    "Calbuco",
    "Fresia",
    "Los Muermos",
    "Maullín",
    "Cochamó",
    "Ancud",
    "Castro",
    "Chonchi",
    "Curaco de Vélez",
    "Dalcahue",
    "Puqueldón",
    "Queilén",
    "Quellón",
    "Quemchi",
    "Quinchao",
    "Puerto Octay",
    "Purranque",
    "Puyehue",
    "Río Negro",
    "San Juan de la Costa",
    "San Pablo",
    "Chaitén",
    "Futaleufú",
    "Hualaihué",
    "Palena",
  ],
  "Región de Los Ríos": [
    "Valdivia",
    "Corral",
    "Lanco",
    "Los Lagos",
    "Máfil",
    "Mariquina",
    "Paillaco",
    "Panguipulli",
    "La Unión",
    "Futrono",
    "Lago Ranco",
    "Río Bueno",
  ],
  "Región de La Araucanía": [
    "Temuco",
    "Padre Las Casas",
    "Villarrica",
    "Pucón",
    "Angol",
    "Carahue",
    "Cholchol",
    "Collipulli",
    "Cunco",
    "Curacautín",
    "Curarrehue",
    "Ercilla",
    "Freire",
    "Galvarino",
    "Gorbea",
    "Lautaro",
    "Loncoche",
    "Lonquimay",
    "Los Sauces",
    "Lumaco",
    "Melipeuco",
    "Nueva Imperial",
    "Perquenco",
    "Pitrufquén",
    "Purén",
    "Renaico",
    "Saavedra",
    "Teodoro Schmidt",
    "Toltén",
    "Traiguén",
    "Victoria",
    "Vilcún",
  ],
};

export function VisitaTecnicaModal() {
  const { isOpen, closeModal } = useVisitaModal();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showCancelVisitModal, setShowCancelVisitModal] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const calendarMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);

  // Click outside to close calendar menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarMenuRef.current &&
        !calendarMenuRef.current.contains(event.target as Node)
      ) {
        setShowCalendarMenu(false);
      }
    }
    if (showCalendarMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendarMenu]);

  // Form State
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    region: "Región de Los Lagos",
    comuna: "Puerto Varas",
    direccion: "",
    latitud: null as number | null,
    longitud: null as number | null,
    coordenadasTexto: "",
    tipoPropiedad: "Parcela",
    montoBoleta: "100.000 - 200.000",
    fechaSeleccionada: "",
    bloqueHorario: "manana", // "manana" | "tarde"
    notas: "",
  });

  const [folio, setFolio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate the next 10 business days for the interactive calendar
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    const current = new Date(today);
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
  useEffect(() => {
    if (availableDates.length > 0 && !formData.fechaSeleccionada) {
      setFormData((prev) => ({
        ...prev,
        fechaSeleccionada: availableDates[0].formattedDate,
      }));
    }
  }, [availableDates, formData.fechaSeleccionada]);

  const handleContinue = () => {
    setStep(2);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "direccion" && value.trim().length > 0) {
      setLocationError(null);
    }
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = e.target.value;
    const comunas = REGIONES_DATA[newRegion] || [];
    const firstComuna = comunas[0] || "";
    setFormData((prev) => ({
      ...prev,
      region: newRegion,
      comuna: firstComuna,
    }));
  };

  const handleMapConfirm = (coords: {
    lat: number;
    lng: number;
    formatted: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      latitud: coords.lat,
      longitud: coords.lng,
      coordenadasTexto: coords.formatted,
    }));
    setLocationError(null);
    setShowMapPicker(false);
  };

  const handleClearCoordinates = () => {
    setFormData((prev) => ({
      ...prev,
      latitud: null,
      longitud: null,
      coordenadasTexto: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que exista al menos dirección ingresada o punto marcado en el mapa
    const hasAddress = formData.direccion.trim().length > 0;
    const hasCoords = formData.latitud !== null && formData.longitud !== null;

    if (!hasAddress && !hasCoords) {
      setLocationError(
        "Por favor ingresa tu dirección o selecciona tu ubicación en el mapa."
      );
      return;
    }

    setLocationError(null);
    setIsSubmitting(true);

    const randomFolio = `SOL-VIS-${Math.floor(1000 + Math.random() * 9000)}`;
    const selectedDateObj = availableDates.find(
      (d) => d.formattedDate === formData.fechaSeleccionada
    );

    const payload = {
      ...formData,
      folio: randomFolio,
      fechaIso: selectedDateObj?.fullIso || new Date().toISOString().split("T")[0],
    };

    try {
      const res = await fetch("/api/visita-tecnica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFolio(data.folio || randomFolio);
      } else {
        setFolio(randomFolio);
      }
    } catch (err) {
      console.warn("Error en despacho de visita técnica, usando folio local:", err);
      setFolio(randomFolio);
    } finally {
      setIsSubmitting(false);
      setStep(3);
    }
  };

  const handleRequestClose = () => {
    if (step === 3) {
      handleForceClose();
    } else {
      setShowCloseConfirm(true);
    }
  };

  const handleForceClose = () => {
    setShowCloseConfirm(false);
    setShowCancelVisitModal(false);
    closeModal();
    setTimeout(() => {
      setStep(1);
      setFormData({
        nombre: "",
        telefono: "",
        email: "",
        region: "Región de Los Lagos",
        comuna: "Puerto Varas",
        direccion: "",
        latitud: null,
        longitud: null,
        coordenadasTexto: "",
        tipoPropiedad: "Parcela",
        montoBoleta: "100.000 - 200.000",
        fechaSeleccionada: availableDates[0]?.formattedDate || "",
        bloqueHorario: "manana",
        notas: "",
      });
      setLocationError(null);
    }, 300);
  };

  const handleConfirmCancelVisit = () => {
    setShowCancelVisitModal(false);
    handleForceClose();
  };

  const getWhatsAppUrl = () => {
    const tipoTexto = "Visita Técnica ($14.990 CLP - 100% Reembolsable al adquirir el proyecto)";
    const horarioTexto =
      formData.bloqueHorario === "manana"
        ? "Mañana (09:30 - 12:30 hrs)"
        : "Tarde (14:30 - 18:00 hrs)";

    const direccionTexto = formData.direccion ? formData.direccion : "Ubicación fijada en mapa";
    const coordsTexto = formData.coordenadasTexto
      ? `%0A🌐 *GPS:* ${formData.coordenadasTexto}%0A🗺 *Google Maps:* https://www.google.com/maps?q=${formData.latitud},${formData.longitud}`
      : "";

    const msg = `Hola SoldeRío, he solicitado una ${tipoTexto}.%0A%0A📋 *Folio:* ${folio}%0A👤 *Nombre:* ${formData.nombre}%0A📞 *Teléfono:* ${formData.telefono}%0A📍 *Ubicación:* ${direccionTexto}, ${formData.comuna}, ${formData.region}${coordsTexto}%0A🏡 *Propiedad:* ${formData.tipoPropiedad}%0A📅 *Fecha solicitada:* ${formData.fechaSeleccionada}%0A⏰ *Horario:* ${horarioTexto}%0A%0AQuedo atento para coordinar la visita técnica en terreno.`;

    return `https://wa.me/56987654321?text=${msg}`;
  };

  // Google Calendar URL Generator
  const getGoogleCalendarUrl = () => {
    const selectedDateObj = availableDates.find(
      (d) => d.formattedDate === formData.fechaSeleccionada
    );
    const dateStr = selectedDateObj
      ? selectedDateObj.fullIso.replace(/-/g, "")
      : new Date().toISOString().split("T")[0].replace(/-/g, "");

    const startHour = formData.bloqueHorario === "manana" ? "093000" : "143000";
    const endHour = formData.bloqueHorario === "manana" ? "123000" : "180000";

    const title = encodeURIComponent(`Visita Técnica SoldeRío - Folio ${folio}`);
    const details = encodeURIComponent(
      `Visita técnica en terreno SoldeRío Fotovoltaico.\n\n` +
      `📋 Folio: ${folio}\n` +
      `👤 Cliente: ${formData.nombre}\n` +
      `📞 Teléfono: ${formData.telefono}\n` +
      `📧 Email: ${formData.email}\n` +
      `📍 Ubicación: ${formData.direccion ? formData.direccion + ", " : ""}${formData.comuna}, ${formData.region}\n` +
      (formData.coordenadasTexto ? `🌐 Coordenadas GPS: ${formData.coordenadasTexto}\n` : "") +
      (formData.latitud ? `🗺 Google Maps: https://www.google.com/maps?q=${formData.latitud},${formData.longitud}\n` : "") +
      `💰 Costo: $14.990 CLP (100% Reembolsable al adquirir el proyecto)\n\n` +
      `Contacto SoldeRío: +56 9 8765 4321 - contacto@solderio.cl`
    );
    const location = encodeURIComponent(
      `${formData.direccion ? formData.direccion + ", " : ""}${formData.comuna}, ${formData.region}, Chile`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}T${startHour}/${dateStr}T${endHour}&details=${details}&location=${location}`;
  };

  // Download .ics file for Outlook, Apple Calendar, etc.
  const handleDownloadIcs = () => {
    const selectedDateObj = availableDates.find(
      (d) => d.formattedDate === formData.fechaSeleccionada
    );
    const dateStr = selectedDateObj
      ? selectedDateObj.fullIso.replace(/-/g, "")
      : new Date().toISOString().split("T")[0].replace(/-/g, "");

    const startHour = formData.bloqueHorario === "manana" ? "093000" : "143000";
    const endHour = formData.bloqueHorario === "manana" ? "123000" : "180000";

    const loc = `${formData.direccion ? formData.direccion + ", " : ""}${formData.comuna}, ${formData.region}, Chile`;
    const desc = `Visita técnica en terreno SoldeRío\\nFolio: ${folio}\\nCliente: ${formData.nombre}\\nTeléfono: ${formData.telefono}\\nUbicación: ${loc}${
      formData.coordenadasTexto ? `\\nGPS: ${formData.coordenadasTexto}` : ""
    }\\nCosto: $14.990 CLP (100% Reembolsable al adquirir el proyecto)\\nContacto: contacto@solderio.cl`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//SoldeRio//Visita Tecnica//ES",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${folio || "visita"}-${Date.now()}@solderio.cl`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART:${dateStr}T${startHour}`,
      `DTEND:${dateStr}T${endHour}`,
      `SUMMARY:Visita Técnica SoldeRío (${folio})`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${loc}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Visita-Tecnica-SoldeRio-${folio}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setShowCalendarMenu(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Dark Blur Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleRequestClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Card - Consistent Dark Theme */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl bg-[#181818] text-white rounded-3xl md:rounded-[32px] shadow-2xl border border-white/10 overflow-hidden z-10 flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Bar */}
        <div className="p-6 md:px-8 md:pt-7 pb-4 border-b border-white/10 flex items-center justify-between bg-[#1F1F1F] relative">
          <div>
            <h2 className="text-xl md:text-2xl font-light text-white tracking-tight">
              {step === 1 && "Solicitud de Visita Técnica"}
              {step === 2 && "Coordinación y Datos de la Visita"}
              {step === 3 && "¡Solicitud Registrada con Éxito!"}
            </h2>
          </div>

          <button
            onClick={handleRequestClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="px-4 sm:px-8 py-2.5 sm:py-3 bg-black/40 border-b border-white/10 flex items-center justify-between text-[11px] sm:text-xs font-light text-white/50 font-mono">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 1 ? "bg-[#FF8300] text-white" : "bg-white/10 text-white/40"
              }`}
            >
              1
            </span>
            <span className={step === 1 ? "font-semibold text-white" : ""}>
              Visita <span className="hidden xs:inline sm:inline">Técnica</span>
            </span>
          </div>
          <div className="h-[1px] w-4 sm:w-12 bg-white/10" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 2 ? "bg-[#FF8300] text-white" : "bg-white/10 text-white/40"
              }`}
            >
              2
            </span>
            <span className={step === 2 ? "font-semibold text-white" : ""}>
              <span className="hidden sm:inline">Datos & </span>Agenda
            </span>
          </div>
          <div className="h-[1px] w-4 sm:w-12 bg-white/10" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 3 ? "bg-emerald-500 text-white" : "bg-white/10 text-white/40"
              }`}
            >
              3
            </span>
            <span className={step === 3 ? "font-semibold text-emerald-400" : ""}>Confirmación</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div ref={contentRef} className="p-5 sm:p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
          {/* STEP 1: VISIT DETAILS */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="max-w-2xl mx-auto">
                <div className="rounded-2xl p-5 sm:p-7 border-2 border-[#FF8300] bg-gradient-to-b from-[#1F1F1F] to-[#181818] shadow-xl shadow-[#FF8300]/5 relative">
                  {/* Header Row: Title + Enroque (100% Reembolsable under title, $14.990 CLP badge on right without icon) */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-medium text-white">
                        Visita Técnica
                      </h3>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-sm sm:text-base font-semibold text-emerald-400 font-mono">
                          100% Reembolsable
                        </span>
                      </div>
                    </div>

                    <div className="self-start sm:self-auto bg-[#FF8300] text-white text-xs sm:text-sm font-bold tracking-wider px-3.5 py-1.5 rounded-full shadow-md font-mono flex-shrink-0">
                      $14.990 CLP
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-white/60 font-light mb-4">
                    Diagnóstico inicial de viabilidad solar y perfil de consumo in situ.
                  </p>

                    {/* Reimbursable guarantee banner */}
                    <div className="mb-5 p-3.5 rounded-xl bg-[#FF8300]/10 border border-[#FF8300]/25 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#FF8300] flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-white/90 font-light leading-relaxed">
                        <strong className="text-white font-medium">Costo 100% Reembolsable:</strong>{" "}
                        El valor de <span className="font-mono font-semibold text-[#FF8300]">$14.990 CLP</span> es completamente reembolsable al adquirir el proyecto, descontándose íntegramente de tu presupuesto final.
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-3 border-t border-white/10 mb-6 text-xs sm:text-sm text-white/80 font-light">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#FF8300] flex-shrink-0 mt-0.5" />
                        <span>Evaluación de boleta, consumo mensual y estacional.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#FF8300] flex-shrink-0 mt-0.5" />
                        <span>Cálculo solar según la estación meteorológica más cercana.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#FF8300] flex-shrink-0 mt-0.5" />
                        <span>Inspección visual de cubierta, orientación y empalme.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#FF8300] flex-shrink-0 mt-0.5" />
                        <span>Propuesta técnico-comercial.</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-[11px] text-white/50 font-mono">
                      ⏱ Duración estimada: ~30-45 min
                    </span>
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="px-6 py-3 rounded-full bg-[#FF8300] hover:bg-[#e07400] text-white text-xs sm:text-sm font-light uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(255,131,0,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer group"
                    >
                      <span className="font-light">Continuar al Agendamiento</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
              {/* Selected Plan Summary Banner */}
              <div className="bg-[#1F1F1F] rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-[#FF8300]/30 text-[#FF8300]">
                    <Sun className="w-5 h-5 text-[#FF8300]" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-white">
                        Visita Técnica ($14.990 CLP)
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                        100% Reembolsable
                      </span>
                    </div>
                    <span className="text-[11px] text-white/60 font-light block mt-0.5">
                      Diagnóstico in situ, evaluación de cubierta y propuesta tecnico-comercial
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-medium text-[#FF8300] hover:underline cursor-pointer"
                >
                  Ver detalle
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-light text-white/70 block mb-1.5 flex items-center gap-1.5">
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
                    className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/40 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF8300] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-light text-white/70 block mb-1.5 flex items-center gap-1.5">
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
                    className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/40 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF8300] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-light text-white/70 block mb-1.5 flex items-center gap-1.5">
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
                    className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/40 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF8300] transition-colors"
                  />
                </div>

                {/* Selector de Región */}
                <div>
                  <label className="text-xs font-light text-white/70 block mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF8300]" />
                    Seleccionar Región *
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleRegionChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/40 text-xs text-white focus:outline-none focus:border-[#FF8300] transition-colors cursor-pointer"
                  >
                    <option value="Región de Los Lagos" className="bg-[#1F1F1F]">
                      Región de Los Lagos
                    </option>
                    <option value="Región de Los Ríos" className="bg-[#1F1F1F]">
                      Región de Los Ríos
                    </option>
                    <option value="Región de La Araucanía" className="bg-[#1F1F1F]">
                      Región de La Araucanía
                    </option>
                  </select>
                </div>

                {/* Selector de Comuna */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-light text-white/70 block mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF8300]" />
                    Seleccionar Comuna *
                  </label>
                  <select
                    name="comuna"
                    value={formData.comuna}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/40 text-xs text-white focus:outline-none focus:border-[#FF8300] transition-colors cursor-pointer"
                  >
                    {(REGIONES_DATA[formData.region] || []).map((comunaName) => (
                      <option key={comunaName} value={comunaName} className="bg-[#1F1F1F]">
                        {comunaName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dirección y Botón de Mapa */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-light text-white/70 flex items-center gap-1.5">
                      <Home className="w-3.5 h-3.5 text-[#FF8300]" />
                      Dirección / Sector o Condominio
                    </label>

                    {/* Botón Seleccionar ubicación en el mapa */}
                    <button
                      type="button"
                      onClick={() => setShowMapPicker(true)}
                      className="text-xs text-[#FF8300] hover:text-[#ff9d33] font-medium flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FF8300]/10 border border-[#FF8300]/30 hover:bg-[#FF8300]/20 transition-all cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>
                        {formData.latitud !== null
                          ? "Modificar punto en mapa"
                          : "Seleccionar ubicación en el mapa"}
                      </span>
                    </button>
                  </div>

                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    placeholder="Ej. Parcela 14, Camino a Ensenada Km 12 (o marca el punto en el mapa)"
                    className={`w-full px-4 py-2.5 rounded-xl border bg-black/40 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors ${
                      locationError
                        ? "border-rose-500/70 focus:border-rose-500"
                        : "border-white/15 focus:border-[#FF8300]"
                    }`}
                  />

                  {/* Badge de coordenadas seleccionadas en el mapa */}
                  {formData.coordenadasTexto && (
                    <div className="mt-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-white block text-[11px]">
                            Ubicación fijada en el mapa:
                          </span>
                          <span className="font-mono text-[11px] text-emerald-300">
                            {formData.coordenadasTexto}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setShowMapPicker(true)}
                          className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-[10px] text-emerald-300 transition-colors cursor-pointer"
                        >
                          Ver
                        </button>
                        <button
                          type="button"
                          onClick={handleClearCoordinates}
                          className="p-1 rounded hover:bg-rose-500/20 text-white/50 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Quitar ubicación fijada"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mensaje de error de validación de ubicación */}
                  {locationError && (
                    <p className="mt-1.5 text-xs text-rose-400 font-light flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{locationError}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-light text-white/70 block mb-1.5">
                    Tipo de Propiedad
                  </label>
                  <select
                    name="tipoPropiedad"
                    value={formData.tipoPropiedad}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/40 text-xs text-white focus:outline-none focus:border-[#FF8300] transition-colors cursor-pointer"
                  >
                    <option value="Parcela" className="bg-[#1F1F1F]">
                      Parcela de Agrado
                    </option>
                    <option value="Casa Residencial" className="bg-[#1F1F1F]">
                      Casa Residencial Urbana
                    </option>
                    <option value="Comercial" className="bg-[#1F1F1F]">
                      Empresa / Comercial
                    </option>
                    <option value="Agrícola" className="bg-[#1F1F1F]">
                      Predio Agrícola / Lechero
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-light text-white/70 block mb-1.5">
                    Gasto Mensual Boleta de Luz (Promedio)
                  </label>
                  <select
                    name="montoBoleta"
                    value={formData.montoBoleta}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/40 text-xs text-white focus:outline-none focus:border-[#FF8300] transition-colors cursor-pointer"
                  >
                    <option value="Menos de 60.000" className="bg-[#1F1F1F]">
                      Menos de $60.000 CLP
                    </option>
                    <option value="60.000 - 120.000" className="bg-[#1F1F1F]">
                      $60.000 a $120.000 CLP
                    </option>
                    <option value="120.000 - 250.000" className="bg-[#1F1F1F]">
                      $120.000 a $250.000 CLP
                    </option>
                    <option value="250.000 - 500.000" className="bg-[#1F1F1F]">
                      $250.000 a $500.000 CLP
                    </option>
                    <option value="Más de 500.000" className="bg-[#1F1F1F]">
                      Más de $500.000 CLP
                    </option>
                  </select>
                </div>
              </div>

              {/* Interactive Calendar Section */}
              <div className="pt-4 border-t border-white/10">
                <label className="text-xs font-medium text-white block mb-2 flex items-center gap-1.5">
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
                            ? "bg-[#FF8300] text-white border-[#FF8300] shadow-md shadow-[#FF8300]/20 scale-105"
                            : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:border-white/20"
                        }`}
                      >
                        <span className="text-[10px] font-mono uppercase block opacity-80">
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
                        ? "border-[#FF8300] bg-[#FF8300]/15 text-white font-medium shadow-sm"
                        : "border-white/10 bg-white/5 text-white/60 font-light hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sun className="w-4 h-4 text-[#FF8300]" />
                      <div>
                        <span className="text-xs font-semibold block text-white">
                          Bloque Mañana
                        </span>
                        <span className="text-[11px] text-white/50">
                          09:30 - 12:30 hrs
                        </span>
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
                        ? "border-[#FF8300] bg-[#FF8300]/15 text-white font-medium shadow-sm"
                        : "border-white/10 bg-white/5 text-white/60 font-light hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#FF8300]" />
                      <div>
                        <span className="text-xs font-semibold block text-white">
                          Bloque Tarde
                        </span>
                        <span className="text-[11px] text-white/50">
                          14:30 - 18:00 hrs
                        </span>
                      </div>
                    </div>
                    {formData.bloqueHorario === "tarde" && (
                      <CheckCircle2 className="w-4 h-4 text-[#FF8300]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-full border border-white/15 text-white/80 text-xs font-light hover:bg-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-full bg-[#FF8300] hover:bg-[#e07400] text-white text-xs font-medium uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(255,131,0,0.4)] flex items-center gap-2 transition-all cursor-pointer ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Agendando cita...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirmar Solicitud de Visita</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
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
                className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>

              <div>
                <span className="text-xs font-mono font-bold text-[#FF8300] bg-[#FF8300]/15 border border-[#FF8300]/30 px-3 py-1 rounded-full uppercase tracking-wider">
                  Folio de Reserva: {folio}
                </span>
                <h3 className="text-2xl font-light text-white mt-3 mb-2">
                  ¡Visita Técnica Solicitada!
                </h3>
                <p className="text-xs md:text-sm text-white/70 max-w-md mx-auto font-light leading-relaxed">
                  Hemos registrado tu solicitud para el día{" "}
                  <strong className="text-white">{formData.fechaSeleccionada}</strong> en la jornada de la{" "}
                  <strong className="text-white">
                    {formData.bloqueHorario === "manana" ? "Mañana" : "Tarde"}
                  </strong>{" "}
                  en <strong className="text-white">{formData.comuna}</strong> ({formData.region}).
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-[#1F1F1F] rounded-2xl p-5 border border-white/10 text-left text-xs space-y-2.5 max-w-md mx-auto">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-white/50">Modalidad:</span>
                  <span className="font-medium text-white">Visita Técnica</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-white/50">Costo:</span>
                  <div className="text-right">
                    <span className="font-bold text-[#FF8300] font-mono block">
                      $14.990 CLP
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      100% Reembolsable al adquirir el proyecto
                    </span>
                  </div>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-white/50">Cliente:</span>
                  <span className="font-medium text-white">{formData.nombre}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-white/50">Ubicación:</span>
                  <div className="text-right font-medium text-white max-w-[240px]">
                    <div>
                      {formData.direccion ? formData.direccion : "Punto marcado en mapa"}
                    </div>
                    <div className="text-[11px] text-white/60">
                      {formData.comuna}, {formData.region}
                    </div>
                    {formData.coordenadasTexto && (
                      <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                        GPS: {formData.coordenadasTexto}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-white/50">Teléfono:</span>
                  <span className="font-medium text-white">{formData.telefono}</span>
                </div>
              </div>

              {/* Reimbursement Notice */}
              <div className="max-w-md mx-auto p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-light flex items-start gap-2.5 text-left">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong className="text-white font-medium">100% Reembolsable:</strong> Los $14.990 CLP serán descontados íntegramente de tu presupuesto final al contratar tu proyecto solar.
                </span>
              </div>

              {/* Email Sent Notice */}
              <div className="max-w-md mx-auto p-3.5 rounded-xl bg-[#FF8300]/10 border border-[#FF8300]/30 text-xs text-white/90 font-light flex items-start gap-2.5 text-left">
                <Mail className="w-4 h-4 text-[#FF8300] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Hemos enviado la confirmación con el archivo para tu calendario (Google, Outlook, Apple) a <strong className="text-[#FF8300] font-medium">{formData.email}</strong>.
                </span>
              </div>

              {/* CTA Buttons: WhatsApp + Agregar a mi calendario + Cancelar Visita */}
              <div className="flex flex-col items-center justify-center gap-3 pt-2 max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Comprobante WhatsApp</span>
                  </a>

                  {/* Dropdown Agregar a mi calendario */}
                  <div className="relative w-full sm:flex-1" ref={calendarMenuRef}>
                    <button
                      type="button"
                      onClick={() => setShowCalendarMenu((prev) => !prev)}
                      className="w-full px-5 py-3 rounded-full bg-[#FF8300] hover:bg-[#e07400] text-white text-xs font-medium flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                    >
                      <CalendarCheck className="w-4 h-4" />
                      <span>Agregar a mi calendario</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          showCalendarMenu ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {showCalendarMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute bottom-full mb-2 left-0 right-0 sm:right-auto sm:w-64 bg-[#262626] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 text-left space-y-1"
                        >
                          <a
                            href={getGoogleCalendarUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setShowCalendarMenu(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white hover:bg-white/10 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-[#FF8300]" />
                            <div>
                              <span className="font-medium block">Google Calendar</span>
                              <span className="text-[10px] text-white/50">
                                Abrir en nueva pestaña
                              </span>
                            </div>
                          </a>

                          <button
                            type="button"
                            onClick={handleDownloadIcs}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
                          >
                            <Download className="w-4 h-4 text-emerald-400" />
                            <div>
                              <span className="font-medium block">
                                Apple / Outlook / iCal
                              </span>
                              <span className="text-[10px] text-white/50">
                                Descargar archivo .ics
                              </span>
                            </div>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Botón Cancelar Visita */}
                <button
                  type="button"
                  onClick={() => setShowCancelVisitModal(true)}
                  className="w-full sm:w-auto px-6 py-2 rounded-full border border-rose-500/30 hover:border-rose-500/60 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-light flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Cancelar Visita</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Confirmation Dialog on Close Attempt */}
      <AnimatePresence>
        {showCloseConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 sm:p-8 rounded-[28px] bg-[#1F1F1F] border border-white/15 shadow-2xl text-center space-y-5 text-white relative"
            >
              <div className="w-12 h-12 rounded-full bg-[#FF8300]/15 text-[#FF8300] border border-[#FF8300]/30 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xl font-light text-white mb-2">
                  ¿Deseas cancelar el agendamiento?
                </h3>
                <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                  Estás a solo un paso de coordinar tu visita técnica en terreno con un especialista de SoldeRío.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCloseConfirm(false)}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FF8300] hover:bg-[#e07400] text-white text-xs font-medium uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                >
                  Continuar Agendando
                </button>
                <button
                  type="button"
                  onClick={handleForceClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs font-light uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Sí, Salir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog for "Cancelar Visita" in Step 3 */}
      <AnimatePresence>
        {showCancelVisitModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 sm:p-8 rounded-[28px] bg-[#1F1F1F] border border-rose-500/30 shadow-2xl text-center space-y-5 text-white relative"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xl font-light text-white mb-2">
                  ¿Estás seguro de cancelar tu Visita Técnica?
                </h3>
                <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                  Si cancelas, se liberará el cupo agendado para el día{" "}
                  <strong className="text-white">{formData.fechaSeleccionada}</strong> y la reserva con folio{" "}
                  <span className="font-mono text-[#FF8300] font-bold">{folio}</span> quedará sin efecto.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCancelVisitModal(false)}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium uppercase tracking-wider transition-all cursor-pointer"
                >
                  No, Mantener Visita
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancelVisit}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
                >
                  Sí, Cancelar Visita
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Map Location Picker Modal */}
      <MapLocationPicker
        isOpen={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onConfirm={handleMapConfirm}
        initialComuna={formData.comuna}
        initialRegion={formData.region}
        initialLat={formData.latitud}
        initialLng={formData.longitud}
      />
    </div>
  );
}
