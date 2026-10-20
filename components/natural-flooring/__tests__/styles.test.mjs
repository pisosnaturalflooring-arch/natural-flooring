import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Guardias sobre la hoja de estilos.
 *
 * Existen porque una limpieza con expresiones regulares borro el cierre de un
 * @media y una regla entera, y ni `next build` ni una revision a ojo lo
 * detectaron: el build compila igual y el navegador se come en silencio todo
 * lo que sigue a la llave sin cerrar.
 */

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");

// La home y la base compartida (header, footer, logo, .page) van en hojas
// separadas desde que /productos dejó de cargar los estilos de la home.
const HOJAS = ["NaturalFlooringPage.module.css", "SiteChrome.module.css"];

function archivosJsx(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entrada) => {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) return entrada.name === "__tests__" ? [] : archivosJsx(ruta);
    return [".jsx", ".js"].includes(extname(entrada.name)) ? [ruta] : [];
  });
}

for (const hoja of HOJAS) {
describe(`hoja de estilos ${hoja}`, () => {
  const css = readFileSync(join(raiz, hoja), "utf8");

  it("tiene las llaves balanceadas", () => {
    const abren = (css.match(/\{/g) ?? []).length;
    const cierran = (css.match(/\}/g) ?? []).length;
    assert.equal(abren, cierran, `sobran ${abren - cierran} llaves sin cerrar`);
  });

  it("nunca queda una llave abierta al final de una regla", () => {
    let profundidad = 0;
    let linea = 0;
    for (const texto of css.split("\n")) {
      linea += 1;
      profundidad += (texto.match(/\{/g) ?? []).length - (texto.match(/\}/g) ?? []).length;
      assert.ok(profundidad >= 0, `cierre de mas en la linea ${linea}`);
      assert.ok(profundidad <= 2, `anidamiento inesperado en la linea ${linea}`);
    }
    assert.equal(profundidad, 0, "el archivo termina con una regla sin cerrar");
  });

  /**
   * Huecos que ya existian antes de este guardia. Se listan en vez de
   * ignorarlos para que el test proteja contra los nuevos desde hoy:
   *  - SectionHeading.jsx es un componente muerto, no lo importa nadie.
   *  - resultImage si se usa en el asesor y le falta la regla: es un defecto
   *    visual chico, pendiente aparte.
   */
  const CONOCIDOS = new Set([
    "sectionHeading",
    "sectionHeadingInverse",
    "revealUp",
    "resultImage",
  ]);

  it("define una regla base para cada clase que usan los componentes", () => {
    // Solo la regla base: .promoPill:hover existiendo no alcanza si .promoPill no esta.
    const definidas = new Set(
      [...css.matchAll(/^\s*\.([A-Za-z0-9_-]+)\s*[,{]/gm)].map((m) => m[1])
    );

    const faltantes = new Set();
    for (const archivo of archivosJsx(raiz)) {
      const fuente = readFileSync(archivo, "utf8");
      if (!fuente.includes(hoja)) continue;
      for (const uso of fuente.matchAll(/styles\.([A-Za-z0-9_]+)/g)) {
        if (!definidas.has(uso[1]) && !CONOCIDOS.has(uso[1])) {
          faltantes.add(`${uso[1]} (${archivo.split("/").pop()})`);
        }
      }
    }

    assert.deepEqual([...faltantes], [], "clases usadas sin regla en el modulo");
  });
});
}
