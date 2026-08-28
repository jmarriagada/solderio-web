import { FloatingNav } from "@/components/FloatingNav";
import { AcercaDeHeroFrame } from "@/components/acerca-de/AcercaDeHeroFrame";
import { AcercaDeManifesto } from "@/components/acerca-de/AcercaDeManifesto";
import { AcercaDeWhyUs } from "@/components/acerca-de/AcercaDeWhyUs";
import { AcercaDeFounders } from "@/components/acerca-de/AcercaDeFounders";
import { AcercaDeImpactMetrics } from "@/components/acerca-de/AcercaDeImpactMetrics";
import { AcercaDeRegionalCommitment } from "@/components/acerca-de/AcercaDeRegionalCommitment";
import { AcercaDeFAQ } from "@/components/acerca-de/AcercaDeFAQ";
import { AcercaDeCTA } from "@/components/acerca-de/AcercaDeCTA";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Acerca de SoldeRío | Por Qué Elegirnos & Nuestra Historia",
  description:
    "Conoce a SoldeRío: más de 30 años de experiencia en ingeniería eléctrica SEC Clase A y tecnología de software solar para liderar la transición energética en el sur de Chile.",
};

export default function AcercaDePage() {
  return (
    <main className="w-full min-h-screen relative bg-[#F7F8FA]">
      {/* 0. Floating Glassmorphism Navbar */}
      <FloatingNav />

      {/* 1. Hero Frame (Por Qué SoldeRío) */}
      <AcercaDeHeroFrame />

      {/* 2. Manifiesto & Propósito (Misión, Visión, 4 Pilares) */}
      <AcercaDeManifesto />

      {/* 3. SoldeRío vs Instaladores Tradicionales (Matriz Comparativa) */}
      <AcercaDeWhyUs />

      {/* 4. Socios Fundadores & Liderazgo */}
      <AcercaDeFounders />

      {/* 5. Métricas de Impacto & Respaldo */}
      <AcercaDeImpactMetrics />

      {/* 6. Compromiso Regional & Clima del Sur */}
      <AcercaDeRegionalCommitment />

      {/* 7. Preguntas Frecuentes Institucionales (FAQ) */}
      <AcercaDeFAQ />

      {/* 8. Call to Action Final */}
      <AcercaDeCTA />

      {/* 9. Footer Oficial */}
      <Footer />
    </main>
  );
}
