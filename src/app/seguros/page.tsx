import { FloatingNav } from "@/components/FloatingNav";
import { SegurosHeroFrame } from "@/components/seguros/SegurosHeroFrame";
import { SegurosCoverages } from "@/components/seguros/SegurosCoverages";
import { SegurosLucroCesante } from "@/components/seguros/SegurosLucroCesante";
import { SegurosCTA } from "@/components/seguros/SegurosCTA";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Seguros & Pólizas de Protección Fotovoltaica | SoldeRío",
  description:
    "Protege tu planta solar residencial o comercial contra temporales, vientos extremos, granizo, sismos y lucro cesante con ingeniería certificada SEC Clase A en el sur de Chile.",
};

export default function SegurosPage() {
  return (
    <main className="w-full min-h-screen relative bg-[#F1F1F1]">
      {/* 0. Floating Glassmorphism Navbar */}
      <FloatingNav />

      {/* 1. Hero Frame (Seguros & Pólizas) */}
      <SegurosHeroFrame />

      {/* 2. Coberturas Principales (Viento, Clima, Sismos, Robo) */}
      <SegurosCoverages />

      {/* 3. Lucro Cesante & Continuidad de Negocio (Empresas) */}
      <SegurosLucroCesante />

      {/* 4. CTA Final */}
      <SegurosCTA />

      {/* 5. Footer Oficial */}
      <Footer />
    </main>
  );
}
