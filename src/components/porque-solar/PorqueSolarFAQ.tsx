"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PorqueSolarFAQ() {
  return (
    <section className="pt-2 md:pt-4 pb-28 md:pb-40 px-4 md:px-8 max-w-7xl mx-auto flex justify-center">
      <Link
        href="/preguntas-frecuentes"
        className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 bg-white border border-black/10 text-brand-fg font-light text-xs md:text-sm shadow-xs hover:border-[#FF8300] hover:text-[#FF8300] hover:shadow-md transition-all duration-300 group cursor-pointer"
      >
        <span>Preguntas Frecuentes</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </section>
  );
}
