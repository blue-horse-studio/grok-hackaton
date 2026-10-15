import type { Fuente } from "./types";

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
  /** Al 14/10/2026: abierto | permanente | activo | cerrado | realizado | por confirmar */
  estado?: string;
  nivel_gobierno?: "estatal" | "municipal" | "federal" | "universidad" | "privado";
  ambito: "Nuevo León" | "México";
  tipo_apoyo: string; // financiamiento | crédito | incubación | aceleración | beca | capacitación | premio ...
  monto?: string;
  monto_mxn?: number; // tope por persona en MXN, cuando aplica
  cifra?: string; // cifra reportada (meta, resultado o acumulado), tal como la da la fuente
  poblacion_objetivo: string;
  convocatoria?: string; // fechas de la convocatoria
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
  laboratorio: string; // xAI, Anthropic, OpenAI, Google, AWS, Microsoft
  programa: string;
  que_otorga: string;
  a_quien: string;
  monto?: string;
  monto_usd?: number; // monto máximo publicado, sujeto a aprobación
  url?: string;
  nota?: string;
  /** false = los créditos son de la empresa beneficiaria y no se pueden transferir */
  transferible?: boolean;
  /** Si un alumno sin empresa constituida puede solicitarlo */
  alumno_sin_empresa_califica?: boolean;
  /** true = excluye a gobiernos (y en AWS, a organizaciones financiadas sustancialmente por un gobierno) */
  excluye_gobierno?: boolean;
  via_conexion?: string; // cómo puede conectar Forja NL a sus beneficiarios con el programa
  /** false = cifra vista solo en snippet/prensa; confirmar antes del pitch */
  verificado?: boolean;
}

export type SectorPanorama =
  | "gobierno"
  | "judicial"
  | "legislativo"
  | "municipio"
  | "salud"
  | "educacion"
  | "universidad"
  | "empresa"
  | "infraestructura"
  | "ecosistema";

export interface PanoramaIaRegistro {
  iniciativa: string;
  sector: SectorPanorama;
  estado: string; // operativo | piloto | anunciado | suspendido | continuidad no comprobada | ...
  responsable: string;
  descripcion: string;
  /** "explícita" = la fuente habla de IA; "no confirmada" = no hay evidencia de IA; "no es IA" = digitalización o automatización */
  ia: "explícita" | "no confirmada" | "no es IA";
  fecha?: string; // ISO (puede ser parcial: "2026-06" o "2026")
  cifra?: string; // cifra citable, tal como aparece en la fuente
  fuente: Fuente;
  nota?: string;
  /** true solo con fuente oficial o primaria; false si es solo prensa o documento no abierto (†) */
  verificado: boolean;
}

export interface HallazgoFinanciamientoRegistro {
  hallazgo: string;
  proveedores: string;
  implicacion: string;
  detalle: string;
  fuentes: Fuente[];
  verificado: boolean;
}

export interface PresupuestoProgramaRegistro {
  concepto: string;
  monto: string; // texto, tal como aparece en la fuente
  tipo: "Monto" | "Acumulado" | "Meta" | "Resultado" | "Vacío";
  nivel_gobierno: "estatal" | "municipal" | "federal" | "universidad" | "privado";
  fuente: Fuente;
  nota?: string;
  verificado: boolean;
}

export interface VacioProgramaRegistro {
  vacio: string;
  implicacion_forja: string; // qué hueco cubre Forja NL
  evidencia: string;
  fuentes: Fuente[];
  verificado: boolean;
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
