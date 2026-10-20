import Image from "next/image";
import styles from "../NaturalFlooringPage.module.css";
import { ExternalLink, WhatsAppIcon, cx } from "./shared";

export default function HeroSection({ hero, imageIndex = 0 }) {
  const image = hero.images[imageIndex % hero.images.length];

  return (
    <section className={styles.hero} id="inicio">
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

        {/* El header esconde su botón de contacto mientras estos se ven. */}
        <div id="hero-cta" className={cx(styles.heroActions, styles.heroIntro)} style={{ "--delay": "0.4s" }}>
          <ExternalLink href={hero.ctaHref} className={styles.primaryButton}>
            <WhatsAppIcon />
            {hero.ctaLabel}
          </ExternalLink>
          <a href="/productos" className={styles.secondaryButton}>
            Ver productos
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
            src={image.src}
            alt={image.alt}
            className={styles.heroImage}
            sizes="(max-width: 768px) 100vw, 45vw"
            preload
            fetchPriority="high"
            quality={60}
          />
        <div className={styles.heroTag}>{hero.imageTag}</div>
      </div>
    </section>
  );
}
