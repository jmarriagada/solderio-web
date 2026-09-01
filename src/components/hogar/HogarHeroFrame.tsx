"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { HeroHeaderNav } from "@/components/HeroHeaderNav";

export function HogarHeroFrame() {
  const containerRef = useRef<HTMLElement>(null);

  // Track scroll position of the hero section relative to viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Dark overcast multiply overlay reduces from 40% to 5% as user scrolls (gradual pace)
  const darkOverlayOpacity = useTransform(scrollYProgress, [0, 0.7], [0.4, 0.05]);

  // Golden sunny warmth overlay transitions in across the scroll
  const sunnyOverlayOpacity = useTransform(scrollYProgress, [0, 0.45, 0.95], [0, 0.55, 0.85]);

  // Radiant sun flare in sky grows brighter and expands gradually
  const sunFlareOpacity = useTransform(scrollYProgress, [0, 0.35, 0.9], [0.08, 0.75, 1]);
  const sunFlareScale = useTransform(scrollYProgress, [0, 1], [0.85, 1.35]);
  const sunFlareY = useTransform(scrollYProgress, [0, 1], [-80, 30]);

  // Image brightness, warmth & subtle parallax zoom
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.08]);
  const imageFilter = useTransform(
    scrollYProgress,
    [0, 0.4, 0.85, 1],
    [
      "brightness(0.88) contrast(1.02) saturate(0.95) sepia(0)",
      "brightness(1.05) contrast(1.06) saturate(1.12) sepia(0.05)",
      "brightness(1.22) contrast(1.12) saturate(1.28) sepia(0.12)",
      "brightness(1.28) contrast(1.15) saturate(1.35) sepia(0.15)",
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
              src="/images/planta-solar-en-dia-nublado-residencial-sur-chile-solderio.jpeg"
              alt="SoldeRío Plantas Solares Hogar"
              fill
              priority
              unoptimized
              quality={100}
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
          <HeroHeaderNav activePage="Hogar" locationText="Osorno, Los Lagos" />

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
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-[40px] sm:text-[54px] md:text-[68px] font-bold text-white tracking-[-0.04em] leading-[1.05] mb-2 drop-shadow-sm"
            >
              Plantas Solares
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-sm md:text-lg text-white/95 font-light max-w-2xl leading-relaxed tracking-wide"
            >
              Genera energía limpia y baja tu cuenta eléctrica
            </motion.p>
          </motion.div>
        </div>

        {/* Hero Bottom Content (Matching /inicio buttons style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center px-6 pb-8 md:pb-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/cotizacion"
            className="w-full sm:w-auto bg-white text-black font-light text-xs md:text-sm px-8 py-3.5 rounded-full shadow-lg hover:bg-[#FF8300] hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-center hover:shadow-[0_0_30px_rgba(255,131,0,0.4)]"
          >
            Obtener una Cotización Solar
          </Link>
          <a
            href="https://wa.me/56987654321?text=Hola,%20quisiera%20conversar%20con%20un%20ingeniero%20de%20SoldeR%C3%ADo"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-black/40 border border-white/40 text-white font-light text-xs md:text-sm px-8 py-3.5 rounded-full backdrop-blur-md hover:bg-black/60 hover:border-white transition-all cursor-pointer text-center"
          >
            Hablar con un Ingeniero
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
