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
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF8300]/10 text-[#FF8300] text-xs font-semibold uppercase tracking-wider mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Preguntas Frecuentes</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-brand-fg tracking-tight">
          Transparencia y Claridad Total
        </h2>
        <p className="mt-3 text-sm md:text-base text-[#4A4A4A]">
          Resolvemos las dudas más frecuentes sobre nuestra empresa, tecnología y garantías.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl md:rounded-3xl border border-black/10 shadow-xs overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-black/[0.01]"
              >
                <span className="text-base md:text-lg font-bold text-brand-fg">
                  {faq.question}
                </span>
                <div
                  className={`p-2 rounded-xl bg-black/5 text-brand-fg flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 bg-[#FF8300] text-white" : ""
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 text-xs md:text-sm text-[#4A4A4A] leading-relaxed border-t border-black/5">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
