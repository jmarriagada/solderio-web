import { FloatingNav } from "@/components/FloatingNav";
import { NuestraGarantiaHeroFrame } from "@/components/garantia/NuestraGarantiaHeroFrame";
import { NuestraGarantiaPillars } from "@/components/garantia/NuestraGarantiaPillars";
import { NuestraGarantiaPlans } from "@/components/garantia/NuestraGarantiaPlans";
import { NuestraGarantiaMitigation } from "@/components/garantia/NuestraGarantiaMitigation";
import { NuestraGarantiaMonitoring } from "@/components/garantia/NuestraGarantiaMonitoring";
import { NuestraGarantiaFAQ } from "@/components/garantia/NuestraGarantiaFAQ";
import { NuestraGarantiaCTA } from "@/components/garantia/NuestraGarantiaCTA";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Nuestra Garantía y Planes de Mantenimiento (O&M) | SoldeRío",
  description:
    "Garantía Total SoldeRío: 25 años de rendimiento fotovoltaico Tier 1, 10 años en estanqueidad de techumbres, primer año de O&M gratis y monitoreo 24/7 en el sur de Chile.",
};

export default function GarantiaPage() {
  return (
    <main className="w-full min-h-screen relative bg-[#F1F1F1]">
      {/* 0. Floating Glassmorphism Navbar */}
      <FloatingNav />

      {/* 1. Hero Frame (Nuestra Garantía) */}
      <NuestraGarantiaHeroFrame />

      {/* 2. Los 4 Niveles de Protección SoldeRío */}
      <NuestraGarantiaPillars />

      {/* 3. Portafolio de Planes O&M (Essential Care, Total Guard, Industrial) */}
      <NuestraGarantiaPlans />

      {/* 4. Mitigación ante Quiebras de Instaladores Tradicionales */}
      <NuestraGarantiaMitigation />

      {/* 5. Protocolo de Monitoreo Proactivo 24/7 en 4 Pasos */}
      <NuestraGarantiaMonitoring />

      {/* 6. Preguntas Frecuentes (FAQ) */}
      <NuestraGarantiaFAQ />

      {/* 7. Call to Action Final */}
      <NuestraGarantiaCTA />

      {/* 8. Footer Oficial */}
      <Footer />
    </main>
  );
}
