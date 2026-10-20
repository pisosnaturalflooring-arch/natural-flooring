import NaturalFlooringPage from "../components/natural-flooring/NaturalFlooringPage";

// Sin proxy (o si falla), la home sale estática con la primera foto del hero.
// En el flujo normal, proxy.js reescribe "/" a una de las versiones de /inicio/[foto].
export default function HomePage() {
  return <NaturalFlooringPage heroImageIndex={0} />;
}
