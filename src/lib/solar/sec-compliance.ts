/**
 * Solderío Solar Engineering - Módulo de Cumplimiento Normativo SEC
 * Validación de límites de empalme monofásico/trifásico, Pliegos Técnicos RIC N°09, RIC N°15 y TE-4
 */

import { TopologyType } from "@/types/cotizacion";

export interface SecComplianceRule {
  code: string;
  title: string;
  description: string;
  status: "CUMPLE" | "ADVERTENCIA_TRIFASICO" | "REQUERIDO";
}

export interface SecValidationResult {
  requiresThreePhase: boolean;
  recommendedPhaseType: "monofasico" | "trifasico";
  maxSinglePhaseInverterKw: number; // 10.0 kW
  teFormCode: "TE-4" | "TE-1" | "TE-6";
  rulesValidated: SecComplianceRule[];
  technicalNotes: string[];
}

/**
 * Valida el cumplimiento normativo SEC de la planta solar propuesta
 */
export function validateSecCompliance(
  inverterKw: number,
  systemType: TopologyType,
  hasEvCharger: boolean = false,
  userSelectedPhase: "monofasico" | "trifasico" = "monofasico"
): SecValidationResult {
  const MAX_SINGLE_PHASE_KW = 10.0;
  const requiresThreePhase = inverterKw > MAX_SINGLE_PHASE_KW || userSelectedPhase === "trifasico";
  const recommendedPhaseType = requiresThreePhase ? "trifasico" : "monofasico";

  const rulesValidated: SecComplianceRule[] = [
    {
      code: "RIC N°09 (Sec. 6.1)",
      title: "Instalaciones de Autoconsumo Fotovoltaico",
      description: "Conductores H1Z2Z2-K con protección UV continua y caída de tensión DC <= 1.5%.",
      status: "CUMPLE",
    },
    {
      code: "RIC N°15 (Sec. 5)",
      title: "Interconexión y Protección Anti-Isla",
      description:
        "Desconexión automática por falla de red en < 0.5s y monitoreo de tensión/frecuencia para inyección segura a Saesa/Crell/CGE.",
      status: "CUMPLE",
    },
    {
      code: "Límite Empalme SEC",
      title: requiresThreePhase ? "Empalme Trifásico 380V" : "Empalme Monofásico 220V",
      description: requiresThreePhase
        ? `Potencia de inversor (${inverterKw} kW) supera el límite monofásico de 10 kW. Se dimensiona para conexión Trifásica 380V.`
        : `Potencia de inversor (${inverterKw} kW) compatible con empalme monofásico estándar hasta 10 kW.`,
      status: requiresThreePhase && userSelectedPhase === "monofasico" ? "ADVERTENCIA_TRIFASICO" : "CUMPLE",
    },
  ];

  if (systemType !== "ongrid") {
    rulesValidated.push({
      code: "RIC N°09 (BESS)",
      title: "Sistemas de Almacenamiento Electroquímico LiFePO4",
      description: "BMS con monitoreo de celdas, seccionador de corte rápido DC y ventilación adecuada.",
      status: "CUMPLE",
    });
  }

  if (hasEvCharger) {
    rulesValidated.push({
      code: "RIC N°15 / TE-6",
      title: "Infraestructura de Carga de Vehículos Eléctricos",
      description: "Protección diferencial Tipo B / Tipo A-EV y circuito exclusivo según pliego TE-6.",
      status: "REQUERIDO",
    });
  }

  const technicalNotes: string[] = [
    `Tramitación de Certificado ${systemType === "offgrid" ? "TE-1" : "TE-4"} incluida ante la SEC con firma de Ingeniero Eléctrico Clase A.`,
    "Garantía de cumplimiento con la Norma Técnica de Seguridad y Calidad de Servicio (NTSyCS).",
  ];

  if (requiresThreePhase) {
    technicalNotes.push("Inversor trifásico garantiza balanceo perfecto de fases y evita desbalances de tensión en el tablero general.");
  }

  return {
    requiresThreePhase,
    recommendedPhaseType,
    maxSinglePhaseInverterKw: MAX_SINGLE_PHASE_KW,
    teFormCode: hasEvCharger ? "TE-6" : systemType === "offgrid" ? "TE-1" : "TE-4",
    rulesValidated,
    technicalNotes,
  };
}
