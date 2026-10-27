import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../NaturalFlooringPage.module.css";
import { sanitizePhoneInput } from "../../../lib/leadValidation.mjs";
import imageManifest from "../../../lib/image-manifest.json";
import { preparedImageUrl } from "../../../lib/image-presets.mjs";
import {
  readPromoStatus,
  shouldAutoOpen,
  shouldShowPill,
  writePromoStatus,
} from "../promoPreference.mjs";

const PROMO_IMAGE = "/images/roble-eslabonia-1.jpg";

export default function NewsletterPopup() {
  // null mientras no leimos localStorage: en el server no existe, y renderizar
  // algo distinto en cliente y server rompe la hidratacion.
  const [status, setStatus] = useState(null);
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [formState, setFormState] = useState("idle"); // idle | loading | ok | error
  const [errorMsg, setErrorMsg] = useState("");
  // De donde salio esta apertura: va al mail para saber que convierte mas,
  // si el popup que salta solo o la pastilla que el visitante busca.
  const [openedFrom, setOpenedFrom] = useState("popup-scroll");

  const inputRef = useRef(null);
  const modalRef = useRef(null);
  // Al pasar a "listo" el contenido es mucho mas corto que el formulario. Sin
  // congelar la altura el modal se encoge de golpe y la foto salta.
  const [lockedHeight, setLockedHeight] = useState(null);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    setStatus(readPromoStatus(window.localStorage));
    // preview manual: agregar ?popup=1 a la URL para verlo al instante
    if (window.location.search.includes("popup=1")) {
      setIsPreview(true);
      setOpenedFrom("preview");
    }
  }, []);

  useEffect(() => {
    if (!isPreview) return undefined;
    const timer = setTimeout(() => setOpen(true), 300);
    return () => clearTimeout(timer);
  }, [isPreview]);

  /**
   * Apertura automatica al scrollear pasada la primera pantalla.
   *
   * Depende de `status` a proposito: antes el listener se registraba una sola
   * vez al montar y solo se desarmaba cuando disparaba, asi que alguien que
   * abria por la pastilla sin haber scrolleado y se suscribia lo dejaba armado
   * — y el primer scroll posterior le reabria el modal con el "listo" adentro.
   * Ahora suscribirse o cerrar cambia el estado y la limpieza lo desarma.
   */
  useEffect(() => {
    if (isPreview || open || !shouldAutoOpen(status)) return undefined;

    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.7) setOpen(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // por si la pagina ya viene scrolleada
    return () => window.removeEventListener("scroll", onScroll);
  }, [status, open, isPreview]);

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
        body: JSON.stringify({ phone, source: openedFrom }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No pudimos registrar tu teléfono.");
      setLockedHeight(modalRef.current?.offsetHeight ?? null);
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
          onClick={() => {
            setLockedHeight(null);
            setOpenedFrom("promo-pill");
            setOpen(true);
          }}
          aria-label="Ver la promoción: 10% de descuento en tu primer presupuesto"
        >
          <span className={styles.promoPillMark}>10%</span>
          <span className={styles.promoPillText}>OFF</span>
        </button>
      )}

      {open && (
        <div className={styles.promoOverlay} onClick={close}>
          <div
            ref={modalRef}
            className={styles.promoModal}
            style={lockedHeight ? { minHeight: `${lockedHeight}px` } : undefined}
            role="dialog"
            aria-modal="true"
            aria-labelledby="promo-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className={styles.promoFigure}
              style={{ backgroundImage: `url(${preparedImageUrl(imageManifest[PROMO_IMAGE], { width: 960 })})` }}
              role="img"
              aria-label="Parquet de roble lustrado en un ambiente con luz natural"
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
                      onChange={(event) => {
                        setPhone(sanitizePhoneInput(event.target.value));
                        // Que el error no siga en pantalla mientras lo esta corrigiendo.
                        if (formState === "error") setFormState("idle");
                      }}
                      autoComplete="tel"
                      aria-describedby={formState === "error" ? "promo-error" : undefined}
                    />

                    <p className={styles.promoError} id="promo-error" aria-live="polite">
                      {formState === "error" ? errorMsg : ""}
                    </p>

                    <button
                      type="submit"
                      className={styles.promoSubmit}
                      disabled={formState === "loading"}
                    >
                      {formState === "loading" ? "Enviando…" : "Quiero el descuento"}
                    </button>
                  </form>

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
