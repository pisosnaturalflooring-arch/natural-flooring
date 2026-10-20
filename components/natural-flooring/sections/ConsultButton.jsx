import styles from "./ConsultButton.module.css";
import { ExternalLink, WhatsAppIcon } from "./shared";

/** Botón verde de WhatsApp con el mensaje ya armado ("Consultar por lapacho"). */
export default function ConsultButton({ href, children, size }) {
  return (
    <ExternalLink href={href} className={size === "small" ? `${styles.button} ${styles.small}` : styles.button}>
      <WhatsAppIcon />
      <span>{children}</span>
    </ExternalLink>
  );
}
