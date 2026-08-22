import { FloatingNav } from "@/components/FloatingNav";
import { BlogHeroFrame } from "@/components/blog/BlogHeroFrame";
import { BlogArticlesGrid } from "@/components/blog/BlogArticlesGrid";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Blog Solar & Noticias de Energía en el Sur | SoldeRío",
  description:
    "Casos de estudio reales en Puerto Varas, Osorno y Valdivia, novedades de la Ley Net Billing 21.118, guías de baterías LiFePO4 y franquicias tributarias para empresas.",
};

export default function BlogPage() {
  return (
    <main className="w-full min-h-screen relative bg-[#F1F1F1]">
      {/* 0. Floating Glassmorphism Navbar */}
      <FloatingNav />

      {/* 1. Hero Frame (Blog & Noticias) */}
      <BlogHeroFrame />

      {/* 2. Lista de Artículos Interactiva con Filtro */}
      <BlogArticlesGrid />

      {/* 3. Footer Oficial */}
      <Footer />
    </main>
  );
}
