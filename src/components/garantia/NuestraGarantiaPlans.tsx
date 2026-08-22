"use client";

import { motion } from "framer-motion";
import { NUESTRA_GARANTIA_DATA } from "@/lib/constants";
import { Check, Star, ArrowRight, Shield, Zap } from "lucide-react";
import Link from "next/link";

export function NuestraGarantiaPlans() {
  const { plans } = NUESTRA_GARANTIA_DATA;

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[#FF8300] mb-2 block">
          Planes de Operación & Mantenimiento (O&M)
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-fg tracking-tight">
          Protege tu Inversión Todo el Año
        </h2>
        <p className="mt-4 text-sm md:text-base text-[#4A4A4A]">
          Una planta solar con mantenimiento preventivo produce hasta un 9% más de energía y extiende su vida útil más allá de 30 años.
        </p>
      </div>

      {/* Plans Pricing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, idx) => {
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`rounded-3xl p-8 md:p-10 flex flex-col justify-between relative transition-all duration-300 ${
                plan.isFeatured
                  ? "bg-[#1F1F1F] text-white border-2 border-[#FF8300] shadow-[0_20px_50px_rgba(255,131,0,0.2)] scale-[1.02]"
                  : "bg-white text-brand-fg border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:border-[#FF8300]/30"
              }`}
            >
              {/* Highlight ribbon for Total Guard */}
              {plan.isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF8300] to-[#e07400] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-white" />
                  <span>¡1er Año 100% Incluido Gratis!</span>
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="mb-6">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider block mb-1 ${
                      plan.isFeatured ? "text-[#FF8300]" : "text-[#6B7280]"
                    }`}
                  >
                    {plan.target}
                  </span>
                  <h3 className="text-2xl font-bold mb-3">{plan.name}</h3>

                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-3xl md:text-4xl font-bold tracking-tight">
                      {plan.price}
                    </span>
                  </div>
                  <span
                    className={`text-xs ${
                      plan.isFeatured ? "text-white/60" : "text-[#6B7280]"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>

                {/* Features List */}
                <div
                  className={`pt-6 border-t ${
                    plan.isFeatured ? "border-white/10" : "border-black/5"
                  } mb-8`}
                >
                  <span
                    className={`text-xs font-bold uppercase tracking-wider block mb-4 ${
                      plan.isFeatured ? "text-white/80" : "text-brand-fg"
                    }`}
                  >
                    Coberturas y Servicios:
                  </span>
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs md:text-sm">
                        <Check
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            plan.isFeatured ? "text-[#FF8300]" : "text-emerald-600"
                          }`}
                        />
                        <span
                          className={
                            plan.isFeatured ? "text-white/90" : "text-[#4A4A4A]"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <Link
                  href="/cotizacion"
                  className={`w-full py-3.5 rounded-2xl font-semibold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    plan.isFeatured
                      ? "bg-[#FF8300] hover:bg-[#e07400] text-white shadow-lg hover:shadow-[0_0_25px_rgba(255,131,0,0.5)]"
                      : "bg-[#F7F8FA] hover:bg-black/5 text-brand-fg border border-black/5"
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
