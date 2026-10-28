/**
 * Manda cada consulta a Citriqs (API publica, ADR 0005 de Citriqs).
 *
 * Nunca lanza: si Citriqs no responde, el mail de siempre sigue siendo el respaldo.
 * Reintenta una sola vez ante un 5xx o un timeout, con el mismo id: Citriqs no duplica.
 * Un 4xx no se reintenta (el pedido esta mal y va a seguir mal).
 */

// Lo que Citriqs guarda: JPG, PNG o WebP de hasta 4 MB. Una foto fuera de eso no se manda
// (Citriqs la descartaría igual) y la consulta sale sin ella.
const MAX_FOTO = 4 * 1024 * 1024;
const TIPO = { "image/jpg": "image/jpeg", "image/jpeg": "image/jpeg", "image/png": "image/png", "image/webp": "image/webp" };
function adjuntar(f, campo, bytes, type) {
  const tipo = TIPO[type];
  if (!tipo || !bytes || bytes.length === 0 || bytes.length > MAX_FOTO) return;
  f.set(campo, new Blob([bytes], { type: tipo }), campo);
}

function armarCuerpo({ id, telefono, origen, material, nombre, fotoOriginal, fotoResultado }) {
  const f = new FormData();
  f.set("id", id);
  f.set("telefono", telefono);
  f.set("origen", origen);
  if (material) f.set("material", material);
  if (nombre) f.set("nombre", nombre);
  if (fotoOriginal) adjuntar(f, "fotoOriginal", fotoOriginal.bytes, fotoOriginal.type);
  if (fotoResultado?.base64) adjuntar(f, "fotoResultado", Buffer.from(fotoResultado.base64, "base64"), fotoResultado.type);
  return f;
}

// 2 s por intento (dos intentos como máximo): el visitante sigue esperando su foto.
export function createCitriqsClient({ url, clave, fetchImpl = fetch, timeoutMs = 2000 }) {
  async function intentar(consulta) {
    try {
      const res = await fetchImpl(`${url.replace(/\/$/, "")}/api/publico/v1/consultas`, {
        method: "POST",
        headers: { authorization: `Bearer ${clave}` },
        body: armarCuerpo(consulta),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (res.ok) return { ok: true };
      const data = await res.json().catch(() => ({}));
      return { ok: false, motivo: data?.error?.codigo ?? `http_${res.status}`, reintentar: res.status >= 500 };
    } catch {
      return { ok: false, motivo: "sin_respuesta", reintentar: true };
    }
  }

  return {
    async enviarConsulta(consulta) {
      if (!url || !clave) return { ok: false, motivo: "sin_configurar" };
      let r = await intentar(consulta);
      if (!r.ok && r.reintentar) r = await intentar(consulta);
      return r.ok ? { ok: true } : { ok: false, motivo: r.motivo };
    },
  };
}

/** Cliente configurado desde el entorno. */
export function citriqsDesdeEntorno() {
  return createCitriqsClient({ url: process.env.CITRIQS_API_URL ?? "", clave: process.env.CITRIQS_CLAVE ?? "" });
}
