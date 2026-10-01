import { NextResponse } from "next/server";
import { trabajaFormSchema } from "@/lib/validation/schemas";
import { getClientIp, checkRateLimit } from "@/lib/rate-limiter";
import { validateAndNormalizeEmail } from "@/lib/email-validator";
import { notifyInternalJobApplication } from "@/lib/notifier";

export async function POST(request: Request) {
  try {
    // 0. Rate Limiting por IP (Máx 5 peticiones por minuto)
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp, { maxRequests: 5, windowSeconds: 60 });
    if (!rateLimit.isAllowed) {
      return NextResponse.json(
        { error: "Has realizado demasiadas solicitudes en poco tiempo. Por favor espera un momento antes de volver a intentar." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetSeconds),
          },
        }
      );
    }

    const rawBody = await request.json();

    // 1. Validación y Sanitización con Zod (Anti-XSS / Anti-Injection)
    const validationResult = trabajaFormSchema.safeParse(rawBody);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || "Datos de postulación inválidos";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    // 2. Honeypot check: Si un bot llenó el campo trampa, descartamos en silencio
    if (validationResult.data.website_url && validationResult.data.website_url.trim().length > 0) {
      console.log(`[Honeypot Triggered - Postulación] Descartando bot silenciosamente desde IP: ${clientIp}`);
      return NextResponse.json({
        success: true,
        message: "Postulación recibida exitosamente.",
      });
    }

    const body = validationResult.data;

    // Validación complementaria de correo electrónico
    const emailValidation = validateAndNormalizeEmail(body.email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.error || "Correo electrónico válido es requerido." },
        { status: 400 }
      );
    }

    // 3. Notificación interna (Telegram + Correo oficial a contacto@solderio.cl)
    try {
      await notifyInternalJobApplication({
        nombre: body.nombre,
        email: emailValidation.normalizedEmail,
        telefono: body.telefono,
        cargo: body.cargo,
        comuna: body.comuna,
        linkedin: body.linkedin,
        mensaje: body.mensaje,
        cvFileName: body.cvFile?.name,
      });
    } catch (notifErr) {
      console.warn("[Notificación Interna Postulación Falló]:", notifErr);
    }

    return NextResponse.json({
      success: true,
      message: "Postulación enviada exitosamente. Revisaremos tus antecedentes a la brevedad.",
    });
  } catch (error: any) {
    console.error("Error al procesar postulación laboral:", error);
    return NextResponse.json(
      {
        error: "Error interno al procesar tu postulación. Por favor intenta nuevamente.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
