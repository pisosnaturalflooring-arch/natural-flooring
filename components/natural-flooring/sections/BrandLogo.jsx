import styles from "../SiteChrome.module.css";

/**
 * Isotipo oficial Natural Flooring extraído del manual de marca.
 * Archivo: /public/logo-natural-flooring.webp (128 px, con transparencia; el PNG original de 314 px queda como fuente).
 *
 * Por defecto se envuelve en un disco blanco para garantizar legibilidad
 * sobre fondos oscuros. Pasar `bg={false}` para el isotipo desnudo.
 */
export function NaturalFlooringMark({
  size = 32,
  title = "Natural Flooring",
  className,
  bg = true,
}) {
  const img = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/logo-natural-flooring.webp"
      alt={title}
      width={size}
      height={size}
      style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
    />
  );

  return (
    <span
      className={`${bg ? styles.brandMarkOnDark : styles.brandMarkBare}${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size }}
    >
      {img}
    </span>
  );
}
