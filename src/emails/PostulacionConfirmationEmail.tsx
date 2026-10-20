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
              <Img
                src={logoUrl}
                alt="SoldeRío Energía SpA"
                width="160"
                height="auto"
                style={logoImg}
              />
              <div style={statusBadge}>POSTULACIÓN RECIBIDA</div>
            </Section>

            {/* Headline & Intro */}
            <Section style={heroSection}>
              <Heading as="h1" style={mainTitle}>
                ¡Gracias por postular a SoldeRío!
              </Heading>
              <Text style={introText}>
                Hola <strong>{nombre}</strong>, confirmamos que hemos recibido exitosamente tus antecedentes profesionales para formar parte de nuestro equipo de ingeniería e instalaciones fotovoltaicas en el sur de Chile.
              </Text>
            </Section>

            {/* Application Summary Box */}
            <Section style={detailsBox}>
              <Row style={detailRow}>
                <Column style={detailCol}>
                  <Text style={detailLabel}>CARGO POSTULADO</Text>
                  <Text style={detailValueHighlight}>{cargo}</Text>
                </Column>
                <Column style={detailColRight}>
                  <Text style={detailLabel}>UBICACIÓN / ZONA</Text>
                  <Text style={detailValueDark}>{comuna}</Text>
                </Column>
              </Row>

              <Hr style={innerDivider} />

              <Row style={detailRow}>
                <Column style={{ width: "100%" }}>
                  <Text style={detailLabel}>DOCUMENTO REGISTRADO</Text>
                  <Text style={detailValueFile}>📎 {cvFileName}</Text>
                </Column>
              </Row>

              <Hr style={innerDivider} />

              <Row style={detailRow}>
                <Column style={{ width: "100%" }}>
                  <Text style={detailLabel}>FECHA DE RECEPCIÓN</Text>
                  <Text style={detailValueText}>{fechaPostulacion}</Text>
                </Column>
              </Row>
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
                    Nuestro equipo técnico y de proyectos evaluará tu perfil, experiencia y certificaciones conforme a los requerimientos del cargo.
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

            {/* Footer */}
            <Section style={footer}>
              <Text style={footerBrand}>
                <strong>SoldeRío Energía SpA</strong> • Soluciones Solares de Alta Ingeniería
              </Text>
              <Text style={footerAddress}>
                Puerto Varas, Región de Los Lagos, Chile • RUT 77.838.452-9
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
  backgroundColor: "#0d0d0d",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  padding: "40px 0",
};

const container: React.CSSProperties = {
  margin: "0 auto",
  maxWidth: "580px",
  padding: "0 16px",
};

const card: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.25)",
  border: "1px solid #E5E7EB",
};

const header: React.CSSProperties = {
  padding: "28px 36px 20px 36px",
  borderBottom: "1px solid #F3F4F6",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logoImg: React.CSSProperties = {
  display: "block",
  maxWidth: "160px",
  height: "auto",
};

const statusBadge: React.CSSProperties = {
  backgroundColor: "#ECFDF5",
  color: "#059669",
  border: "1px solid #A7F3D0",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  padding: "5px 12px",
  borderRadius: "9999px",
  display: "inline-block",
};

const heroSection: React.CSSProperties = {
  padding: "28px 36px 8px 36px",
};

const mainTitle: React.CSSProperties = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: 800,
  letterSpacing: "-0.02em",
  lineHeight: "1.25",
  margin: "0 0 12px 0",
};

const introText: React.CSSProperties = {
  color: "#4B5563",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
};

const detailsBox: React.CSSProperties = {
  backgroundColor: "#F9FAFB",
  borderRadius: "12px",
  border: "1px solid #E5E7EB",
  margin: "8px 36px 24px 36px",
  padding: "20px",
};

const detailRow: React.CSSProperties = {
  width: "100%",
};

const detailCol: React.CSSProperties = {
  width: "60%",
  verticalAlign: "top",
};

const detailColRight: React.CSSProperties = {
  width: "40%",
  verticalAlign: "top",
  textAlign: "right",
};

const detailLabel: React.CSSProperties = {
  color: "#9CA3AF",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.1em",
  margin: "0 0 4px 0",
};

const detailValueHighlight: React.CSSProperties = {
  color: "#FF8300",
  fontSize: "15px",
  fontWeight: 700,
  margin: 0,
};

const detailValueDark: React.CSSProperties = {
  color: "#1F2937",
  fontSize: "13px",
  fontWeight: 600,
  margin: 0,
};

const detailValueFile: React.CSSProperties = {
  color: "#059669",
  fontSize: "13px",
  fontWeight: 600,
  margin: 0,
};

const detailValueText: React.CSSProperties = {
  color: "#374151",
  fontSize: "13px",
  fontWeight: 500,
  margin: 0,
};

const innerDivider: React.CSSProperties = {
  borderColor: "#E5E7EB",
  margin: "12px 0",
};

const prepSection: React.CSSProperties = {
  padding: "0 36px",
  marginBottom: "24px",
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
  marginBottom: "16px",
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

const ctaSection: React.CSSProperties = {
  textAlign: "center",
  padding: "8px 36px 20px 36px",
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
  boxShadow: "0 4px 12px rgba(255, 131, 0, 0.3)",
};

const sectionDivider: React.CSSProperties = {
  borderColor: "#F3F4F6",
  margin: "20px 36px",
};

const contactCard: React.CSSProperties = {
  backgroundColor: "#F9FAFB",
  borderRadius: "12px",
  border: "1px solid #E5E7EB",
  padding: "16px 20px",
  textAlign: "center",
  margin: "0 36px 28px 36px",
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
  padding: "24px 36px",
  textAlign: "center",
};

const footerBrand: React.CSSProperties = {
  color: "#F3F4F6",
  fontSize: "12px",
  margin: "0 0 4px 0",
};

const footerAddress: React.CSSProperties = {
  color: "#9CA3AF",
  fontSize: "11px",
  margin: "0 0 10px 0",
};

const footerLegal: React.CSSProperties = {
  color: "#6B7280",
  fontSize: "10px",
  lineHeight: "1.4",
  margin: 0,
};

const footerLink: React.CSSProperties = {
  color: "#9CA3AF",
  textDecoration: "underline",
};
