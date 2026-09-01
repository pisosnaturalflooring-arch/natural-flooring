import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  MAX_IMAGE_BYTES,
  buildPrompt,
  validateVisualizerInput,
} from "../visualizerInput.mjs";

const imageFile = (bytes = 1024, type = "image/jpeg") =>
  new File([new Uint8Array(bytes)], "ambiente.jpg", { type });

const validInput = () => ({
  image: imageFile(),
  material: "nogal",
  direction: "vertical",
  size: "1024x1024",
});

describe("validateVisualizerInput", () => {
  it("accepts a well formed upload", () => {
    const result = validateVisualizerInput(validInput());
    assert.equal(result.ok, true);
    assert.equal(result.value.material, "nogal");
    assert.equal(result.value.direction, "vertical");
    assert.equal(result.value.size, "1024x1024");
  });

  it("rejects a request with no image", () => {
    const result = validateVisualizerInput({ ...validInput(), image: null });
    assert.equal(result.ok, false);
  });

  it("rejects a text field sent in place of the image", () => {
    const result = validateVisualizerInput({ ...validInput(), image: "no soy un archivo" });
    assert.equal(result.ok, false);
  });

  it("rejects a file that is not an accepted image type", () => {
    const notAnImage = new File(["hola"], "nota.txt", { type: "text/plain" });
    const result = validateVisualizerInput({ ...validInput(), image: notAnImage });
    assert.equal(result.ok, false);
    assert.match(result.error, /formato/i);
  });

  it("rejects an image over the size cap", () => {
    const result = validateVisualizerInput({
      ...validInput(),
      image: imageFile(MAX_IMAGE_BYTES + 1),
    });
    assert.equal(result.ok, false);
    assert.match(result.error, /pesada|MB/i);
  });

  it("rejects an unknown material instead of silently falling back", () => {
    const result = validateVisualizerInput({ ...validInput(), material: "inventado" });
    assert.equal(result.ok, false);
  });

  it("rejects a size that is not one of the allowed values", () => {
    const result = validateVisualizerInput({ ...validInput(), size: "999x999" });
    assert.equal(result.ok, false);
  });

  it("rejects an unknown plank direction", () => {
    const result = validateVisualizerInput({ ...validInput(), direction: "diagonal" });
    assert.equal(result.ok, false);
  });

  it("defaults direction and size when they are absent", () => {
    const result = validateVisualizerInput({ image: imageFile(), material: "nogal" });
    assert.equal(result.ok, true);
    assert.equal(result.value.direction, "vertical");
    assert.equal(result.value.size, "auto");
  });
});

describe("buildPrompt", () => {
  it("describes the chosen material", () => {
    assert.match(buildPrompt("nogal", "vertical"), /walnut/i);
  });

  it("describes the plank direction", () => {
    assert.match(buildPrompt("nogal", "horizontal"), /horizontally/i);
    assert.match(buildPrompt("nogal", "vertical"), /lengthwise/i);
  });
});
