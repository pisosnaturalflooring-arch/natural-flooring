"use client";

import { startTransition, useEffect, useState } from "react";
import styles from "./NaturalFlooringPage.module.css";
import {
  archiveFilters,
  archiveProjects,
  beforeAfter,
  categories,
  contactItems,
  featuredProjects,
  footer,
  footerLinks,
  hero,
  instagramEmbeds,
  links,
  maintenanceProducts,
  processSteps,
  reviewsPrimary,
  reviewsSecondary,
  staircase,
  why,
  whyItems,
} from "./data";
import ArchiveSection from "./sections/ArchiveSection";
import BeforeAfterSection from "./sections/BeforeAfterSection";
import BookingSection from "./sections/BookingSection";
import CategoriesSection from "./sections/CategoriesSection";
import ContactSection from "./sections/ContactSection";
import FeaturedProjectsSection from "./sections/FeaturedProjectsSection";
import FooterSection from "./sections/FooterSection";
import HeaderSection from "./sections/HeaderSection";
import HeroSection from "./sections/HeroSection";
import MaintenanceSection from "./sections/MaintenanceSection";
import ProcessSection from "./sections/ProcessSection";
import ProjectModal from "./sections/ProjectModal";
import ReviewsSection from "./sections/ReviewsSection";
import SocialSection from "./sections/SocialSection";
import StaircaseSection from "./sections/StaircaseSection";
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

      {/* 2. What you offer */}
      <CategoriesSection categories={categories} />

      {/* 3. Why choose us */}
      <WhySection why={why} whyItems={whyItems} />

      {/* 4. How easy it is to start */}
      <ProcessSection processSteps={processSteps} whatsappHref={links.whatsappGeneral} />

      {/* 5. Specific services */}
      <StaircaseSection staircase={staircase} whatsappHref={links.whatsappStairs} />

      {/* 6. Projects — curated first, then full archive */}
      <FeaturedProjectsSection
        featuredProjects={featuredProjects}
        onProjectOpen={setSelectedProject}
      />
      <BeforeAfterSection beforeAfter={beforeAfter} whatsappHref={links.whatsappGeneral} />

      {/* 8. Deep dive into all projects */}
      <ArchiveSection
        activeCategory={activeCategory}
        archiveFilters={archiveFilters}
        archiveProjects={archiveProjects}
        onCategoryChange={(cat) => startTransition(() => setActiveCategory(cat))}
        onProjectOpen={setSelectedProject}
      />

      {/* 9. Products */}
      <MaintenanceSection
        maintenanceProducts={maintenanceProducts}
        whatsappHref={links.whatsappMaintenanceHelp}
      />

      {/* 10. Social proof */}
      <ReviewsSection
        mapsHref={links.maps}
        mapsAllReviewsHref={links.mapsAllReviews}
        reviewsPrimary={reviewsPrimary}
        reviewsSecondary={reviewsSecondary}
      />

      {/* 11. Content */}
      <SocialSection instagramEmbeds={instagramEmbeds} instagramHref={links.instagram} />

      {/* 12–13. Action */}
      <BookingSection />
      <ContactSection contactItems={contactItems} whatsappHref={links.whatsappGeneral} />

      <FooterSection
        footer={footer}
        footerLinks={footerLinks}
        instagramHref={links.instagram}
        whatsappHref={links.whatsappGeneral}
      />

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </main>
  );
}
