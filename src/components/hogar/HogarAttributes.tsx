"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useVisitaModal } from "@/context/VisitaModalContext";

export function HogarAttributes() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { openModal } = useVisitaModal();

  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const isDraggingRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isMouseDownRef.current = true;
    isDraggingRef.current = false;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStartRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeaveOrUp = () => {
    isMouseDownRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      isDraggingRef.current = true;
    }
    scrollRef.current.scrollLeft = scrollLeftStartRef.current - walk;
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
            className="max-w-3xl mb-16"
          >
            <span className="text-xs md:text-sm font-medium uppercase tracking-widest text-[#FF8300] mb-3 md:mb-4 block">
              Paso a Paso
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-brand-fg mb-6 tracking-tight">
              El camino a tu proyecto solar
            </h2>
            <p className="text-brand-muted text-base md:text-lg leading-relaxed font-light">
              Un proceso transparente y sin fricción. Nos encargamos de cada etapa, desde la primera evaluación de tu boleta hasta el monitoreo y mantenimiento continuo de tu planta.
            </p>
          </motion.div>

          {/* Carousel Wrapper (Drag & Move Scroll) */}
          <div className="relative">
            {/* Scrollable Container with Drag Support */}
            <div
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeaveOrUp}
              onMouseUp={handleMouseLeaveOrUp}
              onMouseMove={handleMouseMove}
              className="flex gap-8 md:gap-9 overflow-x-auto scrollbar-none pb-6 -mr-3 md:-mr-5 lg:-mr-[calc((100vw-1400px)/2+2rem)] pr-12 md:pr-24 cursor-grab active:cursor-grabbing select-none"
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
                  <motion.div
                    key={index}
                    whileHover={isInteractive ? { y: -6 } : undefined}
                    transition={{ duration: 0.3 }}
                    onClick={isInteractive ? handleCardClick : undefined}
                    className={`flex-none w-[240px] sm:w-[280px] md:w-[310px] lg:w-[320px] flex flex-col group ${
                      isInteractive ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    {/* Image Card with glowing step badge & smooth zoom */}
                    <div className={`relative w-full aspect-square mb-5 rounded-[24px] overflow-hidden border border-black/10 shadow-md ${
                      isInteractive ? "group-hover:shadow-2xl group-hover:border-[#FF8300]/30" : ""
                    } transition-all duration-500 bg-black/5`}>
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className={`object-cover object-center ${
                          isInteractive ? "group-hover:scale-105" : ""
                        } transition-transform duration-700 ease-out`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />
                      
                      {/* Glowing Translucent Step Badge */}
                      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#181818]/90 backdrop-blur-xl border border-white/20 px-3.5 py-1.5 rounded-full text-white text-[12px] font-medium tracking-wide shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-[#FF8300] shadow-[0_0_8px_#FF8300]" />
                        <span>{item.step}</span>
                      </div>
                    </div>

                    {/* Card Title with Slide Arrow on Hover for interactive cards */}
                    <h3 className={`text-[20px] md:text-[24px] font-normal text-brand-fg mb-2 leading-tight flex items-center justify-between ${
                      isInteractive ? "group-hover:text-[#FF8300]" : ""
                    } transition-colors duration-300`}>
                      <span>{item.title}</span>
                      {isInteractive && (
                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#FF8300] flex-shrink-0 ml-2" />
                      )}
                    </h3>

                    {/* Description */}
                    <p className="text-[#6B7280] text-sm md:text-base leading-relaxed font-light">
                      {item.description}
                    </p>
                  </motion.div>
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
