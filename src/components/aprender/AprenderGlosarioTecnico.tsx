"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, BookMarked, Cpu, Zap, Battery, ShieldCheck, Sun } from "lucide-react";

export function AprenderGlosarioTecnico() {
  const [searchTerm, setSearchTerm] = useState("");

  const terms = [
    {
      term: "Potencia (kW) vs Energía (kWh)",
      category: "Fundamentos",
      definition:
        "El Kilowatt (kW) es la potencia instantánea o 'capacidad máxima de generación' (como la velocidad máxima de un auto). El Kilowatt-hora (kWh) es la energía acumulada a lo largo del tiempo (como los kilómetros recorridos). Los paneles se dimensionan en kWp (potencia peak) y tu boleta te cobra en kWh (energía consumida).",
    },
    {
      term: "Celdas N-Type TOPCon / HJT",
      category: "Módulos Fotovoltaicos",
      definition:
        "La tecnología de silicio más moderna del mercado fotovoltaico. Tienen menor degradación térmica (<0.4% al año), capturan mayor radiación difusa en días nublados o con lluvia y tienen coeficiente bifacial (generan energía también por la cara posterior reflejada).",
    },
    {
      term: "Baterías LiFePO4 (Fosfato de Hierro y Litio)",
      category: "Almacenamiento BESS",
      definition:
        "Química de baterías de litio de máxima seguridad industrial. No sufren de embalamiento térmico ni riesgo de incendio (a diferencia de las baterías de litio tradicionales de autos o celulares), soportan más de 6.000 ciclos de descarga completa (+15 años) y toleran el frío del sur sin perder capacidad.",
    },
    {
      term: "Inversor Híbrido con Conmutación STS (<10ms)",
      category: "Electrónica de Potencia",
      definition:
        "Inversor inteligente que integra en un solo equipo la conversión solar, el cargador de baterías y un interruptor estático de transferencia (STS). Si la red pública se corta por un temporal, conmuta en menos de 10 milisegundos a modo batería, evitando que tus computadores, bombas o luces se apaguen.",
    },
    {
      term: "Seguimiento de Punto de Máxima Potencia (MPPT)",
      category: "Optimización",
      definition:
        "Algoritmo digital integrado en el inversor que rastrea continuamente el voltaje y corriente óptimos de los paneles para extraer la máxima cantidad de energía posible bajo cualquier nivel de radiación o temperatura ambiental.",
    },
    {
      term: "Protección Anti-Isla (RIC N°15 SEC)",
      category: "Normativa & Seguridad",
      definition:
        "Dispositivo de seguridad obligatorio por ley que desconecta la inyección de la planta solar a la red en microsegundos si se corta la luz pública, evitando electrocutar a los linieros de Saesa o Crell que reparan cables en la calle.",
    },
    {
      term: "Trámite SEC TE-1 y TE-4",
      category: "Certificación Legal",
      definition:
        "TE-1 es la declaración oficial de la instalación eléctrica interior ante la Superintendencia de Electricidad y Combustibles. TE-4 es el certificado específico que autoriza la inyección de excedentes solares a la red bajo la Ley Net Billing 21.118.",
    },
    {
      term: "Grado de Protección IP65 / IP66",
      category: "Resistencia Climática",
      definition:
        "Estándar internacional que certifica la estanqueidad de los inversores y cajas de protecciones contra el polvo fino y chorros de agua de lluvia intensa continua, garantizando su durabilidad en exteriores en el sur.",
    },
  ];

  const filteredTerms = terms.filter(
    (t) =>
      t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="glosario" className="bg-[#141414] py-20 md:py-32 relative text-white overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-[#FF8300]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="w-full px-3 md:px-5 box-border relative z-10">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <span className="text-xs md:text-sm font-light uppercase tracking-widest text-[#FF8300] mb-3 md:mb-4 block">
              Diccionario de Ingeniería Solar
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-6">
              Glosario Técnico Esencial
            </h2>
            <p className="text-white/70 text-base md:text-lg font-light leading-relaxed mb-8">
              Los conceptos clave que necesitas dominar para evaluar cotizaciones y entender las especificaciones técnicas de tu planta fotovoltaica.
            </p>

            {/* Search Input Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Buscar término (ej: LiFePO4, kW, MPPT, TE-4)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-sm font-light focus:outline-none focus:border-[#FF8300] focus:ring-1 focus:ring-[#FF8300] transition-all backdrop-blur-md"
              />
            </div>
          </motion.div>

          {/* Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTerms.map((item, idx) => (
              <div
                key={idx}
                className="p-7 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 hover:border-[#FF8300]/40 transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF8300] bg-[#FF8300]/10 px-3 py-1 rounded-full border border-[#FF8300]/20">
                      {item.category}
                    </span>
                    <BookMarked className="w-4 h-4 text-white/30 group-hover:text-[#FF8300] transition-colors" />
                  </div>

                  <h3 className="text-lg font-normal text-white mb-3 leading-snug">
                    {item.term}
                  </h3>

                  <p className="text-xs md:text-sm text-white/70 font-light leading-relaxed">
                    {item.definition}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-12 text-white/50 text-sm font-light">
              No se encontraron términos para "{searchTerm}". Prueba buscando por otra palabra clave.
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
