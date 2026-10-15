# Deck del pitch — Forja NL

Deck navegable de HyperFrames: 11 slides (1 = video de intro + 10 slides) con notas del presentador.

## Lanzar (desde esta carpeta)

```bash
cd presentation/deck
npm run dev
```

Esto copia `../renders/forja-intro.mp4` a `assets/media/` si ya existe y luego corre
`npx hyperframes@0.8.159 present .`. Abre **http://localhost:3004** (si el puerto está ocupado, la terminal muestra otro).

Si el video se renderiza después de lanzar: `npm run sync-video` y recarga la página.

## Durante el pitch

- **Avanzar / regresar:** `→` / `←` (también Espacio y Backspace), o los botones de la barra inferior.
- **Pantalla completa:** botón de pantalla completa en la barra inferior (esquina inferior derecha).
- **Modo presentador:** botón Present o tecla `P`. Abre una pestaña de **audiencia** (pantalla completa en el proyector); la pestaña original muestra slide actual, siguiente, notas y cronómetro.
- **Video (slide 1):** intenta arrancar solo; si no, **da clic sobre el video** y se reproduce con sonido. Clic otra vez = pausa. Cuando termine, avanza con `→`.
- **Sonido:** para el audio del video, lo más seguro es presentar desde una sola pestaña en pantalla completa. En modo presentador, la pestaña de audiencia puede arrancar el video sin sonido; da clic en ella para activarlo.

## Notas

- Las cifras salen de `research/*.md` y del simulador (`packages/tools/src/simulador.ts`); cada slide trae su línea de fuente. El slide 8 es un **escenario estimado**.
- `assets/deck-vivo.js` reproduce las animaciones de entrada de cada slide en vivo (el deck navega por seek). No afecta `check` ni `snapshot`.
- Validar: `npm run check` (el único error esperado es `missing_local_asset` mientras no exista el MP4). Fotos fijas: `npm run snapshot`.
