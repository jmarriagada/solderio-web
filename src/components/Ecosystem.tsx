"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function Ecosystem() {
  const cards = [
    {
      number: "01",
      title: "Genera energía",
      description: "Genera tu propia energía limpia con paneles solares de alta eficiencia.",
      icon: "/icons/ahorro-planta-solar-solderio.svg",
    },
    {
      number: "02",
      title: "Usa energía",
      description: "Alimenta todos tus artefactos, calefacción y bombas con energía solar.",
      icon: "/icons/energia-planta-solar-solderio.svg",
    },
    {
      number: "04",
      title: "Carga y/o vende",
      description: "Carga tu auto eléctrico desde casa o inyecta y vende excedentes a la red.",
      icon: "/icons/vehiculo-electrico-planta-solar-solderio.svg?v=1",
    },
    {
      number: "03",
      title: "Almacena excedentes",
      description: "Usa la energía en la noche, ante cortes de red o en horarios de tarifa alta.",
      icon: "/icons/bateria-planta-solar-solderio.svg?v=1",
    },
  ];

  return (
    <section className="bg-transparent py-20 md:py-28 relative overflow-hidden">
      <div className="w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left Image: Bleeds from screen left edge (0px margin) with rounded corners ONLY on right side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-1/2 flex-none pl-0 ml-0"
        >
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] max-h-[620px] rounded-tr-[24px] rounded-br-[24px] md:rounded-tr-[32px] md:rounded-br-[32px] overflow-hidden shadow-2xl border-y border-r border-black/10 group">
            <Image
              src="/images/solderio-ecosistema-movilidad-electrica.png"
              alt="Ecosistema SoldeRío Movilidad Eléctrica"
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/30 pointer-events-none" />
          </div>
        </motion.div>

        {/* Right Content: Title, Paragraph & 2x2 Connected Grid Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-1/2 px-6 lg:pr-16 box-border"
        >
          {/* Header Title */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF8300]/10 text-[#FF8300] text-xs font-medium uppercase tracking-wider mb-3">
            <span>Integración 360°</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-light text-brand-fg mb-4 tracking-tight">
            Ecosistema Solde<span className="text-[#FF8300]">Río</span>
          </h2>

          {/* Paragraph */}
          <p className="text-[#6B7280] text-sm md:text-base leading-relaxed font-light mb-12 max-w-xl">
            Genera, usa, almacena, carga y vende energía limpia con un ecosistema SoldeRío totalmente integrado. Nuestros productos funcionan sincronizados para optimizar tu consumo y ahorro energético a la vez que minimizas tu impacto ambiental.
          </p>

          {/* 2x2 Connected Grid Diagram with Animated Energy Pulse */}
          <div className="relative max-w-xl mx-auto lg:mx-0 p-2 sm:p-4">
            {/* Background Orange Dash-Dot Circular Connecting Line with pulse animation */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
              viewBox="0 0 500 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="250"
                cy="250"
                r="145"
                stroke="#FF8300"
                strokeWidth="2.2"
                strokeDasharray="8 8"
                className="animate-spin duration-30000"
                style={{ transformOrigin: "center" }}
                opacity="0.85"
              />
            </svg>

            {/* Center SoldeRío Circular Icon Badge */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#1F1F1F] border-2 border-[#FF8300] shadow-[0_0_30px_rgba(255,131,0,0.35)] flex items-center justify-center p-3.5"
            >
              <Image
                src="/icons/icon-solderio.svg"
                alt="SoldeRío Icon"
                width={65}
                height={65}
                className="w-full h-full object-contain"
              />
            </motion.div>

            {/* 2x2 Grid of Cards (01 Top-Left, 02 Top-Right, 04 Bottom-Left, 03 Bottom-Right) */}
            <div className="grid grid-cols-2 gap-6 md:gap-8 relative z-10">
              {cards.map((card, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#F7F8FA]/95 backdrop-blur-sm p-5 sm:p-6 rounded-[20px] border border-black/5 flex flex-col justify-between items-center text-center shadow-sm hover:shadow-[0_8px_30px_rgba(255,131,0,0.1)] hover:border-[#FF8300]/30 transition-all aspect-[5/4] sm:aspect-[4/3] group"
                >
                  <div className="w-full flex justify-end mb-1">
                    <span className="text-[11px] text-[#6B7280] font-mono tracking-wider">
                      {card.number}
                    </span>
                  </div>

                  <div className="h-10 md:h-12 w-auto flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={card.icon}
                      alt={card.title}
                      width={48}
                      height={48}
                      className="max-h-10 md:max-h-12 w-auto object-contain"
                    />
                  </div>

                  <h3 className="text-sm sm:text-base font-medium text-brand-fg mb-1 leading-snug">
                    {card.title}
                  </h3>

                  <p className="text-[11px] sm:text-xs text-[#6B7280] leading-tight font-light">
                    {card.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
