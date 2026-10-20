import { citriqsDesdeEntorno } from "../../../lib/citriqs.mjs";
import { createLeadNotifier } from "../../../lib/leadNotifier.mjs";
import { normalizePhone, normalizeSource } from "../../../lib/leadValidation.mjs";
import { getLeadsStore } from "../../../lib/leadsStore.mjs";
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

  const store = await getLeadsStore();
  if (!store) {
    // Sin base configurada el lead se perderia: mejor decirlo que fingir que se guardo.
    console.error("[subscribe] Falta TURSO_DATABASE_URL. Lead no guardado:", phone, source);
    return Response.json(
      { error: "No pudimos registrar tu teléfono. Escribinos por WhatsApp y te atendemos igual." },
      { status: 503 }
    );
  }

  try {
    await store.insertLead({ phone, source });
  } catch (e) {
    console.error("[subscribe] Error guardando el lead:", e);
    return Response.json(
      { error: "No pudimos registrar tu teléfono. Escribinos por WhatsApp y te atendemos igual." },
      { status: 503 }
    );
  }

  // El lead ya esta a salvo. Citriqs y el mail no dependen uno del otro: van
  // en paralelo para no sumar las dos latencias. Si fallan, solo queda en el log.
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
  if (!notified.sent) {
    console.warn("[subscribe] Lead guardado pero sin aviso por mail:", notified.reason);
  }

  return Response.json({ ok: true });
}
