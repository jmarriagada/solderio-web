import fs from "fs";
import path from "path";
import React from "react";
import { render } from "@react-email/render";
import { chromium } from "playwright";
import { QuoteSummaryEmail } from "../src/emails/QuoteSummaryEmail";
import { VisitaTecnicaConfirmationEmail } from "../src/emails/VisitaTecnicaConfirmationEmail";

async function generateScreenshots() {
  console.log("Iniciando generación de capturas para correos rediseñados...");

  // 1. Cargar logos e iconos oficiales en Base64 para visualización offline exacta
  const logoPath = path.join(
    process.cwd(),
    "public",
    "logos",
    "logo-solderio-lightmode.png"
  );
  const isotipoPath = path.join(
    process.cwd(),
    "public",
    "logos",
    "isotipo.png"
  );
  const boltPath = path.join(
    process.cwd(),
    "public",
    "email-icons",
    "bolt.png"
  );
  const chartPath = path.join(
    process.cwd(),
    "public",
    "email-icons",
    "chart.png"
  );
  const shieldPath = path.join(
    process.cwd(),
    "public",
    "email-icons",
    "shield.png"
  );

  const logoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`;
  const isotipoBase64 = `data:image/png;base64,${fs.readFileSync(isotipoPath).toString("base64")}`;
  const boltBase64 = `data:image/png;base64,${fs.readFileSync(boltPath).toString("base64")}`;
  const chartBase64 = `data:image/png;base64,${fs.readFileSync(chartPath).toString("base64")}`;
  const shieldBase64 = `data:image/png;base64,${fs.readFileSync(shieldPath).toString("base64")}`;

  // 2. Renderizar Correo de Cotización Solar
  const quoteHtml = await render(
    React.createElement(QuoteSummaryEmail, {
      fullName: "Jorge Matías Arriagada",
      leadId: "SOL-2026-4820",
      comuna: "Puerto Varas",
      distributor: "Saesa",
      systemType: "hibrida",
      sizing: {
        recommendedKwp: 5.2,
        panelsCount: 9,
        panelWatts: 580,
        inverterKw: 5,
        batteryKwh: 10,
        estimatedMonthlyGenKwh: 586,
        estimatedAnnualGenKwh: 7037,
        estimatedAnnualSavingsClp: 1730000,
        estimated25YearSavingsClp: 62068783,
        paybackYears: 3.2,
        co2TonsAvoidedPerYear: 2.7,
        equivalentTreesPlanted: 43,
        autoconsumoPct: 75,
        averageMonthlyDemandKwh: 549,
        secNorms: [],
        estimatedSystemCostNetoClp: 4800000,
        estimatedSystemCostIvaClp: 5712000,
        downpaymentHito1Clp: 2400000,
        faenaHito2Clp: 1680000,
        finalHito3Clp: 720000,
        margenBrutoPct: 28,
        selectedOmPackage: {
          id: "basic",
          name: "Garantía Estándar",
          badge: "Incluida",
          monthlyPriceClp: 0,
          monthlyPriceUf: 0,
          tagline: "Garantía técnica",
          features: [],
        },
        usableBatteryKwh: 10,
        seasonalVariationRatio: 3.2,
        summerAvgMonthlyGenKwh: 890,
        winterAvgMonthlyGenKwh: 270,
        monthlyBreakdown: [],
        vanClp: 21000000,
        tirPercent: 22,
        lcoeClpPerKwh: 38,
        requiresThreePhase: false,
        recommendedPhaseType: "monofasico",
        estimatedNewMonthlyBillClp: 5800,
        winterLimitSavingsClp: 135000,
        coberturaTotalAnualPct: 100,
        applianceEquivalencies: [],
      },
      portalUrl: "https://solderio.cl/propuesta/SOL-2026-4820",
      logoUrl: logoBase64,
      isotipoUrl: isotipoBase64,
      boltIconUrl: boltBase64,
      chartIconUrl: chartBase64,
      shieldIconUrl: shieldBase64,
    })
  );

  // 3. Renderizar Correo de Visita Técnica
  const visitaHtml = await render(
    React.createElement(VisitaTecnicaConfirmationEmail, {
      folio: "VT-2026-3912",
      nombreCliente: "Jorge Matías Arriagada",
      direccion: "Camino Los Colonos Parcela 12",
      comuna: "Puerto Varas",
      region: "Región de Los Lagos",
      fechaLegible: "Jueves, 25 de Septiembre de 2026",
      horarioLegible: "09:30 - 12:30 hrs (Mañana)",
      googleCalendarUrl: "https://calendar.google.com",
      outlookCalendarUrl: "https://outlook.live.com",
      hasIcsAttachment: true,
      logoUrl: logoBase64,
      isotipoUrl: isotipoBase64,
    })
  );

  // 4. Guardar archivos HTML temporales
  const quoteHtmlPath = path.join(process.cwd(), "scripts", "quote-preview.html");
  const visitaHtmlPath = path.join(process.cwd(), "scripts", "visita-preview.html");
  fs.writeFileSync(quoteHtmlPath, quoteHtml, "utf-8");
  fs.writeFileSync(visitaHtmlPath, visitaHtml, "utf-8");

  // Destino de las capturas en el directorio de artefactos
  const artifactsDir = "C:\\Users\\Jorge Matías\\.gemini\\antigravity\\brain\\d7b47f23-c01d-4731-b392-7627f4ebb657";
  const quoteScreenshotPath = path.join(artifactsDir, "captura_correo_cotizacion.png");
  const visitaScreenshotPath = path.join(artifactsDir, "captura_correo_visita_tecnica.png");

  // 5. Capturar con Playwright
  console.log("Lanzando navegador Chromium headless...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 680, height: 1200 },
    deviceScaleFactor: 2, // Retina resolution para nitidez cristalina
  });

  console.log("Capturando Correo de Cotización...");
  await page.goto(`file://${quoteHtmlPath}`);
  await page.waitForTimeout(500);
  await page.screenshot({ path: quoteScreenshotPath, fullPage: true });

  console.log("Capturando Correo de Visita Técnica...");
  await page.goto(`file://${visitaHtmlPath}`);
  await page.waitForTimeout(500);
  await page.screenshot({ path: visitaScreenshotPath, fullPage: true });

  await browser.close();

  console.log("Capturas generadas exitosamente en:");
  console.log("1. " + quoteScreenshotPath);
  console.log("2. " + visitaScreenshotPath);
}

generateScreenshots().catch((err) => {
  console.error("Error al generar capturas:", err);
  process.exit(1);
});
