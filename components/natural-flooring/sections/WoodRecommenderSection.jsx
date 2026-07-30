"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import styles from "../NaturalFlooringPage.module.css";
import { links } from "../data";
import {
  getRecommendation,
  getStepOption,
  materialLibrary,
  recommenderSteps,
} from "../recommender/recommendationEngine.mjs";
import { cx, ExternalLink } from "./shared";

const otherSolutions = [
  "Zocalos y terminaciones",
  "Pulido e hidrolaqueado",
  "Limpieza y mantenimiento",
  "Asesoramiento en showroom",
];

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

export default function WoodRecommenderSection() {
  const [answers, setAnswers] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  
  // Custom Wood Shutter Horizontal Wipe Transition States
  const [isWiping, setIsWiping] = useState(false);
  const [wipeDirection, setWipeDirection] = useState('forward');

  // Dynamically update petiribi and guatambu photos in the catalog for beautiful close-up detail texture shots
  const allMaterials = useMemo(() => {
    return materialLibrary.map((material) => {
      if (material.id === "petiribi") {
        return { ...material, image: "/images/detalle-escalera-petiribi.jpg" };
      }
      if (material.id === "guatambu") {
        return { ...material, image: "/images/guatambu-salon-gimnasio.jpg" };
      }
      return material;
    });
  }, []);

  // Native scroll-snap slider — mirrors the ProjectModal gallery approach
  const sliderRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const totalSlides = allMaterials.length;

  const handleSliderScroll = useCallback(() => {
    const el = sliderRef.current;
    if (!el || el.offsetWidth === 0) return;
    setSelectedIndex(Math.round(el.scrollLeft / el.offsetWidth));
  }, []);

  const scrollToSlide = useCallback((idx) => {
    const el = sliderRef.current;
    if (!el) return;
    // clamp index with wrap-around
    const target = ((idx % totalSlides) + totalSlides) % totalSlides;
    el.scrollTo({ left: target * el.offsetWidth, behavior: "smooth" });
  }, [totalSlides]);

  const scrollPrev = useCallback(() => scrollToSlide(selectedIndex - 1), [selectedIndex, scrollToSlide]);
  const scrollNext = useCallback(() => scrollToSlide(selectedIndex + 1), [selectedIndex, scrollToSlide]);

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

  function startTest() {
    setAnswers({});
    setStepIndex(0);
    setIsTesting(true);
  }



  return (
    <section id="asesor" className={styles.recommenderSection}>
      {/* 1. Redesigned Premium Interactive Spotlight Helper Card (Simplified Text, Huge Button) */}
      <div className={styles.woodShowcaseBannerWrapper}>
        <div className={styles.woodShowcaseBanner}>
          <div className={styles.woodShowcaseBannerContent}>
            <span className={styles.woodShowcaseBannerTag}>Asistente de Selección</span>
            <h3>¿No sabés qué madera o material te conviene?</h3>
            <p>
              Respondé {recommenderSteps.length} preguntas rápidas sobre tu ambiente y descubrí cuál es la especie recomendada para tu piso o deck.
            </p>
          </div>
          <div className={styles.woodShowcaseBannerAction}>
            <button type="button" className={styles.woodAdvisorButton} onClick={startTest}>
              <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: "0.85rem", verticalAlign: "middle" }}>
                <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V7h10v2zm0 8H7v-2h10v2z"/>
              </svg>
              Iniciar Asistente Inteligente
            </button>
          </div>
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

            {/* Thematic Wood Shutter Horizontal Wipe Transition Overlay - Moved here to cover full viewport */}
            <AnimatePresence>
              {isWiping && (
                <div className={styles.woodWipeOverlayHorizontal}>
                  <motion.div
                    className={cx(styles.woodWipePanelHorizontal, styles.panelPine)}
                    initial={{ x: wipeDirection === 'forward' ? "100%" : "-100%" }}
                    animate={{ x: wipeDirection === 'forward' ? ["100%", "0%", "-100%"] : ["-100%", "0%", "100%"] }}
                    transition={{ duration: 0.75, times: [0, 0.45, 1], ease: "easeInOut" }}
                  />
                  <motion.div
                    className={cx(styles.woodWipePanelHorizontal, styles.panelOak)}
                    initial={{ x: wipeDirection === 'forward' ? "100%" : "-100%" }}
                    animate={{ x: wipeDirection === 'forward' ? ["100%", "0%", "-100%"] : ["-100%", "0%", "100%"] }}
                    transition={{ duration: 0.75, delay: 0.05, times: [0, 0.45, 1], ease: "easeInOut" }}
                  />
                  <motion.div
                    className={cx(styles.woodWipePanelHorizontal, styles.panelWalnut)}
                    initial={{ x: wipeDirection === 'forward' ? "100%" : "-100%" }}
                    animate={{ x: wipeDirection === 'forward' ? ["100%", "0%", "-100%"] : ["-100%", "0%", "100%"] }}
                    transition={{ duration: 0.75, delay: 0.1, times: [0, 0.45, 1], ease: "easeInOut" }}
                  />
                  <motion.div
                    className={cx(styles.woodWipePanelHorizontal, styles.panelWenge)}
                    initial={{ x: wipeDirection === 'forward' ? "100%" : "-100%" }}
                    animate={{ x: wipeDirection === 'forward' ? ["100%", "0%", "-100%"] : ["-100%", "0%", "100%"] }}
                    transition={{ duration: 0.75, delay: 0.15, times: [0, 0.45, 1], ease: "easeInOut" }}
                  />
                </div>
              )}
            </AnimatePresence>

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
                        <ExternalLink
                          href={links.whatsappGeneral}
                          className={styles.resultPrimaryCta3D}
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

      {/* 3. Catalog Guide Draggable Slider without filters */}
      <div id="materiales-asesor" className={styles.materialGuide}>
        <div className={styles.materialGuideHead}>
          <p className={styles.recommenderKicker}>Catalogo orientativo</p>
          <h3>Maderas y opciones para cada proyecto.</h3>
          <p>Arrastra para explorar y comprender la diferencia entre cada uno de los distintos tipos de madera y materiales.</p>
        </div>

        {/* Native scroll-snap slider container */}
        <div className={styles.speciesSliderWrapper}>
          <div
            className={styles.speciesSliderViewport}
            ref={sliderRef}
            onScroll={handleSliderScroll}
          >
            <div className={styles.speciesSliderContainer}>
              {allMaterials.map((material, index) => (
                <div className={styles.speciesSlide} key={material.id}>
                  <div className={styles.speciesCardSplit}>
                    <div className={styles.speciesCardImage}>
                      <Image
                        src={material.image}
                        alt={material.imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 500px"
                        priority={index === 0}
                        className={styles.speciesImg}
                      />
                      <div className={styles.speciesBadge}>
                        {material.natural ? "Madera Natural" : "Material Tecnico"}
                      </div>
                    </div>
                    <div className={styles.speciesCardContent}>
                      <span className={styles.speciesFamily}>{material.family}</span>
                      <h4>{material.label}</h4>
                      <p className={styles.speciesImportance}>{material.importance}</p>
                      <p className={styles.speciesDecision}>
                        <strong>Cuando elegirlo:</strong> {material.decision}
                      </p>
                      <dl className={styles.speciesSpecsGrid}>
                        <div>
                          <dt>Conviene para</dt>
                          <dd>{material.bestUse}</dd>
                        </div>
                        <div>
                          <dt>Rendimiento</dt>
                          <dd>{material.statValue}</dd>
                        </div>
                        <div>
                          <dt>Mantenimiento</dt>
                          <dd>{material.maintenance}</dd>
                        </div>
                        <div>
                          <dt>Ambiente ideal</dt>
                          <dd>{getExposureLabel(material)}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider control arrows */}
          {allMaterials.length > 1 && (
            <>
              <button
                type="button"
                className={cx(styles.sliderArrow, styles.sliderArrowLeft)}
                onClick={scrollPrev}
                aria-label="Anterior material"
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
              <button
                type="button"
                className={cx(styles.sliderArrow, styles.sliderArrowRight)}
                onClick={scrollNext}
                aria-label="Siguiente material"
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Slider dots indicators */}
        {totalSlides > 1 && (
          <div className={styles.sliderDots}>
            {allMaterials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={cx(
                  styles.sliderDot,
                  idx === selectedIndex && styles.sliderDotActive
                )}
                onClick={() => scrollToSlide(idx)}
                aria-label={`Ir al material ${idx + 1}`}
              />
            ))}
          </div>
        )}

        <div className={styles.otherSolutions}>
          <h4>Otras soluciones que tambien hacemos</h4>
          <div>
            {otherSolutions.map((solution) => (
              <span key={solution}>{solution}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
