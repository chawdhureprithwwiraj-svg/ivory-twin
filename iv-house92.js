/* Pass 92 - her sixteen. The page carries one line of this file; this file
   carries the skin and the manners, so the house never grows past its size. */
(function(){var c="/* ══════════════════════════════════════════════════════════════════════════\n   PASS 92 · HER SIXTEEN, IN HER ORDER\n   The house after her first walk through it on a handset: the ribbon to the\n   edges, the visitor line in her words, the library's filters whole, the tabs\n   never missing, the inbox's peach breathing, the ladder in every bar, the\n   wheel back in the corner, and a desk in the house's own colours.\n   Every rule here is a correction of something she saw, nothing else.\n   ══════════════════════════════════════════════════════════════════════════ */\n\n/* ── 1 · the gold ribbon reaches both edges, always ─────────────────────── */\n/* the ticker under the bar is the ribbon she means: it was drawn inside the\n   page's 16 px gutter, so the last 16 px of the glass stayed bare and the\n   gap seemed to breathe as the words moved. It is taken out of the gutter. */\n/* the strip already spans the glass; what pulled it off the right edge was a\n   parallax translate the page sets every frame — a few px of drift that read\n   as a white gap that grew and shrank. The strip stands still now. */\n.hp-ticker, .hp-ticker.iv-parallax{\n  transform: none !important;\n  left: 0 !important;\n  will-change: auto !important;\n}\n.hp-ticker{\n  /* the honest full-bleed: the strip is 100vw wide and pulled out by exactly\n     half the gutter it sits in, so both edges land on the glass */\n  margin-left: calc((100% - 100vw) / 2) !important;\n  margin-right: calc((100% - 100vw) / 2) !important;\n  width: 100vw !important;\n  max-width: 100vw !important;\n  border-radius: 0 !important;\n  box-sizing: border-box;\n}\n.hp > .ribbon, .ribbon.ribbon-edge {\n  margin-left: calc((100% - 100vw) / 2) !important;\n  margin-right: calc((100% - 100vw) / 2) !important;\n  width: 100vw !important;\n  max-width: 100vw !important;\n  border-radius: 0 !important;\n  border-left: 0 !important; border-right: 0 !important;\n  box-sizing: border-box;\n}\n/* the fade at the ends was reading as a white gap on the right;\n   the mask goes edge to edge, with only a breath at each tip */\n.ribbon .track{\n  -webkit-mask-image: linear-gradient(90deg,#000 0,#000 99.2%,transparent 100%) !important;\n  mask-image: linear-gradient(90deg,#000 0,#000 99.2%,transparent 100%) !important;\n  border-radius: 0 !important;\n}\n.ribbon .flow{\n  padding-left: 0 !important;\n  animation-duration: 34s !important;\n}\n.ribbon .track{ overflow: hidden; }\n\n/* ── 2 · the visitor line, in her words ────────────────────────────────── */\n/* one line, nothing else after it */\n.pulse-strip .pulse-tx{ letter-spacing: .01em; }\n.pulse-strip .pulse-tx b{ font-weight: 800; }\n.pulse-card .pulse-tail{ text-transform: none; }\n\n/* ── 3 · the library's filters: one calm row, never a pile ──────────────── */\n.lib-chips{\n  display: flex !important;\n  flex-wrap: nowrap !important;\n  align-items: center;\n  gap: 9px !important;\n  overflow-x: auto !important;\n  overflow-y: hidden;\n  padding: 4px 16px 8px !important;\n  margin: 14px -16px 0 !important;\n  scroll-snap-type: x proximity;\n  -webkit-overflow-scrolling: touch;\n}\n.lib-chips .chip, #lib-chips .chip, .chip{\n  position: static !important;\n  flex: 0 0 auto !important;\n  width: auto !important;\n  min-width: 0 !important;\n  height: auto !important;\n  min-height: 36px !important;\n  padding: 0 16px !important;\n  display: inline-flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  white-space: nowrap !important;\n  font-size: 12.5px !important;\n  line-height: 1 !important;\n  border-radius: 999px !important;\n  scroll-snap-align: start;\n  transform: none;\n}\n.lib-chips .chip.on, #lib-chips .chip.on{ transform: none; }\n@media (max-width:380px){\n  /* the old rule shrank every filter into a 33 px dot and they piled up */\n  .lib-chips .chip{ width: auto !important; height: auto !important; }\n  .lib-chips .chip svg{ width: auto; height: auto; }\n}\n\n/* ── 4 · the six tabs are there on all six screens ──────────────────────── */\nbody[data-screen=\"wish\"] .nav,\nbody[data-screen=\"premium\"] .nav,\nbody[data-screen=\"inbox\"] .nav,\nbody[data-screen=\"profile\"] .nav{ display: grid !important; }\n/* and never over a full-screen room */\nbody.on-live .nav, body.on-desk .nav, body.cast-live .nav{ display: none !important; }\n/* the screens keep their last inch clear for the bar */\n#wish-screen, #premium-screen, #inbox-screen, #profile-screen{\n  padding-bottom: calc(86px + env(safe-area-inset-bottom, 0px));\n}\n\n/* ── 5 · the inbox's word from the house: a peach that breathes ─────────── */\n.ibx-card.note{\n  position: relative;\n  background:\n    radial-gradient(120% 150% at 16% -30%, rgba(255,255,255,.85) 0%, rgba(255,255,255,0) 52%),\n    radial-gradient(90% 120% at 88% 118%, rgba(255,146,96,.55) 0%, rgba(255,146,96,0) 60%),\n    linear-gradient(158deg, #FFD9BC 0%, #FFC39C 26%, #F79B72 58%, #E97F58 100%) !important;\n  border-color: rgba(190,86,44,.42) !important;\n  box-shadow:\n    inset 0 1px 0 rgba(255,255,255,.92),\n    inset 0 -14px 26px -18px rgba(160,58,20,.55),\n    0 12px 26px -18px rgba(150,64,26,.75) !important;\n  overflow: hidden;\n}\n/* one slow shine crosses it, so the peach is lit rather than painted */\n.ibx-card.note::after{\n  content:\"\"; position:absolute; inset:-40% -60%;\n  background: linear-gradient(104deg, transparent 38%, rgba(255,255,255,.55) 47%, rgba(255,255,255,.08) 54%, transparent 63%);\n  transform: translate3d(-70%,0,0);\n  animation: ivPeach 7.6s cubic-bezier(.4,0,.2,1) infinite;\n  pointer-events: none; mix-blend-mode: screen;\n}\n@keyframes ivPeach{ 0%,26%{transform:translate3d(-70%,0,0)} 70%,100%{transform:translate3d(70%,0,0)} }\n.ibx-card.note .ic-body h3{ color:#4A1508 !important; }\n.ibx-card.note .ic-body p{ color:#6B2A14 !important; }\n.ibx-card.note .ic-eb{ color:#8A3412 !important; }\n.ibx-card.note .ic-time{ color:#8A4A2C !important; }\n.ibx-card.note .ic-mega{\n  background: radial-gradient(circle at 34% 26%, #FFF6E6, #FFD3AE 52%, #F09668 100%) !important;\n  box-shadow: inset 0 0 0 2px rgba(255,255,255,.92), 0 4px 10px -6px rgba(120,48,16,.8) !important;\n  color:#9A3C16 !important;\n}\n@media (prefers-reduced-motion: reduce){ .ibx-card.note::after{ animation:none; opacity:.5 } }\n\n/* ── 6 · the ladder stands in every bar, not only at home ───────────────── */\n.top-icons .med.ladder, .hp-icons .med.ladder{ order: -1; }\n.med.ladder{ width: 40px; height: 40px; }\n\n/* ── 9 · the wheel: a member always sees it, in her right hand ──────────\n   An earlier pass had switched the medallion off (a display:none rule);\n   that is why no screen ever showed it. It is put back for a member, and\n   only the desk and the room put it away. */\nbody.member .wof-med{ display: grid !important; }\nbody.on-desk .wof-med, body.on-live .wof-med, body.cast-live .wof-med{ display: none !important; }\n\n/* ── 9 · the wheel belongs in her right hand ────────────────────────────── */\n.wof-med{ left: auto !important; right: 16px !important;\n  bottom: calc(96px + env(safe-area-inset-bottom, 0px)) !important; }\nbody.on-desk .wof-med{ display: none !important; }\n\n/* ── 13 · the live room: her word sits low, the beauty key stays small ──── */\n.lv-talk{ display: flex; flex-direction: column; justify-content: flex-end; }\n.lv-talkwrap{ height: min(34vh, 330px); }\n.lv-beauty-pill, #lv-beauty, .lv-beauty{\n  min-width: 0 !important;\n  width: auto !important;\n  padding: 0 13px !important;\n  height: 34px !important;\n  font-size: 10.5px !important;\n  letter-spacing: .10em !important;\n  border-radius: 999px !important;\n}\n.lv-beauty-pill b, .lv-beauty b{ font-size: 10.5px !important; }\n/* the pill loses its word first — the sparkle is the meaning */\n@media (max-width:420px){\n  .lv-beauty-pill s, .lv-beauty s, .lv-beauty .bty-word{ display:none; }\n  .lv-beauty-pill, .lv-beauty{ width: 38px !important; padding: 0 !important; }\n}\nbody.cast-live .lv-beauty-pill, body.on-live .lv-beauty-pill{ transform: scale(1); }\n\n/* the broadcast camera: the preview is never turned, only mirrored */\n#lv-cast video, #lv-video, .lv-stage video, .lv-self video{ transform: none !important; }\n\n/* ── 14 · the lenses are set aside for now ──────────────────────────────── */\n.bty-tab[data-tab=\"lens\"], .bty-tabs [data-tab=\"lens\"]{ display: none !important; }\n\n/* ── 16 · the two cards that were cut in half ───────────────────────────── */\n/* the Early Door and the Private Line sit on the same rail as the rest and\n   read at the same height; no more half-screen rooms inside a card */\n.hp-doorcard .card, .hp-tile{\n  display: flex; flex-direction: column;\n  min-height: 0; height: auto;\n}\n.hp-tile .tile-art, .hp-doorcard .card .card-art{ flex: 1 1 auto; min-height: 132px; max-height: 210px; }\n.hp-tile .tile-body, .hp-doorcard .card .card-in{ flex: 0 0 auto; }\n\n/* ═══════════════════════════════════════\n   10 · THE DESK, IN THE HOUSE'S OWN COLOURS — WITHOUT ITS WINE OR GOLD\n   Her words: \"remove all burgundy/red and gold; use exactly the member\n   application's colours, structure, for buttons/tabs/controls/everything.\"\n   So the desk is paper: cream ground, cocoa ink, one hairline, and a solid\n   ink key for the primary act — the same materials the member's own sheets\n   are made of. Not one red, not one gold, anywhere in the console.\n   ═══════════════════════════════════════ */\n#desk-screen{\n  background:\n    radial-gradient(120% 60% at 20% -10%, #FFFEFB 0%, rgba(255,254,251,0) 62%),\n    linear-gradient(172deg, #FBF7EC 0%, #F6EFDF 48%, #F1E8D3 100%) !important;\n  color: #3A2A1C !important;\n}\n#desk-screen::before{\n  background-image: radial-gradient(rgba(90,70,44,.055) 1px, transparent 1px) !important;\n}\n#desk-screen .dk-head{ background: transparent !important; border-bottom: 0 !important; box-shadow: none !important; }\n#desk-screen .dk-hair{ background: linear-gradient(90deg, rgba(58,42,28,0), rgba(58,42,28,.28), rgba(58,42,28,0)) !important; }\n#desk-screen .dk-name{ color: #2E2115 !important; }\n#desk-screen .dk-who{ color: #8A7660 !important; }\n#desk-screen .dk-badge{\n  background: #3A2A1C !important; color: #FFF9EC !important;\n  box-shadow: none !important; letter-spacing: .18em !important;\n}\n#desk-screen .dk-icon{\n  background: #FFFDF7 !important; color: #3A2A1C !important;\n  border: 1px solid #E2D3B6 !important; box-shadow: none !important;\n}\n#desk-screen .dk-crest{ background: #FFFDF7 !important; box-shadow: inset 0 0 0 1px #E2D3B6 !important; }\n#desk-screen .dk-crest i{ background: #FBF6EA !important; color: #3A2A1C !important; }\n\n/* the plate: a paper bar, hairline beneath */\n#desk-screen .dk-pane > .dk-plate{\n  background: rgba(251,247,236,.97) !important;\n  box-shadow: 0 1px 0 #E2D3B6 !important;\n}\n#desk-screen .dk-plate .dk-pico{\n  background: #FFFDF7 !important; color: #3A2A1C !important;\n  box-shadow: inset 0 0 0 1px #E2D3B6 !important;\n}\n#desk-screen .dk-plate .dk-pfam{ color: #3A2A1C !important; }\n\n/* type */\n#desk-screen .dk-h1{ color: #2E2115 !important; }\n#desk-screen .dk-h1 em{ color: #3A2A1C !important; }\n#desk-screen .dk-lede, #desk-screen .dk-note, #desk-screen .dk-empty{ color: #7C6A55 !important; }\n#desk-screen .dk-kick, #desk-screen .dk-label{ color: #8A7660 !important; }\n#desk-screen .dk-card .dk-note, #desk-screen .dk-card .dk-empty, #desk-screen .dk-card .dk-label,\n#desk-screen .dk-card .dk-kick{ color: #7C6A55 !important; }\n#desk-screen a{ color: #3A2A1C !important; text-decoration-color: #C9B99C !important; }\n\n/* cards: the member's own paper */\n#desk-screen .dk-card, #desk-screen .dk-sheet, #desk-screen .dk-tile,\n#desk-screen .dk-row-plate, #desk-screen .dk-rowcard{\n  background: #FFFDF7 !important;\n  border: 1px solid #E7D9BC !important;\n  color: #3A2A1C !important;\n  box-shadow: 0 10px 22px -20px rgba(74,54,30,.55) !important;\n}\n#desk-screen .dk-card.velvet{\n  background: #FBF4E4 !important; border-color: #E7D9BC !important;\n  box-shadow: 0 10px 22px -20px rgba(74,54,30,.55) !important;\n}\n#desk-screen .dk-rowcard b{ color: #2E2115 !important; }\n#desk-screen .dk-rowcard s, #desk-screen .dk-rowcard s.dk-when{ color: #8A7660 !important; }\n#desk-screen .dk-rowcard .dk-ico, #desk-screen .dk-rowcard i{\n  background: #F4EBDA !important; color: #3A2A1C !important; box-shadow: none !important;\n}\n/* inputs */\n#desk-screen input, #desk-screen textarea, #desk-screen select,\n#desk-screen .dk-input, #desk-screen .dk-select{\n  background: #FFFDF8 !important; color: #3A2A1C !important;\n  border: 1px solid #DCCAA6 !important; box-shadow: none !important;\n}\n#desk-screen input::placeholder, #desk-screen textarea::placeholder{ color: #A79680 !important; }\n#desk-screen input:focus, #desk-screen textarea:focus, #desk-screen select:focus,\n#desk-screen .dk-input:focus, #desk-screen .dk-select:focus{\n  border-color: #3A2A1C !important; box-shadow: 0 0 0 3px rgba(58,42,28,.12) !important; outline: none !important;\n}\n/* chips and segmented keys: paper, and ink when chosen */\n#desk-screen .dk-chip, #desk-screen [class*=\"-chip\"], #desk-screen .dk-seg > *{\n  background: #FFFDF7 !important; color: #5E4A36 !important;\n  border: 1px solid #E2D3B6 !important; box-shadow: none !important;\n}\n#desk-screen .dk-chip.on, #desk-screen [class*=\"-chip\"].on,\n#desk-screen .dk-seg > .on, #desk-screen [class*=\"seg\"] [aria-selected=\"true\"]{\n  background: #3A2A1C !important; color: #FFF9EC !important; border-color: #3A2A1C !important;\n}\n/* the keys: one solid ink for the primary act, paper for the rest */\n#desk-screen .dk-btn, #desk-screen button.dk-btn, #desk-screen .dk-go,\n#desk-screen .dk-pane button[type=\"submit\"]{\n  background: #3A2A1C !important; color: #FFF9EC !important;\n  border: 1px solid #3A2A1C !important;\n  box-shadow: 0 8px 18px -16px rgba(46,33,21,.9) !important; text-shadow: none !important;\n}\n#desk-screen .dk-btn.gold, #desk-screen .dk-btn.quiet, #desk-screen .dk-btn.ghost,\n#desk-screen .dk-pane .dk-quiet{\n  background: #FFFDF7 !important; color: #3A2A1C !important;\n  border: 1px solid #DCCAA6 !important; box-shadow: none !important;\n}\n#desk-screen .dk-btn[disabled], #desk-screen .dk-btn.off{\n  background: #F4EBDA !important; color: #A79680 !important; border-color: #E7D9BC !important;\n}\n/* the little state lights stop being lanterns */\n#desk-screen .dk-dot{ background: #3A2A1C !important; }\n#desk-screen .dk-live b{ color: #2E2115 !important; }\n#desk-screen .dk-live s, #desk-screen .dk-clock{ color: #7C6A55 !important; }\n#desk-screen .dk-err{ background: #FBF1E4 !important; border: 1px solid #E2CFAF !important; color: #6B5136 !important; }\n#desk-screen .dk-note.warn{ color: #6B5136 !important; }\n/* every family accent — dots, rails, underlines — goes quiet */\n#desk-screen, #desk-screen *, .dk-drawer, .dk-drawer *{ --fam: #C9B99C !important; }\n/* the drawer, in the same paper */\n.dk-drawer{\n  background: #FBF7EC !important; color: #3A2A1C !important;\n  border-right: 1px solid #E2D3B6 !important;\n  box-shadow: 26px 0 60px -30px rgba(58,42,28,.35) !important;\n}\n.dk-drawer .dk-dhead{ border-bottom: 1px solid #E2D3B6 !important; }\n.dk-drawer .dk-dhead b{ color: #2E2115 !important; }\n.dk-drawer .dk-dhead s{ color: #8A7660 !important; }\n.dk-drawer .dk-dshut{ background: #FFFDF7 !important; color: #3A2A1C !important; border: 1px solid #E2D3B6 !important; }\n.dk-drawer .dk-ditem{ color: #3A2A1C !important; background: transparent !important; }\n.dk-drawer .dk-ditem.on{ background: #F2EADA !important; color: #2E2115 !important; box-shadow: inset 3px 0 0 #3A2A1C !important; }\n.dk-drawer .dk-famhead{ color: #8A7660 !important; }\n.dk-drawer .dk-famhead s{ color: #A79680 !important; }\n.dk-veil, #dk-veil{ background: rgba(58,42,28,.22) !important; backdrop-filter: blur(2px); }\n\n/* ── the floor of every room ─────────────────────────────────────────────\n   The console's 26 rooms were drawn as light-gold words on wine. On paper\n   those words vanish. So: every word in a room is ink or its quiet sister,\n   no fill in a room is a gradient, and the components that need a body get\n   the member's paper and hairline back on top.                            */\n#desk-screen .dk-pane *{ background-image: none !important; }\n#desk-screen .dk-pane *:not(svg):not(path):not(circle):not(rect){ color: #3A2A1C !important; }\n#desk-screen .dk-pane :is(.dk-kick,.dk-label,.dk-lede,.dk-note,.dk-empty,.dk-who,small,s,em,i,time,.c2-pre,.c2-drop-draft){\n  color: #7C6A55 !important;\n}\n#desk-screen .dk-pane :is(.dk-card,.dk-sheet,.dk-tile,.dk-rowcard,.dk-row-plate,.dk-frame){\n  background: #FFFDF7 !important;\n  border: 1px solid #E7D9BC !important;\n  box-shadow: 0 10px 22px -20px rgba(74,54,30,.55) !important;\n  border-radius: 16px;\n}\n#desk-screen .dk-pane :is(input,textarea,select,.dk-input,.dk-select){\n  background: #FFFDF8 !important; border: 1px solid #DCCAA6 !important;\n}\n/* the kinds, the switches, the seal — the same three manners as the header */\n#desk-screen .dk-pane :is(.c2-kind,.c2-sw,.c2-tick,.dk-chip,[class*=\"-kind\"],[class*=\"-sw\"],[class*=\"-seg\"] > *){\n  background: #FFFDF7 !important; color: #5E4A36 !important;\n  box-shadow: inset 0 0 0 1px #E2D3B6 !important; border: 0 !important;\n}\n#desk-screen .dk-pane :is(.c2-kind,.c2-sw,.c2-tick,[class*=\"-kind\"],[class*=\"-sw\"]).on,\n#desk-screen .dk-pane :is(.dk-chip)[aria-selected=\"true\"]{\n  background: #3A2A1C !important; color: #FFF9EC !important;\n  box-shadow: none !important;\n}\n#desk-screen .dk-pane :is(.c2-kind,.c2-sw,.c2-tick).on *,\n#desk-screen .dk-pane .dk-chip[aria-selected=\"true\"] *{ color: #FFF9EC !important; }\n#desk-screen .dk-pane .c2-seal{\n  background: #3A2A1C !important; color: #FFF9EC !important;\n  box-shadow: 0 12px 26px -20px rgba(46,33,21,.85) !important;\n}\n#desk-screen .dk-pane .c2-seal *{ color: #FFF9EC !important; }\n#desk-screen .dk-pane .c2-seal:active{ transform: translateY(1px); }\n/* a hairline wherever the desk drew a coloured edge */\n#desk-screen .dk-pane [style*=\"border\"]{ border-color: #E7D9BC; }\n#desk-screen .dk-pane :is(hr,.dk-hair,.dk-rule){ background: #E7D9BC !important; }\n/* the little red/gold dots that mark a live thing */\n#desk-screen .dk-pane :is(.dk-dot,[class*=\"dot\"]){ background: #3A2A1C !important; }\n\n/* the champagne key that carries her in and out of the desk — the only key\n   left on the console — takes the desk's own paper and ink, so nothing gold\n   sits over a paper desk                                               */\nbody.on-desk .iv-admin-crest{\n  background: #FFFDF7 !important;\n  border: 1px solid #E2D3B6 !important;\n  box-shadow: 0 6px 16px -12px rgba(58,42,28,.7) !important;\n}\nbody.on-desk .iv-admin-crest .iv-admin-ring{\n  background: #F2EADA !important; color: #3A2A1C !important;\n  box-shadow: inset 0 0 0 1px #DCCAA6 !important;\n}\nbody.on-desk .iv-admin-crest svg, body.on-desk .iv-admin-crest svg *{\n  stroke: #3A2A1C !important; fill: none !important; color: #3A2A1C !important;\n}\n\n/* ── 11 · the twenty-six rooms live in the drawer alone ────────────────── */\n#desk-screen .dk-ribbon, #desk-screen .dk-fams{ display: none !important; }\n/* ── 10b · one key, not two: the champagne key opens the desk, so the\n   console's own power key is gone ─────────────────────────────────────── */\n#dk-exit{ display: none !important; }\n\n/* ── the beauty studio's own footer no longer speaks of a model ─────────── */\n#iv-beauty .bty-q{ min-height: 1.3em; }\n/* ── 12 · the saved frame sits around her face, not behind the card's edge ─ */\n#profile-screen .me-card .p92-ava-frame{\n  position: absolute; inset: -17px; pointer-events: none; z-index: 2;\n  display: grid; place-items: center;\n}\n#profile-screen .me-card .p92-ava-frame .iv-frame{ width: 100% !important; height: 100% !important; }\n#profile-screen .me-card .me-top{ position: relative; }\n#profile-screen .me-card #pf-ava{ position: relative; z-index: 1; }\n#profile-screen .me-card .p92-plaque{ display: flex; justify-content: center; margin: 6px 0 2px; }\n\n\n/* ═══════════════════════════════════════\n   16 · THE THREE DOOR CARDS, COMPOSED\n   She read the Golden Knock-off, the Early Door and the Private Line as\n   \"half-screen, half-gone\". Measured, their content does fit; what made them\n   read as broken was the struck line at 11.8 px in cream on gold, and the\n   three cards taking three different rhythms. So: the strike is drawn as a\n   strike, not as damage; the copy keeps one measure on all three; and each\n   card ends on the same beat.\n   ═══════════════════════════════════════ */\n#home-screen .card .lede.crossed,\n#home-screen .card.c-gold .lede,\n#home-screen .card.c-plum .lede,\n#home-screen .card.c-line .lede{\n  color: #FFF6E2 !important;\n  opacity: 1 !important;\n  font-size: 12.2px !important;\n  line-height: 1.45 !important;\n  text-decoration-color: rgba(255,246,226,.9) !important;\n  text-decoration-thickness: 1px !important;\n}\n#home-screen .card.c-gold .card-in,\n#home-screen .card.c-plum .card-in,\n#home-screen .card.c-line .card-in{\n  padding: 17px 18px 18px !important;\n  display: flex; flex-direction: column;\n}\n#home-screen .card.c-gold .title,\n#home-screen .card.c-plum .title,\n#home-screen .card.c-line .title{\n  font-size: 23px !important;\n  line-height: 1.12 !important;\n  margin: 4px 0 9px !important;\n}\n#home-screen .card .kicker{ margin-top: 10px !important; }\n#home-screen .card .clock{ margin: 4px 0 8px !important; }\n#home-screen .hp-feed > .card{ margin-bottom: 16px !important; }\n/* ═══════════════════════════════════════\n   16b · THE STORY CARDS, COMPOSED\n   Measured before this pass: the gold card carried 26 px of dead height from\n   three sparkles left in the flow; the Early Door put its copy in the top\n   115 px of a 204 px card, so its lower half was bare film (\"half-gone\"); the\n   Ten-Day ring spun across its own headline; and the last card ran under the\n   wheel. One skeleton now — copy rests on the card's base, one type scale, one\n   measure — and every card ends where its words end.\n   ═══════════════════════════════════════ */\n#home-screen .hp-feed{ padding-bottom: 118px !important; }\n\n#home-screen .hp-feed .card.c-gold .card-in,\n#home-screen .hp-feed .card.c-rose .card-in,\n#home-screen .hp-feed .card.c-plum .card-in,\n#home-screen .hp-feed .card.c-line .card-in{\n  display: flex !important; flex-direction: column !important;\n  justify-content: flex-end !important;\n  padding: 18px 18px 17px !important;\n}\n#home-screen .hp-feed .card.c-gold .eyebrow,\n#home-screen .hp-feed .card.c-rose .eyebrow,\n#home-screen .hp-feed .card.c-plum .eyebrow,\n#home-screen .hp-feed .card.c-line .eyebrow{\n  font-size: 9px !important; letter-spacing: .19em !important; line-height: 1.45 !important;\n  margin: 0 0 7px !important;\n}\n#home-screen .hp-feed .card.c-gold .title,\n#home-screen .hp-feed .card.c-rose .title,\n#home-screen .hp-feed .card.c-plum .title,\n#home-screen .hp-feed .card.c-line .title{\n  font-size: 23px !important; line-height: 1.07 !important; margin: 0 0 8px !important;\n}\n#home-screen .hp-feed .card.c-gold .lede,\n#home-screen .hp-feed .card.c-rose .lede,\n#home-screen .hp-feed .card.c-plum .lede,\n#home-screen .hp-feed .card.c-line .lede{\n  font-size: 12.3px !important; line-height: 1.5 !important; max-width: 272px !important;\n}\n\n/* the gold card: the sparkles take no line, and the note closes the card */\n#home-screen .card.c-gold .tw{ position: absolute !important; }\n#home-screen .card.c-gold .kicker{ margin: 8px 0 3px !important; }\n#home-screen .card.c-gold .note{ margin: 9px 0 0 !important; max-width: 268px !important; }\n#home-screen .card.c-gold .card-in{ padding-bottom: 16px !important; }\n\n/* the ten-day ring becomes a wreath around the key, not a screen over the word */\n#home-screen .hp-feed .card.c-rose .tenring{\n  left: auto !important; right: -6px !important; top: -12px !important;\n  margin-left: 0 !important;\n  width: 104px !important; height: 104px !important;\n  opacity: .78 !important; z-index: 2 !important;\n}\n#home-screen .card.c-rose .key-ring{ z-index: 3 !important; }\n#home-screen .card.c-rose .vaultfoot{ margin-top: 13px !important; }\n#home-screen .card.c-rose .note{ max-width: 262px !important; }\n\n/* the Early Door and the Private Line: one base, one height, one measure */\n#home-screen .card.c-plum .card-in,\n#home-screen .card.c-line .card-in{ min-height: 242px !important; }\n#home-screen .card.c-plum .ivf-scrim{\n  background:\n    linear-gradient(180deg, rgba(6,14,26,.05) 0%, rgba(6,12,22,.20) 36%, rgba(5,10,18,.78) 76%, rgba(4,8,15,.92) 100%),\n    linear-gradient(90deg, rgba(6,12,22,.40) 0%, rgba(6,12,22,0) 56%) !important;\n}\n#home-screen .card.c-plum .lede{ max-width: 252px !important; }\n#home-screen .card.c-line .lede{ max-width: 248px !important; }\n#home-screen .hp-feed .card.c-plum .note,\n#home-screen .hp-feed .card.c-line .note{\n  font-size: 11px !important; line-height: 1.45 !important; max-width: 250px !important; margin-top: 9px !important;\n}\n\n/* the seal: the title steps around its own seal */\n#home-screen .card.c-seal .title{\n  padding-right: 92px !important; font-size: 22px !important; line-height: 1.16 !important;\n}\n\n/* the wheel wears gold, not a sweet */\n#wof-med .wof-orbit{\n  background: conic-gradient(from 0deg, #FFF4D6, #E7C074, #B98733, #FFE7B4, #FFF4D6) !important;\n  opacity: .9 !important;\n}\n\n/* ═══════════════════════════════════════\n   22 · THE DESK, DRESSED IN THE MEMBER'S OWN CLOTHES\n   The desk was rebuilt on paper, but its furniture still spoke in the old\n   language: the room list drew cream words on a cream drawer — invisible —\n   and the family keys and the kind chips kept their wine. Everything below is\n   the member application's own palette: ink on paper, gold only where the\n   member app wears gold, and no wine anywhere on the desk.\n   ═══════════════════════════════════════ */\n\n/* the top scrolling row does not exist — the drawer is the only way through */\n#desk-screen .dk-ribbon{ display: none !important; }\n\n/* the room list, legible: ink on paper, the open room marked by a rule */\n#desk-screen .dk-dhead b,\n.dk-drawer .dk-dhead b{ color: #3A2A1C !important; }\n#desk-screen .dk-dhead s,\n.dk-drawer .dk-dhead s{ color: #7A5A2C !important; }\n#desk-screen .dk-ditem,\n.dk-drawer .dk-ditem,\n#desk-screen .dk-ditem span,\n.dk-drawer .dk-ditem span{ color: #3A2A1C !important; }\n#desk-screen .dk-ditem i,\n.dk-drawer .dk-ditem i{ color: #A88344 !important; }\n#desk-screen .dk-ditem.on,\n.dk-drawer .dk-ditem.on{\n  background: #EFE3C9 !important;\n  box-shadow: inset 3px 0 0 #3A2A1C !important;\n}\n#desk-screen .dk-ditem.on span,\n.dk-drawer .dk-ditem.on span{ color: #241A0E !important; }\n#desk-screen .dk-ditem:active,\n.dk-drawer .dk-ditem:active{ background: #F4EBD8 !important; }\n#desk-screen .dk-dshut,\n.dk-drawer .dk-dshut{\n  color: #3A2A1C !important; background: #FFFCF4 !important;\n  border-color: rgba(122,90,44,.36) !important;\n}\n#desk-screen .dk-famhead,\n.dk-drawer .dk-famhead,\n#desk-screen .dk-famhead s,\n.dk-drawer .dk-famhead s{ color: #8A6A44 !important; }\n#desk-screen .dk-ditem em,\n.dk-drawer .dk-ditem em{ color: #8A6A44 !important; border-color: rgba(122,90,44,.30) !important; }\n\n/* the family keys, on paper */\n#desk-screen .dk-fam{\n  color: #7A5A2C !important; background: #FFFCF4 !important;\n  border-color: rgba(122,90,44,.28) !important;\n}\n#desk-screen .dk-fam.on{\n  color: #3A2A1C !important; background: #F1E6CE !important;\n  border-color: rgba(122,90,44,.42) !important;\n}\n#desk-screen .dk-fam i{ background: #B8862E !important; }\n#desk-screen .dk-fam.on i{ background: #3A2A1C !important; }\n\n/* the kind chips are drawn exactly as the member app draws a chosen chip */\n#desk-screen .c2-kind.on,\n#desk-screen .c2-kinds .on,\n#desk-screen .dk-chip.on{\n  background: linear-gradient(180deg,#FFE9A9,#E7B94F 52%,#C08D2E) !important;\n  color: #3D0B14 !important;\n  border-color: rgba(150,97,15,.45) !important;\n  box-shadow: 0 1px 0 rgba(255,255,255,.62) inset !important;\n}\n#desk-screen .c2-kind:not(.on),\n#desk-screen .dk-chip:not(.on){\n  background: #FFFCF4 !important; color: #7A5A2C !important;\n  border-color: rgba(122,90,44,.30) !important;\n}\n\n/* the kinds: paper when unchosen, the member app's gold when chosen */\n#desk-screen .c2-kind,\n#desk-screen .dk-chip{\n  background: #FFFCF4 !important;\n  color: #7A5A2C !important;\n  border-color: rgba(150,97,15,.28) !important;\n}\n#desk-screen .c2-kind.on,\n#desk-screen .c2-kind[aria-pressed=\"true\"],\n#desk-screen .dk-chip.on{\n  background: linear-gradient(150deg,#E9CE86,#C9A227) !important;\n  color: #2A0709 !important;\n  border-color: #E9CE86 !important;\n  box-shadow: 0 8px 20px -12px rgba(201,162,39,.9) !important;\n}\n\n/* the drawer keeps its own heading, on paper */\n#desk-screen .dk-dhead b,\n#desk-screen .dk-dhead s{\n  display: block !important; position: static !important;\n  opacity: 1 !important; visibility: visible !important; transform: none !important;\n}\n\n/* ── the last word on the desk: an id beats a class, and the page's own late\n      rules are classes. Everything here is the member app's palette. ── */\n#desk-screen .dk-ribbon{ display: none !important; }\n#dk-drawer .dk-dhead b{ color: #3A2A1C !important; display: block !important; }\n#dk-drawer .dk-dhead s{ color: #7A5A2C !important; }\n#dk-drawer .dk-ditem,\n#dk-drawer .dk-ditem span{ color: #3A2A1C !important; }\n#dk-drawer .dk-ditem i{ color: #A88344 !important; }\n#dk-drawer .dk-ditem.on{\n  background: #EFE3C9 !important;\n  box-shadow: inset 3px 0 0 #3A2A1C !important;\n}\n#dk-drawer .dk-ditem.on span{ color: #241A0E !important; }\n#dk-drawer .dk-dshut{\n  color: #3A2A1C !important; background: #FFFCF4 !important;\n  border-color: rgba(122,90,44,.36) !important;\n}\n#dk-drawer .dk-famhead,\n#dk-drawer .dk-famhead s{ color: #8A6A44 !important; }\n#dk-drawer .dk-veil,#dk-veil{ background: rgba(58,42,28,.30) !important; }\n\n#desk-screen .c2 .c2-kind{\n  background: #FFFCF4 !important; color: #7A5A2C !important;\n  border-color: rgba(150,97,15,.28) !important;\n}\n#desk-screen .c2 .c2-kind.on,\n#desk-screen .c2 .c2-kind[aria-pressed=\"true\"]{\n  background: linear-gradient(150deg,#E9CE86,#C9A227) !important;\n  color: #2A0709 !important; border-color: #E9CE86 !important;\n  box-shadow: 0 8px 20px -12px rgba(201,162,39,.9) !important;\n}\n#desk-screen .dk-fam{\n  color: #7A5A2C !important; background: #FFFCF4 !important;\n  border-color: rgba(122,90,44,.28) !important;\n}\n#desk-screen .dk-fam.on{\n  color: #3A2A1C !important; background: #F1E6CE !important;\n  border-color: rgba(122,90,44,.42) !important;\n}\n\n/* the drawer's head reads as one line: the title on the left, the way out on\n   the right — never a button stranded under its own heading */\n#dk-drawer .dk-dhead{\n  display: grid !important;\n  grid-template-columns: 1fr auto !important;\n  column-gap: 12px; align-items: start;\n  padding-right: 16px !important;\n}\n#dk-drawer .dk-dhead b{ grid-column: 1; grid-row: 1; margin: 0 !important; }\n#dk-drawer .dk-dhead s{ grid-column: 1; grid-row: 2; }\n#dk-drawer .dk-dshut{\n  grid-column: 2; grid-row: 1 / span 2;\n  position: static !important; left: auto !important; right: auto !important;\n  top: auto !important; align-self: start; margin: 0 !important;\n}\n\n/* the line under the drawer's heading — who is sitting at the desk — in taupe */\n#dk-drawer .dk-who,\n#dk-drawer .dk-who-moved{\n  color: #8A6A44 !important; opacity: 1 !important;\n  font-family: Georgia, serif; font-style: italic;\n}\n\n/* ═══════════════════════════════════════\n   3 · THE LIBRARY'S CHIPS, IN ONE CLEAN RAIL\n   Measured on Explore at 390: the row started at x = 0 — flush against the\n   glass, while every word beneath it starts at 16 — and ran off the right edge\n   with the fourth chip cut through a letter, which is what read as \"scattered\".\n   One rail now: the page's own gutter, even gaps, no wrapping at any width, a\n   snap for each chip, and a soft edge so the fifth is visibly waiting.\n   ═══════════════════════════════════════ */\n#lib-chips{\n  display: flex !important; flex-wrap: nowrap !important;\n  gap: 8px !important;\n  margin: 14px -16px 0 !important;\n  padding: 2px 16px 6px !important;\n  overflow-x: auto !important; overflow-y: hidden !important;\n  scroll-snap-type: x proximity;\n  scroll-padding-left: 16px;\n  -webkit-overflow-scrolling: touch;\n  -webkit-mask: linear-gradient(90deg,#000 0,#000 calc(100% - 30px),transparent 100%) !important;\n  mask: linear-gradient(90deg,#000 0,#000 calc(100% - 30px),transparent 100%) !important;\n}\n#lib-chips > .chip{\n  flex: 0 0 auto !important;\n  margin: 0 !important;\n  scroll-snap-align: start;\n}\n#lib-chips > .chip:active{ transform: scale(.97) !important; }\n\n/* ═══════════════════════════════════════\n   8 · THE TEN-DAY VAULT ANSWERS THE HAND\n   The card had no listener at all. Its sheet is paper, like every other sheet\n   in the house: ten days, the one that is open, the hour it turns, and what\n   happens to an answer. The admin's walk is marked as a walk.\n   ═══════════════════════════════════════ */\n#sheet-vault .ivsheet-body{ padding: 6px 18px calc(28px + env(safe-area-inset-bottom)) !important; }\n#sheet-vault .ivsheet-head h2{ font-family: var(--f-display, Georgia), serif; }\n\n.p92v-card{\n  border-radius: 18px; padding: 16px 14px 14px; margin: 2px 0 0;\n  background: linear-gradient(168deg,#FFE8D6 0%,#F8CBB4 58%,#EFB79C 100%);\n  box-shadow: inset 0 1px 0 rgba(255,255,255,.92), 0 18px 32px -24px rgba(120,50,30,.65);\n  border: 1px solid rgba(170,100,70,.20);\n}\n.p92v-kick{\n  margin: 0 0 12px; font: 700 9px/1 Georgia, 'Times New Roman', serif;\n  letter-spacing: .20em; text-transform: uppercase; color: #8A4A2C;\n}\n.p92v-days{ display: grid; grid-template-columns: repeat(10, minmax(0,1fr)); gap: 4px; }\n.p92v-day{ display: flex; flex-direction: column; align-items: center; gap: 3px; }\n.p92v-day i{\n  width: 100%; aspect-ratio: 1; border-radius: 50%; display: grid; place-items: center;\n  background: rgba(255,255,255,.55); border: 1px solid rgba(150,80,50,.24); color: #B06A46;\n}\n.p92v-day i svg{ width: 62%; height: 62%; display: block; }\n.p92v-day.got i{\n  background: linear-gradient(180deg,#FFF0C4,#EAC468 58%,#C99A3A);\n  border-color: #B98A2E; color: #5A3A0A;\n  box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 4px 10px -6px rgba(120,74,8,.8);\n}\n.p92v-day.open i{\n  background: #FFFDF6; border-color: #8A4A2C; color: #8A4A2C;\n  box-shadow: 0 0 0 2px rgba(138,74,44,.18);\n}\n.p92v-day b{ font: 600 8.5px/1 Georgia, serif; color: #8A5A3C; }\n.p92v-clock{ margin: 13px 0 0; font: 400 15px/1.25 Georgia, serif; color: #4A2416; }\n.p92v-line, .p92v-rule, .p92v-seal{ margin: 16px 0 0; font: 400 13.5px/1.66 Georgia, serif; color: #4A2A1C; }\n.p92v-seal{ font-style: italic; }\n.p92v-admin{\n  margin: 18px 0 0; padding: 12px 13px; border-radius: 12px;\n  background: #F6EEDC; border: 1px solid rgba(150,97,15,.28);\n  font: 400 12.5px/1.6 Georgia, serif; color: #6A4A22;\n}\n\n/* ═══════════════════════════════════════\n   5 · THE PEACH NOTES, GLAZED\n   Measured: they were one flat wash — no light on them, no breath. Now they\n   are cut fruit: a lit shoulder, a glide of sheen that rises and falls, and\n   the ink kept dark enough to read on all of it.\n   ═══════════════════════════════════════ */\n#inbox-screen .ibx-card.note{\n  position: relative !important; overflow: hidden !important;\n  background:\n    radial-gradient(120% 90% at 14% -18%, rgba(255,255,255,.72) 0%, rgba(255,255,255,0) 56%),\n    linear-gradient(165deg,#FFC8AC 0%,#F9A582 40%,#EF8A63 78%,#E97C55 100%) !important;\n  border: 1px solid rgba(176,96,64,.22) !important;\n  box-shadow:\n    0 1px 0 rgba(255,255,255,.92) inset,\n    0 -14px 26px -18px rgba(130,50,24,.55) inset,\n    0 16px 30px -24px rgba(150,60,30,.6) !important;\n}\n#inbox-screen .ibx-card.note > *{ position: relative; z-index: 1; }\n#inbox-screen .ibx-card.note::after{\n  content: \"\"; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 0;\n  background:\n    linear-gradient(118deg, rgba(255,255,255,.58) 0%, rgba(255,255,255,.14) 22%, rgba(255,255,255,0) 42%);\n  animation: p92Peach 7.2s ease-in-out infinite;\n}\n@keyframes p92Peach{ 0%,100%{ opacity: .55 } 50%{ opacity: 1 } }\n@media (prefers-reduced-motion: reduce){ #inbox-screen .ibx-card.note::after{ animation: none; opacity: .8 } }\n\n/* ═══════════════════════════════════════\n   17 · THE RIBBONS, AFTER LOGIN, ON EVERY SCREEN\n   Measured: the layer was display:none everywhere because the intro screen\n   leaves iv-open.ivo behind for good after it has finished, and a guard\n   written for the intro's own moment never lets go. The guard now only holds\n   while the intro is actually taking the screen; once it is done the lane is\n   open again, on every room except her desk, which keeps its own quiet.\n   ═══════════════════════════════════════ */\nbody:has(#iv-open.ivo-done):not(.on-desk) .ribbonlay{ display:block !important }\nbody:has(#legal.on) .ribbonlay{ display:none !important }\n\n/* the lane sits just under the top bar, never on the screen's own title */\nbody:not(.rbn-video):not(.rbn-audio):not(.rbn-cast) .rbn{ --rbn-top: 68px !important }\n@media (max-width:400px){ body:not(.rbn-video):not(.rbn-audio):not(.rbn-cast) .rbn{ --rbn-top: 66px !important } }\n\n/* ═══════════════════════════════════════\n   11 · THE DESK'S LAST GOLD, AND ITS BLACK CHIP\n   Measured after 92c: no burgundy anywhere, and the only gold left was the\n   hidden top tab row (27 nodes, all of them display:none). This takes that\n   gold out of the skin as well, so it can never flash back, and it melts the\n   filled black ADMIN chip into the same paper pill the house uses everywhere.\n   A filled ink block is a badge you wear in a dark room; the house does not\n   have dark rooms.\n   ═══════════════════════════════════════ */\n#desk-screen .dk-tab,\n#desk-screen .dk-ribbon .dk-tab,\n#desk-screen .dk-tab.on,\n#desk-screen .dk-ribbon .dk-tab.on{\n  background: transparent !important;\n  color: #5E4A36 !important;\n  border-color: #E2D3B6 !important;\n  box-shadow: none !important;\n}\n#desk-screen .dk-tab.on{ color: #2E2115 !important; box-shadow: inset 0 -2px 0 #3A2A1C !important; }\n\n#desk-screen .dk-badge{\n  background: #FFFDF7 !important;\n  color: #5E4A36 !important;\n  box-shadow: inset 0 0 0 1px #E2D3B6 !important;\n  letter-spacing: .20em !important;\n}\n\n/* ── 11b · no filled black key, no gold fill — the house's paper key ──────\n   Measured in room 06: the primary act was a solid 358 × 44 cocoa block, and\n   every chosen chip a gold gradient. Both are the desk wearing someone else's\n   jewellery. On paper, the house's key is cream with one cocoa hairline: it\n   reads as the same act, and it never turns into a black slab.               */\n#desk-screen .dk-btn,\n#desk-screen button.dk-btn,\n#desk-screen .dk-go,\n#desk-screen .dk-pane button[type=\"submit\"],\n#desk-screen .dk-chip.on,\n#desk-screen .rp-chip.on,\n#desk-screen .dk-seg > .on,\n#desk-screen [class*=\"-chip\"].on,\n#desk-screen [class*=\"seg\"] [aria-selected=\"true\"]{\n  background: linear-gradient(180deg, #FFFDF7 0%, #F8F0DF 100%) !important;\n  color: #3A2A1C !important;\n  border: 1px solid #D9C6A4 !important;\n  box-shadow: inset 0 1px 0 #FFFFFF, 0 1px 2px rgba(90,70,44,.10) !important;\n  letter-spacing: .06em;\n}\n#desk-screen .dk-btn:active,\n#desk-screen .dk-chip.on:active,\n#desk-screen .rp-chip.on:active{ transform: translateY(1px); }\n#desk-screen .dk-btn b, #desk-screen .dk-btn strong{ color: #2E2115 !important; }\n/* the one exception: a destructive act keeps the ink, but only as an outline */\n#desk-screen .dk-btn.danger, #desk-screen .dk-btn[data-danger]{\n  background: #FFFDF7 !important; color: #8A2B1E !important; border-color: #C98C7E !important;\n}\n\n/* ── 11c · the last of the gold, taken out of the rooms ───────────────────\n   What the walk found: a gold-filled \"chosen\" tab in Create, a gold rule\n   under every room heading, and gold hairlines on trays, water, lanes and\n   empty states. None of it is jewellery now — one cocoa hairline, one paper\n   key, the member's own materials.                                          */\n#desk-screen .c2-kind.on,\n#desk-screen .c2-kind[aria-selected=\"true\"]{\n  background: linear-gradient(180deg,#FFFDF7 0%,#F8F0DF 100%) !important;\n  color: #3A2A1C !important;\n  border-color: #D9C6A4 !important;\n  box-shadow: inset 0 1px 0 #FFFFFF !important;\n}\n#desk-screen .dk-h1{ box-shadow: 0 1px 0 #D9C6A4 !important; }\n#desk-screen .dk-h2, #desk-screen .dk-h3{ box-shadow: none !important; }\n#desk-screen .dk-tab::after,\n#desk-screen .dk-ribbon .dk-tab::after{ background: transparent !important; box-shadow: none !important; }\n#desk-screen [class*=\"tray\"], #desk-screen [class*=\"water\"], #desk-screen [class*=\"ripple\"],\n#desk-screen [class*=\"lane\"], #desk-screen [class*=\"reh\"], #desk-screen .dk-empty,\n#desk-screen .c2-back, #desk-screen .c2-money{\n  border-color: #E2D3B6 !important;\n}\n#desk-screen .lvd-mark{ background: #EFE3CB !important; }\n#desk-screen .c2 i, #desk-screen .c2-step i, #desk-screen .c2-dot{\n  background: #D9C6A4 !important;\n  box-shadow: none !important;\n}\n\n/* 11d · the 92c rule that filled every chosen control with cocoa, outranked */\n#desk-screen .dk-pane :is(.c2-kind,.c2-sw,.c2-tick,[class*=\"-kind\"],[class*=\"-sw\"],[class*=\"-tick\"]).on{\n  background: linear-gradient(180deg,#FFFDF7 0%,#F8F0DF 100%) !important;\n  color: #3A2A1C !important;\n  border-color: #D9C6A4 !important;\n  box-shadow: inset 0 0 0 1px #D9C6A4 !important;\n}\n#desk-screen .dk-pane :is(.c2-kind,.c2-sw,.c2-tick,[class*=\"-kind\"],[class*=\"-sw\"],[class*=\"-tick\"]).on *{\n  color: #3A2A1C !important;\n}\n/* every decorative mark in a room is a warm hairline dot, never a coin */\n#desk-screen i[aria-hidden=\"true\"], #desk-screen .dk-pane i:empty{\n  background: #D9C6A4 !important;\n  box-shadow: none !important;\n}\n#desk-screen [class*=\"-new\"], #desk-screen [class*=\"-clear\"], #desk-screen [class*=\"-go\"],\n#desk-screen .tk-tape, #desk-screen .wh-hub{ border-color: #E2D3B6 !important; }\n#desk-screen .cd-new{ background: #FFFDF7 !important; }\n\n/* 11e · the seal — paper, like every other key in the console */\n#desk-screen .c2-seal{\n  background: linear-gradient(180deg,#FFFDF7 0%,#F7EEDC 100%) !important;\n  color: #2E2115 !important;\n  border: 1px solid #C9B492 !important;\n  box-shadow: inset 0 1px 0 #FFFFFF, inset 0 0 0 1px rgba(217,198,164,.55), 0 6px 14px -12px rgba(90,70,44,.55) !important;\n  letter-spacing: .10em;\n}\n#desk-screen .c2-seal:active{ transform: translateY(1px); }\n\n/* ═══════════════════════════════════════\n   11f · THE ROOMS STOP BEING VELVET\n   Every room is written against one palette: --cream is its ink, --gold its\n   gilding, and a handful of literal wine gradients its velvet blocks. The\n   tokens flip in one place here; the velvet blocks are re-cut one by one.\n   Nothing in the console is dark any more, and nothing is gilded.\n   ═══════════════════════════════════════ */\n#desk-screen .rm{\n  --ink:#2E2115;\n  --burg:#F3E8D2;\n  --burgL:#F7EEDC;\n  --wine:#8A4A2C;\n  --gold:#8A6E4E;\n  --goldL:#5E4A36;\n  --goldD:#7A5A2C;\n  --cream:#3A2A1C;\n  --paper:#FFFDF7;\n  --mute:#8A7660;\n  --dim:#7C6A55;\n}\n\n/* the wax seal becomes a paper seal */\n#desk-screen .cr-seal{\n  background: radial-gradient(circle at 34% 26%,#FFFDF7,#F3E8D2 68%,#EADCC0) !important;\n  box-shadow: inset 0 0 0 2px #D9C6A4, inset 0 1px 0 #FFFFFF, 0 10px 22px -18px rgba(90,70,44,.6) !important;\n}\n#desk-screen .cr-seal span{ color:#3A2A1C !important; }\n#desk-screen .cr-seal i{ border-color:#C9B492 !important; }\n\n/* the report docket's spine and hole */\n#desk-screen .rp-spine{\n  background: linear-gradient(180deg,#F7EEDC,#EFE3CB) !important;\n  color:#5E4A36 !important;\n}\n#desk-screen .rp-hole{ background:#EFE3CB !important; box-shadow: inset 0 1px 2px rgba(120,95,60,.35), 0 0 0 2px #FFFDF7 !important; }\n#desk-screen .rp-lanes{ background:#F7EEDC !important; }\n\n/* the well, the tray, the chest, the tape: paper, not velvet */\n#desk-screen .wi-water{\n  background: linear-gradient(180deg,#FFFDF7,#F6EBD6) !important;\n  border-color:#E2D3B6 !important;\n  box-shadow: inset 0 -14px 30px -22px rgba(138,110,74,.35) !important;\n}\n#desk-screen .wi-ripple{ border-color: rgba(138,110,74,.35) !important; }\n#desk-screen .wi-step.on{ background:#FFFDF7 !important; color:#2E2115 !important; border-color:#C9B492 !important; }\n#desk-screen .wi-save{\n  background: linear-gradient(180deg,#FFFDF7,#F7EEDC) !important;\n  color:#2E2115 !important; border:1px solid #C9B492 !important;\n  box-shadow: inset 0 1px 0 #fff !important;\n}\n#desk-screen .wh-hub{ background:#F7EEDC !important; border-color:#E2D3B6 !important; }\n#desk-screen .wh-dot.s0, #desk-screen .wh-dot.s2{ background:#C9B492 !important; }\n#desk-screen .wh-dot.s1{ background:#8A6E4E !important; }\n\n#desk-screen .en-tray{\n  background: linear-gradient(180deg,#FFFDF7,#F6EBD6) !important;\n  border-color:#E2D3B6 !important; box-shadow: inset 0 1px 0 #fff !important;\n}\n#desk-screen .en-lip{ background: linear-gradient(90deg,#D9C6A4,rgba(217,198,164,.15)) !important; }\n#desk-screen .en-act.link{ background:#FFFDF7 !important; color:#3A2A1C !important; border-color:#C9B492 !important; }\n\n#desk-screen .gd-tray{\n  background: linear-gradient(180deg,#FFFDF7,#F6EBD6) !important;\n  border-color:#E2D3B6 !important; box-shadow: inset 0 1px 0 #fff !important;\n}\n#desk-screen .gd-rim{ background: linear-gradient(90deg,rgba(217,198,164,.15),#C9B492,rgba(217,198,164,.15)) !important; }\n\n#desk-screen .tk-tape{\n  background: linear-gradient(180deg,#FFFDF7,#F6ECD8) !important;\n  border-color:#E2D3B6 !important; box-shadow: inset 0 1px 0 #fff !important;\n}\n#desk-screen .tk-tape::before{ background: linear-gradient(90deg,#F8F0DF,transparent) !important; }\n#desk-screen .tk-tape::after{ background: linear-gradient(270deg,#F8F0DF,transparent) !important; }\n#desk-screen .tk-run span{ color:#5E4A36 !important; }\n#desk-screen .tk-sw.on{ background:#FFFDF7 !important; color:#2E2115 !important; border-color:#C9B492 !important; }\n\n/* the small ink marks inside dockets and stories */\n#desk-screen .st-bulb b{ background:#F3E8D2 !important; box-shadow: 0 0 0 1px #D9C6A4 !important; }\n#desk-screen .st-mstop b{ color:#3A2A1C !important; }\n#desk-screen .cr-sel option, #desk-screen .cd-f select option{ background:#FFFDF7 !important; color:#3A2A1C !important; }\n#desk-screen .cr-tick input:checked::after{ background:#3A2A1C !important; }\n\n/* an empty room is quiet, not unfinished: a hairline, never a dashed box */\n#desk-screen .dk-empty, #desk-screen .rmx-wait{\n  border-style: solid !important;\n  border-color: #E7D9BC !important;\n  background: #FFFDF7 !important;\n  color: #7C6A55 !important;\n}\n\n/* the chosen kind must be obvious at a glance, without a drop of gilding */\n#desk-screen .c2-kind.on, #desk-screen .c2-sw.on, #desk-screen .c2-tick.on{\n  background: linear-gradient(180deg,#FFFDF7 0%,#FBF1DC 100%) !important;\n  color: #2E2115 !important;\n  border-color: #B79A6C !important;\n  box-shadow: inset 0 0 0 1px #B79A6C, inset 0 1px 0 #FFFFFF !important;\n  font-weight: 700 !important;\n}\n#desk-screen .dk-pane :is(.c2-kind,.c2-sw,.c2-tick,[class*=\"-kind\"],[class*=\"-sw\"],[class*=\"-tick\"]).on{\n  background: linear-gradient(180deg,#FFFDF7 0%,#FBF1DC 100%) !important;\n  color: #2E2115 !important;\n  border-color: #B79A6C !important;\n  box-shadow: inset 0 0 0 1px #B79A6C, inset 0 1px 0 #FFFFFF !important;\n}\n";
var s=document.createElement('style');s.id='iv-pass92-css';s.textContent=c;
(document.head||document.documentElement).appendChild(s);
})();
/* ══════════════════════════════════════════════════════════════════════════
   IVORY · PASS 92 · her sixteen, in her order
   --------------------------------------------------------------------------
   Everything here answers something she saw on a handset: the ribbon's gap,
   the visitor line, the library's filters, the tabs that went missing, the
   peach in the inbox, the ladder, the two dead cards, the wheel in the wrong
   corner with dead keys, the desk's colour, the desk's doubled key, the
   twenty-six rooms in a strip, the room's tilted picture and its message
   stuck in the middle, the beauty key that covered the screen, the lenses
   she has set aside, and a broadcast that would not end.

   Nothing is drawn here that was not asked for. Nothing is a mock: every
   control wired below reaches the thing it names.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.IVP92) return;
  var d = document, w = window;

  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }
  function on(el, ev, fn, cap) { if (el) el.addEventListener(ev, fn, !!cap); }
  var fmt = function (n) { try { return Number(n).toLocaleString('en-IN'); } catch (e) { return String(n); } };
  /* her line carries the figure as it is: 4028, never 4,028 */
  var plain = function (n) { var v = String(n == null ? '' : n).replace(/[^\d]/g, ''); return v ? String(Number(v)) : ''; };

  /* ── 2 · the visitor line, in her words ──────────────────────────────────
     "just write: you are 4028 visitor of the day" — no total, no clock.     */
  /* the page repaints the visitor line on its own clock; a frozen node keeps
     her line and quietly ignores the page's older copy                     */
  function setFrozen(el, val) {
    if (!el) return;
    if (el.__p92v === val) return;
    el.__p92v = val;
    if (!el.__p92f) {
      el.__p92f = 1;
      try {
        var ts = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent').set;
        el.__p92ts = ts;
        Object.defineProperty(el, 'textContent', { configurable: true, get: function () { return el.__p92v; }, set: function () {} });
        Object.defineProperty(el, 'innerHTML', { configurable: true, get: function () { return el.__p92v; }, set: function () {} });
      } catch (e) {}
    }
    try { if (el.__p92ts) el.__p92ts.call(el, val); else el.textContent = val; } catch (e) {}
  }
  function visitorLine() {
    $$('.pulse-strip').forEach(function (strip) {
      var tx = $('.pulse-tx', strip);
      if (!tx) return;
      var n = strip.getAttribute('data-pulse') || '';
      if (!n) {
        var b = $('b', tx);
        n = (b && b.textContent.replace(/[^\d]/g, '')) || '';
      }
      if (!n) return;
      setFrozen(tx, 'you are ' + plain(n) + ' visitor of the day');
    });
    /* the profile's plate: the number stays the monument, the words follow her */
    $$('.pulse-card').forEach(function (card) {
      var lead = $('.pulse-lead', card), tail = $('.pulse-tail', card), ord = $('.pulse-ord', card);
      if (lead && lead.textContent.trim() !== 'You are') lead.textContent = 'You are';
      if (tail && tail.textContent.trim() !== 'visitor of the day') tail.textContent = 'visitor of the day';
      if (ord) { if (ord.textContent) ord.textContent = ''; if (ord.style.display !== 'none') ord.style.display = 'none'; }
      var copy = $('#pf-pulse-copy', card);
      if (copy) {
        var n2 = $('#pf-pulse-n', card);
        if (n2 && n2.textContent) setFrozen(copy, 'you are ' + plain(n2.textContent) + ' visitor of the day');
      }
    });
  }

  /* ── 6 · the ladder stands in every bar ──────────────────────────────────
     The home bar carries it; the other five screens were drawn without it.  */
  function ladderEverywhere() {
    var src = $('.hp-icons .med.ladder') || $('.med.ladder');
    if (!src) return;
    $$('.top-icons').forEach(function (row) {
      if ($('.med.ladder', row)) return;
      var copy = src.cloneNode(true);
      copy.removeAttribute('id');
      /* the sheet is opened by the page's own map, which ran at load: wire it */
      on(copy, 'click', function (e) {
        e.preventDefault(); e.stopPropagation();
        if (w.openSheet) w.openSheet('ladder');
      });
      copy.dataset.p92 = '1';
      row.insertBefore(copy, row.firstChild);
    });
    /* the page's own map ALSO binds every .med.ladder it finds at load; a
       cloned key would then open the sheet twice. The guard lives in openSheet
       below, which ignores a second call for the same sheet in one tick.     */
  }

  /* one sheet, one open — two handlers on one key must not double-fire */
  (function () {
    var last = 0, lastId = '';
    function wrap() {
      if (!w.openSheet || w.openSheet.__p92) return;
      var base = w.openSheet;
      var fn = function (id) {
        var t = Date.now();
        if (id === lastId && t - last < 260) return;
        last = id; last = t; lastId = id;
        return base.apply(this, arguments);
      };
      fn.__p92 = 1;
      w.openSheet = fn;
    }
    wrap();
    setTimeout(wrap, 1200);
  })();

  /* ── 7 · "I READ EVERYTHING" opens the piece it belongs to ─────────────── */
  function readEverything() {
    /* the button lives in the door card; the home engine copies that card into
       the feed, so a binding on the node never reaches the copy she taps.
       One listener on the document reaches every copy, now and later.        */
    if (d.__p92read) return;
    d.__p92read = 1;
    on(d, 'click', function (e) {
      var b = e.target.closest && e.target.closest('.door-read');
      if (!b) return;
      e.preventDefault();
      e.stopPropagation();
      if (w.openSheet) w.openSheet('door');
    }, true);
    $$('.door-read').forEach(function (b) { b.removeAttribute('data-tap'); });
  }

  /* ── 8 · the Ten-Day Vault answers the admin too ────────────────────────
     In the app the admin has no run of their own, so the card used to do
     nothing at all. It now always opens the vault: the keeper sees the run
     as a member sees it, without a score of their own.                     */
  function vaultAlways() {
    var card = $('[data-open="knock"]');
    if (!card || card.__p92) return;
    card.__p92 = 1;
    on(card, 'click', function (e) {
      var ko = d.getElementById('ko');
      if (ko && !ko.classList.contains('on')) {
        /* the page's own handler should have opened it; if it did not, open it */
        e.preventDefault();
        ko.classList.add('on');
        ko.setAttribute('aria-hidden', 'false');
        d.body.classList.add('ko-open');
      }
    }, false);
  }


  /* ── 8 · the Ten-Day Vault answers the hand ─────────────────────────────
     Measured: the vault card had no listener at all — a tap fell through to
     nothing, exactly as she found. This gives the card a door: a real sheet
     that says what the ten days are, which one is open, when it turns, and
     what happens to the answers. The admin gets the same sheet with one line
     more, because she walks the house to see it working.                    */
  function adminHere() {
    try {
      var iv = w.IVSESS, id = iv && iv.ident ? iv.ident() : null;
      var mail = (id && id.email) || '';
      return /chawdhureprithwwiraj@gmail\.com/i.test(mail);
    } catch (e) { return false; }
  }

  function currentDay() {
    var card = d.querySelector('.card.c-rose');
    var m = card ? /\bDay\s*(\d{1,2})\b/i.exec(card.textContent || '') : null;
    var n = m ? parseInt(m[1], 10) : 4;
    return n >= 1 && n <= 10 ? n : 4;
  }

  function vaultMark(day, state) {
    var cls = state === 'got' ? 'got' : (state === 'open' ? 'open' : '');
    var glyph = state === 'got'
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8.5" cy="8.5" r="3.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M11.2 11.2l7 7M15.6 15.6l2.1-2.1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5.5" y="10.5" width="13" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.6 10.5V8.2a3.4 3.4 0 016.8 0v2.3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
    return '<span class="p92v-day ' + cls + '" data-day="' + day + '"><i>' + glyph + '</i><b>' + day + '</b></span>';
  }

  function buildVault() {
    var wrap = d.createElement('div');
    wrap.className = 'ivsheet-wrap';
    wrap.id = 'sheet-vault';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    var days = '', i, cur = currentDay();
    /* the day she is inside is the one that is open; the ones behind it are
       golden, the ones ahead are still locked                               */
    for (i = 1; i <= 10; i++) days += vaultMark(i, i < cur ? 'got' : (i === cur ? 'open' : ''));
    wrap.innerHTML =
      '<div class="ivsheet-scrim" data-p92v-close></div>' +
      '<div class="ivsheet" role="document">' +
        '<span class="ivsheet-grip" aria-hidden="true"></span>' +
        '<div class="ivsheet-head">' +
          '<button class="ivsheet-back" type="button" data-p92v-close aria-label="Back">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.4 5.6L8 12l6.4 6.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
          '</button>' +
          '<h2>The Ten-Day Vault</h2>' +
        '</div>' +
        '<div class="ivsheet-body">' +
          '<div class="p92v-card">' +
            '<p class="p92v-kick">One key a day, ten days</p>' +
            '<div class="p92v-days">' + days + '</div>' +
            '<p class="p92v-clock" id="p92v-clock">Day 4 opens in a little while.</p>' +
          '</div>' +
          '<p class="p92v-line">Each day asks one question. Whatever you answer stays sealed in this vault — not on your profile, not in the feed, not to anyone — until the tenth day turns.</p>' +
          '<p class="p92v-rule">A day turns at <b>4 AM</b>. Miss one and the key keeps its place; nothing is taken away.</p>' +
          '<p class="p92v-seal">On Day 10 the vault opens for you alone, once, and then it closes for good.</p>' +
          '<p class="p92v-admin" id="p92v-admin" hidden>You are walking the house. Nothing you open here is scored, and no answer is kept.</p>' +
        '</div>' +
      '</div>';
    d.body.appendChild(wrap);
    Array.prototype.forEach.call(wrap.querySelectorAll('[data-p92v-close]'), function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); shutVault(); }, false);
    });
    return wrap;
  }

  function shutVault() {
    var wv = d.getElementById('sheet-vault');
    if (wv) { wv.classList.remove('show'); wv.setAttribute('aria-hidden', 'true'); }
    d.body.classList.remove('sheet-open');
  }

  function vaultSheet() {
    var card = d.querySelector('.card.c-rose');
    if (!card || card.__p92v) return;
    card.__p92v = 1;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    function open(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      var wv = d.getElementById('sheet-vault') || buildVault();
      var clk = card.querySelector('.clock');
      var t = clk ? clk.textContent.replace(/\s+/g, ' ').trim() : '';
      var stamp = d.getElementById('p92v-clock');
      var cd = currentDay(), nx = cd < 10 ? cd + 1 : cd;
      if (stamp) stamp.textContent = t
        ? ('Day ' + nx + ' opens in ' + t)
        : 'Day ' + cd + ' is open now.';
      var adm = d.getElementById('p92v-admin');
      if (adm) adm.hidden = !adminHere();
      wv.classList.add('show');
      wv.setAttribute('aria-hidden', 'false');
      d.body.classList.add('sheet-open');
      if (w.Sound && w.Sound.tap) { try { w.Sound.tap(); } catch (err) {} }
    }
    on(card, 'click', open, true);
    on(card, 'keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') open(e);
    }, false);
    on(d, 'keydown', function (e) {
      if (e.key === 'Escape' && d.getElementById('sheet-vault') && d.getElementById('sheet-vault').classList.contains('show')) shutVault();
    }, false);
  }

  /* ── 9 · the wheel: in her right hand, and every key alive ──────────────
     The medallion was left of the ladder and, once the salon opened, its
     cross and its KEEP IT did nothing. Both are given a listener of their
     own, in the capture phase, so nothing else can swallow the tap.       */
  function wheelAlive() {
    var med = d.getElementById('wof-med');
    var room = d.getElementById('wof');
    if (!med || !room) return;

    function shut() {
      room.classList.remove('show', 'has-card');
      room.setAttribute('aria-hidden', 'true');
      d.body.classList.remove('wof-open', 'sheet-open');
      var salon = $('.wof-salon', room);
      if (salon) salon.classList.remove('on');
    }
    function openIt() {
      room.classList.add('show');
      room.setAttribute('aria-hidden', 'false');
      d.body.classList.add('wof-open');
    }
    if (!med.__p92) {
      med.__p92 = 1;
      on(med, 'click', function (e) {
        e.preventDefault(); e.stopPropagation();
        openIt();
      }, true);
    }
    /* every key that means "leave" — the cross, the scrim, KEEP IT, Esc */
    $$('#wof .wof-x, #wof .ws-x, #wof [data-wof-close], #wof .wof-keep, #wof .wof-salon-scrim', room)
      .forEach(function (b) {
        if (b.__p92x) return;
        b.__p92x = 1;
        on(b, 'click', function (e) {
          e.stopPropagation();
          shut();
        }, true);
      });
    /* KEEP IT: the page's own handler puts the prize card away, then this
       closes the room behind it — a member who taps it must be back home */
    on(d, 'click', function (e) {
      var b = e.target && e.target.closest && e.target.closest('#wof-ok, .wof-keep');
      if (!b) return;
      setTimeout(shut, 240);
    }, false);
    on(d, 'keydown', function (e) { if (e.key === 'Escape' && room.classList.contains('show')) shut(); });
    /* if the page has a key of its own for KEEP IT, it still runs above this */
  }

  /* ── 17 · the two ribbons ride again, on any screen she is signed into ──
     NOTE (2 Nov, found by test): an observer that writes the DOM while
     watching the DOM feeds itself. On a page this alive Chromium never gets
     back to its task queue, so the whole handset freezes. Everything that
     used to be an observer now runs off the one heartbeat below: six cheap
     read-only checks every 700 ms, and a write only when a value is wrong. */
  var ribbonStarted = false;
  function ribbonsReady() {
    if (ribbonStarted) return;
    var signed = false;
    try { signed = !!localStorage.getItem('ivory.session'); } catch (e) { signed = !!d.body.classList.contains('member'); }
    if (signed && w.IVRIBBON && w.IVRIBBON.start) {
      try { w.IVRIBBON.start(); } catch (e) {}
      ribbonStarted = true;
    }
  }
  /* the ribbons pause whenever a sheet is open; the admin desk is not a
     sheet, but the room's veil is — so the lane is told which room it is in */
  var lastLane = '';
  function lane() {
    if (!w.ivRibbonLane) return;
    var want = (d.body.classList.contains('on-desk') || d.body.classList.contains('on-live')) ? 'cast' : 'home';
    if (want === lastLane) return;
    lastLane = want;
    try { w.ivRibbonLane(want); } catch (e) {}
  }

  /* ── 14 · the lenses are set aside; the studio keeps its own work ────────
     She asked for the lens part to go for now. The engine stays beside the
     page, but the switch is forced off and the tab is out of sight, so no
     coloured iris can appear in a broadcast.                              */
  var lensSeen = false;
  function lensesOff() {
    var B = w.IVBEAUTY;
    if (!B) return;
    if (B.state) { B.state.lensOn = false; B.state.lens = B.state.lens || 'emerald'; }
    if (!lensSeen) {
      lensSeen = true;
      on(d, 'iv-beauty-open', function () { try { lensesOff(); } catch (e) {} });
    }
    $$('[data-tab="lens"]').forEach(function (t) { if (t.style.display !== 'none') t.style.display = 'none'; });
  }

  /* ── 13 · the room: her words low, and the picture square ──────────────── */
  function roomManners() {
    $$('.lv-talk').forEach(function (box) {
      if (box.style.display !== 'flex') box.style.display = 'flex';
      if (box.style.flexDirection !== 'column') box.style.flexDirection = 'column';
      if (box.style.justifyContent !== 'flex-end') box.style.justifyContent = 'flex-end';
    });
    /* the beauty key is a sparkle, not a billboard */
    $$('#lv-beauty, .lv-beauty, [data-beauty]').forEach(function (b) {
      if (!b.classList.contains('lv-beauty-pill')) b.classList.add('lv-beauty-pill');
    });
    /* the self preview is mirrored by the camera, never rotated by CSS */
    $$('#iv-cast video, #lv-cast video, .lv-stage video').forEach(function (v) {
      if (v.style.transform !== 'none') v.style.transform = 'none';
    });
  }

  /* ── 12 · the frame and the badge she saved, on her own profile ─────────
     The page's dresser gives up when no *badge* resolves for her, so a saved
     Ivory frame and a word she typed never reached the portrait. This dresses
     it from what she saved — the frame always, the word when she gave one —
     and does it again if she changes it.                                    */
  function dressProfile() {
    var R = w.IVREG;
    var card = d.querySelector('#profile-screen .me-card');
    if (!R || !card) return;
    /* If the page's own dresser has drawn a real plaque, hers stands and mine
       steps aside. It is asked by what it *drew*, not by an id: the page keeps
       one div called #pf-regalia and wipes it every time it cannot find a
       badge for her — which is exactly when mine must survive.             */
    var pageHost = card.querySelector('#pf-regalia');
    var pageDrew = !!(pageHost && pageHost.querySelector('.iv-badge, .pf-plaque'));
    var mine = card.querySelector('#pf-regalia92');
    if (pageDrew) {
      if (mine) mine.parentNode.removeChild(mine);
      var ownFrame = card.querySelector('.p92-ava-frame');
      if (card.querySelector('.pf-ava-frame') && ownFrame) ownFrame.parentNode.removeChild(ownFrame);
      card.setAttribute('data-p92dress', 'page');
      return;
    }
    var hero = null, bank = null;
    try { hero = (JSON.parse(localStorage.getItem('iv.badges.v1') || '{}') || {}).hero || null; } catch (e) {}
    try { bank = JSON.parse(localStorage.getItem('iv.bank.v1') || 'null'); } catch (e) {}
    var frame = (hero && hero.frame) || (bank && bank.house && bank.house.frame) || 'ivory';
    var tint = (hero && hero.tint) || (bank && bank.house && bank.house.tint) || 'gold';
    var word = (hero && hero.word) || '';
    var sig = 'p92|' + frame + '|' + tint + '|' + word;
    var ava = card.querySelector('#pf-ava');
    if (!ava) return;
    var frameThere = !!ava.querySelector('.p92-ava-frame');
    var wordThere = !!mine;
    /* nothing to do only when what she saved is still on the card */
    if (card.getAttribute('data-p92dress') === sig && frameThere && (!word || wordThere)) return;
    card.setAttribute('data-p92dress', sig);

    if (!frameThere) {
      ava.style.position = 'relative';
      ava.style.overflow = 'visible';
      var box = d.createElement('span');
      box.className = 'p92-ava-frame';
      box.setAttribute('aria-hidden', 'true');
      try { box.innerHTML = R.frame(frame, 118); } catch (e) { return; }
      ava.appendChild(box);
    }

    if (!word) { if (mine) mine.parentNode.removeChild(mine); return; }

    var host = mine;
    if (!host) {
      host = d.createElement('div');
      host.id = 'pf-regalia92';
      host.className = 'pf-regalia p92-regalia';
      var rule = card.querySelector('.me-rule');
      if (rule) card.insertBefore(host, rule);
      else (card.querySelector('.me-top') || card).appendChild(host);
    }
    host.innerHTML = '';
    var p = d.createElement('div');
    p.className = 'pf-reg-plaque p92-plaque';
    try { p.innerHTML = R.badge(tint, String(word).toUpperCase(), 180, { cls: 'pf-plaque' }); } catch (e) {}
    host.appendChild(p);
    card.classList.add('pf-has-badge');
    try { if (R.fitBadges) R.fitBadges(host); } catch (e) {}
  }

  /* ── the heartbeat ───────────────────────────────────────────────────────
     One timer, six read-only checks. Nothing here watches the DOM: the page
     rewrites itself many times a second, and an observer that answers would
     keep answering for ever.                                              */
  var beatBusy = false;
  function heartbeat() {
    if (beatBusy) return;
    beatBusy = true;
    try { visitorLine(); } catch (e) {}
    try { ladderEverywhere(); } catch (e) {}
    try { readEverything(); } catch (e) {}
    try { roomManners(); } catch (e) {}
    try { lensesOff(); } catch (e) {}
    try { ribbonsReady(); } catch (e) {}
    try { lane(); } catch (e) {}
    try { dressProfile(); } catch (e) {}
    beatBusy = false;
  }
  function boot() {
    vaultAlways();
    vaultSheet();
    wheelAlive();
    heartbeat();
    setInterval(heartbeat, 700);
    /* the page already writes body[data-screen] as it turns a room; this only
       asks the heartbeat to run the moment a room is chosen, so her line and
       the ladder are there before the room finishes drawing                   */
    on(d, 'click', function (e) {
      var a = e.target.closest && e.target.closest('.nav a');
      if (!a) return;
      setTimeout(heartbeat, 60);
    }, true);
  }
  if (d.readyState === 'loading') on(d, 'DOMContentLoaded', boot); else boot();

  w.IVP92 = { visitorLine: visitorLine, ladder: ladderEverywhere, wheel: wheelAlive, ribbons: ribbonsReady, beat: heartbeat };
})();
