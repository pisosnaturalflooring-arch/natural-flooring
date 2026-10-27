"use client";

import { useEffect, useState } from "react";
import HeroSection from "./sections/HeroSection";
import styles from "./HeroPreview.module.css";

const variants = [
  { id: "editorial", label: "Editorial", description: "Una base clara y una foto amplia, con sus colores naturales." },
  { id: "panoramico", label: "Panorámico", description: "Texto compacto arriba y una fotografía de lado a lado." },
  { id: "inmersivo", label: "Inmersivo", description: "La foto ocupa todo el inicio, con el texto sobre la imagen." },
];

export default function HeroPreview({ hero }) {
  const [variant, setVariant] = useState("inmersivo");
  const [imageIndex, setImageIndex] = useState(0);
  const [alignment, setAlignment] = useState("center");

  useEffect(() => {
    const restore = () => {
      const params = new URLSearchParams(window.location.search);
      const selected = params.get("variante");
      const photo = params.get("foto");
      setVariant(variants.some((item) => item.id === selected) ? selected : "inmersivo");
      setImageIndex(photo !== null && /^\d+$/.test(photo) && Number(photo) < hero.images.length ? Number(photo) : 0);
      setAlignment(params.get("texto") === "left" ? "left" : "center");
    };
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [hero.images.length]);

  function select(nextVariant, nextImage, nextAlignment = alignment) {
    setVariant(nextVariant);
    setImageIndex(nextImage);
    setAlignment(nextAlignment);
    const url = new URL(window.location.href);
    url.searchParams.set("variante", nextVariant);
    url.searchParams.set("foto", String(nextImage));
    url.searchParams.set("texto", nextAlignment);
    window.history.replaceState(null, "", url);
  }

  return (
    <div className={styles.preview} style={{ "--preview-placement-height": variant === "inmersivo" ? "46px" : "0px" }}>
      <aside className={styles.controls} aria-label="Comparar propuestas de inicio">
        <div className={styles.intro}>
          <strong>Propuestas de inicio</strong>
          <span>Misma foto, tres miradas.</span>
        </div>
        <div className={styles.variants} role="group" aria-label="Diseño del inicio">
          {variants.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={variant === item.id}
              onClick={() => select(item.id, imageIndex)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {variant === "inmersivo" && (
          <label className={styles.placement}>
            Texto
            <select aria-label="Ubicación del texto" value={alignment} onChange={(event) => select(variant, imageIndex, event.target.value)}>
              <option value="center">Centrado</option>
              <option value="left">Lateral</option>
            </select>
          </label>
        )}
        <div className={styles.photos}>
          <button type="button" aria-label="Foto anterior" onClick={() => select(variant, (imageIndex + hero.images.length - 1) % hero.images.length)}>←</button>
          <span aria-live="polite">Foto {imageIndex + 1} de {hero.images.length}</span>
          <button type="button" aria-label="Foto siguiente" onClick={() => select(variant, (imageIndex + 1) % hero.images.length)}>→</button>
        </div>
      </aside>
      <p className={styles.description} aria-live="polite">{variants.find((item) => item.id === variant).description}</p>
      <HeroSection hero={hero} imageIndex={imageIndex} variant={variant} alignment={alignment} />
    </div>
  );
}
