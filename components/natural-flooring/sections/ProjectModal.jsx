import Image from "next/image";
import styles from "../NaturalFlooringPage.module.css";

export default function ProjectModal({ project, onClose }) {
  if (!project || project.placeholder) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop} onClick={onClose} role="presentation">
      <div
        className={styles.modalDialog}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.modalClose} onClick={onClose}>
          ✕
        </button>

        <div className={styles.modalImageWrap}>
          <Image
            fill
            src={project.image}
            alt={project.alt}
            className={styles.modalImage}
            sizes="(max-width: 768px) 90vw, 780px"
            priority
          />
        </div>

        <div className={styles.modalMeta}>
          <div className={styles.archiveGroup}>{project.group || project.category}</div>
          <h2 className={styles.modalTitle}>{project.name || project.title}</h2>
          {project.subtitle && (
            <div className={styles.archiveSubtitle}>{project.subtitle}</div>
          )}
          {project.materials && (
            <div className={styles.modalMaterials}>{project.materials}</div>
          )}
          {project.description && (
            <p className={styles.modalDescription}>{project.description}</p>
          )}
        </div>

        {project.before && (
          <div className={styles.modalBeforeAfter}>
            <div className={styles.modalBeforeAfterCard}>
              <div className={styles.modalBeforeAfterWrap}>
                <Image
                  fill
                  src={project.before}
                  alt="Antes"
                  className={styles.modalBeforeAfterImage}
                  sizes="50vw"
                />
              </div>
              <span className={styles.modalBeforeAfterLabel}>Antes</span>
            </div>
            <div className={styles.modalBeforeAfterCard}>
              <div className={styles.modalBeforeAfterWrap}>
                <Image
                  fill
                  src={project.image}
                  alt="Después"
                  className={styles.modalBeforeAfterImage}
                  sizes="50vw"
                />
              </div>
              <span className={styles.modalBeforeAfterLabel}>Después</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
