"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../NaturalFlooringPage.module.css";
import { MIN_IMAGE_SIDE, isBigEnough } from "../../../lib/visualizerInput.mjs";
import { ERROR_CODES, describeError } from "../../../lib/visualizerErrors.mjs";
import { materialLibrary } from "../recommender/recommendationEngine.mjs";
import { VISUALIZER_STEPS, currentStep, isStepReachable } from "../visualizerSteps.mjs";
import CompareSlider from "./CompareSlider";
import { SectionHead, ExternalLink } from "./shared";

const SAMPLE_IMAGE = "/images/euca-rostrata-dormitorio.jpg";
const WHATSAPP_BASE = "https://api.whatsapp.com/send?phone=5491169977725&text=";

export default function FloorVisualizerSection() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [sizeHint, setSizeHint] = useState("auto");
  const [aspect, setAspect] = useState("4 / 3");
  const [material, setMaterial] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [resultUrl, setResultUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fallo, setFallo] = useState(null); // { code, retryAfterSeconds, error }
  const [requested, setRequested] = useState(null);
  const [dragging, setDragging] = useState(false);

  const objectUrlRef = useRef("");
  const pasoPrevioRef = useRef(0);
  const reduceMotion = useReducedMotion();

  const estado = { hasPhoto: Boolean(file), status, requested };
  const paso = currentStep(estado);
  const elegido = materialLibrary.find((m) => m.id === material);
  const indicePaso = VISUALIZER_STEPS.findIndex((s) => s.id === paso);
  const pasoAnterior = VISUALIZER_STEPS.slice(0, indicePaso)
    .reverse()
    .find((s) => isStepReachable(s.id, estado))?.id;

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    []
  );

  // La direccion no es decorativa: avanzar entra desde la derecha y volver
  // desde la izquierda, asi el movimiento dice hacia donde va el visitante.
  const direccion = indicePaso >= pasoPrevioRef.current ? 1 : -1;
  useEffect(() => {
    pasoPrevioRef.current = indicePaso;
  }, [indicePaso]);



  const selectFile = useCallback((f) => {
    const url = URL.createObjectURL(f);
    const img = new window.Image();

    img.onload = () => {
      if (!isBigEnough(img.naturalWidth, img.naturalHeight)) {
        URL.revokeObjectURL(url);
        setErrorMsg(
          `Esa foto es muy chica (${img.naturalWidth}×${img.naturalHeight}). Necesitamos al menos ${MIN_IMAGE_SIDE} píxeles de lado.`
        );
        return;
      }

      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = url;
      setFile(f);
      setPreviewUrl(url);
      setResultUrl("");
      setStatus("idle");
      setErrorMsg("");
      setRequested(null);

      // El tamano que se le pide a la IA sigue la forma de la foto original.
      const r = img.naturalWidth / img.naturalHeight;
      setSizeHint(r > 1.2 ? "1536x1024" : r < 0.83 ? "1024x1536" : "1024x1024");
      setAspect(`${img.naturalWidth} / ${img.naturalHeight}`);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      setErrorMsg("No pudimos leer esa imagen. Probá con un JPG, PNG o WEBP.");
    };

    img.src = url;
  }, []);

  function onFile(e) {
    const f = e.target.files?.[0];
    if (f) selectFile(f);
  }

  async function generar() {
    if (!file || !material) return;
    setStatus("loading");
    setErrorMsg("");
    setFallo(null);
    setRequested(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("material", material);
      fd.append("size", sizeHint);
      const res = await fetch("/api/visualizer", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setFallo({ code: data.code ?? ERROR_CODES.DESCONOCIDO, ...data });
        setStatus("error");
        return;
      }
      setResultUrl(data.image);
      setStatus("done");
    } catch {
      // Se cayo la red antes de llegar al servidor.
      setFallo({ code: ERROR_CODES.SERVICIO_CAIDO });
      setStatus("error");
    }
  }

  function reset() {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = "";
    setFile(null);
    setPreviewUrl("");
    setResultUrl("");
    setMaterial("");
    setStatus("idle");
    setErrorMsg("");
    setFallo(null);
    setRequested(null);
  }

  function descargar() {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `mi-piso-${material || "natural-flooring"}.png`;
    // Firefox exige que el enlace este en el documento para disparar la descarga.
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  const whatsappHref =
    WHATSAPP_BASE +
    encodeURIComponent(
      elegido
        ? `Hola! Probé ${elegido.label} en el visualizador de la web y quiero una cotización.`
        : "Hola! Usé el visualizador de la web y quiero una cotización."
    );

  return (
    <section id="visualizador" className={styles.visualizer}>
      <div className={styles.visualizerInner}>
        <SectionHead title="PROBÁ EL PISO EN TU AMBIENTE" />
        <p className={styles.visualizerLead}>
          Subí una foto de tu ambiente y elegí un material: la inteligencia artificial reemplaza el
          piso conservando la luz, las sombras y la perspectiva reales.
        </p>

        {/* Se mueve la tarjeta completa, fondo y sombra incluidos: antes se
            deslizaba solo el contenido dentro de un marco quieto y se leia como
            una parte suelta, no como un cambio de paso.

            La key la remonta al instante. Sin AnimatePresence a proposito: ese
            modo condiciona el montado del paso nuevo a que termine la salida del
            anterior, y una animacion trabada deja al visitante mirando el paso
            viejo con el contador nuevo — lo vi pasar. */}
        <motion.div
          key={paso}
          className={styles.visualizerPanel}
          initial={{ opacity: 0, x: reduceMotion ? 0 : direccion * 44 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduceMotion ? 0.12 : 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className={styles.stepProgress}>
            <ol className={styles.stepSegments}>
              {VISUALIZER_STEPS.map((s, i) => {
                const hecho = i < indicePaso;
                const activo = i === indicePaso;
                return (
                  <li
                    key={s.id}
                    className={[
                      styles.stepSegment,
                      hecho && styles.stepSegmentDone,
                      activo && styles.stepSegmentActive,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                );
              })}
            </ol>

            <span className={styles.stepCounter}>
              Paso {indicePaso + 1} de {VISUALIZER_STEPS.length} · {VISUALIZER_STEPS[indicePaso].label}
            </span>

            {pasoAnterior && (
              <button
                type="button"
                className={styles.stepBack}
                onClick={() => setRequested(pasoAnterior)}
              >
                ← Volver
              </button>
            )}
          </div>

          {/* Alto compartido, para que la tarjeta no cambie de tamano entre pasos. */}
          <div className={styles.stepStage}>
        {paso === "foto" && (
          <div className={styles.stepPanel}>
            <label
              className={dragging ? `${styles.dropZone} ${styles.dropZoneOver}` : styles.dropZone}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const f = e.dataTransfer.files?.[0];
                if (f) selectFile(f);
              }}
            >
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onFile} hidden />

              <span className={styles.dropIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2a1.5 1.5 0 0 0 1.24-.66l.72-1.08A1.5 1.5 0 0 1 9.9 4.6h4.2a1.5 1.5 0 0 1 1.24.66l.72 1.08A1.5 1.5 0 0 0 17.3 7h2.2A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
                  <circle cx="12" cy="13" r="3.4" />
                </svg>
              </span>

              <p className={styles.dropTitle}>Subí una foto de tu ambiente</p>
              <p className={styles.dropHint}>Arrastrala acá o elegila desde tu dispositivo</p>

              <span className={styles.visualizerPrimaryBtn}>Elegir foto</span>

              <ul className={styles.dropTips}>
                {[
                  ["De pie", "M12 4.5a1.6 1.6 0 1 0 0-.1M12 7v6m0 0-2.5 6m2.5-6 2.5 6M8.5 9.5h7"],
                  ["Con luz", "M12 3v2m0 14v2m9-9h-2M5 12H3m14.5-6.5-1.4 1.4M7.9 16.1l-1.4 1.4m11 0-1.4-1.4M7.9 7.9 6.5 6.5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0"],
                  ["Que se vea el piso", "M3 15h18M3 15l3-9h12l3 9M3 15v4h18v-4M9 6v9m6-9v9"],
                ].map(([texto, path]) => (
                  <li key={texto} className={styles.dropTip}>
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={path} />
                    </svg>
                    {texto}
                  </li>
                ))}
              </ul>

              {errorMsg && (
                <p className={styles.visualizerError} role="alert">
                  {errorMsg}
                </p>
              )}
            </label>

            {/* Ilustra que foto sirve, asi que se carga sin lazy: en blanco no ilustra nada. */}
            <figure className={styles.sampleCard}>
              <Image
                src={SAMPLE_IMAGE}
                alt="Dormitorio con piso de eucalipto"
                width={220}
                height={160}
                className={styles.sampleImg}
                loading="eager"
              />
              <figcaption className={styles.sampleCaption}>Una foto así funciona bien</figcaption>
            </figure>
          </div>
        )}

        {paso === "material" && fallo && (
          <ErrorPanel
            fallo={fallo}
            whatsappHref={whatsappHref}
            onCambiarFoto={reset}
            onReintentar={() => {
              setFallo(null);
              setStatus("idle");
            }}
          />
        )}

        {paso === "material" && !fallo && (
          <div className={styles.pickPanel}>
            <div className={styles.pickPhoto}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Tu ambiente" className={styles.pickPhotoImg} />
              <button type="button" className={styles.visualizerChip} onClick={reset}>
                Cambiar foto
              </button>
            </div>

            <div className={styles.paletteCol}>
              <p className={styles.paletteTitle}>Elegí un material</p>
              <ul className={styles.palette}>
                {materialLibrary.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      className={
                        m.id === material
                          ? `${styles.paletteItem} ${styles.paletteItemActive}`
                          : styles.paletteItem
                      }
                      onClick={() => setMaterial(m.id)}
                      aria-pressed={m.id === material}
                    >
                      <Image
                        src={m.image}
                        alt=""
                        width={96}
                        height={64}
                        className={styles.paletteSwatch}
                        style={{ objectPosition: m.swatchPosition }}
                        loading="eager"
                      />
                      <span className={styles.paletteName}>{m.label}</span>
                      <span className={styles.paletteFamily}>{m.family}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.pickFooter}>
              <button
                type="button"
                className={styles.generateBtn}
                onClick={generar}
                disabled={!material}
              >
                {elegido ? `Generar con ${elegido.label}` : "Elegí un material para continuar"}
              </button>
            </div>
          </div>
        )}

        {paso === "resultado" && (
          <div className={styles.resultPanel}>
            {status === "loading" ? (
              /* Con la foto puesta, no una caja vacia: la espera se ancla en lo
                 que esta por pasar en vez de en un spinner. */
              <div className={styles.resultLoading} style={{ aspectRatio: aspect }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="" className={styles.resultLoadingPhoto} />
                <span className={styles.resultSweep} aria-hidden="true" />
                <div className={styles.resultLoadingCopy}>
                  <span className={styles.visualizerSpinner} />
                  <p className={styles.resultLoadingText}>
                    Poniendo {elegido?.label ?? "el material"} en tu ambiente…
                  </p>
                  <p className={styles.resultLoadingHint}>Puede tardar hasta un minuto.</p>
                </div>
              </div>
            ) : (
              <>
                <CompareSlider
                  className={styles.resultSlider}
                  style={{ aspectRatio: aspect }}
                  before={{ src: previewUrl, alt: "Tu ambiente antes", label: "Antes" }}
                  after={{ src: resultUrl, alt: `Tu ambiente con ${elegido?.label}`, label: elegido?.label ?? "Después" }}
                />
                <p className={styles.resultHint}>Arrastrá la barra para comparar.</p>

                <div className={styles.resultActions}>
                  <button type="button" className={styles.visualizerGhostBtn} onClick={() => setRequested("material")}>
                    Probar otro material
                  </button>
                  <button type="button" className={styles.visualizerPrimaryBtn} onClick={descargar}>
                    Descargar
                  </button>
                  <ExternalLink href={whatsappHref} className={styles.visualizerWhatsapp}>
                    Pedir presupuesto
                  </ExternalLink>
                </div>

                <p className={styles.resultDisclaimer}>
                  Es una recreación aproximada. El color final depende de la partida, la luz del
                  ambiente y la terminación.
                </p>
              </>
            )}
          </div>
          )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * El error ocupa el paso entero.
 *
 * Antes era una linea roja de 12px al pie: se perdia entre el resto y no
 * decia que hacer. Cada codigo trae su titulo, su explicacion y la accion que
 * corresponde — cambiar la foto no sirve si el servicio esta caido.
 */
function ErrorPanel({ fallo, whatsappHref, onCambiarFoto, onReintentar }) {
  const { titulo, detalle, accion } = describeError(fallo.code, fallo);

  return (
    <div className={styles.errorPanel} role="alert">
      <span className={styles.errorIcon} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.5v5.5M12 16.4v.1" />
        </svg>
      </span>

      <h3 className={styles.errorTitle}>{titulo}</h3>
      {/* El texto propio de la validacion es mas preciso que el generico. */}
      <p className={styles.errorDetail}>{fallo.error || detalle}</p>

      <div className={styles.errorActions}>
        {accion === "cambiar-foto" && (
          <button type="button" className={styles.visualizerPrimaryBtn} onClick={onCambiarFoto}>
            Probar con otra foto
          </button>
        )}
        {accion === "reintentar" && (
          <button type="button" className={styles.visualizerPrimaryBtn} onClick={onReintentar}>
            Reintentar
          </button>
        )}
        {/* Cuando la salida es WhatsApp igual tiene que haber vuelta al flujo:
            sin esto el visitante queda encerrado en la pantalla de error. */}
        {(accion === "esperar" || accion === "whatsapp") && (
          <button type="button" className={styles.visualizerGhostBtn} onClick={onReintentar}>
            Volver a los materiales
          </button>
        )}
        <ExternalLink href={whatsappHref} className={styles.errorWhatsapp}>
          Consultar por WhatsApp
        </ExternalLink>
      </div>
    </div>
  );
}
