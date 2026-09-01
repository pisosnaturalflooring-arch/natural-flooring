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
