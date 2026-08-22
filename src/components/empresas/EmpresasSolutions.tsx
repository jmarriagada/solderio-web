"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const SOLUTIONS_LIST = [
  {
    id: "consulta",
    title: "Consulta técnica/comercial",
    description:
      "Nuestro equipo especialista analiza tu perfil empresarial y de consumo para validar instalación solar para tu empresa.",
  },
  {
    id: "diseno",
    title: "Diseño de ingeniería",
    description:
      "Desarrollamos ingeniería de detalle SEC Clase A, dimensionando la planta fotovoltaica según el perfil de carga real y protecciones de tu planta o edificio.",
  },
  {
    id: "financiera",
    title: "Consulta financiera",
    description:
      "Evaluamos opciones de financiamiento, modelos ESCO / PPA o leasing solar para acelerar el retorno de inversión y optimizar el flujo de caja.",
  },
  {
    id: "construccion",
    title: "Construcción",
    description:
      "Ejecutamos el montaje técnico, estructuración, cableado industrial e interconexión bajo estrictos estándares de seguridad operacional.",
  },
  {
    id: "operacion",
    title: "Operación y Mantenimiento",
    description:
      "Aseguramos la máxima disponibilidad con mantenimiento preventivo, limpieza fotovoltaica especializada y termografía de módulos.",
  },
  {
    id: "monitoreo",
    title: "Monitoreo y Reportería",
    description:
      "Telemetría en tiempo real con alertas tempranas de fallas y reportes ejecutivos de autogeneración y ahorro de emisiones CO2.",
  },
];

export function EmpresasSolutions() {
  const [activeTab, setActiveTab] = useState("consulta");

  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-24 bg-[#F7F8FA] overflow-hidden border-t border-b border-black/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight leading-[1.1] mb-6">
              Solucion integral en la operación
            </h2>
            <p className="text-base md:text-lg text-black/60 font-light leading-relaxed">
              Tus aliados en la gestión eléctrica, diseñamos soluciones para diferentes escenarios, comerciales e industriales: agrícola, ganadero, aserraderos, lecherías, forestal, salmoneras, mecanizado, producción.
            </p>
          </div>
          <Link
            href="/cotizacion"
            className="text-xs uppercase tracking-widest font-medium text-black/50 hover:text-[#FF8300] transition-colors flex items-center gap-1 group whitespace-nowrap self-start md:self-end mb-2"
          >
            <span>SABER MÁS</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Interactive Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-xl border border-black/5"
          >
            <Image
              src="/images/operacion-mantenimiento-preventivo-solderio.jpeg"
              alt="Ingeniería y Operación SoldeRío"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Right Column: Accordion List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col gap-4"
          >
            {SOLUTIONS_LIST.map((item) => {
              const isOpen = activeTab === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`p-6 rounded-[20px] transition-all cursor-pointer border ${
                    isOpen
                      ? "bg-white border-black/10 shadow-md"
                      : "bg-transparent border-transparent hover:bg-black/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-xl md:text-2xl font-light tracking-tight transition-colors ${
                        isOpen ? "text-[#1F1F1F] font-normal" : "text-black/50"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-transform ${
                        isOpen ? "bg-[#FF8300] text-white rotate-90" : "bg-black/5 text-black/40"
                      }`}
                    >
                      →
                    </span>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-sm md:text-base text-black/60 font-light leading-relaxed">
                          {item.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
