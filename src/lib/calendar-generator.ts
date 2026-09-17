/**
 * SoldeRío Energía - Open Source Calendar Generator (RFC 5545)
 * Generates standard .ics files and 1-click calendar links (Google, Outlook, Apple)
 * without external paid dependencies.
 */

export interface CalendarEventParams {
  folio: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  comuna: string;
  region: string;
  latitud?: number | null;
  longitud?: number | null;
  coordenadasTexto?: string;
  fechaIso: string; // "YYYY-MM-DD"
  bloqueHorario: "manana" | "tarde";
  notas?: string;
}

export interface CalendarUrls {
  google: string;
  outlook: string;
  office365: string;
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export function getEventTimes(params: CalendarEventParams) {
  const isMorning = params.bloqueHorario === "manana";
  const startHour = isMorning ? "0930" : "1430";
  const endHour = isMorning ? "1230" : "1800";
  const startHourFormatted = isMorning ? "09:30" : "14:30";
  const endHourFormatted = isMorning ? "12:30" : "18:00";
  const blockLabel = isMorning
    ? "Mañana (09:30 - 12:30 hrs)"
    : "Tarde (14:30 - 18:00 hrs)";

  const cleanDate = params.fechaIso.replace(/[-]/g, "");
  return {
    cleanDate,
    startHour,
    endHour,
    startHourFormatted,
    endHourFormatted,
    blockLabel,
  };
}

export function buildEventDetails(params: CalendarEventParams) {
  const { blockLabel } = getEventTimes(params);
  const location = `${params.direccion ? params.direccion + ", " : ""}${params.comuna}, ${params.region}, Chile`;
  const mapsLink =
    params.latitud && params.longitud
      ? `https://www.google.com/maps?q=${params.latitud},${params.longitud}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  const title = `Visita Técnica SoldeRío (${params.folio}) - ${params.comuna}`;

  const description = [
    `VISITA TÉCNICA EN TERRENO - SOLDERÍO ENERGÍA`,
    `Folio: ${params.folio}`,
    `Cliente: ${params.nombre}`,
    `Teléfono: ${params.telefono}`,
    `Horario: ${blockLabel}`,
    `Ubicación: ${location}`,
    params.coordenadasTexto ? `GPS: ${params.coordenadasTexto}` : "",
    `Mapa: ${mapsLink}`,
    ``,
    `DETALLE DE DIAGNÓSTICO:`,
    `- Evaluación estructural de techumbre o suelo`,
    `- Inspección de empalme eléctrico y tablero general`,
    `- Factibilidad de conexión Net Billing Ley 21.118`,
    `- Costo: $14.990 CLP (100% Reembolsable al contratar el proyecto)`,
    ``,
    `Contacto directo SoldeRío: contacto@solderio.cl | +56 9 8765 4321`,
  ]
    .filter(Boolean)
    .join("\n");

  return { title, location, description, mapsLink, blockLabel };
}

/**
 * Generates RFC 5545 standard .ics file string
 */
export function generateIcsContent(params: CalendarEventParams): string {
  const { cleanDate, startHour, endHour } = getEventTimes(params);
  const { title, location, description } = buildEventDetails(params);
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const uid = `${params.folio}-${Date.now()}@solderio.cl`;

  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SoldeRio Energia//Visita Tecnica Sistema Solar//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VTIMEZONE",
    "TZID:America/Santiago",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:-0300",
    "TZOFFSETTO:-0300",
    "TZNAME:CLT",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `CREATED:${now}`,
    `LAST-MODIFIED:${now}`,
    `DTSTART;TZID=America/Santiago:${cleanDate}T${startHour}00`,
    `DTEND;TZID=America/Santiago:${cleanDate}T${endHour}00`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(location)}`,
    `ORGANIZER;CN="SoldeRío Energía":mailto:contacto@solderio.cl`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN="${escapeIcsText(params.nombre)}":mailto:${params.email}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    "DESCRIPTION:Recordatorio: Mañana es tu Visita Técnica en terreno con SoldeRío",
    "END:VALARM",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Recordatorio: En 2 horas se realizará tu Visita Técnica con SoldeRío",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return icsLines.join("\r\n");
}

/**
 * Generates direct 1-click web links to add to Google, Outlook, and Office 365 Calendars
 */
export function generateCalendarLinks(params: CalendarEventParams): CalendarUrls {
  const { cleanDate, startHour, endHour, startHourFormatted, endHourFormatted } =
    getEventTimes(params);
  const { title, location, description } = buildEventDetails(params);

  // Google Calendar URL
  // Uses local time format + ctz=America/Santiago
  const googleDates = `${cleanDate}T${startHour}00/${cleanDate}T${endHour}00`;
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${googleDates}&ctz=America/Santiago&details=${encodeURIComponent(
    description
  )}&location=${encodeURIComponent(location)}`;

  // Outlook / Office 365 Live compose URL (ISO 8601 with offset)
  const isoDate = params.fechaIso; // YYYY-MM-DD
  const startIso = `${isoDate}T${startHourFormatted}:00-03:00`;
  const endIso = `${isoDate}T${endHourFormatted}:00-03:00`;

  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
    title
  )}&startdt=${encodeURIComponent(startIso)}&enddt=${encodeURIComponent(
    endIso
  )}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(
    location
  )}`;

  const office365Url = `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
    title
  )}&startdt=${encodeURIComponent(startIso)}&enddt=${encodeURIComponent(
    endIso
  )}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(
    location
  )}`;

  return {
    google: googleUrl,
    outlook: outlookUrl,
    office365: office365Url,
  };
}
