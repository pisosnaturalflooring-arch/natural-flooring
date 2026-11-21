/**
 * Marca la figura del hero con `data-loading` mientras la foto baja, para que
 * el CSS la muestre con un fundido sobre el fondo liso del hero en vez de
 * aparecer de golpe. Si la foto ya está en caché no hace nada: se ve al instante.
 *
 * Corre como script en línea apenas el HTML trae la foto, antes de React, así
 * que tiene que ser autónoma: no puede usar nada de fuera de la función.
 */
export function runHeroFade(figure) {
  var img = figure.querySelector("img");
  if (!img || img.complete) return;
  figure.setAttribute("data-loading", "");
  var done = function () { figure.removeAttribute("data-loading"); };
  img.addEventListener("load", done, { once: true });
  img.addEventListener("error", done, { once: true });
}

export const HERO_FADE_SCRIPT = `(${runHeroFade.toString()})(document.currentScript.parentNode)`;
