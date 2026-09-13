"use client";

import Image from "next/image";
import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { ExternalLink, SectionHead, WhatsAppIcon, cx } from "./shared";

export default function ProductsSection({ productGroups }) {
  return (
    <section className={styles.altSection} id="productos">
      <SectionHead
        label="Productos"
        title={
          <>
            TODO PARA TU
            <br />
            ESPACIO
          </>
        }
        side={
          <Reveal delay={0.1}>
            <p className={styles.productsIntro}>
              Pisos, revestimientos, escaleras y exteriores. Elegí el material y te asesoramos
              sin cargo para que quede como lo imaginaste.
            </p>
          </Reveal>
        }
      />

      <div className={styles.productGroups}>
        {productGroups.map((group) => {
          // Las familias de dos productos van en tarjetas horizontales: en una
          // grilla de tres dejaban un hueco, y a lo ancho quedaban enormes.
          const isPair = group.items.length === 2;

          return (
            <div key={group.id} id={`productos-${group.id}`} className={styles.productGroup}>
              <Reveal className={styles.productGroupHead}>
                <h3 className={styles.productGroupTitle}>{group.title}</h3>
                <p className={styles.productGroupDesc}>{group.description}</p>
              </Reveal>

              <div className={cx(styles.productGrid, isPair && styles.productGridPair)}>
                {group.items.map((item, index) => (
                  <Reveal
                    key={item.id}
                    id={item.id}
                    delay={0.06 * index}
                    className={styles.catalogCard}
                  >
                    <ExternalLink
                      href={item.href}
                      className={styles.catalogCardLink}
                      ariaLabel={`Consultar por ${item.title} en WhatsApp`}
                    >
                      <span className={styles.catalogCardMedia}>
                        <Image
                          fill
                          src={item.image}
                          alt={item.alt}
                          className={styles.catalogCardImage}
                          sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <span className={styles.catalogCardTag}>{item.tag}</span>
                      </span>
                      <span className={styles.catalogCardBody}>
                        <span className={styles.catalogCardTitle}>{item.title}</span>
                        <span className={styles.catalogCardDesc}>{item.description}</span>
                        <span className={styles.catalogCardMore}>
                          <WhatsAppIcon />
                          Consultar
                          <span className={styles.catalogCardArrow} aria-hidden="true">→</span>
                        </span>
                      </span>
                    </ExternalLink>
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
