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

/**
 * Lado corto minimo. Filtra capturas de pantalla y miniaturas antes de gastar
 * siquiera la llamada de chequeo: con menos que esto el resultado no sirve.
 */
export const MIN_IMAGE_SIDE = 512;

export function isBigEnough(width, height) {
  if (!width || !height) return false;
  return Math.min(width, height) >= MIN_IMAGE_SIDE;
}

const ACCEPTED_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);
const SIZES = new Set(["auto", "1024x1024", "1536x1024", "1024x1536"]);

/**
 * Descripcion de cada material para el prompt de la IA.
 *
 * Las claves son los ids de materialLibrary a proposito: antes esta lista
 * ofrecia roble claro, nogal y wengue, maderas que el negocio no vende, y
 * omitia lapacho, viraro y petiribi, que si. Alguien podia previsualizar un
 * piso imposible de cotizar.
 */
export const MATERIAL_PROMPTS = {
  lapacho:
    "lapacho hardwood flooring, dense South American hardwood in warm reddish-brown to olive-brown tones with a subtle straight grain",
  viraro:
    "viraro hardwood flooring, light golden-brown tone with a fine even grain and a soft satin finish",
  petiribi:
    "petiribí hardwood flooring, warm medium brown with darker chocolate streaks and clearly visible grain",
  guatambu:
    "guatambú hardwood flooring, pale creamy-yellow warm tone with a smooth fine grain",
  "wpc-deck":
    "WPC composite decking, grooved slats in a warm brown tone with a matte weather-resistant finish",
  spc: "SPC vinyl plank flooring, wood-look planks with a matte low-sheen finish",
  vinyl:
    "commercial grade vinyl plank flooring, wood-look planks with a smooth low-sheen high-traffic finish",
};

export function buildPrompt(material) {
  const materialDesc = MATERIAL_PROMPTS[material];

  // Los limites son explicitos porque el endpoint siempre devuelve una imagen:
  // sin ellos, una foto que no es un ambiente termina reinterpretada entera.
  return [
    `Edit this photograph of a real room. Replace only the floor surface with ${materialDesc}.`,
    "Change nothing else. Do not add, remove or alter any people, faces, animals, furniture, objects, walls, ceilings, windows, text or logos.",
    "Preserve the exact same lighting, shadows, reflections, camera angle, lens and perspective. The new floor must receive the same natural light and cast the same soft shadows as the original scene.",
    "If the photograph shows no floor, or is not a photograph of a real space, return the image unchanged instead of inventing a floor.",
    "Seamless, photorealistic, professional interior photography.",
  ].join(" ");
}

export function validateVisualizerInput({ image, material, size }) {
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

  const finalSize = size || "auto";
  if (!SIZES.has(finalSize)) {
    return { ok: false, error: "El tamaño solicitado no es válido." };
  }

  return { ok: true, value: { image, material, size: finalSize } };
}
