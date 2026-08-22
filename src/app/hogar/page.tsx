import { FloatingNav } from "@/components/FloatingNav";
import { HogarHeroFrame } from "@/components/hogar/HogarHeroFrame";
import { HogarIntro } from "@/components/hogar/HogarIntro";
import { HogarBenefits } from "@/components/hogar/HogarBenefits";
import { SolarTopologyVisualizer } from "@/components/SolarTopologyVisualizer";
import { HogarEquipmentShowcase } from "@/components/hogar/HogarEquipmentShowcase";
import { HogarResilienceImage } from "@/components/hogar/HogarResilienceImage";
import { HogarAttributes } from "@/components/hogar/HogarAttributes";
import { HogarAppMonitoring } from "@/components/hogar/HogarAppMonitoring";
import { HogarCTA } from "@/components/hogar/HogarCTA";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Plantas Solares Residenciales & Parcelas | SoldeRío",
  description:
    "Genera energía limpia y ahorra hasta un 90% en tu cuenta con las plantas fotovoltaicas para hogares y parcelas de SoldeRío en el sur de Chile.",
};

export default function HogarPage() {
  return (
    <main className="w-full min-h-screen relative">
      {/* 0. Floating Glassmorphism Navbar */}
      <FloatingNav />

      {/* 1. Hero Frame (Plantas Solares) */}
      <HogarHeroFrame />

      {/* 2. Intro Statement */}
      <HogarIntro />

      {/* 3. Baja tu costo eléctrico (Ahorro, Sustentabilidad, Garantía) */}
      <HogarBenefits />

      {/* 4. Simulador Interactivo de Topologías Solares */}
      <SolarTopologyVisualizer />

      {/* 5. Diseñadas para el sur (Atributos de Generación) */}
      <HogarAttributes />

      {/* 6. Resiliencia & Noche Iluminada */}
      <HogarResilienceImage />

      {/* 7. Respaldo confiable en cortes (Showcase de Equipos) */}
      <HogarEquipmentShowcase />

      {/* 8. Monitorea y controla por app (Dark Section) */}
      <HogarAppMonitoring />

      {/* 9. Comienza tu transición a Solar (CTA) */}
      <HogarCTA />

      {/* 10. Footer Oficial */}
      <Footer />
    </main>
  );
}
