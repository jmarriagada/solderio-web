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

  // Si la llave secreta existe pero no se envió token
  if (!token || token.trim().length === 0) {
    return {
      success: false,
      message: "Verificación de seguridad fallida: no se recibió el token de Cloudflare Turnstile.",
    };
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
      return {
        success: false,
        message: "No fue posible conectar con el servidor de validación de Cloudflare.",
      };
    }

    const data: TurnstileVerifyResponse = await response.json();

    if (data.success) {
      return { success: true };
    }

    const errorCodes = data["error-codes"] || [];
    console.warn("[Turnstile Falló Validación]:", errorCodes);

    // Mensaje amigable al usuario
    let friendlyMessage = "La validación de seguridad de Cloudflare ha expirado o no es válida. Por favor recarga la página.";
    if (errorCodes.includes("timeout-or-duplicate")) {
      friendlyMessage = "El token de seguridad ha expirado. Por favor intenta enviar el formulario nuevamente.";
    }

    return {
      success: false,
      message: friendlyMessage,
    };
  } catch (error: any) {
    console.error("[Turnstile Exception]:", error);
    // En caso de fallo de red puntual con Cloudflare, retornamos error controlado
    return {
      success: false,
      message: "Error de conexión al verificar el sistema de seguridad. Intenta nuevamente.",
    };
  }
}
