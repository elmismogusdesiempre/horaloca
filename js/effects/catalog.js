const groups = {
  fiesta: [
    [
      "top-hat",
      "Copa de medianoche",
      "head",
      "Sombrero de copa satinado con cinta y plumas",
    ],
    [
      "party-hat",
      "Órbita de fiesta",
      "head",
      "Cono festivo con guirnalda de luces",
    ],
    [
      "cowboy",
      "Rodeo dorado",
      "head",
      "Sombrero vaquero con ala curva y costuras",
    ],
    [
      "pirate",
      "Capitán de la noche",
      "head",
      "Tricornio con ribete y emblema original",
    ],
    ["king", "Rey de la pista", "head", "Corona alta de oro con gemas"],
    ["queen", "Reina de la noche", "head", "Corona de filigrana y perlas"],
    [
      "giant-glasses",
      "Mirada maximalista",
      "eyes",
      "Montura extragrande de acetato translúcido",
    ],
    [
      "heart-glasses",
      "Amor a primera fiesta",
      "eyes",
      "Gafas corazón con reflejos",
    ],
    [
      "visor",
      "Neón del futuro",
      "eyes",
      "Visor envolvente con barrido luminoso",
    ],
    ["mustache", "Monsieur", "mouth", "Bigote curvo de acabado aterciopelado"],
    ["wild-mustache", "Gran bigote", "mouth", "Bigote de puntas espirales"],
    [
      "tie",
      "Corbata en movimiento",
      "neck",
      "Corbata de seda con movimiento suave",
    ],
    ["bow", "Hora del corbatín", "neck", "Corbatín multicolor con pliegues"],
    ["afro", "Disco soul", "head", "Volumen de rizos con iluminación cálida"],
    ["wig", "Pop eléctrico", "head", "Melena de mechones iridiscentes"],
    [
      "bunny",
      "Conejo nocturno",
      "head",
      "Orejas satinadas con interior rosado",
    ],
    ["horns", "Pequeño caos", "head", "Cuernos lacados con brillos"],
    [
      "confetti",
      "Confeti de medianoche",
      "ambient",
      "Papel metálico con caída y giro",
    ],
    [
      "streamers",
      "Serpentinas al aire",
      "ambient",
      "Cintas helicoidales de celebración",
    ],
    [
      "disco-lights",
      "La pista es tuya",
      "ambient",
      "Haces de luz y halo de discoteca",
    ],
    [
      "disco-ball",
      "Bajo la bola disco",
      "ambient",
      "Esfera de espejos y reflejos móviles",
    ],
    [
      "orbit-stars",
      "Estrella de la fiesta",
      "orbit",
      "Estrellas luminosas alrededor del rostro",
    ],
    ["carnival", "Venecia eléctrica", "eyes", "Antifaz con filigrana y plumas"],
    [
      "neon-frame",
      "Noche neón",
      "frame",
      "Doble tubo luminoso y esquinas abiertas",
    ],
  ],
  boda: [
    [
      "white-floral",
      "Jardín de marfil",
      "frame",
      "Ramas y flores blancas en las esquinas",
    ],
    [
      "rose-floral",
      "Rosas de encuentro",
      "frame",
      "Arco asimétrico de rosas y hojas",
    ],
    ["delicate", "Polvo de luz", "ambient", "Pequeños destellos de luz cálida"],
    [
      "petals",
      "Pétalos al viento",
      "ambient",
      "Pétalos con caída y perspectiva",
    ],
    [
      "hearts",
      "Siempre nosotros",
      "ambient",
      "Corazones finos con movimiento sutil",
    ],
    ["bokeh", "Luz de romance", "ambient", "Círculos de luz desenfocados"],
    [
      "wedding-minimal",
      "Un día inolvidable",
      "frame",
      "Líneas editoriales y monograma",
    ],
    [
      "flower-crown",
      "Corona de azahar",
      "head",
      "Flores y hojas siguiendo la frente",
    ],
    [
      "bubbles",
      "Brindis de burbujas",
      "ambient",
      "Burbujas con reflejos de película fina",
    ],
    [
      "wedding-names",
      "Nuestra historia",
      "frame",
      "Composición romántica con nombres del evento",
    ],
  ],
  quince: [
    [
      "sparkle-crown",
      "Corona de estrellas",
      "head",
      "Corona radial con diamantes",
    ],
    ["tiara", "Tiara de luz", "head", "Arcos de plata y cristal"],
    ["butterflies", "Vuelo luminoso", "ambient", "Mariposas con alas animadas"],
    ["pink-sparks", "Aurora", "ambient", "Ráfagas ascendentes de chispas"],
    [
      "silver-stars",
      "Constelación",
      "ambient",
      "Estrellas de plata con profundidad",
    ],
    [
      "quince-frame",
      "Mis quince",
      "frame",
      "Marco editorial con número protagonista",
    ],
    [
      "pastel-confetti",
      "Sueño de confeti",
      "ambient",
      "Piezas pastel en caída lenta",
    ],
    [
      "celebration",
      "Luces para brillar",
      "ambient",
      "Guirnaldas de luces festivas",
    ],
    [
      "glitter-hearts",
      "Latidos de cristal",
      "ambient",
      "Corazones facetados y destellos",
    ],
    [
      "glam-name",
      "Tu gran noche",
      "frame",
      "Nombre personalizado y composición glam",
    ],
  ],
  cine: [
    [
      "breaking",
      "Última hora",
      "cinema",
      "Titular y cintillo de noticias ficticias",
    ],
    [
      "presenter",
      "En el estudio",
      "cinema",
      "Composición de entrevista y señal al aire",
    ],
    [
      "security",
      "Cámara 04",
      "cinema",
      "Imagen verde de fósforo, barrido CRT, grabando y reloj simulado",
    ],
    ["live", "Estamos en vivo", "cinema", "Interfaz de directo ficticio"],
    [
      "magazine",
      "Portada de la noche",
      "cinema",
      "Tipografía editorial y titulares",
    ],
    [
      "red-carpet",
      "Noche de estreno",
      "cinema",
      "Alfombra roja y luces de estreno",
    ],
    [
      "suspect",
      "Sospechoso de bailar",
      "cinema",
      "Ficha de comedia con líneas de altura",
    ],
    [
      "spy",
      "Misión: celebrar",
      "cinema",
      "Imagen monocromática verde de espionaje, retícula y expediente",
    ],
    ["scifi", "Expedición orbital", "cinema", "HUD espacial con telemetría"],
    [
      "retro",
      "Una película nuestra",
      "cinema",
      "Fotograma de 35 mm con perforaciones",
    ],
  ],
  empresa: [
    ["business", "Encuentro", "frame", "Composición corporativa minimalista"],
    [
      "brand-logo",
      "Tu marca en escena",
      "frame",
      "Identidad con logotipo opcional",
    ],
    [
      "corporate-party",
      "Un gran equipo",
      "ambient",
      "Cintas de celebración con color de marca",
    ],
    [
      "subtle-sparks",
      "Ideas que brillan",
      "ambient",
      "Destellos discretos en los bordes",
    ],
    ["tech", "Conexiones", "frame", "Circuitos y nodos tecnológicos"],
    ["future", "Próximo capítulo", "frame", "Paneles de interfaz futurista"],
    [
      "launch",
      "Presentamos el futuro",
      "frame",
      "Composición de lanzamiento de producto",
    ],
    [
      "conference",
      "Nos encontramos aquí",
      "frame",
      "Credencial editorial de conferencia",
    ],
    ["awards", "Reconocimiento", "frame", "Laureles metálicos de premiación"],
    [
      "anniversary",
      "Años haciendo historia",
      "frame",
      "Medallón de aniversario empresarial",
    ],
  ],
};
// New photographic compositions, each with a distinct camera treatment.
groups.cine.push(
  [
    "thermal",
    "Espectro térmico",
    "cinema",
    "Falso color por luminancia, leyenda de espectro y simulación térmica",
  ],
  [
    "cyanotype",
    "Retrato en cianotipia",
    "cinema",
    "Revelado monocromático azul con textura de impresión",
  ],
  [
    "comic-pop",
    "¡Esto es un cómic!",
    "cinema",
    "Posterización fotográfica, trama de puntos y estallido WOW",
  ],
  [
    "vhs",
    "Rebobina la fiesta",
    "cinema",
    "Eco de señal, desgarros de tracking y grabadora VHS",
  ],
  [
    "film-noir",
    "Una noche de cine negro",
    "cinema",
    "Fotografía monocromática con viñeta, grano y encuadre de cine",
  ],
  [
    "golden-hour",
    "La hora dorada",
    "cinema",
    "Luz cálida lateral, velo óptico y acabado de película",
  ],
  [
    "prism",
    "Prisma de fiesta",
    "cinema",
    "Reflejos duplicados, fugas de luz cromáticas y facetas ópticas",
  ],
  [
    "instant-film",
    "Recuerdo instantáneo",
    "cinema",
    "Emulsión cálida y composición de película instantánea",
  ],
);
export const themes = {
  fiesta: "Fiesta loca",
  boda: "Bodas",
  quince: "Quince años",
  cine: "Televisión y cine",
  empresa: "Corporativos",
};
export const catalog = Object.entries(groups).flatMap(([theme, rows]) =>
  rows.map(([id, name, slot, description]) => ({
    id,
    name,
    theme,
    slot,
    description,
    category: ["head", "eyes", "mouth", "neck", "orbit"].includes(slot)
      ? "Accesorio facial"
      : slot === "ambient"
        ? "Ambiente"
        : slot === "cinema"
          ? "Cine"
          : "Marco",
    type: slot,
    requiresTracking: ["head", "eyes", "mouth", "neck", "orbit"].includes(slot),
    multiFace: true,
    resources: [],
    thumbnail: "rendered-canvas",
    compatibleWith: "one-per-slot; maximum 3 layers; cinema excludes frame",
    performance:
      slot === "ambient" ||
      ["thermal", "comic-pop", "vhs", "prism"].includes(id)
        ? "medium"
        : "low",
    availability: "implemented-unvalidated-camera",
  })),
);
export const byId = new Map(catalog.map((e) => [e.id, e]));
export function recommended(theme) {
  return catalog.filter((e) => e.theme === theme).map((e) => e.id);
}
