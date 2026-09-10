"use client";

import { motion } from "framer-motion";
import { Check, X, ShieldAlert, Cpu, Activity, Zap } from "lucide-react";

const COMPARISON_ROWS = [
  {
    parameter: "Principio de Operación",
    following: "Fuente de Corriente (requiere red externa)",
    forming: "Fuente de Tensión (crea su propia referencia V, f)",
    advantage: "forming",
  },
  {
    parameter: "Comportamiento en Redes Débiles (SCR < 1.5)",
    following: "Inestable: desenganche de PLL y disparos por sobretensión",
    forming: "100% Estable: soporta relaciones SCR < 1.0 e interconexión rural",
    advantage: "forming",
  },
  {
    parameter: "Inercia del Sistema",
    following: "Cero inercia (emulación lenta dependiente de sensores)",
    forming: "Inercia Sintética Instantánea (amortigua caídas df/dt en sub-segundos)",
    advantage: "forming",
  },
  {
    parameter: "Tiempo de Respuesta ante Fallas",
    following: "15 a 45 segundos (arranque de generador / relé anti-isla)",
    forming: "< 10 milisegundos (conmutación estática STS ininterrumpida)",
    advantage: "forming",
  },
  {
    parameter: "Suministro de Corriente de Falla (Isc)",
    following: "Limitada a 1.0 - 1.1x corriente nominal (no activa relés)",
    forming: "Hasta 2.0x - 3.0x corriente nominal (dispara protecciones selectivas)",
    advantage: "forming",
  },
  {
    parameter: "Capacidad Black Start (Arranque en Negro)",
    following: "No puede energizar una planta desde cero",
    forming: "Nativa: energiza transformadores y barras desenergizadas",
    advantage: "forming",
  },
];

export function BessGridFormingDeepDive() {
  return (
    <section className="w-full py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#141414] text-white relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[650px] h-[450px] bg-[#FF8300]/10 rounded-full blur-[180px] pointer-events-none" />

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
            Por qué la Red del Sur Exige Inversores Grid-Forming (GFM)
          </h2>
          <p className="text-base md:text-lg text-white/70 font-light leading-relaxed">
            En las líneas de transmisión rurales, los inversores comerciales estándar (Grid-Following) sufren desenganche por bajo nivel de cortocircuito (SCR &lt; 1.5). Descubre la diferencia entre depender de la red y estabilizar la red.
          </p>
        </motion.div>

        {/* Technical Explanatory Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Card 1: The Problem of Grid-Following */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#1A1A1A] border border-rose-500/20 rounded-[24px] p-6 md:p-8 relative overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block">Topología Convencional</span>
                <h3 className="text-lg md:text-xl font-medium text-white">Grid-Following (GFL) · Seguidor de Red</h3>
              </div>
            </div>
            <p className="text-xs md:text-sm text-white/70 font-light leading-relaxed mb-4">
              Un inversor convencional mide la tensión de la red y utiliza un lazo de enganche de fase (PLL) para inyectar corriente en sincronismo. En los ramales rurales del sur (con líneas extensas y bajo nivel de cortocircuito), cualquier caída de rama o arranque de motor genera fluctuaciones de fase que descalibran el PLL, forzando al inversor a desconectarse intempestivamente.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 w-fit">
              <X className="w-4 h-4" />
              <span>Inadecuado para cargas críticas en redes rurales débiles</span>
            </div>
          </motion.div>

          {/* Card 2: The Solution with Grid-Forming */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-[#1A1A1A] border border-[#FF8300]/30 rounded-[24px] p-6 md:p-8 relative overflow-hidden shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FF8300]/15 border border-[#FF8300]/30 flex items-center justify-center text-[#FF8300]">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF8300] block">Estándar SoldeRío BESS</span>
                <h3 className="text-lg md:text-xl font-medium text-white">Grid-Forming (GFM) · Creador de Red</h3>
              </div>
            </div>
            <p className="text-xs md:text-sm text-white/70 font-light leading-relaxed mb-4">
              Nuestros convertidores operan como fuentes de tensión controladas internamente con algoritmos de droop control e inercia sintética. No necesitan que la red externa esté sana: sintetizan una onda senoidal perfecta a 50 Hz, absorben armónicos y soportan arranques pesados de bombas y compresores sin perder el ángulo de fase.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-fit">
              <Check className="w-4 h-4" />
              <span>Continuidad 100% garantizada con conmutación STS &lt;10ms</span>
            </div>
          </motion.div>
        </div>

        {/* Technical Deep Comparison Table */}
        <div className="bg-[#1A1A1A] rounded-[24px] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[11px] font-mono uppercase tracking-wider text-white/60">
                  <th className="py-4 px-6">Parámetro de Ingeniería</th>
                  <th className="py-4 px-6 text-white/50">Inversores Grid-Following (GFL)</th>
                  <th className="py-4 px-6 text-[#FF8300]">SoldeRío Grid-Forming (GFM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs md:text-sm font-light">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-medium text-white">
                      {row.parameter}
                    </td>
                    <td className="py-4 px-6 text-white/60">
                      {row.following}
                    </td>
                    <td className="py-4 px-6 text-white/90 font-normal">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{row.forming}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
