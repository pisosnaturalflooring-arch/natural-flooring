"use client";

import Image from "next/image";
import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";

const ICONS = {
  materials: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="4" rx="1" />
      <rect x="2" y="13" width="20" height="4" rx="1" />
      <line x1="6" y1="7" x2="6" y2="4" />
      <line x1="18" y1="7" x2="18" y2="4" />
    </svg>
  ),
  install: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  warranty: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  consult: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

export default function WhySection({ why, whyItems }) {
  return (
    <section className={styles.whySection} id="por-que-elegirnos">
      <div className={styles.whyInner}>
        <Reveal direction="left" className={styles.whyMediaWrap}>
          <Image
            fill
            src={why.image}
            alt={why.imageAlt}
            className={styles.whyImage}
            sizes="(max-width: 768px) 100vw, 45vw"
          />
          <div className={styles.whyBadge}>
            <div className={styles.whyBadgeValue}>{why.badgeValue}</div>
            <div className={styles.whyBadgeLabel}>{why.badgeLabel}</div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className={styles.sectionLabelInverse}>Por qué elegirnos</p>
            <h2 className={styles.sectionTitleInverse}>
              CALIDAD EN
              <br />
              CADA DETALLE
            </h2>
          </Reveal>

          <div className={styles.whyItems}>
            {whyItems.map((item, index) => (
              <Reveal key={item.title} delay={0.08 * index} className={styles.whyItem}>
                <div className={styles.whyIcon}>
                  {ICONS[item.iconKey] ?? null}
                </div>
                <div>
                  <div className={styles.whyTitle}>{item.title}</div>
                  <div className={styles.whyDescription}>{item.description}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
