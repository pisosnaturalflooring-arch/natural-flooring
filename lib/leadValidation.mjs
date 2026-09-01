/**
 * Normalizacion de los datos que llegan al endpoint de captura de leads.
 *
 * Vive aparte de la ruta porque el body lo controla el cliente: cualquier
 * cosa puede llegar en el JSON, y la ruta tiene que responder 400 en vez de
 * romperse con un 500 que filtra el error interno.
 */

const MIN_DIGITS = 8;
const MAX_DIGITS = 15;
const MAX_SOURCE_LENGTH = 64;
const DEFAULT_SOURCE = "popup";

/** Devuelve el telefono como digitos, o null si no es un telefono valido. */
export function normalizePhone(input) {
  if (typeof input !== "string") return null;
  const digits = input.replace(/\D/g, "");
  if (digits.length < MIN_DIGITS || digits.length > MAX_DIGITS) return null;
  return digits;
}

/** El origen lo elige el cliente, asi que se acota antes de guardarlo. */
export function normalizeSource(input) {
  if (typeof input !== "string" || !input) return DEFAULT_SOURCE;
  return input.slice(0, MAX_SOURCE_LENGTH);
}

const MAX_INPUT_LENGTH = 20;

/**
 * Limpia lo que se tipea en el campo de telefono, tecla por tecla.
 *
 * Filtrar mientras escribe es mejor que avisarle despues: el error rojo por
 * haber escrito letras deja de existir, en vez de aparecer al enviar.
 */
export function sanitizePhoneInput(input) {
  if (typeof input !== "string") return "";
  const leadingPlus = input.trimStart().startsWith("+") ? "+" : "";
  const rest = input.replace(/[^\d\s()-]/g, "");
  return (leadingPlus + rest).slice(0, MAX_INPUT_LENGTH);
}

/**
 * Numero listo para un link wa.me.
 *
 * El negocio y sus clientes estan en Argentina, donde WhatsApp exige el
 * formato 54 9 + area + numero. Guardar "1123456789" y armar wa.me con eso
 * da un link que no abre ningun chat, asi que se completa el prefijo.
 */
export function whatsappNumber(input) {
  const digits = typeof input === "string" ? input.replace(/\D/g, "") : "";
  if (!digits) return "";
  if (digits.startsWith("549")) return digits;
  if (digits.startsWith("54")) return `549${digits.slice(2)}`;
  return `549${digits}`;
}

/**
 * Telefono agrupado como se escribe en Argentina, para leerlo de un vistazo
 * en el mail. Si la forma no se reconoce se devuelven los digitos tal cual:
 * mejor un numero raro que uno mal cortado.
 */
export function formatPhoneDisplay(input) {
  const digits = typeof input === "string" ? input.replace(/\D/g, "") : "";
  if (!digits) return "";

  if (digits.startsWith("549") && digits.length === 13) {
    return `+54 9 ${formatPhoneDisplay(digits.slice(3))}`;
  }
  if (digits.length === 10) {
    // Area de 2 digitos solo para Buenos Aires (11); el resto usa 3.
    const area = digits.startsWith("11") ? 2 : 3;
    const resto = digits.slice(area);
    return `${digits.slice(0, area)} ${resto.slice(0, resto.length - 4)}-${resto.slice(-4)}`;
  }
  return digits;
}
