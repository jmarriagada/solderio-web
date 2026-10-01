/**
 * SoldeRío - Rate Limiter en Memoria para Rutas API Serverless
 * Protege contra bombardeos de formularios, ataques de denegación de servicio (DoS) y spam masivo.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// Almacén en memoria por IP
const ipStore = new Map<string, RateLimitRecord>();

// Limpieza periódica de IPs antiguas para evitar fuga de memoria
const CLEANUP_INTERVAL_MS = 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [ip, record] of ipStore.entries()) {
    if (record.resetAt <= now) {
      ipStore.delete(ip);
    }
  }
}

export interface RateLimitOptions {
  /** Número máximo de solicitudes permitidas en la ventana de tiempo */
  maxRequests?: number;
  /** Ventana de tiempo en segundos */
  windowSeconds?: number;
}

export interface RateLimitResult {
  isAllowed: boolean;
  remaining: number;
  resetSeconds: number;
}

/**
 * Extrae la dirección IP del cliente a partir de los encabezados HTTP estándar de Vercel/Cloudflare
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // Si viene una lista separada por comas, la primera es la IP real del cliente
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  return "127.0.0.1";
}

/**
 * Valida si la IP del cliente no ha excedido la cuota de solicitudes permitidas
 */
export function checkRateLimit(
  ip: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  cleanupStaleEntries();

  const maxRequests = options.maxRequests ?? 5;
  const windowMs = (options.windowSeconds ?? 60) * 1000;
  const now = Date.now();

  const record = ipStore.get(ip);

  if (!record || record.resetAt <= now) {
    // Primera petición en la ventana actual
    ipStore.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      isAllowed: true,
      remaining: maxRequests - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= maxRequests) {
    // Cuota excedida
    const resetSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return {
      isAllowed: false,
      remaining: 0,
      resetSeconds,
    };
  }

  // Incrementar contador
  record.count += 1;
  const resetSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));

  return {
    isAllowed: true,
    remaining: maxRequests - record.count,
    resetSeconds,
  };
}
