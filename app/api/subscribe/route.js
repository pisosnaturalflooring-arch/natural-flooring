import { citriqsDesdeEntorno } from "../../../lib/citriqs.mjs";
import { createLeadNotifier } from "../../../lib/leadNotifier.mjs";
import { normalizePhone, normalizeSource } from "../../../lib/leadValidation.mjs";
import { clientIp, createRateLimiter } from "../../../lib/rateLimit.mjs";

export const runtime = "nodejs";

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

export async function POST(request) {
  const { allowed, retryAfterSeconds } = limiter.check(clientIp(request));
  if (!allowed) {
    return Response.json(
      { error: "Recibimos varios intentos seguidos. Probá de nuevo en unos minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "No pudimos leer el formulario." }, { status: 400 });
  }

  const phone = normalizePhone(body?.phone);
  if (!phone) {
    return Response.json({ error: "El teléfono no parece válido." }, { status: 400 });
  }
  const source = normalizeSource(body?.source);

  // No hay base: el mail (y Citriqs, si esta configurado) es el unico registro
  // del lead. Van en paralelo para no sumar las dos latencias.
  const notify = createLeadNotifier({
    apiKey: process.env.RESEND_API_KEY,
    to: process.env.LEADS_NOTIFY_EMAIL,
    from: process.env.LEADS_FROM_EMAIL,
  });
  const [enviada, notified] = await Promise.all([
    citriqsDesdeEntorno().enviarConsulta({ id: crypto.randomUUID(), telefono: phone, origen: "formulario" }),
    notify({ phone, source, createdAt: new Date().toISOString() }),
  ]);
  if (!enviada.ok) console.warn("[subscribe] Consulta sin llegar a Citriqs:", enviada.motivo);
  if (!notified.sent) console.warn("[subscribe] Lead sin aviso por mail:", notified.reason);

  if (!enviada.ok && !notified.sent) {
    // No llego a ningun lado: mejor decirlo que fingir que se guardo.
    console.error("[subscribe] Lead perdido:", phone, source);
    return Response.json(
      { error: "No pudimos registrar tu teléfono. Escribinos por WhatsApp y te atendemos igual." },
      { status: 503 }
    );
  }

  return Response.json({ ok: true });
}
