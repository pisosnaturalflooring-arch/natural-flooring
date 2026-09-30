import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { createLeadNotifier, formatLeadDate } from "../leadNotifier.mjs";

const lead = { phone: "5491169977725", source: "popup-scroll", createdAt: "2026-09-01T12:00:00.000Z" };

function recordingFetch(response = { ok: true, status: 200, json: async () => ({ id: "re_1" }) }) {
  const calls = [];
  const impl = async (url, options) => {
    calls.push({ url, options });
    return response;
  };
  return { impl, calls };
}

describe("createLeadNotifier", () => {
  it("posts the lead to the Resend API with the configured key", async () => {
    const { impl, calls } = recordingFetch();
    const notify = createLeadNotifier({
      apiKey: "re_test",
      to: "pisos@example.com",
      from: "web@example.com",
      fetchImpl: impl,
    });

    await notify(lead);

    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://api.resend.com/emails");
    assert.equal(calls[0].options.method, "POST");
    assert.equal(calls[0].options.headers.Authorization, "Bearer re_test");
  });

  it("puts the phone number in the subject and the body", async () => {
    const { impl, calls } = recordingFetch();
    const notify = createLeadNotifier({
      apiKey: "re_test",
      to: "pisos@example.com",
      from: "web@example.com",
      fetchImpl: impl,
    });

    await notify(lead);
    const body = JSON.parse(calls[0].options.body);

    // El numero va agrupado como se escribe, no como cadena de digitos.
    assert.match(body.subject, /\+54 9 11 6997-7725/);
    assert.match(body.html, /\+54 9 11 6997-7725/);
    assert.deepEqual(body.to, ["pisos@example.com"]);
  });

  it("writes the origin as a readable label, not the raw slug", async () => {
    const { impl, calls } = recordingFetch();
    const notify = createLeadNotifier({
      apiKey: "re_test",
      to: "pisos@example.com",
      fetchImpl: impl,
    });

    await notify(lead);
    const body = JSON.parse(calls[0].options.body);

    assert.match(body.html, /Pastilla de promo|Popup autom/);
    assert.doesNotMatch(body.html, /popup-scroll/);
  });

  it("does not echo an unknown origin into the email body", async () => {
    const { impl, calls } = recordingFetch();
    const notify = createLeadNotifier({
      apiKey: "re_test",
      to: "pisos@example.com",
      fetchImpl: impl,
    });

    await notify({ ...lead, source: "<img src=x onerror=alert(1)>" });
    const body = JSON.parse(calls[0].options.body);

    assert.doesNotMatch(body.html, /onerror/);
    assert.match(body.html, /Desconocido/);
  });

  it("reports not-configured and skips the call when there is no api key", async () => {
    const { impl, calls } = recordingFetch();
    const notify = createLeadNotifier({ apiKey: "", to: "pisos@example.com", fetchImpl: impl });

    const result = await notify(lead);

    assert.equal(result.sent, false);
    assert.equal(result.reason, "not-configured");
    assert.equal(calls.length, 0);
  });

  it("reports a failure instead of throwing when Resend returns an error", async () => {
    const { impl } = recordingFetch({
      ok: false,
      status: 422,
      json: async () => ({ message: "domain not verified" }),
    });
    const notify = createLeadNotifier({
      apiKey: "re_test",
      to: "pisos@example.com",
      fetchImpl: impl,
    });

    const result = await notify(lead);

    assert.equal(result.sent, false);
    assert.match(result.reason, /422/);
  });

  it("reports a failure instead of throwing when the network call rejects", async () => {
    const notify = createLeadNotifier({
      apiKey: "re_test",
      to: "pisos@example.com",
      fetchImpl: async () => {
        throw new Error("ECONNRESET");
      },
    });

    const result = await notify(lead);

    assert.equal(result.sent, false);
    assert.match(result.reason, /ECONNRESET/);
  });
});

describe("formatLeadDate", () => {
  it("writes the date in Spanish and in Buenos Aires time", () => {
    // 2026-09-01T20:59:19Z son las 17:59 en Argentina (UTC-3).
    const texto = formatLeadDate("2026-09-01T20:59:19.533Z");
    assert.match(texto, /septiembre/);
    assert.match(texto, /2026/);
    assert.match(texto, /17:59/);
  });

  it("never shows a raw ISO timestamp", () => {
    assert.doesNotMatch(formatLeadDate("2026-09-01T20:59:19.533Z"), /T\d\d:\d\d|Z$/);
  });

  it("falls back to something readable when the date is missing", () => {
    assert.equal(typeof formatLeadDate(undefined), "string");
    assert.ok(formatLeadDate(undefined).length > 0);
  });
});

describe("email copy", () => {
  const capturar = async (lead) => {
    const { impl, calls } = recordingFetch();
    const notify = createLeadNotifier({ apiKey: "re_test", to: "pisos@example.com", fetchImpl: impl });
    await notify(lead);
    return JSON.parse(calls[0].options.body);
  };

  it("is written in Spanish, with no jargon the client would not know", async () => {
    const body = await capturar(lead);
    for (const palabra of [/lead/i, /source/i, /popup-scroll/]) {
      assert.doesNotMatch(body.subject, palabra);
      assert.doesNotMatch(body.html, palabra);
    }
  });

  it("sends from a named sender, not a bare address", async () => {
    const body = await capturar(lead);
    assert.match(body.from, /Natural Flooring/);
  });

  it("builds a WhatsApp link that actually opens a chat", async () => {
    const body = await capturar({ ...lead, phone: "1123456789" });
    assert.match(body.html, /wa\.me\/5491123456789/);
  });
});

describe("aviso del visualizador", () => {
  const capturar = async (extra) => {
    const { impl, calls } = recordingFetch();
    const notify = createLeadNotifier({ apiKey: "re_test", to: "pisos@example.com", fetchImpl: impl });
    await notify({ ...lead, source: "visualizador", material: "Lapacho", ...extra });
    return JSON.parse(calls[0].options.body);
  };
  const original = { filename: "ambiente-original.jpg", content: "YW50ZXM=", content_type: "image/jpeg" };
  const resultado = { filename: "ambiente-con-piso-nuevo.png", content: "ZGVzcHVlcw==", content_type: "image/png" };

  it("adjunta el antes y el después, y dice qué material probó", async () => {
    const body = await capturar({ generated: true, attachments: [original, resultado] });

    assert.match(body.subject, /visualizador/);
    assert.match(body.subject, /\+54 9 11 6997-7725/);
    assert.match(body.html, /Visualizador con IA/);
    assert.match(body.html, /Lapacho/);
    assert.match(body.html, /cómo le quedaría/);
    assert.deepEqual(body.attachments.map((a) => a.filename), ["ambiente-original.jpg", "ambiente-con-piso-nuevo.png"]);
  });

  it("si no se pudo generar, avisa que no vio el resultado y manda solo su foto", async () => {
    const body = await capturar({ generated: false, attachments: [original] });

    assert.match(body.html, /no llegó a ver el resultado/);
    assert.deepEqual(body.attachments.map((a) => a.filename), ["ambiente-original.jpg"]);
  });

  it("los avisos del popup no llevan adjuntos ni hablan del visualizador", async () => {
    const { impl, calls } = recordingFetch();
    const notify = createLeadNotifier({ apiKey: "re_test", to: "pisos@example.com", fetchImpl: impl });
    await notify(lead);
    const body = JSON.parse(calls[0].options.body);

    assert.equal(body.attachments, undefined);
    assert.match(body.html, /Pidió el catálogo/);
    assert.doesNotMatch(body.subject, /visualizador/);
  });
});
