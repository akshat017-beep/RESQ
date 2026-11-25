# RESQ — 3D animated videos (three.js + Remotion)

- **three.js** (via `@react-three/fiber` + `@remotion/three`) for the 3D scene
- **Remotion** for timing, captions (`@remotion/captions`), audio/video (`@remotion/media`) and rendering to MP4

## Requirements
- Node.js 18+ (tested on 22)
- FFmpeg is bundled with Remotion; no separate install is needed

## Commands
```bash
npm install
npm run dev        # Remotion Studio (live preview in the browser)
npm run render     # renders composition "Main" -> out/video.mp4
npm run still      # single frame -> out/frame.png
npm run typecheck
```

## Structure
```
remotion.config.ts           # render settings (ANGLE GL so WebGL works headless)
src/index.ts                 # entry point
src/Root.tsx                 # compositions: id, size, fps, duration
src/Main.tsx                 # stacks: 3D scene + captions + audio
src/scenes/Scene3D.tsx       # three.js scene inside <ThreeCanvas>
src/components/Captions.tsx  # TikTok-style word-highlighted captions
public/captions.json         # caption data (Remotion Caption[] format)
public/audio.mp3             # placeholder audio (sine tones) — replace with yours
```

## Rules for 3D animation in Remotion
1. Drive all motion from `useCurrentFrame()` (with `interpolate` / `spring`).
   **Do not** use `useFrame()` from R3F, `Date.now()`, or `Math.random()` without a seed.
   Remotion renders frames in parallel and out of order, so every frame must be a pure function of its frame number.
2. Always use `<ThreeCanvas>` from `@remotion/three`, not `<Canvas>` from R3F.
3. Load assets (GLTF models, textures) from `public/` with `staticFile()`. drei's `useGLTF` / `useTexture` work inside `ThreeCanvas`.
4. Keep all `remotion` / `@remotion/*` packages on the **exact same version**.

## Captions
`public/captions.json` is an array of `{ text, startMs, endMs, timestampMs, confidence }`.
Start each word after the first with a space (e.g. `" world"`).
To create captions from your own voiceover, you can:
- transcribe locally with `@remotion/install-whisper-cpp` (`npm i @remotion/install-whisper-cpp`), or
- convert an `.srt` file with `parseSrt()` from `@remotion/captions`.

## Licensing note
Remotion is free for individuals and companies with up to 3 employees. Larger organisations need a company licence; see https://remotion.dev/license.

## GrowKaz Stickman Studio (2D/3D stick-figure videos)
The GrowKaz Stickman plugin is installed in two places:
- `.claude/skills/`: its skills (`make-2d-video`, `/new-video`, `/video-styles`, `/render-video`, `/video-sound`). Claude Code loads these automatically in this repo.
- `growkaz-stickman-studio/`: the studio (renderer, engine, audio tools). Each video lives in `growkaz-stickman-studio/projects/<slug>/`.

Setup on a new machine (from `growkaz-stickman-studio/`):
```bash
npm install
npx playwright install chromium
python3 -m pip install numpy scipy faster-whisper
python3 tools/doctor.py
```
Local change: `render.mjs` uses the browser at `$CHROMIUM_PATH` when that file exists (set in `.claude/settings.json` for Claude Code cloud sessions, which can't download Playwright's browser). Otherwise it uses Playwright's own browser.
