import ProductsShell from "../../components/natural-flooring/products/ProductsShell";

export const metadata = {
  title: "Productos — Natural Flooring",
  description:
    "Pisos de madera maciza, pre-finish, SPC y MDF, decks, revestimientos, escaleras, pérgolas, muelles, zócalos e insumos. Showrooms en San Fernando y Escobar.",
  alternates: { canonical: "/productos" },
};

export default function ProductsRoute() {
  return <ProductsShell categoryId={null} />;
}
