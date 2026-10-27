import { readdir, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prepareImage } from "./lib/prepare-image.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDirectory = join(root, "public");
const outputDirectory = join(publicDirectory, "_images");
const manifestFile = join(root, "lib/image-manifest.json");
const heroImages = JSON.parse(await readFile(join(root, "components/natural-flooring/hero-images.json"), "utf8"));
const heroSources = new Set(heroImages.flatMap((image) => [image.src, image.desktopSrc].filter(Boolean)));
const extensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

// Only prepare assets used by the application, leaving raw/obsolete downloads alone.
async function referencedImages(directory) {
  const sources = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) sources.push(...await referencedImages(file));
    else if (/\.(?:[cm]?js|jsx|tsx?|json)$/.test(entry.name)) {
      const contents = await readFile(file, "utf8");
      sources.push(...[...contents.matchAll(/["'`](\/images\/[^"'`]+)["'`]/g)].map((match) => match[1]));
    }
  }
  return sources;
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "_images" || entry.name.startsWith("NATURAL FLOORING")) continue;
    const file = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(file));
    else if (extensions.has(extname(file).toLowerCase())) files.push(file);
  }
  return files;
}

const references = new Set([
  ...await referencedImages(join(root, "components")),
  ...await referencedImages(join(root, "app")),
]);
const files = (await walk(publicDirectory)).filter((file) => {
  const url = `/${relative(publicDirectory, file).split("\\").join("/")}`;
  return !url.startsWith("/images/") || references.has(url);
}).sort();
const entries = new Map();
let cursor = 0;
let finished = 0;
const started = performance.now();
await mkdir(outputDirectory, { recursive: true });
// Bound CPU and memory use on small Vercel builders. Each worker encodes one file at a time.
await Promise.all(Array.from({ length: 3 }, async () => {
  while (cursor < files.length) {
    const file = files[cursor++];
    const url = `/${relative(publicDirectory, file).split("\\").join("/")}`;
    entries.set(url, await prepareImage({ source: file, outputDirectory, hero: heroSources.has(url) }));
    finished++;
    if (finished % 30 === 0) console.log(`  Imágenes preparadas: ${finished}/${files.length}`);
  }
}));
for (const source of heroSources) {
  if (!entries.has(source)) throw new Error(`Hero image missing: ${source}`);
}
const serialized = `${JSON.stringify(Object.fromEntries([...entries].sort(([a], [b]) => a.localeCompare(b))), null, 2)}\n`;
let previous;
try { previous = await readFile(manifestFile, "utf8"); } catch (error) { if (error.code !== "ENOENT") throw error; }
if (serialized !== previous) await writeFile(manifestFile, serialized);
const activeIds = new Set([...entries.values()].map((entry) => entry.id));
for (const entry of await readdir(outputDirectory, { withFileTypes: true })) {
  if (entry.isDirectory() && /^[a-f0-9]{16}$/.test(entry.name) && !activeIds.has(entry.name)) {
    await rm(join(outputDirectory, entry.name), { recursive: true });
  }
}
console.log(`✓ ${files.length} imágenes listas para servir sin conversión en la visita (${((performance.now() - started) / 1000).toFixed(1)}s).`);
