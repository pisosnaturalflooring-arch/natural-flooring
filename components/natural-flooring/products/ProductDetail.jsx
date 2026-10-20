import Image from "next/image";
import ConsultButton from "../sections/ConsultButton";
import { findProduct } from "../productsCatalog";
import { Facts, Swatches } from "./LineViewer";
import { ProductGrid } from "./ProductCard";
import styles from "./ProductDetail.module.css";

/**
 * Ficha de un color o especie (/productos/pisos/spc/honey-oak): foto, datos
 * del color, lo que comparte con su tipo, el selector para pasar a los otros
 * colores y cómo cuidarlo.
 */
export default function ProductDetail({ categoryId, typeSlug, productSlug }) {
  const { type, product } = findProduct(categoryId, typeSlug, productSlug);

  return (
    <div className={styles.detail}>
      <nav className={styles.breadcrumb} aria-label="Ubicación">
        <a href="/productos">Productos</a>
        <span aria-hidden="true">/</span>
        <a href={`/productos/${type.category.id}`}>{type.category.title}</a>
        <span aria-hidden="true">/</span>
        <a href={type.detailHref}>{type.navLabel}</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <header className={styles.hero}>
        <div className={styles.media}>
          {product.photo ? (
            <span className={product.photo.fit === "contain" ? styles.photoPackshot : styles.photo}>
              <Image
                src={product.photo.src}
                alt={product.photo.alt}
                fill
                preload
                sizes="(max-width: 899px) 100vw, 560px"
                className={product.photo.fit === "contain" ? styles.imageContain : styles.image}
              />
            </span>
          ) : (
            <span className={styles.noPhoto}>
              <span className={styles.noPhotoName}>{product.name}</span>
              <span className={styles.noPhotoNote}>Pedinos una muestra o vení a verlo al showroom</span>
            </span>
          )}
        </div>

        <div className={styles.text}>
          <p className={styles.kicker}>{product.unit}</p>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.description}>{product.about ?? type.description}</p>

          <h2 className={styles.factsTitle}>Ficha</h2>
          <Facts facts={product.facts} />

          {type.sharedSpecs?.length ? (
            <>
              <h2 className={styles.factsTitle}>En toda la línea</h2>
              <ul className={styles.specs}>
                {type.sharedSpecs.map((spec) => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>
            </>
          ) : null}

          <div className={styles.actions}>
            <ConsultButton href={product.href}>Consultar por {product.name.toLowerCase()}</ConsultButton>
            <a href={type.detailHref} className={styles.typeLink}>
              Todo sobre {type.navLabel.toLowerCase()} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </header>

      {type.products.length > 1 ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Otras opciones de {type.navLabel.toLowerCase()}</h2>
          <Swatches products={type.products} activeSlug={product.slug} label={`Otras opciones de ${type.navLabel}`} />
        </section>
      ) : null}

      {type.care ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Para que dure</h2>
          <div className={styles.care}>
            <ul className={styles.tips}>
              {type.care.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
            <ProductGrid products={type.care.products} linkToDetail={false} showUnit={false} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
