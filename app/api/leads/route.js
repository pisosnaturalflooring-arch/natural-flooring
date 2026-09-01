import { toCsv } from "../../../lib/leadsCsv.mjs";
import { getLeadsStore } from "../../../lib/leadsStore.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Lectura de los leads capturados. Protegido con un token de .env. */
export async function GET(request) {
  const expected = process.env.LEADS_ADMIN_TOKEN;
  if (!expected) {
    console.error("[leads] Falta LEADS_ADMIN_TOKEN: el endpoint queda cerrado.");
    return Response.json({ error: "No disponible." }, { status: 404 });
  }

  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (provided !== expected) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const store = await getLeadsStore();
  if (!store) {
    return Response.json({ error: "Base de datos no configurada." }, { status: 503 });
  }

  const leads = await store.listLeads();

  if (new URL(request.url).searchParams.get("format") === "csv") {
    return new Response(toCsv(leads), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="leads.csv"',
      },
    });
  }

  return Response.json({ total: leads.length, leads });
}
