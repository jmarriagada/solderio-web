"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingDown, Sun, ShieldCheck } from "lucide-react";

export function HogarBenefits() {
  const cards = [
    {
      step: "01",
      category: "AHORRO EN BOLETA",
      metric: "Hasta -90%",
      metricLabel: "Reducción en tu cuenta eléctrica",
      icon: "/icons/ahorro-planta-solar-solderio.svg",
      heroIcon: TrendingDown,
      accentColor: "#FF8300",
      indicators: [
        "Blindaje total ante las alzas continuas de tarifas eléctricas",
        "Venta e inyección de excedentes a la red bajo Ley Net Billing",
        "Retorno de inversión proyectado entre 4 a 7 años",
      ],
      footerBadge: "Amortización de alta rentabilidad",
    },
    {
      step: "02",
      category: "SOBERANÍA ENERGÉTICA",
      metric: "100% Limpia",
      metricLabel: "Energía solar autónoma y continua",
      icon: "/icons/energia-planta-solar-solderio.svg",
      heroIcon: Sun,
      accentColor: "#FF8300",
      indicators: [
        "Módulos N-Type optimizados para capturar radiación difusa y nubosidad",
        "Baterías de Litio para suministro ininterrumpido",
        "Respaldo instantáneo (<10ms) ante cortes",
      ],
      footerBadge: "Continuidad operativa 24/7",
    },
    {
      step: "03",
      category: "INGENIERÍA & GARANTÍA",
      metric: "25 Años",
      metricLabel: "Garantía de potencia y respaldo local",
      icon: "/icons/garantia-planta-solar-solderio.svg",
      heroIcon: ShieldCheck,
      accentColor: "#FF8300",
      indicators: [
        "Tramitaciones y certificaciones oficiales SEC (TE-1 y TE-4)",
        "Monitoreo inteligente en tiempo real desde tu smartphone",
        "Soporte técnico, mantenimiento preventivo y postventa en el sur",
      ],
      footerBadge: "Ingeniería certificada SoldeRío",
    },
  ];

  return (
    <section className="bg-transparent py-20 md:py-28 relative overflow-hidden">
      <div className="w-full px-3 md:px-5 box-border">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mb-14 md:mb-16"
          >
            <span className="text-xs font-light uppercase tracking-widest text-[#FF8300] block mb-3">
              Eficiencia & Rentabilidad
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] mb-4 tracking-tight">
              Baja tu costo eléctrico.
            </h2>
            <p className="text-brand-muted text-base md:text-lg leading-relaxed font-light">
              Genera tu propia energía, almacena tus excedentes y protege la economía de tu hogar con la máxima rentabilidad y respaldo técnico en el sur de Chile.
            </p>
          </motion.div>

          {/* 3 Redesigned Bento Indicator Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className="bg-[#F7F8FA] p-8 md:p-9 rounded-[24px] border border-black/5 flex flex-col justify-between shadow-sm hover:shadow-[0_12px_40px_rgba(255,131,0,0.12)] hover:border-[#FF8300]/30 transition-all duration-300 relative group h-full"
              >
                <div>
                  {/* Top Row: Step Tag + SVG Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-[#FF8300]">
                        {card.step}
                      </span>
                      <span className="text-white/20 text-xs">•</span>
                      <span className="text-[11px] font-mono tracking-wider text-[#6B7280] font-semibold uppercase">
                        {card.category}
                      </span>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-white p-2 border border-black/5 shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={card.icon}
                        alt={card.category}
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                  </div>

                  {/* Main KPI Metric Display */}
                  <div className="mb-6 pb-6 border-b border-black/5">
                    <div className="text-4xl sm:text-5xl font-light text-[#1F1F1F] tracking-tight mb-1.5 group-hover:text-[#FF8300] transition-colors">
                      {card.metric}
                    </div>
                    <div className="text-xs sm:text-sm text-[#6B7280] font-light">
                      {card.metricLabel}
                    </div>
                  </div>

                  {/* Short Bullet Indicators */}
                  <div className="space-y-3 mb-6">
                    {card.indicators.map((ind, iIdx) => (
                      <div key={iIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#FF8300] flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-[#4B5563] font-light leading-relaxed">
                          {ind}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Status Pill */}
                <div className="pt-4 border-t border-black/5 flex items-center justify-between mt-auto">
                  <span className="text-[11px] font-mono tracking-wide text-[#6B7280] font-light uppercase">
                    {card.footerBadge}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#FF8300]/60 group-hover:bg-[#FF8300] transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
