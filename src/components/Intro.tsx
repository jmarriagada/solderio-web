"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function Intro() {
  return (
    <section className="bg-transparent py-10 md:py-16 flex flex-col items-center overflow-hidden">
      {/* Image Container with Parallax Zoom and rounded corners */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="w-full px-3 md:px-5 box-border"
      >
        <div className="relative w-full h-[40vh] min-h-[300px] md:h-[54vh] max-w-[1400px] mx-auto rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl border border-black/10 group">
          <Image
            src="/images/solar-panels-empresas-sur-chile.jpg"
            alt="SoldeRío Solar Panels Empresas Sur de Chile"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1400px"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-1000"
          />
        </div>
      </motion.div>
    </section>
  );
}
