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

  // Dark overcast multiply overlay reduces from 45% to 0% rapidly (within first 25% of scroll)
  const darkOverlayOpacity = useTransform(scrollYProgress, [0, 0.25], [0.45, 0.0]);

  // Golden sunny warmth overlay transitions in quickly and remains bright
  const sunnyOverlayOpacity = useTransform(scrollYProgress, [0, 0.12, 0.28, 1], [0, 0.45, 0.85, 0.85]);

  // Radiant sun flare in sky bursts out quickly
  const sunFlareOpacity = useTransform(scrollYProgress, [0, 0.1, 0.25, 1], [0.08, 0.65, 1, 1]);
  const sunFlareScale = useTransform(scrollYProgress, [0, 0.3, 1], [0.85, 1.25, 1.35]);
  const sunFlareY = useTransform(scrollYProgress, [0, 0.3, 1], [-70, 0, 25]);

  // Image brightness, warmth & subtle parallax zoom - peaking by 28% scroll
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const imageFilter = useTransform(
    scrollYProgress,
    [0, 0.12, 0.28, 1],
    [
      "brightness(0.88) contrast(1.02) saturate(0.95) sepia(0)",
      "brightness(1.12) contrast(1.08) saturate(1.18) sepia(0.06)",
      "brightness(1.28) contrast(1.14) saturate(1.32) sepia(0.12)",
      "brightness(1.28) contrast(1.14) saturate(1.32) sepia(0.12)",
    ]
  );

  return (
    <section ref={containerRef} className="w-full h-screen p-3 md:p-5 flex flex-col box-border">
      {/* Mother Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-full rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col justify-between shadow-2xl border border-black/10"
      >
        {/* Background Image Container with Dynamic Sunny Scroll Transition */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Base Photo with Scroll-Driven Sunlight Lighting Filter */}
          <motion.div
            style={{
              filter: imageFilter,
              scale: imageScale,
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src="/images/Family_inside_solar_powered_house1_solderio.jpeg"
              alt="SoldeRío Planta Solar Hogar"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>

          {/* 1. Dark Overcast Multiply Overlay (Fades out on scroll) */}
          <motion.div
            style={{ opacity: darkOverlayOpacity }}
            className="absolute inset-0 bg-black mix-blend-multiply pointer-events-none"
          />

          {/* 2. Golden Sunlit Warmth Gradient (Fades in on scroll to create golden hour sunshine) */}
          <motion.div
            style={{ opacity: sunnyOverlayOpacity }}
            className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-orange-400/25 to-yellow-300/35 mix-blend-soft-light pointer-events-none"
          />

          {/* 3. Radiant Sun Ray Burst Flare in the Sky (Emerges and shines from top as you scroll) */}
          <motion.div
            style={{
              opacity: sunFlareOpacity,
              scale: sunFlareScale,
              y: sunFlareY,
            }}
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[750px] h-[650px] bg-gradient-radial from-amber-300/60 via-orange-400/30 to-transparent rounded-full blur-[110px] pointer-events-none mix-blend-screen"
          />
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
              Energía Inteligente, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Ingeniería Confiable
              </span>
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-[16px] md:text-[18px] text-white/90 font-light max-w-2xl leading-relaxed"
            >
              Gestiona la soberanía energética de tu hogar o empresa con SoldeRío. Diseñamos, construimos, operamos y monitoreamos plantas solares
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
            href="/cotizacion"
            className="w-full sm:w-auto bg-white text-black font-light text-xs md:text-sm px-7 py-2.5 rounded-xl shadow-lg hover:bg-[#FF8300] hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-center hover:shadow-[0_0_30px_rgba(255,131,0,0.4)]"
          >
            Obtener una Cotización Solar
          </Link>
          <a
            href="https://wa.me/56987654321?text=Hola,%20quisiera%20conversar%20con%20un%20ingeniero%20de%20SoldeR%C3%ADo"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-black/40 border border-white/40 text-white font-light text-xs md:text-sm px-7 py-2.5 rounded-xl backdrop-blur-md hover:bg-black/60 hover:border-white transition-all cursor-pointer text-center"
          >
            Hablar con un Ingeniero
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
