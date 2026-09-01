/**
 * Aviso por mail de cada lead nuevo, via la API HTTP de Resend.
 *
 * Es solo un fetch, sin dependencia npm. Nunca lanza: el lead ya quedo
 * guardado en la base antes de llegar aca, y un problema de envio no puede
 * hacerle ver un error a la persona que dejo el telefono.
 */

import { sourceLabel } from "./leadSources.mjs";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function renderHtml({ phone, source, createdAt }) {
  return `
    <h2>Nuevo lead desde la web</h2>
    <p><strong>Teléfono:</strong> <a href="https://wa.me/${phone}">${phone}</a></p>
    <p><strong>Origen:</strong> ${sourceLabel(source)}</p>
    <p><strong>Fecha:</strong> ${createdAt}</p>
    <p><a href="https://wa.me/${phone}">Escribirle por WhatsApp</a></p>
  `.trim();
}

export function createLeadNotifier({ apiKey, to, from = "onboarding@resend.dev", fetchImpl = fetch }) {
  return async function notify(lead) {
    if (!apiKey || !to) return { sent: false, reason: "not-configured" };

    try {
      const res = await fetchImpl(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject: `Nuevo lead: ${lead.phone}`,
          html: renderHtml(lead),
        }),
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        return { sent: false, reason: `Resend ${res.status}: ${detail?.message || "sin detalle"}` };
      }

      return { sent: true };
    } catch (e) {
      return { sent: false, reason: e?.message || "error de red" };
    }
  };
}
