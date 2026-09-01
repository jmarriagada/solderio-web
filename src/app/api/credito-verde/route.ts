import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { rut, monto, cuotas, seguro } = await request.json();

    if (!rut || !monto || !cuotas) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
    }

    // Mathematical simulation of BancoEstado Crédito Verde (0.89% monthly preferential rate)
    const r = 0.0089;
    const n = Number(cuotas);
    const principalReal = Number(monto) * 1.008065;
    const seguroMensual = seguro === "sin_seguro" ? 0 : 3500;
    const rawCuota = principalReal * (r / (1 - Math.pow(1 + r, -n)));
    const valorCuota = Math.round(rawCuota + seguroMensual);
    
    const montoTotalCredito = valorCuota * n;

    return NextResponse.json({
      success: true,
      data: {
        valorCuota,
        montoLiquido: Number(monto),
        numeroCuotas: n,
        tasaInteresMensual: 0.89,
        tasaInteresAnual: 10.68,
        cae: 10.73,
        montoTotalCredito,
        costoTotalCredito: Math.round(montoTotalCredito - Number(monto)),
        pdfBase64: null,
      },
    });

  } catch (error: any) {
    console.error("Credito Verde Simulation Error:", error);
    return NextResponse.json(
      { error: "Error en la simulación de Crédito Verde: " + error.message },
      { status: 500 }
    );
  }
}

