import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, FileText, Briefcase, Scale, Mail, CheckCircle2, UserCheck, AlertTriangle } from "lucide-react";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Políticas de Privacidad & Tratamiento de Datos | SoldeRío",
  description:
    "Políticas de privacidad y protección de datos personales de SoldeRío SpA. Conoce cómo resguardamos datos de clientes, visitas técnicas y antecedentes de postulantes conforme a la Ley N° 19.628.",
};

export default function PoliticasPrivacidadPage() {
  return (
    <main className="w-full min-h-screen relative bg-[#F7F8FA]">
      <FloatingNav alwaysVisible={true} />

      <article className="pt-28 md:pt-36 pb-20">
        <div className="w-full px-4 sm:px-6 md:px-8 box-border max-w-4xl mx-auto">
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#6B7280] hover:text-[#FF8300] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Volver al Inicio</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/25 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-600" />
              <span>Marco Legal: Ley N° 19.628 (Chile)</span>
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] bg-[#FF8300]/10 px-3.5 py-1.5 rounded-full border border-[#FF8300]/25 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cifrado SSL/TLS 256 bits</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F1F1F] tracking-tight mb-4 leading-tight">
            Políticas de Privacidad y Tratamiento de Datos
          </h1>

          <p className="text-xs text-[#6B7280] font-mono pb-6 border-b border-black/10 mb-8">
            Última actualización: Octubre 2026 • SoldeRío SpA (RUT: 77.892.450-1) • Puerto Varas, Región de Los Lagos, Chile
          </p>

          {/* Resumen Ejecutivo */}
          <div className="p-6 rounded-2xl bg-white border border-black/10 shadow-sm mb-10 space-y-3">
            <div className="flex items-center gap-2.5 text-[#1F1F1F] font-medium text-base">
              <ShieldCheck className="w-5 h-5 text-[#FF8300]" />
              <span>Resumen de Nuestro Compromiso</span>
            </div>
            <p className="text-sm text-[#4B5563] font-light leading-relaxed">
              En <strong>SoldeRío SpA</strong> tratamos tus datos personales con estricto apego a la <strong>Ley N° 19.628 sobre Protección de la Vida Privada</strong> y a los más altos estándares éticos de ingeniería. Tus datos se utilizan únicamente para evaluar la factibilidad técnica y económica de tu sistema solar, coordinar visitas a terreno o evaluar tu postulación laboral. <strong>Bajo ninguna circunstancia vendemos, cedemos ni transferimos tu información a terceros ni a redes de publicidad.</strong>
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-[#4B5563] font-light leading-relaxed space-y-8">
            
            {/* 1. Responsable */}
            <section>
              <h2 className="text-xl md:text-2xl font-medium text-[#1F1F1F] mb-3 flex items-center gap-2">
                <span>1. Identificación del Responsable del Tratamiento</span>
              </h2>
              <p>
                El responsable del tratamiento de los datos recabados en este sitio web (<a href="https://www.solderio.cl" className="text-[#FF8300] underline">www.solderio.cl</a>) es:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 my-3 text-sm">
                <li><strong>Razón Social:</strong> SoldeRío SpA</li>
                <li><strong>Domicilio:</strong> Macrozona Sur de Chile (Operaciones en Región de Los Lagos, Los Ríos y La Araucanía).</li>
                <li><strong>Correo de Contacto y Privacidad:</strong> <a href="mailto:contacto@solderio.cl" className="text-[#FF8300] font-mono">contacto@solderio.cl</a></li>
                <li><strong>Actividad:</strong> Ingeniería, diseño, montaje, tramitación SEC e integración de plantas solares fotovoltaicas y sistemas de almacenamiento con baterías (BESS).</li>
              </ul>
            </section>

            {/* 2. Tratamiento Clientes */}
            <section>
              <h2 className="text-xl md:text-2xl font-medium text-[#1F1F1F] mb-3 flex items-center gap-2">
                <span>2. Tratamiento de Datos de Clientes y Propietarios (Cotizador y Visita Técnica)</span>
              </h2>
              <p>
                Cuando utilizas nuestro <strong>Cotizador Inteligente</strong> o agendas una <strong>Visita Técnica Presencial</strong>, solicitamos únicamente la información necesaria para realizar cálculos de ingeniería de precisión:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 not-prose">
                <div className="p-4 rounded-xl bg-white border border-black/10">
                  <div className="text-xs font-mono uppercase text-[#FF8300] font-semibold mb-1.5">
                    Cotizador Solar Interactivo
                  </div>
                  <ul className="text-xs text-[#4B5563] space-y-1.5 list-disc pl-4">
                    <li>Nombre completo, correo electrónico y número de WhatsApp.</li>
                    <li>Comuna y región del inmueble.</li>
                    <li>Gasto eléctrico mensual ($CLP) o consumo en kWh.</li>
                    <li>Distribuidora eléctrica concesionaria (Saesa, Crell, CGE, Frontel, etc.).</li>
                    <li>Tipo de empalme (monofásico o trifásico) y tipo de cubierta.</li>
                    <li>Archivos de boletas eléctricas subidas voluntariamente.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white border border-black/10">
                  <div className="text-xs font-mono uppercase text-emerald-600 font-semibold mb-1.5">
                    Agendamiento de Visitas Técnicas
                  </div>
                  <ul className="text-xs text-[#4B5563] space-y-1.5 list-disc pl-4">
                    <li>Nombre, teléfono de contacto y correo de confirmación.</li>
                    <li>Dirección o sector exacto de la propiedad.</li>
                    <li>Coordenadas geográficas (latitud/longitud) para cálculo de sombreado e irradiación solar.</li>
                    <li>Fecha y bloque horario seleccionado.</li>
                    <li>Notas y observaciones particulares del acceso al predio.</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm">
                <strong>Finalidad del Tratamiento:</strong> Dimensionar la potencia requerida en paneles (kWp) e inversores (kW), proyectar el ahorro mensual y la inyección a red bajo la Ley Net Billing 21.118, simular el banco de baterías (kWh), verificar la viabilidad estructural in situ y emitir el informe técnico-económico solicitado por el titular.
              </p>
            </section>

            {/* 3. Postulantes Laborales */}
            <section>
              <h2 className="text-xl md:text-2xl font-medium text-[#1F1F1F] mb-3 flex items-center gap-2">
                <span>3. Política de Privacidad para Postulaciones Laborales ("Trabaja con Nosotros")</span>
              </h2>
              <p>
                En nuestro formulario de postulación (<a href="/trabaja-con-nosotros" className="text-[#FF8300] underline">/trabaja-con-nosotros</a>), recopilamos antecedentes laborales, currículum vitae (CV) y certificaciones técnicas (por ejemplo, Licencia SEC Clase A, B, C o instalador eléctrico) para incorporar talento a nuestro equipo de ingeniería y montaje en el sur de Chile.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 not-prose">
                <div className="p-4 rounded-xl bg-white border border-black/10">
                  <div className="text-xs font-mono uppercase text-[#FF8300] font-semibold mb-1.5">
                    Finalidad Exclusiva
                  </div>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Evaluación de idoneidad técnica, experiencia en energías renovables y selección para vacantes laborales vigentes o futuras en SoldeRío SpA.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-black/10">
                  <div className="text-xs font-mono uppercase text-emerald-600 font-semibold mb-1.5">
                    Principio de No Discriminación
                  </div>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Cumplimos rigurosamente con el Artículo 2 del Código del Trabajo chileno. Los procesos se basan estrictamente en mérito técnico y competencias profesionales.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-black/10">
                  <div className="text-xs font-mono uppercase text-[#1F1F1F] font-semibold mb-1.5">
                    Plazo de Conservación
                  </div>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Los antecedentes curriculares se conservan por un plazo máximo de doce (12) meses para procesos afines, tras lo cual son eliminados de forma segura de nuestros registros.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-black/10">
                  <div className="text-xs font-mono uppercase text-blue-600 font-semibold mb-1.5">
                    Eliminación Inmediata
                  </div>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Cualquier postulante puede solicitar la eliminación inmediata de su CV y datos de contacto escribiendo a <a href="mailto:contacto@solderio.cl" className="font-mono text-[#FF8300] underline">contacto@solderio.cl</a> con el asunto "Eliminación de Antecedentes".
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Seguridad Técnica y Prevención de Inyecciones */}
            <section>
              <h2 className="text-xl md:text-2xl font-medium text-[#1F1F1F] mb-3 flex items-center gap-2">
                <span>4. Seguridad de la Información y Protección Anti-Ataques</span>
              </h2>
              <p>
                Adoptamos rigurosas medidas técnicas y organizativas para proteger la confidencialidad, integridad y disponibilidad de la información de nuestros usuarios:
              </p>
              <ul className="list-disc pl-5 space-y-2 my-3 text-sm">
                <li><strong>Cifrado SSL/TLS 256 bits:</strong> Toda la información enviada mediante formularios viaja cifrada mediante protocolos criptográficos modernos.</li>
                <li><strong>Prevención de Inyecciones (Anti-XSS / Anti-SQLi):</strong> Todas las entradas de datos en el servidor son sanitizadas y validadas mediante esquemas estrictos (Zod) antes de su procesamiento, eliminando cualquier etiqueta de código malicioso o script ejecutable.</li>
                <li><strong>Mecanismo de Detección de Bots (Honeypot):</strong> Nuestros formularios incorporan campos señuelo invisibles para usuarios legítimos que desvían y neutralizan robots automatizados de spam.</li>
                <li><strong>Limitación de Tasa (Rate Limiting):</strong> Restringimos el volumen de solicitudes por dirección IP para mitigar ataques de denegación de servicio (DoS) o intentos de saturación.</li>
                <li><strong>Control de Archivos Adjuntos:</strong> Se aplican filtros estrictos de tipo MIME y tamaño máximo en PDFs o documentos de boletas y CVs para impedir la carga de software malicioso.</li>
              </ul>
            </section>

            {/* 5. Derechos ARCO */}
            <section>
              <h2 className="text-xl md:text-2xl font-medium text-[#1F1F1F] mb-3 flex items-center gap-2">
                <span>5. Derechos del Titular de Datos (Derechos ARCO)</span>
              </h2>
              <p>
                De acuerdo con la Ley N° 19.628 de la República de Chile, todo usuario tiene derecho a:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 not-prose">
                <div className="p-3.5 rounded-xl bg-white border border-black/10">
                  <div className="font-semibold text-xs text-[#1F1F1F] mb-1">Acceso</div>
                  <div className="text-xs text-[#6B7280]">Conocer con precisión qué datos personales tuyos obran en nuestros registros.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-black/10">
                  <div className="font-semibold text-xs text-[#1F1F1F] mb-1">Rectificación</div>
                  <div className="text-xs text-[#6B7280]">Modificar o actualizar datos erróneos, inexactos o desactualizados.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-black/10">
                  <div className="font-semibold text-xs text-[#1F1F1F] mb-1">Cancelación (Eliminación)</div>
                  <div className="text-xs text-[#6B7280]">Solicitar la supresión definitiva de tus datos cuando haya cesado la necesidad del servicio.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-black/10">
                  <div className="font-semibold text-xs text-[#1F1F1F] mb-1">Oposición</div>
                  <div className="text-xs text-[#6B7280]">Oponerte en cualquier momento a que tus datos sean utilizados para fines específicos de contacto.</div>
                </div>
              </div>
              <p className="text-sm">
                Para ejercer cualquiera de estos derechos, envía un correo a <a href="mailto:contacto@solderio.cl" className="text-[#FF8300] font-mono font-medium">contacto@solderio.cl</a> indicando tu nombre completo y la solicitud correspondiente. Nuestro equipo responderá en un plazo máximo de cinco (5) días hábiles.
              </p>
            </section>

            {/* 6. Enlaces y Terceros */}
            <section>
              <h2 className="text-xl md:text-2xl font-medium text-[#1F1F1F] mb-3 flex items-center gap-2">
                <span>6. Comunicaciones y Notificaciones Operativas</span>
              </h2>
              <p className="text-sm">
                Al enviar un formulario en nuestro sitio, consientes que el equipo técnico y de atención al cliente de SoldeRío se comunique contigo a través de WhatsApp, llamada telefónica o correo electrónico estrictamente para dar respuesta a tu solicitud o informarte del estado de tu proyecto solar o postulación. En cualquier momento puedes solicitar el cese de estas comunicaciones respondiendo a nuestros mensajes.
              </p>
            </section>

            {/* 7. Modificaciones */}
            <section>
              <h2 className="text-xl md:text-2xl font-medium text-[#1F1F1F] mb-3 flex items-center gap-2">
                <span>7. Actualizaciones de esta Política</span>
              </h2>
              <p className="text-sm">
                SoldeRío SpA se reserva el derecho de actualizar la presente política para adaptarla a futuras modificaciones legislativas en Chile (incluyendo la entrada en vigencia del nuevo marco de Protección de Datos Personales). Cualquier modificación sustancial será informada oportunamente en esta misma página con la fecha de última actualización.
              </p>
            </section>

          </div>

          {/* Contact Box Bottom */}
          <div className="mt-12 p-6 rounded-2xl bg-white border border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-[#1F1F1F]">¿Tienes dudas sobre cómo protegemos tu información?</div>
              <div className="text-xs text-[#6B7280] font-light">Escríbenos directamente y nuestro equipo legal y técnico te responderá con gusto.</div>
            </div>
            <a
              href="mailto:contacto@solderio.cl"
              className="px-5 py-2.5 rounded-full bg-[#1F1F1F] hover:bg-[#FF8300] text-white text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 flex-shrink-0"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>contacto@solderio.cl</span>
            </a>
          </div>

        </div>
      </article>

      <Footer />
    </main>
  );
}
