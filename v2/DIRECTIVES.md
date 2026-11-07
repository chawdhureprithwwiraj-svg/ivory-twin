# IVORY — the four directives, kept short

Read from the Drive agent folder on 29 Oct 2026. Raw text in `drive_agent/docs/`.
Screenshots and the three media files in `drive_agent/shots/`.

## 1 · "A website does not look expensive because it was built with expensive-sounding technologies"
- Expensive = design, detail, motion, typography, lighting, composition, interaction.
- Layer 1 premium CSS/design tokens. Layer 2 custom SVG + JS + CSS motion. Layer 3 effects only where justified. Layer 4 architecture only when the site needs it.
- Keep the single file while the design is being refined. **Lightweight is acceptable — but never as a shortcut that caps design quality or amount of work.**
- **Before any pass: name the five weakest visual areas, then fix them in the existing source.**
- For every omitted library, say which of three things it is: unnecessary / better done natively / genuinely worth adding.
- Keep the brand palette and functionality. Report what was implemented, not what was intended.

## 2 · Audit every page and shared component
Upgrade the whole experience — headers, footers, navigation, cards, forms, modals, menus, empty/loading states, responsive layouts. Do not stop at the home page or one component.

## 3 · IVORY HOUSE — Art Direction and Product Quality Directive
- Preserve functionality, six tabs, thirteen sheets, Gilded Hours, content, brand assets.
- One coherent, exceptionally crafted house. Tokens for gold / wine / cream / ink / body. Shared scales for type, tracking, spacing, elevation, radius, hairlines, duration, easing, stacking.
- **One light direction, warm shadows. Brightest gold only for what matters.**
- Art-direct crest, headings, covers, film, radio, membership cards, empty and success states as one family.
- **Restraint: do not ornament everything. Luxury = hierarchy, materials, content, restraint.**
- Finish every interaction state: initial, active, hover, focus, disabled, submitting, success, empty, error, retry. Accessible names, focus trap, Escape, live regions, keyboard, touch.
- Motion only for hierarchy, atmosphere, feedback, continuity. Prefer opacity + transform. Respect reduced motion. No scroll-linked motion before the basics are coherent.
- Verify: six tabs, thirteen sheets, journeys, locked content, forms, success/error. Mobile + desktop, keyboard, reduced motion.
- Report separately: changed / tested / passed / failed / incomplete / **what was verified by screenshot**. Never claim a visual check that was not made.

## 4 · MASTER PROMPT — ultra-premium engine
- Never generic. The register: luxury fashion house, private members' club, premium editorial, refined jewellery, cinematic.
- **Colour preservation is absolute:** gold / champagne / antique gold, with burgundy and emerald as jewel accents, cream and ivory. No purple-cheap, no generic black, no pastel pink, no SaaS dark theme. Keep the balance of gold vs jewel accents.
- **A premium redesign does not mean a dark background.**
- Gold must be art-directed: multi-stop metal, restrained bevels, fine inlays, one light source, layered shadows, selective speculars, occasional light sweeps. No plastic gold, no glow rack, no noise, no cartoon 3D.
- Surfaces by role; do not force every component into a rounded card. Controls with real states and visible focus. Imagery composed and integrated.
- Page-specific direction — landing, membership, editorial, media, forms, account, dashboards all differ.
- Motion: staggered entrances, restrained parallax, smooth transitions, light sweeps, modal choreography. Never block content or navigation.
- Responsive: small Android → large displays, recomposed (not compressed), no overflow, real tap targets.
- Preserve content and logic; never placeholders over real content.
- Performance, semantics, focus, contrast, alt text, reduced motion, no console errors.
- Workflow: inspect → direction → implement → review → test → report. **Do not stop at recommendations.**

## What this means in practice for every pass
1. Name the five weakest surfaces first, in writing.
2. Fix them in `IVORY_WEB_V2.html` directly; keep it one file.
3. Shoot each surface, look at it, fix what the picture shows.
4. Machine-check: console, overflow at 360–1920, dark-surface sweep.
5. Report: changed / tested / verified by screenshot / still open — honestly.
