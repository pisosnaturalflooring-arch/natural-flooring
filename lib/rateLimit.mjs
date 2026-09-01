/**
 * Rate limit por clave (tipicamente la IP) con ventana fija, en memoria.
 *
 * Limitacion conocida: en serverless cada instancia tiene su propio Map, asi
 * que el limite real es "N por instancia". Alcanza para cortar el script que
 * pega en loop contra /api/visualizer y quema saldo de OpenAI, que es el
 * riesgo concreto. Un limite estricto necesita un store compartido (Upstash).
 */

export function createRateLimiter({ limit, windowMs, now = Date.now }) {
  const hits = new Map();

  function prune(current) {
    for (const [key, entry] of hits) {
      if (current - entry.start >= windowMs) hits.delete(key);
    }
  }

  return {
    check(key) {
      const current = now();
      prune(current);

      const entry = hits.get(key);
      if (!entry) {
        hits.set(key, { start: current, count: 1 });
        return { allowed: true, retryAfterSeconds: 0 };
      }

      entry.count += 1;
      if (entry.count <= limit) return { allowed: true, retryAfterSeconds: 0 };

      const msLeft = entry.start + windowMs - current;
      return { allowed: false, retryAfterSeconds: Math.ceil(msLeft / 1000) };
    },

    size() {
      return hits.size;
    },
  };
}

/** Toma la IP del cliente de los headers que ponen Vercel y Netlify. */
export function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "desconocida";
}
