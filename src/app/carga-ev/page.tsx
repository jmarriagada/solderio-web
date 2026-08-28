import { FloatingNav } from "@/components/FloatingNav";
import { CargaEvHeroFrame } from "@/components/carga-ev/CargaEvHeroFrame";
import { CargaEvIntro } from "@/components/carga-ev/CargaEvIntro";
import { CargaEvHighlights } from "@/components/carga-ev/CargaEvHighlights";
import { CargaEvModesVisualizer } from "@/components/carga-ev/CargaEvModesVisualizer";
import { CargaEvEquipmentShowcase } from "@/components/carga-ev/CargaEvEquipmentShowcase";
import { CargaEvEcosystem } from "@/components/carga-ev/CargaEvEcosystem";
import { CargaEvSecInstallation } from "@/components/carga-ev/CargaEvSecInstallation";
import { CargaEvCTA } from "@/components/carga-ev/CargaEvCTA";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Cargadores Inteligentes de Vehículos Eléctricos (EV) | SoldeRío",
  description:
    "Carga tu vehículo eléctrico con energía solar, balanceo dinámico de potencia y certificación SEC TE-6 bajo norma RIC N°15 en el sur de Chile.",
};

export default function CargaEvPage() {
  return (
    <main className="w-full min-h-screen relative bg-[#F7F8FA]">
      {/* 0. Floating Glassmorphism Navbar */}
      <FloatingNav />

      {/* 1. Hero Frame (Cargadores Inteligentes EV) */}
      <CargaEvHeroFrame />

      {/* 2. Intro Statement con Imagen */}
      <CargaEvIntro />

      {/* 3. Pilares Tecnológicos & Highlights (Huawei SCharger) */}
      <CargaEvHighlights />

      {/* 4. Simulador Interactivo de Modos de Recarga & Ahorro */}
      <CargaEvModesVisualizer />

      {/* 5. Catálogo & Ficha Técnica Comparativa (7.4 kW vs 22 kW) */}
      <CargaEvEquipmentShowcase />

      {/* 6. Ecosistema Integrado (Paneles + Inversor + Batería + EV Charger) */}
      <CargaEvEcosystem />

      {/* 7. Respaldo de Ingeniería & Certificación SEC TE-6 / RIC N°15 */}
      <CargaEvSecInstallation />

      {/* 8. CTA Final */}
      <CargaEvCTA />

      {/* 9. Footer Oficial */}
      <Footer />
    </main>
  );
}
