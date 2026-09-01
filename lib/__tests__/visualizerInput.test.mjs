import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { materialLibrary } from "../../components/natural-flooring/recommender/recommendationEngine.mjs";
import {
  MATERIAL_PROMPTS,
  MAX_IMAGE_BYTES,
  buildPrompt,
  validateVisualizerInput,
} from "../visualizerInput.mjs";

const imageFile = (bytes = 1024, type = "image/jpeg") =>
  new File([new Uint8Array(bytes)], "ambiente.jpg", { type });

const validInput = () => ({
  image: imageFile(),
  material: "lapacho",
  size: "1024x1024",
});

describe("validateVisualizerInput", () => {
  it("accepts a well formed upload", () => {
    const result = validateVisualizerInput(validInput());
    assert.equal(result.ok, true);
    assert.equal(result.value.material, "lapacho");
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

  it("defaults direction and size when they are absent", () => {
    const result = validateVisualizerInput({ image: imageFile(), material: "lapacho" });
    assert.equal(result.ok, true);
    assert.equal(result.value.size, "auto");
  });
});

describe("buildPrompt", () => {
  it("describes the chosen material", () => {
    assert.match(buildPrompt("lapacho"), /lapacho/i);
    assert.match(buildPrompt("guatambu"), /guatamb/i);
  });
});

describe("MATERIAL_PROMPTS", () => {
  it("offers exactly the materials the business actually sells", () => {
    const delCatalogo = materialLibrary.map((m) => m.id).sort();
    assert.deepEqual(Object.keys(MATERIAL_PROMPTS).sort(), delCatalogo);
  });

  it("describes every one of them for the image model", () => {
    for (const [id, descripcion] of Object.entries(MATERIAL_PROMPTS)) {
      assert.ok(descripcion.length > 20, `${id} no tiene descripcion util`);
    }
  });

  it("no longer offers woods that are not in the catalogue", () => {
    for (const inventado of ["roble-claro", "roble-miel", "nogal", "wengue", "spc-gris"]) {
      assert.equal(MATERIAL_PROMPTS[inventado], undefined);
    }
  });
});
