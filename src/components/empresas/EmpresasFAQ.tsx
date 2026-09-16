"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  highlight?: string;
}

const EMPRESAS_FAQS: FAQItem[] = [
  {
    id: "peak-shaving-punta",
    question: "¿Cómo reduce un sistema BESS (baterías) el sobrecargo de Horario Punta en tarifas BT4.3 / AT4.3?",
    answer:
      "En Chile, las distribuidoras eléctricas (como Saesa o Crell) aplican entre abril y septiembre un cargo severo por la potencia máxima demandada durante el «Horario Punta» (18:00 a 22:00 hrs). Este cargo oscila entre $15.000 y $40.000 CLP mensuales por cada kW registrado en esa ventana horaria.\n\nLo más crítico para el flujo de caja: el pico más alto registrado en ese periodo se factura como base de potencia fija durante los 12 meses del año, inflando el OpEx eléctrico de la empresa de forma permanente.\n\nUn sistema BESS (Battery Energy Storage System) realiza Peak Shaving (recorte de picos): la batería se carga automáticamente con energía solar diurna a costo marginal $0 (o en horas nocturnas valle a tarifa reducida) y se descarga justo entre las 18:00 y 22:00 hrs para abastecer la faena sin demandar potencia de la red.",
    highlight:
      "Ejemplo real en Lechería: Una lechería en Osorno o Llanquihue enciende ordeñadoras y estanques de frío a las 18:30 hrs, disparando un pico de 70 kW. Con BESS, la batería entrega esos 70 kW durante la ventana punta, evitando que el medidor registre demanda ante Saesa/Crell y ahorrando entre $12.600.000 y $33.600.000 CLP al año únicamente en el ítem de potencia facturada.",
  },
  {
    id: "autoconsumo-vs-inyeccion",
    question: "Bajo la Ley 21.118 (Net Billing), ¿por qué conviene almacenar en baterías en lugar de vender excedentes a la red?",
    answer:
      "Bajo la regulación chilena de Net Billing, cuando una planta solar inyecta excedentes a la red pública, la distribuidora los valoriza únicamente al «Precio Nudo de la Energía» (~$55 a $65 CLP/kWh). Por el contrario, cada kWh que tu empresa retira y compra de la red cuesta entre $160 y $210 CLP/kWh, ya que incluye cargos de transmisión troncal y peajes de distribución.\n\nEsto significa que verter excedentes a la red equivale a ceder entre $100 y $150 CLP por cada kWh generado. Al integrar almacenamiento BESS, la empresa realiza arbitraje energético: almacena la sobreproducción solar de 11:00 a 16:00 hrs para alimentar el proceso productivo en la tarde o noche, capturando el 100% del valor de sustitución de compra.",
    highlight:
      "Ejemplo real en Salmonera / Planta de Proceso: Una planta de procesamiento o piscicultura RAS en Puerto Montt opera 24/7 con bombeo continuo y túneles de frío. El BESS almacena 350 kWh de excedentes solares diurnos y los descarga en el turno nocturno, capturando un beneficio adicional de $1.800.000 CLP al mes ($21.6M al año) frente a inyectarlos a precio nudo.",
  },
  {
    id: "continuidad-sts-grid-forming",
    question: "¿Qué protección real entrega el sistema ante microcortes y caídas de tensión frecuentes en el sur?",
    answer:
      "Las redes de distribución en zonas rurales e industriales del sur sufren constantes caídas de tensión («sags») y microcortes de milisegundos provocados por temporales, viento y vegetación. Aunque muchas empresas tienen grupos electrógenos diésel, estos tardan entre 15 y 45 segundos en arrancar: tiempo suficiente para desconfigurar PLCs, apagar variadores de frecuencia de bombas y bloquear líneas de proceso automatizadas.\n\nNuestras soluciones incorporan conmutadores estáticos de transferencia (STS) con tiempo de respuesta ultra-rápido inferior a 10 milisegundos (<10ms) e inversores con tecnología Grid-Forming. El sistema crea y estabiliza su propia referencia de voltaje y frecuencia de forma instantánea, amortiguando fluctuaciones y manteniendo los motores en giro sin percibir la perturbación de la red.",
    highlight:
      "Ejemplo real en Piscicultura RAS: En una piscicultura con biomasa densa de smolts, una interrupción de 30 segundos en los sopladores de oxigenación forzada o bombas impulsoras genera pérdidas millonarias inmediatas. Con STS <10ms, el respaldo es 100% ininterrumpido e imperceptible para los sensores y PLC de control.",
  },
  {
    id: "desplazamiento-diesel",
    question: "¿Cómo compite una solución Solar + BESS frente a nuestros generadores diésel existentes?",
    answer:
      "Generar con diésel tras las reformas del MEPCO y considerando el flete a faenas agrícolas o acuícolas cuesta entre $380 y $460 CLP/kWh (combustible diésel + filtros + cambios de aceite + desgaste de motor). En contraste, la energía fotovoltaica con almacenamiento BESS opera a un costo nivelado (LCOE) de $45 a $70 CLP/kWh con costos de O&M mínimos.\n\nNuestra arquitectura no busca desechar tu generador existente, sino integrarlo en un ecosistema híbrido inteligente: el BESS asume los consumos habituales y los cortes imprevistos, limitando la operación del generador diésel únicamente a emergencias extremas y siempre en su rango de máxima eficiencia térmica (>75% de carga).",
    highlight:
      "Impacto en OpEx: Desplazar 1.500 horas anuales de quemado diésel en un generador de 150 kVA significa un ahorro directo superior a $22.000.000 CLP al año en combustible y mantenimiento, además de suprimir ruidos molestos y emisiones de CO₂ bajo estándares corporativos ESG.",
  },
  {
    id: "medicion-curva-carga",
    question: "¿Cómo dimensionan el proyecto si nuestra empresa solo cuenta con facturas mensuales globales?",
    answer:
      "Dimensionar una planta comercial e industrial únicamente a partir del consumo total mensual en kWh (o el costo promedio en $/kWh) de la boleta es un riesgo de ingeniería: se corre el peligro de subdimensionar la potencia para el Horario Punta o sobredimensionar la planta solar generando excedentes que no se aprovechan.\n\nPara garantizar precisión absoluta, el equipo de ingeniería de SoldeRío instala analizadores de redes trifásicos certificados en el empalme de tu empresa durante 15 a 30 días, sin costo alguno para el cliente. Este monitoreo registra cada 15 minutos el factor de potencia, armónicos, potencias reactivas y la curva de carga exacta de tus turnos de trabajo.",
    highlight:
      "Garantía de Ingeniería SoldeRío: Con los datos reales de tu operación simulamos la curva horaria exacta de ahorro en cargos por potencia ($/kW) y en energía consumida ($/kWh). El contrato EPC se formula sobre métricas reales de tu planta, no sobre supuestos teóricos.",
  },
  {
    id: "escudo-tributario-financiamiento",
    question: "¿Qué beneficios tributarios ante el SII y opciones de financiamiento existen para no inmovilizar capital?",
    answer:
      "En Chile, la inversión en proyectos solares y BESS para empresas cuenta con el beneficio de Depreciación Instantánea o Acelerada autorizado por el SII (Artículo 31 N°5 bis de la Ley sobre Impuesto a la Renta). Esto permite rebajar hasta el 100% del valor del proyecto en el mismo año comercial en que entra en operación, disminuyendo directamente la base imponible de Primera Categoría (representa un ahorro de caja efectivo del 27% sobre la inversión).\n\nEn cuanto a estructura financiera, gestionamos modelos de Leasing Verde y Crédito Comercial Verde con plazos de 36 a 84 meses. En esquemas de financiamiento bien dimensionados, el ahorro generado en la boleta eléctrica y el menor consumo de diésel cubren holgadamente la cuota mensual, permitiendo que el proyecto se autofinancie sin inmovilizar el capital de trabajo de tu negocio.",
    highlight:
      "Retorno Financiero: Combinando el escudo tributario de Primera Categoría (27%) y los ahorros operacionales en potencia y energía, el periodo de recuperación (Payback) para empresas del sur se sitúa típicamente entre 3,5 y 5 años, con una vida útil garantizada superior a 25 años.",
  },
];

export function EmpresasFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="w-full py-20 md:py-32 px-3 md:px-5 box-border bg-[#141414] text-white relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-[#FF8300]/10 rounded-full blur-[170px] pointer-events-none" />

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
            Respuestas para tomadores de decisión
          </h2>
          <p className="text-base md:text-lg text-white/70 font-light leading-relaxed">
            Claridad técnica, económica y regulatoria para Gerentes y Directores que evalúan proyectos de mejora para sus empresas.
          </p>
        </motion.div>

        {/* Accordion List */}
        <div className="space-y-4 mb-14">
          {EMPRESAS_FAQS.map((faq, idx) => {
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
                        <p className="text-sm md:text-sm text-white/70 font-light leading-relaxed whitespace-pre-line mb-4">
                          {faq.answer}
                        </p>

                        {faq.highlight && (
                          <div className="bg-[#FF8300]/10 border border-[#FF8300]/25 rounded-xl p-3.5 flex items-start gap-2.5">
                            <ShieldCheck className="w-4 h-4 text-[#FF8300] shrink-0 mt-0.5" />
                            <p className="text-sm md:text-xs text-white/90 font-light leading-relaxed">
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
              <h4 className="text-[17px] md:text-base font-normal text-white mb-1">
                ¿Necesitas una evaluación tarifaria o auditoría real de potencia para tu empresa?
              </h4>
              <p className="text-sm md:text-sm text-white/70 font-light">
                Si calificas, nuestros ingenieros modelarán tu curva horaria de carga y calculan el ahorro exacto sin costo inicial.
              </p>
            </div>
          </div>

          <CtaButton
            href="https://wa.me/56966186667?text=Hola%20quiero%20evaluar%20un%20proyecto%20solar%20o%20BESS%20para%20mi%20empresa"
            target="_blank"
            rel="noopener noreferrer"
            variant="white"
            className="relative z-10 text-sm md:text-sm"
          >
            Consultar con un Ingeniero
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
