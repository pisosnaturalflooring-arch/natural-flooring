import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { ExternalLink } from "./shared";

export default function WarrantySection({ warranty, whatsappHref }) {
  return (
    <section className={styles.warrantySection} id="garantia">
      <Reveal className={styles.warrantyInner}>
        <span className={styles.warrantyIcon} aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </span>
        <div className={styles.warrantyText}>
          <h2 className={styles.warrantyTitle}>{warranty.title}</h2>
          <p className={styles.warrantyDescription}>{warranty.description}</p>
        </div>
        <ExternalLink href={whatsappHref} className={styles.primaryButton}>
          Consultar garantía →
        </ExternalLink>
      </Reveal>
    </section>
  );
}
