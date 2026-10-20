import { notFound } from "next/navigation";
import ProductsShell from "../../../../components/natural-flooring/products/ProductsShell";
import { productTypes } from "../../../../components/natural-flooring/productsCatalog";

// Solo existen los tipos del catálogo; cualquier otra URL da 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return productTypes().map((type) => ({ categoria: type.category.id, tipo: type.slug }));
}

function findType(categoria, tipo) {
  return productTypes(categoria).find((type) => type.slug === tipo) ?? null;
}

export async function generateMetadata({ params }) {
  const { categoria, tipo } = await params;
  const type = findType(categoria, tipo);
  if (!type) return {};
  return {
    title: `${type.title} — Natural Flooring`,
    description: type.description,
    alternates: { canonical: type.detailHref },
  };
}

export default async function ProductTypeRoute({ params }) {
  const { categoria, tipo } = await params;
  if (!findType(categoria, tipo)) notFound();
  return <ProductsShell categoryId={categoria} typeSlug={tipo} />;
}
