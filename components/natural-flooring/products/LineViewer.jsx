"use client";

import Image from "next/image";
import { useState } from "react";
import ConsultButton from "../sections/ConsultButton";
import styles from "./LineViewer.module.css";

/** Miniatura de un color/especie. Sin foto: un cuadrito con un ícono de tabla, para que igual se pueda elegir. */
function SwatchFace({ product }) {
  return product.photo ? (
    <span className={product.photo.fit === "contain" ? styles.swatchPhotoPackshot : styles.swatchPhoto}>
      <Image
        src={product.photo.src}
        alt=""
        fill
        sizes="88px"
        className={product.photo.fit === "contain" ? styles.imageContain : styles.image}
      />
    </span>
  ) : (
    // Sin foto: un ícono de tabla (el nombre ya va abajo de la miniatura).
    <span className={styles.swatchText} aria-hidden="true">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="3" y="4" width="18" height="16" rx="1.5" />
        <path d="M3 9.5h18M3 14.5h18M10 4v5.5M15 9.5v5M8 14.5V20" />
      </svg>
    </span>
  );
}

/**
 * Tira de miniaturas. Con `onSelect` cambia el panel sin salir de la página
 * (detalle del tipo); sin `onSelect` cada miniatura es un link a la ficha del
 * producto (página de cada color).
 */
export function Swatches({ products, activeSlug, onSelect, label }) {
  return (
    <div className={styles.swatches} role={onSelect ? "listbox" : undefined} aria-label={label}>
      {products.map((product) => {
        const active = product.slug === activeSlug;
        const className = active ? styles.swatchActive : styles.swatch;
        const content = (
          <>
            <SwatchFace product={product} />
            <span className={styles.swatchName}>{product.name}</span>
          </>
        );
        return onSelect ? (
          <button
            key={product.id}
            type="button"
            role="option"
            aria-selected={active}
            className={className}
            onClick={() => onSelect(product.slug)}
          >
            {content}
          </button>
        ) : (
          <a key={product.id} href={product.detailHref} className={className} aria-current={active ? "page" : undefined}>
            {content}
          </a>
        );
      })}
    </div>
  );
}

/** Ficha de datos (código, espesor, caja…). */
export function Facts({ facts }) {
  if (!facts?.length) return null;
  return (
    <dl className={styles.facts}>
      {facts.map(([label, value]) => (
        <div key={label} className={styles.factRow}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * La línea de un tipo dentro de su detalle: un panel con el elegido (foto y
 * datos) y abajo el selector, para recorrer los colores sin abrir cada uno.
 */
export default function LineViewer({ products, label }) {
  const [activeSlug, setActiveSlug] = useState(products[0].slug);
  const product = products.find((item) => item.slug === activeSlug) ?? products[0];

  return (
    <div className={styles.viewer}>
      <div className={styles.panel} key={product.id}>
        <div className={styles.panelMedia}>
          {product.photo ? (
            <span className={product.photo.fit === "contain" ? styles.panelPhotoPackshot : styles.panelPhoto}>
              <Image
                src={product.photo.src}
                alt={product.photo.alt}
                fill
                sizes="(max-width: 899px) 100vw, 420px"
                className={product.photo.fit === "contain" ? styles.imageContain : styles.image}
              />
            </span>
          ) : (
            <span className={styles.panelNoPhoto}>
              <span className={styles.panelNoPhotoName}>{product.name}</span>
              <span className={styles.panelNoPhotoNote}>Pedinos una muestra o vení a verlo al showroom</span>
            </span>
          )}
        </div>
        <div className={styles.panelText}>
          <h3 className={styles.panelName}>{product.name}</h3>
          {product.about ? <p className={styles.panelAbout}>{product.about}</p> : null}
          <Facts facts={product.facts} />
          <div className={styles.panelActions}>
            <ConsultButton href={product.href}>Consultar por {product.name.toLowerCase()}</ConsultButton>
            <a href={product.detailHref} className={styles.panelLink}>
              Ver ficha <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

      <Swatches products={products} activeSlug={activeSlug} onSelect={setActiveSlug} label={label} />
    </div>
  );
}
