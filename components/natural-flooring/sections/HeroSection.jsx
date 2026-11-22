import { getImageProps } from "next/image";
import imageManifest from "../../../lib/image-manifest.json";
import { heroImageSrcSet, preparedImageUrl } from "../../../lib/image-presets.mjs";
import { HERO_FADE_SCRIPT, HERO_INTRO_SCRIPT } from "../../../lib/heroFade.mjs";
import { NaturalFlooringMark } from "./BrandLogo";
import styles from "./HeroSection.module.css";
import { ExternalLink, MapPinIcon, WhatsAppIcon, cx } from "./shared";

/** Foto a pantalla completa con el texto sobre la imagen, alineado a la izquierda. Se renderiza en el servidor. */
export default function HeroSection({ hero, imageIndex = 0 }) {
  const image = hero.images[imageIndex % hero.images.length];
  const desktopAsset = imageManifest[image.desktopSrc ?? image.src];
  const mobileAsset = imageManifest[image.src];
  // Con cover, una foto vertical puede necesitar más ancho que el viewport
  // para llenar la altura. El srcset debe contemplarlo también en celulares.
  const mobileScale = image.mobileScale ?? 1;
  const ratio = (image.aspectRatio ?? 0.75) * mobileScale;
  const mobileSizes = `(max-width: 768px) max(${100 * mobileScale}vw, calc(${100 * ratio}svh - ${64 * ratio}px)), 100vw`;
  const desktopSizes = "100vw";
  const common = {
    alt: image.alt, fill: true, quality: 85, loading: "eager", fetchPriority: "high",
    loader: ({ src, width, quality }) => preparedImageUrl(imageManifest[src], { width, quality }),
  };
  const { props: desktopImage } = getImageProps({ ...common, src: image.desktopSrc ?? image.src, sizes: desktopSizes });
  const { props: mobileImage } = getImageProps({ ...common, src: image.src, sizes: mobileSizes });

  return (
    <section
      suppressHydrationWarning
      className={cx(styles.hero, styles.inmersivo, styles.inmersivoLeft)}
      id="inicio"
      aria-labelledby="hero-title"
      style={{ "--hero-position-desktop": image.desktopPosition ?? "50% 50%", "--hero-position-mobile": image.mobilePosition ?? "50% 50%", "--hero-scale-mobile": image.mobileScale ?? 1 }}
    >
      {/* Pantalla de carga: tapa toda la página hasta que la foto está lista (lib/heroFade.mjs).
          Sin JS no se muestra. Los scripts agregan atributos antes de que hidrate React. */}
      <div className={styles.loader} aria-hidden="true">
        <div className={styles.loaderBrand}>
          <NaturalFlooringMark size={76} title="" />
          <span className={styles.loaderName}>Natural Flooring</span>
          <span className={styles.loaderTrack}><span className={styles.loaderBar} /></span>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: HERO_INTRO_SCRIPT }} />
      <div className={styles.content}>
        <h1 className={styles.title} id="hero-title">
          <span>Tu espacio,</span><span className={styles.titleAccent}>al natural.</span>
        </h1>
        <p className={styles.description}>Pisos, escaleras y decks de madera, instalados por nuestro equipo.</p>
        <p className={styles.showrooms}><MapPinIcon />{hero.eyebrow}</p>
        <div id="hero-cta" className={styles.actions}>
          <ExternalLink href={hero.ctaHref} className={styles.primaryButton}>
            <WhatsAppIcon />{hero.ctaLabel}
          </ExternalLink>
          <a href="/productos" className={styles.secondaryButton}>Ver productos</a>
        </div>
      </div>
      <figure suppressHydrationWarning className={styles.photograph}>
        <picture>
          <source media="(min-width: 769px)" type="image/avif" srcSet={heroImageSrcSet(desktopAsset)} sizes={desktopSizes} />
          <source media="(min-width: 769px)" srcSet={desktopImage.srcSet} sizes={desktopSizes} />
          <source type="image/avif" srcSet={heroImageSrcSet(mobileAsset)} sizes={mobileSizes} />
          <img {...mobileImage} className={styles.image} />
        </picture>
        <script dangerouslySetInnerHTML={{ __html: HERO_FADE_SCRIPT }} />
        <figcaption className={styles.caption}>{image.caption ?? image.alt}</figcaption>
      </figure>
    </section>
  );
}
