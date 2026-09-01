"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../NaturalFlooringPage.module.css";
import { MIN_IMAGE_SIDE, isBigEnough } from "../../../lib/visualizerInput.mjs";
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
  const [requested, setRequested] = useState(null);
  const [dragging, setDragging] = useState(false);

  const objectUrlRef = useRef("");

  const estado = { hasPhoto: Boolean(file), status, requested };
  const paso = currentStep(estado);
  const elegido = materialLibrary.find((m) => m.id === material);

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    []
  );

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

  async function generar(materialId) {
    if (!file) return;
    setMaterial(materialId);
    setStatus("loading");
    setErrorMsg("");
    setRequested(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("material", materialId);
      fd.append("size", sizeHint);
      const res = await fetch("/api/visualizer", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No pudimos generar la vista.");
      setResultUrl(data.image);
      setStatus("done");
    } catch (e) {
      setErrorMsg(e.message || "No pudimos generar la vista.");
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
        <SectionHead label="Probador con inteligencia artificial" title="PROBÁ EL PISO EN TU AMBIENTE" inverse />
        <p className={styles.visualizerLead}>
          Subí una foto de tu ambiente y elegí un material: la inteligencia artificial reemplaza el
          piso conservando la luz, las sombras y la perspectiva reales.
        </p>

        <ol className={styles.stepBar}>
          {VISUALIZER_STEPS.map((s, i) => {
            const habilitado = isStepReachable(s.id, estado);
            const activo = s.id === paso;
            return (
              <li key={s.id} className={styles.stepItem}>
                <button
                  type="button"
                  className={activo ? `${styles.stepBtn} ${styles.stepBtnActive}` : styles.stepBtn}
                  onClick={() => setRequested(s.id)}
                  disabled={!habilitado}
                  aria-current={activo ? "step" : undefined}
                >
                  <span className={styles.stepNum}>{i + 1}</span>
                  <span className={styles.stepLabel}>{s.label}</span>
                </button>
              </li>
            );
          })}
        </ol>

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

        {paso === "material" && (
          <div className={styles.stepPanel}>
            <div className={styles.chosenPhoto}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Tu ambiente" className={styles.chosenPhotoImg} />
              <button type="button" className={styles.visualizerChip} onClick={reset}>
                Cambiar foto
              </button>
            </div>

            <div className={styles.materialPicker}>
              <p className={styles.materialPickerTitle}>Elegí un material para probar</p>
              {status === "error" && (
                <p className={styles.visualizerError} role="alert">
                  {errorMsg}
                </p>
              )}
              <ul className={styles.materialGrid}>
                {materialLibrary.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      className={
                        m.id === material
                          ? `${styles.materialCard} ${styles.materialCardActive}`
                          : styles.materialCard
                      }
                      onClick={() => generar(m.id)}
                    >
                      <Image src={m.image} alt={m.imageAlt} width={190} height={130} className={styles.materialCardImg} />
                      <span className={styles.materialCardLabel}>{m.label}</span>
                      <span className={styles.materialCardFamily}>{m.family}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {paso === "resultado" && (
          <div className={styles.resultPanel}>
            {status === "loading" ? (
              <div className={styles.resultLoading}>
                <span className={styles.visualizerSpinner} />
                <p className={styles.resultLoadingText}>
                  Generando tu piso en {elegido?.label ?? "el material elegido"}…
                </p>
                <p className={styles.resultLoadingHint}>Puede tardar hasta un minuto.</p>
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
    </section>
  );
}
