import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  LEGACY_STORAGE_KEY,
  PROMO_STORAGE_KEY,
  readPromoStatus,
  shouldAutoOpen,
  shouldShowPill,
  writePromoStatus,
} from "../promoPreference.mjs";

/** localStorage de mentira: guarda strings y opcionalmente explota, como en incognito. */
function fakeStorage(initial = {}, { throws = false } = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem(key) {
      if (throws) throw new Error("acceso denegado");
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      if (throws) throw new Error("acceso denegado");
      data.set(key, String(value));
    },
    read: (key) => data.get(key),
  };
}

describe("readPromoStatus", () => {
  it("treats an empty storage as a visitor who has never seen the promo", () => {
    assert.equal(readPromoStatus(fakeStorage()), "new");
  });

  it("reads back a dismissal", () => {
    const storage = fakeStorage({ [PROMO_STORAGE_KEY]: "dismissed" });
    assert.equal(readPromoStatus(storage), "dismissed");
  });

  it("reads back a subscription", () => {
    const storage = fakeStorage({ [PROMO_STORAGE_KEY]: "subscribed" });
    assert.equal(readPromoStatus(storage), "subscribed");
  });

  it("treats the old nf_news_v1 mark as a dismissal", () => {
    const storage = fakeStorage({ [LEGACY_STORAGE_KEY]: "1756742400000" });
    assert.equal(readPromoStatus(storage), "dismissed");
  });

  it("prefers the new key when both are present", () => {
    const storage = fakeStorage({
      [LEGACY_STORAGE_KEY]: "1756742400000",
      [PROMO_STORAGE_KEY]: "subscribed",
    });
    assert.equal(readPromoStatus(storage), "subscribed");
  });

  it("falls back to new when the stored value is not a known status", () => {
    assert.equal(readPromoStatus(fakeStorage({ [PROMO_STORAGE_KEY]: "cualquiera" })), "new");
  });

  it("does not throw when storage is unavailable", () => {
    assert.equal(readPromoStatus(fakeStorage({}, { throws: true })), "new");
    assert.equal(readPromoStatus(undefined), "new");
  });
});

describe("writePromoStatus", () => {
  it("persists the status under the new key", () => {
    const storage = fakeStorage();
    writePromoStatus(storage, "subscribed");
    assert.equal(storage.read(PROMO_STORAGE_KEY), "subscribed");
  });

  it("does not throw when storage is unavailable", () => {
    assert.doesNotThrow(() => writePromoStatus(fakeStorage({}, { throws: true }), "dismissed"));
    assert.doesNotThrow(() => writePromoStatus(undefined, "dismissed"));
  });
});

describe("shouldAutoOpen", () => {
  it("opens on its own only for a visitor who has never seen it", () => {
    assert.equal(shouldAutoOpen("new"), true);
    assert.equal(shouldAutoOpen("dismissed"), false);
    assert.equal(shouldAutoOpen("subscribed"), false);
  });
});

describe("shouldShowPill", () => {
  it("keeps offering the promo to someone who closed it", () => {
    assert.equal(shouldShowPill("dismissed"), true);
  });

  it("shows the pill to a first-time visitor too", () => {
    assert.equal(shouldShowPill("new"), true);
  });

  it("stops chasing someone who already left their phone", () => {
    assert.equal(shouldShowPill("subscribed"), false);
  });
});
