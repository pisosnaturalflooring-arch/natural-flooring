/**
 * Manda cada consulta a Citriqs (API publica, ADR 0005 de Citriqs).
 *
 * Nunca lanza: si Citriqs no responde, el mail de siempre sigue siendo el respaldo.
 * Reintenta una sola vez ante un 5xx o un timeout, con el mismo id: Citriqs no duplica.
 * Un 4xx no se reintenta (el pedido esta mal y va a seguir mal).
 */

function armarCuerpo({ id, telefono, origen, material, nombre, fotoOriginal, fotoResultado }) {
  const f = new FormData();
  f.set("id", id);
  f.set("telefono", telefono);
  f.set("origen", origen);
  if (material) f.set("material", material);
  if (nombre) f.set("nombre", nombre);
  if (fotoOriginal?.bytes) f.set("fotoOriginal", new Blob([fotoOriginal.bytes], { type: fotoOriginal.type }), "ambiente");
  if (fotoResultado?.base64) f.set("fotoResultado", new Blob([Buffer.from(fotoResultado.base64, "base64")], { type: fotoResultado.type }), "resultado");
  return f;
}

export function createCitriqsClient({ url, clave, fetchImpl = fetch, timeoutMs = 5000 }) {
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
