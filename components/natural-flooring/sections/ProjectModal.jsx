"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../NaturalFlooringPage.module.css";

export default function ProjectModal({ project, onClose }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const wrapRef = useRef(null);

  const base = project && !project.placeholder
    ? (project.images ?? [{ src: project.image, alt: project.alt }])
    : [];
  const gallery = project?.before
    ? [...base, { src: project.before, alt: "Estado anterior", label: "ANTES" }]
    : base;
  const total = gallery.length;

  const scrollToIdx = useCallback((idx) => {
    const el = wrapRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.offsetWidth, behavior: "smooth" });
  }, []);

  const prev = useCallback(() => scrollToIdx((activeIdx - 1 + total) % total), [activeIdx, total, scrollToIdx]);
  const next = useCallback(() => scrollToIdx((activeIdx + 1) % total), [activeIdx, total, scrollToIdx]);

  // Derive active index from scroll position
  const handleScroll = useCallback(() => {
    const el = wrapRef.current;
    if (!el || el.offsetWidth === 0) return;
    setActiveIdx(Math.round(el.scrollLeft / el.offsetWidth));
  }, []);

  // Reset when a new project opens
  useEffect(() => {
    setActiveIdx(0);
    const el = wrapRef.current;
    if (el) el.scrollLeft = 0;
  }, [project]);

  useEffect(() => {
    if (!project || project.placeholder) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, prev, next, onClose]);

  if (!project || project.placeholder) return null;

  return (
    <div
      className={styles.modalBackdrop}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="presentation"
    >
      <div
        className={styles.modalDialog}
        role="dialog"
        aria-modal="true"
        aria-label={project.name || project.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        <div className={styles.modalBody}>
          <div className={styles.modalLeft}>

            {/* imageViewer wraps the scroll strip + overlaid arrows */}
            <div className={styles.modalImageViewer}>
              <div
                ref={wrapRef}
                className={styles.modalMainImageWrap}
                onScroll={handleScroll}
              >
                {gallery.map((img, i) => (
                  <div key={img.src + i} className={styles.modalImageSlide}>
                    <Image
                      fill
                      src={img.src}
                      alt={img.alt || ""}
                      className={styles.modalMainImage}
                      sizes="(max-width: 768px) 90vw, 60vw"
                      priority={i === 0}
                      draggable={false}
                    />
                    {img.label && (
                      <span className={styles.modalImageLabel}>{img.label}</span>
                    )}
                  </div>
                ))}
              </div>

              {total > 1 && (
                <>
                  <button type="button" className={`${styles.modalArrow} ${styles.modalArrowPrev}`} onClick={prev} aria-label="Anterior">‹</button>
                  <button type="button" className={`${styles.modalArrow} ${styles.modalArrowNext}`} onClick={next} aria-label="Siguiente">›</button>
                  <span className={styles.modalCounter}>{activeIdx + 1} / {total}</span>
                </>
              )}
            </div>

            {total > 1 && (
              <div className={styles.modalThumbs}>
                {gallery.map((img, i) => (
                  <button
                    key={img.src + i}
                    type="button"
                    className={`${styles.modalThumb} ${i === activeIdx ? styles.modalThumbActive : ""}`}
                    onClick={() => scrollToIdx(i)}
                    aria-label={img.alt || `Imagen ${i + 1}`}
                  >
                    <Image fill src={img.src} alt={img.alt || ""} className={styles.modalThumbImage} sizes="80px" />
                    {img.label && <span className={styles.modalThumbLabel}>{img.label}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.modalRight}>
            <p className={styles.modalCategory}>{project.group || project.category}</p>
            <h2 className={styles.modalTitle}>{project.name || project.title}</h2>

            {project.materials && (
              <div className={styles.modalMaterials}>{project.materials}</div>
            )}

            {project.description && (
              <p className={styles.modalDescription}>{project.description}</p>
            )}

            {project.before && (
              <p className={styles.modalBeforeHint}>
                Deslizá las imágenes para ver el estado original →
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
