import { FloatingNav } from "@/components/FloatingNav";
import { IncentivosHeroFrame } from "@/components/incentivos/IncentivosHeroFrame";
import { IncentivosNetBilling } from "@/components/incentivos/IncentivosNetBilling";
import { IncentivosTributarios } from "@/components/incentivos/IncentivosTributarios";
import { IncentivosFondosConcursables } from "@/components/incentivos/IncentivosFondosConcursables";
import { IncentivosCTA } from "@/components/incentivos/IncentivosCTA";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Incentivos Solares, Ley Net Billing 21.118 & Beneficios SII | SoldeRío",
  description:
    "Descubre cómo la Ley 21.118 de Generación Distribuida, la depreciación instantánea y los fondos del Estado hacen altamente rentable la energía solar para hogares y empresas en el sur de Chile.",
};

export default function IncentivosPage() {
  return (
    <main className="w-full min-h-screen relative bg-[#F7F8FA]">
      {/* 0. Floating Glassmorphism Navbar */}
      <FloatingNav />

      {/* 1. Hero Frame (Marco Regulatorio & Beneficios) */}
      <IncentivosHeroFrame />

      {/* 2. Ley Net Billing 21.118 (Mecanismo, SEC, Distribuidoras) */}
      <IncentivosNetBilling />

      {/* 3. Beneficios Tributarios Empresas (Depreciación Instantánea & IVA) */}
      <IncentivosTributarios />

      {/* 4. Fondos Concursables & Subsidios (Ponle Energía, CNR, Corfo) */}
      <IncentivosFondosConcursables />

      {/* 5. CTA Final */}
      <IncentivosCTA />

      {/* 6. Footer Oficial */}
      <Footer />
    </main>
  );
}
