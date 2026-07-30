# Análisis de la planilla de productos del local

Fecha: 2026-07-30
Fuente: Google Sheets `1I1F5o2GBFLfYGC9jFU8sGfHvrWOYbs0hjKrB_WdhBxA` (la edita el local)
Estado: análisis previo. No se implementó nada todavía.

## Qué es realmente la planilla

No es un catálogo web: es un **export de ERP / control de stock**. 130 filas.

Columnas: `Id`, `Nombre`, `Tipo` (Producto/Servicio), `Tipo de Producto/Servicio`,
`Código`, `Local San Fernando`, `Matheu, Escobar.`, `Stock Total`, `IVA Compras`,
`IVA Ventas`, `Lista 1` (precio), `Descripción`, `Activo`, `Mostrar en Ventas`,
`Mostrar en Compras`, `Imagen`.

Esto condiciona todo lo que sigue.

## Hallazgos que bloquean o cambian el plan

### 1. El precio no existe (todavía)

`Lista 1` está en `0` en ~125 de 130 filas. Sólo tienen precio cargado 6 filas,
todas de piso de viraró y urundel (ej. `PISO DE VIRARO 1" x 6"` = 152000).

**Consecuencia:** cualquier idea que dependa de mostrar precios está muerta hoy.
Hay que decidir con el cliente si van a cargar precios o si el sitio sigue con
"consultanos".

### 2. El stock no es publicable

Hay stock negativo en todo el archivo: `-196,8` en zócalo de eucalipto, `-158,6`
en zócalo kiri, `-99` en piso roble veteado, `-35` en zócalo PVC. Es un sistema
con desajustes de inventario normales en un local, pero significa que
**no podemos mostrar disponibilidad**. Publicar "sin stock" sobre un producto que
sí tienen es peor que no decir nada.

### 3. La columna `Imagen` dice `No` en las 130 filas

Cero fotos. Hoy el sitio muestra 7 productos, todos con foto propia
(`maintenanceProducts` en `data.js`).

**Consecuencia directa sobre la idea de "mejorar cómo mostramos los productos":**
pasar de 7 items con foto a 130 sin foto empeora la sección, no la mejora.
Esta idea está bloqueada por producción de fotos, no por código.

### 4. Hay filas que no son catálogo y no pueden salir a la web

- `Recargo 20% 6 cuotas sin interes` — la descripción tiene **nombre y apellido de
  una clienta real**. Es un dato personal, no puede publicarse.
- `Flete Auto ZONA 2`, `Flete grande zona 1`, `Flete grande zona 2` — logística interna.
- `Diluyente para lacas poliuretanicas` — insumo de obra, no de venta al público.
- `Manta negra bajo piso`, `Clavos 14/40` — insumos de colocación.

Cualquier sincronización tiene que filtrar, no volcar la planilla entera.

### 5. Las categorías están sucias

`Tipo de Producto/Servicio` está vacío en ~12 filas, varias de ellas importantes
(`Caja piso SPC guatambu`, `Piso nogal 4mm`, `Silicona uso profesional`,
`k-645 x 10kg`). Además hay duplicados por tipeo:

- `Clips/grampas` vs `Grampas`
- `Pisos SPC (plastico)` vs `Pisos SPC (Encargo)` vs filas SPC sin categoría
- Acentos inconsistentes (`Zócalos PVC` / `Zocalos pre-pintados`)

Se puede normalizar del lado nuestro, pero conviene que lo arreglen ellos en la
planilla: si no, cada edición futura vuelve a romperlo.

## Hallazgos comerciales (esto es lo que más valor tiene)

### A. Falta el piso flotante de melamina en todo el sitio

Es **la línea de piso con más stock real del local**:

| Producto | Stock |
|---|---|
| Caja piso Fresno 7mm | 67 |
| Caja piso Okume 7mm | 26 |
| Caja piso Roble blanco 7mm | 4 |
| + Haya, Roble veteado, Parquet 8mm, Abeto 8mm | (varios) |

Y en el sitio:
- **No hay card de categoría** (hoy son: Madera Natural, Piso Vinílico, Deck WPC, Escaleras).
- **No existe como material en el asesor** (`recommendationEngine.mjs` tiene lapacho,
  viraró, petiribí, guatambú, kiri, WPC, SPC, vinílico).
- Sólo aparece como palabra suelta en textos de SEO y en descripciones de obras.

Es la brecha más grande entre lo que venden y lo que el sitio muestra.

### B. El Kiri está mal modelado en el asesor

El asesor presenta Kiri como **revestimiento de pared**. En la planilla, Kiri
aparece únicamente como **zócalo** (`Zócalos madera kiri`, tres medidas).

Lo que sí venden como revestimiento de pared es
`Revestimiento WPC interior 24mm x 16.8cm x 2.70m` (categoría `Wall panel WPC`),
que no está en el asesor.

Esto explica el bug que parcheamos hoy: "revestimiento / pared" tiene un solo
material posible (Kiri), y Kiri es sólo interior seco, así que en exterior el
asesor recomendaba algo que no corresponde. **La solución de fondo es cargar el
wall panel WPC como material de `covering`**, no el aviso que puse hoy.

### C. Vinílico vs SPC

El sitio tiene "Piso Vinílico" como categoría propia. En la planilla no hay
vinílico en rollo ni en manta: lo más cercano es SPC (`Pisos SPC (plastico)`,
`Pisos SPC (Encargo)`). Hay que confirmar con el cliente si "vinílico" en su
lenguaje comercial = SPC, o si es una línea que dejaron de traer.

### D. Deck WPC: venden accesorios pero no la tabla

Están `Tornillos p deck WPC` y `Clips deck WPC x 250u`, pero **no hay tabla de
deck WPC** en la planilla. Sí hay deck de lapacho (`DECK LAPACHO 1x3"`, `1x4"`).
El sitio muestra Deck WPC como categoría destacada. Confirmar si es por encargo.

## Las tres ideas que planteaste, filtradas

### "Combinar los productos con los tipos de piso del asesor" — SÍ, es la mejor base

La planilla lo permite sin precio ni stock ni fotos, usando sólo
`Tipo de Producto/Servicio` + `Descripción`. El mapeo sale casi solo:

| Material del asesor | Productos asociados en la planilla |
|---|---|
| Madera maciza (lapacho/viraró/urundel) | Sellador K-403/404, Laca K-4045, Hidrolaca K-4035, Varathane, adhesivo K-1004/K-300, zócalo madera, limpiador K-412, Detergente Neutro |
| SPC | Adhesivo K-645, manta bajo piso, zócalo PVC, terminaciones aluminio, silicona |
| Flotante melamina | Manta bajo piso, zócalo pre-pintado MDF, terminaciones aluminio, silicona |
| Deck (lapacho / WPC) | Clips deck madera, clips deck WPC, tornillos, WPC Life, WPC Cleaner |
| Escalera | Escalón incienso/petiribí, descanso, hidrolaqueado, mano de obra |
| Revestimiento | Wall panel WPC, adhesivo de contacto K-2024 |

Valor real: quien termina el asesor y ve "te conviene SPC" hoy no se entera de que
en el local tiene el adhesivo, la manta y el zócalo. Es venta cruzada directa.

### "Mejorar cómo mostramos los productos" — SÍ, pero está bloqueado por fotos

No es un problema de diseño ni de datos: son 130 productos con 0 imágenes. Antes
de tocar código hay que decidir con el cliente qué subconjunto merece foto.
Mi sugerencia: **no escalar a 130**. Elegir ~20-25 productos "de mostrador" y
sacarles foto. El resto no aporta a un sitio de servicios.

### "Zona donde el usuario indica qué piso tiene y filtramos productos" — SÍ, la mejor de las tres

Es la idea más fuerte porque:
- No necesita fotos (puede resolverse como lista corta o fichas de texto).
- No necesita precio ni stock.
- Usa el único campo confiable de la planilla (categoría + descripción).
- Reutiliza el asesor que ya existe en vez de duplicar lógica.

Es, en el fondo, la idea A dada vuelta: mismo mapeo, entrada distinta (el usuario
ya tiene piso y quiere mantenerlo, en vez de estar por comprarlo).

## Lo que agrego yo

### 1. La planilla no puede ser la fuente directa

Es un ERP con datos internos y personales. Propuesta: que agreguen una columna
**`Publicar en web`** (Si/No) que ellos controlan. Nosotros sincronizamos sólo
esas filas y sólo las columnas `Nombre`, `Tipo de Producto/Servicio`,
`Descripción`. Nunca stock, nunca IVA, nunca `Lista 1` hasta que lo decidan.

Ventaja: el cliente sigue trabajando en su planilla de siempre y decide qué sale,
sin que nadie tenga que pedirnos un cambio.

### 2. Sincronización, no lectura en vivo

Como no sabemos con qué frecuencia la editan y el sitio es estático (Next.js
prerenderizado), lo razonable es un script que baja la planilla, filtra, normaliza
categorías y escribe un JSON al repo. Se corre a mano o en el build. Sin API keys
en el cliente, sin riesgo de que una edición rompa el sitio en vivo.

### 3. Preguntas para el cliente en la reunión

1. ¿Van a cargar precios en `Lista 1`, o el sitio sigue con "consultanos"?
2. ¿"Vinílico" en el sitio = SPC, o es otra línea?
3. ¿Deck WPC se sigue vendiendo? (hay accesorios pero no la tabla)
4. ¿Por qué el flotante de melamina no está en el sitio si es lo que más stock tiene?
5. ¿Quién edita la planilla y con qué frecuencia? (define si vale automatizar el sync)
6. ¿Se bancan sacar fotos de ~20 productos de mostrador?

## Orden sugerido

1. Cerrar las preguntas de arriba (sin eso, todo lo demás es adivinar).
2. Sumar **flotante melamina** al asesor y a las categorías. Es el hueco más caro.
3. Corregir **Kiri → zócalo** y cargar **wall panel WPC** como revestimiento.
   Reemplaza el parche de hoy en `createCaveat`.
4. Mapeo material → productos, y mostrarlo al final del asesor.
5. Recién ahí, la zona de "¿qué piso tenés?" reusando ese mapeo.
6. Fotos + rediseño de la sección de productos, cuando haya fotos.
