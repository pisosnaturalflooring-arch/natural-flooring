import Image from "next/image";
import ConsultButton from "../sections/ConsultButton";
import styles from "./ProductsCatalog.module.css";

// Envuelve en un link solo si hay a dónde ir (las fichas de mantenimiento no tienen detalle).
function Linked({ href, className, children }) {
  return href ? (
    <a href={href} className={className ?? styles.cardLink}>
      {children}
    </a>
  ) : (
    <span className={className}>{children}</span>
  );
}

/**
 * `linkToDetail`: en el detalle del tipo las fichas no vuelven a linkear a la misma página.
 * `showUnit`: ahí tampoco se repite el tipo en cada ficha, ya lo dice el título.
 */
export function ProductCard({ product, linkToDetail = true, showUnit = true, eager = false }) {
  const linkTo = linkToDetail ? product.detailHref : null;

  // Sin foto propia todavía: ficha de texto, sin un recuadro vacío ni el nombre repetido.
  if (!product.photo) {
    return (
      <article className={styles.cardText}>
        <h3 className={styles.cardTextName}>
          <Linked href={linkTo}>{product.name}</Linked>
        </h3>
        {showUnit ? <p className={styles.cardUnit}>{product.unit}</p> : null}
        {product.detail ? <p className={styles.cardDetail}>{product.detail}</p> : null}
        <div className={styles.cardAction}>
          <ConsultButton href={product.href} size="small">
            Consultar
          </ConsultButton>
        </div>
      </article>
    );
  }

  return (
    <article className={styles.card}>
      <Linked href={linkTo} className={product.photo.fit === "contain" ? styles.cardPhotoPackshot : styles.cardPhoto}>
        <Image
          src={product.photo.src}
          alt={product.photo.alt}
          fill
          sizes="(max-width: 599px) 50vw, (max-width: 1099px) 33vw, 280px"
          preload={eager}
          loading={eager ? "eager" : "lazy"}
          className={product.photo.fit === "contain" ? styles.imageContain : styles.image}
        />
      </Linked>
      <h3 className={styles.cardName}>
        <Linked href={linkTo}>{product.name}</Linked>
      </h3>
      {showUnit ? <p className={styles.cardUnit}>{product.unit}</p> : null}
      {product.detail ? <p className={styles.cardDetail}>{product.detail}</p> : null}
      <div className={styles.cardAction}>
        <ConsultButton href={product.href} size="small">
          Consultar
        </ConsultButton>
      </div>
    </article>
  );
}

/** `eagerCount`: cuántas fichas de arriba cargan sin esperar (son la imagen principal de la página). */
export function ProductGrid({ products, linkToDetail = true, showUnit = true, eagerCount = 0 }) {
  return (
    <div className={styles.grid}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          linkToDetail={linkToDetail}
          showUnit={showUnit}
          eager={index < eagerCount}
        />
      ))}
    </div>
  );
}
