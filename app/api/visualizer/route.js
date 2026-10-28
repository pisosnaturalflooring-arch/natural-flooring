import { materialLibrary } from "../../../components/natural-flooring/recommender/recommendationEngine.mjs";
import { citriqsDesdeEntorno } from "../../../lib/citriqs.mjs";
import { createFloorCheck } from "../../../lib/floorCheck.mjs";
import { createLeadNotifier } from "../../../lib/leadNotifier.mjs";
import { normalizePhone } from "../../../lib/leadValidation.mjs";
import {
  ERROR_CODES,
  SEVERIDAD_INTERNA,
  mapOpenAiFailure,
} from "../../../lib/visualizerErrors.mjs";
import { clientIp, createRateLimiter } from "../../../lib/rateLimit.mjs";
import { buildPrompt, validateVisualizerInput } from "../../../lib/visualizerInput.mjs";

export const runtime = "nodejs";
export const maxDuration = 60; // Cloudflare no corta por duración: el tiempo esperando a OpenAI no cuenta como CPU

// Cada generacion cuesta plata, asi que el limite es mas duro que en subscribe.
const limiter = createRateLimiter({ limit: 3, windowMs: 10 * 60 * 1000 });

/** El cuerpo lleva el codigo: el cliente decide que mostrar y que accion ofrecer. */
function falla(code, status, extra = {}) {
  if (SEVERIDAD_INTERNA[code]) console.error("[visualizer] ATENCION:", SEVERIDAD_INTERNA[code]);
  return Response.json({ code, ...extra }, { status });
}

export async function POST(request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // El detalle va al log: al visitante no se le cuenta como esta configurado el server.
    return falla(ERROR_CODES.NO_CONFIGURADO, 503);
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return falla(ERROR_CODES.FOTO_INVALIDA, 400);
  }

  const validation = validateVisualizerInput({
    image: form.get("image"),
    material: form.get("material"),
    size: form.get("size"),
  });
  if (!validation.ok) {
    // Este si lleva texto propio: dice exactamente que tiene de malo la foto.
    return falla(ERROR_CODES.FOTO_INVALIDA, 400, { error: validation.error });
  }
  const { image, material, size } = validation.value;

  const phone = normalizePhone(form.get("phone"));
  if (!phone) return falla(ERROR_CODES.TELEFONO_INVALIDO, 400);
  // Un id por pedido: si Citriqs recibe la consulta dos veces, no la duplica.
  const consultaId = crypto.randomUUID();

  // El limite se consume recien aca: un pedido invalido no gasta plata, asi que
  // equivocarse de archivo no puede dejar a nadie bloqueado diez minutos.
  const { allowed, retryAfterSeconds } = limiter.check(clientIp(request));
  if (!allowed) {
    return Response.json(
      { code: ERROR_CODES.DEMASIADOS_INTENTOS, retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const bytes = Buffer.from(await image.arrayBuffer());
  // Sin base, el mail es el unico registro del telefono: todo camino que pase
  // de aca (incluida una foto sin piso) tiene que avisar.
  const avisar = (resultBase64) =>
    avisarLead({ consultaId, phone, material, original: bytes, originalType: image.type, resultBase64 });

  // Antes de gastar la generacion cara, un modelo chico confirma que la foto
  // muestre un piso. Falla abierto: ver lib/floorCheck.mjs.
  const dataUrl = `data:${image.type};base64,${bytes.toString("base64")}`;
  const chequeo = await createFloorCheck({
    apiKey,
    model: process.env.OPENAI_VISION_MODEL || "gpt-4o-mini",
  })(dataUrl);

  if (!chequeo.allowed) {
    console.warn("[visualizer] Foto rechazada:", chequeo.motivo);
    await avisar();
    return falla(ERROR_CODES.SIN_PISO, 422);
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
      // El error de OpenAI trae la clave enmascarada y datos de la cuenta: no se
      // reenvia. Solo viaja el codigo con el que el cliente arma su mensaje.
      console.error("[visualizer] OpenAI respondió", res.status, data?.error?.message);
      await avisar();
      return falla(mapOpenAiFailure(res.status, data), 502);
    }

    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) {
      console.error("[visualizer] OpenAI no devolvió imagen:", JSON.stringify(data).slice(0, 500));
      await avisar();
      return falla(ERROR_CODES.SERVICIO_CAIDO, 502);
    }

    await avisar(b64);
    return Response.json({ image: `data:image/png;base64,${b64}` });
  } catch (e) {
    console.error("[visualizer] Error inesperado:", e);
    await avisar();
    return falla(ERROR_CODES.DESCONOCIDO, 500);
  }
}

/** El mail lleva la foto original y, si se pudo generar, el resultado. */
async function avisarLead({ consultaId, phone, material, original, originalType, resultBase64 }) {
  // A Citriqs en paralelo con el mail (que sigue como respaldo mientras dure el piloto):
  // ninguno espera al otro, y el visualizador tiene 60 s en total.
  const aCitriqs = citriqsDesdeEntorno().enviarConsulta({
    id: consultaId,
    telefono: phone,
    origen: "visualizador",
    material,
    fotoOriginal: { bytes: original, type: originalType },
    fotoResultado: resultBase64 ? { base64: resultBase64, type: "image/png" } : null,
  });

  const extension = originalType === "image/png" ? "png" : originalType === "image/webp" ? "webp" : "jpg";
  const attachments = [
    { filename: `ambiente-original.${extension}`, content: original.toString("base64"), content_type: originalType },
  ];
  if (resultBase64) {
    attachments.push({ filename: "ambiente-con-piso-nuevo.png", content: resultBase64, content_type: "image/png" });
  }

  const notify = createLeadNotifier({
    apiKey: process.env.RESEND_API_KEY,
    to: process.env.LEADS_NOTIFY_EMAIL,
    from: process.env.LEADS_FROM_EMAIL,
  });
  const notified = await notify({
    phone,
    source: "visualizador",
    createdAt: new Date().toISOString(),
    material: materialLibrary.find((m) => m.id === material)?.label,
    generated: Boolean(resultBase64),
    attachments,
  });
  if (!notified.sent) console.warn("[visualizer] Lead sin aviso por mail:", notified.reason);
  const enviada = await aCitriqs;
  if (!enviada.ok) console.warn("[visualizer] Consulta sin llegar a Citriqs:", enviada.motivo);
}
