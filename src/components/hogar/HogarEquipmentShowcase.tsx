"use client";

import { Zap, Cpu, Battery, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";

export function HogarEquipmentShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 380;
      scrollRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const equipments = [
    {
      icon: Cpu,
      title: "Controlador de módulos",
      tagline: "Optimización Inteligente",
      description:
        "Libera el máximo potencial de cada panel, de forma inteligente y segura. Se usa en paneles con sombreamientos parciales.",
      caption: "Máximo rendimiento individual por string",
    },
    {
      icon: Zap,
      title: "Inversor híbrido inteligente",
      tagline: "Gestión y Respaldo Continuo",
      description:
        "Invierte la corriente (DC to AC) que generan los paneles a una para energizar tu casa. Cuando ya se cubre el consumo, envía la energía a las baterías. Una vez cargadas al 100% el exceso se inyecta a la red. Si se corta la red pública mantiene tu suministro activo.",
      caption: "Conmutación STS <10ms • Eficiencia >98.6%",
    },
    {
      icon: Battery,
      title: "Banco de baterías",
      tagline: "Almacenamiento seguro",
      description:
        "Almacena y entrega su energía de forma inteligente para la noche y ante cortes de suministro. Carga, entrega y respalda de forma sincronizada.",
      caption: "Cero riesgo térmico • 6.000+ ciclos",
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
          className="text-center max-w-3xl mx-auto mb-6 md:mb-8"
        >
          <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight mb-3">
            Respaldo confiable ante cortes
          </h2>
          <p className="text-brand-muted text-base md:text-lg font-light leading-relaxed">
            Una selección de equipos que te soportan durante cortes y maximizan la generación solar con nubosidad.
          </p>
        </motion.div>

        {/* 3-Card Grid */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {equipments.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6 }}
                  className="bg-[#f1f1f1] p-8 md:p-9 rounded-[24px] border border-black/10 flex flex-col justify-between shadow-sm hover:shadow-[0_12px_40px_rgba(255,131,0,0.12)] hover:border-[#FF8300]/30 transition-all duration-300 group"
                  style={{ backgroundColor: "#f1f1f1" }}
                >
                  <div>
                    {/* Visual Icon Header */}
                    <div className="w-16 h-16 rounded-2xl bg-white border border-black/5 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:border-[#FF8300]/40 transition-all duration-300">
                      <Icon className="w-8 h-8 text-[#FF8300] stroke-[1.5]" />
                    </div>

                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B7280] block mb-1">
                      {item.tagline}
                    </span>

                    <h3 className="text-xl md:text-2xl font-normal text-brand-fg mb-3 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-brand-muted text-sm md:text-base leading-relaxed font-light mb-8">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                    <span className="text-xs text-[#6B7280] font-light">
                      {item.caption}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Center CTA Button */}
        <div className="text-center mt-12">
          <Link
            href="/cotizacion"
            className="inline-flex items-center gap-2 px-9 py-3.5 rounded-full bg-[#FF8300] text-white font-light text-xs md:text-sm hover:bg-[#e07300] transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(255,131,0,0.5)] cursor-pointer group"
          >
            <span>Cotizar A Medida</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
