"use client";

import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { ExternalLink, SectionHead } from "./shared";

export default function ProcessSection({ processSteps, whatsappHref }) {
  return (
    <section className={styles.processSection} id="proceso">
      <SectionHead
        label="Simple y transparente"
        title={
          <>
            CÓMO
            <br />
            TRABAJAMOS
          </>
        }
        inverse
      />

      <div className={styles.processSteps}>
        {processSteps.map((step, index) => (
          <Reveal key={step.num} delay={0.1 * index} className={styles.processStep}>
            <div className={styles.processNum}>{step.num}</div>
            <div className={styles.processTitle}>{step.title}</div>
            <p className={styles.processDesc}>{step.description}</p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3} className={styles.processCta}>
        <ExternalLink href={whatsappHref} className={styles.primaryButton}>
          Empezá tu proyecto →
        </ExternalLink>
      </Reveal>
    </section>
  );
}
