"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, FileText, HelpCircle, Lightbulb, Search } from "lucide-react";
import { HeroHeaderNav } from "@/components/HeroHeaderNav";

export function AprenderHeroFrame() {
  return (
    <section className="w-full min-h-[85vh] md:min-h-[90vh] p-3 md:p-5 flex flex-col box-border">
      {/* Mother Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full flex-1 rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col justify-between shadow-2xl border border-black/10 bg-[#141414] text-white"
      >
        {/* Background Ambient Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-amber-500/15 rounded-full blur-[160px]" />
          <div className="absolute bottom-10 right-10 w-[450px] h-[350px] bg-[#FF8300]/10 rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>

        {/* Top Wrapper: Header Nav */}
        <div className="relative z-20 w-full flex flex-col items-center">
          <HeroHeaderNav activePage="Descubre" locationText="Macrozona Sur" />

          {/* Hero Top Content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl mx-auto px-6 pt-12 md:pt-16 pb-6 text-center"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/90 font-light mb-6 shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-[#FF8300]" />
              <span>Centro de Conocimiento & Guías Técnicas Solares</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white mb-6 leading-[1.15]">
              Aprende cómo funciona la <br className="hidden sm:inline" />
              <span className="font-normal text-white">energía solar en el sur</span>
            </h1>

            <p className="text-white/75 text-base md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-8">
              Sin tecnicismos innecesarios: aprende a interpretar tu boleta eléctrica, conoce la diferencia entre potencia y energía, y toma decisiones informadas con respaldo de ingeniería.
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="#boleta"
                className="px-6 py-2.5 rounded-full bg-white text-black font-light text-xs md:text-sm hover:bg-[#FF8300] hover:text-white transition-all duration-300 shadow-lg cursor-pointer flex items-center gap-2 group"
              >
                <span>Cómo Leer tu Boleta</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#glosario"
                className="px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-light text-xs md:text-sm hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                Glosario Técnico Solar
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Feature Cards Preview */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-6 pb-8 md:pb-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#1F1F1F]/80 backdrop-blur-md border border-white/10 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FF8300]/15 text-[#FF8300] flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Guía de Boletas</span>
              <span className="text-[11px] text-white/60 font-light">Entiende tus cargos Saesa/Crell</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1F1F1F]/80 backdrop-blur-md border border-white/10 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">kW vs kWh</span>
              <span className="text-[11px] text-white/60 font-light">Potencia instalada vs energía generada</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1F1F1F]/80 backdrop-blur-md border border-white/10 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Checklist de Compra</span>
              <span className="text-[11px] text-white/60 font-light">Qué exigirle a un instalador solar</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
