import { NextResponse } from "next/server.js";

// Tiene que coincidir con la cantidad de fotos en components/natural-flooring/hero-images.json.
// El proxy no importa data.js a propósito: corre antes de renderizar y conviene que sea mínimo.
// Un test verifica que los dos números coincidan.
export const HERO_IMAGE_COUNT = 6;

/**
 * Cada visita a "/" muestra una versión prerenderizada de la home con una foto
 * de hero al azar. Las versiones (/inicio/N) son internas: si alguien entra
 * directo a una, va a "/". El proxy corre una vez por pedido, así que la
 * reescritura de "/" no vuelve a pasar por acá.
 */
export function proxy(request) {
  const url = new URL(request.url);
  if (url.pathname !== "/") return NextResponse.redirect(new URL("/", url), 308);
  const foto = Math.floor(Math.random() * HERO_IMAGE_COUNT);
  return NextResponse.rewrite(new URL(`/inicio/${foto}`, url));
}

export const config = {
  matcher: ["/", "/inicio", "/inicio/:path*"],
};
