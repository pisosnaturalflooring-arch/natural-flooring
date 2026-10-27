import styles from "./WarrantySection.module.css";
import { ExternalLink } from "./shared";
import WarrantyCoverage from "./WarrantyCoverage";

export default function WarrantySection({ warranty, whatsappHref }) {
  return (
    <section className={styles.section} id="garantia" aria-labelledby="warranty-title">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <div>
            <p className={styles.label}>Garantías de obra</p>
            <h2 id="warranty-title" className={styles.title}>{warranty.title}</h2>
          </div>
          <span className={styles.seal} aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3 4 6v6c0 4 3 7 8 9 5-2 8-5 8-9V6l-8-3Z" />
              <path d="m8.5 12 2.5 2.5 4.5-5" />
            </svg>
          </span>
        </header>
        <WarrantyCoverage coverages={warranty.coverages} conditions={warranty.conditions} />
        <div className={styles.bottom}>
          <p>¿Tenés una consulta sobre la garantía de tu obra?</p>
          <ExternalLink href={whatsappHref} className={styles.contact}>Consultanos por WhatsApp</ExternalLink>
        </div>
      </div>
    </section>
  );
}
