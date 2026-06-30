import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getRecommendation,
  materialLibrary,
  recommenderSteps,
} from "../recommendationEngine.mjs";

describe("getRecommendation", () => {
  it("recommends WPC when an exposed deck prioritizes simple maintenance and accepts alternatives", () => {
    const result = getRecommendation({
      projectType: "deck",
      exposure: "exterior-exposed",
      intensity: "high",
      priority: "simple-maintenance",
      openness: "safe-recommendation",
      tone: "no-preference",
    });

    assert.equal(result.primary.id, "wpc-deck");
    assert.ok(result.reason.includes("mantenimiento"));
    assert.deepEqual(
      result.alternatives.map((material) => material.id),
      ["lapacho", "spc"]
    );
  });

  it("keeps the recommendation in natural wood when the user only wants wood", () => {
    const result = getRecommendation({
      projectType: "interior-floor",
      exposure: "interior-humid",
      intensity: "medium",
      priority: "humidity-resistance",
      openness: "natural-only",
      tone: "medium",
    });

    assert.equal(result.primary.natural, true);
    assert.equal(result.primary.id, "lapacho");
    assert.ok(result.caveat.includes("madera natural"));
  });

  it("uses aesthetic preference only inside the technically safe set", () => {
    const result = getRecommendation({
      projectType: "stairs",
      exposure: "interior-dry",
      intensity: "medium",
      priority: "natural-look",
      openness: "alternatives-ok",
      tone: "warm",
    });

    assert.equal(result.primary.id, "petiribi");
    assert.deepEqual(
      result.alternatives.map((material) => material.id),
      ["viraro", "lapacho"]
    );
  });
});

describe("recommender configuration", () => {
  it("keeps every step short enough for the guided consultation flow", () => {
    assert.equal(recommenderSteps.length, 6);
    for (const step of recommenderSteps) {
      assert.ok(step.options.length >= 2);
      assert.ok(step.options.length <= 5);
    }
  });

  it("keeps the material library synchronized with required metadata", () => {
    assert.ok(materialLibrary.length >= 8);
    for (const material of materialLibrary) {
      assert.ok(material.id);
      assert.ok(material.label);
      assert.ok(material.family);
      assert.ok(material.bestUse);
      assert.ok(Array.isArray(material.projects));
      assert.ok(Array.isArray(material.exposures));
      assert.ok(Array.isArray(material.intensities));
      assert.ok(Array.isArray(material.tones));
      assert.ok(material.maintenance);
      assert.equal(typeof material.natural, "boolean");
      assert.ok(material.explanation);
      assert.ok(material.image);
      assert.ok(material.imageAlt);
      assert.ok(material.statLabel);
      assert.ok(material.statValue);
      assert.ok(material.importance);
      assert.ok(material.decision);
    }
  });
});
