// WebMCP: expone las tools de @forja/tools a agentes que corren dentro del navegador.
// Soporta las dos formas que ha tenido la API:
//  - registerTool(tool, { signal }) / unregisterTool(name)   (explainer W3C actual, Chrome 146+ con flag)
//  - provideContext({ tools })                                (early preview)
// y busca el proveedor en document.modelContext (ubicación actual, Chrome 155) y navigator.modelContext (previa).
import { ejecutarTool, tools, toJsonSchema, type ForjaTool } from "@forja/tools";

export interface WebMcpToolResult {
  content: { type: "text"; text: string }[];
  structuredContent?: Record<string, unknown>;
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

export type WebMcpApi = "document.modelContext" | "navigator.modelContext";

export type WebMcpStatus =
  | { state: "checking" }
  | { state: "unsupported" }
  | {
      state: "registered";
      api: WebMcpApi;
      method: "registerTool" | "provideContext";
      tools: string[];
      failed: { name: string; message: string }[];
    }
  | { state: "error"; api?: WebMcpApi; message: string };

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

function findProvider(): { api: WebMcpApi; ctx: ModelContext } | undefined {
  const candidates: { api: WebMcpApi; ctx: ModelContext | undefined }[] = [
    { api: "document.modelContext", ctx: typeof document !== "undefined" ? document.modelContext : undefined },
    { api: "navigator.modelContext", ctx: typeof navigator !== "undefined" ? navigator.modelContext : undefined },
  ];
  const found = candidates.find(
    ({ ctx }) => ctx && (typeof ctx.registerTool === "function" || typeof ctx.provideContext === "function"),
  );
  return found ? { api: found.api, ctx: found.ctx! } : undefined;
}

const mensaje = (err: unknown) => (err instanceof Error ? err.message : String(err));

export function toWebMcpTool(tool: ForjaTool): WebMcpToolDefinition {
  return {
    name: tool.name,
    title: tool.title,
    description: tool.description,
    inputSchema: toJsonSchema(tool) as object,
    annotations: { readOnlyHint: true },
    // Mismo camino que los servidores MCP: validación zod + forma de resultado MCP (incluye isError).
    execute: (input) => ejecutarTool(tool, input ?? {}),
  };
}

/** Registra todas las tools. Devuelve una función de limpieza. */
export function registerWebMcp(): () => void {
  const found = findProvider();
  if (!found) {
    setStatus({ state: "unsupported" });
    return () => {};
  }
  const { api, ctx: provider } = found;

  const defs = tools.map(toWebMcpTool);
  const controller = new AbortController();
  const handles: unknown[] = [];

  if (typeof provider.registerTool === "function") {
    // registerTool puede devolver una promesa: solo cuentan las tools que realmente se registraron.
    void Promise.allSettled(
      defs.map(async (def) => {
        const handle = await provider.registerTool!(def, { signal: controller.signal });
        handles.push(handle);
        return def.name;
      }),
    ).then((results) => {
      if (controller.signal.aborted) return;
      const ok: string[] = [];
      const failed: { name: string; message: string }[] = [];
      results.forEach((r, i) => {
        if (r.status === "fulfilled") ok.push(r.value);
        else {
          failed.push({ name: defs[i].name, message: mensaje(r.reason) });
          console.warn(`[forja/webmcp] no se pudo registrar ${defs[i].name}`, r.reason);
        }
      });
      setStatus(
        ok.length > 0
          ? { state: "registered", api, method: "registerTool", tools: ok, failed }
          : { state: "error", api, message: failed.map((f) => `${f.name}: ${f.message}`).join(" · ") || "Sin tools registradas" },
      );
    });
  } else {
    try {
      provider.provideContext!({ tools: defs });
      setStatus({ state: "registered", api, method: "provideContext", tools: defs.map((d) => d.name), failed: [] });
    } catch (err) {
      setStatus({ state: "error", api, message: mensaje(err) });
    }
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
