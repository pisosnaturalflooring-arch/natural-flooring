import Image from "next/image";
import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { ExternalLink, cx } from "./shared";
import { links } from "../links";

const ICONS = {
  price: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
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
    <section className={styles.whySection} id="nosotros">
      <div className={styles.whyInner}>
        <Reveal className={styles.whyHead}>
          <p className={styles.sectionLabel}>Nosotros</p>
          <h2 className={cx(styles.sectionTitle, styles.whySectionTitle)}>
            MÁS QUE PISOS, EL TRABAJO COMPLETO
          </h2>
        </Reveal>

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

        <div className={styles.whyBody}>
          <Reveal>
            <p className={styles.whyStatement}>{why.lead}</p>
            <p className={styles.whyLead}>{why.description}</p>
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

          <Reveal delay={0.35}>
            <ExternalLink
              href={links.whatsappGeneral}
              className={cx(styles.primaryButton, styles.whyCta)}
            >
              Consultanos sin cargo →
            </ExternalLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
