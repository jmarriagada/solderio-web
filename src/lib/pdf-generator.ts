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

  const monthlyRows = (sizing.monthlyBreakdown || [])
    .map((m, idx) => {
      const isSurplus = m.monthlyGenKwh >= m.monthlyDemandKwh;
      const balanceHtml = isSurplus
        ? `<span style="color: #059669; font-weight: 700;">+${m.monthlyGenKwh - m.monthlyDemandKwh} kWh</span>`
        : `<span style="color: #2563eb;">-${m.monthlyDemandKwh - m.monthlyGenKwh} kWh</span>`;

      return `
      <tr style="background-color: ${idx % 2 === 0 ? "#f8fafc" : "#ffffff"}; font-size: 11px;">
        <td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #0f172a;">${m.monthName}</td>
        <td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace;">${m.poaKwhM2Day}</td>
        <td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace; font-weight: 700; color: #ea580c;">${m.monthlyGenKwh} kWh</td>
        <td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace; color: #475569;">${m.monthlyDemandKwh} kWh</td>
        <td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace;">${balanceHtml}</td>
      </tr>`;
    })
    .join("");

  // Crear contenedor temporal fuera de pantalla pero con visibilidad completa para html2canvas
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "-99999px";
  container.style.left = "0";
  container.style.width = "800px";
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#1e293b";
  container.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  container.style.padding = "32px 36px";
  container.style.boxSizing = "border-box";
  container.style.zIndex = "-1000";

  container.innerHTML = `
    <!-- HEADER -->
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ea580c; padding-bottom: 12px; margin-bottom: 18px;">
      <div>
        <div style="font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">
          SOLDE<span style="color: #ea580c;">RÍO</span>
        </div>
        <div style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">
          Ingeniería Solar & Micro-Redes • Macrozona Sur de Chile
        </div>
      </div>
      <div style="text-align: right;">
        <div style="display: inline-block; background-color: #fff7ed; color: #c2410c; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-family: monospace; border: 1px solid #ffedd5; font-size: 12px; margin-bottom: 4px;">
          PRE-INFORME N° ${leadId}
        </div>
        <div style="font-size: 11px; color: #64748b;">Fecha: ${currentDateStr} • Validez: 30 días</div>
      </div>
    </div>

    <!-- CLIENTE VS INGENIERIA (GRID 2) -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px;">
        <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
          01. Datos del Cliente & Inmueble
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #64748b;">Titular:</span>
          <span style="font-weight: 700; color: #0f172a;">${formData.fullName}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #64748b;">Comuna:</span>
          <span style="font-weight: 700; color: #0f172a;">${formData.comuna}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #64748b;">Propiedad:</span>
          <span style="font-weight: 700; color: #0f172a; text-transform: uppercase;">${formData.propertyType}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0;">
          <span style="color: #64748b;">Distribuidora:</span>
          <span style="font-weight: 700; color: #0f172a; text-transform: uppercase;">${formData.distributor} (BT-1)</span>
        </div>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px;">
        <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
          02. Especificación Fotovoltaica
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #64748b;">Potencia Sugerida:</span>
          <span style="font-weight: 700; color: #0f172a;">${sizing.recommendedKwp} kWp (${sizing.panelsCount} Módulos)</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #64748b;">Módulos Tier 1:</span>
          <span style="font-weight: 700; color: #0f172a;">N-Type TOPCon ${sizing.panelWatts}W</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #64748b;">Inversor:</span>
          <span style="font-weight: 700; color: #0f172a;">${sizing.inverterKw} kW (${(sizing.recommendedPhaseType || "monofasico").toUpperCase()})</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0;">
          <span style="color: #64748b;">Batería BESS:</span>
          <span style="font-weight: 700; color: #059669;">${
            sizing.batteryKwh > 0
              ? `${sizing.batteryKwh} kWh (${sizing.usableBatteryKwh || Math.round(sizing.batteryKwh * 0.85)} kWh Útil)`
              : "On-Grid (Sin Batería)"
          }</span>
        </div>
      </div>
    </div>

    <!-- SPOTLIGHT DE AHORRO -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; border-radius: 10px; padding: 14px 18px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 10px; text-transform: uppercase; color: #ea580c; font-family: monospace; font-weight: 700; letter-spacing: 1px;">
          NUEVA REALIDAD TARIFARIA (LEY 21.118)
        </div>
        <div style="font-size: 15px; font-weight: 600; color: #f8fafc; margin-top: 2px;">
          Tu cuenta baja de <span style="text-decoration: line-through; color: #94a3b8;">${formatCurrency(formData.monthlyBillClp)}</span> a solo <strong style="color: #34d399;">${formatCurrency(sizing.estimatedNewMonthlyBillClp || 14500)} / mes</strong>
        </div>
      </div>
      <div style="text-align: right; background-color: rgba(255,255,255,0.08); padding: 8px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15);">
        <div style="font-size: 10px; text-transform: uppercase; color: #94a3b8;">Ahorro Estimado Año 1</div>
        <div style="font-size: 17px; font-weight: 800; color: #34d399; font-family: monospace;">${formatCurrency(sizing.estimatedAnnualSavingsClp)} / año</div>
      </div>
    </div>

    <!-- TABLA DE BALANCE TMY -->
    <div style="margin-bottom: 16px;">
      <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 6px;">
        03. Balance Energético Mensual TMY (${formData.comuna})
      </div>
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="background-color: #0f172a; color: #f8fafc; font-size: 10px; text-transform: uppercase;">
            <th style="padding: 6px 10px; border-top-left-radius: 6px;">Mes</th>
            <th style="padding: 6px 10px; text-align: center;">POA (kWh/m²/día)</th>
            <th style="padding: 6px 10px; text-align: center;">Generación Solar</th>
            <th style="padding: 6px 10px; text-align: center;">Consumo Hogar</th>
            <th style="padding: 6px 10px; text-align: right; border-top-right-radius: 6px;">Balance Ley 21.118</th>
          </tr>
        </thead>
        <tbody>
          ${monthlyRows}
        </tbody>
      </table>
    </div>

    <!-- FINANZAS Y SEC -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px;">
        <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
          04. Indicadores Financieros a 25 Años
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #64748b;">Ahorro Acumulado (25 años):</span>
          <span style="font-weight: 700; color: #059669;">${formatCurrency(sizing.estimated25YearSavingsClp)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #64748b;">Payback (Retorno):</span>
          <span style="font-weight: 700; color: #0f172a;">${sizing.paybackYears} años</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #64748b;">Valor Actual Neto (VAN):</span>
          <span style="font-weight: 700; color: #0f172a;">${sizing.vanClp ? formatCurrency(sizing.vanClp) : "Positivo"}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0;">
          <span style="color: #64748b;">Costo Nivelado (LCOE):</span>
          <span style="font-weight: 700; color: #0f172a;">$${sizing.lcoeClpPerKwh || 52} CLP / kWh</span>
        </div>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; display: flex; flex-col; justify-content: space-between;">
        <div>
          <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
            05. Garantía & Cumplimiento Normativo SEC
          </div>
          <div style="margin-bottom: 6px;">
            <span style="display: inline-block; background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; margin-right: 4px;">RIC N°09</span>
            <span style="display: inline-block; background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; margin-right: 4px;">RIC N°15</span>
            <span style="display: inline-block; background-color: #fff7ed; color: #c2410c; border: 1px solid #ffedd5; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">Trámite TE-4 SEC</span>
          </div>
          <p style="font-size: 10px; color: #64748b; line-height: 1.35; margin-top: 4px;">
            Instalación proyectada y declarada formalmente ante la SEC por Ingeniero Eléctrico Clase A. Habilita venta de excedentes a ${formData.distributor.toUpperCase()}.
          </p>
        </div>
        <div style="font-size: 10px; color: #ea580c; font-weight: 700; border-top: 1px solid #e2e8f0; padding-top: 4px; margin-top: 6px;">
          Garantía de Potencia Solar: 25 Años al 84.8%
        </div>
      </div>
    </div>

    <!-- FOOTER CON FIRMA -->
    <div style="border-top: 1px solid #cbd5e1; padding-top: 12px; margin-top: 14px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 10px; color: #64748b;">
      <div>
        <strong style="color: #0f172a;">SoldeRío SpA</strong> • RUT: 77.892.341-K<br>
        Casa Matriz: Puerto Varas, Región de Los Lagos • www.solderio.cl<br>
        Contacto: contacto@solderio.cl • +56 9 8765 4321
      </div>
      <div style="width: 190px; text-align: center; border-top: 1px solid #94a3b8; padding-top: 4px; font-size: 10px; color: #334155;">
        <strong style="display: block; font-size: 11px;">Depto. de Ingeniería Solar</strong>
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
