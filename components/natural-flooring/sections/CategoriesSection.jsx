"use client";

import Image from "next/image";
import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { SectionHead } from "./shared";

export default function CategoriesSection({ categories }) {
  return (
    <section className={styles.lightSection} id="categorias">
      <SectionHead
        label="Lo que hacemos"
        title={
          <>
            NUESTROS
            <br />
            PRODUCTOS
          </>
        }
        linkHref="#contacto"
        linkLabel="Consultar precio →"
      />

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
