"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Search, MapPin } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

import { LocationBadge } from "@/components/LocationBadge";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-brand-bg border-brand-border py-4"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center">
          <Image
            src={
              isScrolled
                ? "/logos/logo-solderio-lightmode.svg"
                : "/logos/logo-solderio-darkmode.svg"
            }
            alt="SoldeRío Logo"
            width={160}
            height={48}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-brand-accent ${
                isScrolled ? "text-brand-fg" : "text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          <LocationBadge className="hidden sm:inline-block" />
          <button
            className={`p-2 rounded-full transition-colors ${
              isScrolled
                ? "text-brand-fg hover:bg-brand-surface"
                : "text-white hover:bg-white/10"
            }`}
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            className={`p-2 rounded-full transition-colors ${
              isScrolled
                ? "text-brand-fg hover:bg-brand-surface"
                : "text-white hover:bg-white/10"
            }`}
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
