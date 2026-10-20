import { NextResponse } from "next/server";

// Tiene que coincidir con la cantidad de fotos en hero.images (components/natural-flooring/data.js).
// El proxy no importa data.js a propósito: corre antes de renderizar y conviene que sea mínimo.
// Un test verifica que los dos números coincidan.
export const HERO_IMAGE_COUNT = 7;

/** Cada visita a "/" muestra una versión prerenderizada de la home con una foto de hero al azar. */
export function proxy(request) {
  const foto = Math.floor(Math.random() * HERO_IMAGE_COUNT);
  return NextResponse.rewrite(new URL(`/inicio/${foto}`, request.url));
}

export const config = {
  matcher: "/",
};
