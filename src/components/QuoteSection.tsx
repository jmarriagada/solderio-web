"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Edit3 } from "lucide-react";

export function QuoteSection() {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 State
  const [selectedSystem, setSelectedSystem] = useState<"hibrida" | "ongrid" | "offgrid">("hibrida");
  const [address, setAddress] = useState("");
  const [monthlyBill, setMonthlyBill] = useState("");
  const [useKwh, setUseKwh] = useState(false);

  // Step 2 Contact State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [phone, setPhone] = useState("");

  const systems = [
    {
      id: "hibrida",
      title: "Planta Solar Híbrida",
      tag: "(recomendada)",
      description: "Genera, consume, almacena y vende energía",
    },
    {
      id: "ongrid",
      title: "Planta Solar Ongrid",
      tag: "(inicio económico)",
      description: "Genera, consume y vende energía",
    },
    {
      id: "offgrid",
      title: "Planta Solar Offgrid",
      tag: "(sin red eléctrica)",
      description: "Genera, consume y almacena energía",
    },
  ];

  // Validation Step 1
  const isStep1Valid = Boolean(
    selectedSystem &&
    address.trim().length >= 3 &&
    monthlyBill.trim().length >= 1
  );

  // Validation Step 2
  const isStep2Valid = Boolean(
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    email.trim().length >= 5 &&
    confirmEmail.trim() === email.trim() &&
    phone.trim().length >= 7
  );

  return (
    <section className="w-full h-full px-6 md:px-8 box-border">
      <div className="w-full h-full flex flex-col lg:flex-row gap-5 md:gap-6 items-stretch">
        {/* Left Column: Fixed Roof / Aerial Solar Image Frame (68% Width) */}
        <div className="w-full lg:w-[calc(68%-0.75rem)] flex-none h-[320px] sm:h-[400px] lg:h-full">
          <div className="relative w-full h-full rounded-[24px] md:rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src={
                step === 1
                  ? "/images/solar-panels-row-top-roof.jpg"
                  : "/images/solderio-planta-solar-residencial-osorno.png"
              }
              alt="Paneles Solares SoldeRío"
              fill
              priority
              className="object-cover object-center transition-all duration-700"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
          </div>
        </div>

        {/* Right Column: Independently Scrollable Form Container (32% Width) */}
        <div className="w-full lg:w-[calc(32%-0.75rem)] flex-none h-full">
          <div
            className="bg-[#151515]/95 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-[24px] md:rounded-[32px] shadow-2xl flex flex-col justify-between h-full overflow-y-auto scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* STEP 1: INITIAL SYSTEM SELECTION & PROPERTY DETAILS */}
            {step === 1 && (
              <div className="flex flex-col justify-between h-full">
                <div>
                  {/* Header Title */}
                  <h1 className="text-2xl md:text-3xl font-light text-white mb-1.5 tracking-tight">
                    Tu sistema solar
                  </h1>
                  <p className="text-[#9CA3AF] text-base md:text-base font-light mb-6 leading-relaxed">
                    Ahorra hasta 90% al mes en tu boleta eléctrica con energía solar.
                  </p>

                  {/* System Selector Cards */}
                  <div className="flex flex-col gap-3 mb-6">
                    {systems.map((sys) => {
                      const isSelected = selectedSystem === sys.id;
                      return (
                        <button
                          key={sys.id}
                          type="button"
                          onClick={() => setSelectedSystem(sys.id as any)}
                          className={`w-full text-left p-4 rounded-[12px] transition-all cursor-pointer border ${isSelected
                            ? "bg-white text-black border-white shadow-lg"
                            : "bg-[#222222]/80 border-white/10 text-white hover:bg-[#2a2a2a]"
                            }`}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-lg font-medium tracking-tight">
                              {sys.title}{" "}
                              <span
                                className={`text-sm font-normal ${isSelected ? "text-black/70" : "text-[#9CA3AF]"
                                  }`}
                              >
                                {sys.tag}
                              </span>
                            </span>
                          </div>
                          <p
                            className={`text-base font-light ${isSelected ? "text-black/80" : "text-[#9CA3AF]"
                              }`}
                          >
                            {sys.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Property Details Sub-section */}
                  <div className="pt-2">
                    <h2 className="text-base md:text-lg font-light text-white mb-1 tracking-tight">
                      Detalles de la propiedad
                    </h2>
                    <p className="text-[#9CA3AF] text-base font-light mb-5 leading-relaxed">
                      Ingresa tu dirección y consumo eléctrico mensual para obtener un presupuesto inicial y ver tus ahorros personalizados.
                    </p>

                    {/* Property Address Input */}
                    <div className="mb-4">
                      <label className="text-sm text-[#9CA3AF] mb-1.5 block font-light">
                        Dirección de la propiedad
                      </label>
                      <div className="relative flex items-center bg-[#242424] border border-white/10 rounded-[10px] px-4 py-3 focus-within:border-[#FF8300] transition-colors">
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="El Arenal 41, Valdivia"
                          className="bg-transparent w-full text-base text-white placeholder-[#666] outline-none font-light pr-8"
                        />
                        <MapPin className="w-4 h-4 text-[#9CA3AF] shrink-0 absolute right-4 pointer-events-none" />
                      </div>
                    </div>

                    {/* Monthly Electric Bill Input */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm text-[#9CA3AF] font-light">
                          {useKwh ? "Consumo mensual en kWh" : "Valor mensual de tu boleta"}
                        </label>
                        <button
                          type="button"
                          onClick={() => setUseKwh(!useKwh)}
                          className="text-sm text-[#FF8300] hover:underline font-light cursor-pointer"
                        >
                          {useKwh ? "ingresar $" : "ingresar kWh"}
                        </button>
                      </div>
                      <div className="relative flex items-center bg-[#242424] border border-white/10 rounded-[10px] px-4 py-3 focus-within:border-[#FF8300] transition-colors">
                        {!useKwh && <span className="text-sm text-[#9CA3AF] mr-2 font-light">$</span>}
                        <input
                          type="text"
                          value={monthlyBill}
                          onChange={(e) => setMonthlyBill(e.target.value)}
                          placeholder={useKwh ? "Ej: 250" : ""}
                          className="bg-transparent w-full text-base text-white placeholder-[#666] outline-none font-light"
                        />
                        <span className="text-sm text-[#9CA3AF] font-light ml-2 shrink-0">
                          {useKwh ? "kWh/mes" : "/mes"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 1 Action Button */}
                <button
                  type="button"
                  disabled={!isStep1Valid}
                  onClick={() => setStep(2)}
                  className={`w-full py-3.5 rounded-[12px] text-base tracking-wide font-normal transition-all text-center mt-4 shrink-0 ${isStep1Valid
                    ? "bg-[#FF8300] text-white shadow-lg cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    : "bg-[#FF8300]/25 text-white/40 cursor-not-allowed border border-[#FF8300]/20"
                    }`}
                >
                  Ver Sistema Recomendado
                </button>
              </div>
            )}

            {/* STEP 2: RESERVA TU PLANTA SOLAR & CONTACT DETAILS */}
            {step === 2 && (
              <div className="flex flex-col justify-between h-full">
                <div>
                  {/* Header Title */}
                  <h1 className="text-2xl md:text-3xl font-light text-white mb-1.5 tracking-tight">
                    Reserva tu planta solar
                  </h1>
                  <p className="text-[#9CA3AF] text-lg md:text-lg font-light mb-6 leading-relaxed">
                    El alza de energía disparó la cantidad de proyectos, comienza tu proceso pronto.
                  </p>

                  {/* Recommendation White Card Banner */}
                  <div className="bg-white text-black p-4 md:p-5 rounded-[12px] shadow-lg mb-6 border border-white">
                    <span className="text-[10px] tracking-widest text-[#FF8300] uppercase font-semibold mb-1 block">
                      RECOMENDACIÓN
                    </span>
                    <h3 className="text-2xl md:text-2xl font-bold text-black mb-1">
                      4,20kW Solar + 7kWh (1 batería)
                    </h3>
                    <p className="text-base text-black/80 font-light leading-snug mb-3">
                      Producirás 2,3x veces mas energía que tu consumo actual + 2 días en respaldo eléctrico
                    </p>
                    <p className="text-sm text-black/50 font-light italic border-t border-black/10 pt-2">
                      Tamaño estimado del sistema en función del consumo eléctrico declarado.
                    </p>
                  </div>

                  {/* Installation Address Review */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-base md:text-base font-light text-white tracking-tight">
                        Dirección de instalación
                      </h3>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-[#FF8300] hover:text-white transition-colors p-1"
                        title="Editar dirección"
                      >
                        <Edit3 className="w-4 h-4 stroke-[1.5]" />
                      </button>
                    </div>
                    <div className="text-sm text-[#9CA3AF] font-light leading-relaxed">
                      <p>{address || "El Arenal, 41, Valdivia"}</p>
                      <p>Región de los Ríos</p>
                      <p>Chile</p>
                    </div>
                  </div>

                  {/* Contact Information Form */}
                  <div className="pt-2">
                    <h3 className="text-base md:text-lg font-light text-white mb-4 tracking-tight">
                      Información de contacto
                    </h3>

                    {/* Primer nombre */}
                    <div className="mb-4">
                      <label className="text-sm text-[#9CA3AF] mb-1.5 block font-light">
                        Primer nombre
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder=""
                        className="bg-[#242424] border border-white/10 rounded-[10px] px-4 py-3 text-sm text-white placeholder-[#666] outline-none font-light w-full focus:border-[#FF8300] transition-colors"
                      />
                    </div>

                    {/* Apellido */}
                    <div className="mb-4">
                      <label className="text-sm text-[#9CA3AF] mb-1.5 block font-light">
                        Apellido
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder=""
                        className="bg-[#242424] border border-white/10 rounded-[10px] px-4 py-3 text-sm text-white placeholder-[#666] outline-none font-light w-full focus:border-[#FF8300] transition-colors"
                      />
                    </div>

                    {/* Correo */}
                    <div className="mb-4">
                      <label className="text-sm text-[#9CA3AF] mb-1.5 block font-light">
                        Correo
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder=""
                        className="bg-[#242424] border border-white/10 rounded-[10px] px-4 py-3 text-sm text-white placeholder-[#666] outline-none font-light w-full focus:border-[#FF8300] transition-colors"
                      />
                    </div>

                    {/* Confirma el correo */}
                    <div className="mb-4">
                      <label className="text-sm text-[#9CA3AF] mb-1.5 block font-light">
                        Confirma el correo
                      </label>
                      <input
                        type="email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        placeholder="Repite tu correo"
                        className="bg-[#242424] border border-white/10 rounded-[10px] px-4 py-3 text-sm text-white placeholder-[#666] outline-none font-light w-full focus:border-[#FF8300] transition-colors"
                      />
                    </div>

                    {/* Teléfono */}
                    <div className="mb-6">
                      <label className="text-sm text-[#9CA3AF] mb-1.5 block font-light">
                        Teléfono
                      </label>
                      <div className="relative flex items-center bg-[#242424] border border-white/10 rounded-[10px] px-4 py-3 focus-within:border-[#FF8300] transition-colors">
                        <span className="text-sm text-[#9CA3AF] border-r border-white/10 pr-3 font-light shrink-0">
                          CL +56
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9-87654321"
                          className="bg-transparent w-full text-sm text-white placeholder-[#666] outline-none font-light pl-3"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Legal Consent Text */}
                  <p className="text-sm text-[#777] font-light leading-snug mb-6">
                    Al hacer clic en Comenzar proceso, acepto el{" "}
                    <a href="#" className="text-[#FF8300] underline">
                      Aviso de Privacidad
                    </a>{" "}
                    y autorizo a SoldeRío a contactarme sobre esta solicitud, así como para brindarme información sobre productos, servicios y eventos mediante la información de contacto que proporcionó. Entiendo que las llamadas o mensajes de texto pueden utilizar marcación automática o asistida por computadora, o mensajes pregrabados. Puedo optar por no recibir comunicaciones de marketing en cualquier momento a través del{" "}
                    <a href="#" className="text-[#FF8300] underline">
                      unsubscribe
                    </a>{" "}
                    disponible en correos y web solderio.cl
                  </p>
                </div>

                {/* Step 2 Action Submit Button */}
                <button
                  type="button"
                  disabled={!isStep2Valid}
                  className={`w-full py-3.5 rounded-[12px] text-base tracking-wide font-normal transition-all text-center mt-4 shrink-0 ${isStep2Valid
                    ? "bg-[#FF8300] text-white shadow-lg cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    : "bg-[#FF8300]/25 text-white/40 cursor-not-allowed border border-[#FF8300]/20"
                    }`}
                >
                  Comenzar proceso
                </button>

                {/* Explicit bottom spacer to guarantee scroll breathing room */}
                <div className="h-8 md:h-12 w-full shrink-0" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
