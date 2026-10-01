"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, CheckCircle2, Send, AlertCircle, Loader2 } from "lucide-react";

export function TrabajaForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    cargo: "Ingeniero Eléctrico SEC Clase A",
    comuna: "",
    linkedin: "",
    mensaje: "",
  });
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    size: number;
    type: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación de tamaño (máx. 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setSubmitError("El archivo seleccionado excede el tamaño máximo permitido de 10 MB.");
      setFileName(null);
      setFileDetails(null);
      return;
    }

    // Validación de extensión segura
    const validExtensions = [".pdf", ".docx", ".doc"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(ext)) {
      setSubmitError(
        "Formato de archivo inválido. Por favor adjunta un documento en formato PDF o Word (.docx, .doc)."
      );
      setFileName(null);
      setFileDetails(null);
      return;
    }

    setSubmitError(null);
    setFileName(file.name);
    setFileDetails({
      name: file.name,
      size: file.size,
      type: file.type || (ext === ".pdf" ? "application/pdf" : "application/msword"),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!acceptTerms) {
      setSubmitError("Debes aceptar las políticas de privacidad para enviar tus antecedentes.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/trabaja-con-nosotros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cvFile: fileDetails,
          acceptTerms,
          website_url: honeypot,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setSubmitError(
          data.error ||
            "Ocurrió un error al procesar tu postulación. Por favor verifica tus datos e intenta nuevamente."
        );
      }
    } catch (err) {
      setSubmitError(
        "Ocurrió un error de conexión al enviar tu postulación. Por favor intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="postular" className="bg-[#141414] py-20 md:py-32 relative text-white overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-emerald-500/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="w-full px-3 md:px-5 box-border relative z-10">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-xs md:text-sm font-light uppercase tracking-widest text-[#FF8300] mb-3 block">
              Formulario de Postulación
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-4">
              Envíanos tus Antecedentes
            </h2>
            <p className="text-white/70 text-sm md:text-base font-light leading-relaxed">
              Completa tus datos y adjunta tu Curriculum Vitae. Nuestro equipo de ingeniería revisará tu perfil con estricta confidencialidad bajo la Ley N° 19.628.
            </p>
          </div>

          {/* Form Container */}
          <div className="p-8 md:p-12 rounded-[28px] bg-[#1F1F1F] border border-white/10 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-light text-white">
                  ¡Postulación Recibida Exitosamente!
                </h3>
                <p className="text-sm text-white/70 font-light max-w-md mx-auto">
                  Gracias por tu interés en sumarte a SoldeRío. Revisaremos tus antecedentes y te contactaremos a la brevedad si tu perfil calza con los requerimientos técnicos.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot anti-spam field (Invisible para bots) */}
                <div
                  className="hidden"
                  aria-hidden="true"
                  style={{ display: "none", position: "absolute", left: "-9999px" }}
                >
                  <label htmlFor="job_website_url">No completar este campo</label>
                  <input
                    type="text"
                    id="job_website_url"
                    name="website_url"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="job_nombre" className="text-xs text-white/70 font-light block mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      id="job_nombre"
                      type="text"
                      required
                      aria-required="true"
                      placeholder="Ej: Marcelo Gómez"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-white/30 text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300] focus-visible:ring-2 focus-visible:ring-[#FF8300]"
                    />
                  </div>

                  <div>
                    <label htmlFor="job_email" className="text-xs text-white/70 font-light block mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      id="job_email"
                      type="email"
                      required
                      aria-required="true"
                      placeholder="nombre@ejemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-white/30 text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300] focus-visible:ring-2 focus-visible:ring-[#FF8300]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="job_telefono" className="text-xs text-white/70 font-light block mb-2">
                      Teléfono WhatsApp *
                    </label>
                    <input
                      id="job_telefono"
                      type="tel"
                      required
                      aria-required="true"
                      placeholder="+56 9 1234 5678"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-white/30 text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300] focus-visible:ring-2 focus-visible:ring-[#FF8300]"
                    />
                  </div>

                  <div>
                    <label htmlFor="job_cargo" className="text-xs text-white/70 font-light block mb-2">
                      Cargo al que Postulas *
                    </label>
                    <select
                      id="job_cargo"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300] focus-visible:ring-2 focus-visible:ring-[#FF8300] cursor-pointer"
                    >
                      <option value="Ingeniero Eléctrico SEC Clase A" className="bg-[#1F1F1F]">Ingeniero(a) Eléctrico(a) SEC Clase A</option>
                      <option value="Técnico Montajista e Instalador Solar" className="bg-[#1F1F1F]">Técnico(a) Montajista e Instalador(a)</option>
                      <option value="Asesor Técnico-Comercial" className="bg-[#1F1F1F]">Asesor(a) Técnico-Comercial</option>
                      <option value="Postulación Espontánea" className="bg-[#1F1F1F]">Otra Área (Postulación Espontánea)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="job_comuna" className="text-xs text-white/70 font-light block mb-2">
                      Ciudad / Comuna de Residencia
                    </label>
                    <input
                      id="job_comuna"
                      type="text"
                      placeholder="Ej: Valdivia, Osorno, Puerto Varas"
                      value={formData.comuna}
                      onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-white/30 text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300] focus-visible:ring-2 focus-visible:ring-[#FF8300]"
                    />
                  </div>

                  <div>
                    <label htmlFor="job_linkedin" className="text-xs text-white/70 font-light block mb-2">
                      Perfil de LinkedIn (Opcional)
                    </label>
                    <input
                      id="job_linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/tu-perfil"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-white/30 text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300] focus-visible:ring-2 focus-visible:ring-[#FF8300]"
                    />
                  </div>
                </div>

                {/* CV File Upload */}
                <div>
                  <label htmlFor="job_cv_file" className="text-xs text-white/70 font-light block mb-2">
                    Adjuntar CV o Certificado SEC (PDF, DOCX) *
                  </label>
                  <label
                    htmlFor="job_cv_file"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        document.getElementById("job_cv_file")?.click();
                      }
                    }}
                    className="border-2 border-dashed border-white/20 hover:border-[#FF8300] focus-within:border-[#FF8300] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-black/20 group focus:outline-none focus:ring-2 focus:ring-[#FF8300]"
                  >
                    <Upload className="w-6 h-6 text-white/40 group-hover:text-[#FF8300] group-focus-within:text-[#FF8300] mb-2 transition-colors" />
                    <span className="text-xs text-white/80 font-light text-center">
                      {fileName ? (
                        <span className="text-emerald-400 font-normal">{fileName}</span>
                      ) : (
                        <>
                          Haz clic para subir tu archivo o arrástralo aquí <br />
                          <span className="text-[10px] text-white/40">(PDF o DOCX, Máx. 10 MB)</span>
                        </>
                      )}
                    </span>
                    <input
                      id="job_cv_file"
                      type="file"
                      accept=".pdf,.docx,.doc"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                <div>
                  <label htmlFor="job_mensaje" className="text-xs text-white/70 font-light block mb-2">
                    Mensaje o Breve Presentación
                  </label>
                  <textarea
                    id="job_mensaje"
                    rows={3}
                    placeholder="Cuéntanos brevemente sobre tu experiencia en energías renovables o qué te motiva a postular a SoldeRío..."
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-white/30 text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300] focus-visible:ring-2 focus-visible:ring-[#FF8300]"
                  />
                </div>

                {/* Consent Checkbox Conforme Ley N° 19.628 */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="trabaja_accept_terms"
                    required
                    aria-required="true"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-[#FF8300] rounded cursor-pointer flex-shrink-0"
                  />
                  <label
                    htmlFor="trabaja_accept_terms"
                    className="text-xs text-white/70 font-light cursor-pointer leading-relaxed"
                  >
                    He leído y acepto las{" "}
                    <Link
                      href="/politicas-de-privacidad"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF8300] underline hover:text-[#e07400] transition-colors"
                    >
                      políticas de privacidad
                    </Link>{" "}
                    y autorizo el tratamiento confidencial de mis antecedentes curriculares para procesos de selección en SoldeRío SpA conforme a la Ley N° 19.628. *
                  </label>
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs md:text-sm flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{submitError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-[#FF8300] text-white font-light text-sm uppercase tracking-wider hover:bg-[#e07400] transition-all shadow-xl hover:shadow-[0_0_30px_rgba(255,131,0,0.5)] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enviando Antecedentes...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar Postulación</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
