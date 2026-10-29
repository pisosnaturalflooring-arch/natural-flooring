"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../SiteChrome.module.css";
import { links } from "../links";
import { NaturalFlooringMark } from "./BrandLogo";
import { ExternalLink, cx } from "./shared";

/** `navLinks` llega del servidor: así el catálogo que arma el menú no viaja en el JS del header. */
export default function HeaderSection({ navLinks }) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  // El botón de contacto aparece recién cuando los del hero dejan de verse.
  // En páginas sin hero (por ejemplo /productos) se muestra siempre.
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onPointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    const desktop = window.matchMedia("(min-width: 769px)");
    const onResize = () => { if (desktop.matches) setMenuOpen(false); };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [menuOpen]);

  // Se esconde al bajar y vuelve al subir. Un solo listener de scroll, con
  // rAF; React descarta los setState que no cambian el valor.
  useEffect(() => {
    let previous = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const latest = window.scrollY;
      setHidden(latest > 100 && latest > previous);
      setScrolled(latest > 24);
      previous = latest;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (window.location.pathname.startsWith("/productos")) {
      setActiveSection("/productos");
      return undefined;
    }

    const SECTION_NAV_MAP = {
      "nosotros":                "/#nosotros",
      "productos":               "/productos",
      "proceso":                 "/productos",
      "escaleras":               "/productos",
      "herramientas":            "/#herramientas",
      "proyectos":               "/#proyectos",
      "antes-despues":           "/#proyectos",
      "archivo":                 "/#proyectos",
      "productos-mantenimiento": "/productos",
      "resenas":                 "",
      "redes":                   "",
      "contacto":                "/#contacto",
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

  useEffect(() => {
    const heroCta = document.getElementById("hero-cta");
    if (!heroCta) {
      setShowCta(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setShowCta(!entry.isIntersecting),
      { rootMargin: "-76px 0px 0px 0px" }
    );
    observer.observe(heroCta);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      className={cx(styles.header, scrolled && styles.headerScrolled, hidden && !menuOpen && styles.headerHidden)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false);
      }}
    >
      <a href="/" className={styles.logo}>
        <NaturalFlooringMark size={48} />
        <span className={styles.logoText}>
          <span className={styles.logoTop}>Natural Flooring</span>
          <span className={styles.logoSub}>Pisos & Escaleras · San Fernando</span>
        </span>
      </a>

      <nav className={styles.nav} aria-label="Navegación principal">
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
                      <a href={group.href} className={styles.navDropdownAll}>
                        Ver todos <span aria-hidden="true">→</span>
                      </a>
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

      <button
        ref={menuButtonRef}
        type="button"
        className={styles.mobileMenuButton}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span>Menú</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
          <path d={menuOpen ? "m6 6 12 12M6 18 18 6" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      <nav id="mobile-navigation" className={styles.mobileNav} aria-label="Navegación móvil" hidden={!menuOpen}>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={cx(styles.mobileNavLink, activeSection === link.href && styles.mobileNavLinkActive)}
            aria-current={activeSection === link.href ? (link.href.includes("#") ? "location" : "page") : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <a href={links.whatsappGeneral} target="_blank" rel="noreferrer" className={styles.mobileNavCta} onClick={() => setMenuOpen(false)}>Consultanos por WhatsApp</a>
      </nav>

      <div className={cx(styles.headerIconGroup, !showCta && styles.headerCtaHidden)} inert={!showCta}>
        <ExternalLink href={links.whatsappGeneral} className={styles.navCta} ariaLabel="Consultanos por WhatsApp">
          Consultanos
        </ExternalLink>
      </div>
    </header>
  );
}
