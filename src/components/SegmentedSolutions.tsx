"use client";

import { useState } from "react";
import { Home, Building2, Shield, TrendingUp, Award, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SegmentedSolutions() {
  const [segment, setSegment] = useState<"residential" | "commercial">("residential");
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({});

  const toggleCard = (id: string) => {
    setOpenCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="bg-transparent py-16 md:py-24 relative overflow-hidden">
      <div className="w-full px-3 md:px-5 box-border">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
          >
            <div>
              <span className="text-xs md:text-sm font-medium uppercase tracking-widest text-[#FF8300] mb-3 md:mb-4 block">
                Soluciones Segmentadas
              </span>
              <h2 className="text-3xl md:text-5xl font-light text-brand-fg tracking-tight">
                A la medida de tu consumo
              </h2>
            </div>

            {/* Selector de Segmento (Residencial vs Comercial) */}
            <div className="inline-flex p-1.5 rounded-full bg-[#E5E7EB]/60 backdrop-blur-md border border-black/5 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setSegment("residential")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 cursor-pointer ${
                  segment === "residential"
                    ? "bg-[#1F1F1F] text-white shadow-lg"
                    : "text-[#6B7280] hover:text-[#1F1F1F]"
                }`}
                style={segment === "residential" ? { backgroundColor: "#1F1F1F" } : undefined}
              >
                <Home className="w-4 h-4 stroke-[1.5]" />
                <span>Residencial & Parcelas</span>
              </button>

              <button
                type="button"
                onClick={() => setSegment("commercial")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 cursor-pointer ${
                  segment === "commercial"
                    ? "bg-[#1F1F1F] text-white shadow-lg"
                    : "text-[#6B7280] hover:text-[#1F1F1F]"
                }`}
                style={segment === "commercial" ? { backgroundColor: "#1F1F1F" } : undefined}
              >
                <Building2 className="w-4 h-4 stroke-[1.5]" />
                <span>Comercial e Industrial</span>
              </button>
            </div>
          </motion.div>

          {/* Cards Grid */}
          <AnimatePresence mode="wait">
            {segment === "residential" ? (
              <motion.div
                key="residential"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
              >
                {/* Card 1: Respaldo Anti-Cortes */}
                <button
                  type="button"
                  onClick={() => toggleCard("res-1")}
                  className="w-full text-left bg-[#FDFFFE] p-6 md:p-7 rounded-[20px] border border-black/5 flex flex-col hover:shadow-xl hover:border-[#FF8300]/30 transition-all duration-300 group cursor-pointer focus:outline-none"
                  style={{ backgroundColor: "#FDFFFE" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#FF8300]/10 text-[#FF8300] flex items-center justify-center transition-transform group-hover:scale-110">
                      <Shield className="w-5 h-5 stroke-[1.5]" />
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-normal text-brand-fg mb-1">
                    Respaldo Anti-Cortes
                  </h3>

                  <AnimatePresence initial={false}>
                    {openCards["res-1"] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-brand-muted text-sm md:text-base leading-relaxed font-light mt-3">
                          En el sur, los cortes de luz son habituales. Nuestros sistemas híbridos con baterías se activan de forma imperceptible, manteniendo energizado sin interrupciones.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                {/* Card 2: Ahorro y abono de excedentes */}
                <button
                  type="button"
                  onClick={() => toggleCard("res-2")}
                  className="w-full text-left bg-[#FDFFFE] p-6 md:p-7 rounded-[20px] border border-black/5 flex flex-col hover:shadow-xl hover:border-[#FF8300]/30 transition-all duration-300 group cursor-pointer focus:outline-none"
                  style={{ backgroundColor: "#FDFFFE" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#FF8300]/10 text-[#FF8300] flex items-center justify-center transition-transform group-hover:scale-110">
                      <TrendingUp className="w-5 h-5 stroke-[1.5]" />
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-normal text-brand-fg mb-1">
                    Ahorro y abono de excedentes
                  </h3>

                  <AnimatePresence initial={false}>
                    {openCards["res-2"] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-brand-muted text-sm md:text-base leading-relaxed font-light mt-3">
                          Genera tu energía limpia, ahorra hasta el 90% en tu cuenta de luz, inyectas y abonas los excedentes entregados a la red, acelerando la recuperacion de la inversión.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                {/* Card 3: Control Total en tu Smartphone */}
                <button
                  type="button"
                  onClick={() => toggleCard("res-3")}
                  className="w-full text-left bg-[#FDFFFE] p-6 md:p-7 rounded-[20px] border border-black/5 flex flex-col hover:shadow-xl hover:border-[#FF8300]/30 transition-all duration-300 group cursor-pointer focus:outline-none"
                  style={{ backgroundColor: "#FDFFFE" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#FF8300]/10 text-[#FF8300] flex items-center justify-center transition-transform group-hover:scale-110">
                      <svg
                        viewBox="0 0 58.42 50.37"
                        className="w-5 h-5 fill-[#FF8300]"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M56.53,0H16.35c-.95,0-1.72.77-1.72,1.72v6.22c0,.44.36.8.8.8s.8-.36.8-.8V1.59h40.61v24.22h-30.95c-.44,0-.8.36-.8.8s.36.8.8.8h30.95v3.86h-31.47c-.44,0-.8.36-.8.8s.36.8.8.8h4.94v5.74h-3.66c-.44,0-.8.36-.8.8s.36.8.8.8h19.71c.44,0,.8-.36.8-.8s-.36-.8-.8-.8h-3.56v-5.74h13.99c.91,0,1.65-.74,1.65-1.65V1.89c0-1.04-.84-1.89-1.89-1.89ZM41.19,38.59h-9.31v-5.74h9.31v5.74Z"/>
                        <path d="M20.57,12.6H1.6c-.88,0-1.6.71-1.6,1.6v34.58c0,.88.71,1.6,1.6,1.6h18.97c.88,0,1.6-.71,1.6-1.6V14.19c0-.88-.71-1.6-1.6-1.6ZM20.58,48.78H1.59v-4.71h18.99v4.71ZM20.58,42.48H1.59V14.19h18.99v28.29Z"/>
                        <path d="M9.74,47.21h2.68c.44,0,.8-.36.8-.8s-.36-.8-.8-.8h-2.68c-.44,0-.8.36-.8.8s.36.8.8.8Z"/>
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-normal text-brand-fg mb-1">
                    Control Total en tu Smartphone
                  </h3>

                  <AnimatePresence initial={false}>
                    {openCards["res-3"] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-brand-muted text-sm md:text-base leading-relaxed font-light mt-3">
                          Monitorea desde cualquier lugar del mundo, tu generación, nivel de autoconsumo y el estado de baterías. Alertas ante cualquier anomalía y envío de reportes mensuales.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="commercial"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
              >
                {/* C&I Card 1: Reducción LCOE */}
                <button
                  type="button"
                  onClick={() => toggleCard("com-1")}
                  className="w-full text-left bg-[#FDFFFE] p-6 md:p-7 rounded-[20px] border border-black/5 flex flex-col hover:shadow-xl hover:border-[#FF8300]/30 transition-all duration-300 group cursor-pointer focus:outline-none"
                  style={{ backgroundColor: "#FDFFFE" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#FF8300]/10 text-[#FF8300] flex items-center justify-center transition-transform group-hover:scale-110">
                      <TrendingUp className="w-5 h-5 stroke-[1.5]" />
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-normal text-brand-fg mb-1">
                    Optimización de LCOE y OPEX
                  </h3>

                  <AnimatePresence initial={false}>
                    {openCards["com-1"] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-brand-muted text-sm md:text-base leading-relaxed font-light mt-3">
                          Para plantas industriales, lecherías, frigoríficos y hoteles en el sur. Mitigamos el impacto de las tarifas en horas punta y bajamos el costo nivelado de la energía (LCOE) para blindar tu margen operacional.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                {/* C&I Card 2: Modelos PPA / EaaS Capex Cero */}
                <button
                  type="button"
                  onClick={() => toggleCard("com-2")}
                  className="w-full text-left bg-[#FDFFFE] p-6 md:p-7 rounded-[20px] border border-black/5 flex flex-col hover:shadow-xl hover:border-[#FF8300]/30 transition-all duration-300 group cursor-pointer focus:outline-none"
                  style={{ backgroundColor: "#FDFFFE" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#FF8300]/10 text-[#FF8300] flex items-center justify-center transition-transform group-hover:scale-110">
                        <Zap className="w-5 h-5 stroke-[1.5]" />
                      </div>
                      <span className="text-xs font-medium uppercase tracking-widest text-[#FF8300]">
                        Pronto
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-normal text-brand-fg mb-1">
                    Modelos PPA & EaaS Capex Cero
                  </h3>

                  <AnimatePresence initial={false}>
                    {openCards["com-2"] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-brand-muted text-sm md:text-base leading-relaxed font-light mt-3">
                          Implementa tu planta solar sin desembolso inicial de capital. SoldeRío financia, diseña, instala y opera el activo bajo un contrato de suministro de energía limpia con tarifas garantizadas más bajas que la red.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                {/* C&I Card 3: ESG & Sostenibilidad */}
                <button
                  type="button"
                  onClick={() => toggleCard("com-3")}
                  className="w-full text-left bg-[#FDFFFE] p-6 md:p-7 rounded-[20px] border border-black/5 flex flex-col hover:shadow-xl hover:border-[#FF8300]/30 transition-all duration-300 group cursor-pointer focus:outline-none"
                  style={{ backgroundColor: "#FDFFFE" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#FF8300]/10 text-[#FF8300] flex items-center justify-center transition-transform group-hover:scale-110">
                        <Award className="w-5 h-5 stroke-[1.5]" />
                      </div>
                      <span className="text-xs font-medium uppercase tracking-widest text-[#FF8300]">
                        Pronto
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-normal text-brand-fg mb-1">
                    Cumplimiento ESG & Exportación
                  </h3>

                  <AnimatePresence initial={false}>
                    {openCards["com-3"] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-brand-muted text-sm md:text-base leading-relaxed font-light mt-3">
                          Acelera la descarbonización de tu cadena de valor. Emitimos certificados de generación 100% renovable auditables para memorias de sostenibilidad, estándares IREC y requerimientos de mercados de exportación europeos y norteamericanos.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
