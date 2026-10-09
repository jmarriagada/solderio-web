/**
 * Solderío Solar Engineering - Generador Directo de PDF Carbone
 * Convierte la plantilla ejecutiva A4 en un archivo PDF descargable directamente
 */

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QuoteFormData, SolarSizingResult } from "@/types/cotizacion";

export async function downloadDirectSolarPdf(
  formData: QuoteFormData,
  sizing: SolarSizingResult,
  leadId: string
): Promise<void> {
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

  const isB2B = Boolean(sizing.isB2B || formData.propertyType === "comercial" || formData.propertyType === "agricola");
  const isOffGrid = formData.systemType === "offgrid";

  const monthlyRows = (sizing.monthlyBreakdown || [])
    .map((m, idx) => {
      const isSurplus = m.monthlyGenKwh >= m.monthlyDemandKwh;
      const balanceHtml = isOffGrid
        ? (isSurplus
            ? `<span style="color: #059669; font-weight: 700;">+${m.monthlyGenKwh - m.monthlyDemandKwh} kWh (Batería 100%)</span>`
            : `<span style="color: #d97706; font-weight: 700;">-${m.monthlyDemandKwh - m.monthlyGenKwh} kWh (BESS/Aux)</span>`)
        : (isSurplus
            ? `<span style="color: #059669; font-weight: 700;">+${m.monthlyGenKwh - m.monthlyDemandKwh} kWh</span>`
            : `<span style="color: #2563eb;">-${m.monthlyDemandKwh - m.monthlyGenKwh} kWh</span>`);

      return `
      <tr style="background-color: ${idx % 2 === 0 ? "#f8fafc" : "#ffffff"}; font-size: 10px;">
        <td style="padding: 5px 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #0f172a;">${m.monthName}</td>
        <td style="padding: 5px 8px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace;">${m.poaKwhM2Day}</td>
        <td style="padding: 5px 8px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace; font-weight: 700; color: #ea580c;">${m.monthlyGenKwh} kWh</td>
        <td style="padding: 5px 8px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace; color: #475569;">${m.monthlyDemandKwh} kWh</td>
        <td style="padding: 5px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace;">${balanceHtml}</td>
      </tr>`;
    })
    .join("");

  // Crear contenedor temporal fuera de pantalla pero con visibilidad completa para html2canvas
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "-99999px";
  container.style.left = "0";
  container.style.width = "820px";
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#1e293b";
  container.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  container.style.padding = "28px 32px";
  container.style.boxSizing = "border-box";
  container.style.zIndex = "-1000";

  container.innerHTML = `
    <!-- HEADER -->
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ea580c; padding-bottom: 10px; margin-bottom: 14px;">
      <div>
        <div style="font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">
          SOLDE<span style="color: #ea580c;">RÍO</span>
        </div>
        <div style="font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">
          ${isB2B 
            ? "Ingeniería Solar Corporativa • Macrozona Sur de Chile" 
            : isOffGrid 
              ? "Micro-Redes Aisladas & Almacenamiento • Macrozona Sur de Chile" 
              : "Ingeniería Solar & Micro-Redes • Macrozona Sur de Chile"}
        </div>
      </div>
      <div style="text-align: right;">
        <div style="display: inline-block; background-color: ${isB2B ? "#eff6ff" : isOffGrid ? "#ecfdf5" : "#fff7ed"}; color: ${isB2B ? "#1d4ed8" : isOffGrid ? "#047857" : "#c2410c"}; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-family: monospace; border: 1px solid ${isB2B ? "#dbeafe" : isOffGrid ? "#a7f3d0" : "#ffedd5"}; font-size: 11px; margin-bottom: 2px;">
          ${isB2B ? `DOSSIER B2B N° ${leadId}` : isOffGrid ? `PRE-INFORME PLANTA AISLADA N° ${leadId}` : `PRE-INFORME N° ${leadId}`}
        </div>
        <div style="font-size: 10px; color: #64748b;">Fecha: ${currentDateStr} • Validez: 15 días</div>
      </div>
    </div>

    <!-- GRID 1: CLIENTE (01) & ESPECIFICACION TECNICA (02) -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px;">
        <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px;">
          01. Información del Cliente & Inmueble
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2.5px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #64748b;">Titular del Proyecto:</span>
          <span style="font-weight: 700; color: #0f172a;">${formData.fullName}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2.5px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #64748b;">Comuna / Ubicación:</span>
          <span style="font-weight: 700; color: #0f172a;">${formData.comuna}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2.5px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #64748b;">Tipo de Propiedad:</span>
          <span style="font-weight: 700; color: #0f172a; text-transform: uppercase;">${formData.propertyType}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2.5px 0;">
          <span style="color: #64748b;">Distribuidora / Conexión:</span>
          <span style="font-weight: 700; color: #0f172a; text-transform: uppercase;">
            ${isOffGrid ? "Sitio Aislado (Off-Grid 100% Autónomo)" : `${formData.distributor} (${sizing.requiresThreePhase ? "Trifásico" : "Monofásico"})`}
          </span>
        </div>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px;">
        <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px;">
          02. Especificación Técnica Fotovoltaica
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2.5px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #64748b;">Potencia Sugerida:</span>
          <span style="font-weight: 700; color: #0f172a;">${sizing.recommendedKwp} kWp (${sizing.panelsCount} Módulos)</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2.5px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #64748b;">Módulos Tier 1:</span>
          <span style="font-weight: 700; color: #0f172a;">N-Type TOPCon ${sizing.panelWatts}W</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2.5px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #64748b;">${isOffGrid ? "Inversor Cargador Off-Grid:" : "Inversor Inteligente:"}</span>
          <span style="font-weight: 700; color: #0f172a;">${sizing.inverterKw} kW ${isOffGrid ? "(Con ATS Generador Aux)" : `(${(sizing.recommendedPhaseType || "monofasico").toUpperCase()})`}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2.5px 0;">
          <span style="color: #64748b;">${isOffGrid ? "Banco LiFePO4:" : sizing.batteryKwh > 0 ? "Batería LiFePO4:" : "Topología de Red:"}</span>
          <span style="font-weight: 700; color: #059669;">${
            isOffGrid
              ? `${sizing.batteryKwh} kWh (${sizing.usableBatteryKwh || Math.round(sizing.batteryKwh * 0.85)} kWh Útil 24/7)`
              : sizing.batteryKwh > 0
                ? `${sizing.batteryKwh} kWh (${sizing.usableBatteryKwh || Math.round(sizing.batteryKwh * 0.85)} kWh Útil)`
                : isB2B ? "On-Grid Industrial (Inyección & Autoconsumo)" : "On-Grid Residencial (Net Billing)"
          }</span>
        </div>
      </div>
    </div>

    <!-- GRID 2: FINANZAS (03) & SEC (04) -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px;">
        <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px;">
          ${isB2B ? "03. Indicadores Financieros & Tributarios (B2B)" : "03. Indicadores Financieros a 25 Años"}
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2.5px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #64748b;">Ahorro Anual Estimado:</span>
          <span style="font-weight: 700; color: #059669;">${formatCurrency(sizing.estimatedAnnualSavingsClp)} / año</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2.5px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #64748b;">Período de Retorno (Payback):</span>
          <span style="font-weight: 700; color: #0f172a;">${sizing.paybackYears} años (TIR: ${sizing.tirPercent || 15}%)</span>
        </div>
        ${isB2B ? `
        <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2.5px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #64748b;">Crédito Art. 33 bis LIR (5%):</span>
          <span style="font-weight: 700; color: #059669;">${formatCurrency(sizing.taxShieldArt33BisClp || 0)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2.5px 0;">
          <span style="color: #64748b;">IVA Crédito Fiscal (19%):</span>
          <span style="font-weight: 700; color: #059669;">${formatCurrency(sizing.recoverableVatClp || 0)} (F29)</span>
        </div>
        ` : `
        <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2.5px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #64748b;">Valor Actual Neto (VAN):</span>
          <span style="font-weight: 700; color: #0f172a;">${sizing.vanClp ? formatCurrency(sizing.vanClp) : "Positivo"}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2.5px 0;">
          <span style="color: #64748b;">Costo Nivelado (LCOE):</span>
          <span style="font-weight: 700; color: #0f172a;">$${sizing.lcoeClpPerKwh || 52} CLP / kWh</span>
        </div>
        `}
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px;">
            04. Cumplimiento Normativo SEC & O&M
          </div>
          <div style="margin-bottom: 4px;">
            ${isOffGrid ? `
            <span style="display: inline-block; background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 2px 5px; border-radius: 4px; font-size: 9px; font-weight: 700; margin-right: 3px;">RIC N°09 (Baterías)</span>
            <span style="display: inline-block; background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 2px 5px; border-radius: 4px; font-size: 9px; font-weight: 700; margin-right: 3px;">RIC N°10 Autónomas</span>
            <span style="display: inline-block; background-color: #fff7ed; color: #c2410c; border: 1px solid #ffedd5; padding: 2px 5px; border-radius: 4px; font-size: 9px; font-weight: 700;">Declaración TE-1 SEC</span>
            ` : `
            <span style="display: inline-block; background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 2px 5px; border-radius: 4px; font-size: 9px; font-weight: 700; margin-right: 3px;">RIC N°09</span>
            <span style="display: inline-block; background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 2px 5px; border-radius: 4px; font-size: 9px; font-weight: 700; margin-right: 3px;">PE Nº 1/26 Anti-Isla</span>
            <span style="display: inline-block; background-color: #fff7ed; color: #c2410c; border: 1px solid #ffedd5; padding: 2px 5px; border-radius: 4px; font-size: 9px; font-weight: 700;">Trámite TE-4 SEC</span>
            `}
          </div>
          <p style="font-size: 9.5px; color: #64748b; line-height: 1.3; margin-top: 3px;">
            ${isB2B 
              ? `Vía Regulatoria: ${sizing.regulatoryTitle || "Ley 21.118 Netbilling"}. Incluye O&M periódico y provisión para recambio de inversor en año 12.` 
              : isOffGrid
                ? "Proyecto autónomo 100% aislado de la red diseñado bajo estricta normativa SEC (RIC N°09 y N°10). Banco LiFePO4 de ciclo profundo, protecciones DC/AC integradas y tramitación formal TE-1."
                : "Proyecto llave en mano diseñado bajo estricta normativa chilena con tramitación formal ante la SEC y medidor bidireccional."}
          </p>
        </div>
        <div style="font-size: 9.5px; color: #ea580c; font-weight: 700; border-top: 1px solid #e2e8f0; padding-top: 3px; margin-top: 4px;">
          ${isOffGrid 
            ? "Banco LiFePO4: +6.000 Ciclos de Vida Útil • Tier 1 TOPCon 25 Años" 
            : "Garantía de Potencia Solar: 25 Años al 84.8% • Tier 1 TOPCon"}
        </div>
      </div>
    </div>

    <!-- SPOTLIGHT DE AHORRO / IMPACTO -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 9px; text-transform: uppercase; color: #ea580c; font-family: monospace; font-weight: 700; letter-spacing: 1px;">
          ${isB2B 
            ? "IMPACTO FINANCIERO OPERACIONAL" 
            : isOffGrid 
              ? "INDEPENDENCIA ENERGÉTICA TOTAL (OFF-GRID 24/7)" 
              : "NUEVA REALIDAD TARIFARIA (LEY 21.118)"}
        </div>
        <div style="font-size: 13px; font-weight: 600; color: #f8fafc; margin-top: 2px;">
          ${isB2B 
            ? `Inversión Neta: <strong style="color: #38bdf8;">${formatCurrency(sizing.estimatedSystemCostNetoClp || 0)}</strong> • Costo Neto Efectivo con Escudo Fiscal: <strong style="color: #34d399;">${formatCurrency((sizing.estimatedSystemCostNetoClp || 0) - (sizing.taxShieldArt33BisClp || 0))}</strong>`
            : isOffGrid
              ? `Gasto de referencia reemplazado: <span style="text-decoration: line-through; color: #94a3b8;">${formatCurrency(formData.monthlyBillClp)}</span> a solo <strong style="color: #34d399;">$0 / mes (Autosuficiencia 100%)</strong>`
              : `Tu cuenta baja de <span style="text-decoration: line-through; color: #94a3b8;">${formatCurrency(formData.monthlyBillClp)}</span> a solo <strong style="color: #34d399;">${formatCurrency(sizing.estimatedNewMonthlyBillClp || 14500)} / mes</strong>`}
        </div>
      </div>
      <div style="text-align: right; background-color: rgba(255,255,255,0.08); padding: 6px 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.15);">
        <div style="font-size: 9px; text-transform: uppercase; color: #94a3b8;">
          ${isOffGrid ? "Ahorro Operacional Anual" : "Ahorro Estimado Año 1"}
        </div>
        <div style="font-size: 15px; font-weight: 800; color: #34d399; font-family: monospace;">${formatCurrency(sizing.estimatedAnnualSavingsClp)} / año</div>
      </div>
    </div>

    <!-- TABLA DE BALANCE TMY (05) -->
    <div style="margin-bottom: 12px;">
      <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 5px;">
        05. ${isOffGrid ? "Balance de Autonomía & Generación Mensual TMY" : "Balance Energético Mensual TMY"} (${formData.comuna})
      </div>
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="background-color: #0f172a; color: #f8fafc; font-size: 9px; text-transform: uppercase;">
            <th style="padding: 5px 8px; border-top-left-radius: 4px;">Mes</th>
            <th style="padding: 5px 8px; text-align: center;">POA (kWh/m²/día)</th>
            <th style="padding: 5px 8px; text-align: center;">Generación Solar</th>
            <th style="padding: 5px 8px; text-align: center;">Consumo Estimado</th>
            <th style="padding: 5px 8px; text-align: right; border-top-right-radius: 4px;">
              ${isOffGrid ? "Balance / Autonomía" : "Balance Neto"}
            </th>
          </tr>
        </thead>
        <tbody>
          ${monthlyRows}
        </tbody>
      </table>
    </div>

    <!-- MARCO DE TRANSPARENCIA & GARANTÍAS (06) -->
    <div style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 14px; margin-bottom: 12px;">
      <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
        06. Marco de Transparencia & Qué Exigir al Contratar
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 9.5px; color: #334155;">
        ${isOffGrid ? `
        <div>
          <strong>1. Tecnología Tier 1 & LiFePO4:</strong> Módulos TOPCon 25 años, inversor cargador Off-Grid con ATS y baterías LiFePO4 +6.000 ciclos.<br>
          <strong>2. Soporte Local & Estanqueidad:</strong> Garantía por escrito de 1 año de cero goteras en techo y cuadrilla en terreno en el sur.
        </div>
        <div>
          <strong>3. Legalización SEC TE-1:</strong> Expediente técnico conforme a pliegos RIC N°09 y N°10 firmado por instalador SEC Clase A.<br>
          <strong>4. Hitos Contra Avance:</strong> 50% anticipo de equipos, 35% montaje y conexión banco BESS, y 15% final contra puesta en marcha.
        </div>
        ` : `
        <div>
          <strong>1. Tecnología Tier 1 Certificada:</strong> Módulos N-Type TOPCon 25 años e inversores SEC con protocolo anti-isla PE Nº 1/26.<br>
          <strong>2. Soporte Local & Estanqueidad:</strong> 1 año de garantía por escrito de cero goteras en techo y cuadrilla en el sur.
        </div>
        <div>
          <strong>3. Legalización SEC TE4:</strong> Tramitación completa de formularios F1 a F5 ante distribuidora por instalador autorizado.<br>
          <strong>4. Hitos Contra Avance:</strong> 50% anticipo de equipos, 35% en faena de montaje y 15% final contra TE4 aprobado.
        </div>
        `}
      </div>
    </div>

    <!-- FOOTER CON FIRMA -->
    <div style="border-top: 1px solid #cbd5e1; padding-top: 10px; margin-top: 8px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 9px; color: #64748b;">
      <div>
        <strong style="color: #0f172a;">SoldeRío SpA</strong> • RUT: 77.892.341-K<br>
        Casa Matriz: Puerto Varas, Región de Los Lagos • www.solderio.cl<br>
        Contacto: contacto@solderio.cl • +56 9 8765 4321
      </div>
      <div style="width: 180px; text-align: center; border-top: 1px solid #94a3b8; padding-top: 3px; font-size: 9px; color: #334155;">
        <strong style="display: block; font-size: 10px;">Depto. de Ingeniería Solar</strong>
        SoldeRío Energy Solutions<br>
        Ingeniero Eléctrico SEC Clase A
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;
    }

    const cleanFilename = `Pre-Informe-Solar-Solderio-${leadId || "Propuesta"}.pdf`;
    pdf.save(cleanFilename);
  } finally {
    document.body.removeChild(container);
  }
}
