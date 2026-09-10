"use client";

import { motion } from "framer-motion";
import { Shield, Layers, Flame, FileCheck, Check } from "lucide-react";

const SAFETY_PILLARS = [
  {
    icon: Shield,
    title: "Química Intrínsecamente Segura LiFePO4",
    subtitle: "Estabilidad Térmica hasta 270 °C",
    description:
      "A diferencia de las baterías de ion-litio convencionales (NMC/NCA) que entran en fuga térmica a los 150 °C, las celdas de Litio Ferro-Fosfato (LiFePO4) poseen una estructura de enlace fosfato covalente ultra-estable que no libera oxígeno gaseoso en caso de cortocircuito, eliminando el riesgo de explosión.",
    bullets: [
      "Celdas prismáticas Grado A de fabricantes Tier-1",
      "Más de 6.000 ciclos al 90% de profundidad de descarga (DoD)",
      "Química no tóxica y 100% reciclable bajo directivas RoHS",
    ],
  },
  {
    icon: Layers,
    title: "BMS Jerárquico de 3 Niveles",
    subtitle: "Monitoreo en Tiempo Real <15ms",
    description:
      "Arquitectura de control de baterías en tres capas independientes: supervisión individual de cada celda, balanceo activo de energía por rack y controlador maestro central con desconexión física por contactores DC de alta velocidad ante cualquier desviación milivoltimétrica.",
    bullets: [
      "Nivel 1 (BMU): Voltaje, temperatura y balanceo celda a celda",
      "Nivel 2 (BCU): Protección contra sobrecorriente y cortocircuito en rack",
      "Nivel 3 (BAU): Telemetría SCADA con Modbus TCP, RTU y MQTT",
    ],
  },
  {
    icon: Flame,
    title: "Protección Contra Incendios NFPA 855",
    subtitle: "Detección Off-Gas & Supresión Stat-X",
    description:
      "Contenedores industriales equipados con detectores avanzados de desgasificación previa al conato de humo (detección de H2 y CO). El sistema de extinción por aerosol condensado o agente limpio Novec inunda el gabinete en segundos sin dañar los componentes electrónicos ni dejar residuos.",
    bullets: [
      "Certificación internacional UL 9540 y UL 9540A",
      "HVAC de ciclo cerrado con control estricto (23 °C ± 2 °C)",
      "Aislamiento térmico y deshumidificación para el clima húmedo del sur",
    ],
  },
  {
    icon: FileCheck,
    title: "Cumplimiento Normativo SEC en Chile",
    subtitle: "Pliegos RIC N°09, RIC N°15 y TE-4",
    description:
      "Toda instalación BESS de SoldeRío se diseña, canaliza y certifica bajo la normativa eléctrica chilena vigente, asegurando una conexión legal expedita ante Saesa, Crell o CGE y la emisión de los certificados oficiales de la Superintendencia de Electricidad y Combustibles.",
    bullets: [
      "Pliego RIC N°09: Sistemas de autogeneración y almacenamiento",
      "Pliego RIC N°15: Protecciones anti-isla y conmutación segura",
      "Tramitación integral SEC TE-1 y TE-4 por Ingenieros Clase A",
    ],
  },
];

export function BessSafetySpecs() {
  return (
    <section className="w-full py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#141414] text-white relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 right-1/4 w-[750px] h-[450px] bg-[#FF8300]/10 rounded-full blur-[190px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-light tracking-tight leading-[1.15] mb-5 text-white">
            Seguridad Industrial &amp; Battery Management System Jerárquico
          </h2>
          <p className="text-base md:text-lg text-white/70 font-light leading-relaxed">
            Cero tolerancia a riesgos operativos: protección activa multicapa, supresión de incendios por aerosol y cumplimiento de los Pliegos Técnicos RIC N°09 y N°15.
          </p>
        </motion.div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAFETY_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#1A1A1A] rounded-[24px] border border-white/10 hover:border-[#FF8300]/30 p-6 md:p-8 flex flex-col justify-between transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#FF8300]/15 border border-[#FF8300]/25 flex items-center justify-center text-[#FF8300] group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF8300] block">
                        {pillar.subtitle}
                      </span>
                      <h3 className="text-lg md:text-xl font-medium text-white tracking-tight">
                        {pillar.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-white/70 font-light leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-white/10">
                  {pillar.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2.5 text-xs text-white/80 font-light">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
