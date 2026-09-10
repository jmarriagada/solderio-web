"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShieldCheck, CheckCircle2, Clock, Zap, TrendingUp, AlertOctagon } from "lucide-react";

export function BessCaseStudies() {
  return (
    <section className="w-full py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#141414] text-white relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 right-1/3 w-[700px] h-[400px] bg-[#FF8300]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-light tracking-tight leading-[1.15] mb-5 text-white">
            Casos Operativos Reales en el Sur de Chile
          </h2>
          <p className="text-base md:text-lg text-white/70 font-light leading-relaxed">
            Arquitecturas de potencia probadas: cómo el almacenamiento BESS Grid-Forming resuelve los desafíos de continuidad y costos en los sectores lechero y acuícola.
          </p>
        </motion.div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Case 1: Lechería */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#1A1A1A] rounded-[28px] border border-white/15 overflow-hidden shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Image Header */}
              <div className="relative aspect-[16/9] w-full bg-black/40 overflow-hidden">
                <Image
                  src="/images/Paneles-solares-lecherias.jpeg"
                  alt="Lechería automatizada con energía solar y BESS en Osorno"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-black/30" />
              </div>

              {/* Content Body */}
              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-light text-white tracking-tight mb-3">
                  Lechería Robótica: Eliminación de Potencia en Punta &amp; Cero Cortes en Ordeño
                </h3>

                {/* Problem Statement */}
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 mb-4 flex items-start gap-2.5 text-xs text-white/80 font-light leading-relaxed">
                  <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-rose-400 font-medium">El Desafío: </strong>
                    Ordeña de 450 vacas con robots automáticos. La rutina de tarde (18:30 hrs) y el encendido de estanques de frío generaban un pico de 75 kW en horario punta, facturado los 12 meses por Saesa. Microcortes frecuentes quemaban variadores y descalibraban brazos robóticos.
                  </div>
                </div>

                {/* Solution Statement */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 mb-6 flex items-start gap-2.5 text-xs text-white/80 font-light leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-400 font-medium">Arquitectura SoldeRío: </strong>
                    Planta solar 100 kWp en techo de galpón + Contenedor BESS LiFePO4 60 kW / 120 kWh con conmutador estático STS e inversor Grid-Forming.
                  </div>
                </div>

                {/* Verified Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                  <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                    <span className="text-[10px] font-mono text-white/50 uppercase block">Ahorro Cargo Punta</span>
                    <span className="text-base md:text-lg font-mono font-medium text-emerald-400">$18.200.000 / año</span>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                    <span className="text-[10px] font-mono text-white/50 uppercase block">Respaldo STS</span>
                    <span className="text-base md:text-lg font-mono font-medium text-white">7,8 milisegundos</span>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                    <span className="text-[10px] font-mono text-white/50 uppercase block">Paradas en Ordeño</span>
                    <span className="text-base md:text-lg font-mono font-medium text-emerald-400">0 en 12 meses</span>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                    <span className="text-[10px] font-mono text-white/50 uppercase block">Payback con SII</span>
                    <span className="text-base md:text-lg font-mono font-medium text-white">3,6 Años</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Case 2: Salmonera */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-[#1A1A1A] rounded-[28px] border border-white/15 overflow-hidden shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Image Header */}
              <div className="relative aspect-[16/9] w-full bg-black/40 overflow-hidden">
                <Image
                  src="/images/Salmon-solar_panels-solderio.jpeg"
                  alt="Piscicultura RAS con microred híbrida BESS en Puerto Varas"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-black/30" />
              </div>

              {/* Content Body */}
              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-light text-white tracking-tight mb-3">
                  Piscicultura RAS: Continuidad 24/7 en Oxigenación &amp; 82% Menos Diésel
                </h3>

                {/* Problem Statement */}
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 mb-4 flex items-start gap-2.5 text-xs text-white/80 font-light leading-relaxed">
                  <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-rose-400 font-medium">El Desafío: </strong>
                    Centro de smoltificación con carga crítica continua de 220 kW (oxigenación PSA y bombas). Una interrupción de 30 segundos generaba pánico respiratorio y pérdidas millonarias. El generador diésel consumía más de $4.500.000 CLP al mes en combustible.
                  </div>
                </div>

                {/* Solution Statement */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 mb-6 flex items-start gap-2.5 text-xs text-white/80 font-light leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-400 font-medium">Arquitectura SoldeRío: </strong>
                    Microred solar 180 kWp en suelo + BESS en contenedor climatizado 200 kW / 400 kWh Grid-Forming acoplado a sincronismo con generador diésel de respaldo.
                  </div>
                </div>

                {/* Verified Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                  <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                    <span className="text-[10px] font-mono text-white/50 uppercase block">Desplazamiento Diésel</span>
                    <span className="text-base md:text-lg font-mono font-medium text-emerald-400">82% de Reducción</span>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                    <span className="text-[10px] font-mono text-white/50 uppercase block">Ahorro Operacional</span>
                    <span className="text-base md:text-lg font-mono font-medium text-white">$36.400.000 / año</span>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                    <span className="text-[10px] font-mono text-white/50 uppercase block">Continuidad Oxígeno</span>
                    <span className="text-base md:text-lg font-mono font-medium text-emerald-400">100% Sin Cortes</span>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                    <span className="text-[10px] font-mono text-white/50 uppercase block">Reducción CO₂</span>
                    <span className="text-base md:text-lg font-mono font-medium text-white">164 Ton / año</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
