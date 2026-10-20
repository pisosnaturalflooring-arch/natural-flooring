import Image from "next/image";
import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { ExternalLink } from "./shared";

const WHATSAPP_SHOWROOM =
  "https://api.whatsapp.com/send?phone=5491169977725&text=Hola!%20Me%20gustar%C3%ADa%20agendar%20una%20visita%20al%20showroom.";

export default function BookingSection() {
  return (
    <section className={styles.bookingSection} id="agenda">
      <div className={styles.bookingGrid}>

        {/* Photo side */}
        <div className={styles.bookingPhoto}>
          <Image
            fill
            src="/images/showroom-frente.jpg"
            alt="Showroom Natural Floorings — San Fernando"
            className={styles.bookingPhotoImg}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className={styles.bookingPhotoOverlay}>
            <span className={styles.bookingPhotoTag}>San Fernando · Showroom</span>
          </div>
        </div>

        {/* Content side */}
        <Reveal className={styles.bookingContent}>
          <p className={styles.sectionLabelInverse}>Sin costo · Sin compromiso</p>
          <h2 className={styles.bookingTitle}>
            VISITÁ EL SHOWROOM
          </h2>
          <p className={styles.bookingText}>
            Más de 200 muestras disponibles. Venimos a medir a tu casa o te esperamos en el local —
            elegí lo que te resulte más cómodo.
          </p>

          <ul className={styles.bookingFeatures}>
            <li>Asesoramiento sin cargo y sin compromiso</li>
            <li>Presupuesto detallado en 24 horas</li>
            <li>Instalación en fecha, trabajo prolijo</li>
            <li>Garantía de obra incluida</li>
          </ul>

          <ExternalLink href={WHATSAPP_SHOWROOM} className={styles.bookingCta}>
            Agendá tu visita por WhatsApp →
          </ExternalLink>
        </Reveal>

      </div>
    </section>
  );
}
