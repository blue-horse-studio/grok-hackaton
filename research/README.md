# Research

Aquí va la investigación del equipo, en Markdown. Ya hay un archivo por tema; llénenlo directamente:

| Archivo | Tema |
| --- | --- |
| [`programas-emprendimiento.md`](programas-emprendimiento.md) | Programas en Nuevo León y México que apoyan a jóvenes emprendedores |
| [`educacion-ia-nl.md`](educacion-ia-nl.md) | Educación sobre IA que se imparte hoy en Nuevo León |
| [`programas-laboratorios-ia.md`](programas-laboratorios-ia.md) | Programas de xAI/SpaceX, Anthropic, OpenAI y Google para financiar proyectos e instituciones |
| [`panorama-verificable-ia-nuevo-leon.md`](panorama-verificable-ia-nuevo-leon.md) | Auditoría de veracidad, continuidad y operación de iniciativas de IA en Nuevo León |
| [`correccion-segunda-pasada-ia-nl.md`](correccion-segunda-pasada-ia-nl.md) | Segunda pasada: correcciones al panorama y nuevas instituciones/implementaciones de IA en NL |

Para un tema nuevo, creen otro `.md` en esta carpeta, con el nombre en kebab-case.

La investigación unificada de laboratorios de IA está disponible en [Word editable](programas-laboratorios-ia.docx), [Markdown](programas-laboratorios-ia.md) y [PDF](programas-laboratorios-ia.pdf). Si se edita Word, sincronizar los cambios con el Markdown del proyecto.

## Cómo subirlo

**Opción rápida, desde GitHub (sin instalar nada):**
1. Abran el archivo en https://github.com/blue-horse-studio/grok-hackaton/tree/main/research
2. Den clic en el lápiz ✏️ (Edit), peguen su contenido y luego **Commit changes** directo a `main`.
   Para subir archivos nuevos: **Add file → Upload files**.

**Desde la terminal:**
```bash
git clone https://github.com/blue-horse-studio/grok-hackaton.git
cd grok-hackaton
# editen research/*.md
git add research && git commit -m "Research: <tema>" && git pull --rebase && git push
```

## Importante
- **Cada cifra lleva su fuente (URL).** Lo que vaya a la tabla "Datos para el pitch" alimenta la web, el MCP y la presentación.
- Las cifras van en las tablas; el contexto y las notas, en texto libre.
