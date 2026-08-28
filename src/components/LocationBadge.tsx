"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Sun } from "lucide-react";

interface SolarTip {
  title: string;
  description: string;
  stat: string;
}

interface SolarTipEntry {
  keys: string[];
  displayName: string;
  tip: SolarTip;
}

// Database of solar tips matched by commune, city, or region
const SOLAR_TIPS_DATABASE: SolarTipEntry[] = [
  // --- COMUNAS Y CIUDADES ---
  {
    keys: ["osorno"],
    displayName: "Osorno",
    tip: {
      title: "Captación con Nubosidad Altocúmulos",
      description:
        "Osorno registra 1.180 kWh/m² al año. Los módulos N-Type TOPCon bifaciales capturan hasta un 18% adicional de radiación difusa reflejada por prados y nubosidad baja.",
      stat: "+18% Rendimiento Difuso",
    },
  },
  {
    keys: ["valdivia"],
    displayName: "Valdivia",
    tip: {
      title: "Resiliencia Térmica & Autolimpieza Lluvia",
      description:
        "Los 2.000 mm de lluvia anuales remueven automáticamente el polvo. El coeficiente térmico de -0.30%/°C maximiza la potencia en días fríos e iluminados.",
      stat: "99.2% Disponibilidad Anual",
    },
  },
  {
    keys: ["puerto varas", "llanquihue", "frutillar"],
    displayName: "Puerto Varas / Cuenca del Lago",
    tip: {
      title: "Efecto Albedo Lago Llanquihue",
      description:
        "La orientación Norte a 32° aprovecha el reflejo especular sobre el lago, incrementando la generación en las horas de la mañana y atardecer.",
      stat: "+15% Albedo Lacustre",
    },
  },
  {
    keys: ["puerto montt"],
    displayName: "Puerto Montt",
    tip: {
      title: "Respaldo BESS ante Cortes por Temporales",
      description:
        "Sistemas híbridos con baterías LiFePO4 activan el suministro de respaldo (UPS) en menos de 10ms durante ráfagas de viento y cortes de la red pública.",
      stat: "Conmutación <10ms",
    },
  },
  {
    keys: ["temuco", "padre las casas"],
    displayName: "Temuco",
    tip: {
      title: "Inyección Estival & Balance Net Billing",
      description:
        "Con más de 1.350 kWh/m²/año de radiación, la inyección de excedentes en verano genera un saldo a favor en la boleta que compensa el consumo invernal.",
      stat: "Ahorro Anual de hasta 90%",
    },
  },
  {
    keys: ["castro", "ancud", "chiloé", "chiloe"],
    displayName: "Chiloé",
    tip: {
      title: "Protección Marina & Resistencia a Vientos",
      description:
        "Paneles con doble vidrio Templado y estructuras anodizadas con certificación anti-corrosión salina SEC para resistir temporales insulares.",
      stat: "Resistencia Viento 2.400 Pa",
    },
  },
  {
    keys: ["la unión", "la union", "río bueno", "rio bueno", "ranco"],
    displayName: "Cuenca del Ranco",
    tip: {
      title: "Alta Eficiencia en Valles Agrícolas",
      description:
        "Radiación directa óptima en los valles del Ranco para autoconsumo continuo y desacople de alzas tarifarias de las distribuidoras.",
      stat: "Retorno Estimado 5-6 Años",
    },
  },

  // --- REGIONES DEL SUR Y CHILE ---
  {
    keys: ["los lagos", "region de los lagos", "región de los lagos"],
    displayName: "Región de Los Lagos",
    tip: {
      title: "Generación en Clima Templado Austral",
      description:
        "Las bajas temperaturas térmicas de Los Lagos mejoran la conductividad de las celdas solares, entregando hasta 8% mayor potencia instantánea en días despejados.",
      stat: "Eficiencia N-Type 22.5%",
    },
  },
  {
    keys: ["los ríos", "los rios", "region de los ríos", "región de los ríos"],
    displayName: "Región de Los Ríos",
    tip: {
      title: "Eficiencia Fotovoltaica con Nubosidad",
      description:
        "En la Región de Los Ríos, la tecnología bifacial aprovecha la alta proporción de luz difusa ambiental incluso en días nublados o lluviosos.",
      stat: "+15% Captación Difusa",
    },
  },
  {
    keys: ["araucanía", "araucania", "la araucanía", "la araucania"],
    displayName: "Región de La Araucanía",
    tip: {
      title: "Alto Potencial Solar Residencial",
      description:
        "La Araucanía posee una radiación estival promedio de 6.2 kWh/m²/día, ideal para generar excedentes y acumular créditos bajo la Ley Net Billing 21.118.",
      stat: "Ley 21.118 Net Billing",
    },
  },
  {
    keys: ["biobío", "biobio", "ñuble", "nuble"],
    displayName: "Zona Centro-Sur",
    tip: {
      title: "Excelente Irradiación Solar Anual",
      description:
        "La zona centro-sur cuenta con un factor de planta superior al 19%, permitiendo amortizar la inversión solar en plazos acelerados.",
      stat: "Payback 4 a 6 Años",
    },
  },
  {
    keys: ["santiago", "metropolitana", "region metropolitana", "región metropolitana"],
    displayName: "Región Metropolitana",
    tip: {
      title: "Independencia Tarifaria & Autoconsumo",
      description:
        "Protege tu presupuesto familiar ante las constantes alzas tarifarias con una planta conectada a red y monitoreo 24/7 en tu smartphone.",
      stat: "Hasta -90% en Boleta",
    },
  },
];

const GENERAL_CHILE_TIP: SolarTip = {
  title: "Potencial Solar Regional",
  description:
    "Las temperaturas templadas-frías optimizan la generación solar fotovoltaica, permitiendo reducir drásticamente el costo de tu boleta eléctrica.",
  stat: "Certificación Oficial SEC",
};

interface LocationBadgeProps {
  locationText?: string;
  className?: string;
}

export function LocationBadge({ locationText, className = "" }: LocationBadgeProps) {
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Check if a location is already cached in sessionStorage for consistency
    try {
      const cached = sessionStorage.getItem("solderio_user_geo");
      if (cached) {
        setUserLocation(cached);
        return;
      }
    } catch {}

    // 2. If an explicit location prop was passed, use it
    if (locationText) {
      setUserLocation(locationText);
      try {
        sessionStorage.setItem("solderio_user_geo", locationText);
      } catch {}
      return;
    }

    let isMounted = true;

    // 3. Detect location via IP geocoding
    const detectLocation = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

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
            // Only set location if we have at least a region or city
            if (formatted && (data.region || data.city)) {
              setUserLocation(formatted);
              try {
                sessionStorage.setItem("solderio_user_geo", formatted);
              } catch {}
              return;
            }
          }
        }
      } catch {}

      // If location detection fails completely and no region/city could be verified:
      if (isMounted) {
        setUserLocation(null);
      }
    };

    detectLocation();

    return () => {
      isMounted = false;
    };
  }, [locationText]);

  // IF NO LOCATION/REGION CAN BE DETERMINED, DO NOT RENDER THE COMPONENT AT ALL
  if (!userLocation) {
    return null;
  }

  // Find matching solar tip based on location string
  const getSolarTip = (): { tip: SolarTip; communeName: string } => {
    const lowerLoc = userLocation.toLowerCase();
    for (const entry of SOLAR_TIPS_DATABASE) {
      if (entry.keys.some((key) => lowerLoc.includes(key))) {
        return { tip: entry.tip, communeName: entry.displayName };
      }
    }
    const cityName = userLocation.split(",")[0] || "Tu Región";
    return { tip: GENERAL_CHILE_TIP, communeName: cityName };
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

      {/* Popover / Mini Modal Tooltip on Hover (Desktop Only) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block absolute top-full right-0 mt-2.5 w-80 sm:w-84 bg-[#181818]/98 backdrop-blur-2xl text-white p-4.5 rounded-2xl border border-white/15 shadow-[0_16px_50px_rgba(0,0,0,0.7)] z-50 pointer-events-auto"
          >
            {/* Ambient Arrow Indicator */}
            <div className="absolute -top-1.5 right-7 w-3 h-3 bg-[#181818] border-t border-l border-white/15 rotate-45" />

            {/* Header with Icon & Stat Badge */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF8300] font-medium flex items-center gap-1.5 flex-shrink-0">
                <Sun className="w-3.5 h-3.5 text-[#FF8300]" />
                Tip Solar • {communeName}
              </span>
              <span className="text-[9px] bg-[#FF8300]/20 text-[#FF8300] border border-[#FF8300]/30 px-2 py-0.5 rounded-full font-mono font-medium whitespace-nowrap flex-shrink-0">
                {tip.stat}
              </span>
            </div>

            {/* Tip Title */}
            <h4 className="text-sm font-normal text-white mb-1.5 leading-snug">
              {tip.title}
            </h4>

            {/* Tip Description */}
            <p className="text-white/75 text-xs font-light leading-relaxed mb-3">
              {tip.description}
            </p>

            {/* Footer Badge */}
            <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50 font-light">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Validado técnicamente por SoldeRío
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
