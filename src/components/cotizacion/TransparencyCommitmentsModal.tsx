"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  UserCheck, 
  FileCheck2, 
  Award, 
  AlertTriangle,
  Lock
} from "lucide-react";
import { SolarSizingResult, QuoteFormData } from "@/types/cotizacion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sizing: SolarSizingResult;
  formData: QuoteFormData;
}

export function TransparencyCommitmentsModal({ isOpen, onClose, sizing, formData }: Props) {
  const rightsAndCommitments = sizing.rightsAndCommitments || {
    whatYouCanDemand: [
      {
        step: 1,
        question: "¿Qué tecnología y certificaciones respaldan los equipos?",
        title: "Tecnología Tier 1 y Certificación SEC",
        details: "Módulos Tier 1 N-Type TOPCon con 25 años de garantía de producto y 30 años de potencia lineal. Inversores híbridos certificados SEC con protocolo PE Nº 1/26 anti-isla y monitoreo WiFi/4G integrado.",
      },
      {
        step: 2,
        question: "¿Quién asume la responsabilidad del servicio técnico local?",
        title: "Soporte Técnico Local & Estanqueidad Garantizada",
        details: "Garantía formal por escrito de 1 año en estanqueidad de techumbre (cero filtraciones) y mano de obra. Cuadrilla técnica propia en el sur de Chile (Llanquihue, Osorno, Valdivia, Chiloé).",
      },
      {
        step: 3,
        question: "¿Cómo se legaliza la inyección y el cambio de medidor?",
        title: "Tramitación SEC TE4 y Proceso Net Billing Completo",
        details: "Ingreso formal de Formularios F1 a F5 ante la distribuidora (SAESA, CRELL, etc.) y obtención del Certificado TE4 SEC por instalador eléctrico autorizado Clase A o B. Medidor bidireccional gestionado.",
      },
      {
        step: 4,
        question: "¿Cuáles son los hitos de pago contra avance real?",
        title: "Hitos Transparentes 50% / 35% / 15%",
        details: "50% de anticipo para orden de compra y reserva de hardware. 35% contra arribo a faena y montaje en techo. 15% final únicamente contra puesta en marcha conforme y TE4 ingresado a la SEC.",
      },
    ],
    ownerCommitments: [
      {
        title: "Condiciones de Acceso y Empalme Eléctrico",
        details: "Facilitar acceso seguro a techumbre, tablero general y empalme en las fechas acordadas de montaje e inspección.",
      },
      {
        title: "Mantenimiento Periódico de Módulos",
        details: "Realizar o programar 1 a 2 lavados anuales con agua desmineralizada y mantener despejado el entorno de sombras por vegetación.",
      },
      {
        title: "Integridad de las Instalaciones",
        details: "No intervenir el inversor, protecciones DC/AC ni conexionado eléctrico sin la presencia o autorización escrita de personal técnico calificado.",
      },
      {
        title: "Monitoreo Proactivo de la Planta",
        details: "Mantener el inversor conectado a internet y revisar periódicamente la App FusionSolar para alertar anomalías o desconexiones.",
      },
    ],
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="w-full max-w-4xl max-h-[92vh] flex flex-col p-5 sm:p-8 rounded-[28px] bg-gradient-to-b from-[#1E1E1E] via-[#161616] to-[#111111] border border-white/15 shadow-2xl relative text-white overflow-hidden"
          >
            {/* Ambient lighting */}
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#FF8300]/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer z-10"
              title="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="mb-4 pr-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-medium mb-2 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>MARCO DE TRANSPARENCIA & AUDITORÍA SOLDE RÍO</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight">
                Qué Exigir al Contratar & Tus Compromisos
              </h3>
              <p className="text-xs sm:text-sm text-white/60 font-light mt-1">
                La instalación solar fotovoltaica es una inversión de 25+ años. Estas son las garantías indispensables y buenas prácticas de la industria.
              </p>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto pr-1 space-y-6 flex-1">
              {/* Section 1: Qué puede exigir quien contrata */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-[#FF8300]/20 text-[#FF8300] flex items-center justify-center">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-sm sm:text-base font-medium text-white tracking-wide">
                    Qué puede exigir quien contrata (Las 4 preguntas clave)
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {rightsAndCommitments.whatYouCanDemand.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-[#FF8300]/30 transition-all space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#FF8300]/20 text-[#FF8300] text-[11px] font-mono font-bold flex items-center justify-center flex-shrink-0">
                          {item.step}
                        </span>
                        <h5 className="text-xs font-semibold text-[#FF8300] leading-snug">
                          {item.question}
                        </h5>
                      </div>
                      <div className="text-xs font-medium text-white pl-7">
                        {item.title}
                      </div>
                      <p className="text-xs text-white/70 font-light pl-7 leading-relaxed">
                        {item.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Compromisos del Propietario */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-sm sm:text-base font-medium text-white tracking-wide">
                    Me comprometo a como propietario
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {rightsAndCommitments.ownerCommitments.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <h5 className="text-xs font-semibold text-emerald-300">
                          {item.title}
                        </h5>
                      </div>
                      <p className="text-xs text-white/70 font-light pl-6 leading-relaxed">
                        {item.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regulatory Anchor Badge */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs text-white/70 font-light leading-relaxed flex items-start gap-3">
                <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-medium block mb-0.5">
                    Marco Legal Vigente: {sizing.regulatoryTitle || "Ley 21.118 Netbilling"}
                  </strong>
                  Respaldado por el Decreto Supremo {sizing.regulatoryDecree || "DS 57/2019"}, los Pliegos Técnicos RIC N° 01 al 19 y tramitación oficial mediante instalador eléctrico certificado Clase A o B ante la plataforma GDA de la Superintendencia de Electricidad y Combustibles (SEC).
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-white/40 text-[11px] font-mono">
                Protocolo de calidad e ingeniería SoldeRío Sur.
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-full bg-[#FF8300] hover:bg-[#e07400] text-white text-xs font-medium uppercase tracking-wider transition-all cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
