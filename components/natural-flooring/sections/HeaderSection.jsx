"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "../NaturalFlooringPage.module.css";
import { links, navLinks } from "../data";
import { NaturalFlooringMark } from "./BrandLogo";
import { ExternalLink, cx } from "./shared";

export default function HeaderSection() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > 100 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 24);
  });

  useEffect(() => {
    const SECTION_NAV_MAP = {
      "nosotros":                "#nosotros",
      "garantia":                "#nosotros",
      "productos":               "#productos",
      "proceso":                 "#productos",
      "escaleras":               "#productos",
      "herramientas":            "#herramientas",
      "proyectos":               "#proyectos",
      "antes-despues":           "#proyectos",
      "archivo":                 "#proyectos",
      "productos-mantenimiento": "#productos",
      "resenas":                 "",
      "redes":                   "",
      "showrooms":               "#showrooms",
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
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={cx(styles.header, scrolled && styles.headerScrolled)}
    >
      <a href="#" className={styles.logo}>
        <NaturalFlooringMark size={48} />
        <span className={styles.logoText}>
          <span className={styles.logoTop}>Natural Flooring</span>
          <span className={styles.logoSub}>Pisos & Escaleras · San Fernando</span>
        </span>
      </a>

      <nav className={styles.nav}>
        {navLinks.map((link) =>
          link.groups ? (
            <div key={link.href} className={styles.navItem}>
              <a
                href={link.href}
                aria-haspopup="true"
                className={cx(styles.navLink, activeSection === link.href && styles.navLinkActive)}
              >
                {link.label}
                <span className={styles.navCaret} aria-hidden="true">▾</span>
              </a>
              <div className={styles.navDropdown}>
                <div className={styles.navDropdownGroups}>
                  {link.groups.map((group) => (
                    <div key={group.href}>
                      <a href={group.href} className={styles.navDropdownHeading}>
                        {group.label}
                      </a>
                      {group.items.map((item) => (
                        <a key={item.href} href={item.href} className={styles.navDropdownLink}>
                          {item.label}
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
                <a href={link.extra.href} className={styles.navDropdownExtra}>
                  {link.extra.label} →
                </a>
              </div>
            </div>
          ) : (
            <a
              key={link.href}
              href={link.href}
              className={cx(styles.navLink, activeSection === link.href && styles.navLinkActive)}
            >
              {link.label}
            </a>
          )
        )}
      </nav>

      <div className={styles.headerIconGroup}>
        <ExternalLink href={links.whatsappGeneral} className={styles.navCta} ariaLabel="Consultanos por WhatsApp">
          Consultanos
        </ExternalLink>
      </div>
    </motion.header>
  );
}
