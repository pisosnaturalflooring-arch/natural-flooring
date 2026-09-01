/**
 * Mira la foto antes de gastar una generacion.
 *
 * /v1/images/edits siempre devuelve una imagen: si le mandan una selfie, le
 * inventa un piso encima. No tiene canal para avisar que la foto no sirve, asi
 * que la unica forma de detectarlo es preguntarselo antes a un modelo chico.
 *
 * Falla abierto a proposito: si el chequeo se cae, pasa igual. Un guardian
 * inestable que rechaza a un cliente real es peor que una generacion
 * desperdiciada, y el rate limit del endpoint ya pone el techo de gasto.
 */

const RESPONSES_ENDPOINT = "https://api.openai.com/v1/responses";

const PREGUNTA = `Mirá esta foto y respondé SOLO con JSON, sin texto alrededor:
{"tienePiso": boolean, "motivo": "una frase corta en castellano"}

"tienePiso" es true unicamente si la foto muestra el piso o suelo de un ambiente
real (interior o exterior) con superficie suficiente como para reemplazarla.
Es false si es un primer plano de una persona, un documento, una captura de
pantalla, un dibujo, un producto sobre fondo liso, o cualquier imagen donde no
se vea el suelo.`;

/** El modelo suele envolver el JSON en un bloque de codigo. */
function parsearJson(texto) {
  const limpio = String(texto || "").replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
  try {
    const dato = JSON.parse(limpio);
    return typeof dato?.tienePiso === "boolean" ? dato : null;
  } catch {
    return null;
  }
}

function extraerTexto(data) {
  if (typeof data?.output_text === "string") return data.output_text;
  for (const item of data?.output ?? []) {
    for (const parte of item?.content ?? []) {
      if (typeof parte?.text === "string") return parte.text;
    }
  }
  return "";
}

export function createFloorCheck({ apiKey, model, fetchImpl = fetch }) {
  return async function check(dataUrl) {
    if (!apiKey) return { allowed: true, skipped: "not-configured" };

    try {
      const res = await fetchImpl(RESPONSES_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          input: [
            {
              role: "user",
              content: [
                { type: "input_text", text: PREGUNTA },
                { type: "input_image", image_url: dataUrl },
              ],
            },
          ],
        }),
      });

      if (!res.ok) return { allowed: true, skipped: `respuesta ${res.status}` };

      const dato = parsearJson(extraerTexto(await res.json()));
      if (!dato) return { allowed: true, skipped: "respuesta ilegible" };

      return { allowed: dato.tienePiso, motivo: dato.motivo || "" };
    } catch (e) {
      return { allowed: true, skipped: e?.message || "error de red" };
    }
  };
}
