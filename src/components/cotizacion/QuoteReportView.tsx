"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, 
  Zap, 
  Battery, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  Leaf, 
  Calendar, 
  PhoneCall, 
  ArrowRight, 
  Sparkles,
  HelpCircle,
  X,
  Download,
  FileText,
  FileCheck2,
  Wrench,
  Award,
  Wallet,
  ArrowLeft,
  RotateCcw,
  ChevronDown,
  Building2,
  Percent,
  Scale
} from "lucide-react";
import { SolarSizingResult, QuoteFormData, MonthlyGenBreakdown } from "@/types/cotizacion";
import { useVisitaModal } from "@/context/VisitaModalContext";

import { SolarSeasonalChart } from "./SolarSeasonalChart";

interface Props {
  formData: QuoteFormData;
  sizing: SolarSizingResult;
  leadId: string;
  onReset: () => void;
  onBack?: () => void;
}

interface ExplanatoryModalContent {
  title: string;
  subtitle: string;
  analogy: string;
  details: string[];
}

function getExplanatoryModalContent(
  key: string,
  formData: QuoteFormData,
  sizing: SolarSizingResult,
  isB2B: boolean
): ExplanatoryModalContent | null {
  const formatCLP = (val: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(val);

  switch (key) {
    case "retorno": {
      if (isB2B) {
        const costoNeto = sizing.estimatedSystemCostNetoClp || Math.round((sizing.estimatedSystemCostIvaClp || 0) / 1.19);
        const vatRecovery = sizing.recoverableVatClp || Math.round(costoNeto * 0.19);
        const art33Bis = sizing.taxShieldArt33BisClp || Math.round(costoNeto * 0.05);

        return {
          title: "¿Cómo se recupera la inversión y qué rentabilidad genera en tu empresa?",
          subtitle: "Evaluación Financiera C&I: Flujo de Caja, Escudo Fiscal y LCOE",
          analogy: `La planta solar se evalúa como un activo productivo de alto rendimiento: con un gasto eléctrico actual de ${formatCLP(formData.monthlyBillClp)}/mes, el sistema genera un ahorro operacional directo de ${formatCLP(sizing.estimatedAnnualSavingsClp)}/año. Sumando la recuperación del 19% de IVA (${formatCLP(vatRecovery)}) y el crédito Art. 33 bis LIR (${formatCLP(art33Bis)}), el capital se recupera en aproximadamente ${sizing.paybackYears} años, con una TIR del ${sizing.tirPercent}% y un VAN de ${formatCLP(sizing.vanClp || 0)} a 25 años.`,
          details: [
            `Período de Retorno (Payback de ${sizing.paybackYears} años): El flujo de caja operativo neto (ahorro en energía activa + inyecciones Ley 21.118 + mitigación de demanda) amortiza el CAPEX comercial de forma acelerada.`,
            `Escudo Fiscal Corporativo (Año 1): Recuperación íntegra del 19% de IVA (${formatCLP(vatRecovery)}) en el Formulario 29 del SII, más deducción del Crédito Tributario Art. 33 bis LIR (${formatCLP(art33Bis)}) directamente contra el Impuesto de Primera Categoría.`,
            `Costo Nivelado de la Energía (LCOE de $${sizing.lcoeClpPerKwh || 45}/kWh): Tu empresa autogenera electricidad a un costo de ~$${sizing.lcoeClpPerKwh || 45}/kWh a 25 años, frente a los ~$210-$280/kWh que cobra la distribuidora de la red.`,
            `Provisión de O&M y Recambio de Inversores: El flujo financiero a 25 años descuenta el 1% anual de mantenimiento preventivo y contempla la provisión para recambio de inversores en el año 12 (~12% CAPEX), entregando un VAN de ${formatCLP(sizing.vanClp || 0)} 100% realista y auditable.`,
          ],
        };
      }

      if (formData.systemType === "offgrid") {
        return {
          title: "¿En cuánto tiempo se amortiza tu planta Off-Grid y qué ahorros genera?",
          subtitle: "Desplazamiento directo de combustible diésel y autonomía 24/7 sin red",
          analogy: `En un predio o cabaña aislada sin conexión a la red eléctrica, abastecer energía mediante un motogenerador a combustible fósil cuesta entre $150.000 y $250.000 mensuales en bencina o diésel ($1.300/litro), cambios continuos de aceite y ruido constante. Tu planta solar con banco de baterías LiFePO4 desplaza más del 80% de ese consumo de combustible, recuperando la inversión en aproximadamente ${sizing.paybackYears} años y otorgando electricidad limpia, continua y silenciosa.`,
          details: [
            `Ahorro Anual en Combustible: Generar con motogenerador en el Sur cuesta ~$540 por kWh útil. Tus paneles y baterías ahorran aproximadamente ${formatCLP(sizing.estimatedAnnualSavingsClp)} al año en combustible fósil y mantenimiento de motor desplazado.`,
            `Almacenamiento Seguro LiFePO4: Baterías de fosfato de hierro y litio con más de 6.000 ciclos de vida útil (~15 años a 1 ciclo/día), sin humos, sin olores a bencina y con operación 100% silenciosa en la noche.`,
            "Respaldo Híbrido con Generador Auxiliar (ATS): Tu inversor coordina automáticamente la carga solar diurna y solo arranca el generador como respaldo de emergencia en periodos de temporal prolongado de invierno.",
            "Alternativa a la Extensión de Línea: Un empalme rural de media tensión con postación y transformador suele superar los $15M a $35M por kilómetro. La planta solar aislada es más económica, independiente y de instalación inmediata.",
          ],
        };
      }

      const totalCostIva = sizing.estimatedSystemCostIvaClp || Math.round((sizing.estimatedSystemCostNetoClp || 0) * 1.19);

      return {
        title: "¿En cuánto tiempo se paga tu proyecto solar y cuánto dura?",
        subtitle: "Inversión que se autofinancia con el ahorro mensual de tu boleta",
        analogy: `En lugar de destinar ${formatCLP(formData.monthlyBillClp)} todos los meses a la compañía eléctrica para siempre, ese mismo ahorro mensual acumulado cubre el costo de tu planta en aproximadamente ${sizing.paybackYears} años. A partir de ese momento, tienes más de 20 años de electricidad prácticamente gratis generada en tu propio techo.`,
        details: [
          `Autofinanciamiento con tu propia cuenta: Los ~${formatCLP(sizing.estimatedAnnualSavingsClp)} que dejas de pagar al año amortizan la inversión de ${formatCLP(totalCostIva)} sin necesidad de poner dinero extra sobre tu presupuesto familiar habitual.`,
          "Garantía Lineal de Generación a 25 Años: Los módulos Tier 1 TOPCon cuentan con garantía certificada de fábrica por escrito que asegura al menos el 84.8% de su potencia nominal al año 25.",
          "Protección Total contra las Alzas de la Luz: Con los sucesivos incrementos tarifarios en Chile, cada año tu planta solar ahorra más dinero, acelerando aún más el retorno de tu inversión.",
          "Plusvalía Inmediata de tu Vivienda: Una propiedad con sistema solar certificado SEC y medidor bidireccional bajo Ley 21.118 incrementa de inmediato su valor de tasación y atractivo en el mercado del Sur.",
        ],
      };
    }

    case "kwp": {
      if (isB2B) {
        return {
          title: `¿Qué significa Potencia Sugerida de ${sizing.recommendedKwp} kWp en tu empresa?`,
          subtitle: "Capacidad de generación diurna y potencia instalada",
          analogy: `El 'kWp' (Kilowatt pico) representa la capacidad máxima de generación eléctrica de tu planta solar bajo condiciones estándar. Indica cuánta potencia instantánea entregan tus paneles para cubrir las faenas, motores, iluminación y maquinarias en horario diurno.`,
          details: [
            `Tu proyecto contempla ${sizing.recommendedKwp} kWp distribuidos en ${sizing.panelsCount} módulos fotovoltaicos N-Type TOPCon de ${sizing.panelWatts}W Tier 1.`,
            `Inversor trifásico industrial de ${sizing.inverterKw} kW sincronizado a la red de ${formData.distributor?.toUpperCase() || "la distribuidora"} con monitoreo digital continuo.`,
            "La energía se autoconsume primero en los consumos comerciales de tu empresa y los excedentes se inyectan a la red bajo la Ley 21.118 Netbilling.",
          ],
        };
      }

      if (formData.systemType === "offgrid") {
        return {
          title: `¿Qué significa Potencia de ${sizing.recommendedKwp} kWp en una planta Off-Grid?`,
          subtitle: "Consumo diurno y recarga diaria del banco de baterías",
          analogy: `En un sistema aislado sin conexión a la red eléctrica, los ${sizing.recommendedKwp} kWp de paneles solares tienen un doble objetivo: abastecer el consumo de tu casa durante el día y generar la energía necesaria para recargar tu banco de baterías LiFePO4 al 100% antes de que caiga la tarde.`,
          details: [
            `Tu propuesta contempla ${sizing.recommendedKwp} kWp con ${sizing.panelsCount} módulos N-Type TOPCon de ${sizing.panelWatts}W de alta captación en días nublados y lluviosos.`,
            `Inversor cargador Off-Grid de ${sizing.inverterKw} kW con controlador MPPT de alto voltaje y transferencia automática ATS para generador auxiliar.`,
            "El 100% de la energía generada se aprovecha en tu predio: abastece tu consumo diurno y acumula reserva en litio para toda la noche.",
          ],
        };
      }

      return {
        title: `¿Qué significa Potencia de ${sizing.recommendedKwp} kWp y cuántos paneles son?`,
        subtitle: "Explicación sencilla con peras y manzanas",
        analogy: "El 'kWp' (Kilowatt pico) es como el tamaño del motor de tu planta solar. Representa la cantidad máxima de energía limpia que tus paneles generan bajo el sol del mediodía para abastecer tu casa.",
        details: [
          `Cada panel SoldeRío es de tecnología N-Type TOPCon de ${sizing.panelWatts} Watts (alta captación incluso en días nublados del sur).`,
          `Tu propuesta indica ${sizing.recommendedKwp} kWp, lo que equivale a ${sizing.panelsCount} módulos instalados en tu techo orientados hacia el norte.`,
          "Toda esa energía alimenta primero el consumo instantáneo de tu hogar y el excedente carga tus baterías o se inyecta a la red.",
        ],
      };
    }

    case "bess": {
      if (formData.systemType === "offgrid") {
        return {
          title: "¿Cómo funciona el Banco de Baterías LiFePO4 en un sistema Aislado?",
          subtitle: "Suministro eléctrico principal 24/7 sin ruido ni combustible",
          analogy: `En una vivienda o predio aislado, el banco de baterías no es sólo un respaldo de emergencia: es el corazón del sistema eléctrico. Almacena la energía solar producida de día para alimentar la casa durante toda la noche y en periodos nublados, con operación 100% silenciosa y automática.`,
          details: [
            `Capacidad nominal de ${sizing.batteryKwh} kWh (${sizing.usableBatteryKwh || Math.round(sizing.batteryKwh * 0.85)} kWh útiles al 90% DoD), suficiente para cubrir consumos nocturnos de refrigeración, iluminación, internet y electrodomésticos.`,
            "Química LiFePO4 (Fosfato de Hierro y Litio): Baterías selladas sin emanaciones de gas, seguras contra sobrecalentamiento y con vida útil superior a 15 años (+6.000 ciclos).",
            "Cero combustible, cero ruido: Olvídate de encender un motogenerador con lluvia en la noche o de soportar ruidos molestos, vibraciones y humos tóxicos.",
            "Asistencia inteligente ATS: En temporales excepcionales de invierno de varios días continuos sin sol, el inversor coordina automáticamente el encendido de un motogenerador auxiliar por un par de horas sólo para reponer carga de baterías.",
          ],
        };
      }

      return {
        title: "¿Cómo funciona la Batería LiFePO4 y el respaldo en cortes?",
        subtitle: "Tu propia reserva de energía inteligente sin ruido ni bencina",
        analogy: "Es como tener un estanque de agua purificada en altura: cuando la distribuidora corta la luz por temporal o choque de poste, tu casa ni se entera. La batería toma el control en 0.01 segundos.",
        details: [
          "Química LiFePO4 (Fosfato de Hierro y Litio): No se calienta, no es inflamable y dura más de 15 años (+6.000 ciclos).",
          "Conmutación ultra-rápida STS (<10 ms): Tus computadores, Wi-Fi de Starlink y electrodomésticos no se apagan ni parpadean.",
          "En días normales, la batería se llena gratis con el sol de la tarde y alimenta tu consumo durante la noche para no comprarle luz cara a la red.",
        ],
      };
    }

    case "netbilling":
      return {
        title: "¿Cómo funciona la Ley Net Billing y por qué baja tanto mi cuenta?",
        subtitle: "Generas en verano, guardas saldo a favor y descuentas en invierno",
        analogy: "Imagina que tu medidor gira hacia adelante cuando consumes y hacia atrás cuando el sol brilla y no estás en casa. Todo lo que te sobra se lo vendes a la distribuidora por ley.",
        details: [
          "Ley 21.118: La compañía eléctrica está obligada por ley a recibir tus excedentes y pagártelos como saldo en dinero en tu boleta.",
          "En los meses de verano (enero a marzo) generarás más energía de la que gastas, acumulando un pozo de saldo a favor.",
          "Ese saldo acumulado se utiliza automáticamente en invierno para pagar tus consumos de los meses más fríos.",
        ],
      };

    case "limiteInvierno":
      return {
        title: "¿Qué es el 'Límite de Invierno' y cómo te protege SoldeRío?",
        subtitle: "El sobrecargo oculto de las distribuidoras en los meses fríos (Tarifa BT1)",
        analogy: "Entre abril y septiembre, si una vivienda gasta más de 350 kWh al mes, la distribuidora aplica un castigo tarifario y cobra el kWh hasta un 40% más caro.",
        details: [
          "Tu planta solar reduce tu consumo directo de la red eléctrica, manteniéndote siempre bajo el umbral de castigo.",
          "Esto te ahorra dinero todos los meses exclusivamente en multas y sobrecargos evitados durante el invierno.",
        ],
      };

    case "taxShield":
      return {
        title: "Beneficios Tributarios B2B: Art. 33 bis LIR e IVA Crédito Fiscal",
        subtitle: "Incentivos tributarios para empresas, pymes y predios agrícolas",
        analogy: "El Estado de Chile incentiva la inversión en activos fijos de energías renovables permitiendo descontar directamente de tus impuestos una parte sustancial del costo del proyecto.",
        details: [
          `Artículo 33 bis Ley de la Renta: Crédito tributario directo del 4% al 6% sobre el valor del activo fijo (planta solar), deducible contra el Impuesto de Primera Categoría en la Operación Renta anual (${formatCLP(sizing.taxShieldArt33BisClp || 0)}).`,
          `19% IVA Crédito Fiscal: El 100% del IVA de la inversión (${formatCLP(sizing.recoverableVatClp || 0)}) se recupera íntegramente como crédito fiscal en el Formulario 29 del SII.`,
          "Depreciación Acelerada o Instantánea: Posibilidad de rebajar el activo de la base imponible en el primer ejercicio comercial para reducir la carga tributaria neta de tu empresa.",
        ],
      };

    case "peakHours":
      return {
        title: "Mitigación de Demanda Máxima y Horas Punta (BT2 / BT3 / AT)",
        subtitle: "Ahorro por Peak Shaving en tarifas comerciales e industriales",
        analogy: "En tarifas comerciales con medición de potencia, la distribuidora cobra un cargo elevado por el peak máximo de demanda que le exiges a la red.",
        details: [
          "Horas Punta (18:00 a 22:00 hrs entre abril y septiembre): La energía y potencia tienen un recargo severo de hasta 3x.",
          "Generación solar diurna y bancos de baterías BESS recortan estos peaks de consumo industrial (Peak Shaving).",
          "Esto reduce el cargo fijo por potencia leída facturado por la distribuidora para todo el año siguiente.",
        ],
      };

    default:
      return null;
  }
}

const B2C_INCLUDED_SERVICES = [
  {
    title: "Diseño & Ingeniería a Medida",
    desc: "Dimensionamiento de alta precisión según tu consumo y la radiación local en el Sur de Chile, optimizando orientación e inclinación.",
    icon: Sun,
    badge: "Ingeniería Local",
  },
  {
    title: "Módulos Tier 1 N-Type TOPCon",
    desc: "Paneles solares de última generación con tolerancia a sombras y alta captación de radiación difusa en días nublados.",
    icon: Zap,
    badge: "Alta Eficiencia",
  },
  {
    title: "Instalación & Montaje Certificado",
    desc: "Montaje sobre techumbre (zinc, teja asfáltica o tejuela) con fijaciones de aluminio anodizado y sellado EPDM estanco garantizado.",
    icon: Wrench,
    badge: "Llave en Mano",
  },
  {
    title: "Certificación SEC & Trámite TE-4",
    desc: "Tramitación completa ante la Superintendencia de Electricidad y Combustibles (SEC) y gestión de medidor bidireccional con tu distribuidora (Saesa, Crell o CGE) bajo Ley Netbilling.",
    icon: Award,
    badge: "Ley 21.118",
  },
  {
    title: "Puesta en Marcha & App FusionSolar",
    desc: "Configuración del inversor y vinculación a tu smartphone para monitorear en tiempo real tu generación solar, consumo y ahorros 24/7.",
    icon: PhoneCall,
    badge: "Monitoreo 24/7",
  },
  {
    title: "Garantías Extendidas de Fábrica y Faena",
    desc: "25 a 30 años de garantía de potencia en paneles, 10 años en inversores Huawei y 3 años de garantía en la instalación y mano de obra.",
    icon: ShieldCheck,
    badge: "Garantía 25 Años",
  },
  {
    title: "Soporte Técnico y Mantenimiento Local",
    desc: "Equipo técnico con base en Puerto Varas, Osorno y Valdivia para acompañamiento, mantenimientos preventivos y visitas técnicas.",
    icon: Sparkles,
    badge: "Presencia en el Sur",
  },
];

const B2B_INCLUDED_SERVICES = [
  {
    title: "Auditoría de Demanda & Estudio Tarifario",
    desc: "Análisis de curva de carga horaria, verificación de empalme trifásico/transformador y optimización de tarifas BT2, BT3, BT4 o AT con mitigación de potencia.",
    icon: Scale,
    badge: "Ingeniería C&I",
  },
  {
    title: "Ingeniería de Detalle SEC Clase A & Planos",
    desc: "Desarrollo de planos unilineales, memoria de cálculo de anclajes estructurales para galpones/cubiertas industriales y especificación de canalizaciones bajo Pliegos RIC N° 19.",
    icon: FileText,
    badge: "SEC Clase A",
  },
  {
    title: "Tramitación GDA ante Distribuidora (F1 a F5)",
    desc: "Gestión completa del ciclo normativo de conexión a la red: Solicitud F1, Solución F3, Notificación F4, contrato de conexión F5 y aprobación TE-4 ante la SEC.",
    icon: Award,
    badge: "Ley 21.118 ≤ 300 kW",
  },
  {
    title: "Montaje Industrial con Cuadrilla Calificada",
    desc: "Técnicos certificados para trabajo en altura con líneas de vida sobre cubiertas industriales, canalización en tubería EMT de acero galvanizado y faena sin detener la producción.",
    icon: Wrench,
    badge: "Faena Segura",
  },
  {
    title: "Tablero TGA Industrial & Protecciones",
    desc: "Gabinete autosoportado IP65, interruptor de cabecera en caja moldeada (MCCB), DPS Tipo 1+2, analizador de redes comercial y relé anti-isla certificado SEC.",
    icon: Zap,
    badge: "BOS Industrial",
  },
  {
    title: "Dossier Técnico & Respaldo Tributario (Art. 33 bis)",
    desc: "Entrega de carpeta As-Built con certificados de fábrica para respaldo del Crédito Tributario Art. 33 bis LIR (5% activo fijo) y recuperación del 19% de IVA en el F29.",
    icon: FileCheck2,
    badge: "Respaldo F29",
  },
  {
    title: "Operación & Mantenimiento con SLA Preferente",
    desc: "Monitoreo continuo de planta, inspección termográfica infrarroja anual de celdas, mantenimiento correctivo prioritario <24 hrs y provisión de recambio de inversor en año 12.",
    icon: Sparkles,
    badge: "SLA Preferente",
  },
];

const B2C_OFFGRID_INCLUDED_SERVICES = [
  {
    title: "Ingeniería de Aislamiento & Autonomía 24/7",
    desc: "Dimensionamiento estacional de alta fidelidad según la radiación invernal del Sur de Chile, asegurando suministro eléctrico continuo sin depender de tendido eléctrico ni postes.",
    icon: Sun,
    badge: "Autonomía Rural",
  },
  {
    title: "Módulos Tier 1 N-Type TOPCon Alta Difusa",
    desc: "Paneles solares de última generación con captación superior en días lluviosos y nublados para recargar el banco de baterías LiFePO4 de forma continua.",
    icon: Zap,
    badge: "Captación Difusa",
  },
  {
    title: "Banco de Baterías LiFePO4 de Ciclo Profundo",
    desc: "Almacenamiento en litio hierro fosfato de alta seguridad térmica, +6.000 ciclos de vida útil (>15 años), sin ruidos, sin gases nocivos ni mantención ácida.",
    icon: Battery,
    badge: "LiFePO4 +6000c",
  },
  {
    title: "Inversor Cargador Off-Grid con Conmutación ATS",
    desc: "Inversor de onda senoidal pura con cargador solar MPPT de alta tensión y puerto de partida automática (ATS) para coordinar generador auxiliar en temporales.",
    icon: ShieldCheck,
    badge: "Onda Pura & ATS",
  },
  {
    title: "Tablero Aislado & Protecciones DC/AC Dedicadas",
    desc: "Gabinete con protecciones termomagnéticas bipolares, fusibles de batería NH, DPS contra rayos y malla a tierra certificada bajo pliegos técnicos RIC SEC.",
    icon: Wrench,
    badge: "Norma RIC SEC",
  },
  {
    title: "Puesta en Marcha & Monitoreo de Autonomía",
    desc: "Programación de curvas de carga, calibración del Estado de Carga (SoC%) de baterías y visualización digital en smartphone.",
    icon: PhoneCall,
    badge: "Monitoreo SoC",
  },
  {
    title: "Soporte Técnico en Terreno en el Sur de Chile",
    desc: "Servicio técnico directo en Los Lagos, Los Ríos y La Araucanía para mantenimiento preventivo, visitas y asistencia técnica especializada.",
    icon: Sparkles,
    badge: "Presencia Local",
  },
];

const B2C_OFFGRID_FAQS = [
  {
    question: "¿Cómo funciona una vivienda o parcela 100% desconectada de la red (Off-Grid)?",
    answer: "Tus paneles solares generan electricidad durante el día para abastecer el consumo instantáneo de tu casa y recargar simultáneamente el banco de baterías LiFePO4. Durante la noche o en días muy nublados, la energía acumulada en las baterías alimenta todos tus artefactos de forma automática, silenciosa y continua.",
  },
  {
    question: "¿Qué pasa si hay varios días seguidos de temporal o lluvia cerrada en invierno?",
    answer: "El sistema está dimensionado con baterías de litio para cubrir la noche y días nublados estándar. Para temporales excepcionales de 3 o más días sin luz solar en invierno austral, el inversor cuenta con un conmutador ATS que puede encender automáticamente un motogenerador auxiliar por un par de horas sólo para recargar las baterías y apagarse solo.",
  },
  {
    question: "¿Qué electrodomésticos puedo utilizar con este sistema aislado?",
    answer: "Con nuestro inversor cargador de onda senoidal pura y banco LiFePO4 puedes operar refrigerador, iluminación LED, televisores, internet Starlink, computadores, microondas, bomba de pozo profundo y herramientas eléctricas habituales. Se recomienda coordinar artefactos de alto consumo térmico (termos eléctricos o estufas de resistencia) en horas de mayor sol.",
  },
  {
    question: "¿Tengo que pagar boletas de luz o hacer trámites con la distribuidora eléctrica?",
    answer: "No. En un sistema Off-Grid eres 100% independiente de las compañías eléctricas (Saesa, Crell, Frontel, etc.). No pagas cargos fijos mensuales, no sufres por cortes de cables en la zona rural ni te afectan las sucesivas alzas tarifarias de la luz.",
  },
  {
    question: "¿Qué mantenimiento requieren las baterías LiFePO4 frente a las de plomo tradicionales?",
    answer: "Las baterías de litio LiFePO4 son selladas y 100% libres de mantenimiento: no requieren relleno de agua destilada, no desprenden gases tóxicos y tienen una vida útil de más de 15 años (+6.000 ciclos), frente a los apenas 2 a 3 años de las baterías antiguas de plomo-ácido.",
  },
  {
    question: "¿Se puede instalar la planta solar en el techo o en estructura sobre el suelo?",
    answer: "Ambas opciones son viables. Si el techo de tu cabaña o casa tiene buena orientación e inclinación norte, se instala con fijaciones estancas de aluminio anodizado. Si el techo está sombreado por bosque o árboles nativos, montamos la estructura directamente sobre terreno con anclaje al suelo.",
  },
];

const B2C_FAQS = [
  {
    question: "¿En cuánto tiempo estará operativa mi planta solar en casa?",
    answer: "Una vez firmado el contrato, la instalación física en tu techo toma entre 3 y 5 días hábiles. La puesta en marcha para autoconsumo directo es inmediata tras finalizar el montaje. Luego, la tramitación del certificado TE-4 ante la SEC y el cambio al nuevo medidor bidireccional con tu distribuidora (Saesa, Crell o CGE) toma entre 30 y 60 días para comenzar a inyectar excedentes bajo la Ley Netbilling.",
  },
  {
    question: "¿Mis paneles solares funcionan cuando hay un corte de luz?",
    answer: "En una planta On-Grid tradicional conectada a la red, los paneles se desconectan automáticamente por normativa de seguridad SEC (para proteger a los técnicos que reparan las líneas eléctricas). Si buscas tener electricidad y luz durante temporales y apagones, tu planta debe ser Híbrida con Baterías LiFePO4, las cuales conmutan automáticamente en milisegundos para alimentar tus consumos esenciales sin interrupción.",
  },
  {
    question: "¿Cómo se refleja el ahorro en mi boleta de electricidad (Saesa, Crell, CGE)?",
    answer: "El ahorro es doble: primero, la energía que consumes de día la generan tus paneles y la compañía no te la cobra. Segundo, si generas más energía de la que gastas, se inyecta a la red y la distribuidora te abona créditos en dinero en tu boleta bajo la Ley 21.118 Netbilling. En primavera y verano puedes reducir tu boleta a $0 en cargo de energía y acumular saldos a favor para el invierno.",
  },
  {
    question: "¿Qué pasa en los días nublados o con lluvia en el Sur de Chile?",
    answer: "Nuestros módulos N-Type TOPCon están especialmente diseñados para climas australes: captan radiación difusa y continúan generando electricidad incluso con cielo cubierto o lluvia moderada. Además, las lluvias frecuentes en la región limpian naturalmente el polvo de los paneles, manteniéndolos en óptimo rendimiento.",
  },
  {
    question: "¿La instalación daña el techo o puede provocar goteras?",
    answer: "Absolutamente no. Utilizamos fijaciones estructurales de aluminio anodizado con sellos de caucho EPDM diseñadas específicamente para el tipo de techumbre de tu casa (zinc ondulado, teja asfáltica o gravillada). Nuestro trabajo incluye 3 años de garantía en la estanqueidad de la techumbre.",
  },
  {
    question: "¿Qué mantención requieren los paneles solares en una vivienda?",
    answer: "El mantenimiento es mínimo. En el sur, la lluvia se encarga de la mayor parte de la limpieza. Recomendamos una inspección visual y un lavado suave de paneles 1 o 2 veces al año (al inicio de primavera y verano para retirar polen o musgo), además de revisar las conexiones eléctricas.",
  },
];

const B2B_FAQS = [
  {
    question: "¿Cómo aprovecha mi empresa el Crédito Tributario Art. 33 bis LIR y el IVA Crédito Fiscal?",
    answer: "El 100% del IVA de la inversión (19%) se recupera como Crédito Fiscal en el Formulario 29 contra los débitos de las ventas de tu empresa. Adicionalmente, el Artículo 33 bis de la Ley de la Renta permite deducir entre un 4% y 6% del valor total de la inversión en paneles e infraestructura directamente contra el Impuesto de Primera Categoría en la Operación Renta anual.",
  },
  {
    question: "¿La planta solar nos permite reducir el cargo por potencia en Horas Punta (Peak Shaving)?",
    answer: "En tarifas comerciales e industriales (BT2, BT3, BT4 o AT), los cargos por potencia contratada o leída representan hasta un 35% de la factura eléctrica. Un sistema solar On-Grid reduce la demanda de potencia diurna durante las horas laborales. Si se incorporan sistemas de almacenamiento BESS, es posible realizar Peak Shaving activo entre las 18:00 y 22:00 hrs (abril a septiembre), reduciendo drásticamente el cargo anual por potencia en horas punta.",
  },
  {
    question: "¿Cuál es el límite de potencia bajo la Ley 21.118 Netbilling y qué diferencia tiene con un PMGD?",
    answer: "La Ley 21.118 de Generación Distribuida permite a las empresas instalar hasta 300 kW de potencia conectada a la red de distribución para autoconsumo e inyección con tramitación simplificada TE-4 ante la distribuidora. Instalaciones superiores a 300 kW y hasta 9 MW se rigen como Pequeños Medios de Generación Distribuida (PMGD - DS 88/2019), lo que exige estudios de red más extensos y coordinación con el CEN.",
  },
  {
    question: "¿Cómo se gestiona la tramitación SEC (TE-4) y la solicitud de conexión ante la distribuidora?",
    answer: "SoldeRío se encarga de todo el ciclo técnico y normativo a través de la plataforma GDA de la distribuidora (Saesa, Crell o CGE): Solicitud de Conexión a la Red (F1), Solución de Conexión (F3), Notificación de Conexión (F4) y Contrato de Conexión Netbilling (F5), culminando con la Declaración TE-4 aprobada por la SEC.",
  },
  {
    question: "¿Qué ocurre con los excedentes de energía inyectados si no se compensan en el mes?",
    answer: "Bajo la Ley 21.118, los saldos a favor por inyección de excedentes se valorizan a precio de nudo de energía y potencia y se acumulan en dinero reajustado por IPC para descontar las facturas siguientes. Si al cierre del ciclo anual en diciembre queda un saldo remanente no compensado, la distribuidora está obligada por ley a pagarlo directamente a la empresa mediante transferencia bancaria.",
  },
  {
    question: "¿El montaje fotovoltaico interrumpe las faenas u operaciones productivas de la empresa?",
    answer: "No. El montaje mecánico de módulos, perfiles y canalizaciones sobre cubiertas de galpones o terrenos se realiza de forma independiente y paralela a la actividad de tu empresa. Solo se programa una breve ventana técnica de 2 a 4 horas (usualmente en fin de semana o fuera de horario de faena) para el conexionado y pruebas del Tablero General TGA.",
  },
  {
    question: "¿Ofrecen contratos de Operación & Mantenimiento (O&M) y cómo se contempla el recambio de inversores?",
    answer: "Sí, contamos con planes de O&M con monitoreo continuo de planta, inspección termográfica infrarroja periódica para detectar puntos calientes y atención preferente en terreno en el sur (<24 hrs). Además, nuestras evaluaciones financieras a 25 años provisionan responsablemente el costo de recambio de inversores en el año 12, asegurando un flujo de caja predecible y realista.",
  },
];

export function QuoteReportView({ formData, sizing, leadId, onReset, onBack }: Props) {
  const { openModal } = useVisitaModal();
  const [activeModalKey, setActiveModalKey] = useState<string | null>(null);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const isB2B = Boolean(sizing.isB2B || formData.propertyType === "comercial" || formData.propertyType === "agricola");
  const isOffGrid = formData.systemType === "offgrid";

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatNumber = (val: number) => {
    return Math.round(val).toLocaleString("es-CL");
  };

  const monthlyData = sizing.monthlyBreakdown || [];

  const activeModal = activeModalKey ? getExplanatoryModalContent(activeModalKey, formData, sizing, isB2B) : null;

  return (
    <div className="w-full max-w-6xl 2xl:max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 md:px-8 text-white space-y-6 sm:space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Banner */}
      <div className="p-5 sm:p-8 md:p-10 rounded-[24px] sm:rounded-[28px] bg-gradient-to-br from-[#1F1F1F] via-[#181818] to-black border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF8300]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-3 border ${
              isB2B 
                ? "bg-blue-500/20 text-blue-400 border-blue-500/30" 
                : isOffGrid
                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
            }`}>
              {isB2B ? <Building2 className="w-3.5 h-3.5" /> : isOffGrid ? <ShieldCheck className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>
                {isB2B 
                  ? `Dossier Técnico B2B • Vía: ${sizing.regulatoryTitle || "Ley 21.118 Netbilling"}`
                  : isOffGrid
                  ? `Pre-Informe Planta Aislada Off-Grid • ID: ${leadId}`
                  : `Pre-Informe de Ingeniería • ID: ${leadId}`}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-white mb-2">
              {isB2B 
                ? `Proyecto Solar Corporativo para ${formData.fullName}`
                : isOffGrid
                ? `Planta Solar Aislada con Baterías para ${formData.fullName}`
                : `Propuesta Solar para ${formData.fullName}`}
            </h2>
            <p className="text-white/60 text-xs md:text-sm font-light">
              Ubicación: <span className="text-white capitalize">{formData.comuna}</span> • Gasto Estimado:{" "}
              <span className="text-[#FF8300] font-mono font-medium">{formatCurrency(formData.monthlyBillClp)} / mes</span> • Conexión:{" "}
              <span className="text-white capitalize">{isOffGrid ? "100% Aislado de la Red (Off-Grid)" : formData.distributor}</span>
              {isB2B && (
                <span className="ml-2 px-2 py-0.5 rounded bg-white/10 text-white/80 font-mono text-[11px]">
                  {sizing.requiresThreePhase ? "Empalme Trifásico" : "Empalme Monofásico"}
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto no-print">
            <button
              onClick={() => openModal()}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs md:text-sm transition-all shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Coordinar Visita</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main Technical & Financial Metrics Bento with Help Modals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 items-stretch">
        {/* Metric 1: Potencia Peak & Módulos */}
        <div className="p-5 sm:p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-lg flex flex-col justify-between relative group min-h-[210px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF8300] font-semibold flex items-center gap-1.5">
                POTENCIA SUGERIDA
                <button
                  type="button"
                  onClick={() => setActiveModalKey("kwp")}
                  className="text-white/40 hover:text-[#FF8300] transition-colors cursor-pointer"
                  title="¿Qué es esto? (Ver explicación sencilla)"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </span>
              <Sun className="w-5 h-5 text-[#FF8300] flex-shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-light font-mono text-white mb-1">
              {sizing.recommendedKwp} <span className="text-sm sm:text-base text-white/50">kWp</span>
            </div>
            <p className="text-xs text-white/60 font-light leading-snug">
              {sizing.panelsCount} Módulos Tier 1 TOPCon {sizing.panelWatts}W
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-white/10 text-[11px] text-white/60 font-mono flex items-center justify-between gap-1 flex-wrap">
            <span className="text-[#FF8300]">Inversor: <strong className="text-white font-medium">{sizing.inverterKw} kW</strong></span>
            <span className="text-white/40 text-[10px]">{isB2B ? "Trifásico C&I" : isOffGrid ? "Inversor Cargador Off-Grid" : "Huawei FusionSolar"}</span>
          </div>
        </div>

        {/* Metric 2: B2B Escudo Tributario & IVA F29 vs B2C Batería LiFePO4 */}
        {isB2B ? (
          <div className="p-5 sm:p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-lg flex flex-col justify-between relative group min-h-[210px]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                  ESCUDO FISCAL B2B
                  <button
                    type="button"
                    onClick={() => setActiveModalKey("taxShield")}
                    className="text-white/40 hover:text-emerald-400 transition-colors cursor-pointer"
                    title="¿Qué es esto? (Ver detalle de incentivos)"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </span>
                <Percent className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-[22px] xl:text-2xl 2xl:text-3xl font-light font-mono text-emerald-400 mb-1">
                {formatCurrency((sizing.taxShieldArt33BisClp || 0) + (sizing.recoverableVatClp || 0))}
              </div>
              <p className="text-xs text-white/60 font-light leading-snug">
                Art. 33 bis LIR + 19% IVA F29 Recuperable
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-white/10 text-[11px] text-emerald-400 font-mono flex items-center justify-between gap-1 flex-wrap">
              <span>Art. 33 bis: <strong className="text-white font-medium">{formatCurrency(sizing.taxShieldArt33BisClp || 0)}</strong></span>
              <button
                onClick={() => setActiveModalKey("taxShield")}
                className="text-emerald-400 hover:underline text-[10px] cursor-pointer"
              >
                Ver beneficio →
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-lg flex flex-col justify-between relative group min-h-[210px]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                  {isOffGrid ? "BANCO BATERÍAS LiFePO4" : "ALMACENAMIENTO BESS"}
                  <button
                    type="button"
                    onClick={() => setActiveModalKey("bess")}
                    className="text-white/40 hover:text-emerald-400 transition-colors cursor-pointer"
                    title="¿Qué es esto? (Ver explicación sencilla)"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </span>
                <Battery className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              </div>
              <div className="text-2xl sm:text-3xl font-light font-mono text-white mb-1">
                {sizing.batteryKwh > 0 ? `${sizing.batteryKwh} kWh` : "Sin Baterías"}
              </div>
              <p className="text-xs text-white/60 font-light leading-snug">
                {isOffGrid
                  ? `Capacidad útil: ${sizing.usableBatteryKwh || Math.round(sizing.batteryKwh * 0.85)} kWh (DoD 90%) • 24/7`
                  : sizing.batteryKwh > 0
                  ? `Capacidad útil: ${sizing.usableBatteryKwh || Math.round(sizing.batteryKwh * 0.85)} kWh (DoD 90%)`
                  : "Inyección directa Ley Net Billing"}
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-white/10 text-[11px] font-mono flex items-center justify-between gap-1 flex-wrap">
              <span className={sizing.batteryKwh > 0 ? "text-white" : "text-emerald-400"}>
                {isOffGrid ? "Autonomía 24/7 Sin Red" : sizing.batteryKwh > 0 ? "Respaldo en cortes" : "On-Grid"}
              </span>
              <button
                onClick={() => setActiveModalKey("bess")}
                className="text-emerald-400 hover:underline text-[10px] cursor-pointer"
              >
                ¿Cómo funciona?
              </button>
            </div>
          </div>
        )}

        {/* Metric 3: Ahorro Anual & Peak Shaving */}
        <div className="p-5 sm:p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-lg flex flex-col justify-between relative group min-h-[210px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold flex items-center gap-1.5">
                {isB2B ? "AHORRO OPERACIONAL" : isOffGrid ? "AHORRO OPERACIONAL" : "AHORRO AÑO 1"}
                <button
                  type="button"
                  onClick={() => setActiveModalKey(isOffGrid ? "retorno" : isB2B ? "peakHours" : "netbilling")}
                  className="text-white/40 hover:text-blue-400 transition-colors cursor-pointer"
                  title="¿Qué es esto? (Ver explicación sencilla)"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </span>
              <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl lg:text-[22px] xl:text-2xl 2xl:text-3xl font-light font-mono text-white mb-1">
              {formatCurrency(sizing.estimatedAnnualSavingsClp)}
            </div>
            <p className="text-xs text-white/60 font-light leading-snug">
              {isOffGrid
                ? "Autonomía Solar Aislada 24/7 (Sin Red)"
                : isB2B && sizing.peakHourDemandSavingsClp
                ? `Autoconsumo ${sizing.autoconsumoPct}% + Peak Shaving`
                : `Autoconsumo ${sizing.autoconsumoPct}% + Excedentes`}
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-white/10 text-[10px] sm:text-[11px] text-blue-400 font-mono flex items-center justify-between gap-1 flex-wrap">
            <span>A 25 años: <strong className="text-white font-medium">{formatCurrency(sizing.estimated25YearSavingsClp)}</strong></span>
            <button
              onClick={() => setActiveModalKey(isOffGrid ? "retorno" : isB2B ? "peakHours" : "netbilling")}
              className="text-blue-400 hover:underline text-[10px] cursor-pointer"
            >
              ¿Cómo se calcula?
            </button>
          </div>
        </div>

        {/* Metric 4: Retorno Financiero & VAN */}
        <div className="p-5 sm:p-6 rounded-[24px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-lg flex flex-col justify-between relative group min-h-[210px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                {isB2B ? "RENTABILIDAD B2B" : isOffGrid ? "RETORNO & AUTONOMÍA" : "RETORNO & GARANTÍA"}
                <button
                  type="button"
                  onClick={() => setActiveModalKey("retorno")}
                  className="text-white/40 hover:text-amber-400 transition-colors cursor-pointer"
                  title="¿Qué es esto? (Ver explicación sencilla)"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </span>
              <Leaf className="w-5 h-5 text-amber-400 flex-shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-light font-mono text-white mb-1">
              {sizing.paybackYears} <span className="text-sm sm:text-base text-white/50">años</span>
            </div>
            <p className="text-xs text-white/60 font-light leading-snug">
              {isB2B 
                ? `TIR ${sizing.tirPercent}% • LCOE $${sizing.lcoeClpPerKwh || 45}/kWh`
                : isOffGrid
                ? `Garantía 25 Años • Independencia 100%`
                : `Garantía 25 Años • -${sizing.co2TonsAvoidedPerYear} Ton CO2`}
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-white/10 text-[10px] sm:text-[11px] text-amber-400 font-mono flex items-center justify-between gap-1 flex-wrap">
            <span>
              {isB2B ? (
                <>VAN (25 años): <strong className="text-white font-medium">{sizing.vanClp ? formatCurrency(sizing.vanClp) : "Positivo"}</strong></>
              ) : isOffGrid ? (
                <>Autonomía: <strong className="text-white font-medium">100% Aislada</strong></>
              ) : (
                <>Vida Útil: <strong className="text-white font-medium">30+ Años</strong></>
              )}
            </span>
            <button
              onClick={() => setActiveModalKey("retorno")}
              className="text-amber-400 hover:underline text-[10px] cursor-pointer"
            >
              ¿Cómo se paga?
            </button>
          </div>
        </div>
      </div>

      {/* PRESUPUESTO LLAVE EN MANO & Hitos 50/35/15 */}
      <div className="w-full">
        {/* Turnkey Pricing & Cashflow Milestones */}
        <div className="w-full p-6 sm:p-8 rounded-[24px] sm:rounded-[28px] bg-[#1F1F1F]/90 backdrop-blur-md border border-white/10 shadow-lg space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] font-semibold flex items-center gap-1.5">
                <Wallet className="w-4 h-4" />
                PRESUPUESTO LLAVE EN MANO
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mt-3 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs text-white/50 font-light block">Inversión Total Estimada (IVA incluído)</span>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  {formatCurrency(sizing.estimatedSystemCostIvaClp || Math.round((sizing.estimatedSystemCostNetoClp || 0) * 1.19))}
                </div>
              </div>
              <div className="sm:text-right">
                <span className="text-xs text-white/50 font-light block">Precio Neto</span>
                <span className="text-lg sm:text-xl font-mono text-[#FF8300] font-bold">
                  {formatCurrency(sizing.estimatedSystemCostNetoClp || 0)}
                </span>
                <span className="text-[11px] text-white/40 block font-mono">
                  ~{formatCurrency(Math.round((sizing.estimatedSystemCostNetoClp || 0) / Math.max(1, sizing.recommendedKwp)))} / kWp
                </span>
              </div>
            </div>

            {/* Deducciones tributarias corporativas B2B */}
            {isB2B && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between text-emerald-400 font-mono font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" />
                    Beneficios Tributarios para Empresas (B2B)
                  </span>
                  <span>Formulario 29 & LIR</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-white/80 font-mono text-[11px]">
                  <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                    <span className="text-white/40 block text-[10px]">(-) 19% IVA F29 Recuperable</span>
                    <span className="text-emerald-400 font-bold">-{formatCurrency(sizing.recoverableVatClp || Math.round((sizing.estimatedSystemCostNetoClp || 0) * 0.19))}</span>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                    <span className="text-white/40 block text-[10px]">(-) 5% Crédito Art. 33 bis LIR</span>
                    <span className="text-emerald-400 font-bold">-{formatCurrency(sizing.taxShieldArt33BisClp || Math.round((sizing.estimatedSystemCostNetoClp || 0) * 0.05))}</span>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-lg border border-emerald-500/30">
                    <span className="text-white/40 block text-[10px]">Costo Neto Efectivo</span>
                    <span className="text-white font-bold">{formatCurrency((sizing.estimatedSystemCostNetoClp || 0) - (sizing.taxShieldArt33BisClp || 0))}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 50 / 35 / 15 Milestones */}
            <div className="mt-5 space-y-3">
              <span className="text-[11px] font-mono text-white/60 uppercase tracking-wider block">
                Esquema de Cobranza por Hitos de Avance
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-black/40 border border-orange-500/30 space-y-1">
                  <div className="flex items-center justify-between text-[#FF8300] font-bold font-mono text-[11px]">
                    <span>1. Anticipo 50%</span>
                    <span>Firma</span>
                  </div>
                  <div className="text-sm font-black text-white font-mono">
                    {formatCurrency(sizing.downpaymentHito1Clp || Math.round((sizing.estimatedSystemCostNetoClp || 0) * 0.5))}
                  </div>
                  <p className="text-[10px] text-white/50 leading-tight">
                    {isOffGrid
                      ? "Reserva de Inversor Off-Grid, Paneles TOPCon, Baterías LiFePO4 y Gabinete."
                      : "Reserva y compra de Inversor, Paneles, Estructura y protecciones."}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-amber-500/30 space-y-1">
                  <div className="flex items-center justify-between text-amber-400 font-bold font-mono text-[11px]">
                    <span>2. En Obra 35%</span>
                    <span>Montaje</span>
                  </div>
                  <div className="text-sm font-black text-white font-mono">
                    {formatCurrency(sizing.faenaHito2Clp || Math.round((sizing.estimatedSystemCostNetoClp || 0) * 0.35))}
                  </div>
                  <p className="text-[10px] text-white/50 leading-tight">
                    {isOffGrid
                      ? "Montaje en techo/suelo, canalizaciones y banco de baterías LiFePO4."
                      : "Llegada a terreno, canalización Conduit EMT y montaje eléctrico."}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/30 space-y-1">
                  <div className="flex items-center justify-between text-emerald-400 font-bold font-mono text-[11px]">
                    <span>3. Final 15%</span>
                    <span>{isOffGrid ? "Puesta en Marcha & SEC" : "Certificación Netbilling"}</span>
                  </div>
                  <div className="text-sm font-black text-white font-mono">
                    {formatCurrency(sizing.finalHito3Clp || Math.round((sizing.estimatedSystemCostNetoClp || 0) * 0.15))}
                  </div>
                  <p className="text-[10px] text-white/50 leading-tight">
                    {isOffGrid
                      ? "Pruebas de autonomía 24/7 con baterías, calibración ATS y entrega SEC TE-1."
                      : "Puesta en marcha, entrega de carpeta SEC y cambio de medidor."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 text-[11px] text-white/50 font-light flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span>El precio es estimado y se ajustará según las condiciones de la instalación. Esta cotización tiene una validez de 15 días.</span>
            <span className="shrink-0">✓ Cero sobrecostos ocultos</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Chart: Generación Solar vs Consumo Real de tu Casa (Sur de Chile) */}
      {monthlyData.length > 0 && (
        <SolarSeasonalChart
          monthlyData={monthlyData}
          comuna={formData.comuna}
          distributor={formData.distributor}
          sizing={sizing}
          isOffGrid={isOffGrid}
        />
      )}

      {/* Spotlight: Tu Nueva Realidad Energética con Barra de Profundización / Saber Más */}
      <div className="w-full p-6 sm:p-8 rounded-[24px] sm:rounded-[28px] bg-gradient-to-r from-orange-950/30 via-[#1F1F1F] to-black border border-[#FF8300]/30 shadow-xl flex flex-col items-center justify-center text-center">
        <div className="space-y-3 flex flex-col items-center max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF8300]/10 border border-[#FF8300]/30 text-[#FF8300] text-xs font-mono font-medium">
            <Zap className="w-3.5 h-3.5" />
            <span>
              {isB2B 
                ? "IMPACTO ENERGÉTICO & FINANCIERO" 
                : isOffGrid
                ? "INDEPENDENCIA ENERGÉTICA TOTAL (OFF-GRID)"
                : "TU NUEVA REALIDAD ENERGÉTICA"}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-white tracking-tight">
            {isOffGrid ? (
              <>Electricidad continua y limpia <strong className="text-white font-medium">100% independiente de la red</strong>.</>
            ) : (
              <>Ahorras aproximadamente <strong className="text-white font-medium">{formatCurrency(sizing.estimatedAnnualSavingsClp)} al año</strong>.</>
            )}
          </h3>
          <p className="text-xs sm:text-sm text-white/60 font-light max-w-2xl mx-auto">
            {isOffGrid ? (
              <>Tu planta generará aproximadamente <strong className="text-white font-medium">{formatNumber(sizing.estimatedAnnualGenKwh)} kWh/año</strong> limpios en {formData.comuna}, abasteciendo tu predio de día con paneles y de noche con baterías LiFePO4, eliminando gastos continuos de combustible y ruido de motogenerador.</>
            ) : (
              <>Generarás aproximadamente <strong className="text-white font-medium">{formatNumber(sizing.estimatedAnnualGenKwh)} kWh/año</strong> limpios en tu techo en {formData.comuna}, reduciendo drásticamente tus cuentas eléctricas.</>
            )}
          </p>

          <button
            type="button"
            onClick={() => setIsServicesModalOpen(true)}
            className="mt-3 px-6 py-2.5 rounded-full border border-white/20 hover:border-[#FF8300] bg-white/5 hover:bg-[#FF8300]/10 text-white/90 hover:text-white text-xs font-light tracking-wide transition-all shadow-md hover:shadow-[0_0_20px_rgba(255,131,0,0.2)] flex items-center gap-2 cursor-pointer group"
          >
            <ShieldCheck className="w-4 h-4 text-[#FF8300] group-hover:scale-110 transition-transform" />
            <span>{isB2B ? "Ver Servicios de Ingeniería & Montaje B2B" : isOffGrid ? "Ver Servicios de Ingeniería Off-Grid" : "Ver Servicios Incluídos"}</span>
          </button>
        </div>
      </div>

      {/* Checklist del Proceso Llave en Mano (B2C vs B2B) */}
      <div className="p-5 sm:p-8 rounded-[24px] sm:rounded-[28px] bg-[#1A1A1A] border border-white/10 shadow-xl">
        <div className="mb-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-light text-white">
            {isB2B 
              ? "Checklist de Ingeniería & Tramitación SEC TE4 (B2B)" 
              : isOffGrid
              ? "Checklist del Proyecto Solar Aislado Off-Grid"
              : "Checklist del Proceso Residencial Llave en Mano"}
          </h3>
          <p className="text-xs text-white/60 font-light mt-1">
            {isB2B
              ? "Ruta auditada para proyectos comerciales, industriales y agrícolas con cumplimiento DFL 4/2006 y RIC."
              : isOffGrid
              ? "Ruta segura de ingeniería para dotar a tu parcela o cabaña de suministro eléctrico autónomo y certificado."
              : "Así es la ruta sin complicaciones para transformar tu casa o parcela en un hogar solar autosuficiente."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {(isB2B ? [
            {
              step: "01",
              title: "Pre-Informe B2B",
              desc: "Simulación de rendimiento, análisis tarifario y cálculo de beneficios tributarios.",
              status: "COMPLETADO",
              icon: FileCheck2,
            },
            {
              step: "02",
              title: "Estudio de Conexión",
              desc: "Inspección técnica de empalme, transformador y tramitación F1 ante distribuidora.",
              status: "SIGUIENTE PASO",
              icon: Calendar,
            },
            {
              step: "03",
              title: "Ingeniería de Detalle",
              desc: "Planos unilineales, memoria de cálculo y especificaciones técnicas aprobadas.",
              status: "PENDIENTE",
              icon: FileText,
            },
            {
              step: "04",
              title: "Montaje Industrial",
              desc: "Instalación de inversores trifásicos, canalizaciones y protecciones normalizadas.",
              status: "PENDIENTE",
              icon: Wrench,
            },
            {
              step: "05",
              title: "Inyección & TE4 SEC",
              desc: "Pruebas de puesta en marcha, medidor bidireccional y TE4 definitivo aprobado.",
              status: "PENDIENTE",
              icon: Award,
            },
          ] : isOffGrid ? [
            {
              step: "01",
              title: "Pre-Informe Off-Grid",
              desc: "Cálculo técnico con radiación local y banco LiFePO4 para autonomía total.",
              status: "COMPLETADO",
              icon: FileCheck2,
            },
            {
              step: "02",
              title: "Visita en Terreno",
              desc: "Inspección de sombras, sala técnica para baterías y conexión con generador auxiliar.",
              status: "SIGUIENTE PASO",
              icon: Calendar,
            },
            {
              step: "03",
              title: "Firma de Contrato",
              desc: "Presupuesto cerrado llave en mano sin costos ocultos y cronograma garantizado.",
              status: "PENDIENTE",
              icon: FileText,
            },
            {
              step: "04",
              title: "Montaje & Sala BESS",
              desc: "Instalación de paneles, inversor cargador, banco LiFePO4 y conmutación ATS.",
              status: "PENDIENTE",
              icon: Wrench,
            },
            {
              step: "05",
              title: "Puesta en Marcha & SEC",
              desc: "Pruebas de autonomía 24/7, programación ATS y carpeta técnica SEC TE-1.",
              status: "PENDIENTE",
              icon: Award,
            },
          ] : [
            {
              step: "01",
              title: "Pre-Informe Digital",
              desc: "Cálculo técnico con meteorología local y dimensionamiento preliminar de la planta solar.",
              status: "COMPLETADO",
              icon: FileCheck2,
            },
            {
              step: "02",
              title: "Visita en Terreno",
              desc: "Inspección de techos, sombras y empalme con Ingeniero.",
              status: "SIGUIENTE PASO",
              icon: Calendar,
            },
            {
              step: "03",
              title: "Firma de Contrato",
              desc: "Con la propuesta revisada y cuando estés listo para avanzar, te enviaremos el contrato.",
              status: "PENDIENTE",
              icon: FileText,
            },
            {
              step: "04",
              title: "Ejecución del Proyecto",
              desc: "Ingeniería de detalle, planos ejecutivos, montaje e instalación eléctrica.",
              status: "PENDIENTE",
              icon: Wrench,
            },
            {
              step: "05",
              title: "Proceso de Certificación SEC",
              desc: "Tramitación legal ante distribuidora y cambio/activación de medidor para Netbilling.",
              status: "PENDIENTE",
              icon: Award,
            },
          ]).map((item, i) => {
            const Icon = item.icon;
            const isCurrent = item.status === "SIGUIENTE PASO";
            const isDone = item.status === "COMPLETADO";

            return (
              <div
                key={i}
                className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? "bg-[#FF8300]/10 border-[#FF8300] shadow-lg shadow-[#FF8300]/10 scale-[1.01]"
                    : isDone
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-black/30 border-white/10 text-white/70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-white/40">{item.step}</span>
                    <Icon className={`w-4 h-4 ${isCurrent ? "text-[#FF8300]" : isDone ? "text-emerald-400" : "text-white/30"}`} />
                  </div>
                  <h4 className="text-sm font-medium text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-white/60 font-light leading-snug">{item.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-[10px] font-mono">
                  <span className={isCurrent ? "text-[#FF8300] font-bold" : isDone ? "text-emerald-400" : "text-white/30"}>
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Crédito Verde BancoEstado (If user selected credit) */}
      {sizing.financingSimulation && (
        <div className="p-5 sm:p-8 rounded-[24px] sm:rounded-[28px] bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-black border border-emerald-500/40 shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 flex-1 text-center md:text-left">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center justify-center md:justify-start gap-1.5">
                <Leaf className="w-4 h-4" />
                <span>Simulación Crédito Verde BancoEstado</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-light text-white">
                Cuota Mensual Estimada: <strong className="text-emerald-400 font-mono text-2xl sm:text-3xl font-medium">{formatCurrency(sizing.financingSimulation.valorCuota)}</strong>
              </h3>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-xs text-white/70 font-light">
                <span>RUT: {formData.rut}</span>
                <span className="hidden sm:inline text-white/30">•</span>
                <span>Monto Líquido: {formatCurrency(sizing.financingSimulation.montoLiquido)}</span>
                <span className="hidden sm:inline text-white/30">•</span>
                <span>{sizing.financingSimulation.numeroCuotas} Cuotas</span>
                <span className="hidden sm:inline text-white/30">•</span>
                <span>Tasa Mensual: {sizing.financingSimulation.tasaInteresMensual}%</span>
                <span className="hidden sm:inline text-white/30">•</span>
                <span>CAE: {sizing.financingSimulation.cae}%</span>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col gap-3 flex-shrink-0 no-print">
              <button
                type="button"
                className="w-full px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-light text-xs uppercase tracking-wide shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                onClick={() => alert("El PDF oficial de simulación se encuentra en proceso de extracción por parte de nuestros sistemas (RPA) y se adjuntará pronto a su portal.")}
              >
                <Download className="w-4 h-4" />
                <span>Descargar Simulación Oficial (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Technical Visit CTA Box */}
      <div className="w-full p-6 sm:p-10 md:p-12 rounded-[24px] sm:rounded-[28px] bg-gradient-to-br from-[#FF8300]/20 via-[#1F1F1F] to-[#141414] border border-[#FF8300]/40 shadow-2xl flex flex-col items-center justify-center text-center no-print">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FF8300] text-white flex items-center justify-center mb-4 shadow-lg shadow-[#FF8300]/30">
            <Calendar className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-normal text-white mb-2">
            Siguiente Paso: Visita en Terreno
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-white/70 font-light leading-relaxed mb-6 max-w-xl mx-auto">
            Un Ingeniero te contactará para coordinar una Visita Técnica en tu propiedad en {formData.comuna}, también puedes adelantarte y coordinarla en el siguiente botón:
          </p>

          <button
            type="button"
            onClick={() => openModal()}
            className="w-full max-w-lg mx-auto py-3.5 sm:py-4 px-8 rounded-full bg-[#FF8300] hover:bg-[#e07400] text-white font-medium text-xs md:text-sm uppercase tracking-wider transition-all duration-300 shadow-xl shadow-[#FF8300]/25 cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>Agendar Visita Técnica</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Secondary Actions: Volver & Crear Nueva Cotización */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-5 w-full max-w-lg mx-auto">
            <button
              type="button"
              onClick={onBack || onReset}
              className="px-5 py-2.5 rounded-full border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-light tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="px-5 py-2.5 rounded-full border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-light tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Crear Nueva Cotización</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preguntas Frecuentes (FAQ) */}
      <div className="w-full p-6 sm:p-10 rounded-[24px] sm:rounded-[28px] bg-[#1A1A1A] border border-white/10 shadow-xl space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-6 sm:mb-8">
          <h3 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            {isB2B 
              ? "Preguntas Frecuentes para Empresas & C&I" 
              : isOffGrid
              ? "Preguntas Frecuentes: Sistemas Solares Aislados (Off-Grid)"
              : "Preguntas Frecuentes"}
          </h3>
          <p className="text-xs sm:text-sm text-white/60 font-light">
            {isB2B 
              ? "Respuestas técnicas, regulatorias y tributarias para proyectos solares comerciales e industriales."
              : isOffGrid
              ? "Todo lo que necesitas saber sobre vivir 100% desconectado de la red con baterías LiFePO4 en el Sur de Chile."
              : "Todo lo que necesitas saber antes de dar el paso hacia la energía solar en tu hogar."}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {(isB2B ? B2B_FAQS : isOffGrid ? B2C_OFFGRID_FAQS : B2C_FAQS).map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer transition-colors"
                >
                  <span className="text-sm sm:text-base font-medium text-white pr-4 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "bg-[#FF8300]/20 text-[#FF8300] rotate-180"
                        : "bg-white/5 text-white/50"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-sm sm:text-base text-white/70 font-light leading-relaxed border-t border-white/5 mt-1">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanatory Modal Dialog ("Con peras y manzanas") */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-8 rounded-[28px] bg-[#1F1F1F] border border-white/15 shadow-2xl relative text-white space-y-6"
            >
              <button
                onClick={() => setActiveModalKey(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] font-semibold block mb-1">
                  {activeModal.subtitle}
                </span>
                <h3 className="text-xl md:text-2xl font-light text-white leading-snug">
                  {activeModal.title}
                </h3>
              </div>

              {/* Analogy Box */}
              <div className="p-4 rounded-2xl bg-[#FF8300]/10 border border-[#FF8300]/30 text-xs md:text-sm text-white/90 font-light leading-relaxed">
                💡 <strong>{isB2B ? "Resumen Financiero Ejecutivo:" : isOffGrid ? "Resumen Técnico Off-Grid:" : "En palabras simples:"}</strong> {activeModal.analogy}
              </div>

              {/* Details List */}
              <div className="space-y-2.5">
                {activeModal.details.map((det: string, dIdx: number) => (
                  <div key={dIdx} className="flex items-start gap-2 text-xs text-white/70 font-light">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{det}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveModalKey(null)}
                  className="px-6 py-2.5 rounded-full bg-white text-black text-xs uppercase tracking-wider font-light hover:bg-[#FF8300] hover:text-white transition-all cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Servicios Incluídos en el Proyecto (B2C vs B2B vs Off-Grid) */}
      <AnimatePresence>
        {isServicesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl max-h-[90vh] flex flex-col p-6 sm:p-8 rounded-[28px] bg-[#1A1A1A] border border-white/15 shadow-2xl relative text-white"
            >
              <button
                onClick={() => setIsServicesModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="mb-6 pr-8">
                <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] font-semibold flex items-center gap-1.5 mb-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isB2B 
                      ? "PROYECTO SOLAR C&I LLAVE EN MANO" 
                      : isOffGrid
                      ? "PROYECTO SOLAR AISLADO OFF-GRID LLAVE EN MANO"
                      : "PROYECTO SOLAR RESIDENCIAL LLAVE EN MANO"}
                  </span>
                </span>
                <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight">
                  {isB2B 
                    ? "Servicios de Ingeniería & Montaje Corporativo" 
                    : isOffGrid
                    ? "Servicios de Ingeniería Aislada & Montaje Off-Grid"
                    : "Servicios Incluídos en tu Proyecto"}
                </h3>
                <p className="text-xs sm:text-sm text-white/60 font-light mt-1 leading-relaxed">
                  {isB2B 
                    ? "Solución integral para empresas: ingeniería de detalle, tramitación SEC TE-4, montaje industrial y respaldo tributario."
                    : isOffGrid
                    ? "Solución autónoma completa: dimensionamiento con radiación invernal, banco de baterías LiFePO4, inversor conmutador ATS y soporte en terreno."
                    : "Con SoldeRío no compras solo equipos: obtienes una solución integral garantizada de inicio a fin."}
                </p>
              </div>

              {/* Body: List of services */}
              <div className="overflow-y-auto pr-1 space-y-3 flex-1 max-h-[55vh]">
                {(isB2B ? B2B_INCLUDED_SERVICES : isOffGrid ? B2C_OFFGRID_INCLUDED_SERVICES : B2C_INCLUDED_SERVICES).map((serv, sIdx) => {
                  const Icon = serv.icon;
                  return (
                    <div
                      key={sIdx}
                      className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-[#FF8300]/40 transition-colors flex items-start gap-3.5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#FF8300]/10 border border-[#FF8300]/25 flex items-center justify-center text-[#FF8300] flex-shrink-0 mt-0.5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h4 className="text-sm font-medium text-white">{serv.title}</h4>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {serv.badge}
                          </span>
                        </div>
                        <p className="text-xs text-white/70 font-light leading-relaxed">
                          {serv.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="pt-5 mt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-white/50 font-light text-center sm:text-left">
                  {isB2B 
                    ? "✓ Cumplimiento DFL 4/2006, Pliegos RIC SEC y respaldo contable F29." 
                    : isOffGrid
                    ? "✓ Cumplimiento Pliegos RIC SEC RIC N°09/10 y respaldo técnico local en el Sur de Chile."
                    : "✓ Estándar SEC y garantía directa en el Sur de Chile."}
                </span>
                <button
                  type="button"
                  onClick={() => setIsServicesModalOpen(false)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#FF8300] hover:bg-[#e07400] text-white text-xs font-medium tracking-wider uppercase transition-all shadow-md cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

