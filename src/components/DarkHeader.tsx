"use client";

import Image from "next/image";
import Link from "next/link";
import { Sun, Zap, User, MapPin } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export function DarkHeader() {
  return (
    <header className="relative z-20 w-full flex items-center justify-between px-6 md:px-8 pt-6 pb-4">
      {/* Left: Logo (Darkmode version) */}
      <Link href="/" className="flex items-center">
        <Image
          src="/logos/logo-solderio-darkmode.svg"
          alt="SoldeRío Logo"
          width={160}
          height={44}
          className="h-8 md:h-10 w-auto"
          priority
        />
      </Link>

      {/* Center: Nav links strictly centered on screen */}
      <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-sm font-light text-white/90">
        {NAV_LINKS.map((link) => {
          const isActive = link.label === "Hogar";
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`transition-colors font-light ${
                isActive
                  ? "text-[#FF8300] font-normal"
                  : "text-white/90 hover:text-[#FF8300]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right: Utility Icons & Location */}
      <div className="flex items-center gap-3 md:gap-4 text-white/90">
        <button className="p-1 hover:text-[#FF8300] transition-colors" title="Modo">
          <Sun className="w-4 h-4 stroke-[1.5]" />
        </button>
        <button className="p-1 hover:text-[#FF8300] transition-colors" title="Energía">
          <Zap className="w-4 h-4 stroke-[1.5]" />
        </button>
        <button className="p-1 hover:text-[#FF8300] transition-colors" title="Usuario">
          <User className="w-4 h-4 stroke-[1.5]" />
        </button>
        <div className="hidden sm:flex items-center gap-1 text-xs font-light text-white/80 pl-2">
          <MapPin className="w-3.5 h-3.5 stroke-[1.5] text-[#FF8300]" />
          <span>Osorno, Los Lagos</span>
        </div>
      </div>
    </header>
  );
}
