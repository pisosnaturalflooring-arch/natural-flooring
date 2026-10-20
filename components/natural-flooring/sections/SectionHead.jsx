import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { cx } from "./shared";

/** Encabezado de sección de la home (etiqueta, título y link o bloque a la derecha). */
export function SectionHead({ label, title, linkHref, linkLabel, inverse, side }) {
  return (
    <div className={styles.sectionHead}>
      <Reveal>
        {/* Sin label no se renderiza el parrafo: dejaba un hueco con su margen. */}
        {label ? (
          <p className={cx(styles.sectionLabel, inverse && styles.sectionLabelInverse)}>{label}</p>
        ) : null}
        <h2 className={cx(styles.sectionTitle, inverse && styles.sectionTitleInverse)}>{title}</h2>
      </Reveal>

      {side ? (
        side
      ) : linkHref && linkLabel ? (
        <Reveal delay={0.1}>
          <a
            href={linkHref}
            className={cx(styles.sectionLink, inverse && styles.sectionLinkInverse)}
          >
            {linkLabel}
          </a>
        </Reveal>
      ) : null}
    </div>
  );
}
