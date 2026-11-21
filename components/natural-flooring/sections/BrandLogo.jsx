import styles from "../SiteChrome.module.css";

/**
 * Isotipo oficial Natural Flooring extraído del manual de marca.
 * La imagen va embebida en SiteChrome.module.css (.brandMarkImg) para que se vea
 * con la primera pintura; la fuente es /public/logo-natural-flooring.png (314 px).
 *
 * Por defecto se envuelve en un disco blanco para garantizar legibilidad
 * sobre fondos oscuros. Pasar `bg={false}` para el isotipo desnudo.
 * El resto de las props (por ejemplo `data-hero-logo`) van al contenedor.
 */
export function NaturalFlooringMark({
  size = 32,
  title = "Natural Flooring",
  className,
  bg = true,
  ...rest
}) {
  return (
    <span
      {...rest}
      className={`${bg ? styles.brandMarkOnDark : styles.brandMarkBare}${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size }}
    >
      <span className={styles.brandMarkImg} role={title ? "img" : undefined} aria-label={title || undefined} aria-hidden={title ? undefined : true} />
    </span>
  );
}
