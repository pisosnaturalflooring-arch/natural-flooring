import styles from "../NaturalFlooringPage.module.css";

export default function SpeciesStrip({ species }) {
  return (
    <div className={styles.speciesStrip}>
      <span className={styles.speciesLabel}>Especies disponibles</span>
      <div className={styles.speciesItems}>
        {species.map((item) => (
          <span key={item} className={styles.speciesItem}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
