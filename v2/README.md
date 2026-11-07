# IVORY — release package

Two files are the whole house. Nothing else is required to open it.

| File | What it is | State |
|---|---|---|
| `IVORY_WEB_V2.html` | **The member house** — 6 tabs, 16 sheets, the Gilded Hours, the rite of the wheel, the wallet, the ladder, the room. 2.46 MB, single file, no network calls. | live / current |
| `IVORY_STUDIO.html` | **The back of house** — one door, three keys (Ivory · Ivory Admin · Sub-Admin). 57 KB. | live / current |
| `media/wheel_opening.mp4` | Her opening film, already compressed for web (720 × 404, 2.9 s, 184 KB). | source asset |
| `media/golden_heart.webp` | Her golden-heart animation, 600 × 600, 10 frames (427 KB). | source asset |
| `DIRECTIVES.md` | The four design directives, distilled. Read this before touching the build. | reference |

Both HTML files are already **embedded** with the film and the heart (base64), so they run from a USB stick or an email attachment. `media/` exists for production: if you prefer the assets as separate files (recommended once the site is served over HTTP), replace the two `data:` URIs with `/media/wheel_opening.mp4` and `/media/golden_heart.webp` and the page drops from 2.46 MB to about 1.6 MB.

## Open it
```bash
open IVORY_WEB_V2.html      # or double-click
open IVORY_STUDIO.html
```
Member build: choose a language, then *Continue* to enter the house.
Studio: type any phrase (demo lock), then key 1 → the `#code` field → key 2.

## What is real and what is staged
- **Real in the browser:** state, purse, ledger, wheel windows and turns, bookings, letters, folio, pledges, sound, reduced-motion behaviour, keyboard and focus handling, all sixteen sheets, the studio.
- **Staged:** payment capture (a card ending 4417 is written into the ledger, no processor), email delivery, the jury notes. Every one of these is a single function in the file and is marked `DEMO` where the swap is made.

## The house rules the build obeys
- No surface darker than the paper-and-gold family. One light direction, warm shadows.
- Restricted gold: the brightest gold is reserved for the one action on each screen.
- Every control has initial / hover / focus / active / disabled / busy / success / error / empty states.
- `prefers-reduced-motion` removes the fall, the film bloom and every loop, and leaves the layouts intact.
- 360 → 1920 checked; no horizontal overflow at any width.

## Assets (option 2 — chosen)

The film and the heart now live in `media/` and are referenced by relative path:

```
media/wheel_opening.mp4   184 KB   720x404, 2.9 s, h264, no audio
media/golden_heart.webp   427 KB   600x600, 10 frames, animated
```

The page is **1.63 MB** instead of 2.46 MB and **still works offline**, straight from the folder or the zip — no server, no network. Two safeguards are built in:

- If `media/golden_heart.webp` is ever missing, the heart panel **falls back to the small crest PNG already inside the file**, so the screen can never go blank.
- If `media/wheel_opening.mp4` cannot load, the rite **skips the film and goes straight to the fall** — the ceremony still happens.
