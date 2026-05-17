"use client";

import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { ExternalLink, SectionHead, cx } from "./shared";
import { links } from "../data";

export default function MaintenanceSection({ maintenanceProducts, whatsappHref }) {
  return (
    <section className={styles.altSection} id="productos-mantenimiento">
      <SectionHead
        label="Productos"
        title={
          <>
            MANTENÉ TU PISO
            <br />
            COMO EL PRIMER DÍA
          </>
        }
        side={
          <Reveal delay={0.1}>
            <p className={styles.maintenanceAside}>
              Vendemos los productos que usamos nosotros en cada obra. Calidad profesional
              disponible en el local o con envío.
            </p>
          </Reveal>
        }
      />

      <div className={styles.maintenanceGrid}>
        {maintenanceProducts.map((product, index) => (
          <Reveal key={product.title} as="article" delay={0.06 * index} className={styles.productCard}>
            <div className={cx(styles.productVisual, styles[`productVisual${product.theme}`])}>{product.icon}</div>
            <div className={styles.productBody}>
              <div className={styles.productCategory}>{product.category}</div>
              <div className={styles.productTitle}>{product.title}</div>
              <p className={styles.productDescription}>{product.description}</p>
              <div className={styles.productActions}>
                <ExternalLink href={product.href} className={styles.productLink}>
                  Consultar precio →
                </ExternalLink>
                <ExternalLink href={links.mlStore} className={cx(styles.productLink, styles.productLinkMl)}>
                  Ver en ML →
                </ExternalLink>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className={styles.helpBanner}>
        <div>
          <div className={styles.helpBannerTitle}>¿NO SABÉS QUÉ PRODUCTO NECESITÁS?</div>
          <p className={styles.helpBannerText}>
            Contanos qué tipo de piso tenés y te decimos exactamente qué usar.
          </p>
        </div>
        <ExternalLink href={whatsappHref} className={styles.helpBannerButton}>
          Consultá por WhatsApp →
        </ExternalLink>
      </Reveal>
    </section>
  );
}
