"use client";

import { motion } from "framer-motion";
import { ACERCA_DE_DATA } from "@/lib/constants";
import { Compass, Target, ShieldCheck, Eye, MapPin, Activity } from "lucide-react";

export function AcercaDeManifesto() {
  const { manifesto } = ACERCA_DE_DATA;
  const pillarIcons = [ShieldCheck, Eye, MapPin, Activity];

  return (
    <section id="manifiesto" className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[#FF8300] mb-2 block">
          Nuestra Identidad
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-fg tracking-tight">
          Manifiesto & Propósito
        </h2>
        <p className="mt-4 text-sm md:text-base text-[#4A4A4A] leading-relaxed">
          &ldquo;{manifesto.motto}&rdquo; &mdash; No somos una empresa de marketing que vende paneles; somos una compañía de ingeniería y software creada para dar certidumbre a tu inversión.
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Mission Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-8 md:p-10 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:border-[#FF8300]/40 transition-all"
        >
          <div className="p-3 rounded-2xl bg-[#FF8300]/10 text-[#FF8300] w-fit mb-6">
            <Target className="w-7 h-7" />
          </div>
          <span className="text-xs font-semibold text-[#FF8300] uppercase tracking-wider block mb-1">
            Nuestra Misión
          </span>
          <h3 className="text-2xl font-bold text-brand-fg mb-4">
            Democratizar la energía solar con rigor técnico
          </h3>
          <p className="text-sm md:text-base text-[#4A4A4A] leading-relaxed">
            {manifesto.mission}
          </p>
        </motion.div>

        {/* Vision Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-3xl p-8 md:p-10 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:border-[#FF8300]/40 transition-all"
        >
          <div className="p-3 rounded-2xl bg-black/5 text-brand-fg w-fit mb-6">
            <Compass className="w-7 h-7" />
          </div>
          <span className="text-xs font-semibold text-[#FF8300] uppercase tracking-wider block mb-1">
            Nuestra Visión
          </span>
          <h3 className="text-2xl font-bold text-brand-fg mb-4">
            Liderar la transición energética en el sur
          </h3>
          <p className="text-sm md:text-base text-[#4A4A4A] leading-relaxed">
            {manifesto.vision}
          </p>
        </motion.div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {manifesto.pillars.map((pillar, idx) => {
          const Icon = pillarIcons[idx];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#F7F8FA] rounded-3xl p-6 border border-black/5 flex flex-col justify-between hover:bg-white hover:shadow-md hover:border-black/10 transition-all duration-300"
            >
              <div>
                <div className="p-2.5 rounded-xl bg-white shadow-xs text-[#FF8300] w-fit mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-brand-fg mb-2">
                  {pillar.title}
                </h4>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
