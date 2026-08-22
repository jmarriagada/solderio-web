import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const eventType = payload.event || "lead.created";

    console.log(`[SoldeRío Webhook Dispatcher] Recibido evento: ${eventType}`, payload);

    // If an external webhook URL is configured (e.g. n8n, Make, WhatsApp API), dispatch it
    const targetWebhookUrl = process.env.EXTERNAL_WEBHOOK_URL;
    if (targetWebhookUrl) {
      try {
        await fetch(targetWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        console.error("Error al despachar a targetWebhookUrl:", e);
      }
    }

    return NextResponse.json({
      success: true,
      event: eventType,
      dispatchedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: "Error en webhook handler" }, { status: 500 });
  }
}
