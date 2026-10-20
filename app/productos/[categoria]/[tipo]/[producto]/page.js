import { notFound } from "next/navigation";
import ProductsShell from "../../../../../components/natural-flooring/products/ProductsShell";
import { findProduct, productTypes } from "../../../../../components/natural-flooring/productsCatalog";

// Solo existen los productos del catálogo; cualquier otra URL da 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return productTypes()
    .filter((type) => type.hasLine)
    .flatMap((type) =>
      type.products.map((product) => ({ categoria: type.category.id, tipo: type.slug, producto: product.slug }))
    );
}

export async function generateMetadata({ params }) {
  const { categoria, tipo, producto } = await params;
  const found = findProduct(categoria, tipo, producto);
  if (!found) return {};
  const { type, product } = found;
  return {
    title: `${product.name} — ${type.title} — Natural Flooring`,
    description: product.about ?? `${type.title}: ${product.name}. ${product.detail ?? ""}`.trim(),
    alternates: { canonical: product.detailHref },
  };
}

export default async function ProductRoute({ params }) {
  const { categoria, tipo, producto } = await params;
  if (!findProduct(categoria, tipo, producto)) notFound();
  return <ProductsShell categoryId={categoria} typeSlug={tipo} productSlug={producto} />;
}
