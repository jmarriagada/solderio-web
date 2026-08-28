"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sun, Zap, User, ArrowRight } from "lucide-react";
import { NAV_LINKS, DESCUBRE_MENU } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

import { LocationBadge } from "@/components/LocationBadge";

interface HeroHeaderNavProps {
  activePage?: "Inicio" | "Hogar" | "Empresas" | "Carga EV" | "Descubre";
  locationText?: string;
}

export function HeroHeaderNav({
  activePage,
  locationText,
}: HeroHeaderNavProps) {
  const [isDescubreOpen, setIsDescubreOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<string | null>(locationText || null);
  const { openModal } = useVisitaModal();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If locationText was provided explicitly as non-empty, use it
    if (locationText) {
      setUserLocation(locationText);
      return;
    }

    let isMounted = true;

    // Check cached location in sessionStorage
    try {
      const cached = sessionStorage.getItem("solderio_user_geo");
      if (cached) {
        setUserLocation(cached);
        return;
      }
    } catch {}

    const detectLocation = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const res = await fetch("https://ipwho.is/", {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data.success && isMounted) {
            const locParts: string[] = [];
            if (data.city) locParts.push(data.city);
            if (data.region) locParts.push(data.region);

            const formatted = locParts.join(", ");
            if (formatted) {
              setUserLocation(formatted);
              try {
                sessionStorage.setItem("solderio_user_geo", formatted);
              } catch {}
              return;
            }
          }
        }
      } catch {
        // Silently catch if ad-blocked or offline
      }

      if (isMounted && !locationText) {
        setUserLocation(null);
      }
    };

    detectLocation();

    return () => {
      isMounted = false;
    };
  }, [locationText]);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsDescubreOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsDescubreOpen(false);
    }, 200);
  };

  return (
    <div
      className="relative z-30 w-full"
      onMouseLeave={handleMouseLeave}
    >
      {/* Top Header Bar */}
      <header className="relative z-40 w-full flex items-center justify-between px-6 md:px-8 pt-6">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/logos/logo-solderio-darkmode.svg"
            alt="SoldeRío Logo"
            width={160}
            height={44}
            className="h-8 md:h-10 w-auto transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </Link>

        {/* Center: Nav links strictly centered */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-sm font-light text-white/90">
          {NAV_LINKS.map((link) => {
            const isActive = activePage === link.label;
            const isDescubre = link.label === "Descubre";

            if (isDescubre) {
              return (
                <div
                  key={link.label}
                  onMouseEnter={handleMouseEnter}
                  className="relative py-1"
                >
                  <button
                    onClick={() => setIsDescubreOpen((prev) => !prev)}
                    className={`transition-colors font-light relative py-1 cursor-pointer flex items-center gap-1 ${
                      isDescubreOpen
                        ? "text-[#FF8300] font-normal"
                        : "text-white/90 hover:text-[#FF8300]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isDescubreOpen && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#FF8300]"
                      />
                    )}
                  </button>
                </div>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                onMouseEnter={() => setIsDescubreOpen(false)}
                className={`transition-colors font-light relative py-1 group ${
                  isActive ? "text-[#FF8300] font-normal" : "text-white/90 hover:text-[#FF8300]"
                }`}
              >
                {link.label}
                {isActive && !isDescubreOpen && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#FF8300]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Icons & Location */}
        <div className="flex items-center gap-3 md:gap-4 text-white/90">
          <button className="p-1.5 hover:text-[#FF8300] transition-colors rounded-full hover:bg-white/10 cursor-pointer" title="Modo">
            <Sun className="w-4 h-4 stroke-[1.5]" />
          </button>
          <button className="p-1.5 hover:text-[#FF8300] transition-colors rounded-full hover:bg-white/10 cursor-pointer" title="Energía">
            <Zap className="w-4 h-4 stroke-[1.5]" />
          </button>
          <button className="p-1.5 hover:text-[#FF8300] transition-colors rounded-full hover:bg-white/10 cursor-pointer" title="Usuario">
            <User className="w-4 h-4 stroke-[1.5]" />
          </button>
          <LocationBadge locationText={userLocation || locationText || undefined} className="hidden sm:inline-block" />
        </div>
      </header>

      {/* Descubre MegaMenu Dropdown inside the Hero Frame Mask */}
      <AnimatePresence>
        {isDescubreOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute top-0 left-0 right-0 z-30 pt-24 pb-10 px-6 md:px-16 rounded-b-[24px] md:rounded-b-[32px] overflow-hidden shadow-2xl border-b border-white/10 bg-[#1F1F1F]"
          >
            {/* Ambient top highlight */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16 pt-4">
              {/* Column 1: EMPRESA */}
              <div className="flex flex-col">
                <span className="text-[11px] md:text-xs font-semibold tracking-wider text-white/50 uppercase mb-4">
                  {DESCUBRE_MENU.empresa.title}
                </span>
                <ul className="space-y-2.5">
                  {DESCUBRE_MENU.empresa.links.map((link) => (
                    <li key={link.label}>
                      {link.label === "Agendar consulta" ? (
                        <button
                          onClick={() => {
                            setIsDescubreOpen(false);
                            openModal();
                          }}
                          className="text-xs md:text-sm text-white/85 hover:text-[#FF8300] transition-colors py-0.5 inline-block font-light text-left cursor-pointer"
                        >
                          {link.label}
                        </button>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={() => setIsDescubreOpen(false)}
                          className="text-xs md:text-sm text-white/85 hover:text-[#FF8300] transition-colors py-0.5 inline-block font-light"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: SOLAR */}
              <div className="flex flex-col">
                <span className="text-[11px] md:text-xs font-semibold tracking-wider text-white/50 uppercase mb-4">
                  {DESCUBRE_MENU.solar.title}
                </span>
                <ul className="space-y-2.5">
                  {DESCUBRE_MENU.solar.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={() => setIsDescubreOpen(false)}
                        className="text-xs md:text-sm text-white/85 hover:text-[#FF8300] transition-colors py-0.5 inline-block font-light"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: RECURSOS */}
              <div className="flex flex-col">
                <span className="text-[11px] md:text-xs font-semibold tracking-wider text-white/50 uppercase mb-4">
                  {DESCUBRE_MENU.recursos.title}
                </span>
                <ul className="space-y-2.5">
                  {DESCUBRE_MENU.recursos.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={() => setIsDescubreOpen(false)}
                        className="text-xs md:text-sm text-white/85 hover:text-[#FF8300] transition-colors py-0.5 inline-block font-light"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
