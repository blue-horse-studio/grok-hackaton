/**
 * Símbolo de Forja NL: la chimenea de la Fundidora es el fuste de la F, las vigas son los brazos
 * y la chispa/token oro flota arriba. Fuente: packages/brand/assets/forja-simbolo.svg
 * (favicon y OG lo leen directo de packages/brand/assets/logomark.svg).
 */
export function Logomark({ className = "" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 240 240" fill="none" className={className} role="img" aria-label="Forja NL">
      <g stroke="var(--fg)" strokeWidth="22" strokeLinecap="butt" strokeLinejoin="miter">
        <path d="M60 222 V90 L78 72 H104 V222 Z" />
        <path d="M104 114 H190" />
        <path d="M104 166 H166" />
      </g>
      <path
        className="destello"
        d="M68.4 7 L95.6 7 L102 13.4 L102 40.6 L95.6 47 L68.4 47 L62 40.6 L62 13.4 Z"
        fill="var(--forja-oro)"
      />
    </svg>
  );
}
