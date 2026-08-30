export const runtime = "nodejs";
export const maxDuration = 120; // plataformas que lo respeten (Vercel Pro, etc.)

// ─────────────────────────────────────────────────────────────────────────────
//  👉 CLAVE DE OPENAI — PEGALA ACÁ ENTRE LAS COMILLAS
//  Ej:  const OPENAI_API_KEY_HARDCODED = "sk-proj-....";
//  ⚠️  Si la pegás acá, NO subas este archivo a un repositorio público
//      (cualquiera podría verla). Lo ideal es usar .env.local en su lugar.
// ─────────────────────────────────────────────────────────────────────────────
const OPENAI_API_KEY_HARDCODED = "";

// Descripción de cada material para el prompt de la IA
const MATERIAL_PROMPTS = {
  "roble-claro":
    "light natural oak wood flooring (roble claro), pale blond-honey tone with subtle straight grain",
  "roble-miel": "honey oak wood flooring (roble miel), warm golden-brown tone with natural grain",
  nogal: "walnut wood flooring (nogal), rich dark chocolate brown with visible grain",
  guatambu:
    "guatambú hardwood flooring, pale creamy-yellow warm tone, smooth fine grain",
  "spc-gris":
    "grey SPC vinyl plank flooring, cool light-grey wood-look planks, matte finish",
  wengue: "wengué wood flooring, very dark espresso brown, elegant and uniform",
};

export async function POST(request) {
  // Toma la clave de .env.local (recomendado) o, si no, la pegada arriba en el código.
  const apiKey = process.env.OPENAI_API_KEY || OPENAI_API_KEY_HARDCODED;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "Falta la clave de OpenAI. Pegala en OPENAI_API_KEY_HARDCODED (arriba en app/api/visualizer/route.js) o en el archivo .env.local.",
      },
      { status: 500 }
    );
  }

  try {
    const form = await request.formData();
    const image = form.get("image");
    const material = form.get("material");
    const direction = form.get("direction") || "vertical";
    const size = form.get("size") || "auto";

    if (!image || typeof image === "string") {
      return Response.json({ error: "No se recibió ninguna imagen." }, { status: 400 });
    }

    const materialDesc = MATERIAL_PROMPTS[material] || "natural wood flooring";
    const dirText =
      direction === "horizontal"
        ? "with the planks running horizontally across the room"
        : "with the planks running lengthwise, receding toward the viewer";

    const prompt = `Edit this photograph of a real interior room. Replace ONLY the floor with ${materialDesc}, ${dirText}. Keep absolutely everything else identical to the original: walls, ceiling, furniture, rugs, curtains, windows, doors and every object, and preserve the exact same lighting, shadows, reflections, camera angle, lens and perspective. The new floor must receive the same natural light and cast the same soft shadows as the original scene. Seamless, photorealistic, professional interior photography.`;

    const oaForm = new FormData();
    oaForm.append("model", "gpt-image-1");
    oaForm.append("image", image, image.name || "room.png");
    oaForm.append("prompt", prompt);
    oaForm.append("size", size);
    oaForm.append("quality", "medium"); // subí a "high" para más detalle (más costo)
    oaForm.append("input_fidelity", "high"); // preserva el resto de la escena
    oaForm.append("n", "1");

    const res = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: oaForm,
    });

    const data = await res.json();

    if (!res.ok) {
      return Response.json(
        { error: data?.error?.message || "La API de OpenAI devolvió un error." },
        { status: res.status }
      );
    }

    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) {
      return Response.json({ error: "La API no devolvió ninguna imagen." }, { status: 502 });
    }

    return Response.json({ image: `data:image/png;base64,${b64}` });
  } catch (e) {
    return Response.json(
      { error: e?.message || "Error inesperado al generar la imagen." },
      { status: 500 }
    );
  }
}
