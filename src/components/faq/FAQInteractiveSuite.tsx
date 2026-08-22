"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Minus, HelpCircle, CheckCircle2, ChevronDown } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
  category: "hogar" | "empresas" | "baterias" | "sec" | "netbilling";
}

const FAQS_DATA: FAQItem[] = [
  {
    category: "hogar",
    q: "¿Qué pasa con la generación solar durante el invierno y los días de lluvia en el sur?",
    a: "Nuestros módulos solares N-Type TOPCon bifaciales capturan radiación difusa incluso bajo nubosidad espesa o lluvia moderada, generando entre un 20% y 35% de su capacidad nominal. El dimensionamiento anual que calculamos contempla la estacionalidad del sur, logrando que el superávit de verano compense el consumo invernal.",
  },
  {
    category: "hogar",
    q: "¿Una planta On-Grid me protege de los cortes de luz?",
    a: "No. Por normativa de seguridad de la SEC (RIC N°15 Protección Anti-Isla), las plantas On-Grid puras deben apagarse instantáneamente ante un corte de la red para no energizar los postes de la calle y evitar accidentes con los cuadrilleros. Para tener electricidad continua durante cortes necesitas una Planta Solar Híbrida con banco de baterías LiFePO4.",
  },
  {
    category: "baterias",
    q: "¿Qué es el tiempo de conmutación <10ms en sistemas híbridos?",
    a: "Es la velocidad con la que el interruptor estático de transferencia (STS) del inversor híbrido detecta un corte en la red de Saesa/Crell y conmuta al modo batería. Al ser menor a 10 milisegundos (más rápido que un parpadeo humano), tus computadores, servidores, bombas de agua y refrigeradores siguen funcionando sin reiniciar.",
  },
  {
    category: "baterias",
    q: "¿Son seguras las baterías de litio LiFePO4 dentro de una casa?",
    a: "100% seguras. A diferencia de las baterías de iones de litio tradicionales (NMC/LCO) usadas en autos y celulares, la química LiFePO4 (Fosfato de Hierro y Litio) tiene estabilidad química extrema, cero riesgo de embalamiento térmico o fuego, no emite gases tóxicos y resiste las bajas temperaturas del invierno.",
  },
  {
    category: "netbilling",
    q: "¿Cómo me paga la distribuidora por la energía que inyecto a la red?",
    a: "Bajo la Ley Net Billing 21.118, cada kWh que tus paneles inyectan a la red pública es medido por tu medidor bidireccional y valorizado al precio de compra de energía establecido por la Comisión Nacional de Energía (CNE). La distribuidora te lo descuenta directamente como saldo a favor en tu boleta mensual.",
  },
  {
    category: "netbilling",
    q: "¿Qué pasa si mis inyecciones superan lo que consumo en el mes?",
    a: "Tu boleta llegará con costo $0 y el saldo monetario sobrante se acumula para los meses siguientes (ideal para gastarlo en invierno). Si al término del periodo de liquidación anual mantienes saldo a favor, la distribuidora está obligada por ley a depositarte el dinero en tu cuenta bancaria.",
  },
  {
    category: "sec",
    q: "¿SoldeRío se encarga de los trámites y permisos ante la SEC?",
    a: "Sí, en el 100% de los proyectos. Nuestro equipo incluye Ingenieros Eléctricos certificados SEC Clase A. Gestionamos la solicitud de conexión F1, respuesta F3 de la distribuidora, declaración de instalación interior TE-1, certificado de inyección TE-4 y certificación de cargadores de vehículos eléctricos TE-6.",
  },
  {
    category: "sec",
    q: "¿Qué riesgo tiene instalar paneles solares sin declaración SEC?",
    a: "Instalar sin certificación SEC es ilegal bajo la normativa eléctrica chilena. Arriesgas multas graves de la SEC, la distribuidora puede cortar el suministro o retirar el medidor por riesgo de electrocución, y las aseguradoras rechazan el 100% de los siniestros por incendio o daño climático.",
  },
  {
    category: "empresas",
    q: "¿Cómo funciona la depreciación instantánea del 100% para empresas?",
    a: "Bajo la Ley de Modernización Tributaria, las empresas de Primera Categoría pueden rebajar el 100% de la inversión en paneles solares como gasto tributario en el mismo año fiscal de compra, ahorrando hasta un 27% en el pago del Impuesto de Primera Categoría, además de recuperar el 19% de IVA como crédito fiscal.",
  },
  {
    category: "empresas",
    q: "¿Cuánto demora la instalación de una planta solar llave en mano?",
    a: "Para plantas residenciales (3 a 10 kWp), el montaje mecánico y eléctrico toma entre 2 y 4 días en terreno. Para plantas comerciales (20 a 100+ kWp), toma de 1 a 3 semanas. La tramitación y cambio de medidor con la distribuidora suele tomar de 15 a 30 días hábiles.",
  },
];

export function FAQInteractiveSuite() {
  const [activeCategory, setActiveCategory] = useState<string>("todas");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIndices, setOpenIndices] = useState<Record<number, boolean>>({ 0: true, 2: true });

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const categories = [
    { id: "todas", label: "Todas las Preguntas" },
    { id: "hogar", label: "Hogar & Parcelas" },
    { id: "baterias", label: "Baterías & Respaldo" },
    { id: "netbilling", label: "Ley Net Billing" },
    { id: "sec", label: "Normativa SEC" },
    { id: "empresas", label: "Empresas & C&I" },
  ];

  const filteredFaqs = FAQS_DATA.filter((item) => {
    const matchesCategory = activeCategory === "todas" || item.category === activeCategory;
    const matchesSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="bg-transparent py-20 md:py-32 relative overflow-hidden">
      <div className="w-full px-3 md:px-5 box-border">
        <div className="max-w-4xl mx-auto">
          
          {/* Search Bar */}
          <div className="mb-10">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Busca por palabra clave (ej: corte de luz, Saesa, SEC, batería)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-13 pr-5 py-4 rounded-full bg-white border border-black/10 text-[#1F1F1F] placeholder:text-[#6B7280] text-sm font-light shadow-md focus:outline-none focus:border-[#FF8300] focus:ring-2 focus:ring-[#FF8300]/20 transition-all"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-xs md:text-sm font-light transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#FF8300] text-white shadow-md font-normal"
                    : "bg-[#F7F8FA] border border-black/5 text-[#6B7280] hover:text-black hover:bg-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Accordions List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = !!openIndices[idx];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-[20px] bg-[#F7F8FA] border border-black/5 overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => toggleIndex(idx)}
                    className="w-full p-6 md:p-7 text-left flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <h3 className="text-base md:text-lg font-normal text-[#1F1F1F] leading-snug">
                      {faq.q}
                    </h3>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isOpen
                          ? "bg-[#FF8300] text-white rotate-45"
                          : "bg-black/5 text-[#6B7280]"
                      }`}
                    >
                      <Plus className="w-4 h-4 stroke-[2]" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 md:px-7 pb-6 pt-1 text-[#6B7280] text-sm md:text-base font-light leading-relaxed border-t border-black/5">
                          <p>{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-16 bg-[#F7F8FA] rounded-2xl border border-black/5">
              <p className="text-[#6B7280] text-sm font-light mb-4">
                No encontramos respuestas para "{searchQuery}".
              </p>
              <a
                href="https://wa.me/56987654321"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FF8300] text-white text-xs font-light hover:bg-[#e07400] transition-all shadow-sm"
              >
                <span>Preguntarle a un Ingeniero por WhatsApp</span>
              </a>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
