/**
 * Ilustración monolínea del hero: chimeneas de Fundidora, el Cerro de la Silla y el token
 * como nuevo sol. Trazo grueso uniforme y esquinas achaflanadas.
 * HOOK: sustituible por un SVG de packages/brand/assets/ cuando exista.
 */
const P = { pathLength: 1 } as const;

export function IlustracionHero({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 420"
      fill="none"
      strokeWidth={10}
      strokeLinejoin="miter"
      strokeLinecap="butt"
      className={`trazo ${className}`}
      role="img"
      aria-label="Chimeneas de Fundidora y el Cerro de la Silla con un token como sol"
    >
      {/* Token-sol */}
      <g stroke="var(--acento)">
        <polygon {...P} points="358,46 422,46 440,64 440,128 422,146 358,146 340,128 340,64" style={{ transitionDelay: "500ms" }} />
        <polyline {...P} points="390,72 398,90 416,96 398,102 390,120 382,102 364,96 382,90 390,72" style={{ transitionDelay: "900ms" }} />
      </g>
      {/* Cerro de la Silla */}
      <polyline
        {...P}
        stroke="var(--fg)"
        points="150,360 250,250 285,272 330,196 362,236 388,222 430,150 470,214 530,268 590,360"
        style={{ transitionDelay: "200ms" }}
      />
      {/* Fundidora */}
      <g stroke="var(--fg)">
        <polyline
          {...P}
          points="16,404 16,300 50,300 50,120 62,108 74,120 74,300 104,300 104,170 116,158 128,170 128,300 158,300 158,212 170,200 182,212 182,300 212,300 212,404"
        />
        <line {...P} x1="50" y1="160" x2="74" y2="160" />
        <line {...P} x1="104" y1="206" x2="128" y2="206" />
        <polyline {...P} points="40,404 40,350 64,330 88,350 88,404" style={{ transitionDelay: "400ms" }} />
        <polyline {...P} points="136,404 136,350 160,330 184,350 184,404" style={{ transitionDelay: "500ms" }} />
      </g>
      {/* Humo convertido en datos */}
      <g stroke="var(--forja-turquesa)">
        <polyline {...P} points="62,84 62,72 78,60 78,44" style={{ transitionDelay: "1100ms" }} />
        <polyline {...P} points="116,134 116,122 100,110 100,96" style={{ transitionDelay: "1200ms" }} />
      </g>
      {/* Suelo */}
      <line {...P} stroke="var(--fg)" x1="0" y1="404" x2="600" y2="404" style={{ transitionDelay: "100ms" }} />
    </svg>
  );
}
