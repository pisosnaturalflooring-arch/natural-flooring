import { getImageProps } from "next/image";
import styles from "./HeroSection.module.css";
import { ExternalLink, WhatsAppIcon, cx } from "./shared";

/** La home se renderiza en el servidor; solo el comparador hidrata este hero. */
export default function HeroSection({ hero, imageIndex = 0, variant = "inmersivo", alignment = "center" }) {
  const image = hero.images[imageIndex % hero.images.length];
  const immersive = variant === "inmersivo";
  // Con cover, una foto vertical puede necesitar más ancho que el viewport
  // para llenar la altura. El srcset debe contemplarlo también en celulares.
  const mobileScale = image.mobileScale ?? 1;
  const ratio = (image.aspectRatio ?? 0.75) * mobileScale;
  const mobileSizes = immersive
    ? `(max-width: 768px) max(${100 * mobileScale}vw, calc(${100 * ratio}svh - ${64 * ratio}px)), 100vw`
    : `${100 * mobileScale}vw`;
  const desktopSizes = variant === "editorial" ? "(max-width: 900px) 100vw, (max-width: 1100px) 58vw, 63vw" : "100vw";
  const common = { alt: image.alt, fill: true, quality: 85, loading: "eager", fetchPriority: "high" };
  const { props: desktopImage } = getImageProps({ ...common, src: image.desktopSrc ?? image.src, sizes: desktopSizes });
  const { props: mobileImage } = getImageProps({ ...common, src: image.src, sizes: mobileSizes });

  return (
    <section
      className={cx(styles.hero, styles[variant], immersive && alignment === "left" && styles.inmersivoLeft)}
      id="inicio"
      aria-labelledby="hero-title"
      style={{ "--hero-position-desktop": image.desktopPosition ?? "50% 50%", "--hero-position-mobile": image.mobilePosition ?? "50% 50%", "--hero-scale-mobile": image.mobileScale ?? 1 }}
    >
      <div className={styles.content}>
        {!immersive && <p className={styles.location}>{hero.eyebrow}</p>}
        <h1 className={styles.title} id="hero-title">
          {immersive ? <><span>Tu espacio,</span><span className={styles.titleAccent}>al natural.</span></> : <>{hero.titleLead}<br />{" "}tu {hero.titleAccent}</>}
        </h1>
        <p className={styles.description}>{immersive ? "Pisos, escaleras y exteriores." : hero.description}</p>
        {immersive && <p className={styles.showrooms}>{hero.eyebrow}</p>}
        <div id="hero-cta" className={styles.actions}>
          <ExternalLink href={hero.ctaHref} className={styles.primaryButton}>
            <WhatsAppIcon />{hero.ctaLabel}
          </ExternalLink>
          <a href="/productos" className={styles.secondaryButton}>Ver productos</a>
        </div>
        <dl className={styles.stats}>
          {hero.stats.slice(0, 2).map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <figure className={styles.photograph}>
        <picture>
          <source media="(min-width: 769px)" srcSet={desktopImage.srcSet} sizes={desktopSizes} />
          <img {...mobileImage} className={styles.image} />
        </picture>
        <figcaption className={styles.caption}>{image.caption ?? image.alt}</figcaption>
      </figure>
      <a className={styles.explore} href="#nosotros" aria-label="Conocé Natural Flooring">
        Conocé nuestro trabajo <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
