// Simulador del fondo de tokens. Lo usan la tool forja_simular_fondo y la UI de la web.
import { getDataset, type Fuente, type PrecioModeloRegistro, type TipoCambioRegistro } from "@forja/data";

export interface SimulacionInput {
  presupuesto_mxn: number;
  meses: number;
  tokens_por_alumno_mes: number;
  /** id de API de precios-modelos-ia, o "mezcla-forja" (por defecto). */
  modelo_id?: string;
  /** Fracción de tokens que son de entrada (prompt). 0.8 = 80% entrada, 20% salida. */
  proporcion_input?: number;
}

export interface SimulacionResultado {
  alumnos_beneficiados: number;
  costo_por_alumno_mes_mxn: number;
  tokens_totales: number;
  modelo: { id: string; nombre: string; usd_por_millon_tokens: number };
  tipo_cambio_mxn_usd: number;
  supuestos: string[];
  // Campos adicionales (opcionales para no romper consumidores).
  costo_por_alumno_mes_usd?: number;
  costo_total_mxn?: number;
  presupuesto_sobrante_mxn?: number;
  entrada?: Required<SimulacionInput>;
  fuentes?: Fuente[];
  /** true solo si precio y tipo de cambio vienen de datasets verificados. */
  verificado?: boolean;
}

export const MEZCLA_FORJA = {
  id: "mezcla-forja",
  nombre: "Mezcla Forja (70% Grok 4.3 + 30% Grok 4.7)",
  componentes: [
    { id: "grok-4.3", peso: 0.7 },
    { id: "grok-4.7", peso: 0.3 },
  ],
} as const;

/** Valores de respaldo si un dataset está vacío. No son dato duro. */
const RESPALDO = { tipo_cambio: 18.5, usd_por_millon: 2 };

export const SIMULACION_DEFAULTS: Required<SimulacionInput> = {
  presupuesto_mxn: 50_000_000,
  meses: 6,
  tokens_por_alumno_mes: 20_000_000,
  modelo_id: MEZCLA_FORJA.id,
  proporcion_input: 0.8,
};

const redondear = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

export const precioMezclado = (m: PrecioModeloRegistro, proporcionInput: number) =>
  proporcionInput * m.usd_input_por_millon + (1 - proporcionInput) * m.usd_output_por_millon;

/** Tipo de cambio más reciente del dataset tipo-cambio (o respaldo). */
export function tipoCambioActual(): { valor: number; fecha?: string; fuentes: Fuente[]; verificado: boolean } {
  const ds = getDataset<TipoCambioRegistro>("tipo-cambio");
  const ultimo = [...(ds?.registros ?? [])].sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
  if (!ds || !ultimo) return { valor: RESPALDO.tipo_cambio, fuentes: [], verificado: false };
  return { valor: ultimo.mxn_por_usd, fecha: ultimo.fecha, fuentes: ds.fuentes, verificado: ds.verificado };
}

export function preciosModelos(): PrecioModeloRegistro[] {
  return getDataset<PrecioModeloRegistro>("precios-modelos-ia")?.registros ?? [];
}

function resolverModelo(modeloId: string, proporcionInput: number) {
  const ds = getDataset<PrecioModeloRegistro>("precios-modelos-ia");
  const precios = ds?.registros ?? [];
  const fuentes = ds?.fuentes ?? [];
  const verificado = ds?.verificado ?? false;

  if (modeloId === MEZCLA_FORJA.id) {
    const partes = MEZCLA_FORJA.componentes.map((c) => ({ ...c, m: precios.find((p) => p.id === c.id) }));
    if (partes.every((p) => p.m)) {
      const usd = partes.reduce((s, p) => s + p.peso * precioMezclado(p.m!, proporcionInput), 0);
      return { id: MEZCLA_FORJA.id, nombre: MEZCLA_FORJA.nombre, usd, fuentes, verificado };
    }
    return {
      id: MEZCLA_FORJA.id,
      nombre: `${MEZCLA_FORJA.nombre} (precio provisional)`,
      usd: RESPALDO.usd_por_millon,
      fuentes: [],
      verificado: false,
      nota: "Pendiente de research: faltan precios de Grok en precios-modelos-ia; se usa un precio provisional.",
    };
  }

  const m = precios.find((p) => p.id === modeloId);
  if (!m) {
    const validos = [MEZCLA_FORJA.id, ...precios.map((p) => p.id)].join(", ");
    throw new Error(`Modelo "${modeloId}" no encontrado. Ids válidos: ${validos}`);
  }
  return { id: m.id, nombre: `${m.modelo} (${m.proveedor})`, usd: precioMezclado(m, proporcionInput), fuentes, verificado };
}

export function simularFondo(input: Partial<SimulacionInput> = {}): SimulacionResultado {
  const limpio = Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined && v !== null));
  const p: Required<SimulacionInput> = { ...SIMULACION_DEFAULTS, ...limpio };
  if (p.presupuesto_mxn < 0 || p.meses <= 0 || p.tokens_por_alumno_mes <= 0) {
    throw new Error("presupuesto_mxn debe ser >= 0; meses y tokens_por_alumno_mes deben ser > 0.");
  }
  if (p.proporcion_input < 0 || p.proporcion_input > 1) throw new Error("proporcion_input debe estar entre 0 y 1.");

  const tc = tipoCambioActual();
  const modelo = resolverModelo(p.modelo_id, p.proporcion_input);

  const costo_usd = (p.tokens_por_alumno_mes / 1e6) * modelo.usd;
  const costo_mxn = costo_usd * tc.valor;
  const alumnos = Math.floor(p.presupuesto_mxn / (costo_mxn * p.meses));
  const costo_total_mxn = alumnos * costo_mxn * p.meses;

  const supuestos = [
    `Cada alumno usa ${(p.tokens_por_alumno_mes / 1e6).toLocaleString("es-MX")} millones de tokens al mes (supuesto Forja: un equipo que construye su producto a diario con asistentes de programación y APIs).`,
    `${Math.round(p.proporcion_input * 100)}% de los tokens son de entrada y ${Math.round((1 - p.proporcion_input) * 100)}% de salida.`,
    `Precio mezclado: USD ${redondear(modelo.usd, 3)} por millón de tokens con ${modelo.nombre}, a precio de lista sin descuentos por volumen, batch ni caché.`,
    tc.fecha
      ? `Tipo de cambio FIX de Banxico del ${tc.fecha}: ${tc.valor} MXN por USD.`
      : `Tipo de cambio provisional de ${tc.valor} MXN por USD (pendiente de research).`,
    "El 100% del presupuesto se va a tokens; no incluye cursos, personal ni operación.",
  ];
  if ("nota" in modelo && modelo.nota) supuestos.push(modelo.nota);

  return {
    alumnos_beneficiados: alumnos,
    costo_por_alumno_mes_mxn: redondear(costo_mxn),
    tokens_totales: alumnos * p.tokens_por_alumno_mes * p.meses,
    modelo: { id: modelo.id, nombre: modelo.nombre, usd_por_millon_tokens: redondear(modelo.usd, 4) },
    tipo_cambio_mxn_usd: tc.valor,
    supuestos,
    costo_por_alumno_mes_usd: redondear(costo_usd),
    costo_total_mxn: redondear(costo_total_mxn),
    presupuesto_sobrante_mxn: redondear(p.presupuesto_mxn - costo_total_mxn),
    entrada: p,
    fuentes: [...modelo.fuentes, ...tc.fuentes],
    verificado: modelo.verificado && tc.verificado,
  };
}
