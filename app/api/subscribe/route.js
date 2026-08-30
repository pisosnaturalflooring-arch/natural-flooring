import { insertLead } from "../../../lib/leadsDb.js";

export const runtime = "nodejs";

function validPhone(p) {
  const digits = (p || "").replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

export async function POST(request) {
  try {
    const { phone, source } = await request.json();
    if (!validPhone(phone)) {
      return Response.json({ error: "El teléfono no parece válido." }, { status: 400 });
    }

    insertLead({ phone: String(phone).trim(), source: source || "popup" });

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e?.message || "Error inesperado." }, { status: 500 });
  }
}
