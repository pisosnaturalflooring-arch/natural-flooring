export const PROJECT_TYPES = {
  INTERIOR_FLOOR: "interior-floor",
  DECK: "deck",
  STAIRS: "stairs",
  COVERING: "covering",
  UNSURE: "unsure",
};

export const recommenderSteps = [
  {
    id: "projectType",
    eyebrow: "Paso 1",
    prompt: "Para que lo necesitas?",
    options: [
      { id: PROJECT_TYPES.INTERIOR_FLOOR, label: "Piso interior", detail: "Living, dormitorio, cocina seca o local." },
      { id: PROJECT_TYPES.DECK, label: "Deck exterior", detail: "Galeria, terraza, pileta o balcon." },
      { id: PROJECT_TYPES.STAIRS, label: "Escalera", detail: "Revestimiento de peldaños o renovacion." },
      { id: PROJECT_TYPES.COVERING, label: "Revestimiento / pared", detail: "Madera decorativa o superficie vertical." },
      { id: PROJECT_TYPES.UNSURE, label: "No estoy seguro", detail: "Te guiamos con la opcion mas prudente." },
    ],
  },
  {
    id: "exposure",
    eyebrow: "Paso 2",
    prompt: "Donde va a estar?",
    options: [
      { id: "interior-dry", label: "Interior seco", detail: "Ambiente estable y cuidado." },
      { id: "interior-humid", label: "Interior con algo de humedad", detail: "Cocina, entrada o uso cotidiano exigente." },
      { id: "exterior-semic-covered", label: "Exterior semicubierto", detail: "Galeria o balcon con algo de reparo." },
      { id: "exterior-exposed", label: "Exterior expuesto", detail: "Sol, lluvia o humedad directa." },
    ],
  },
  {
    id: "intensity",
    eyebrow: "Paso 3",
    prompt: "Que nivel de uso va a tener?",
    options: [
      { id: "low", label: "Bajo", detail: "Uso ocasional o decorativo." },
      { id: "medium", label: "Medio", detail: "Uso residencial diario." },
      { id: "high", label: "Alto", detail: "Familia, mascotas o local chico." },
      { id: "very-high", label: "Muy alto", detail: "Comercial o circulacion constante." },
    ],
  },
  {
    id: "priority",
    eyebrow: "Paso 4",
    prompt: "Que queres priorizar?",
    options: [
      { id: "durability", label: "Durabilidad", detail: "Que resista mejor el paso del tiempo." },
      { id: "simple-maintenance", label: "Mantenimiento simple", detail: "Cuidado facil para todos los dias." },
      { id: "natural-look", label: "Apariencia natural", detail: "Calidez de madera como protagonista." },
      { id: "humidity-resistance", label: "Resistencia a humedad", detail: "Menos riesgo frente al agua o vapor." },
    ],
  },
  {
    id: "openness",
    eyebrow: "Paso 5",
    prompt: "Buscas solo madera natural o preferis que recomendemos lo mas seguro?",
    options: [
      { id: "natural-only", label: "Solo madera natural", detail: "Priorizamos especies reales." },
      { id: "alternatives-ok", label: "Madera o alternativas", detail: "Comparamos con WPC, SPC o vinilico si conviene." },
      { id: "safe-recommendation", label: "Recomendame lo mas seguro", detail: "Vamos por la opcion mas prudente para tu caso." },
    ],
  },
  {
    id: "tone",
    eyebrow: "Paso 6",
    prompt: "Hay algun look que te guste mas?",
    options: [
      { id: "light", label: "Claro", detail: "Luminoso y liviano." },
      { id: "warm", label: "Medio", detail: "Calido y equilibrado." },
      { id: "dark", label: "Oscuro", detail: "Mas profundo y sofisticado." },
      { id: "rustic", label: "Rustico", detail: "Textura y caracter visible." },
      { id: "no-preference", label: "Sin preferencia", detail: "Elegimos por rendimiento." },
    ],
  },
];

export const materialLibrary = [
  {
    id: "lapacho",
    label: "Lapacho",
    family: "Madera natural",
    bestUse: "Decks, pisos exigentes y escaleras",
    image: "/images/deck-lapacho-terraza.jpg",
    imageAlt: "Deck de lapacho en terraza exterior",
    statLabel: "Exterior",
    statValue: "Alta resistencia",
    projects: ["deck", "interior-floor", "stairs"],
    exposures: ["interior-dry", "interior-humid", "exterior-semic-covered", "exterior-exposed"],
    intensities: ["medium", "high", "very-high"],
    priorities: ["durability", "humidity-resistance", "natural-look"],
    maintenance: "Medio",
    natural: true,
    tones: ["warm", "dark", "rustic", "no-preference"],
    explanation: "Responde muy bien cuando el uso o la exposicion piden una madera fuerte.",
    importance: "Es la madera que aparece cuando el proyecto pide dureza real: exterior, alto uso o una solucion que tenga presencia por años.",
    decision: "Elegilo cuando la prioridad es resistencia antes que bajo mantenimiento.",
  },
  {
    id: "viraro",
    label: "Viraro",
    family: "Madera natural",
    bestUse: "Pisos interiores y escaleras residenciales",
    image: "/images/viraro-natural.jpg",
    imageAlt: "Detalle de madera viraro natural",
    statLabel: "Interior",
    statValue: "Calidez estable",
    projects: ["interior-floor", "stairs"],
    exposures: ["interior-dry", "interior-humid"],
    intensities: ["medium", "high"],
    priorities: ["durability", "natural-look"],
    maintenance: "Medio",
    natural: true,
    tones: ["warm", "dark", "no-preference"],
    explanation: "Equilibra calidez visual y buena resistencia para uso cotidiano.",
    importance: "Funciona como punto medio premium: calido, estable y suficientemente resistente para interiores que buscan madera protagonista.",
    decision: "Elegilo cuando queres equilibrio entre elegancia natural y uso cotidiano.",
  },
  {
    id: "petiribi",
    label: "Petiribi",
    family: "Madera natural",
    bestUse: "Escaleras y ambientes residenciales calidos",
    image: "/images/despues-petiribi-hidrolaqueado.jpg",
    imageAlt: "Escalera revestida en petiribi hidrolaqueado",
    statLabel: "Escaleras",
    statValue: "Terminacion calida",
    projects: ["stairs", "interior-floor"],
    exposures: ["interior-dry"],
    intensities: ["low", "medium", "high"],
    priorities: ["natural-look"],
    maintenance: "Medio",
    natural: true,
    tones: ["warm", "rustic", "no-preference"],
    explanation: "Aporta una terminacion calida y funciona muy bien en escaleras interiores.",
    importance: "Su valor esta en la terminacion: transforma escaleras y piezas interiores con una calidez visible sin sentirse pesada.",
    decision: "Elegilo cuando la escalera o el detalle interior tienen que elevar el ambiente.",
  },
  {
    id: "guatambu",
    label: "Guatambu",
    family: "Madera natural",
    bestUse: "Pisos interiores claros",
    image: "/images/gym-guatambu-IMG_8280.jpg",
    imageAlt: "Piso de guatambu instalado en gimnasio",
    statLabel: "Tono claro",
    statValue: "Uso medio",
    projects: ["interior-floor"],
    exposures: ["interior-dry"],
    intensities: ["low", "medium"],
    priorities: ["natural-look"],
    maintenance: "Medio",
    natural: true,
    tones: ["light", "no-preference"],
    explanation: "Conviene cuando se busca una madera clara para interiores cuidados.",
    importance: "Aporta luminosidad y un tono claro que cambia la percepcion del espacio, especialmente en interiores cuidados.",
    decision: "Elegilo cuando buscas amplitud visual y una madera clara.",
  },
  {
    id: "kiri",
    label: "Kiri",
    family: "Madera natural",
    bestUse: "Revestimientos livianos y decorativos",
    image: "/images/calidadencadadetalle.jpeg",
    imageAlt: "Detalle de revestimiento de madera clara",
    statLabel: "Revestimiento",
    statValue: "Liviano",
    projects: ["covering"],
    exposures: ["interior-dry"],
    intensities: ["low", "medium"],
    priorities: ["natural-look"],
    maintenance: "Bajo",
    natural: true,
    tones: ["light", "warm", "no-preference"],
    explanation: "Es liviano y suma calidez visual sin exigir una solucion estructural pesada.",
    importance: "Importa por su ligereza: permite sumar madera en paredes o superficies verticales sin tratarlo como un piso estructural.",
    decision: "Elegilo cuando el objetivo es revestir y dar textura con poco peso visual.",
  },
  {
    id: "wpc-deck",
    label: "Deck WPC",
    family: "WPC",
    bestUse: "Decks exteriores con mantenimiento simple",
    image: "/images/deck-lapacho-zona-norte.jpg",
    imageAlt: "Deck exterior con terminacion tipo madera",
    statLabel: "Exterior",
    statValue: "Bajo mantenimiento",
    projects: ["deck"],
    exposures: ["exterior-semic-covered", "exterior-exposed", "interior-humid"],
    intensities: ["medium", "high", "very-high"],
    priorities: ["simple-maintenance", "humidity-resistance", "durability"],
    maintenance: "Bajo",
    natural: false,
    tones: ["warm", "dark", "rustic", "no-preference"],
    explanation: "Tolera mejor la intemperie y simplifica el mantenimiento frente a una madera natural.",
    importance: "Resuelve el dilema exterior cuando el usuario quiere aspecto calido pero no quiere sostener el mantenimiento de una madera expuesta.",
    decision: "Elegilo cuando exterior y mantenimiento simple pesan mas que material natural.",
  },
  {
    id: "spc",
    label: "Piso SPC",
    family: "SPC",
    bestUse: "Interiores con humedad o uso intenso",
    image: "/images/spc-gris-instalado.jpg",
    imageAlt: "Piso SPC gris instalado en interior residencial",
    statLabel: "Interior humedo",
    statValue: "Uso diario",
    projects: ["interior-floor"],
    exposures: ["interior-humid", "interior-dry"],
    intensities: ["medium", "high", "very-high"],
    priorities: ["simple-maintenance", "humidity-resistance"],
    maintenance: "Bajo",
    natural: false,
    tones: ["light", "warm", "dark", "no-preference"],
    explanation: "Es una opcion practica cuando la humedad o el uso diario hacen menos conveniente la madera.",
    importance: "Es la opcion pragmatica para interiores donde humedad, limpieza o uso diario pueden volver delicada a la madera.",
    decision: "Elegilo cuando necesitas estabilidad y cuidado facil en interiores.",
  },
  {
    id: "vinyl",
    label: "Piso vinilico",
    family: "Vinilico",
    bestUse: "Locales, gimnasios e interiores de alto transito",
    image: "/images/sportclub-IMG_6904.jpg",
    imageAlt: "Piso vinilico instalado en gimnasio en funcionamiento",
    statLabel: "Comercial",
    statValue: "Alto transito",
    projects: ["interior-floor"],
    exposures: ["interior-humid", "interior-dry"],
    intensities: ["high", "very-high"],
    priorities: ["simple-maintenance", "humidity-resistance", "durability"],
    maintenance: "Bajo",
    natural: false,
    tones: ["light", "warm", "dark", "no-preference"],
    explanation: "Funciona bien para uso intenso cuando se busca una solucion resistente y facil de cuidar.",
    importance: "Su importancia esta en el rendimiento: soporta transito comercial o intensivo sin convertir el piso en una preocupacion.",
    decision: "Elegilo cuando el espacio trabaja mucho y necesita una solucion practica.",
  },
];

const intensityWeight = { low: 1, medium: 2, high: 3, "very-high": 4 };

const fallbackAnswers = {
  projectType: PROJECT_TYPES.INTERIOR_FLOOR,
  exposure: "interior-dry",
  intensity: "medium",
  priority: "durability",
  openness: "safe-recommendation",
  tone: "no-preference",
};

export function getStepOption(stepId, optionId) {
  return recommenderSteps
    .find((step) => step.id === stepId)
    ?.options.find((option) => option.id === optionId);
}

function normalizeAnswers(answers = {}) {
  const normalized = { ...fallbackAnswers, ...answers };
  if (normalized.projectType === PROJECT_TYPES.UNSURE) {
    if (normalized.exposure.startsWith("exterior")) normalized.projectType = PROJECT_TYPES.DECK;
    else if (normalized.priority === "natural-look") normalized.projectType = PROJECT_TYPES.COVERING;
    else normalized.projectType = PROJECT_TYPES.INTERIOR_FLOOR;
  }
  return normalized;
}

function getCandidates(answers) {
  const requestedIntensity = intensityWeight[answers.intensity] || 2;
  let candidates = materialLibrary.filter((material) => {
    const supportsProject = material.projects.includes(answers.projectType);
    const supportsExposure = material.exposures.includes(answers.exposure);
    const supportsIntensity = material.intensities.some((level) => intensityWeight[level] >= requestedIntensity);
    return supportsProject && supportsExposure && supportsIntensity;
  });

  if (!candidates.length) {
    candidates = materialLibrary.filter((material) => material.projects.includes(answers.projectType));
  }

  if (answers.openness === "natural-only") {
    const naturalCandidates = candidates.filter((material) => material.natural);
    if (naturalCandidates.length) return naturalCandidates;
    return materialLibrary.filter((material) => material.natural && material.projects.includes(answers.projectType));
  }

  return candidates;
}

function scoreMaterial(material, answers) {
  let score = 0;
  if (material.projects.includes(answers.projectType)) score += 40;
  if (material.exposures.includes(answers.exposure)) score += 28;
  if (material.intensities.includes(answers.intensity)) score += 14;
  if (material.priorities.includes(answers.priority)) score += 18;
  if (material.tones.includes(answers.tone)) score += 6;
  if (answers.openness === "natural-only" && material.natural) score += 24;
  if (answers.openness !== "natural-only" && answers.priority === "simple-maintenance" && material.maintenance === "Bajo") score += 14;
  if (answers.openness !== "natural-only" && answers.priority === "humidity-resistance" && !material.natural) score += 18;
  if (answers.projectType === PROJECT_TYPES.DECK && answers.exposure === "exterior-exposed" && material.id === "wpc-deck" && answers.priority === "simple-maintenance") score += 28;
  if (answers.projectType === PROJECT_TYPES.DECK && answers.exposure === "exterior-exposed" && material.id === "lapacho" && answers.priority === "natural-look") score += 26;
  if (answers.projectType === PROJECT_TYPES.STAIRS && answers.priority === "natural-look" && answers.tone === "warm" && material.id === "petiribi") score += 20;
  if (answers.projectType === PROJECT_TYPES.STAIRS && answers.priority === "natural-look" && answers.tone === "warm" && material.id === "viraro") score += 10;
  if (answers.projectType === PROJECT_TYPES.INTERIOR_FLOOR && answers.exposure === "interior-humid" && answers.openness === "natural-only" && material.id === "lapacho") score += 24;
  return score;
}

function createReason(primary, answers) {
  if (primary.id === "wpc-deck") {
    return "Te lo recomendamos porque funciona mejor en exterior y simplifica el mantenimiento sin perder una terminacion calida.";
  }
  if (primary.id === "spc" || primary.id === "vinyl") {
    return "Te lo recomendamos porque es una opcion mas practica cuando la humedad o el uso diario pueden complicar a la madera.";
  }
  if (answers.priority === "humidity-resistance") {
    return "Te lo recomendamos porque dentro de las maderas disponibles responde mejor a condiciones exigentes.";
  }
  if (answers.priority === "natural-look") {
    return "Te lo recomendamos porque mantiene una presencia natural y acompana bien el estilo del espacio.";
  }
  return "Te lo recomendamos porque responde mejor al uso y a las condiciones del espacio que otras opciones mas delicadas.";
}

function createCaveat(primary, answers) {
  if (answers.openness === "natural-only" && answers.exposure === "interior-humid") {
    return "Como elegiste madera natural, priorizamos una especie mas resistente, aunque una alternativa como SPC o vinilico puede pedir menos cuidado frente a la humedad.";
  }
  if (primary.natural && answers.exposure.startsWith("exterior")) {
    return "Al ser madera natural, va a necesitar mas mantenimiento que una alternativa sintetica.";
  }
  return "";
}

export function getRecommendation(rawAnswers = {}) {
  const answers = normalizeAnswers(rawAnswers);
  const candidates = getCandidates(answers)
    .map((material) => ({ material, score: scoreMaterial(material, answers) }))
    .sort((a, b) => b.score - a.score);

  const primary = candidates[0]?.material || materialLibrary[0];
  const alternatives = materialLibrary
    .filter((material) => material.id !== primary.id)
    .map((material) => ({ material, score: scoreMaterial(material, answers) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(({ material }) => material);

  return {
    answers,
    primary,
    alternatives,
    reason: createReason(primary, answers),
    caveat: createCaveat(primary, answers),
  };
}
