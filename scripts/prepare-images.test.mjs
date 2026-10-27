import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, stat, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { prepareImage } from "./lib/prepare-image.mjs";
import { preparedImageUrl } from "../lib/image-presets.mjs";

let directory;
before(async () => { directory = await mkdtemp(join(tmpdir(), "flooring-images-")); });
after(async () => { await rm(directory, { recursive: true, force: true }); });

describe("imágenes preparadas antes de la visita", () => {
  it("entrega un WebP real sin agrandar un original pequeño y conserva transparencia", async () => {
    const source = join(directory, "foto pequeña.png");
    await sharp({ create: { width: 60, height: 90, channels: 4, background: "#926b3380" } }).png().toFile(source);
    const entry = await prepareImage({ source, outputDirectory: directory });
    const url = preparedImageUrl(entry, { width: 1920 });
    assert.match(url, /^\/_images\/[a-f0-9]+\/60-75\.webp$/);
    const image = await sharp(join(directory, url.replace("/_images/", ""))).metadata();
    assert.equal(image.width, 60);
    assert.equal(image.height, 90);
    assert.equal(image.format, "webp");
    assert.equal(image.hasAlpha, true);
  });

  it("respeta EXIF al dimensionar y cambiar la orientación", async () => {
    const source = join(directory, "vertical.jpg");
    await sharp({ create: { width: 120, height: 80, channels: 3, background: "#926b33" } }).jpeg().withMetadata({ orientation: 6 }).toFile(source);
    const entry = await prepareImage({ source, outputDirectory: directory });
    assert.equal(entry.width, 80);
    assert.equal(entry.height, 120);
    const url = preparedImageUrl(entry, { width: 96 });
    const image = await sharp(join(directory, url.replace("/_images/", ""))).metadata();
    assert.equal(image.width, 80);
    assert.equal(image.height, 120);
    assert.equal(image.orientation, undefined);
  });

  it("prepara AVIF y WebP del hero y una vista previa embebida, reutilizando el caché", async () => {
    const source = join(directory, "hero.jpg");
    await sharp({ create: { width: 150, height: 100, channels: 3, background: "#926b33" } }).jpeg().toFile(source);
    const entry = await prepareImage({ source, outputDirectory: directory, hero: true });
    for (const format of ["webp", "avif"]) {
      const url = preparedImageUrl(entry, { width: 640, quality: 85, format });
      const file = join(directory, url.replace("/_images/", ""));
      const image = await sharp(file).metadata();
      assert.equal(image.width, 150);
      assert.equal(image.format, format === "avif" ? "heif" : "webp");
      const timestamp = (await stat(file)).mtimeMs;
      const cached = await prepareImage({ source, outputDirectory: directory, hero: true });
      assert.equal(cached.id, entry.id);
      assert.equal((await stat(file)).mtimeMs, timestamp);
    }
    assert.match(entry.preview, /^data:image\/webp;base64,/);
    const preview = await sharp(Buffer.from(entry.preview.split(",")[1], "base64")).metadata();
    assert.ok(preview.width <= 32);
    assert.ok(entry.preview.length < 1800);
  });

  it("cambia las URLs cuando cambia la foto o su tratamiento", async () => {
    const source = join(directory, "cambiante.png");
    await sharp({ create: { width: 60, height: 90, channels: 3, background: "#926b33" } }).png().toFile(source);
    const original = await prepareImage({ source, outputDirectory: directory });
    const asHero = await prepareImage({ source, outputDirectory: directory, hero: true });
    assert.notEqual(asHero.id, original.id);
    await sharp({ create: { width: 60, height: 90, channels: 3, background: "#294321" } }).png().toFile(source);
    const changed = await prepareImage({ source, outputDirectory: directory });
    assert.notEqual(changed.id, original.id);
    assert.ok((await readFile(join(directory, preparedImageUrl(changed, { width: 48 }).replace("/_images/", "")))).length > 0);
  });

  it("limita una fuente enorme a 3840px, incluso si se solicita una pantalla mayor", async () => {
    const source = join(directory, "panorama.jpg");
    await sharp({ create: { width: 4600, height: 80, channels: 3, background: "#926b33" } }).jpeg().toFile(source);
    const entry = await prepareImage({ source, outputDirectory: directory });
    const url = preparedImageUrl(entry, { width: 8000 });
    assert.match(url, /\/3840-75\.webp$/);
    assert.equal((await sharp(join(directory, url.replace("/_images/", ""))).metadata()).width, 3840);
  });
});
