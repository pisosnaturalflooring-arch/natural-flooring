"use client";

import { useEffect, useRef } from "react";

/**
 * Progreso del scroll a través de un elemento alto con una escena fija adentro:
 * 0 cuando su borde de arriba toca el de la ventana, 1 cuando su borde de abajo
 * toca el de abajo (lo mismo que `useScroll` de framer-motion con
 * offset ["start start", "end end"], sin cargar la librería).
 *
 * Llama a `onProgress` como máximo una vez por frame. No guarda estado: el que
 * llama decide qué escribir (una variable CSS) y cuándo re-renderizar.
 */
export function useScrollProgress(ref, onProgress) {
  const callback = useRef(onProgress);
  callback.current = onProgress;

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? -rect.top / travel : 0;
      callback.current(Math.min(Math.max(progress, 0), 1));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
}
