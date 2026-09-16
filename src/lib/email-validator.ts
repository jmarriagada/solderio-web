/**
 * SoldeRío - Email Validation & Anti-Abuse Shield
 * Ensures emails adhere to RFC 5322 and are not from disposable/malicious domains.
 */

// Common disposable/temporary email provider domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "tempmail.com",
  "throwawaymail.com",
  "yopmail.com",
  "sharklasers.com",
  "getairmail.com",
  "trashmail.com",
  "mohmal.com",
  "dispostable.com",
  "temp-mail.org",
  "fakemailgenerator.com",
  "emailondeck.com",
]);

// Strict RFC 5322 compliant regex for practical email validation
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export interface EmailValidationResult {
  isValid: boolean;
  normalizedEmail: string;
  error?: string;
}

/**
 * Validates and normalizes an email address.
 * @param email Raw email string from client form
 */
export function validateAndNormalizeEmail(email?: string | null): EmailValidationResult {
  if (!email || typeof email !== "string") {
    return {
      isValid: false,
      normalizedEmail: "",
      error: "El correo electrónico es requerido.",
    };
  }

  const trimmed = email.trim().toLowerCase();

  if (trimmed.length > 254) {
    return {
      isValid: false,
      normalizedEmail: trimmed,
      error: "La dirección de correo excede la longitud máxima permitida.",
    };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return {
      isValid: false,
      normalizedEmail: trimmed,
      error: "El formato del correo electrónico no es válido.",
    };
  }

  const parts = trimmed.split("@");
  if (parts.length !== 2) {
    return {
      isValid: false,
      normalizedEmail: trimmed,
      error: "El correo no contiene una estructura válida.",
    };
  }

  const [localPart, domain] = parts;

  if (localPart.length > 64) {
    return {
      isValid: false,
      normalizedEmail: trimmed,
      error: "El nombre de usuario del correo es demasiado largo.",
    };
  }

  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      isValid: false,
      normalizedEmail: trimmed,
      error: "Por favor ingresa un correo personal o corporativo válido (no se admiten correos temporales).",
    };
  }

  // Check for common TLD presence
  if (!domain.includes(".")) {
    return {
      isValid: false,
      normalizedEmail: trimmed,
      error: "El dominio del correo debe tener una extensión válida.",
    };
  }

  return {
    isValid: true,
    normalizedEmail: trimmed,
  };
}
