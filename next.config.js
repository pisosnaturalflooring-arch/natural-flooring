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
    // Archivos preparados durante el build: el visitante no espera al optimizador.
    loader: "custom",
    loaderFile: "./lib/image-loader.js",
    deviceSizes: [640, 960, 1440, 1920, 2560, 3840],
    imageSizes: [48, 96, 192, 320],
    // El hero usa 85 para conservar la textura de la madera; el resto mantiene 75.
    qualities: [60, 75, 85],
  },
  async headers() {
    return [
      { source: "/_images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }] },
      { source: "/logo-natural-flooring.webp", headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }] },
      { source: "/og-image.jpg", headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }] },
    ];
  },
};

module.exports = nextConfig;
