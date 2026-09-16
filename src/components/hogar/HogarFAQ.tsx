"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  highlight?: string;
}

const FAQS: FAQItem[] = [
  {
    id: "clima-sur",
    question: "¿Cómo funcionan los paneles solares en el invierno lluvioso y nublado del sur?",
    answer:
      "Los paneles solares no requieren cielo despejado para generar energía: capturan la radiación difusa que atraviesa la capa de nubes. En SoldeRío utilizamos módulos con tecnología N-Type TOPCon bifaciales de alta sensibilidad, capaces de generar entre un 20% y 40% de su capacidad nominal incluso en días nublados con lluvia ligera.",
    highlight:
      "Además, bajo la Ley 21.118 (Net Billing), la sobreproducción de primavera y verano inyecta excedentes valorizados a la red, acumulando saldos a tu favor que descuentan automáticamente tu consumo en invierno.",
  },
  {
    id: "cortes-red",
    question: "¿Qué ocurre en mi casa si se corta la luz de Saesa o Crell?",
    answer:
      "En una planta On-Grid convencional, por estricta normativa de seguridad SEC (RIC N°15 de protección anti-isla), el inversor debe apagarse automáticamente para no energizar la red pública mientras los técnicos reparan las líneas.",
    highlight:
      "Sin embargo, si instalas una Planta Solar Híbrida SoldeRío con Batería LiFePO4 (LUNA2000) y Backup Box, el sistema conmuta a microred autónoma en menos de 10 milisegundos (<10ms). Tu bomba de pozo, refrigerador, caldera, wifi e iluminación continúan funcionando sin que la familia perciba el corte.",
  },
  {
    id: "cuantos-paneles",
    question: "¿Cuántos paneles solares necesita mi casa o parcela?",
    answer:
      "La cantidad exacta depende del consumo mensual en kWh que figura en tu boleta eléctrica y de tus consumos críticos:\n\n• Consumo bajo/medio ($35.000 a $65.000 CLP/mes): Requiere entre 6 y 8 paneles (~3.3 a 4.5 kWp).\n• Consumo medio/alto ($70.000 a $130.000 CLP/mes): Requiere entre 10 y 14 paneles (~5.5 a 7.8 kWp).\n• Parcelas con bomba de pozo, calefacción eléctrica o tinaja ($140.000+ CLP/mes): Requiere entre 14 y 22 paneles (~8 a 12 kWp), habitualmente acompañado de baterías LiFePO4.",
    highlight:
      "Puedes ingresar tu factura en nuestro Cotizador Inteligente y calcular en 2 minutos la potencia exacta para tu comuna.",
  },
  {
    id: "costo-financiamiento",
    question: "¿Cuánto cuesta una instalación solar y cómo se financia con Crédito Verde?",
    answer:
      "Una planta residencial On-Grid llave en mano suele situarse entre los $3.8M y $6.5M CLP según la potencia, mientras que un sistema Híbrido con almacenamiento LiFePO4 parte desde los $7.5M CLP.",
    highlight:
      "Hoy puedes financiar el 100% del proyecto mediante Crédito Verde bancario (BancoEstado, BICE, Santander, Banco de Chile) con plazos de 36 a 72 meses y tasas de interés preferenciales. En la mayoría de los hogares, el ahorro mensual en la cuenta de luz cubre prácticamente la cuota del crédito, permitiéndote pagar el sistema sin descapitalizarte.",
  },
  {
    id: "tramites-sec",
    question: "¿Qué trámites ante la SEC y la distribuidora se requieren y quién los realiza?",
    answer:
      "Toda instalación fotovoltaica debe ejecutarse según los Pliegos Técnicos RIC N°09 y N°15 y declararse formalmente ante la Superintendencia de Electricidad y Combustibles (SEC) mediante los trámites TE-1 y TE-4 (Ley 21.118 de Generación Distribuida).",
    highlight:
      "En SoldeRío nuestro equipo de ingenieros eléctricos certificados SEC se encarga del proceso 100% llave en mano: memoria de cálculo, planos eléctricos, solicitud de conexión ante Saesa/Crell/CGE y la coordinación para la instalación del medidor bidireccional.",
  },
];

export function HogarFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="w-full py-20 md:py-32 px-3 md:px-5 box-border bg-[#141414] text-white relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#FF8300]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1000px] mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight leading-[1.1] mb-5">
            Preguntas Frecuentes
          </h2>
          <p className="text-base md:text-lg text-white/70 font-light leading-relaxed">
            Resolvemos las dudas técnicas, económicas y legales más comunes al momento de evaluar paneles solares para tu casa o parcela en el sur.
          </p>
        </motion.div>

        {/* Accordion List */}
        <div className="space-y-4 mb-14">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`rounded-[22px] border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-[#1F1F1F] border-[#FF8300]/40 shadow-xl shadow-black/40"
                    : "bg-[#1A1A1A]/90 border-white/10 hover:border-white/20 hover:bg-[#1F1F1F]/70"
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-6 md:p-7 flex items-center justify-between gap-4 cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-base md:text-lg font-light tracking-tight leading-snug transition-colors ${
                      isOpen ? "text-white" : "text-white/90"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? "bg-[#FF8300] text-white rotate-180 shadow-[0_0_15px_rgba(255,131,0,0.4)]"
                        : "bg-white/5 text-white/60 border border-white/10"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      <div className="px-6 md:px-7 pb-6 md:pb-7 pt-1 border-t border-white/10">
                        <p className="text-sm md:text-base text-white/70 font-light leading-relaxed whitespace-pre-line mb-4">
                          {faq.answer}
                        </p>

                        {faq.highlight && (
                          <div className="bg-[#FF8300]/10 border border-[#FF8300]/25 rounded-xl p-3.5 flex items-start gap-2.5">
                            <ShieldCheck className="w-4 h-4 text-[#FF8300] shrink-0 mt-0.5" />
                            <p className="text-sm md:text-base text-white/90 font-light leading-relaxed">
                              {faq.highlight}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Help Banner */}
        <div className="bg-gradient-to-r from-[#1F1F1F] to-[#262626] rounded-[24px] border border-white/10 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF8300]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-4 text-center sm:text-left relative z-10">
            <div className="w-12 h-12 rounded-full bg-[#FF8300]/15 border border-[#FF8300]/20 text-[#FF8300] flex items-center justify-center shrink-0 hidden sm:flex">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-[17px] font-normal text-white mb-1">
                ¿Tienes una duda específica sobre tu proyecto solar?
              </h4>
              <p className="text-sm md:text-base text-white/70 font-light">
                Conversa directamente con nuestros ingenieros.
              </p>
            </div>
          </div>

          <CtaButton
            href="https://wa.me/56966186667?text=Hola%20quiero%20hablar%20con%20un%20ingeniero%20por%20un%20proyecto%20solar"
            target="_blank"
            rel="noopener noreferrer"
            variant="white"
            className="relative z-10 text-sm md:text-base"
          >
            Hablar con un Ingeniero
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
