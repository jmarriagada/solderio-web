"use client";

import { motion } from "framer-motion";
import { Sun, Cpu, BatteryCharging, Smartphone, Check } from "lucide-react";

export function PorqueSolarTechEcosystem() {
  const components = [
    {
      icon: Sun,
      title: "1. Módulos Tier 1 N-Type TOPCon",
      badge: "Captación Solar",
      specs: ["Eficiencia 22.5%+", "Garantía de generación 25 años", "Alto rendimiento en radiación difusa"],
      desc: "Paneles de última generación que convierten la luz solar en electricidad continua con máxima durabilidad mecánica.",
    },
    {
      icon: Cpu,
      title: "2. Inversor Híbrido Inteligente",
      badge: "Conversión & Control",
      specs: ["Eficiencia 98.6%", "Doble seguidor MPPT", "Protección AFCI por arco eléctrico"],
      desc: "El cerebro del sistema: transforma la corriente continua (DC) en alterna (AC) para el consumo instantáneo de tu hogar o empresa.",
    },
    {
      icon: BatteryCharging,
      title: "3. Batería de Litio LiFePO4 (Opcional)",
      badge: "Almacenamiento & Backup",
      specs: ["Química segura de litio ferrofosfato", "6.000+ ciclos de vida útil", "Respaldo automático ante cortes"],
      desc: "Almacena los excedentes diurnos para alimentar tu hogar durante la noche o actuar como generador silencioso ante emergencias.",
    },
    {
      icon: Smartphone,
      title: "4. App de Telemetría 24/7",
      badge: "Monitoreo en Vivo",
      specs: ["Monitoreo en tiempo real desde el celular", "Alertas y diagnóstico predictivo", "Historial de inyecciones y ahorro CLP"],
      desc: "Control total en la palma de tu mano: visualiza cuánto estás generando, cuánto autoconsumes y cuánto dinero ahorras a diario.",
    },
  ];

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[#FF8300] mb-2 block">
          Arquitectura del Sistema
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-fg tracking-tight">
          El Ecosistema Solar de SoldeRío
        </h2>
        <p className="mt-4 text-sm md:text-base text-[#4A4A4A]">
          Cuatro componentes de alta ingeniería perfectamente sincronizados para garantizarte energía ininterrumpida.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {components.map((comp, idx) => {
          const Icon = comp.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between group hover:border-[#FF8300]/40 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-[#FF8300]/10 text-[#FF8300]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#FF8300] bg-[#FF8300]/10 px-2.5 py-0.5 rounded-full">
                    {comp.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-brand-fg mb-2">
                  {comp.title}
                </h3>
                <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
                  {comp.desc}
                </p>

                <ul className="space-y-1.5 border-t border-black/5 pt-3">
                  {comp.specs.map((spec, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-1.5 text-[11px] text-brand-fg">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
