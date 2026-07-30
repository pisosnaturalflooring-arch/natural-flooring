const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://naturalflooring.com.ar";

// El sitio es una landing de una sola ruta: las secciones son anclas dentro de
// la misma página, y los anclas no van en el sitemap.
export default function sitemap() {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
