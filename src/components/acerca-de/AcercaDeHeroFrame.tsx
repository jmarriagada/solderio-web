"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Award, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { HeroHeaderNav } from "@/components/HeroHeaderNav";

export function AcercaDeHeroFrame() {
  return (
    <section className="w-full h-screen p-3 md:p-5 flex flex-col box-border">
      {/* Mother Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-full rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col justify-between shadow-2xl border border-black/10"
      >
        {/* Background Image with Black Multiply Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/planta-solar-residencial-selva-valdiviana.jpg"
            alt="SoldeRío Naturaleza e Ingeniería Solar"
            fill
            priority
            className="object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-black/55 mix-blend-multiply pointer-events-none" />
          
          {/* Subtle Ambient Radial Glow (Warm Amber Solar) */}
          <motion.div
            animate={{ opacity: [0.08, 0.18, 0.08] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-[#FF8300] rounded-full blur-[160px] pointer-events-none"
          />
        </div>

        {/* Top Wrapper: Header + Title Block anchored to top */}
        <div className="relative z-20 w-full flex flex-col items-center">
          {/* Header Navigation with Descubre MegaMenu */}
          <HeroHeaderNav activePage="Descubre" locationText="Macrozona Sur" />

          {/* Hero Top Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.2 },
              },
            }}
            className="text-center px-6 pt-10 md:pt-14 flex flex-col items-center max-w-4xl mx-auto"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-light tracking-wider uppercase mb-4"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF8300]" />
              <span>Nuestra Historia & Propósito • SoldeRío</span>
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-[38px] sm:text-[52px] md:text-[66px] font-bold text-white tracking-[-0.04em] leading-[1.05] mb-3 drop-shadow-sm"
            >
              Por Qué SoldeRío
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-sm md:text-lg text-white/95 font-light max-w-2xl leading-relaxed tracking-wide"
            >
              Ingeniería eléctrica senior y tecnología digital nacida en el sur de Chile para transformar la radiación solar en soberanía energética confiable.
            </motion.p>
          </motion.div>
        </div>

        {/* Hero Bottom Content */}
        <div className="relative z-10 text-center px-6 pb-8 md:pb-12 flex flex-col items-center gap-6">
          {/* Quick specs pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex items-center gap-6 px-6 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs text-white/85 font-light"
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FF8300]" />
              <span>30+ Años de Respaldo Técnico</span>
            </div>
            <span className="text-white/30">•</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>100% Tramitación SEC TE-1 / TE-4 / TE-6</span>
            </div>
            <span className="text-white/30">•</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF8300]" />
              <span>Garantía de Generación 25 Años</span>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <a
              href="#manifiesto"
              className="group w-full sm:w-auto bg-white text-black font-medium text-xs md:text-sm px-9 py-3.5 rounded-full shadow-lg hover:bg-[#FF8300] hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,131,0,0.4)]"
            >
              <span>Conoce Nuestra Historia</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <Link
              href="/cotizacion"
              className="w-full sm:w-auto bg-black/40 border border-white/40 text-white font-light text-xs md:text-sm px-9 py-3.5 rounded-full backdrop-blur-md hover:bg-black/60 hover:border-white transition-all cursor-pointer text-center"
            >
              Obtener Cotización Solar
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
