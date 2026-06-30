import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { SectionHead, cx } from "./shared";

const INITIAL_COUNT = 5;

export default function ArchiveSection({
  activeCategory,
  archiveFilters,
  archiveProjects,
  onCategoryChange,
  onProjectOpen,
}) {
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  const filteredProjects = useMemo(() => {
    const real = archiveProjects.filter((p) => !p.placeholder);
    if (activeCategory === "todos") return real;
    return real.filter((p) => p.category === activeCategory);
  }, [activeCategory, archiveProjects]);

  const visibleProjects = showAll ? filteredProjects : filteredProjects.slice(0, INITIAL_COUNT);
  const hasMore = !showAll && filteredProjects.length > INITIAL_COUNT;

  return (
    <section className={styles.lightSection} id="proyectos">
      <SectionHead
        label="Archivo de trabajos"
        title={
          <>
            TODOS NUESTROS
            <br />
            PROYECTOS
          </>
        }
        side={
          <div className={styles.archiveFilters}>
            {archiveFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                aria-pressed={activeCategory === filter.value}
                className={cx(
                  styles.filterButton,
                  activeCategory === filter.value && styles.filterButtonActive
                )}
                onClick={() => onCategoryChange(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        }
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          className={styles.archiveList}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {visibleProjects.map((project, index) => (
            <Reveal
              key={`${project.title}-${project.image}`}
              as="button"
              delay={0.04 * index}
              duration={0.45}
              once={false}
              type="button"
              className={styles.archiveRow}
              onClick={() => onProjectOpen(project)}
            >
              <span className={styles.archiveRowNum}>
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className={styles.archiveRowInfo}>
                <span className={styles.archiveRowTitle}>{project.title}</span>
                {project.subtitle && (
                  <span className={styles.archiveRowSub}>{project.subtitle}</span>
                )}
                <span className={styles.archiveRowCat}>{project.group || project.category}</span>
              </span>

              <div className={styles.archiveRowThumb}>
                <Image
                  fill
                  src={project.image}
                  alt={project.alt}
                  className={styles.archiveRowThumbImg}
                  sizes="90px"
                />
              </div>

              <span aria-hidden="true" className={styles.archiveRowArrow}>→</span>
            </Reveal>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className={styles.archiveFooter}>
        {hasMore ? (
          <button
            type="button"
            className={styles.loadMoreButton}
            onClick={() => setShowAll(true)}
          >
            Ver los {filteredProjects.length - INITIAL_COUNT} proyectos restantes →
          </button>
        ) : (
          <span />
        )}
        <a href="#contacto" className={styles.sectionLink}>
          ¿Tenés un proyecto? Consultanos →
        </a>
      </div>
    </section>
  );
}
