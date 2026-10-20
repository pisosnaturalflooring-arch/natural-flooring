"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renderiza `children` recién cuando el lugar se acerca a la pantalla. Junto
 * con un componente cargado con next/dynamic, el JS de esa sección no se baja
 * hasta que hace falta. Mientras tanto ocupa `minHeight` para que el resto de
 * la página no salte, y conserva el `id` para que las anclas del menú funcionen.
 */
export default function LazyOnView({ id, minHeight, rootMargin = "800px 0px", children }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return undefined;
    const element = ref.current;
    // Si entran directo a la sección (#herramientas), se carga ya.
    if (id && window.location.hash === `#${id}`) {
      setShow(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [id, rootMargin, show]);

  return show ? children : <div ref={ref} id={id} style={{ minHeight }} aria-hidden="true" />;
}
