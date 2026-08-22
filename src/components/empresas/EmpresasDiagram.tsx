"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function EmpresasDiagram() {
  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-light text-[#1F1F1F] tracking-tight leading-[1.1] max-w-3xl mx-auto">
            Solar, ESS y la red sincronizadas, minimizan el costo eléctrico.
          </h2>
        </motion.div>

        {/* Diagram Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[24px] overflow-hidden bg-[#F7F8FA] border border-black/5 shadow-sm"
        >
          {/* We use the commercial building image as a base for the diagram */}
          <Image
            src="/images/planta-solar-empresas-solderio.jpeg"
            alt="Diagrama Planta Solar Comercial"
            fill
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

          {/* Hotspots / Labels (Approximated positions based on generic commercial layout) */}
          
          {/* Generación Solar */}
          <div className="absolute top-[20%] left-[20%] md:top-[25%] md:left-[30%]">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-[#FF8300] text-white text-xs md:text-sm font-medium px-4 py-2 rounded-full shadow-lg whitespace-nowrap"
            >
              Generación Solar
            </motion.div>
          </div>

          {/* Optimizador de Panel (With Tooltip info) */}
          <div className="absolute top-[35%] left-[50%] md:top-[30%] md:left-[60%] group">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-white text-black text-xs md:text-sm font-medium px-4 py-2 rounded-full shadow-lg border border-black/5 whitespace-nowrap cursor-pointer flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#FF8300]" />
              Optimizador de Panel
            </motion.div>
            
            {/* Tooltip Content */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 md:w-80 bg-white rounded-xl shadow-xl border border-black/10 p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <h4 className="text-[10px] uppercase tracking-wider text-black/50 font-bold mb-2">Libera la máxima generación solar</h4>
              <p className="text-xs text-black/70 mb-3 leading-relaxed">
                Optimizamos la generación a nivel módulo para sacar el máximo potencial de techos comerciales e industriales. Así es el comportamiento con y sin optimizadores.
              </p>
              <div className="flex items-end justify-between gap-2 text-[10px] text-black/50 text-center">
                <div className="flex-1">
                  <div className="h-12 bg-[#F7F8FA] rounded mb-1 flex items-end justify-around pb-1">
                    <div className="w-2 bg-black/20 h-[85%]" />
                    <div className="w-2 bg-black/20 h-[90%]" />
                    <div className="w-2 bg-black/20 h-[90%]" />
                    <div className="w-2 bg-black/20 h-[90%]" />
                  </div>
                  <span>Sin Optimizador</span>
                </div>
                <div className="flex-1">
                  <div className="h-12 bg-[#F7F8FA] rounded mb-1 flex items-end justify-around pb-1">
                    <div className="w-2 bg-[#FF8300] h-[85%]" />
                    <div className="w-2 bg-[#FF8300] h-[100%]" />
                    <div className="w-2 bg-[#FF8300] h-[100%]" />
                    <div className="w-2 bg-[#FF8300] h-[100%]" />
                  </div>
                  <span className="text-[#FF8300] font-medium">Con Optimizador</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sala Eléctrica */}
          <div className="absolute top-[50%] left-[10%] md:top-[50%] md:left-[15%]">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="bg-white text-black text-xs md:text-sm font-medium px-4 py-2 rounded-full shadow-lg border border-black/5 whitespace-nowrap"
            >
              Sala Eléctrica
            </motion.div>
          </div>

          {/* ESS */}
          <div className="absolute top-[65%] left-[20%] md:top-[60%] md:left-[25%]">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="bg-white text-black text-xs md:text-sm font-medium px-4 py-2 rounded-full shadow-lg border border-black/5 whitespace-nowrap"
            >
              Energy Storage System - ESS
            </motion.div>
          </div>

          {/* Cargadores Rápidos */}
          <div className="absolute top-[75%] left-[45%] md:top-[70%] md:left-[50%]">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              className="bg-white text-black text-xs md:text-sm font-medium px-4 py-2 rounded-full shadow-lg border border-black/5 whitespace-nowrap flex items-center gap-2"
            >
              Cargadores Rápidos
              <span className="w-4 h-4 rounded-full bg-black/5 flex items-center justify-center text-[10px]">EV</span>
            </motion.div>
          </div>

          {/* Red */}
          <div className="absolute bottom-[10%] right-[10%] md:bottom-[15%] md:right-[20%]">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.0 }}
              className="bg-white text-black text-xs md:text-sm font-medium px-4 py-2 rounded-full shadow-lg border border-black/5 whitespace-nowrap flex items-center gap-2"
            >
              Red
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
