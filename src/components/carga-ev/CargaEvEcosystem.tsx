"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sun, Cpu, BatteryCharging, Zap, Smartphone, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CargaEvEcosystem() {
  const steps = [
    {
      step: "01",
      icon: Sun,
      title: "Generación Solar Fotovoltaica",
      subtitle: "Módulos Tier 1",
      description: "Tus paneles capturan la radiación solar e inyectan energía limpia en corriente continua (DC).",
    },
    {
      step: "02",
      icon: Cpu,
      title: "Inversor Inteligente Híbrido",
      subtitle: "Huawei SUN2000",
      description: "Gestiona y distribuye el flujo de potencia en milisegundos hacia el consumo inmediato, batería o auto.",
    },
    {
      step: "03",
      icon: BatteryCharging,
      title: "Almacenamiento en Litio",
      subtitle: "LUNA2000 ESS",
      description: "Guarda excedentes para respaldar el hogar o recargar tu vehículo durante la noche.",
    },
    {
      step: "04",
      icon: Zap,
      title: "Smart EV Charger",
      subtitle: "SCharger 7.4 kW / 22 kW",
      description: "Carga dinámica con prioridad solar y balanceo anti-sobrecargas en el empalme.",
    },
    {
      step: "05",
      icon: Smartphone,
      title: "Monitoreo y Control Digital",
      subtitle: "App 24/7",
      description: "Visualiza la telemetría en vivo, programa horarios de carga y gestiona permisos de acceso.",
    },
  ];

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[#FF8300] mb-2 block">
          Solución Energética Integral
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-fg tracking-tight">
          El Ecosistema Solar Completo
        </h2>
        <p className="mt-4 text-sm md:text-base text-[#4A4A4A]">
          Una arquitectura unificada donde cada equipo conversa en el mismo protocolo digital para maximizar tu ahorro, confort e independencia.
        </p>
      </div>

      {/* Interactive Process Flow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-6 border border-black/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-[#FF8300]/40"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#FF8300] bg-[#FF8300]/10 px-2.5 py-1 rounded-full">
                    {item.step}
                  </span>
                  <div className="p-2 rounded-xl bg-black/5 text-brand-fg group-hover:bg-[#FF8300] group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-brand-fg mb-1">
                  {item.title}
                </h3>
                <span className="text-xs font-medium text-[#FF8300] block mb-3">
                  {item.subtitle}
                </span>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Featured Banner */}
      <div className="bg-[#F7F8FA] rounded-3xl p-6 md:p-10 border border-black/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h3 className="text-xl md:text-2xl font-bold text-brand-fg mb-2">
            ¿Ya tienes paneles solares instalados?
          </h3>
          <p className="text-xs md:text-sm text-[#4A4A4A]">
            El Smart Charger puede integrarse a tu planta solar existente o a cualquier empalme eléctrico residencial o comercial con tramitación SEC TE-6.
          </p>
        </div>
        <Link
          href="/cotizacion"
          className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold bg-brand-fg text-white px-7 py-3 rounded-full hover:bg-[#FF8300] transition-colors flex-shrink-0"
        >
          <span>Evaluar Compatibilidad</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
