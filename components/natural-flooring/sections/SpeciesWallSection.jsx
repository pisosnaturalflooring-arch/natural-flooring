"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./SpeciesWall.module.css";
import ConsultButton from "./ConsultButton";
import { cx } from "./shared";

// ["Piso", "Escalera", "Deck"] → "Sirve para piso, escalera y deck"
function usesSentence(uses) {
  const words = uses.map((use) => use.toLowerCase());
  const list = words.length > 1 ? `${words.slice(0, -1).join(", ")} y ${words.at(-1)}` : words[0];
  return `Sirve para ${list}`;
}

function SpeciesInfo({ item }) {
  return (
    <>
      <h3 className={styles.name}>{item.name}</h3>
      <p className={styles.description}>{item.description}</p>
      <p className={styles.uses}>{usesSentence(item.uses)}</p>
      <p className={styles.sizes}>{item.sizes}</p>
      <ConsultButton href={item.href}>Consultar por {item.name.toLowerCase()}</ConsultButton>
    </>
  );
}

function Footnote({ onRequest, practical }) {
  return (
    <p className={styles.footnote}>
      {onRequest}{" "}
      <a href={practical.href} className={styles.footnoteLink}>
        {practical.text} <span aria-hidden="true">→</span>
      </a>
    </p>
  );
}

/**
 * Qué tabla corresponde a la posición del mouse, repartiendo el muestrario en
 * partes iguales. No se usa la tabla que queda debajo: la elegida se ensancha
 * y corre a las demás, y con eso la selección saltaría sola de una a otra.
 */
function slotUnder(event, count) {
  const { left, width } = event.currentTarget.getBoundingClientRect();
  const slot = Math.floor(((event.clientX - left) / width) * count);
  return Math.min(count - 1, Math.max(0, slot));
}

/**
 * "Las maderas": un muestrario de tablas reales, como la pared del showroom.
 * Tocar una tabla la saca al frente y barre su foto sobre la anterior. No
 * frena el scroll: la sección tiene alto normal y todo el movimiento sale de
 * una variable CSS animada (--t, índice de la especie al frente).
 */
export default function SpeciesWallSection({ species, onRequest, practical }) {
  const [active, setActive] = useState(0);
  const current = species[active];

  return (
    <section id="productos" className={styles.section} aria-label="Las maderas">
      <div className={styles.scene} style={{ "--t": active }}>
        <div className={styles.left}>
          <h2 className={styles.title}>Las maderas</h2>

          {/* Pasar el mouse ya muestra la madera; el click y el teclado también la eligen. */}
          <div className={styles.wall} onMouseMove={(event) => setActive(slotUnder(event, species.length))}>
            {species.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={styles.plank}
                style={{ "--i": index }}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                aria-label={`Ver ${item.name}`}
                aria-pressed={index === active}
              >
                <Image src={item.tabla} alt="" fill sizes="120px" className={styles.plankImage} />
                <span className={styles.plankName} aria-hidden="true">{item.name}</span>
              </button>
            ))}
          </div>

          <div className={styles.info} key={current.id} aria-live="polite">
            <SpeciesInfo item={current} />
          </div>

          <Footnote onRequest={onRequest} practical={practical} />
        </div>

        <div className={styles.stage}>
          <div className={styles.photoMain}>
            {species.map((item, index) => (
              <span key={item.id} className={styles.layer} style={{ "--i": index }}>
                <Image
                  src={item.photo.src}
                  alt={index === active ? item.photo.alt : ""}
                  fill
                  sizes="(max-width: 1320px) 50vw, 680px"
                  className={styles.photoImage}
                />
              </span>
            ))}
          </div>
          <div className={styles.photoDetail}>
            {species.map((item, index) => {
              // Sin segunda foto, el detalle es un acercamiento a la principal.
              const detail = item.detail ?? item.photo;
              return (
                <span key={item.id} className={styles.layer} style={{ "--i": index }}>
                  <Image
                    src={detail.src}
                    alt=""
                    fill
                    sizes="260px"
                    className={item.detail ? styles.photoImage : styles.photoImageCloseUp}
                  />
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pantallas angostas: fila de tablas para tocar y una sola ficha. */}
      <div className={styles.mobile}>
        <h2 className={styles.title}>Las maderas</h2>
        <div className={styles.mobileWall}>
          {species.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={cx(styles.mobilePlank, index === active && styles.mobilePlankActive)}
              onClick={() => setActive(index)}
              aria-label={`Ver ${item.name}`}
              aria-pressed={index === active}
            >
              <Image src={item.tabla} alt="" fill sizes="40px" className={styles.plankImage} />
            </button>
          ))}
        </div>
        <div className={styles.mobileCard} key={current.id}>
          <div className={styles.mobilePhoto}>
            <Image src={current.photo.src} alt={current.photo.alt} fill sizes="100vw" className={styles.photoImage} />
          </div>
          <SpeciesInfo item={current} />
        </div>
        <Footnote onRequest={onRequest} practical={practical} />
      </div>
    </section>
  );
}
