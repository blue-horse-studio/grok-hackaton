/**
 * Logomark de Forja NL. PUNTO ÚNICO DE CAMBIO del logo en la web: cuando llegue el logo
 * monolínea definitivo a packages/brand/assets/, reemplaza el SVG de abajo.
 * (favicon y OG lo leen directo de packages/brand/assets/logomark.svg).
 * Gramática NL: monolínea gruesa en var(--fg) + chispa/token oro (cuadrado chaflanado) flotando arriba.
 */
export function Logomark({ className = "" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} role="img" aria-label="Forja NL">
      <path d="M19 58 V22 H47 M19 40 H40" stroke="var(--fg)" strokeWidth="7" strokeLinejoin="miter" />
      <polygon className="destello" points="45,4 51,4 54,7 54,13 51,16 45,16 42,13 42,7" fill="var(--forja-oro)" />
    </svg>
  );
}
