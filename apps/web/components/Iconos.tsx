/**
 * Set de íconos monolínea (trazo grueso uniforme, esquinas achaflanadas), al estilo de la
 * identidad gráfica de Nuevo León. HOOK: cuando el set definitivo llegue a
 * packages/brand/assets/, reemplaza los paths de este archivo; el resto de la web usa
 * <Icono nombre="..."/> y no necesita cambios.
 */
import type { SVGProps } from "react";

const P = { pathLength: 1 } as const;

const ICONOS = {
  // Lingote/token: el fondo de tokens
  tokens: (
    <>
      <polygon {...P} points="24,5 40,14 40,34 24,43 8,34 8,14" />
      <polyline {...P} points="24,15 27,21 33,24 27,27 24,33 21,27 15,24 21,21 24,15" />
    </>
  ),
  // Libro abierto: cursos
  cursos: (
    <>
      <polyline {...P} points="24,12 18,9 6,9 6,37 18,37 24,41 30,37 42,37 42,9 30,9 24,12 24,41" />
      <line {...P} x1="11" y1="17" x2="19" y2="17" />
      <line {...P} x1="29" y1="17" x2="37" y2="17" />
    </>
  ),
  // Dos personas: comunidad
  comunidad: (
    <>
      <polygon {...P} points="13,8 19,8 21,10 21,16 19,18 13,18 11,16 11,10" />
      <polygon {...P} points="29,8 35,8 37,10 37,16 35,18 29,18 27,16 27,10" />
      <polyline {...P} points="5,40 5,28 9,24 23,24 24,25 25,24 39,24 43,28 43,40" />
    </>
  ),
  // Chimeneas de Fundidora
  fundidora: (
    <>
      <polyline {...P} points="6,42 6,26 12,26 12,8 17,8 17,26 22,26 22,14 27,14 27,26 32,26 32,4 37,4 37,26 42,26 42,42 6,42" />
      <line {...P} x1="12" y1="14" x2="17" y2="14" />
      <line {...P} x1="32" y1="11" x2="37" y2="11" />
    </>
  ),
  // Cerro de la Silla
  cerro: (
    <>
      <polyline {...P} points="3,38 13,24 17,27 22,18 26,23 29,21 33,13 37,19 45,38" />
      <line {...P} x1="3" y1="42" x2="45" y2="42" />
    </>
  ),
  // Agente / MCP: corchetes y conector
  agente: (
    <>
      <polyline {...P} points="14,8 8,8 5,11 5,37 8,40 14,40" />
      <polyline {...P} points="34,8 40,8 43,11 43,37 40,40 34,40" />
      <polyline {...P} points="16,30 22,24 16,18" />
      <line {...P} x1="25" y1="31" x2="33" y2="31" />
    </>
  ),
  // Gráfica de barras: datos
  datos: (
    <>
      <polyline {...P} points="6,6 6,42 42,42" />
      <polyline {...P} points="13,36 13,26 19,26 19,36" />
      <polyline {...P} points="24,36 24,16 30,16 30,36" />
      <polyline {...P} points="35,36 35,10 41,10" />
    </>
  ),
  // Engrane/simulador
  simulador: (
    <>
      <polygon {...P} points="18,6 30,6 30,12 36,12 42,18 36,18 36,30 42,30 36,36 30,36 30,42 18,42 18,36 12,36 6,30 12,30 12,18 6,18 12,12 18,12" />
      <polygon {...P} points="21,19 27,19 29,21 29,27 27,29 21,29 19,27 19,21" />
    </>
  ),
} as const;

export type NombreIcono = keyof typeof ICONOS;

export function Icono({ nombre, className = "", ...rest }: { nombre: NombreIcono } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={4}
      strokeLinejoin="miter"
      strokeLinecap="butt"
      className={`trazo ${className}`}
      aria-hidden
      {...rest}
    >
      {ICONOS[nombre]}
    </svg>
  );
}
