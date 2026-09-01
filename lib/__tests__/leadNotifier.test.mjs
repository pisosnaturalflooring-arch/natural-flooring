import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { createLeadNotifier } from "../leadNotifier.mjs";

const lead = { phone: "5491169977725", source: "popup-scroll", createdAt: "2026-09-01T12:00:00.000Z" };

function recordingFetch(response = { ok: true, status: 200, json: async () => ({ id: "re_1" }) }) {
  const calls = [];
  const impl = async (url, options) => {
    calls.push({ url, options });
    return response;
  };
  return { impl, calls };
}

describe("createLeadNotifier", () => {
  it("posts the lead to the Resend API with the configured key", async () => {
    const { impl, calls } = recordingFetch();
    const notify = createLeadNotifier({
      apiKey: "re_test",
      to: "pisos@example.com",
      from: "web@example.com",
      fetchImpl: impl,
    });

    await notify(lead);

    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://api.resend.com/emails");
    assert.equal(calls[0].options.method, "POST");
    assert.equal(calls[0].options.headers.Authorization, "Bearer re_test");
  });

  it("puts the phone number in the subject and the body", async () => {
    const { impl, calls } = recordingFetch();
    const notify = createLeadNotifier({
      apiKey: "re_test",
      to: "pisos@example.com",
      from: "web@example.com",
      fetchImpl: impl,
    });

    await notify(lead);
    const body = JSON.parse(calls[0].options.body);

    assert.match(body.subject, /5491169977725/);
    assert.match(body.html, /5491169977725/);
    assert.deepEqual(body.to, ["pisos@example.com"]);
  });

  it("writes the origin as a readable label, not the raw slug", async () => {
    const { impl, calls } = recordingFetch();
    const notify = createLeadNotifier({
      apiKey: "re_test",
      to: "pisos@example.com",
      fetchImpl: impl,
    });

    await notify(lead);
    const body = JSON.parse(calls[0].options.body);

    assert.match(body.html, /Pastilla de promo|Popup autom/);
    assert.doesNotMatch(body.html, /popup-scroll/);
  });

  it("does not echo an unknown origin into the email body", async () => {
    const { impl, calls } = recordingFetch();
    const notify = createLeadNotifier({
      apiKey: "re_test",
      to: "pisos@example.com",
      fetchImpl: impl,
    });

    await notify({ ...lead, source: "<img src=x onerror=alert(1)>" });
    const body = JSON.parse(calls[0].options.body);

    assert.doesNotMatch(body.html, /onerror/);
    assert.match(body.html, /Desconocido/);
  });

  it("reports not-configured and skips the call when there is no api key", async () => {
    const { impl, calls } = recordingFetch();
    const notify = createLeadNotifier({ apiKey: "", to: "pisos@example.com", fetchImpl: impl });

    const result = await notify(lead);

    assert.equal(result.sent, false);
    assert.equal(result.reason, "not-configured");
    assert.equal(calls.length, 0);
  });

  it("reports a failure instead of throwing when Resend returns an error", async () => {
    const { impl } = recordingFetch({
      ok: false,
      status: 422,
      json: async () => ({ message: "domain not verified" }),
    });
    const notify = createLeadNotifier({
      apiKey: "re_test",
      to: "pisos@example.com",
      fetchImpl: impl,
    });

    const result = await notify(lead);

    assert.equal(result.sent, false);
    assert.match(result.reason, /422/);
  });

  it("reports a failure instead of throwing when the network call rejects", async () => {
    const notify = createLeadNotifier({
      apiKey: "re_test",
      to: "pisos@example.com",
      fetchImpl: async () => {
        throw new Error("ECONNRESET");
      },
    });

    const result = await notify(lead);

    assert.equal(result.sent, false);
    assert.match(result.reason, /ECONNRESET/);
  });
});
