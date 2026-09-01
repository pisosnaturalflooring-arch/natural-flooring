"use client";

import Image from "next/image";
import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import CompareSlider from "./CompareSlider";
import { ExternalLink } from "./shared";

export default function BeforeAfterSection({ beforeAfter, whatsappHref }) {
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

      <CompareSlider
        before={{
          src: beforeAfter.before.image,
          alt: beforeAfter.before.alt,
          label: beforeAfter.before.label,
        }}
        after={{
          src: beforeAfter.after.image,
          alt: beforeAfter.after.alt,
          label: beforeAfter.after.label,
        }}
      />

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
