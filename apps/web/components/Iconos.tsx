/**
 * Set de íconos monolínea de Forja NL. Fuente: packages/brand/assets/iconos/*.svg
 * (96×96, trazo 8, chaflanes a 45°, chispa oro). Si cambia el set en brand, copia aquí los paths.
 * Uso: <Icono nombre="..."/>. Los trazos usan currentColor y la chispa, el oro de la marca.
 */
import type { SVGProps } from "react";

const P = { pathLength: 1 } as const;
const ORO = "var(--forja-oro)";

const ICONOS = {
  // Token chaflanado: el fondo de tokens
  tokens: (
    <>
      <path {...P} d="M28.8 16 L67.2 16 L80 28.8 L80 67.2 L67.2 80 L28.8 80 L16 67.2 L16 28.8 Z" />
      <path d="M39.16 35 L56.84 35 L61 39.16 L61 56.84 L56.84 61 L39.16 61 L35 56.84 L35 39.16 Z" fill={ORO} stroke="none" />
    </>
  ),
  // Libro abierto: cursos
  cursos: (
    <>
      <path {...P} d="M48 30 L40 22 H8 V74 H40 L48 82" />
      <path {...P} d="M48 30 L56 22 H88 V74 H56 L48 82" />
      <path {...P} d="M48 30 V82" />
    </>
  ),
  // Tres personas: comunidad
  comunidad: (
    <>
      <path {...P} d="M39 26 A9 9 0 1 1 57 26 A9 9 0 1 1 39 26 Z" />
      <path {...P} d="M32 74 A16 16 0 0 1 64 74 V80" />
      <path {...P} d="M32 74 V80" />
      <path {...P} d="M8 42 A7 7 0 1 1 22 42 A7 7 0 1 1 8 42 Z" />
      <path {...P} d="M4 88 V82 A11 11 0 0 1 26 82 V88" />
      <path {...P} d="M74 42 A7 7 0 1 1 88 42 A7 7 0 1 1 74 42 Z" />
      <path {...P} d="M70 88 V82 A11 11 0 0 1 92 82 V88" />
    </>
  ),
  // Chimeneas de la Fundidora
  fundidora: (
    <>
      <path {...P} d="M4 88 H92" />
      <path {...P} d="M14 88 V36" />
      <path {...P} d="M34 88 V24" />
      <path {...P} d="M54 88 V44" />
      <path {...P} d="M54 70 L70 56 V70 L86 56 V88" />
      <path d="M29.92 3 L38.08 3 L40 4.92 L40 13.08 L38.08 15 L29.92 15 L28 13.08 L28 4.92 Z" fill={ORO} stroke="none" />
    </>
  ),
  // Cerro de la Silla
  cerro: (
    <>
      <path {...P} d="M4 82 L30 30 L38 44 A14 14 0 0 0 62 44 L68 34 L92 82" />
    </>
  ),
  // Nodos conectados: agentes / MCP
  agente: (
    <>
      <path {...P} d="M38 34 L25 21 M58 34 L71 21 M48 58 V70" />
      <path {...P} d="M8 14 A8 8 0 1 1 24 14 A8 8 0 1 1 8 14 Z" />
      <path {...P} d="M72 14 A8 8 0 1 1 88 14 A8 8 0 1 1 72 14 Z" />
      <path {...P} d="M40 80 A8 8 0 1 1 56 80 A8 8 0 1 1 40 80 Z" />
      <path d="M38.48 30 L57.52 30 L62 34.48 L62 53.52 L57.52 58 L38.48 58 L34 53.52 L34 34.48 Z" fill={ORO} stroke="none" />
    </>
  ),
  // Chip de IA: datos
  datos: (
    <>
      <path {...P} d="M24 24 H64 L72 32 V72 H24 Z" />
      <path {...P} d="M38 24 V8 M58 24 V8 M38 72 V88 M58 72 V88 M24 38 H8 M24 58 H8 M72 38 H88 M72 58 H88" />
      <path d="M43 38 L53 38 L58 43 L58 53 L53 58 L43 58 L38 53 L38 43 Z" fill={ORO} stroke="none" />
    </>
  ),
  // Cofre de tokens: simulador del fondo
  simulador: (
    <>
      <path {...P} d="M10 44 V32 L22 20 H74 L86 32 V44" />
      <path {...P} d="M10 44 H86 V86 H10 Z" />
      <path d="M43.5 47 L52.5 47 L57 51.5 L57 60.5 L52.5 65 L43.5 65 L39 60.5 L39 51.5 Z" fill={ORO} stroke="none" />
    </>
  ),
} as const;

export type NombreIcono = keyof typeof ICONOS;

export function Icono({ nombre, className = "", ...rest }: { nombre: NombreIcono } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      stroke="currentColor"
      strokeWidth={8}
      strokeLinejoin="miter"
      strokeLinecap="butt"
      className={className}
      aria-hidden
      {...rest}
    >
      {ICONOS[nombre]}
    </svg>
  );
}
