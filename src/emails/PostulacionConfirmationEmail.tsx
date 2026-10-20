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

export interface PostulacionConfirmationEmailProps {
  nombre?: string;
  cargo?: string;
  comuna?: string;
  cvFileName?: string;
  fechaPostulacion?: string;
  logoUrl?: string;
  webUrl?: string;
  whatsappUrl?: string;
}

export function PostulacionConfirmationEmail({
  nombre = "Estimado/a profesional",
  cargo = "Ingeniero Eléctrico SEC Clase A",
  comuna = "Puerto Varas",
  cvFileName = "Curriculum Vitae adjunto",
  fechaPostulacion = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  logoUrl = "https://solderio.cl/logos/logo-solderio-lightmode.png",
  webUrl = "https://solderio.cl",
  whatsappUrl = "https://wa.me/56966186667",
}: PostulacionConfirmationEmailProps) {
  const previewText = `Hemos recibido tu postulación para ${cargo} | SoldeRío Energía`;

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
                  <div style={statusBadge}>POSTULACIÓN RECIBIDA</div>
                </Column>
              </Row>
            </Section>

            {/* Inner Content with Safe Padding */}
            <Section style={contentBody}>
              {/* Headline & Intro */}
              <Heading as="h1" style={mainTitle}>
                ¡Gracias por postular a SoldeRío!
              </Heading>
              <Text style={introText}>
                Hola <strong>{nombre}</strong>, confirmamos que hemos recibido exitosamente tus antecedentes profesionales para formar parte de nuestro equipo de ingeniería e instalaciones fotovoltaicas en el sur de Chile.
              </Text>

              {/* Application Summary Box - Full Width Stacked to Avoid Any Overflow */}
              <Section style={detailsBox}>
                {/* 1. Cargo */}
                <div style={detailItem}>
                  <Text style={detailLabel}>CARGO POSTULADO</Text>
                  <Text style={detailValueHighlight}>{cargo}</Text>
                </div>

                <Hr style={innerDivider} />

                {/* 2. Ubicación / Zona */}
                <div style={detailItem}>
                  <Text style={detailLabel}>UBICACIÓN / ZONA</Text>
                  <Text style={detailValueDark}>{comuna || "Sur de Chile"}</Text>
                </div>

                <Hr style={innerDivider} />

                {/* 3. Documento */}
                <div style={detailItem}>
                  <Text style={detailLabel}>DOCUMENTO REGISTRADO</Text>
                  <Text style={detailValueFile}>📎 {cvFileName}</Text>
                </div>

                <Hr style={innerDivider} />

                {/* 4. Fecha */}
                <div style={detailItem}>
                  <Text style={detailLabel}>FECHA DE RECEPCIÓN</Text>
                  <Text style={detailValueText}>{fechaPostulacion}</Text>
                </div>
              </Section>

              {/* What's Next / Selection Steps */}
              <Section style={prepSection}>
                <Text style={prepHeading}>¿CÓMO CONTINÚA NUESTRO PROCESO?</Text>

                <Row style={prepRow}>
                  <Column style={prepNumCol}>
                    <div style={stepNumberBadge}>1</div>
                  </Column>
                  <Column style={prepTextCol}>
                    <Text style={prepTitle}>Revisión de Antecedentes</Text>
                    <Text style={prepDesc}>
                      Nuestro equipo técnico y de proyectos evaluará tu perfil, experiencia y certificaciones conforme a los requerimientos de la posición.
                    </Text>
                  </Column>
                </Row>

                <Row style={prepRow}>
                  <Column style={prepNumCol}>
                    <div style={stepNumberBadge}>2</div>
                  </Column>
                  <Column style={prepTextCol}>
                    <Text style={prepTitle}>Contacto Directo</Text>
                    <Text style={prepDesc}>
                      Si tu perfil calza con las vacantes activas o nuevas aperturas, te contactaremos vía correo o WhatsApp para coordinar una primera conversación.
                    </Text>
                  </Column>
                </Row>

                <Row style={prepRow}>
                  <Column style={prepNumCol}>
                    <div style={stepNumberBadge}>3</div>
                  </Column>
                  <Column style={prepTextCol}>
                    <Text style={prepTitle}>Privacidad y Resguardo</Text>
                    <Text style={prepDesc}>
                      Tus datos curriculares son tratados bajo estricta confidencialidad conforme a la Ley N° 19.628 de Protección de la Vida Privada de Chile.
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* CTA Button */}
              <Section style={ctaSection}>
                <Button href={webUrl} style={primaryButton}>
                  Conoce Más Sobre Nuestros Proyectos &rarr;
                </Button>
              </Section>

              <Hr style={sectionDivider} />

              {/* Contact Box */}
              <Section style={contactCard}>
                <Text style={contactTitle}>¿Tienes alguna consulta sobre tu postulación?</Text>
                <Text style={contactDesc}>
                  Puedes responder directamente a este correo o escribirnos a{" "}
                  <Link href="mailto:contacto@solderio.cl" style={contactLink}>
                    contacto@solderio.cl
                  </Link>
                  . También estamos disponibles en WhatsApp al{" "}
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
                <strong>SoldeRío Energía SpA</strong> • Soluciones Solares de Alta Ingeniería
              </Text>
              <Text style={footerLegal}>
                Este mensaje fue enviado automáticamente como confirmación de tu postulación laboral en{" "}
                <Link href={webUrl} style={footerLink}>
                  solderio.cl
                </Link>
                . Puedes consultar nuestras{" "}
                <Link href={`${webUrl}/politicas-de-privacidad`} style={footerLink}>
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

export default PostulacionConfirmationEmail;

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
  backgroundColor: "#ECFDF5",
  color: "#059669",
  border: "1px solid #A7F3D0",
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

const detailValueFile: React.CSSProperties = {
  color: "#059669",
  fontSize: "13px",
  fontWeight: 600,
  margin: 0,
  wordBreak: "break-all",
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
