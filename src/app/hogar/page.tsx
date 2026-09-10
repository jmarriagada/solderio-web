import { FloatingNav } from "@/components/FloatingNav";
import { HogarHeroFrame } from "@/components/hogar/HogarHeroFrame";
import { HogarIntro } from "@/components/hogar/HogarIntro";
import { HogarLifestyleBenefits } from "@/components/hogar/HogarLifestyleBenefits";
import { HogarPropertyTypes } from "@/components/hogar/HogarPropertyTypes";
import { HogarBenefits } from "@/components/hogar/HogarBenefits";
import { SolarTopologyVisualizer } from "@/components/SolarTopologyVisualizer";
import { HogarAttributes } from "@/components/hogar/HogarAttributes";
import { HogarResilienceImage } from "@/components/hogar/HogarResilienceImage";
import { HogarEquipmentShowcase } from "@/components/hogar/HogarEquipmentShowcase";
import { HogarAppMonitoring } from "@/components/hogar/HogarAppMonitoring";
import { HogarFAQ } from "@/components/hogar/HogarFAQ";
import { HogarCTA } from "@/components/hogar/HogarCTA";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Plantas Solares Residenciales & Parcelas | SoldeRío",
  description:
    "Genera energía limpia y ahorra hasta un 90% en tu cuenta con las plantas fotovoltaicas para hogares y parcelas de SoldeRío en el sur de Chile.",
};

export default function HogarPage() {
  return (
    <main className="w-full min-h-screen relative bg-[#F7F8FA]">
      {/* 0. Floating Glassmorphism Navbar */}
      <FloatingNav />

      {/* 1. Hero Frame (Plantas Solares) */}
      <HogarHeroFrame />

      {/* 2. Intro Statement */}
      <HogarIntro />

      {/* 3. Genera tu propia energía limpia y baja tu costo eléctrico (En resumen) */}
      <HogarBenefits />

      {/* 4. Soluciones por Tipo de Vivienda en el Sur (Casas Urbanas, Parcelas, Off-Grid, Sustentables) */}
      <HogarPropertyTypes />

      {/* 5. Diseñadas para el sur (Atributos de Generación) */}
      <HogarAttributes />

      {/* 6. Resiliencia & Noche Iluminada */}
      <HogarResilienceImage />

      {/* 7. Respaldo confiable en cortes (Showcase de Equipos) */}
      <HogarEquipmentShowcase />

      {/* 8. Confort y Estilo de Vida (Calefacción, Agua de Pozo, Blindaje Tarifario) */}
      <HogarLifestyleBenefits />

      {/* 9. Simulador Interactivo de Topologías Solares */}
      <SolarTopologyVisualizer />

      {/* 10. Monitorea y controla por app (Dark Section) */}
      <HogarAppMonitoring />

      {/* 11. Preguntas Frecuentes Residenciales del Sur (Acordeón) */}
      <HogarFAQ />

      {/* 12. Comienza tu transición a Solar (CTA) */}
      <HogarCTA />

      {/* 13. Footer Oficial */}
      <Footer />
    </main>
  );
}
