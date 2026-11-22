/**
 * Pantalla de carga y entrada del hero
 * (docs/superpowers/specs/2026-11-21-hero-entrance-design.md).
 *
 * En cada carga, una capa del verde de la marca tapa toda la pantalla, header
 * incluido, con el logo y una línea de progreso. Cuando la foto está lista (y
 * pasó un mínimo para que el logo se registre), la capa se levanta como una
 * cortina y el hero queda debajo, ya armado: la foto se asienta con un leve
 * zoom y el texto entra escalonado.
 *
 * Los estados son atributos de la sección:
 *   data-entrance    marca de que corre la entrada (su valor es el momento en que empezó).
 *                    Muestra la capa y oculta la foto y el texto.
 *   data-lift        la capa se levanta.
 *   data-photo-in    la foto aparece.
 *   data-text-in     el texto entra escalonado.
 *   data-loader-gone la capa terminó de irse (deja de tapar).
 *
 * Fallas:
 * - Sin JS no hay capa ni nada oculto.
 * - Si la foto no llegó en LIFT_FALLBACK_MS, la capa se levanta igual y la
 *   foto entra con un fundido cuando llegue.
 * - Si la foto falla, se levanta sobre el fondo verde.
 * - Si el script de la figura falla, se muestra todo.
 *
 * Las dos funciones corren como scripts en línea, antes de React:
 *   runHeroIntro va al principio de la sección.
 *   runHeroFade va dentro de la figura, después de la foto.
 * Tienen que ser autónomas: no pueden usar nada de fuera de la función (los
 * tiempos están repetidos adentro).
 */
export const MIN_LOADER_MS = 600;
export const LIFT_FALLBACK_MS = 4000;
export const LIFT_MS = 1100;

export function runHeroIntro(section, win) {
  section.setAttribute("data-entrance", String(win.performance.now()));
  win.setTimeout(function () {
    if (section.hasAttribute("data-lift")) return;
    section.setAttribute("data-lift", "");
    section.setAttribute("data-text-in", "");
    win.setTimeout(function () { section.setAttribute("data-loader-gone", ""); }, 1100);
  }, 4000);
}

export function runHeroFade(figure, doc, win) {
  var section = figure.parentNode;
  if (!section.hasAttribute("data-entrance")) return;
  var done = false;

  var reveal = function (photoOk) {
    if (done) return;
    done = true;
    var elapsed = win.performance.now() - Number(section.getAttribute("data-entrance"));
    win.setTimeout(function () {
      // Dos cuadros: el estado oculto tiene que pintarse antes del cambio para
      // que haya transición.
      win.requestAnimationFrame(function () {
        win.requestAnimationFrame(function () {
          if (photoOk) section.setAttribute("data-photo-in", "");
          if (section.hasAttribute("data-lift")) return;
          section.setAttribute("data-lift", "");
          section.setAttribute("data-text-in", "");
          win.setTimeout(function () { section.setAttribute("data-loader-gone", ""); }, 1100);
        });
      });
    }, Math.max(0, 600 - elapsed));
  };

  try {
    var img = figure.querySelector("img");
    if (!img) return reveal(false);
    // "load" llega antes de que una foto grande esté decodificada: sin esperar a
    // decode(), la cortina se levantaba antes de que la foto se pintara.
    var ready = function () {
      if (img.naturalWidth === 0) return reveal(false);
      if (img.decode) img.decode().then(function () { reveal(true); }, function () { reveal(true); });
      else reveal(true);
    };
    if (img.complete) return ready();
    img.addEventListener("load", ready, { once: true });
    img.addEventListener("error", function () { reveal(false); }, { once: true });
  } catch (error) {
    section.setAttribute("data-photo-in", "");
    section.setAttribute("data-lift", "");
    section.setAttribute("data-text-in", "");
    section.setAttribute("data-loader-gone", "");
  }
}

export const HERO_INTRO_SCRIPT = `(${runHeroIntro.toString()})(document.currentScript.parentNode, window)`;
export const HERO_FADE_SCRIPT = `(${runHeroFade.toString()})(document.currentScript.parentNode, document, window)`;
