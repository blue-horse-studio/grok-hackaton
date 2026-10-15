import { z } from "zod";
import { catalogo } from "./catalogo";
import type { ForjaTool } from "./types";

export type { ForjaTool } from "./types";

/** Todas las tools de Forja NL. MCP local, MCP remoto y WebMCP leen este mismo arreglo. */
export const tools: ForjaTool[] = catalogo;

/** JSON Schema del input, para WebMCP y clientes que no hablan zod. */
export const toJsonSchema = (tool: ForjaTool) => z.toJSONSchema(z.object(tool.inputSchema));

/** Ejecuta una tool y la envuelve como resultado MCP (texto JSON + structuredContent). */
export async function ejecutarTool(tool: ForjaTool, args: unknown) {
  try {
    const input = z.object(tool.inputSchema).parse(args ?? {});
    const resultado = await tool.handler(input);
    const esObjeto = typeof resultado === "object" && resultado !== null && !Array.isArray(resultado);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(resultado, null, 2) }],
      ...(esObjeto ? { structuredContent: resultado as Record<string, unknown> } : {}),
    };
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : String(error);
    return { content: [{ type: "text" as const, text: `Error en ${tool.name}: ${mensaje}` }], isError: true };
  }
}

/**
 * Registra todas las tools en un McpServer de `@modelcontextprotocol/server` (v2).
 * Tipado estructural para que este paquete no dependa del SDK de MCP.
 *
 *   const server = new McpServer({ name: "forja-nl", version: "0.1.0" });
 *   registerTools(server);
 */
export function registerTools<T extends { registerTool: (...args: any[]) => unknown }>(server: T): T {
  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        inputSchema: z.object(tool.inputSchema),
        annotations: { title: tool.title, readOnlyHint: true, openWorldHint: false },
      },
      (args: unknown) => ejecutarTool(tool, args),
    );
  }
  return server;
}

export * from "./simulador";
