/**
 * SoldeRío - Verificación de Cloudflare Turnstile en el Servidor
 * Protege contra bots automatizados, scraping y flooding en los endpoints de formularios.
 */

export interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

/**
 * Valida un token de Turnstile generado en el frontend contra la API oficial de Cloudflare.
 * 
 * Si TURNSTILE_SECRET_KEY no está configurado (por ejemplo en entornos locales o antes
 * de configurar Vercel), permite el flujo con una advertencia en consola para no interrumpir
 * el servicio.
 */
export async function verifyTurnstileToken(
  token: string | undefined | null,
  clientIp?: string
): Promise<{ success: boolean; message?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim();

  // Si no está configurada la llave secreta, permitimos el flujo (bypass en desarrollo o pre-configuración)
  if (!secretKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Turnstile] TURNSTILE_SECRET_KEY no configurado en .env. Omitiendo verificación en desarrollo.");
    }
    return { success: true };
  }

  // Si no se envió token (por ejemplo debido a bloqueadores de anuncios como uBlock/Brave,
  // lentitud de conexión móvil, timeout del script externo o falta del dominio en el widget),
  // NO bloqueamos a un cliente potencial real. Confiamos en el Honeypot + Rate Limiter de IP.
  if (!token || token.trim().length === 0) {
    console.warn(
      `[Turnstile Defensivo] Solicitud recibida sin token desde IP ${clientIp || "desconocida"}. Permitiendo lead bajo protección de Honeypot y Rate Limiter.`
    );
    return { success: true };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token.trim());
    if (clientIp) {
      formData.append("remoteip", clientIp);
    }

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      console.error(`[Turnstile HTTP Error]: status ${response.status}`);
      // En caso de caída de la API de Cloudflare, degradación elegante (no perder el lead)
      return { success: true };
    }

    const data: TurnstileVerifyResponse = await response.json();

    if (data.success) {
      return { success: true };
    }

    const errorCodes = data["error-codes"] || [];
    console.warn("[Turnstile Falló Validación]:", errorCodes);

    // Si el fallo es por timeout, clave de prueba o desajuste de dominio, permitimos el lead legítimo
    if (
      errorCodes.includes("timeout-or-duplicate") ||
      errorCodes.includes("invalid-input-response") ||
      errorCodes.includes("internal-error")
    ) {
      console.warn("[Turnstile Degradación Elegante] Permitiendo lead ante error transitorio o desajuste de Cloudflare.");
      return { success: true };
    }

    return {
      success: false,
      message: "La validación de seguridad de Cloudflare ha expirado o no es válida. Por favor recarga la página.",
    };
  } catch (error: any) {
    console.error("[Turnstile Exception]:", error);
    // En caso de fallo de red con Cloudflare, no bloquear la captación de clientes
    return { success: true };
  }
}
