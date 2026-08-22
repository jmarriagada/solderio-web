import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, FileText } from "lucide-react";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Políticas de Privacidad & Tratamiento de Datos | SoldeRío",
  description:
    "Conoce cómo SoldeRío protege y resguarda la información de tus boletas eléctricas, datos de consumo y antecedentes personales conforme a la Ley 19.628.",
};

export default function PoliticasPrivacidadPage() {
  return (
    <main className="w-full min-h-screen relative bg-[#F1F1F1]">
      <FloatingNav />

      <article className="pt-28 md:pt-36 pb-20">
        <div className="w-full px-4 sm:px-6 md:px-8 box-border max-w-4xl mx-auto">
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#6B7280] hover:text-[#FF8300] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </Link>

          <div className="mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
              Marco Legal & Ley N° 19.628
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F1F1F] tracking-tight mb-6 leading-tight">
            Políticas de Privacidad y Protección de Datos
          </h1>

          <p className="text-xs text-[#6B7280] font-mono pb-6 border-b border-black/10 mb-8">
            Última actualización: Febrero 2026 • SoldeRío SpA
          </p>

          <div className="prose prose-lg max-w-none text-[#6B7280] font-light leading-relaxed space-y-6">
            <h2 className="text-xl md:text-2xl font-medium text-[#1F1F1F] mt-8 mb-3">
              1. Compromiso de Privacidad
            </h2>
            <p>
              En <strong>SoldeRío SpA</strong> nos tomamos con máxima seriedad la protección y confidencialidad de los datos personales y técnicos de nuestros usuarios, clientes residenciales y comerciales en la Macrozona Sur de Chile, en estricto cumplimiento de la Ley N° 19.628 sobre Protección de la Vida Privada.
            </p>

            <h2 className="text-xl md:text-2xl font-medium text-[#1F1F1F] mt-8 mb-3">
              2. Información que Recopilamos
            </h2>
            <p>
              Para elaborar propuestas de ingeniería solar y cotizaciones personalizadas, recopilamos la siguiente información cuando interactúas voluntariamente con nuestro sitio web:
            </p>
            <ul className="space-y-2 list-disc pl-5 my-4">
              <li><strong>Datos de Contacto:</strong> Nombre, número de teléfono (WhatsApp), correo electrónico y comuna de residencia.</li>
              <li><strong>Información de Consumo Eléctrico:</strong> Gasto mensual estimado en pesos ($CLP), consumo histórico en kilowatt-hora (kWh) y nombre de la distribuidora concesionaria (Saesa, Crell, CGE, Edelaysen, etc.).</li>
              <li><strong>Documentos Adjuntos:</strong> Fotografías o archivos PDF de boletas eléctricas, planos o techumbres proporcionados voluntariamente en el cotizador interactivo.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-medium text-[#1F1F1F] mt-8 mb-3">
              3. Uso Exclusivo de la Información
            </h2>
            <p>
              Tus datos son utilizados exclusivamente para:
            </p>
            <ul className="space-y-2 list-disc pl-5 my-4">
              <li>Elaborar el dimensionamiento técnico de potencia (kWp) y almacenamiento (kWh) de tu planta solar.</li>
              <li>Calcular el ahorro proyectado bajo la Ley Net Billing 21.118.</li>
              <li>Coordinar visitas técnicas a terreno y tramitaciones oficiales ante la SEC (TE-1, TE-4 y TE-6).</li>
              <li>Contactarte por WhatsApp o correo electrónico para presentarte la pre-evaluación solar.</li>
            </ul>
            <p>
              <strong>Garantía de No Divulgación:</strong> SoldeRío jamás venderá, arrendará ni transferirá tus datos a terceros ni a empresas de publicidad externa.
            </p>

            <h2 className="text-xl md:text-2xl font-medium text-[#1F1F1F] mt-8 mb-3">
              4. Seguridad del Almacenamiento
            </h2>
            <p>
              Todos los archivos y registros ingresados en nuestro cotizador se transmiten mediante cifrado SSL/TLS de 256 bits y se almacenan en repositorios protegidos con autenticación y reglas de seguridad de acceso restringido únicamente al equipo de ingenieros de SoldeRío.
            </p>

            <h2 className="text-xl md:text-2xl font-medium text-[#1F1F1F] mt-8 mb-3">
              5. Derechos de Acceso, Rectificación y Cancelación
            </h2>
            <p>
              Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, cancelación u oposición respecto a tus datos personales enviando una solicitud formal a <strong>contacto@solderio.cl</strong>.
            </p>
          </div>

        </div>
      </article>

      <Footer />
    </main>
  );
}
