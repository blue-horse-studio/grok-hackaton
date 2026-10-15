# Forja NL — mapa del repo para agentes

**Propuesta:** infraestructura en Nuevo León que funciona como **fondo de tokens de IA** para jóvenes emprendedores. Los alumnos reciben créditos para construir startups y proyectos con IA, además de cursos y recursos sobre el buen uso de la IA en el estado.
**Contexto:** Hackathon por Nuevo León x Grok Bot & AI Tinkerers (Monterrey Tech Week 2026). El pitch dura **5 minutos**. La meta es impresionar al jurado.
**Narrativa:** en el siglo XX Nuevo León forjó acero (Fundidora); en el XXI forja inteligencia. *El acero del siglo XXI son los tokens.*

Todo el contenido visible para el público va **en español**.

## Mapa

| Ruta | Qué es | Comando |
| --- | --- | --- |
| `research/` | Investigación del equipo en Markdown. Es la fuente de verdad de las cifras. | — |
| `packages/data/` | Datasets en JSON (`datasets/*.json`) con el tipo `Dataset<T>` y sus fuentes | — |
| `packages/tools/` | Tools definidas **una sola vez** y expuestas en MCP local, MCP remoto y WebMCP | — |
| `packages/brand/` | Tokens de marca: colores, tipografías y copy | — |
| `apps/mcp/` | Servidor MCP por stdio | `npm run mcp` |
| `apps/web/` | Sitio público en Next.js (Vercel). Incluye MCP remoto en `/api/mcp` y WebMCP | `npm run dev` |
| `presentation/` | Video de intro y deck con motion graphics (HyperFrames). No es un workspace de npm | ver `presentation/README.md` |
| `.claude/skills/` | Skills del repo (flujos repetibles para agentes) | — |

## Flujo de datos

```
research/*.md ──▶ packages/data/datasets/*.json ──▶ packages/tools ──┬─▶ apps/mcp      (MCP stdio)
                                                                    ├─▶ apps/web/api  (MCP remoto)
                                                                    └─▶ apps/web      (WebMCP + visualizaciones)
packages/data + packages/brand ─────────────────────────────────────▶ presentation/  (cifras y estilo del pitch)
```

## Reglas

- **Cifras:** cada número que aparezca en la web o en el pitch debe venir de un dataset con `fuentes`. Si `verificado: false`, se presenta como estimado o se deja fuera.
- **Tools:** para agregar una tool, edita `packages/tools/src`. No la registres a mano en cada app; las tres superficies leen el mismo arreglo `tools`.
- **Marca:** usa siempre `@forja/brand` (o `tokens.css`). No metas colores ni fuentes directamente en el código.
- **Paquetes internos:** exportan TypeScript fuente (`./src/index.ts`). Next los transpila con `transpilePackages` y el MCP corre con `tsx`.
- **Dependencias:** se instalan desde la raíz con `npm install <pkg> -w <workspace>`.
- **Antes de commitear:** corre `npm run typecheck` y `npm run build`.
