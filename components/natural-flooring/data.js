import { links } from "./links";
import { productCategories } from "./productsCatalog";
import { recommenderSteps } from "./recommender/recommendationEngine.mjs";

// La cantidad de preguntas del asesor sale del propio motor: si se agrega o
// saca un paso, los textos que la mencionan se actualizan solos.
const totalPreguntas = recommenderSteps.length;

export { links };

// Con "/" adelante para que también funcionen desde /productos.
export const navLinks = [
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Garantías", href: "/#garantia" },
  {
    label: "Productos",
    href: "/productos",
    groups: productCategories.map((category) => ({
      label: category.title,
      href: `/productos/${category.id}`,
      items: category.items.map((item) => ({ label: item.navLabel ?? item.title, href: `/productos/${category.id}?tipo=${item.id.slice(category.id.length + 1)}` })),
    })),
    extra: { label: "Ver todos los productos", href: "/productos" },
  },
  { label: "Asesor", href: "/#herramientas" },
  { label: "Proyectos", href: "/#proyectos" },
  { label: "Showrooms", href: "/#showrooms" },
  { label: "Contacto", href: "/#contacto" },
];

export const hero = {
  eyebrow: "Showrooms · San Fernando y Escobar",
  titleLead: "Transformá",
  titleAccent: "piso.",
  description:
    "Pisos, revestimientos, escaleras y exteriores. Visitá nuestros showrooms en San Fernando y Escobar o pedí asesoramiento sin cargo.",
  // Una obra al azar por visita. Se priorizan los originales de mayor resolución.
  // desktopSrc permite usar una toma apaisada en escritorio; los encuadres son por foto.
  images: [
    { src: "/images/hero/deck-pileta-mobile.jpg", desktopSrc: "/images/hero/deck-pileta-desktop.jpg", alt: "Deck de madera junto a una pileta", caption: "Deck junto a la pileta", desktopPosition: "50% 50%", mobilePosition: "50% 35%", aspectRatio: 0.75 },
    { src: "/images/maderas/lapacho-piso.jpg", alt: "Comedor con piso de lapacho", caption: "Piso de lapacho", desktopPosition: "50% 34%", mobilePosition: "50% 48%", aspectRatio: 0.75 },
    { src: "/images/escalera-belzu.jpg", alt: "Escalera de madera con baranda de hierro", caption: "Escaleras de madera", desktopPosition: "50% 35%", mobilePosition: "50% 45%", aspectRatio: 0.75 },
    { src: "/images/hero-deck.jpg", alt: "Deck de lapacho con muebles blancos de exterior", caption: "Deck de lapacho", desktopPosition: "50% 65%", mobilePosition: "50% 65%", mobileScale: 1.28, aspectRatio: 0.75 },
    { src: "/images/escalera-lapacho-3.jpg", alt: "Escalera revestida en lapacho", caption: "Escalera de lapacho", desktopPosition: "50% 32%", mobilePosition: "50% 48%", aspectRatio: 0.7472 },
    { src: "/images/parquet-espiga-av25-1.jpg", alt: "Parquet de madera restaurado en espiga", caption: "Parquet en espiga", desktopPosition: "50% 65%", mobilePosition: "50% 55%", aspectRatio: 0.75 },
  ],
  ctaLabel: "Pedí asesoramiento gratis",
  ctaHref:
    "https://api.whatsapp.com/send?phone=5491169977725&text=" +
    encodeURIComponent("Hola! Quiero asesoramiento para elegir mi piso. ¿Me pueden ayudar?"),
  imageTag: "Stock disponible · Entrega inmediata",
  stats: [
    { value: "200+", label: "Obras realizadas" },
    { value: "15+", label: "Años en el rubro" },
    { value: "GRATIS", label: "Consulta inicial" },
  ],
};

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
  image: "/images/living-eucalipto-blanco.jpg",
  imageAlt: "Living con piso de eucalipto blanco",
  badgeValue: "15+",
  badgeLabel: "años en el rubro",
  lead: "Somos Natural Flooring: más de 15 años y más de 200 obras en pisos, revestimientos y escaleras.",
  description:
    "Además de tener los mejores precios en productos, con nuestros servicios nos encargamos de la parte complementaria, la que hace que todo quede como lo imaginaste desde un principio.",
};

export const projectsIntro =
  "Cada obra junta dos cosas que no se pueden separar: buenos productos y un buen servicio. Un material de primera mal instalado no dura, y una gran instalación no salva un material pobre. Por eso elegimos lo que vendemos y lo instalamos nosotros, de la medición a la última terminación.";

export const warranty = {
  title: "El respaldo de un trabajo bien hecho.",
  conditions: {
    care: "La garantía es válida siempre y cuando se cumplan estrictamente los requisitos de cuidado y mantenimiento detallados en los documentos que entregamos al finalizar el trabajo.",
    exclusions: "Quedan excluidos de esta garantía los daños provocados por factores externos, filtraciones, accidentes o un uso indebido de los pisos y estructuras.",
  },
  coverages: [
    {
      id: "exteriores-y-flotantes",
      years: 5,
      title: "Exteriores y pisos flotantes",
      paragraphs: {
        coverage: "Ofrecemos una garantía de cinco años para todos nuestros trabajos de exterior y pisos flotantes, a partir de la finalización de la obra. Esta cobertura asegura la máxima calidad en los materiales y en la ejecución de la colocación.",
      },
    },
    {
      id: "pisos-y-escaleras-de-madera",
      years: 10,
      title: "Pisos y escaleras de madera",
      paragraphs: {
        coverage: "Respaldamos nuestros trabajos de pisos de madera y escaleras de madera con una garantía de diez años, a partir de la finalización de la obra. Esta cobertura asegura la durabilidad y la máxima calidad tanto en los materiales como en la ejecución técnica.",
      },
    },
  ],
};

export const showrooms = [
  {
    name: "San Fernando",
    address: "3 de Febrero 234, San Fernando",
    hours: "Lun–Vie 9 a 13 y 14 a 17 · Sáb 9 a 13",
    href: links.maps,
    image: "/images/showroom-frente.jpg",
    alt: "Frente del showroom de Natural Flooring en San Fernando",
  },
  {
    // TODO: dirección exacta, horario y link de Maps del showroom de Escobar.
    name: "Escobar",
    address: "Matheu, Escobar",
    hours: null,
    href: "https://maps.google.com/?q=Matheu+Escobar+Buenos+Aires",
    image: "/images/piso-de-madera-natural.jpg",
    alt: "Piso de madera natural",
  },
];

export const whyItems = [
  {
    iconKey: "price",
    title: "Los mejores precios",
    description:
      "Pisos, revestimientos y escaleras a los mejores precios, con stock para entrega inmediata.",
  },
  {
    iconKey: "consult",
    title: "Te asesoramos desde el principio",
    description:
      "Te ayudamos a elegir el material ideal para tu espacio y tu presupuesto, sin cargo.",
  },
  {
    iconKey: "install",
    title: "Nos encargamos del resto",
    description:
      "Medición, instalación y terminaciones: la parte complementaria corre por nuestra cuenta.",
  },
  {
    iconKey: "warranty",
    title: "Queda como lo imaginaste",
    description:
      "Instalación profesional, terminaciones prolijas y garantía de obra en cada trabajo.",
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
    image: "/images/products/varathane-official.png",
    category: "Madera — Terminación",
    title: "Varathane Poliuretano",
    description: "Poliuretano al agua de secado rápido. El mismo que usamos en cada escalera y piso de madera.",
    href: "https://api.whatsapp.com/send?phone=5491169977725&text=Hola!%20Me%20interesa%20el%20Varathane%20Poliuretano.%20%C2%BFTienen%20disponible?",
  },
  {
    image: "/images/products/kekol-k4045-official.jpg",
    category: "Madera — Terminación",
    title: "Kekol Lackol K-4045",
    description: "Laca poliuretánica brillante de alto tránsito. Uso profesional para escaleras y pisos de alta exigencia.",
    href: "https://api.whatsapp.com/send?phone=5491169977725&text=Hola!%20Me%20interesa%20la%20Laca%20Kekol%20K-4045.%20%C2%BFTienen%20disponible?",
  },
  {
    image: "/images/products/kekol-k4035.jpg",
    category: "Madera — Terminación",
    title: "Kekol Hidrokol K-4035",
    description: "Laca acrílica premium en base agua. Acabado satinado o brillante para pisos y escaleras.",
    href: "https://api.whatsapp.com/send?phone=5491169977725&text=Hola!%20Me%20interesa%20el%20Kekol%20Hidrokol%20K-4035.%20%C2%BFTienen%20disponible?",
  },
  {
    image: "/images/products/kekol-k403.jpg",
    category: "Madera — Sellado",
    title: "Kekol Sellador K-403",
    description: "Sellador base acuosa para preparar la madera antes de lacar. Penetra y consolida la fibra.",
    href: "https://api.whatsapp.com/send?phone=5491169977725&text=Hola!%20Me%20interesa%20el%20Sellador%20K-403.%20%C2%BFTienen%20disponible?",
  },
  {
    image: "/images/products/kekol-k1004.jpg",
    category: "Madera — Adhesivo",
    title: "Kekol K-1004 Adhesivo",
    description: "Adhesivo vinílico para pisos de madera. Alta resistencia al tránsito intenso y a la humedad.",
    href: "https://api.whatsapp.com/send?phone=5491169977725&text=Hola!%20Me%20interesa%20el%20Kekol%20K-1004.%20%C2%BFTienen%20disponible?",
  },
  {
    image: "/images/products/vermeister-detergente.webp",
    category: "Madera — Limpieza",
    title: "Detergente Neutro Vermeister",
    description: "Limpieza diaria sin dañar el barniz. Para parquet, machimbre y pisos flotantes de madera.",
    href: "https://api.whatsapp.com/send?phone=5491169977725&text=Hola!%20Me%20interesa%20el%20Detergente%20Neutro%20Vermeister.%20%C2%BFTienen%20disponible?",
  },
  {
    image: "/images/products/vermeister-wpc-cleaner.webp",
    category: "WPC / Exterior — Limpieza",
    title: "WPC Cleaner Vermeister",
    description: "Limpiador específico para decks WPC y composite. Elimina verdín, hongos y suciedad exterior.",
    href: "https://api.whatsapp.com/send?phone=5491169977725&text=Hola!%20Me%20interesa%20el%20WPC%20Cleaner%20Vermeister.%20%C2%BFTienen%20disponible?",
  },
];

export const instagramPosts = [
  {
    image: "/images/ig/reel-DXxO_kvBxyU.jpg",
    alt: "Deck de madera renovado en un día — con pileta y muebles blancos",
    caption: "Deck · 8 horas",
    href: "https://www.instagram.com/reel/DXxO_kvBxyU/",
    isReel: true,
  },
  {
    image: "/images/ig/reel-DYXzcPmEZpJ.jpg",
    alt: "Terraza comercial con deck de madera y guirnaldas de luz",
    caption: "Deck · Comercial",
    href: "https://www.instagram.com/p/DYXzcPmEZpJ/",
    isReel: true,
  },
  {
    image: "/images/ig/reel-DW9fYIXkZHK.jpg",
    alt: "Escalera moderna con peldaños de madera y baranda de hierro negro",
    caption: "Escaleras · Renovación",
    href: "https://www.instagram.com/p/DW9fYIXkZHK/",
    isReel: false,
  },
  {
    image: "/images/ig/reel-DW19REahgGH.jpg",
    alt: "Instalación de escalera en madera — proceso y resultado",
    caption: "Escaleras · Proceso",
    href: "https://www.instagram.com/reel/DW19REahgGH/",
    isReel: true,
  },
  {
    image: "/images/ig/reel-DWkBexCiQtq.jpg",
    alt: "Renovación de gimnasio — antes y después en San Fernando",
    caption: "Gimnasio · Antes y después",
    href: "https://www.instagram.com/p/DWkBexCiQtq/",
    isReel: false,
  },
  {
    image: "/images/ig/reel-DOO26rGEXPg.jpg",
    alt: "Deck exterior para disfrutar en verano — patio con madera natural",
    caption: "Deck · Exterior",
    href: "https://www.instagram.com/reel/DOO26rGEXPg/",
    isReel: true,
  },
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
    value: "Lun–Vie 9 a 13 y 14 a 17 · Sáb 9 a 13",
  },
];

export const chatbotFaq = {
  title: "Asistente Natural Flooring",
  subtitle: "Respuestas al instante",
  greeting:
    "¡Hola! 👋 Soy el asistente de Natural Flooring. Elegí una pregunta y te la respondo al instante.",
  ctaLabel: "¿No encontraste tu respuesta? Escribinos por WhatsApp",
  ctaHref: links.whatsappGeneral,
  items: [
    {
      id: "presupuesto",
      q: "¿El presupuesto tiene costo?",
      a: "No, la consulta inicial es gratis. Vamos a tu domicilio, medimos el espacio y te entregamos un presupuesto detallado en 24 horas, sin cargo ni compromiso.",
    },
    {
      id: "zonas",
      q: "¿En qué zonas trabajan?",
      a: "Tenemos showrooms en San Fernando (3 de Febrero 234) y en Escobar, y trabajamos en toda Zona Norte y GBA. Para obras más grandes también llegamos a CABA y alrededores.",
    },
    {
      id: "plazos",
      q: "¿Cuánto tarda una instalación?",
      a: "Depende de los metros: un ambiente estándar lleva 2 a 3 días, y un pulido con hidrolaqueado entre 3 y 5. Al cotizar te confirmamos el plazo exacto y lo cumplimos.",
    },
    {
      id: "material",
      q: "¿Madera, vinílico o WPC? ¿Cuál me conviene?",
      a: `Cada material tiene su lugar: madera para calidez e interiores nobles, vinílico para practicidad y ambientes húmedos, WPC para exteriores sin mantenimiento. Probá el asesor de esta página: con ${totalPreguntas} preguntas te recomendamos el ideal para tu caso.`,
    },
    {
      id: "pulido",
      q: "¿Recuperan pisos existentes?",
      a: "Sí — hacemos pulido, plastificado e hidrolaqueado de pisos de madera. Quedan como nuevos sin necesidad de cambiarlos. Mirá los antes y después en la sección Proyectos.",
    },
    {
      id: "productos",
      q: "¿Venden productos de mantenimiento?",
      a: "Sí, tenemos stock de Kekol, Varathane y Vermeister con entrega inmediata. En Productos de mantenimiento está el catálogo completo para pedirlos por WhatsApp.",
    },
    {
      id: "showroom",
      q: "¿Dónde están y en qué horario?",
      a: "Showroom San Fernando: 3 de Febrero 234, lunes a viernes de 9 a 13 y de 14 a 17, y sábados de 9 a 13. También tenemos showroom en Escobar: en la sección Showrooms están los datos. Vení a ver y tocar los materiales en persona.",
    },
    {
      id: "escaleras",
      q: "¿Hacen escaleras?",
      a: "Sí, revestimos escaleras en madera maciza y vinílico — es una de nuestras especialidades. En la sección Escaleras podés ver trabajos terminados.",
    },
  ],
};

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
    "Showrooms en San Fernando y Escobar. Pisos, revestimientos, escaleras y exteriores. Presupuesto sin cargo y garantía de obra.",
  hoursWeek: "Lun–Vie 9 a 13 y 14 a 17",
  hoursSaturday: "Sáb 9 a 13",
  ctaText: "Respondemos de manera instantánea. Sin compromiso.",
  copyright: "© 2026 Natural Flooring — Todos los derechos reservados",
  bottomAddress: "3 de Febrero 234, San Fernando, Buenos Aires",
};
