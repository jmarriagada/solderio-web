import { Suspense } from "react";
import { FloatingNav } from "@/components/FloatingNav";
import { HeroHeaderNav } from "@/components/HeroHeaderNav";
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
      {/* 0. Floating Glassmorphism Navbar on Scroll */}
      <FloatingNav />

      {/* Top Header Navigation with transparent background and no border */}
      <div className="w-full relative z-30 bg-transparent">
        <HeroHeaderNav locationText="Sur de Chile" />
      </div>

      {/* Ambient Radial Lights */}
      <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#FF8300]/10 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute top-96 right-10 w-[500px] h-[400px] bg-blue-500/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Main Interactive Wizard */}
      <div className="px-4 sm:px-6 md:px-8 pb-20 relative z-10">
        <Suspense
          fallback={
            <div className="w-full max-w-4xl mx-auto py-16 text-center text-white/50 font-light">
              Cargando cotizador solar inteligente...
            </div>
          }
        >
          <SmartQuoteWizard />
        </Suspense>
      </div>

      {/* Official Footer */}
      <Footer />
    </main>
  );
}
