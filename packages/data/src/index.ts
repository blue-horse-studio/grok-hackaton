import type { Dataset } from "./types";

export * from "./types";

// Registro de datasets. Para agregar uno: crea datasets/<id>.json, impórtalo aquí y súmalo al arreglo.
export const datasets: Dataset[] = [];

export const getDataset = <T = Record<string, unknown>>(id: string) =>
  datasets.find((d) => d.id === id) as Dataset<T> | undefined;
