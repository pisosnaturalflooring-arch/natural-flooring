/**
 * Que hacer con la promo segun lo que el visitante ya hizo con ella.
 *
 * Vive aparte del componente porque son reglas de producto, no de render:
 * a quien cerro el popup se le sigue ofreciendo la promo desde la pastilla,
 * y a quien ya dejo el telefono no se lo persigue mas.
 */

export const PROMO_STORAGE_KEY = "nf_promo_v2";

/** Version anterior: guardaba un timestamp y no distinguia cerrar de suscribirse. */
export const LEGACY_STORAGE_KEY = "nf_news_v1";

const STATUSES = new Set(["dismissed", "subscribed"]);

export function readPromoStatus(storage) {
  try {
    const stored = storage?.getItem(PROMO_STORAGE_KEY);
    if (STATUSES.has(stored)) return stored;
    // Quien ya lo habia cerrado con la version vieja no merece verlo de nuevo.
    if (storage?.getItem(LEGACY_STORAGE_KEY)) return "dismissed";
    return "new";
  } catch {
    return "new";
  }
}

export function writePromoStatus(storage, status) {
  try {
    storage?.setItem(PROMO_STORAGE_KEY, status);
  } catch {
    /* incognito o cookies bloqueadas: la promo simplemente no se recuerda */
  }
}

/** Solo se abre solo la primera vez; despues hay que pedirla desde la pastilla. */
export function shouldAutoOpen(status) {
  return status === "new";
}

export function shouldShowPill(status) {
  return status !== "subscribed";
}
