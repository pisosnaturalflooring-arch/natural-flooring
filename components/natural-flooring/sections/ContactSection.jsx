"use client";

import Image from "next/image";
import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { ContactGlyph, ExternalLink, WhatsAppIcon } from "./shared";

export default function ContactSection({ contactItems, whatsappHref }) {
  return (
    <section className={styles.contactSection} id="contacto">

      {/* Left — showroom photo, full bleed */}
      <div className={styles.contactPhoto}>
        <Image
          fill
          src="/images/showroom-frente.jpg"
          alt="Showroom Natural Flooring — 3 de Febrero 234, San Fernando"
          className={styles.contactPhotoImg}
          sizes="(max-width: 768px) 100vw, 55vw"
        />
        <div className={styles.contactPhotoOverlay}>
          <div className={styles.contactPhotoBottom}>
            <span className={styles.contactPhotoTag}>Showroom · San Fernando</span>
            <p className={styles.contactPhotoSub}>
              3 de Febrero 234 · Más de 200 muestras disponibles
            </p>
          </div>
        </div>
      </div>

      {/* Right — contact info + map stacked */}
      <div className={styles.contactRight}>
        <Reveal className={styles.contactHead}>
          <p className={styles.sectionLabelInverse}>Contacto</p>
          <h2 className={styles.sectionTitleInverse}>
            HABLEMOS DE TU PROYECTO
          </h2>
          <p className={styles.contactIntro}>
            Venís al showroom o te visitamos en casa — asesoramiento y presupuesto sin cargo.
          </p>
        </Reveal>

        <div className={styles.contactRows}>
          {contactItems.map((item, i) =>
            item.href ? (
              <Reveal key={item.label} delay={0.05 * i} as="span">
                <ExternalLink href={item.href} className={styles.contactRow} ariaLabel={item.label}>
                  <span className={styles.contactRowIcon}><ContactGlyph kind={item.kind} /></span>
                  <span>
                    <span className={styles.contactLabel}>{item.label}</span>
                    <span className={styles.contactValue}>{item.value}</span>
                  </span>
                </ExternalLink>
              </Reveal>
            ) : (
              <Reveal key={item.label} delay={0.05 * i} className={styles.contactRow}>
                <span className={styles.contactRowIcon}><ContactGlyph kind={item.kind} /></span>
                <span>
                  <span className={styles.contactLabel}>{item.label}</span>
                  <span className={styles.contactValue}>{item.value}</span>
                </span>
              </Reveal>
            )
          )}
        </div>

        <ExternalLink href={whatsappHref} className={styles.whatsappButton}>
          <WhatsAppIcon fill="white" />
          Escribinos por WhatsApp
        </ExternalLink>

        {/* Map — lives inside the right panel */}
        <div className={styles.mapWrap}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d415.5!2d-58.5638822!3d-34.4364347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bca5177fb7389d%3A0xa8753dd613920f6f!2sNatural%20flooring!5e0!3m2!1ses!2sar!4v1714000000000"
            title="Mapa Natural Flooring"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

    </section>
  );
}
