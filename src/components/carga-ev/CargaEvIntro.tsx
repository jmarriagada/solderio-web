"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function CargaEvIntro() {
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
        <p className="text-xs md:text-sm uppercase tracking-widest text-[#FF8300] font-semibold mb-3">
          Movilidad Solar Sustentable
        </p>
        <h2 className="text-3xl md:text-[44px] font-light text-brand-fg leading-snug tracking-tight">
          Transforma la radiación del sur en <br className="hidden md:block" />
          <span className="text-[#FF8300] font-normal">kilómetros 100% limpios</span> y costo cero
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
        <div className="relative w-full h-[55vh] min-h-[420px] md:h-[75vh] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl border border-black/10 group">
          <Image
            src="/images/solderio-electrico.png"
            alt="SoldeRío Carga Solar de Vehículos Eléctricos"
            fill
            priority
            className="object-cover object-center group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white max-w-lg">
            <span className="inline-block px-3 py-1 rounded-full bg-[#FF8300] text-black text-xs font-semibold uppercase tracking-wider mb-2">
              Sincronización Total
            </span>
            <h3 className="text-xl md:text-2xl font-medium drop-shadow-sm">
              Carga tu auto con la misma energía limpia que ilumina tu hogar o empresa
            </h3>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
