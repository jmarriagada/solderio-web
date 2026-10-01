"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, DESCUBRE_MENU } from "@/lib/constants";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVisitaModal } from "@/context/VisitaModalContext";

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

interface FloatingNavProps {
  alwaysVisible?: boolean;
}

export function FloatingNav({ alwaysVisible = false }: FloatingNavProps = {}) {
  const pathname = usePathname();
  const isCotizacionPage = pathname === "/cotizacion" || pathname?.startsWith("/cotizacion");
  const [isVisible, setIsVisible] = useState(alwaysVisible);
  const [isDescubreOpen, setIsDescubreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openModal } = useVisitaModal();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (alwaysVisible) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      // Show floating navbar once user scrolls past 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsDescubreOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysVisible]);

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
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={alwaysVisible ? { y: 0, opacity: 1, scale: 1 } : { y: -80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -80, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center px-4 pointer-events-none"
        >
          <div
            onMouseLeave={handleMouseLeave}
            className="pointer-events-auto flex items-center justify-between gap-6 px-6 py-2.5 rounded-full bg-[#1F1F1F]/95 backdrop-blur-xl border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.45)] max-w-4xl w-full relative text-white"
          >
            {/* Logo Dark Mode */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image
                src="/logos/logo-solderio-darkmode.svg"
                alt="SoldeRío Logo"
                width={120}
                height={32}
                className="h-7 w-auto"
              />
            </Link>

            {/* Centered Navigation Links with 1px extra size (text-[13px]) */}
            <div className="hidden md:flex items-center gap-7 text-[13px] font-light text-white/90">
              {NAV_LINKS.map((link) => {
                const isDescubre = link.label === "Descubre";
                const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));

                if (isDescubre) {
                  return (
                    <div
                      key={link.label}
                      onMouseEnter={handleMouseEnter}
                      className="relative py-1"
                    >
                      <button
                        onClick={() => setIsDescubreOpen((prev) => !prev)}
                        className={`transition-colors py-1 flex items-center gap-1 cursor-pointer font-light ${
                          isDescubreOpen ? "text-[#FF8300] font-normal" : "text-white/90 hover:text-[#FF8300]"
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${isDescubreOpen ? "rotate-180 text-[#FF8300]" : "text-white/60"}`} />
                      </button>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onMouseEnter={() => setIsDescubreOpen(false)}
                    className={`transition-colors py-1 relative group font-light ${
                      isActive ? "text-[#FF8300] font-normal" : "text-white/90 hover:text-[#FF8300]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Quick Action Button & Burger Button */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {isCotizacionPage ? (
                <a
                  href={WHATSAPP_COTIZACION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-1.5 text-xs sm:text-[13px] font-light tracking-wide bg-transparent hover:bg-[#25D366]/10 text-white px-3.5 sm:px-4 py-2 rounded-full border border-[#25D366] transition-all shadow-[0_0_12px_rgba(37,211,102,0.12)] hover:shadow-[0_0_15px_rgba(37,211,102,0.3)] whitespace-nowrap cursor-pointer"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366] flex-shrink-0" />
                  <span>Realizar Cotización Asistida</span>
                </a>
              ) : (
                <Link
                  href="/cotizacion"
                  className="flex items-center gap-1.5 text-[13px] font-light tracking-wide bg-[#FF8300] text-white px-4 py-2 rounded-full hover:bg-[#e07400] transition-all shadow-sm hover:shadow-[0_0_15px_rgba(255,131,0,0.4)] whitespace-nowrap"
                >
                  <span className="font-light">Cotizar</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[1.25]" />
                </Link>
              )}

              {/* Burger Button (Visible on screens < md) */}
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

            {/* Floating Dropdown for Descubre */}
            <AnimatePresence>
              {isDescubreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="absolute top-full left-0 right-0 mt-2 p-6 rounded-3xl bg-[#1F1F1F] text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/15 z-50"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Empresa */}
                    <div>
                      <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-3">
                        {DESCUBRE_MENU.empresa.title}
                      </span>
                      <ul className="space-y-2 text-[13px]">
                        {DESCUBRE_MENU.empresa.links.map((link) => (
                          <li key={link.label}>
                            {link.label === "Agendar consulta" ? (
                              <button
                                onClick={() => {
                                  setIsDescubreOpen(false);
                                  openModal();
                                }}
                                className="text-white/85 hover:text-[#FF8300] transition-colors py-0.5 inline-block font-light text-left cursor-pointer"
                              >
                                {link.label}
                              </button>
                            ) : (
                              <Link
                                href={link.href}
                                onClick={() => setIsDescubreOpen(false)}
                                className="text-white/85 hover:text-[#FF8300] transition-colors py-0.5 inline-block font-light"
                              >
                                {link.label}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Solar */}
                    <div>
                      <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-3">
                        {DESCUBRE_MENU.solar.title}
                      </span>
                      <ul className="space-y-2 text-[13px]">
                        {DESCUBRE_MENU.solar.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              onClick={() => setIsDescubreOpen(false)}
                              className="text-white/85 hover:text-[#FF8300] transition-colors py-0.5 inline-block font-light"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recursos */}
                    <div>
                      <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-3">
                        {DESCUBRE_MENU.recursos.title}
                      </span>
                      <ul className="space-y-2 text-[13px]">
                        {DESCUBRE_MENU.recursos.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              onClick={() => setIsDescubreOpen(false)}
                              className="text-white/85 hover:text-[#FF8300] transition-colors py-0.5 inline-block font-light"
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

            {/* Mobile Drawer Overlay for FloatingNav */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="md:hidden absolute top-full left-0 right-0 mt-2 p-5 rounded-3xl bg-[#141414]/98 backdrop-blur-2xl text-white shadow-2xl border border-white/15 z-50 overflow-hidden"
                >
                  <div className="flex flex-col space-y-3">
                    {NAV_LINKS.map((link) => {
                      const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                      const isDescubre = link.label === "Descubre";

                      if (isDescubre) {
                        return (
                          <div key={link.label} className="pb-1">
                            <button
                              type="button"
                              onClick={() => setIsDescubreOpen((prev) => !prev)}
                              className="w-full flex items-center justify-between text-sm font-light py-1.5 text-white/90 hover:text-[#FF8300] cursor-pointer"
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
                                  className="pl-3 space-y-2 pt-2 text-xs font-light text-white/70"
                                >
                                  <div className="font-medium text-[11px] text-[#FF8300] uppercase tracking-wider">Empresa</div>
                                  <ul className="space-y-1.5">
                                    {DESCUBRE_MENU.empresa.links.map((sub) => (
                                      <li key={sub.label}>
                                        {sub.label === "Agendar consulta" ? (
                                          <button
                                            onClick={() => {
                                              setIsMobileMenuOpen(false);
                                              openModal();
                                            }}
                                            className="hover:text-white transition-colors text-left cursor-pointer"
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

                                  <div className="font-medium text-[11px] text-[#FF8300] uppercase tracking-wider pt-2">Solar</div>
                                  <ul className="space-y-1.5">
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
                          className={`text-sm font-light py-2 transition-colors flex items-center justify-between ${
                            isActive ? "text-[#FF8300] font-normal" : "text-white/90 hover:text-[#FF8300]"
                          }`}
                        >
                          <span>{link.label}</span>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#FF8300]" />}
                        </Link>
                      );
                    })}

                    <div className="pt-2 flex flex-col gap-2.5">
                      {isCotizacionPage ? (
                        <a
                          href={WHATSAPP_COTIZACION_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="w-full py-3 rounded-full bg-transparent hover:bg-[#25D366]/10 text-white border border-[#25D366] text-sm font-light tracking-wide transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                        >
                          <WhatsAppIcon className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                          <span className="font-light">Realizar Cotización Asistida</span>
                        </a>
                      ) : (
                        <Link
                          href="/cotizacion"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="w-full py-3 rounded-full bg-[#FF8300] text-white text-sm font-light tracking-wide hover:bg-[#e07400] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                        >
                          <span className="font-light">Cotizador Solar</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[1.25]" />
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
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
