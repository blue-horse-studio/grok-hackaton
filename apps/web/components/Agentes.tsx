"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "./CopyButton";
import { WebMcpStatusBadge } from "./WebMcp";

export interface ToolResumen {
  name: string;
  title: string;
  description: string;
  params: { name: string; type: string; required: boolean; description?: string }[];
}

type Tab = "claude-code" | "json" | "remote";

/** URL del MCP calculada con el origen real (sirve en preview, producción y local). */
function useMcpUrl(fallback: string) {
  const [url, setUrl] = useState(fallback);
  useEffect(() => setUrl(`${window.location.origin}/api/mcp`), []);
  return url;
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="border border-line bg-fondo">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <span className="num text-[11px] uppercase tracking-widest text-muted">config</span>
        <CopyButton text={code} />
      </div>
      <pre className="num overflow-x-auto p-4 text-[13px] leading-relaxed text-fg">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function Agentes({ fallbackUrl, tools }: { fallbackUrl: string; tools: ToolResumen[] }) {
  const url = useMcpUrl(fallbackUrl);
  const [tab, setTab] = useState<Tab>("claude-code");

  const snippets: Record<Tab, { label: string; code: string; hint: string }> = {
    "claude-code": {
      label: "Claude Code",
      code: `claude mcp add --transport http forja-nl ${url}`,
      hint: "Un comando en la terminal. También funciona con Grok, Codex y cualquier cliente con Streamable HTTP.",
    },
    json: {
      label: "Cursor / Claude Desktop",
      code: JSON.stringify({ mcpServers: { "forja-nl": { url } } }, null, 2),
      hint: "Pégalo en ~/.cursor/mcp.json o en la configuración de conectores.",
    },
    remote: {
      label: "Clientes solo stdio",
      code: JSON.stringify({ mcpServers: { "forja-nl": { command: "npx", args: ["-y", "mcp-remote", url] } } }, null, 2),
      hint: "Puente stdio → HTTP con mcp-remote para clientes que no hablan HTTP.",
    },
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
      <div className="space-y-6 self-start lg:sticky lg:top-24">
        <div className="panel-hot p-6 sm:p-8">
          <p className="eyebrow">Servidor MCP remoto · Streamable HTTP</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 border border-line bg-fondo px-4 py-3">
            <span className="pulso inline-block size-2 rounded-full bg-acento text-acento" aria-hidden />
            <code className="num min-w-0 flex-1 break-all text-base text-acento sm:text-lg">{url}</code>
            <CopyButton text={url} label="Copiar URL" />
          </div>

          <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Cliente">
            {(Object.keys(snippets) as Tab[]).map((k) => (
              <button
                key={k}
                role="tab"
                type="button"
                aria-selected={tab === k}
                onClick={() => setTab(k)}
                className={`min-h-10 border px-3.5 py-2 text-sm transition-colors duration-150 ${
                  tab === k ? "border-acento bg-acento/15 text-acento" : "border-line text-muted hover:text-fg"
                }`}
              >
                {snippets[k].label}
              </button>
            ))}
          </div>
          <div className="mt-4" role="tabpanel">
            <CodeBlock code={snippets[tab].code} />
            <p className="mt-2 text-sm text-muted">{snippets[tab].hint}</p>
          </div>
        </div>

        <div className="panel p-6 sm:p-8">
          <p className="eyebrow">WebMCP · el sitio es una API para agentes</p>
          <p className="mt-3 text-muted">
            Esta página registra sus tools con WebMCP (<code className="num text-fg">document.modelContext</code>), el estándar
            emergente del W3C para que agentes dentro del navegador usen un sitio sin hacer scraping.
          </p>
          <div className="mt-5">
            <WebMcpStatusBadge />
          </div>
          <p className="mt-4 text-sm text-muted">
            ¿Eres un modelo? Lee{" "}
            <a href="/llms.txt" className="num text-acento underline underline-offset-4">
              /llms.txt
            </a>
            .
          </p>
        </div>
      </div>

      <div className="panel p-6 sm:p-8">
        <div className="flex items-baseline justify-between gap-4">
          <p className="eyebrow">Tools disponibles</p>
          <span className="num text-sm text-muted">{tools.length} en vivo</span>
        </div>
        <p className="mt-2 text-sm text-muted">
          Una sola definición en <code className="num">@forja/tools</code>, tres superficies: MCP local, MCP remoto y WebMCP.
        </p>
        <ul className="mt-5 space-y-3">
          {tools.map((t) => (
            <li key={t.name} className=" border border-line bg-fondo/60 p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <code className="num text-sm text-acento">{t.name}</code>
                <span className="text-xs text-muted">{t.title}</span>
              </div>
              <p className="mt-1.5 line-clamp-3 text-sm leading-snug text-fg/85" title={t.description}>
                {t.description}
              </p>
              {t.params.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {t.params.map((p) => (
                    <span
                      key={p.name}
                      title={p.description}
                      className="num border border-line px-1.5 py-0.5 text-[11px] text-muted"
                    >
                      {p.name}
                      {p.required ? "" : "?"}: <span className="text-acento">{p.type}</span>
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
