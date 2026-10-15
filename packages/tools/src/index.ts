import { z } from "zod";
import { brand } from "./brand-info";
import type { ForjaTool } from "./types";

export type { ForjaTool } from "./types";

const defineTool = <S extends z.ZodRawShape>(tool: ForjaTool<S>) => tool as unknown as ForjaTool;

export const tools: ForjaTool[] = [
  defineTool({
    name: "forja_info",
    title: "Qué es Forja NL",
    description: "Describe la propuesta Forja NL: fondo de tokens de IA para jóvenes emprendedores de Nuevo León.",
    inputSchema: {},
    handler: () => brand,
  }),
];

/** JSON Schema del input, para WebMCP y clientes que no hablan zod. */
export const toJsonSchema = (tool: ForjaTool) => z.toJSONSchema(z.object(tool.inputSchema));
