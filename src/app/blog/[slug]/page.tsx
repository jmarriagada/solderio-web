import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User, Share2, ArrowRight } from "lucide-react";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";
import { BLOG_POSTS } from "@/lib/blog-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Artículo No Encontrado | SoldeRío" };

  return {
    title: `${post.title} | Blog SoldeRío`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="w-full min-h-screen relative bg-[#F1F1F1]">
      <FloatingNav />

      {/* Article Header Container */}
      <article className="pt-28 md:pt-36 pb-20">
        <div className="w-full px-4 sm:px-6 md:px-8 box-border max-w-4xl mx-auto">
          
          {/* Back to Blog */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#6B7280] hover:text-[#FF8300] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Todos los Artículos</span>
          </Link>

          {/* Category Pill */}
          <div className="mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] bg-[#FF8300]/10 px-3.5 py-1.5 rounded-full border border-[#FF8300]/20">
              {post.category}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F1F1F] tracking-tight mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B7280] font-light pb-8 border-b border-black/10 mb-8">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#FF8300]" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-500" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-500" />
              {post.author.name} ({post.author.role})
            </span>
          </div>

          {/* Hero Featured Image */}
          <div className="relative w-full aspect-[16/9] rounded-[24px] md:rounded-[32px] overflow-hidden mb-12 shadow-xl border border-black/10">
            <Image
              src={post.image}
              alt={post.title}
              fill
              unoptimized
              priority
              className="object-cover object-center"
            />
          </div>

          {/* Article Body Content */}
          <div className="prose prose-lg max-w-none text-[#1F1F1F] font-light leading-relaxed space-y-6">
            {post.content.split("\n\n").map((block, bIdx) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={bIdx} className="text-2xl md:text-3xl font-light text-[#1F1F1F] tracking-tight mt-10 mb-4 pt-6 border-t border-black/5">
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (block.startsWith("### ")) {
                return (
                  <h3 key={bIdx} className="text-xl font-normal text-[#1F1F1F] mt-6 mb-3">
                    {block.replace("### ", "")}
                  </h3>
                );
              }
              if (block.startsWith("- ")) {
                const listItems = block.split("\n").map((li) => li.replace("- ", ""));
                return (
                  <ul key={bIdx} className="space-y-2 list-disc pl-5 my-4 text-[#6B7280] text-base font-light">
                    {listItems.map((item, lIdx) => (
                      <li key={lIdx}>{item}</li>
                    ))}
                  </ul>
                );
              }
              if (block.startsWith("|")) {
                return (
                  <div key={bIdx} className="overflow-x-auto my-6 p-4 rounded-2xl bg-white border border-black/5 shadow-sm text-xs md:text-sm font-light">
                    <pre className="font-sans whitespace-pre-wrap text-[#1F1F1F]">{block}</pre>
                  </div>
                );
              }
              return (
                <p key={bIdx} className="text-base md:text-lg text-[#6B7280] leading-relaxed">
                  {block}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-black/10 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#1F1F1F] font-semibold mr-2">Etiquetas:</span>
            {post.tags.map((tag, tIdx) => (
              <span key={tIdx} className="px-3 py-1 rounded-full bg-white border border-black/5 text-xs text-[#6B7280] font-light">
                #{tag}
              </span>
            ))}
          </div>

          {/* Bottom In-Article CTA */}
          <div className="mt-16 p-8 md:p-12 rounded-[28px] bg-[#141414] text-white text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FF8300]/15 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-2xl md:text-3xl font-light mb-4 relative z-10">
              ¿Quieres implementar un proyecto solar como este?
            </h3>
            <p className="text-white/70 text-sm md:text-base font-light max-w-lg mx-auto mb-8 relative z-10">
              Obtén una pre-evaluación técnica y económica personalizada para tu casa o empresa en el sur de Chile.
            </p>
            <Link
              href="/cotizacion"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-light text-xs md:text-sm hover:bg-[#FF8300] hover:text-white transition-all duration-300 shadow-xl relative z-10 cursor-pointer group"
            >
              <span>Cotizar con SoldeRío</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

        </div>
      </article>

      <Footer />
    </main>
  );
}
