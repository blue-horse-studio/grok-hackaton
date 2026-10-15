import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { tools } from "@forja/tools";
import { brand } from "@forja/brand";

// MCP remoto (Streamable HTTP) en /api/mcp. Registra las mismas tools que el MCP local y WebMCP.
const handler = createMcpHandler(
  (server) => {
    for (const tool of tools) {
      server.registerTool(
        tool.name,
        {
          title: tool.title,
          description: tool.description,
          inputSchema: z.object(tool.inputSchema),
          annotations: { readOnlyHint: true },
        },
        async (input: unknown) => {
          const result = await tool.handler(input as never);
          return {
            content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
            structuredContent:
              result && typeof result === "object" && !Array.isArray(result)
                ? (result as Record<string, unknown>)
                : undefined,
          };
        },
      );
    }
  },
  {
    serverInfo: { name: "forja-nl", version: "1.0.0" },
    instructions: `${brand.name}: ${brand.pitch} Usa estas tools para consultar datos con fuente sobre jóvenes, educación, precios de modelos de IA y el ecosistema de startups de Nuevo León, y para simular el fondo de tokens.`,
  },
);

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export { handler as GET, handler as POST, handler as DELETE };

export function OPTIONS() {
  return new Response(null, { status: 204 });
}
