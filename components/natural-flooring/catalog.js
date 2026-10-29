/**
 * Catálogo armado desde dos fuentes del local:
 *  - Drive "Catálogo Natural": fotos de obras propias, por línea y especie.
 *  - Planilla "Listado de Productos y Servicios" (export del ERP): qué
 *    presentaciones y medidas venden de verdad.
 *
 * De la planilla no se publica precio ni stock: hay precio en 8 filas de 230
 * y stock negativo en muchas (ver docs/superpowers/specs/2026-07-30-...).
 *
 * TODO(cliente): validar los textos de tono y dureza de cada especie.
 */

const WHATSAPP_PHONE = "5491169977725";

// Link de WhatsApp con un mensaje que ya nombra lo consultado.
export function whatsappAbout(producto) {
  const text = `Hola! Quiero consultar por ${producto}. ¿Me pueden asesorar?`;
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(text)}`;
}

/**
 * Especies con fotos de obras propias, en el orden en que salen de la pared.
 * `tabla` es un recorte de una foto real de esa especie (no una textura genérica).
 */
export const species = [
  {
    id: "lapacho",
    name: "Lapacho",
    description:
      "Oscura, de castaño a oliva. De las más duras: aguanta el tránsito de una casa y la intemperie.",
    uses: ["Piso", "Escalera", "Deck", "Revestimiento"],
    sizes: 'Piso 3/4" y 1", de 3" a 6" de ancho · parquet · pre-finish habano · deck 1"×3" a 1"×6"',
    tabla: "/images/maderas/tabla-lapacho.jpg",
    photo: { src: "/images/maderas/lapacho-piso.jpg", alt: "Comedor con piso de lapacho" },
    detail: { src: "/images/maderas/lapacho-escalera.jpg", alt: "Escalera revestida en lapacho" },
  },
  {
    id: "viraro",
    name: "Viraró",
    description: "Castaño medio con la veta bien marcada. Dura y estable, la clásica de los pisos porteños.",
    uses: ["Piso", "Escalera"],
    sizes: 'Piso 3/4"×3", 3/4"×4", 1"×4", 1"×5" y 1"×6" · parquet',
    tabla: "/images/maderas/tabla-viraro.jpg",
    photo: { src: "/images/maderas/viraro-piso.jpg", alt: "Living con piso de viraró pulido" },
    detail: { src: "/images/maderas/viraro-escalera.jpg", alt: "Escalera de viraró con baranda de hierro" },
  },
  {
    id: "guayubira",
    name: "Guayubira",
    description: "Vetas oscuras sobre fondo claro: cada tabla es distinta y el piso nunca se ve repetido.",
    uses: ["Piso", "Escalera", "Deck"],
    sizes: 'Piso 3/4"×3", 3/4"×4" y 1"×6" · deck con clip',
    tabla: "/images/maderas/tabla-guayubira.jpg",
    photo: { src: "/images/maderas/guayubira-piso-2.jpg", alt: "Habitación con piso de guayubira" },
    detail: { src: "/images/maderas/guayubira-escalera.jpg", alt: "Escalera revestida en guayubira" },
  },
  {
    id: "incienso",
    name: "Incienso",
    description: "Castaño rojizo y parejo, muy dura. La elegimos para escalones, descansos y solías.",
    uses: ["Piso", "Escalera", "Deck"],
    sizes: 'Piso 3/4"×4" · escalones, frentines y descansos a medida',
    tabla: "/images/maderas/tabla-incienso.jpg",
    photo: { src: "/images/maderas/incienso-escalera.jpg", alt: "Escalera de incienso vista desde arriba" },
    detail: { src: "/images/maderas/incienso-escalera-2.jpg", alt: "Descanso de escalera en incienso" },
  },
  {
    id: "urundel",
    name: "Urundel y curupay",
    description: "Rojizas y muy densas. Las que mejor se bancan un balcón o un deck al sol.",
    uses: ["Piso", "Deck"],
    sizes: 'Piso 3/4"×3" y 3/4"×4" · curupay pre-finish 12 mm · deck 1"×3" y 1"×4"',
    tabla: "/images/maderas/tabla-urundel.jpg",
    photo: { src: "/images/maderas/urundel-deck.jpg", alt: "Balcón con deck de urundel" },
  },
  {
    id: "rostrata",
    name: "Eucalipto rostrata",
    description: "Rojiza, dura y estable. Queda bien entablonada o en espiga.",
    uses: ["Piso"],
    sizes: 'Piso 3/4"×8 cm · parquet en espiga',
    tabla: "/images/maderas/tabla-rostrata.jpg",
    photo: { src: "/images/maderas/rostrata-piso.jpg", alt: "Dormitorio con piso de eucalipto rostrata" },
    detail: { src: "/images/maderas/rostrata-parquet.jpg", alt: "Parquet de eucalipto rostrata en espiga" },
  },
  {
    id: "eucalipto-blanco",
    name: "Eucalipto blanco",
    description: "Color miel claro y veta suave. Ilumina el ambiente; en espiga luce muchísimo.",
    uses: ["Piso"],
    sizes: "Entablonado o parquet en espiga",
    tabla: "/images/maderas/tabla-blanco.jpg",
    photo: { src: "/images/maderas/blanco-parquet.jpg", alt: "Ambiente con parquet de eucalipto blanco en espiga" },
    detail: { src: "/images/maderas/blanco-piso.jpg", alt: "Habitación con piso entablonado de eucalipto blanco" },
  },
  {
    id: "guatambu",
    name: "Guatambú",
    description: "Blanco amarillento, parejo y resistente al roce. El de los gimnasios y salones de baile.",
    uses: ["Piso"],
    sizes: "Entablonado para alto tránsito",
    tabla: "/images/maderas/tabla-guatambu.jpg",
    photo: { src: "/images/maderas/guatambu-piso.jpg", alt: "Salón con piso de guatambú recién hidrolaqueado" },
    detail: { src: "/images/gym-guatambu-IMG_7570.jpg", alt: "Gimnasio con piso de guatambú" },
  },
  {
    id: "pinotea",
    name: "Pinotea",
    description: "Pino de recuperación, ámbar y con mucha veta. Tablas con historia, sacadas de obras viejas.",
    uses: ["Piso"],
    sizes: 'Recuperada 1"×3", largos desde 2,80 m',
    tabla: "/images/maderas/tabla-pinotea.jpg",
    photo: { src: "/images/maderas/pinotea-piso.jpg", alt: "Habitación con piso de pinotea" },
    detail: { src: "/images/maderas/pinotea-piso-2.jpg", alt: "Pasillo con piso de pinotea" },
  },
  {
    id: "grandis",
    name: "Eucalipto grandis",
    description: "Clara y rosada, liviana. Toma bien tintes y lacas; rinde en escaleras, decks y zócalos.",
    uses: ["Escalera", "Deck", "Revestimiento"],
    sizes: 'Escalones y frentines · deck 1"×3" y 1"×4" · revestimiento con bisel',
    tabla: "/images/maderas/tabla-grandis.jpg",
    photo: { src: "/images/escalera-grandis-1.jpg", alt: "Escalera revestida en eucalipto grandis" },
    detail: { src: "/images/maderas/grandis-deck.jpg", alt: "Deck de eucalipto grandis" },
  },
  {
    id: "petiribi",
    name: "Petiribí",
    description: "Dorado y de veta fina. Semidura y muy elegida para escaleras.",
    uses: ["Escalera"],
    sizes: "Escalones y descansos a medida",
    tabla: "/images/maderas/tabla-petiribi.jpg",
    photo: { src: "/images/maderas/petiribi-escalera.jpg", alt: "Escalera de petiribí con baranda de varillas" },
    detail: { src: "/images/despues-petiribi-hidrolaqueado.jpg", alt: "Escalones de petiribí hidrolaqueados" },
  },
].map((item) => ({ ...item, href: whatsappAbout(`madera de ${item.name.toLowerCase()}`) }));

export const speciesOnRequest = "También trabajamos anchico y paraíso a pedido.";

/** Línea al pie de "Las maderas" que lleva al catálogo completo. */
export const practicalOptions = {
  text: "Ver todos los productos: SPC, MDF, pre-finish, revestimientos e insumos",
  href: "/productos",
};
