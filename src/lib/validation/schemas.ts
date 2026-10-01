import { z } from "zod";
import {
  sanitizeString,
  sanitizeMultilineText,
  sanitizePhone,
  sanitizeRut,
  sanitizeFilename,
} from "../sanitizer";

/**
 * Esquema de validación y sanitización para el Cotizador Solar (/api/cotizacion)
 */
export const quoteFormSchema = z.object({
  fullName: z
    .string({ required_error: "Nombre completo es requerido" })
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(80, "El nombre no puede exceder 80 caracteres")
    .transform((val) => sanitizeString(val, 80)),

  whatsapp: z
    .string({ required_error: "Teléfono o WhatsApp es requerido" })
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .max(25, "El teléfono no puede exceder 25 caracteres")
    .transform((val) => sanitizePhone(val)),

  email: z
    .string({ required_error: "Correo electrónico es requerido" })
    .email("Formato de correo electrónico inválido")
    .max(100, "El correo no puede exceder 100 caracteres")
    .transform((val) => sanitizeString(val.toLowerCase(), 100)),

  comuna: z
    .string({ required_error: "Comuna es requerida" })
    .max(60, "Comuna inválida")
    .transform((val) => sanitizeString(val, 60)),

  region: z
    .string()
    .max(60, "Región inválida")
    .optional()
    .transform((val) => (val ? sanitizeString(val, 60) : "Región de Los Lagos")),

  address: z
    .string()
    .max(200, "La dirección no puede exceder 200 caracteres")
    .optional()
    .transform((val) => (val ? sanitizeString(val, 200) : "")),

  propertyType: z
    .enum(["residencial", "parcela", "comercial", "agricola"])
    .catch("residencial"),

  systemType: z
    .enum(["hibrida", "ongrid", "offgrid"])
    .optional(),

  distributor: z
    .enum(["saesa", "crell", "cge", "frontel", "edelaysen", "otra"])
    .catch("saesa"),

  hasPhases: z
    .enum(["monofasico", "trifasico", "desconoce"])
    .catch("monofasico"),

  consumptionMode: z
    .enum(["monthly_bill_clp", "annual_kwh", "monthly_kwh"])
    .optional()
    .default("monthly_bill_clp"),

  monthlyBillClp: z
    .number()
    .min(0, "Monto de boleta debe ser positivo")
    .max(100_000_000, "Monto de boleta excede el límite permitido")
    .catch(120_000),

  annualKwh: z
    .number()
    .min(0)
    .max(1_000_000)
    .optional(),

  monthlyKwhBreakdown: z
    .array(z.number().min(0).max(100_000))
    .optional(),

  batteryObjectives: z
    .array(z.string().transform((s) => sanitizeString(s, 50)))
    .optional(),

  roofType: z
    .enum(["inclinado", "plano", "suelo"])
    .optional(),

  roofMaterial: z
    .string()
    .max(60)
    .optional()
    .transform((val) => (val ? sanitizeString(val, 60) : undefined)),

  includeEvCharger: z
    .boolean()
    .optional()
    .default(false),

  backupPriority: z
    .enum(["cargas_criticas", "hogar_completo", "solo_ahorro"])
    .catch("cargas_criticas"),

  omPackage: z
    .enum(["basic", "essential", "total_guard"])
    .optional(),

  rut: z
    .string()
    .max(15)
    .optional()
    .transform((val) => (val ? sanitizeRut(val) : undefined)),

  financingSplit: z
    .enum(["100_cash", "50_50", "100_credit", "custom"])
    .optional(),

  creditAmountClp: z
    .number()
    .optional(),

  creditInstallments: z
    .number()
    .optional(),

  creditInsurance: z
    .enum(["con_seguro", "sin_seguro"])
    .optional(),

  acceptTerms: z
    .boolean()
    .optional()
    .default(true),

  billFile: z
    .object({
      name: z.string().transform((n) => sanitizeFilename(n, 120)),
      size: z.number().max(20 * 1024 * 1024, "Archivo excede 20MB"),
      type: z.string().transform((t) => sanitizeString(t, 50)),
      dataUrl: z.string().optional(),
    })
    .nullable()
    .optional(),

  // Campo Honeypot invisible para bots (debe venir vacío)
  website_url: z.string().optional(),
});

/**
 * Esquema de validación y sanitización para Agendamiento de Visitas Técnicas (/api/visita-tecnica)
 */
export const visitaFormSchema = z.object({
  nombre: z
    .string({ required_error: "Nombre completo es requerido" })
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(80, "El nombre no puede exceder 80 caracteres")
    .transform((val) => sanitizeString(val, 80)),

  telefono: z
    .string({ required_error: "Teléfono de contacto es requerido" })
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .max(25, "El teléfono no puede exceder 25 caracteres")
    .transform((val) => sanitizePhone(val)),

  email: z
    .string({ required_error: "Correo electrónico es requerido" })
    .email("Formato de correo electrónico inválido")
    .max(100, "El correo no puede exceder 100 caracteres")
    .transform((val) => sanitizeString(val.toLowerCase(), 100)),

  region: z
    .string()
    .max(60, "Región inválida")
    .default("Región de Los Lagos")
    .transform((val) => sanitizeString(val, 60)),

  comuna: z
    .string({ required_error: "Comuna es requerida" })
    .max(60, "Comuna inválida")
    .transform((val) => sanitizeString(val, 60)),

  direccion: z
    .string()
    .max(200, "La dirección no puede exceder 200 caracteres")
    .optional()
    .transform((val) => (val ? sanitizeString(val, 200) : "")),

  latitud: z
    .number()
    .min(-90)
    .max(90)
    .nullable()
    .optional(),

  longitud: z
    .number()
    .min(-180)
    .max(180)
    .nullable()
    .optional(),

  coordenadasTexto: z
    .string()
    .max(80)
    .optional()
    .transform((val) => (val ? sanitizeString(val, 80) : "")),

  tipoPropiedad: z
    .string()
    .max(50)
    .optional()
    .transform((val) => (val ? sanitizeString(val, 50) : "Parcela")),

  montoBoleta: z
    .string()
    .max(50)
    .optional()
    .transform((val) => (val ? sanitizeString(val, 50) : "100.000 - 200.000")),

  fechaSeleccionada: z
    .string({ required_error: "Fecha de visita es requerida" })
    .max(50)
    .transform((val) => sanitizeString(val, 50)),

  fechaIso: z
    .string()
    .max(20)
    .optional()
    .transform((val) => (val ? sanitizeString(val, 20) : undefined)),

  bloqueHorario: z
    .enum(["manana", "tarde"])
    .catch("manana"),

  notas: z
    .string()
    .max(500, "Las notas no pueden exceder 500 caracteres")
    .optional()
    .transform((val) => (val ? sanitizeMultilineText(val, 500) : "")),

  folio: z
    .string()
    .max(50)
    .optional()
    .transform((val) => (val ? sanitizeString(val, 50) : undefined)),

  acceptTerms: z
    .boolean()
    .optional()
    .default(true),

  // Campo Honeypot invisible para bots (debe venir vacío)
  website_url: z.string().optional(),
});

/**
 * Esquema de validación y sanitización para Postulaciones Laborales (/api/trabaja-con-nosotros)
 */
export const trabajaFormSchema = z.object({
  nombre: z
    .string({ required_error: "Nombre completo es requerido" })
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(80, "El nombre no puede exceder 80 caracteres")
    .transform((val) => sanitizeString(val, 80)),

  email: z
    .string({ required_error: "Correo electrónico es requerido" })
    .email("Formato de correo electrónico inválido")
    .max(100, "El correo no puede exceder 100 caracteres")
    .transform((val) => sanitizeString(val.toLowerCase(), 100)),

  telefono: z
    .string({ required_error: "Teléfono de contacto es requerido" })
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .max(25, "El teléfono no puede exceder 25 caracteres")
    .transform((val) => sanitizePhone(val)),

  cargo: z
    .string({ required_error: "Cargo es requerido" })
    .max(80, "Cargo no puede exceder 80 caracteres")
    .transform((val) => sanitizeString(val, 80)),

  comuna: z
    .string()
    .max(60, "Comuna no puede exceder 60 caracteres")
    .optional()
    .transform((val) => (val ? sanitizeString(val, 60) : "")),

  linkedin: z
    .string()
    .max(200, "Enlace de LinkedIn no puede exceder 200 caracteres")
    .optional()
    .transform((val) => (val ? sanitizeString(val, 200) : "")),

  mensaje: z
    .string()
    .max(1000, "El mensaje no puede exceder 1000 caracteres")
    .optional()
    .transform((val) => (val ? sanitizeMultilineText(val, 1000) : "")),

  cvFile: z
    .object({
      name: z.string().transform((n) => sanitizeFilename(n, 120)),
      size: z.number().max(10 * 1024 * 1024, "El archivo excede el límite de 10 MB"),
      type: z
        .string()
        .refine(
          (t) =>
            [
              "application/pdf",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "application/msword",
              "binary/octet-stream",
              "application/octet-stream",
            ].includes(t) || t === "",
          "Tipo de archivo no permitido. Solo se aceptan PDF o Word (.docx, .doc)"
        )
        .transform((t) => sanitizeString(t, 50)),
      dataUrl: z.string().optional(),
    })
    .nullable()
    .optional(),

  acceptTerms: z
    .boolean()
    .optional()
    .default(true),

  // Campo Honeypot invisible para bots (debe venir vacío)
  website_url: z.string().optional(),
});

