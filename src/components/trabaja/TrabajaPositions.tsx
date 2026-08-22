"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2 } from "lucide-react";

export function TrabajaPositions() {
  const positions = [
    {
      title: "Ingeniero(a) Eléctrico(a) Proyectista SEC Clase A",
      location: "Valdivia / Osorno / Terreno Macrozona Sur",
      type: "Jornada Completa",
      desc: "Responsable del dimensionamiento eléctrico, memoria de cálculo, planos unilineales en AutoCAD, simulaciones en PVsyst y tramitación formal de expedientes TE-1, TE-4 y TE-6 ante la SEC y distribuidoras (Saesa, Crell, CGE).",
      requirements: [
        "Título de Ingeniería Civil / Ejecución Eléctrica.",
        "Licencia SEC Clase A vigente.",
        "Experiencia mínima de 2 años en proyectos fotovoltaicos On-Grid / Híbridos.",
        "Manejo de normativas Pliegos Técnicos RIC N°01 a N°19.",
      ],
    },
    {
      title: "Técnico(a) Montajista e Instalador(a) Solar",
      location: "Puerto Varas / Llanquihue / Osorno",
      type: "Jornada Completa • Terreno",
      desc: "Encargado(a) del montaje mecánico de estructuras de fijación en cubiertas (teja, zinc, paneles sandwich), tendido de canalizaciones DC/AC, conexionado de tableros de protecciones y puesta en marcha de inversores.",
      requirements: [
        "Técnico Eléctrico / Electromecánico nivel medio o superior.",
        "Licencia SEC Clase B o D (deseable).",
        "Certificación en trabajo en altura física.",
        "Licencia de conducir clase B.",
      ],
    },
    {
      title: "Asesor(a) Técnico-Comercial de Energía Solar",
      location: "Macrozona Sur (Híbrido / Terreno)",
      type: "Jornada Completa + Comisiones",
      desc: "Atención y asesoría técnica a clientes residenciales y empresas que cotizan en nuestra plataforma. Levantamiento de requerimientos energéticos, lectura de boletas eléctricas y presentación de propuestas técnico-económicas.",
      requirements: [
        "Formación en ventas técnicas, ingeniería comercial o energías renovables.",
        "Habilidades de comunicación y empatía comercial.",
        "Orientación al logro y cumplimiento de metas.",
      ],
    },
  ];

  return (
    <section id="vacantes" className="bg-transparent py-20 md:py-32 relative overflow-hidden">
      <div className="w-full px-3 md:px-5 box-border">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-xs md:text-sm font-light uppercase tracking-widest text-[#FF8300] mb-3 md:mb-4 block">
              Vacantes Disponibles
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight mb-6">
              Posiciones Abiertas
            </h2>
            <p className="text-brand-muted text-base md:text-lg font-light leading-relaxed">
              Únete a un equipo donde la ingeniería rigurosa y la tecnología de software van de la mano.
            </p>
          </motion.div>

          {/* Positions Cards */}
          <div className="space-y-6 max-w-4xl mx-auto">
            {positions.map((pos, pIdx) => (
              <div
                key={pIdx}
                className="p-8 md:p-10 rounded-[24px] bg-[#F7F8FA] border border-black/5 hover:border-[#FF8300]/40 transition-all duration-300 shadow-sm hover:shadow-xl group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <h3 className="text-xl md:text-2xl font-normal text-[#1F1F1F]">
                    {pos.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs text-[#6B7280] font-light border border-black/5">
                      <MapPin className="w-3.5 h-3.5 text-[#FF8300]" />
                      {pos.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs text-[#6B7280] font-light border border-black/5">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      {pos.type}
                    </span>
                  </div>
                </div>

                <p className="text-sm md:text-base text-[#6B7280] font-light leading-relaxed mb-6">
                  {pos.desc}
                </p>

                <div className="border-t border-black/5 pt-4 mb-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1F1F1F] mb-3">
                    Requisitos del Cargo:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm text-[#6B7280] font-light">
                    {pos.requirements.map((req, rIdx) => (
                      <div key={rIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF8300] flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="#postular"
                  className="inline-flex items-center gap-2 text-xs font-medium text-[#FF8300] hover:text-[#e07400] uppercase tracking-wider group-hover:translate-x-1 transition-all"
                >
                  <span>Postular a esta posición</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
