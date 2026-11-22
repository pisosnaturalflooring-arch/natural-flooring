import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { runHeroIntro, runHeroFade, MIN_LOADER_MS, LIFT_FALLBACK_MS, LIFT_MS } from "../heroFade.mjs";

/**
 * En cada carga una capa con el logo tapa toda la pantalla. Cuando la foto
 * está lista (y pasó un mínimo), la capa se levanta y el hero entra: la foto
 * se asienta y el texto entra escalonado. Si algo falla, nada queda oculto.
 */
function attributeSet() {
  const map = new Map();
  return {
    map,
    setAttribute: (name, value = "") => map.set(name, value),
    getAttribute: (name) => map.get(name) ?? null,
    removeAttribute: (name) => map.delete(name),
    hasAttribute: (name) => map.has(name),
  };
}

function setup({ complete = false, naturalWidth = 1920, decode, intro = true, noImg = false, throws = false } = {}) {
  const listeners = {};
  let now = 0;
  let timers = [];
  const frames = [];

  const section = attributeSet();
  const img = { complete, naturalWidth, decode, addEventListener: (type, fn) => { listeners[type] = fn; } };
  const figure = {
    parentNode: section,
    querySelector: () => {
      if (throws) throw new Error("boom");
      return noImg ? null : img;
    },
  };
  const win = {
    performance: { now: () => now },
    setTimeout: (fn, ms) => { timers.push({ fn, at: now + ms }); return timers.length; },
    requestAnimationFrame: (fn) => frames.push(fn),
  };

  if (intro) runHeroIntro(section, win);
  runHeroFade(figure, {}, win);

  const paint = () => { while (frames.length) frames.shift()(); };
  /** Avanza el reloj, corre los timers vencidos y pinta. */
  const advance = (ms) => {
    now += ms;
    let due;
    while ((due = timers.filter((t) => t.at <= now)).length) {
      timers = timers.filter((t) => t.at > now);
      due.forEach((t) => t.fn());
      paint();
    }
    paint();
  };
  const has = (name) => section.hasAttribute(name);
  return { has, fire: (type) => listeners[type]?.(), advance, paint };
}

const settle = async () => { await Promise.resolve(); await Promise.resolve(); };

describe("pantalla de carga del hero", () => {
  it("apenas empieza la sección muestra la capa y oculta el hero", () => {
    const { has } = setup();
    assert.ok(has("data-entrance"));
    for (const state of ["data-lift", "data-photo-in", "data-text-in", "data-loader-gone"]) assert.ok(!has(state), state);
  });

  it(`con la foto en caché la capa se ve al menos ${MIN_LOADER_MS} ms y después se levanta`, async () => {
    const { has, advance } = setup({ complete: true });
    await settle();
    advance(MIN_LOADER_MS - 50);
    assert.ok(!has("data-lift"), "todavía no pasó el mínimo");
    advance(50);
    assert.ok(has("data-lift"));
    assert.ok(has("data-photo-in"));
    assert.ok(has("data-text-in"));
    assert.ok(!has("data-loader-gone"), "la cortina todavía está subiendo");
    advance(LIFT_MS);
    assert.ok(has("data-loader-gone"));
  });

  it("si la foto tarda, la capa se levanta apenas llega", () => {
    const { has, advance, fire } = setup();
    advance(2000);
    assert.ok(!has("data-lift"));
    fire("load");
    advance(0);
    assert.ok(has("data-lift"));
    assert.ok(has("data-photo-in"));
  });

  it("espera a que la foto esté decodificada", async () => {
    let decoded;
    const { has, fire, advance } = setup({ decode: () => new Promise((resolve) => { decoded = resolve; }) });
    advance(1000);
    fire("load");
    advance(0);
    assert.ok(!has("data-lift"), "todavía decodificando");
    decoded();
    await settle();
    advance(0);
    assert.ok(has("data-lift"));
  });

  it("si la decodificación falla, la foto igual se muestra", async () => {
    const { has, fire, advance } = setup({ decode: () => Promise.reject(new Error("decode")) });
    advance(1000);
    fire("load");
    await settle();
    advance(0);
    assert.ok(has("data-photo-in"));
  });

  it(`si la foto no llegó en ${LIFT_FALLBACK_MS} ms, la capa se levanta igual y la foto entra después`, () => {
    const { has, advance, fire } = setup();
    advance(LIFT_FALLBACK_MS);
    assert.ok(has("data-lift"));
    assert.ok(has("data-text-in"));
    assert.ok(!has("data-photo-in"));
    advance(LIFT_MS);
    assert.ok(has("data-loader-gone"));
    fire("load");
    advance(0);
    assert.ok(has("data-photo-in"));
  });

  it("si la foto falla, la capa se levanta sobre el fondo y la foto no aparece", () => {
    const { has, advance, fire } = setup();
    advance(1000);
    fire("error");
    advance(0);
    assert.ok(has("data-lift"));
    assert.ok(has("data-text-in"));
    assert.ok(!has("data-photo-in"));
  });

  it("una foto en caché pero rota tampoco aparece", () => {
    const { has, advance } = setup({ complete: true, naturalWidth: 0 });
    advance(MIN_LOADER_MS);
    assert.ok(has("data-lift"));
    assert.ok(!has("data-photo-in"));
  });

  it("si el script de la figura falla, se muestra todo", () => {
    const { has } = setup({ throws: true });
    for (const state of ["data-lift", "data-photo-in", "data-text-in", "data-loader-gone"]) assert.ok(has(state), state);
  });

  it("sin la marca de la sección (el primer script no corrió) no toca nada", () => {
    const { has, advance } = setup({ intro: false, complete: true });
    advance(5000);
    assert.ok(!has("data-lift"));
    assert.ok(!has("data-photo-in"));
  });
});
