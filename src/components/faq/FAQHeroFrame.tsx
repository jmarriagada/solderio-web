"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, HelpCircle, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
import { HeroHeaderNav } from "@/components/HeroHeaderNav";

export function FAQHeroFrame() {
  return (
    <section className="w-full min-h-[75vh] md:min-h-[80vh] p-3 md:p-5 flex flex-col box-border">
      {/* Mother Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full flex-1 rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col justify-between shadow-2xl border border-black/10 bg-[#141414] text-white"
      >
        {/* Background Ambient Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-[#FF8300]/15 rounded-full blur-[160px]" />
          <div className="absolute bottom-10 right-10 w-[450px] h-[350px] bg-blue-500/10 rounded-full blur-[140px]" />
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
            className="w-full max-w-4xl mx-auto px-6 pt-12 md:pt-16 pb-8 text-center"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/90 font-light mb-6 shadow-sm">
              <HelpCircle className="w-3.5 h-3.5 text-[#FF8300]" />
              <span>Centro de Ayuda & Respuestas Técnicas Oficiales</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white mb-6 leading-[1.15]">
              Preguntas Frecuentes <br className="hidden sm:inline" />
              <span className="font-normal text-white">sobre Energía Solar en el Sur</span>
            </h1>

            <p className="text-white/75 text-base md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
              Resolvemos todas tus dudas técnicas, legales, económicas y de instalación para que avances con total seguridad en tu transición energética.
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar Info */}
        <div className="relative z-20 w-full max-w-4xl mx-auto px-6 pb-8 flex items-center justify-center gap-6 text-xs text-white/60 font-light">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Validado por Ingenieros SEC Clase A</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#FF8300]" />
            <span>Atención directa vía WhatsApp</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
