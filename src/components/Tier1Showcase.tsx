"use client";

import { Zap, ShieldCheck, SunMedium, Flame, RotateCcw, CloudSun } from "lucide-react";
import { motion } from "framer-motion";

export function Tier1Showcase() {
  const equipment = [
    {
      brand: "SMART PV",
      model: "Inversores Híbridos Inteligentes",
      highlight: "Eficiencia 98.6% • Inteligencia Artificial",
      description:
        "Inversores inteligentes de clase mundial con protección activa asistida por IA. Desconecta el sistema en milisegundos para prevenir incendios.",
      specs: [
        { icon: Zap, label: "Eficiencia Peak", value: "98.6%" },
        { icon: Flame, label: "Protección AFCI", value: "IA Ultrarrápida" },
        { icon: ShieldCheck, label: "Certificación", value: "SEC Chile" },
      ],
      tag: "Cerebro del Sistema",
      glowColor: "group-hover:border-[#FF8300]/50",
    },
    {
      brand: "ALMACENAMIENTO LiFePO4",
      model: "Baterías de Litio larga duración",
      highlight: "6.000+ Ciclos • Cero Riesgo Térmico",
      description:
        "La química de baterías más segura y duradera de la industria. No sufre degradación acelerada con temperaturas bajas y garantiza suministro continuo (UPS) ante caídas de la red.",
      specs: [
        { icon: RotateCcw, label: "Ciclos de Vida", value: "+6.000 ~15 años" },
        { icon: ShieldCheck, label: "Química Segura", value: "LiFePO4 Estable" },
        { icon: Zap, label: "Conmutación", value: "Instantánea" },
      ],
      tag: "Respaldo Energético",
      glowColor: "group-hover:border-[#FF8300]/50",
    },
    {
      brand: "MÓDULOS N-TYPE BIFACIALES",
      model: "Tecnología TOPCon/HJT Bifacial",
      highlight: "Alta Ganancia con Nubosidad y Lluvia",
      description:
        "Tecnología fotovoltaica N-Type diseñada para climas nublados. Su coeficiente térmico optimizado y bifacialidad trasera capturan hasta un 15% más en radiación difusa.",
      specs: [
        { icon: CloudSun, label: "Rendimiento Nublado", value: "+15% Difusa" },
        { icon: SunMedium, label: "Degradación Anual", value: "<0.4% / año" },
        { icon: ShieldCheck, label: "Garantía de Potencia", value: "25 Años" },
      ],
      tag: "Generación Extrema",
      glowColor: "group-hover:border-[#FF8300]/50",
    },
  ];

  return (
    <section className="bg-transparent py-16 md:py-24 relative overflow-hidden">
      <div className="w-full px-3 md:px-5 box-border">
        <div className="max-w-[1400px] mx-auto">
          {/* Header with Scroll Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs md:text-sm font-medium uppercase tracking-widest text-[#FF8300] mb-3 md:mb-4 block">
            Hardware de Grado Industrial
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight mb-4">
            Equipamiento seleccionado para el sur
          </h2>
          <p className="text-brand-muted text-base md:text-lg font-light leading-relaxed">
            No transamos en seguridad ni durabilidad. Cada componente de una planta SoldeRío está probado contra la humedad, vientos y exigencias del clima austral.
          </p>
        </motion.div>

        {/* 3 Equipment Bento Cards with Staggered Scroll Animation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {equipment.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="bg-[#F7F8FA] p-8 md:p-9 rounded-[24px] border border-black/10 flex flex-col justify-between shadow-sm hover:shadow-[0_12px_40px_rgba(255,131,0,0.12)] transition-all duration-300 relative group h-full"
            >
              <div className="flex flex-col flex-grow">
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-4 min-h-[24px]">
                  <span className="text-[11px] font-mono tracking-wider text-[#FF8300] font-semibold uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF8300]" />
                    {item.brand}
                  </span>
                  <span className="text-[10px] bg-black/5 text-[#6B7280] px-2.5 py-1 rounded-full uppercase font-medium">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-normal text-brand-fg mb-1.5 leading-snug group-hover:text-black transition-colors min-h-[32px] md:min-h-[36px] flex items-center">
                  {item.model}
                </h3>
                <p className="text-xs text-[#FF8300] font-mono mb-4 min-h-[20px] flex items-center">
                  {item.highlight}
                </p>

                <p className="text-brand-muted text-sm leading-relaxed font-light mb-6 min-h-[72px] md:min-h-[80px]">
                  {item.description}
                </p>
              </div>

              {/* Specs Grid with Perfect Equal Spacing */}
              <div className="grid grid-cols-3 gap-2 bg-white/80 border border-black/5 backdrop-blur-sm p-4 rounded-2xl mt-auto">
                {item.specs.map((spec, sIdx) => {
                  const Icon = spec.icon;
                  return (
                    <div key={sIdx} className="text-center flex flex-col items-center justify-between">
                      <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-black/5 text-[#1F1F1F] flex items-center justify-center transition-colors group-hover:bg-[#FF8300]/15 group-hover:text-[#FF8300]">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-[11px] text-[#6B7280] font-light leading-tight mb-1 min-h-[26px] flex items-center justify-center">
                        {spec.label}
                      </div>
                      <div className="text-[12px] font-medium text-brand-fg leading-tight min-h-[24px] flex items-center justify-center">
                        {spec.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
