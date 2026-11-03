import { notFound } from "next/navigation";
import NaturalFlooringPage from "../../../components/natural-flooring/NaturalFlooringPage";
import { hero } from "../../../components/natural-flooring/data";

/**
 * Una versión estática de la home por cada foto del hero. proxy.js elige una
 * al azar en cada visita a "/": la foto cambia al recargar (lo pidió el
 * cliente) y la página igual se sirve prerenderizada, sin renderizar en el
 * servidor en cada pedido.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return hero.images.map((_, index) => ({ foto: String(index) }));
}

// La URL pública es "/"; estas rutas son internas. Ojo: lo que se ve en "/" ES
// esta página (proxy.js reescribe), así que un noindex acá saca la home de Google.
// El canonical alcanza para que Google no indexe /inicio/N por separado.
export const metadata = {
  alternates: { canonical: "/" },
};

export default async function HomeVariant({ params }) {
  const { foto } = await params;
  const index = Number(foto);
  if (!Number.isInteger(index) || index < 0 || index >= hero.images.length) notFound();
  return <NaturalFlooringPage heroImageIndex={index} />;
}
