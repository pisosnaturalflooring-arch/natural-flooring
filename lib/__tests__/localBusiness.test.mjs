import { test } from "node:test";
import assert from "node:assert/strict";
import { jsonLdScript, localBusinessJsonLd } from "../localBusiness.mjs";

test("la ficha tiene la empresa y los dos showrooms con dirección y horario", () => {
  const { "@graph": graph } = localBusinessJsonLd("https://naturalflooring.com.ar/");
  const showrooms = graph.filter((n) => n["@type"] === "HomeAndConstructionBusiness");
  assert.equal(graph[0]["@type"], "Organization");
  assert.deepEqual(showrooms.map((s) => s.address.streetAddress), ["3 de Febrero 234", "Linares 67"]);
  for (const s of showrooms) {
    assert.equal(s.url, "https://naturalflooring.com.ar");
    assert.equal(s.openingHoursSpecification.length, 3);
  }
});

test("el JSON no puede cerrar el tag <script>", () => {
  assert.ok(!jsonLdScript({ a: "</script><b>" }).includes("<"));
});
