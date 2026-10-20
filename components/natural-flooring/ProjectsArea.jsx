"use client";

import dynamic from "next/dynamic";
import { startTransition, useEffect, useState } from "react";
import ArchiveSection from "./sections/ArchiveSection";
import FeaturedProjectsSection from "./sections/FeaturedProjectsSection";

// El modal recién se descarga cuando alguien abre una obra.
const ProjectModal = dynamic(() => import("./sections/ProjectModal"));

/**
 * Obras destacadas + archivo, con el modal que comparten. El estado vive acá y
 * no en la raíz de la página: cambiar el filtro del archivo o abrir una obra
 * re-renderiza solo esta parte, no la home entera.
 * `children` es la sección "Antes y después", que va en el medio y se renderiza
 * en el servidor.
 */
export default function ProjectsArea({ featuredProjects, projectsIntro, archiveFilters, archiveProjects, children }) {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (!selectedProject) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedProject]);

  return (
    <>
      <FeaturedProjectsSection featuredProjects={featuredProjects} intro={projectsIntro} onProjectOpen={setSelectedProject} />
      {children}
      <ArchiveSection
        activeCategory={activeCategory}
        archiveFilters={archiveFilters}
        archiveProjects={archiveProjects}
        onCategoryChange={(cat) => startTransition(() => setActiveCategory(cat))}
        onProjectOpen={setSelectedProject}
      />
      {selectedProject ? <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} /> : null}
    </>
  );
}
