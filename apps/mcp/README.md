# @forja/mcp — servidor MCP de Forja NL (stdio)

Expone por stdio todas las tools de `@forja/tools` con el nombre de servidor `forja-nl`. Las tools se definen una sola vez en `packages/tools/src/catalogo.ts`; este servidor solo las registra en un ciclo con `registerTools(server)`.

## Correr

```bash
npm run mcp                        # desde la raíz
npx tsx apps/mcp/src/index.ts      # equivalente
```

## Claude Code

```bash
claude mcp add forja-nl -- npx tsx /RUTA/AL/REPO/apps/mcp/src/index.ts
```

O en `.mcp.json`:

```json
{
  "mcpServers": {
    "forja-nl": {
      "command": "npx",
      "args": ["tsx", "/RUTA/AL/REPO/apps/mcp/src/index.ts"]
    }
  }
}
```

## Claude Desktop

En `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "forja-nl": {
      "command": "npx",
      "args": ["tsx", "/RUTA/AL/REPO/apps/mcp/src/index.ts"]
    }
  }
}
```

## Tools

| Tool | Para qué |
| --- | --- |
| `forja_info` | Qué es Forja NL, datasets disponibles y simulación base |
| `forja_listar_datasets` | Datasets con fuentes, número de registros y verificación |
| `forja_consultar_dataset` | Registros de un dataset por id, con búsqueda y límite |
| `forja_simular_fondo` | Alumnos financiables según presupuesto, meses, tokens y modelo |
| `forja_comparar_modelos` | Costo de N tokens en cada modelo (USD y MXN) |
| `forja_listar_cursos` | Ruta de formación de Forja NL |
| `forja_impacto_municipio` | Jóvenes cubiertos por municipio y en el estado |
| `forja_buscar_programas` | Programas de emprendimiento, educación en IA y laboratorios de IA |

## Probar con el inspector

```bash
npx @modelcontextprotocol/inspector npx tsx apps/mcp/src/index.ts
```
