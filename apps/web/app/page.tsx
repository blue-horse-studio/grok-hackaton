import { brand } from "@forja/brand";
import {
  getDataset,
  type CursoRegistro,
  type EcosistemaRegistro,
  type MatriculaRegistro,
  type PoblacionJovenRegistro,
  type PrecioModeloRegistro,
} from "@forja/data";
import { tools, toJsonSchema, simularFondo, SIMULACION_DEFAULTS } from "@forja/tools";
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { CSSProperties } from "react";
import { Logomark } from "@/components/Logo";
import { IntroVideo } from "@/components/IntroVideo";
import { IlustracionHero } from "@/components/Ilustracion";
import { Icono } from "@/components/Iconos";
import { Reveal } from "@/components/Reveal";
import { Simulador, type ModeloOpcion } from "@/components/Simulador";
import { Datos } from "@/components/Datos";
import { Agentes, type ToolResumen } from "@/components/Agentes";
import { EstadoBadge, Fuentes } from "@/components/Fuentes";
import { EQUIPO, HACKATHON, MCP_PATH, SITE_URL } from "@/lib/site";
import { descripcionPublica, entero, largo } from "@/lib/format";

function SectionHead({ n, kicker, title, children }: { n: string; kicker: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <Reveal className="mb-10 max-w-4xl sm:mb-14">
      <p className="eyebrow flex items-center gap-3">
        <span className="num text-muted">{n}</span>
        <span className="h-1 w-10 bg-acento" />
        {kicker}
      </p>
      <h2 className="display mt-4 text-4xl text-fg sm:text-6xl lg:text-7xl">{title}</h2>
      {children && <div className="mt-5 max-w-2xl text-lg text-muted sm:text-xl">{children}</div>}
    </Reveal>
  );
}

function toolResumen(): ToolResumen[] {
  return tools.map((t) => {
    const schema = toJsonSchema(t) as {
      properties?: Record<string, { type?: string | string[]; description?: string; enum?: unknown[] }>;
      required?: string[];
    };
    return {
      name: t.name,
      title: t.title,
      description: t.description,
      params: Object.entries(schema.properties ?? {}).map(([name, p]) => ({
        name,
        type: p.enum ? "enum" : Array.isArray(p.type) ? p.type.join("|") : (p.type ?? "any"),
        required: schema.required?.includes(name) ?? false,
        description: p.description,
      })),
    };
  });
}

function StatProblema({
  valor,
  unidad,
  label,
  verificado,
  delay,
}: {
  valor: string;
  unidad?: string;
  label: string;
  verificado: boolean;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="panel sobre-blanco flex h-full flex-col p-6 sm:p-8">
      <p className="display text-5xl leading-none text-fg sm:text-6xl">
        {valor}
        {unidad && <span className="display-wide ml-2 text-xl text-muted sm:text-2xl">{unidad}</span>}
      </p>
      <p className="mt-4 max-w-xs text-muted">{label}</p>
      <div className="mt-auto pt-5">
        <EstadoBadge verificado={verificado} />
      </div>
    </Reveal>
  );
}

export default function Home() {
  const poblacion = getDataset<PoblacionJovenRegistro>("poblacion-joven-nl");
  const jovenes = poblacion?.registros.find((r) => r.nivel === "estado") ?? poblacion?.registros[0];
  const matricula = getDataset<MatriculaRegistro>("matricula-educacion-superior-nl");
  const matTotal = matricula?.registros.find((r) => r.sostenimiento === "total");
  const eco = getDataset<EcosistemaRegistro>("ecosistema-startups-nl");
  const ranking = eco?.registros.find((r) => /monterrey/i.test(r.indicador) && r.unidad === "lugar");
  const fundadas = eco?.registros.find((r) => /fundadas.*en \d{4}/i.test(r.indicador));
  const videoDisponible = [
    join(process.cwd(), "public/video/forja-intro.mp4"),
    join(process.cwd(), "apps/web/public/video/forja-intro.mp4"),
  ].some((p) => existsSync(/*turbopackIgnore: true*/ p));
  const precios = getDataset<PrecioModeloRegistro>("precios-modelos-ia");
  const modelos: ModeloOpcion[] = (precios?.registros ?? []).map((r) => ({ id: r.id, nombre: r.modelo }));
  // El escenario base del simulador (p. ej. una mezcla de modelos) va primero si no es un modelo del dataset.
  const base = simularFondo({}).modelo;
  if (SIMULACION_DEFAULTS.modelo_id && !modelos.some((m) => m.id === base.id)) {
    modelos.unshift({ id: base.id, nombre: base.nombre.replace(/\s*\(.*\)$/, "") });
  }
  const cursos = getDataset<CursoRegistro>("cursos-forja");
  const cursosOrden = (cursos?.registros ?? []).slice().sort((a, b) => a.orden - b.orden);
  const horasTotales = cursosOrden.reduce((s, c) => s + (c.horas ?? 0), 0);

  const stats = [
    jovenes && {
      ...largo(jovenes.poblacion_15_29),
      label: `jóvenes de 15 a 29 años en Nuevo León (${jovenes.anio}). El talento ya está aquí.`,
      verificado: jovenes.verificado ?? poblacion!.verificado,
    },
    matTotal && {
      valor: entero(matTotal.matricula),
      unidad: "",
      label: "estudiantes de educación superior en el estado: la cantera natural del fondo.",
      verificado: matTotal.verificado ?? matricula!.verificado,
    },
    ranking && {
      valor: `#${ranking.valor}`,
      unidad: "",
      label: `lugar global de Monterrey en el ranking de ecosistemas de StartupBlink ${ranking.anio ?? ""}.`,
      verificado: ranking.verificado ?? eco!.verificado,
    },
    fundadas && {
      valor: String(fundadas.valor),
      unidad: String(fundadas.unidad ?? ""),
      label: `${fundadas.indicador}.`,
      verificado: fundadas.verificado ?? eco!.verificado,
    },
  ].filter(Boolean) as { valor: string; unidad: string; label: string; verificado: boolean }[];

  const nivelNombre: Record<string, string> = {
    fundamentos: "Fundamentos",
    construccion: "Construcción",
    lanzamiento: "Lanzamiento",
  };

  return (
    <main className="relative">
      {/* Navegación */}
      <nav className="tema-oscuro fixed inset-x-0 top-0 z-50 border-b border-line">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#inicio" className="-ml-2 flex min-h-11 items-center gap-2.5 px-2">
            <Logomark className="size-8" />
            <span className="wordmark text-base text-fg">Forja NL</span>
          </a>
          <div className="espaciado hidden items-center gap-1 text-xs text-muted lg:flex xl:gap-3">
            {[
              ["#problema", "Problema"],
              ["#propuesta", "Propuesta"],
              ["#simulador", "Simulador"],
              ["#datos", "Datos"],
              ["#cursos", "Cursos"],
            ].map(([href, t]) => (
              <a key={href} href={href} className="flex min-h-11 items-center px-3 transition-colors duration-150 hover:text-fg">
                {t}
              </a>
            ))}
          </div>
          <a href="#agentes" className="btn btn-primary !px-4 !py-2.5 !text-sm">
            Para agentes
          </a>
        </div>
      </nav>

      {/* INTRO EN VIDEO: lo primero que se ve */}
      <section id="inicio" aria-label="Video de presentación" className="tema-oscuro relative pt-16">
        <div className="mx-auto max-w-7xl px-5 pb-10 pt-6 sm:px-8 sm:pb-16 sm:pt-10">
          <div className="entra mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 sm:mb-6">
            <p className="espaciado text-[11px] leading-relaxed text-oro sm:text-xs">{HACKATHON.nombre}</p>
            <p className="num text-xs uppercase tracking-widest text-muted">{HACKATHON.evento}</p>
          </div>
          <div className="entra" style={{ "--delay": "120ms" } as CSSProperties}>
            <IntroVideo
              src="/video/forja-intro.mp4"
              poster="/video/forja-intro-poster.png"
              captions="/video/forja-intro.vtt"
              disponible={videoDisponible}
            />
          </div>
        </div>
      </section>

      {/* HERO */}
      <section className="tema-oscuro regla relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <h1>
              <span className="entra wordmark block text-2xl text-fg sm:text-4xl">Forja NL</span>
              <span
                className="entra display mt-6 block text-[2.75rem] text-fg sm:text-7xl xl:text-8xl"
                style={{ "--delay": "100ms" } as CSSProperties}
              >
                El acero del siglo XXI son los <span className="text-turquesa">tokens.</span>
              </span>
            </h1>
            <p
              className="entra mt-8 max-w-xl text-lg text-muted sm:text-2xl sm:leading-snug"
              style={{ "--delay": "220ms" } as CSSProperties}
            >
              <strong className="font-semibold text-fg">Forja NL</strong> es un fondo de tokens de IA para que los jóvenes de
              Nuevo León construyan startups y proyectos. Créditos de IA de frontera, cursos para usarla bien y una comunidad que
              construye.
            </p>
            <div className="entra mt-10 flex flex-wrap gap-3" style={{ "--delay": "320ms" } as CSSProperties}>
              <a href="#simulador" className="btn btn-primary">
                Simula el fondo <span aria-hidden>→</span>
              </a>
              <a href="#agentes" className="btn btn-ghost">
                Conecta tu agente · MCP
              </a>
            </div>
          </div>
          <figure className="relative mx-auto w-full max-w-[17rem] sm:max-w-sm lg:max-w-none">
            <IlustracionHero className="w-full" />
            <figcaption className="num mt-4 text-[11px] uppercase tracking-widest text-muted">
              Parque Fundidora · Monterrey
            </figcaption>
          </figure>
        </div>
        {/* Siglo XX / Siglo XXI */}
        <div className="grid sm:grid-cols-2">
          <div className="tema-naranja px-5 py-10 sm:px-12 sm:py-14">
            <div className="ml-auto max-w-xl">
              <p className="num text-sm uppercase tracking-widest text-muted">Siglo XX</p>
              <p className="display-wide mt-3 text-2xl text-fg sm:text-4xl">Fundidora forjó acero</p>
              <p className="mt-2 text-lg text-muted">y Monterrey se volvió la capital industrial de México.</p>
            </div>
          </div>
          <div className="tema-turquesa px-5 py-10 sm:px-12 sm:py-14">
            <div className="max-w-xl">
              <p className="num text-sm uppercase tracking-widest text-muted">Siglo XXI</p>
              <p className="display-wide mt-3 text-2xl text-fg sm:text-4xl">Forja NL forja inteligencia</p>
              <p className="mt-2 text-lg text-muted">con tokens como materia prima para su juventud.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section id="problema" className="tema-naranja regla relative scroll-mt-16 py-24 sm:py-36">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHead n="01" kicker="El problema" title={<>El talento está. <span className="text-blanco">La materia prima, no.</span></>}>
            La IA es la nueva herramienta de trabajo, pero se cobra en dólares, por token y con tarjeta de crédito. Para un estudiante
            de Nuevo León eso es una barrera de entrada, y sin guía, la IA se usa para copiar en lugar de construir.
          </SectionHead>
          {stats.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s, i) => (
                <StatProblema key={s.label} {...s} delay={i * 90} />
              ))}
            </div>
          )}
          {(poblacion || eco) && (
            <div className="mt-10 space-y-2">
              {poblacion && <Fuentes dataset={poblacion} />}
              {matricula && <Fuentes dataset={matricula} />}
              {eco && <Fuentes dataset={eco} />}
            </div>
          )}
        </div>
      </section>

      {/* PROPUESTA */}
      <section id="propuesta" className="tema-claro regla relative scroll-mt-16 py-24 sm:py-36">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHead n="02" kicker="La propuesta" title={<>Un fondo estatal de <span className="text-naranja">tokens de IA</span></>}>
            <span className="text-fg">
              Infraestructura pública-privada que compra cómputo de IA al mayoreo y lo reparte como créditos a jóvenes que construyen.
            </span>
          </SectionHead>
          <div className="grid gap-5 md:grid-cols-3">
            {(
              [
                {
                  t: "Fondo de tokens",
                  d: "Créditos para los mejores modelos (Grok, Claude, GPT, Gemini y abiertos), asignados por proyecto y medidos por uso. Sin tarjeta, sin dólares.",
                  i: "tokens",
                  c: "var(--forja-turquesa)",
                },
                {
                  t: "Cursos de buen uso",
                  d: "Una ruta de formación en IA responsable, agentes y producto. El primer curso es requisito para recibir créditos.",
                  i: "cursos",
                  c: "var(--forja-lima)",
                },
                {
                  t: "Comunidad que construye",
                  d: "Hubs en Monterrey y municipios, mentores, demo days y alianzas con universidades, laboratorios de IA y AI Tinkerers.",
                  i: "comunidad",
                  c: "var(--forja-naranja)",
                },
              ] as const
            ).map((p, i) => (
              <Reveal key={p.t} delay={i * 100} className="panel group relative flex h-full flex-col p-7 sm:p-9">
                <span className="chaflan-sm inline-flex p-3 text-marino" style={{ background: p.c }}>
                  <Icono nombre={p.i} className="size-12" />
                </span>
                <h3 className="display-wide mt-8 text-2xl text-fg sm:text-3xl">{p.t}</h3>
                <p className="mt-3 text-lg text-muted">{p.d}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-14">
            <ol className="chaflan grid gap-px overflow-hidden bg-line sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Aplica", "Con tu equipo y una idea, desde cualquier municipio."],
                ["Aprende", "Completa el curso de IA responsable."],
                ["Recibe créditos", "Tokens por cohorte, medidos y renovables."],
                ["Construye y demuestra", "Prototipo, demo day y siguiente ronda."],
              ].map(([t, d], i) => (
                <li key={t} className="tema-oscuro p-6 sm:p-8">
                  <span className="num text-base text-acento">0{i + 1}</span>
                  <p className="display-wide mt-3 text-xl text-fg">{t}</p>
                  <p className="mt-2 text-muted">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* SIMULADOR */}
      <section id="simulador" className="tema-turquesa regla relative scroll-mt-16 py-24 sm:py-36">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHead n="03" kicker="Simulador" title={<>¿Cuántos jóvenes <span className="text-blanco">forjamos?</span></>}>
            Mueve el presupuesto, la duración y la intensidad de uso. El cálculo usa precios oficiales de modelos y el tipo de cambio
            de Banxico.
          </SectionHead>
          <div>
            <Simulador
              modelos={modelos}
              referencia={
                matTotal
                  ? {
                      total: matTotal.matricula,
                      etiqueta: "de los estudiantes de educación superior de Nuevo León tendría créditos (cada cuadro = 1%).",
                      estimado: !(matTotal.verificado ?? matricula!.verificado),
                    }
                  : undefined
              }
            />
          </div>
        </div>
      </section>

      {/* DATOS */}
      <section id="datos" className="tema-oscuro regla relative scroll-mt-16 py-24 sm:py-36">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHead n="04" kicker="Los datos" title={<>Cada cifra, <span className="text-acento">con su fuente.</span></>}>
            Los mismos datasets alimentan esta página, el pitch y las tools para agentes. Lo que aún no está confirmado se marca como
            estimado.
          </SectionHead>
          <Datos />
        </div>
      </section>

      {/* CURSOS */}
      {cursosOrden.length > 0 && cursos && (
        <section id="cursos" className="tema-lima regla relative scroll-mt-16 py-24 sm:py-36">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionHead n="05" kicker="Cursos" title={<>Forjar también es <span className="text-blanco">aprender.</span></>}>
              {descripcionPublica(cursos.descripcion)}{" "}
              {horasTotales > 0 && (
                <span className="text-fg">
                  {cursosOrden.length} cursos, <span className="num">{horasTotales}</span> horas en total.
                </span>
              )}
            </SectionHead>
            <ol className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {cursosOrden.map((c, i) => (
                <Reveal as="li" key={c.id} delay={(i % 3) * 90} className="panel sobre-blanco flex flex-col p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-3">
                    <span className="chaflan-sm num bg-lima px-3 py-1.5 text-2xl font-bold text-marino">{String(c.orden).padStart(2, "0")}</span>
                    <span className="espaciado border border-line px-2.5 py-1 text-[11px] text-muted">
                      {nivelNombre[c.nivel] ?? c.nivel}
                    </span>
                  </div>
                  <h3 className="display-wide mt-5 text-xl text-fg sm:text-2xl">{c.titulo}</h3>
                  <p className="mt-2 text-muted">{c.descripcion}</p>
                  {c.temas?.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {c.temas.map((t) => (
                        <li key={t} className="bg-line/60 px-2 py-1 text-xs text-fg">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-sm text-muted">
                    <span className="num bg-fg px-2 py-0.5 text-fondo">{c.horas} h</span>
                    <span>{c.modalidad}</span>
                    {c.requisito_para_creditos && <span className="font-semibold text-fg">● Requisito para créditos</span>}
                  </div>
                </Reveal>
              ))}
            </ol>
            <Fuentes dataset={cursos} className="mt-8" />
          </div>
        </section>
      )}

      {/* PARA AGENTES */}
      <section id="agentes" className="tema-oscuro regla relative scroll-mt-16 overflow-hidden py-24 sm:py-36">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex items-start justify-between gap-8">
            <SectionHead n="06" kicker="Para agentes" title={<>Este sitio también <span className="text-turquesa">habla con agentes.</span></>}>
              Conecta Grok, Claude, Cursor o cualquier cliente MCP y pregúntale por los datos o pídele que simule el fondo. Las mismas
              tools viven en el navegador vía WebMCP.
            </SectionHead>
            <Icono nombre="agente" className="hidden size-32 shrink-0 text-turquesa lg:block" />
          </div>
          <Agentes fallbackUrl={`${SITE_URL}${MCP_PATH}`} tools={toolResumen()} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="tema-oscuro regla relative overflow-hidden py-16 sm:py-20">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Logomark className="size-12" />
                <span className="wordmark text-3xl text-fg">Forja NL</span>
              </div>
              <p className="display-wide mt-5 max-w-lg text-2xl text-fg sm:text-3xl">{brand.tagline}</p>
              <p className="mt-4 text-sm text-fg">
                Hecho en Monterrey para el{" "}
                <a href={HACKATHON.url} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-4">
                  {HACKATHON.nombre}
                </a>{" "}
                · {HACKATHON.evento}
              </p>
            </div>
            <div>
              <p className="eyebrow">Equipo</p>
              <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {EQUIPO.map((m) => (
                  <li key={m.handle}>
                    <a href={m.url} target="_blank" rel="noreferrer" className="num text-fg hover:underline">
                      @{m.handle}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 text-xs text-fg">
            <a href="/llms.txt" className="num hover:underline">/llms.txt</a>
            <a href="#agentes" className="num hover:underline">{MCP_PATH}</a>
            <span>Cifras con fuente en cada sección. Las marcadas como estimado están por confirmar.</span>
            <span className="text-muted">
              Foto del hero:{" "}
              <a
                href="https://commons.wikimedia.org/wiki/File:Parque_Fundidora,_Monterrey,_Mexico_-_panoramio_(9).jpg"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 hover:text-fg"
              >
                Betox (vía Panoramio)
              </a>
              ,{" "}
              <a href="https://creativecommons.org/licenses/by/3.0" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-fg">
                CC BY 3.0
              </a>
              , vía Wikimedia Commons.
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
