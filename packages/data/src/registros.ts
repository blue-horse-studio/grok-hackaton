// Forma de los registros de cada dataset. Los JSON en datasets/ deben respetar estos campos.

export interface PoblacionJovenRegistro {
  municipio: string; // "Nuevo León" para el total estatal
  clave_inegi?: string;
  nivel: "estado" | "municipio";
  zona_metropolitana?: boolean;
  poblacion_total: number;
  poblacion_15_29: number;
  anio: number;
  nota?: string;
  verificado?: boolean;
}

export interface MatriculaRegistro {
  institucion: string;
  siglas?: string;
  sostenimiento: "publica" | "privada" | "total";
  nivel: string; // licenciatura, posgrado, TSU, "superior (total)"
  matricula: number;
  ciclo: string; // "2023-2024"
  nota?: string;
  verificado?: boolean;
}

export interface PrecioModeloRegistro {
  id: string; // id de API
  proveedor: string;
  modelo: string;
  usd_input_por_millon: number;
  usd_output_por_millon: number;
  categoria: "frontera" | "economico" | "abierto";
  url?: string;
  fecha?: string;
  nota?: string;
  verificado?: boolean;
}

export interface EcosistemaRegistro {
  indicador: string;
  valor: number | string;
  unidad?: string;
  anio?: number;
  url?: string;
  nota?: string;
  /** false = cifra vista solo en snippet/prensa; confirmar antes del pitch */
  verificado?: boolean;
}

export interface ProgramaEmprendimientoRegistro {
  nombre: string;
  operador: string;
  ambito: "Nuevo León" | "México";
  tipo_apoyo: string; // financiamiento | incubación | aceleración | beca | capacitación
  monto?: string;
  monto_mxn?: number;
  poblacion_objetivo: string;
  url?: string;
  nota?: string;
  /** false = cifra vista solo en snippet/prensa; confirmar antes del pitch */
  verificado?: boolean;
}

export interface EducacionIaRegistro {
  institucion: string;
  programa: string;
  nivel: string; // licenciatura | maestria | diplomado | curso | comunidad
  modalidad: string; // presencial | en línea | híbrida
  url?: string;
  nota?: string;
  /** false = cifra vista solo en snippet/prensa; confirmar antes del pitch */
  verificado?: boolean;
}

export interface ProgramaLaboratorioRegistro {
  laboratorio: string; // xAI, Anthropic, OpenAI, Google
  programa: string;
  que_otorga: string;
  a_quien: string;
  monto?: string;
  monto_usd?: number;
  url?: string;
  nota?: string;
  /** false = cifra vista solo en snippet/prensa; confirmar antes del pitch */
  verificado?: boolean;
}

export interface CursoRegistro {
  id: string;
  orden: number;
  titulo: string;
  nivel: "fundamentos" | "construccion" | "lanzamiento";
  horas: number;
  modalidad: string;
  descripcion: string;
  temas: string[];
  para_quien: string;
  requisito_para_creditos: boolean;
}

export interface TipoCambioRegistro {
  fecha: string; // ISO
  mxn_por_usd: number;
  tipo: string; // "FIX Banxico"
}
