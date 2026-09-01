import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { materialLibrary } from "../../components/natural-flooring/recommender/recommendationEngine.mjs";
import {
  MATERIAL_PROMPTS,
  MAX_IMAGE_BYTES,
  MIN_IMAGE_SIDE,
  buildPrompt,
  isBigEnough,
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

describe("buildPrompt hardening", () => {
  const prompt = buildPrompt("lapacho");

  it("forbids touching anything other than the floor", () => {
    assert.match(prompt, /only the floor/i);
    assert.match(prompt, /do not add, remove or alter/i);
  });

  it("explicitly protects people and faces", () => {
    assert.match(prompt, /people|person|face/i);
  });

  it("tells the model to do nothing when there is no floor", () => {
    assert.match(prompt, /if .*no floor|return the image unchanged/i);
  });
});

describe("isBigEnough", () => {
  it("accepts a normal phone photo", () => {
    assert.equal(isBigEnough(3024, 4032), true);
  });

  it("rejects an image whose short side is below the minimum", () => {
    assert.equal(isBigEnough(MIN_IMAGE_SIDE - 1, 4000), false);
    assert.equal(isBigEnough(4000, MIN_IMAGE_SIDE - 1), false);
  });

  it("accepts an image exactly at the minimum", () => {
    assert.equal(isBigEnough(MIN_IMAGE_SIDE, MIN_IMAGE_SIDE), true);
  });

  it("rejects nonsense dimensions", () => {
    assert.equal(isBigEnough(0, 0), false);
    assert.equal(isBigEnough(undefined, undefined), false);
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
