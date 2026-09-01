import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { createFloorCheck } from "../floorCheck.mjs";

const FOTO = "data:image/jpeg;base64,/9j/aaaa";

function fetchQueRespondeTexto(texto, { ok = true, status = 200 } = {}) {
  const calls = [];
  const impl = async (url, options) => {
    calls.push({ url, options });
    return {
      ok,
      status,
      json: async () => ({ output: [{ content: [{ type: "output_text", text: texto }] }] }),
    };
  };
  return { impl, calls };
}

const armar = (impl, extra = {}) =>
  createFloorCheck({ apiKey: "sk-test", model: "modelo-chico", fetchImpl: impl, ...extra });

describe("createFloorCheck", () => {
  it("asks the model about the photo before anything is generated", async () => {
    const { impl, calls } = fetchQueRespondeTexto('{"tienePiso":true}');
    await armar(impl)(FOTO);

    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://api.openai.com/v1/responses");
    assert.equal(calls[0].options.headers.Authorization, "Bearer sk-test");
    const body = JSON.parse(calls[0].options.body);
    assert.equal(body.model, "modelo-chico");
    assert.ok(JSON.stringify(body).includes(FOTO), "la foto tiene que viajar en el pedido");
  });

  it("lets a photo with a visible floor through", async () => {
    const { impl } = fetchQueRespondeTexto('{"tienePiso":true,"motivo":"living con piso de madera"}');
    assert.equal((await armar(impl)(FOTO)).allowed, true);
  });

  it("blocks a photo with no floor and keeps the reason", async () => {
    const { impl } = fetchQueRespondeTexto('{"tienePiso":false,"motivo":"es un primer plano de una persona"}');
    const r = await armar(impl)(FOTO);

    assert.equal(r.allowed, false);
    assert.match(r.motivo, /persona/);
  });

  it("reads the answer even when the model wraps it in a code fence", async () => {
    const { impl } = fetchQueRespondeTexto('```json\n{"tienePiso":false}\n```');
    assert.equal((await armar(impl)(FOTO)).allowed, false);
  });

  it("does not call the model when there is no api key", async () => {
    const { impl, calls } = fetchQueRespondeTexto('{"tienePiso":false}');
    const r = await createFloorCheck({ apiKey: "", model: "m", fetchImpl: impl })(FOTO);

    assert.equal(r.allowed, true);
    assert.equal(r.skipped, "not-configured");
    assert.equal(calls.length, 0);
  });

  it("lets the visitor through when the check itself fails", async () => {
    // Un guardian inestable no puede frenar a un cliente real: el rate limit
    // ya pone el techo de gasto.
    const { impl } = fetchQueRespondeTexto("", { ok: false, status: 500 });
    const r = await armar(impl)(FOTO);

    assert.equal(r.allowed, true);
    assert.ok(r.skipped);
  });

  it("lets the visitor through when the answer is not usable json", async () => {
    const { impl } = fetchQueRespondeTexto("no tengo idea");
    const r = await armar(impl)(FOTO);

    assert.equal(r.allowed, true);
    assert.ok(r.skipped);
  });

  it("lets the visitor through when the network throws", async () => {
    const r = await armar(async () => {
      throw new Error("ECONNRESET");
    })(FOTO);

    assert.equal(r.allowed, true);
    assert.match(r.skipped, /ECONNRESET/);
  });
});
