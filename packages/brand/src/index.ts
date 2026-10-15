// Forja NL — tokens de marca. Fuente única para web y presentación.
// Concepto: en el siglo XX Nuevo León forjó acero (Fundidora); en el XXI forja inteligencia.
// Los tokens de IA son la nueva materia prima.

export const brand = {
  name: "Forja NL",
  tagline: "El acero del siglo XXI son los tokens.",
  pitch: "Un fondo de tokens de IA para que los jóvenes de Nuevo León construyan startups y proyectos.",
} as const;

// Referencia estética: sistema gráfico del Gobierno de Nuevo León (ver presentation/referencias/SISTEMA-VISUAL.md).
// Monolínea gruesa como ventana sobre foto, marino + oro + blanco, acentos vivos por tema.
export const colors = {
  marino: "#1E2235", // fondo principal oscuro
  oro: "#B08D57", // chispa/token, acentos premium
  blanco: "#FFFFFF",
  naranja: "#FF8200", // industria / Fundidora
  turquesa: "#16C1D1", // IA / tokens / tecnología
  lima: "#8CD13F", // crecimiento / educación
  grafito: "#2D2D2D", // trazo sobre fondo claro
  // Alias heredados (usados por la web); mapean a la paleta nueva
  carbon: "#1E2235",
  hierro: "#262B42",
  escoria: "#3A4060",
  acero: "#A5AAC0",
  hueso: "#FFFFFF",
  forja: "#FF8200",
  brasa: "#B08D57",
  chispa: "#16C1D1",
} as const;

export const fonts = {
  display: "'Montserrat', system-ui, sans-serif", // titulares 800-900, interlineado 0.95
  wordmark: "'Archivo', system-ui, sans-serif", // mayúsculas, wdth 125, peso 700-800
  body: "'Montserrat', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace", // cifras y datos
  googleFontsUrl:
    "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Archivo:wdth,wght@125,700;125,800&family=JetBrains+Mono:wght@400;600&display=swap",
} as const;

export const gradients = {
  // Estética plana: evitar degradados llamativos; este es sutil.
  fundido: `linear-gradient(135deg, ${colors.naranja} 0%, ${colors.oro} 100%)`,
} as const;
