# Big Busy — Tamagotchi-style pet game

A virtual pet game starring **Big Busy**, a purple fluffy pom-pom character from the owner's YouTube series *Big Lizzy & Family* (Big Lizzy – pink, Big Busy – purple, Little Blue, Little Sunny). Audience: children around 10, mainly on iPad/tablet. Must feel **premium, bright and bubbly** (not pastel, nothing dark or sad-ending).

## Current state (built and working)
- Single-page web game: `game/index.html` (plain HTML/CSS/JS, no build step, no libraries). Assets in `game/assets/`.
- Full-size original art lives in `art/` (PNG). Game uses trimmed/compressed `.webp` copies.
- Sound effects: `game/assets/sounds/*.mp3` (from the series).
- Saves progress in `localStorage` (key `bigbusy-v1`). Time keeps passing while closed (catch-up on load).
- **Live at https://moggs12.github.io/big-busy/** (repo `Moggs12/big-busy`, public). Every push to `main` republishes the `game/` folder via `.github/workflows/pages.yml`. Top-level `art/` originals are kept out of git on purpose.
- **Installable PWA:** `game/manifest.webmanifest`, home-screen icons in `game/assets/app-icons/` (made from `art/busy_idle.png`), offline helper `game/sw.js`. **When changing game files, bump `VERSION` in `sw.js`**, and add any new asset to its `FILES` list.
- Grown-up settings (cog): sound on/off, game speed (Normal / ×20 / ×240 for testing), quiet hours, start over.

## Game design (agreed — keep)
- **Egg (~5 min for Big Busy's first egg; later family eggs take longer = difficulty progression):** drag heat lamp over egg to keep "Cosy" up (drains in ~4 min). Hatching runs full speed while cosy, slower when chilly, and very slowly when cold (never stops). Sleeps in quiet hours (nothing changes, night garden). When ready the egg swaps to the cracked art; tap 4 times to hatch (in-code shell burst + flash).
- **Four looks:** Egg → **Fluffball** (day 1: tiny pom-pom, beady eyes, no mouth/limbs, baby talk "Pip!", needs shown as icons, Play locked) → **Fuzzling** (day 2: feet + antenna nubs, short words, Play unlocks) → **Big Busy** (day 3–7: full character, keeps growing in size).
- **Transformation:** at the right age he glows; child taps him → spin, white silhouette, flash, reveal, confetti. Only happens if reasonably cared for (happy ≥40, tummy ≥30, clean ≥25); otherwise he waits. Never regresses.
- **Five meters:** Tummy, Happy, Energy, Clean, Fun.
- **Hands-on care:** drag food to mouth (munch animation; berries are his favourite, broccoli refused), stroke him to pet (hearts), drag sponge over him (bubbles), drag moon to sleep (night garden), Bubble Party mini-game is Big Busy's (25s, gold bubbles = 3; bubbles move by time, sounds play through Web Audio — keep it that way for iPhone smoothness).
- **Meal times:** breakfast 7–9, lunch 12–13:30, teatime 16:30–18:30 → bonus star if fed in the window.
- **Quiet hours** 20:30–07:00: he sleeps, nothing drops.
- **Kind by design:** no death, no day-7 ending.
- **Grown-up goals (1.4):** once grown, 4 goals (3 tricks, 6 meal-time stars, 25 in Bubble Party, buy a corner item; +2★ each). All done → the next family egg appears in the garden (`findEgg`); tapping it when ready moves the grown-up to **Fluff Village** (`S.village`, visit with the 🏡 button) and starts the new egg.
- **Tricks:** grown-ups learn tricks from care points (`careDone`, `TRICKS`, `CHARS[*].tricks`); some shop items add a bonus trick. Tricks tray in the dock.
- **Daily delights (1.5):** garden items do something when tapped (`POKE` table, first poke each day +5 happy); results card after each game (`showResults`); "today's wish" thought bubble (`P.wish`, grant it for +1★, it just fades if missed); a 🎁 present by the stone once a day (`S.giftDay`, +1–2★); a code-drawn sunflower beside the stone that grows one step per day visited (`S.visits`, full bloom at 7 = +3★, then a new seed); little idle moves and drifting clouds; finger lessons the first time each tool matters (`S.taught`). Missed days are never mentioned.
- **Grown-up bundle (1.5):** separate Sound effects / Music switches (`S.music`); the settings cog needs a 1.5s press-and-hold; settings shows play time (`S.playLog`, 14 days); backup code (`BB1:` + base64 of the save) to copy and load.
- **Shop tabs:** Garden (shared) + each character's corner (`DECOR` items with `who`; only shown/buyable while that character is in the garden). The 14 newer items are **code-drawn SVG placeholders** (`ART`) to be replaced with Runway art later. No accessories on characters (don't change their looks).
- **Family eggs (1.3):** characters live in the `CHARS` table in `index.html` (name, pronouns, forms, egg timings, foods, talk, cuddle type, voice). `S.kind` says who is in the garden. After a character grows up, the egg chooser offers the next one (`UNLOCK`); grown-up setting "Family eggs: All unlocked" for testing.
- **Big Lizzy:** pink egg, ~15 min hatch, lamp cools in ~2.5 min. Puffbud → Twirlet → Big Lizzy. Strawberries favourite, watermelon, ice cream (fun up, clean down), lemon refused (sour shiver). Twirl cuddle = draw a circle on her; she spins when tapped; voice = family sounds pitched up; fun drains faster, clean slower. Her game is **Dance Party** (`CHARS.lizzy.game = 'dance'`, `startDance`): arrows fall onto 4 pads, tap as they land (Perfect 2 / Great 1, misses never cost anything); Twirlet gets only ← →; music is synthesised in code (no files); own best score `S.dBest`; Dance floor item adds gold star arrows.
- **Lizzy placeholder art:** her baby looks and egg are Big Busy's pictures pink-tinted in CSS (`.tintPink`, `#pet.tint`, `#egg.tint`); her foods are emoji. Only grown-up Lizzy (`lizzy_idle/sleep`) is real art. To be replaced with Runway art later.
- Later: Little Blue and Little Sunny as extra eggs.

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
1. ~~Git, GitHub, GitHub Pages~~ — done.
2. ~~Installable PWA~~ — done.
3. **Notifications** ("Big Busy's tummy is rumbling!") — 3–5 a day max, never in quiet hours. Web push on iPad needs the PWA installed + a small push server; native local notifications via **Capacitor** are the better long-term route (iOS build needs the 2019 MacBook + Xcode).
4. Then: Android build, more characters, extra animations (Runway video if credits allow).

## Working preferences
- Keep the folder tidy: originals in `art/`, game files in `game/`, nothing loose at the top level.
- Bright, premium, child-friendly. Don't change how Big Busy looks.
