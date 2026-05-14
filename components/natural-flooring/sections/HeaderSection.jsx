"use client";

import { useEffect, useState } from "react";
import styles from "../NaturalFlooringPage.module.css";
import { links, navLinks } from "../data";
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
    // Map every section on the page to the nav link it belongs to
    const SECTION_NAV_MAP = {
      "categorias":              "#categorias",
      "obras":                   "#categorias",
      "por-que-elegirnos":       "#por-que-elegirnos",
      "proceso":                 "#por-que-elegirnos",
      "escaleras":               "#por-que-elegirnos",
      "antes-despues":           "#proyectos",
      "comercial":               "#proyectos",
      "proyectos":               "#proyectos",
      "productos-mantenimiento": "#productos-mantenimiento",
      "resenas":                 "#productos-mantenimiento",
      "redes":                   "#contacto",
      "agenda":                  "#contacto",
      "contacto":                "#contacto",
    };

    const sections = Object.keys(SECTION_NAV_MAP)
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(SECTION_NAV_MAP[entry.target.id]);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header className={cx(styles.header, scrolled && styles.headerScrolled)}>
      <a href="#" className={styles.logo}>
        <span className={styles.logoTop}>Natural Flooring</span>
        <span className={styles.logoSub}>Pisos & Escaleras · San Fernando</span>
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

      <ExternalLink href={links.whatsappGeneral} className={styles.navCta}>
        WhatsApp
      </ExternalLink>
    </header>
  );
}
