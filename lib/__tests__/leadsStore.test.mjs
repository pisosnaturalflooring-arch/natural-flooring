import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { createClient } from "@libsql/client";

import { createLeadsStore } from "../leadsStore.mjs";

/** Base libsql en memoria: mismo dialecto que Turso, sin tocar la red. */
async function freshStore() {
  const store = createLeadsStore(createClient({ url: ":memory:" }));
  await store.init();
  return store;
}

describe("createLeadsStore", () => {
  let store;
  beforeEach(async () => {
    store = await freshStore();
  });

  it("saves a lead and reads it back", async () => {
    await store.insertLead({ phone: "1123456789", source: "popup-scroll" });

    const leads = await store.listLeads();
    assert.equal(leads.length, 1);
    assert.equal(leads[0].phone, "1123456789");
    assert.equal(leads[0].source, "popup-scroll");
    assert.ok(leads[0].created_at);
  });

  it("keeps a single row when the same phone is submitted twice", async () => {
    await store.insertLead({ phone: "1123456789", source: "popup-scroll" });
    await store.insertLead({ phone: "1123456789", source: "popup-scroll" });

    const leads = await store.listLeads();
    assert.equal(leads.length, 1);
  });

  it("refreshes the timestamp of a phone that comes back", async () => {
    await store.insertLead({ phone: "1123456789", source: "popup" });
    const first = (await store.listLeads())[0].created_at;

    await new Promise((r) => setTimeout(r, 5));
    await store.insertLead({ phone: "1123456789", source: "visualizador" });

    const [lead] = await store.listLeads();
    assert.notEqual(lead.created_at, first);
    assert.equal(lead.source, "visualizador");
  });

  it("lists the newest lead first", async () => {
    await store.insertLead({ phone: "1111111111", source: "popup" });
    await store.insertLead({ phone: "2222222222", source: "popup" });

    const leads = await store.listLeads();
    assert.deepEqual(leads.map((l) => l.phone), ["2222222222", "1111111111"]);
  });

  it("can be initialised twice without failing", async () => {
    await store.init();
    await store.insertLead({ phone: "1123456789", source: "popup" });
    assert.equal((await store.listLeads()).length, 1);
  });
});
