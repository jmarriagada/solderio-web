import React from "react";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { QuoteSummaryEmail } from "@/emails/QuoteSummaryEmail";
import { VisitaTecnicaConfirmationEmail } from "@/emails/VisitaTecnicaConfirmationEmail";
import { SolarSizingResult } from "@/types/cotizacion";
import { validateAndNormalizeEmail } from "./email-validator";
import {
  CalendarEventParams,
  generateIcsContent,
  generateCalendarLinks,
  buildEventDetails,
} from "./calendar-generator";

// Official sender address configured with SPF/DKIM on solderio.cl
const DEFAULT_SENDER = "SoldeRio Energia <contacto@solderio.cl>";
const REPLY_TO = "contacto@solderio.cl";

export interface SendQuoteReportParams {
  to: string;
  fullName: string;
  comuna: string;
  distributor?: string;
  systemType?: string;
  leadId: string;
  sizing: SolarSizingResult;
  portalUrl?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  simulated?: boolean;
  diagnostic?: {
    apiKeyConfigured: boolean;
    sender: string;
    recipient: string;
  };
}

/**
 * Sends transactional quote summary email using Resend and React Email.
 */
export async function sendQuoteReportEmail(
  params: SendQuoteReportParams
): Promise<SendEmailResult> {
  const { to, fullName, comuna, distributor, systemType, leadId, sizing, portalUrl } = params;

  // 1. Email format & anti-disposable validation
  const validation = validateAndNormalizeEmail(to);
  if (!validation.isValid) {
    console.warn(`[Mailer] Envío cancelado: correo inválido "${to}". Motivo: ${validation.error}`);
    return {
      success: false,
      error: validation.error || "Correo inválido.",
      diagnostic: {
        apiKeyConfigured: !!process.env.RESEND_API_KEY,
        sender: process.env.SENDER_EMAIL?.trim() || DEFAULT_SENDER,
        recipient: to,
      },
    };
  }

  const validRecipient = validation.normalizedEmail;

  // 2. Dynamic evaluation of API Key per request
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const sender = process.env.SENDER_EMAIL?.trim() || DEFAULT_SENDER;

  if (!apiKey) {
    console.warn(
      `[Mailer: Modo Simulación] RESEND_API_KEY no detectada en environment de Vercel. Correo para ${validRecipient} (Lead: ${leadId}) no enviado físicamente.`
    );
    return {
      success: false,
      simulated: true,
      error: "RESEND_API_KEY no está configurada en las variables de entorno de Vercel.",
      diagnostic: {
        apiKeyConfigured: false,
        sender,
        recipient: validRecipient,
      },
    };
  }

  const resend = new Resend(apiKey);
  const subject = `Tu Propuesta Solar Fotovoltaica en ${comuna} (ID: ${leadId}) | SoldeRío`;

  try {
    const emailHtml = await render(
      React.createElement(QuoteSummaryEmail, {
        fullName,
        leadId,
        comuna,
        distributor,
        systemType,
        sizing,
        portalUrl: portalUrl || `https://solderio.cl/cotizacion?leadId=${leadId}`,
      })
    );

    const { data, error } = await resend.emails.send({
      from: sender,
      to: [validRecipient],
      replyTo: REPLY_TO,
      subject: subject,
      html: emailHtml,
      headers: {
        // RFC 8058 One-Click Unsubscribe headers required by Google & Yahoo since 2024
        "List-Unsubscribe": `<mailto:${REPLY_TO}?subject=Unsubscribe%20${leadId}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "X-Entity-Ref-ID": leadId,
      },
    });

    if (error) {
      console.error(`[Mailer Error] Fallo en Resend API para ${validRecipient}:`, error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log(`[Mailer Éxito] Correo enviado a ${validRecipient}. Resend Message ID: ${data?.id}`);
    return {
      success: true,
      messageId: data?.id,
    };
  } catch (err: any) {
    console.error(`[Mailer Excepción] Error inesperado al enviar a ${validRecipient}:`, err);
    return {
      success: false,
      error: err?.message || "Error desconocido al procesar el envío.",
    };
  }
}

export interface SendVisitaTecnicaParams extends CalendarEventParams {
  fechaTexto?: string;
  tipoPropiedad?: string;
}

/**
 * Sends official appointment confirmation email with RFC 5545 .ics calendar attachment
 * and 1-click calendar links for Google / Outlook / Apple Calendar.
 */
export async function sendVisitaTecnicaEmail(
  params: SendVisitaTecnicaParams
): Promise<SendEmailResult> {
  const {
    email,
    nombre,
    telefono,
    direccion,
    comuna,
    region,
    coordenadasTexto,
    fechaIso,
    fechaTexto,
    bloqueHorario,
    tipoPropiedad,
    folio,
    latitud,
    longitud,
  } = params;

  // 1. Email validation & anti-abuse shield
  const validation = validateAndNormalizeEmail(email);
  if (!validation.isValid) {
    console.warn(
      `[Mailer Visita] Envío cancelado: correo inválido "${email}". Motivo: ${validation.error}`
    );
    return {
      success: false,
      error: validation.error || "Correo inválido.",
      diagnostic: {
        apiKeyConfigured: !!process.env.RESEND_API_KEY,
        sender: process.env.SENDER_EMAIL?.trim() || DEFAULT_SENDER,
        recipient: email,
      },
    };
  }

  const validRecipient = validation.normalizedEmail;
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const sender = process.env.SENDER_EMAIL?.trim() || DEFAULT_SENDER;

  if (!apiKey) {
    console.warn(
      `[Mailer Visita: Modo Simulación] RESEND_API_KEY no detectada. Correo de visita para ${validRecipient} (Folio: ${folio}) simulado.`
    );
    return {
      success: false,
      simulated: true,
      error: "RESEND_API_KEY no está configurada.",
      diagnostic: {
        apiKeyConfigured: false,
        sender,
        recipient: validRecipient,
      },
    };
  }

  const resend = new Resend(apiKey);

  try {
    // 2. Generate iCalendar (RFC 5545) content and 1-click URLs
    const icsString = generateIcsContent(params);
    const calendarUrls = generateCalendarLinks(params);
    const { mapsLink, blockLabel } = buildEventDetails(params);

    // 3. Render HTML template
    const emailHtml = await render(
      React.createElement(VisitaTecnicaConfirmationEmail, {
        folio,
        nombre,
        telefono,
        email: validRecipient,
        direccion,
        comuna,
        region,
        coordenadasTexto,
        fechaTexto: fechaTexto || fechaIso,
        bloqueHorarioTexto: blockLabel,
        tipoPropiedad: tipoPropiedad || "Parcela",
        googleCalendarUrl: calendarUrls.google,
        outlookCalendarUrl: calendarUrls.outlook,
        mapsUrl: mapsLink,
      })
    );

    // 4. Dispatch with Resend + .ics attachment
    const { data, error } = await resend.emails.send({
      from: sender,
      to: [validRecipient],
      replyTo: REPLY_TO,
      subject: `Visita Técnica Agendada en ${comuna} (Folio: ${folio}) | SoldeRío Energía`,
      html: emailHtml,
      attachments: [
        {
          filename: `visita-tecnica-${folio}.ics`,
          content: Buffer.from(icsString, "utf-8").toString("base64"),
        },
      ],
      headers: {
        "List-Unsubscribe": `<mailto:${REPLY_TO}?subject=Cancelar%20Visita%20${folio}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "X-Entity-Ref-ID": folio,
      },
    });

    if (error) {
      console.error(
        `[Mailer Visita Error] Fallo en Resend API para ${validRecipient}:`,
        error
      );
      return {
        success: false,
        error: error.message,
      };
    }

    console.log(
      `[Mailer Visita Éxito] Correo de visita enviado a ${validRecipient}. Resend ID: ${data?.id}`
    );
    return {
      success: true,
      messageId: data?.id,
    };
  } catch (err: any) {
    console.error(
      `[Mailer Visita Excepción] Error inesperado al enviar a ${validRecipient}:`,
      err
    );
    return {
      success: false,
      error: err?.message || "Error desconocido al procesar el envío.",
    };
  }
}

