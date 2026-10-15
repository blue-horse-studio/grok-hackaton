// Contrato de datos compartido por MCP, WebMCP, web y presentación.

export interface Fuente {
  nombre: string;
  url?: string;
  fecha?: string; // ISO o año de publicación
}

export interface Dataset<T = Record<string, unknown>> {
  id: string; // kebab-case, igual al nombre del archivo en datasets/
  titulo: string;
  descripcion: string;
  fuentes: Fuente[];
  /** false = estimado o placeholder; no presentarlo como dato duro en el pitch */
  verificado: boolean;
  actualizado: string; // ISO date
  registros: T[];
}
