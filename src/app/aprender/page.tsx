import { FloatingNav } from "@/components/FloatingNav";
import { AprenderHeroFrame } from "@/components/aprender/AprenderHeroFrame";
import { AprenderComoLeerBoleta } from "@/components/aprender/AprenderComoLeerBoleta";
import { AprenderGlosarioTecnico } from "@/components/aprender/AprenderGlosarioTecnico";
import { AprenderCTA } from "@/components/aprender/AprenderCTA";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Aprender Energía Solar & Guía de Boletas Eléctricas | SoldeRío",
  description:
    "Aprende a interpretar tu boleta de Saesa, Crell o CGE, domina los conceptos de potencia (kW) vs energía (kWh) y conoce las claves para cotizar energía solar en el sur de Chile.",
};

export default function AprenderPage() {
  return (
    <main className="w-full min-h-screen relative bg-[#F1F1F1]">
      {/* 0. Floating Glassmorphism Navbar */}
      <FloatingNav />

      {/* 1. Hero Frame (Centro de Conocimiento) */}
      <AprenderHeroFrame />

      {/* 2. Cómo Leer tu Boleta Eléctrica (Saesa / Crell / CGE) */}
      <AprenderComoLeerBoleta />

      {/* 3. Glosario Técnico Esencial */}
      <AprenderGlosarioTecnico />

      {/* 4. CTA Final */}
      <AprenderCTA />

      {/* 5. Footer Oficial */}
      <Footer />
    </main>
  );
}
