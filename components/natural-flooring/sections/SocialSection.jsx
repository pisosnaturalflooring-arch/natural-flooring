"use client";

import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { ExternalLink, InstagramIcon, SectionHead } from "./shared";

export default function SocialSection({ instagramEmbeds, instagramHref }) {
  return (
    <section className={styles.socialSection} id="redes">
      <SectionHead
        label="Seguinos en Instagram"
        title="NUESTRO CONTENIDO"
        inverse
        side={
          <Reveal>
            <ExternalLink
              href={instagramHref}
              className={styles.socialButton}
              ariaLabel="Abrir Instagram de Natural Floorings"
            >
              <InstagramIcon />
              @naturalfloorings
            </ExternalLink>
          </Reveal>
        }
      />

      <div className={styles.socialGrid}>
        {instagramEmbeds.map((embed, index) => (
          <Reveal key={embed} delay={0.08 * index} className={styles.socialCard}>
            <div className={styles.socialFrameWrap}>
              <iframe
                src={embed}
                className={styles.socialFrame}
                allowFullScreen
                scrolling="no"
                loading="lazy"
                title={`Instagram embed ${index + 1}`}
              />
            </div>
          </Reveal>
        ))}
      </div>

      <p className={styles.socialFooter}>
        Para ver el contenido completo visitá{" "}
        <ExternalLink href={instagramHref} className={styles.socialFooterLink}>
          @naturalfloorings
        </ExternalLink>{" "}
        en Instagram
      </p>
    </section>
  );
}
