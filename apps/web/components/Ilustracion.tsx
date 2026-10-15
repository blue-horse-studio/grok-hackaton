/**
 * Hero: el símbolo de Forja NL a gran escala usado como "ventana" (SISTEMA-VISUAL.md, principio 2).
 * El fuste-chimenea de la F revela una foto de las chimeneas de Parque Fundidora con el Cerro de la Silla;
 * los brazos son vigas y la chispa oro flota arriba. Geometría escalada de packages/brand/assets/forja-simbolo.svg.
 * Foto: Betox (vía Panoramio), CC BY 3.0 — crédito en el footer.
 * Es estático por defecto; las clases hero-* solo añaden una entrada única si el usuario acepta movimiento.
 */
import type { CSSProperties } from "react";

const FUSTE = "60,640 60,230 120,170 230,170 230,640";

export function IlustracionHero({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 640"
      fill="none"
      className={className}
      role="img"
      aria-label="Símbolo de Forja NL: la chimenea de la F es una ventana a las chimeneas de Parque Fundidora y el Cerro de la Silla"
    >
      <defs>
        <clipPath id="hero-fuste">
          <polygon points={FUSTE} />
        </clipPath>
      </defs>
      {/* Ventana con la foto */}
      <g clipPath="url(#hero-fuste)">
        <rect x="0" y="0" width="520" height="640" fill="var(--forja-hierro)" />
        <image
          className="hero-foto"
          href="/fotos/fundidora-chimeneas.jpg"
          x="-190"
          y="150"
          width="750"
          height="560"
          preserveAspectRatio="xMidYMid slice"
        />
      </g>
      {/* Monolínea blanca gruesa */}
      <g stroke="var(--forja-blanco)" strokeWidth="30" strokeLinejoin="miter" strokeLinecap="butt">
        <polygon points={FUSTE} className="entra" style={{ "--delay": "80ms" } as CSSProperties} />
        <path d="M245 310 H516" className="hero-brazo" style={{ "--delay": "350ms" } as CSSProperties} />
        <path d="M245 483 H436" className="hero-brazo" style={{ "--delay": "480ms" } as CSSProperties} />
      </g>
      {/* Chispa / token oro */}
      <path
        className="hero-chispa"
        d="M109 22 L181 22 L197 38 L197 110 L181 126 L109 126 L93 110 L93 38 Z"
        fill="var(--forja-oro)"
      />
    </svg>
  );
}
