"use client";

import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { ContactGlyph, ExternalLink, WhatsAppIcon } from "./shared";

export default function ContactSection({ contactItems, whatsappHref }) {
  return (
    <section className={styles.contactSection} id="contacto">
      <Reveal className={styles.contactTop}>
        <p className={styles.sectionLabelInverse}>Contacto</p>
        <h2 className={styles.sectionTitleInverse}>
          HABLEMOS DE
          <br />
          TU PROYECTO
        </h2>
      </Reveal>

      <div className={styles.contactGrid}>
        <div>
          <p className={styles.contactIntro}>
            Asesoramiento sin cargo · Showroom en San Fernando · Presupuesto en 24hs · Visita a
            domicilio
          </p>

          <div className={styles.contactItems}>
            {contactItems.map((item, index) =>
              item.href ? (
                <Reveal key={item.label} delay={0.06 * index} as="span">
                  <ExternalLink
                    href={item.href}
                    className={styles.contactItem}
                    ariaLabel={item.label}
                  >
                    <div className={styles.contactIcon}>
                      <ContactGlyph kind={item.kind} />
                    </div>
                    <div>
                      <div className={styles.contactLabel}>{item.label}</div>
                      <div className={styles.contactValue}>{item.value}</div>
                    </div>
                  </ExternalLink>
                </Reveal>
              ) : (
                <Reveal key={item.label} delay={0.06 * index} className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <ContactGlyph kind={item.kind} />
                  </div>
                  <div>
                    <div className={styles.contactLabel}>{item.label}</div>
                    <div className={styles.contactValue}>{item.value}</div>
                  </div>
                </Reveal>
              )
            )}
          </div>

          <ExternalLink href={whatsappHref} className={styles.whatsappButton}>
            <WhatsAppIcon fill="white" />
            Escribinos por WhatsApp
          </ExternalLink>
        </div>

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
