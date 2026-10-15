import type { Metadata, Viewport } from "next";
import { brand, colors, fonts } from "@forja/brand";
import "@forja/brand/tokens.css";
import "./globals.css";
import { WebMcpProvider } from "@/components/WebMcp";
import { SITE_URL } from "@/lib/site";

const description = `${brand.pitch} En el siglo XX Nuevo León forjó acero; en el XXI forja inteligencia.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${brand.name} — ${brand.tagline}`, template: `%s · ${brand.name}` },
  description,
  applicationName: brand.name,
  keywords: ["Nuevo León", "Monterrey", "IA", "tokens", "emprendimiento", "startups", "MCP", "WebMCP", "educación"],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: brand.name,
    title: `${brand.name} — ${brand.tagline}`,
    description,
  },
  twitter: { card: "summary_large_image", title: `${brand.name} — ${brand.tagline}`, description },
  alternates: { types: { "text/plain": "/llms.txt" } },
};

export const viewport: Viewport = {
  themeColor: colors.carbon,
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" suppressHydrationWarning>
      <head>
        {/* Las animaciones de entrada solo se activan con JS: sin JS todo el contenido es visible. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={fonts.googleFontsUrl} />
      </head>
      <body>
        <WebMcpProvider />
        {children}
      </body>
    </html>
  );
}
