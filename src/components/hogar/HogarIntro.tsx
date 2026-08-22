"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function HogarIntro() {
  return (
    <section className="bg-transparent py-20 md:py-28 flex flex-col items-center overflow-hidden">
      {/* 2-line Text Block with scroll animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto px-6 mb-16 text-center"
      >
        <h2 className="text-3xl md:text-[44px] font-light text-[#1F1F1F] leading-snug tracking-tight">
          Maximizamos tu autoconsumo <br className="hidden md:block" /> y ahorro con energía solar
        </h2>
      </motion.div>

      {/* Image Container with Parallax Zoom and rounded corners */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="w-full px-3 md:px-5 box-border"
      >
        <div className="relative w-full h-[40vh] min-h-[320px] md:h-[54vh] max-h-[600px] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl border border-black/10 group">
          <Image
            src="/images/planta-solar-hogar-residencial-solderio3.jpeg"
            alt="Planta Solar Hogar Residencial Sur de Chile SoldeRío"
            fill
            priority
            unoptimized
            quality={100}
            sizes="(max-width: 1400px) 100vw, 1400px"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-1000"
          />
        </div>
      </motion.div>
    </section>
  );
}
