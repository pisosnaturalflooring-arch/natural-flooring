/**
 * Verifica que toda imagen referenciada desde components/ y app/ exista en public/.
 *
 * Existe porque `next build` no falla cuando falta un archivo: la imagen sale
 * rota recién en el navegador, y en desarrollo el caché de Next puede seguir
 * sirviendo una versión vieja durante días. Pasó con living-eucalipto-blanco.jpg,
 * borrada en d633174 dejando las referencias en data.js.
 *
 * Uso: npm run check:images
 */
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const SOURCE_DIRS = ["components", "app"];
const SOURCE_EXTS = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx", ".json"]);
const REFERENCE = /["'`](\/images\/[^"'`]+)["'`]/g;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return SOURCE_EXTS.has(extname(entry.name)) ? [path] : [];
  });
}

const missing = [];
const seen = new Set();

for (const dir of SOURCE_DIRS) {
  if (!existsSync(dir)) continue;
  for (const file of walk(dir)) {
    const contents = readFileSync(file, "utf8");
    for (const [, ref] of contents.matchAll(REFERENCE)) {
      const key = `${file}::${ref}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const onDisk = join("public", decodeURIComponent(ref));
      if (!existsSync(onDisk) || !statSync(onDisk).isFile()) {
        missing.push({ file, ref });
      }
    }
  }
}

if (missing.length) {
  console.error(`\n✗ ${missing.length} imagen(es) referenciada(s) que no existen en public/:\n`);
  for (const { file, ref } of missing) console.error(`  ${ref}\n    ← ${file}`);
  console.error("");
  process.exit(1);
}

console.log(`✓ ${seen.size} referencias a imágenes verificadas, todas existen.`);
