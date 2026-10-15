import { brand } from "@forja/brand";
import { datasets } from "@forja/data";
import { tools, toJsonSchema } from "@forja/tools";
import { HACKATHON, MCP_PATH, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const toolLines = tools
    .map((t) => {
      const schema = JSON.stringify(toJsonSchema(t));
      return `### ${t.name}\n${t.title}. ${t.description}\nInput (JSON Schema): ${schema}`;
    })
    .join("\n\n");

  const dataLines = datasets
    .map(
      (d) =>
        `- ${d.id}: ${d.titulo}${d.verificado ? "" : " (contiene estimados)"}. Fuentes: ${
          d.fuentes.map((f) => (f.url ? `${f.nombre} <${f.url}>` : f.nombre)).join("; ") || "por documentar"
        }`,
    )
    .join("\n");

  const body = `# ${brand.name}

> ${brand.pitch} ${brand.tagline}

${brand.name} propone una infraestructura en Nuevo León (México) que funciona como fondo de tokens de IA: los jóvenes emprendedores y estudiantes reciben créditos para construir startups y proyectos con herramientas de IA, además de cursos para el buen uso de la IA. En el siglo XX Nuevo León forjó acero (Fundidora); en el XXI forja inteligencia.

Proyecto del ${HACKATHON.nombre} (${HACKATHON.evento}).

## Para agentes

- Servidor MCP remoto (Streamable HTTP, sin autenticación): ${SITE_URL}${MCP_PATH}
- Claude Code: \`claude mcp add --transport http forja-nl ${SITE_URL}${MCP_PATH}\`
- WebMCP: al abrir ${SITE_URL} en un navegador con WebMCP (document.modelContext; en implementaciones previas, navigator.modelContext), la página registra las mismas tools.
- Todas las cifras vienen de datasets con fuentes. Si un dataset o registro tiene verificado=false, trátalo como estimado.

## Tools

${toolLines}

## Datasets

${dataLines || "- (cargando)"}

## Páginas

- [Inicio](${SITE_URL}/): narrativa, simulador del fondo, datos, cursos y conexión para agentes.
`;

  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
