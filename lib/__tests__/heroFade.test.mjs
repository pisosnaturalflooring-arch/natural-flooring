import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { runHeroFade } from "../heroFade.mjs";

/**
 * En la primera visita la foto del hero tarda en bajar y, cuando llega,
 * reemplazaba de golpe a la vista previa borrosa: se veía como un flash.
 * El script marca la figura mientras la foto carga para que aparezca con un
 * fundido; si ya está en caché no marca nada y la foto se ve al instante.
 */
function fakeFigure({ complete }) {
  const listeners = {};
  const attributes = new Set();
  const img = {
    complete,
    addEventListener: (type, fn) => { listeners[type] = fn; },
  };
  const figure = {
    querySelector: () => img,
    setAttribute: (name) => attributes.add(name),
    removeAttribute: (name) => attributes.delete(name),
  };
  return { figure, attributes, fire: (type) => listeners[type]?.() };
}

describe("fundido de la foto del hero", () => {
  it("marca la figura mientras la foto todavía está bajando", () => {
    const { figure, attributes } = fakeFigure({ complete: false });
    runHeroFade(figure);
    assert.ok(attributes.has("data-loading"));
  });

  it("saca la marca cuando la foto termina de cargar", () => {
    const { figure, attributes, fire } = fakeFigure({ complete: false });
    runHeroFade(figure);
    fire("load");
    assert.ok(!attributes.has("data-loading"));
  });

  it("si la foto falla, la marca se va igual y no queda tapada", () => {
    const { figure, attributes, fire } = fakeFigure({ complete: false });
    runHeroFade(figure);
    fire("error");
    assert.ok(!attributes.has("data-loading"));
  });

  it("con la foto ya en caché no hay fundido", () => {
    const { figure, attributes } = fakeFigure({ complete: true });
    runHeroFade(figure);
    assert.ok(!attributes.has("data-loading"));
  });
});
