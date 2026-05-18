export const links = {
  mlStore: "https://listado.mercadolibre.com.ar/pagina/naturalflooringanddeck/",
  whatsappGeneral:
    'https://api.whatsapp.com/send?phone=5491169977725&text=%22%C2%A1Hola!%20Estoy%20interesado%2Fa%20en%20sus%20pisos%20de%20madera%20y%20productos%20de%20instalaci%C3%B3n.%20%C2%BFMe%20pueden%20contar%20m%C3%A1s%20al%20respecto%3F%20Gracias',
  whatsappStairs:
    'https://api.whatsapp.com/send?phone=5491169977725&text=%22%C2%A1Hola!%20Estoy%20interesado%2Fa%20en%20sus%20pisos%20de%20madera%20y%20productos%20de%20instalaci%C3%B3n.%20%C2%BFMe%20pueden%20contar%20m%C3%A1s%20al%20respecto%3F%20Gracias',
  whatsappCommercial:
    'https://api.whatsapp.com/send?phone=5491169977725&text=Hola!%20Tengo%20un%20local%20comercial%20y%20me%20interesa%20renovar%20el%20piso.%20%C2%BFPueden%20asesorarme?',
  whatsappMaintenanceHelp:
    'https://api.whatsapp.com/send?phone=5491169977725&text=Hola!%20Necesito%20ayuda%20para%20saber%20qu%C3%A9%20producto%20de%20mantenimiento%20necesito%20para%20mi%20piso.',
  instagram: "https://www.instagram.com/naturalfloorings/",
  maps: "https://maps.google.com/?q=Natural+Flooring+3+de+Febrero+234+San+Fernando",
  mapsAllReviews: "https://maps.google.com/?q=Natural+Flooring+San+Fernando",
  email: "mailto:pisosnaturalflooring@gmail.com",
  phone: "tel:+5491169977725",
  calendar: "CALENDLY_LINK_AQUI",
};

export const navLinks = [
  { label: "Nosotros", href: "#categorias" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Productos", href: "#productos-mantenimiento" },
  { label: "Contacto", href: "#contacto" },
];

export const hero = {
  eyebrow: "Showroom · San Fernando",
  titleLead: "TRANSFORMÁ",
  titleAccent: "PISO.",
  description:
    "Madera, flotantes, vinílicos y decks exteriores. Visitá nuestro showroom en San Fernando o pedí asesoramiento sin cargo.",
  image: "/images/hero-deck.jpg",
  imageAlt: "Deck de madera natural con amoblamientos exteriores",
  imageTag: "Stock disponible · Entrega inmediata",
  stats: [
    { value: "200+", label: "Obras realizadas" },
    { value: "15+", label: "Años en el rubro" },
    { value: "GRATIS", label: "Consulta inicial" },
  ],
};

export const species = [
  "Lapacho",
  "Viraro",
  "Roble Blanco",
  "Haya",
  "WPC Importado",
  "Dryback LVT",
];

export const categories = [
  {
    tag: "Madera",
    title: "MADERA NATURAL",
    image: "/images/euca-rostrata-dormitorio.jpg",
    alt: "Dormitorio con piso de eucalipto rostrata — luz natural",
    href: "#contacto",
  },
  {
    tag: "Vinílico",
    title: "PISO VINÍLICO",
    image: "/images/spc-gris-instalado.jpg",
    alt: "Piso SPC gris ártico instalado en living residencial",
    href: "#contacto",
  },
  {
    tag: "Exterior",
    title: "DECK WPC",
    image: "/images/deck-lapacho-terraza.jpg",
    alt: "Deck lapacho en terraza con pérgola — Zona Norte",
    href: "#contacto",
  },
  {
    tag: "Madera",
    title: "ESCALERAS",
    image: "/images/escalera-lapacho.jpg",
    alt: "Escalera revestida en lapacho con baranda de vidrio",
    href: "#escaleras",
  },
];

export const featuredProjects = [
  {
    size: "large",
    category: "Comercial",
    name: "Sport Club · Zona Norte",
    image: "/images/sportclub-IMG_6895.jpg",
    alt: "Sport Club Zona Norte — frente con logo y piso vinílico instalado",
    materials: "Vinílico Dry-Back · 2mm",
    description:
      "Renovación de piso en Sport Club Zona Norte. Vinílico Dry-Back pegado instalado en toda la planta, incluyendo sala de máquinas, aeróbica y vestuarios. Sin interrupción del funcionamiento del local.",
    images: [
      { src: "/images/sportclub-IMG_6895.jpg", alt: "Frente Sport Club — logo y piso terminado" },
      { src: "/images/sportclub-IMG_6900.jpg", alt: "Zona cardio con logo Sport Club en pared" },
      { src: "/images/sportclub-IMG_6915.jpg", alt: "Vista panorámica — sala de máquinas" },
      { src: "/images/sportclub-IMG_6904.jpg", alt: "Planta principal en pleno funcionamiento" },
      { src: "/images/sportclub-IMG_6911.jpg", alt: "Vestuarios — terminación prolija" },
    ],
  },
  {
    size: "small",
    category: "Residencial",
    name: "Living — Eucalipto blanco",
    image: "/images/living-eucalipto-blanco.jpg",
    alt: "Living residencial con piso de eucalipto blanco",
    materials: "Eucalipto blanco · Hidrolaqueado mate",
    description:
      "Instalación de piso de eucalipto blanco en living principal. Terminación hidrolaqueada mate, unificando zócalos y marcos. Superficie trabajada en su totalidad para un resultado prolijo y uniforme.",
  },
  {
    size: "small",
    category: "Escaleras",
    name: "Petiribí hidrolaqueado",
    image: "/images/despues-petiribi-hidrolaqueado.jpg",
    alt: "Escalera Petiribí",
    before: "/images/antes-escalera-hormigon.jpg",
    materials: "Petiribí · Hidrolaqueado Varathane",
    description:
      "Revestimiento completo de escalera en petiribí hidrolaqueado. Se cubrieron peldaños y contrahuellas conservando la estructura de hormigón original. Terminación de alta durabilidad con Varathane.",
  },
  {
    size: "small",
    category: "Restauración",
    name: "Parquet espiga — Av. 25 de Mayo",
    image: "/images/parquet-espiga-av25-1.jpg",
    alt: "Parquet espiga restaurado con luz natural",
    materials: "Parquet espiga · Pulido e hidrolaqueado",
    description:
      "Restauración de parquet en espiga de madera nativa. Lijado completo, reparación de piezas y tres manos de hidrolaqueado semi-mate. El resultado recuperó la calidez original del espacio.",
    images: [
      { src: "/images/parquet-espiga-av25-1.jpg", alt: "Parquet espiga restaurado — vista principal" },
      { src: "/images/parquet-espiga-av25-2.jpg", alt: "Parquet espiga — calidez con luz natural" },
    ],
  },
  {
    size: "small",
    category: "Náutico",
    name: "Roble americano — interior de barco",
    image: "/images/barco-roble-americano-1.jpg",
    alt: "Interior de embarcación con piso de roble americano",
    materials: "Roble americano · Instalación náutica",
    description:
      "Instalación de piso de roble americano en el interior de una embarcación. Adaptación a superficies curvas y fijación especial para entornos marinos.",
    images: [
      { src: "/images/barco-roble-americano-1.jpg", alt: "Interior del barco — piso de roble americano" },
      { src: "/images/barco-roble-americano-2.jpg", alt: "Interior del barco — detalle de acabado" },
    ],
  },
  {
    size: "small",
    category: "Exterior",
    name: "Deck WPC — Zona Norte",
    image: "/images/deck-lapacho-zona-norte.jpg",
    alt: "Deck WPC en Zona Norte",
    materials: "WPC importado bicolor · Exterior",
    description:
      "Deck exterior en WPC bicolor importado, instalado en zona norte. Material resistente a la intemperie con mínimo mantenimiento y terminación premium.",
  },
];

export const why = {
  image: "/images/boutique-spc-roble-europeo.jpg",
  imageAlt: "Piso SPC roble europeo instalado en local comercial boutique",
  badgeValue: "200+",
  badgeLabel: "obras realizadas",
};

export const whyItems = [
  {
    iconKey: "consult",
    title: "Asesoramiento sin cargo",
    description:
      "Antes de tomar cualquier decisión, te asesoramos. Te ayudamos a elegir el material ideal para tu espacio y presupuesto, sin compromiso.",
  },
  {
    iconKey: "warranty",
    title: "Garantía de obra",
    description:
      "Todos nuestros trabajos tienen garantía. Tu inversión protegida de principio a fin.",
  },
  {
    iconKey: "install",
    title: "Instalación profesional",
    description:
      "Especialistas en madera, vinílico, SPC y WPC. Trabajo prolijo con terminaciones que duran.",
  },
  {
    iconKey: "materials",
    title: "Showroom en San Fernando",
    description:
      "Vení a ver y tocar los materiales antes de decidir. Stock disponible con entrega inmediata.",
  },
];

export const staircase = {
  image: "/images/escalera-belzu.jpg",
  alt: "Escalera revestida en madera con baranda de hierro forjado",
  description:
    "No hace falta una gran obra para transformar un espacio. Revestimos tu escalera en madera: moderna, cálida y totalmente integrada al estilo de tu casa.",
  features: [
    "Instalación profesional en 1 a 2 días",
    "Sin demolición ni obra pesada",
    "Diseño moderno con terminaciones prolijas",
    "Materiales resistentes y durables",
  ],
};

export const beforeAfter = {
  material: "MADERA · ALTO TRÁNSITO",
  before: {
    label: "Antes",
    image: "/images/antes-gimnasio-con-piso-deteriorado.jpg",
    alt: "Gimnasio con piso deteriorado",
  },
  after: {
    label: "Después",
    image: "/images/despues-gimnasio-renovado.jpg",
    alt: "Gimnasio con piso nuevo hidrolaqueado",
  },
  detail: {
    image: "/images/gimnasiomientras.jpeg",
    alt: "Proceso de instalación en gimnasio",
    title: "EL PROCESO DETRÁS DEL RESULTADO",
    subtitle: "Preparación · Instalación · Hidrolaqueado",
  },
};

export const commercialShowcase = {
  image: "/images/gimnasio-sportclub.jpg",
  alt: "Gimnasio renovado",
  title: "GIMNASIO ZONA NORTE",
  description:
    "Revestimiento de alto tránsito para una sala de entrenamiento. Buscamos resistencia, fácil mantenimiento y una terminación más cálida para elevar la experiencia del espacio.",
  features: [
    "Material apto para uso intensivo",
    "Instalación rápida con mínima interrupción",
    "Terminación prolija para espacios comerciales",
  ],
};

export const archiveFilters = [
  { value: "todos", label: "Todos" },
  { value: "escaleras", label: "Escaleras" },
  { value: "madera", label: "Madera" },
  { value: "vinilico", label: "Vinílico" },
  { value: "deck", label: "Deck" },
];

export const archiveProjects = [
  {
    category: "escaleras",
    group: "Escaleras",
    title: "Petiribí hidrolaqueado",
    image: "/images/despues-petiribi-hidrolaqueado.jpg",
    alt: "Petiribí hidrolaqueado",
    before: "/images/antes-escalera-hormigon.jpg",
    materials: "Petiribí · Hidrolaqueado Varathane",
    description: "Revestimiento completo de escalera sobre estructura de hormigón. Terminación hidrolaqueada de alta durabilidad.",
  },
  {
    category: "escaleras",
    group: "Escaleras",
    title: "Petiribí — detalle terminación",
    image: "/images/detalle-escalera-petiribi.jpg",
    alt: "Detalle de escalera en petiribí hidrolaqueado",
    materials: "Petiribí · Hidrolaqueado Varathane",
  },
  {
    category: "escaleras",
    group: "Escaleras",
    title: "Lapacho — vista nocturna",
    image: "/images/escalera-terminada-noche.jpg",
    alt: "Escalera de lapacho terminada — luz cálida nocturna",
    materials: "Lapacho · Hidrolaqueado",
  },
  {
    category: "escaleras",
    group: "Escaleras",
    title: "Lapacho flotante",
    image: "/images/escalera-lapacho-1.jpg",
    alt: "Escalera lapacho flotante — vista superior",
    materials: "Lapacho · Hidrolaqueado",
    description: "Escalera flotante con peldaños de lapacho macizo. Terminación hidrolaqueada semi-mate. Barandal de vidrio y perfilería negra.",
    images: [
      { src: "/images/escalera-lapacho-1.jpg", alt: "Escalera lapacho — vista superior" },
      { src: "/images/escalera-lapacho-2.jpg", alt: "Escalera lapacho — ángulo lateral" },
      { src: "/images/escalera-lapacho-3.jpg", alt: "Escalera lapacho — detalle peldaños" },
      { src: "/images/escalera-lapacho-4.jpg", alt: "Escalera lapacho — contrafrente" },
      { src: "/images/escalera-lapacho-5.jpg", alt: "Escalera lapacho — vista completa" },
    ],
  },
  {
    category: "escaleras",
    group: "Escaleras",
    title: "Grandis — vidrio y acero",
    image: "/images/escalera-grandis-1.jpg",
    alt: "Escalera grandis con baranda de vidrio y estructura de acero negro",
    materials: "Grandis · Hidrolaqueado · Baranda vidrio",
    description: "Escalera en grandis macizo con baranda de vidrio templado y perfilería de acero negro. Diseño moderno con excelente terminación.",
    images: [
      { src: "/images/escalera-grandis-1.jpg", alt: "Escalera grandis — vista frontal con baranda de vidrio" },
      { src: "/images/escalera-grandis-2.jpg", alt: "Escalera grandis — vista desde arriba" },
    ],
  },
  {
    category: "deck",
    group: "Deck exterior",
    title: "WPC — Zona Norte",
    image: "/images/deck-lapacho-zona-norte.jpg",
    alt: "Deck WPC bicolor instalado en Zona Norte",
    materials: "WPC · Deck exterior",
  },
  {
    category: "vinilico",
    group: "Sport Club · Zona Norte",
    title: "Sport Club · Zona Norte",
    subtitle: "Vinílico Dry-Back · 2mm",
    image: "/images/sportclub-IMG_6895.jpg",
    alt: "Sport Club Zona Norte — frente con logo y piso vinílico instalado",
    materials: "Vinílico Dry-Back · 2mm",
    description: "Renovación completa de piso en Sport Club Zona Norte. Vinílico Dry-Back pegado instalado en toda la planta. Sin interrupción del funcionamiento del local.",
    images: [
      { src: "/images/sportclub-IMG_6895.jpg", alt: "Frente Sport Club — logo y piso terminado" },
      { src: "/images/sportclub-IMG_6900.jpg", alt: "Zona cardio con logo Sport Club en pared" },
      { src: "/images/sportclub-IMG_6915.jpg", alt: "Vista panorámica — sala de máquinas" },
      { src: "/images/sportclub-IMG_6904.jpg", alt: "Planta principal en pleno funcionamiento" },
      { src: "/images/sportclub-IMG_6911.jpg", alt: "Vestuarios — terminación prolija" },
    ],
  },
  {
    category: "madera",
    group: "Gimnasio · 160m²",
    title: "Gimnasio · 160m²",
    subtitle: "Guatambu · Hidrolaqueado",
    image: "/images/gym-guatambu-IMG_8270.jpg",
    alt: "Gimnasio renovado — piso de guatambu hidrolaqueado, 160m²",
    before: "/images/gym-guatambu-IMG_7570.jpg",
    materials: "Guatambu · 160m²",
    description: "Renovación de 160m² de piso en gimnasio privado. Guatambu macizo hidrolaqueado sobre piso existente. Espacio luminoso con techos altos y paredes espejadas.",
    images: [
      { src: "/images/gym-guatambu-IMG_8270.jpg", alt: "Gimnasio terminado — vista desde el fondo" },
      { src: "/images/gym-guatambu-IMG_8280.jpg", alt: "Vista general de la planta completa" },
    ],
  },
  {
    category: "madera",
    group: "Residencial",
    title: "Living — Eucalipto blanco",
    image: "/images/living-eucalipto-blanco.jpg",
    alt: "Living residencial con piso de eucalipto blanco",
  },
  {
    category: "madera",
    group: "Residencial",
    title: "Comedor — Beccar",
    image: "/images/comedor-beccar-roble.jpg",
    alt: "Comedor en Beccar con piso flotante roble rústico",
    materials: "Roble rústico · Flotante",
  },
  {
    category: "madera",
    group: "Restauración",
    title: "Parquet espiga — restaurado",
    image: "/images/pulido-herringbone-despues-1.jpg",
    alt: "Parquet espiga restaurado — hidrolaqueado brillante",
    before: "/images/pulido-herringbone-antes.jpg",
    materials: "Parquet espiga · Pulido e hidrolaqueado",
    description: "Restauración de parquet en espiga original. Lijado completo, reparación de piezas sueltas e hidrolaqueado en 3 manos. El piso recuperó su brillo y color original.",
    images: [
      { src: "/images/pulido-herringbone-despues-1.jpg", alt: "Parquet espiga restaurado — vista general" },
      { src: "/images/pulido-herringbone-despues-2.jpg", alt: "Parquet espiga — habitación adyacente" },
    ],
  },
  {
    category: "madera",
    group: "Residencial",
    title: "Roble eslabonia en espiga",
    image: "/images/roble-eslabonia-1.jpg",
    alt: "Piso roble eslabonia en espiga — living con balcón",
    materials: "Roble eslabonia · Flotante · Espiga",
    description: "Instalación de piso flotante roble eslabonia en patrón espiga. Terminación natural, aportando textura y calidez a espacios luminosos.",
    images: [
      { src: "/images/roble-eslabonia-1.jpg", alt: "Living con piso roble eslabonia en espiga — luz natural" },
      { src: "/images/roble-eslabonia-2.jpg", alt: "Detalle de esquina — roble eslabonia espiga" },
      { src: "/images/roble-eslabonia-3.jpg", alt: "Pasillo con piso roble eslabonia" },
    ],
  },
  {
    category: "madera",
    group: "Residencial",
    title: "Eucalipto rostrata — dormitorio",
    image: "/images/euca-rostrata-dormitorio.jpg",
    alt: "Dormitorio principal con piso de eucalipto rostrata",
    materials: "Eucalipto rostrata · Hidrolaqueado",
    description: "Instalación de piso de eucalipto rostrata en dormitorio principal. Madera de veta pronunciada con terminación hidrolaqueada semi-mate.",
  },
  {
    category: "madera",
    group: "Residencial",
    title: "Roble caoba — San Fernando",
    image: "/images/roble-caoba-1.jpg",
    alt: "Piso flotante roble caoba instalado en habitación",
    materials: "Roble caoba · 4mm flotante",
    description: "Instalación de piso flotante roble caoba en habitaciones y pasillos. Terminación oscura que aporta calidez y elegancia al espacio.",
    images: [
      { src: "/images/roble-caoba-1.jpg", alt: "Habitación con piso roble caoba" },
      { src: "/images/roble-caoba-2.jpg", alt: "Pasillo con piso roble caoba instalado" },
    ],
  },
  {
    category: "escaleras",
    group: "Escaleras",
    title: "PVC sobre escalera con moquette",
    image: "/images/escalera-pvc-despues-1.jpg",
    alt: "Escalera con revestimiento PVC — antes moquette azul",
    before: "/images/escalera-pvc-antes.jpg",
    materials: "PVC · Zócalo aluminio negro",
    description: "Revestimiento de escalera con piso PVC sobre moquette existente. Sin demolición. Terminación con zócalo de aluminio negro para un resultado limpio y moderno.",
    images: [
      { src: "/images/escalera-pvc-despues-1.jpg", alt: "Escalera PVC terminada — vista frontal" },
      { src: "/images/escalera-pvc-despues-2.jpg", alt: "Escalera PVC — vista general en contexto" },
    ],
  },
  {
    category: "escaleras",
    group: "Comercial",
    title: "Vinílico — acceso comercial",
    image: "/images/escalera-vinilico-comercial.jpg",
    alt: "Escalera de acceso comercial revestida en vinílico — iluminación ambiental",
    materials: "Vinílico · Instalación comercial",
    description: "Revestimiento de escalera de acceso en local comercial. Vinílico de alta resistencia al tránsito intenso. Instalación sin cierre del local.",
  },
  {
    category: "deck",
    group: "Deck exterior",
    title: "Deck lapacho — piscina",
    image: "/images/deck-museo-2.jpg",
    alt: "Deck de lapacho alrededor de piscina — Zona Norte",
    materials: "Lapacho · Deck exterior",
    description: "Deck perimetral de lapacho macizo alrededor de piscina. Madera tratada para exteriores, resistente a la humedad y al sol.",
    images: [
      { src: "/images/deck-museo-1.jpg", alt: "Deck lapacho — piscina, ángulo lateral" },
      { src: "/images/deck-museo-2.jpg", alt: "Deck lapacho — vista frontal de la piscina" },
      { src: "/images/deck-museo-3.jpg", alt: "Deck lapacho — panorámica completa" },
    ],
  },
  {
    category: "madera",
    group: "Restauración",
    title: "Parquet espiga — Av. 25 de Mayo",
    image: "/images/parquet-espiga-av25-1.jpg",
    alt: "Parquet en espiga restaurado — Av. 25 de Mayo, luz natural",
    materials: "Parquet espiga · Pulido e hidrolaqueado",
    description: "Restauración de parquet en espiga de madera nativa en departamento histórico. Lijado, reparación de piezas y tres manos de hidrolaqueado semi-mate.",
    images: [
      { src: "/images/parquet-espiga-av25-1.jpg", alt: "Parquet espiga restaurado — vista principal" },
      { src: "/images/parquet-espiga-av25-2.jpg", alt: "Parquet espiga — calidez con luz natural directa" },
    ],
  },
  {
    category: "madera",
    group: "Restauración",
    title: "Pinotea plastificada brillante",
    image: "/images/pinotea-brillante.jpg",
    alt: "Parquet de pinotea en espiga — plastificado brillante",
    materials: "Pinotea · Plastificado alto brillo · 48m²",
    description: "Restauración de piso de pinotea en espiga con plastificado de alto brillo (k-4045). 48m² totales. Resultado vidrioso que resalta la veta y el color original de la madera.",
  },
  {
    category: "madera",
    group: "Náutico",
    title: "Roble americano — interior de barco",
    image: "/images/barco-roble-americano-1.jpg",
    alt: "Interior de embarcación con piso de roble americano instalado",
    materials: "Roble americano · Instalación náutica",
    description: "Instalación de piso de roble americano en el interior de una embarcación. Adaptación a superficies curvas, fijación especial para entornos marinos.",
    images: [
      { src: "/images/barco-roble-americano-1.jpg", alt: "Interior del barco — piso de roble americano, vista principal" },
      { src: "/images/barco-roble-americano-2.jpg", alt: "Interior del barco — detalle de planks y acabado" },
    ],
  },
  {
    category: "madera",
    placeholder: true,
    title: "Próximamente",
    subtitle: "más trabajos",
  },
];

export const maintenanceProducts = [
  {
    icon: "🪵",
    theme: "dark",
    category: "Madera",
    title: "Hidrolaqueado Varathane",
    description:
      "Poliuretano al agua de secado rápido. El mismo que usamos en cada escalera y piso de madera.",
    href: "https://api.whatsapp.com/send?phone=5491169977725&text=Hola!%20Me%20interesa%20el%20Hidrolaqueado%20Varathane.%20%C2%BFTienen%20disponible?",
  },
  {
    icon: "🧴",
    theme: "olive",
    category: "Madera",
    title: "Limpiador para madera",
    description:
      "Limpieza profunda sin dañar el barniz. Apto para parquet, machimbre y pisos flotantes de madera.",
    href: "https://api.whatsapp.com/send?phone=5491169977725&text=Hola!%20Me%20interesa%20el%20limpiador%20para%20madera.%20%C2%BFTienen%20disponible?",
  },
  {
    icon: "✨",
    theme: "mid",
    category: "Vinílico / LVT",
    title: "Limpiador para vinílico",
    description:
      "Fórmula específica para pisos vinílicos, LVT, SPC y Dryback. No deja residuos ni opaca la superficie.",
    href: "https://api.whatsapp.com/send?phone=5491169977725&text=Hola!%20Me%20interesa%20el%20limpiador%20para%20piso%20vin%C3%ADlico.%20%C2%BFTienen%20disponible?",
  },
  {
    icon: "🪣",
    theme: "light",
    category: "WPC / Exterior",
    title: "Limpiador para deck",
    description:
      "Elimina hongos, verdín y suciedad del exterior. Ideal para decks WPC y madera de exterior.",
    href: "https://api.whatsapp.com/send?phone=5491169977725&text=Hola!%20Me%20interesa%20el%20limpiador%20para%20deck.%20%C2%BFTienen%20disponible?",
  },
];

export const instagramEmbeds = [
  "https://www.instagram.com/p/DW19REahgGH/embed/",
  "https://www.instagram.com/p/DXhte5ykWJU/embed/",
  "https://www.instagram.com/p/DOO26rGEXPg/embed/",
];

export const reviewsPrimary = [
  {
    rating: "★★★★★",
    when: "Hace 2 meses",
    quote:
      '"Muy conforme y agradecida por excelente trabajo y amabilidad. Mi departamento cambió completamente con la renovación de Natural Flooring, ahora parece nuevo."',
    author: "Maria F",
    meta: "Google Maps · San Fernando",
    initial: "M",
  },
  {
    rating: "★★★★★",
    when: "Hace 7 meses",
    quote:
      '"Los productos perfectos, la atención tanto en el local como por cel, súper amable y resolutivo. No dudaría en volver a comprar. Gracias!"',
    author: "Daiana Vazquez",
    meta: "Google Maps · San Fernando",
    initial: "D",
  },
  {
    rating: "★★★★★",
    when: "Hace 2 años",
    quote:
      '"Cambié el piso flotante de un dormitorio... quedó impecable. Muy buen presupuesto. El colocador muy correcto y muy profesional. Gracias Diego - Ramón."',
    author: "Guillermo Ferrero",
    meta: "Google Maps · San Fernando",
    initial: "G",
  },
];

export const reviewsSecondary = [
  {
    rating: "★★★★★",
    when: "Hace 3 años",
    quote:
      '"Compré piso de PVC excelente calidad, buena atención del vendedor e instaladores. Los mismos trabajaron rápido, prolijos, atentos, cordiales y respetuosos. Super recomendable."',
    author: "Eva Rogai",
    meta: "Google Maps · San Fernando",
    initial: "E",
  },
  {
    rating: "★★★★★",
    when: "Hace 2 años",
    quote:
      '"Solicitamos el servicio de hidrolaqueado para un piso de parquet y quedó excelente, como nuevo. Muy profesionales y prolijos desde el primer momento. 10/10."',
    author: "Nicolás F",
    meta: "Google Maps · San Fernando",
    initial: "N",
  },
];

export const contactItems = [
  {
    kind: "phone",
    label: "Teléfono",
    value: "+54 11 6997-7725",
    href: links.phone,
  },
  {
    kind: "email",
    label: "Email",
    value: "pisosnaturalflooring@gmail.com",
    href: links.email,
  },
  {
    kind: "location",
    label: "Local",
    value: "3 de Febrero 234, San Fernando",
    href: links.maps,
  },
  {
    kind: "hours",
    label: "Horario de atención",
    value: "Lun–Vie 9 a 18 · Sáb 9 a 13",
  },
];

export const processSteps = [
  {
    num: "01",
    title: "Consultá",
    description:
      "Contactanos por WhatsApp o visitá el showroom en San Fernando. Sin cargo.",
  },
  {
    num: "02",
    title: "Medimos y cotizamos",
    description:
      "Vamos a tu domicilio, medimos el espacio y te entregamos un presupuesto detallado en 24 horas.",
  },
  {
    num: "03",
    title: "Instalamos",
    description:
      "Nuestro equipo instala con materiales de primera calidad. Trabajo prolijo, limpio y siempre en fecha.",
  },
  {
    num: "04",
    title: "Disfrutás",
    description:
      "Tu piso nuevo con garantía de obra. Ante cualquier duda o ajuste, estamos disponibles.",
  },
];

export const footerLinks = navLinks;

export const footer = {
  description:
    "Showroom en San Fernando. Pisos de madera, flotantes, vinílicos y decks. Presupuesto sin cargo y garantía de obra.",
  addressLine1: "3 de Febrero 234",
  addressLine2: "San Fernando, Buenos Aires",
  hoursWeek: "Lun–Vie 9 a 18",
  hoursSaturday: "Sáb 9 a 13",
  ctaText: "Respondemos en menos de 24hs. Sin compromiso.",
  copyright: "© 2026 Natural Flooring — Todos los derechos reservados",
  bottomAddress: "3 de Febrero 234, San Fernando, Buenos Aires",
};
