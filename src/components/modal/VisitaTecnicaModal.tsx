"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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
  FileText,
  Wrench,
} from "lucide-react";
import { useVisitaModal } from "@/context/VisitaModalContext";
import { TurnstileWidget } from "@/components/security/TurnstileWidget";


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
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const calendarMenuRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body & html scroll while drawer is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showCloseConfirm) {
          setShowCloseConfirm(false);
        } else if (showCancelVisitModal) {
          setShowCancelVisitModal(false);
        } else {
          handleRequestClose();
        }
      }
    };

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevBodyOverflow || "";
      document.documentElement.style.overflow = prevHtmlOverflow || "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, showCloseConfirm, showCancelVisitModal]);

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
    acceptTerms: true,
  });

  const [folio, setFolio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const handleTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);
  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken("");
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que se haya ingresado la dirección
    if (!formData.direccion || formData.direccion.trim().length === 0) {
      setLocationError("Por favor ingresa tu dirección o sector.");
      return;
    }

    setLocationError(null);
    setSubmitError(null);
    setIsSubmitting(true);

    const randomFolio = `SOL-VIS-${Math.floor(1000 + Math.random() * 9000)}`;
    const selectedDateObj = availableDates.find(
      (d) => d.formattedDate === formData.fechaSeleccionada
    );

    const payload = {
      ...formData,
      folio: randomFolio,
      fechaIso: selectedDateObj?.fullIso || new Date().toISOString().split("T")[0],
      turnstileToken,
      website_url: honeypot,
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
        setStep(3);
      } else {
        setSubmitError(
          data.error ||
            "No se pudo registrar la visita técnica. Por favor revisa los datos ingresados e intenta nuevamente."
        );
      }
    } catch (err) {
      console.warn("Error en despacho de visita técnica:", err);
      setSubmitError(
        "Ocurrió un error de conexión al enviar la solicitud. Por favor intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
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
        acceptTerms: true,
      });
      setLocationError(null);
      setSubmitError(null);
      setHoneypot("");
    }, 300);
  };

  const handleConfirmCancelVisit = () => {
    setShowCancelVisitModal(false);
    handleForceClose();
  };

  const getWhatsAppUrl = () => {
    const tipoTexto = "Visita Técnica ($11.990 CLP - 100% Reembolsable al adquirir el proyecto)";
    const horarioTexto =
      formData.bloqueHorario === "manana"
        ? "Mañana (09:30 - 12:30 hrs)"
        : "Tarde (14:30 - 18:00 hrs)";

    const direccionTexto = formData.direccion ? formData.direccion : "Ubicación fijada en mapa";
    const coordsTexto = formData.coordenadasTexto
      ? `%0A🌐 *GPS:* ${formData.coordenadasTexto}%0A🗺 *Google Maps:* https://www.google.com/maps?q=${formData.latitud},${formData.longitud}`
      : "";

    const msg = `Hola SoldeRío, he solicitado una ${tipoTexto}.%0A%0A📋 *Folio:* ${folio}%0A👤 *Nombre:* ${formData.nombre}%0A📞 *Teléfono:* ${formData.telefono}%0A📍 *Ubicación:* ${direccionTexto}, ${formData.comuna}, ${formData.region}${coordsTexto}%0A🏡 *Propiedad:* ${formData.tipoPropiedad}%0A📅 *Fecha solicitada:* ${formData.fechaSeleccionada}%0A⏰ *Horario:* ${horarioTexto}%0A%0AQuedo atento para coordinar la visita técnica en terreno.`;

    return `https://wa.me/56966186667?text=${msg}`;
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
      `Contacto SoldeRío: +56 9 6618 6667 - contacto@solderio.cl`
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
    }\\nCosto: $14.990 CLP (100% Reembolsable al adquirir el proyecto)\\nContacto SoldeRío: +56 9 6618 6667 - contacto@solderio.cl`;

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

  if (!mounted || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div key="visita-portal-wrapper" className="fixed inset-0 z-[99999] overflow-hidden">
          {/* Backdrop con oscurecimiento leve (Desktop & Mobile) */}
          <motion.div
            key="visita-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleRequestClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer z-0"
            aria-label="Cerrar modal"
          />

          {/* Lateral Drawer Panel: 100% en Mobile, max 50% de ancho en Desktop, 100vh de alto */}
          <motion.div
            key="visita-drawer-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-10 h-screen w-full md:w-[600px] lg:w-[50vw] max-w-full bg-[#121316] text-white flex flex-col overflow-hidden shadow-[-20px_0_50px_rgba(0,0,0,0.85)] border-l border-white/10"
          >
            {/* Sticky Drawer Top Bar */}
            <header className="sticky top-0 z-30 w-full bg-[#18191D]/95 backdrop-blur-xl border-b border-white/10 px-5 sm:px-8 py-4 flex items-center justify-between shadow-md shrink-0">
              <h2 className="text-base sm:text-lg md:text-xl font-light tracking-tight text-white font-sans">
                Visita Técnica en Terreno
              </h2>

              <button
                type="button"
                onClick={handleRequestClose}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

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

        {/* Drawer Scrollable Body */}
        <div ref={contentRef} className="p-4 sm:p-6 md:p-8 overflow-y-auto overscroll-contain flex-1 custom-scrollbar">
          {/* STEP 1: VISIT DETAILS */}
          {step === 1 && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Hero row: Title, Subtitle & Price Badge */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>100% Reembolsable</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-white tracking-tight font-sans">
                    Diagnóstico y Evaluación en Terreno
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60 font-light max-w-xl leading-relaxed">
                    Inspección técnica in situ para validar orientación, sombras, empalme eléctrico y factibilidad real de tu proyecto solar.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0">
                  <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider">
                    Costo
                  </span>
                  <span className="text-xl sm:text-2xl font-mono font-bold text-[#FF8300]">
                    $11.990 <span className="text-xs text-white/50 font-normal">CLP</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-light">
                    Descontable de tu proyecto
                  </span>
                </div>
              </div>

              {/* Reimbursable Guarantee Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FF8300]/10 border border-[#FF8300]/25 flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-[#FF8300]/20 text-[#FF8300] shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-medium text-white">
                    Costo 100% Reembolsable al Adquirir el Proyecto
                  </h4>
                  <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed">
                    El valor de <span className="font-mono font-medium text-[#FF8300]">$11.990 CLP</span> cubre el traslado y dedicación horaria del Ingeniero en terreno, y se descuenta íntegramente de tu presupuesto final al contratar la instalación.
                  </p>
                </div>
              </div>

              {/* Inspection Deliverables 2x2 Grid */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-white/50 block">
                  ¿Qué incluye la inspección técnica?
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#FF8300]/15 text-[#FF8300] shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-medium text-white">Análisis de Consumo & Boleta</h5>
                      <p className="text-xs text-white/60 font-light mt-0.5 leading-relaxed">
                        Evaluación de historial de consumo mensual y estacional para optimizar la potencia requerida.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#FF8300]/15 text-[#FF8300] shrink-0 mt-0.5">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-medium text-white">Cálculo Solar Localizado</h5>
                      <p className="text-xs text-white/60 font-light mt-0.5 leading-relaxed">
                        Simulación con radiación solar real TMY de la estación meteorológica más cercana.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#FF8300]/15 text-[#FF8300] shrink-0 mt-0.5">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-medium text-white">Inspección de Cubierta & Empalme</h5>
                      <p className="text-xs text-white/60 font-light mt-0.5 leading-relaxed">
                        Revisión de orientación, ángulo, sombras y capacidad técnica del empalme eléctrico SEC.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#FF8300]/15 text-[#FF8300] shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-medium text-white">Presupuesto Llave en Mano</h5>
                      <p className="text-xs text-white/60 font-light mt-0.5 leading-relaxed">
                        Propuesta técnico-comercial definitiva, con especificación de equipos y sin sobrecostos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 1 Footer Action Bar */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
                  <Clock className="w-4 h-4 text-[#FF8300]" />
                  <span>Duración estimada: ~30-45 min</span>
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#FF8300] hover:bg-[#e07400] text-white text-xs sm:text-sm font-medium uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(255,131,0,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer group"
                >
                  <span className="font-light">Continuar al Agendamiento</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: FORM & CALENDAR */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot Anti-Bot Shield (Invisible para usuarios legítimos) */}
              <div className="hidden" aria-hidden="true" style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
                <label htmlFor="visita_website_url">No completar este campo</label>
                <input
                  type="text"
                  id="visita_website_url"
                  name="website_url"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Selected Plan Summary Banner */}
              <div className="py-2.5 px-4 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Sun className="w-4 h-4 text-[#FF8300] shrink-0" />
                  <span className="font-medium text-white">Visita Técnica ($11.990 CLP)</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded-full font-mono">
                    100% Reembolsable
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#FF8300] hover:underline cursor-pointer shrink-0"
                >
                  Ver detalle
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                <div>
                  <label htmlFor="visita_nombre" className="text-[11px] font-light text-white/70 block mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#FF8300]" />
                    Nombre y Apellido *
                  </label>
                  <input
                    id="visita_nombre"
                    type="text"
                    required
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej. Jorge Arriagada"
                    className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-black/40 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF8300] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="visita_telefono" className="text-[11px] font-light text-white/70 block mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#FF8300]" />
                    WhatsApp / Teléfono *
                  </label>
                  <input
                    id="visita_telefono"
                    type="tel"
                    required
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="+56 9 1234 5678"
                    className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-black/40 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF8300] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="visita_email" className="text-[11px] font-light text-white/70 block mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#FF8300]" />
                    Correo Electrónico *
                  </label>
                  <input
                    id="visita_email"
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contacto@ejemplo.cl"
                    className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-black/40 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF8300] transition-colors"
                  />
                </div>

                {/* Selector de Región */}
                <div>
                  <label htmlFor="visita_region" className="text-[11px] font-light text-white/70 block mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF8300]" />
                    Seleccionar Región *
                  </label>
                  <select
                    id="visita_region"
                    name="region"
                    value={formData.region}
                    onChange={handleRegionChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-black/40 text-xs text-white focus:outline-none focus:border-[#FF8300] transition-colors cursor-pointer"
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

                {/* Selector de Comuna (50% de ancho, comparte fila con Dirección) */}
                <div>
                  <label htmlFor="visita_comuna" className="text-[11px] font-light text-white/70 block mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF8300]" />
                    Seleccionar Comuna *
                  </label>
                  <select
                    id="visita_comuna"
                    name="comuna"
                    value={formData.comuna}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-black/40 text-xs text-white focus:outline-none focus:border-[#FF8300] transition-colors cursor-pointer"
                  >
                    {(REGIONES_DATA[formData.region] || []).map((comunaName) => (
                      <option key={comunaName} value={comunaName} className="bg-[#1F1F1F]">
                        {comunaName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dirección o Sector (comparte fila con Comuna) */}
                <div>
                  <label htmlFor="visita_direccion" className="text-[11px] font-light text-white/70 block mb-1 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-[#FF8300]" />
                    Dirección / Sector o Condominio *
                  </label>

                  <input
                    id="visita_direccion"
                    type="text"
                    name="direccion"
                    required
                    value={formData.direccion}
                    onChange={handleInputChange}
                    placeholder="Ej. Parcela 14, Camino a Ensenada Km 12"
                    className={`w-full px-3.5 py-2 rounded-xl border bg-black/40 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors ${
                      locationError
                        ? "border-rose-500/70 focus:border-rose-500"
                        : "border-white/15 focus:border-[#FF8300]"
                    }`}
                  />

                  {/* Mensaje de error de validación de ubicación */}
                  {locationError && (
                    <p className="mt-1 text-[11px] text-rose-400 font-light flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{locationError}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="visita_tipoPropiedad" className="text-[11px] font-light text-white/70 block mb-1">
                    Tipo de Propiedad
                  </label>
                  <select
                    id="visita_tipoPropiedad"
                    name="tipoPropiedad"
                    value={formData.tipoPropiedad}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-black/40 text-xs text-white focus:outline-none focus:border-[#FF8300] transition-colors cursor-pointer"
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
                  <label htmlFor="visita_montoBoleta" className="text-[11px] font-light text-white/70 block mb-1">
                    Gasto Mensual Boleta de Luz (Promedio)
                  </label>
                  <select
                    id="visita_montoBoleta"
                    name="montoBoleta"
                    value={formData.montoBoleta}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-black/40 text-xs text-white focus:outline-none focus:border-[#FF8300] transition-colors cursor-pointer"
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
              <div className="pt-3 border-t border-white/10">
                <label className="text-xs font-medium text-white block mb-1.5 flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#FF8300]" />
                  Selecciona la Fecha Preferida de Visita
                </label>

                {/* Date buttons carousels */}
                <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
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
                        className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#FF8300] text-white border-[#FF8300] shadow-md shadow-[#FF8300]/20 scale-105"
                            : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:border-white/20"
                        }`}
                      >
                        <span className="text-[9px] font-mono uppercase block opacity-80">
                          {item.dayName}
                        </span>
                        <span className="text-sm font-bold block leading-tight my-0.5">
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
                <div className="grid grid-cols-2 gap-2.5 mt-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, bloqueHorario: "manana" }))
                    }
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      formData.bloqueHorario === "manana"
                        ? "border-[#FF8300] bg-[#FF8300]/15 text-white font-medium shadow-sm"
                        : "border-white/10 bg-white/5 text-white/60 font-light hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-3.5 h-3.5 text-[#FF8300]" />
                      <div>
                        <span className="text-xs font-semibold block text-white leading-tight">
                          Bloque Mañana
                        </span>
                        <span className="text-[10px] text-white/50">
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
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      formData.bloqueHorario === "tarde"
                        ? "border-[#FF8300] bg-[#FF8300]/15 text-white font-medium shadow-sm"
                        : "border-white/10 bg-white/5 text-white/60 font-light hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#FF8300]" />
                      <div>
                        <span className="text-xs font-semibold block text-white leading-tight">
                          Bloque Tarde
                        </span>
                        <span className="text-[10px] text-white/50">
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

              {/* Checkbox de Consentimiento Ley N° 19.628 */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="visita_accept_terms"
                  required
                  aria-required="true"
                  checked={formData.acceptTerms}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, acceptTerms: e.target.checked }))
                  }
                  className="w-3.5 h-3.5 mt-0.5 accent-[#FF8300] rounded cursor-pointer flex-shrink-0"
                />
                <label
                  htmlFor="visita_accept_terms"
                  className="text-[11px] text-white/70 font-light cursor-pointer leading-snug"
                >
                  He leído y acepto las{" "}
                  <a
                    href="/politicas-de-privacidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF8300] underline hover:text-[#e07400] transition-colors"
                  >
                    Políticas de Privacidad
                  </a>{" "}
                  y autorizo el tratamiento de mis datos de contacto y ubicación para coordinar la visita técnica in situ conforme a la Ley N° 19.628. *
                </label>
              </div>

              {/* Submit Error Banner */}
              {submitError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Action Strip: Turnstile on the left, buttons in the same row to gain vertical space */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-full border border-white/15 text-white/80 text-xs font-light hover:bg-white/10 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Volver</span>
                  </button>

                  {/* Cloudflare Turnstile Anti-Bot Shield alineado a la izquierda */}
                  <div className="shrink-0 scale-85 sm:scale-90 origin-left">
                    <TurnstileWidget
                      theme="dark"
                      onSuccess={handleTurnstileSuccess}
                      onExpire={handleTurnstileExpire}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-7 py-3 rounded-full bg-[#FF8300] hover:bg-[#e07400] text-white text-xs font-medium uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(255,131,0,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
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
            <div className="space-y-4 sm:space-y-5 max-w-3xl mx-auto">
              {/* Header Row: Title, Subtitle & Folio Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight font-sans">
                      ¡Visita Técnica Solicitada!
                    </h3>
                    <p className="text-xs text-white/60 font-light mt-0.5">
                      Registrada para el <strong className="text-white">{formData.fechaSeleccionada}</strong> ({formData.bloqueHorario === "manana" ? "Mañana 09:30 - 12:30" : "Tarde 14:30 - 18:00"}) en <strong className="text-white">{formData.comuna}</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-0.5 shrink-0">
                  <span className="text-[10px] font-mono text-white/40 uppercase">Folio de Reserva</span>
                  <span className="text-sm font-mono font-bold text-[#FF8300]">{folio}</span>
                </div>
              </div>

              {/* 2-Column Info Grid: Uses available Drawer space without enclosed boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Col 1: Detalle de la Cita */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block pb-1 border-b border-white/10">
                    Detalle de Coordinación
                  </span>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/50">Titular:</span>
                    <span className="font-medium text-white">{formData.nombre}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/50">Teléfono:</span>
                    <span className="font-medium text-white">{formData.telefono}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/50">Ubicación:</span>
                    <span className="font-medium text-white text-right max-w-[200px] truncate" title={formData.direccion}>
                      {formData.direccion || "Punto en mapa"}, {formData.comuna}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-white/50">Costo:</span>
                    <div className="text-right">
                      <span className="font-bold text-[#FF8300] font-mono">
                        $11.990 CLP
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono block">
                        100% Reembolsable
                      </span>
                    </div>
                  </div>
                </div>

                {/* Col 2: Garantía & Notificación por Correo */}
                <div className="space-y-2.5 flex flex-col justify-between">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-light flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      <strong className="text-white font-medium">100% Reembolsable:</strong> Los $11.990 CLP se descontarán íntegramente de tu presupuesto final al contratar tu proyecto solar.
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FF8300]/10 border border-[#FF8300]/25 text-xs text-white/90 font-light flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-[#FF8300] flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      Enviamos confirmación con archivo de calendario (.ics) a <strong className="text-[#FF8300] font-medium">{formData.email}</strong>.
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar: WhatsApp, Calendar & Cancel */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Comprobante WhatsApp</span>
                  </a>

                  {/* Dropdown Agregar a mi calendario */}
                  <div className="relative w-full sm:w-auto" ref={calendarMenuRef}>
                    <button
                      type="button"
                      onClick={() => setShowCalendarMenu((prev) => !prev)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#FF8300] hover:bg-[#e07400] text-white text-xs font-medium flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
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
                  className="w-full sm:w-auto px-4 py-2 rounded-full border border-rose-500/30 hover:border-rose-500/60 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-light flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
    </div>
  )}
</AnimatePresence>,
document.body
);
}

