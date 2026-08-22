import { FloatingNav } from "@/components/FloatingNav";
import { HeaderHeroFrame } from "@/components/HeaderHeroFrame";
import { Intro } from "@/components/Intro";
import { TriadSection } from "@/components/TriadSection";
import { SegmentedSolutions } from "@/components/SegmentedSolutions";
import { Tier1Showcase } from "@/components/Tier1Showcase";
import { Attributes } from "@/components/Attributes";
import { SolarTopologyVisualizer } from "@/components/SolarTopologyVisualizer";
import { MRIngenieriaPartner } from "@/components/MRIngenieriaPartner";
import { HomeCTA } from "@/components/HomeCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="w-full min-h-screen relative">
      {/* 0. Floating Glassmorphism Navbar on Scroll */}
      <FloatingNav />

      {/* 1. Header & Hero Frame */}
      <HeaderHeroFrame />

      {/* 2. Soluciones Segmentadas: A la medida de tu consumo (Residencial vs Comercial e Industrial) */}
      <SegmentedSolutions />

      {/* 3. Imagen Panorámica & Paisaje del Sur */}
      <Intro />

      {/* 4. Tríada de Excelencia: Más que paneles en un techo: Un ecosistema completo */}
      <TriadSection />

      {/* 5. Simulador Interactivo de Topologías Solares (Flujo de energía y tipo de planta) */}
      <SolarTopologyVisualizer />

      {/* 6. Atributos de Ingeniería y Durabilidad en el Sur (Rendimiento Climático / Diseñadas para el sur) */}
      <Attributes />

      {/* 7. Showcase de Equipamiento Tier 1 (Hardware de Grado Industrial) */}
      <Tier1Showcase />

      {/* 8. Alianza Estratégica: MR Ingeniería Eléctrica */}
      <MRIngenieriaPartner />

      {/* 9. Call to Action: Comienza tu transición a Solar */}
      <HomeCTA />

      {/* 10. Footer Oficial */}
      <Footer />
    </main>
  );
}
