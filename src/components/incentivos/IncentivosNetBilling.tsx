"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Receipt, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  Zap, 
  TrendingDown, 
  ShieldCheck, 
  Building 
} from "lucide-react";

export function IncentivosNetBilling() {
  const [activeTab, setActiveTab] = useState<"mecanismo" | "requisitos" | "distribuidoras">("mecanismo");

  const steps = [
    {
      num: "01",
      title: "Generación & Autoconsumo Diurno",
      desc: "Los paneles producen electricidad solar limpia. Esta energía abastece primero los consumos activos de tu propiedad (refrigeración, bombas, iluminación, computadores). Cada kWh autoconsumido es un kWh que NO le compras a la red.",
      tag: "Ahorro Inmediato (100%)",
    },
    {
      num: "02",
      title: "Inyección de Excedentes a la Red",
      desc: "Si tus paneles generan más de lo que estás consumiendo en ese instante (ej: mediodía soleado), el excedente pasa por tu medidor bidireccional y se inyecta a las líneas de distribución pública.",
      tag: "Venta Oficial Ley 21.118",
    },
    {
      num: "03",
      title: "Valorización y Descuento en Boleta",
      desc: "La distribuidora (Saesa, Crell, CGE) valoriza cada kWh inyectado al precio de compra de energía establecido por ley, y lo abona como saldo a favor en tu boleta eléctrica mensual.",
      tag: "Boleta $0 y Saldo a Favor",
    },
    {
      num: "04",
      title: "Acumulación y Reembolso en Dinero",
      desc: "Si tus excedentes superan tu consumo mensual total, el saldo se acumula para los meses de invierno. Si tras un periodo anual mantienes saldo a favor, la distribuidora debe reembolsarte el dinero a tu cuenta bancaria.",
      tag: "Derecho Legal por Decreto",
    },
  ];

  return (
    <section id="netbilling" className="bg-transparent py-20 md:py-32 relative overflow-hidden">
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
              Marco Legal Chileno
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight mb-6">
              Ley Net Billing N° 21.118
            </h2>
            <p className="text-brand-muted text-base md:text-lg font-light leading-relaxed">
              La legislación chilena que te da el derecho formal de generar tu propia energía solar, inyectar los excedentes a la red eléctrica y recibir pagos y descuentos directamente en tu boleta.
            </p>
          </motion.div>

          {/* Interactive Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1.5 rounded-full bg-[#F7F8FA] border border-black/10 shadow-inner">
              <button
                onClick={() => setActiveTab("mecanismo")}
                className={`px-6 py-2.5 rounded-full text-xs md:text-sm font-light transition-all cursor-pointer ${
                  activeTab === "mecanismo"
                    ? "bg-[#FF8300] text-white shadow-md font-normal"
                    : "text-[#6B7280] hover:text-black"
                }`}
              >
                ¿Cómo Funciona el Descuento?
              </button>
              <button
                onClick={() => setActiveTab("requisitos")}
                className={`px-6 py-2.5 rounded-full text-xs md:text-sm font-light transition-all cursor-pointer ${
                  activeTab === "requisitos"
                    ? "bg-[#FF8300] text-white shadow-md font-normal"
                    : "text-[#6B7280] hover:text-black"
                }`}
              >
                Requisitos Técnicos SEC
              </button>
              <button
                onClick={() => setActiveTab("distribuidoras")}
                className={`px-6 py-2.5 rounded-full text-xs md:text-sm font-light transition-all cursor-pointer ${
                  activeTab === "distribuidoras"
                    ? "bg-[#FF8300] text-white shadow-md font-normal"
                    : "text-[#6B7280] hover:text-black"
                }`}
              >
                Distribuidoras en el Sur
              </button>
            </div>
          </div>

          {/* Tab 1: Mecanismo de 4 Pasos */}
          <AnimatePresence mode="wait">
            {activeTab === "mecanismo" && (
              <motion.div
                key="mecanismo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-7 rounded-[24px] bg-[#F7F8FA] border border-black/5 hover:border-[#FF8300]/40 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-xl"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <span className="text-3xl font-light font-mono text-[#FF8300]">
                          {step.num}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] bg-white px-2.5 py-1 rounded-full border border-black/5">
                          {step.tag}
                        </span>
                      </div>

                      <h3 className="text-lg font-normal text-[#1F1F1F] mb-3 leading-snug">
                        {step.title}
                      </h3>

                      <p className="text-sm text-[#6B7280] font-light leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-black/5 flex items-center text-xs text-[#FF8300] font-light group-hover:translate-x-1 transition-transform">
                      <span>Proceso 100% regulado</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Tab 2: Requisitos Técnicos SEC */}
            {activeTab === "requisitos" && (
              <motion.div
                key="requisitos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                <div className="p-8 rounded-[24px] bg-[#F7F8FA] border border-black/5 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#FF8300]/10 text-[#FF8300] flex items-center justify-center mb-6">
                      <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <h3 className="text-xl font-normal text-[#1F1F1F] mb-3">
                      1. Inversores y Equipos Certificados SEC
                    </h3>
                    <p className="text-sm text-[#6B7280] font-light leading-relaxed mb-4">
                      Todo inversor y módulo solar debe contar con código de aprobación SEC oficial. Los inversores deben incluir protección Anti-Isla activa bajo el Pliego Técnico RIC N°15 para desconectarse automáticamente si la red pública falla, protegiendo a los cuadrilleros de mantenimiento.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#FF8300]">Norma: RIC N°15 & RIC N°09</span>
                </div>

                <div className="p-8 rounded-[24px] bg-[#F7F8FA] border border-black/5 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#FF8300]/10 text-[#FF8300] flex items-center justify-center mb-6">
                      <Zap className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <h3 className="text-xl font-normal text-[#1F1F1F] mb-3">
                      2. Medidor Bidireccional Inteligente
                    </h3>
                    <p className="text-sm text-[#6B7280] font-light leading-relaxed mb-4">
                      El medidor tradicional se reemplaza o reprograma por un medidor digital bidireccional de 4 cuadrantes que contabiliza en canales separados la energía consumida desde la red y la energía inyectada desde tu planta solar.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#FF8300]">Lectura remota y telemetría</span>
                </div>

                <div className="p-8 rounded-[24px] bg-[#F7F8FA] border border-black/5 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#FF8300]/10 text-[#FF8300] flex items-center justify-center mb-6">
                      <Receipt className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <h3 className="text-xl font-normal text-[#1F1F1F] mb-3">
                      3. Expediente SEC TE-1 y TE-4
                    </h3>
                    <p className="text-sm text-[#6B7280] font-light leading-relaxed mb-4">
                      SoldeRío gestiona el 100% de la tramitación: Formulario F1 de solicitud de conexión, Formulario F3 de respuesta de la distribuidora, protocolo TE-1 de instalación interior y certificado TE-4 de inyección a la red.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#FF8300]">Ingeniería SEC Clase A incluida</span>
                </div>
              </motion.div>
            )}

            {/* Tab 3: Distribuidoras en la Macrozona Sur */}
            {activeTab === "distribuidoras" && (
              <motion.div
                key="distribuidoras"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-[#F7F8FA] p-8 md:p-12 rounded-[28px] border border-black/5 shadow-sm"
              >
                <div className="max-w-3xl mb-8">
                  <h3 className="text-2xl font-light text-[#1F1F1F] mb-3">
                    Conexión directa con todas las distribuidoras eléctricas del sur
                  </h3>
                  <p className="text-sm md:text-base text-[#6B7280] font-light leading-relaxed">
                    Tramitamos y coordinamos formalmente la inspección y puesta en marcha de tu planta solar ante las compañías eléctricas de la zona:
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {[
                    { name: "Grupo Saesa", zone: "Los Lagos, Los Ríos, Aysén" },
                    { name: "Crell", zone: "Llanquihue, Frutillar, Puerto Varas" },
                    { name: "Frontel", zone: "La Araucanía & Biobío" },
                    { name: "CGE", zone: "Villarrica, Pucón, Macrozona Sur" },
                    { name: "Edelaysen", zone: "Región de Aysén & Patagonia" },
                  ].map((dist, dIdx) => (
                    <div key={dIdx} className="p-5 rounded-2xl bg-white border border-black/5 shadow-sm flex flex-col justify-between">
                      <span className="text-sm font-semibold text-[#1F1F1F] block mb-1">
                        {dist.name}
                      </span>
                      <span className="text-[11px] text-[#6B7280] font-light">
                        {dist.zone}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
