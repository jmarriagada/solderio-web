"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, ArrowRight, Zap, CheckCircle2, HelpCircle, AlertCircle } from "lucide-react";

export function AprenderComoLeerBoleta() {
  const [selectedItem, setSelectedItem] = useState<number>(0);

  const billSections = [
    {
      title: "1. Consumo de Energía Activa (kWh)",
      badge: "El Ítem Principal",
      whatIs: "Es la cantidad total de electricidad que consumiste en el mes, medida en kilowatt-hora (kWh).",
      howSolarAffects: "Con una planta solar, cada kWh que generas y consumes directamente reduce esta cifra a cero. Es donde se concentra más del 80% de tu ahorro mensual.",
      formula: "Total kWh = Lectura Actual - Lectura Anterior",
    },
    {
      title: "2. Cargo Fijo Mensual ($)",
      badge: "Costo Invariable",
      whatIs: "Es el costo que cobra la distribuidora por mantener tu medidor activo, emitir la boleta y gestionar la lectura, independientemente de si consumes energía o no (aprox. $1.000 a $2.500 CLP).",
      howSolarAffects: "Este cargo se mantiene en la boleta, pero en plantas On-Grid con excedentes inyectados, el dinero generado por tus inyecciones también descuenta y absorbe este cargo fijo.",
      formula: "Fijo por decreto tarifario CNE",
    },
    {
      title: "3. Transporte & Transmisión de Electricidad",
      badge: "Peajes Eléctricos",
      whatIs: "El costo de transportar la energía desde las centrales de generación a lo largo del Sistema Eléctrico Nacional (SEN) hasta el transformador de tu barrio.",
      howSolarAffects: "Al generar energía en tu propio techo, no utilizas las líneas de transmisión troncal para tu autoconsumo, ahorrándote el 100% de este cargo en cada kWh solar.",
      formula: "Cobro proporcional a los kWh extraídos",
    },
    {
      title: "4. Cargo por Energía Inyectada (Ley 21.118 Net Billing)",
      badge: "Saldo a tu Favor",
      whatIs: "Aparece una vez que tu planta solar cuenta con certificado TE-4 ante la SEC. Registra los kWh que tus paneles inyectaron a la red pública durante las horas de alta radiación.",
      howSolarAffects: "Se multiplica por el precio de nudo de la energía y se resta directamente del total a pagar. Si la resta da saldo negativo, se acumula para el mes siguiente o se reembolsa.",
      formula: "Crédito = kWh inyectados × Precio de Inyección ($/kWh)",
    },
  ];

  return (
    <section id="boleta" className="bg-transparent py-20 md:py-32 relative overflow-hidden">
      <div className="w-full px-3 md:px-5 box-border">
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
              Guía Práctica para el Sur
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight mb-6">
              ¿Cómo leer tu boleta eléctrica?
            </h2>
            <p className="text-brand-muted text-base md:text-lg font-light leading-relaxed">
              Aprende a identificar qué te cobra Saesa, Crell o CGE y cómo una planta fotovoltaica transforma cada ítem en ahorro real.
            </p>
          </motion.div>

          {/* Interactive Bill Breakdown Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Interactive Section Selectors (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              {billSections.map((sec, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedItem(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                    selectedItem === idx
                      ? "bg-white border-[#FF8300] shadow-md ring-2 ring-[#FF8300]/20"
                      : "bg-[#F7F8FA] border-black/5 hover:bg-white text-[#6B7280]"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF8300] font-semibold block mb-1">
                      {sec.badge}
                    </span>
                    <h3 className={`text-base font-medium ${selectedItem === idx ? "text-[#1F1F1F]" : "text-[#1F1F1F]/80"}`}>
                      {sec.title}
                    </h3>
                  </div>
                  <ArrowRight className={`w-4 h-4 transition-transform ${selectedItem === idx ? "text-[#FF8300] translate-x-1" : "text-black/30"}`} />
                </button>
              ))}
            </div>

            {/* Right: Detailed Deep Dive Card (7 cols) */}
            <div className="lg:col-span-7 bg-[#1F1F1F] text-white p-8 md:p-10 rounded-[28px] border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300]">
                  Detalle del Ítem Seleccionado
                </span>
                <span className="text-xs text-white/50 font-mono">
                  {billSections[selectedItem].formula}
                </span>
              </div>

              <h3 className="text-2xl font-light text-white mb-4">
                {billSections[selectedItem].title}
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-2">
                    ¿Qué significa en tu boleta?
                  </h4>
                  <p className="text-sm md:text-base text-white/80 font-light leading-relaxed">
                    {billSections[selectedItem].whatIs}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
                  <h4 className="text-xs uppercase tracking-wider text-[#FF8300] font-semibold mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Impacto directo con Energía Solar SoldeRío
                  </h4>
                  <p className="text-sm text-white/90 font-light leading-relaxed">
                    {billSections[selectedItem].howSolarAffects}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/60 font-light">
                <span>¿Tienes tu boleta a mano?</span>
                <a href="/cotizacion" className="text-[#FF8300] hover:underline font-normal">
                  Sube tu boleta en nuestro cotizador →
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
