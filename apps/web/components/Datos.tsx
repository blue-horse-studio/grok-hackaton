import {
  datasets,
  getDataset,
  type Dataset,
  type EcosistemaRegistro,
  type PrecioModeloRegistro,
  type ProgramaLaboratorioRegistro,
  type TipoCambioRegistro,
} from "@forja/data";
import type { CSSProperties } from "react";
import { Reveal } from "./Reveal";
import { EstadoBadge, Fuentes } from "./Fuentes";
import { decimal, descripcionPublica, humanKey, valorGenerico } from "@/lib/format";

// Datasets con visualización propia (o que viven en otra sección).
const PROPIOS = new Set([
  "precios-modelos-ia",
  "ecosistema-startups-nl",
  "programas-laboratorios-ia",
  "tipo-cambio",
  "cursos-forja",
  "poblacion-joven-nl",
]);

const verif = (d: { verificado: boolean }, r: { verificado?: boolean }) => r.verificado ?? d.verificado;

export function ultimoTipoCambio() {
  const d = getDataset<TipoCambioRegistro>("tipo-cambio");
  const r = d?.registros.slice().sort((a, b) => a.fecha.localeCompare(b.fecha)).at(-1);
  return r ? { ...r, dataset: d! } : undefined;
}

function Card({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <Reveal delay={delay} className={`panel flex flex-col p-6 sm:p-7 ${className}`}>
      {children}
    </Reveal>
  );
}

function CardHead({ d, kicker }: { d: { titulo: string; descripcion: string }; kicker?: string }) {
  return (
    <header className="mb-5">
      {kicker && <p className="eyebrow mb-2">{kicker}</p>}
      <h3 className="display-wide text-xl text-fg sm:text-2xl">{d.titulo}</h3>
      <p className="mt-1.5 text-sm text-muted">{descripcionPublica(d.descripcion)}</p>
    </header>
  );
}

const CAT_COLOR: Record<string, string> = {
  frontera: "var(--forja-naranja)",
  economico: "var(--forja-turquesa)",
  abierto: "var(--forja-lima)",
};
const CAT_NOMBRE: Record<string, string> = { frontera: "Frontera", economico: "Económico", abierto: "Pesos abiertos" };

function Precios({ d }: { d: Dataset<PrecioModeloRegistro> }) {
  const tc = ultimoTipoCambio();
  const rows = d.registros.slice().sort((a, b) => b.usd_output_por_millon - a.usd_output_por_millon);
  const max = Math.max(...rows.map((r) => r.usd_output_por_millon), 1);
  return (
    <Card className="lg:col-span-2">
      <CardHead d={d} kicker="La materia prima" />
      <div className="mb-4 flex flex-wrap gap-4 text-xs text-muted">
        {Object.entries(CAT_NOMBRE).map(([k, n]) => (
          <span key={k} className="inline-flex items-center gap-2">
            <span className="size-2.5" style={{ background: CAT_COLOR[k] }} /> {n}
          </span>
        ))}
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-0.5 bg-fg" /> Precio de entrada (input)
        </span>
      </div>
      <ul className="space-y-2.5">
        {rows.map((r, i) => (
          <li key={r.id} className="grid grid-cols-[8.5rem_1fr_auto] items-center gap-3 sm:grid-cols-[11rem_1fr_9rem]">
            <span className="truncate text-sm text-fg" title={`${r.proveedor} · ${r.modelo}`}>
              {r.modelo}
              <span className="block text-[11px] text-muted">{r.proveedor}</span>
            </span>
            <span className="relative h-3.5 bg-line/40">
              <span
                className="bar-fill absolute inset-y-0 left-0 w-full"
                style={
                  {
                    "--w": r.usd_output_por_millon / max,
                    "--delay": `${i * 50}ms`,
                    background: CAT_COLOR[r.categoria] ?? "var(--muted)",
                  } as CSSProperties
                }
              />
              <span
                className="absolute inset-y-[-3px] w-0.5 bg-fg"
                style={{ left: `${(r.usd_input_por_millon / max) * 100}%` }}
                aria-hidden
              />
            </span>
            <span className="num text-right text-sm text-fg">
              US${decimal(r.usd_output_por_millon)}
              {tc && (
                <span className="hidden text-[11px] text-muted sm:block">
                  ≈ ${decimal(r.usd_output_por_millon * tc.mxn_por_usd)} MXN
                </span>
              )}
              {!verif(d, r) && <span className="block text-[10px] uppercase text-muted">estimado</span>}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted">
        Barra: USD por millón de tokens de salida (output).
        {tc && (
          <>
            {" "}
            Conversión con {tc.tipo} del {tc.fecha}: <span className="num">${decimal(tc.mxn_por_usd)}</span> MXN por dólar.
          </>
        )}
      </p>
      <Fuentes dataset={d} className="mt-auto pt-4" />
    </Card>
  );
}

function Ecosistema({ d }: { d: Dataset<EcosistemaRegistro> }) {
  return (
    <Card>
      <CardHead d={d} kicker="El punto de partida" />
      <dl className="grid grid-cols-2 gap-x-5 gap-y-6">
        {d.registros.map((r) => (
          <div key={r.indicador}>
            <dd className="num text-3xl text-fg sm:text-4xl">
              {typeof r.valor === "number" ? (r.unidad === "lugar" ? `#${r.valor}` : valorGenerico(r.valor)) : r.valor}
            </dd>
            <dt className="mt-1 text-xs leading-snug text-muted">
              {r.indicador}
              {r.anio ? ` (${r.anio})` : ""}
            </dt>
            {!verif(d, r) && <span className="num mt-1 block text-[10px] uppercase tracking-widest text-muted/80">estimado</span>}
          </div>
        ))}
      </dl>
      <Fuentes dataset={d} className="mt-auto pt-4" />
    </Card>
  );
}

function Laboratorios({ d }: { d: Dataset<ProgramaLaboratorioRegistro> }) {
  return (
    <Card>
      <CardHead d={d} kicker="Lo que ya existe fuera" />
      <ul className="divide-y divide-line">
        {d.registros.map((r) => (
          <li key={r.laboratorio + r.programa} className="flex items-start justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-semibold text-fg">
                {r.programa} <span className="font-normal text-muted">· {r.laboratorio}</span>
              </p>
              <p className="text-xs text-muted">{r.a_quien}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="num text-sm text-acento">{r.monto ?? "—"}</p>
              {!verif(d, r) && <p className="num text-[10px] uppercase text-muted">estimado</p>}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">
        Ninguno está diseñado para jóvenes de Nuevo León. Forja NL los agrega y los pone al alcance de un estudiante.
      </p>
      <Fuentes dataset={d} className="mt-auto pt-4" />
    </Card>
  );
}

const LABEL_KEYS = ["nombre", "programa", "institucion", "indicador", "modelo", "titulo", "municipio", "laboratorio", "fecha", "id"];

/** Visualización genérica: cualquier dataset nuevo aparece aquí automáticamente. */
function Generico({ d, delay }: { d: Dataset; delay: number }) {
  const first = d.registros[0] ?? {};
  const labelKey = LABEL_KEYS.find((k) => typeof first[k] === "string") ?? Object.keys(first).find((k) => typeof first[k] === "string");
  const numKey = Object.keys(first).find(
    (k) => typeof first[k] === "number" && !/anio|año|orden|year/i.test(k) && k !== "verificado",
  );
  const secKeys = Object.keys(first)
    .filter((k) => k !== labelKey && typeof first[k] === "string" && !/url|nota|clave|id$/i.test(k))
    .slice(0, 2);
  const max = numKey ? Math.max(...d.registros.map((r) => Number(r[numKey]) || 0), 1) : 1;

  return (
    <Card delay={delay}>
      <CardHead d={d} />
      <ul className="space-y-3">
        {d.registros.slice(0, 8).map((r, i) => {
          const v = numKey ? Number(r[numKey]) : undefined;
          const estimado = !((r.verificado as boolean | undefined) ?? d.verificado);
          return (
            <li key={i}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-fg">{labelKey ? String(r[labelKey]) : `Registro ${i + 1}`}</span>
                {numKey && v !== undefined && !Number.isNaN(v) && (
                  <span className="num shrink-0 text-sm text-acento">{valorGenerico(v, numKey)}</span>
                )}
              </div>
              {secKeys.length > 0 && (
                <p className="text-xs text-muted">
                  {secKeys.map((k) => valorGenerico(r[k], k)).join(" · ")}
                  {estimado && <span className="num ml-2 text-[10px] uppercase tracking-widest">estimado</span>}
                </p>
              )}
              {numKey && v !== undefined && !Number.isNaN(v) && d.registros.length > 1 && (
                <span className="relative mt-1.5 block h-1.5 rounded-full bg-line/50">
                  <span
                    className="bar-fill absolute inset-0 rounded-full bg-acento"
                    style={{ "--w": Math.max(0.02, v / max), "--delay": `${i * 60}ms` } as CSSProperties}
                  />
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {numKey && <p className="mt-3 text-[11px] text-muted">Valor: {humanKey(numKey)}</p>}
      <Fuentes dataset={d} className="mt-auto pt-4" />
    </Card>
  );
}

export function Datos() {
  const precios = getDataset<PrecioModeloRegistro>("precios-modelos-ia");
  const eco = getDataset<EcosistemaRegistro>("ecosistema-startups-nl");
  const labs = getDataset<ProgramaLaboratorioRegistro>("programas-laboratorios-ia");
  const resto = datasets.filter((d) => !PROPIOS.has(d.id) && d.registros.length > 0);

  if (datasets.length === 0) {
    return (
      <div className="panel p-8 text-center text-muted">
        Estamos cargando los datasets con sus fuentes. Vuelve en unos minutos.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {precios && precios.registros.length > 0 && <Precios d={precios} />}
      {eco && eco.registros.length > 0 && <Ecosistema d={eco} />}
      {labs && labs.registros.length > 0 && <Laboratorios d={labs} />}
      {resto.map((d, i) => (
        <Generico key={d.id} d={d} delay={i * 80} />
      ))}
    </div>
  );
}

export { EstadoBadge };
