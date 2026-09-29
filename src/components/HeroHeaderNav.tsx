"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X, ChevronDown } from "lucide-react";
import { NAV_LINKS, DESCUBRE_MENU } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { useVisitaModal } from "@/context/VisitaModalContext";

interface HeroHeaderNavProps {
  activePage?: "Inicio" | "Hogar" | "Empresas" | "Carga EV" | "Descubre";
  locationText?: string;
}

const WHATSAPP_COTIZACION_URL = `https://wa.me/56966186667?text=${encodeURIComponent(
  "Necesito realizar una cotizacion solar asistida por un Ingeniero de SoldeRío."
)}`;

function WhatsAppIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.886-9.888 9.886m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const SOLAR_PARTICLES = [
  { id: 1, top: "-4px", left: "22%", size: 3.5, color: "#FBBF24", y: [0, -5, 0], x: [0, 2, 0], duration: 3.2, delay: 0 },
  { id: 2, top: "2px", left: "-5px", size: 2.5, color: "#FF8300", y: [0, -4, 0], x: [0, -2, 0], duration: 3.8, delay: 0.7 },
  { id: 3, top: "-3px", right: "26px", size: 3, color: "#FCD34D", y: [0, -4, 0], x: [0, 2, 0], duration: 3.5, delay: 1.2 },
  { id: 4, bottom: "-4px", left: "35%", size: 2.5, color: "#FF921A", y: [0, 4, 0], x: [0, -2, 0], duration: 3.6, delay: 0.4 },
  { id: 5, bottom: "-3px", right: "32px", size: 2, color: "#FFFBEB", y: [0, 3, 0], x: [0, 2, 0], duration: 4.0, delay: 1.6 },
  { id: 6, top: "35%", right: "-6px", size: 2.5, color: "#F59E0B", y: [0, 3, 0], x: [0, 2, 0], duration: 3.3, delay: 0.9 },
];

export function HeroHeaderNav({
  activePage,
  locationText,
}: HeroHeaderNavProps) {
  const pathname = usePathname();
  const isCotizacionPage = pathname === "/cotizacion" || pathname?.startsWith("/cotizacion");
  const [isDescubreOpen, setIsDescubreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openModal } = useVisitaModal();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      className={`relative z-30 w-full transition-colors duration-200 ${
        isMobileMenuOpen ? "bg-[#141414] md:bg-transparent" : "bg-transparent"
      }`}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top Header Bar */}
      <header
        className={`relative z-40 w-full flex items-center justify-between px-6 md:px-8 pt-6 pb-3 md:pb-0 transition-colors duration-200 ${
          isMobileMenuOpen ? "bg-[#141414] md:bg-transparent" : "bg-transparent"
        }`}
      >
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
              </Link>
            );
          })}
        </nav>

        {/* Right: Cotizador Solar / Asistencia WhatsApp CTA & Mobile Burger Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isCotizacionPage ? (
            <div className="relative group flex items-center">
              {/* Subtle WhatsApp Ambient Glow */}
              <div
                className="absolute -inset-1 rounded-full bg-[#25D366]/15 blur-md pointer-events-none group-hover:opacity-90 group-hover:scale-105 transition-all duration-300"
              />

              {/* Cotización Asistida WhatsApp CTA - Solo stroke verde, sin fondo */}
              <a
                href={WHATSAPP_COTIZACION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="relative overflow-hidden flex items-center gap-1.5 sm:gap-2 text-xs sm:text-[13px] font-light tracking-wide bg-transparent hover:bg-[#25D366]/10 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-[#25D366] shadow-[0_0_12px_rgba(37,211,102,0.12)] hover:shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all duration-300 cursor-pointer whitespace-nowrap active:scale-[0.98]"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#25D366] relative z-10 flex-shrink-0" />
                <span className="relative z-10 font-light text-white">Cotización Asistida</span>
              </a>
            </div>
          ) : (
            <div className="relative group flex items-center">
              {/* Ambient Pulsing Solar Glow */}
              <motion.div
                animate={{
                  scale: [1, 1.06, 1],
                  opacity: [0.35, 0.65, 0.35],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#FF8300]/40 via-amber-400/30 to-[#FF8300]/40 blur-md pointer-events-none group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
              />

              {/* Subtle Floating Solar Particles */}
              <div className="hidden sm:block">
                {SOLAR_PARTICLES.map((p) => (
                  <motion.span
                    key={p.id}
                    animate={{
                      y: p.y,
                      x: p.x,
                      opacity: [0.25, 0.9, 0.25],
                      scale: [0.75, 1.25, 0.75],
                    }}
                    transition={{
                      duration: p.duration,
                      repeat: Infinity,
                      delay: p.delay,
                      ease: "easeInOut",
                    }}
                    style={{
                      top: p.top,
                      bottom: p.bottom,
                      left: p.left,
                      right: p.right,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      backgroundColor: p.color,
                      boxShadow: `0 0 ${p.size * 2}px ${p.color}, 0 0 ${p.size * 3.5}px rgba(255, 131, 0, 0.6)`,
                    }}
                    className="absolute rounded-full pointer-events-none z-10"
                  />
                ))}
              </div>

              {/* Main CTA Button with Satoshi Light typography */}
              <Link
                href="/cotizacion"
                className="relative overflow-hidden flex items-center gap-1.5 text-xs sm:text-[13px] font-light tracking-wide bg-gradient-to-r from-[#FF8300] via-[#FF8D10] to-[#FF8300] text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-white/20 shadow-sm hover:shadow-[0_0_20px_rgba(255,131,0,0.5)] transition-all duration-300 cursor-pointer whitespace-nowrap active:scale-[0.98]"
              >
                {/* Subtle Shimmer Sweep passing across the button */}
                <motion.div
                  animate={{ x: ["-130%", "230%"] }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    repeatDelay: 3.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none"
                />

                <span className="hidden sm:inline relative z-10 font-light">Cotizador Solar</span>
                <span className="sm:hidden relative z-10 font-light">Cotizar</span>
                <ArrowRight className="w-3.5 h-3.5 relative z-10 stroke-[1.25] transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}

          {/* Mobile Burger Button (Visible only on screens < md) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white focus:outline-none transition-colors cursor-pointer flex items-center justify-center"
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú de navegación"}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-[#FF8300]" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
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

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute top-full left-0 right-0 z-50 bg-[#141414] border-b border-white/10 px-6 pb-8 pt-2 text-white shadow-2xl rounded-b-[24px] overflow-hidden"
          >
            <div className="flex flex-col space-y-3">
              {NAV_LINKS.map((link) => {
                const isActive = activePage === link.label;
                const isDescubre = link.label === "Descubre";

                if (isDescubre) {
                  return (
                    <div key={link.label} className="pb-1">
                      <button
                        type="button"
                        onClick={() => setIsDescubreOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between text-base font-light py-2 text-white/90 hover:text-[#FF8300] cursor-pointer"
                      >
                        <span>Descubre</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isDescubreOpen ? "rotate-180 text-[#FF8300]" : "text-white/60"}`} />
                      </button>

                      <AnimatePresence>
                        {isDescubreOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 space-y-3 pt-2 text-sm font-light text-white/70"
                          >
                            <div className="font-medium text-xs text-[#FF8300] uppercase tracking-wider">Empresa</div>
                            <ul className="space-y-2">
                              {DESCUBRE_MENU.empresa.links.map((sub) => (
                                <li key={sub.label}>
                                  {sub.label === "Agendar consulta" ? (
                                    <button
                                      onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        openModal();
                                      }}
                                      className="hover:text-white transition-colors cursor-pointer text-left"
                                    >
                                      {sub.label}
                                    </button>
                                  ) : (
                                    <Link href={sub.href} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors">
                                      {sub.label}
                                    </Link>
                                  )}
                                </li>
                              ))}
                            </ul>

                            <div className="font-medium text-xs text-[#FF8300] uppercase tracking-wider pt-2">Solar</div>
                            <ul className="space-y-2">
                              {DESCUBRE_MENU.solar.links.map((sub) => (
                                <li key={sub.label}>
                                  <Link href={sub.href} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors">
                                    {sub.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-base font-light py-2 transition-colors flex items-center justify-between ${
                      isActive ? "text-[#FF8300] font-normal" : "text-white/90 hover:text-[#FF8300]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-[#FF8300]" />}
                  </Link>
                );
              })}

              <div className="pt-3 flex flex-col gap-2.5">
                {isCotizacionPage ? (
                  <a
                    href={WHATSAPP_COTIZACION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3.5 rounded-full bg-transparent hover:bg-[#25D366]/10 text-white border border-[#25D366] text-sm font-light tracking-wide transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                    <span className="font-light">Cotización Asistida</span>
                  </a>
                ) : (
                  <Link
                    href="/cotizacion"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3.5 rounded-full bg-[#FF8300] text-white text-sm font-light tracking-wide hover:bg-[#e07400] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span className="font-light">Cotizador Solar</span>
                    <ArrowRight className="w-4 h-4 stroke-[1.25]" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openModal();
                  }}
                  className="w-full py-3 rounded-full bg-white/10 border border-white/20 text-white text-sm font-light hover:bg-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="font-light">Solicitar Pre-Evaluación</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
