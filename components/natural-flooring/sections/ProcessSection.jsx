import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { ExternalLink, cx } from "./shared";

export default function ProcessSection({ processSteps, whatsappHref }) {
  return (
    <section className={styles.processSection} id="proceso">
      <div className={styles.processInner}>

        <Reveal className={styles.processLeft}>
          <p className={styles.sectionLabelInverse}>Simple y transparente</p>
          <h2 className={cx(styles.sectionTitleInverse, styles.processHeading)}>
            CÓMO TRABAJAMOS
          </h2>
          <ExternalLink
            href={whatsappHref}
            className={cx(styles.primaryButton, styles.processCtaBtn)}
          >
            Empezá tu proyecto →
          </ExternalLink>
        </Reveal>

        <div className={styles.processSteps}>
          {processSteps.map((step, index) => (
            <Reveal key={step.num} delay={0.08 * index} className={styles.processStep}>
              {/* Un punto por paso sobre una línea continua que une todo el recorrido. */}
              <div className={styles.processTimeline}>
                <div className={styles.processTimelineDot} />
                {index < processSteps.length - 1 && (
                  <div className={styles.processTimelineLine} />
                )}
              </div>
              <div className={styles.processStepBody}>
                <div className={styles.processStepTitle}>{step.title}</div>
                <p className={styles.processDesc}>{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}

