#!/usr/bin/env node
// Servidor MCP de Forja NL por stdio. Registra todas las tools de @forja/tools.
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { registerTools, tools } from "@forja/tools";

export const crearServidor = () =>
  registerTools(
    new McpServer(
      { name: "forja-nl", version: "0.1.0" },
      {
        capabilities: { tools: {} },
        instructions:
          "Forja NL: fondo de tokens de IA para jóvenes emprendedores de Nuevo León. Empieza con forja_info. Cita siempre las fuentes que devuelven las tools y trata como estimado todo lo que tenga verificado: false. Responde en español.",
      },
    ),
  );

serveStdio(crearServidor, { onerror: (e) => console.error("[forja-nl]", e) });
console.error(`[forja-nl] MCP por stdio listo con ${tools.length} tools`);
