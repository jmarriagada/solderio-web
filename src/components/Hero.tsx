import Image from "next/image";
import { HERO_CONTENT } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/casa-solar-solderio.webp"
          alt="SoldeRío Planta Solar Residencial"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Dark Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center mt-16">
        <span className="text-white/90 text-sm md:text-base font-medium tracking-widest uppercase mb-4">
          {HERO_CONTENT.badge}
        </span>
        <h1 className="text-5xl md:text-7xl font-light text-white mb-8 tracking-tight">
          {HERO_CONTENT.title}
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="bg-white text-brand-fg px-8 py-4 text-sm font-medium hover:bg-brand-surface transition-colors flex items-center justify-center">
            {HERO_CONTENT.ctaPrimary}
          </button>
          <button className="bg-transparent border border-white/50 text-white px-8 py-4 text-sm font-medium hover:bg-white/10 transition-colors flex items-center justify-center">
            {HERO_CONTENT.ctaSecondary}
          </button>
        </div>
      </div>
    </section>
  );
}
