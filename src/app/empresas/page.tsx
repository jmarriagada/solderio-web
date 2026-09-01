import { FloatingNav } from "@/components/FloatingNav";
import { EmpresasHeroFrame } from "@/components/empresas/EmpresasHeroFrame";
import { EmpresasDiagram } from "@/components/empresas/EmpresasDiagram";
import { EmpresasValueProps } from "@/components/empresas/EmpresasValueProps";
import { EmpresasSolutions } from "@/components/empresas/EmpresasSolutions";
import { EmpresasHardware } from "@/components/empresas/EmpresasHardware";
import { EmpresasInstallations } from "@/components/empresas/EmpresasInstallations";
import { EmpresasCTA } from "@/components/empresas/EmpresasCTA";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Plantas Solares Comercial e Industrial (C&I) | SoldeRío",
  description:
    "Energiza la operación de tu empresa con plantas fotovoltaicas industriales, gestión energética avanzada y almacenamiento ESS en el sur de Chile.",
};

export default function EmpresasPage() {
  return (
    <main className="w-full min-h-screen relative bg-[#F7F8FA]">
      {/* 0. Floating Glassmorphism Navbar */}
      <FloatingNav />

      {/* 1. Hero Frame (Soberanía energética Comercial e Industrial) */}
      <EmpresasHeroFrame />

      {/* 2. Diagrama (Solar, ESS y la red sincronizadas) */}
      <EmpresasDiagram />

      {/* 3. Solucion integral en la operación (Acordeón de Etapas) */}
      <EmpresasSolutions />

      {/* 4. Ventajas Estratégicas & Indicadores Financieros para Decision Makers */}
      <EmpresasValueProps />

      {/* 4. Gestión inteligente de energía (Showcase Hardware C&I) */}
      <EmpresasHardware />

      {/* 5. Tipo de Instalaciones (Techo / Suelo Slider) */}
      <EmpresasInstallations />

      {/* 6. Maximiza rentabilidad (CTA Final) */}
      <EmpresasCTA />

      {/* 7. Footer Oficial */}
      <Footer />
    </main>
  );
}
