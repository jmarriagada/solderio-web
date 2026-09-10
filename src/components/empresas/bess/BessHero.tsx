"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Zap, Activity, Flame } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";
import { HeroHeaderNav } from "@/components/HeroHeaderNav";

const KPIS = [
  {
    icon: Zap,
    title: "Conmutación STS",
    value: "<10 ms",
    desc: "Transferencia estática imperceptible para PLC y variadores de frecuencia.",
  },
  {
    icon: Activity,
    title: "Ciclos de Vida",
    value: ">6.000",
    desc: "A 90% DoD con celdas LiFePO4 Grado A (+15 años de operación continua).",
  },
  {
    icon: ShieldCheck,
    title: "Inversor Grid-Forming",
    value: "GFM Nativo",
    desc: "Crea su propia referencia de tensión e inercia sintética en redes débiles.",
  },
  {
    icon: Flame,
    title: "Seguridad Industrial",
    value: "NFPA 855",
    desc: "Detección off-gas, supresión de aerosol Stat-X y certificación UL 9540A.",
  },
];

export function BessHero() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full pb-20 md:pb-28 bg-[#141414] text-white overflow-hidden flex flex-col">
      {/* Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-[#FF8300]/10 rounded-full blur-[190px] pointer-events-none" />

      {/* Background Micro Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-40 [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]" />

      {/* Persistent Top Header Nav */}
      <div className="relative z-30 w-full">
        <HeroHeaderNav activePage="Empresas" locationText="BESS Industrial" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8 pt-8 md:pt-14 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16 md:mb-24">
          {/* Left Column: Technical Narrative */}
          <div className="lg:col-span-7 text-left">
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-light tracking-tight leading-[1.12] mb-6 text-white"
            >
              Sistemas BESS C&I: Resiliencia Operativa y Blindaje Tarifario
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base md:text-lg text-white/70 font-light leading-relaxed mb-8 max-w-2xl"
            >
              Infraestructura de almacenamiento de energía con celdas LiFePO4 Grado A e inversores Grid-Forming. Diseñado para mitigar la inestabilidad de las redes del Sur, eliminar el sobrecargo por potencia en Horario Punta y desplazar el gasto diésel como backup.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <CtaButton
                href="#auditoria-bess"
                variant="orange"
                className="shadow-xl"
              >
                Solicitar Estudio de Curva de Carga
              </CtaButton>
              <button
                onClick={() => scrollToSection("modos-operacion")}
                className="px-8 py-3.5 rounded-full border border-white/20 text-white/90 text-xs md:text-sm font-light hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Ver Modos de Operación</span>
                <ArrowRight className="w-4 h-4 text-[#FF8300]" />
              </button>
            </motion.div>
          </div>

          {/* Right Column: Industrial BESS Showcase Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-[28px] overflow-hidden border border-white/15 bg-gradient-to-b from-[#1F1F1F] to-[#161616] p-4 shadow-2xl shadow-black/80">
              <div className="relative aspect-[4/3] rounded-[20px] overflow-hidden bg-black/40">
                <Image
                  src="/images/solar-bess-lecheria-moderna-v2.jpg"
                  alt="BESS Industrial SoldeRío en faena agroindustrial del sur"
                  fill
                  priority
                  className="object-cover object-bottom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Floating Technical Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md border border-white/15 rounded-xl p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-white/50 uppercase block">Configuración Típica</span>
                    <span className="text-xs md:text-sm font-medium text-white">Contenedor 100 kW / 215 kWh BTM</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF8300]/20 border border-[#FF8300]/30 text-[11px] font-mono text-[#FF8300]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF8300] animate-ping" />
                    <span>STS Activo</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 4 KPIs Bento Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KPIS.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#1A1A1A]/90 hover:bg-[#1F1F1F] border border-white/10 hover:border-[#FF8300]/30 rounded-2xl p-5 md:p-6 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF8300] group-hover:bg-[#FF8300]/10 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xl md:text-2xl font-light text-white tracking-tight">
                    {kpi.value}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white/90 mb-1">{kpi.title}</h4>
                  <p className="text-xs text-white/60 font-light leading-relaxed">{kpi.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
