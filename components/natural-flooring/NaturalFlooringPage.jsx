"use client";

import { startTransition, useEffect, useState } from "react";
import styles from "./NaturalFlooringPage.module.css";
import {
  archiveFilters,
  archiveProjects,
  beforeAfter,
  chatbotFaq,
  contactItems,
  featuredProjects,
  footer,
  footerLinks,
  hero,
  instagramPosts,
  links,
  maintenanceProducts,
  processSteps,
  productGroups,
  projectsIntro,
  reviewsPrimary,
  reviewsSecondary,
  showrooms,
  staircase,
  warranty,
  why,
  whyItems,
} from "./data";
import ArchiveSection from "./sections/ArchiveSection";
import BeforeAfterSection from "./sections/BeforeAfterSection";
import ChatbotWidget from "./sections/ChatbotWidget";
import ContactSection from "./sections/ContactSection";
import FeaturedProjectsSection from "./sections/FeaturedProjectsSection";
import FooterSection from "./sections/FooterSection";
import HeaderSection from "./sections/HeaderSection";
import HeroSection from "./sections/HeroSection";
import MaintenanceSection from "./sections/MaintenanceSection";
import NewsletterPopup from "./sections/NewsletterPopup";
import ProcessSection from "./sections/ProcessSection";
import ProductsSection from "./sections/ProductsSection";
import ProjectModal from "./sections/ProjectModal";
import ReviewsSection from "./sections/ReviewsSection";
import ShowroomsSection from "./sections/ShowroomsSection";
import SocialSection from "./sections/SocialSection";
import StaircaseSection from "./sections/StaircaseSection";
import ToolsSection from "./sections/ToolsSection";
import WarrantySection from "./sections/WarrantySection";
import WhySection from "./sections/WhySection";

export default function NaturalFlooringPage() {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = selectedProject ? "hidden" : previousOverflow;
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) return undefined;
    const onKeyDown = (e) => { if (e.key === "Escape") setSelectedProject(null); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedProject]);

  return (
    <main className={styles.page}>
      <HeaderSection />

      {/* 1. What you do */}
      <HeroSection hero={hero} />

      {/* 2. Nosotros: quiénes somos y por qué elegirnos */}
      <WhySection why={why} whyItems={whyItems} />
      <WarrantySection warranty={warranty} whatsappHref={links.whatsappGeneral} />

      {/* 3. Productos: catálogo por familia */}
      <ProductsSection productGroups={productGroups} />

      {/* 4. How easy it is to start */}
      <ProcessSection processSteps={processSteps} whatsappHref={links.whatsappGeneral} />

      {/* 5. Specific services */}
      <StaircaseSection staircase={staircase} whatsappHref={links.whatsappStairs} />

      {/* 6. Asesor + visualizador: elegir el material y probarlo */}
      <ToolsSection />

      {/* 7. Proyectos — curated first, then full archive */}
      <FeaturedProjectsSection
        featuredProjects={featuredProjects}
        intro={projectsIntro}
        onProjectOpen={setSelectedProject}
      />
      <BeforeAfterSection beforeAfter={beforeAfter} whatsappHref={links.whatsappGeneral} />

      <ArchiveSection
        activeCategory={activeCategory}
        archiveFilters={archiveFilters}
        archiveProjects={archiveProjects}
        onCategoryChange={(cat) => startTransition(() => setActiveCategory(cat))}
        onProjectOpen={setSelectedProject}
      />

      {/* 8. Maintenance products */}
      <MaintenanceSection
        maintenanceProducts={maintenanceProducts}
        whatsappHref={links.whatsappMaintenanceHelp}
      />

      {/* 9. Social proof */}
      <ReviewsSection
        mapsHref={links.maps}
        mapsAllReviewsHref={links.mapsAllReviews}
        reviewsPrimary={reviewsPrimary}
        reviewsSecondary={reviewsSecondary}
      />

      {/* 10. Content */}
      <SocialSection instagramPosts={instagramPosts} instagramHref={links.instagram} />

      {/* 11. Showrooms */}
      <ShowroomsSection showrooms={showrooms} />

      {/* 12. Action */}
      <ContactSection contactItems={contactItems} whatsappHref={links.whatsappGeneral} />

      <FooterSection
        footer={footer}
        footerLinks={footerLinks}
        showrooms={showrooms}
        instagramHref={links.instagram}
        whatsappHref={links.whatsappGeneral}
      />

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      <ChatbotWidget faq={chatbotFaq} />

      <NewsletterPopup />
    </main>
  );
}
