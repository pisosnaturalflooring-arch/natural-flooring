"use client";

import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { ExternalLink, SectionHead } from "./shared";

export default function ReviewsSection({ mapsHref, mapsAllReviewsHref, reviewsPrimary, reviewsSecondary }) {
  return (
    <section className={styles.lightSection} id="resenas">
      <SectionHead
        label="Lo que dicen nuestros clientes"
        title={
          <>
            +15 AÑOS
            <br />
            DE CONFIANZA
          </>
        }
        linkHref={mapsHref}
        linkLabel="Ver reseñas en Google →"
      />

      <div className={styles.reviewsGrid}>
        {reviewsPrimary.map((review, index) => (
          <Reveal
            key={`${review.author}-${review.when}`}
            as="article"
            delay={0.07 * index}
            className={styles.reviewCardLight}
          >
            <div className={styles.reviewTop}>
              <div className={styles.reviewRating}>{review.rating}</div>
              <div className={styles.reviewWhen}>{review.when}</div>
            </div>
            <p className={styles.reviewQuote}>{review.quote}</p>
            <div className={styles.reviewAuthorRow}>
              <div className={styles.reviewAvatar}>{review.initial}</div>
              <div>
                <div className={styles.reviewAuthor}>{review.author}</div>
                <div className={styles.reviewMeta}>{review.meta}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className={styles.reviewsGridSecondary}>
        {reviewsSecondary.map((review, index) => (
          <Reveal
            key={`${review.author}-${review.when}`}
            as="article"
            delay={0.07 * index}
            className={styles.reviewCardDark}
          >
            <div className={styles.reviewTop}>
              <div className={styles.reviewRatingInverse}>{review.rating}</div>
              <div className={styles.reviewWhen}>{review.when}</div>
            </div>
            <p className={styles.reviewQuoteInverse}>{review.quote}</p>
            <div className={styles.reviewAuthorRow}>
              <div className={styles.reviewAvatarInverse}>{review.initial}</div>
              <div>
                <div className={styles.reviewAuthorInverse}>{review.author}</div>
                <div className={styles.reviewMeta}>{review.meta}</div>
              </div>
            </div>
          </Reveal>
        ))}

        <Reveal delay={0.14} className={styles.reviewScoreCard}>
          <div className={styles.reviewScoreValue}>5.0</div>
          <div className={styles.reviewRating}>★★★★★</div>
          <div className={styles.reviewScoreLabel}>Calificación en Google</div>
          <ExternalLink href={mapsAllReviewsHref} className={styles.reviewScoreLink}>
            Ver todas →
          </ExternalLink>
        </Reveal>
      </div>
    </section>
  );
}
