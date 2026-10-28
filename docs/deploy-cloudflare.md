# Deploy en Cloudflare Workers (plan gratis)

El sitio corre en Cloudflare Workers con el adaptador
[OpenNext](https://opennext.js.org/cloudflare). Todas las páginas se
prerenderizan en el build y se sirven desde los assets estáticos
(`open-next.config.ts`), así que cada visita gasta pocos milisegundos de CPU y
entra en el plan gratis (10 ms de CPU por request, Worker de hasta 3 MB
comprimido; hoy pesa ~1,5 MB).

## Conectar el repo (una sola vez)

1. Cloudflare → **Workers & Pages** → **Create** → **Import a repository** →
   elegir este repo de GitHub.
2. Nombre del Worker: `natural-flooring` (tiene que coincidir con `name` en
   `wrangler.jsonc`).
3. Build command: `pnpm exec opennextjs-cloudflare build`
4. Deploy command: `pnpm exec opennextjs-cloudflare deploy`
5. Variable de **build**: `NEXT_PUBLIC_SITE_URL` (el dominio final, con
   `https://`). Se incrusta en el HTML durante el build.
6. Variables de **runtime** (Settings → Variables and Secrets, como *Secret*):
   `RESEND_API_KEY`, `LEADS_FROM_EMAIL`, `LEADS_NOTIFY_EMAIL`,
   `OPENAI_API_KEY`, `OPENAI_VISION_MODEL`, `CITRIQS_API_URL`, `CITRIQS_CLAVE`.
   No hay base de datos: los leads solo quedan en el mail (y en Citriqs), así
   que sin `RESEND_API_KEY` y `LEADS_NOTIFY_EMAIL` el formulario da error.
7. Dominio: Settings → Domains & Routes → **Custom domain**.

Desde ahí, cada push a `main` deploya solo.

## Probar local en el runtime de Workers

```bash
pnpm run preview   # build de OpenNext + servidor en http://localhost:8787
```

Usar `preview` y no `wrangler dev` a secas: `preview` copia las páginas
prerenderizadas a los assets. Sin ese paso, cada visita renderiza la página de
nuevo y aparecen errores `StaticAssetsIncrementalCache: Failed to set`.

Las variables locales van en `.dev.vars` (ignorado por Git).

## Límites a tener en cuenta

- **Sin revalidación:** la caché es de solo lectura. Si una página empieza a
  usar `revalidate` o datos dinámicos, hay que pasar a una caché en R2.
- **El proxy (`proxy.js`) corre en Node.js:** OpenNext lo marca como
  experimental. Después de actualizar Next u OpenNext, probar `/` con
  `pnpm run preview` antes de subir.
- **El rate limit es por instancia** (ver `lib/rateLimit.mjs`).
