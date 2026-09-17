import { Resend } from "resend";
import { QuoteFormData, SolarSizingResult } from "@/types/cotizacion";

const DEFAULT_INTERNAL_EMAIL = "contacto@solderio.cl";
const DEFAULT_INTERNAL_SENDER = "SoldeRio Notificaciones <notificaciones@solderio.cl>";

function cleanPhoneNumber(phone: string): string {
  let cleaned = (phone || "").replace(/[^0-9]/g, "");
  if (cleaned.startsWith("9") && cleaned.length === 9) {
    cleaned = "56" + cleaned;
  } else if (!cleaned.startsWith("56") && cleaned.length > 8) {
    cleaned = "56" + cleaned;
  }
  return cleaned;
}

function formatCLP(val: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(val || 0);
}

/**
 * Envía un mensaje directo a Telegram usando Bot API con formato HTML.
 */
export async function sendTelegramMessage(htmlMessage: string): Promise<{ success: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!botToken || !chatId) {
    console.log(
      "[Telegram Notifier] TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no configurados en variables de entorno. Omitiendo notificación Telegram."
    );
    return { success: false, error: "Credenciales de Telegram no configuradas." };
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: "HTML",
        disable_web_page_preview: false,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      console.error("[Telegram Notifier Error]:", data);
      return { success: false, error: data.description || "Error de API Telegram." };
    }

    console.log("[Telegram Notifier] Mensaje enviado con éxito al chat", chatId);
    return { success: true };
  } catch (err: any) {
    console.error("[Telegram Notifier Exception]:", err);
    return { success: false, error: err?.message || String(err) };
  }
}

/**
 * Notificación interna para un NUEVO LEAD DE COTIZACIÓN
 * (Telegram + Correo interno al equipo)
 */
export async function notifyInternalQuoteLead(params: {
  leadId: string;
  formData: QuoteFormData;
  sizingResult: SolarSizingResult;
  portalUrl: string;
}): Promise<{ telegram: any; email: any }> {
  const { leadId, formData, sizingResult, portalUrl } = params;
  const cleanPhone = cleanPhoneNumber(formData.whatsapp);

  // 1. TELEGRAM
  const telegramHtml = `⚡ <b>NUEVO LEAD DE COTIZACIÓN SOLAR</b>
━━━━━━━━━━━━━━━━━━━━━
👤 <b>Cliente:</b> ${formData.fullName}
📱 <b>WhatsApp:</b> <a href="https://wa.me/${cleanPhone}">+${cleanPhone}</a>
✉️ <b>Email:</b> <a href="mailto:${formData.email}">${formData.email}</a>
📍 <b>Ubicación:</b> ${formData.comuna}, ${formData.region || "Sur de Chile"}
⚡ <b>Distribuidora:</b> ${(formData.distributor || "Saesa").toUpperCase()}
🏡 <b>Tipo Inmueble:</b> ${formData.propertyType || "Residencial"} | Sistema: ${formData.systemType || "Híbrido"}

☀️ <b>POTENCIA SUGERIDA:</b> ${sizingResult.recommendedKwp} kWp (${sizingResult.panelsCount} Paneles 580W)
🔋 <b>Batería LiFePO4:</b> ${sizingResult.batteryKwh > 0 ? `${sizingResult.batteryKwh} kWh` : "On-Grid Net Billing"}
💰 <b>Inversión Estimada:</b> ${formatCLP(sizingResult.estimatedSystemCostNetoClp)} + IVA
📈 <b>Ahorro Proyectado:</b> ${formatCLP(sizingResult.estimatedAnnualSavingsClp)}/año
💡 <b>Gasto Mensual Actual:</b> ${formatCLP(formData.monthlyBillClp)}/mes

🔗 <a href="${portalUrl}"><b>VER PROPUESTA DEL CLIENTE</b></a>
🏷️ <b>Folio:</b> <code>${leadId}</code>`;

  const telegramRes = await sendTelegramMessage(telegramHtml).catch((e) => ({
    success: false,
    error: e?.message || String(e),
  }));

  // 2. CORREO ELECTRÓNICO INTERNO
  let emailRes: any = { success: false };
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const internalRecipient = process.env.INTERNAL_NOTIFICATION_EMAIL?.trim() || DEFAULT_INTERNAL_EMAIL;

  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const emailSubject = `🔔 [LEAD COTIZACIÓN] ${formData.fullName} - ${formData.comuna} (${sizingResult.recommendedKwp} kWp | ${leadId})`;

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nuevo Lead Cotización</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f5f7; color: #1f1f1f;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    <div style="background-color: #141414; padding: 20px 24px; border-bottom: 3px solid #ff8300;">
      <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -0.01em;">
        ⚡ Nuevo Lead de Cotización Solar
      </h2>
      <p style="color: #9ca3af; margin: 4px 0 0 0; font-size: 12px; font-mono;">
        Folio: ${leadId} • ${new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" })}
      </p>
    </div>

    <div style="padding: 24px;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #ff8300; letter-spacing: 0.05em;">
        Datos del Cliente
      </h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 8px 0; color: #6b7280; width: 140px;">Nombre:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #1f1f1f;">${formData.fullName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 8px 0; color: #6b7280;">Teléfono / WhatsApp:</td>
          <td style="padding: 8px 0; font-weight: 600;">
            <a href="https://wa.me/${cleanPhone}" style="color: #25d366; text-decoration: none;">+${cleanPhone} (Abrir Chat)</a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 8px 0; color: #6b7280;">Correo:</td>
          <td style="padding: 8px 0; font-weight: 600;">
            <a href="mailto:${formData.email}" style="color: #ff8300; text-decoration: none;">${formData.email}</a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 8px 0; color: #6b7280;">Comuna / Región:</td>
          <td style="padding: 8px 0; color: #1f1f1f;">${formData.comuna}, ${formData.region || "Sur de Chile"}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 8px 0; color: #6b7280;">Distribuidora:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #1f1f1f;">${(formData.distributor || "Saesa").toUpperCase()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Inmueble / Sistema:</td>
          <td style="padding: 8px 0; color: #1f1f1f;">${formData.propertyType} (${formData.systemType})</td>
        </tr>
      </table>

      <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #ff8300; letter-spacing: 0.05em;">
        Dimensionamiento Técnico Calculado
      </h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; background: #f9fafb; border-radius: 8px; padding: 12px;">
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px 12px; color: #6b7280;">Potencia Sugerida:</td>
          <td style="padding: 8px 12px; font-weight: 700; color: #ff8300; font-size: 16px;">
            ${sizingResult.recommendedKwp} kWp (${sizingResult.panelsCount} Paneles TOPCon 580W)
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px 12px; color: #6b7280;">Ahorro Año 1:</td>
          <td style="padding: 8px 12px; font-weight: 700; color: #1f1f1f;">
            ${formatCLP(sizingResult.estimatedAnnualSavingsClp)}/año
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px 12px; color: #6b7280;">Inversión Neta:</td>
          <td style="padding: 8px 12px; font-weight: 600; color: #1f1f1f;">
            ${formatCLP(sizingResult.estimatedSystemCostNetoClp)} + IVA
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; color: #6b7280;">Gasto Actual Informado:</td>
          <td style="padding: 8px 12px; color: #1f1f1f;">
            ${formatCLP(formData.monthlyBillClp)}/mes
          </td>
        </tr>
      </table>

      <div style="text-align: center; margin-top: 24px;">
        <a href="${portalUrl}" style="display: inline-block; background-color: #ff8300; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: 700; font-size: 14px;">
          Ver Propuesta del Cliente en Vivo &rarr;
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;

      const { data, error } = await resend.emails.send({
        from: DEFAULT_INTERNAL_SENDER,
        to: internalRecipient.split(",").map((e) => e.trim()),
        replyTo: formData.email,
        subject: emailSubject,
        html: htmlContent,
      });

      emailRes = { success: !error, messageId: data?.id, error };
      if (error) {
        console.error("[Internal Email Error]:", error);
      } else {
        console.log(`[Internal Email] Notificación de cotización enviada a ${internalRecipient}`);
      }
    } catch (err: any) {
      console.error("[Internal Email Exception]:", err);
      emailRes = { success: false, error: err?.message || String(err) };
    }
  }

  return { telegram: telegramRes, email: emailRes };
}

/**
 * Notificación interna para una NUEVA VISITA TÉCNICA AGENDADA
 * (Telegram + Correo interno al equipo)
 */
export async function notifyInternalVisitaLead(params: {
  folio: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  comuna: string;
  region: string;
  latitud?: number | null;
  longitud?: number | null;
  coordenadasTexto?: string;
  fechaSeleccionada: string;
  bloqueHorario: string;
  tipoPropiedad?: string;
  montoBoleta?: string;
  notas?: string;
}): Promise<{ telegram: any; email: any }> {
  const {
    folio,
    nombre,
    telefono,
    email,
    direccion,
    comuna,
    region,
    latitud,
    longitud,
    coordenadasTexto,
    fechaSeleccionada,
    bloqueHorario,
    tipoPropiedad,
    montoBoleta,
    notas,
  } = params;

  const cleanPhone = cleanPhoneNumber(telefono);
  const bloqueTexto =
    bloqueHorario === "manana"
      ? "09:30 - 12:30 hrs (Mañana)"
      : "14:30 - 18:00 hrs (Tarde)";

  const mapsQuery =
    latitud && longitud
      ? `${latitud},${longitud}`
      : encodeURIComponent(`${direccion}, ${comuna}, Chile`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  // 1. TELEGRAM
  const telegramHtml = `📅 <b>NUEVA VISITA TÉCNICA AGENDADA</b>
━━━━━━━━━━━━━━━━━━━━━
👤 <b>Cliente:</b> ${nombre}
📱 <b>WhatsApp:</b> <a href="https://wa.me/${cleanPhone}">+${cleanPhone}</a>
✉️ <b>Email:</b> <a href="mailto:${email}">${email}</a>

🗓️ <b>Fecha:</b> ${fechaSeleccionada}
⏰ <b>Horario:</b> ${bloqueTexto}
📍 <b>Dirección:</b> ${direccion || "Punto marcado en mapa"} (${comuna}, ${region})
🗺️ <a href="${mapsUrl}"><b>Abrir en Google Maps</b></a>

🏡 <b>Tipo Inmueble:</b> ${tipoPropiedad || "Residencial"}
💡 <b>Rango Boleta:</b> ${montoBoleta || "No especificado"}
📝 <b>Notas:</b> ${notas || "Ninguna"}

🏷️ <b>Folio Cita:</b> <code>${folio}</code>`;

  const telegramRes = await sendTelegramMessage(telegramHtml).catch((e) => ({
    success: false,
    error: e?.message || String(e),
  }));

  // 2. CORREO ELECTRÓNICO INTERNO
  let emailRes: any = { success: false };
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const internalRecipient = process.env.INTERNAL_NOTIFICATION_EMAIL?.trim() || DEFAULT_INTERNAL_EMAIL;

  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const emailSubject = `📅 [NUEVA VISITA TÉCNICA] ${nombre} - ${fechaSeleccionada} (${comuna} | ${folio})`;

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nueva Visita Técnica</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f5f7; color: #1f1f1f;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    <div style="background-color: #059669; padding: 20px 24px; border-bottom: 3px solid #10b981;">
      <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -0.01em;">
        📅 Nueva Visita Técnica Agendada
      </h2>
      <p style="color: #d1fae5; margin: 4px 0 0 0; font-size: 12px; font-mono;">
        Folio: ${folio} • ${new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" })}
      </p>
    </div>

    <div style="padding: 24px;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #059669; letter-spacing: 0.05em;">
        Detalles de la Cita
      </h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; background: #ecfdf5; border-radius: 8px; padding: 12px;">
        <tr style="border-bottom: 1px solid #d1fae5;">
          <td style="padding: 8px 12px; color: #047857; font-weight: 600; width: 140px;">Fecha:</td>
          <td style="padding: 8px 12px; font-weight: 700; color: #065f46; font-size: 15px;">${fechaSeleccionada}</td>
        </tr>
        <tr style="border-bottom: 1px solid #d1fae5;">
          <td style="padding: 8px 12px; color: #047857; font-weight: 600;">Horario:</td>
          <td style="padding: 8px 12px; font-weight: 600; color: #065f46;">${bloqueTexto}</td>
        </tr>
        <tr style="border-bottom: 1px solid #d1fae5;">
          <td style="padding: 8px 12px; color: #047857; font-weight: 600;">Dirección:</td>
          <td style="padding: 8px 12px; color: #1f1f1f;">${direccion || "Coordenadas en mapa"}</td>
        </tr>
        <tr style="border-bottom: 1px solid #d1fae5;">
          <td style="padding: 8px 12px; color: #047857; font-weight: 600;">Comuna / Región:</td>
          <td style="padding: 8px 12px; color: #1f1f1f;">${comuna}, ${region}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; color: #047857; font-weight: 600;">Google Maps:</td>
          <td style="padding: 8px 12px;">
            <a href="${mapsUrl}" target="_blank" style="color: #2563eb; font-weight: 600; text-decoration: underline;">
              Ver ubicación en Mapa &rarr;
            </a>
          </td>
        </tr>
      </table>

      <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #1f1f1f; letter-spacing: 0.05em;">
        Contacto del Cliente
      </h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 8px 0; color: #6b7280; width: 140px;">Nombre:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #1f1f1f;">${nombre}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 8px 0; color: #6b7280;">Teléfono / WhatsApp:</td>
          <td style="padding: 8px 0; font-weight: 600;">
            <a href="https://wa.me/${cleanPhone}" style="color: #25d366; text-decoration: none;">+${cleanPhone} (Abrir Chat)</a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 8px 0; color: #6b7280;">Correo:</td>
          <td style="padding: 8px 0;">
            <a href="mailto:${email}" style="color: #ff8300; text-decoration: none;">${email}</a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 8px 0; color: #6b7280;">Inmueble / Boleta:</td>
          <td style="padding: 8px 0; color: #1f1f1f;">${tipoPropiedad || "Parcela"} (Boleta: ${montoBoleta || "N/A"})</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Notas Adicionales:</td>
          <td style="padding: 8px 0; color: #4b5563; font-style: italic;">${notas || "Sin notas"}</td>
        </tr>
      </table>

      <div style="text-align: center; margin-top: 20px;">
        <a href="https://wa.me/${cleanPhone}" style="display: inline-block; background-color: #25d366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: 700; font-size: 14px;">
          Contactar al Cliente por WhatsApp &rarr;
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;

      const { data, error } = await resend.emails.send({
        from: DEFAULT_INTERNAL_SENDER,
        to: internalRecipient.split(",").map((e) => e.trim()),
        replyTo: email,
        subject: emailSubject,
        html: htmlContent,
      });

      emailRes = { success: !error, messageId: data?.id, error };
      if (error) {
        console.error("[Internal Visita Email Error]:", error);
      } else {
        console.log(`[Internal Visita Email] Enviado a ${internalRecipient}`);
      }
    } catch (err: any) {
      console.error("[Internal Visita Email Exception]:", err);
      emailRes = { success: false, error: err?.message || String(err) };
    }
  }

  return { telegram: telegramRes, email: emailRes };
}
