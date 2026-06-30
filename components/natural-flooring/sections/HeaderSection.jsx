"use client";

import { useEffect, useState } from "react";
import styles from "../NaturalFlooringPage.module.css";
import { links, navLinks } from "../data";
import { NaturalFlooringMark } from "./BrandLogo";
import { ExternalLink, cx } from "./shared";

export default function HeaderSection() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const SECTION_NAV_MAP = {
      "asesor":                  "#asesor",
      "materiales-asesor":       "#asesor",
      "categorias":              "#categorias",
      "por-que-elegirnos":       "#categorias",
      "proceso":                 "#categorias",
      "escaleras":               "#categorias",
      "obras":                   "#proyectos",
      "antes-despues":           "#proyectos",
      "comercial":               "#proyectos",
      "proyectos":               "#proyectos",
      "productos-mantenimiento": "#productos-mantenimiento",
      "resenas":                 "#productos-mantenimiento",
      "redes":                   "#contacto",
      "agenda":                  "#contacto",
      "contacto":                "#contacto",
    };

    let rafId;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const focusY = window.scrollY + window.innerHeight * 0.4;
        const activeElements = Object.keys(SECTION_NAV_MAP)
          .map((id) => document.getElementById(id))
          .filter(Boolean)
          .sort((a, b) => a.offsetTop - b.offsetTop);

        let active = "";
        for (const el of activeElements) {
          if (el.offsetTop <= focusY) active = SECTION_NAV_MAP[el.id];
        }
        setActiveSection(active);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <header className={cx(styles.header, scrolled && styles.headerScrolled)}>
      <a href="#" className={styles.logo}>
        <NaturalFlooringMark size={48} />
        <span className={styles.logoText}>
          <span className={styles.logoTop}>Natural Flooring</span>
          <span className={styles.logoSub}>Pisos & Escaleras · San Fernando</span>
        </span>
      </a>

      <nav className={styles.nav}>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={cx(styles.navLink, activeSection === link.href && styles.navLinkActive)}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className={styles.headerIconGroup}>
        <ExternalLink href={links.whatsappGeneral} className={styles.navCta} ariaLabel="Consultanos por WhatsApp">
          Consultanos
        </ExternalLink>
      </div>
    </header>
  );
}
