# Entrega de imágenes

`npm run dev` y `npm run build` preparan automáticamente las fotos locales.
También se puede ejecutar `npm run prepare:images` después de cambiar una foto.
No se descarga contenido externo ni se transforma una imagen durante la visita.
La preparación forma parte del comando; también funciona con `pnpm run build`
sin depender de que el entorno habilite los hooks `prebuild`.

- `scripts/prepare-images.mjs` busca las fotos referenciadas en `components/`
  y `app/`, incluyendo la selección de `hero-images.json`.
- `public/_images/` contiene las versiones WebP a distintos anchos. Es generado
  e ignorado por Git; el build de Vercel lo incluye como archivos estáticos.
- `lib/image-manifest.json` registra dimensiones y nombres de contenido. Se
  versiona junto con los originales para que el loader y el hero puedan usarlo.
- `next/image` conserva los tamaños adaptables y la carga diferida. Su loader
  selecciona el archivo preparado, sin usar `/_next/image`.
- El hero incluye AVIF con WebP de respaldo, prioridad alta y una vista previa
  embebida de la misma foto. La selección móvil/escritorio la hace `<picture>`;
  no se descargan las dos fotos.

Se mantienen los originales y sus encuadres. No se agrandan fuentes pequeñas.
WebP usa calidad 75, o 85 en el hero. El AVIF del hero usa la conversión de
calidad de Next (85 × 50/80 = 53). Los nombres dependen del contenido y la receta,
permitiendo caché inmutable de un año sin dejar fotos viejas al reemplazarlas.

Al cambiar fotos, ejecutar la preparación y versionar el manifiesto actualizado.
Los archivos generados se reutilizan en builds posteriores y los conjuntos
obsoletos se eliminan del directorio generado.

Verificación: `npm test` valida archivos reales, transparencia, orientación EXIF,
límites de resolución, ambos formatos del hero y reutilización del caché.
