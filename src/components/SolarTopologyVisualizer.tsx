"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, 
  Zap, 
  Power,
  Info,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Play,
  Pause,
  X
} from "lucide-react";
import { useVisitaModal } from "@/context/VisitaModalContext";

type TopologyKey = "ongrid" | "hybrid" | "offgrid";

interface ComponentNode {
  id: string;
  name: string;
  category: "generation" | "conversion" | "storage" | "consumption" | "grid" | "controller";
  position: { top: string; left: string };
  statusText: (mode: TopologyKey, hour: number) => string;
  isActive: (mode: TopologyKey, hour: number) => boolean;
  details: {
    title: string;
    description: (mode: TopologyKey, hour: number) => string;
    specs: string[];
    secNorm: string;
  };
}

// 7 NODES MATCHING 'casa-solar-hibrida-solderio3.jpg' WITH CLEAN NAMES ONLY
const NODES_DATA: ComponentNode[] = [
  {
    id: "solar",
    name: "Arreglo solar",
    category: "generation",
    position: { top: "44.5%", left: "63.5%" },
    statusText: (_, hour) => 
      hour >= 6 && hour <= 19 ? `Generando ${getSolarKW(hour)} kW` : "Sin Radiación (0 kW)",
    isActive: (_, hour) => hour >= 6 && hour <= 19,
    details: {
      title: "Arreglo Fotovoltaico N-Type TOPCon/HJT",
      description: (_, hour) => 
        hour >= 6 && hour <= 19
          ? `Generando ${getSolarKW(hour)} kW de corriente continua (DC) a partir de radiación directa y difusa sobre cubiertas del sur de Chile.`
          : "En horario nocturno no hay generación solar activa; el consumo se cubre mediante batería o red pública.",
      specs: ["Módulos Bifaciales 580W+", "Celdas Monocristalinas N-Type", "Garantía de Potencia 25 Años"],
      secNorm: "Pliego Técnico RIC N°09 (Instalaciones Fotovoltaicas)"
    }
  },
  {
    id: "inversor",
    name: "Inversor",
    category: "conversion",
    position: { top: "60.4%", left: "66.8%" },
    statusText: (mode, hour) => 
      mode === "ongrid" ? (hour >= 6 && hour <= 19 ? "On-Grid • Inversión AC Sincronizada" : "Standby Nocturno") :
      mode === "hybrid" ? "Híbrido Inteligente • Gestión EMS" : "Off-Grid Puro • Grid-Forming",
    isActive: () => true,
    details: {
      title: "Inversor de Potencia & Conversión DC/AC",
      description: (mode) => 
        mode === "ongrid" 
          ? "Convierte la energía DC solar a 220V/50Hz sincronizada con la red. Se desconecta automáticamente ante cortes (Protección Anti-Isla RIC N°15)."
          : mode === "hybrid"
          ? "Gestiona dinámicamente el flujo entre paneles, baterías, casa y red. Conmuta a modo respaldo en menos de 10ms ante blackouts."
          : "Inversor-cargador robusto con capacidad de arranque de motores y bombas. Genera su propia micro-red soberana 220V.",
      specs: ["Eficiencia Peak 98.6%", "Protección AFCI con IA", "Monitoreo 24/7 en App"],
      secNorm: "RIC N°09 y NTSyCS (Coordinador Eléctrico Nacional)"
    }
  },
  {
    id: "battery",
    name: "Baterias",
    category: "storage",
    position: { top: "71.8%", left: "62.6%" },
    statusText: (mode, hour) => 
      mode === "ongrid" ? "No requerida en On-Grid" :
      hour === 7 ? "45% SoC • Cargando con Solar" :
      hour === 13 ? "100% SoC • Llena (Respaldo Máximo)" :
      hour === 19 ? "85% SoC • Descarga Horas Punta (Peak Shaving)" :
      "60% SoC • Respaldo Nocturno",
    isActive: (mode) => mode !== "ongrid",
    details: {
      title: "Banco BESS de Baterías LiFePO4",
      description: (mode, hour) => 
        mode === "ongrid"
          ? "En plantas On-Grid los excedentes se inyectan a la red pública bajo la Ley Net Billing 21.118."
          : mode === "hybrid"
          ? hour >= 18
            ? "Descargando energía acumulada para alimentar la casa durante horas punta, evitando comprar electricidad cara a la distribuidora (Peak Shaving)."
            : "Almacenando excedentes solares diurnos para preparar la reserva energética nocturna y respaldo ante cortes."
          : "Banco masivo dimensionado para otorgar 2 a 3 días de autonomía total sin sol durante temporales invernales en la zona sur.",
      specs: ["+6.000 Ciclos de Vida (15+ años)", "Cero Riesgo Térmico (LiFePO4)", "BMS con Telemetría Celda a Celda"],
      secNorm: "RIC N°09 Sección BESS & Almacenamiento Electroquímico"
    }
  },
  {
    id: "controller",
    name: "Smart Control",
    category: "controller",
    position: { top: "65.1%", left: "56.5%" },
    statusText: (mode) => 
      mode === "hybrid" ? "EMS Activo • Conmutación STS <10ms" : 
      mode === "offgrid" ? "Tablero Distribución Autónomo" : "Tablero Transferencia On-Grid",
    isActive: () => true,
    details: {
      title: "Smart Control • Transferencia & EMS",
      description: (mode) => 
        mode === "hybrid"
          ? "Centro neurálgico de gestión inteligente que coordina la energía hacia las cargas críticas de la casa, cargador EV y red. Conmuta instantáneamente ante blackouts."
          : "Tablero general de control con protecciones diferenciales clase A, automáticos magnetotérmicos y supresores de sobretensión transitoria (SPD).",
      specs: ["Conmutación Estática STS <10ms", "Medidor Inteligente Smart Meter", "Protección SPD Tipo II"],
      secNorm: "Pliego Técnico RIC N°02 (Tableros Eléctricos)"
    }
  },
  {
    id: "ev",
    name: "Carga EV",
    category: "consumption",
    position: { top: "76.5%", left: "43.5%" },
    statusText: (_, hour) => 
      hour >= 9 && hour < 19
        ? "Vehículo fuera del hogar (0 kW)"
        : hour >= 22 || hour <= 6
        ? "Carga Nocturna Programada (7.4 kW)"
        : "Vehículo en Casa • Standby (0 kW)",
    isActive: (_, hour) => !(hour >= 9 && hour < 19),
    details: {
      title: "Cargador Wallbox para Vehículo Eléctrico",
      description: (_, hour) => 
        hour >= 9 && hour < 19
          ? "El vehículo eléctrico se encuentra fuera del hogar durante la jornada laboral diurna (09:00 a 19:00 hrs). El cargador Wallbox se mantiene apagado en modo standby sin consumo."
          : "Cargador Wallbox inteligente gestionado por el inversor para cargar el vehículo de forma segura durante horarios nocturnos o con excedentes de energía.",
      specs: ["Cargador Wallbox 7.4 kW / 22 kW", "Control Dinámico de Carga", "Protocolo OCPP 1.6J"],
      secNorm: "Declaración SEC TE-6 (Infraestructura de Carga para Vehículos Eléctricos)"
    }
  },
  {
    id: "casa",
    name: "Casa",
    category: "consumption",
    position: { top: "56.6%", left: "36.6%" },
    statusText: (_, hour) => `Demanda: ${getHomeConsumption(hour)} kW`,
    isActive: () => true,
    details: {
      title: "Consumo Residencial & Cargas Esenciales",
      description: (mode, hour) => 
        mode === "ongrid"
          ? hour >= 6 && hour <= 17
            ? "Alimentada 100% por energía solar limpia; los excedentes se inyectan a la red."
            : "De noche el consumo es provisto por la red de distribución tradicional."
          : mode === "hybrid"
          ? hour >= 18
            ? "Alimentada 100% por la batería LiFePO4, logrando autonomía y costo $0 durante horas punta."
            : "Abastecida por energía solar directa; excedentes cargan la batería."
          : "Alimentada ininterrumpidamente por la planta solar y banco de baterías 100% soberano.",
      specs: ["Priorización de Cargas Críticas", "Ahorro directo en boleta", "Estabilidad de Voltaje"],
      secNorm: "RIC N°02 (Tableros Eléctricos) y RIC N°10 (Instalaciones de Uso General)"
    }
  },
  {
    id: "grid",
    name: "Red Electrica",
    category: "grid",
    position: { top: "60.5%", left: "89.8%" },
    statusText: (mode, hour) => 
      mode === "offgrid" ? "0% Conexión • Red Desconectada" :
      mode === "ongrid" 
        ? (hour === 13 ? "Inyectando +3.8 kW a Saesa/CGE" : "Extrayendo de Red") :
      (hour === 13 ? "Inyectando Excedentes +2.5 kW" : "Red en Standby (Batería Activa)"),
    isActive: (mode) => mode !== "offgrid",
    details: {
      title: "Red Pública (Saesa / Crell / CGE)",
      description: (mode, hour) => 
        mode === "ongrid"
          ? hour === 13
            ? "Inyectando excedentes solares a la red bajo la Ley 21.118 (Net Billing) para descontar en tu boleta mensual."
            : "Abasteciendo la casa durante horario nocturno o nublado."
          : mode === "hybrid"
          ? hour === 13
            ? "Inyectando energía sobrante tras haber completado la carga del 100% de la batería LiFePO4."
            : "Red en modo standby; la casa opera con baterías evitando consumir energía en horas punta."
          : "En modalidad Off-Grid no existe conexión física al poste ni medidor. Eres 100% soberano y no pagas boletas eléctricas.",
      specs: ["Medidor Bidireccional Inteligente", "Ley Net Billing 21.118", "Trámite SEC TE-4"],
      secNorm: "Ley N° 21.118 y Pliego Técnico RIC N°09"
    }
  }
];

function getSolarKW(hour: number): number {
  if (hour < 6 || hour > 19) return 0;
  if (hour === 6 || hour === 19) return 0.4;
  if (hour === 7 || hour === 18) return 1.5;
  if (hour === 8 || hour === 17) return 2.8;
  if (hour === 9 || hour === 16) return 4.2;
  if (hour === 10 || hour === 15) return 5.4;
  if (hour >= 11 && hour <= 14) return 6.5;
  return 3.0;
}

function getHomeConsumption(hour: number): number {
  if (hour >= 0 && hour <= 5) return 0.6;
  if (hour >= 6 && hour <= 8) return 2.2;
  if (hour >= 9 && hour <= 16) return 1.8;
  if (hour >= 17 && hour <= 21) return 3.6; // Horario Punta
  return 1.4;
}

// Dynamic Energy Flow Breadcrumb Generator
function getFlowBreadcrumbSteps(mode: TopologyKey, hour: number): string[] {
  const isSun = hour >= 6 && hour <= 19;
  const isPeakSun = hour >= 10 && hour <= 16;
  const isEveningPeak = hour >= 17 && hour <= 21;
  const isEvCharging = hour >= 22 || hour <= 6;

  if (mode === "ongrid") {
    if (isPeakSun) {
      return ["Generando", "Consumo de casa", "Inyectando a la red"];
    } else if (isSun) {
      return ["Generando", "Consumo de casa"];
    } else {
      return ["Extrayendo de la red", "Consumo de casa"];
    }
  }

  if (mode === "hybrid") {
    if (isPeakSun) {
      return ["Generando", "Cargando baterías", "Consumo de casa", "Inyectando a la red"];
    } else if (isSun && !isEveningPeak) {
      return ["Generando", "Consumo de casa", "Cargando baterías"];
    } else if (isEveningPeak) {
      return ["Baterías descargando", "Consumo de casa"];
    } else if (isEvCharging) {
      return ["Baterías descargando", "Consumo de casa", "Carga EV"];
    } else {
      return ["Baterías descargando", "Consumo de casa"];
    }
  }

  if (mode === "offgrid") {
    if (isPeakSun) {
      return ["Generando", "Cargando baterías", "Consumo de casa"];
    } else if (isSun) {
      return ["Generando", "Consumo de casa", "Cargando baterías"];
    } else if (isEvCharging) {
      return ["Baterías descargando", "Consumo de casa", "Carga EV"];
    } else {
      return ["Baterías descargando", "Consumo de casa"];
    }
  }

  return ["Generando", "Consumo de casa"];
}

interface SolarTopologyVisualizerProps {
  showExplanationDetails?: boolean;
}

export function SolarTopologyVisualizer({
  showExplanationDetails = true,
}: SolarTopologyVisualizerProps = {}) {
  const [activeTab, setActiveTab] = useState<TopologyKey>("hybrid");
  const [selectedHour, setSelectedHour] = useState<number>(13);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<ComponentNode | null>(null);
  const { openModal } = useVisitaModal();

  const currentSolarKW = getSolarKW(selectedHour);
  const currentHomeKW = getHomeConsumption(selectedHour);
  const flowSteps = useMemo(() => getFlowBreadcrumbSteps(activeTab, selectedHour), [activeTab, selectedHour]);

  // Automatic Smooth Simulation Player (Slow & Smooth cycle through 24h)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSelectedHour((prev) => (prev >= 24 ? 0 : prev + 1));
    }, 1800); // 1.8 seconds per hour step for calm, clear visual transition
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Car presence based on hour of day (Vehicle is away between 09:00 and 19:00)
  const isCarPresent = selectedHour < 9 || selectedHour >= 19;

  // Dynamic Atmospheric Filter & Ambient Overlay based on time of day
  const timeAtmosphere = useMemo(() => {
    if (selectedHour >= 11 && selectedHour <= 15) {
      return {
        filter: "brightness(1.08) contrast(1.04) saturate(1.08)",
        ambientOverlay: "bg-gradient-to-b from-amber-500/10 via-transparent to-black/30",
        label: "Mediodía (Radiación Máxima)"
      };
    } else if (selectedHour >= 6 && selectedHour <= 10) {
      return {
        filter: "brightness(0.96) contrast(1.02) saturate(1.05) sepia(0.08)",
        ambientOverlay: "bg-gradient-to-b from-orange-500/15 via-transparent to-black/40",
        label: "Mañana (Amanecer & Carga)"
      };
    } else if (selectedHour >= 16 && selectedHour <= 19) {
      return {
        filter: "brightness(0.82) contrast(1.1) saturate(1.15) hue-rotate(-8deg)",
        ambientOverlay: "bg-gradient-to-b from-orange-600/25 via-amber-900/15 to-black/60",
        label: "Tarde (Horas Punta & Descarga)"
      };
    } else {
      return {
        filter: "brightness(0.55) contrast(1.22) saturate(0.8) hue-rotate(185deg)",
        ambientOverlay: "bg-gradient-to-b from-blue-950/60 via-indigo-950/40 to-black/80",
        label: "Noche (Respaldo Batería BESS)"
      };
    }
  }, [selectedHour]);

  const topologies = {
    ongrid: {
      badge: "CONECTADA A LA RED",
      title: "Planta Solar On-Grid",
      tagline: "Autoconsumo directo y venta de excedentes a la distribuidora (Ley Net Billing 21.118).",
      characteristics: [
        { label: "Respaldo ante Cortes", value: "Sin Respaldo (Anti-Isla)", note: "Se apaga por seguridad de la red", alert: true },
        { label: "Venta de Excedentes", value: "100% Habilitada", note: "Abono directo en tu boleta", alert: false },
        { label: "Baterías BESS", value: "No requeridas", note: "Menor costo de inversión inicial", alert: false },
        { label: "Certificación SEC", value: "TE-1 + TE-4", note: "Tramitación oficial ante la SEC", alert: false },
      ],
      flowSummary: "Los paneles solares generan en corriente continua (DC), el inversor la transforma en corriente alterna (AC) para abastecer los consumos de la propiedad en tiempo real. La energía sobrante pasa por el medidor bidireccional y se inyecta a la red eléctrica pública (Saesa, Crell o CGE), generando saldo a tu favor.",
      idealFor: "Casas y empresas en zonas urbanas o suburbanas con red eléctrica estable que buscan maximizar el retorno de inversión y reducir su boleta a cero."
    },
    hybrid: {
      badge: "MÁS POPULAR & RESILIENTE",
      title: "Planta Solar Híbrida",
      tagline: "Ecosistema integral: Genera, consume, almacena en baterías LiFePO4, inyecta y respalda ante cortes.",
      characteristics: [
        { label: "Respaldo ante Cortes", value: "Continuidad <10ms (UPS)", note: "Tus luces y equipos no se apagan", alert: false },
        { label: "Venta de Excedentes", value: "100% Habilitada (TE-4)", note: "Inyecta tras llenar baterías", alert: false },
        { label: "Baterías BESS", value: "LiFePO4 +6.000 ciclos", note: "Zero riesgo térmico y alta duración", alert: false },
        { label: "Certificación SEC", value: "TE-1 + TE-4 + TE-6", note: "Planta + Almacenamiento + EV", alert: false },
      ],
      flowSummary: "El inversor híbrido inteligente prioriza el consumo del hogar. El excedente solar carga el banco de baterías LiFePO4. Una vez cargadas al 100%, el sobrante se inyecta a la red bajo Ley Net Billing. Si ocurre un temporal y se corta la red pública, el sistema conmuta en menos de 10ms para mantener tu hogar 100% operativo.",
      idealFor: "Hogares y parcelas del sur de Chile expuestos a temporales, caídas de postes y cortes de luz recurrentes, que valoran la seguridad de su familia y la continuidad operativa."
    },
    offgrid: {
      badge: "100% AUTÓNOMA & SOBERANA",
      title: "Planta Solar Off-Grid",
      tagline: "Suministro eléctrico total e independiente para parcelas, islas o zonas rurales sin red eléctrica.",
      characteristics: [
        { label: "Dependencia de Red", value: "0% Dependencia", note: "Sin boletas ni cobros mensuales", alert: false },
        { label: "Autonomía Invernal", value: "2 a 3 Días Solar", note: "Banco sobredimensionado LFP", alert: false },
        { label: "Respaldo Auxiliar", value: "Generador ATS", note: "Encendido automático programado", alert: false },
        { label: "Certificación SEC", value: "TE-1 Aislada", note: "Declaración de instalación interior", alert: false },
      ],
      flowSummary: "Genera energía solar que abastece las cargas (consumo) y carga el banco de baterías. El inversor-cargador opera en modo Grid-Forming generando su propia red de 220V. En caso de temporales extremos de varios días continuos, puedes respaldarte con un generador (recomendamos a diesel).",
      idealFor: "Parcelaciones rurales, refugios, centros turísticos y fundos en el sur de Chile donde el costo de extender la línea eléctrica de media tensión es prohibitivo."
    }
  };

  const currentTopology = topologies[activeTab];

  // Flow State logic based on Mode & Hour
  const isBatteryDischarging = activeTab !== "ongrid" && selectedHour >= 17;
  const isGridExporting = activeTab !== "offgrid" && selectedHour >= 10 && selectedHour <= 16;
  const isGridImporting = activeTab === "ongrid" && (selectedHour < 6 || selectedHour > 19);

  return (
    <section className="bg-transparent w-full pt-16 md:pt-24 pb-0 relative text-white">
      {/* 1. Header Section (100% Transparent Background matching the rest of the site) */}
      <div className="w-full px-3 md:px-5 box-border mb-10 md:mb-12">
        <div className="max-w-[1400px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Clean badge without background, border, or icon */}
            <span className="text-xs md:text-sm font-medium uppercase tracking-widest text-[#FF8300] block mb-3">
              Simulador Interactivo
            </span>

            <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] mb-4 tracking-tight">
              Tipos de planta y flujo de energía
            </h2>
            <p className="text-[#6B7280] text-sm md:text-base leading-relaxed font-light max-w-3xl mx-auto">
              Simula el comportamiento de una planta fotovoltaica a lo largo del día. Selecciona el tipo de planta y ajusta la hora para ver cómo interactúan los equipos.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mobile-Only Plant Type Selector (Visible on screens < md) */}
      <div className="w-full px-4 box-border mb-8 block md:hidden">
        <div className="max-w-md mx-auto flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#1F1F1F] border border-black/10 shadow-lg">
          {(["ongrid", "hybrid", "offgrid"] as TopologyKey[]).map((mode) => {
            const isModeActive = activeTab === mode;
            const modeLabel = mode === "ongrid" ? "On-Grid" : mode === "hybrid" ? "Híbrida" : "Off-Grid";
            return (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setActiveTab(mode);
                  setSelectedNode(null);
                }}
                className={`relative flex-1 py-2.5 rounded-xl text-xs font-light transition-all cursor-pointer text-center select-none ${
                  isModeActive ? "text-white font-medium" : "text-white/60 hover:text-white"
                }`}
              >
                {isModeActive && (
                  <motion.div
                    layoutId="activeTabMobilePill"
                    className="absolute inset-0 bg-[#FF8300] rounded-xl shadow-md -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span>{modeLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Telemetry Bar (Desktop Only) */}
      <div className="w-full px-3 md:px-5 box-border mb-10 md:mb-12 hidden md:block">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#F7F8FA] p-5 rounded-2xl border border-black/5 hover:border-[#FF8300]/40 transition-all flex items-center justify-between shadow-sm hover:shadow-md">
            <div>
              <div className="text-[13px] text-[#6B7280] font-light mb-1">Generación Solar</div>
              <div className="text-base sm:text-lg font-normal text-[#1F1F1F]">
                {currentSolarKW > 0 ? (
                  <span className="text-[#FF8300] font-normal">{currentSolarKW.toFixed(1)} kW</span>
                ) : (
                  <span>0.0 kW (0%)</span>
                )}
              </div>
            </div>
            <Sun className={`w-5 h-5 ${currentSolarKW > 0 ? "text-[#FF8300] animate-spin" : "text-black/25"}`} style={{ animationDuration: "16s" }} />
          </div>

          <div className="bg-[#F7F8FA] p-5 rounded-2xl border border-black/5 hover:border-[#FF8300]/40 transition-all flex items-center justify-between shadow-sm hover:shadow-md">
            <div>
              <div className="text-[13px] text-[#6B7280] font-light mb-1">Consumo Hogar</div>
              <div className="text-base sm:text-lg font-normal text-[#1F1F1F]">
                {currentHomeKW.toFixed(1)} kW
              </div>
            </div>
            <Activity className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="bg-[#F7F8FA] p-5 rounded-2xl border border-black/5 hover:border-[#FF8300]/40 transition-all flex items-center justify-between shadow-sm hover:shadow-md">
            <div>
              <div className="text-[13px] text-[#6B7280] font-light mb-1">Estado Batería (BESS)</div>
              <div className="text-base sm:text-lg font-normal text-[#1F1F1F]">
                {activeTab === "ongrid" ? "N/A (Sin Batería)" : selectedHour >= 11 && selectedHour <= 16 ? "100% (Llena)" : selectedHour >= 17 ? "85% (Descarga)" : "50% (Carga)"}
              </div>
            </div>
            <Zap className={`w-5 h-5 ${activeTab === "ongrid" ? "text-black/25" : "text-[#FF8300]"}`} />
          </div>

          <div className="bg-[#F7F8FA] p-5 rounded-2xl border border-black/5 hover:border-[#FF8300]/40 transition-all flex items-center justify-between shadow-sm hover:shadow-md">
            <div>
              <div className="text-[13px] text-[#6B7280] font-light mb-1">Red Eléctrica</div>
              <div className="text-base sm:text-lg font-normal text-[#1F1F1F]">
                {activeTab === "offgrid" ? "0% (Aislada)" : activeTab === "ongrid" ? (currentSolarKW > currentHomeKW ? `+${(currentSolarKW - currentHomeKW).toFixed(1)} kW Inyección` : `-${(currentHomeKW - currentSolarKW).toFixed(1)} kW Extracción`) : (currentSolarKW > currentHomeKW ? `+${(currentSolarKW - currentHomeKW).toFixed(1)} kW Inyección` : "0 kW (Standby)")}
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>

        </div>
      </div>

      {/* 3. FULL-WIDTH ISOMETRIC 3D BLUEPRINT CANVAS WITH TRUE STICKY SCROLLING CONTROLS (Desktop Only) */}
      <div className="w-full relative border-b border-white/15 bg-black hidden md:block">
        
        {/* Canvas Relative Container */}
        <div className="relative w-full aspect-[16/9] min-h-[540px] sm:min-h-[640px] lg:min-h-[740px]">
          
          {/* STICKY CONTROLS LAYER: Mode Selector (Left) + Center Flow Breadcrumb + Time Slider & Play (Right) */}
          <div className="sticky top-20 md:top-24 z-30 pointer-events-none w-full px-4 sm:px-8 pt-4 sm:pt-6 flex flex-col lg:flex-row items-center justify-between gap-3">
            
            {/* Top-Left: Mode Selector Tabs (No numbering, Satoshi light) */}
            <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 shadow-2xl">
              {(["ongrid", "hybrid", "offgrid"] as TopologyKey[]).map((mode) => {
                const isModeActive = activeTab === mode;
                const modeLabel = mode === "ongrid" ? "On-Grid" : mode === "hybrid" ? "Híbrida" : "Off-Grid";
                return (
                  <button
                    key={mode}
                    onClick={() => { setActiveTab(mode); setSelectedNode(null); }}
                    className={`relative z-10 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-light transition-all cursor-pointer select-none ${
                      isModeActive ? "text-white font-light" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {isModeActive && (
                      <motion.div
                        layoutId="activeTabInternalPill"
                        className="absolute inset-0 bg-[#FF8300] rounded-lg shadow-md -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span>{modeLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Center: Dynamic Flow Sequence Ticker */}
            <div className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 shadow-2xl text-xs font-light text-white overflow-x-auto max-w-full">
              {flowSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
                  {idx > 0 && <span className="text-[#FF8300] font-light opacity-80">&gt;</span>}
                  <span className={idx === 0 ? "text-[#FF8300] font-light" : "text-white/90 font-light"}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            {/* Top-Right: Continuous 24h Time Slider Bar + Play/Pause Auto Simulation */}
            <div className="pointer-events-auto flex items-center gap-2.5 sm:gap-3 bg-black/85 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-white/20 shadow-2xl">
              
              {/* Play/Pause Auto-Simulation Button */}
              <button
                type="button"
                onClick={() => setIsPlaying((prev) => !prev)}
                className="w-7 h-7 rounded-lg bg-[#FF8300]/20 hover:bg-[#FF8300] text-[#FF8300] hover:text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                title={isPlaying ? "Pausar simulación horaria" : "Reproducir simulación 24h automática"}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </button>

              <Clock className="w-4 h-4 text-[#FF8300] flex-shrink-0 hidden xs:block" />

              <input
                type="range"
                min="0"
                max="24"
                step="1"
                value={selectedHour}
                onChange={(e) => setSelectedHour(Number(e.target.value))}
                className="w-20 sm:w-32 md:w-44 accent-[#FF8300] cursor-pointer bg-white/20 h-1.5 rounded-lg"
              />
              <span className="text-xs sm:text-sm font-light text-white min-w-[54px] text-right">
                {String(selectedHour).padStart(2, "0")}:00 hrs
              </span>
            </div>

          </div>

          {/* 1. Image with Parked Vehicle (Active before 9:00 and after 19:00) */}
          <div 
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${isCarPresent ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            style={{ filter: timeAtmosphere.filter }}
          >
            <Image
              src="/images/ilustracion-planta-solar-solderio-2026.jpg"
              alt="Ilustración Planta Solar SoldeRío 2026 - Con Vehículo"
              fill
              priority
              unoptimized
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover object-center select-none"
            />
          </div>

          {/* 2. Image with Empty Driveway (Vehicle is Away between 09:00 and 19:00) */}
          <div 
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${!isCarPresent ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            style={{ filter: timeAtmosphere.filter }}
          >
            <Image
              src="/images/ilustracion-planta-solar-sin-auto.jpg"
              alt="Ilustración Planta Solar SoldeRío 2026 - Sin Vehículo (09:00 a 19:00 hrs)"
              fill
              priority
              unoptimized
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover object-center select-none"
            />
          </div>

          {/* Dynamic Day/Night Atmospheric Ambient Overlay */}
          <div className={`absolute inset-0 ${timeAtmosphere.ambientOverlay} transition-colors duration-700 pointer-events-none`} />

          {/* SVG CONTINUOUS 3PX SOLID FLOW LINES WITH SLOW GLOW STREAKS (DESTELLOS DE FLUJO) */}
          <svg 
            viewBox="0 0 1024 576" 
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
          >
            <defs>
              {/* Soft Ambient Glow Filters */}
              <filter id="softGlowOrange" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#FF8300" floodOpacity="0.8" />
              </filter>
              <filter id="softGlowGreen" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#10B981" floodOpacity="0.8" />
              </filter>
              <filter id="softGlowBlue" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#3B82F6" floodOpacity="0.8" />
              </filter>

              {/* Base line colors */}
              <linearGradient id="solidSolarLine" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF7A00" />
                <stop offset="100%" stopColor="#FFA040" />
              </linearGradient>
              <linearGradient id="solidAcLine" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>
              <linearGradient id="solidGridLine" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#60A5FA" />
              </linearGradient>

              {/* Bright Flow Flash (Destello) Gradients */}
              <linearGradient id="flashSolar" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFF3E0" />
                <stop offset="50%" stopColor="#FF9800" />
                <stop offset="100%" stopColor="#FF5722" />
              </linearGradient>
              <linearGradient id="flashGreen" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E8F8F5" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="flashBlue" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#EBF5FB" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
            </defs>

            {/* 1. ORANGE LINE: Arreglo solar -> Inversor (Max 3px stroke + Slow Flash Streak) */}
            {currentSolarKW > 0 && (
              <>
                {/* Continuous 2.5px Base Wire */}
                <path
                  d="M 635 262 L 684 287 L 684 348"
                  fill="none"
                  stroke="url(#solidSolarLine)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity="0.4"
                />

                {/* Slow Glowing Flow Flash Streak */}
                <path
                  d="M 635 262 L 684 287 L 684 348"
                  fill="none"
                  stroke="url(#flashSolar)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="26 180"
                  filter="url(#softGlowOrange)"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-206"
                    dur="5.5s"
                    repeatCount="indefinite"
                  />
                </path>
              </>
            )}

            {/* 2. GREEN LINE - Segment A: Inversor <-> Baterías */}
            {activeTab !== "ongrid" && (
              <>
                <path
                  d="M 684 348 L 684 414 L 641 414"
                  fill="none"
                  stroke="url(#solidAcLine)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity="0.4"
                />

                {/* Destello de flujo: Carga (Inversor -> Batería) vs Descarga (Batería -> Inversor) */}
                {!isBatteryDischarging ? (
                  <path
                    d="M 684 348 L 684 414 L 641 414"
                    fill="none"
                    stroke="url(#flashGreen)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="24 160"
                    filter="url(#softGlowGreen)"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-160"
                      dur="5.0s"
                      repeatCount="indefinite"
                    />
                  </path>
                ) : (
                  <path
                    d="M 684 348 L 684 414 L 641 414"
                    fill="none"
                    stroke="url(#flashSolar)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="24 160"
                    filter="url(#softGlowOrange)"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="-160"
                      to="0"
                      dur="5.0s"
                      repeatCount="indefinite"
                    />
                  </path>
                )}
              </>
            )}

            {/* 3. GREEN LINE - Segment B: Baterías -> Controller */}
            {activeTab !== "ongrid" && (
              <>
                <path
                  d="M 641 414 L 578 414 L 578 375"
                  fill="none"
                  stroke="url(#solidAcLine)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity="0.4"
                />

                <path
                  d="M 641 414 L 578 414 L 578 375"
                  fill="none"
                  stroke="url(#flashGreen)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="22 150"
                  filter="url(#softGlowGreen)"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-150"
                    dur="5.0s"
                    repeatCount="indefinite"
                  />
                </path>
              </>
            )}

            {/* In On-Grid mode: Direct link Inversor -> Controller */}
            {activeTab === "ongrid" && (
              <>
                <path
                  d="M 684 348 L 684 414 L 578 414 L 578 375"
                  fill="none"
                  stroke="url(#solidAcLine)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity="0.4"
                />
                {currentSolarKW > 0 && (
                  <path
                    d="M 684 348 L 684 414 L 578 414 L 578 375"
                    fill="none"
                    stroke="url(#flashGreen)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="24 180"
                    filter="url(#softGlowGreen)"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-210"
                      dur="5.5s"
                      repeatCount="indefinite"
                    />
                  </path>
                )}
              </>
            )}

            {/* 4. GREEN LINE - Segment C: Controller -> Casa (Max 3px + Calm Slow Flow Flash) */}
            <path
              d="M 578 375 L 545 375 L 440 326 L 375 326"
              fill="none"
              stroke="url(#solidAcLine)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.45"
            />
            <path
              d="M 578 375 L 545 375 L 440 326 L 375 326"
              fill="none"
              stroke="url(#flashGreen)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="28 240"
              filter="url(#softGlowGreen)"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-268"
                dur="6.5s"
                repeatCount="indefinite"
              />
            </path>

            {/* 5. GREEN LINE - Segment D: Controller -> Carga EV (Active only when car is home: < 9h or >= 19h) */}
            <path
              d="M 578 375 L 578 426 L 450 426 L 450 440"
              fill="none"
              stroke="url(#solidAcLine)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={isCarPresent ? 0.4 : 0.1}
            />
            {isCarPresent && (selectedHour >= 22 || selectedHour <= 6) && (
              <path
                d="M 578 375 L 578 426 L 450 426 L 450 440"
                fill="none"
                stroke="url(#flashGreen)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="24 200"
                filter="url(#softGlowGreen)"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-224"
                  dur="6.0s"
                  repeatCount="indefinite"
                />
              </path>
            )}

            {/* 6. BLUE LINE: Controller <-> Red Eléctrica (Off-Grid Mode has NO line at all) */}
            {activeTab !== "offgrid" ? (
              <>
                {/* Continuous 2.5px Solid Blue Line */}
                <path
                  d="M 578 375 L 578 468 L 684 510 L 928 404 L 960 368 L 960 52 L 988 62"
                  fill="none"
                  stroke="url(#solidGridLine)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity="0.4"
                />

                {/* Slow Flash Direction 1: Exporting to grid (Daytime 10h-16h) */}
                {isGridExporting && (
                  <path
                    d="M 578 375 L 578 468 L 684 510 L 928 404 L 960 368 L 960 52 L 988 62"
                    fill="none"
                    stroke="url(#flashBlue)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="35 320"
                    filter="url(#softGlowBlue)"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-710"
                      dur="9.5s"
                      repeatCount="indefinite"
                    />
                  </path>
                )}

                {/* Slow Flash Direction 2: Importing from grid at night in On-Grid */}
                {isGridImporting && (
                  <path
                    d="M 578 375 L 578 468 L 684 510 L 928 404 L 960 368 L 960 52 L 988 62"
                    fill="none"
                    stroke="url(#flashBlue)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="35 320"
                    filter="url(#softGlowBlue)"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="-710"
                      to="0"
                      dur="9.5s"
                      repeatCount="indefinite"
                    />
                  </path>
                )}
              </>
            ) : null}
          </svg>

          {/* DYNAMIC INTERACTIVE PINS (NAME ONLY, SATOSHI LIGHT) */}
          {NODES_DATA.map((node) => {
            const active = node.isActive(activeTab, selectedHour);
            const isSelected = selectedNode?.id === node.id;

            return (
              <div
                key={node.id}
                style={{ top: node.position.top, left: node.position.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedNode(isSelected ? null : node)}
                  className={`relative px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-light tracking-wide transition-all duration-300 shadow-2xl cursor-pointer select-none ${
                    !active
                      ? "bg-black/80 text-white/40 border border-white/10 opacity-40"
                      : isSelected
                      ? "bg-[#FF8300] text-white border border-white font-light ring-4 ring-[#FF8300]/50 scale-105"
                      : "bg-black/90 hover:bg-black text-white border border-white/30 hover:border-[#FF8300]"
                  }`}
                >
                  <span className="whitespace-nowrap font-light">{node.name}</span>
                </motion.button>
              </div>
            );
          })}

          {/* Floating Details HUD Card inside Canvas on click */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-8 sm:max-w-md bg-[#1F1F1F]/95 backdrop-blur-2xl text-white p-5 sm:p-6 rounded-2xl border border-white/15 shadow-2xl z-30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-light uppercase tracking-widest text-[#FF8300] block mb-1">
                      {selectedNode.statusText(activeTab, selectedHour)}
                    </span>
                    <h4 className="text-base sm:text-lg font-light text-white">
                      {selectedNode.details.title}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedNode(null)}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#FF8300] text-white/70 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm flex-shrink-0 ml-3"
                    title="Cerrar"
                    aria-label="Cerrar detalles"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2]" />
                  </button>
                </div>

                <p className="text-white/80 text-xs sm:text-sm font-light leading-relaxed mb-4">
                  {selectedNode.details.description(activeTab, selectedHour)}
                </p>

                <div className="space-y-1.5 mb-4 border-t border-white/10 pt-3">
                  {selectedNode.details.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 text-xs text-white/90 font-light">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8300] flex-shrink-0" />
                      <span className="font-light">{spec}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-black/30 px-3 py-2 rounded-xl border border-white/10 flex items-center justify-between text-[11px] text-white/70">
                  <span className="font-light text-[#FF8300]">Norma SEC:</span>
                  <span className="font-light">{selectedNode.details.secNorm}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Full-width Helper Footer Bar */}
        <div className="bg-[#1F1F1F] px-6 py-3 border-t border-white/10 flex items-center justify-between text-[13px] text-white/60 font-light">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#FF8300]" />
            <span className="font-light">Haz clic en los pines sobre la imagen para inspeccionar cada componente en tiempo real.</span>
          </div>
        </div>
      </div>

      {/* 4. Technical Summary & Diagnostic Matrix with Dark Footer-like Background (#141414) */}
      {showExplanationDetails && (
        <div className="w-full bg-[#141414] py-14 md:py-20 border-t border-white/10 mt-0">
          <div className="w-full px-3 md:px-5 box-border">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Col: Mode Overview & Narrative (7 cols) */}
              <div className="lg:col-span-7 bg-[#1F1F1F] p-8 md:p-9 rounded-[24px] border border-white/10 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs tracking-wider text-[#FF8300] font-light uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8300]" />
                      {currentTopology.badge}
                    </span>
                    <span className="text-xs text-white/50 font-light">
                      Ingeniería SoldeRío
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-light text-white mb-3">
                    {currentTopology.title}
                  </h3>
                  <p className="text-white/70 text-sm md:text-base leading-relaxed font-light mb-6">
                    {currentTopology.tagline}
                  </p>

                  {/* Energy Flow Narrative */}
                  <div className="bg-black/40 p-5 rounded-2xl border border-white/10 mb-6">
                    <h5 className="text-xs uppercase tracking-wider text-white mb-2 font-light flex items-center gap-1.5">
                      <Power className="w-3.5 h-3.5 text-[#FF8300]" />
                      Dinámica de Flujo Energético
                    </h5>
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                      {currentTopology.flowSummary}
                    </p>
                  </div>

                  {/* Ideal For Box */}
                  <div className="text-xs sm:text-sm text-white font-light flex items-start gap-2.5">
                    <span className="text-[#FF8300] whitespace-nowrap font-light">Ideal para:</span>
                    <span className="text-white/70 font-light">{currentTopology.idealFor}</span>
                  </div>
                </div>

                {/* Bottom Action inside Left Col */}
                <div className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => openModal()}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#FF8300] text-white text-xs font-light uppercase tracking-wider hover:bg-[#e07400] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(255,131,0,0.5)]"
                  >
                    <span className="font-light">Solicitar Factibilidad {currentTopology.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] text-white/50 font-light">
                    Pre-evaluación en 24 horas
                  </span>
                </div>
              </div>

              {/* Right Col: 4 KPI Cards Matrix (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {currentTopology.characteristics.map((char, cIdx) => (
                  <div
                    key={cIdx}
                    className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                      char.alert
                        ? "bg-amber-950/30 border-amber-500/40 text-amber-200"
                        : "bg-[#1F1F1F] border-white/10 hover:border-[#FF8300]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-white/60 font-light">
                        {char.label}
                      </span>
                      {char.alert ? (
                        <XCircle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-[#FF8300]" />
                      )}
                    </div>
                    <div className="text-base sm:text-lg font-light text-white mb-1">
                      {char.value}
                    </div>
                    <div className="text-[11px] text-white/50 font-light">
                      {char.note}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
