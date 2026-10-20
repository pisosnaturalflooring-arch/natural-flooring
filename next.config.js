/** @type {import('next').NextConfig} */

// Las fotos de /public no llevan hash en el nombre: un mes de caché con
// revalidación en segundo plano es seguro (si se reemplaza una foto, se ve en
// el próximo mes como mucho; para cambios urgentes conviene cambiarle el nombre).
const STATIC_ASSET_CACHE = "public, max-age=2592000, stale-while-revalidate=86400";

const nextConfig = {
  allowedDevOrigins: ["192.168.1.11", "192.168.0.*", "192.168.1.*", "10.0.0.*"],
  experimental: {
    // Agrupa el CSS según lo que usa cada ruta: con el modo por defecto, la hoja
    // de la home (136 KB sin comprimir) viajaba también a /productos.
    cssChunking: "graph",
  },
  images: {
    // AVIF primero (pesa ~20-30% menos que WebP) y WebP para los navegadores que no lo soportan.
    formats: ["image/avif", "image/webp"],
    // Las versiones optimizadas se guardan 30 días en vez de 4 horas.
    minimumCacheTTL: 2592000,
    // 75 es el valor por defecto; 60 se usa solo en la foto del hero, que es la
    // imagen principal de la home y la que más pesa en celulares.
    qualities: [60, 75],
  },
  async headers() {
    return [
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }] },
      { source: "/logo-natural-flooring.webp", headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }] },
      { source: "/og-image.jpg", headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }] },
    ];
  },
};

module.exports = nextConfig;
