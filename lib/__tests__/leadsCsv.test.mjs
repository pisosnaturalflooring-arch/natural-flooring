import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { toCsv } from "../leadsCsv.mjs";

describe("toCsv", () => {
  it("writes a header even when there are no leads", () => {
    assert.equal(toCsv([]), "id,phone,source,created_at");
  });

  it("writes one row per lead", () => {
    const csv = toCsv([
      { id: 2, phone: "1123456789", source: "popup-scroll", created_at: "2026-09-01T12:00:00.000Z" },
      { id: 1, phone: "1198765432", source: "popup", created_at: "2026-08-31T09:00:00.000Z" },
    ]);

    assert.equal(csv.split("\n").length, 3);
    assert.match(csv, /^2,1123456789,popup-scroll,2026-09-01T12:00:00.000Z$/m);
  });

  it("quotes and escapes a value that contains a comma or a quote", () => {
    const csv = toCsv([{ id: 1, phone: "1123456789", source: 'ra,ro"si', created_at: "x" }]);

    assert.match(csv, /"ra,ro""si"/);
  });
});
