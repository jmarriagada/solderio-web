"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function EmpresasCTA() {
  return (
    <section className="w-full py-24 px-6 md:px-12 bg-black text-white relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF8300]/15 rounded-full blur-[180px] pointer-events-none" />

      {/* Wireframe Grid/Sphere Element Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.1] mb-6"
        >
          Maximiza rentabilidad
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-lg text-white/70 font-light leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          Invierte en un sistema fotovoltaico SoldeRío. Diseño de ingeniería pensado para energizar la operación real de tu empresa en el sur. Con gestión energética que acelera los retornos de inversión y disminuye la huella de carbono.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/cotizacion"
            className="group w-full sm:w-auto bg-[#FF8300] text-white font-medium text-xs md:text-sm px-9 py-3.5 rounded-full shadow-lg hover:bg-white hover:text-black transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Iniciar Cotización</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <button className="w-full sm:w-auto bg-transparent border border-white/30 text-white font-light text-xs md:text-sm px-9 py-3.5 rounded-full hover:bg-white/10 hover:border-white transition-all cursor-pointer">
            Porqué Invertir Directo
          </button>
        </motion.div>
      </div>
    </section>
  );
}
