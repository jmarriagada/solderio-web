"use client";

import { motion } from "framer-motion";
import { ShieldCheck, FileCheck2, Wrench, CheckCircle2, Award, Zap } from "lucide-react";
import Image from "next/image";

export function CargaEvSecInstallation() {
  const pillars = [
    {
      icon: FileCheck2,
      title: "Declaración SEC TE-6 Oficial",
      subtitle: "Trámite 100% legal",
      description:
        "Gestionamos la tramitación TE-6 (Declaración de Instalaciones de Infraestructura para Recarga de Vehículos Eléctricos) ante la Superintendencia de Electricidad y Combustibles.",
    },
    {
      icon: ShieldCheck,
      title: "Cumplimiento Pliego RIC N°15",
      subtitle: "Seguridad y dimensionamiento",
      description:
        "Diseño estricto conforme al Pliego Técnico RIC N°15: protecciones diferenciales con detección DC 6mA, seccionamiento visible, canalización apta para exterior y sistema de puesta a tierra.",
    },
    {
      icon: Award,
      title: "Ingeniería SEC Clase A",
      subtitle: "Supervisión técnica senior",
      description:
        "Toda instalación es diseñada y fiscalizada por ingenieros eléctricos colegiados con certificación SEC Clase A, garantizando respaldo de largo plazo y máxima confiabilidad.",
    },
    {
      icon: Wrench,
      title: "Instalación Llave en Mano",
      subtitle: "Montaje rápido en 15 minutos",
      description:
        "Nos encargamos de todo el proceso: evaluación del empalme, montaje de tablero dedicado, cableado protegido, configuración de App y entrega con pruebas de funcionamiento.",
    },
  ];

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-4 h-4" />
          <span>Ingeniería Confiable & Normativa SEC</span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-fg tracking-tight">
          Seguridad Eléctrica Certificada
        </h2>
        <p className="mt-4 text-sm md:text-base text-[#4A4A4A]">
          La recarga de alta potencia exige rigor normativo. En SoldeRío garantizamos que tu cargador opere de forma segura y 100% regularizada ante la SEC.
        </p>
      </div>

      {/* Grid of 4 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {pillars.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-6 border border-black/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="p-3 rounded-2xl bg-[#F7F8FA] text-[#FF8300] w-fit mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold text-[#FF8300] uppercase tracking-wider block mb-1">
                  {item.subtitle}
                </span>
                <h3 className="text-lg font-bold text-brand-fg mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Trust Quote Box */}
      <div className="bg-[#1F1F1F] text-white rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl relative z-10">
          <span className="text-xs uppercase tracking-widest text-[#FF8300] font-semibold block mb-2">
            Compromiso SoldeRío
          </span>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            “No improvisamos con la seguridad eléctrica de tu propiedad”
          </h3>
          <p className="text-xs md:text-sm text-white/70 leading-relaxed">
            Cada cargador instalado por SoldeRío cuenta con protecciones coordinadas contra sobretensiones y fugas de corriente, memoria de cálculo de conductores y declaración SEC TE-6 formal ante la autoridad.
          </p>
        </div>

        <div className="flex items-center gap-6 relative z-10 flex-shrink-0">
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-2xl md:text-3xl font-bold text-[#FF8300]">TE-6</span>
            <span className="text-[10px] text-white/60 uppercase tracking-wider mt-0.5">Trámite SEC</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-2xl md:text-3xl font-bold text-emerald-400">RIC N°15</span>
            <span className="text-[10px] text-white/60 uppercase tracking-wider mt-0.5">Norma Chilena</span>
          </div>
        </div>
      </div>
    </section>
  );
}
