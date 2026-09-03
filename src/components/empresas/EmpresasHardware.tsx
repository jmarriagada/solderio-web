"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
    title: "Smart PV Controller",
    description: "Alta eficiencia en la conversión eléctrica de generación al consumo.",
    footnote: "Convierte la corriente DC en AC de forma sincronizada.",
    image: "/images/smart-controller-comercialindustrial-solderio.png",
  },
  {
    id: "bateria",
    title: "C&I Grid Forming ESS",
    description: "Maximiza el autoconsumo y el ahorro reduciendo cargos por potencia en horas punta (peak shaving) y respaldando la operación ante cortes.",
    footnote: "Autoconsumo, peak shaving y continuidad operativa ante cortes.",
    image: "/images/bess-comercial-industrial-solderio.png",
  },
];

export function EmpresasHardware() {
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
            Eficiencia energética para tu empresa, con ingeniería robusta y duradera. Genera, carga baterías y descargalas en horario punta, pagando un menor precio por cada kWh.
          </p>
        </motion.div>

        {/* Hardware Showcase Carousel */}
        <div className="relative w-full mb-12">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HARDWARE_ITEMS.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="bg-transparent rounded-[24px] p-8 flex flex-col items-center text-center group"
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
