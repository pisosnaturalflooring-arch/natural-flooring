/**
 * De donde vino cada lead, y como se lee eso en el mail.
 *
 * El slug lo manda el cliente, asi que el mail nunca lo imprime tal cual:
 * se traduce contra esta lista cerrada. Un origen que no este aca sale como
 * "Desconocido", lo que ademas evita que llegue markup al cuerpo del mail.
 */

export const LEAD_SOURCES = {
  "popup-scroll": "Popup automático",
  "promo-pill": "Pastilla de promo",
  visualizador: "Visualizador con IA",
  // El popup forzado con ?popup=1 no es una conversion real: que se note en el mail.
  preview: "Prueba interna (?popup=1)",
};

export function sourceLabel(source) {
  return LEAD_SOURCES[source] || "Desconocido";
}
