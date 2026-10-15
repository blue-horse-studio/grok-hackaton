// Simulador del fondo de tokens. Lo usan la tool forja_simular_fondo y la UI de la web.

export interface SimulacionInput {
  presupuesto_mxn: number;
  meses: number;
  tokens_por_alumno_mes: number;
  modelo_id?: string;
}

export interface SimulacionResultado {
  alumnos_beneficiados: number;
  costo_por_alumno_mes_mxn: number;
  tokens_totales: number;
  modelo: { id: string; nombre: string; usd_por_millon_tokens: number };
  tipo_cambio_mxn_usd: number;
  supuestos: string[];
}

// STUB: valores provisionales; el agente de datos los reemplaza con datasets con fuente.
export const SIMULACION_DEFAULTS: SimulacionInput = {
  presupuesto_mxn: 50_000_000,
  meses: 6,
  tokens_por_alumno_mes: 5_000_000,
};

export function simularFondo(input: Partial<SimulacionInput> = {}): SimulacionResultado {
  const p = { ...SIMULACION_DEFAULTS, ...input };
  const tipo_cambio_mxn_usd = 18.5;
  const modelo = { id: "mezcla", nombre: "Mezcla de modelos", usd_por_millon_tokens: 3 };
  const costo_por_alumno_mes_mxn = (p.tokens_por_alumno_mes / 1e6) * modelo.usd_por_millon_tokens * tipo_cambio_mxn_usd;
  const alumnos_beneficiados = Math.floor(p.presupuesto_mxn / (costo_por_alumno_mes_mxn * p.meses));
  return {
    alumnos_beneficiados,
    costo_por_alumno_mes_mxn: Math.round(costo_por_alumno_mes_mxn * 100) / 100,
    tokens_totales: alumnos_beneficiados * p.tokens_por_alumno_mes * p.meses,
    modelo,
    tipo_cambio_mxn_usd,
    supuestos: ["Valores provisionales (stub)"],
  };
}
