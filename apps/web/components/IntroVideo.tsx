"use client";

import { useRef, useState } from "react";

/**
 * Video de intro (presentation/renders/forja-intro.mp4 copiado a public/video/).
 * Nunca se reproduce solo: el botón grande lo inicia con sonido y subtítulos en español.
 * Si el archivo aún no existe (o falla), queda el póster con un aviso.
 */
export function IntroVideo({
  src,
  poster,
  captions,
  disponible,
  duracion = "0:46",
}: {
  src: string;
  poster: string;
  captions: string;
  disponible: boolean;
  duracion?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [estado, setEstado] = useState<"inicio" | "reproduciendo" | "error">(disponible ? "inicio" : "error");

  const play = async () => {
    const v = ref.current;
    if (!v) return;
    try {
      v.muted = false;
      await v.play();
      setEstado("reproduciendo");
      v.focus();
    } catch {
      if (v.error) setEstado("error");
    }
  };

  return (
    <div className="chaflan bg-escoria p-px [--c:36px] [--r:32px] sm:[--c:48px] sm:[--r:40px]">
    <div className="chaflan relative aspect-video w-full overflow-hidden bg-hierro [--c:36px] [--r:31px] sm:[--c:48px] sm:[--r:39px]">
      {disponible ? (
        <video
          ref={ref}
          className="absolute inset-0 size-full object-cover"
          poster={poster}
          preload="metadata"
          playsInline
          controls={estado === "reproduciendo"}
          onError={() => setEstado("error")}
          onEnded={() => setEstado("inicio")}
          aria-label="Video de presentación de Forja NL"
        >
          <source src={src} type="video/mp4" onError={() => setEstado("error")} />
          <track kind="captions" srcLang="es" label="Español" src={captions} default />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" className="absolute inset-0 size-full object-cover" />
      )}

      {estado !== "reproduciendo" && (
        <div className="absolute inset-0 flex items-end justify-start bg-gradient-to-t from-marino/85 via-transparent to-transparent p-4 sm:p-8 lg:p-10">
          {estado === "inicio" ? (
            <button
              type="button"
              onClick={play}
              className="btn btn-primary group !gap-3 !py-2 !pl-2 !pr-4 !text-sm shadow-2xl sm:!gap-4 sm:!py-4 sm:!pl-4 sm:!pr-8 sm:!text-xl"
            >
              <span className="chaflan-sm grid size-9 place-items-center bg-marino text-oro transition-transform duration-200 ease-out group-hover:scale-105 sm:size-14">
                <svg viewBox="0 0 24 24" className="ml-0.5 size-5 sm:size-6" aria-hidden fill="currentColor">
                  <path d="M7 4.5v15l12.5-7.5z" />
                </svg>
              </span>
              <span>
                Ver la intro <span className="num font-medium opacity-80">· {duracion}</span>
              </span>
            </button>
          ) : (
            <p className="chaflan-sm flex items-center gap-2.5 border border-escoria bg-hierro px-3 py-2 text-xs text-blanco sm:gap-3 sm:px-4 sm:py-3 sm:text-base" role="status">
              <span className="pulso size-2 shrink-0 rounded-full bg-oro" aria-hidden />
              Intro en video · muy pronto
            </p>
          )}
        </div>
      )}
    </div>
    </div>
  );
}
