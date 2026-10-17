"use client";

import { useState } from "react";
import { Reveal } from "../Reveal";
import styles from "../NaturalFlooringPage.module.css";
import FloorVisualizerSection from "./FloorVisualizerSection";
import WoodRecommenderSection from "./WoodRecommenderSection";
import { SectionHead } from "./shared";

/**
 * El asesor y el visualizador son dos pasos de la misma decisión: primero qué
 * material, después cómo queda. Por eso comparten sección, y el resultado del
 * asesor puede llevar su material directo al visualizador.
 */
export default function ToolsSection() {
  // `vez` cambia en cada envío, para que elegir dos veces el mismo material
  // vuelva a aplicarse aunque el visitante lo haya cambiado en el medio.
  const [presetMaterial, setPresetMaterial] = useState(null);

  function probarEnAmbiente(materialId) {
    setPresetMaterial({ id: materialId, vez: Date.now() });
    document.getElementById("visualizador")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="herramientas" className={styles.toolsSection}>
      <div className={styles.toolsInner}>
        <SectionHead
          label="Antes de decidir"
          title={
            <>
              ELEGÍ Y PROBÁ TU PISO
            </>
          }
          side={
            <Reveal delay={0.1}>
              <p className={styles.toolsIntro}>
                Dos herramientas gratis: el asesor te recomienda el material ideal y el visualizador
                te muestra cómo queda en tu casa.
              </p>
            </Reveal>
          }
        />

        <WoodRecommenderSection onTryMaterial={probarEnAmbiente} />

        <Reveal className={styles.toolsBridge}>
          <span className={styles.toolsBridgeLine} aria-hidden="true" />
          <span>¿Ya sabés cuál? Probalo en una foto de tu casa</span>
          <span className={styles.toolsBridgeLine} aria-hidden="true" />
        </Reveal>

        <FloorVisualizerSection presetMaterial={presetMaterial} />
      </div>
    </section>
  );
}
