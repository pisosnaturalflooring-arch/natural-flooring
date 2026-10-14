import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { createCitriqsClient } from "../citriqs.mjs";

const consulta = { id: "0192a0b0-0000-7000-8000-000000000001", telefono: "5491169977725", origen: "visualizador", material: "lapacho" };

function fetchQueResponde(...respuestas) {
  const calls = [];
  const impl = async (url, options) => {
    calls.push({ url, options });
    const r = respuestas[Math.min(calls.length - 1, respuestas.length - 1)];
    if (r instanceof Error) throw r;
    return { ok: r.status < 300, status: r.status, json: async () => r.body ?? {} };
  };
  return { impl, calls };
}

describe("createCitriqsClient", () => {
  it("manda la consulta como multipart con la clave", async () => {
    const { impl, calls } = fetchQueResponde({ status: 201, body: { id: consulta.id, duplicada: false } });
    const r = await createCitriqsClient({ url: "https://app.citriqs.test", clave: "cqs_x", fetchImpl: impl }).enviarConsulta(consulta);
    assert.deepEqual(r, { ok: true });
    assert.equal(calls[0].url, "https://app.citriqs.test/api/publico/v1/consultas");
    assert.equal(calls[0].options.headers.authorization, "Bearer cqs_x");
    assert.equal(calls[0].options.body.get("material"), "lapacho");
    assert.equal(calls[0].options.body.get("id"), consulta.id);
  });

  it("adjunta las fotos cuando vienen", async () => {
    const { impl, calls } = fetchQueResponde({ status: 201 });
    await createCitriqsClient({ url: "https://a.test", clave: "cqs_x", fetchImpl: impl }).enviarConsulta({
      ...consulta, fotoOriginal: { bytes: Buffer.from("x"), type: "image/png" }, fotoResultado: { base64: Buffer.from("y").toString("base64"), type: "image/png" },
    });
    assert.ok(calls[0].options.body.get("fotoOriginal") instanceof Blob);
    assert.ok(calls[0].options.body.get("fotoResultado") instanceof Blob);
  });

  it("reintenta una vez si Citriqs falla con 5xx y el mismo id viaja las dos veces", async () => {
    const { impl, calls } = fetchQueResponde({ status: 503 }, { status: 201 });
    const r = await createCitriqsClient({ url: "https://a.test", clave: "cqs_x", fetchImpl: impl }).enviarConsulta(consulta);
    assert.deepEqual(r, { ok: true });
    assert.equal(calls.length, 2);
    assert.equal(calls[1].options.body.get("id"), consulta.id);
  });

  it("no reintenta un 4xx y devuelve el código", async () => {
    const { impl, calls } = fetchQueResponde({ status: 400, body: { error: { codigo: "dato_invalido", campo: "material" } } });
    const r = await createCitriqsClient({ url: "https://a.test", clave: "cqs_x", fetchImpl: impl }).enviarConsulta(consulta);
    assert.deepEqual(r, { ok: false, motivo: "dato_invalido" });
    assert.equal(calls.length, 1);
  });

  it("si Citriqs no responde, no lanza: devuelve ok false para que salga el mail", async () => {
    const { impl } = fetchQueResponde(new Error("ECONNREFUSED"));
    const r = await createCitriqsClient({ url: "https://a.test", clave: "cqs_x", fetchImpl: impl }).enviarConsulta(consulta);
    assert.deepEqual(r, { ok: false, motivo: "sin_respuesta" });
  });

  it("sin configurar no pide nada", async () => {
    const { impl, calls } = fetchQueResponde({ status: 201 });
    const r = await createCitriqsClient({ url: "", clave: "", fetchImpl: impl }).enviarConsulta(consulta);
    assert.deepEqual(r, { ok: false, motivo: "sin_configurar" });
    assert.equal(calls.length, 0);
  });
});
