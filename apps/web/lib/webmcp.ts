// WebMCP: expone las tools de @forja/tools a agentes que corren dentro del navegador.
// Soporta las dos formas que ha tenido la API:
//  - registerTool(tool, { signal }) / unregisterTool(name)   (explainer W3C actual, Chrome 146+ con flag)
//  - provideContext({ tools })                                (early preview)
// y busca el proveedor en navigator.modelContext y document.modelContext.
import { tools, toJsonSchema, type ForjaTool } from "@forja/tools";

export interface WebMcpToolResult {
  content: { type: "text"; text: string }[];
  isError?: boolean;
}

export interface WebMcpToolDefinition {
  name: string;
  title?: string;
  description: string;
  inputSchema: object;
  annotations?: { readOnlyHint?: boolean };
  execute: (input: Record<string, unknown>, client?: unknown) => Promise<WebMcpToolResult>;
}

export interface ModelContext {
  registerTool?: (tool: WebMcpToolDefinition, options?: { signal?: AbortSignal }) => unknown;
  unregisterTool?: (name: string) => void;
  provideContext?: (context: { tools: WebMcpToolDefinition[] }) => void;
  clearContext?: () => void;
}

declare global {
  interface Navigator {
    modelContext?: ModelContext;
  }
  interface Document {
    modelContext?: ModelContext;
  }
}

export type WebMcpStatus =
  | { state: "checking" }
  | { state: "unsupported" }
  | { state: "registered"; method: "registerTool" | "provideContext"; tools: string[] }
  | { state: "error"; message: string };

let status: WebMcpStatus = { state: "checking" };
const listeners = new Set<() => void>();

export const getWebMcpStatus = () => status;
export const getServerWebMcpStatus = (): WebMcpStatus => ({ state: "checking" });
export function subscribeWebMcp(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function setStatus(next: WebMcpStatus) {
  status = next;
  listeners.forEach((l) => l());
}

function findProvider(): ModelContext | undefined {
  const candidates = [
    typeof navigator !== "undefined" ? navigator.modelContext : undefined,
    typeof document !== "undefined" ? document.modelContext : undefined,
  ];
  return candidates.find(
    (c) => c && (typeof c.registerTool === "function" || typeof c.provideContext === "function"),
  );
}

export function toWebMcpTool(tool: ForjaTool): WebMcpToolDefinition {
  return {
    name: tool.name,
    title: tool.title,
    description: tool.description,
    inputSchema: toJsonSchema(tool) as object,
    annotations: { readOnlyHint: true },
    execute: async (input) => {
      try {
        const result = await tool.handler((input ?? {}) as never);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
          isError: true,
        };
      }
    },
  };
}

/** Registra todas las tools. Devuelve una función de limpieza. */
export function registerWebMcp(): () => void {
  const provider = findProvider();
  if (!provider) {
    setStatus({ state: "unsupported" });
    return () => {};
  }

  const defs = tools.map(toWebMcpTool);
  const controller = new AbortController();
  const handles: unknown[] = [];

  try {
    if (typeof provider.registerTool === "function") {
      const ok: string[] = [];
      for (const def of defs) {
        try {
          handles.push(provider.registerTool(def, { signal: controller.signal }));
          ok.push(def.name);
        } catch (err) {
          console.warn(`[forja/webmcp] no se pudo registrar ${def.name}`, err);
        }
      }
      setStatus({ state: "registered", method: "registerTool", tools: ok });
    } else {
      provider.provideContext!({ tools: defs });
      setStatus({ state: "registered", method: "provideContext", tools: defs.map((d) => d.name) });
    }
  } catch (err) {
    setStatus({ state: "error", message: err instanceof Error ? err.message : String(err) });
  }

  return () => {
    controller.abort();
    for (const h of handles) {
      const maybe = h as { unregister?: () => void } | undefined;
      try {
        maybe?.unregister?.();
      } catch {}
    }
    if (typeof provider.registerTool === "function" && typeof provider.unregisterTool === "function") {
      for (const def of defs) {
        try {
          provider.unregisterTool(def.name);
        } catch {}
      }
    } else if (typeof provider.provideContext === "function") {
      try {
        if (provider.clearContext) provider.clearContext();
        else provider.provideContext({ tools: [] });
      } catch {}
    }
  };
}
