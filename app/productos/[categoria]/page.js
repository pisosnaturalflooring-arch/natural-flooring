import { notFound } from "next/navigation";
import ProductsShell from "../../../components/natural-flooring/products/ProductsShell";
import { productCategories } from "../../../components/natural-flooring/productsCatalog";

// Solo existen las categorías del catálogo; cualquier otra URL da 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return productCategories.map((category) => ({ categoria: category.id }));
}

export async function generateMetadata({ params }) {
  const { categoria } = await params;
  const category = productCategories.find((item) => item.id === categoria);
  if (!category) return {};
  return {
    title: `${category.title} — Productos — Natural Flooring`,
    description: category.intro,
    alternates: { canonical: `/productos/${category.id}` },
  };
}

export default async function ProductCategoryRoute({ params }) {
  const { categoria } = await params;
  if (!productCategories.some((item) => item.id === categoria)) notFound();
  return <ProductsShell categoryId={categoria} />;
}
