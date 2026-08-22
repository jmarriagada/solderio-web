import { FloatingNav } from "@/components/FloatingNav";
import { SmartQuoteWizard } from "@/components/cotizacion/SmartQuoteWizard";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Cotizador Solar Inteligente & Pre-Informe Técnico | SoldeRío",
  description:
    "Calcula la potencia solar recomendada (kWp), almacenamiento en baterías LiFePO4 y ahorro anual para tu hogar, parcela o empresa en el sur de Chile.",
};

export default function CotizacionPage() {
  return (
    <main className="w-full min-h-screen relative bg-[#141414] text-white">
      {/* 0. Floating Glassmorphism Navbar */}
      <FloatingNav />

      {/* Ambient Radial Lights */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#FF8300]/10 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute top-96 right-10 w-[500px] h-[400px] bg-blue-500/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Top Header Spacing for Nav */}
      <div className="pt-28 md:pt-36 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto text-center mb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-[#FF8300] bg-[#FF8300]/10 px-4 py-1.5 rounded-full border border-[#FF8300]/20 inline-block mb-4">
          Dimensionamiento Fotovoltaico en Vivo
        </span>
        <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-3">
          Cotizador Solar Inteligente
        </h1>
        <p className="text-white/65 text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed">
          Simula tu proyecto con datos de radiación real de la Macrozona Sur y obtén tu pre-evaluación técnica instantánea.
        </p>
      </div>

      {/* Main Interactive Wizard */}
      <div className="px-4 sm:px-6 md:px-8 pb-20 relative z-10">
        <SmartQuoteWizard />
      </div>

      {/* Official Footer */}
      <Footer />
    </main>
  );
}
