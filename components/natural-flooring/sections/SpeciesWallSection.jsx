"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import styles from "./SpeciesWall.module.css";
import ConsultButton from "./ConsultButton";
import { ExternalLink, cx } from "./shared";

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
      <ExternalLink href={practical.href} className={styles.footnoteLink}>
        {practical.text} <span aria-hidden="true">→</span>
      </ExternalLink>
    </p>
  );
}

/**
 * "Las maderas": un muestrario de tablas reales, como la pared del showroom.
 * El scroll saca una tabla por vez y barre su foto sobre la anterior; tocar
 * una tabla salta a esa especie. Todo el movimiento sale de una variable CSS
 * (--t, índice continuo de la especie al frente): el scroll no re-renderiza
 * React por frame.
 */
export default function SpeciesWallSection({ species, onRequest, practical }) {
  const sectionRef = useRef(null);
  const sceneRef = useRef(null);
  const [active, setActive] = useState(0);
  // En mobile no hay escena fija: se elige tocando la tabla.
  const [picked, setPicked] = useState(0);
  const last = species.length - 1;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const t = Math.min(Math.max(progress, 0), 1) * last;
    sceneRef.current?.style.setProperty("--t", t.toFixed(3));
    const index = Math.round(t);
    setActive((current) => (current === index ? current : index));
  });

  // Lleva el scroll al punto exacto donde esa especie queda al frente.
  const goTo = (index) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (last ? (travel * index) / last : 0), behavior: "smooth" });
  };

  const current = species[active];
  const mobileItem = species[picked];

  return (
    <section
      ref={sectionRef}
      id="productos"
      className={styles.section}
      style={{ "--count": species.length }}
      aria-label="Las maderas"
    >
      {/* Anclas a la altura de scroll donde queda al frente cada especie. */}
      {species.map((item, index) => (
        <span
          key={item.id}
          id={`madera-${item.id}`}
          className={styles.anchor}
          style={{ "--at": last ? index / last : 0 }}
          aria-hidden="true"
        />
      ))}

      <div ref={sceneRef} className={styles.scene} style={{ "--t": 0 }}>
        <div className={styles.left}>
          <h2 className={styles.title}>Las maderas</h2>

          <div className={styles.wall}>
            {species.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={styles.plank}
                style={{ "--i": index }}
                onClick={() => goTo(index)}
                aria-label={`Ver ${item.name}`}
                aria-pressed={index === active}
              >
                <Image src={item.tabla} alt="" fill sizes="96px" loading="eager" className={styles.plankImage} />
                <span className={styles.plankName}>{item.name}</span>
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
              className={cx(styles.mobilePlank, index === picked && styles.mobilePlankActive)}
              onClick={() => setPicked(index)}
              aria-label={`Ver ${item.name}`}
              aria-pressed={index === picked}
            >
              <Image src={item.tabla} alt="" fill sizes="40px" className={styles.plankImage} />
            </button>
          ))}
        </div>
        <div className={styles.mobileCard} key={mobileItem.id}>
          <div className={styles.mobilePhoto}>
            <Image src={mobileItem.photo.src} alt={mobileItem.photo.alt} fill sizes="100vw" className={styles.photoImage} />
          </div>
          <SpeciesInfo item={mobileItem} />
        </div>
        <Footnote onRequest={onRequest} practical={practical} />
      </div>
    </section>
  );
}
