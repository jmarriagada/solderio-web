"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { MorphIcon } from "morphicons/react";
import {
  ArrowRight as ArrowRightIconNode,
  ArrowUpRight as ArrowUpRightIconNode,
} from "lucide";

const INSTALLATION_SLIDES = [
  {
    id: "techo",
    title: "Instalación en Techo (Rooftop)",
    image: "/images/planta-solar-en-techo-galpon-valdivia-solderio.jpeg",
    bullets: [
      "ACELERA EL RETORNO DE INVERSIÓN (ROI)",
      "GENERA DONDE SE CONSUME",
      "CERO IMPACTO EN SUPERFICIE DE TERRENO",
      "ESCUDO TÉRMICO Y PROTECCIÓN UV",
    ],
  },
  {
    id: "suelo-netbilling",
    title: "Instalación en Suelo (Netbilling)",
    image: "/images/solar-suelo-netbilling-300kwp-v2.jpg",
    bullets: [
      "AUTOCONSUMO E INYECCIÓN LEY 21.118",
      "POTENCIA HASTA 300 KWP PARA EMPRESAS",
      "APROVECHA TERRENOS ALEDAÑOS A FAENA",
      "TRAMITACIÓN SEC TE-4 EXPEDITA",
    ],
  },
  {
    id: "carport",
    title: "Carport Solar & Electromovilidad",
    image: "/images/solar-carport-comercial-v2.jpg",
    bullets: [
      "PROTECCIÓN Y SOMBRA TÉCNICA VEHICULAR",
      "PLATAFORMA IDEAL PARA CARGADORES EV",
      "ALTO IMPACTO VISUAL Y REPUTACIÓN ESG",
      "MONETIZA ESTACIONAMIENTOS EXISTENTES",
    ],
  },
  {
    id: "bateria",
    title: "Almacenamiento BESS Industrial",
    image: "/images/solar-bess-lecheria-moderna-v2.jpg",
    bullets: [
      "PEAK SHAVING: ELIMINA HORA PUNTA",
      "RESPALDO INSTANTÁNEO STS ANTE CORTES",
      "ARBITRAJE ENERGÉTICO DÍA / NOCHE",
      "ESTABILIZACIÓN DE RED Y MICRORED",
    ],
  },
  {
    id: "offgrid",
    title: "Microred Híbrida Off-Grid",
    image: "/images/solar-offgrid-hibrida-v2.jpg",
    bullets: [
      "REDUCE HASTA 70% CONSUMO DE DIÉSEL",
      "CONTINUIDAD OPERATIVA 24/7 REMOTA",
      "MENOR COSTO Y RIESGO DE COMBUSTIBLE",
      "GESTIÓN INTELIGENTE SOLAR + BESS + DIÉSEL",
    ],
  },
  {
    id: "suelo-parque",
    title: "Instalación en Suelo - Parque Solar (Servicios EPC)",
    image: "/images/solar-suelo-parque-v2.jpg",
    bullets: [
      "MAXIMIZA CAPACIDAD Y ESCALABILIDAD MW",
      "INCLINACIÓN Y AZIMUT ÓPTIMO AL NORTE",
      "VALORIZA TERRENO SUBUTILIZADO EN ACTIVO",
      "FÁCIL ACCESO PARA O&M Y LAVADO",
    ],
  },
];

export function EmpresasInstallations() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isBessHovered, setIsBessHovered] = useState(false);

  const current = INSTALLATION_SLIDES[activeSlide];

  return (
    <section className="w-full relative h-[600px] md:h-[700px] overflow-hidden bg-black">
      {/* Background Image Slider */}
      {INSTALLATION_SLIDES.map((slide, idx) => (
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: idx === activeSlide ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={idx === 0}
            unoptimized
            sizes="100vw"
            className="object-cover object-bottom"
            style={{ objectPosition: "center bottom" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        </motion.div>
      ))}

      {/* Floating Bottom Card Overlay */}
      <div className="absolute bottom-12 left-6 right-6 z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-black/60 backdrop-blur-xl border border-white/15 rounded-[24px] p-6 md:p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Content Block */}
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
              <h3 className="text-2xl md:text-3xl font-light tracking-tight">
                {current.title}
              </h3>
              {current.id === "bateria" && (
                <Link
                  href="/empresas/bess-industrial"
                  onMouseEnter={() => setIsBessHovered(true)}
                  onMouseLeave={() => setIsBessHovered(false)}
                  className="group inline-flex items-center gap-1 text-sm md:text-base font-light text-[#FF8300] hover:text-[#ff9d33] transition-colors py-0.5 cursor-pointer select-none"
                >
                  <span className="font-light">Conoce más</span>
                  <span className="inline-flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                    <MorphIcon
                      icon={isBessHovered ? ArrowUpRightIconNode : ArrowRightIconNode}
                      spring="snappy"
                      size={16}
                      strokeWidth={2}
                    />
                  </span>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] md:text-xs tracking-wider uppercase font-medium text-white/80">
              {current.bullets.map((bullet, i) => (
                <div key={i} className="flex items-center gap-2 border-l border-[#FF8300] pl-3 py-1">
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Progress Controls */}
          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end">
            <span className="text-xs font-mono text-white/50 tracking-wider">
              {String(activeSlide + 1).padStart(2, "0")} / {String(INSTALLATION_SLIDES.length).padStart(2, "0")}
            </span>
            <div className="w-24 md:w-32 h-[2px] bg-white/20 relative rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-[#FF8300]"
                initial={{ width: "0%" }}
                animate={{ width: `${((activeSlide + 1) / INSTALLATION_SLIDES.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSlide((prev) => (prev - 1 + INSTALLATION_SLIDES.length) % INSTALLATION_SLIDES.length)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors"
                aria-label="Slide anterior"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveSlide((prev) => (prev + 1) % INSTALLATION_SLIDES.length)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors"
                aria-label="Slide siguiente"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
