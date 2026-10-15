import { ImageResponse } from "next/og";
import { brand, colors } from "@forja/brand";
import { logomarkDataUri } from "./brand-asset";

export const alt = `${brand.name} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function googleFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`, { signal: AbortSignal.timeout(4000) })
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url, { signal: AbortSignal.timeout(4000) })).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const logo = await logomarkDataUri();
  const [black, bold] = await Promise.all([googleFont("Montserrat", 900), googleFont("Montserrat", 700)]);
  const fonts = [
    black && { name: "Montserrat", data: black, weight: 900 as const, style: "normal" as const },
    bold && { name: "Montserrat", data: bold, weight: 700 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 900 | 700; style: "normal" }[];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: colors.marino,
          color: colors.blanco,
          fontFamily: fonts.length ? "Montserrat" : undefined,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {logo && <img src={logo} width={80} height={80} alt="" />}
            <span style={{ fontSize: 44, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase" }}>{brand.name}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 900, lineHeight: 0.98, letterSpacing: -2 }}>
            <span>El acero del siglo XXI</span>
            <span>
              son los&nbsp;<span style={{ color: colors.turquesa }}>tokens.</span>
            </span>
          </div>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 700, color: colors.oro }}>
            Fondo de tokens de IA para jóvenes de Nuevo León · MCP · WebMCP
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: 90 }}>
          <div style={{ flex: 1, background: colors.naranja }} />
          <div style={{ flex: 1, background: colors.turquesa }} />
          <div style={{ flex: 1, background: colors.lima }} />
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
