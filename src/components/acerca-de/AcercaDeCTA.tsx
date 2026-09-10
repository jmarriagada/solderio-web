"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function AcercaDeCTA() {
  return (
    <section className="bg-[#141414] py-28 md:py-36 text-center text-white relative flex items-center justify-center overflow-hidden">
      {/* Centered SoldeRío Watermark Icon with 10% Opacity behind text and button */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-10 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/icon-solderio.svg"
          alt="SoldeRío Isotipo"
          className="w-[280px] sm:w-[360px] md:w-[440px] h-auto select-none"
        />
      </div>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#FF8300]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl font-light tracking-tight mb-4 text-white"
        >
          Construyamos Juntos tu Solución Energética
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-sm md:text-base text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          Evalúa tu boleta de luz con nuestros ingenieros y descubre cuánto puedes ahorrar con una planta solar fotovoltaica diseñada a tu medida.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/cotizacion"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-7 py-2.5 bg-white text-black font-light text-xs md:text-sm shadow-lg hover:bg-[#FF8300] hover:text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,131,0,0.4)] cursor-pointer"
          >
            Obtener cotización
          </Link>
          <a
            href="https://wa.me/56966186667?text=Hola,%20me%20gustar%C3%ADa%20conversar%20con%20un%20ingeniero%20de%20SoldeR%C3%ADo"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-7 py-2.5 bg-black/40 border border-white/40 text-white font-light text-xs md:text-sm backdrop-blur-md hover:bg-black/60 hover:border-white transition-all cursor-pointer"
          >
            Hablar con un ingeniero
          </a>
        </motion.div>
      </div>
    </section>
  );
}
