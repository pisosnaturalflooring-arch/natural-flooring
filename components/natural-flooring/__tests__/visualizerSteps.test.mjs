import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  VISUALIZER_STEPS,
  currentStep,
  isStepReachable,
} from "../visualizerSteps.mjs";

describe("VISUALIZER_STEPS", () => {
  it("walks the visitor through photo, material and result", () => {
    assert.deepEqual(
      VISUALIZER_STEPS.map((s) => s.id),
      ["foto", "material", "resultado"]
    );
  });

  it("gives every step a short label for the indicator", () => {
    for (const step of VISUALIZER_STEPS) {
      assert.ok(step.label.length > 0 && step.label.length <= 20, step.id);
    }
  });
});

describe("currentStep", () => {
  it("starts on the photo step", () => {
    assert.equal(currentStep({ hasPhoto: false, status: "idle" }), "foto");
  });

  it("moves to the material step once there is a photo", () => {
    assert.equal(currentStep({ hasPhoto: true, status: "idle" }), "material");
  });

  it("shows the result step while the image is being generated", () => {
    assert.equal(currentStep({ hasPhoto: true, status: "loading" }), "resultado");
  });

  it("stays on the result step once the image is ready", () => {
    assert.equal(currentStep({ hasPhoto: true, status: "done" }), "resultado");
  });

  it("goes back to the material step when the generation failed", () => {
    assert.equal(currentStep({ hasPhoto: true, status: "error" }), "material");
  });

  it("honours an explicit step the visitor navigated back to", () => {
    assert.equal(
      currentStep({ hasPhoto: true, status: "done", requested: "material" }),
      "material"
    );
  });

  it("ignores a requested step the visitor cannot reach yet", () => {
    assert.equal(
      currentStep({ hasPhoto: false, status: "idle", requested: "resultado" }),
      "foto"
    );
  });
});

describe("isStepReachable", () => {
  it("always allows going back to the photo", () => {
    assert.equal(isStepReachable("foto", { hasPhoto: false, status: "idle" }), true);
  });

  it("blocks the material step until there is a photo", () => {
    assert.equal(isStepReachable("material", { hasPhoto: false, status: "idle" }), false);
    assert.equal(isStepReachable("material", { hasPhoto: true, status: "idle" }), true);
  });

  it("blocks the result step until there is something to show", () => {
    assert.equal(isStepReachable("resultado", { hasPhoto: true, status: "idle" }), false);
    assert.equal(isStepReachable("resultado", { hasPhoto: true, status: "loading" }), true);
    assert.equal(isStepReachable("resultado", { hasPhoto: true, status: "done" }), true);
  });

  it("rejects a step that does not exist", () => {
    assert.equal(isStepReachable("inventado", { hasPhoto: true, status: "done" }), false);
  });
});
