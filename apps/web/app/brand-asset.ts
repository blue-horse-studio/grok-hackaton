import { readFile } from "node:fs/promises";
import { join } from "node:path";

// icon y opengraph-image se prerenderizan en build, así que no hace falta trazar el archivo.
/** Lee el logomark directamente de @forja/brand para que favicon y OG cambien con el asset. */
export async function logomarkDataUri() {
  const candidates = [
    join(process.cwd(), "../../packages/brand/assets/logomark.svg"),
    join(process.cwd(), "packages/brand/assets/logomark.svg"),
  ];
  for (const p of candidates) {
    try {
      const svg = await readFile(/*turbopackIgnore: true*/ p, "utf8");
      return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
    } catch {}
  }
  return null;
}
