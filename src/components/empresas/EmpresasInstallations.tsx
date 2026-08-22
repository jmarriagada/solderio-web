"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

const INSTALLATION_SLIDES = [
  {
    id: "techo",
    title: "Instalación en techo",
    image: "/images/planta-solar-techo-comercial-solderio.jpeg",
    bullets: [
      "ACELERA EL RETORNO DE INVERSIÓN",
      "GENERA DONDE SE CONSUME",
      "IDEAL PARA OPERACIONES DIURNAS",
      "PROTECCIÓN UV PARA EL EDIFICIO",
    ],
  },
  {
    id: "suelo",
    title: "Instalación en suelo / Carport",
    image: "/images/planta-solar-empresas-solderio.jpeg",
    bullets: [
      "MAXIMIZA SUPERFICIE DISPONIBLE",
      "INCLINACIÓN Y ORIENTACIÓN ÓPTIMA",
      "SOMBRA TÉCNICA PARA ESTACIONAMIENTOS",
      "FACILIDAD DE ACCESO Y MANTENIMIENTO",
    ],
  },
];

export function EmpresasInstallations() {
  const [activeSlide, setActiveSlide] = useState(0);

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
            className="object-cover"
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
            <h3 className="text-2xl md:text-3xl font-light tracking-tight mb-4">
              {current.title}
            </h3>
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
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveSlide((prev) => (prev + 1) % INSTALLATION_SLIDES.length)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors"
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
