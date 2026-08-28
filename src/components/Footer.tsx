"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  return (
    <footer className="bg-[#141414] text-white pt-16 md:pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Navigation Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 pb-16 border-b border-white/10 text-xs font-light tracking-wider">
          {/* Column 1: Soluciones */}
          <div className="flex flex-col space-y-3">
            <span className="text-white/40 uppercase text-[10px] font-mono tracking-widest block mb-1">Soluciones</span>
            <Link 
              href="/" 
              className={`hover:text-[#FF8300] transition-colors uppercase ${pathname === "/" ? "text-[#FF8300]" : ""}`}
            >
              Inicio
            </Link>
            <Link 
              href="/hogar" 
              className={`hover:text-[#FF8300] transition-colors uppercase ${pathname === "/hogar" ? "text-[#FF8300]" : ""}`}
            >
              Hogar
            </Link>
            <Link 
              href="/empresas" 
              className={`hover:text-[#FF8300] transition-colors uppercase ${pathname === "/empresas" ? "text-[#FF8300]" : ""}`}
            >
              Comercial
            </Link>
          </div>

          {/* Column 2: Empresa & Recursos */}
          <div className="flex flex-col space-y-3">
            <span className="text-white/40 uppercase text-[10px] font-mono tracking-widest block mb-1">Empresa</span>
            <Link 
              href="/acerca-de" 
              className={`hover:text-[#FF8300] transition-colors uppercase ${pathname === "/acerca-de" ? "text-[#FF8300]" : ""}`}
            >
              Acerca de
            </Link>
            <Link 
              href="/preguntas-frecuentes" 
              className={`hover:text-[#FF8300] transition-colors uppercase ${pathname === "/preguntas-frecuentes" ? "text-[#FF8300]" : ""}`}
            >
              Preguntas Frecuentes
            </Link>
            <Link 
              href="/blog" 
              className={`hover:text-[#FF8300] transition-colors uppercase ${pathname.startsWith("/blog") ? "text-[#FF8300]" : ""}`}
            >
              Blog & Noticias
            </Link>
            <Link 
              href="/trabaja-con-nosotros" 
              className={`hover:text-[#FF8300] transition-colors uppercase ${pathname === "/trabaja-con-nosotros" ? "text-[#FF8300]" : ""}`}
            >
              Trabaja con Nosotros
            </Link>
          </div>

          {/* Column 3: Legal & Conocimiento */}
          <div className="flex flex-col space-y-3">
            <span className="text-white/40 uppercase text-[10px] font-mono tracking-widest block mb-1">Conocimiento</span>
            <Link 
              href="/incentivos" 
              className={`hover:text-[#FF8300] transition-colors uppercase ${pathname === "/incentivos" ? "text-[#FF8300]" : ""}`}
            >
              Ley Net Billing & SII
            </Link>
            <Link 
              href="/seguros" 
              className={`hover:text-[#FF8300] transition-colors uppercase ${pathname === "/seguros" ? "text-[#FF8300]" : ""}`}
            >
              Seguros & Pólizas
            </Link>
            <Link 
              href="/aprender" 
              className={`hover:text-[#FF8300] transition-colors uppercase ${pathname === "/aprender" ? "text-[#FF8300]" : ""}`}
            >
              Aprender & Boletas
            </Link>
            <Link 
              href="/garantia" 
              className={`hover:text-[#FF8300] transition-colors uppercase ${pathname === "/garantia" ? "text-[#FF8300]" : ""}`}
            >
              Garantía 25 Años
            </Link>
          </div>

          {/* Column 4: Contact info */}
          <div className="flex flex-col space-y-2 text-white/60">
            <span className="text-white uppercase font-normal">Macrozona Sur</span>
            <span>Los Lagos • Los Ríos • Araucanía</span>
            <span className="text-[#FF8300]">contacto@solderio.cl</span>
            <div className="pt-2 flex flex-col space-y-1 text-[11px] text-white/40 font-light">
              <Link href="/politicas-de-privacidad" className="hover:text-white transition-colors">
                Políticas de Privacidad
              </Link>
              <Link href="/terminos" className="hover:text-white transition-colors">
                Términos del Servicio
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src="/logos/logo-solderio-darkmode.svg"
                alt="SoldeRío Logo"
                width={130}
                height={36}
                className="h-7 w-auto"
              />
            </Link>
          </div>

          <p className="text-xs text-white/60 font-light tracking-wide text-center sm:text-right">
            Energía inteligente, ingeniería confiable
          </p>
        </div>
      </div>
    </footer>
  );
}
