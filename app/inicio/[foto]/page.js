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

export const metadata = {
  // La URL pública es "/"; estas rutas son internas.
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

export default async function HomeVariant({ params }) {
  const { foto } = await params;
  const index = Number(foto);
  if (!Number.isInteger(index) || index < 0 || index >= hero.images.length) notFound();
  return <NaturalFlooringPage heroImageIndex={index} />;
}
