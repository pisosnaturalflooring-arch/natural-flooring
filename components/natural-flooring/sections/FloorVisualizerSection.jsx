import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../NaturalFlooringPage.module.css";
import { SectionHead, ExternalLink } from "./shared";

const MATERIALS = [
  { id: "roble-claro", label: "Roble claro", base: "#d8b98a", grain: "#b1875339", seam: "#9c7846" },
  { id: "roble-miel", label: "Roble miel", base: "#c69353", grain: "#8a5f2733", seam: "#7f571f" },
  { id: "nogal", label: "Nogal", base: "#7c5533", grain: "#4a2f18aa", seam: "#3c2513" },
  { id: "guatambu", label: "Guatambú", base: "#e0cb93", grain: "#bda05f33", seam: "#a88f52" },
  { id: "spc-gris", label: "SPC gris", base: "#9c9c96", grain: "#6e6e6733", seam: "#66665f" },
  { id: "wengue", label: "Wengué", base: "#3d2e25", grain: "#1c130caa", seam: "#170f0a" },
];

const SAMPLE_IMAGE = "/images/euca-rostrata-dormitorio.jpg";
const WHATSAPP =
  "https://api.whatsapp.com/send?phone=5491169977725&text=Hola!%20Prob%C3%A9%20un%20piso%20en%20el%20visualizador%20de%20la%20web%20y%20quiero%20una%20cotizaci%C3%B3n.";

/* ---------- textura de madera para los swatches ---------- */
function shade(hex, amt) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, "$1$1") : h, 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  r = Math.max(0, Math.min(255, Math.round(r + 255 * amt)));
  g = Math.max(0, Math.min(255, Math.round(g + 255 * amt)));
  b = Math.max(0, Math.min(255, Math.round(b + 255 * amt)));
  return `rgb(${r},${g},${b})`;
}

function makeWoodSwatch(mat) {
  const W = 160;
  const H = 160;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d");
  x.fillStyle = mat.base;
  x.fillRect(0, 0, W, H);
  const planks = 5;
  const pw = H / planks;
  for (let p = 0; p < planks; p++) {
    const y = p * pw;
    x.fillStyle = shade(mat.base, Math.random() * 0.12 - 0.06);
    x.fillRect(0, y, W, pw);
    for (let g = 0; g < 8; g++) {
      x.strokeStyle = mat.grain;
      x.globalAlpha = 0.5;
      x.lineWidth = 0.5 + Math.random();
      const gy = y + Math.random() * pw;
      x.beginPath();
      x.moveTo(0, gy);
      x.bezierCurveTo(W * 0.4, gy + (Math.random() * 4 - 2), W * 0.7, gy + (Math.random() * 4 - 2), W, gy);
      x.stroke();
    }
    x.globalAlpha = 0.75;
    x.strokeStyle = mat.seam;
    x.lineWidth = 1.4;
    x.beginPath();
    x.moveTo(0, y);
    x.lineTo(W, y);
    x.stroke();
    x.globalAlpha = 1;
  }
  return c.toDataURL("image/jpeg", 0.7);
}

export default function FloorVisualizerSection() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [sizeHint, setSizeHint] = useState("auto");
  const [material, setMaterial] = useState(MATERIALS[0].id);
  const [direction, setDirection] = useState("vertical");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [resultUrl, setResultUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showOriginal, setShowOriginal] = useState(false);
  const [swatches, setSwatches] = useState({});

  const objectUrlRef = useRef("");
  const mat = MATERIALS.find((m) => m.id === material);

  useEffect(() => {
    const out = {};
    MATERIALS.forEach((m) => {
      out[m.id] = makeWoodSwatch(m);
    });
    setSwatches(out);
  }, []);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const selectFile = useCallback((f) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(f);
    objectUrlRef.current = url;
    setFile(f);
    setPreviewUrl(url);
    setResultUrl("");
    setStatus("idle");
    setErrorMsg("");
    const img = new Image();
    img.onload = () => {
      const r = img.naturalWidth / img.naturalHeight;
      setSizeHint(r > 1.2 ? "1536x1024" : r < 0.83 ? "1024x1536" : "1024x1024");
    };
    img.src = url;
  }, []);

  function onFile(e) {
    const f = e.target.files?.[0];
    if (f) selectFile(f);
  }

  async function useSample() {
    try {
      const res = await fetch(SAMPLE_IMAGE);
      const blob = await res.blob();
      selectFile(new File([blob], "ejemplo.jpg", { type: blob.type || "image/jpeg" }));
    } catch {
      setErrorMsg("No se pudo cargar la foto de ejemplo.");
    }
  }

  async function generate() {
    if (!file) return;
    setStatus("loading");
    setErrorMsg("");
    setShowOriginal(false);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("material", material);
      fd.append("direction", direction);
      fd.append("size", sizeHint);
      const res = await fetch("/api/visualizer", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al generar la imagen.");
      setResultUrl(data.image);
      setStatus("done");
    } catch (e) {
      setErrorMsg(e.message || "Error al generar la imagen.");
      setStatus("error");
    }
  }

  function reset() {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = "";
    setFile(null);
    setPreviewUrl("");
    setResultUrl("");
    setStatus("idle");
    setErrorMsg("");
  }

  function download() {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "mi-piso-natural-flooring.png";
    a.click();
  }

  const stageImg = status === "done" && !showOriginal ? resultUrl : previewUrl;

  return (
    <section id="visualizador" className={styles.visualizer}>
      <div className={styles.visualizerInner}>
        <SectionHead label="Probador · Realidad aumentada" title="PROBÁ EL PISO EN TU AMBIENTE" inverse />
        <p className={styles.visualizerLead}>
          Subí una foto de tu ambiente y elegí el material: la inteligencia artificial reemplaza el
          piso conservando la luz, las sombras y la perspectiva reales. Sin medir ni marcar nada.
        </p>

        <div className={styles.visualizerGrid}>
          <div className={styles.visualizerStage}>
            {!file ? (
              <div className={styles.visualizerDrop}>
                <p className={styles.visualizerDropTitle}>Subí una foto de tu ambiente</p>
                <p className={styles.visualizerDropHint}>
                  Sacale una foto al piso que querés renovar (de pie, mostrando el suelo).
                </p>
                <div className={styles.visualizerDropActions}>
                  <label className={styles.visualizerPrimaryBtn}>
                    Elegir foto
                    <input type="file" accept="image/*" onChange={onFile} hidden />
                  </label>
                  <button type="button" className={styles.visualizerGhostBtn} onClick={useSample}>
                    Usar foto de ejemplo
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={stageImg} alt="Ambiente" className={styles.visualizerImg} />

                {status === "loading" && (
                  <div className={styles.visualizerLoading}>
                    <span className={styles.visualizerSpinner} />
                    <span className={styles.visualizerLoadingText}>Generando tu piso…</span>
                    <span className={styles.visualizerLoadingHint}>
                      Puede tardar unos segundos
                    </span>
                  </div>
                )}

                <div className={styles.visualizerStageBar}>
                  <span className={styles.visualizerHint}>
                    {status === "done"
                      ? "Listo · mantené “Ver original” para comparar"
                      : "Elegí el material y generá la vista"}
                  </span>
                  <div className={styles.visualizerStageActions}>
                    <label className={styles.visualizerChip}>
                      Cambiar foto
                      <input type="file" accept="image/*" onChange={onFile} hidden />
                    </label>
                    <button type="button" className={styles.visualizerChip} onClick={reset}>
                      Quitar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <aside className={styles.visualizerPanel}>
            <div className={styles.visualizerPanelHead}>
              <span>Material</span>
              <strong>{mat.label}</strong>
            </div>
            <div className={styles.visualizerSwatches}>
              {MATERIALS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={
                    m.id === material
                      ? `${styles.visualizerSwatch} ${styles.visualizerSwatchActive}`
                      : styles.visualizerSwatch
                  }
                  onClick={() => setMaterial(m.id)}
                >
                  <span
                    className={styles.visualizerSwatchImg}
                    style={{
                      backgroundImage: swatches[m.id] ? `url(${swatches[m.id]})` : "none",
                      backgroundColor: m.base,
                    }}
                  />
                  <span className={styles.visualizerSwatchLabel}>{m.label}</span>
                </button>
              ))}
            </div>

            <div className={styles.visualizerSubhead}>Dirección del tablón</div>
            <div className={styles.visualizerToggle}>
              <button
                type="button"
                className={direction === "horizontal" ? styles.visualizerToggleOn : styles.visualizerToggleOff}
                onClick={() => setDirection("horizontal")}
              >
                Horizontal
              </button>
              <button
                type="button"
                className={direction === "vertical" ? styles.visualizerToggleOn : styles.visualizerToggleOff}
                onClick={() => setDirection("vertical")}
              >
                Vertical
              </button>
            </div>

            {errorMsg && <p className={styles.visualizerError}>{errorMsg}</p>}

            <button
              type="button"
              className={styles.visualizerGenerate}
              onClick={generate}
              disabled={!file || status === "loading"}
            >
              {status === "loading"
                ? "Generando…"
                : status === "done"
                ? "Probar otro material"
                : "Generar visualización"}
            </button>

            {status === "done" && (
              <div className={styles.visualizerBtnRow}>
                <button
                  type="button"
                  className={styles.visualizerGhostBtn}
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  onMouseLeave={() => setShowOriginal(false)}
                  onTouchStart={() => setShowOriginal(true)}
                  onTouchEnd={() => setShowOriginal(false)}
                >
                  Ver original
                </button>
                <button type="button" className={styles.visualizerPrimaryBtn} onClick={download}>
                  Descargar
                </button>
              </div>
            )}

            <ExternalLink href={WHATSAPP} className={styles.visualizerWhatsapp}>
              Consultar por WhatsApp
            </ExternalLink>

            <p className={styles.visualizerTip}>
              <strong>Tip:</strong> mejores resultados con fotos bien iluminadas donde se vea buena
              parte del piso.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
