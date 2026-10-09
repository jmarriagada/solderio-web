"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  Sun, 
  Zap, 
  Home, 
  BatteryCharging, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  CheckCircle2, 
  Radio, 
  Fuel, 
  Info,
  DollarSign,
  CloudSun,
  Building2,
  Factory
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type PlantModalType = "hibrida" | "ongrid" | "offgrid" | "bess";

interface PlantTypeModalProps {
  type: PlantModalType | null;
  context?: "hogar" | "empresa";
  onClose: () => void;
  onSelect?: (type: PlantModalType) => void;
}

interface PlantDetails {
  id: PlantModalType;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  simpleExplanation: string;
  flowSteps: {
    icon: any;
    label: string;
    sublabel: string;
    color: string;
  }[];
  scenarios: {
    situation: string;
    description: string;
    icon: any;
    accent: string;
  }[];
  highlights: string[];
}

const RESIDENTIAL_PLANT_DATA: Record<PlantModalType, PlantDetails> = {
  hibrida: {
    id: "hibrida",
    badge: "Generación + Respaldo",
    badgeColor: "#FF8300",
    title: "Planta Solar Híbrida",
    subtitle: "El sistema más completo: energía solar de día, de noche y ante cortes de luz.",
    simpleExplanation:
      "Tus paneles generan electricidad limpia con el sol. Esa energía alimenta primero tus luces y electrodomésticos en tiempo real; si te sobra energía, se guarda automáticamente en tus baterías para que la uses en la noche. Y si las baterías se llenan al 100%, el sobrante se vende a la compañía de luz para descontarlo de tu boleta.",
    flowSteps: [
      {
        icon: Sun,
        label: "Paneles Solares",
        sublabel: "Generan energía gratis del sol",
        color: "#FBBF24",
      },
      {
        icon: Zap,
        label: "Cerebro Inteligente",
        sublabel: "Reparte la energía automáticamente",
        color: "#FF8300",
      },
      {
        icon: Home,
        label: "Tu Hogar",
        sublabel: "Prioridad 1: consumo directo",
        color: "#38BDF8",
      },
      {
        icon: BatteryCharging,
        label: "Baterías",
        sublabel: "Prioridad 2: respaldo y noche",
        color: "#00E599",
      },
      {
        icon: DollarSign,
        label: "Red Eléctrica",
        sublabel: "Prioridad 3: venta de excedentes",
        color: "#A78BFA",
      },
    ],
    scenarios: [
      {
        situation: "Durante el día",
        description: "Tu casa funciona 100% con el sol y tus baterías se cargan al máximo.",
        icon: Sun,
        accent: "text-amber-400",
      },
      {
        situation: "Durante la noche",
        description: "Las baterías entregan su energía guardada para que no tengas que comprarle a la compañía.",
        icon: BatteryCharging,
        accent: "text-[#00E599]",
      },
      {
        situation: "Si se corta la luz en la calle",
        description: "El sistema conmuta de forma automática e imperceptible. Tu casa sigue con luz, refrigerador y calefacción.",
        icon: ShieldCheck,
        accent: "text-[#FF8300]",
      },
      {
        situation: "Si te sobra energía",
        description: "Se inyecta a los cables de la calle y la distribuidora te la descuenta de tu cuenta a fin de mes.",
        icon: DollarSign,
        accent: "text-emerald-400",
      },
    ],
    highlights: [
      "Continuidad total: nunca te quedas a oscuras ante temporales.",
      "Ahorro máximo las 24 horas del día.",
      "Venta legal de excedentes a la compañía de luz.",
    ],
  },

  ongrid: {
    id: "ongrid",
    badge: "La más económica",
    badgeColor: "#00E599",
    title: "Planta Solar On-Grid",
    subtitle: "Conectada a la red pública: la menor inversión inicial y el retorno más rápido.",
    simpleExplanation:
      "Funciona conectada directamente a los cables de tu distribuidora eléctrica. No utiliza baterías, por lo que su costo es mucho más accesible. Todo lo que tus paneles producen durante el día se consume de inmediato en tu hogar, y toda la energía que no alcances a gastar se vende a la red eléctrica para rebajar fuertemente tu boleta mensual.",
    flowSteps: [
      {
        icon: Sun,
        label: "Paneles Solares",
        sublabel: "Producen energía limpia con el sol",
        color: "#FBBF24",
      },
      {
        icon: Zap,
        label: "Inversor Solar",
        sublabel: "Adapta la energía para tu casa",
        color: "#00E599",
      },
      {
        icon: Home,
        label: "Tu Hogar",
        sublabel: "Usa tu propia electricidad gratis",
        color: "#38BDF8",
      },
      {
        icon: DollarSign,
        label: "Red Eléctrica",
        sublabel: "Vendes lo que sobra / Compras de noche",
        color: "#FF8300",
      },
    ],
    scenarios: [
      {
        situation: "Durante el día",
        description: "Prendes artefactos, bombas y luces con energía gratuita producida en tu propio techo.",
        icon: Sun,
        accent: "text-amber-400",
      },
      {
        situation: "Si te sobra energía en el día",
        description: "El excedente viaja a la red pública y genera saldo a tu favor para descontar de tu boleta.",
        icon: DollarSign,
        accent: "text-[#00E599]",
      },
      {
        situation: "Durante la noche",
        description: "Consumes electricidad de la red de forma tradicional y transparente.",
        icon: Home,
        accent: "text-sky-400",
      },
      {
        situation: "Si se corta la luz en la calle",
        description: "Por seguridad de los operarios de la calle, el sistema se apaga momentáneamente mientras vuelve la red (no tiene baterías).",
        icon: Info,
        accent: "text-zinc-400",
      },
    ],
    highlights: [
      "Inversión inicial significativamente más baja.",
      "Ahorra hasta un 80% o más en tu cuenta de luz mensual.",
      "Sistema de larga vida útil (25+ años) con mantenimiento casi nulo.",
    ],
  },

  offgrid: {
    id: "offgrid",
    badge: "100% de Autonomía",
    badgeColor: "#38BDF8",
    title: "Planta Solar Off-Grid",
    subtitle: "Totalmente aislada: tu propia central eléctrica sin cables de la calle.",
    simpleExplanation:
      "Diseñada especialmente para parcelas, campos o sitios donde no llega la red eléctrica o donde el empalme resulta excesivamente caro. Tu casa produce su propia electricidad con los paneles solares y la almacena en un gran banco de baterías para que tengas energía limpia día y noche, con opción de conectar un generador a combustión de apoyo para el invierno.",
    flowSteps: [
      {
        icon: Sun,
        label: "Paneles Solares",
        sublabel: "Tu fuente de energía diaria",
        color: "#FBBF24",
      },
      {
        icon: Zap,
        label: "Inversor Autónomo",
        sublabel: "Genera tus 220V independientes",
        color: "#38BDF8",
      },
      {
        icon: BatteryCharging,
        label: "Banco de Baterías",
        sublabel: "Energía para noche y días nublados",
        color: "#00E599",
      },
      {
        icon: Home,
        label: "Tu Hogar",
        sublabel: "Confort total 100% desconectado",
        color: "#FF8300",
      },
      {
        icon: Fuel,
        label: "Generador de Apoyo",
        sublabel: "Respaldo opcional ante emergencias",
        color: "#F87171",
      },
    ],
    scenarios: [
      {
        situation: "Día a día en tu parcela",
        description: "El sol alimenta tus electrodomésticos, bombas de agua e iluminación, mientras recarga tus baterías.",
        icon: Sun,
        accent: "text-amber-400",
      },
      {
        situation: "Durante la noche",
        description: "Tu casa funciona silenciosa y tranquilamente con la energía acumulada en tus baterías.",
        icon: BatteryCharging,
        accent: "text-[#00E599]",
      },
      {
        situation: "¿Facturas o cobros mensuales?",
        description: "Cero. Nunca más pagas una cuenta de luz porque no dependes de ninguna empresa eléctrica.",
        icon: ShieldCheck,
        accent: "text-sky-400",
      },
      {
        situation: "Muchos días seguidos de lluvia",
        description: "Puedes encender un generador de combustible para recargar rápidamente tus baterías si hiciera falta.",
        icon: Fuel,
        accent: "text-rose-400",
      },
    ],
    highlights: [
      "100% de independencia eléctrica en zonas rurales o parcelas.",
      "Olvídate de cobros, multas o fallas de empresas distribuidoras.",
      "Energía confiable y silenciosa con baterías de alta duración.",
    ],
  },
  bess: {
    id: "bess",
    badge: "Almacenamiento LiFePO4",
    badgeColor: "#38BDF8",
    title: "Banco de Baterías de Respaldo",
    subtitle: "Almacena energía económica y asegura respaldo ante cortes prolongados.",
    simpleExplanation:
      "Sistema de baterías LiFePO4 en rack que se recarga de la red o paneles y mantiene la continuidad eléctrica en tu inmueble ante cualquier corte.",
    flowSteps: [
      {
        icon: Zap,
        label: "Red Eléctrica",
        sublabel: "Recarga automática",
        color: "#00E599",
      },
      {
        icon: BatteryCharging,
        label: "Baterías LiFePO4",
        sublabel: "Almacenamiento seguro",
        color: "#38BDF8",
      },
      {
        icon: Home,
        label: "Tu Hogar",
        sublabel: "Respaldo continuo 24/7",
        color: "#FF8300",
      },
    ],
    scenarios: [
      {
        situation: "Corte de luz o temporal",
        description: "Mantiene iluminación, internet y refrigerador funcionando sin interrupciones.",
        icon: ShieldCheck,
        accent: "text-[#FF8300]",
      },
    ],
    highlights: [
      "Cero ruido ni combustible diésel.",
      "Conmutación automática e instantánea.",
    ],
  },
};

const ENTERPRISE_PLANT_DATA: Record<PlantModalType, PlantDetails> = {
  ongrid: {
    id: "ongrid",
    badge: "Solar con Máximo ROI Comercial",
    badgeColor: "#00E599",
    title: "Autoconsumo Solar Comercial & Industrial",
    subtitle: "Disminuye el OPEX energético diurno de tu empresa y amortiza con depreciación tributaria instantánea.",
    simpleExplanation:
      "Diseñado para sincronizarse con tu horario de operaciones productivas. Los paneles solares generan energía limpia en los momentos de mayor actividad, abasteciendo directamente motores, maquinaria, cámaras de frío u oficinas. La energía sobrante se inyecta y valoriza bajo la Ley 21.118, reduciendo fuertemente la factura eléctrica mensual.",
    flowSteps: [
      {
        icon: Sun,
        label: "Paneles TOPCon 585W",
        sublabel: "Generación bifacial industrial de alto rendimiento",
        color: "#FBBF24",
      },
      {
        icon: Zap,
        label: "Inversor String Comercial",
        sublabel: "Eficiencia >98.6% y monitoreo de curvas de carga",
        color: "#FF8300",
      },
      {
        icon: Factory,
        label: "Tu Operación",
        sublabel: "Consumo diurno directo a costo cero",
        color: "#38BDF8",
      },
      {
        icon: DollarSign,
        label: "Red Eléctrica (Netbilling)",
        sublabel: "Inyección legal de excedentes con tarifa regulada",
        color: "#A78BFA",
      },
    ],
    scenarios: [
      {
        situation: "Turno Productivo Diurno",
        description: "Tu empresa opera con energía solar limpia, reduciendo drásticamente la compra de kWh en horarios de mayor costo.",
        icon: Sun,
        accent: "text-amber-400",
      },
      {
        situation: "Fines de Semana o Parada de Faena",
        description: "Toda la energía solar producida se inyecta automáticamente a la red eléctrica, acumulando saldo comercial a favor.",
        icon: DollarSign,
        accent: "text-emerald-400",
      },
      {
        situation: "Beneficio Tributario Instantáneo",
        description: "Permite acogerse a depreciación instantánea en el balance tributario, acortando el retorno de inversión (ROI) a 3-4 años.",
        icon: ShieldCheck,
        accent: "text-[#FF8300]",
      },
    ],
    highlights: [
      "Retorno de inversión (ROI) acelerado en 3 a 4 años con beneficio tributario.",
      "Ingeniería de detalle y tramitación SEC TE-4 ante la distribuidora incluida.",
      "Monitoreo telemático de demanda en tiempo real por circuito productivo.",
    ],
  },

  hibrida: {
    id: "hibrida",
    badge: "Solar + Continuidad Operativa",
    badgeColor: "#FF8300",
    title: "Sistema Híbrido Comercial de Continuidad",
    subtitle: "Protege tus procesos productivos contra caídas de red sin el ruido ni el costo del diésel.",
    simpleExplanation:
      "Combina la generación solar diurna con almacenamiento industrial en baterías LiFePO4. Ante un apagón o microcorte en la red eléctrica, el sistema conmuta en menos de 10 milisegundos (grado UPS), manteniendo activas líneas de producción, servidores, iluminación y cámaras de frío sin detener la operación.",
    flowSteps: [
      {
        icon: Sun,
        label: "Generación Solar",
        sublabel: "Abastecimiento diurno a costo cero",
        color: "#FBBF24",
      },
      {
        icon: Zap,
        label: "Inversor Híbrido STS",
        sublabel: "Conmutación ultra-rápida grado UPS (<10ms)",
        color: "#FF8300",
      },
      {
        icon: BatteryCharging,
        label: "Racks LiFePO4",
        sublabel: "Baterías industriales de ciclo profundo (>6.000 ciclos)",
        color: "#00E599",
      },
      {
        icon: Factory,
        label: "Procesos Críticos",
        sublabel: "Cero paradas en frío, servidores o faena",
        color: "#38BDF8",
      },
    ],
    scenarios: [
      {
        situation: "Apagón o Corte en Temporal",
        description: "Transferencia instantánea en menos de 10 milisegundos; tus equipos y maquinaria no sufren reinicios ni paradas imprevistas.",
        icon: ShieldCheck,
        accent: "text-[#FF8300]",
      },
      {
        situation: "Operación Normal con Sol",
        description: "Prioriza el autoconsumo solar en faena y mantiene los bancos de litio al 100% listos para cualquier corte.",
        icon: Sun,
        accent: "text-amber-400",
      },
      {
        situation: "Sincronización con Grupo Electrógeno",
        description: "Compatible para hibridar con generador diésel existente, minimizando el consumo de combustible en contingencias largas.",
        icon: Fuel,
        accent: "text-sky-400",
      },
    ],
    highlights: [
      "Cero pérdidas económicas por interrupción de faenas o reinicio de maquinaria.",
      "Reemplazo silencioso y limpio de generadores diésel en cortes frecuentes.",
      "Baterías de fosfato de hierro y litio (LiFePO4) con más de 15 años de vida útil.",
    ],
  },

  bess: {
    id: "bess",
    badge: "Ahorro en Horas Punta & Tarifa BT3/AT4",
    badgeColor: "#38BDF8",
    title: "Sistema BESS Industrial (Almacenamiento sin Paneles)",
    subtitle: "Elimina los sobrecostos por potencia máxima en horas punta y asegura respaldo eléctrico.",
    simpleExplanation:
      "Un banco de almacenamiento de litio LiFePO4 modular en rack que no requiere paneles solares. Se recarga desde la red eléctrica durante los horarios valle (económicos) y se descarga automáticamente durante el bloque de Horas Punta (18:00 a 22:00 hrs en invierno), recortando la potencia máxima leída para eliminar cobros de sobremanda.",
    flowSteps: [
      {
        icon: Zap,
        label: "Carga en Horario Valle",
        sublabel: "Compra de energía barata fuera de punta",
        color: "#00E599",
      },
      {
        icon: BatteryCharging,
        label: "Banco BESS LiFePO4",
        sublabel: "Almacenamiento en rack modular en sala eléctrica",
        color: "#38BDF8",
      },
      {
        icon: Factory,
        label: "Peak Shaving (18:00 - 22:00)",
        sublabel: "Descarga inteligente para aplanar el consumo punta",
        color: "#FF8300",
      },
      {
        icon: DollarSign,
        label: "Eliminación de Sobrecargos",
        sublabel: "Ahorro directo en la boleta de potencia leída",
        color: "#A78BFA",
      },
    ],
    scenarios: [
      {
        situation: "Bloque de Horas Punta (18:00 a 22:00)",
        description: "El banco BESS inyecta energía a tu instalación para recortar el pico de potencia demandada a la red (Peak Shaving).",
        icon: Zap,
        accent: "text-[#FF8300]",
      },
      {
        situation: "Sin Paneles ni Intervención en Techumbres",
        description: "Ideal para empresas que arriendan bodegas o galpones sin factibilidad de perforar cubiertas.",
        icon: Building2,
        accent: "text-sky-400",
      },
      {
        situation: "Respaldo Inmediato ante Apagones",
        description: "Actúa también como UPS industrial de gran capacidad, alimentando circuitos esenciales si la red se cae.",
        icon: ShieldCheck,
        accent: "text-emerald-400",
      },
    ],
    highlights: [
      "Ahorro directo en el ítem más costoso de la tarifa eléctrica comercial (demanda en punta).",
      "100% modular y trasladable si tu empresa cambia de instalaciones.",
      "Instalación limpia en sala eléctrica sin permisos de techumbre.",
    ],
  },

  offgrid: {
    id: "offgrid",
    badge: "100% Autonomía Industrial",
    badgeColor: "#F59E0B",
    title: "Planta Solar Aislada Industrial & Faenas",
    subtitle: "Autonomía completa para faenas remotas, estaciones de bombeo o instalaciones sin red.",
    simpleExplanation:
      "Diseñada para operaciones alejadas del tendido eléctrico (riego agrícola, pisciculturas, repetidoras o faenas aisladas). Opera de manera continua mediante paneles solares, banco de baterías LiFePO4 de gran capacidad y respaldo automatizado por generador.",
    flowSteps: [
      {
        icon: Sun,
        label: "Paneles Industriales",
        sublabel: "Generación solar continua en terreno",
        color: "#FBBF24",
      },
      {
        icon: BatteryCharging,
        label: "Banco BESS Robusto",
        sublabel: "Almacenamiento para noches y días nublados",
        color: "#00E599",
      },
      {
        icon: Factory,
        label: "Maquinaria / Bombas",
        sublabel: "Alimentación trifásica o monofásica estable",
        color: "#38BDF8",
      },
      {
        icon: Fuel,
        label: "Grupo Electrógeno",
        sublabel: "Arranque automático ATS en contingencias",
        color: "#F43F5E",
      },
    ],
    scenarios: [
      {
        situation: "Faena Sin Red Eléctrica",
        description: "Operación 100% independiente sin esperar costosas extensiones de línea eléctrica.",
        icon: ShieldCheck,
        accent: "text-amber-400",
      },
      {
        situation: "Temporales Prolongados",
        description: "El sistema enciende automáticamente el generador auxiliar solo para recargar las baterías cuando sea estrictamente necesario.",
        icon: Fuel,
        accent: "text-rose-400",
      },
    ],
    highlights: [
      "Solución llave en mano para operaciones rurales e industriales remotas.",
      "Reducción de hasta un 90% en consumo de combustible diésel.",
      "Monitoreo satelital opcional vía Starlink.",
    ],
  },
};

export function PlantTypeModal({ type, context = "hogar", onClose, onSelect }: PlantTypeModalProps) {
  const [mounted, setMounted] = useState(false);
  const lastTypeRef = useRef<PlantModalType | null>(type);

  if (type) {
    lastTypeRef.current = type;
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!type) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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
  }, [type, onClose]);

  if (!mounted) return null;

  const activeType = type || lastTypeRef.current || "hibrida";
  const dataset = context === "empresa" ? ENTERPRISE_PLANT_DATA : RESIDENTIAL_PLANT_DATA;
  const data = dataset[activeType] || RESIDENTIAL_PLANT_DATA[activeType] || RESIDENTIAL_PLANT_DATA.hibrida;

  return createPortal(
    <AnimatePresence>
      {type && (
        <div key="portal-drawer-wrapper" className="fixed inset-0 z-[99999] overflow-hidden">
          {/* Backdrop con oscurecimiento leve (Desktop & Mobile) */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer z-0"
            aria-label="Cerrar vista"
          />

          {/* Drawer Lateral: 100% de pantalla en Mobile; 100vh de alto y máx 50% de ancho en Desktop */}
          <motion.div
            key="drawer-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-10 h-screen w-full md:w-[600px] lg:w-[50vw] max-w-full bg-[#0E1013] text-white flex flex-col overflow-hidden shadow-[-20px_0_50px_rgba(0,0,0,0.85)] border-l border-white/10"
          >
            {/* Sticky Top Header Navigation */}
            <header className="sticky top-0 z-30 w-full bg-[#121316]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-light transition-all cursor-pointer group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
                  <span>Volver al Cotizador</span>
                </button>
                <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-400 pl-2 border-l border-white/10">
                  <span className="text-[#FF8300] uppercase font-semibold">
                    {context === "empresa" ? "B2B Empresa" : "Hogar & Parcela"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <span
                  className="text-[10px] sm:text-xs font-mono uppercase tracking-widest font-semibold px-2.5 sm:px-3 py-1 rounded-full hidden sm:inline-block"
                  style={{
                    backgroundColor: `${data.badgeColor}20`,
                    color: data.badgeColor,
                    border: `1px solid ${data.badgeColor}40`,
                  }}
                >
                  {data.badge}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                  aria-label="Cerrar vista"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </header>

            {/* Scrollable Main Canvas - overscroll-contain para asegurar que el scroll solo ocurra aquí y no detrás */}
            <main className="flex-1 overflow-y-auto overscroll-contain">
              <div className="w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
                
                {/* Hero Header Section */}
                <div className="space-y-2.5 pb-5 border-b border-white/10">
                  <div className="sm:hidden mb-1">
                    <span
                      className="text-[10px] font-mono uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full inline-block"
                      style={{
                        backgroundColor: `${data.badgeColor}20`,
                        color: data.badgeColor,
                        border: `1px solid ${data.badgeColor}40`,
                      }}
                    >
                      {data.badge}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-white tracking-tight leading-tight">
                    {data.title}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-light leading-relaxed">
                    {data.subtitle}
                  </p>
                </div>

                {/* Section 1: Simple Explanation Box */}
                <div className="bg-[#15171B] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md"
                      style={{ backgroundColor: `${data.badgeColor}20`, border: `1px solid ${data.badgeColor}40` }}
                    >
                      <Info className="w-5 h-5" style={{ color: data.badgeColor }} />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="text-sm sm:text-base font-medium text-white">
                        ¿Cómo funciona en palabras sencillas?
                      </h3>
                      <p className="text-xs sm:text-sm md:text-[15px] text-zinc-300 font-light leading-relaxed">
                        {data.simpleExplanation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Visual Graphic Flow Diagram (Arquitectura de Operación) */}
                <div className="bg-[#15171B] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                    <div>
                      <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#FF8300] font-semibold block">
                        Arquitectura de Operación
                      </span>
                      <h3 className="text-sm sm:text-base md:text-lg font-medium text-white">
                        {context === "empresa" ? "Flujo de Potencia & Gestión de Carga" : "Flujo de Energía en tu Hogar"}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                      Grado Industrial
                    </span>
                  </div>

                  {/* Flow Steps: Cajas perfectamente centradas en el contenedor (Desktop y Mobile) */}
                  <div className="flex flex-wrap items-stretch justify-center gap-3 sm:gap-3.5">
                    {data.flowSteps.map((step, idx) => {
                      const Icon = step.icon;
                      return (
                        <div
                          key={idx}
                          className="bg-[#0E1013] border border-white/10 rounded-2xl p-3.5 sm:p-4 flex flex-col items-center text-center justify-between relative shadow-sm group hover:border-white/20 transition-all w-[calc(50%-0.5rem)] sm:w-auto sm:flex-1 sm:min-w-[115px] sm:max-w-[155px]"
                        >
                          <div className="flex flex-col items-center w-full">
                            <div
                              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-2.5 flex-shrink-0 shadow-md"
                              style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}35` }}
                            >
                              <Icon className="w-5 h-5" style={{ color: step.color }} />
                            </div>
                            <span className="text-xs sm:text-[13px] font-medium text-white leading-tight mb-1">
                              {step.label}
                            </span>
                            <span className="text-[10px] sm:text-[11px] text-zinc-400 font-light leading-snug">
                              {step.sublabel}
                            </span>
                          </div>
                          <span className="text-[9px] sm:text-[10px] font-mono text-zinc-500 mt-2.5 pt-2 border-t border-white/5 w-full">
                            Paso 0{idx + 1}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 3: Real Scenarios Grid */}
                <div>
                  <div className="mb-3.5 sm:mb-4">
                    <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
                      Casos de Uso Real
                    </span>
                    <h3 className="text-sm sm:text-base md:text-lg font-medium text-white">
                      ¿Cómo responde el sistema en cada situación?
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    {data.scenarios.map((sc, i) => {
                      const SIcon = sc.icon;
                      return (
                        <div
                          key={i}
                          className="p-4 sm:p-5 rounded-2xl bg-[#15171B] border border-white/10 flex items-start gap-3.5 hover:border-white/20 transition-all shadow-md"
                        >
                          <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 flex-shrink-0">
                            <SIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${sc.accent}`} />
                          </div>
                          <div className="space-y-1 flex-1">
                            <h4 className="text-xs sm:text-sm font-semibold text-white">
                              {sc.situation}
                            </h4>
                            <p className="text-[11px] sm:text-xs md:text-sm text-zinc-300 font-light leading-relaxed">
                              {sc.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 4: Highlights / Ventajas Técnicas */}
                <div className="bg-[#15171B]/80 border border-white/10 rounded-2xl p-5 sm:p-6">
                  <h3 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-zinc-300 font-semibold mb-3">
                    Garantías de Ingeniería y Calidad SoldeRío
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    {data.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-200 font-light leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-[#00E599] flex-shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </main>

            {/* Sticky Bottom Action Bar */}
            <footer className="sticky bottom-0 z-30 w-full bg-[#121316]/95 backdrop-blur-xl border-t border-white/10 px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl shrink-0">
              <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 font-light truncate max-w-[200px]">
                <span className="truncate">{data.title}</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 sm:w-auto px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-light transition-colors cursor-pointer text-center"
                >
                  Volver al Cotizador
                </button>

                {onSelect && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(data.id);
                      onClose();
                    }}
                    className="w-1/2 sm:w-auto px-5 py-2.5 rounded-full bg-[#FF8300] hover:bg-[#e07400] text-white text-xs sm:text-sm font-medium transition-all cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(255,131,0,0.5)] flex items-center justify-center gap-1.5"
                  >
                    <span>Elegir esta solución</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
