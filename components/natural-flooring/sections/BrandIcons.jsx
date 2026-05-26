"use client";

import styles from "../NaturalFlooringPage.module.css";

/**
 * Wrapper visual del manual de marca (página 11-13):
 * círculo blanco con borde verde brillante #60AE1B y el ícono negro centrado.
 */
export function BrandIconCircle({ children, size = 64, className }) {
  return (
    <span
      className={`${styles.brandIconCircle}${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  );
}

const SVG_PROPS = {
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: "55%",
  height: "55%",
  "aria-hidden": true,
};

// — Set de íconos del manual —

export function StairsBrandIcon() {
  return (
    <svg {...SVG_PROPS}>
      {/* Escalera isométrica con 4 escalones */}
      <path d="M4 26 L4 22 L10 22 L10 18 L16 18 L16 14 L22 14 L22 10 L28 10 L28 26 Z" fill="currentColor" stroke="none" />
      <path d="M4 26 L28 26" />
    </svg>
  );
}

export function SlatsBrandIcon() {
  return (
    <svg {...SVG_PROPS}>
      {/* Revestimientos verticales tipo deck panelado */}
      {[5, 9, 13, 17, 21, 25].map((x) => (
        <rect key={x} x={x - 1} y="5" width="2.2" height="22" fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}

export function FloorTilesBrandIcon() {
  return (
    <svg {...SVG_PROPS}>
      {/* Tablones de piso en isométrico (rombo) */}
      <path d="M16 8 L26 14 L16 20 L6 14 Z" fill="currentColor" stroke="none" />
      <path d="M16 14 L26 20 L16 26 L6 20 Z" fill="currentColor" stroke="none" opacity="0.85" />
    </svg>
  );
}

export function HomePinBrandIcon() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M16 4 C 22 4, 26 8, 26 14 C 26 20, 16 28, 16 28 C 16 28, 6 20, 6 14 C 6 8, 10 4, 16 4 Z" />
      <path d="M12 16 L12 12 L16 9 L20 12 L20 16 Z" fill="currentColor" stroke="currentColor" />
    </svg>
  );
}

export function LocationBrandIcon() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M16 4 C 21 4, 25 8, 25 13 C 25 19, 16 28, 16 28 C 16 28, 7 19, 7 13 C 7 8, 11 4, 16 4 Z" />
      <circle cx="16" cy="13" r="3" />
    </svg>
  );
}

export function CatalogBrandIcon() {
  return (
    <svg {...SVG_PROPS}>
      {/* Libro abierto */}
      <path d="M4 8 L4 24 L15 22 L15 6 Z" />
      <path d="M28 8 L28 24 L17 22 L17 6 Z" />
      <path d="M15 6 L15 22" />
      {/* Item destacado tipo bullet */}
      <rect x="19" y="11" width="6" height="2" />
      <rect x="19" y="15" width="6" height="2" />
      <rect x="19" y="19" width="4" height="2" />
    </svg>
  );
}

export function ContactPersonBrandIcon() {
  return (
    <svg {...SVG_PROPS}>
      <circle cx="16" cy="16" r="12" />
      <circle cx="16" cy="13" r="3.5" fill="currentColor" stroke="none" />
      <path d="M9 24 C 10 19, 22 19, 23 24" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ClockBrandIcon() {
  return (
    <svg {...SVG_PROPS}>
      <circle cx="16" cy="16" r="11" />
      <path d="M16 9 L16 16 L21 19" />
      <path d="M22 6 L26 8 L24 12" />
    </svg>
  );
}
