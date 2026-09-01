import { createFloorCheck } from "../../../lib/floorCheck.mjs";
import { clientIp, createRateLimiter } from "../../../lib/rateLimit.mjs";
import { buildPrompt, validateVisualizerInput } from "../../../lib/visualizerInput.mjs";

export const runtime = "nodejs";
export const maxDuration = 60; // tope del plan Hobby de Vercel

// Cada generacion cuesta plata, asi que el limite es mas duro que en subscribe.
const limiter = createRateLimiter({ limit: 3, windowMs: 10 * 60 * 1000 });

const GENERIC_ERROR = "No pudimos generar la vista. Probá de nuevo en un momento.";

export async function POST(request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // El detalle va al log: al visitante no se le cuenta como esta configurado el server.
    console.error("[visualizer] Falta OPENAI_API_KEY en el entorno.");
    return Response.json({ error: "El visualizador no está disponible por ahora." }, { status: 503 });
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "No pudimos leer la imagen enviada." }, { status: 400 });
  }

  const validation = validateVisualizerInput({
    image: form.get("image"),
    material: form.get("material"),
    size: form.get("size"),
  });
  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: 400 });
  }
  const { image, material, size } = validation.value;

  // El limite se consume recien aca: un pedido invalido no gasta plata, asi que
  // equivocarse de archivo no puede dejar a nadie bloqueado diez minutos.
  const { allowed, retryAfterSeconds } = limiter.check(clientIp(request));
  if (!allowed) {
    return Response.json(
      { error: "Alcanzaste el límite de pruebas. Esperá unos minutos o escribinos por WhatsApp." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  // Antes de gastar la generacion cara, un modelo chico confirma que la foto
  // muestre un piso. Falla abierto: ver lib/floorCheck.mjs.
  const bytes = Buffer.from(await image.arrayBuffer());
  const dataUrl = `data:${image.type};base64,${bytes.toString("base64")}`;
  const chequeo = await createFloorCheck({
    apiKey,
    model: process.env.OPENAI_VISION_MODEL || "gpt-4o-mini",
  })(dataUrl);

  if (!chequeo.allowed) {
    console.warn("[visualizer] Foto rechazada:", chequeo.motivo);
    return Response.json(
      {
        error:
          "No encontramos un piso en esa foto. Sacala de pie, mostrando el suelo del ambiente que querés renovar.",
      },
      { status: 422 }
    );
  }
  if (chequeo.skipped) {
    console.warn("[visualizer] Chequeo de foto omitido:", chequeo.skipped);
  }

  try {
    const oaForm = new FormData();
    oaForm.append("model", "gpt-image-1");
    oaForm.append("image", new Blob([bytes], { type: image.type }), image.name || "room.png");
    oaForm.append("prompt", buildPrompt(material));
    oaForm.append("size", size);
    oaForm.append("quality", "medium"); // subí a "high" para más detalle (más costo)
    oaForm.append("input_fidelity", "high"); // preserva el resto de la escena
    oaForm.append("n", "1");

    const res = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: oaForm,
    });

    const data = await res.json();

    if (!res.ok) {
      // El error de OpenAI trae la clave enmascarada y datos de la cuenta: no se reenvia.
      console.error("[visualizer] OpenAI respondió", res.status, data?.error?.message);
      return Response.json({ error: GENERIC_ERROR }, { status: 502 });
    }

    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) {
      console.error("[visualizer] OpenAI no devolvió imagen:", JSON.stringify(data).slice(0, 500));
      return Response.json({ error: GENERIC_ERROR }, { status: 502 });
    }

    return Response.json({ image: `data:image/png;base64,${b64}` });
  } catch (e) {
    console.error("[visualizer] Error inesperado:", e);
    return Response.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
