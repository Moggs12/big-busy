# Big Busy — Tamagotchi-style pet game

A virtual pet game starring **Big Busy**, a purple fluffy pom-pom character from the owner's YouTube series *Big Lizzy & Family* (Big Lizzy – pink, Big Busy – purple, Little Blue, Little Sunny). Audience: children around 10, mainly on iPad/tablet. Must feel **premium, bright and bubbly** (not pastel, nothing dark or sad-ending).

## Current state (built and working)
- Single-page web game: `game/index.html` (plain HTML/CSS/JS, no build step, no libraries). Assets in `game/assets/`.
- Full-size original art lives in `art/` (PNG). Game uses trimmed/compressed `.webp` copies.
- Sound effects: `game/assets/sounds/*.mp3` (from the series).
- Saves progress in `localStorage` (key `bigbusy-v1`). Time keeps passing while closed (catch-up on load).
- Grown-up settings (cog): sound on/off, game speed (Normal / ×20 / ×240 for testing), quiet hours, start over.

## Game design (agreed — keep)
- **Egg (~1 hour):** drag heat lamp over egg to keep "Cosy" up; hatching progress only fills while cosy. When ready the egg swaps to the cracked art; tap 4 times to hatch (in-code shell burst + flash).
- **Four looks:** Egg → **Fluffball** (day 1: tiny pom-pom, beady eyes, no mouth/limbs, baby talk "Pip!", needs shown as icons, Play locked) → **Fuzzling** (day 2: feet + antenna nubs, short words, Play unlocks) → **Big Busy** (day 3–7: full character, keeps growing in size).
- **Transformation:** at the right age he glows; child taps him → spin, white silhouette, flash, reveal, confetti. Only happens if reasonably cared for (happy ≥40, tummy ≥30, clean ≥25); otherwise he waits. Never regresses.
- **Five meters:** Tummy, Happy, Energy, Clean, Fun.
- **Hands-on care:** drag food to mouth (munch animation; berries are his favourite, broccoli refused), stroke him to pet (hearts), drag sponge over him (bubbles), drag moon to sleep (night garden), bubble-pop mini-game (20s, gold bubbles = 3).
- **Meal times:** breakfast 7–9, lunch 12–13:30, teatime 16:30–18:30 → bonus star if fed in the window.
- **Quiet hours** 20:30–07:00: he sleeps, nothing drops.
- **Kind by design:** no death. After day 7 he's "all grown up" and moves to Fluff Village; start a new egg.
- Later: the other family members as extra eggs, each with their own baby forms and traits.

## Look & feel
- Painted 3D storybook garden (day + night) with a stone on a mound in the centre; the pet stands on it (`GROUND` constant).
- Apple "glass" UI: frosted translucent panels, glossy candy buttons, vivid per-meter colours, Baloo 2 + Nunito fonts.

## Assets (`game/assets/`)
- `art/` garden_day, garden_night, egg, egg_cracked
- `Sprites/` (capital S — keep, paths are case-sensitive on the web) busy_idle/munch/sleep/sad, fluff_idle/sleep, fuzz_idle/sleep
- `icons/` berries, apple, cupcake, broccoli, sponge, moon, wand, lamp, tummy, happy, energy, clean, fun, star
- `sounds/` squeak, coo, boing, squish, giggle, flutter, poof, splash, shimmer, sparkle

Art was made in Runway (owner's account, credits are low — always check cost before generating, video is expensive).

## Next steps (the reason for moving to Claude Code)
1. Put this folder under git and on GitHub; host on GitHub Pages so it runs from a real URL.
2. Make it an installable **PWA** (manifest, icons, service worker for offline) so it sits on the iPad home screen.
3. **Notifications** ("Big Busy's tummy is rumbling!") — 3–5 a day max, never in quiet hours. Web push on iPad needs the PWA installed + a small push server; native local notifications via **Capacitor** are the better long-term route (iOS build needs the 2019 MacBook + Xcode).
4. Then: Android build, more characters, extra animations (Runway video if credits allow).

## Working preferences
- Keep the folder tidy: originals in `art/`, game files in `game/`, nothing loose at the top level.
- Bright, premium, child-friendly. Don't change how Big Busy looks.
