/**
 * Los tres pasos del visualizador y que paso corresponde a cada estado.
 *
 * Vive aparte del componente porque es la logica que decide donde esta parado
 * el visitante, y conviene poder probarla sin montar nada. El componente solo
 * guarda si hay foto, en que anda la generacion, y a que paso pidio volver.
 */

export const VISUALIZER_STEPS = [
  { id: "foto", label: "Tu ambiente" },
  { id: "material", label: "El material" },
  { id: "resultado", label: "El resultado" },
];

/** Hasta donde puede llegar el visitante con lo que tiene hecho. */
export function isStepReachable(step, { hasPhoto, status }) {
  switch (step) {
    case "foto":
      return true;
    case "material":
      return Boolean(hasPhoto);
    case "resultado":
      // "loading" cuenta: el paso muestra el progreso en el marco del resultado.
      return Boolean(hasPhoto) && (status === "loading" || status === "done");
    default:
      return false;
  }
}

/**
 * El paso donde debe estar el visitante. `requested` gana solo si puede
 * llegar ahi, para que volver a "material" y probar otro no lo expulse.
 */
export function currentStep(state) {
  if (state.requested && isStepReachable(state.requested, state)) return state.requested;
  if (!state.hasPhoto) return "foto";
  if (state.status === "loading" || state.status === "done") return "resultado";
  // Un error devuelve al material: ahi esta el boton para reintentar.
  return "material";
}
