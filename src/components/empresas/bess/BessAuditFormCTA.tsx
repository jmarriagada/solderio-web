"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Send, CheckCircle2, MessageSquare, Activity, Clock, FileSpreadsheet, AlertCircle, Loader2 } from "lucide-react";
import { TurnstileWidget } from "@/components/security/TurnstileWidget";

export function BessAuditFormCTA() {
  const [formData, setFormData] = useState({
    empresa: "",
    contacto: "",
    cargo: "",
    telefono: "",
    email: "",
    comuna: "",
    tarifa: "BT4.3",
    potenciaKva: "",
    comentarios: "",
  });

  const [acceptTerms, setAcceptTerms] = useState(true);
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken("");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!acceptTerms) {
      setSubmitError("Debes aceptar las políticas de privacidad para solicitar la auditoría.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/empresas/bess-industrial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          acceptTerms,
          turnstileToken,
          website_url: honeypot,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setSubmitError(
          data.error ||
            "Ocurrió un error al procesar tu solicitud de auditoría. Por favor verifica tus datos e intenta nuevamente."
        );
      }
    } catch (err) {
      setSubmitError(
        "Ocurrió un error de conexión al enviar la solicitud. Por favor intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubmitError(null);
    setHoneypot("");
    setTurnstileToken("");
    setFormData({
      empresa: "",
      contacto: "",
      cargo: "",
      telefono: "",
      email: "",
      comuna: "",
      tarifa: "BT4.3",
      potenciaKva: "",
      comentarios: "",
    });
  };

  return (
    <section id="auditoria-bess" className="w-full py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#141414] text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-[#FF8300]/10 rounded-full blur-[200px] pointer-events-none" />

      {/* Centered SoldeRío Isotipo Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-5 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/icon-solderio.svg"
          alt="SoldeRío Isotipo"
          className="w-[450px] md:w-[600px] h-auto select-none"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Why an Analyzer is needed (5 cols) */}
          <div className="lg:col-span-5 text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.12] mb-6 text-white">
              Auditoría Real de Potencia con Analizador de Redes
            </h2>
            <p className="text-base text-white/70 font-light leading-relaxed mb-8">
              Si tu empresa califica, nuestros ingenieros eléctricos certificados SEC instalarán un analizador de redes trifásico clase A durante 15 a 30 días, sin costo alguno.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#FF8300]/15 border border-[#FF8300]/25 flex items-center justify-center text-[#FF8300] shrink-0 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Curva de Carga Cuarto-Horaria</h4>
                  <p className="text-xs text-white/60 font-light leading-relaxed">
                    Registro cada 15 minutos de kW, kVAR, corriente de arranque y factor de potencia real de tus turnos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#FF8300]/15 border border-[#FF8300]/25 flex items-center justify-center text-[#FF8300] shrink-0 mt-0.5">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Informe de Ingeniería y ROI Garantizado</h4>
                  <p className="text-xs text-white/60 font-light leading-relaxed">
                    Dimensionamiento exacto de batería y potencia para no sobrepagar CAPEX ni subdimensionar en punta.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#FF8300]/15 border border-[#FF8300]/25 flex items-center justify-center text-[#FF8300] shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Instalación No Invasiva</h4>
                  <p className="text-xs text-white/60 font-light leading-relaxed">
                    Se conectan sondas Rogowski en las barras principales del TGBT sin detener la producción de la planta.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Option */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-3">
              <span className="text-xs text-white/60 font-light">¿Prefieres coordinar directo por chat?</span>
              <a
                href="https://wa.me/56966186667?text=Hola%20quiero%20coordinar%20una%20auditoria%20con%20analizador%20de%20redes%20para%20mi%20empresa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#FF8300] hover:underline font-mono"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp de Ingeniería</span>
              </a>
            </div>
          </div>

          {/* Right Column: High-Ticket Lead Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#1A1A1A] rounded-[28px] border border-white/15 p-6 md:p-10 shadow-2xl relative">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-light text-white mb-2">Solicitud de Auditoría Ingresada</h3>
                <p className="text-sm text-white/70 font-light max-w-md mx-auto mb-4">
                  Un ingeniero eléctrico de SoldeRío revisará los datos de tu faena y te contactará en menos de 24 horas hábiles para coordinar la visita técnica in-situ.
                </p>
                <p className="text-xs text-emerald-400 font-mono mb-6">
                  ✉️ Hemos enviado un correo de confirmación con los detalles a tu casilla corporativa.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors cursor-pointer"
                >
                  Enviar otra solicitud
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot anti-spam invisible para usuarios reales */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="bess_website_url">No llenar este campo</label>
                  <input
                    type="text"
                    id="bess_website_url"
                    name="website_url"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <h3 className="text-lg md:text-xl font-medium text-white mb-1">
                    Formulario de Calificación para Faenas C&amp;I
                  </h3>
                  <p className="text-xs text-white/60 font-light">
                    Ingresa los datos para verificar pre-factibilidad técnica y coordinar la instalación del equipo de medición.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bess_empresa" className="text-[11px] font-mono uppercase text-white/60 block mb-1">
                      Razón Social / Empresa *
                    </label>
                    <input
                      id="bess_empresa"
                      type="text"
                      required
                      aria-required="true"
                      value={formData.empresa}
                      onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                      placeholder="Ej. Agrícola y Lechera Los Alerces"
                      className="w-full bg-[#242424] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF8300] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="bess_comuna" className="text-[11px] font-mono uppercase text-white/60 block mb-1">
                      Comuna / Ubicación Faena *
                    </label>
                    <input
                      id="bess_comuna"
                      type="text"
                      required
                      aria-required="true"
                      value={formData.comuna}
                      onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                      placeholder="Ej. Osorno / Frutillar / Puerto Montt"
                      className="w-full bg-[#242424] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF8300] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bess_contacto" className="text-[11px] font-mono uppercase text-white/60 block mb-1">
                      Nombre y Apellido *
                    </label>
                    <input
                      id="bess_contacto"
                      type="text"
                      required
                      aria-required="true"
                      value={formData.contacto}
                      onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                      placeholder="Ej. Carlos Valenzuela"
                      className="w-full bg-[#242424] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF8300] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="bess_cargo" className="text-[11px] font-mono uppercase text-white/60 block mb-1">
                      Cargo en la Empresa *
                    </label>
                    <input
                      id="bess_cargo"
                      type="text"
                      required
                      aria-required="true"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      placeholder="Ej. Gerente de Operaciones / Jefe de Planta"
                      className="w-full bg-[#242424] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF8300] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bess_telefono" className="text-[11px] font-mono uppercase text-white/60 block mb-1">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      id="bess_telefono"
                      type="tel"
                      required
                      aria-required="true"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="+56 9 1234 5678"
                      className="w-full bg-[#242424] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF8300] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="bess_email" className="text-[11px] font-mono uppercase text-white/60 block mb-1">
                      Email Corporativo *
                    </label>
                    <input
                      id="bess_email"
                      type="email"
                      required
                      aria-required="true"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="cvalenzuela@empresa.cl"
                      className="w-full bg-[#242424] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF8300] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bess_tarifa" className="text-[11px] font-mono uppercase text-white/60 block mb-1">
                      Tarifa Eléctrica Actual
                    </label>
                    <select
                      id="bess_tarifa"
                      value={formData.tarifa}
                      onChange={(e) => setFormData({ ...formData, tarifa: e.target.value })}
                      className="w-full bg-[#242424] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF8300] transition-colors cursor-pointer"
                    >
                      <option value="BT4.3">BT4.3 (Baja Tensión con Punta)</option>
                      <option value="AT4.3">AT4.3 (Alta Tensión con Punta)</option>
                      <option value="Libre">Cliente Libre / No Regulado</option>
                      <option value="OffGrid">Aislada 100% Diésel</option>
                      <option value="NoSeguro">No estoy seguro (revisar boleta)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="bess_potencia" className="text-[11px] font-mono uppercase text-white/60 block mb-1">
                      Capacidad Transformador / Generador (kVA)
                    </label>
                    <input
                      id="bess_potencia"
                      type="text"
                      value={formData.potenciaKva}
                      onChange={(e) => setFormData({ ...formData, potenciaKva: e.target.value })}
                      placeholder="Ej. Trafo 150 kVA / Generador 200 kVA"
                      className="w-full bg-[#242424] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF8300] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bess_comentarios" className="text-[11px] font-mono uppercase text-white/60 block mb-1">
                    Descripción Breve de Cargas Críticas / Objetivos
                  </label>
                  <textarea
                    id="bess_comentarios"
                    rows={3}
                    value={formData.comentarios}
                    onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
                    placeholder="Ej. Queremos eliminar el sobrecargo de horas punta en la ordeña de las 18:30 hrs y tener respaldo en los sopladores de oxigenación ante microcortes..."
                    className="w-full bg-[#242424] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF8300] transition-colors resize-none"
                  />
                </div>

                {/* Consent Checkbox Conforme Ley N° 19.628 */}
                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="bess_terms"
                    required
                    aria-required="true"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-black/40 text-[#FF8300] focus:ring-[#FF8300] focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="bess_terms" className="text-xs text-white/70 font-light leading-relaxed cursor-pointer">
                    He leído y acepto las{" "}
                    <Link
                      href="/politicas-de-privacidad"
                      className="text-[#FF8300] underline hover:text-[#e07400] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      políticas de privacidad
                    </Link>{" "}
                    y autorizo el tratamiento de los datos corporativos para la evaluación técnica y coordinación de la auditoría conforme a la Ley N° 19.628. *
                  </label>
                </div>

                {/* Cloudflare Turnstile Anti-Bot Shield */}
                <TurnstileWidget
                  theme="dark"
                  onSuccess={handleTurnstileSuccess}
                  onExpire={handleTurnstileExpire}
                  className="my-2"
                />

                {submitError && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{submitError}</p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#FF8300] hover:bg-[#e07300] text-white font-medium text-xs md:text-sm py-3.5 rounded-full transition-all shadow-xl hover:shadow-[0_0_30px_rgba(255,131,0,0.5)] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Procesando Solicitud...</span>
                      </>
                    ) : (
                      <>
                        <span>Solicitar Instalación de Analizador de Redes</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
