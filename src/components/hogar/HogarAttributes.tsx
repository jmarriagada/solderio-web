"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function HogarAttributes() {
  const attributes = [
    {
      title: "Estética de paneles",
      description:
        "Nuestras celdas monocristalinas y marcos negros en los paneles solares, crean un aspecto uniforme y monocromático. Bases estructurales ocultas.",
      image: "/images/solderio-planta-solar-residencial-sur.png",
    },
    {
      title: "Más energía",
      description:
        "Con 2x veces más de potencia que los paneles solares tradicionales, nuestros paneles están fabricados para generar más energía en climas de alta nubosidad.",
      image: "/images/solarcell-solderio.png",
    },
    {
      title: "Ingeniería confiable",
      description:
        "Diseño técnico e instalación con altos estándares de seguridad y bajo normativas vigentes. Nuestro equipo eléctrico está certificado por la Superintendencia de Electricidad y Combustibles (SEC).",
      image: "/images/solderio-electrico.png",
    },
  ];

  return (
    <section className="bg-transparent py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-[#6B7280] text-xs font-medium uppercase tracking-wider mb-3">
            <span>Rendimiento Climático</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-light text-brand-fg mb-6 tracking-tight">
            Diseñadas para el sur.
          </h2>
          <p className="text-brand-muted text-base md:text-lg leading-relaxed font-light">
            Una versión moderna y adaptada para el clima del sur. Con nuestro sistema de montaje, instalamos en diferentes tipos de techo. Respaldados por 25 años de garantía en paneles, nuestras plantas son duraderas y resistentes a la intemperie.
          </p>
        </motion.div>

        {/* 3 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {attributes.map((attr, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="flex flex-col group cursor-pointer"
            >
              {/* Image Card (20px rounded border) */}
              <div className="relative w-full aspect-square mb-6 rounded-[20px] overflow-hidden border border-black/5 shadow-md">
                <Image
                  src={attr.image}
                  alt={attr.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              {/* Card Title */}
              <h3 className="text-[24px] md:text-[30px] font-normal text-brand-fg mb-2 leading-tight group-hover:text-[#FF8300] transition-colors">
                {attr.title}
              </h3>

              {/* Description */}
              <p className="text-[#6B7280] text-sm md:text-base leading-relaxed font-light">
                {attr.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
