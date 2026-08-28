"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function HogarResilienceImage() {
  return (
    <section className="bg-transparent py-10 md:py-16 flex flex-col items-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="w-full px-3 md:px-5 box-border"
      >
        <div className="relative w-full h-[40vh] min-h-[320px] md:h-[54vh] max-h-[600px] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl border border-black/10 group">
          <Image
            src="/images/cortes-electricos-solderio.png"
            alt="SoldeRío Resiliencia Eléctrica en el Sur"
            fill
            priority
            unoptimized
            quality={100}
            sizes="(max-width: 1400px) 100vw, 1400px"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-1000"
          />
        </div>
      </motion.div>
    </section>
  );
}
