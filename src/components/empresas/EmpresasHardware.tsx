"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { useState } from "react";

const HARDWARE_ITEMS = [
  {
    id: "controlador",
    title: "Controlador de módulos",
    description: "Libera el máximo potencial de cada panel, de forma inteligente y segura.",
    footnote: "Se usa en paneles con sombreamientos parciales.",
    image: "/images/optimizer-sun2000-450w-p2-600w-p.png",
  },
  {
    id: "inversor",
    title: "Inversor de energía",
    description: "Alta eficiencia en la conversión eléctrica de generación al consumo.",
    footnote: "Convierte la corriente DC en AC de forma sincronizada.",
    image: "/images/inverter-sun2000-5-6-8-10-12k-map0.png",
  },
  {
    id: "bateria",
    title: "Banco de baterías",
    description: "Almacena y entrega su energía de forma inteligente para la noche y ante cortes de suministro.",
    footnote: "Carga, entrega y respalda sincronizada.",
    image: "/images/bateria-luna2000-7-14-21-s1.png",
  },
];

export function EmpresasHardware() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HARDWARE_ITEMS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HARDWARE_ITEMS.length) % HARDWARE_ITEMS.length);
  };

  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-24 bg-[#F7F8FA] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 max-w-3xl"
        >
          <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight leading-[1.1] mb-6">
            Gestión inteligente de energía
          </h2>
          <p className="text-base md:text-lg text-black/60 font-light leading-relaxed">
            Descubre la ingeniería detrás de un sistema SoldeRío. Una selección que maximiza la generación solar en nubosidad, que prioriza el autoconsumo solar y que mantiene encendida tu empresa durante cortes.
          </p>
        </motion.div>

        {/* Hardware Showcase Carousel */}
        <div className="relative w-full mb-12">
          {/* Controls */}
          <div className="flex items-center justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0 z-10 pointer-events-none px-2">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white/80 border border-black/10 backdrop-blur-md flex items-center justify-center text-black/70 hover:text-black hover:bg-white transition-all shadow-md pointer-events-auto"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white/80 border border-black/10 backdrop-blur-md flex items-center justify-center text-black/70 hover:text-black hover:bg-white transition-all shadow-md pointer-events-auto"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HARDWARE_ITEMS.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="bg-[#F7F8FA] rounded-[24px] p-8 border border-black/5 flex flex-col items-center text-center group hover:shadow-lg transition-all"
              >
                <div className="relative w-full h-48 mb-6 flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-normal text-[#1F1F1F] mb-2">{item.title}</h3>
                <p className="text-sm text-black/60 font-light leading-relaxed mb-4">
                  {item.description}
                </p>
                <span className="mt-auto text-xs text-black/40 font-light italic">
                  {item.footnote}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/cotizacion"
            className="bg-white border border-black/15 text-black font-medium text-xs md:text-sm px-10 py-3.5 rounded-full shadow-sm hover:bg-black hover:text-white transition-all cursor-pointer"
          >
            Cotizar A Medida
          </Link>
          <Link
            href="/cotizacion"
            className="text-xs uppercase tracking-widest font-medium text-black/50 hover:text-[#FF8300] transition-colors flex items-center gap-1 group"
          >
            <span>SABER MÁS</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
