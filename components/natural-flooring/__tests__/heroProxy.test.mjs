import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { proxy } from "../../../proxy.js";

/**
 * proxy.js elige al azar una de las versiones estáticas de la home
 * (/inicio/0 … /inicio/N-1). Si se agrega o saca una foto del hero y no se
 * actualiza el proxy, algunas fotos nunca salen o el proxy apunta a una página
 * que no existe (404 en la home).
 */
const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

describe("fotos del hero y proxy", () => {
  it("el proxy conoce la misma cantidad de fotos que hay en hero.images", () => {
    const fotos = JSON.parse(readFileSync(join(raiz, "components/natural-flooring/hero-images.json"), "utf8")).length;

    const proxy = readFileSync(join(raiz, "proxy.js"), "utf8");
    const declarado = Number(proxy.match(/HERO_IMAGE_COUNT = (\d+)/)?.[1]);

    assert.ok(fotos > 0, "no se encontraron fotos en hero.images");
    assert.equal(declarado, fotos);
  });

  it("\"/\" se reescribe a una de las versiones de la home", () => {
    const response = proxy(new Request("https://naturalflooring.com.ar/"));
    const destino = new URL(response.headers.get("x-middleware-rewrite"));
    assert.match(destino.pathname, /^\/inicio\/\d+$/);
  });

  for (const ruta of ["/inicio", "/inicio/2", "/inicio/2/algo"]) {
    it(`entrar directo a ${ruta} redirige a "/"`, () => {
      const response = proxy(new Request(`https://naturalflooring.com.ar${ruta}`));
      assert.equal(response.status, 308);
      assert.equal(response.headers.get("location"), "https://naturalflooring.com.ar/");
    });
  }
});
