"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { ExternalLink } from "./shared";

export default function BeforeAfterSection({ beforeAfter, whatsappHref }) {
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
    if (!el) return;
    const onTouchMove = (e) => {
      e.preventDefault();
      setPos(calcPos(e.touches[0].clientX));
    };
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, []);

  return (
    <section className={styles.beforeAfterSection} id="antes-despues">
      <div className={styles.beforeAfterHead}>
        <Reveal>
          <p className={styles.sectionLabelInverse}>Transformación real</p>
          <h2 className={styles.sectionTitleInverse}>
            ANTES &
            <br />
            DESPUÉS
          </h2>
        </Reveal>
        <Reveal delay={0.12} className={styles.materialInfo}>
          <div className={styles.materialLabel}>Material utilizado</div>
          <div className={styles.materialValue}>{beforeAfter.material}</div>
        </Reveal>
      </div>

      <div
        ref={containerRef}
        className={styles.sliderWrap}
        onMouseDown={() => { dragging.current = true; }}
        onMouseMove={(e) => { if (dragging.current) setPos(calcPos(e.clientX)); }}
        onMouseUp={() => { dragging.current = false; }}
        onMouseLeave={() => { dragging.current = false; }}
      >
        {/* Antes — base layer (full width, left side) */}
        <div className={styles.sliderBefore}>
          <Image
            fill
            src={beforeAfter.before.image}
            alt={beforeAfter.before.alt}
            className={styles.sliderImage}
            sizes="(max-width: 768px) 100vw, 900px"
            draggable={false}
          />
        </div>

        {/* Después — revealed from right as you drag */}
        <div
          className={styles.sliderAfter}
          style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
        >
          <Image
            fill
            src={beforeAfter.after.image}
            alt={beforeAfter.after.alt}
            className={styles.sliderImage}
            sizes="(max-width: 768px) 100vw, 900px"
            draggable={false}
          />
        </div>

        {/* Labels */}
        <div className={`${styles.sliderLabel} ${styles.sliderLabelBefore}`}>
          {beforeAfter.before.label}
        </div>
        <div className={`${styles.sliderLabel} ${styles.sliderLabelAfter}`}>
          {beforeAfter.after.label}
        </div>

        {/* Drag handle */}
        <div className={styles.sliderLine} style={{ left: `${pos}%` }}>
          <div className={styles.sliderHandleBtn}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>

      <Reveal className={styles.processBanner}>
        <Image
          fill
          src={beforeAfter.detail.image}
          alt={beforeAfter.detail.alt}
          className={styles.processImage}
          sizes="100vw"
        />
        <div className={styles.processOverlay}>
          <div className={styles.processTitle}>{beforeAfter.detail.title}</div>
          <div className={styles.processSubtitle}>{beforeAfter.detail.subtitle}</div>
        </div>
      </Reveal>

      <Reveal delay={0.1} className={styles.inlineCta}>
        <div>
          <div className={styles.inlineCtaTitle}>¿TENÉS UN LOCAL O GIMNASIO?</div>
          <p className={styles.inlineCtaText}>
            Trabajamos con materiales de alto tránsito para espacios comerciales. Presupuesto sin
            cargo.
          </p>
        </div>
        <ExternalLink href={whatsappHref} className={styles.inlineCtaButton}>
          Consultar ahora →
        </ExternalLink>
      </Reveal>
    </section>
  );
}
