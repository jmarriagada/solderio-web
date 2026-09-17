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
  Img,
} from "@react-email/components";

export interface VisitaTecnicaConfirmationEmailProps {
  nombreCliente?: string;
  folio?: string;
  fechaLegible?: string;
  horarioLegible?: string;
  direccion?: string;
  comuna?: string;
  region?: string;
  googleCalendarUrl?: string;
  outlookCalendarUrl?: string;
  hasIcsAttachment?: boolean;
  logoUrl?: string;
  isotipoUrl?: string;
  iconsBaseUrl?: string;
}

export function VisitaTecnicaConfirmationEmail({
  nombreCliente = "Estimado/a cliente",
  folio = "VT-2026-1040",
  fechaLegible = "Lunes, 24 de Marzo de 2026",
  horarioLegible = "10:00 - 12:00 hrs (Mañana)",
  direccion = "Parcela Los Coihues 14, Ruta V-505",
  comuna = "Puerto Varas",
  region = "Región de Los Lagos",
  googleCalendarUrl = "https://calendar.google.com",
  outlookCalendarUrl = "https://outlook.live.com",
  hasIcsAttachment = true,
  logoUrl = "https://solderio.cl/logos/logo-solderio-lightmode.png",
  isotipoUrl = "https://solderio.cl/logos/isotipo.png",
  iconsBaseUrl = "https://solderio.cl/email-icons",
}: VisitaTecnicaConfirmationEmailProps) {
  const previewText = `Visita Técnica Confirmada para el ${fechaLegible} (${horarioLegible}) en ${comuna} | SoldeRío`;

  return (
    <Html lang="es">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Main Card */}
          <Section style={card}>
            {/* Header with Logo */}
            <Section style={header}>
              <Img
                src={logoUrl}
                alt="SoldeRío Energía SpA"
                width="160"
                height="auto"
                style={logoImg}
              />
              <div style={folioBadge}>CITA CONFIRMADA</div>
            </Section>

            {/* Headline & Intro */}
            <Section style={heroSection}>
              <Heading as="h1" style={mainTitle}>
                Visita Técnica Confirmada
              </Heading>
              <Text style={introText}>
                Hola <strong>{nombreCliente}</strong>, tu cita para el levantamiento técnico solar ha sido agendada con éxito en nuestro sistema. Un ingeniero especialista de SoldeRío asistirá a tu inmueble:
              </Text>
            </Section>

            {/* Appointment Details Box */}
            <Section style={detailsBox}>
              <Row style={detailRow}>
                <Column style={detailCol}>
                  <Text style={detailLabel}>FECHA</Text>
                  <Text style={detailValueHighlight}>{fechaLegible}</Text>
                </Column>
                <Column style={detailColRight}>
                  <Text style={detailLabel}>HORARIO ESTIMADO</Text>
                  <Text style={detailValueDark}>{horarioLegible}</Text>
                </Column>
              </Row>

              <Hr style={innerDivider} />

              <Row style={detailRow}>
                <Column style={{ width: "100%" }}>
                  <Text style={detailLabel}>DIRECCIÓN</Text>
                  <Text style={detailValueText}>{direccion}</Text>
                </Column>
              </Row>

              <Row style={{ marginTop: "10px" }}>
                <Column style={{ width: "100%" }}>
                  <Text style={detailLabel}>COMUNA Y REGIÓN</Text>
                  <Text style={detailValueText}>
                    {comuna}, {region}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Add to Calendar Section (Line-art style) */}
            <Section style={calendarSection}>
              <Text style={calendarHeading}>AÑADIR A TU CALENDARIO (1 CLIC)</Text>
              <Text style={calendarSubtitle}>
                Haz clic en tu servicio habitual para guardar la cita y configurar recordatorios automáticos:
              </Text>

              <Section style={{ textAlign: "center", marginTop: "14px", marginBottom: "8px" }}>
                <Row>
                  <Column style={{ paddingRight: "6px", textAlign: "right" }}>
                    <Button href={googleCalendarUrl} style={calendarButton}>
                      Google Calendar
                    </Button>
                  </Column>
                  <Column style={{ paddingLeft: "6px", textAlign: "left" }}>
                    <Button href={outlookCalendarUrl} style={calendarButton}>
                      Outlook / 365
                    </Button>
                  </Column>
                </Row>
              </Section>

              <Text style={appleHint}>
                <strong>Usuarios de iPhone / Apple / Mac:</strong> Este correo incluye adjunto el archivo oficial <strong>.ics</strong>. Solo haz clic sobre él para agregarlo directamente en tu app Calendario.
              </Text>
            </Section>

            <Hr style={sectionDivider} />

            {/* Preparation Steps */}
            <Section style={prepSection}>
              <Text style={prepHeading}>¿QUÉ REALIZAMOS DURANTE LA VISITA?</Text>

              <Row style={prepRow}>
                <Column style={prepNumCol}>
                  <div style={stepNumberBadge}>1</div>
                </Column>
                <Column style={prepTextCol}>
                  <Text style={prepTitle}>Evaluación técnica de techo e inmueble</Text>
                  <Text style={prepDesc}>
                    Medición de orientación norte, inclinación, resistencia estructural y análisis de sombras.
                  </Text>
                </Column>
              </Row>

              <Row style={prepRow}>
                <Column style={prepNumCol}>
                  <div style={stepNumberBadge}>2</div>
                </Column>
                <Column style={prepTextCol}>
                  <Text style={prepTitle}>Inspección de tablero eléctrico y empalme</Text>
                  <Text style={prepDesc}>
                    Revisión de capacidad de protecciones, tierra de protección y factibilidad SEC RIC N°09 y N°15.
                  </Text>
                </Column>
              </Row>

              <Row style={prepRow}>
                <Column style={prepNumCol}>
                  <div style={stepNumberBadge}>3</div>
                </Column>
                <Column style={prepTextCol}>
                  <Text style={prepTitle}>Factibilidad de conexión Net Billing</Text>
                  <Text style={prepDesc}>
                    Validación de condiciones de inyección de excedentes con la distribuidora zonal. Ten tu boleta eléctrica a mano para confirmar la información de tu empalme.
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Contact / Reschedule Card */}
            <Section style={contactCard}>
              <Text style={contactTitle}>¿Necesitas reagendar o coordinar acceso?</Text>
              <Text style={contactDesc}>
                Puedes comunicarte directamente con nuestro equipo de operaciones:
              </Text>
              <Row style={{ marginTop: "14px" }}>
                <Column style={{ textAlign: "center" }}>
                  <Button
                    href={`https://wa.me/56966186667?text=${encodeURIComponent(
                      `Hola SoldeRío, tengo una consulta sobre mi Visita Técnica Folio ${folio}`
                    )}`}
                    style={whatsappButton}
                  >
                    Comunicarse por WhatsApp
                  </Button>
                </Column>
              </Row>
            </Section>

            {/* Footer */}
            <Section style={footer}>
              <Img
                src={isotipoUrl}
                alt="SoldeRío Isotipo"
                width="33"
                height="33"
                style={isotipoImg}
              />
              <Text style={footerBrand}>SoldeRío Energía SpA</Text>
              <Text style={footerAddress}>
                Ingeniería Solar Fotovoltaica y Eficiencia Energética, Osorno, Chile
              </Text>
              <Text style={footerLinks}>
                <Link href="https://solderio.cl" style={footerLink}>
                  solderio.cl
                </Link>{" "}
                •{" "}
                <Link href="mailto:contacto@solderio.cl" style={footerLink}>
                  contacto@solderio.cl
                </Link>{" "}
                •{" "}
                <Link href="tel:+56966186667" style={footerLink}>
                  +56 9 6618 6667
                </Link>
              </Text>

              <Hr style={footerDivider} />

              <Text style={footerUnsubscribe}>
                Conforme a la Ley N° 19.496 (Protección de los Derechos de los Consumidores, Art. 28 B), tienes derecho a suspender envíos informativos. Si no deseas recibir más actualizaciones sobre esta cita, puedes{" "}
                <Link href={`https://solderio.cl/desuscribir?leadId=${folio}`} style={footerUnsubscribeLink}>
                  darte de baja aquí
                </Link>{" "}
                o responder a este correo indicando &ldquo;BAJA&rdquo;.
              </Text>

              <Text style={footerLegal}>
                Recibes este correo porque solicitaste una visita técnica en nuestro sitio web. Folio: {folio}.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Estilos limpios Light Mode basados en Headspace, Spotify y Republic
const main: React.CSSProperties = {
  backgroundColor: "#F4F5F7",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  margin: 0,
  padding: "32px 12px",
  color: "#1F1F1F",
};

const container: React.CSSProperties = {
  margin: "0 auto",
  maxWidth: "580px",
};

const card: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  borderRadius: "16px",
  border: "1px solid #E5E7EB",
  padding: "40px 36px 32px 36px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
};

const header: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "32px",
};

const logoImg: React.CSSProperties = {
  margin: "0 auto 12px auto",
  display: "block",
  height: "auto",
};

const folioBadge: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#ECFDF5",
  color: "#059669",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  padding: "4px 12px",
  borderRadius: "9999px",
  border: "1px solid #A7F3D0",
};

const heroSection: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "28px",
};

const mainTitle: React.CSSProperties = {
  color: "#1F1F1F",
  fontSize: "24px",
  fontWeight: 700,
  lineHeight: "1.25",
  margin: "0 0 12px 0",
  letterSpacing: "-0.02em",
};

const introText: React.CSSProperties = {
  color: "#4B5563",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 auto",
  maxWidth: "480px",
};

const detailsBox: React.CSSProperties = {
  backgroundColor: "#F9FAFB",
  borderRadius: "14px",
  border: "1px solid #E5E7EB",
  padding: "24px",
  marginBottom: "28px",
};

const detailRow: React.CSSProperties = {
  width: "100%",
};

const detailCol: React.CSSProperties = {
  width: "50%",
  textAlign: "left",
  verticalAlign: "top",
};

const detailColRight: React.CSSProperties = {
  width: "50%",
  textAlign: "right",
  verticalAlign: "top",
};

const detailLabel: React.CSSProperties = {
  color: "#6B7280",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.1em",
  margin: "0 0 4px 0",
};

const detailValueHighlight: React.CSSProperties = {
  color: "#FF8300",
  fontSize: "16px",
  fontWeight: 700,
  margin: 0,
};

const detailValueDark: React.CSSProperties = {
  color: "#1F1F1F",
  fontSize: "15px",
  fontWeight: 700,
  margin: 0,
};

const detailValueText: React.CSSProperties = {
  color: "#1F1F1F",
  fontSize: "14px",
  fontWeight: 600,
  margin: 0,
};

const innerDivider: React.CSSProperties = {
  borderColor: "#E5E7EB",
  margin: "18px 0",
};

const calendarSection: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "32px",
};

const calendarHeading: React.CSSProperties = {
  color: "#1F1F1F",
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  margin: "0 0 6px 0",
};

const calendarSubtitle: React.CSSProperties = {
  color: "#6B7280",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "0 auto",
  maxWidth: "420px",
};

const calendarButton: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  color: "#1F1F1F",
  border: "1px solid #D1D5DB",
  borderRadius: "9999px",
  padding: "11px 22px",
  fontSize: "13px",
  fontWeight: 600,
  textDecoration: "none",
  display: "inline-block",
  textAlign: "center",
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
};

const appleHint: React.CSSProperties = {
  color: "#6B7280",
  fontSize: "12px",
  lineHeight: "1.5",
  marginTop: "16px",
  padding: "10px 14px",
  backgroundColor: "#F3F4F6",
  borderRadius: "8px",
};

const sectionDivider: React.CSSProperties = {
  borderColor: "#E5E7EB",
  margin: "28px 0",
};

const prepSection: React.CSSProperties = {
  marginBottom: "28px",
};

const prepHeading: React.CSSProperties = {
  color: "#9CA3AF",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  marginBottom: "16px",
  textAlign: "left",
};

const prepRow: React.CSSProperties = {
  marginBottom: "14px",
};

const prepNumCol: React.CSSProperties = {
  width: "36px",
  verticalAlign: "top",
};

const stepNumberBadge: React.CSSProperties = {
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  backgroundColor: "#FF8300",
  color: "#FFFFFF",
  fontSize: "12px",
  fontWeight: 700,
  lineHeight: "24px",
  textAlign: "center",
};

const prepTextCol: React.CSSProperties = {
  verticalAlign: "top",
  paddingLeft: "8px",
};

const prepTitle: React.CSSProperties = {
  color: "#1F1F1F",
  fontSize: "14px",
  fontWeight: 600,
  margin: "0 0 2px 0",
};

const prepDesc: React.CSSProperties = {
  color: "#4B5563",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: 0,
};

const contactCard: React.CSSProperties = {
  backgroundColor: "#F9FAFB",
  borderRadius: "12px",
  border: "1px solid #E5E7EB",
  padding: "20px",
  textAlign: "center",
  marginBottom: "32px",
};

const contactTitle: React.CSSProperties = {
  color: "#1F1F1F",
  fontSize: "14px",
  fontWeight: 600,
  margin: "0 0 6px 0",
};

const contactDesc: React.CSSProperties = {
  color: "#4B5563",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0 0 12px 0",
};

const whatsappButton: React.CSSProperties = {
  backgroundColor: "#25D366",
  color: "#FFFFFF",
  borderRadius: "9999px",
  padding: "10px 24px",
  fontSize: "13px",
  fontWeight: 600,
  textDecoration: "none",
  display: "inline-block",
};

const footer: React.CSSProperties = {
  textAlign: "center",
  paddingTop: "16px",
};

const isotipoImg: React.CSSProperties = {
  margin: "0 auto 10px auto",
  display: "block",
};

const footerBrand: React.CSSProperties = {
  color: "#1F1F1F",
  fontSize: "12px",
  fontWeight: 600,
  margin: "0 0 2px 0",
};

const footerAddress: React.CSSProperties = {
  color: "#6B7280",
  fontSize: "11px",
  margin: "0 0 8px 0",
};

const footerLinks: React.CSSProperties = {
  color: "#9CA3AF",
  fontSize: "11px",
  margin: "0 0 16px 0",
};

const footerLink: React.CSSProperties = {
  color: "#FF8300",
  textDecoration: "none",
};

const footerDivider: React.CSSProperties = {
  borderColor: "#E5E7EB",
  margin: "16px 0",
};

const footerUnsubscribe: React.CSSProperties = {
  color: "#6B7280",
  fontSize: "10px",
  lineHeight: "1.5",
  margin: "0 auto 10px auto",
  maxWidth: "480px",
};

const footerUnsubscribeLink: React.CSSProperties = {
  color: "#4B5563",
  textDecoration: "underline",
};

const footerLegal: React.CSSProperties = {
  color: "#9CA3AF",
  fontSize: "10px",
  lineHeight: "1.5",
  margin: 0,
};
