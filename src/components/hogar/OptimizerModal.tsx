"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Solar panel visualization item showing cell grid, optional shade/leaf, and production percentage
 */
function SolarPanelItem({
  percentage,
  hasShade = false,
  isHighlighted = false,
}: {
  percentage: string;
  hasShade?: boolean;
  isHighlighted?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      {/* Panel Frame */}
      <div className="relative w-full aspect-[1/2.2] bg-[#0A101C] rounded-[4px] sm:rounded-md border border-[#1E2E48] p-[2px] shadow-inner flex flex-col justify-between overflow-hidden">
        {/* 10 Solar Cells: 2 cols x 5 rows */}
        <div className="grid grid-cols-2 grid-rows-5 gap-[1.5px] w-full h-full">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#101A2C] rounded-[1px] border border-[#16253E]/60 relative overflow-hidden"
            >
              {/* Subtle metallic busbar line across cell */}
              <div className="absolute inset-y-0 left-1/2 w-[0.5px] bg-[#223654]/40 -translate-x-1/2" />
            </div>
          ))}
        </div>

        {/* Shading Leaves Overlay */}
        {hasShade && (
          <div className="absolute top-0 left-0 z-20 pointer-events-none">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              className="w-6 h-6 sm:w-7 sm:h-7 -translate-x-0.5 -translate-y-0.5 drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)]"
            >
              {/* Leaf 1 (Top right) */}
              <path
                d="M9 13C11 5 18 3 24 5C24 12 18 16 9 13Z"
                fill="#00E599"
              />
              {/* Leaf 2 (Center) */}
              <path
                d="M8 14C14 9 20 9 25 15C22 19 15 20 8 14Z"
                fill="#00B371"
              />
              {/* Leaf 3 (Bottom left) */}
              <path
                d="M7 15C5 19 8 25 15 24C16 18 12 14 7 15Z"
                fill="#059669"
              />
            </svg>
            {/* Soft shadow cast over the upper cells */}
            <div className="absolute top-0 left-0 w-7 h-7 bg-black/50 blur-[3px] -z-10 rounded-full" />
          </div>
        )}
      </div>

      {/* Production Output Label */}
      <span
        className={`mt-2 font-mono text-[11px] sm:text-xs font-semibold tracking-tight ${
          isHighlighted
            ? "text-[#00E599] drop-shadow-[0_0_8px_rgba(0,229,153,0.35)]"
            : "text-zinc-400"
        }`}
      >
        {percentage}
      </span>
    </div>
  );
}

export function OptimizerModal({ isOpen, onClose }: OptimizerModalProps) {
  // Close on Escape key press and prevent page background scrolling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[620px] bg-[#18191B] border border-white/10 rounded-[28px] p-6 sm:p-8 text-white relative shadow-2xl"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Content */}
            <div className="mb-6 pr-8">
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#FF8300] font-semibold block mb-2">
                RENDIMIENTO INDIVIDUAL
              </span>
              <h3 className="text-xl sm:text-2xl md:text-[26px] font-normal text-white tracking-tight mb-3 leading-snug">
                Optimizador de Potencia a Nivel Módulo
              </h3>
              <p className="text-zinc-300 text-sm sm:text-[15px] font-light leading-relaxed">
                Dispositivos de electrónica de potencia (MPPT individual) que liberan el máximo potencial de cada panel independientemente, eliminando pérdidas por sombras parciales, inclinaciones o suciedad.
              </p>
            </div>

            {/* Comparison Visual Graphic */}
            <div className="bg-[#0C0E12] border border-white/10 rounded-2xl p-4 sm:p-6">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {/* Left Column: SIN OPTIMIZADOR */}
                <div>
                  <div className="text-center mb-4">
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-medium block">
                      SIN OPTIMIZADOR
                    </span>
                    <div className="h-[1px] bg-white/10 w-full mt-2" />
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    <SolarPanelItem percentage="85%" hasShade={true} />
                    <SolarPanelItem percentage="90%" />
                    <SolarPanelItem percentage="90%" />
                    <SolarPanelItem percentage="90%" />
                  </div>
                </div>

                {/* Right Column: CON OPTIMIZADOR */}
                <div>
                  <div className="text-center mb-4">
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#00E599] font-bold block">
                      CON OPTIMIZADOR
                    </span>
                    <div className="h-[2px] bg-[#00E599] w-full mt-2 rounded-full shadow-[0_0_8px_rgba(0,229,153,0.4)]" />
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    <SolarPanelItem percentage="85%" hasShade={true} />
                    <SolarPanelItem percentage="100%" isHighlighted={true} />
                    <SolarPanelItem percentage="100%" isHighlighted={true} />
                    <SolarPanelItem percentage="100%" isHighlighted={true} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
