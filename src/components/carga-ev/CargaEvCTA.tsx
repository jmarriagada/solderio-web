"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, MessageSquare } from "lucide-react";

export function CargaEvCTA() {
  return (
    <section className="bg-[#141414] py-20 md:py-28 text-center text-white border-t border-white/10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#FF8300]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#FF8300] text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Energía Inteligente SoldeRío</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-5xl font-light tracking-tight mb-4"
        >
          Electrifica tu Movilidad con la Fuerza del Sol
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-sm md:text-base text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Cotiza tu cargador Huawei Smart Charger con instalación certificada SEC TE-6 en Los Ríos, Los Lagos y La Araucanía.
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-3.5 rounded-full bg-white text-black font-medium text-sm hover:bg-[#FF8300] hover:text-white transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(255,131,0,0.5)] cursor-pointer group"
          >
            <span>Cotizar Instalación EV</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="https://wa.me/56987654321?text=Hola,%20me%20gustar%C3%ADa%20cotizar%20un%20cargador%20EV%20con%20SoldeR%C3%ADo"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-light text-sm hover:bg-white/20 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Hablar por WhatsApp</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
