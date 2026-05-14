"use client";

import Image from "next/image";
import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";

export default function CommercialShowcaseSection({ commercialShowcase }) {
  return (
    <section className={styles.altSection} id="comercial">
      <div className={styles.commercialGrid}>
        <Reveal className={styles.commercialContent}>
          <p className={styles.sectionLabel}>Caso destacado</p>
          <h2 className={styles.sectionTitle}>{commercialShowcase.title}</h2>
          <p className={styles.commercialDescription}>{commercialShowcase.description}</p>
          <div className={styles.commercialFeatures}>
            {commercialShowcase.features.map((feature) => (
              <div key={feature} className={styles.commercialFeature}>
                {feature}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal direction="right" className={styles.commercialMedia}>
          <Image
            src={commercialShowcase.image}
            alt={commercialShowcase.alt}
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.commercialImage}
          />
        </Reveal>
      </div>
    </section>
  );
}
