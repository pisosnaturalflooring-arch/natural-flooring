import { species, whatsappAbout } from "./catalog";

/**
 * Página /productos. El árbol (Pisos, Revestimientos, Escaleras, Exterior) es
 * el que dibujó el cliente; "Insumos y terminaciones" junta todo lo que no es
 * madera de la planilla del local (Listado de Productos y Servicios).
 *
 * Cada tipo tiene su "línea": los colores, especies o productos que venden.
 * Cada uno tiene su ficha (`facts`) con los datos de la planilla (código,
 * espesor, caja). Fotos: Drive del cliente, su tienda de Mercado Libre
 * (naturalflooringanddeck) y, para insumos genéricos, fotos de producto de
 * otras publicaciones. No se publica precio ni stock.
 */

// Datos de las especies (tono, dureza) que ya usa la home: se repiten en la ficha de cada madera.
const speciesAbout = Object.fromEntries(species.map((item) => [item.name, item.description]));
const about = (name) => speciesAbout[name] ?? speciesAbout[{ Urundel: "Urundel y curupay" }[name]];

const woodFloors = [
  { name: "Lapacho", detail: '3/4" y 1", de 3" a 6"', photo: "/images/maderas/lapacho-piso.jpg", facts: [["Espesor", '3/4" y 1"'], ["Ancho", '3", 4", 5" y 6"'], ["Largos", "Varios o fijos"], ["También", "Parquet y pre-finish habano"]] },
  { name: "Viraró", detail: '3/4" y 1", de 3" a 6"', photo: "/images/maderas/viraro-piso.jpg", facts: [["Espesor", '3/4" y 1"'], ["Ancho", '3", 4", 5" y 6"'], ["Largos", "Varios o fijos"], ["También", "Parquet 5 cm × 25/30 cm"]] },
  { name: "Guayubira", detail: '3/4"×3", 3/4"×4" y 1"×6"', photo: "/images/maderas/guayubira-piso-2.jpg", facts: [["Espesor", '3/4" y 1"'], ["Ancho", '3", 4" y 6"'], ["Largos", "Varios"]] },
  { name: "Incienso", detail: '3/4"×4" · solías a medida', photo: "/images/maderas/incienso-escalera-2.jpg", facts: [["Medida", '3/4" (15 mm) × 4" (9 cm)'], ["Largos", "Varios"], ["También", "Solías a medida"]] },
  { name: "Urundel", detail: '3/4"×3" y 3/4"×4"', photo: "/images/maderas/urundel-deck.jpg", facts: [["Espesor", '3/4"'], ["Ancho", '3" y 4"'], ["Largos", "Varios"]] },
  { name: "Eucalipto rostrata", detail: '3/4"×8 cm · espiga', photo: "/images/maderas/rostrata-piso.jpg", facts: [["Medida", '3/4" × 8 cm'], ["Colocación", "Entablonado o parquet en espiga"]] },
  { name: "Eucalipto blanco", detail: "Entablonado o espiga", photo: "/images/maderas/blanco-parquet.jpg", facts: [["Colocación", "Entablonado o parquet en espiga"]] },
  { name: "Guatambú", detail: "Para alto tránsito", photo: "/images/maderas/guatambu-piso.jpg", facts: [["Uso", "Alto tránsito: gimnasios y salones"]] },
  { name: "Pinotea", detail: 'Recuperada 1"×3"', photo: "/images/maderas/pinotea-piso.jpg", facts: [["Medida", '1" × 3"'], ["Largos", "Desde 2,80 m"], ["Origen", "Madera de recuperación"]] },
  { name: "Paraíso", detail: "A medida", facts: [["Medida", "A medida, por m²"]] },
].map((entry) => ({ ...entry, about: about(entry.name) }));

const spcColor = (name, code, thickness, box, extra = {}) => ({
  name,
  detail: [thickness, extra.note].filter(Boolean).join(" · "),
  facts: [["Código", code], ["Espesor", thickness], ["Caja", box], ...(extra.facts ?? [])],
  photo: extra.photo,
});

const mdfColor = (name, color, thickness, box, photo) => ({
  name,
  detail: thickness,
  facts: [["Color de fábrica", color], ["Espesor", thickness], ["Caja", box]],
  photo,
});

/**
 * Productos de mantenimiento que vende el local (planilla) y para qué sirve
 * cada uno. Fuentes: ficha técnica de Kekol K-412 (pisos plastificados,
 * hidrolaqueados y melamínicos), Vermeister para Detergente Neutro e Idronet,
 * guías de mantenimiento de SPC (detergente neutro, sin ceras ni solventes)
 * y las descripciones de la propia planilla para WPC Life y Zero Deck.
 */
const careProducts = {
  k412: { name: "Limpiador Kekol K-412", detail: "Limpieza a fondo de pisos plastificados, hidrolaqueados y flotantes", photo: "/images/productos/ml/kekol-k412.jpg", photoFit: "contain" },
  neutro: { name: "Detergente Neutro Vermeister", detail: "Limpieza diaria, sin enjuague y sin dañar la terminación", photo: "/images/products/vermeister-detergente.webp", photoFit: "contain" },
  idronet: { name: "Idronet Vermeister", detail: "Cera detergente autobrillo: limpia y revive la terminación", photo: "/images/productos/ml/vermeister-idronet.jpg", photoFit: "contain" },
  hidrolaca: { name: "Hidrolaca Kekol K-4035", detail: "Para renovar el brillo cuando el piso se gasta", photo: "/images/products/kekol-k4035.jpg", photoFit: "contain" },
  varathane: { name: "Varathane", detail: "Poliuretano al agua para renovar pisos y escaleras", photo: "/images/products/varathane-official.png", photoFit: "contain" },
  wpcCleaner: { name: "WPC Cleaner Vermeister", detail: "Limpieza profunda de WPC: saca verdín, hongos y manchas", photo: "/images/products/vermeister-wpc-cleaner.webp", photoFit: "contain" },
  wpcLife: { name: "WPC Life Vermeister", detail: "Mantenimiento de WPC y de madera aceitada al exterior", photo: "/images/productos/ml/vermeister-wpc-life.jpg", photoFit: "contain" },
  deckOil: { name: "Deck Oil Strong", detail: "Aceite protector para decks de madera" },
  zeroDeck: { name: "Zero Deck", detail: "Impregnante para madera al exterior" },
};

/** Cómo cuidar cada tipo: consejos y los productos que corresponden. */
const care = {
  wood: {
    tips: [
      "Barré o aspirá seguido: la arena es lo que más raya.",
      "Trapeá con el trapo bien escurrido, nunca con agua de más.",
      "Fieltro en las patas de sillas y muebles.",
      "Cuando la terminación se gasta, se pule y se vuelve a hidrolaquear.",
    ],
    products: ["neutro", "k412", "idronet", "hidrolaca", "varathane"],
  },
  prefinish: {
    tips: ["Barré o aspirá seguido.", "Trapo apenas húmedo con detergente neutro.", "Fieltro en las patas de los muebles."],
    products: ["neutro", "k412", "idronet"],
  },
  spc: {
    tips: [
      "Barré o aspirá seguido y trapeá con poca agua y detergente neutro.",
      "Nada de ceras, abrasivos ni solventes.",
      "Fieltro en las patas de los muebles para que no se marque.",
    ],
    products: ["neutro"],
  },
  mdf: {
    tips: [
      "Trapo bien escurrido: el agua estancada en las juntas lo hincha.",
      "Limpieza con productos para pisos flotantes, sin ceras.",
      "Fieltro en las patas de los muebles.",
    ],
    products: ["k412", "neutro"],
  },
  deckWood: {
    tips: [
      "Lavalo con agua y cepillo una o dos veces por año.",
      "Renová el aceite o el impregnante cuando la madera se ve gris o seca, más seguido si le da mucho sol.",
    ],
    products: ["deckOil", "zeroDeck", "wpcLife"],
  },
  wpc: {
    tips: ["Lavalo con agua y cepillo de cerdas suaves.", "Para manchas o verdín, limpiador específico para WPC. No hace falta aceitarlo."],
    products: ["wpcCleaner", "wpcLife"],
  },
};

const packshot = (photo) => ({ photo, photoFit: "contain" });

export const productCategories = [
  {
    id: "pisos",
    title: "Pisos",
    intro: "Madera maciza, pre-finish, SPC y MDF para adentro; decks de madera o WPC para afuera.",
    cover: { src: "/images/maderas/lapacho-piso.jpg", alt: "Comedor con piso de lapacho" },
    items: [
      {
        id: "pisos-madera-maciza",
        sharedSpecs: ["Se pule y se hidrolaquea en obra", "Se puede volver a pulir muchas veces", "Colocación con brea, film y fenólico, o pegado"],
        care: care.wood,
        unit: "Piso de madera maciza",
        navLabel: "Madera maciza",
        title: "Pisos de madera maciza",
        description:
          "La madera de verdad: se coloca, se pule y se hidrolaquea en obra, y se puede volver a pulir muchas veces a lo largo de los años.",
        specs: ['Espesores de 3/4" y 1"', 'Anchos de 3" a 6", largos varios', "Entablonado o parquet", "Colocación con brea, film y fenólico, o pegado"],
        photo: { src: "/images/maderas/viraro-piso.jpg", alt: "Living con piso de viraró" },
        lineLabel: "Las maderas",
        line: woodFloors,
        consult: "pisos de madera maciza",
      },
      {
        id: "pisos-pre-finish",
        sharedSpecs: ["Llega terminado de fábrica", "Se pega con adhesivo para pre-finished"],
        care: care.prefinish,
        unit: "Piso pre-finish",
        navLabel: "Pre-finish",
        title: "Pisos pre-finish",
        // TODO(cliente): lo anotó "a completar"; el texto sale de la planilla.
        description:
          "Madera que llega con la terminación de fábrica: se coloca y se pisa el mismo día, sin pulir ni hidrolaquear en obra.",
        specs: ["Se pega con adhesivo para pre-finished (Monosil)", "Sin polvo ni olor de laca en la casa"],
        photo: { src: "/images/roble-eslabonia-1.jpg", alt: "Living con piso de roble en espiga" },
        lineLabel: "La línea",
        line: [
          { name: "Roble natural mate", detail: "Ingeniería · caja de 2,77 m²", photo: "/images/roble-eslabonia-2.jpg", facts: [["Tipo", "Piso de ingeniería"], ["Terminación", "Mate"], ["Caja", "2,77 m²"]] },
          { name: "Curupay", detail: "12 mm × 7 cm", facts: [["Espesor", "12 mm"], ["Ancho", "7 cm"], ["Largos", "Varios"]] },
          { name: "Lapacho habano", detail: "20 mm × 12,5 cm", photo: "/images/productos/ml/prefinish-lapacho-habano.jpg", facts: [["Espesor", "20 mm"], ["Ancho", "12,5 cm"], ["Largos", "De 0,30 a 2,20 m"], ["Tono", "Habano"]] },
        ],
        consult: "pisos pre-finish",
      },
      {
        id: "pisos-spc",
        sharedSpecs: ["Tabla de 1,22 m × 18 cm", "Capa de uso de 0,3 mm", "100% resistente al agua", "Manta incluida"],
        care: care.spc,
        unit: "Piso SPC",
        navLabel: "SPC",
        title: "Pisos SPC",
        description:
          "Polvo de piedra caliza y PVC con la manta incluida. 100% resistente al agua: va en cocinas, baños y zonas húmedas sin deformarse con los cambios de temperatura.",
        specs: ["De 3,5 a 8 mm según la línea (la mayoría, 5 mm)", "Tabla de 1,22 m × 18 cm", "Capa de uso de 0,3 mm", "Manta incluida en la tabla"],
        photo: { src: "/images/productos/spc-gris-cemento.jpg", alt: "Habitación con piso SPC gris cemento" },
        lineLabel: "Los colores",
        line: [
          spcColor("Honey oak", "SPC-JC-002", "5 mm", "2,26 m²", { photo: "/images/maderas/spc-honey-oak.jpg" }),
          spcColor("Gris cemento", "062", "5 mm", "2,64 m²", { photo: "/images/productos/spc-gris-cemento-2.jpg" }),
          spcColor("Grey", "702016", "5 mm", "1,94 m²"),
          spcColor("Grimesse", "061", "5 mm", "2,20 m²"),
          spcColor("Cedrus", "1106", "5 mm", "2,17 m²"),
          spcColor("Roble natural", "1122", "5 mm", "2,20 m²", { facts: [["Manta", "Incluida"]] }),
          spcColor("Guatambú", "SPC 101", "5 mm", "2,23 m²"),
          spcColor("Nogal", "SPC 6092-15", "4 mm", "3,44 m²"),
          spcColor("Ocre", "1027", "3,5 mm + manta", "1,95 m²", { facts: [["Uso", "Tránsito domiciliario"]] }),
          spcColor("Roble europeo tabla ancha", "2396", "5 mm", "2,80 m²", { note: "por encargo", facts: [["Disponibilidad", "Por encargo"]] }),
          spcColor("Europa", "Línea Euro Tec", "6 mm", "2,43 m²", { note: "super alto tránsito", facts: [["Uso", "Super alto tránsito"], ["Tabla", "Ancha, colores varios"]] }),
          spcColor("Incienso", "767", "8 mm", "Consultar", { note: "super alto tránsito", facts: [["Uso", "Super alto tránsito"], ["Tabla", "Ancha"]] }),
          spcColor("Con base de corcho", "SPC1901L", "4 + 1 mm", "2,59 m²", { note: "por encargo", facts: [["Tabla", "1520 × 213 mm"], ["Disponibilidad", "Por encargo"]] }),
        ],
        extras: [
          "También vinílico para pegar: dry back de 3 mm para alto tránsito y autoadhesivo de 2 mm.",
          "Zócalos, terminaciones de aluminio y nariz de escalón al tono.",
        ],
        consult: "pisos SPC",
      },
      {
        id: "pisos-mdf",
        sharedSpecs: ["Sistema click, alto tránsito AC3", "Se coloca sobre manta de espuma de 2 mm"],
        care: care.mdf,
        unit: "Piso MDF",
        navLabel: "MDF",
        title: "Pisos MDF",
        description:
          "Piso flotante de melamina con sistema click que se encastra sobre una manta, sin pegar. Rápido de colocar y con muy buen precio.",
        specs: ["Alto tránsito AC3, sistema click", "7 mm: caja de 2,85 m²", "8 mm: caja de 1,90 m²", "Se coloca sobre manta de espuma de 2 mm"],
        photo: { src: "/images/roble-caoba-1.jpg", alt: "Habitación con piso flotante" },
        lineLabel: "Los colores",
        line: [
          mdfColor("Fresno", "Muson", "7 mm", "2,85 m²", "/images/productos/ml/mdf-fresno.jpg"),
          mdfColor("Okume", "Karayel", "7 mm", "2,85 m²", "/images/productos/ml/mdf-okume.jpg"),
          mdfColor("Roble blanco", "Alize", "7 mm", "2,85 m²", "/images/productos/ml/mdf-roble-blanco.jpg"),
          mdfColor("Haya", "Samyeli", "7 mm", "2,85 m²", "/images/productos/ml/mdf-haya.jpg"),
          mdfColor("Roble veteado", "Budgay", "7 mm", "2,85 m²"),
          mdfColor("Parquet", "Dogal", "8 mm", "1,90 m²"),
          mdfColor("Abeto", "Falcon", "8 mm", "1,90 m²"),
          mdfColor("Alask", "Alask", "8 mm", "1,90 m²"),
        ],
        consult: "pisos MDF",
      },
      {
        id: "pisos-deck-madera",
        sharedSpecs: ["Colocación con clips ocultos", "Sobre tirantes de madera dura o perfil galvanizado"],
        care: care.deckWood,
        unit: "Deck de madera",
        navLabel: "Deck de madera",
        kicker: "Exterior",
        title: "Deck de madera maciza",
        description:
          "Maderas duras para galerías, piletas y terrazas, colocadas con clips ocultos sobre tirantería de madera dura o perfil galvanizado.",
        specs: ['Tablas de 1"×3" a 1"×6"', "Largos varios o fijos", "Sistema click con clips (500 clips rinden 12 m²)"],
        photo: { src: "/images/maderas/lapacho-deck.jpg", alt: "Deck de lapacho junto a la pileta" },
        lineLabel: "Las maderas",
        line: [
          { name: "Lapacho", detail: '1"×3" a 1"×6"', photo: "/images/maderas/lapacho-deck-2.jpg", facts: [["Medidas", '1" × 3", 4", 5" y 6"'], ["Largos", "Varios o fijos (con recargo)"], ["Colocación", "Con clips ocultos"]] },
          { name: "Guayubira", detail: "Con clip", photo: "/images/maderas/guayubira-deck.jpg", facts: [["Colocación", "Sistema click con clips"]] },
          { name: "Eucalipto grandis", detail: '1"×3" y 1"×4"', photo: "/images/maderas/grandis-deck.jpg", facts: [["Medidas", '1" × 3" y 1" × 4"']] },
          { name: "Urundel y curupay", detail: "Con clip", photo: "/images/maderas/urundel-deck.jpg", facts: [["Medidas", '1" × 3" y 1" × 4"'], ["Colocación", "Sistema click con clips"]] },
          { name: "Anchico", detail: '1"×4"', facts: [["Medida", '1" × 4"']] },
          { name: "Incienso", detail: '1"×4"', facts: [["Medida", '1" × 4"']] },
        ].map((entry) => ({ ...entry, about: about(entry.name) })),
        extras: ["Tornillos y clips para deck, tirantes de madera dura, perfil C galvanizado, Deck Oil e impregnante Zero Deck."],
        consult: "deck de madera maciza",
      },
      {
        id: "pisos-deck-wpc",
        care: care.wpc,
        unit: "Deck WPC",
        navLabel: "Deck WPC",
        kicker: "Exterior",
        title: "Deck de WPC",
        // TODO(cliente): anotó "información"; el texto sale de la planilla.
        description:
          "Compuesto de madera y polímero co-extruido: no se pudre, no astilla y no hay que aceitarlo nunca.",
        specs: ["Tabla bicolor de 23 mm × 14,2 cm × 2,90 m", "Caja de 4 tablas (1,64 m²)", "Clips, tornillos punta mecha y ángulo en L al tono"],
        photo: { src: "/images/deck-wpc-patio-pileta.jpg", alt: "Deck WPC en patio con pileta" },
        lineLabel: "La línea",
        line: [
          { name: "Deck WPC bicolor", detail: "23 mm × 14,2 cm × 2,90 m", photo: "/images/productos/ml/deck-wpc-bicolor.jpg", facts: [["Medida", "23 mm × 14,2 cm × 2,90 m"], ["Caja", "4 tablas (1,64 m²)"], ["Fabricación", "Co-extrusión, bicolor"]] },
          { name: "Clips para deck WPC", detail: "Bolsa de 250", ...packshot("/images/productos/ml/clips-deck-wpc.jpg"), facts: [["Presentación", "Bolsa de 250 unidades"]] },
          { name: "Tornillos punta mecha", detail: '6" × 1 1/4" · 250 u', facts: [["Medida", '6" × 1 1/4"'], ["Presentación", "250 unidades"]] },
          { name: "Ángulo en L gris ceniza", detail: "60 × 60 mm × 2,90 m", facts: [["Medida", "60 × 60 mm × 2,90 m"], ["Color", "Gris ceniza"]] },
        ],
        consult: "deck de WPC",
      },
    ],
  },
  {
    id: "revestimientos",
    title: "Revestimientos",
    intro: "Paredes, techos y fachadas en madera maciza o WPC, para interior y exterior.",
    cover: { src: "/images/revestimiento-pared-madera.jpeg", alt: "Pared revestida en madera" },
    items: [
      {
        id: "revestimientos-madera-maciza",
        unit: "Revestimiento de madera",
        navLabel: "Madera maciza",
        title: "Revestimiento de madera maciza",
        description: "Paredes y techos en madera natural, para adentro y para afuera. Suman textura y calidez a cualquier ambiente.",
        specs: ["Interior y exterior", "Largos fijos"],
        photo: { src: "/images/revestimiento-pared-madera.jpeg", alt: "Pared revestida en madera" },
        lineLabel: "Las maderas",
        line: [
          { name: "Lapacho", detail: '1"×2"', facts: [["Medida", '1" × 2"']] },
          { name: "Eucalipto grandis", detail: "Con bisel", facts: [["Terminación", "Con bisel"], ["Largos", "Fijos"]] },
        ].map((entry) => ({ ...entry, about: about(entry.name) })),
        consult: "revestimiento de madera maciza",
      },
      {
        id: "revestimientos-wpc",
        care: care.wpc,
        unit: "Revestimiento WPC",
        navLabel: "WPC (siding)",
        title: "Revestimiento WPC (siding)",
        description: "Siding de WPC para fachadas y paredes: aguanta la intemperie sin pintar ni tratar.",
        specs: ["Interior: 24 mm × 16,8 cm × 2,70 m", "Exterior: 26 mm × 21,9 cm × 2,90 m", "Colocación incluida si la necesitás"],
        photo: { src: "/images/deck-wpc-detalle.jpg", alt: "Detalle de tablas de WPC" },
        consult: "revestimiento WPC",
      },
    ],
  },
  {
    id: "escaleras",
    title: "Escaleras",
    intro: "Revestimos la escalera que ya tenés, sin demolición, en madera maciza o en SPC.",
    cover: { src: "/images/escalera-lapacho-3.jpg", alt: "Escalera revestida en lapacho" },
    items: [
      {
        id: "escaleras-madera-maciza",
        sharedSpecs: ["Calidad primera", "Hechos a medida sobre la escalera existente", "Hidrolaqueado en pisada y frente"],
        care: care.wood,
        unit: "Escalera de madera",
        navLabel: "Madera maciza",
        title: "Escaleras de madera maciza",
        description:
          "Escalones, frentines y descansos hechos a medida sobre la escalera existente, con hidrolaqueado en pisada y frente.",
        specs: ["Calidad primera", "Escalones, frentines y descansos a medida", "Una escalera promedio de 15 escalones se hace en pocos días"],
        photo: { src: "/images/escalera-lapacho-3.jpg", alt: "Escalera revestida en lapacho" },
        lineLabel: "Las maderas",
        line: [
          { name: "Lapacho", photo: "/images/maderas/lapacho-escalera.jpg", facts: [["Piezas", "Escalones y descansos a medida"]] },
          { name: "Viraró", photo: "/images/maderas/viraro-escalera.jpg", facts: [["Piezas", "Escalones y frentines"]] },
          { name: "Guayubira", photo: "/images/maderas/guayubira-escalera.jpg", facts: [["Piezas", "A medida"]] },
          { name: "Incienso", photo: "/images/maderas/incienso-escalera.jpg", facts: [["Piezas", "Escalones, frentines y descansos"]] },
          { name: "Petiribí", photo: "/images/maderas/petiribi-escalera.jpg", facts: [["Piezas", "Escalones y descansos"]] },
          { name: "Eucalipto grandis", photo: "/images/escalera-grandis-1.jpg", facts: [["Piezas", "Escalones y frentines"]] },
        ].map((entry) => ({ ...entry, about: about(entry.name) })),
        consult: "escaleras de madera maciza",
      },
      {
        id: "escaleras-spc",
        care: care.spc,
        unit: "Escalera en SPC",
        navLabel: "Piso SPC",
        title: "Escaleras en piso SPC",
        description: "Pisada y frente en SPC sobre la escalera existente: una renovación rápida, resistente y que no se mancha con agua.",
        specs: ["Nariz de escalón línea Europa (25 × 72 mm)", "Zócalos y terminación de aluminio", "Mismos colores que los pisos SPC"],
        photo: { src: "/images/escalera-vinilica.jpg", alt: "Escalera revestida en piso SPC" },
        consult: "escaleras en piso SPC",
      },
    ],
  },
  {
    id: "exterior",
    title: "Exterior",
    intro: "Estructuras a medida para disfrutar del aire libre.",
    cover: { src: "/images/deck-lapacho-terraza.jpg", alt: "Terraza con deck de lapacho y pérgola" },
    items: [
      {
        id: "exterior-pergolas",
        care: care.deckWood,
        unit: "A medida",
        navLabel: "Pérgolas",
        title: "Pérgolas",
        description: "Estructuras de madera dura para dar sombra y definir espacios en patios y terrazas.",
        specs: ["A medida", "Maderas duras para exterior"],
        photo: { src: "/images/deck-lapacho-terraza.jpg", alt: "Terraza con deck de lapacho y pérgola" },
        consult: "pérgolas",
      },
      {
        id: "exterior-muelles",
        care: care.deckWood,
        unit: "A medida",
        navLabel: "Muelles",
        title: "Muelles",
        description: "Muelles y embarcaderos en maderas preparadas para el agua y la intemperie.",
        specs: ["A medida", "Maderas duras para el agua"],
        photo: { src: "/images/deck-lapacho-jacuzzi.jpg", alt: "Deck de lapacho junto al agua" },
        consult: "muelles",
      },
    ],
  },
  {
    id: "insumos",
    title: "Insumos y terminaciones",
    intro: "Todo lo que lleva un piso para quedar bien terminado y durar: zócalos, perfiles, adhesivos, lacas y productos de limpieza.",
    cover: { src: "/images/productos/ml/zocalo-eucalipto.jpg", alt: "Zócalo de eucalipto macizo" },
    items: [
      {
        id: "insumos-zocalos",
        sharedSpecs: ["Largos varios o a medida"],
        unit: "Zócalo",
        navLabel: "Zócalos",
        title: "Zócalos",
        description: "Macizos para pintar o entintar, pre-pintados listos para colocar, o de PVC que no les entra el agua.",
        photo: { src: "/images/maderas/zocalo-moldura.jpg", alt: "Zócalo de madera con moldura" },
        specs: ["Canto recto, redondo o con moldura", "Largos varios o a medida"],
        lineLabel: "Los zócalos",
        line: [
          { name: "Eucalipto macizo", detail: '3/4" × 2", 3", 4" y 6"', ...packshot("/images/productos/ml/zocalo-eucalipto.jpg"), facts: [["Medidas", '3/4" × 2", 3", 4" y 6"'], ["Cantos", "Recto, redondo o moldura"], ["Terminación", "Se puede entintar, laquear o pintar"]] },
          { name: "Kiri macizo", detail: '3/4" × 2", 3", 4" y 12 cm', ...packshot("/images/productos/ml/zocalo-kiri.jpg"), facts: [["Medidas", '3/4" × 2", 3", 4" y 12 cm'], ["Cantos", "Recto, redondo o moldura"], ["Ideal para", "Pintar: es liviano y estable"]] },
          { name: "MDF pre-pintado recto", detail: "7,5 y 9,5 cm", ...packshot("/images/productos/ml/zocalo-mdf-recto.jpg"), facts: [["Alto", "7,5 y 9,5 cm"], ["Largo", "2,75 m"], ["Color", "Blanco"]] },
          { name: "MDF pre-pintado con moldura", detail: "10,3 y 12,6 cm", ...packshot("/images/productos/ml/zocalo-mdf-moldura.jpg"), facts: [["Alto", "10,3 y 12,6 cm"], ["Largo", "2,75 m"], ["Color", "Blanco"]] },
          { name: "PVC blanco", detail: "5, 7, 10 y 15 cm", ...packshot("/images/productos/ml/zocalo-pvc-blanco.jpg"), facts: [["Alto", "5, 7, 10 y 15 cm"], ["Largo", "2,20 y 2,40 m"], ["Ventaja", "No le afecta el agua"]] },
          { name: "PVC negro", detail: "10 cm", ...packshot("/images/productos/ml/zocalo-pvc-negro.jpg"), facts: [["Alto", "10 cm"], ["Largo", "2,20 m"]] },
          { name: "Foliado", detail: "6 cm, colores varios", ...packshot("/images/productos/ml/zocalo-foliado.jpg"), facts: [["Alto", "6 cm"], ["Largo", "2,65 m"], ["Colores", "Varios (saldos)"]] },
          { name: "Cuarta caña", detail: "PVC o kiri", ...packshot("/images/productos/ml/cuarta-cana-pvc.jpg"), facts: [["PVC", "15 × 15 y 17 × 17 mm"], ["Kiri", "15 × 15 mm, largos varios"]] },
          { name: "Contramarco de eucalipto", detail: '2", largos varios', facts: [["Medida", '2"'], ["Largos", "Varios"]] },
        ],
        consult: "zócalos",
      },
      {
        id: "insumos-terminaciones",
        unit: "Perfil de aluminio",
        navLabel: "Perfiles de aluminio",
        title: "Terminaciones de aluminio",
        description: "Perfiles para unir pisos distintos, salvar desniveles y terminar bordes sin que se levanten.",
        specs: ["Colores: plata, oro, champagne y bronce"],
        lineLabel: "Los perfiles",
        line: [
          { name: "Desnivel (curva)", detail: "0,95 y 2,70 m", ...packshot("/images/productos/ml/perfil-desnivel.jpg"), facts: [["Largos", "0,95 y 2,70 m"], ["Colores", "Plata, oro, champagne y bronce"], ["Uso", "Unir pisos de distinta altura"]] },
          { name: "Plana", detail: "0,95 y 2,70 m", ...packshot("/images/productos/ml/perfil-plano.jpg"), facts: [["Largos", "0,95 y 2,70 m"], ["Colores", "Plata, oro, champagne y bronce"], ["Uso", "Unir pisos a la misma altura"]] },
          { name: "Ángulo en L", detail: "24 × 10 y 24 × 24 mm", ...packshot("/images/productos/ml/perfil-angulo.jpg"), facts: [["Medidas", "24 × 10 mm (2,50 m) y 24 × 24 mm (2 m)"], ["Colores", "Plata, oro, champagne y bronce"], ["Uso", "Bordes y escalones"]] },
        ],
        consult: "terminaciones de aluminio",
      },
      {
        id: "insumos-colocacion",
        unit: "Para colocar",
        navLabel: "Para colocar",
        title: "Para colocar",
        description: "Lo mismo que usamos en nuestras obras, para que el piso quede firme y nivelado.",
        photo: { src: "/images/products/kekol-k1004.jpg", alt: "Adhesivo Kekol K-1004", fit: "contain" },
        lineLabel: "Los productos",
        line: [
          { name: "Kekol K-1004", detail: "Adhesivo vinílico para madera", ...packshot("/images/products/kekol-k1004.jpg"), facts: [["Uso", "Pegar pisos de madera"], ["Presentación", "1, 5, 12 y 25 kg"]] },
          { name: "Kekol K-300", detail: "Adhesivo bicomponente", ...packshot("/images/productos/ml/kekol-k300.jpg"), facts: [["Uso", "Madera sobre carpeta"], ["Presentación", "1 y 10 kg"]] },
          { name: "Repox Vermeister", detail: "Bicomponente epoxi-poliuretánico", ...packshot("/images/productos/ml/vermeister-repox.jpg"), facts: [["Uso", "Pisos de madera"], ["Secado", "24 horas"], ["Presentación", "11 kg"]] },
          { name: "Kekol KS-518", detail: "Adhesivo PU expansible", ...packshot("/images/productos/ml/kekol-ks518.jpg"), facts: [["Tipo", "Poliuretánico monocomponente"], ["Presentación", "0,5 kg"]] },
          { name: "Kekol K-645", detail: "Adhesivo para vinílicos", ...packshot("/images/productos/ml/kekol-k645.jpg"), facts: [["Uso", "Pisos vinílicos"], ["Presentación", "1, 5, 10 y 25 kg"]] },
          { name: "Kekol K-2024", detail: "Adhesivo de contacto", ...packshot("/images/productos/ml/kekol-k2024.jpg"), facts: [["Presentación", "2,8 kg"], ["También", "Doble contacto de 8 kg"]] },
          { name: "Kekol K-H60", detail: "Imprimación reguladora de humedad", ...packshot("/images/productos/ml/kekol-kh60.jpg"), facts: [["Uso", "Consolidar carpetas con humedad"], ["Presentación", "4 L"]] },
          { name: "Kekol KL-73", detail: "Masa niveladora", ...packshot("/images/productos/ml/kekol-kl73.jpg"), facts: [["Presentación", "7 y 35 kg"], ["Tipo", "Bicomponente (líquido + masa)"]] },
          { name: "Manta espuma blanca", detail: "2 mm · rinde 20 m²", ...packshot("/images/productos/ml/manta-espuma-blanca.jpg"), facts: [["Espesor", "2 mm"], ["Rollo", "1 × 20 m (20 m²)"], ["Uso", "Bajo pisos flotantes"]] },
          { name: "Manta negra para SPC", detail: "1,5 mm × 20 m", ...packshot("/images/productos/ml/manta-negra-spc.jpg"), facts: [["Espesor", "1,5 mm"], ["Rollo", "20 m"]] },
          { name: "Brea", detail: "18 kg", ...packshot("/images/productos/ml/brea.jpg"), facts: [["Presentación", "18 kg"], ["Uso", "Colocación de pisos de madera en planta baja"]] },
          { name: "Film de 200 micrones", detail: "Por m²", ...packshot("/images/productos/ml/film-200.jpg"), facts: [["Espesor", "200 micrones"], ["Venta", "Por metro"]] },
          { name: "Placa fenólica", detail: "6 mm", ...packshot("/images/productos/ml/placa-fenolica.jpg"), facts: [["Espesor", "6 mm"], ["Venta", "Por tira o por m²"]] },
          { name: "Silicona profesional", detail: "310 ml", ...packshot("/images/productos/ml/silicona-neutra.jpg"), facts: [["Presentación", "310 ml"], ["Rinde", "Unos 15 m de zócalo"]] },
          { name: "Kekol K-3", detail: "Imprimación poliuretánica", facts: [["Uso", "Sellar carpetas cementicias"], ["Presentación", "4 L"]] },
          { name: "Monosil", detail: "Adhesivo para pre-finish", facts: [["Presentación", "12 kg"]] },
          { name: "Kleiberit PUR", detail: "Adhesivo PU alemán", facts: [["Presentación", "0,5 kg"]] },
          { name: "Clavos 14/40", detail: "Sin cabeza, endurecidos", facts: [["Uso", "Zócalos y parquet"]] },
        ],
        consult: "productos para colocar pisos",
      },
      {
        id: "insumos-terminacion-madera",
        unit: "Para terminar la madera",
        navLabel: "Para terminar la madera",
        title: "Para terminar la madera",
        description: "Selladores, lacas e hidrolacas para el pulido y la renovación de pisos y escaleras.",
        photo: { src: "/images/products/kekol-k4035.jpg", alt: "Hidrolaca Kekol K-4035", fit: "contain" },
        lineLabel: "Los productos",
        line: [
          { name: "Sellador Kekol K-403", detail: "Al agua", ...packshot("/images/products/kekol-k403.jpg"), facts: [["Base", "Acuosa"], ["Presentación", "1 y 4 L"]] },
          { name: "Sellador Kekol K-404", detail: "Al solvente", ...packshot("/images/productos/ml/kekol-k404.jpg"), facts: [["Base", "Solvente"], ["Presentación", "1 y 4 L"]] },
          { name: "Hidrolaca Kekol K-4035", detail: "Brillante o satinada", ...packshot("/images/products/kekol-k4035.jpg"), facts: [["Base", "Agua"], ["Terminación", "Brillante o satinada"], ["Presentación", "1 y 4 L"]] },
          { name: "Laca Kekol K-4045", detail: "Brillante o satinada", ...packshot("/images/products/kekol-k4045-official.jpg"), facts: [["Base", "Solvente, alto tránsito"], ["Terminación", "Brillante o satinada"], ["Presentación", "1 y 4 L"]] },
          { name: "Varathane", detail: "Brillante o satinado", ...packshot("/images/products/varathane-official.png"), facts: [["Base", "Agua"], ["Presentación", "3,75 y 18 L"], ["Rinde", "50 m² cada 3,75 L"]] },
          { name: "Diluyente para lacas", detail: "1 y 4 L", facts: [["Uso", "Rendir más la laca poliuretánica"]] },
          { name: "Sellador para juntas", detail: "K-457 y Zero filler", facts: [["Uso", "Se mezcla con aserrín para tapar juntas"]] },
          { name: "Deck Oil Strong", detail: "Aceite para deck", facts: [["Uso", "Proteger decks de madera"]] },
          { name: "Zero Deck", detail: "Impregnante para exterior", facts: [["Uso", "Madera al exterior"]] },
        ],
        consult: "lacas e hidrolacas",
      },
      {
        id: "insumos-limpieza",
        unit: "Limpieza",
        navLabel: "Limpieza",
        title: "Limpieza y mantenimiento",
        description: "Para cuidar el piso todos los días sin dañar la terminación.",
        photo: { src: "/images/products/vermeister-detergente.webp", alt: "Detergente neutro Vermeister", fit: "contain" },
        lineLabel: "Los productos",
        line: Object.entries(careProducts)
          .filter(([key]) => ["k412", "neutro", "idronet", "wpcCleaner", "wpcLife"].includes(key))
          .map(([, product]) => ({ ...product, facts: [["Para qué", product.detail]] })),
        consult: "productos de limpieza para pisos",
      },
    ],
  },
].map((category) => ({
  ...category,
  items: category.items.map((item) => ({ ...item, href: whatsappAbout(item.consult) })),
}));

/** Id corto del tipo para la URL: "pisos-spc" → "spc". */
function typeSlug(category, item) {
  return item.id.slice(category.id.length + 1);
}

/** "Roble europeo tabla ancha" → "roble-europeo-tabla-ancha". */
export function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Tipos de una categoría (o de todas): lo que se filtra en /productos.
 * Cada tipo trae sus productos: cada especie o color es una ficha propia con
 * su página (/productos/pisos/spc/honey-oak); si el tipo no tiene línea, el
 * tipo mismo es el producto.
 */
export function productTypes(categoryId) {
  const categories = categoryId ? productCategories.filter((c) => c.id === categoryId) : productCategories;
  return categories.flatMap((category) =>
    category.items.map((item) => {
      const slug = typeSlug(category, item);
      const detailHref = `/productos/${category.id}/${slug}`;
      const products = item.line
        ? item.line.map((entry) => {
            const productSlug = slugify(entry.name);
            return {
              id: `${item.id}-${productSlug}`,
              slug: productSlug,
              name: entry.name,
              unit: item.unit,
              detail: entry.detail,
              facts: entry.facts ?? (entry.detail ? [["Medidas", entry.detail]] : []),
              about: entry.about ?? null,
              photo: entry.photo ? { src: entry.photo, alt: `${item.unit} ${entry.name}`, fit: entry.photoFit } : null,
              href: whatsappAbout(`${item.unit.toLowerCase()} ${entry.name.toLowerCase()}`),
              detailHref: `${detailHref}/${productSlug}`,
              typeHref: detailHref,
            };
          })
        : [
            {
              id: item.id,
              slug: null,
              name: item.navLabel,
              unit: item.unit,
              detail: item.specs?.[0],
              facts: [],
              about: null,
              photo: item.photo ?? null,
              href: item.href,
              detailHref,
              typeHref: detailHref,
            },
          ];
      const careInfo = item.care
        ? {
            tips: item.care.tips,
            products: item.care.products.map((key) => {
              const product = careProducts[key];
              return {
                id: `${item.id}-cuidado-${key}`,
                name: product.name,
                unit: "Mantenimiento",
                detail: product.detail,
                photo: product.photo ? { src: product.photo, alt: product.name, fit: product.photoFit } : null,
                href: whatsappAbout(product.name),
              };
            }),
          }
        : null;
      // Primero las que tienen foto, así las filas de la grilla quedan parejas.
      products.sort((a, b) => Number(Boolean(b.photo)) - Number(Boolean(a.photo)));
      return {
        ...item,
        slug,
        detailHref,
        hasLine: Boolean(item.line),
        care: careInfo,
        category: { id: category.id, title: category.title },
        products,
      };
    })
  );
}

/** Un producto de la línea por su URL, con su tipo. */
export function findProduct(categoryId, typeSlugValue, productSlug) {
  const type = productTypes(categoryId).find((item) => item.slug === typeSlugValue);
  const product = type?.products.find((item) => item.slug === productSlug);
  return type && product ? { type, product } : null;
}
