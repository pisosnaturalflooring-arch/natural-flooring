"use client";

import Image from "next/image";
import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { SectionHead, cx } from "./shared";

export default function FeaturedProjectsSection({ featuredProjects, onProjectOpen }) {
  return (
    <section className={styles.altSection} id="obras">
      <SectionHead
        label="Portfolio"
        title={
          <>
            OBRAS
            <br />
            REALIZADAS
          </>
        }
        linkHref="#archivo"
        linkLabel="Ver todos →"
      />

      <div className={styles.obrasGrid}>
        {featuredProjects.map((project, index) => (
          <Reveal
            key={project.name}
            as="button"
            direction={index === 0 ? "left" : "up"}
            delay={index === 0 ? 0 : 0.08 * index}
            type="button"
            className={cx(styles.obra, styles[`obra${index + 1}`])}
            onClick={() => onProjectOpen(project)}
          >
            <Image
              fill
              src={project.image}
              alt={project.alt}
              className={styles.obraImage}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className={styles.obraLabel}>
              <div className={styles.obraCategory}>{project.category}</div>
              <div className={styles.obraName}>{project.name}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
