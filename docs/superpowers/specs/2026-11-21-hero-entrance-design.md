# Pantalla de carga y entrada del hero

## Por qué

Antes, si la foto del hero tardaba, el logo del header bajaba al hero, latía y
volvía a la barra. Ir y volver no gustó: el logo parecía suelto y el resto del
hero aparecía por su lado. Se decidió una pantalla de carga que tape toda la
página, header incluido, y que al irse deje el hero ya armado.

## Objetivos

- Una pantalla de marca durante la carga y una sola salida coreografiada.
- Se ve en cada carga, también al recargar para ver otra foto.
- Que nada quede oculto si algo falla.

## Fuera de alcance

- Mover el logo del header: queda siempre en su lugar.
- Animar otras secciones.

## Opciones consideradas

- **A. Pantalla completa (elegida).** Al principio se descartó porque tapaba
  contenido que ya estaba listo. Se eligió después de probar B: con conexión
  lenta, el viaje del logo hacia el hero y de vuelta se veía raro.
- **B. Entrada coreografiada con el logo viajando al hero.** Se implementó y se
  descartó.
- **C. Mínima, sin logo.** Se descartó porque pierde el momento de marca.

## Secuencia

1. **Carga.** Una capa del verde del header (#252e18) tapa toda la pantalla, por
   encima del header y de los botones flotantes. El fondo lleva una espiga
   (parquet en chevron) en líneas finas color salvia. La espiga se desvanece
   hacia el centro, para dejar limpio el logo, y hay un leve viñeteado en los
   bordes. La capa contiene:
   - el logo;
   - "Natural Flooring";
   - una línea fina con un tramo que la recorre de lado a lado, a ritmo
     constante (progreso indeterminado).

   El contenido entra con fundido, `translateY(8px)` y `scale(0.97)`, en 500 ms
   con ease-out.
2. **Foto lista y decodificada,** y pasaron al menos 600 ms (para que el logo se
   registre aunque la foto esté en caché):
   - el contenido de la capa se va subiendo 16 px y desvaneciéndose;
   - la capa se levanta como una cortina: `clip-path inset(0 0 100% 0)`, en
     900 ms con `cubic-bezier(0.77, 0, 0.175, 1)` y 150 ms de demora;
   - debajo, la foto ya está y se asienta de `scale 1.08` a `1`, en 1600 ms con
     ease-out;
   - los degradés de lectura entran con la foto;
   - el texto entra a los 450 ms en orden de lectura, con 70 ms entre pasos
     (`translateY(16px)` y fundido, en 600 ms);
   - la etiqueta de la foto entra al final.
3. A los 1100 ms la capa deja de existir (`data-loader-gone`).

## Fallas

- **Sin JS:** no hay capa ni nada oculto.
- **Tope de 4 s:** si la foto no llegó, la capa se levanta igual y la foto entra
  con un fundido cuando llega.
- **Foto rota (o en caché pero rota):** la capa se levanta sobre el fondo verde.
- **Error en el script de la figura:** se muestra todo.

## Movimiento reducido

- La capa se desvanece en vez de subir.
- La línea queda quieta.
- No hay desplazamientos ni zoom.

## Técnica

- **Estados:** atributos en la sección (`data-entrance`, `data-lift`,
  `data-photo-in`, `data-text-in`, `data-loader-gone`).
- **Animación:** transiciones de CSS.
- **Scripts:** dos en línea, autónomos (`lib/heroFade.mjs`): uno al principio de
  la sección y otro en la figura.
- **Apilamiento:** mientras está la capa, la sección sube a `z-index: 9000` con
  fondo transparente. El fondo propio está en la franja del header y la taparía
  durante la subida.
