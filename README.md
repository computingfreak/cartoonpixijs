# Cartoon Storyverse with PixiJS

Interactive PixiJS demo that showcases **five cartoon-inspired story scenes** with animation systems designed for kid-friendly, immersive storytelling.

## What's implemented
- A responsive single-page app with a control panel + animation stage.
- Five selectable story scenes:
  1. Toy Rescue in Rainbow Room
  2. Jungle Rhythm Quest
  3. Super Pup Sky Patrol
  4. Frozen Heart Lantern
  5. Mini Chef Time Machine
- Story-specific animation loops (parallax, rhythmic swaying, flight trails, snowfall/glow, portal orbiting).
- Pointer interaction: clicking/tapping on the canvas spawns sparkle bursts.

## Run locally
Because this app loads PixiJS from a CDN, run via a local web server (not `file://`).

```bash
python3 -m http.server 4173
```

Then open: `http://localhost:4173`

## Files
- `index.html` – app shell, sidebar, and PixiJS script loading.
- `styles.css` – layout/styling for the story UI and stage.
- `app.js` – scene setup, story switching, and animation logic.

## Notes
- This is a creative prototype focused on storytelling visuals.
- No build tooling is required.
