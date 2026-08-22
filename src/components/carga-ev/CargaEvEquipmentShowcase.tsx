"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck, Zap, Cpu, Award, Download, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SpecRow {
  label: string;
  s7k: string;
  s22k: string;
}

const SPECS_TABLE: SpecRow[] = [
  { label: "Potencia Nominal de Carga", s7k: "Hasta 7.4 kW (Ajustable 1.4 a 7.4 kW)", s22k: "Hasta 22 kW (3F) / 7.4 kW (1F)" },
  { label: "Tensión de Alimentación", s7k: "230 VAC (Monofásico) ± 20%", s22k: "400 VAC (Trifásico) / 230 VAC (1F)" },
  { label: "Corriente Nominal Máxima", s7k: "32 A (Ajustable desde 6 A)", s22k: "32 A por fase (Ajustable 6 A a 32 A)" },
  { label: "Conector de Salida", s7k: "Socket Tipo 2 (Mennekes) con obturador", s22k: "Socket Tipo 2 (Mennekes) con obturador" },
  { label: "Conmutación 1F / 3F Dinámica", s7k: "Monofásico Nativo", s22k: "Sí (Conmutación automática solar)" },
  { label: "Comunicación & Red", s7k: "WiFi (2.4 GHz), Ethernet RJ45, Bluetooth", s22k: "WiFi, Ethernet, Bluetooth, 4G opcional" },
  { label: "Protección Diferencial (RCD)", s7k: "Tipo A + DC 6 mA Integrado", s22k: "Tipo A + DC 6 mA Integrado" },
  { label: "Grado de Protección Ambiental", s7k: "IP54 (A prueba de intemperie y lluvia)", s22k: "IP54 (A prueba de intemperie y lluvia)" },
  { label: "Resistencia Mecánica al Impacto", s7k: "IK10", s22k: "IK10" },
  { label: "Dimensiones y Peso", s7k: "335 × 180 × 145 mm (3.0 kg)", s22k: "335 × 180 × 145 mm (3.1 kg)" },
  { label: "Certificación y Declaración SEC", s7k: "Declaración SEC TE-6 / RIC N°15", s22k: "Declaración SEC TE-6 / RIC N°15" },
  { label: "Garantía de Fábrica", s7k: "3 años extendible a 5 años", s22k: "3 años extendible a 5 años" },
];

export function CargaEvEquipmentShowcase() {
  const [activeTab, setActiveTab] = useState<"s7k" | "s22k">("s7k");

  return (
    <section id="specs" className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[#FF8300] mb-2 block">
          Catálogo Técnico & Modelos
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-fg tracking-tight">
          Huawei Smart Charger Series
        </h2>
        <p className="mt-4 text-sm md:text-base text-[#4A4A4A]">
          La tecnología de recarga más avanzada del mercado, diseñada para operar en perfecta sincronía con plantas fotovoltaicas residenciales y comerciales en Chile.
        </p>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Model 1: 7KS-S0 */}
        <div className="bg-white rounded-3xl p-8 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex flex-col justify-between relative overflow-hidden group hover:border-[#FF8300]/40 transition-all duration-300">
          <div className="absolute top-0 right-0 bg-[#FF8300]/10 text-[#FF8300] text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-bl-2xl">
            Residencial Monofásico
          </div>

          <div>
            <div className="text-xs font-semibold text-[#FF8300] uppercase tracking-wider mb-1">
              Model: SCharger-7KS-S0
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-brand-fg mb-3">
              Smart Charger 7.4 kW
            </h3>
            <p className="text-sm text-[#4A4A4A] mb-6 leading-relaxed">
              Ideal para casas, parcelas y clientes residenciales con empalme monofásico tradicional (25A a 40A). Carga inteligente, segura y compacta.
            </p>

            {/* Highlights bullet */}
            <div className="space-y-2.5 mb-8">
              <div className="flex items-center gap-2.5 text-xs text-brand-fg font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Hasta 7.4 kW (32A monofásico)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-brand-fg font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Prioridad solar desde 1.4 kW</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-brand-fg font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Protección diferencial RCD Tipo A + DC 6mA</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-brand-fg font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Montaje en muro o pedestal en 15 minutos</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-black/5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#6B7280] block">Declaración Eléctrica</span>
              <span className="text-xs font-bold text-brand-fg">SEC TE-6 Incluida</span>
            </div>
            <Link
              href="/cotizacion"
              className="inline-flex items-center gap-2 text-xs font-semibold bg-brand-fg text-white px-5 py-2.5 rounded-full hover:bg-[#FF8300] transition-colors"
            >
              <span>Cotizar 7.4 kW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Model 2: 22KT-S0 */}
        <div className="bg-white rounded-3xl p-8 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex flex-col justify-between relative overflow-hidden group hover:border-[#FF8300]/40 transition-all duration-300">
          <div className="absolute top-0 right-0 bg-[#1F1F1F] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-bl-2xl">
            Trifásico C&I / Residencial Premium
          </div>

          <div>
            <div className="text-xs font-semibold text-[#FF8300] uppercase tracking-wider mb-1">
              Model: SCharger-22KT-S0
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-brand-fg mb-3">
              Smart Charger 22 kW
            </h3>
            <p className="text-sm text-[#4A4A4A] mb-6 leading-relaxed">
              Máxima potencia para empresas, condominios, flotas corporativas y residencias con empalme trifásico. Incluye conmutación inteligente 1F/3F.
            </p>

            {/* Highlights bullet */}
            <div className="space-y-2.5 mb-8">
              <div className="flex items-center gap-2.5 text-xs text-brand-fg font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Hasta 22 kW (32A trifásico) / 7.4 kW monofásico</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-brand-fg font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Conmutación dinámica 1F a 3F para maximizar solar</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-brand-fg font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Monitoreo multi-usuario con autorización por App</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-brand-fg font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Conectividad avanzada WiFi, Ethernet y 4G</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-black/5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#6B7280] block">Declaración Eléctrica</span>
              <span className="text-xs font-bold text-brand-fg">SEC TE-6 Incluida</span>
            </div>
            <Link
              href="/cotizacion"
              className="inline-flex items-center gap-2 text-xs font-semibold bg-[#FF8300] text-white px-5 py-2.5 rounded-full hover:bg-[#e07400] transition-colors shadow-sm"
            >
              <span>Cotizar 22 kW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Full Technical Comparison Table */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-black/10 shadow-[0_15px_40px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="flex items-center justify-between pb-6 border-b border-black/5 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-black/5 text-brand-fg">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-brand-fg">
              Ficha Técnica Comparativa
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <Award className="w-4 h-4 text-[#FF8300]" />
            <span>Red Dot Winner Design 2023</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-black/10 text-[#6B7280]">
                <th className="py-3 px-4 font-semibold">Parámetro Técnico</th>
                <th className="py-3 px-4 font-semibold text-brand-fg bg-[#F7F8FA] rounded-t-xl">SCharger-7KS-S0 (7.4 kW)</th>
                <th className="py-3 px-4 font-semibold text-[#FF8300] bg-[#FF8300]/5 rounded-t-xl">SCharger-22KT-S0 (22 kW)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {SPECS_TABLE.map((row, idx) => (
                <tr key={idx} className="hover:bg-black/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-medium text-brand-fg">{row.label}</td>
                  <td className="py-3.5 px-4 text-[#4A4A4A] bg-[#F7F8FA]/50">{row.s7k}</td>
                  <td className="py-3.5 px-4 text-[#4A4A4A] bg-[#FF8300]/[0.02] font-medium">{row.s22k}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
