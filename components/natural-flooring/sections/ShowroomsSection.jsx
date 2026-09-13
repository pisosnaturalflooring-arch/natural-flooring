"use client";

import Image from "next/image";
import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { ClockIcon, ExternalLink, MapPinIcon, SectionHead } from "./shared";

export default function ShowroomsSection({ showrooms }) {
  return (
    <section className={styles.altSection} id="showrooms">
      <SectionHead
        label="Showrooms"
        title={
          <>
            VENÍ A VER
            <br />
            LOS MATERIALES
          </>
        }
      />

      <div className={styles.showroomsGrid}>
        {showrooms.map((showroom, index) => (
          <Reveal key={showroom.name} delay={0.08 * index} className={styles.showroomCard}>
            <div className={styles.showroomImageWrap}>
              <Image
                fill
                src={showroom.image}
                alt={showroom.alt}
                className={styles.showroomImage}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className={styles.showroomBody}>
              <h3 className={styles.showroomName}>{showroom.name}</h3>
              <div className={styles.showroomRow}>
                <MapPinIcon />
                <span>{showroom.address}</span>
              </div>
              {showroom.hours ? (
                <div className={styles.showroomRow}>
                  <ClockIcon />
                  <span>{showroom.hours}</span>
                </div>
              ) : null}
              <ExternalLink href={showroom.href} className={styles.sectionLink}>
                Cómo llegar →
              </ExternalLink>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
