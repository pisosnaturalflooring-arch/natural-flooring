"use client";

import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";

const CALENDLY_URL =
  "https://calendly.com/manupandelo12?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=f4f1e8&text_color=252e18&primary_color=4a5e35&locale=es";

export default function BookingSection() {
  return (
    <section className={styles.bookingSection} id="agenda">
      <div className={styles.bookingGrid}>
        <Reveal>
          <p className={styles.sectionLabelInverse}>Sin costo · Sin compromiso</p>
          <h2 className={styles.bookingTitle}>
            AGENDÁ TU
            <br />
            PRESUPUESTO
          </h2>
          <p className={styles.bookingText}>
            Elegí el día y horario que mejor te quede — te atendemos en el local en San Fernando o
            coordinamos una visita a domicilio.
          </p>
          <ul className={styles.bookingFeatures}>
            <li>Asesoramiento sin cargo y sin compromiso</li>
            <li>Presupuesto detallado en 24 horas</li>
            <li>Instalación en fecha, trabajo prolijo</li>
            <li>Garantía de obra incluida</li>
          </ul>
        </Reveal>

        <div
          className={`calendly-inline-widget ${styles.bookingEmbed}`}
          data-url={CALENDLY_URL}
          style={{ height: "700px" }}
        />
      </div>
    </section>
  );
}
