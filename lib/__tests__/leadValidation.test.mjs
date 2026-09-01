import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { normalizePhone, normalizeSource } from "../leadValidation.mjs";

describe("normalizePhone", () => {
  it("strips separators and keeps only digits", () => {
    assert.equal(normalizePhone("11 2345-6789"), "1123456789");
  });

  it("keeps the country code of an international number", () => {
    assert.equal(normalizePhone("+54 9 11 6997-7725"), "5491169977725");
  });

  it("rejects a number with fewer than 8 digits", () => {
    assert.equal(normalizePhone("123"), null);
  });

  it("rejects a number with more than 15 digits", () => {
    assert.equal(normalizePhone("1".repeat(16)), null);
  });

  it("rejects a non-string payload instead of throwing", () => {
    assert.equal(normalizePhone({ a: 1 }), null);
    assert.equal(normalizePhone([1, 2, 3]), null);
    assert.equal(normalizePhone(1123456789), null);
  });

  it("rejects a missing value", () => {
    assert.equal(normalizePhone(undefined), null);
    assert.equal(normalizePhone(null), null);
    assert.equal(normalizePhone(""), null);
  });
});

describe("normalizeSource", () => {
  it("keeps a known short source", () => {
    assert.equal(normalizeSource("popup-scroll"), "popup-scroll");
  });

  it("falls back to popup when the source is missing or not a string", () => {
    assert.equal(normalizeSource(undefined), "popup");
    assert.equal(normalizeSource({}), "popup");
    assert.equal(normalizeSource(""), "popup");
  });

  it("truncates a source longer than 64 characters", () => {
    assert.equal(normalizeSource("x".repeat(300)).length, 64);
  });
});
