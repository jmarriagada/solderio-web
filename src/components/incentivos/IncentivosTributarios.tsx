"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  TrendingUp, 
  Receipt, 
  CheckCircle2, 
  DollarSign, 
  PieChart, 
  Percent 
} from "lucide-react";

export function IncentivosTributarios() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Depreciación Instantánea (100% Año 1)",
      tag: "Ley de Modernización Tributaria",
      desc: "Las empresas y contribuyentes de Primera Categoría (Régimen General o ProPyme) pueden depreciar el 100% del valor de la planta solar fotovoltaica como gasto tributario en el mismo ejercicio fiscal de compra, reduciendo drásticamente el pago del Impuesto de Primera Categoría (27% o 10-25% ProPyme).",
      highlight: "Recuperación acelerada del flujo de caja",
    },
    {
      icon: Receipt,
      title: "Recuperación de IVA Crédito Fiscal",
      tag: "Artículo 27 bis DL 825",
      desc: "El 19% de IVA pagado en la adquisición de paneles solares, inversores, baterías BESS y montaje puede utilizarse como crédito fiscal contra las ventas del negocio, o solicitarse en devolución anticipada ante el Servicio de Impuestos Internos (SII) como activo fijo.",
      highlight: "19% de ahorro neto directo en IVA",
    },
    {
      icon: PieChart,
      title: "Reducción de Costos Operacionales (LCOE)",
      tag: "Costo Nivelado de Energía",
      desc: "Al sustituir tarifas eléctricas comerciales e industriales de horas punta (tarifas BT2, BT3, AT3, AT4) por energía solar autogenerada, el costo nivelado de la energía disminuye a menos de $35 CLP por kWh, protegiendo a la empresa contra futuras alzas tarifarias de la red.",
      highlight: "Inmunidad ante alzas de tarifas eléctricas",
    },
  ];

  return (
    <section id="tributarios" className="bg-[#141414] py-20 md:py-32 relative text-white overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-[#FF8300]/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[350px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full px-3 md:px-5 box-border relative z-10">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-xs md:text-sm font-light uppercase tracking-widest text-[#FF8300] mb-3 md:mb-4 block">
              Para Empresas, Pymes y Agroindustria
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-6">
              Beneficios Tributarios & Franquicias SII
            </h2>
            <p className="text-white/70 text-base md:text-lg font-light leading-relaxed">
              La inversión en energía solar para tu empresa no solo reduce los costos operacionales de electricidad, sino que genera escudos fiscales legítimos autorizados por el Servicio de Impuestos Internos.
            </p>
          </motion.div>

          {/* 3 Bento Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            {benefits.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="p-8 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 hover:border-[#FF8300]/40 transition-all duration-300 flex flex-col justify-between group shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#FF8300]/15 text-[#FF8300] flex items-center justify-center transition-transform group-hover:scale-110">
                        <Icon className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-normal text-white mb-3">
                      {item.title}
                    </h3>

                    <p className="text-sm text-white/70 font-light leading-relaxed mb-6">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-light text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{item.highlight}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Practical Calculation Example Box */}
          <div className="p-8 md:p-12 rounded-[28px] bg-[#1A1A1A] border border-white/10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7">
                <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] block mb-2">
                  Ejemplo Práctico de Recuperación Tributaria
                </span>
                <h3 className="text-2xl md:text-3xl font-light text-white mb-4">
                  Proyecto Fotovoltaico Comercial de $30.000.000 CLP + IVA
                </h3>
                <p className="text-white/70 text-sm md:text-base font-light leading-relaxed">
                  Para una empresa con tasa corporativa del 27%, la depreciación instantánea en el año 1 permite descontar <strong>$8.100.000 CLP</strong> de impuesto a la renta, mientras que los <strong>$5.700.000 CLP de IVA</strong> se recuperan íntegramente como crédito fiscal. El costo real neto de la inversión disminuye significativamente.
                </p>
              </div>

              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-xs text-white/50 block font-light mb-1">Ahorro Impuesto Renta</span>
                  <span className="text-xl md:text-2xl font-mono font-semibold text-emerald-400">-$8.100.000</span>
                  <span className="text-[10px] text-white/40 block mt-1">Gasto tributario instantáneo</span>
                </div>
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-xs text-white/50 block font-light mb-1">Crédito Fiscal IVA</span>
                  <span className="text-xl md:text-2xl font-mono font-semibold text-[#FF8300]">-$5.700.000</span>
                  <span className="text-[10px] text-white/40 block mt-1">100% compensable con ventas</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
