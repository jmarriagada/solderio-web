"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Attributes() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 20);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollLeft = 0;
      checkScrollPosition();
      el.addEventListener("scroll", checkScrollPosition, { passive: true });
      return () => el.removeEventListener("scroll", checkScrollPosition);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 480;
      scrollRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollPosition, 350);
    }
  };

  const attributes = [
    {
      title: "Ingeniería confiable",
      description:
        "Nuestras celdas monocristalinas, marcos negros en los paneles solares y anclajes antigoteras, entregan seguridad operativa con un aspecto estético superior.",
      image: "/images/solderio-planta-solar-residencial-osorno.png",
    },
    {
      title: "Más energía",
      description:
        "Con 2x más de potencia que paneles solares tradicionales, nuestros sistemas están diseñados para generar más energía en climas de alta nubosidad.",
      image: "/images/solarcell-solderio.png",
    },
    {
      title: "Excelencia técnica",
      description:
        "Diseño eficiente, con altos estándares de seguridad y calidad en las instalaciones. Ingenieros y técnicos eléctricos certificados por la Superintendencia de Electricidad y Combustibles (SEC).",
      image: "/images/solderio-ingeniero-electrico.jpg",
    },
    {
      title: "Puesta en marcha",
      description:
        "Gestionamos la certificación y conexión para que tu planta funcione correctamente y pueda inyectar los excedentes a la red.",
      image: "/images/puesta-en-marcha-planta-solar-residencial.jpeg",
    },
    {
      title: "Operación y Post-venta",
      description:
        "Operamos, mantenemos y monitoreamos las instalaciones, continuidad del suministro eléctrico.",
      image: "/images/ingenieria-sobre-plantas-solares-techo-solderio.jpeg",
    },
  ];

  return (
    <section className="bg-transparent pt-24 md:pt-36 pb-16 md:pb-24 relative overflow-hidden">
      <div className="w-full px-3 md:px-5 box-border">
        <div className="max-w-[1400px] mx-auto">
          {/* Header Title & Paragraph with Scroll Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mb-16"
          >
            <span className="text-xs md:text-sm font-light uppercase tracking-widest text-[#FF8300] mb-3 md:mb-4 block">
              Rendimiento Climático
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-brand-fg mb-6 tracking-tight">
              Diseñadas para el sur.
            </h2>
            <p className="text-brand-muted text-base md:text-lg leading-relaxed font-light">
              Una versión moderna y adaptada para el clima del sur. Con nuestro sistema de montaje, instalamos en diferentes tipos de techo. Respaldados por 25 años de garantía en paneles, nuestras plantas son duraderas y resistentes a la intemperie.
            </p>
          </motion.div>

          {/* Carousel Wrapper */}
          <div className="relative">
            {/* Left Arrow - appears only when scrolled past first card */}
            <AnimatePresence>
              {canScrollLeft && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => scroll("left")}
                  className="absolute left-2 md:left-4 top-[160px] sm:top-[200px] md:top-[230px] lg:top-[240px] -translate-y-1/2 bg-white/90 backdrop-blur-md border border-white/60 text-black p-3.5 md:p-4 rounded-2xl shadow-xl hover:bg-white hover:scale-105 transition-all z-30 cursor-pointer"
                  title="Volver"
                >
                  <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Right Arrow */}
            <button
              onClick={() => scroll("right")}
              className="absolute right-2 md:right-4 lg:right-6 top-[160px] sm:top-[200px] md:top-[230px] lg:top-[240px] -translate-y-1/2 bg-white/90 backdrop-blur-md border border-white/60 text-black p-3.5 md:p-4 rounded-2xl shadow-xl hover:bg-white hover:scale-105 transition-all z-30 cursor-pointer"
              title="Ver más"
            >
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-6 -mr-3 md:-mr-5 lg:-mr-[calc((100vw-1400px)/2+2rem)] pr-12 md:pr-24"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {attributes.map((attr, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="flex-none w-[320px] sm:w-[400px] md:w-[460px] lg:w-[480px] flex flex-col group cursor-pointer"
                >
                  {/* Image Card (8px rounded border) */}
                  <div className="relative w-full aspect-square mb-6 rounded-[20px] overflow-hidden border border-black/5 shadow-md">
                    <Image
                      src={attr.image}
                      alt={attr.title}
                      fill
                      quality={100}
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>

                  {/* Card Title */}
                  <h3 className="text-[24px] md:text-[30px] font-normal text-brand-fg mb-2 leading-tight">
                    {attr.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#6B7280] text-base leading-relaxed font-light">
                    {attr.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
