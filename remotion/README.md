# Vera demo (Remotion)

A 15-second branded concept explainer for **Vera** (the AI-playtester demand test).
Renders to `../assets/vera-demo.mp4` so the site's deploy picks it up automatically.

## Preview / edit (live)
```bash
cd remotion
npm install
npm run dev        # opens Remotion Studio — edit src/VeraDemo.tsx and see changes live
```

## Render the video + poster
```bash
cd remotion
npm install                 # first time only
npm run render              # -> ../assets/vera-demo.mp4   (H.264, 1280x720, 15s)
npm run poster              # -> ../assets/vera-demo-poster.jpg (frame 210)
```
> First render downloads a headless Chrome (one-time). Needs Node 18+ and ffmpeg is bundled by Remotion.

## Make it appear on the site
After rendering, open `assets/js/content-cta.js` and set:
```js
var VERA_DEMO_VIDEO  = '/assets/vera-demo.mp4';
var VERA_DEMO_POSTER = '/assets/vera-demo-poster.jpg';
```
Then commit `assets/vera-demo.mp4`, `assets/vera-demo-poster.jpg`, and the edited `content-cta.js`.
The hero video appears under the "Meet Vera" banner on the AI insights page. (Left empty, no video is shown — so nothing breaks before you render.)

## Scenes (edit in `src/VeraDemo.tsx`)
1. **Intro** — Vera wordmark
2. **Watching** — scanning "vision" beam over a game viewport
3. **Detect** — bug bounding-box + label
4. **Report** — auto-generated bug report card
5. **CTA** — "Catch bugs while you sleep · Join the private beta →"

Colours/fonts live in the `C` and `FONT` constants at the top of `VeraDemo.tsx`.

## Licensing
Remotion is free for individuals and companies ≤ 3 people. If Unreal Solutions grows past
that, a Remotion Company License is required. See https://remotion.dev/license
