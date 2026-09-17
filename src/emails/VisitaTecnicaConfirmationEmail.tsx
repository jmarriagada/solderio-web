import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Link,
  Hr,
  Button,
} from "@react-email/components";

export interface VisitaTecnicaEmailProps {
  folio?: string;
  nombre?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  comuna?: string;
  region?: string;
  coordenadasTexto?: string;
  fechaTexto?: string; // ej: "Jueves 25 de Septiembre"
  bloqueHorarioTexto?: string; // ej: "Mañana (09:30 - 12:30 hrs)"
  tipoPropiedad?: string;
  googleCalendarUrl?: string;
  outlookCalendarUrl?: string;
  mapsUrl?: string;
}

export function VisitaTecnicaConfirmationEmail({
  folio = "SOL-VIS-1001",
  nombre = "Estimado/a cliente",
  telefono = "+56 9 8765 4321",
  email = "cliente@correo.com",
  direccion = "Parcela 12, Camino Los Colonos",
  comuna = "Puerto Varas",
  region = "Región de Los Lagos",
  coordenadasTexto = "",
  fechaTexto = "Lunes 22 de Septiembre",
  bloqueHorarioTexto = "Mañana (09:30 - 12:30 hrs)",
  tipoPropiedad = "Parcela",
  googleCalendarUrl = "https://calendar.google.com",
  outlookCalendarUrl = "https://outlook.live.com",
  mapsUrl = "https://maps.google.com",
}: VisitaTecnicaEmailProps) {
  const previewText = `Tu Visita Técnica en ${comuna} ha sido confirmada (${folio}) - Agéndala en tu calendario`;

  return (
    <Html lang="es">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <Row>
              <Column>
                <Text style={logoBrand}>
                  SOLDE<span style={{ color: "#FF8300" }}>RÍO</span>
                </Text>
                <Text style={logoSub}>INGENIERÍA SOLAR & RESILIENCIA ENERGÉTICA</Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={badgeHeader}>FOLIO: {folio}</Text>
              </Column>
            </Row>
          </Section>

          {/* Hero Confirmation Card */}
          <Section style={cardHero}>
            <Text style={categoryText}>SOLICITUD DE VISITA TÉCNICA CONFIRMADA</Text>
            <Heading as="h1" style={titleHeading}>
              Hola {nombre}, tu visita técnica en terreno está agendada
            </Heading>
            <Text style={paragraph}>
              Hemos coordinado la visita de nuestro equipo de ingeniería solar a tu propiedad en{" "}
              <strong>{comuna}</strong>. A continuación tienes todos los detalles para agregar la
              cita a tu calendario personal.
            </Text>

            {/* Appointment Details Box */}
            <Section style={appointmentBox}>
              <Row style={detailRow}>
                <Column style={{ width: "32px", verticalAlign: "top" }}>
                  <Text style={iconStyle}>📅</Text>
                </Column>
                <Column>
                  <Text style={detailLabel}>FECHA CONFIRMADA</Text>
                  <Text style={detailValueHighlight}>{fechaTexto}</Text>
                </Column>
              </Row>

              <Row style={detailRow}>
                <Column style={{ width: "32px", verticalAlign: "top" }}>
                  <Text style={iconStyle}>⏰</Text>
                </Column>
                <Column>
                  <Text style={detailLabel}>BLOQUE HORARIO</Text>
                  <Text style={detailValue}>{bloqueHorarioTexto}</Text>
                </Column>
              </Row>

              <Row style={detailRow}>
                <Column style={{ width: "32px", verticalAlign: "top" }}>
                  <Text style={iconStyle}>📍</Text>
                </Column>
                <Column>
                  <Text style={detailLabel}>DIRECCIÓN & COMUNA</Text>
                  <Text style={detailValue}>
                    {direccion ? `${direccion}, ` : ""}
                    {comuna}, {region}
                  </Text>
                  {coordenadasTexto && (
                    <Text style={gpsText}>Coordenadas GPS: {coordenadasTexto}</Text>
                  )}
                  <Link href={mapsUrl} style={mapsLink}>
                    Abrir en Google Maps &rarr;
                  </Link>
                </Column>
              </Row>

              <Row style={detailRow}>
                <Column style={{ width: "32px", verticalAlign: "top" }}>
                  <Text style={iconStyle}>🏡</Text>
                </Column>
                <Column>
                  <Text style={detailLabel}>TIPO DE PROPIEDAD</Text>
                  <Text style={detailValue}>{tipoPropiedad}</Text>
                </Column>
              </Row>

              <Row style={{ ...detailRow, borderBottom: "none" }}>
                <Column style={{ width: "32px", verticalAlign: "top" }}>
                  <Text style={iconStyle}>💳</Text>
                </Column>
                <Column>
                  <Text style={detailLabel}>VALOR DEL DIAGNÓSTICO</Text>
                  <Text style={detailValue}>$14.990 CLP</Text>
                  <Text style={reimbursableNotice}>
                    100% Reembolsable / Descontable al adquirir tu sistema solar SoldeRío
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* 1-Click Calendar Buttons */}
            <Section style={calendarSection}>
              <Text style={calendarTitle}>AGENDAR EN TU CALENDARIO (1 CLIC)</Text>
              <Text style={calendarSub}>
                Selecciona tu calendario para guardar la fecha automáticamente con recordatorios:
              </Text>

              <Row style={{ marginTop: "16px" }}>
                <Column style={{ paddingRight: "6px" }}>
                  <Button href={googleCalendarUrl} style={buttonPrimary}>
                    📅 Añadir a Google Calendar
                  </Button>
                </Column>
                <Column style={{ paddingLeft: "6px" }}>
                  <Button href={outlookCalendarUrl} style={buttonSecondary}>
                    📆 Añadir a Outlook / 365
                  </Button>
                </Column>
              </Row>

              <Text style={appleNotice}>
                💡 <strong>Usuarios de iPhone / Apple / Mac:</strong> Este correo incluye adjunto el
                archivo oficial <strong>.ics</strong>. Solo haz clic sobre el archivo adjunto para
                agendarlo instantáneamente en tu app Calendario de Apple.
              </Text>
            </Section>
          </Section>

          {/* Preparations Card */}
          <Section style={cardSecondary}>
            <Heading as="h2" style={sectionHeading}>
              ¿Qué realizamos durante la visita en terreno?
            </Heading>

            <Section style={checklistItem}>
              <Text style={checkTitle}>1. Evaluación estructural y espacial de techumbre / suelo</Text>
              <Text style={checkDesc}>
                Medición de inclinación, orientación hacia el norte solar, sombreados por vegetación
                y resistencia estructural.
              </Text>
            </Section>

            <Section style={checklistItem}>
              <Text style={checkTitle}>2. Inspección del empalme y tablero eléctrico general</Text>
              <Text style={checkDesc}>
                Revisión de capacidad de disyuntores, barra de tierra de protección (PAT) y
                factibilidad técnica bajo normativa SEC RIC N°09 y N°15.
              </Text>
            </Section>

            <Section style={checklistItem}>
              <Text style={checkTitle}>3. Validación de factibilidad de inyección Net Billing</Text>
              <Text style={checkDesc}>
                Confirmación de condiciones con la distribuidora zonal (Saesa, Crell, CGE) para la
                futura tramitación TE-4.
              </Text>
            </Section>

            <Hr style={divider} />

            <Heading as="h3" style={subHeadingWhite}>
              Recomendaciones para el día de la visita:
            </Heading>
            <Text style={bulletText}>
              • Tener disponible una <strong>boleta eléctrica reciente</strong> (para corroborar número
              de cliente y tarifa).
            </Text>
            <Text style={bulletText}>
              • Permitir acceso despejado al <strong>tablero eléctrico</strong> y área de emplazamiento
              solar.
            </Text>
          </Section>

          {/* Contact & Support */}
          <Section style={cardContact}>
            <Heading as="h2" style={sectionHeading}>
              ¿Dudas o necesitas reagendar?
            </Heading>
            <Text style={paragraph}>
              Si requieres modificar la fecha o coordinar indicaciones específicas de acceso, puedes
              contactar directamente a nuestro equipo técnico:
            </Text>

            <Row style={{ marginTop: "14px" }}>
              <Column>
                <Button
                  href={`https://wa.me/56966186667?text=${encodeURIComponent(
                    `Hola SoldeRío, tengo una consulta sobre mi Visita Técnica Folio ${folio}`
                  )}`}
                  style={whatsappButton}
                >
                  💬 Chatear por WhatsApp
                </Button>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={contactEmailText}>
                  Teléfono:{" "}
                  <Link href="tel:+56966186667" style={{ color: "#FFFFFF", fontWeight: "bold", textDecoration: "none" }}>
                    +56 9 6618 6667
                  </Link>
                </Text>
                <Text style={contactEmailText}>
                  Correo oficial:{" "}
                  <Link href="mailto:contacto@solderio.cl" style={contactEmailLink}>
                    contacto@solderio.cl
                  </Link>
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              SoldeRío Energía SpA | Ingeniería Solar Fotovoltaica, Baterías & Resiliencia
            </Text>
            <Text style={footerText}>Puerto Varas, Región de Los Lagos, Chile</Text>
            <Text style={footerTextMuted}>
              Has recibido este correo transaccional porque registraste una solicitud de visita técnica
              en nuestro sitio oficial solderio.cl. Folio de seguimiento: {folio}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Estilos inline de alto rendimiento para clientes de correo
const main: React.CSSProperties = {
  backgroundColor: "#0D0D0D",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  margin: 0,
  padding: "24px 0",
};

const container: React.CSSProperties = {
  margin: "0 auto",
  maxWidth: "600px",
  padding: "0 16px",
};

const headerSection: React.CSSProperties = {
  padding: "16px 0 24px 0",
};

const logoBrand: React.CSSProperties = {
  color: "#FFFFFF",
  fontSize: "22px",
  fontWeight: "bold",
  letterSpacing: "0.08em",
  margin: 0,
};

const logoSub: React.CSSProperties = {
  color: "#888888",
  fontSize: "9px",
  letterSpacing: "0.15em",
  margin: "3px 0 0 0",
};

const badgeHeader: React.CSSProperties = {
  backgroundColor: "#1F1F1F",
  color: "#FF8300",
  fontSize: "11px",
  fontWeight: "bold",
  fontFamily: "monospace",
  padding: "6px 12px",
  borderRadius: "100px",
  border: "1px solid #333333",
  display: "inline-block",
  margin: 0,
};

const cardHero: React.CSSProperties = {
  backgroundColor: "#161616",
  borderRadius: "20px",
  border: "1px solid #282828",
  padding: "28px",
  marginBottom: "16px",
};

const categoryText: React.CSSProperties = {
  color: "#FF8300",
  fontSize: "11px",
  fontWeight: "bold",
  letterSpacing: "0.15em",
  margin: "0 0 8px 0",
};

const titleHeading: React.CSSProperties = {
  color: "#FFFFFF",
  fontSize: "22px",
  fontWeight: 400,
  lineHeight: "1.3",
  margin: "0 0 14px 0",
};

const paragraph: React.CSSProperties = {
  color: "#CCCCCC",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 18px 0",
};

const appointmentBox: React.CSSProperties = {
  backgroundColor: "#1C1C1E",
  borderRadius: "14px",
  border: "1px solid #2C2C2E",
  padding: "20px",
  margin: "18px 0",
};

const detailRow: React.CSSProperties = {
  padding: "10px 0",
  borderBottom: "1px solid #28282B",
};

const iconStyle: React.CSSProperties = {
  fontSize: "18px",
  margin: 0,
};

const detailLabel: React.CSSProperties = {
  color: "#8E8E93",
  fontSize: "10px",
  fontWeight: "bold",
  letterSpacing: "0.1em",
  margin: "0 0 3px 0",
};

const detailValue: React.CSSProperties = {
  color: "#FFFFFF",
  fontSize: "14px",
  fontWeight: 500,
  margin: 0,
};

const detailValueHighlight: React.CSSProperties = {
  color: "#FF8300",
  fontSize: "16px",
  fontWeight: "bold",
  margin: 0,
};

const gpsText: React.CSSProperties = {
  color: "#888888",
  fontSize: "11px",
  fontFamily: "monospace",
  margin: "4px 0 0 0",
};

const mapsLink: React.CSSProperties = {
  color: "#FF8300",
  fontSize: "12px",
  textDecoration: "none",
  display: "inline-block",
  marginTop: "6px",
};

const reimbursableNotice: React.CSSProperties = {
  color: "#34C759",
  fontSize: "12px",
  margin: "4px 0 0 0",
};

const calendarSection: React.CSSProperties = {
  backgroundColor: "#1F1F1F",
  borderRadius: "14px",
  border: "1px solid #333333",
  padding: "20px",
  marginTop: "16px",
};

const calendarTitle: React.CSSProperties = {
  color: "#FFFFFF",
  fontSize: "12px",
  fontWeight: "bold",
  letterSpacing: "0.1em",
  margin: 0,
};

const calendarSub: React.CSSProperties = {
  color: "#A0A0A0",
  fontSize: "13px",
  margin: "6px 0 0 0",
};

const buttonPrimary: React.CSSProperties = {
  backgroundColor: "#FF8300",
  color: "#000000",
  fontSize: "13px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center",
  borderRadius: "10px",
  padding: "12px 14px",
  display: "block",
  boxSizing: "border-box",
};

const buttonSecondary: React.CSSProperties = {
  backgroundColor: "#2A2A2A",
  color: "#FFFFFF",
  fontSize: "13px",
  fontWeight: 500,
  textDecoration: "none",
  textAlign: "center",
  borderRadius: "10px",
  border: "1px solid #444444",
  padding: "12px 14px",
  display: "block",
  boxSizing: "border-box",
};

const appleNotice: React.CSSProperties = {
  color: "#999999",
  fontSize: "11px",
  lineHeight: "1.5",
  margin: "16px 0 0 0",
};

const cardSecondary: React.CSSProperties = {
  backgroundColor: "#161616",
  borderRadius: "20px",
  border: "1px solid #282828",
  padding: "28px",
  marginBottom: "16px",
};

const sectionHeading: React.CSSProperties = {
  color: "#FFFFFF",
  fontSize: "17px",
  fontWeight: 500,
  margin: "0 0 16px 0",
};

const checklistItem: React.CSSProperties = {
  marginBottom: "14px",
};

const checkTitle: React.CSSProperties = {
  color: "#FFFFFF",
  fontSize: "13px",
  fontWeight: 600,
  margin: "0 0 3px 0",
};

const checkDesc: React.CSSProperties = {
  color: "#999999",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: 0,
};

const divider: React.CSSProperties = {
  borderColor: "#282828",
  margin: "20px 0",
};

const subHeadingWhite: React.CSSProperties = {
  color: "#FFFFFF",
  fontSize: "13px",
  fontWeight: "bold",
  margin: "0 0 10px 0",
};

const bulletText: React.CSSProperties = {
  color: "#AAAAAA",
  fontSize: "12px",
  lineHeight: "1.6",
  margin: "0 0 6px 0",
};

const cardContact: React.CSSProperties = {
  backgroundColor: "#161616",
  borderRadius: "20px",
  border: "1px solid #282828",
  padding: "24px 28px",
  marginBottom: "16px",
};

const whatsappButton: React.CSSProperties = {
  backgroundColor: "#25D366",
  color: "#000000",
  fontSize: "13px",
  fontWeight: "bold",
  textDecoration: "none",
  borderRadius: "10px",
  padding: "10px 16px",
  display: "inline-block",
};

const contactEmailText: React.CSSProperties = {
  color: "#888888",
  fontSize: "12px",
  margin: 0,
};

const contactEmailLink: React.CSSProperties = {
  color: "#FF8300",
  textDecoration: "none",
};

const footer: React.CSSProperties = {
  padding: "16px 0",
  textAlign: "center",
};

const footerText: React.CSSProperties = {
  color: "#666666",
  fontSize: "11px",
  lineHeight: "1.5",
  margin: "0 0 4px 0",
};

const footerTextMuted: React.CSSProperties = {
  color: "#444444",
  fontSize: "10px",
  lineHeight: "1.5",
  margin: "10px 0 0 0",
};
