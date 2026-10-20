"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Reveal.module.css";

/**
 * Aparición al entrar en pantalla, con IntersectionObserver y una transición
 * CSS. Antes usaba framer-motion: eso metía ~40 KB de JS en la carga inicial
 * de la home solo para hacer un fade.
 */
export function Reveal({
  as: Tag = "div",
  direction = "up",
  delay = 0,
  duration = 0.7,
  once = true,
  className,
  style,
  children,
  ...props
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={[styles.reveal, styles[direction], visible && styles.visible, className].filter(Boolean).join(" ")}
      style={{ ...style, "--reveal-delay": `${delay}s`, "--reveal-duration": `${duration}s` }}
      {...props}
    >
      {children}
    </Tag>
  );
}
