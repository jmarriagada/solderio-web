import { FloatingNav } from "@/components/FloatingNav";
import { PorqueSolarHeroFrame } from "@/components/porque-solar/PorqueSolarHeroFrame";
import { PorqueSolarPillars } from "@/components/porque-solar/PorqueSolarPillars";
import { PorqueSolarNetBilling } from "@/components/porque-solar/PorqueSolarNetBilling";
import { PorqueSolarCalculator } from "@/components/porque-solar/PorqueSolarCalculator";
import { PorqueSolarMythsVsFacts } from "@/components/porque-solar/PorqueSolarMythsVsFacts";
import { PorqueSolarTechEcosystem } from "@/components/porque-solar/PorqueSolarTechEcosystem";
import { PorqueSolarFAQ } from "@/components/porque-solar/PorqueSolarFAQ";
import { PorqueSolarCTA } from "@/components/porque-solar/PorqueSolarCTA";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Por Qué Elegir Energía Solar | Ahorro, Net Billing y Respaldo | SoldeRío",
  description:
    "Descubre los beneficios de la energía solar en Chile: ahorra hasta un 90% en tu boleta de luz, protégete contra las alzas tarifarias y accede a respaldo continuo con baterías bajo la Ley Net Billing 21.118.",
};

export default function PorqueSolarPage() {
  return (
    <main className="w-full min-h-screen relative bg-[#F1F1F1]">
      {/* 0. Floating Glassmorphism Navbar */}
      <FloatingNav />

      {/* 1. Hero Frame (Por Qué Elegir Energía Solar) */}
      <PorqueSolarHeroFrame />

      {/* 2. Tres Pilares Fundamentales */}
      <PorqueSolarPillars />

      {/* 3. Cómo Funciona la Ley Net Billing 21.118 */}
      <PorqueSolarNetBilling />

      {/* 4. Simulador Interactivo de Ahorro y ROI */}
      <PorqueSolarCalculator />

      {/* 5. Mitos vs Realidades de la Energía Solar en el Sur */}
      <PorqueSolarMythsVsFacts />

      {/* 6. Ecosistema Tecnológico de una Planta Solar */}
      <PorqueSolarTechEcosystem />

      {/* 7. Preguntas Frecuentes (FAQ) */}
      <PorqueSolarFAQ />

      {/* 8. Call to Action Final */}
      <PorqueSolarCTA />

      {/* 9. Footer Oficial */}
      <Footer />
    </main>
  );
}
