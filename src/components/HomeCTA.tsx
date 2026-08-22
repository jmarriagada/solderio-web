"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HomeCTA() {
  return (
    <section className="bg-[#141414] py-32 md:py-44 text-center text-white relative flex items-center justify-center overflow-visible">
      {/* Centered SoldeRío Watermark Icon with 10% Opacity behind text and button */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-10 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/icon-solderio.svg"
          alt="SoldeRío Isotipo"
          className="w-[280px] sm:w-[360px] md:w-[440px] h-auto select-none"
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl font-light tracking-tight mb-8"
        >
          Comienza tu transición a Solar
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/cotizacion"
            className="inline-flex items-center gap-2 px-10 py-3.5 rounded-full bg-white text-black font-light text-xs md:text-sm hover:bg-[#FF8300] hover:text-white transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(255,131,0,0.5)] cursor-pointer group"
          >
            <span>Iniciar Cotización</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
