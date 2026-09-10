"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ACERCA_DE_DATA } from "@/lib/constants";
import { ChevronDown, HelpCircle } from "lucide-react";

export function AcercaDeFAQ() {
  const { faqs } = ACERCA_DE_DATA;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full py-20 md:py-32 px-3 md:px-5 box-border bg-[#141414] text-white relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#FF8300]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1000px] mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight leading-[1.1]">
            Transparencia y Claridad Total
          </h2>
        </motion.div>

        {/* Accordion List */}
        <div className="space-y-4 mb-14">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`rounded-[22px] border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-[#1F1F1F] border-[#FF8300]/40 shadow-xl shadow-black/40"
                    : "bg-[#1A1A1A]/90 border-white/10 hover:border-white/20 hover:bg-[#1F1F1F]/70"
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-6 md:p-7 flex items-center justify-between gap-4 cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-base md:text-lg font-light tracking-tight leading-snug transition-colors ${
                      isOpen ? "text-white" : "text-white/90"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? "bg-[#FF8300] text-white rotate-180 shadow-[0_0_15px_rgba(255,131,0,0.4)]"
                        : "bg-white/5 text-white/60 border border-white/10"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      <div className="px-6 md:px-7 pb-6 md:pb-7 pt-1 border-t border-white/10">
                        <p className="text-xs md:text-sm text-white/70 font-light leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Help Banner */}
        <div className="bg-gradient-to-r from-[#1F1F1F] to-[#262626] rounded-[24px] border border-white/10 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF8300]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-4 text-center sm:text-left relative z-10">
            <div className="w-12 h-12 rounded-full bg-[#FF8300]/15 border border-[#FF8300]/20 text-[#FF8300] flex items-center justify-center shrink-0 hidden sm:flex">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-normal text-white mb-1">
                ¿Tienes una duda específica sobre tu proyecto solar?
              </h4>
              <p className="text-xs md:text-sm text-white/70 font-light">
                Conversa directamente con nuestros ingenieros.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/56966186667?text=Hola%20quiero%20hablar%20con%20un%20ingeniero%20por%20un%20proyecto%20solar"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 rounded-xl px-7 py-2.5 bg-white text-black font-light text-xs md:text-sm shadow-lg hover:bg-[#FF8300] hover:text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,131,0,0.4)] whitespace-nowrap"
          >
            Hablar con un Ingeniero
          </a>
        </div>
      </div>
    </section>
  );
}
