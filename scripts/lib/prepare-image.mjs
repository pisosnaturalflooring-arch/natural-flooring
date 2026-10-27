import { createHash } from "node:crypto";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { imageWidths } from "../../lib/image-presets.mjs";

const RECIPE = `v1-webp75-hero85-avif53-preview32-${sharp.versions.sharp}-${sharp.versions.vips}`;

async function exists(file) {
  try { return (await stat(file)).size > 0; } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function writeImage(file, buffer) {
  const temporary = `${file}.${process.pid}.tmp`;
  await writeFile(temporary, buffer);
  await rename(temporary, file);
}

export async function prepareImage({ source, outputDirectory, hero = false }) {
  const buffer = await readFile(source);
  const metadata = await sharp(buffer).metadata().catch((error) => {
    throw new Error(`Cannot decode source image: ${source}`, { cause: error });
  });
  if (metadata.pages > 1) throw new Error(`Animated image requires its own delivery policy: ${source}`);
  const rotated = [5, 6, 7, 8].includes(metadata.orientation);
  const width = rotated ? metadata.height : metadata.width;
  const height = rotated ? metadata.width : metadata.height;
  const id = createHash("sha256").update(buffer).update(`${RECIPE}-${hero}`).digest("hex").slice(0, 16);
  const directory = join(outputDirectory, id);
  await mkdir(directory, { recursive: true });

  for (const size of imageWidths(width)) {
    const variants = [{ format: "webp", quality: 75 }];
    if (hero) variants.push({ format: "webp", quality: 85 }, { format: "avif", quality: 85 });
    for (const { format, quality } of variants) {
      const file = join(directory, `${size}-${quality}.${format}`);
      if (await exists(file)) continue;
      let transformer = sharp(buffer).rotate().resize({ width: size, withoutEnlargement: true });
      transformer = format === "avif"
        // Same conversion Next uses for AVIF: 85 * 50/80, rounded to 53.
        ? transformer.avif({ quality: 53, effort: 3 })
        : transformer.webp({ quality });
      await writeImage(file, await transformer.toBuffer());
    }
  }

  const entry = { id, width, height };
  if (hero) {
    const file = join(directory, "preview.webp");
    if (!await exists(file)) {
      await writeImage(file, await sharp(buffer).rotate().resize({ width: 32, withoutEnlargement: true }).webp({ quality: 35 }).toBuffer());
    }
    entry.hero = true;
    entry.preview = `data:image/webp;base64,${(await readFile(file)).toString("base64")}`;
  }
  return entry;
}
