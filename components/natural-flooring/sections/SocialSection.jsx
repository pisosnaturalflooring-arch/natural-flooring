import Image from "next/image";
import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { ExternalLink, InstagramIcon } from "./shared";
import { SectionHead } from "./SectionHead";

function ReelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export default function SocialSection({ instagramPosts, instagramHref }) {
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
        {instagramPosts.map((post, index) => (
          <Reveal key={post.image} delay={0.06 * index}>
            <ExternalLink
              href={post.href}
              className={styles.socialCard}
              ariaLabel={`Ver en Instagram: ${post.alt}`}
            >
              <div className={styles.socialThumb}>
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 340px"
                  className={styles.socialThumbImg}
                />

                {post.isReel && (
                  <div className={styles.socialReelBadge}>
                    <ReelIcon />
                  </div>
                )}

                <div className={styles.socialCaptionBar}>
                  <span className={styles.socialCaptionText}>{post.caption}</span>
                  <InstagramIcon size={13} />
                </div>
              </div>
            </ExternalLink>
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
