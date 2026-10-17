"use client";

import Image from "next/image";
import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { ExternalLink } from "./shared";

export default function StaircaseSection({ staircase, whatsappHref }) {
  return (
    <section className={styles.staircaseSection} id="escaleras">
      <div className={styles.staircaseImageWrap}>
        <Image
          fill
          src={staircase.image}
          alt={staircase.alt}
          className={styles.staircaseImage}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className={styles.staircaseContent}>
        <Reveal direction="right">
          <p className={styles.sectionLabel}>Especialidad</p>
          <h2 className={styles.sectionTitle}>
            RENOVÁ TU ESCALERA
          </h2>
          <p className={styles.staircaseDescription}>{staircase.description}</p>
        </Reveal>

        <div className={styles.staircaseFeatures}>
          {staircase.features.map((feature, index) => (
            <Reveal key={feature} direction="right" delay={0.06 * index} className={styles.staircaseFeature}>
              {feature}
            </Reveal>
          ))}
        </div>

        <ExternalLink href={whatsappHref} className={styles.staircaseButton}>
          Consultar por escaleras →
        </ExternalLink>
      </div>
    </section>
  );
}
