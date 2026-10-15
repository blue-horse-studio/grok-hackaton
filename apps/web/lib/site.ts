/** URL pública del sitio. En Vercel se toma del dominio de producción. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
  "http://localhost:3000"
).replace(/\/$/, "");

export const MCP_PATH = "/api/mcp";

export const HACKATHON = {
  nombre: "Hackathon por Nuevo León x Grok Bot & AI Tinkerers",
  evento: "Monterrey Tech Week 2026",
  url: "https://luma.com/monterrey-p7pu",
};

export const EQUIPO = [
  { handle: "leosanxyz", url: "https://github.com/leosanxyz" },
  { handle: "luisvaldez3015-cmd", url: "https://github.com/luisvaldez3015-cmd" },
  { handle: "JFerniz", url: "https://github.com/JFerniz" },
  { handle: "OmarMendoza3", url: "https://github.com/OmarMendoza3" },
];
