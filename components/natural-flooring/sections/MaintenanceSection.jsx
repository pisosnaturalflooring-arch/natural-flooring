"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { ExternalLink, cx } from "./shared";
import { SectionHead } from "./SectionHead";
import { links } from "../links";

export default function MaintenanceSection({ maintenanceProducts, whatsappHref }) {
  const carouselRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateButtons = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 1);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateButtons();
    window.addEventListener("resize", updateButtons);
    return () => window.removeEventListener("resize", updateButtons);
  }, [updateButtons]);

  const scroll = (dir) => {
    carouselRef.current?.scrollBy({ left: dir * 288, behavior: "smooth" });
  };

  return (
    <section className={styles.altSection} id="productos-mantenimiento">
      <SectionHead
        label="Productos de mantenimiento"
        title={
          <>
            MANTENÉ TU PISO COMO EL PRIMER DÍA
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

      <Reveal delay={0.05} className={styles.carouselOuter}>
        <button
          onClick={() => scroll(-1)}
          className={cx(styles.carouselBtn, !canLeft && styles.carouselBtnHidden)}
          aria-label="Anterior"
          tabIndex={canLeft ? 0 : -1}
        >
          ←
        </button>

        <div
          className={styles.productCarousel}
          ref={carouselRef}
          onScroll={updateButtons}
        >
          {maintenanceProducts.map((product) => (
            <article key={product.title} className={styles.productCard}>
              <div className={styles.productVisual}>
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="272px"
                  className={styles.productVisualImg}
                />
              </div>
              <div className={styles.productBody}>
                <div className={styles.productCategory}>{product.category}</div>
                <div className={styles.productTitle}>{product.title}</div>
                <p className={styles.productDescription}>{product.description}</p>
                <ExternalLink
                  href={links.mlStore}
                  className={cx(styles.productLink, styles.productLinkMl)}
                >
                  Ver en Mercado Libre →
                </ExternalLink>
              </div>
            </article>
          ))}
        </div>

        <button
          onClick={() => scroll(1)}
          className={cx(styles.carouselBtn, !canRight && styles.carouselBtnHidden)}
          aria-label="Siguiente"
          tabIndex={canRight ? 0 : -1}
        >
          →
        </button>
      </Reveal>

      <Reveal className={styles.helpBanner}>
        <div>
          <div className={styles.helpBannerTitle}>¿NO SABÉS QUÉ PRODUCTO NECESITÁS?</div>
          <p className={styles.helpBannerText}>
            Contanos qué tipo de piso tenés y te decimos exactamente qué usar.
          </p>
        </div>
        <ExternalLink href={links.whatsappMaintenanceHelp} className={styles.helpBannerButton}>
          Consultá por WhatsApp →
        </ExternalLink>
      </Reveal>
    </section>
  );
}
