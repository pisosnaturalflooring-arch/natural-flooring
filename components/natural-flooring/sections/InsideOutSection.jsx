"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import styles from "./InsideOut.module.css";
import ConsultButton from "./ConsultButton";

/**
 * Una especie (lapacho) recorriendo piso → escalera → deck. Mismo mecanismo
 * que la pared de maderas: el scroll escribe --t y cada foto barre sola.
 */
export default function InsideOutSection({ insideOut }) {
  const trackRef = useRef(null);
  const sceneRef = useRef(null);
  const [active, setActive] = useState(0);
  const { stages } = insideOut;
  const last = stages.length - 1;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const t = Math.min(Math.max(progress, 0), 1) * last;
    sceneRef.current?.style.setProperty("--t", t.toFixed(3));
    const index = Math.round(t);
    setActive((current) => (current === index ? current : index));
  });

  const stage = stages[active];

  return (
    <section
      id="adentro-afuera"
      className={styles.section}
      style={{ "--count": stages.length }}
    >
      <div ref={trackRef} className={styles.track}>
        <div ref={sceneRef} className={styles.scene} style={{ "--t": 0 }}>
          <div className={styles.text}>
            <h2 className={styles.title}>{insideOut.title}</h2>
            <p className={styles.lead}>{insideOut.lead}</p>

            <div className={styles.steps}>
              <span className={styles.line} aria-hidden="true">
                <span className={styles.lineFill} />
              </span>
              <ol className={styles.stepList}>
                {stages.map((item, index) => (
                  <li
                    key={item.id}
                    className={styles.step}
                    style={{ "--i": index }}
                    aria-current={index === active ? "step" : undefined}
                  >
                    <span className={styles.dot} aria-hidden="true" />
                    {item.label}
                  </li>
                ))}
              </ol>
            </div>

            <p className={styles.caption} key={stage.id} aria-live="polite">
              {stage.text}
            </p>

            <ConsultButton href={insideOut.href}>Consultar por lapacho</ConsultButton>
          </div>

          <div className={styles.frame}>
            {stages.map((item, index) => (
              <span
                key={item.id}
                className={styles.layer}
                style={{ "--i": index }}
              >
                <Image
                  src={item.photo.src}
                  alt={index === active ? item.photo.alt : ""}
                  fill
                  sizes="(max-width: 899px) 100vw, 560px"
                  className={styles.image}
                />
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.tail} aria-hidden="true" />
    </section>
  );
}
