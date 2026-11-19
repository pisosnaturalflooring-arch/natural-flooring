/**
 * Ficha del negocio para Google (datos estructurados schema.org, JSON-LD).
 * Le dice a Google que es un negocio local con dos showrooms, su teléfono,
 * horarios y redes: ayuda en búsquedas como "pisos de madera San Fernando".
 */

// Los dos showrooms abren en el mismo horario.
const HORARIO = [
  { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "13:00" },
  { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "14:00", closes: "17:00" },
  { dayOfWeek: ["Saturday"], opens: "09:00", closes: "13:00" },
];

const SHOWROOMS = [
  { id: "san-fernando", nombre: "San Fernando", calle: "3 de Febrero 234", localidad: "San Fernando", cp: "1646" },
  { id: "escobar", nombre: "Escobar", calle: "Linares 67", localidad: "Matheu, Escobar", cp: "B1627BBB" },
];

export function localBusinessJsonLd(siteUrl) {
  const url = siteUrl.replace(/\/$/, "");
  const empresa = {
    "@type": "Organization",
    "@id": `${url}/#empresa`,
    name: "Natural Flooring",
    url,
    logo: `${url}/logo-natural-flooring.png`,
    email: "pisosnaturalflooring@gmail.com",
    telephone: "+54 9 11 5737-7469",
    sameAs: ["https://www.instagram.com/naturalfloorings/"],
  };
  const showrooms = SHOWROOMS.map((s) => ({
    "@type": "HomeAndConstructionBusiness",
    "@id": `${url}/#showroom-${s.id}`,
    name: `Natural Flooring — ${s.nombre}`,
    description: "Pisos de madera, SPC y MDF, revestimientos, escaleras, decks, pérgolas y muelles, con instalación propia.",
    url,
    image: `${url}/og-image.jpg`,
    telephone: "+54 9 11 5737-7469",
    email: "pisosnaturalflooring@gmail.com",
    parentOrganization: { "@id": empresa["@id"] },
    address: {
      "@type": "PostalAddress",
      streetAddress: s.calle,
      addressLocality: s.localidad,
      addressRegion: "Provincia de Buenos Aires",
      postalCode: s.cp,
      addressCountry: "AR",
    },
    openingHoursSpecification: HORARIO.map((h) => ({ "@type": "OpeningHoursSpecification", ...h })),
    areaServed: ["Zona Norte del Gran Buenos Aires", "Ciudad Autónoma de Buenos Aires"],
  }));
  return { "@context": "https://schema.org", "@graph": [empresa, ...showrooms] };
}

/** Para meter en un <script type="application/ld+json"> sin que un "<" cierre el tag. */
export function jsonLdScript(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
