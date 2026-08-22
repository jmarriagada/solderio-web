"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function Benefits() {
  const benefits = [
    {
      label: "AHORRO",
      title: "Directo a tu boleta",
      titleFormatted: "Directo a tu boleta",
      description:
        "Ahorra en el total mensual de tu boleta eléctrica. Una planta solar te protegerá del aumento de los costos de la electricidad y recibirás recompensas si inyectas tus excedentes eléctricos a la red.",
      linkText: "Descubre financiamiento.",
      linkUrl: "#",
      icon: "/icons/ahorro-planta-solar-solderio.svg",
    },
    {
      label: "SUSTENTABILIDAD",
      title: "Energía Solar",
      titleFormatted: "Energía Solar",
      description:
        "Energía renovable y libre de emisiones, directamente del sol. Entendemos tu boleta, techo/suelo y escuchamos tus necesidades energéticas y económicas, para diseñar a medida, instalar, certificar y operar las plantas SoldeRío.",
      icon: "/icons/energia-planta-solar-solderio.svg",
    },
    {
      label: "GARANTÍA",
      title: "Respaldo SoldeRío",
      titleFormatted: (
        <>
          Respaldo Solde<span className="text-[#FF8300]">Río</span>
        </>
      ),
      description:
        "Garantía de instalación, operación preventiva y correctiva para tu planta solar, soporte 24/7 para asegurar la continuidad de tu proyecto con app de monitoreo.",
      icon: "/icons/garantia-planta-solar-solderio.svg",
    },
  ];

  return (
    <section className="bg-transparent py-20 md:py-28 relative overflow-hidden">
      <div className="w-full px-3 md:px-5 box-border">
        <div className="max-w-[1400px] mx-auto">
          {/* Title and Intro Text with Scroll Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-light text-brand-fg mb-6 tracking-tight">
              Baja tu costo eléctrico.
            </h2>
            <p className="text-brand-muted text-base md:text-lg leading-relaxed font-light">
              Genera tu propia energía desde el sol con las plantas fotovoltaicas SoldeRío.
              Amortiza tu inversión en el mediano plazo y toma el control de tus finanzas energéticas
              frente a las constantes alzas de tarifas, apoyado con un ecosistema de alta fiabilidad.
            </p>
          </motion.div>

          {/* 3 Cards Grid with Staggered Fade Up */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className="bg-[#F7F8FA]/95 backdrop-blur-sm p-8 md:p-9 rounded-[20px] border border-black/5 flex flex-col justify-between relative shadow-sm hover:shadow-[0_10px_35px_rgba(255,131,0,0.1)] hover:border-[#FF8300]/30 transition-all duration-300 group"
              >
                <div>
                  {/* Top Row: Label (Left) and Icon (Right) */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs font-mono tracking-[0.15em] text-[#6B7280] uppercase">
                      {card.label}
                    </span>
                    <div className="w-10 h-10 relative flex-shrink-0 flex items-center justify-end transition-transform duration-300 group-hover:scale-110">
                      <Image
                        src={card.icon}
                        alt={card.label}
                        width={40}
                        height={40}
                        className="w-auto h-9 object-contain"
                      />
                    </div>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-2xl md:text-[26px] font-normal text-brand-fg mb-4 leading-tight">
                    {card.titleFormatted}
                  </h3>

                  {/* Description Body */}
                  <p className="text-[#6B7280] text-sm md:text-base leading-relaxed font-light">
                    {card.description}
                    {card.linkText && (
                      <a
                        href={card.linkUrl}
                        className="text-[#FF8300] underline font-normal hover:opacity-80 transition-opacity ml-1"
                      >
                        {card.linkText}
                      </a>
                    )}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
