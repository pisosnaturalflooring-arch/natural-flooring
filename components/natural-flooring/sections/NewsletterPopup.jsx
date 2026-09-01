import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../NaturalFlooringPage.module.css";
import {
  readPromoStatus,
  shouldAutoOpen,
  shouldShowPill,
  writePromoStatus,
} from "../promoPreference.mjs";

const PROMO_IMAGE = "/images/parquet-espiga-av25-1.jpg";

export default function NewsletterPopup() {
  // null mientras no leimos localStorage: en el server no existe, y renderizar
  // algo distinto en cliente y server rompe la hidratacion.
  const [status, setStatus] = useState(null);
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [formState, setFormState] = useState("idle"); // idle | loading | ok | error
  const [errorMsg, setErrorMsg] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    const stored = readPromoStatus(window.localStorage);
    setStatus(stored);

    // preview manual: agregar ?popup=1 a la URL para verlo al instante
    if (window.location.search.includes("popup=1")) {
      const timer = setTimeout(() => setOpen(true), 300);
      return () => clearTimeout(timer);
    }

    if (!shouldAutoOpen(stored)) return undefined;

    // aparece cuando el usuario scrollea pasada la primera pantalla
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.7) {
        setOpen(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // por si la pagina ya viene scrolleada
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const remember = useCallback((next) => {
    setStatus(next);
    writePromoStatus(window.localStorage, next);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    // Quien ya se suscribio no vuelve a "cerrado": sigue estando adentro.
    setStatus((current) => {
      if (current === "subscribed") return current;
      writePromoStatus(window.localStorage, "dismissed");
      return "dismissed";
    });
  }, []);

  // Escape cierra, y el fondo no scrollea mientras el modal esta abierto.
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  useEffect(() => {
    if (open && formState !== "ok") inputRef.current?.focus();
  }, [open, formState]);

  async function submit(event) {
    event.preventDefault();
    if (formState === "loading") return;

    if (phone.replace(/\D/g, "").length < 8) {
      setErrorMsg("Ingresá un teléfono válido, con característica.");
      setFormState("error");
      return;
    }

    setFormState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, source: "popup-scroll" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No pudimos registrar tu teléfono.");
      setFormState("ok");
      remember("subscribed");
      setTimeout(() => setOpen(false), 3200);
    } catch (err) {
      setErrorMsg(err.message || "No pudimos registrar tu teléfono.");
      setFormState("error");
    }
  }

  if (status === null) return null;

  return (
    <>
      {shouldShowPill(status) && !open && (
        <button
          type="button"
          className={styles.promoPill}
          onClick={() => setOpen(true)}
          aria-label="Ver la promoción: 10% de descuento en tu primer presupuesto"
        >
          <span className={styles.promoPillMark}>10%</span>
          <span className={styles.promoPillText}>OFF</span>
        </button>
      )}

      {open && (
        <div className={styles.promoOverlay} onClick={close}>
          <div
            className={styles.promoModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="promo-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className={styles.promoFigure}
              style={{ backgroundImage: `url(${PROMO_IMAGE})` }}
              role="img"
              aria-label="Piso de roble colocado en espiga en un living"
            />

            <div className={styles.promoBody}>
              <button
                type="button"
                className={styles.promoClose}
                onClick={close}
                aria-label="Cerrar"
              >
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                  <path
                    d="M2 2l12 12M14 2L2 14"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {formState === "ok" ? (
                <div className={styles.promoSuccess}>
                  <span className={styles.promoSuccessMark} aria-hidden="true">
                    ✓
                  </span>
                  <h3 className={styles.promoTitle} id="promo-title">
                    Listo, te anotamos
                  </h3>
                  <p className={styles.promoText}>
                    Te escribimos al <strong>{phone}</strong> con el catálogo y tu descuento.
                  </p>
                </div>
              ) : (
                <>
                  <span className={styles.promoBadge}>Promociones</span>
                  <h3 className={styles.promoTitle} id="promo-title">
                    10% OFF en tu primer presupuesto
                  </h3>
                  <p className={styles.promoText}>
                    Dejanos tu teléfono y te escribimos por WhatsApp con el catálogo completo,
                    tu descuento, y las promos que vayamos sacando.
                  </p>

                  <form className={styles.promoForm} onSubmit={submit} noValidate>
                    <label className={styles.promoLabel} htmlFor="promo-phone">
                      Tu teléfono
                    </label>
                    <input
                      id="promo-phone"
                      ref={inputRef}
                      type="tel"
                      inputMode="tel"
                      className={styles.promoInput}
                      placeholder="11 2345-6789"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      autoComplete="tel"
                      aria-describedby={formState === "error" ? "promo-error" : undefined}
                    />
                    <button
                      type="submit"
                      className={styles.promoSubmit}
                      disabled={formState === "loading"}
                    >
                      {formState === "loading" ? "Enviando…" : "Quiero el descuento"}
                    </button>
                  </form>

                  {formState === "error" && (
                    <p className={styles.promoError} id="promo-error" role="alert">
                      {errorMsg}
                    </p>
                  )}

                  <p className={styles.promoFine}>
                    Solo te escribimos nosotros. Pedís la baja cuando quieras.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
