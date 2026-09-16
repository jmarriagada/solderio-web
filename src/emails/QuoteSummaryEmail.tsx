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
import { SolarSizingResult } from "@/types/cotizacion";

export interface QuoteSummaryEmailProps {
  fullName: string;
  leadId: string;
  comuna: string;
  distributor?: string;
  systemType?: string;
  sizing: SolarSizingResult;
  portalUrl?: string;
}

export function QuoteSummaryEmail({
  fullName = "Estimado/a cliente",
  leadId = "SOL-2026-0000",
  comuna = "Puerto Varas",
  distributor = "Saesa",
  systemType = "hibrida",
  sizing,
  portalUrl = "https://solderio.cl/cotizacion",
}: QuoteSummaryEmailProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const isHybrid = systemType === "hibrida";
  const isOffGrid = systemType === "offgrid";
  const recommendedKwp = sizing?.recommendedKwp || 4.1;
  const panelsCount = sizing?.panelsCount || Math.ceil((recommendedKwp * 1000) / 580);
  const annualSavings = sizing?.estimatedAnnualSavingsClp || 1200000;
  const annualGen = sizing?.estimatedAnnualGenKwh || Math.round(recommendedKwp * 1250);
  const systemCost = sizing?.estimatedSystemCostIvaClp || sizing?.estimatedSystemCostNetoClp || 0;

  const previewText = `Tu propuesta solar en ${comuna}: ${recommendedKwp} kWp y ahorro de ${formatCurrency(annualSavings)}/año | SoldeRío`;

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
                <Text style={badgeHeader}>ID: {leadId}</Text>
              </Column>
            </Row>
          </Section>

          {/* Main Hero Card */}
          <Section style={cardHero}>
            <Text style={categoryText}>PRE-INFORME TÉCNICO ENERGÉTICO</Text>
            <Heading as="h1" style={titleHeading}>
              Hola {fullName}, tu propuesta solar para {comuna} está lista
            </Heading>
            <Text style={paragraph}>
              Analizamos la radiación solar y condiciones climáticas de tu comuna junto a las normativas
              de tu distribuidora ({distributor.toUpperCase()}). Aquí tienes el dimensionamiento
              preliminar optimizado para tu propiedad:
            </Text>

            {/* Metrics Grid */}
            <Section style={metricsGrid}>
              <Row>
                <Column style={metricBox}>
                  <Text style={metricLabel}>POTENCIA SUGERIDA</Text>
                  <Text style={metricValue}>{recommendedKwp} kWp</Text>
                  <Text style={metricFoot}>{panelsCount} Paneles N-Type TOPCon 580W</Text>
                </Column>
                <Column style={metricBox}>
                  <Text style={metricLabel}>AHORRO AÑO 1</Text>
                  <Text style={metricValueOrange}>{formatCurrency(annualSavings)}</Text>
                  <Text style={metricFoot}>Bajo Ley Netbilling 21.118</Text>
                </Column>
              </Row>
              <Row style={{ marginTop: "12px" }}>
                <Column style={metricBox}>
                  <Text style={metricLabel}>GENERACIÓN ESTIMADA</Text>
                  <Text style={metricValue}>{annualGen.toLocaleString("es-CL")} kWh/año</Text>
                  <Text style={metricFoot}>Energía limpia y directa en tu techo</Text>
                </Column>
                <Column style={metricBox}>
                  <Text style={metricLabel}>SISTEMA DE RESPALDO</Text>
                  <Text style={metricValue}>
                    {isHybrid || isOffGrid ? "Batería LiFePO4" : "On-Grid SEC"}
                  </Text>
                  <Text style={metricFoot}>
                    {isHybrid ? "Respaldo continuo en cortes de red" : "Sincronizado a red sin baterías"}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Total Budget Row */}
            {systemCost > 0 && (
              <Section style={budgetBanner}>
                <Row>
                  <Column>
                    <Text style={budgetLabel}>PRESUPUESTO ESTIMADO LLAVE EN MANO</Text>
                    <Text style={budgetValue}>{formatCurrency(systemCost)} CLP</Text>
                    <Text style={budgetSub}>IVA incluido • Materiales, Montaje y Certificación SEC</Text>
                  </Column>
                </Row>
              </Section>
            )}

            {/* Main CTA */}
            <Section style={{ textAlign: "center", marginTop: "28px", marginBottom: "16px" }}>
              <Button
                style={ctaButton}
                href={`https://solderio.cl/cotizacion?leadId=${leadId}&action=visita`}
              >
                Agendar Visita Técnica en Terreno →
              </Button>
              <Text style={ctaSubtext}>
                Diagnóstico in situ, evaluación de cubierta y presupuesto 100% cerrado.
              </Text>
            </Section>
          </Section>

          {/* Included Services Section */}
          <Section style={includedSection}>
            <Text style={includedTitle}>Tu Proyecto Llave en Mano Incluye:</Text>
            <Text style={includedItem}>✓ <strong>Ingeniería & Planos Eléctricos:</strong> Memoria de cálculo y diseño a medida para el sur.</Text>
            <Text style={includedItem}>✓ <strong>Montaje Certificado:</strong> Estructura de fijación para viento y lluvia austral.</Text>
            <Text style={includedItem}>✓ <strong>Certificación SEC TE-4:</strong> Tramitación legal completa y cambio de medidor con tu distribuidora.</Text>
            <Text style={includedItem}>✓ <strong>Garantía de Rendimiento:</strong> 25 años en paneles solares y 3 años en instalación.</Text>
            <Text style={includedItem}>✓ <strong>Monitoreo en Tiempo Real:</strong> App móvil para ver tu generación y consumos 24/7.</Text>
          </Section>

          {/* Online Report Link */}
          <Section style={onlineReportSection}>
            <Text style={onlineReportText}>
              ¿Quieres revisar los gráficos estacionales mes a mes o simular financiamiento con Crédito Verde?{" "}
              <Link href={portalUrl} style={onlineReportLink}>
                Ver tu propuesta digital interactiva en línea →
              </Link>
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer & Anti-Spam Compliance */}
          <Section style={footerSection}>
            <Text style={footerText}>
              <strong>SoldeRío SpA</strong> • Soluciones de Generación Solar Fotovoltaica y Resiliencia Energética
            </Text>
            <Text style={footerSub}>
              Puerto Varas, Región de Los Lagos, Chile • Teléfono/WhatsApp: +56 9 9123 4567
            </Text>
            <Text style={footerSub}>
              Correo oficial:{" "}
              <Link href="mailto:contacto@solderio.cl" style={{ color: "#FF8300" }}>
                contacto@solderio.cl
              </Link>{" "}
              • Web:{" "}
              <Link href="https://solderio.cl" style={{ color: "#FFFFFF" }}>
                solderio.cl
              </Link>
            </Text>

            <Text style={footerLegal}>
              Recibiste este correo porque solicitaste una pre-evaluación solar en solderio.cl. De conformidad
              con la Ley 19.628 de Protección de Datos Personales y Ley 19.496, tus datos se encuentran protegidos.
              Si no realizaste esta solicitud, puedes ignorar este mensaje o{" "}
              <Link href="https://solderio.cl/contacto" style={{ color: "#888888", textDecoration: "underline" }}>
                darte de baja aquí
              </Link>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default QuoteSummaryEmail;

// --- Email Styles (Inline compatible for maximum email client deliverability) ---
const main = {
  backgroundColor: "#0A0A0A",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  color: "#FFFFFF",
  margin: "0 auto",
  padding: "24px 0",
};

const container = {
  backgroundColor: "#141414",
  border: "1px solid #262626",
  borderRadius: "16px",
  maxWidth: "600px",
  margin: "0 auto",
  padding: "32px 24px",
  overflow: "hidden",
};

const headerSection = {
  marginBottom: "24px",
};

const logoBrand = {
  fontSize: "22px",
  fontWeight: "800",
  letterSpacing: "1px",
  color: "#FFFFFF",
  margin: "0",
  lineHeight: "1.2",
};

const logoSub = {
  fontSize: "9px",
  letterSpacing: "1.5px",
  color: "#888888",
  margin: "2px 0 0 0",
};

const badgeHeader = {
  fontSize: "11px",
  fontFamily: "monospace",
  color: "#FF8300",
  backgroundColor: "rgba(255, 131, 0, 0.12)",
  border: "1px solid rgba(255, 131, 0, 0.3)",
  borderRadius: "20px",
  padding: "4px 10px",
  display: "inline-block",
  margin: "0",
};

const cardHero = {
  backgroundColor: "#1A1A1A",
  border: "1px solid #2B2B2B",
  borderRadius: "14px",
  padding: "24px 20px",
  marginBottom: "20px",
};

const categoryText = {
  fontSize: "11px",
  fontFamily: "monospace",
  letterSpacing: "1px",
  color: "#FF8300",
  fontWeight: "600",
  margin: "0 0 8px 0",
};

const titleHeading = {
  fontSize: "22px",
  fontWeight: "400",
  color: "#FFFFFF",
  lineHeight: "1.3",
  margin: "0 0 14px 0",
};

const paragraph = {
  fontSize: "13px",
  lineHeight: "1.6",
  color: "#BBBBBB",
  margin: "0 0 20px 0",
};

const metricsGrid = {
  marginBottom: "16px",
};

const metricBox = {
  backgroundColor: "#101010",
  border: "1px solid #262626",
  borderRadius: "10px",
  padding: "12px 14px",
  width: "50%",
};

const metricLabel = {
  fontSize: "10px",
  fontFamily: "monospace",
  color: "#888888",
  margin: "0 0 4px 0",
  letterSpacing: "0.5px",
};

const metricValue = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#FFFFFF",
  margin: "0 0 2px 0",
  lineHeight: "1.2",
};

const metricValueOrange = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#FF8300",
  margin: "0 0 2px 0",
  lineHeight: "1.2",
};

const metricFoot = {
  fontSize: "10px",
  color: "#777777",
  margin: "0",
};

const budgetBanner = {
  backgroundColor: "#0F1A12",
  border: "1px solid rgba(16, 185, 129, 0.3)",
  borderRadius: "10px",
  padding: "14px 16px",
  marginTop: "16px",
};

const budgetLabel = {
  fontSize: "10px",
  fontFamily: "monospace",
  color: "#10B981",
  fontWeight: "600",
  margin: "0 0 4px 0",
};

const budgetValue = {
  fontSize: "20px",
  fontWeight: "800",
  color: "#FFFFFF",
  margin: "0 0 2px 0",
};

const budgetSub = {
  fontSize: "10px",
  color: "#888888",
  margin: "0",
};

const ctaButton = {
  backgroundColor: "#FF8300",
  color: "#FFFFFF",
  borderRadius: "28px",
  padding: "13px 26px",
  fontSize: "13px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
  margin: "0 auto",
  boxShadow: "0 4px 14px rgba(255, 131, 0, 0.3)",
};

const ctaSubtext = {
  fontSize: "11px",
  color: "#777777",
  marginTop: "10px",
  marginBottom: "0",
};

const includedSection = {
  backgroundColor: "#161616",
  border: "1px solid #222222",
  borderRadius: "12px",
  padding: "18px 20px",
  marginBottom: "20px",
};

const includedTitle = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#FFFFFF",
  margin: "0 0 10px 0",
};

const includedItem = {
  fontSize: "11px",
  lineHeight: "1.6",
  color: "#AAAAAA",
  margin: "0 0 6px 0",
};

const onlineReportSection = {
  textAlign: "center" as const,
  marginBottom: "20px",
};

const onlineReportText = {
  fontSize: "12px",
  color: "#888888",
  margin: "0",
};

const onlineReportLink = {
  color: "#FF8300",
  textDecoration: "none",
  fontWeight: "500",
};

const divider = {
  borderColor: "#222222",
  margin: "24px 0 16px 0",
};

const footerSection = {
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "11px",
  color: "#888888",
  margin: "0 0 4px 0",
};

const footerSub = {
  fontSize: "10px",
  color: "#666666",
  margin: "0 0 4px 0",
};

const footerLegal = {
  fontSize: "9px",
  lineHeight: "1.5",
  color: "#444444",
  marginTop: "12px",
  marginBottom: "0",
};
