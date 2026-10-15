import type { Fuente } from "@forja/data";

type ConFuentes = { fuentes: Fuente[]; verificado: boolean };

export function EstadoBadge({ verificado }: { verificado: boolean }) {
  return verificado ? (
    <span className="num inline-flex items-center gap-1.5 border border-line px-2 py-0.5 text-[11px] uppercase tracking-widest text-muted">
      <span className="size-1.5 rounded-full bg-acento" /> Con fuente
    </span>
  ) : (
    <span className="num inline-flex items-center gap-1.5 border border-dashed border-muted/60 px-2 py-0.5 text-[11px] uppercase tracking-widest text-muted">
      <span className="size-1.5 border border-muted" /> Estimado
    </span>
  );
}

/** Pie de tarjeta con las fuentes del dataset. Siempre visible: cada cifra lleva su origen. */
export function Fuentes({ dataset, className = "" }: { dataset: ConFuentes; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-line pt-4 text-xs text-muted ${className}`}>
      <EstadoBadge verificado={dataset.verificado} />
      <span className="text-muted/80">Fuente{dataset.fuentes.length === 1 ? "" : "s"}:</span>
      {dataset.fuentes.length === 0 && <span>por documentar</span>}
      {dataset.fuentes.map((f, i) => (
        <span key={f.nombre + i}>
          {f.url ? (
            <a href={f.url} target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-4 hover:text-acento hover:decoration-acento">
              {f.nombre}
            </a>
          ) : (
            f.nombre
          )}
          {f.fecha ? <span className="text-muted/70"> ({f.fecha})</span> : null}
        </span>
      ))}
    </div>
  );
}
