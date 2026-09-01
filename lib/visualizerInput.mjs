/**
 * Validacion de lo que llega a /api/visualizer antes de gastar una llamada
 * a OpenAI.
 *
 * El endpoint es publico y cada request cuesta plata, asi que todo lo que
 * manda el cliente se valida contra listas cerradas. Antes un id de material
 * desconocido caia en silencio a "natural wood flooring" y un .txt de 18
 * bytes se reenviaba a la API igual.
 */

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const ACCEPTED_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);
const DIRECTIONS = new Set(["vertical", "horizontal"]);
const SIZES = new Set(["auto", "1024x1024", "1536x1024", "1024x1536"]);

/** Descripcion de cada material para el prompt de la IA. */
export const MATERIAL_PROMPTS = {
  "roble-claro":
    "light natural oak wood flooring (roble claro), pale blond-honey tone with subtle straight grain",
  "roble-miel": "honey oak wood flooring (roble miel), warm golden-brown tone with natural grain",
  nogal: "walnut wood flooring (nogal), rich dark chocolate brown with visible grain",
  guatambu: "guatambú hardwood flooring, pale creamy-yellow warm tone, smooth fine grain",
  "spc-gris":
    "grey SPC vinyl plank flooring, cool light-grey wood-look planks, matte finish",
  wengue: "wengué wood flooring, very dark espresso brown, elegant and uniform",
};

export function buildPrompt(material, direction) {
  const materialDesc = MATERIAL_PROMPTS[material];
  const dirText =
    direction === "horizontal"
      ? "with the planks running horizontally across the room"
      : "with the planks running lengthwise, receding toward the viewer";

  return `Edit this photograph of a real interior room. Replace ONLY the floor with ${materialDesc}, ${dirText}. Keep absolutely everything else identical to the original: walls, ceiling, furniture, rugs, curtains, windows, doors and every object, and preserve the exact same lighting, shadows, reflections, camera angle, lens and perspective. The new floor must receive the same natural light and cast the same soft shadows as the original scene. Seamless, photorealistic, professional interior photography.`;
}

export function validateVisualizerInput({ image, material, direction, size }) {
  if (!image || typeof image === "string" || typeof image.arrayBuffer !== "function") {
    return { ok: false, error: "No se recibió ninguna imagen." };
  }

  if (!ACCEPTED_TYPES.has(image.type)) {
    return { ok: false, error: "El formato no es válido. Subí una foto JPG, PNG o WEBP." };
  }

  if (image.size > MAX_IMAGE_BYTES) {
    const mb = Math.round(MAX_IMAGE_BYTES / 1024 / 1024);
    return { ok: false, error: `La foto es muy pesada. El máximo son ${mb} MB.` };
  }

  if (!MATERIAL_PROMPTS[material]) {
    return { ok: false, error: "El material elegido no está disponible." };
  }

  const finalDirection = direction || "vertical";
  if (!DIRECTIONS.has(finalDirection)) {
    return { ok: false, error: "La dirección del tablón no es válida." };
  }

  const finalSize = size || "auto";
  if (!SIZES.has(finalSize)) {
    return { ok: false, error: "El tamaño solicitado no es válido." };
  }

  return { ok: true, value: { image, material, direction: finalDirection, size: finalSize } };
}
