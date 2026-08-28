import { FloatingNav } from "@/components/FloatingNav";
import { FAQHeroFrame } from "@/components/faq/FAQHeroFrame";
import { FAQInteractiveSuite } from "@/components/faq/FAQInteractiveSuite";
import { FAQCTA } from "@/components/faq/FAQCTA";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Preguntas Frecuentes sobre Energía Solar & Ley Net Billing | SoldeRío",
  description:
    "Respuestas oficiales y técnicas sobre funcionamiento de paneles en invierno, baterías LiFePO4 ante cortes, tramitación SEC TE-1/TE-4 y ahorro con la Ley 21.118 en el sur de Chile.",
};

export default function FAQPage() {
  return (
    <main className="w-full min-h-screen relative bg-[#F7F8FA]">
      {/* 0. Floating Glassmorphism Navbar */}
      <FloatingNav />

      {/* 1. Hero Frame (FAQ Hub) */}
      <FAQHeroFrame />

      {/* 2. Suite Interactiva con Buscador y Filtro por Categorías */}
      <FAQInteractiveSuite />

      {/* 3. CTA Final */}
      <FAQCTA />

      {/* 4. Footer Oficial */}
      <Footer />
    </main>
  );
}
