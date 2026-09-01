import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { clientIp, createRateLimiter } from "../rateLimit.mjs";

/** Reloj controlable: el limiter no puede depender de esperas reales. */
function fakeClock(start = 0) {
  let now = start;
  return { now: () => now, advance: (ms) => (now += ms) };
}

describe("createRateLimiter", () => {
  it("allows requests up to the limit inside the window", () => {
    const clock = fakeClock();
    const limiter = createRateLimiter({ limit: 3, windowMs: 600_000, now: clock.now });

    assert.equal(limiter.check("ip-a").allowed, true);
    assert.equal(limiter.check("ip-a").allowed, true);
    assert.equal(limiter.check("ip-a").allowed, true);
  });

  it("blocks the request that goes over the limit", () => {
    const clock = fakeClock();
    const limiter = createRateLimiter({ limit: 2, windowMs: 600_000, now: clock.now });

    limiter.check("ip-a");
    limiter.check("ip-a");

    assert.equal(limiter.check("ip-a").allowed, false);
  });

  it("reports how many seconds are left before retrying", () => {
    const clock = fakeClock();
    const limiter = createRateLimiter({ limit: 1, windowMs: 600_000, now: clock.now });

    limiter.check("ip-a");
    clock.advance(100_000);

    assert.equal(limiter.check("ip-a").retryAfterSeconds, 500);
  });

  it("allows again once the window has passed", () => {
    const clock = fakeClock();
    const limiter = createRateLimiter({ limit: 1, windowMs: 600_000, now: clock.now });

    limiter.check("ip-a");
    clock.advance(600_001);

    assert.equal(limiter.check("ip-a").allowed, true);
  });

  it("counts each key separately", () => {
    const clock = fakeClock();
    const limiter = createRateLimiter({ limit: 1, windowMs: 600_000, now: clock.now });

    limiter.check("ip-a");

    assert.equal(limiter.check("ip-b").allowed, true);
  });

  it("drops expired keys so the map does not grow unbounded", () => {
    const clock = fakeClock();
    const limiter = createRateLimiter({ limit: 5, windowMs: 600_000, now: clock.now });

    for (let i = 0; i < 50; i++) limiter.check(`ip-${i}`);
    assert.equal(limiter.size(), 50);

    clock.advance(600_001);
    limiter.check("ip-nuevo");

    assert.equal(limiter.size(), 1);
  });
});

describe("clientIp", () => {
  const withHeaders = (h) => ({ headers: new Headers(h) });

  it("takes the first address of x-forwarded-for", () => {
    assert.equal(clientIp(withHeaders({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" })), "1.2.3.4");
  });

  it("falls back to x-real-ip when there is no x-forwarded-for", () => {
    assert.equal(clientIp(withHeaders({ "x-real-ip": "5.6.7.8" })), "5.6.7.8");
  });

  it("returns a placeholder when no address header is present", () => {
    assert.equal(clientIp(withHeaders({})), "desconocida");
  });
});
