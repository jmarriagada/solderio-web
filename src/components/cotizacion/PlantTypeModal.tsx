"use client";

import React, { useEffect } from "react";
import { 
  X, 
  Sun, 
  Zap, 
  Home, 
  BatteryCharging, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Radio, 
  Fuel, 
  Info,
  DollarSign,
  CloudSun
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type PlantModalType = "hibrida" | "ongrid" | "offgrid";

interface PlantTypeModalProps {
  type: PlantModalType | null;
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

const PLANT_DATA: Record<PlantModalType, PlantDetails> = {
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
};

export function PlantTypeModal({ type, onClose, onSelect }: PlantTypeModalProps) {
  useEffect(() => {
    if (!type) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [type, onClose]);

  if (!type) return null;

  const data = PLANT_DATA[type];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl bg-[#18191B] border border-white/10 rounded-[28px] p-5 sm:p-7 md:p-8 text-white relative shadow-2xl my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer z-10"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="mb-5 sm:mb-6 pr-8">
            <span
              className="text-[11px] sm:text-xs font-mono uppercase tracking-widest font-semibold px-3 py-1 rounded-full inline-block mb-3"
              style={{
                backgroundColor: `${data.badgeColor}20`,
                color: data.badgeColor,
                border: `1px solid ${data.badgeColor}40`,
              }}
            >
              {data.badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-light text-white tracking-tight mb-2">
              {data.title}
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
              {data.subtitle}
            </p>
          </div>

          {/* Simple Explanation Box */}
          <div className="bg-[#0C0E12] border border-white/10 rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6">
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: `${data.badgeColor}15` }}
              >
                <Info className="w-4 h-4" style={{ color: data.badgeColor }} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-white mb-1">
                  ¿Cómo funciona en palabras simples?
                </h4>
                <p className="text-xs sm:text-[13px] text-zinc-300 font-light leading-relaxed">
                  {data.simpleExplanation}
                </p>
              </div>
            </div>
          </div>

          {/* Visual Graphic Flow (Brand-Consistent Diagram) */}
          <div className="bg-[#0C0E12] border border-white/10 rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6">
            <div className="text-center mb-3">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
                Flujo de energía en tu hogar
              </span>
              <div className="h-[1px] bg-white/10 w-full mt-2" />
            </div>

            {/* Horizontal Flow Steps */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:flex md:items-center md:justify-between gap-2.5 sm:gap-3 pt-2">
              {data.flowSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <React.Fragment key={idx}>
                    <div className="bg-[#14161B] border border-white/10 rounded-xl p-2.5 sm:p-3 text-center flex-1 flex flex-col items-center justify-center min-w-[90px] shadow-sm">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center mb-1.5"
                        style={{ backgroundColor: `${step.color}15` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: step.color }} />
                      </div>
                      <span className="text-xs font-medium text-white leading-tight block mb-0.5">
                        {step.label}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-light leading-tight">
                        {step.sublabel}
                      </span>
                    </div>

                    {idx < data.flowSteps.length - 1 && (
                      <div className="hidden md:flex items-center justify-center text-white/30 flex-shrink-0">
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Real Situations (Day, Night, Blackout, Surplus) */}
          <div className="mb-5 sm:mb-6">
            <h4 className="text-xs sm:text-sm font-medium text-white mb-3">
              ¿Qué pasa en cada momento del día?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {data.scenarios.map((sc, i) => {
                const SIcon = sc.icon;
                return (
                  <div
                    key={i}
                    className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5"
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <SIcon className={`w-4 h-4 ${sc.accent}`} />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-white block mb-0.5">
                        {sc.situation}
                      </span>
                      <span className="text-[11px] sm:text-xs text-zinc-400 font-light leading-snug block">
                        {sc.description}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Highlights & Modal Footer */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {data.highlights.map((h, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-zinc-300 font-light">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00E599] flex-shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {onSelect && (
                <button
                  type="button"
                  onClick={() => {
                    onSelect(data.id);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FF8300] hover:bg-[#e07400] text-white text-xs font-medium transition-all cursor-pointer shadow-md text-center"
                >
                  Elegir {data.title}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
