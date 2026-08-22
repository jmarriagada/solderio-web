"use client";

import { motion } from "framer-motion";
import { Building2, ShieldCheck, TrendingDown, Clock, CheckCircle2 } from "lucide-react";

export function SegurosLucroCesante() {
  return (
    <section className="bg-[#141414] py-20 md:py-32 relative text-white overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[350px] bg-[#FF8300]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full px-3 md:px-5 box-border relative z-10">
        <div className="max-w-[1400px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7">
              <span className="text-xs md:text-sm font-light uppercase tracking-widest text-[#FF8300] mb-3 md:mb-4 block">
                Para Empresas & Plantas C&I
              </span>
              <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-6 leading-tight">
                Pólizas de Lucro Cesante & Interrupción de Negocio
              </h2>
              <p className="text-white/70 text-base md:text-lg font-light leading-relaxed mb-6">
                Para industrias lácteas, packing frutícolas, hoteles, pisciculturas y comercios del sur, una detención prolongada en la generación solar no solo implica reparar equipos, sino comprar energía cara a la distribuidora.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-[#FF8300]/20 text-[#FF8300] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Indemnización por Energía No Generada</h4>
                    <p className="text-xs text-white/60 font-light">La aseguradora cubre el diferencial en dinero de la electricidad que tuviste que comprar a la red durante la reparación.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Reemplazo Rápido de Inversores & Baterías</h4>
                    <p className="text-xs text-white/60 font-light">Fondos directos para la reposición urgente de componentes críticos por nuestro equipo técnico oficial de SoldeRío.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Pólizas Homologadas SEC</h4>
                    <p className="text-xs text-white/60 font-light">Todas las pólizas exigen el certificado SEC TE-1 entregado por SoldeRío como requisito sine qua non para el pago expedito de siniestros.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card / Requisite Box (5 cols) */}
            <div className="lg:col-span-5 bg-[#1F1F1F] p-8 md:p-10 rounded-[28px] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-8 h-8 text-[#FF8300]" />
                <div>
                  <h3 className="text-lg font-normal text-white">El Rol de la Certificación SEC</h3>
                  <span className="text-xs text-white/50 font-light">Requisito legal de aseguradoras</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 mb-6 text-xs text-white/70 leading-relaxed font-light">
                <p className="mb-2">
                  <strong className="text-white">Dato Clave:</strong> Las aseguradoras en Chile rechazan siniestros si la planta solar fue instalada de manera informal sin declaración TE-1 ante la SEC.
                </p>
                <p>
                  Al construir con SoldeRío, cada proyecto incluye carpeta técnica completa, planos as-built, memoria de cálculo de viento y protocolo de pruebas eléctricas legalmente firmado por Ingeniero SEC Clase A.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs font-mono text-white/80">
                <span>Inspección O&M Preventiva:</span>
                <span className="text-emerald-400">Incluida 1er Año</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
