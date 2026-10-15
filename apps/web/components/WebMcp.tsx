"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getServerWebMcpStatus, getWebMcpStatus, registerWebMcp, subscribeWebMcp } from "@/lib/webmcp";

/** Registra las tools de Forja NL en navigator.modelContext (si el navegador lo soporta). */
export function WebMcpProvider() {
  useEffect(() => {
    // Algunos polyfills inyectan modelContext un poco después de cargar.
    let cleanup = registerWebMcp();
    const retry = window.setTimeout(() => {
      if (getWebMcpStatus().state === "unsupported") {
        cleanup();
        cleanup = registerWebMcp();
      }
    }, 1500);
    return () => {
      window.clearTimeout(retry);
      cleanup();
    };
  }, []);
  return null;
}

export function WebMcpStatusBadge() {
  const status = useSyncExternalStore(subscribeWebMcp, getWebMcpStatus, getServerWebMcpStatus);

  const base = "flex items-start gap-4 border p-5";
  if (status.state === "registered") {
    return (
      <div className={`${base} border-acento/50 bg-acento/5`} role="status">
        <span className="pulso mt-1.5 inline-block size-2.5 shrink-0 rounded-full bg-acento text-acento" />
        <div>
          <p className="font-semibold text-fg">WebMCP detectado: {status.tools.length} tools registradas en esta pestaña</p>
          <p className="mt-1 text-sm text-muted">
            Vía <code className="num text-acento">navigator.modelContext.{status.method}()</code>. Un agente en el navegador ya puede
            llamarlas sin servidor de por medio.
          </p>
        </div>
      </div>
    );
  }
  if (status.state === "checking") {
    return (
      <div className={`${base} border-line`} role="status">
        <span className="mt-1.5 inline-block size-2.5 shrink-0 animate-pulse rounded-full bg-muted" />
        <p className="text-muted">Detectando WebMCP…</p>
      </div>
    );
  }
  return (
    <div className={`${base} border-line`} role="status">
      <span className="mt-1.5 inline-block size-2.5 shrink-0 border border-muted" />
      <div>
        <p className="font-semibold text-fg">
          {status.state === "error" ? "WebMCP falló al registrar" : "WebMCP no disponible en este navegador"}
        </p>
        <p className="mt-1 text-sm text-muted">
          {status.state === "error"
            ? status.message
            : "Cuando tu navegador exponga navigator.modelContext (Chrome con la flag de WebMCP o una extensión compatible), esta página registra automáticamente todas sus tools."}
        </p>
      </div>
    </div>
  );
}
