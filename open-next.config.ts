import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Todas las páginas se prerenderizan en el build y ninguna revalida: alcanza con
// servirlas desde los assets estáticos, sin R2 ni KV que configurar en la cuenta.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
