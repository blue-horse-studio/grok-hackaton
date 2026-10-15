const nf0 = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 1 });
const nf2 = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 });

export const entero = (n: number) => nf0.format(Math.round(n));
export const decimal = (n: number) => nf2.format(n);

export const mxn = (n: number) => `$${nf0.format(Math.round(n))}`;
export const mxn2 = (n: number) => `$${nf2.format(n)}`;

/** Escala larga en español: millones, miles de millones, billones (10^12). */
export function largo(n: number): { valor: string; unidad: string } {
  const a = Math.abs(n);
  if (a >= 1e12) return { valor: nf1.format(n / 1e12), unidad: "billones" };
  if (a >= 1e9) return { valor: nf1.format(n / 1e9), unidad: "mil millones" };
  if (a >= 1e6) return { valor: nf1.format(n / 1e6), unidad: "millones" };
  if (a >= 1e3) return { valor: nf1.format(n / 1e3), unidad: "mil" };
  return { valor: nf0.format(n), unidad: "" };
}

export const largoTexto = (n: number) => {
  const { valor, unidad } = largo(n);
  return unidad ? `${valor} ${unidad}` : valor;
};

export const humanKey = (k: string) => {
  const s = k.replace(/_/g, " ").replace(/\s+/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function valorGenerico(v: unknown, key = ""): string {
  if (typeof v === "number") {
    if (/anio|año|year/i.test(key)) return String(v);
    if (/mxn|usd|precio|costo|monto|presupuesto/i.test(key)) {
      return Math.abs(v) >= 1e6 ? `$${largoTexto(v)}` : `$${nf2.format(v)}`;
    }
    if (/pct|porcentaje|tasa/i.test(key)) return `${nf1.format(v)}%`;
    return Math.abs(v) >= 1e6 ? largoTexto(v) : nf2.format(v);
  }
  if (typeof v === "boolean") return v ? "Sí" : "No";
  if (v == null) return "—";
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

/** Quita de la descripción de un dataset las notas internas para agentes ("Campos: …", "Pendiente de research …"). */
export function descripcionPublica(d: string): string {
  return d
    .split(/(?<=\.)\s+(?=[A-ZÁÉÍÓÚÑ¿])/)
    .filter((s) => !/^(Campos|Research|Fuente esperada|Pendiente de research|Incluir)\b/i.test(s.trim()))
    .join(" ")
    .replace(/Pendiente de research \([^)]*\)\.?\s*/gi, "")
    .trim();
}
