import { z } from "zod";
import {
  datasets,
  getDataset,
  type CursoRegistro,
  type Dataset,
  type EducacionIaRegistro,
  type MatriculaRegistro,
  type PoblacionJovenRegistro,
  type ProgramaEmprendimientoRegistro,
  type ProgramaLaboratorioRegistro,
} from "@forja/data";
import { brand } from "./brand-info";
import { MEZCLA_FORJA, SIMULACION_DEFAULTS, precioMezclado, preciosModelos, simularFondo, tipoCambioActual } from "./simulador";
import type { ForjaTool } from "./types";

const defineTool = <S extends z.ZodRawShape>(tool: ForjaTool<S>) => tool as unknown as ForjaTool;

const PENDIENTE = "Pendiente de research: este dataset aún no tiene registros.";
const AVISO_VERIFICADO =
  "Si verificado es false (en el dataset o en un registro), preséntalo como estimado o déjalo fuera del pitch.";

/** Minúsculas y sin acentos, para búsquedas tolerantes. */
const norm = (s: unknown) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const coincide = (registro: unknown, texto?: string) => !texto || norm(JSON.stringify(registro)).includes(norm(texto));

const redondear = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

const metadatos = (d: Dataset) => ({
  id: d.id,
  titulo: d.titulo,
  descripcion: d.descripcion,
  verificado: d.verificado,
  actualizado: d.actualizado,
  total_registros: d.registros.length,
  estado: d.registros.length === 0 ? "pendiente de research" : "con datos",
  fuentes: d.fuentes,
});

const idsDatasets = datasets.map((d) => d.id) as [string, ...string[]];

// Esquemas reutilizables del simulador.
const entradaSimulador = {
  presupuesto_mxn: z
    .number()
    .nonnegative()
    .optional()
    .describe(`Presupuesto total del fondo en pesos mexicanos (MXN). Por defecto ${SIMULACION_DEFAULTS.presupuesto_mxn.toLocaleString("es-MX")}.`),
  meses: z
    .number()
    .int()
    .positive()
    .optional()
    .describe(`Duración del programa en meses. Por defecto ${SIMULACION_DEFAULTS.meses}.`),
  tokens_por_alumno_mes: z
    .number()
    .positive()
    .optional()
    .describe(
      `Tokens que consume cada alumno al mes (entrada + salida). Por defecto ${SIMULACION_DEFAULTS.tokens_por_alumno_mes.toLocaleString("es-MX")} (20 millones).`,
    ),
  modelo_id: z
    .string()
    .optional()
    .describe(
      `Id del modelo según el dataset precios-modelos-ia (ej. "grok-4.7", "claude-sonnet-5-5") o "${MEZCLA_FORJA.id}" (por defecto: ${MEZCLA_FORJA.nombre}). Usa forja_comparar_modelos para ver los ids.`,
    ),
  proporcion_input: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe("Fracción de tokens de entrada (prompt) entre 0 y 1. Por defecto 0.8 (80% entrada, 20% salida)."),
};

export const catalogo: ForjaTool[] = [
  defineTool({
    name: "forja_info",
    title: "Qué es Forja NL",
    description:
      "Describe la propuesta Forja NL: un fondo de tokens de IA de Nuevo León para que jóvenes emprendedores y estudiantes construyan startups con herramientas de IA, más una ruta de cursos sobre el buen uso de la IA. Úsala primero cuando alguien pregunte qué es Forja NL, cómo funciona o qué datos y herramientas ofrece este servidor.",
    inputSchema: {},
    handler: () => ({
      ...brand,
      narrativa: "En el siglo XX Nuevo León forjó acero; en el XXI forja inteligencia. El acero del siglo XXI son los tokens.",
      como_funciona: [
        "El estado financia un fondo de créditos de tokens para modelos de IA (Grok, Claude, GPT, Gemini y modelos abiertos).",
        "Los jóvenes reciben créditos mensuales tras completar el curso de IA responsable.",
        "Una ruta de cursos los lleva de la idea al prototipo y al lanzamiento de su startup.",
      ],
      datasets: datasets.map((d) => ({ id: d.id, titulo: d.titulo, verificado: d.verificado, registros: d.registros.length })),
      simulacion_por_defecto: simularFondo(),
      aviso: AVISO_VERIFICADO,
    }),
  }),

  defineTool({
    name: "forja_listar_datasets",
    title: "Listar datasets de Forja NL",
    description:
      "Lista todos los datasets disponibles (población joven, matrícula universitaria, precios de modelos de IA, ecosistema de startups, programas de apoyo, educación en IA, programas de laboratorios de IA, cursos y tipo de cambio) con su descripción, número de registros, fuentes y si están verificados. Úsala para saber qué datos existen antes de llamar a forja_consultar_dataset.",
    inputSchema: {},
    handler: () => ({ datasets: datasets.map(metadatos), aviso: AVISO_VERIFICADO }),
  }),

  defineTool({
    name: "forja_consultar_dataset",
    title: "Consultar un dataset",
    description:
      "Devuelve los registros de un dataset por id, con sus fuentes y estado de verificación. Permite filtrar por texto libre (sin distinguir mayúsculas ni acentos, busca en todos los campos del registro) y limitar el número de resultados. Úsala cuando necesites cifras concretas con su fuente; cita siempre las fuentes devueltas.",
    inputSchema: {
      id: z.enum(idsDatasets).describe("Id del dataset. Consulta forja_listar_datasets para ver la lista."),
      buscar: z.string().optional().describe('Texto a buscar en cualquier campo del registro, ej. "UANL" o "grok".'),
      limite: z.number().int().positive().max(200).optional().describe("Máximo de registros a devolver. Por defecto 50."),
    },
    handler: ({ id, buscar, limite }) => {
      const d = getDataset(id);
      if (!d) throw new Error(`Dataset "${id}" no encontrado.`);
      const filtrados = d.registros.filter((r) => coincide(r, buscar));
      const registros = filtrados.slice(0, limite ?? 50);
      return {
        ...metadatos(d),
        coincidencias: filtrados.length,
        devueltos: registros.length,
        registros,
        ...(d.registros.length === 0 ? { nota: PENDIENTE } : {}),
        aviso: AVISO_VERIFICADO,
      };
    },
  }),

  defineTool({
    name: "forja_simular_fondo",
    title: "Simular el fondo de tokens",
    description:
      "Calcula a cuántos alumnos puede financiar el fondo de tokens con un presupuesto en MXN durante N meses, el costo por alumno al mes (MXN y USD) y los tokens totales. Usa precios oficiales de API por millón de tokens (dataset precios-modelos-ia) y el tipo de cambio FIX de Banxico (dataset tipo-cambio). Todos los parámetros son opcionales; sin parámetros usa el escenario base: 50 millones de MXN, 6 meses, 20 millones de tokens por alumno al mes, mezcla de modelos Grok. Devuelve siempre los supuestos y las fuentes; explícalos al usuario.",
    inputSchema: entradaSimulador,
    handler: (input) => simularFondo(input),
  }),

  defineTool({
    name: "forja_comparar_modelos",
    title: "Comparar costo entre modelos de IA",
    description:
      "Compara cuánto cuesta una cantidad de tokens en cada modelo del dataset precios-modelos-ia (xAI Grok, Anthropic Claude, OpenAI, Google Gemini y modelos abiertos), en USD y MXN, ordenado del más barato al más caro. También dice cuántos millones de tokens alcanzan con 1,000 MXN. Úsala para elegir modelo, justificar la mezcla del fondo o responder '¿cuánto cuesta X tokens en Y?'. Precios de lista en USD por millón de tokens, sin descuentos.",
    inputSchema: {
      tokens: z.number().positive().optional().describe("Número de tokens a costear (entrada + salida). Por defecto 1,000,000."),
      proporcion_input: z
        .number()
        .min(0)
        .max(1)
        .optional()
        .describe("Fracción de tokens de entrada entre 0 y 1. Por defecto 0.8."),
      proveedor: z.string().optional().describe('Filtra por proveedor, ej. "xAI", "Anthropic", "OpenAI", "Google".'),
      categoria: z.enum(["frontera", "economico", "abierto"]).optional().describe("Filtra por categoría del modelo."),
    },
    handler: ({ tokens = 1_000_000, proporcion_input = 0.8, proveedor, categoria }) => {
      const tc = tipoCambioActual();
      const ds = getDataset("precios-modelos-ia");
      const modelos = preciosModelos()
        .filter((m) => !proveedor || norm(m.proveedor).includes(norm(proveedor)))
        .filter((m) => !categoria || m.categoria === categoria)
        .map((m) => {
          const usdMillon = precioMezclado(m, proporcion_input);
          const usd = (tokens / 1e6) * usdMillon;
          return {
            id: m.id,
            proveedor: m.proveedor,
            modelo: m.modelo,
            categoria: m.categoria,
            usd_input_por_millon: m.usd_input_por_millon,
            usd_output_por_millon: m.usd_output_por_millon,
            usd_por_millon_mezclado: redondear(usdMillon, 4),
            costo_usd: redondear(usd, 4),
            costo_mxn: redondear(usd * tc.valor),
            millones_de_tokens_por_1000_mxn: redondear(1000 / tc.valor / usdMillon, 1),
            ...(m.nota ? { nota: m.nota } : {}),
          };
        })
        .sort((a, b) => a.costo_usd - b.costo_usd);
      return {
        tokens,
        proporcion_input,
        tipo_cambio_mxn_usd: tc.valor,
        tipo_cambio_fecha: tc.fecha,
        modelos,
        ...(modelos.length === 0
          ? { nota: preciosModelos().length === 0 ? PENDIENTE : "Ningún modelo coincide con el filtro." }
          : {}),
        fuentes: [...(ds?.fuentes ?? []), ...tc.fuentes],
        verificado: (ds?.verificado ?? false) && tc.verificado,
      };
    },
  }),

  defineTool({
    name: "forja_listar_cursos",
    title: "Listar cursos de Forja NL",
    description:
      "Devuelve la ruta de formación propuesta por Forja NL (módulos, horas, modalidad, temas y para quién es cada uno). El módulo de IA responsable es requisito para recibir créditos de tokens. Úsala cuando pregunten por los cursos, la parte educativa del programa o cómo se garantiza el buen uso de la IA.",
    inputSchema: {
      nivel: z
        .enum(["fundamentos", "construccion", "lanzamiento"])
        .optional()
        .describe("Filtra por etapa: fundamentos, construccion o lanzamiento."),
    },
    handler: ({ nivel }) => {
      const d = getDataset<CursoRegistro>("cursos-forja");
      const cursos = (d?.registros ?? []).filter((c) => !nivel || c.nivel === nivel).sort((a, b) => a.orden - b.orden);
      return {
        cursos,
        total_horas: cursos.reduce((s, c) => s + c.horas, 0),
        ...(cursos.length === 0 ? { nota: PENDIENTE } : {}),
        fuentes: d?.fuentes ?? [],
      };
    },
  }),

  defineTool({
    name: "forja_impacto_municipio",
    title: "Impacto del fondo por municipio",
    description:
      "Estima cuántos jóvenes (15 a 29 años) podría cubrir el fondo en cada municipio de Nuevo León con un presupuesto dado. Corre el simulador y reparte a los beneficiarios en proporción a la población joven de cada municipio (dataset poblacion-joven-nl). También da el porcentaje de jóvenes y de universitarios del estado que se alcanza. Si el desglose por municipio aún no existe, devuelve el total estatal con una nota. Úsala para preguntas como '¿a cuántos jóvenes de Apodaca llegaría?' o '¿qué porcentaje de jóvenes de NL cubre el fondo?'.",
    inputSchema: {
      ...entradaSimulador,
      municipio: z.string().optional().describe('Nombre del municipio a consultar, ej. "Monterrey". Sin acentos también funciona.'),
    },
    handler: ({ municipio, ...sim }) => {
      const simulacion = simularFondo(sim);
      const alumnos = simulacion.alumnos_beneficiados;
      const pob = getDataset<PoblacionJovenRegistro>("poblacion-joven-nl");
      const mat = getDataset<MatriculaRegistro>("matricula-educacion-superior-nl");
      const estado = pob?.registros.find((r) => r.nivel === "estado");
      const municipios = (pob?.registros ?? []).filter((r) => r.nivel === "municipio");
      const totalJovenesMunicipios = municipios.reduce((s, r) => s + r.poblacion_15_29, 0);
      const matriculaTotal = mat?.registros.find((r) => r.sostenimiento === "total");

      const porMunicipio = municipios
        .filter((r) => !municipio || norm(r.municipio).includes(norm(municipio)))
        .map((r) => {
          const cubiertos = Math.floor((alumnos * r.poblacion_15_29) / totalJovenesMunicipios);
          return {
            municipio: r.municipio,
            zona_metropolitana: r.zona_metropolitana,
            poblacion_15_29: r.poblacion_15_29,
            jovenes_cubiertos: cubiertos,
            porcentaje_jovenes_cubiertos: redondear((cubiertos / r.poblacion_15_29) * 100),
          };
        })
        .sort((a, b) => b.poblacion_15_29 - a.poblacion_15_29);

      const notas: string[] = [];
      if (municipios.length === 0) notas.push("Pendiente de research: aún no hay desglose por municipio; se muestra solo el total estatal.");
      else if (municipio && porMunicipio.length === 0) notas.push(`No se encontró el municipio "${municipio}".`);
      if (!matriculaTotal) notas.push("Pendiente de research: falta la matrícula total de educación superior.");
      else if (matriculaTotal.verificado === false) notas.push("La matrícula de educación superior aún no está verificada; preséntala como estimado.");

      return {
        beneficiarios_totales: alumnos,
        estado: estado
          ? {
              poblacion_15_29: estado.poblacion_15_29,
              anio: estado.anio,
              porcentaje_jovenes_cubiertos: redondear((alumnos / estado.poblacion_15_29) * 100),
            }
          : null,
        educacion_superior: matriculaTotal
          ? {
              matricula: matriculaTotal.matricula,
              ciclo: matriculaTotal.ciclo,
              porcentaje_universitarios_cubiertos: redondear((alumnos / matriculaTotal.matricula) * 100),
              verificado: matriculaTotal.verificado ?? mat?.verificado ?? false,
            }
          : null,
        municipios: porMunicipio,
        simulacion: {
          costo_por_alumno_mes_mxn: simulacion.costo_por_alumno_mes_mxn,
          modelo: simulacion.modelo,
          supuestos: simulacion.supuestos,
        },
        supuesto_reparto: "Los beneficiarios se reparten en proporción a la población de 15 a 29 años de cada municipio.",
        notas,
        fuentes: [...(pob?.fuentes ?? []), ...(mat?.fuentes ?? []), ...(simulacion.fuentes ?? [])],
      };
    },
  }),

  defineTool({
    name: "forja_buscar_programas",
    title: "Buscar programas de apoyo y educación en IA",
    description:
      "Busca en tres catálogos a la vez: (1) programas de apoyo a jóvenes emprendedores en Nuevo León y México (financiamiento, incubación, becas), (2) oferta de educación en IA en Nuevo León (carreras, posgrados, cursos) y (3) programas de laboratorios de IA (xAI, Anthropic, OpenAI, Google) que otorgan créditos de API, cómputo o dinero. Filtra por catálogo, laboratorio, tipo y texto libre. Úsala para mostrar qué existe hoy, qué hueco cubre Forja NL y con quién se podría aliar. Cada resultado trae su url y si está verificado.",
    inputSchema: {
      catalogo: z
        .enum(["todos", "emprendimiento", "educacion-ia", "laboratorios"])
        .optional()
        .describe("Catálogo donde buscar. Por defecto 'todos'."),
      texto: z.string().optional().describe('Texto libre a buscar en cualquier campo, ej. "créditos", "UANL", "mujeres".'),
      laboratorio: z.string().optional().describe('Solo catálogo laboratorios: "xAI", "Anthropic", "OpenAI" o "Google".'),
      tipo: z
        .string()
        .optional()
        .describe('Tipo de apoyo (emprendimiento, ej. "financiamiento") o nivel educativo (educacion-ia, ej. "maestria").'),
      solo_verificados: z.boolean().optional().describe("Si es true, devuelve solo registros verificados en su fuente."),
      limite: z.number().int().positive().max(100).optional().describe("Máximo de resultados por catálogo. Por defecto 30."),
    },
    handler: ({ catalogo = "todos", texto, laboratorio, tipo, solo_verificados, limite = 30 }) => {
      const fuentes = {
        emprendimiento: "programas-emprendimiento-nl-mx",
        "educacion-ia": "educacion-ia-nl",
        laboratorios: "programas-laboratorios-ia",
      } as const;
      const claves = catalogo === "todos" ? (Object.keys(fuentes) as (keyof typeof fuentes)[]) : [catalogo];
      const resultados = claves.map((clave) => {
        const d = getDataset<
          (ProgramaEmprendimientoRegistro | EducacionIaRegistro | ProgramaLaboratorioRegistro) & Record<string, unknown>
        >(fuentes[clave]);
        const registros = (d?.registros ?? [])
          .filter((r) => coincide(r, texto))
          .filter((r) => !laboratorio || clave !== "laboratorios" || norm(r.laboratorio).includes(norm(laboratorio)))
          .filter((r) => !laboratorio || clave === "laboratorios")
          .filter((r) => !tipo || norm(r.tipo_apoyo ?? r.nivel ?? "").includes(norm(tipo)))
          .filter((r) => !solo_verificados || r.verificado === true || (r.verificado === undefined && d?.verificado));
        return {
          catalogo: clave,
          dataset: fuentes[clave],
          verificado: d?.verificado ?? false,
          total: registros.length,
          registros: registros.slice(0, limite),
          ...((d?.registros.length ?? 0) === 0 ? { nota: PENDIENTE } : {}),
          fuentes: d?.fuentes ?? [],
        };
      });
      return { resultados, aviso: AVISO_VERIFICADO };
    },
  }),
];
