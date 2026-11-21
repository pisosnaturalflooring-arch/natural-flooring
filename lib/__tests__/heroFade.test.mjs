import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { runHeroFade, LOGO_DELAY_MS } from "../heroFade.mjs";

/**
 * En la primera visita la foto del hero tarda en bajar. Mientras tanto se ve
 * el fondo liso del hero y, si tarda más de LOGO_DELAY_MS, el logo del header
 * baja al centro del hero y late. Cuando llega la foto, el logo vuelve a la
 * barra y la foto entra con un fundido. Con la foto en caché no pasa nada.
 */
function rect(left, top, width) {
  return { left, top, width, height: width };
}

function setup({ complete = false, reducedMotion = false, scrollY = 0, decode } = {}) {
  const listeners = {};
  const attributes = new Set();
  const timers = [];
  const animations = [];

  const img = { complete, decode, addEventListener: (type, fn) => { listeners[type] = fn; } };
  const target = { getBoundingClientRect: () => rect(1000, 400, 88) };
  const figure = {
    querySelector: (selector) => (selector === "img" ? img : target),
    setAttribute: (name) => attributes.add(name),
    removeAttribute: (name) => attributes.delete(name),
    hasAttribute: (name) => attributes.has(name),
  };
  const logo = {
    getBoundingClientRect: () => rect(40, 14, 48),
    animate: (keyframes, options) => {
      const animation = { keyframes, options, reversed: false, cancelled: false, onfinish: null,
        reverse() { this.reversed = true; }, cancel() { this.cancelled = true; } };
      animations.push(animation);
      return animation;
    },
  };
  const doc = { querySelector: () => logo };
  const win = {
    scrollY,
    matchMedia: () => ({ matches: reducedMotion }),
    setTimeout: (fn, ms) => { timers.push({ fn, ms, cleared: false }); return timers.length - 1; },
    clearTimeout: (id) => { if (timers[id]) timers[id].cleared = true; },
  };

  runHeroFade(figure, doc, win);
  return {
    attributes, animations,
    fire: (type) => listeners[type]?.(),
    tick: () => timers.filter((t) => !t.cleared).forEach((t) => { t.cleared = true; t.fn(); }),
  };
}

describe("carga de la foto del hero", () => {
  it("con la foto ya en caché no marca nada ni mueve el logo", () => {
    const { attributes, tick, animations } = setup({ complete: true });
    tick();
    assert.equal(attributes.size, 0);
    assert.equal(animations.length, 0);
  });

  it("marca la figura mientras la foto todavía está bajando", () => {
    const { attributes } = setup();
    assert.ok(attributes.has("data-loading"));
  });

  it("si la foto llega antes del retraso, el logo no se mueve", () => {
    const { attributes, fire, tick, animations } = setup();
    fire("load");
    tick();
    assert.ok(!attributes.has("data-loading"));
    assert.equal(animations.length, 0);
  });

  it(`si tarda más de ${LOGO_DELAY_MS} ms, el logo del header baja al centro del hero`, () => {
    const { attributes, tick, animations } = setup();
    tick();
    assert.ok(attributes.has("data-loader"));
    assert.equal(animations.length, 1);
    // Del centro del logo (64, 38) al centro del destino (1044, 444), de 48 a 88 px.
    const end = animations[0].keyframes.at(-1).transform;
    assert.equal(end, `translate(980px, 406px) scale(${88 / 48})`);
    assert.equal(animations[0].options.fill, "forwards");
  });

  it("cuando llega la foto, el logo vuelve a la barra desde donde esté", () => {
    const { attributes, tick, fire, animations } = setup();
    tick();
    fire("load");
    assert.ok(!attributes.has("data-loading"));
    assert.ok(!attributes.has("data-loader"));
    assert.ok(animations[0].reversed);
    animations[0].onfinish?.();
    assert.ok(animations[0].cancelled, "al terminar suelta el transform para que el header quede como siempre");
  });

  it("espera a que la foto esté decodificada para mostrarla (si no, la etiqueta llegaba antes que la foto)", async () => {
    let decoded;
    const { attributes, tick, fire, animations } = setup({ decode: () => new Promise((resolve) => { decoded = resolve; }) });
    tick();
    fire("load");
    assert.ok(attributes.has("data-loading"), "todavía decodificando: la foto sigue oculta");
    assert.ok(!animations[0].reversed);
    decoded();
    await Promise.resolve();
    await Promise.resolve();
    assert.ok(!attributes.has("data-loading"));
    assert.ok(animations[0].reversed);
  });

  it("si la decodificación falla, la foto igual se muestra", async () => {
    const { attributes, fire } = setup({ decode: () => Promise.reject(new Error("decode")) });
    fire("load");
    await Promise.resolve();
    await Promise.resolve();
    assert.ok(!attributes.has("data-loading"));
  });

  it("si la foto falla, la foto no queda oculta y el logo vuelve igual", () => {
    const { attributes, tick, fire, animations } = setup();
    tick();
    fire("error");
    assert.ok(!attributes.has("data-loading"));
    assert.ok(animations[0].reversed);
  });

  it("con movimiento reducido el logo se queda en la barra", () => {
    const { attributes, tick, animations } = setup({ reducedMotion: true });
    tick();
    assert.ok(attributes.has("data-loading"));
    assert.equal(animations.length, 0);
  });

  it("si la persona ya bajó por la página, el logo no se mueve", () => {
    const { tick, animations } = setup({ scrollY: 300 });
    tick();
    assert.equal(animations.length, 0);
  });
});
