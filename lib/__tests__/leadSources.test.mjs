import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { LEAD_SOURCES, sourceLabel } from "../leadSources.mjs";

describe("sourceLabel", () => {
  it("turns the popup slug into something readable in the email", () => {
    assert.equal(sourceLabel("popup-scroll"), "Popup automático");
  });

  it("distinguishes a lead that came from the promo pill", () => {
    assert.equal(sourceLabel("promo-pill"), "Pastilla de promo");
  });

  it("has a label for every known source", () => {
    for (const [slug, label] of Object.entries(LEAD_SOURCES)) {
      assert.equal(sourceLabel(slug), label);
      assert.ok(label.length > 0);
    }
  });

  it("refuses an unknown source instead of echoing it", () => {
    assert.equal(sourceLabel("inventado"), "Desconocido");
    assert.equal(sourceLabel(""), "Desconocido");
    assert.equal(sourceLabel(undefined), "Desconocido");
  });

  it("never lets client markup reach the email body", () => {
    assert.equal(sourceLabel("<img src=x onerror=alert(1)>"), "Desconocido");
    assert.equal(sourceLabel("<script>fetch('//evil')</script>"), "Desconocido");
  });
});
