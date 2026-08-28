import { FloatingNav } from "@/components/FloatingNav";
import { TrabajaHeroFrame } from "@/components/trabaja/TrabajaHeroFrame";
import { TrabajaPositions } from "@/components/trabaja/TrabajaPositions";
import { TrabajaForm } from "@/components/trabaja/TrabajaForm";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Trabaja con Nosotros | Oportunidades en Ingeniería Solar | SoldeRío",
  description:
    "Únete al equipo de SoldeRío. Buscamos ingenieros eléctricos SEC Clase A, técnicos montajistas y asesores comerciales para liderar la energía solar en el sur de Chile.",
};

export default function TrabajaConNosotrosPage() {
  return (
    <main className="w-full min-h-screen relative bg-[#F7F8FA]">
      {/* 0. Floating Glassmorphism Navbar */}
      <FloatingNav />

      {/* 1. Hero Frame (Trabaja con Nosotros) */}
      <TrabajaHeroFrame />

      {/* 2. Vacantes Abiertas */}
      <TrabajaPositions />

      {/* 3. Formulario de Postulación */}
      <TrabajaForm />

      {/* 4. Footer Oficial */}
      <Footer />
    </main>
  );
}
