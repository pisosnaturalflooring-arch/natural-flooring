import { useEffect, useState } from "react";
import styles from "../NaturalFlooringPage.module.css";

const STORAGE_KEY = "nf_news_v1";

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | ok | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // ya se suscribió o lo cerró antes → no molestar
    let seen = false;
    try {
      seen = !!localStorage.getItem(STORAGE_KEY);
    } catch {
      seen = false;
    }

    // preview manual: agregar ?popup=1 a la URL para verlo al instante
    const forced =
      typeof window !== "undefined" && window.location.search.includes("popup=1");

    if (seen && !forced) return undefined;

    if (forced) {
      const t = setTimeout(() => setOpen(true), 300);
      return () => clearTimeout(t);
    }

    // aparece cuando el usuario scrollea hacia abajo (pasada la primera pantalla)
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.7) {
        setOpen(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // por si la página ya viene scrolleada
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function remember() {
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      /* noop */
    }
  }

  function close() {
    setOpen(false);
    remember();
  }

  async function submit(e) {
    e.preventDefault();
    if (status === "loading") return;
    if (phone.replace(/\D/g, "").length < 8) {
      setErrorMsg("Ingresá un teléfono válido.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, source: "popup-scroll" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo registrar el teléfono.");
      setStatus("ok");
      remember();
      setTimeout(() => setOpen(false), 3200);
    } catch (err) {
      setErrorMsg(err.message || "No se pudo registrar el teléfono.");
      setStatus("error");
    }
  }

  if (!open) return null;

  return (
    <div className={styles.newsOverlay} onClick={close}>
      <div
        className={styles.newsModal}
        role="dialog"
        aria-modal="true"
        aria-label="Oferta especial"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.newsClose} onClick={close} aria-label="Cerrar">
          ✕
        </button>

        {status === "ok" ? (
          <div className={styles.newsSuccess}>
            <div className={styles.newsSuccessIcon}>✓</div>
            <h3 className={styles.newsTitle}>¡Listo!</h3>
            <p className={styles.newsText}>
              Te vamos a escribir al <strong>{phone}</strong> con el catálogo y tu descuento.
              ¡Gracias!
            </p>
          </div>
        ) : (
          <>
            <span className={styles.newsBadge}>Solo por hoy</span>
            <h3 className={styles.newsTitle}>10% OFF en tu primer presupuesto</h3>
            <p className={styles.newsText}>
              Dejanos tu teléfono y te escribimos por WhatsApp con el{" "}
              <strong>catálogo completo</strong> más un <strong>descuento</strong> para tu próxima
              obra.
            </p>
            <form className={styles.newsForm} onSubmit={submit}>
              <input
                type="tel"
                inputMode="tel"
                className={styles.newsInput}
                placeholder="11 2345-6789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                required
              />
              <button
                type="submit"
                className={styles.newsSubmit}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Enviando…" : "Quiero el descuento"}
              </button>
            </form>
            {status === "error" && <p className={styles.newsError}>{errorMsg}</p>}
            <p className={styles.newsFine}>Te contactamos solo por tu consulta. Sin spam.</p>
          </>
        )}
      </div>
    </div>
  );
}
