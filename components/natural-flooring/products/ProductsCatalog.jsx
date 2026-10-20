"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import ConsultButton from "../sections/ConsultButton";
import { ProductGrid } from "./ProductCard";
import { whatsappAbout } from "../catalog";
import { productTypes } from "../productsCatalog";
import styles from "./ProductsCatalog.module.css";

const ALL = "todos";

/** Lo que se sabe del tipo elegido en el filtro: descripción, medidas y consulta. */
function TypeIntro({ type }) {
  return (
    <div className={type.photo ? styles.typeIntro : styles.typeIntroNoPhoto}>
      <div className={styles.typeText}>
        <h2 className={styles.typeTitle}>{type.title}</h2>
        <p className={styles.typeDescription}>{type.description}</p>
        {type.specs ? (
          <ul className={styles.specs}>
            {type.specs.map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
        ) : null}
        {type.extras?.map((extra) => (
          <p key={extra} className={styles.extra}>
            {extra}
          </p>
        ))}
        <div className={styles.typeActions}>
          <ConsultButton href={type.href}>Consultar por {type.consult}</ConsultButton>
          <a href={type.detailHref} className={styles.detailLink}>
            Ver todo sobre {type.navLabel.toLowerCase()} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
      {type.photo ? (
        <div className={type.photo.fit === "contain" ? styles.typePhotoPackshot : styles.typePhoto}>
          <Image
            src={type.photo.src}
            alt={type.photo.alt}
            fill
            sizes="(max-width: 899px) 100vw, 480px"
            className={type.photo.fit === "contain" ? styles.imageContain : styles.image}
          />
        </div>
      ) : null}
    </div>
  );
}

// En las vistas "Todos" se mezclan tipos: primero las fichas con foto para que
// las filas queden parejas (el orden es estable, cada tipo conserva el suyo).
function photosFirst(products) {
  return [...products].sort((a, b) => Number(Boolean(b.photo)) - Number(Boolean(a.photo)));
}

function countLabel(count) {
  return count === 1 ? "1 producto" : `${count} productos`;
}

/**
 * Catálogo: /productos muestra todas las categorías; /productos/[categoria]
 * una sola, con filtro por tipo. El tipo elegido queda en la URL (?tipo=spc)
 * para poder compartirla.
 */
export default function ProductsCatalog({ categories, categoryId }) {
  const category = categories.find((item) => item.id === categoryId) ?? null;
  const types = useMemo(() => productTypes(categoryId), [categoryId]);
  const [typeSlug, setTypeSlug] = useState(ALL);

  // El filtro se lee de la URL recién en el cliente: así el HTML estático es
  // siempre el de "Todos" y no hay diferencias al hidratar.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("tipo");
    if (fromUrl && types.some((type) => type.slug === fromUrl)) setTypeSlug(fromUrl);
  }, [types]);

  const chooseType = (slug) => {
    setTypeSlug(slug);
    const url = new URL(window.location.href);
    if (slug === ALL) url.searchParams.delete("tipo");
    else url.searchParams.set("tipo", slug);
    window.history.replaceState(null, "", url);
  };

  const activeType = types.find((type) => type.slug === typeSlug) ?? null;
  const visibleProducts = activeType ? activeType.products : photosFirst(types.flatMap((type) => type.products));

  const [menuOpen, setMenuOpen] = useState(false);
  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        categories.map((item) => [item.id, productTypes(item.id).reduce((sum, type) => sum + type.products.length, 0)])
      ),
    [categories]
  );
  const allCount = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
  const currentLabel = category ? (activeType ? `${category.title} · ${activeType.navLabel}` : category.title) : "Todos";
  const totalCount = category ? visibleProducts.length : types.reduce((sum, type) => sum + type.products.length, 0);

  const pickType = (slug) => {
    chooseType(slug);
    setMenuOpen(false);
  };

  return (
    <div className={styles.catalog}>
      <header className={styles.top}>
        <h1 className={styles.pageTitle}>{category ? category.title : "Productos"}</h1>
        <p className={styles.pageIntro}>
          {category
            ? category.intro
            : "Todo lo que vendemos y colocamos, con las maderas, los colores y las medidas que tenemos. Si no sabés qué te conviene, escribinos y te asesoramos sin cargo."}
        </p>
      </header>

      <div className={styles.layout}>
        {/* Un solo menú: categorías y, abajo de la elegida, sus tipos. En el celular se despliega con "Filtrar". */}
        <aside className={styles.sidebar}>
          <button
            type="button"
            className={styles.filterToggle}
            aria-expanded={menuOpen}
            aria-controls="productos-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span>
              Filtrar: <strong>{currentLabel}</strong>
            </span>
            <span aria-hidden="true">{menuOpen ? "▴" : "▾"}</span>
          </button>
          <nav id="productos-menu" className={menuOpen ? styles.sideNavOpen : styles.sideNav} aria-label="Categorías y tipos de productos">
            <p className={styles.sideLabel}>Categorías</p>
            <ul className={styles.sideList}>
              <li>
                <a href="/productos" className={category ? styles.sideCategory : styles.sideCategoryActive}>
                  <span>Todos los productos</span>
                  <span className={styles.sideCount}>{allCount}</span>
                </a>
              </li>
              {categories.map((item) => (
                <li key={item.id}>
                  <a
                    href={`/productos/${item.id}`}
                    className={item.id === categoryId ? styles.sideCategoryActive : styles.sideCategory}
                    aria-current={item.id === categoryId && !activeType ? "page" : undefined}
                  >
                    <span>{item.title}</span>
                    <span className={styles.sideCount}>{categoryCounts[item.id]}</span>
                  </a>
                  {item.id === categoryId && types.length > 1 ? (
                    <ul className={styles.sideTypes}>
                      <li>
                        <button
                          type="button"
                          className={activeType ? styles.sideType : styles.sideTypeActive}
                          aria-pressed={!activeType}
                          onClick={() => pickType(ALL)}
                        >
                          <span>Todos</span>
                          <span className={styles.sideCount}>{categoryCounts[item.id]}</span>
                        </button>
                      </li>
                      {types.map((type) => (
                        <li key={type.slug}>
                          <button
                            type="button"
                            className={type.slug === typeSlug ? styles.sideTypeActive : styles.sideType}
                            aria-pressed={type.slug === typeSlug}
                            onClick={() => pickType(type.slug)}
                          >
                            <span>{type.navLabel}</span>
                            <span className={styles.sideCount}>{type.products.length}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className={styles.content}>
          <p className={styles.count}>
            <strong>{currentLabel === "Todos" ? "Todos los productos" : currentLabel}</strong> · {countLabel(totalCount)}
          </p>
          {category ? (
            <>
              {activeType ? <TypeIntro type={activeType} /> : null}
              <ProductGrid products={visibleProducts} showUnit={!activeType} eagerCount={activeType ? 0 : 3} />
            </>
          ) : (
            categories.map((item, groupIndex) => {
              const products = photosFirst(types.filter((type) => type.category.id === item.id).flatMap((type) => type.products));
              return (
                <section key={item.id} className={styles.group}>
                  <div className={styles.groupHead}>
                    <h2 className={styles.groupTitle}>{item.title}</h2>
                    <a href={`/productos/${item.id}`} className={styles.groupLink}>
                      Ver todo en {item.title.toLowerCase()} <span aria-hidden="true">→</span>
                    </a>
                  </div>
                  <ProductGrid products={products} eagerCount={groupIndex === 0 ? 3 : 0} />
                </section>
              );
            })
          )}
        </div>
      </div>

      <div className={styles.body}>
        <section className={styles.closing}>
          <h2 className={styles.closingTitle}>¿No encontrás lo que buscás?</h2>
          <p className={styles.closingText}>
            Trabajamos más maderas y medidas a pedido. Contanos qué necesitás y te respondemos al instante.
          </p>
          <ConsultButton href={whatsappAbout("un producto que no encontré en la web")}>Escribinos</ConsultButton>
        </section>
      </div>
    </div>
  );
}
