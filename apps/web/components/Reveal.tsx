"use client";

import { useEffect, useRef, type ElementType, type ReactNode, type CSSProperties } from "react";

/**
 * Aparece una sola vez al entrar al viewport (fade + 16 px, ease-out).
 * - `trigger`: no oculta nada; solo marca `.is-visible` para animar hijos (p. ej. barras).
 * - Lo que ya está en pantalla al montar se revela de inmediato: nunca hay huecos en blanco.
 * - Sin JS (o sin IntersectionObserver) todo es visible.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
  trigger = false,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  trigger?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.classList.add("is-visible");
    const r = el.getBoundingClientRect();
    if (typeof IntersectionObserver === "undefined" || (r.top < window.innerHeight && r.bottom > 0)) {
      show();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          show();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`${trigger ? "" : "reveal "}${className}`} style={{ "--delay": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
