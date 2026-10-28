"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../NaturalFlooringPage.module.css";
import { MIN_IMAGE_SIDE, isBigEnough } from "../../../lib/visualizerInput.mjs";
import { ERROR_CODES, describeError } from "../../../lib/visualizerErrors.mjs";
import { normalizePhone, sanitizePhoneInput } from "../../../lib/leadValidation.mjs";
import { materialLibrary } from "../recommender/recommendationEngine.mjs";
import { VISUALIZER_STEPS, currentStep, isStepReachable } from "../visualizerSteps.mjs";
import WoodWipe, { useWoodWipe } from "./WoodWipe";
import { ExternalLink, cx } from "./shared";

const SAMPLE_IMAGE = "/images/euca-rostrata-dormitorio.jpg";
const WHATSAPP_BASE = "https://api.whatsapp.com/send?phone=5491169977725&text=";

// Una foto de celular pesa varios MB y el Worker gasta CPU en pasarla a base64:
// achicarla en el navegador lo mantiene liviano. OpenAI devuelve a lo sumo
// 1536 px, asi que 2048 no pierde nada.
const LADO_MAXIMO = 2048;
const PESO_SIN_TOCAR = 3 * 1024 * 1024;

function achicar(img, f) {
  const escala = Math.min(1, LADO_MAXIMO / Math.max(img.naturalWidth, img.naturalHeight));
  if (escala === 1 && f.size <= PESO_SIN_TOCAR) return Promise.resolve(f);

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.naturalWidth * escala);
  canvas.height = Math.round(img.naturalHeight * escala);
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob ? new File([blob], f.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : f),
      "image/jpeg",
      0.88
    );
  });
}

export default function FloorVisualizerSection({ presetMaterial }) {
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
  const [mostrandoAntes, setMostrandoAntes] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [telefonoError, setTelefonoError] = useState("");

  const objectUrlRef = useRef("");
  const pasoPrevioRef = useRef(0);
  const { activo: barriendo, direccion: dirBarrido, barrer } = useWoodWipe();

  const estado = { hasPhoto: Boolean(file), status, requested };
  const paso = currentStep(estado);
  const elegido = materialLibrary.find((m) => m.id === material);
  const indicePaso = VISUALIZER_STEPS.findIndex((s) => s.id === paso);

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    []
  );

  // Material que llega desde el resultado del asesor. Con una generación en
  // curso no se toca: cambiaría el nombre del material a mitad de la espera.
  useEffect(() => {
    if (!presetMaterial || status === "loading") return;
    setMaterial(presetMaterial.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetMaterial]);

  /**
   * Lo que se ve va un paso atras de lo que el estado dice, a proposito: el
   * cambio ocurre en el medio del barrido, cuando los tablones tapan todo.
   */
  const vista = fallo ? "error" : paso;
  const [vistaVisible, setVistaVisible] = useState(vista);

  useEffect(() => {
    if (vista === vistaVisible) return;
    // Un error siempre "avanza"; entre pasos manda el orden del stepper.
    const haciaAdelante =
      vista === "error" || vistaVisible === "error"
        ? vista === "error"
        : indicePaso >= pasoPrevioRef.current;
    pasoPrevioRef.current = indicePaso;
    barrer(haciaAdelante ? "forward" : "backward", () => setVistaVisible(vista));
  }, [vista, vistaVisible, indicePaso, barrer]);

  /**
   * Revelacion automatica al llegar al resultado: se ve la foto original un
   * instante y el resultado aparece encima. Sin esto el cambio pasa
   * desapercibido, que era todo el punto de generar la imagen.
   */
  useEffect(() => {
    if (vistaVisible !== "resultado" || status !== "done" || !resultUrl) return undefined;
    setMostrandoAntes(true);
    const t = setTimeout(() => setMostrandoAntes(false), 700);
    return () => clearTimeout(t);
  }, [vistaVisible, status, resultUrl]);

  // El progreso acompana a lo que se ve, no al estado: si se adelanta, el
  // contador salta antes de que los tablones tapen y se nota el truco.
  const indiceVisible = Math.max(
    0,
    VISUALIZER_STEPS.findIndex((s) => s.id === vistaVisible)
  );
  const pasoAnterior = VISUALIZER_STEPS.slice(0, indiceVisible)
    .reverse()
    .find((s) => isStepReachable(s.id, estado))?.id;



  const selectFile = useCallback((f) => {
    const url = URL.createObjectURL(f);
    const img = new window.Image();

    img.onload = async () => {
      if (!isBigEnough(img.naturalWidth, img.naturalHeight)) {
        URL.revokeObjectURL(url);
        setErrorMsg(
          `Esa foto es muy chica (${img.naturalWidth}×${img.naturalHeight}). Necesitamos al menos ${MIN_IMAGE_SIDE} píxeles de lado.`
        );
        return;
      }

      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = url;
      setFile(await achicar(img, f));
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
    if (!normalizePhone(telefono)) {
      setTelefonoError("Ingresá tu celular con código de área.");
      return;
    }
    setTelefonoError("");
    setStatus("loading");
    setErrorMsg("");
    setFallo(null);
    setRequested(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("material", material);
      fd.append("size", sizeHint);
      fd.append("phone", telefono);
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
    <div id="visualizador" className={styles.visualizer}>
      <div className={styles.visualizerInner}>
        <div className={styles.visualizerHead}>
          <span className={styles.woodShowcaseBannerTag}>Visualizador con IA</span>
          <h3 className={styles.visualizerTitle}>Probá el piso en tu ambiente</h3>
          <p className={styles.visualizerLead}>
            Subí una foto y elegí un material: la inteligencia artificial reemplaza el piso
            conservando la luz, las sombras y la perspectiva reales.
          </p>
        </div>

        <div className={styles.visualizerPanel}>
          <WoodWipe activo={barriendo} direccion={dirBarrido} />

          {/* Con un error no hay progreso que mostrar: decir "estas en el paso
              2" mientras se avisa que fallo es contradictorio. */}
          {vistaVisible !== "error" && (
          <div className={styles.stepProgress}>
            {/* Volver a la izquierda, que es hacia donde lleva; la barra al medio. */}
            <div className={styles.stepBackSlot}>
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

            <div className={styles.stepProgressCenter}>
            <ol className={styles.stepSegments}>
              {VISUALIZER_STEPS.map((s, i) => {
                const hecho = i < indiceVisible;
                const activo = i === indiceVisible;
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
              Paso {indiceVisible + 1} de {VISUALIZER_STEPS.length} · {VISUALIZER_STEPS[indiceVisible].label}
            </span>
            </div>

            <div className={styles.stepBackSlot} aria-hidden="true" />
          </div>
          )}

          {/* Alto compartido, para que la tarjeta no cambie de tamano entre pasos. */}
          <div className={styles.stepStage}>
        {vistaVisible === "foto" && (
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
              {elegido && (
                <p className={styles.dropPreset}>
                  Vas a probar <strong>{elegido.label}</strong>
                </p>
              )}
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

        {vistaVisible === "error" && (
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

        {vistaVisible === "material" && (
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
              <label className={styles.pickPhone}>
                <span className={styles.pickPhoneLabel}>Tu celular</span>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Ej. 11 2345-6789"
                  className={styles.pickPhoneInput}
                  value={telefono}
                  aria-invalid={Boolean(telefonoError)}
                  aria-describedby="visualizador-telefono-ayuda"
                  onChange={(e) => {
                    setTelefono(sanitizePhoneInput(e.target.value));
                    setTelefonoError("");
                  }}
                />
              </label>
              <button
                type="button"
                className={styles.generateBtn}
                onClick={generar}
                disabled={!material}
              >
                {elegido ? `Generar con ${elegido.label}` : "Elegí un material para continuar"}
              </button>
              <span
                id="visualizador-telefono-ayuda"
                className={cx(styles.pickPhoneHint, telefonoError && styles.pickPhoneHintError)}
                role={telefonoError ? "alert" : undefined}
              >
                {telefonoError || "Te escribimos para saber si te gustó y ayudarte a elegir."}
              </span>
            </div>
          </div>
        )}

        {vistaVisible === "resultado" && (
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
                <div className={styles.resultStage} style={{ aspectRatio: aspect }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Tu ambiente antes" className={styles.resultImg} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resultUrl}
                    alt={`Tu ambiente con ${elegido?.label}`}
                    className={cx(styles.resultImg, styles.resultImgAfter, mostrandoAntes && styles.resultImgOculta)}
                  />
                  <span className={styles.resultBadge}>
                    {mostrandoAntes ? "Antes" : (elegido?.label ?? "Después")}
                  </span>
                </div>

                <div className={styles.resultToggle} role="group" aria-label="Comparar antes y después">
                  <button
                    type="button"
                    className={cx(styles.resultToggleBtn, mostrandoAntes && styles.resultToggleBtnOn)}
                    onClick={() => setMostrandoAntes(true)}
                    aria-pressed={mostrandoAntes}
                  >
                    Antes
                  </button>
                  <button
                    type="button"
                    className={cx(styles.resultToggleBtn, !mostrandoAntes && styles.resultToggleBtnOn)}
                    onClick={() => setMostrandoAntes(false)}
                    aria-pressed={!mostrandoAntes}
                  >
                    Después
                  </button>
                </div>

                <div className={styles.resultActions}>
                  <ExternalLink href={whatsappHref} className={styles.visualizerWhatsapp}>
                    Pedir presupuesto
                  </ExternalLink>
                  <button type="button" className={styles.visualizerGhostBtn} onClick={descargar}>
                    Descargar
                  </button>
                  <button type="button" className={styles.resultQuietBtn} onClick={() => setRequested("material")}>
                    Probar otro material
                  </button>
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
        </div>
      </div>
    </div>
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
