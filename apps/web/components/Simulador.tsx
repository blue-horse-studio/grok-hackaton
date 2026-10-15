"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { simularFondo, SIMULACION_DEFAULTS, type SimulacionInput } from "@forja/tools";
import { AnimatedNumber } from "./AnimatedNumber";
import { entero, largo, largoTexto, mxn, mxn2, decimal } from "@/lib/format";

export interface ModeloOpcion {
  id: string;
  nombre: string;
}

// Escala logarítmica para que el slider sea útil de 1 M a 1,000 M MXN.
const logScale = (min: number, max: number) => ({
  toValue: (t: number) => Math.round(Math.exp(Math.log(min) + (Math.log(max) - Math.log(min)) * t)),
  toT: (v: number) => (Math.log(Math.min(max, Math.max(min, v))) - Math.log(min)) / (Math.log(max) - Math.log(min)),
});
const PRESUPUESTO = logScale(1_000_000, 1_000_000_000);
const TOKENS = logScale(250_000, 100_000_000);

const roundNice = (v: number) => {
  const p = Math.pow(10, Math.max(0, Math.floor(Math.log10(v)) - 1));
  return Math.round(v / p) * p;
};

function Slider({
  label,
  hint,
  display,
  t,
  onT,
  steps = 1000,
}: {
  label: string;
  hint?: string;
  display: string;
  t: number;
  onT: (t: number) => void;
  steps?: number;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-semibold text-fg">{label}</span>
        <span className="num text-lg text-acento sm:text-xl">{display}</span>
      </div>
      {hint && <span className="mt-0.5 block text-xs text-muted">{hint}</span>}
      <input
        type="range"
        className="forja-range mt-1"
        min={0}
        max={steps}
        value={Math.round(t * steps)}
        onChange={(e) => onT(Number(e.target.value) / steps)}
        style={{ "--pct": `${t * 100}%` } as CSSProperties}
        aria-label={label}
        aria-valuetext={display}
      />
    </label>
  );
}

export interface Referencia {
  total: number;
  etiqueta: string; // ej. "de la matrícula de educación superior de NL"
  estimado: boolean;
}

export function Simulador({ modelos, referencia }: { modelos: ModeloOpcion[]; referencia?: Referencia }) {
  const [input, setInput] = useState<SimulacionInput>(() => ({
    ...SIMULACION_DEFAULTS,
    modelo_id: SIMULACION_DEFAULTS.modelo_id ?? modelos[0]?.id,
  }));

  const r = useMemo(() => {
    try {
      return simularFondo(input);
    } catch {
      return simularFondo({ ...input, modelo_id: undefined });
    }
  }, [input]);

  const set = (patch: Partial<SimulacionInput>) => setInput((p) => ({ ...p, ...patch }));
  const tokensTot = largo(r.tokens_totales);
  // Con referencia: 100 lingotes = 100% de la población de referencia. Sin ella: escala libre.
  const lingotes = 100;
  const pct = referencia ? (r.alumnos_beneficiados / referencia.total) * 100 : 100;
  const llenos = Math.min(lingotes, referencia ? pct : lingotes);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* Controles */}
      <div className="panel sobre-blanco space-y-7 p-6 sm:p-8">
        <Slider
          label="Presupuesto del fondo"
          hint="Aportación pública + privada, en pesos"
          display={`$${largoTexto(input.presupuesto_mxn)}`}
          t={PRESUPUESTO.toT(input.presupuesto_mxn)}
          onT={(t) => set({ presupuesto_mxn: roundNice(PRESUPUESTO.toValue(t)) })}
        />
        <Slider
          label="Duración del programa"
          hint="Meses de créditos por cohorte"
          display={`${input.meses} ${input.meses === 1 ? "mes" : "meses"}`}
          t={(input.meses - 1) / 23}
          steps={23}
          onT={(t) => set({ meses: Math.round(1 + t * 23) })}
        />
        <Slider
          label="Tokens por alumno al mes"
          hint="Uso intensivo de un builder ronda varios millones"
          display={largoTexto(input.tokens_por_alumno_mes)}
          t={TOKENS.toT(input.tokens_por_alumno_mes)}
          onT={(t) => set({ tokens_por_alumno_mes: roundNice(TOKENS.toValue(t)) })}
        />
        {modelos.length > 1 && (
          <fieldset>
            <legend className="text-sm font-semibold text-fg">Modelo de referencia</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {modelos.map((m) => {
                const active = (input.modelo_id ?? r.modelo.id) === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => set({ modelo_id: m.id })}
                    aria-pressed={active}
                    className={`border px-3.5 py-1.5 text-sm transition ${
                      active
                        ? "border-acento bg-acento/15 text-acento"
                        : "border-line text-muted hover:border-muted hover:text-fg"
                    }`}
                  >
                    {m.nombre}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}
      </div>

      {/* Resultados */}
      <div className="panel-hot sobre-blanco flex flex-col p-6 sm:p-8">
        <p className="eyebrow">Jóvenes con acceso a IA de frontera</p>
        <div className="mt-2 flex flex-wrap items-end gap-x-4">
          <AnimatedNumber
            value={r.alumnos_beneficiados}
            format={entero}
            className="num text-fundido text-6xl font-semibold leading-none sm:text-8xl"
          />
          <span className="pb-2 text-muted">alumnos</span>
        </div>

        {/* Lingotes: cada uno representa un grupo de alumnos */}
        {referencia && (
          <>
            <div className="mt-6 grid grid-cols-20 gap-1" aria-hidden>
              {Array.from({ length: lingotes }, (_, i) => {
                const fill = Math.max(0, Math.min(1, llenos - i));
                return (
                  <span key={i} className="relative h-3 overflow-hidden bg-line">
                    <span
                      className="absolute inset-y-0 left-0 bg-turquesa transition-[width] duration-500"
                      style={{ width: `${fill * 100}%`, transitionDelay: `${i * 4}ms` }}
                    />
                  </span>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-muted">
              <span className="num font-semibold text-fg">{decimal(Math.round(pct * 10) / 10)}%</span> {referencia.etiqueta}
              {referencia.estimado && <span className="num ml-2 text-[10px] uppercase tracking-widest">estimado</span>}
            </p>
          </>
        )}

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6 sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted">Costo por alumno / mes</dt>
            <dd className="mt-1">
              <AnimatedNumber value={r.costo_por_alumno_mes_mxn} format={mxn2} className="num text-2xl text-fg sm:text-3xl" />
              <span className="ml-1 text-sm text-muted">MXN</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted">Tokens forjados</dt>
            <dd className="mt-1">
              <AnimatedNumber
                value={r.tokens_totales / (tokensTot.unidad === "billones" ? 1e12 : tokensTot.unidad === "mil millones" ? 1e9 : tokensTot.unidad === "millones" ? 1e6 : tokensTot.unidad === "mil" ? 1e3 : 1)}
                format={decimal}
                className="num text-2xl text-fg sm:text-3xl"
              />
              <span className="ml-1 text-sm text-muted">{tokensTot.unidad}</span>
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-xs uppercase tracking-wider text-muted">Modelo · tipo de cambio</dt>
            <dd className="mt-1 text-fg">
              <span className="block truncate">{r.modelo.nombre}</span>
              <span className="num text-sm text-muted">
                US${decimal(r.modelo.usd_por_millon_tokens)}/M tok · {mxn2(r.tipo_cambio_mxn_usd)}
              </span>
            </dd>
          </div>
        </dl>

        {r.supuestos.length > 0 && (
          <details className="mt-6 text-sm text-muted">
            <summary className="cursor-pointer select-none text-muted hover:text-fg">Supuestos del cálculo</summary>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {r.supuestos.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </details>
        )}

        {r.fuentes && r.fuentes.length > 0 && (
          <p className="mt-4 text-xs text-muted">
            Fuentes:{" "}
            {r.fuentes.map((f, i) => (
              <span key={f.nombre}>
                {i > 0 && " · "}
                {f.url ? (
                  <a href={f.url} target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-4 hover:text-acento">
                    {f.nombre}
                  </a>
                ) : (
                  f.nombre
                )}
              </span>
            ))}
          </p>
        )}

        <p className="mt-auto pt-6 text-xs text-muted">
          Este cálculo corre en tu navegador con la misma función que expone la tool{" "}
          <code className="num text-acento">forja_simular_fondo</code> por MCP. Presupuesto simulado: {mxn(input.presupuesto_mxn)} MXN.
        </p>
      </div>
    </div>
  );
}
