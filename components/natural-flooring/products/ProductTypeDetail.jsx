import Image from "next/image";
import ConsultButton from "../sections/ConsultButton";
import { whatsappAbout } from "../catalog";
import { productTypes } from "../productsCatalog";
import { ProductGrid } from "./ProductCard";
import LineViewer from "./LineViewer";
import styles from "./ProductTypeDetail.module.css";

/**
 * Detalle de un tipo (/productos/pisos/spc): qué es, medidas, toda su línea,
 * cómo cuidarlo con los productos de mantenimiento que vende el local, y los
 * otros tipos de la misma categoría.
 */
export default function ProductTypeDetail({ categoryId, typeSlug }) {
  const siblings = productTypes(categoryId);
  const type = siblings.find((item) => item.slug === typeSlug);
  const others = siblings.filter((item) => item.slug !== typeSlug);
  const hasLine = type.hasLine;

  return (
    <div className={styles.detail}>
      <nav className={styles.breadcrumb} aria-label="Ubicación">
        <a href="/productos">Productos</a>
        <span aria-hidden="true">/</span>
        <a href={`/productos/${type.category.id}`}>{type.category.title}</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{type.navLabel}</span>
      </nav>

      <header className={type.photo ? styles.hero : styles.heroNoPhoto}>
        <div className={styles.heroText}>
          {type.kicker ? <p className={styles.kicker}>{type.kicker}</p> : null}
          <h1 className={styles.title}>{type.title}</h1>
          <p className={styles.description}>{type.description}</p>
          {type.specs ? (
            <ul className={styles.specs}>
              {type.specs.map((spec) => (
                <li key={spec}>{spec}</li>
              ))}
            </ul>
          ) : null}
          <ConsultButton href={type.href}>Consultar por {type.consult}</ConsultButton>
        </div>
        {type.photo ? (
          <div className={type.photo.fit === "contain" ? styles.photoPackshot : styles.photo}>
            <Image
              src={type.photo.src}
              alt={type.photo.alt}
              fill
              preload
              sizes="(max-width: 899px) 100vw, 560px"
              className={type.photo.fit === "contain" ? styles.imageContain : styles.image}
            />
          </div>
        ) : null}
      </header>

      {hasLine ? (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{type.lineLabel ?? "Las opciones"}</h2>
            <span className={styles.count}>
              {type.products.length === 1 ? "1 opción" : `${type.products.length} opciones`}
            </span>
          </div>
          <LineViewer products={type.products} label={type.lineLabel ?? "Las opciones"} />
        </section>
      ) : null}

      {type.extras?.length ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Lo que va con esto</h2>
          <ul className={styles.extras}>
            {type.extras.map((extra) => (
              <li key={extra}>{extra}</li>
            ))}
          </ul>
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

      {others.length ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Más en {type.category.title.toLowerCase()}</h2>
          <div className={styles.others}>
            {others.map((other) => (
              <a key={other.slug} href={other.detailHref} className={styles.other}>
                {other.photo ? (
                  <span className={other.photo.fit === "contain" ? styles.otherPhotoPackshot : styles.otherPhoto}>
                    <Image
                      src={other.photo.src}
                      alt=""
                      fill
                      sizes="(max-width: 599px) 50vw, 220px"
                      className={other.photo.fit === "contain" ? styles.imageContain : styles.image}
                    />
                  </span>
                ) : null}
                <span className={styles.otherName}>{other.navLabel}</span>
              </a>
            ))}
          </div>
          <a href={`/productos/${type.category.id}`} className={styles.allLink}>
            Ver todos los productos de {type.category.title.toLowerCase()} <span aria-hidden="true">→</span>
          </a>
        </section>
      ) : null}

      <section className={styles.closing}>
        <h2 className={styles.closingTitle}>¿Dudas con {type.navLabel.toLowerCase()}?</h2>
        <p className={styles.closingText}>Escribinos y te asesoramos sin cargo. Te respondemos al instante.</p>
        <ConsultButton href={whatsappAbout(type.consult)}>Escribinos</ConsultButton>
      </section>
    </div>
  );
}
