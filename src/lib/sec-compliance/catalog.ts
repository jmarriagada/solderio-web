export interface SecItemTemplate {
  code: string
  stageNumber: number
  stageTitle: string
  title: string
  description: string
}

export const SEC_STAGES = [
  {
    stageNumber: 1,
    title: 'Etapa 1: Factibilidad & Solicitud Distribuidora (F1 / F3)',
    description: 'Antecedentes legales, solicitud formal Ley 20.571 e Informe de Criterios de Conexión (ICC / F4).',
  },
  {
    stageNumber: 2,
    title: 'Etapa 2: Expediente Técnico de Ingeniería (TE4)',
    description: 'Memorias de cálculo (caídas V DC/AC, protecciones), planos unilineales y certificados SEC de equipos.',
  },
  {
    stageNumber: 3,
    title: 'Etapa 3: Protocolos de Ensayos & Pruebas en Terreno',
    description: 'Medición de Malla de Puesta a Tierra, megado de aislamiento, continuidad y ajustes de protecciones.',
  },
  {
    stageNumber: 4,
    title: 'Etapa 4: Declaración & Obtención Folio TE4 SEC',
    description: 'Ingreso en plataforma e-Declarador de la SEC y tramitación hasta obtención de Folio oficial.',
  },
  {
    stageNumber: 5,
    title: 'Etapa 5: Contrato F5, Cambio de Medidor & Puesta en Servicio (F6)',
    description: 'Notificación F5, firma de contrato de inyección, pruebas en terreno con distribuidora y firma F6.',
  },
]

export const SEC_CHECKLIST_TEMPLATES: SecItemTemplate[] = [
  // ETAPA 1
  {
    code: 'DOC_LEGAL_CLIENTE',
    stageNumber: 1,
    stageTitle: 'Etapa 1: Factibilidad & Distribuidora',
    title: 'Cédula de Identidad / Poder Notarial del Titular',
    description: 'Copia de RUT del titular del empalme y personería legal si es persona jurídica.',
  },
  {
    code: 'DOMINIO_VIGENTE_BOLETA',
    stageNumber: 1,
    stageTitle: 'Etapa 1: Factibilidad & Distribuidora',
    title: 'Título de Dominio Vigente y Última Boleta SAESA/Frontel',
    description: 'Certificado de dominio vigente (< 30 días) o contrato de arriendo autorizado, más boleta de luz con N° de cliente.',
  },
  {
    code: 'FORMULARIO_F3',
    stageNumber: 1,
    stageTitle: 'Etapa 1: Factibilidad & Distribuidora',
    title: 'Ingreso de Solicitud de Conexión (Formulario F3)',
    description: 'Solicitud formal de conexión bajo Ley 20.571/21.118 ante la empresa distribuidora.',
  },
  {
    code: 'ICC_F4_APROBACION',
    stageNumber: 1,
    stageTitle: 'Etapa 1: Factibilidad & Distribuidora',
    title: 'Aprobación Técnica / Informe de Criterios de Conexión (ICC / F4)',
    description: 'Respuesta favorable de la distribuidora confirmando capacidad del transformador y condiciones de conexión.',
  },

  // ETAPA 2
  {
    code: 'MEMORIA_CALCULO_TE4',
    stageNumber: 2,
    stageTitle: 'Etapa 2: Expediente Técnico TE4',
    title: 'Memoria Explicativa y Memoria de Cálculo Eléctrico',
    description: 'Cálculo de caídas de tensión (DC ≤ 1.5%, AC ≤ 3%), dimensionamiento de protecciones, fusibles, DPS y Malla PAT.',
  },
  {
    code: 'PLANO_UNILINEAL_SEC',
    stageNumber: 2,
    stageTitle: 'Etapa 2: Expediente Técnico TE4',
    title: 'Plano Eléctrico & Diagrama Unilineal Normalizado SEC',
    description: 'Planos formato SEC con cuadro de cargas y especificaciones técnicas, firmado por Instalador Clase A o B.',
  },
  {
    code: 'CERT_SEC_INVERSOR',
    stageNumber: 2,
    stageTitle: 'Etapa 2: Expediente Técnico TE4',
    title: 'Certificado de Homologación SEC del Inversor (Anti-Isla)',
    description: 'Certificado oficial emitido por organismo acreditado SEC que valida función anti-isla e interconexión.',
  },
  {
    code: 'CERT_SEC_PANELES',
    stageNumber: 2,
    stageTitle: 'Etapa 2: Expediente Técnico TE4',
    title: 'Certificados de Paneles Fotovoltaicos (IEC 61215 / IEC 61730)',
    description: 'Fichas técnicas y certificados de calidad de los módulos fotovoltaicos seleccionados.',
  },

  // ETAPA 3
  {
    code: 'PROTOCOLO_PAT',
    stageNumber: 3,
    stageTitle: 'Etapa 3: Protocolos de Ensayos',
    title: 'Protocolo de Medición de Malla de Puesta a Tierra (PAT)',
    description: 'Medición con telurómetro calibrado certificando resistencia de tierra (≤ 20 Ω o valor de memoria).',
  },
  {
    code: 'PROTOCOLO_AISLAMIENTO_MEGADO',
    stageNumber: 3,
    stageTitle: 'Etapa 3: Protocolos de Ensayos',
    title: 'Protocolo de Resistencia de Aislamiento (Megado DC y AC)',
    description: 'Ensayo de aislamiento con megóhmetro entre conductores activos y tierra a tensión de prueba normalizada.',
  },
  {
    code: 'PROTOCOLO_CONTINUIDAD_ESTRUCTURAS',
    stageNumber: 3,
    stageTitle: 'Etapa 3: Protocolos de Ensayos',
    title: 'Protocolo de Continuidad de Masas y Equipotencialidad',
    description: 'Verificación de unión equipotencial entre marcos de paneles, rieles de montaje y barra de tierra.',
  },

  // ETAPA 4
  {
    code: 'INGRESO_EDECLARADOR_SEC',
    stageNumber: 4,
    stageTitle: 'Etapa 4: Declaración SEC TE4',
    title: 'Carga Digital de Expediente en e-Declarador SEC',
    description: 'Subida de toda la documentación técnica por parte del Instalador Eléctrico Autorizado SEC.',
  },
  {
    code: 'FOLIO_TE4_APROBADO',
    stageNumber: 4,
    stageTitle: 'Etapa 4: Declaración SEC TE4',
    title: 'Obtención y Descarga del Certificado Folio TE4 Aprobado',
    description: 'Certificado final de inscripción de la instalación emitido por la Superintendencia de Electricidad y Combustibles.',
  },

  // ETAPA 5
  {
    code: 'NOTIFICACION_F5_DISTRIBUIDORA',
    stageNumber: 5,
    stageTitle: 'Etapa 5: Conexión & Puesta en Servicio',
    title: 'Notificación de Conexión a Distribuidora (Formulario F5 + TE4)',
    description: 'Entrega formal del Folio TE4 y Formulario F5 a SAESA/Frontel solicitando inspección y puesta en servicio.',
  },
  {
    code: 'CONTRATO_INYECCION_FIRMADO',
    stageNumber: 5,
    stageTitle: 'Etapa 5: Conexión & Puesta en Servicio',
    title: 'Firma de Contrato de Conexión e Inyección Net Billing',
    description: 'Contrato de suministro e inyección de excedentes pactado formalmente entre distribuidora y cliente.',
  },
  {
    code: 'CAMBIO_MEDIDOR_BIDIRECCIONAL',
    stageNumber: 5,
    stageTitle: 'Etapa 5: Conexión & Puesta en Servicio',
    title: 'Inspección en Terreno & Cambio/Parametrización de Medidor Bidireccional',
    description: 'Pruebas conjuntas de corte por anti-isla con la distribuidora e instalación del medidor de 4 cuadrantes.',
  },
  {
    code: 'ACTA_PUESTA_SERVICIO_F6',
    stageNumber: 5,
    stageTitle: 'Etapa 5: Conexión & Puesta en Servicio',
    title: 'Firma de Acta de Puesta en Servicio Definitiva (Formulario F6)',
    description: 'Autorización oficial para iniciar la generación e inyección continua de energía a la red eléctrica.',
  },
]
