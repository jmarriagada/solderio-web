"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CloudRain, Wind, ShieldCheck, Sun } from "lucide-react";

export function AcercaDeRegionalCommitment() {
  const climateFeatures = [
    {
      icon: CloudRain,
      title: "Resistencia a Lluvia y Humedad",
      desc: "Sellado IP65/IP68 en conectores y gabinetes para proteger contra la condensación y humedad extrema del sur.",
    },
    {
      icon: Wind,
      title: "Estructuras para Vientos de 120+ km/h",
      desc: "Fijaciones mecánicas de aluminio anodizado y anclajes estructurales calculados contra ráfagas invernales.",
    },
    {
      icon: Sun,
      title: "Captación con Radiación Difusa",
      desc: "Módulos monocristalinos N-Type TOPCon con alta respuesta espectral en días nublados o lluviosos.",
    },
    {
      icon: ShieldCheck,
      title: "Soporte y Respuesta Local",
      desc: "Equipo técnico en terreno en el sur, evitando las demoras de semanas de instaladores con base en Santiago.",
    },
  ];

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        {/* Left Column: Full-Height Image (5 cols) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5 flex flex-col"
        >
          <div className="relative w-full h-full min-h-[380px] lg:min-h-full rounded-3xl overflow-hidden shadow-2xl border border-black/10 group">
            <Image
              src="/images/solar_chile_1787346094806.png"
              alt="Planta solar SoldeRío en Lago Ranco"
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-white z-10">
              <span className="text-xs font-light text-[#FF8300] uppercase tracking-wider block mb-1">
                Lago Ranco
              </span>
              <h3 className="text-xl md:text-2xl font-light text-white tracking-tight">
                Región de los Ríos
              </h3>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Narrative & Climate Engineering (7 cols) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7 flex flex-col justify-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-brand-fg tracking-tight mb-4">
            Diseñado en el Sur, para el Clima del Sur
          </h2>
          <p className="text-sm md:text-base text-[#4A4A4A] font-light leading-relaxed mb-8">
            Instalar energía solar en Los Ríos o Los Lagos no es lo mismo que en el desierto de Atacama o Santiago. Requiere calcular la inclinación óptima para el escurrimiento de lluvia e incluso nieve, sobredimensionar la protección galvánica contra corrosión y asegurar que la planta genere incluso bajo cielos nublados.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {climateFeatures.map((f, index) => {
              const Icon = f.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-5 rounded-2xl border border-black/5 shadow-xs hover:border-[#FF8300]/30 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-[#FF8300]/10 text-[#FF8300]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs md:text-sm font-bold text-brand-fg">{f.title}</h3>
                  </div>
                  <p className="text-xs text-[#6B7280] font-light leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
