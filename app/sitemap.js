import { productCategories, productTypes } from "../components/natural-flooring/productsCatalog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://naturalflooring.com.ar";

// La home y el catálogo de productos. Las secciones son anclas dentro de cada
// página, y los anclas no van en el sitemap.
export default function sitemap() {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/productos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...productCategories.map((category) => ({
      url: `${siteUrl}/productos/${category.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    })),
    ...productTypes().map((type) => ({
      url: `${siteUrl}${type.detailHref}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    })),
    ...productTypes()
      .filter((type) => type.hasLine)
      .flatMap((type) => type.products)
      .map((product) => ({
        url: `${siteUrl}${product.detailHref}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      })),
  ];
}
