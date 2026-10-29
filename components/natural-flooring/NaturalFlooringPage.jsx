import styles from "./SiteChrome.module.css";
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
  navLinks,
  processSteps,
  projectsIntro,
  reviewsPrimary,
  reviewsSecondary,
  showrooms,
  staircase,
  warranty,
  why,
  whyItems,
} from "./data";
import { practicalOptions, species, speciesOnRequest } from "./catalog";
import { DeferredWidgets, LazyTools } from "./HomeClientParts";
import ProjectsArea from "./ProjectsArea";
import BeforeAfterSection from "./sections/BeforeAfterSection";
import ContactSection from "./sections/ContactSection";
import FooterSection from "./sections/FooterSection";
import HeaderSection from "./sections/HeaderSection";
import HeroSection from "./sections/HeroSection";
import MaintenanceSection from "./sections/MaintenanceSection";
import ProcessSection from "./sections/ProcessSection";
import ReviewsSection from "./sections/ReviewsSection";
import SocialSection from "./sections/SocialSection";
import SpeciesWallSection from "./sections/SpeciesWallSection";
import StaircaseSection from "./sections/StaircaseSection";
import WarrantySection from "./sections/WarrantySection";
import WhySection from "./sections/WhySection";

/**
 * Home. Es un componente de servidor: los datos y las secciones estáticas se
 * renderizan en el servidor y no viajan como JS. Solo hidratan las partes
 * interactivas (header, escenas, obras, mantenimiento) y lo pesado se carga
 * diferido (asesor y visualizador, chatbot, popup).
 */
export default function NaturalFlooringPage({ heroImageIndex = 0 }) {
  return (
    <main className={styles.page}>
      <HeaderSection navLinks={navLinks} />

      {/* 1. What you do */}
      <HeroSection hero={hero} imageIndex={heroImageIndex} />

      {/* 2. Nosotros: quiénes somos y por qué elegirnos */}
      <WhySection why={why} whyItems={whyItems} />

      {/* 3. Productos: las maderas una por una. */}
      <SpeciesWallSection species={species} onRequest={speciesOnRequest} practical={practicalOptions} />

      {/* 4. How easy it is to start */}
      <ProcessSection processSteps={processSteps} whatsappHref={links.whatsappGeneral} />

      {/* 5. Specific services */}
      <StaircaseSection staircase={staircase} whatsappHref={links.whatsappStairs} />

      {/* 6. Asesor + visualizador: elegir el material y probarlo */}
      <LazyTools />

      {/* 7. Proyectos — curated first, then full archive */}
      <ProjectsArea
        featuredProjects={featuredProjects}
        projectsIntro={projectsIntro}
        archiveFilters={archiveFilters}
        archiveProjects={archiveProjects}
      >
        <BeforeAfterSection beforeAfter={beforeAfter} whatsappHref={links.whatsappGeneral} />
      </ProjectsArea>

      {/* 8. Garantías: el respaldo de las obras que se acaban de ver */}
      <WarrantySection warranty={warranty} whatsappHref={links.whatsappGeneral} />

      {/* 9. Maintenance products */}
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
      <SocialSection instagramPosts={instagramPosts} instagramHref={links.instagram} />

      {/* 12. Action: contacto con los dos showrooms */}
      <ContactSection contactItems={contactItems} whatsappHref={links.whatsappGeneral} />

      <FooterSection
        footer={footer}
        footerLinks={footerLinks}
        showrooms={showrooms}
        instagramHref={links.instagram}
        whatsappHref={links.whatsappGeneral}
      />

      <DeferredWidgets chatbotFaq={chatbotFaq} />
    </main>
  );
}
