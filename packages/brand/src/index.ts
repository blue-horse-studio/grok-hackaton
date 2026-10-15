// Forja NL — tokens de marca. Fuente única para web y presentación.
// Concepto: en el siglo XX Nuevo León forjó acero (Fundidora); en el XXI forja inteligencia.
// Los tokens de IA son la nueva materia prima.

export const brand = {
  name: "Forja NL",
  tagline: "El acero del siglo XXI son los tokens.",
  pitch: "Un fondo de tokens de IA para que los jóvenes de Nuevo León construyan startups y proyectos.",
} as const;

export const colors = {
  carbon: "#0A0A0B", // fondo
  hierro: "#17181B", // superficies
  escoria: "#2A2C31", // bordes
  acero: "#8B95A1", // texto secundario
  hueso: "#F2EEE6", // texto principal
  forja: "#FF5B1F", // primario: metal fundido
  brasa: "#FFB224", // acento
  chispa: "#FFE8B0", // destello / highlights
} as const;

export const fonts = {
  display: "'Archivo', system-ui, sans-serif", // usar pesos 800-900, wdth 112-125
  body: "'Archivo', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace", // cifras y datos
  googleFontsUrl:
    "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=JetBrains+Mono:wght@400;600&display=swap",
} as const;

export const gradients = {
  fundido: `linear-gradient(135deg, ${colors.forja} 0%, ${colors.brasa} 60%, ${colors.chispa} 100%)`,
} as const;
