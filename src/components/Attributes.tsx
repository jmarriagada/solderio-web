"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useVisitaModal } from "@/context/VisitaModalContext";

export function Attributes() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { openModal } = useVisitaModal();

  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const stopMomentum = () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    if (e.button !== 0 && e.pointerType === "mouse") return;

    stopMomentum();
    isPointerDownRef.current = true;
    isDraggingRef.current = false;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    scrollLeftStartRef.current = scrollRef.current.scrollLeft;
    velocityRef.current = 0;

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || !scrollRef.current) return;

    const currentX = e.clientX;
    const currentTime = performance.now();
    const dx = currentX - startXRef.current;

    if (Math.abs(dx) > 6) {
      isDraggingRef.current = true;
    }

    if (isDraggingRef.current) {
      scrollRef.current.scrollLeft = scrollLeftStartRef.current - dx;

      const dt = currentTime - lastTimeRef.current;
      if (dt > 0) {
        velocityRef.current = (currentX - lastXRef.current) / dt;
      }
      lastXRef.current = currentX;
      lastTimeRef.current = currentTime;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (isDraggingRef.current && scrollRef.current && Math.abs(velocityRef.current) > 0.15) {
      let currentVelocity = velocityRef.current * 16;
      const glide = () => {
        if (!scrollRef.current || Math.abs(currentVelocity) < 0.5) {
          stopMomentum();
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 50);
          return;
        }
        scrollRef.current.scrollLeft -= currentVelocity;
        currentVelocity *= 0.92;
        animationFrameRef.current = requestAnimationFrame(glide);
      };
      animationFrameRef.current = requestAnimationFrame(glide);
    } else {
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 50);
    }
  };

  const handlePointerCancel = () => {
    isPointerDownRef.current = false;
    stopMomentum();
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    stopMomentum();
    const scrollAmount = 350;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const steps = [
    {
      step: "01 • Consulta Inicial",
      title: "Cuéntanos sobre tu consumo",
      description:
        "Revisamos tu boleta de luz actual y conversamos sobre tus metas de ahorro y respaldo ante cortes. Sin compromisos ni tecnicismos.",
      image: "/images/solderio-planta-solar-residencial-consulta.jpeg",
    },
    {
      step: "02 • Prefactibilidad",
      title: "Estudio solar de tu techo",
      description:
        "Analizamos la orientación y el recurso solar de tu casa para entregarte una propuesta técnica y económica con tu ahorro proyectado.",
      image: "/images/solar-visitor-solderio.jpeg",
    },
    {
      step: "03 • Pagos y Financiamiento",
      title: "Opciones de pago a tu medida",
      description:
        "Elige pagar al contado, en cuotas o mediante financiamiento bancario verde. Tu ahorro mensual en la cuenta de luz ayuda a pagar el proyecto.",
      image: "/images/solarcell-solderio.png",
    },
    {
      step: "04 • Diseño de Ingeniería",
      title: "Planos y selección de equipos",
      description:
        "Diseñamos la configuración óptima para tu tejado, garantizando máxima captación de energía, estética cuidada y cero filtraciones.",
      image: "/images/ingeniero1-diseno-circuito-electrico-autocad.jpeg",
    },
    {
      step: "05 • Instalación en Terreno",
      title: "Montaje limpio y profesional",
      description:
        "Cuadrillas eléctricas autorizadas instalan los paneles, inversores y protecciones en 1 a 3 días con el menor impacto en tu rutina.",
      image: "/images/Solderio_instalacion-solar-en-techo.jpeg",
    },
    {
      step: "06 • Certificación & Net Billing",
      title: "Trámites oficiales y conexión",
      description:
        "Tramitamos toda la documentación ante la SEC y tu distribuidora eléctrica para que tus excedentes de energía se descuenten de tu boleta.",
      image: "/images/puesta-en-marcha-planta-solar-residencial.jpeg",
    },
    {
      step: "07 • Operación y Mantenimiento",
      title: "Monitoreo en app y soporte",
      description:
        "Sigues la generación en tiempo real desde tu teléfono, mientras nosotros cuidamos y mantenemos tu planta para que rinda por más de 25 años.",
      image: "/images/solderio-app-plantas-solares-residenciales.jpeg",
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
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6"
          >
            <div className="max-w-3xl">
              <span className="text-xs md:text-sm font-medium uppercase tracking-widest text-[#FF8300] mb-3 md:mb-4 block">
                Paso a Paso
              </span>
              <h2 className="text-3xl md:text-5xl font-light text-brand-fg mb-4 md:mb-6 tracking-tight">
                El camino a tu proyecto solar
              </h2>
              <p className="text-brand-muted text-base md:text-lg leading-relaxed font-light">
                Un proceso transparente y sin fricción. Nos encargamos de cada etapa, desde la primera evaluación de tu boleta hasta el monitoreo y mantenimiento continuo de tu planta.
              </p>
            </div>

            {/* Navigation Arrows for Carousel */}
            <div className="hidden sm:flex items-center gap-2 self-start md:self-end flex-shrink-0">
              <button
                type="button"
                onClick={() => scrollCarousel("left")}
                aria-label="Desplazar a la izquierda"
                className="w-11 h-11 rounded-full border border-black/10 bg-white/80 hover:bg-[#FF8300] hover:text-white hover:border-[#FF8300] text-[#1F1F1F] flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 stroke-[1.5]" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel("right")}
                aria-label="Desplazar a la derecha"
                className="w-11 h-11 rounded-full border border-black/10 bg-white/80 hover:bg-[#FF8300] hover:text-white hover:border-[#FF8300] text-[#1F1F1F] flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer"
              >
                <ArrowRight className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>
          </motion.div>

          {/* Carousel Wrapper (Drag & Move Scroll) */}
          <div className="relative">
            {/* Scrollable Container with Drag Support */}
            <div
              ref={scrollRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              className="flex gap-8 md:gap-9 overflow-x-auto scrollbar-none pb-6 -mr-3 md:-mr-5 lg:-mr-[calc((100vw-1400px)/2+2rem)] pr-12 md:pr-24 cursor-grab active:cursor-grabbing select-none touch-pan-y"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {steps.map((item, index) => {
                const isInteractive = index === 0 || index === 1;

                const handleCardClick = () => {
                  if (isDraggingRef.current) return;
                  if (index === 0) {
                    window.open("/cotizacion", "_blank");
                  } else if (index === 1) {
                    openModal("gratuita");
                  }
                };

                return (
                  <div
                    key={index}
                    className="flex-none w-[240px] sm:w-[280px] md:w-[310px] lg:w-[320px] flex flex-col"
                  >
                    {/* Image Card with glowing step badge */}
                    <div className="relative w-full aspect-square mb-5 rounded-[24px] overflow-hidden border border-black/10 shadow-md transition-all duration-500 bg-black/5">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        draggable={false}
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-cover object-center pointer-events-none select-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-40 pointer-events-none" />
                      
                      {/* Glowing Translucent Step Badge */}
                      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#181818]/90 backdrop-blur-xl border border-white/20 px-3.5 py-1.5 rounded-full text-white text-[12px] font-medium tracking-wide shadow-lg select-none pointer-events-none">
                        <span className="w-2 h-2 rounded-full bg-[#FF8300] shadow-[0_0_8px_#FF8300]" />
                        <span>{item.step}</span>
                      </div>
                    </div>

                    {/* Card Title: Clickable ONLY on title on hover if interactive */}
                    {isInteractive ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick();
                        }}
                        className="text-left w-full group/title cursor-pointer focus:outline-none mb-2 select-text"
                      >
                        <h3 className="text-[20px] md:text-[24px] font-normal text-brand-fg leading-tight flex items-center justify-between group-hover/title:text-[#FF8300] transition-colors duration-300">
                          <span>{item.title}</span>
                          <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all duration-300 text-[#FF8300] flex-shrink-0 ml-2" />
                        </h3>
                      </button>
                    ) : (
                      <h3 className="text-[20px] md:text-[24px] font-normal text-brand-fg mb-2 leading-tight flex items-center justify-between">
                        <span>{item.title}</span>
                      </h3>
                    )}

                    {/* Description */}
                    <p className="text-[#6B7280] text-sm md:text-base leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Interactive CTA Banner - Positioned right after Paso a Paso */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 md:mt-24 p-8 md:p-10 rounded-[24px] bg-gradient-to-r from-[#1F1F1F] to-[#2B2B2B] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl border border-white/10 relative overflow-hidden"
          >
            {/* Subtle Orange Glow Ambient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8300]/15 rounded-full blur-3xl pointer-events-none" />

            {/* SoldeRío Official Watermark Icon over orange glow, behind button, cut at the bottom-right corner with 10% opacity */}
            <div className="absolute -bottom-16 -right-16 md:-bottom-24 md:-right-24 pointer-events-none z-0 opacity-10 flex items-center justify-center select-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/icon-solderio.svg"
                alt=""
                aria-hidden="true"
                className="w-[280px] sm:w-[340px] md:w-[440px] h-auto object-contain pointer-events-none"
              />
            </div>

            <div className="relative z-10">
              <h4 className="text-xl md:text-2xl font-light mb-1.5">
                ¿Quieres dimensionar tu proyecto solar?
              </h4>
              <p className="text-white/70 text-base font-light">
                Realizamos una pre-evaluación en menos de 24 horas.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openModal("gratuita")}
              className="group relative z-10 whitespace-nowrap px-8 py-3.5 rounded-full bg-white text-black font-light text-xs md:text-sm hover:bg-[#FF8300] hover:text-white transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(255,131,0,0.4)] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Solicitar Evaluación Gratuita</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
