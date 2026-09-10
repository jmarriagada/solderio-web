import { FloatingNav } from "@/components/FloatingNav";
import { BessHero } from "@/components/empresas/bess/BessHero";
import { BessOperatingModes } from "@/components/empresas/bess/BessOperatingModes";
import { BessGridFormingDeepDive } from "@/components/empresas/bess/BessGridFormingDeepDive";
import { BessPeakShavingSimulator } from "@/components/empresas/bess/BessPeakShavingSimulator";
import { BessCaseStudies } from "@/components/empresas/bess/BessCaseStudies";
import { BessSafetySpecs } from "@/components/empresas/bess/BessSafetySpecs";
import { BessAuditFormCTA } from "@/components/empresas/bess/BessAuditFormCTA";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Almacenamiento BESS C&I: Grid-Forming & Peak Shaving | SoldeRío",
  description:
    "Sistemas de almacenamiento BESS con baterías LiFePO4, inversores Grid-Forming y conmutación STS <10ms. Eliminación de Horario Punta (BT4.3/AT4.3) y resiliencia en redes débiles en el sur de Chile.",
};

export default function BessIndustrialPage() {
  return (
    <main className="w-full min-h-screen relative bg-[#141414] text-white">
      {/* 0. Floating Glassmorphism Navbar */}
      <FloatingNav />

      {/* 1. Hero Operacional: Resiliencia STS <10ms & Kpis Clave */}
      <BessHero />

      {/* 2. Diagrama Unilineal Interactivo: 4 Modos Operativos BTM */}
      <BessOperatingModes />

      {/* 3. Deep Dive Técnico: Grid-Forming (GFM) vs Grid-Following en Red Sur */}
      <BessGridFormingDeepDive />

      {/* 4. Simulador Interactivo de Peak Shaving, Tarifas & Payback con SII */}
      <BessPeakShavingSimulator />

      {/* 5. Blueprints Operativos: Casos Reales en Lechería y Acuicultura RAS */}
      <BessCaseStudies />

      {/* 6. Seguridad Industrial: Celdas LiFePO4, BMS 3 Niveles, NFPA 855 y SEC */}
      <BessSafetySpecs />

      {/* 7. Protocolo de Telemetría: Analizador de Redes 15 Días Sin Costo & Formulario */}
      <BessAuditFormCTA />

      {/* 8. Footer Oficial */}
      <Footer />
    </main>
  );
}
