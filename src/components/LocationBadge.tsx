"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles, ShieldCheck, Sun } from "lucide-react";

interface SolarTip {
  title: string;
  description: string;
  stat: string;
}

const SOLAR_TIPS_BY_COMMUNE: Record<string, SolarTip> = {
  osorno: {
    title: "Captación con Nubosidad Altocúmulos",
    description:
      "Osorno registra 1.180 kWh/m² al año. Los módulos N-Type TOPCon bifaciales capturan hasta un 18% adicional de radiación difusa reflejada por prados y nubosidad baja.",
    stat: "+18% Rendimiento Difuso",
  },
  valdivia: {
    title: "Resiliencia Térmica & Autolimpieza Lluvia",
    description:
      "Los 2.000 mm de lluvia anuales remueven automáticamente el polvo. El coeficiente térmico de -0.30%/°C maximiza la potencia en días fríos e iluminados.",
    stat: "99.2% Disponibilidad Anual",
  },
  "puerto varas": {
    title: "Efecto Albedo Lago Llanquihue",
    description:
      "La orientación Norte a 32° aprovecha el reflejo especular sobre el lago, incrementando la generación en las horas de la mañana y atardecer.",
    stat: "+15% Albedo Lacustre",
  },
  llanquihue: {
    title: "Efecto Albedo Lago Llanquihue",
    description:
      "La orientación Norte a 32° aprovecha el reflejo especular sobre el lago, incrementando la generación en las horas de la mañana y atardecer.",
    stat: "+15% Albedo Lacustre",
  },
  frutillar: {
    title: "Microclima Lacustre & Vientos Claros",
    description:
      "Bajas temperaturas de operación evitan el sobrecalentamiento del silicio, entregando hasta un 8% más de eficiencia pico que en regiones del norte.",
    stat: "Eficiencia Peak 98.6%",
  },
  "puerto montt": {
    title: "Respaldo BESS ante Cortes por Temporales",
    description:
      "Sistemas híbridos con baterías LiFePO4 activan el suministro de respaldo (UPS) en menos de 10ms durante ráfagas de viento y cortes de la red pública.",
    stat: "Conmutación <10ms",
  },
  temuco: {
    title: "Inyección Estival & Balance Net Billing",
    description:
      "Con más de 1.350 kWh/m²/año de radiación, la inyección de excedentes en verano genera un saldo a favor en la boleta que compensa el consumo invernal.",
    stat: "Ahorro Anual de hasta 90%",
  },
  castro: {
    title: "Protección Marina & Resistencia a Vientos",
    description:
      "Paneles con doble vidrio Templado y estructuras anodizadas con certificación anti-corrosión salina SEC para resistir temporales insulares.",
    stat: "Resistencia Viento 2.400 Pa",
  },
  ancud: {
    title: "Protección Marina & Resistencia a Vientos",
    description:
      "Paneles con doble vidrio Templado y estructuras anodizadas con certificación anti-corrosión salina SEC para resistir temporales insulares.",
    stat: "Resistencia Viento 2.400 Pa",
  },
  "la unión": {
    title: "Alta Eficiencia en Valles Agrícolas",
    description:
      "Radiación directa óptima en los valles del Ranco para autoconsumo continuo y desacople de alzas tarifarias de las distribuidoras.",
    stat: "Retorno Estimado 5-6 Años",
  },
  "río bueno": {
    title: "Alta Eficiencia en Valles Agrícolas",
    description:
      "Radiación directa óptima en los valles del Ranco para autoconsumo continuo y desacople de alzas tarifarias de las distribuidoras.",
    stat: "Retorno Estimado 5-6 Años",
  },
};

const DEFAULT_TIP: SolarTip = {
  title: "Potencial Solar en la Zona Sur",
  description:
    "Las temperaturas templadas-frías del sur evitan pérdidas térmicas en los paneles solares, permitiendo generar energía limpia con alta eficiencia todo el año.",
  stat: "Certificación Oficial SEC",
};

interface LocationBadgeProps {
  locationText?: string;
  className?: string;
}

export function LocationBadge({ locationText, className = "" }: LocationBadgeProps) {
  const [userLocation, setUserLocation] = useState<string>(locationText || "Osorno, Los Lagos");
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (locationText) {
      setUserLocation(locationText);
      return;
    }

    // Check cached location in sessionStorage
    try {
      const cached = sessionStorage.getItem("solderio_user_geo");
      if (cached) {
        setUserLocation(cached);
        return;
      }
    } catch {}

    let isMounted = true;

    const detectLocation = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2200);

        const res = await fetch("https://ipwho.is/", {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data.success && isMounted) {
            const locParts: string[] = [];
            if (data.city) locParts.push(data.city);
            if (data.region) locParts.push(data.region);

            const formatted = locParts.join(", ");
            if (formatted) {
              setUserLocation(formatted);
              try {
                sessionStorage.setItem("solderio_user_geo", formatted);
              } catch {}
              return;
            }
          }
        }
      } catch {}
    };

    detectLocation();

    return () => {
      isMounted = false;
    };
  }, [locationText]);

  // Determine which solar tip applies based on detected location
  const getSolarTip = (): { tip: SolarTip; communeName: string } => {
    const lowerLoc = userLocation.toLowerCase();
    for (const [key, tipData] of Object.entries(SOLAR_TIPS_BY_COMMUNE)) {
      if (lowerLoc.includes(key)) {
        const capitalizedCity = key.charAt(0).toUpperCase() + key.slice(1);
        return { tip: tipData, communeName: capitalizedCity };
      }
    }
    const cityName = userLocation.split(",")[0] || "Tu Comuna";
    return { tip: DEFAULT_TIP, communeName: cityName };
  };

  const { tip, communeName } = getSolarTip();

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Badge Button/Pill */}
      <div className="flex items-center gap-2 text-xs font-light text-white/90 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-sm cursor-pointer hover:bg-white/20 hover:border-[#FF8300]/50 transition-all duration-300 group">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399,0_0_14px_#34d399] animate-pulse" />
        <span className="group-hover:text-white transition-colors">{userLocation}</span>
      </div>

      {/* Popover / Mini Modal Tooltip on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-2 w-72 sm:w-80 bg-[#181818]/95 backdrop-blur-2xl text-white p-4 rounded-2xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.6)] z-50 pointer-events-auto"
          >
            {/* Ambient Arrow Indicator */}
            <div className="absolute -top-1.5 right-6 sm:left-1/2 sm:-translate-x-1/2 w-3 h-3 bg-[#181818] border-t border-l border-white/15 rotate-45" />

            {/* Header with Icon */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF8300] font-medium flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#FF8300]" />
                Tip Solar • {communeName}
              </span>
              <span className="text-[9px] bg-[#FF8300]/20 text-[#FF8300] px-2 py-0.5 rounded-full font-mono font-medium">
                {tip.stat}
              </span>
            </div>

            {/* Tip Title */}
            <h4 className="text-sm font-normal text-white mb-1.5 leading-snug">
              {tip.title}
            </h4>

            {/* Tip Description */}
            <p className="text-white/70 text-xs font-light leading-relaxed mb-3">
              {tip.description}
            </p>

            {/* Footer Badge */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50 font-light">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Validado técnicamente por SoldeRío
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
