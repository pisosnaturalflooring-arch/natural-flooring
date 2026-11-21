/**
 * Carga de la foto del hero.
 *
 * Mientras la foto baja, la figura lleva `data-loading` (el CSS oculta la foto
 * y su etiqueta sobre el fondo liso). Si tarda más de LOGO_DELAY_MS, el logo
 * del header (`[data-hero-logo]`) baja hasta el lugar marcado en el hero
 * (`[data-hero-logo-target]`), crece y late (`data-loader` en la figura).
 * Cuando llega la foto, el logo vuelve a la barra desde donde esté y la foto
 * entra con un fundido: hay un solo logo en pantalla. Con la foto en caché no
 * pasa nada, y con movimiento reducido el logo no se mueve.
 *
 * Corre como script en línea apenas el HTML trae la foto, antes de React. Por
 * eso tiene que ser autónoma: no puede usar nada de fuera de la función (el
 * retraso está repetido adentro). El logo se mueve con element.animate(), que
 * no toca atributos y no choca con la hidratación del header.
 */
export const LOGO_DELAY_MS = 200;

export function runHeroFade(figure, doc, win) {
  var img = figure.querySelector("img");
  if (!img || img.complete) return;
  figure.setAttribute("data-loading", "");

  var flight = null;
  var reduced = win.matchMedia && win.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var timer = reduced ? null : win.setTimeout(function () {
    if (win.scrollY > 0) return;
    var logo = doc.querySelector("[data-hero-logo]");
    var target = figure.querySelector("[data-hero-logo-target]");
    if (!logo || !target || !logo.animate) return;
    var from = logo.getBoundingClientRect();
    var to = target.getBoundingClientRect();
    var dx = to.left + to.width / 2 - (from.left + from.width / 2);
    var dy = to.top + to.height / 2 - (from.top + from.height / 2);
    var scale = to.width / from.width;
    figure.setAttribute("data-loader", "");
    flight = logo.animate(
      [{ transform: "none" }, { transform: "translate(" + dx + "px, " + dy + "px) scale(" + scale + ")" }],
      { duration: 700, easing: "cubic-bezier(0.77, 0, 0.175, 1)", fill: "forwards" }
    );
  }, 200);

  var reveal = function () {
    if (timer !== null) win.clearTimeout(timer);
    figure.removeAttribute("data-loading");
    figure.removeAttribute("data-loader");
    if (flight) {
      var back = flight;
      back.onfinish = function () { back.cancel(); };
      back.reverse();
    }
  };
  // "load" llega antes de que una foto grande esté decodificada: sin esperar a
  // decode(), la etiqueta y el logo se movían antes de que la foto se pintara.
  img.addEventListener("load", function () {
    if (img.decode) img.decode().then(reveal, reveal);
    else reveal();
  }, { once: true });
  img.addEventListener("error", reveal, { once: true });
}

export const HERO_FADE_SCRIPT = `(${runHeroFade.toString()})(document.currentScript.parentNode, document, window)`;
