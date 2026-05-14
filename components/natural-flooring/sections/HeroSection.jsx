import Image from "next/image";
import styles from "../NaturalFlooringPage.module.css";
import { cx } from "./shared";

export default function HeroSection({ hero }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroLeft}>
        <div className={cx(styles.eyebrow, styles.heroIntro)} style={{ "--delay": "0.06s" }}>
          <span className={styles.eyebrowLine} />
          <span className={styles.eyebrowText}>{hero.eyebrow}</span>
        </div>

        <h1 className={cx(styles.heroTitle, styles.heroIntro)} style={{ "--delay": "0.18s" }}>
          {hero.titleLead}
          <br />
          TU <span className={styles.heroAccent}>{hero.titleAccent}</span>
        </h1>

        <p className={cx(styles.heroDescription, styles.heroIntro)} style={{ "--delay": "0.3s" }}>
          {hero.description}
        </p>

        <div className={cx(styles.heroActions, styles.heroIntro)} style={{ "--delay": "0.4s" }}>
          <a href="#categorias" className={styles.primaryButton}>
            Ver productos
          </a>
          <a href="#obras" className={styles.secondaryButton}>
            Ver obras
          </a>
        </div>

        <div className={cx(styles.heroStats, styles.heroIntro)} style={{ "--delay": "0.5s" }}>
          {hero.stats.map((stat) => (
            <div key={stat.label}>
              <div className={styles.heroStatValue}>{stat.value}</div>
              <div className={styles.heroStatLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.heroRight}>
        <Image
            fill
            src={hero.image}
            alt={hero.imageAlt}
            className={styles.heroImage}
            sizes="45vw"
            priority
          />
        <div className={styles.heroTag}>{hero.imageTag}</div>
      </div>
    </section>
  );
}
