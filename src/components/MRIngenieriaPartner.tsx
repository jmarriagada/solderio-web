"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Activity, ExternalLink } from "lucide-react";

export function MRIngenieriaPartner() {
  const highlights = [
    {
      icon: ShieldCheck,
      title: "Ingeniería SEC Clase A",
      subtitle: "Tramitación TE-1, TE-4 & TE-6",
      description:
        "Validación, memorias de cálculo y tramitaciones oficiales ante la SEC para plantas solares, inyección Net Billing y cargadores EV.",
    },
    {
      icon: Zap,
      title: "Media y Baja Tensión (MT/BT)",
      subtitle: "Redes aéreas y soterradas",
      description:
        "Capacidad técnica integral para interconectar plantas solares a redes de distribución Saesa, Crell y CGE en toda la macrozona sur.",
    },
    {
      icon: Activity,
      title: "Tableros & Transformadores",
      subtitle: "Diseño y protecciones normadas",
      description:
        "Fabricación y montaje de tableros eléctricos de fuerza, subestaciones y coordinación de protecciones bajo pliegos técnicos RIC.",
    },
  ];

  return (
    <section className="bg-[#141414] py-24 md:py-32 text-white border-t border-white/10 relative overflow-hidden">
      {/* Ambient glow in background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#FF8300]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full px-3 md:px-5 box-border relative z-10">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <span className="text-xs md:text-sm font-medium uppercase tracking-widest text-[#FF8300] mb-3 md:mb-4 block">
              Alianza Estratégica
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-4">
              SoldeRío <span className="text-white/40">×</span> MR Ingeniería Eléctrica
            </h2>
            <p className="text-white/70 text-base md:text-lg font-light leading-relaxed">
              Unimos el desarrollo solar fotovoltaico de SoldeRío con más de 35 años de trayectoria y más de 220 proyectos ejecutados por MR Ingeniería Eléctrica en media y baja tensión en el sur de Chile.
            </p>
          </motion.div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4 }}
                  className="bg-[#1C1C1C] p-7 md:p-8 rounded-2xl border border-white/10 hover:border-[#FF8300]/40 transition-all duration-300 flex flex-col justify-between shadow-xl group"
                >
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-white/5 text-[#FF8300] border border-white/10 flex items-center justify-center mb-6 group-hover:bg-[#FF8300] group-hover:text-white transition-all duration-300">
                      <Icon className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <span className="text-[11px] font-mono tracking-wider text-[#FF8300] uppercase block mb-1">
                      {item.subtitle}
                    </span>
                    <h3 className="text-xl md:text-2xl font-light text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-white/65 text-sm md:text-base font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Credentials / Metrics Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-10 text-center sm:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-light text-[#FF8300]">+35 Años</div>
                <div className="text-xs text-white/60 font-light uppercase tracking-wider">Experiencia en el Sur</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/10" />
              <div>
                <div className="text-2xl sm:text-3xl font-light text-white">+220</div>
                <div className="text-xs text-white/60 font-light uppercase tracking-wider">Proyectos Ejecutados</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/10" />
              <div>
                <div className="text-2xl sm:text-3xl font-light text-white">SEC Clase A</div>
                <div className="text-xs text-white/60 font-light uppercase tracking-wider">Licencia & Rigor Técnico</div>
              </div>
            </div>

            <a
              href="https://mringenieriaelectrica.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-[#FF8300] text-white text-xs sm:text-sm font-light transition-all duration-300 border border-white/15 hover:border-transparent whitespace-nowrap cursor-pointer group"
            >
              <span>Conoce a MR Ingeniería</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
