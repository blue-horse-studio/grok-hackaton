import type { Dataset } from "./types";
import poblacionJovenNl from "../datasets/poblacion-joven-nl.json";
import matriculaEducacionSuperiorNl from "../datasets/matricula-educacion-superior-nl.json";
import preciosModelosIa from "../datasets/precios-modelos-ia.json";
import ecosistemaStartupsNl from "../datasets/ecosistema-startups-nl.json";
import programasEmprendimientoNlMx from "../datasets/programas-emprendimiento-nl-mx.json";
import educacionIaNl from "../datasets/educacion-ia-nl.json";
import programasLaboratoriosIa from "../datasets/programas-laboratorios-ia.json";
import cursosForja from "../datasets/cursos-forja.json";
import tipoCambio from "../datasets/tipo-cambio.json";

export * from "./types";
export * from "./registros";

// Registro de datasets. Para agregar uno: crea datasets/<id>.json, impórtalo aquí y súmalo al arreglo.
export const datasets: Dataset[] = [
  poblacionJovenNl,
  matriculaEducacionSuperiorNl,
  preciosModelosIa,
  ecosistemaStartupsNl,
  programasEmprendimientoNlMx,
  educacionIaNl,
  programasLaboratoriosIa,
  cursosForja,
  tipoCambio,
] as unknown as Dataset[];

export const getDataset = <T = Record<string, unknown>>(id: string) =>
  datasets.find((d) => d.id === id) as Dataset<T> | undefined;
