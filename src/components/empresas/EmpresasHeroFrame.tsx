"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
        className="relative w-full h-full rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col justify-between shadow-2xl border border-black/10"
      >
        {/* Background Image with Black Multiply Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/solar-panels-empresas-sur-chile.jpg"
            alt="SoldeRío Plantas Solares Comercial e Industrial"
            fill
            priority
            className="object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-black/50 mix-blend-multiply pointer-events-none" />
          
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
            className="group w-full sm:w-auto bg-white text-black font-medium text-xs md:text-sm px-9 py-3 rounded-full shadow-lg hover:bg-[#FF8300] hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,131,0,0.4)]"
          >
            <span>Iniciar Cotización Solar</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <button className="w-full sm:w-auto bg-black/40 border border-white/40 text-white font-light text-xs md:text-sm px-9 py-3 rounded-full backdrop-blur-md hover:bg-black/60 hover:border-white transition-all cursor-pointer">
            Contacto técnico-comercial
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
