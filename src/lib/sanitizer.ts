/**
 * SoldeRío - Utilidades de Sanitización y Prevención de Inyecciones (Anti-XSS / Anti-Injection)
 * Protege contra inyecciones HTML/JS y caracteres de control no autorizados.
 */

/**
 * Elimina cualquier etiqueta HTML, caracteres de control y secuencias peligrosas (javascript:, data:, vbscript:)
 */
export function stripHtmlTags(input: unknown): string {
  if (typeof input !== "string") return "";
  
  return input
    // Elimina tags HTML (<script>, <iframe>, <img>, etc.)
    .replace(/<[^>]*>?/gm, "")
    // Elimina protocolos de script
    .replace(/(javascript|vbscript|data):/gi, "")
    // Elimina manejadores de eventos (onload=, onerror=, onclick=)
    .replace(/on\w+\s*=/gi, "")
    // Elimina caracteres de control invisibles (excepto espacio, salto de línea y tabulación)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
}

/**
 * Escapa caracteres especiales a entidades HTML seguras
 */
export function escapeHtml(input: unknown): string {
  if (typeof input !== "string") return "";
  
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Sanitiza un string genérico: elimina etiquetas, normaliza espacios y trunca a una longitud segura.
 */
export function sanitizeString(input: unknown, maxLength: number = 255): string {
  if (typeof input !== "string") return "";
  
  const clean = stripHtmlTags(input)
    // Reemplaza múltiples espacios en blanco por uno solo
    .replace(/\s+/g, " ")
    .trim();
    
  return clean.slice(0, maxLength);
}

/**
 * Sanitiza texto multilínea (como notas, descripciones o comentarios)
 */
export function sanitizeMultilineText(input: unknown, maxLength: number = 500): string {
  if (typeof input !== "string") return "";
  
  const clean = stripHtmlTags(input)
    // Permite saltos de línea pero limita saltos consecutivos
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
    
  return clean.slice(0, maxLength);
}

/**
 * Sanitiza números de teléfono (permite dígitos, +, espacios y guiones)
 */
export function sanitizePhone(input: unknown): string {
  if (typeof input !== "string") return "";
  
  const clean = input.replace(/[^0-9+\s-]/g, "").trim();
  return clean.slice(0, 25);
}

/**
 * Sanitiza un número RUT chileno eliminando caracteres extraños
 */
export function sanitizeRut(input: unknown): string {
  if (typeof input !== "string") return "";
  
  const clean = input.replace(/[^0-9kK.-]/g, "").trim();
  return clean.slice(0, 15);
}
