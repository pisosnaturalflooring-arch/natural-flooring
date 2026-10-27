import NaturalFlooringPage from "../../../components/natural-flooring/NaturalFlooringPage";

export const metadata = {
  title: "Propuestas de inicio | Natural Flooring",
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export default function HeroProposalsPage() {
  return <NaturalFlooringPage previewHero />;
}
