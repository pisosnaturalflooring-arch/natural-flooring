"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import { links } from "../data";
import { NaturalFlooringMark } from "./BrandLogo";
import { ClockIcon, EmailIcon, ExternalLink, InstagramIcon, MapPinIcon, MercadoLibreIcon, PhoneIcon, WhatsAppIcon } from "./shared";

export default function FooterSection({ footer, footerLinks, instagramHref, whatsappHref }) {
  const { scrollY } = useScroll();
  const [showTop, setShowTop] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowTop(latest > 600);
  });

  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <Reveal direction="up" delay={0}>
          <div className={styles.logo}>
            <NaturalFlooringMark size={56} />
            <span className={styles.logoText}>
              <span className={styles.logoTop}>Natural Flooring</span>
              <span className={styles.logoSub}>Pisos &amp; Escaleras · San Fernando</span>
            </span>
          </div>
          <p className={styles.footerText}>{footer.description}</p>
          <div className={styles.footerSocials}>
            <ExternalLink href={instagramHref} className={styles.footerSocial} ariaLabel="Instagram">
              <InstagramIcon />
            </ExternalLink>
            <ExternalLink href={whatsappHref} className={styles.footerSocial} ariaLabel="WhatsApp">
              <WhatsAppIcon />
            </ExternalLink>
            <ExternalLink href={links.mlStore} className={styles.footerSocial} ariaLabel="Mercado Libre">
              <MercadoLibreIcon />
            </ExternalLink>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.08}>
          <nav aria-label="Footer navigation">
            <div className={styles.footerHeading}>Navegación</div>
            <div className={styles.footerLinks}>
              {footerLinks.map((link) => (
                <a key={link.href} href={link.href} className={styles.footerLink}>
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        </Reveal>

        <Reveal direction="up" delay={0.16}>
          <div className={styles.footerHeading}>Contacto</div>
          <div className={styles.footerMetaList}>
            <div className={styles.footerMetaRow}>
              <MapPinIcon />
              <div>
                <div>{footer.addressLine1}</div>
                <div>{footer.addressLine2}</div>
              </div>
            </div>
            <div className={styles.footerMetaRow}>
              <PhoneIcon />
              <ExternalLink href={links.phone} className={styles.footerMetaLink}>
                +54 11 6997-7725
              </ExternalLink>
            </div>
            <div className={styles.footerMetaRow}>
              <EmailIcon />
              <ExternalLink href={links.email} className={styles.footerMetaLink}>
                pisosnaturalflooring@gmail.com
              </ExternalLink>
            </div>
            <div className={styles.footerMetaRow}>
              <ClockIcon />
              <div>
                <div>{footer.hoursWeek}</div>
                <div>{footer.hoursSaturday}</div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.24}>
          <div className={styles.footerHeading}>Presupuesto gratis</div>
          <p className={styles.footerText}>{footer.ctaText}</p>
          <ExternalLink href={whatsappHref} className={styles.footerCta}>
            <WhatsAppIcon />
            Escribinos ahora
          </ExternalLink>
        </Reveal>
      </div>

      <div className={styles.footerBottom}>
        <span>{footer.copyright}</span>
      </div>

      {/* Back to top button */}
      <motion.button
        type="button"
        className={styles.backToTop}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showTop ? 1 : 0, scale: showTop ? 1 : 0.8, pointerEvents: showTop ? "auto" : "none" }}
        transition={{ duration: 0.25 }}
        aria-label="Volver al inicio"
      >
        ↑
      </motion.button>
    </footer>
  );
}

