"use client";

import { useRef, useState } from "react";
import styles from "./WarrantySection.module.css";

const topics = [
  { key: "care", label: "Cómo mantenerla vigente" },
  { key: "exclusions", label: "Qué queda excluido" },
];

export default function WarrantyCoverage({ coverages, conditions }) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef([]);

  function move(event, index) {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % coverages.length;
    else if (event.key === "ArrowLeft") next = (index + coverages.length - 1) % coverages.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = coverages.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next].focus();
  }

  return (
    <div className={styles.guide}>
      <div className={styles.coverages} role="tablist" aria-label="Tipo de trabajo y plazo de garantía">
        {coverages.map((coverage, index) => (
          <button
            key={coverage.id}
            ref={(element) => { tabs.current[index] = element; }}
            type="button"
            role="tab"
            id={`tab-${coverage.id}`}
            aria-controls={coverage.id}
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            className={styles.coverage}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => move(event, index)}
          >
            <span className={styles.term}><span>{coverage.years}</span><span className={styles.termLabel}>años de<br />garantía</span></span>
            <span className={styles.coverageTitle}>{coverage.title}</span>
          </button>
        ))}
      </div>
      {coverages.map((coverage, index) => (
        <div
          key={coverage.id}
          id={coverage.id}
          role="tabpanel"
          aria-labelledby={`tab-${coverage.id}`}
          tabIndex={0}
          hidden={selected !== index}
          className={styles.panel}
        >
          <h3 className={styles.coverageHeading}>Qué cubre</h3>
          <p className={styles.terms}>{coverage.paragraphs.coverage}</p>
        </div>
      ))}
      <div className={styles.conditions}>
        {topics.map((topic) => (
          <div className={styles.topic} key={topic.key}>
            <h3 className={styles.topicTitle}>{topic.label}</h3>
            <p className={styles.terms}>{conditions[topic.key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
