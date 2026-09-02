/**
 * Que salio mal en el visualizador, y que ve el visitante en cada caso.
 *
 * Existe porque antes todo terminaba en el mismo texto generico: quedarse sin
 * credito, la key mal configurada y una foto sin piso se veian igual, asi que
 * nadie podia hacer nada al respecto — ni el visitante ni el negocio.
 */

export const ERROR_CODES = {
  SIN_PISO: "sin-piso",
  FOTO_INVALIDA: "foto-invalida",
  DEMASIADOS_INTENTOS: "demasiados-intentos",
  NO_CONFIGURADO: "no-configurado",
  SIN_CREDITO: "sin-credito",
  SERVICIO_CAIDO: "servicio-caido",
  DESCONOCIDO: "desconocido",
};

/** Traduce la respuesta de error de OpenAI a uno de nuestros codigos. */
export function mapOpenAiFailure(status, body) {
  const codigo = body?.error?.code ?? "";

  if (codigo === "insufficient_quota" || codigo === "billing_hard_limit_reached") {
    return ERROR_CODES.SIN_CREDITO;
  }
  if (codigo === "content_policy_violation") return ERROR_CODES.FOTO_INVALIDA;
  if (status === 401 || status === 403) return ERROR_CODES.NO_CONFIGURADO;
  // 429 sin insufficient_quota es el limite de OpenAI, no falta de plata: pasa solo.
  if (status === 429) return ERROR_CODES.SERVICIO_CAIDO;
  if (status >= 500 && status < 600) return ERROR_CODES.SERVICIO_CAIDO;

  return ERROR_CODES.DESCONOCIDO;
}

/** Lo que necesita saber el negocio, que no siempre es lo que ve el visitante. */
export const SEVERIDAD_INTERNA = {
  [ERROR_CODES.SIN_CREDITO]: "La cuenta de OpenAI se quedó sin crédito. El visualizador no genera nada hasta que se recargue.",
  [ERROR_CODES.NO_CONFIGURADO]: "La clave de OpenAI falta o fue rechazada. Revisar OPENAI_API_KEY y sus permisos.",
};

// El visitante nunca se entera de si el problema es plata, permisos o una
// caida: para el son lo mismo, y en los tres casos la salida es escribirnos.
const SERVICIO_NO_DISPONIBLE = {
  titulo: "El probador no está disponible",
  detalle:
    "Estamos teniendo un problema para generar las vistas en este momento. Escribinos por WhatsApp y te asesoramos igual con el material que estabas mirando.",
  accion: "whatsapp",
};

const DESCRIPCIONES = {
  [ERROR_CODES.SIN_PISO]: {
    titulo: "No encontramos el piso en esa foto",
    detalle:
      "Necesitamos ver el suelo del ambiente para poder reemplazarlo. Sacá la foto de pie, apuntando al piso que querés renovar, y que se vea buena parte de la superficie.",
    accion: "cambiar-foto",
  },
  [ERROR_CODES.FOTO_INVALIDA]: {
    titulo: "No pudimos usar esa foto",
    detalle:
      "La imagen no tiene un formato que podamos procesar, o el contenido no corresponde a un ambiente. Probá con otra foto en JPG, PNG o WEBP.",
    accion: "cambiar-foto",
  },
  [ERROR_CODES.DEMASIADOS_INTENTOS]: {
    titulo: "Probaste varias veces seguidas",
    detalle: "Para que el probador siga siendo gratis limitamos la cantidad de pruebas seguidas.",
    accion: "esperar",
  },
  [ERROR_CODES.NO_CONFIGURADO]: SERVICIO_NO_DISPONIBLE,
  [ERROR_CODES.SIN_CREDITO]: SERVICIO_NO_DISPONIBLE,
  [ERROR_CODES.SERVICIO_CAIDO]: SERVICIO_NO_DISPONIBLE,
  [ERROR_CODES.DESCONOCIDO]: {
    titulo: "Algo salió mal",
    detalle:
      "No pudimos generar la vista y no sabemos bien por qué. Probá de nuevo en un momento, y si sigue pasando escribinos.",
    accion: "reintentar",
  },
};

function enMinutos(segundos) {
  if (!segundos || Number.isNaN(segundos)) return "";
  const minutos = Math.max(1, Math.round(segundos / 60));
  return ` Volvé a intentar en ${minutos} ${minutos === 1 ? "minuto" : "minutos"}.`;
}

export function describeError(code, { retryAfterSeconds } = {}) {
  const base = DESCRIPCIONES[code] ?? DESCRIPCIONES[ERROR_CODES.DESCONOCIDO];

  if (code === ERROR_CODES.DEMASIADOS_INTENTOS) {
    return { ...base, detalle: base.detalle + enMinutos(retryAfterSeconds) };
  }
  return base;
}
