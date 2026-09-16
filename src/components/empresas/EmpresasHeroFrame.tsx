"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeroHeaderNav } from "@/components/HeroHeaderNav";

export function EmpresasHeroFrame() {
  return (
    <section className="w-full h-screen p-3 md:p-5 flex flex-col box-border">
      {/* Mother Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-full rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col justify-between shadow-2xl border border-black/10 bg-[#141414]"
      >
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/solar-panels-empresas-sur-chile.jpg"
            alt="SoldeRío Plantas Solares Comercial e Industrial"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center scale-105"
          />
          {/* Elegant Dark Vignette Overlay for Crisp Text Readability */}
          <div className="absolute inset-0 bg-black/35 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/75 pointer-events-none" />
          
          {/* Subtle Ambient Radial Glow (Soft & Slow Breathing) */}
          <motion.div
            animate={{ opacity: [0.08, 0.16, 0.08] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FF8300] rounded-full blur-[160px] pointer-events-none"
          />
        </div>

        {/* Top Wrapper: Header + Title Block anchored to top */}
        <div className="relative z-20 w-full flex flex-col items-center">
          {/* Header Navigation with Descubre MegaMenu */}
          <HeroHeaderNav activePage="Empresas" locationText="Osorno, Los Lagos" />

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
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-sm md:text-lg text-white/90 font-light tracking-widest uppercase mb-4"
            >
              Proyectos solares
            </motion.p>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-[40px] sm:text-[54px] md:text-[68px] font-bold text-white tracking-[-0.04em] leading-[1.05] drop-shadow-sm"
            >
              Comercial e Industrial
            </motion.h1>
          </motion.div>
        </div>

        {/* Hero Bottom Content (Buttons) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center px-6 pb-8 md:pb-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/cotizacion"
            className="w-full sm:w-auto bg-white text-black font-light text-[15px] sm:text-xs md:text-sm px-7 py-3.5 sm:py-2.5 rounded-xl shadow-lg hover:bg-[#FF8300] hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-center hover:shadow-[0_0_30px_rgba(255,131,0,0.4)]"
          >
            Iniciar Cotización Solar
          </Link>
          <a
            href="https://wa.me/56966186667?text=Hola,%20quisiera%20contacto%20t%C3%A9cnico-comercial%20por%20un%20proyecto%20solar%20para%20mi%20empresa"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-black/40 border border-white/40 text-white font-light text-[15px] sm:text-xs md:text-sm px-7 py-3.5 sm:py-2.5 rounded-xl backdrop-blur-md hover:bg-black/60 hover:border-white transition-all cursor-pointer text-center flex items-center justify-center"
          >
            Contacto técnico-comercial
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
