"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle2, Send, Paperclip } from "lucide-react";

export function TrabajaForm() {
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
              Completa tus datos y adjunta tu Curriculum Vitae. Nuestro equipo de ingeniería revisará tu perfil con estricta confidencialidad.
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-white/70 font-light block mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Marcelo Gómez"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-white/30 text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/70 font-light block mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nombre@ejemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-white/30 text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-white/70 font-light block mb-2">
                      Teléfono WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+56 9 1234 5678"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-white/30 text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/70 font-light block mb-2">
                      Cargo al que Postulas *
                    </label>
                    <select
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300]"
                    >
                      <option value="Ingeniero Eléctrico SEC Clase A">Ingeniero(a) Eléctrico(a) SEC Clase A</option>
                      <option value="Técnico Montajista e Instalador Solar">Técnico(a) Montajista e Instalador(a)</option>
                      <option value="Asesor Técnico-Comercial">Asesor(a) Técnico-Comercial</option>
                      <option value="Postulación Espontánea">Otra Área (Postulación Espontánea)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-white/70 font-light block mb-2">
                      Ciudad / Comuna de Residencia
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Valdivia, Osorno, Puerto Varas"
                      value={formData.comuna}
                      onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-white/30 text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/70 font-light block mb-2">
                      Perfil de LinkedIn (Opcional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/tu-perfil"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-white/30 text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300]"
                    />
                  </div>
                </div>

                {/* CV File Upload */}
                <div>
                  <label className="text-xs text-white/70 font-light block mb-2">
                    Adjuntar CV o Certificado SEC (PDF, DOCX) *
                  </label>
                  <label className="border-2 border-dashed border-white/20 hover:border-[#FF8300] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-black/20 group">
                    <Upload className="w-6 h-6 text-white/40 group-hover:text-[#FF8300] mb-2 transition-colors" />
                    <span className="text-xs text-white/80 font-light text-center">
                      {fileName ? (
                        <span className="text-emerald-400 font-normal">{fileName}</span>
                      ) : (
                        <>Haz clic para subir tu archivo o arrástralo aquí <br /><span className="text-[10px] text-white/40">(Máx. 10 MB)</span></>
                      )}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                </div>

                <div>
                  <label className="text-xs text-white/70 font-light block mb-2">
                    Mensaje o Breve Presentación
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Cuéntanos brevemente sobre tu experiencia en energías renovables o qué te motiva a postular a SoldeRío..."
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-white/30 text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#FF8300] text-white font-light text-sm uppercase tracking-wider hover:bg-[#e07400] transition-all shadow-xl hover:shadow-[0_0_30px_rgba(255,131,0,0.5)] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Enviar Postulación</span>
                  <Send className="w-4 h-4" />
                </button>

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
