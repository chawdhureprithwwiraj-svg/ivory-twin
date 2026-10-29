# IVORY v2 — what changed, in plain language

*Everything below is the member house and the back-of-house studio. The app was not touched.*

## 1 · The house went into daylight
The member build used to carry a dark night palette in a dozen places. It now has one light:
paper, champagne, brass, wine and emerald. Nothing near black anywhere — the only dark surfaces
left are her own film and the media thumbnails, which are content, not chrome.

- Every surface re-lit: home, explore, wish, membership, inbox, profile.
- The four dark rails on the home screen became gold leaf.
- The wheel of fans, the "When fortune turns" salon, the bells, the bell sets and the ladder
  all moved from night to paper without losing their character.

## 2 · The jewelled details
Ruby enamel under a gold rim for the wine plates and the "note from Ivory" letters; enamel
pledge pills in rose, emerald, amber and sapphire; cabochons in gold bezels for the pinned marks;
a ruby seal with a crown of light for the Ring of Keys.

## 3 · Her own assets, placed
- **The golden heart film** replaced the drawn heart in the Golden Heart sheet, same place, same size.
- **The wheel-opening film** became the first screen of the Gilded Hours: the film plays in a
  gold-bezelled plate, then the crest falls out of the sky with coins and feathers, lands, and
  offers the turn. It appears only inside the wheel's hours, once per session.
- Both live in `media/` and are referenced by relative path, so the house runs offline.

## 4 · Things that were broken and are not
- Profile settings rows that were invisible (transparent text on transparent background).
- A wheel where half the segment names printed upside down.
- "The arrangement" bar in the Room, which was the only mauve control in the house.
- A sticky label clipped to "HOOSE".
- A fortune card that covered the salon link.
- A `₹0` that painted itself as a solid gold bar instead of a number.

## 5 · The disciplines the build now keeps
- Six tabs, sixteen sheets, all reachable by keyboard, all with focus, busy, success, empty and
  error states.
- `prefers-reduced-motion` removes the fall, the bloom and every loop and leaves the layout intact.
- 360 → 1920 checked, no horizontal overflow at any width.
- Console clean on every run.

## Still staged, by design
Payment capture, email delivery and the studio's lock are demonstrations. They are marked
`DEMO` in the file and swap to real services when the backend is wired.
