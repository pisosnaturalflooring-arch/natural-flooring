/**
 * Aviso por mail de cada lead nuevo, via la API HTTP de Resend.
 *
 * Es solo un fetch, sin dependencia npm. Nunca lanza: el lead ya quedo
 * guardado en la base antes de llegar aca, y un problema de envio no puede
 * hacerle ver un error a la persona que dejo el telefono.
 */

import { formatPhoneDisplay, whatsappNumber } from "./leadValidation.mjs";
import { sourceLabel } from "./leadSources.mjs";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/** Fecha legible, en castellano y en hora de Buenos Aires. */
export function formatLeadDate(iso) {
  const fecha = iso ? new Date(iso) : new Date();
  if (Number.isNaN(fecha.getTime())) return "fecha desconocida";
  // hour12 explicito: es-AR por defecto da "5:59 p. m.", y para uso comercial
  // el reloj de 24 horas se lee de un vistazo.
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(fecha);
}

function fila(etiqueta, valor) {
  return `
    <tr>
      <td style="padding:6px 0;color:#6a6e62;font-size:13px;width:90px;vertical-align:top;">${etiqueta}</td>
      <td style="padding:6px 0;color:#1a1c14;font-size:15px;font-weight:600;">${valor}</td>
    </tr>`;
}

function renderHtml({ phone, source, createdAt }) {
  const wa = `https://wa.me/${whatsappNumber(phone)}`;
  const legible = formatPhoneDisplay(phone);
  return `
  <div style="background:#f4f1e8;padding:28px 16px;font-family:Helvetica,Arial,sans-serif;">
    <div style="max-width:460px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border-top:5px solid #60ae1b;">
      <div style="padding:26px 26px 8px;">
        <p style="margin:0 0 4px;color:#60ae1b;font-size:12px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;">Natural Flooring</p>
        <h1 style="margin:0 0 18px;color:#1a1c14;font-size:21px;">Alguien dejó su teléfono en la web</h1>
        <table style="border-collapse:collapse;width:100%;">
          ${fila("Teléfono", `<a href="${wa}" style="color:#1a1c14;">${legible}</a>`)}
          ${fila("Llegó por", sourceLabel(source))}
          ${fila("Cuándo", formatLeadDate(createdAt))}
        </table>
      </div>
      <div style="padding:6px 26px 26px;">
        <a href="${wa}" style="display:block;padding:13px;border-radius:9px;background:#60ae1b;color:#fff;font-size:15px;font-weight:700;text-align:center;text-decoration:none;">Escribirle por WhatsApp</a>
        <p style="margin:14px 0 0;color:#6a6e62;font-size:12px;line-height:1.5;">Pidió el catálogo y el descuento. Conviene contestarle hoy.</p>
      </div>
    </div>
  </div>`.trim();
}

export function createLeadNotifier({ apiKey, to, from = "onboarding@resend.dev", fetchImpl = fetch }) {
  // Sin nombre, el mail llega firmado "onboarding@resend.dev" y parece spam.
  const remitente = from.includes("<") ? from : `Natural Flooring <${from}>`;

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
          from: remitente,
          to: [to],
          subject: `Nuevo contacto desde la web — ${formatPhoneDisplay(lead.phone)}`,
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
