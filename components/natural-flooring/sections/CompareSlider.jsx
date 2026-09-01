"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "../NaturalFlooringPage.module.css";

/**
 * Comparador de arrastre entre dos imagenes.
 *
 * Estaba embebido en BeforeAfterSection; se extrajo porque el visualizador
 * necesita el mismo gesto para comparar la foto original con el render.
 *
 * El render llega como data URL, y next/image no puede optimizar esas: se
 * detecta el prefijo y se pide unoptimized en vez de exigirselo al que llama.
 */
export default function CompareSlider({ before, after, className, style }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const calcPos = (clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 50;
    return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const onTouchMove = (e) => {
      e.preventDefault();
      setPos(calcPos(e.touches[0].clientX));
    };
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, []);

  // Con el teclado la barra tambien se mueve: es el unico modo sin puntero.
  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
  };

  const capa = (img, extraClass, style) => (
    <div className={extraClass} style={style}>
      <Image
        fill
        src={img.src}
        alt={img.alt}
        className={styles.sliderImage}
        sizes="(max-width: 768px) 100vw, 900px"
        unoptimized={img.src.startsWith("data:")}
        draggable={false}
      />
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={className ? `${styles.sliderWrap} ${className}` : styles.sliderWrap}
      style={style}
      onMouseDown={() => {
        dragging.current = true;
      }}
      onMouseMove={(e) => {
        if (dragging.current) setPos(calcPos(e.clientX));
      }}
      onMouseUp={() => {
        dragging.current = false;
      }}
      onMouseLeave={() => {
        dragging.current = false;
      }}
    >
      {capa(before, styles.sliderBefore)}
      {capa(after, styles.sliderAfter, { clipPath: `inset(0 0 0 ${pos}%)` })}

      <div className={`${styles.sliderLabel} ${styles.sliderLabelBefore}`}>{before.label}</div>
      <div className={`${styles.sliderLabel} ${styles.sliderLabelAfter}`}>{after.label}</div>

      <div className={styles.sliderLine} style={{ left: `${pos}%` }}>
        <button
          type="button"
          className={styles.sliderHandleBtn}
          onKeyDown={onKeyDown}
          aria-label={`Comparar ${before.label} y ${after.label}`}
          aria-valuenow={Math.round(pos)}
          aria-valuemin={0}
          aria-valuemax={100}
          role="slider"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
