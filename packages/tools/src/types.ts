import type { z } from "zod";

/**
 * Una tool se define UNA vez aquí y se expone en tres superficies:
 *  - MCP local (apps/mcp, stdio)
 *  - MCP remoto (apps/web /api/mcp, Vercel)
 *  - WebMCP (apps/web, navigator.modelContext en el navegador)
 */
export interface ForjaTool<S extends z.ZodRawShape = z.ZodRawShape> {
  name: string; // snake_case, prefijo "forja_"
  title: string; // legible, en español
  description: string; // para el modelo: qué hace y cuándo usarla
  inputSchema: S;
  handler: (input: z.infer<z.ZodObject<S>>) => unknown | Promise<unknown>; // devuelve JSON serializable
}
