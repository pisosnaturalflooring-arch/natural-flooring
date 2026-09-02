import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { ERROR_CODES, describeError, mapOpenAiFailure } from "../visualizerErrors.mjs";

describe("mapOpenAiFailure", () => {
  it("reconoce la cuenta sin credito", () => {
    assert.equal(
      mapOpenAiFailure(429, { error: { code: "insufficient_quota" } }),
      ERROR_CODES.SIN_CREDITO
    );
  });

  it("distingue el limite de OpenAI de la falta de credito", () => {
    assert.equal(
      mapOpenAiFailure(429, { error: { code: "rate_limit_exceeded" } }),
      ERROR_CODES.SERVICIO_CAIDO
    );
  });

  it("trata una key invalida como servicio mal configurado", () => {
    assert.equal(mapOpenAiFailure(401, { error: { code: "invalid_api_key" } }), ERROR_CODES.NO_CONFIGURADO);
    assert.equal(mapOpenAiFailure(403, {}), ERROR_CODES.NO_CONFIGURADO);
  });

  it("trata los 5xx como servicio caido", () => {
    for (const status of [500, 502, 503, 504]) {
      assert.equal(mapOpenAiFailure(status, {}), ERROR_CODES.SERVICIO_CAIDO);
    }
  });

  it("trata el rechazo por contenido como foto invalida", () => {
    assert.equal(
      mapOpenAiFailure(400, { error: { code: "content_policy_violation" } }),
      ERROR_CODES.FOTO_INVALIDA
    );
  });

  it("cae en desconocido cuando no reconoce la respuesta", () => {
    assert.equal(mapOpenAiFailure(418, {}), ERROR_CODES.DESCONOCIDO);
    assert.equal(mapOpenAiFailure(undefined, undefined), ERROR_CODES.DESCONOCIDO);
  });
});

describe("describeError", () => {
  it("describe cada codigo con titulo, detalle y accion", () => {
    for (const code of Object.values(ERROR_CODES)) {
      const d = describeError(code);
      assert.ok(d.titulo.length > 0, code);
      assert.ok(d.detalle.length > 20, code);
      assert.ok(["cambiar-foto", "reintentar", "esperar", "whatsapp"].includes(d.accion), code);
    }
  });

  it("manda a cambiar la foto cuando no se encontro piso", () => {
    const d = describeError(ERROR_CODES.SIN_PISO);
    assert.equal(d.accion, "cambiar-foto");
    assert.match(d.titulo, /piso/i);
  });

  it("nunca le cuenta al visitante que se acabo el credito", () => {
    // Es informacion del negocio, no del visitante: el log del servidor la grita.
    const d = describeError(ERROR_CODES.SIN_CREDITO);
    for (const filtracion of [/credito/i, /cuota/i, /quota/i, /saldo/i, /factura/i, /openai/i]) {
      assert.doesNotMatch(d.titulo + " " + d.detalle, filtracion);
    }
    assert.equal(d.accion, "whatsapp");
  });

  it("le da al visitante la misma salida ante cualquier falla del servicio", () => {
    const sinCredito = describeError(ERROR_CODES.SIN_CREDITO);
    const caido = describeError(ERROR_CODES.SERVICIO_CAIDO);
    assert.equal(sinCredito.accion, caido.accion);
  });

  it("dice cuanto esperar cuando se alcanzo el limite de intentos", () => {
    const d = describeError(ERROR_CODES.DEMASIADOS_INTENTOS, { retryAfterSeconds: 300 });
    assert.match(d.detalle, /5 minutos/);
  });

  it("no inventa un tiempo cuando no lo sabe", () => {
    const d = describeError(ERROR_CODES.DEMASIADOS_INTENTOS);
    assert.doesNotMatch(d.detalle, /\bNaN\b|undefined/);
  });

  it("devuelve algo util ante un codigo que no conoce", () => {
    const d = describeError("inventado");
    assert.ok(d.titulo.length > 0);
    assert.equal(d.accion, "reintentar");
  });
});
