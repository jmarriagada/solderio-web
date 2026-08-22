"use client";

import { motion } from "framer-motion";
import { 
  Wind, 
  CloudRain, 
  Flame, 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  ZapOff 
} from "lucide-react";

export function SegurosCoverages() {
  const coverages = [
    {
      icon: Wind,
      title: "Temporales y Vientos Huracanados",
      desc: "Cobertura contra desprendimiento o daño estructural por rachas de viento sobre 100-140 km/h comunes en las regiones de Los Ríos, Los Lagos y La Araucanía.",
      tag: "Clima del Sur",
    },
    {
      icon: CloudRain,
      title: "Caída de Árboles, Ramas y Granizo",
      desc: "Protección integral ante impactos mecánicos por caída de ramas en parcelas boscosas y granizadas intensas de invierno que puedan comprometer los vidrios templados de los paneles.",
      tag: "Impacto Físico",
    },
    {
      icon: Flame,
      title: "Incendio, Rayos y Sobretensiones",
      desc: "Respaldo ante descargas atmosféricas (rayos), sobretensiones transitorias de la red eléctrica o siniestros por incendio accidental en la propiedad.",
      tag: "Eléctrico & Térmico",
    },
    {
      icon: ShieldAlert,
      title: "Sismos y Terremotos",
      desc: "Cobertura total contra fallas estructurales o desprendimientos causados por eventos sísmicos en territorio chileno, protegiendo tanto cubiertas como anclajes en suelo.",
      tag: "Riesgo Sísmico",
    },
    {
      icon: Lock,
      title: "Robo, Hurto y Vandalismo",
      desc: "Indemnización ante sustracción de módulos solares, inversores, baterías LiFePO4 o cableado de cobre en predios residenciales, comerciales o industriales.",
      tag: "Seguridad Patrimonial",
    },
    {
      icon: ZapOff,
      title: "Fallas Eléctricas Internas",
      desc: "Cobertura complementaria a las garantías de fábrica de 25 años para reposición de equipamiento dañado por fluctuaciones severas de voltaje.",
      tag: "Continuidad",
    },
  ];

  return (
    <section id="coberturas" className="bg-transparent py-20 md:py-32 relative overflow-hidden">
      <div className="w-full px-3 md:px-5 box-border">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-xs md:text-sm font-light uppercase tracking-widest text-[#FF8300] mb-3 md:mb-4 block">
              Pólizas Disponibles en Chile
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight mb-6">
              Coberturas para Plantas Solares
            </h2>
            <p className="text-brand-muted text-base md:text-lg font-light leading-relaxed">
              Las principales compañías aseguradoras de Chile (SURA, BCI Seguros, Mapfre, HDI, Liberty) aseguran plantas fotovoltaicas residenciales y comerciales siempre que cuenten con certificación SEC.
            </p>
          </motion.div>

          {/* 6 Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {coverages.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-[24px] bg-[#F7F8FA] border border-black/5 hover:border-[#FF8300]/40 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#FF8300]/10 text-[#FF8300] flex items-center justify-center transition-transform group-hover:scale-110">
                        <Icon className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <span className="text-[10px] font-mono text-[#6B7280] bg-white px-2.5 py-1 rounded-full border border-black/5">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-normal text-[#1F1F1F] mb-3">
                      {item.title}
                    </h3>

                    <p className="text-sm text-[#6B7280] font-light leading-relaxed mb-6">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-black/5 flex items-center gap-2 text-xs text-emerald-600 font-light">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Asegurable bajo póliza de hogar o empresa</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
