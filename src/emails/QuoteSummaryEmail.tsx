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
import { SolarSizingResult } from "@/types/cotizacion";

export interface QuoteSummaryEmailProps {
  fullName?: string;
  leadId?: string;
  comuna?: string;
  distributor?: string;
  systemType?: string;
  sizing?: SolarSizingResult;
  portalUrl?: string;
  logoUrl?: string;
  isotipoUrl?: string;
  iconsBaseUrl?: string;
  boltIconUrl?: string;
  chartIconUrl?: string;
  shieldIconUrl?: string;
}

export function QuoteSummaryEmail({
  fullName = "Estimado/a cliente",
  leadId = "SOL-2026-1040",
  comuna = "Puerto Varas",
  distributor = "Saesa",
  systemType = "hibrida",
  sizing,
  portalUrl = "https://solderio.cl/cotizacion",
  logoUrl = "https://solderio.cl/logos/logo-solderio-lightmode.png",
  isotipoUrl = "https://solderio.cl/logos/isotipo.png",
  iconsBaseUrl = "https://solderio.cl/email-icons",
  boltIconUrl,
  chartIconUrl,
  shieldIconUrl,
}: QuoteSummaryEmailProps) {
  const finalBoltIcon = boltIconUrl || `${iconsBaseUrl}/bolt.png`;
  const finalChartIcon = chartIconUrl || `${iconsBaseUrl}/chart.png`;
  const finalShieldIcon = shieldIconUrl || `${iconsBaseUrl}/shield.png`;
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const recommendedKwp = sizing?.recommendedKwp || 5.2;
  const panelsCount = sizing?.panelsCount || Math.ceil((recommendedKwp * 1000) / 580);
  const annualSavings = sizing?.estimatedAnnualSavingsClp || 1730000;
  const annualGen = sizing?.estimatedAnnualGenKwh || Math.round(recommendedKwp * 1350);
  const autoconsumoPct = sizing?.autoconsumoPct || 75;

  const previewText = `Tu estudio solar en ${comuna} está listo: ${recommendedKwp} kWp y ahorro de ${formatCurrency(annualSavings)}/año`;

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
              <div style={folioBadge}>FOLIO: {leadId}</div>
            </Section>

            {/* Headline & Intro */}
            <Section style={heroSection}>
              <Heading as="h1" style={mainTitle}>
                Tu propuesta solar para {comuna} está lista
              </Heading>
              <Text style={introText}>
                Hola <strong>{fullName}</strong>, calculamos el dimensionamiento fotovoltaico preliminar optimizado para tu propiedad, considerando la radiación histórica de tu comuna y la normativa de <strong>{distributor.toUpperCase()}</strong>:
              </Text>
            </Section>

            {/* Metrics Highlight Card */}
            <Section style={metricsBox}>
              <Row>
                <Column style={metricColLeft}>
                  <Text style={metricLabel}>POTENCIA SUGERIDA</Text>
                  <Text style={metricValueOrange}>{recommendedKwp} kWp</Text>
                  <Text style={metricSub}>{panelsCount} Paneles TOPCon 580W</Text>
                </Column>
                <Column style={metricColRight}>
                  <Text style={metricLabel}>AHORRO PROYECTADO AÑO 1</Text>
                  <Text style={metricValueDark}>{formatCurrency(annualSavings)}</Text>
                  <Text style={metricSub}>Ley Net Billing 21.118</Text>
                </Column>
              </Row>

              <Hr style={innerDivider} />

              <Row>
                <Column style={metricColLeft}>
                  <Text style={metricLabel}>GENERACIÓN ESTIMADA</Text>
                  <Text style={metricValueSmall}>{annualGen.toLocaleString("es-CL")} kWh/año</Text>
                  <Text style={metricSub}>Alta captación solar</Text>
                </Column>
                <Column style={metricColRight}>
                  <Text style={metricLabel}>COBERTURA SOLAR</Text>
                  <Text style={metricValueSmall}>{autoconsumoPct}% Autoconsumo</Text>
                  <Text style={metricSub}>Energía limpia directa</Text>
                </Column>
              </Row>
            </Section>

            {/* Main Action Button */}
            <Section style={buttonContainer}>
              <Button href={portalUrl} style={primaryButton}>
                Ver Propuesta &rarr;
              </Button>
              <Text style={validityNotice}>
                Validez de la propuesta: 15 días a partir de su emisión.
              </Text>
              <Text style={buttonHint}>
                Accede a tu estudio técnico interactivo, curva estacional de generación y especificaciones de equipos.
              </Text>
            </Section>

            <Hr style={sectionDivider} />

            {/* Value Pillars with Line-Art Icons */}
            <Section style={pillarsSection}>
              <Text style={pillarsHeading}>¿POR QUÉ ELEGIR SOLDERÍO?</Text>

              <Row style={pillarRow}>
                <Column style={pillarIconCol}>
                  <Img
                    src={finalBoltIcon}
                    alt="Ingeniería SEC"
                    width="22"
                    height="22"
                    style={pillarIconImg}
                  />
                </Column>
                <Column style={pillarTextCol}>
                  <Text style={pillarTitle}>Ingeniería SEC Clase A</Text>
                  <Text style={pillarDesc}>
                    Proyectos certificados e inscritos formalmente ante la SEC (trámite TE-4) y la distribuidora zonal.
                  </Text>
                </Column>
              </Row>

              <Row style={pillarRow}>
                <Column style={pillarIconCol}>
                  <Img
                    src={finalChartIcon}
                    alt="Monitoreo"
                    width="22"
                    height="22"
                    style={pillarIconImg}
                  />
                </Column>
                <Column style={pillarTextCol}>
                  <Text style={pillarTitle}>Monitoreo Inteligente 24/7</Text>
                  <Text style={pillarDesc}>
                    Visualiza generación, inyección a la red y nivel de baterías en tiempo real desde tu smartphone.
                  </Text>
                </Column>
              </Row>

              <Row style={pillarRow}>
                <Column style={pillarIconCol}>
                  <Img
                    src={finalShieldIcon}
                    alt="Garantía"
                    width="22"
                    height="22"
                    style={pillarIconImg}
                  />
                </Column>
                <Column style={pillarTextCol}>
                  <Text style={pillarTitle}>Garantía y Calidad Industrial</Text>
                  <Text style={pillarDesc}>
                    25 años de rendimiento en paneles solares y respaldo técnico directo en la Macrozona Sur de Chile.
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Contact Card (Minimalist) */}
            <Section style={contactCard}>
              <Text style={contactTitle}>¿Quieres afinar este estudio o agendar una visita técnica?</Text>
              <Text style={contactDesc}>
                Nuestro equipo técnico está listo para resolver tus consultas y coordinar el levantamiento en terreno.
              </Text>
              <Row style={{ marginTop: "14px" }}>
                <Column style={{ textAlign: "center" }}>
                  <Button
                    href={`https://wa.me/56966186667?text=${encodeURIComponent(
                      `Hola SoldeRío, recibí mi propuesta solar Folio ${leadId} y me gustaría resolver consultas.`
                    )}`}
                    style={whatsappButton}
                  >
                    Chatear por WhatsApp
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
                Conforme a la Ley N° 19.496 (Protección de los Derechos de los Consumidores, Art. 28 B), tienes derecho a suspender envíos informativos. Si no deseas recibir más actualizaciones sobre esta propuesta, puedes{" "}
                <Link href={`https://solderio.cl/desuscribir?leadId=${leadId}`} style={footerUnsubscribeLink}>
                  darte de baja aquí
                </Link>{" "}
                o responder a este correo indicando &ldquo;BAJA&rdquo;.
              </Text>

              <Text style={footerLegal}>
                Recibes este correo porque solicitaste un dimensionamiento solar en nuestro cotizador web. Folio: {leadId}.
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
  backgroundColor: "#F3F4F6",
  color: "#4B5563",
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "0.12em",
  fontFamily: "monospace",
  padding: "4px 10px",
  borderRadius: "9999px",
  border: "1px solid #E5E7EB",
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

const metricsBox: React.CSSProperties = {
  backgroundColor: "#F9FAFB",
  borderRadius: "14px",
  border: "1px solid #E5E7EB",
  padding: "24px",
  marginBottom: "28px",
};

const metricColLeft: React.CSSProperties = {
  textAlign: "left",
  width: "50%",
  verticalAlign: "top",
};

const metricColRight: React.CSSProperties = {
  textAlign: "right",
  width: "50%",
  verticalAlign: "top",
};

const metricLabel: React.CSSProperties = {
  color: "#6B7280",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.1em",
  margin: "0 0 4px 0",
};

const metricValueOrange: React.CSSProperties = {
  color: "#FF8300",
  fontSize: "22px",
  fontWeight: 700,
  margin: "0 0 2px 0",
  letterSpacing: "-0.02em",
};

const metricValueDark: React.CSSProperties = {
  color: "#1F1F1F",
  fontSize: "22px",
  fontWeight: 700,
  margin: "0 0 2px 0",
  letterSpacing: "-0.02em",
};

const metricValueSmall: React.CSSProperties = {
  color: "#1F1F1F",
  fontSize: "16px",
  fontWeight: 600,
  margin: "0 0 2px 0",
};

const metricSub: React.CSSProperties = {
  color: "#6B7280",
  fontSize: "12px",
  margin: 0,
};

const innerDivider: React.CSSProperties = {
  borderColor: "#E5E7EB",
  margin: "18px 0",
};

const buttonContainer: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "32px",
};

const primaryButton: React.CSSProperties = {
  backgroundColor: "#FF8300",
  color: "#FFFFFF",
  borderRadius: "9999px",
  padding: "14px 36px",
  fontSize: "15px",
  fontWeight: 700,
  textDecoration: "none",
  display: "inline-block",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(255, 131, 0, 0.25)",
};

const validityNotice: React.CSSProperties = {
  color: "#FF8300",
  fontSize: "12px",
  fontWeight: 600,
  marginTop: "12px",
  marginBottom: "4px",
};

const buttonHint: React.CSSProperties = {
  color: "#6B7280",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "4px auto 0 auto",
  maxWidth: "420px",
};

const sectionDivider: React.CSSProperties = {
  borderColor: "#E5E7EB",
  margin: "28px 0",
};

const pillarsSection: React.CSSProperties = {
  marginBottom: "28px",
};

const pillarsHeading: React.CSSProperties = {
  color: "#9CA3AF",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  marginBottom: "16px",
  textAlign: "left",
};

const pillarRow: React.CSSProperties = {
  marginBottom: "14px",
};

const pillarIconCol: React.CSSProperties = {
  width: "32px",
  verticalAlign: "top",
  paddingTop: "1px",
};

const pillarIconImg: React.CSSProperties = {
  display: "block",
  width: "22px",
  height: "22px",
};

const pillarTextCol: React.CSSProperties = {
  verticalAlign: "top",
  paddingLeft: "8px",
};

const pillarTitle: React.CSSProperties = {
  color: "#1F1F1F",
  fontSize: "14px",
  fontWeight: 600,
  margin: "0 0 2px 0",
};

const pillarDesc: React.CSSProperties = {
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
  padding: "10px 22px",
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
