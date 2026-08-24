/**
 * Solderío Solar Engineering - Generador y Exportador de Reportes Carbone
 * Genera el documento HTML ejecutivo A4 puro y lanza la exportación a PDF aislada
 */

import { QuoteFormData, SolarSizingResult } from "@/types/cotizacion";

export function generateCarboneReportHtml(
  formData: QuoteFormData,
  sizing: SolarSizingResult,
  leadId: string
): string {
  const currentDateStr = new Date().toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const monthlyRows = (sizing.monthlyBreakdown || [])
    .map((m, idx) => {
      const isSurplus = m.monthlyGenKwh >= m.monthlyDemandKwh;
      const balanceHtml = isSurplus
        ? `<span style="color: #059669; font-weight: 600;">+${m.monthlyGenKwh - m.monthlyDemandKwh} kWh (Inyección)</span>`
        : `<span style="color: #2563eb;">-${m.monthlyDemandKwh - m.monthlyGenKwh} kWh (Red/BESS)</span>`;

      return `
      <tr style="background-color: ${idx % 2 === 0 ? "#f8fafc" : "#ffffff"};">
        <td style="padding: 5px 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #0f172a;">${m.monthName}</td>
        <td style="padding: 5px 8px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace;">${m.poaKwhM2Day}</td>
        <td style="padding: 5px 8px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace; font-weight: 600; color: #ea580c;">${m.monthlyGenKwh} kWh</td>
        <td style="padding: 5px 8px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace; color: #475569;">${m.monthlyDemandKwh} kWh</td>
        <td style="padding: 5px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace;">${balanceHtml}</td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Pre-Informe Técnico Solar - ${formData.fullName} - SoldeRío</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 12mm 12mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      background-color: #ffffff;
      color: #1e293b;
      font-size: 9.5pt;
      line-height: 1.35;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      padding: 10px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #ea580c;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .logo-title {
      font-size: 20pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .logo-title span {
      color: #ea580c;
    }
    .company-sub {
      font-size: 8pt;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }
    .doc-meta {
      text-align: right;
      font-size: 8.5pt;
      color: #475569;
    }
    .doc-id {
      display: inline-block;
      background-color: #fff7ed;
      color: #c2410c;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 700;
      font-family: monospace;
      border: 1px solid #ffedd5;
      margin-bottom: 3px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 14px;
    }
    .card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 12px;
      break-inside: avoid;
    }
    .card-title {
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 700;
      color: #64748b;
      margin-bottom: 6px;
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      padding: 2.5px 0;
      border-bottom: 1px dashed #e2e8f0;
      font-size: 8.5pt;
    }
    .stat-row:last-child {
      border-bottom: none;
    }
    .stat-label {
      color: #64748b;
    }
    .stat-value {
      font-weight: 600;
      color: #0f172a;
    }
    .highlight-card {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      break-inside: avoid;
    }
    .highlight-left h3 {
      font-size: 11pt;
      font-weight: 600;
      color: #f8fafc;
    }
    .highlight-left p {
      font-size: 8pt;
      color: #94a3b8;
    }
    .highlight-badge {
      text-align: right;
    }
    .highlight-badge .amount {
      font-size: 14pt;
      font-weight: 700;
      color: #34d399;
      font-family: monospace;
    }
    .table-container {
      margin-bottom: 14px;
      break-inside: avoid;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
      text-align: left;
    }
    th {
      background-color: #0f172a;
      color: #f8fafc;
      padding: 5px 8px;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 7.5pt;
      letter-spacing: 0.5px;
    }
    .badge-sec {
      display: inline-block;
      background-color: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 7.5pt;
      font-weight: 600;
      margin-right: 4px;
      margin-bottom: 4px;
    }
    .footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 8px;
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 7.5pt;
      color: #64748b;
      break-inside: avoid;
    }
    .signature-box {
      border-top: 1px solid #94a3b8;
      width: 180px;
      text-align: center;
      padding-top: 4px;
      font-size: 7.5pt;
      color: #334155;
    }
  </style>
</head>
<body>

  <!-- Header Membretado SoldeRío -->
  <div class="header">
    <div>
      <div class="logo-title">SOLDE<span>RÍO</span></div>
      <div class="company-sub">Ingeniería Solar & Micro-Redes • Macrozona Sur de Chile</div>
    </div>
    <div class="doc-meta">
      <div class="doc-id">PRE-INFORME TÉCNICO N° ${leadId}</div>
      <div>Fecha de Emisión: ${currentDateStr}</div>
      <div>Validez Comercial: 30 Días corridos</div>
    </div>
  </div>

  <!-- Resumen del Cliente y Ubicación -->
  <div class="grid-2">
    <div class="card">
      <div class="card-title">01. Datos del Cliente & Inmueble</div>
      <div class="stat-row">
        <span class="stat-label">Titular:</span>
        <span class="stat-value">${formData.fullName}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Comuna:</span>
        <span class="stat-value">${formData.comuna} (Macrozona Sur)</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Tipo de Inmueble:</span>
        <span class="stat-value">${formData.propertyType.toUpperCase()}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Distribuidora / Tarifa:</span>
        <span class="stat-value">${formData.distributor.toUpperCase()} (Tarifa BT-1)</span>
      </div>
    </div>

    <div class="card">
      <div class="card-title">02. Ingeniería Fotovoltaica Propuesta</div>
      <div class="stat-row">
        <span class="stat-label">Potencia Instalada:</span>
        <span class="stat-value">${sizing.recommendedKwp} kWp (${sizing.panelsCount} Módulos)</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Tecnología Módulos:</span>
        <span class="stat-value">Tier 1 N-Type TOPCon ${sizing.panelWatts}W</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Inversor Inteligente:</span>
        <span class="stat-value">${sizing.inverterKw} kW (${(sizing.recommendedPhaseType || "monofasico").toUpperCase()})</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Batería LiFePO4:</span>
        <span class="stat-value">${
          sizing.batteryKwh > 0
            ? `${sizing.batteryKwh} kWh (${sizing.usableBatteryKwh || Math.round(sizing.batteryKwh * 0.85)} kWh Útil, STS <10ms)`
            : "On-Grid (Sin Baterías)"
        }</span>
      </div>
    </div>
  </div>

  <!-- Spotlight Financiero -->
  <div class="highlight-card">
    <div class="highlight-left">
      <h3>Nueva Realidad Energética del Hogar</h3>
      <p>Tu boleta mensual baja de ${formatCurrency(formData.monthlyBillClp)} a solo ${formatCurrency(sizing.estimatedNewMonthlyBillClp || 14500)} / mes.</p>
    </div>
    <div class="highlight-badge">
      <div style="font-size: 7.5pt; color: #94a3b8; text-transform: uppercase;">Ahorro Proyectado Año 1</div>
      <div class="amount">${formatCurrency(sizing.estimatedAnnualSavingsClp)} / año</div>
    </div>
  </div>

  <!-- Tabla de Balance Energético Mes a Mes (TMY Sur) -->
  <div class="table-container">
    <div class="card-title" style="margin-bottom: 5px;">03. Balance Energético Mensualizado TMY (Generación Solar vs Consumo)</div>
    <table>
      <thead>
        <tr>
          <th>Mes</th>
          <th style="text-align: center;">Irradiancia POA (kWh/m²/día)</th>
          <th style="text-align: center;">Generación Solar</th>
          <th style="text-align: center;">Consumo Hogar</th>
          <th style="text-align: right;">Balance / Excedente Ley 21.118</th>
        </tr>
      </thead>
      <tbody>
        ${monthlyRows}
      </tbody>
    </table>
  </div>

  <!-- Indicadores Financieros y Normativa SEC -->
  <div class="grid-2">
    <div class="card">
      <div class="card-title">04. Indicadores Económicos a 25 Años</div>
      <div class="stat-row">
        <span class="stat-label">Ahorro Acumulado (25 Años):</span>
        <span class="stat-value" style="color: #059669;">${formatCurrency(sizing.estimated25YearSavingsClp)}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Período de Retorno (Payback):</span>
        <span class="stat-value">${sizing.paybackYears} Años</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Valor Actual Neto (VAN):</span>
        <span class="stat-value">${sizing.vanClp ? formatCurrency(sizing.vanClp) : "Positivo"}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Costo Nivelado (LCOE):</span>
        <span class="stat-value">$${sizing.lcoeClpPerKwh || 52} CLP / kWh</span>
      </div>
    </div>

    <div class="card">
      <div class="card-title">05. Cumplimiento Normativo SEC & Garantías</div>
      <div style="margin-bottom: 6px;">
        <span class="badge-sec">RIC N°09 (DC/AC)</span>
        <span class="badge-sec">RIC N°15 (Anti-Isla)</span>
        <span class="badge-sec">Trámite TE-4 SEC</span>
      </div>
      <p style="font-size: 7.5pt; color: #64748b; line-height: 1.3;">
        Instalación proyectada y declarada ante la Superintendencia de Electricidad y Combustibles (SEC) por Ingeniero Eléctrico Clase A. Habilita venta legal de excedentes a ${formData.distributor.toUpperCase()}.
      </p>
      <div style="margin-top: 6px; font-size: 7.5pt; color: #ea580c; font-weight: 600;">
        Garantía de Potencia Solar: 25 Años al 84.8%
      </div>
    </div>
  </div>

  <!-- Footer con Firma y Contacto -->
  <div class="footer">
    <div>
      <strong>SoldeRío SpA</strong> • RUT: 77.892.341-K<br>
      Casa Matriz: Puerto Varas, Región de Los Lagos • www.solderio.cl<br>
      Contacto: contacto@solderio.cl • +56 9 8765 4321
    </div>
    <div class="signature-box">
      <strong>Depto. de Ingeniería Solar</strong><br>
      SoldeRío Energy Solutions<br>
      Ingeniero Eléctrico SEC Clase A
    </div>
  </div>

</body>
</html>`;
}

/**
 * Abre una ventana o iframe limpio y aislado para imprimir exclusivamente el reporte Carbone
 */
export function downloadCarbonePdf(
  formData: QuoteFormData,
  sizing: SolarSizingResult,
  leadId: string
) {
  const htmlContent = generateCarboneReportHtml(formData, sizing, leadId);

  // Crear un iframe invisible para aislar 100% la impresión del DOM de la aplicación
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    // Fallback: abrir en nueva ventana
    const printWin = window.open("", "_blank");
    if (printWin) {
      printWin.document.write(htmlContent);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
      }, 300);
    }
    return;
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();

  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 400);
}
