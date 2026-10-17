import styles from "./ConsultButton.module.css";
import { ExternalLink, WhatsAppIcon } from "./shared";

/** Botón verde de WhatsApp con el mensaje ya armado ("Consultar por lapacho"). */
export default function ConsultButton({ href, children }) {
  return (
    <ExternalLink href={href} className={styles.button}>
      <WhatsAppIcon />
      <span>{children}</span>
    </ExternalLink>
  );
}
