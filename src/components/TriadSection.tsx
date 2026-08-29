"use client";

import { useState } from "react";
import { Compass, ShieldCheck, Cpu, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useVisitaModal } from "@/context/VisitaModalContext";

export function TriadSection() {
  const [activeTab, setActiveTab] = useState<number>(1);
  const { openModal } = useVisitaModal();

  const pillars = [
    {
      id: "engineering-design",
      icon: Compass,
      iconSrc: "/images/diseno-ingenieria-solar.svg",
      badge: "PRECISIÓN PREVIA",
      title: "Diseño de Ingeniería",
      subtitle: "Modelado 3D y simulación climática real",
      displayHeadline: "Aseguramos la captura solar óptima",
      description: "",
      bullets: [
        "Simulación de generación estacional.",
        "Cálculo de sombreado real con modelamiento 3D dron-based.",
        "Uso de optimizadores según entorno real.",
        "Estudio de factibilidad de inyección bajo Ley Net Billing 21.118.",
      ],
      image: "/images/ingenieria-solar-3d-solderio.jpg",
      imagePosition: "object-right",
      highlight: "Simulación de radiación • Análisis 3D",
    },
    {
      id: "technical-installation",
      icon: ShieldCheck,
      iconSrc: null,
      badge: "RIGOR EN TERRENO",
      title: "Instalación Certificada",
      subtitle: "Seguridad eléctrica y garantías de funcionamiento",
      displayHeadline: "Plantas listas para netbilling",
      description: "",
      bullets: [
        "Gestión técnica de trámites eléctricos TE-1 (eléctrico), TE-4 (solar) y TE-6 (EV).",
        "Medición de puesta a tierra y aislamiento antes de energizar.",
        "Protección contra arcos eléctricos (AFCI) y descargas atmosféricas.",
      ],
      image: "/images/solderio-ingeniero-electrico.jpg",
      imagePosition: "object-center",
      highlight: "Instaladores autorizados SEC",
    },
    {
      id: "eaas-software",
      icon: Cpu,
      iconSrc: null,
      badge: "INTELIGENCIA CONTINUA",
      title: "Software de monitoreo",
      subtitle: "Telemetría 24/7, análisis y post-venta que genera valor",
      displayHeadline: "Software de monitoreo: Telemetría 24/7, análisis y post-venta que genera valor",
      description:
        "Convertimos tu planta solar en un activo digital inteligente. Nuestra plataforma Energy-as-a-Service monitorea generación, consumo e inyección en tiempo real, detectando suciedad o anomalías para desplegar mantenimiento proactivo.",
      bullets: [
        "App móvil y dashboard web con métricas de ahorro en pesos ($ CLP).",
        "Detección predictiva de fallas a nivel módulo.",
        "Operación, mantenimiento (O&M) y soporte técnico continuo 24/7.",
      ],
      image: "/images/solderio-app-plantas-solares-residenciales.jpeg",
      imagePosition: "object-center",
      highlight: "Monitoreo 24/7 • Mantenimiento predictivo",
    },
  ];

  const currentPillar = pillars[activeTab];

  return (
    <section className="bg-transparent py-16 md:py-24 relative overflow-hidden">
      <div className="w-full px-3 md:px-5 box-border">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header with Scroll Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <span className="text-xs md:text-sm font-medium uppercase tracking-widest text-[#FF8300] block mb-3">
              Diseño e implementación
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight mb-4">
              Ecosistemas de generación solar
            </h2>
            <p className="text-brand-muted text-base md:text-lg font-light leading-relaxed">
              Ingeniería que asegura tu suministro eléctrico y la inteligencia que gestiona tu consumo.
            </p>
          </motion.div>

          {/* Interactive Tabs Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8"
          >
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              const isSelected = activeTab === index;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setActiveTab(index)}
                  className={`relative text-left p-5 rounded-[16px] transition-all duration-300 cursor-pointer border ${
                    isSelected
                      ? "bg-[#F7F8FA] border-[#FF8300] shadow-[0_8px_30px_rgba(255,131,0,0.12)] ring-1 ring-[#FF8300]/40 scale-[1.01]"
                      : "bg-white/80 border-black/5 hover:bg-[#F7F8FA] hover:border-black/15 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isSelected
                          ? "bg-[#FF8300] text-white shadow-md"
                          : "bg-black/5 text-[#6B7280]"
                      }`}
                    >
                      {pillar.iconSrc ? (
                        <Image
                          src={pillar.iconSrc}
                          alt={pillar.title}
                          width={20}
                          height={20}
                          className={`w-5 h-5 transition-all ${
                            isSelected ? "brightness-0 invert" : "opacity-70"
                          }`}
                        />
                      ) : (
                        <Icon className="w-5 h-5 stroke-[1.5]" />
                      )}
                    </div>
                    <span className="text-[11px] font-light tracking-wider text-[#6B7280]">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-light text-brand-fg mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-xs md:text-sm text-brand-muted line-clamp-1 font-light">
                    {pillar.subtitle}
                  </p>
                </button>
              );
            })}
          </motion.div>

          {/* Tab Content Display (Always open, smoothly transitions on switch) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPillar.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#F7F8FA] rounded-[24px] border border-black/10 overflow-hidden shadow-xl"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  {/* Left Content Column */}
                  <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between">
                    <div>
                      <div className="inline-block px-3 py-1 rounded-full bg-[#1F1F1F] text-white text-xs font-light tracking-wide mb-4 shadow-sm">
                        {currentPillar.highlight}
                      </div>
                      <h3 className={`text-2xl md:text-3xl font-light text-brand-fg leading-tight ${
                        currentPillar.description ? "mb-2 md:mb-3" : "mb-6 md:mb-8"
                      }`}>
                        {currentPillar.displayHeadline}
                      </h3>
                      {currentPillar.description && (
                        <p className="text-brand-muted text-base leading-relaxed font-light mb-8">
                          {currentPillar.description}
                        </p>
                      )}

                      <div className="space-y-3.5 mb-8">
                        {currentPillar.bullets.map((bullet, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.08 * idx }}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle2 className="w-5 h-5 text-[#FF8300] flex-shrink-0 mt-0.5" />
                            <span className="text-sm md:text-base text-brand-fg/90 font-light">
                              {bullet}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                      <span className="text-xs text-[#6B7280] font-light">
                        Estándares SEC • Certificación Oficial Chile
                      </span>
                    </div>
                  </div>

                  {/* Right Image Column */}
                  <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full border-t lg:border-t-0 lg:border-l border-black/10 overflow-hidden">
                    <Image
                      src={currentPillar.image}
                      alt={currentPillar.title}
                      fill
                      unoptimized
                      priority
                      className={`object-cover ${currentPillar.imagePosition || "object-center"} transition-transform duration-700 hover:scale-105`}
                    />
                  </div>
                </div>
              </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
