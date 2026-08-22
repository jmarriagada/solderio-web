import Link from "next/link";
import { ArrowLeft, FileCheck, ShieldCheck } from "lucide-react";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Términos y Condiciones del Servicio | SoldeRío",
  description:
    "Términos generales del servicio, pre-evaluaciones solares, visitas técnicas y garantías de ingeniería fotovoltaica de SoldeRío SpA.",
};

export default function TerminosPage() {
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
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] bg-[#FF8300]/10 px-3.5 py-1.5 rounded-full border border-[#FF8300]/20">
              Términos del Servicio
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F1F1F] tracking-tight mb-6 leading-tight">
            Términos y Condiciones de Uso
          </h1>

          <p className="text-xs text-[#6B7280] font-mono pb-6 border-b border-black/10 mb-8">
            Última actualización: Febrero 2026 • SoldeRío SpA
          </p>

          <div className="prose prose-lg max-w-none text-[#6B7280] font-light leading-relaxed space-y-6">
            <h2 className="text-xl md:text-2xl font-medium text-[#1F1F1F] mt-8 mb-3">
              1. Aceptación de los Términos
            </h2>
            <p>
              El acceso y uso de este sitio web y sus herramientas interactivas (simulador solar, cotizador y formularios de contacto) se rige por los presentes Términos y Condiciones. Al navegar o enviar información en nuestra plataforma, aceptas estos términos en su totalidad.
            </p>

            <h2 className="text-xl md:text-2xl font-medium text-[#1F1F1F] mt-8 mb-3">
              2. Naturaleza de las Pre-Evaluaciones y Simulaciones
            </h2>
            <p>
              Las cifras de potencia recomendada (kWp), número estimado de paneles solares, ahorro económico (\$CLP) y retorno de inversión proyectado generados en nuestro cotizador web constituyen estimaciones referenciales de carácter técnico preliminar.
            </p>
            <p>
              El presupuesto final vinculante, diseño definitivo y cálculo de pérdidas por sombras se formaliza tras la realización de la <strong>Visita Técnica a Terreno</strong> por un Ingeniero Eléctrico SEC Clase A de SoldeRío.
            </p>

            <h2 className="text-xl md:text-2xl font-medium text-[#1F1F1F] mt-8 mb-3">
              3. Estándar de Ingeniería y Cumplimiento SEC
            </h2>
            <p>
              Todos los proyectos fotovoltaicos ejecutados por SoldeRío SpA se diseñan y construyen en estricto apego a los Pliegos Técnicos Normativos RIC (RIC N°01 al N°19) de la Superintendencia de Electricidad y Combustibles (SEC), la Ley de Generación Distribuida N° 21.118 y las exigencias de la Norma Técnica de Seguridad y Calidad de Servicio (NTSyCS).
            </p>

            <h2 className="text-xl md:text-2xl font-medium text-[#1F1F1F] mt-8 mb-3">
              4. Garantías de Equipamiento y Montaje
            </h2>
            <p>
              SoldeRío respalda sus instalaciones con:
            </p>
            <ul className="space-y-2 list-disc pl-5 my-4">
              <li><strong>25 Años de Garantía de Generación:</strong> En paneles solares Tier 1 monocristalinos N-Type (mínimo 85% de potencia residual al año 25).</li>
              <li><strong>10 Años de Garantía de Fábrica:</strong> En inversores híbridos y microinversores.</li>
              <li><strong>10 a 15 Años (+6.000 ciclos):</strong> En bancos de baterías LiFePO4.</li>
              <li><strong>5 Años de Garantía de Instalación y Estanqueidad:</strong> En fijaciones y anclajes sobre cubiertas contra filtraciones de agua de lluvia.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-medium text-[#1F1F1F] mt-8 mb-3">
              5. Propiedad Intelectual
            </h2>
            <p>
              Todos los contenidos, marcas comerciales, logotipos, diagramas Mermaid, simuladores interactivos, interfaces UI y textos de este sitio web son propiedad exclusiva de SoldeRío SpA y están protegidos por las leyes de propiedad intelectual de Chile.
            </p>
          </div>

        </div>
      </article>

      <Footer />
    </main>
  );
}
