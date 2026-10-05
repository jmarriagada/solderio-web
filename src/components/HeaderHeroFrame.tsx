"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { HeroHeaderNav } from "@/components/HeroHeaderNav";

export function HeaderHeroFrame() {
  const containerRef = useRef<HTMLElement>(null);

  // Track scroll position of the hero section relative to viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Image subtle parallax zoom
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <section ref={containerRef} className="w-full h-screen p-3 md:p-5 flex flex-col box-border">
      {/* Mother Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-full rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col justify-between shadow-2xl border border-black/10"
      >
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Base Photo with Subtle Parallax */}
          <motion.div
            style={{
              scale: imageScale,
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src="/images/hero-energia-solar-sur-de-chile-solderio.jpg"
              alt="SoldeRío Energía Solar Sur de Chile"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>

          {/* Static Dark Overlay for Text Legibility */}
          <div className="absolute inset-0 bg-black/[0.45] pointer-events-none" />
        </div>

        {/* Top Wrapper: Header + Title Block anchored to top */}
        <div className="relative z-20 w-full flex flex-col items-center">
          {/* Header Navigation with Descubre MegaMenu */}
          <HeroHeaderNav />

          {/* Hero Top Content with Staggered Fade-in */}
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
            className="text-center px-6 pt-10 md:pt-16 flex flex-col items-center max-w-4xl mx-auto"
          >
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-[34px] sm:text-[46px] md:text-[56px] font-bold text-white tracking-[-0.04em] leading-[1.1] mb-4 drop-shadow-sm"
            >
              Energía solar rentable <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                para el sur de Chile
              </span>
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-[16px] md:text-[18px] text-white/90 font-light max-w-2xl leading-relaxed"
            >
              Ingeniería solar de alto rendimiento. Baja la cuenta de luz de tu casa y aumenta la rentabilidad en la operación de tu empresa.
            </motion.p>
          </motion.div>
        </div>

        {/* Hero Bottom Content (Buttons with hover glow) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center px-6 pb-8 md:pb-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/hogar"
            className="w-full sm:w-auto bg-white text-black font-light text-[15px] sm:text-xs md:text-sm px-7 py-3.5 sm:py-2.5 rounded-xl shadow-lg hover:bg-[#FF8300] hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-center hover:shadow-[0_0_30px_rgba(255,131,0,0.4)]"
          >
            Energía para mi Hogar
          </Link>
          <Link
            href="/empresas"
            className="w-full sm:w-auto bg-black/40 border border-white/40 text-white font-light text-[15px] sm:text-xs md:text-sm px-7 py-3.5 sm:py-2.5 rounded-xl backdrop-blur-md hover:bg-black/60 hover:border-white transition-all cursor-pointer text-center"
          >
            Soluciones para Empresas
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
