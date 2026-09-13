"use client";

import { AnimatePresence, motion } from "framer-motion";
import WoodWipe from "./WoodWipe";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import styles from "../NaturalFlooringPage.module.css";
import { links } from "../data";
import {
  getRecommendation,
  getStepOption,
  recommenderSteps,
} from "../recommender/recommendationEngine.mjs";
import { cx, ExternalLink } from "./shared";

function getExposureLabel(material) {
  if (material.exposures.includes("exterior-exposed")) return "Exterior expuesto";
  if (material.exposures.includes("exterior-semic-covered")) return "Exterior semicubierto";
  if (material.exposures.includes("interior-humid")) return "Interior con humedad";
  return "Interior seco";
}

function buildSummary(answers) {
  return [
    ["Tipo", "projectType"],
    ["Ubicacion", "exposure"],
    ["Uso", "intensity"],
    ["Prioridad", "priority"],
  ].map(([label, stepId]) => ({
    label,
    value: getStepOption(stepId, answers[stepId])?.label || "Sin definir",
  }));
}

// Fade transition for underlying card content, since the wood shutter transition handles the wipe overlay
const cardVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export default function WoodRecommenderSection({ onTryMaterial }) {
  const [answers, setAnswers] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  
  // Custom Wood Shutter Horizontal Wipe Transition States
  const [isWiping, setIsWiping] = useState(false);
  const [wipeDirection, setWipeDirection] = useState('forward');

  // Handle body scrolling lock when fullscreen modal is active
  useEffect(() => {
    if (!isTesting) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") restart();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isTesting]);

  const isComplete = stepIndex >= recommenderSteps.length;
  const currentStep = recommenderSteps[Math.min(stepIndex, recommenderSteps.length - 1)];
  
  const recommendation = useMemo(() => getRecommendation(answers), [answers]);
  const summary = useMemo(() => buildSummary(recommendation.answers), [recommendation.answers]);

  // Ficha del material recomendado — complementa "tus respuestas" con datos del material en si
  const materialFacts = useMemo(() => {
    const material = recommendation.primary;
    return [
      { label: "Conviene para", value: material.bestUse },
      { label: "Rendimiento", value: material.statValue },
      { label: "Mantenimiento", value: material.maintenance },
      { label: "Ambiente ideal", value: getExposureLabel(material) },
    ];
  }, [recommendation.primary]);

  const recommendedImage = useMemo(() => {
    if (recommendation.primary.id === "petiribi") return "/images/detalle-escalera-petiribi.jpg";
    if (recommendation.primary.id === "guatambu") return "/images/guatambu-salon-gimnasio.jpg";
    return recommendation.primary.image;
  }, [recommendation.primary]);

  // Wood shutter horizontal wipe transition handlers
  function selectOption(optionId) {
    setAnswers((previous) => ({ ...previous, [currentStep.id]: optionId }));
    setWipeDirection('forward');
    setIsWiping(true);

    setTimeout(() => {
      setStepIndex((previous) => Math.min(previous + 1, recommenderSteps.length));
    }, 380);

    setTimeout(() => {
      setIsWiping(false);
    }, 900);
  }

  function goBack() {
    setWipeDirection('backward');
    setIsWiping(true);

    setTimeout(() => {
      setStepIndex((previous) => Math.max(previous - 1, 0));
    }, 380);

    setTimeout(() => {
      setIsWiping(false);
    }, 900);
  }

  function restart() {
    setWipeDirection('backward');
    setIsWiping(true);

    setTimeout(() => {
      setAnswers({});
      setStepIndex(0);
      setIsTesting(false);
    }, 380);

    setTimeout(() => {
      setIsWiping(false);
    }, 900);
  }

  // Cierra el asesor con el mismo barrido y recién después baja al
  // visualizador: con el modal abierto el scroll de la página está bloqueado.
  function tryInVisualizer() {
    const materialId = recommendation.primary.id;
    restart();
    setTimeout(() => onTryMaterial?.(materialId), 450);
  }

  function startTest() {
    setAnswers({});
    setStepIndex(0);
    setIsTesting(true);
  }



  return (
    <div id="asesor" className={styles.recommenderSection}>
      <div className={styles.woodShowcaseBanner}>
        <div className={styles.woodShowcaseBannerContent}>
          <span className={styles.woodShowcaseBannerTag}>Asesor de materiales</span>
          <h3>¿No sabés qué material te conviene?</h3>
          <p>
            Respondé {recommenderSteps.length} preguntas rápidas sobre tu ambiente y te recomendamos el material ideal para tu piso, deck o escalera.
          </p>
        </div>
        <div className={styles.woodShowcaseBannerAction}>
          <button type="button" className={styles.woodAdvisorButton} onClick={startTest}>
            Empezar el asesor →
          </button>
        </div>
      </div>

      {/* 2. Fullscreen Viewport Modal with custom wood shutter horizontal wipe transition */}
      <AnimatePresence>
        {isTesting && (
          <motion.div
            className={styles.advisorModal}
            role="dialog"
            aria-modal="true"
            aria-label="Asesor de materiales Natural Flooring"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button type="button" className={styles.advisorClose} onClick={restart} aria-label="Cerrar asesor">
              ×
            </button>

            {/* Static Premium Dark Background */}
            <div className={styles.advisorBackdropAbstract} />

            <WoodWipe activo={isWiping} direccion={wipeDirection} />

            <div className={styles.advisorStage3D}>
              <AnimatePresence mode="wait" initial={false}>
                {!isComplete ? (
                  <motion.div
                    key={stepIndex}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={styles.recommenderPanel3D}
                  >
                    {/* Header Row combining navigation, progress segments, and counter */}
                    <div className={styles.recommenderProgressRow}>
                      <div className={styles.recommenderBackChevronWrapper}>
                        {stepIndex > 0 ? (
                          <button
                            type="button"
                            className={styles.recommenderBackChevron}
                            onClick={goBack}
                            aria-label="Volver a la pregunta anterior"
                          >
                            <svg viewBox="0 0 24 24" width="14" height="14">
                              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                            </svg>
                            Volver
                          </button>
                        ) : (
                          <span className={styles.progressEyebrow}>Asistente de Selección</span>
                        )}
                      </div>

                      <div
                        className={styles.recommenderProgressSegmented}
                        style={{ gridTemplateColumns: `repeat(${recommenderSteps.length}, 1fr)` }}
                        aria-hidden="true"
                      >
                        {recommenderSteps.map((step, index) => (
                          <div
                            key={step.id}
                            className={cx(
                              styles.recommenderProgressSegment,
                              index < stepIndex && styles.progressSegmentDone,
                              index === stepIndex && styles.progressSegmentActive
                            )}
                          />
                        ))}
                      </div>

                      <span className={styles.progressStepCounter}>Paso {stepIndex + 1} de {recommenderSteps.length}</span>
                    </div>

                    <h3>{currentStep.prompt}</h3>
                    <div className={styles.recommenderOptions3D}>
                      {currentStep.options.map((option, index) => (
                        <button
                          key={option.id}
                          type="button"
                          className={cx(
                            styles.recommenderOption3D,
                            answers[currentStep.id] === option.id && styles.recommenderOptionSelected
                          )}
                          onClick={() => selectOption(option.id)}
                        >
                          <em>{String(index + 1).padStart(2, "0")}</em>
                          <div>
                            <strong>{option.label}</strong>
                            <p>{option.detail}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={styles.recommenderResultCard3D}
                  >
                    <div className={styles.resultImageContainer3D}>
                      <Image
                        src={recommendedImage}
                        alt={recommendation.primary.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        priority
                        className={styles.resultImage}
                      />
                      <div className={styles.resultImageOverlay3D}>
                        <span>Recomendado</span>
                      </div>
                      <div className={styles.resultFamilyBadge3D}>
                        {recommendation.primary.natural ? "Madera Natural" : "Material Tecnico"}
                      </div>
                    </div>

                    <div className={styles.resultInfoContent3D}>
                      <p className={styles.resultLabel3D}>La opcion mas segura es</p>
                      <h3>{recommendation.primary.label}</h3>
                      <p className={styles.resultReason3D}>{recommendation.reason}</p>

                      {/* Ficha del material recomendado: lo que define la eleccion */}
                      <div className={styles.resultSpecsGrid3D}>
                        {materialFacts.map((item) => (
                          <div key={item.label} className={styles.specCard3D}>
                            <span className={styles.specLabel3D}>{item.label}</span>
                            <strong className={styles.specValue3D}>{item.value}</strong>
                          </div>
                        ))}
                      </div>

                      {recommendation.caveat && (
                        <p className={styles.resultCaveat3D}>{recommendation.caveat}</p>
                      )}

                      <div className={styles.resultGrid3D}>
                        <div className={styles.resultAlternativesBlock3D}>
                          <h4>Tambien pueden funcionar</h4>
                          <div className={styles.resultAlternatives3D}>
                            {recommendation.alternatives.map((material) => (
                              <span key={material.id} className={styles.alternativeBadge3D}>
                                <strong>{material.label}</strong>
                                <em>{material.bestUse}</em>
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className={styles.resultSpecsBlock3D}>
                          <h4>Tus respuestas</h4>
                          <ul className={styles.resultAnswerList3D}>
                            {summary.map((item) => (
                              <li key={item.label}>
                                <span>{item.label}</span>
                                {item.value}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className={styles.resultActions3D}>
                        {onTryMaterial && (
                          <button type="button" className={styles.resultPrimaryCta3D} onClick={tryInVisualizer}>
                            Probarlo en mi ambiente
                          </button>
                        )}
                        <ExternalLink
                          href={links.whatsappGeneral}
                          className={onTryMaterial ? styles.resultSecondaryCta3D : styles.resultPrimaryCta3D}
                          ariaLabel="Pedir asesoramiento por WhatsApp"
                        >
                          Quiero asesoramiento
                        </ExternalLink>
                        <button type="button" className={styles.resultSecondaryCta3D} onClick={restart}>
                          Probar otro caso
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
