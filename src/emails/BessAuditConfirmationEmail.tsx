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

export interface BessAuditConfirmationEmailProps {
  contacto?: string;
  empresa?: string;
  cargo?: string;
  comuna?: string;
  tarifa?: string;
  potenciaKva?: string;
  fechaSolicitud?: string;
  logoUrl?: string;
  webUrl?: string;
  whatsappUrl?: string;
}

export function BessAuditConfirmationEmail({
  contacto = "Estimado/a cliente",
  empresa = "Faena Industrial",
  cargo = "Gerencia de Operaciones",
  comuna = "Sur de Chile",
  tarifa = "BT4.3 (Baja Tensión con Punta)",
  potenciaKva = "A relevar en terreno",
  fechaSolicitud = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  logoUrl = "https://solderio.cl/logos/logo-solderio-lightmode.png",
  webUrl = "https://solderio.cl/empresas/bess-industrial",
  whatsappUrl = "https://wa.me/56966186667?text=Hola%20quiero%20coordinar%20la%20auditoria%20con%20analizador%20de%20redes%20para%20mi%20empresa",
}: BessAuditConfirmationEmailProps) {
  const previewText = `Solicitud de Auditoría de Redes BESS C&I para ${empresa} | SoldeRío Energía`;

  return (
    <Html lang="es">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Main Card */}
          <Section style={card}>
            {/* Header with Logo & Status */}
            <Section style={header}>
              <Row style={{ width: "100%" }}>
                <Column style={{ verticalAlign: "middle" }}>
                  <Img
                    src={logoUrl}
                    alt="SoldeRío Energía SpA"
                    width="150"
                    height="auto"
                    style={logoImg}
                  />
                </Column>
                <Column style={{ textAlign: "right", verticalAlign: "middle" }}>
                  <div style={statusBadge}>AUDITORÍA REGISTRADA</div>
                </Column>
              </Row>
            </Section>

            {/* Inner Content */}
            <Section style={contentBody}>
              {/* Title & Introduction */}
              <Heading as="h1" style={mainTitle}>
                Solicitud de Auditoría BESS C&amp;I Ingresada
              </Heading>
              <Text style={introText}>
                Hola <strong>{contacto}</strong>, confirmamos la recepción de los antecedentes técnicos de <strong>{empresa}</strong> para la verificación de pre-factibilidad y coordinación de la instalación de un analizador de redes trifásico en tu faena de <strong>{comuna}</strong>.
              </Text>

              {/* Technical Summary Box - Full Width Stacked */}
              <Section style={detailsBox}>
                <div style={detailItem}>
                  <Text style={detailLabel}>EMPRESA / RAZÓN SOCIAL</Text>
                  <Text style={detailValueHighlight}>{empresa}</Text>
                </div>

                <Hr style={innerDivider} />

                <div style={detailItem}>
                  <Text style={detailLabel}>CONTACTO Y CARGO</Text>
                  <Text style={detailValueDark}>{contacto} • {cargo}</Text>
                </div>

                <Hr style={innerDivider} />

                <div style={detailItem}>
                  <Text style={detailLabel}>UBICACIÓN / FAENA</Text>
                  <Text style={detailValueDark}>{comuna}</Text>
                </div>

                <Hr style={innerDivider} />

                <div style={detailItem}>
                  <Text style={detailLabel}>RÉGIMEN TARIFARIO INFORMADO</Text>
                  <Text style={detailValueHighlight}>{tarifa}</Text>
                </div>

                {potenciaKva && (
                  <>
                    <Hr style={innerDivider} />
                    <div style={detailItem}>
                      <Text style={detailLabel}>CAPACIDAD TRANSFORMADOR / GENERADOR</Text>
                      <Text style={detailValueDark}>{potenciaKva}</Text>
                    </div>
                  </>
                )}

                <Hr style={innerDivider} />

                <div style={detailItem}>
                  <Text style={detailLabel}>FECHA DE REGISTRO</Text>
                  <Text style={detailValueText}>{fechaSolicitud}</Text>
                </div>
              </Section>

              {/* Protocol & Next Steps */}
              <Section style={prepSection}>
                <Text style={prepHeading}>PROTOCOLO TÉCNICO DE MEDICIÓN Y AUDITORÍA</Text>

                <Row style={prepRow}>
                  <Column style={prepNumCol}>
                    <div style={stepNumberBadge}>1</div>
                  </Column>
                  <Column style={prepTextCol}>
                    <Text style={prepTitle}>Evaluación de Pre-Factibilidad Eléctrica</Text>
                    <Text style={prepDesc}>
                      Un Ingeniero Eléctrico SEC Clase A revisará el régimen de horas punta y las cargas críticas informadas para tu faena.
                    </Text>
                  </Column>
                </Row>

                <Row style={prepRow}>
                  <Column style={prepNumCol}>
                    <div style={stepNumberBadge}>2</div>
                  </Column>
                  <Column style={prepTextCol}>
                    <Text style={prepTitle}>Coordinación de Instalación In-Situ</Text>
                    <Text style={prepDesc}>
                      Te contactaremos en menos de 24 horas hábiles para fijar el día y hora de visita técnica. La conexión se realiza con sondas Rogowski en el TGBT sin detener la producción de la planta.
                    </Text>
                  </Column>
                </Row>

                <Row style={prepRow}>
                  <Column style={prepNumCol}>
                    <div style={stepNumberBadge}>3</div>
                  </Column>
                  <Column style={prepTextCol}>
                    <Text style={prepTitle}>Curva de Carga &amp; ROI Garantizado</Text>
                    <Text style={prepDesc}>
                      Tras 15 a 30 días de telemetría continua clase A, recibirás un informe de ingeniería con el dimensionamiento exacto de batería LiFePO4, reducción en horas punta y retorno de inversión con beneficio tributario (Ley 21.210 / SII).
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* CTA Button */}
              <Section style={ctaSection}>
                <Button href={webUrl} style={primaryButton}>
                  Explorar Tecnología BESS &amp; Grid-Forming &rarr;
                </Button>
              </Section>

              <Hr style={sectionDivider} />

              {/* Direct Support Card */}
              <Section style={contactCard}>
                <Text style={contactTitle}>¿Requieres coordinar una visita de urgencia?</Text>
                <Text style={contactDesc}>
                  Comunícate directamente con nuestra mesa técnica a{" "}
                  <Link href="mailto:contacto@solderio.cl" style={contactLink}>
                    contacto@solderio.cl
                  </Link>{" "}
                  o vía WhatsApp directo al{" "}
                  <Link href={whatsappUrl} style={contactLink}>
                    +56 9 6618 6667
                  </Link>
                  .
                </Text>
              </Section>
            </Section>

            {/* Clean Footer (without RUT or address line) */}
            <Section style={footer}>
              <Text style={footerBrand}>
                <strong>SoldeRío Energía SpA</strong> • Soluciones BESS y Microrredes Industriales
              </Text>
              <Text style={footerLegal}>
                Este mensaje fue enviado automáticamente como confirmación de solicitud de auditoría en{" "}
                <Link href="https://solderio.cl" style={footerLink}>
                  solderio.cl
                </Link>
                . Puedes consultar nuestras{" "}
                <Link href="https://solderio.cl/politicas-de-privacidad" style={footerLink}>
                  Políticas de Privacidad
                </Link>
                .
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default BessAuditConfirmationEmail;

/* STYLES */
const main: React.CSSProperties = {
  backgroundColor: "#F4F5F7",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  margin: 0,
  padding: "36px 12px",
  color: "#1F2937",
};

const container: React.CSSProperties = {
  margin: "0 auto",
  maxWidth: "580px",
  width: "100%",
};

const card: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
  border: "1px solid #E5E7EB",
  width: "100%",
};

const header: React.CSSProperties = {
  padding: "24px 28px",
  borderBottom: "1px solid #F3F4F6",
  backgroundColor: "#FAFAFA",
  width: "100%",
};

const logoImg: React.CSSProperties = {
  display: "block",
  maxWidth: "150px",
  height: "auto",
};

const statusBadge: React.CSSProperties = {
  backgroundColor: "#FFF7ED",
  color: "#EA580C",
  border: "1px solid #FDBA74",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  padding: "5px 12px",
  borderRadius: "9999px",
  display: "inline-block",
  whiteSpace: "nowrap",
};

const contentBody: React.CSSProperties = {
  padding: "28px 28px 8px 28px",
  width: "100%",
  boxSizing: "border-box",
};

const mainTitle: React.CSSProperties = {
  color: "#111827",
  fontSize: "22px",
  fontWeight: 800,
  letterSpacing: "-0.02em",
  lineHeight: "1.3",
  margin: "0 0 12px 0",
};

const introText: React.CSSProperties = {
  color: "#4B5563",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 20px 0",
};

const detailsBox: React.CSSProperties = {
  backgroundColor: "#F9FAFB",
  borderRadius: "12px",
  border: "1px solid #E5E7EB",
  padding: "16px 20px",
  marginBottom: "28px",
  width: "100%",
  boxSizing: "border-box",
};

const detailItem: React.CSSProperties = {
  padding: "2px 0",
  width: "100%",
};

const detailLabel: React.CSSProperties = {
  color: "#9CA3AF",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  margin: "0 0 4px 0",
  textTransform: "uppercase",
};

const detailValueHighlight: React.CSSProperties = {
  color: "#FF8300",
  fontSize: "15px",
  fontWeight: 700,
  margin: 0,
  wordBreak: "break-word",
};

const detailValueDark: React.CSSProperties = {
  color: "#1F2937",
  fontSize: "14px",
  fontWeight: 600,
  margin: 0,
  wordBreak: "break-word",
};

const detailValueText: React.CSSProperties = {
  color: "#374151",
  fontSize: "13px",
  fontWeight: 500,
  margin: 0,
  wordBreak: "break-word",
};

const innerDivider: React.CSSProperties = {
  borderColor: "#E5E7EB",
  margin: "12px 0",
  width: "100%",
};

const prepSection: React.CSSProperties = {
  marginBottom: "28px",
  width: "100%",
};

const prepHeading: React.CSSProperties = {
  color: "#6B7280",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.1em",
  marginBottom: "16px",
  textAlign: "left",
};

const prepRow: React.CSSProperties = {
  marginBottom: "14px",
  width: "100%",
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
  paddingLeft: "10px",
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

const ctaSection: React.CSSProperties = {
  textAlign: "center",
  padding: "4px 0 20px 0",
  width: "100%",
};

const primaryButton: React.CSSProperties = {
  backgroundColor: "#FF8300",
  color: "#FFFFFF",
  borderRadius: "9999px",
  padding: "12px 28px",
  fontSize: "13px",
  fontWeight: 700,
  textDecoration: "none",
  display: "inline-block",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(255, 131, 0, 0.25)",
};

const sectionDivider: React.CSSProperties = {
  borderColor: "#F3F4F6",
  margin: "20px 0",
  width: "100%",
};

const contactCard: React.CSSProperties = {
  backgroundColor: "#F9FAFB",
  borderRadius: "12px",
  border: "1px solid #E5E7EB",
  padding: "16px 20px",
  textAlign: "center",
  marginBottom: "24px",
  width: "100%",
  boxSizing: "border-box",
};

const contactTitle: React.CSSProperties = {
  color: "#1F2937",
  fontSize: "13px",
  fontWeight: 600,
  margin: "0 0 4px 0",
};

const contactDesc: React.CSSProperties = {
  color: "#6B7280",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: 0,
};

const contactLink: React.CSSProperties = {
  color: "#FF8300",
  textDecoration: "none",
  fontWeight: 600,
};

const footer: React.CSSProperties = {
  backgroundColor: "#111827",
  padding: "24px 28px",
  textAlign: "center",
  width: "100%",
  boxSizing: "border-box",
};

const footerBrand: React.CSSProperties = {
  color: "#F3F4F6",
  fontSize: "12px",
  margin: "0 0 8px 0",
};

const footerLegal: React.CSSProperties = {
  color: "#9CA3AF",
  fontSize: "11px",
  lineHeight: "1.5",
  margin: 0,
};

const footerLink: React.CSSProperties = {
  color: "#D1D5DB",
  textDecoration: "underline",
};
