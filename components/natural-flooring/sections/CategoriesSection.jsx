"use client";

import Image from "next/image";
import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";

export default function CategoriesSection({ categories }) {
  return (
    <section className={styles.lightSection} id="categorias">
      <div className={styles.categoriesIntro}>
        <Reveal>
          <h2 className={styles.categoriesTitle}>PISOS &amp; ESCALERAS</h2>
          <p className={styles.categoriesDesc}>
            Instalamos y restauramos pisos de madera, vinílico y deck WPC, y revestimos escaleras a medida.
            Más de 15 años transformando hogares y espacios en zona norte.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <a href="#contacto" className={styles.sectionLink}>Consultanos →</a>
        </Reveal>
      </div>

      <div className={styles.categoriesGrid}>
        {categories.map((category, index) => (
          <Reveal key={category.title} as="a" direction="scale" delay={0.08 * index} href={category.href} className={styles.categoryCard}>
            <Image
              fill
              src={category.image}
              alt={category.alt}
              className={styles.categoryImage}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className={styles.categoryInfo}>
              <p className={styles.categoryTag}>{category.tag}</p>
              <h3 className={styles.categoryName}>{category.title}</h3>
              <span className={styles.categoryMore}>Ver más →</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
