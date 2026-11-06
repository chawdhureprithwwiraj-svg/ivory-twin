/* Pass 92 - her sixteen. The page carries one line of this file; this file
   carries the skin and the manners, so the house never grows past its size. */
(function(){var c="/* ══════════════════════════════════════════════════════════════════════════\n   PASS 92 · HER SIXTEEN, IN HER ORDER\n   The house after her first walk through it on a handset: the ribbon to the\n   edges, the visitor line in her words, the library's filters whole, the tabs\n   never missing, the inbox's peach breathing, the ladder in every bar, the\n   wheel back in the corner, and a desk in the house's own colours.\n   Every rule here is a correction of something she saw, nothing else.\n   ══════════════════════════════════════════════════════════════════════════ */\n\n/* ── 1 · the gold ribbon reaches both edges, always ─────────────────────── */\n/* the ticker under the bar is the ribbon she means: it was drawn inside the\n   page's 16 px gutter, so the last 16 px of the glass stayed bare and the\n   gap seemed to breathe as the words moved. It is taken out of the gutter. */\n/* the strip already spans the glass; what pulled it off the right edge was a\n   parallax translate the page sets every frame — a few px of drift that read\n   as a white gap that grew and shrank. The strip stands still now. */\n.hp-ticker, .hp-ticker.iv-parallax{\n  transform: none !important;\n  left: 0 !important;\n  will-change: auto !important;\n}\n.hp-ticker{\n  /* the honest full-bleed: the strip is 100vw wide and pulled out by exactly\n     half the gutter it sits in, so both edges land on the glass */\n  margin-left: calc((100% - 100vw) / 2) !important;\n  margin-right: calc((100% - 100vw) / 2) !important;\n  width: 100vw !important;\n  max-width: 100vw !important;\n  border-radius: 0 !important;\n  box-sizing: border-box;\n}\n.hp > .ribbon, .ribbon.ribbon-edge {\n  margin-left: calc((100% - 100vw) / 2) !important;\n  margin-right: calc((100% - 100vw) / 2) !important;\n  width: 100vw !important;\n  max-width: 100vw !important;\n  border-radius: 0 !important;\n  border-left: 0 !important; border-right: 0 !important;\n  box-sizing: border-box;\n}\n/* the fade at the ends was reading as a white gap on the right;\n   the mask goes edge to edge, with only a breath at each tip */\n.ribbon .track{\n  -webkit-mask-image: linear-gradient(90deg,#000 0,#000 99.2%,transparent 100%) !important;\n  mask-image: linear-gradient(90deg,#000 0,#000 99.2%,transparent 100%) !important;\n  border-radius: 0 !important;\n}\n.ribbon .flow{\n  padding-left: 0 !important;\n  animation-duration: 34s !important;\n}\n.ribbon .track{ overflow: hidden; }\n\n/* ── 2 · the visitor line, in her words ────────────────────────────────── */\n/* one line, nothing else after it */\n.pulse-strip .pulse-tx{ letter-spacing: .01em; }\n.pulse-strip .pulse-tx b{ font-weight: 800; }\n.pulse-card .pulse-tail{ text-transform: none; }\n\n/* ── 3 · the library's filters: one calm row, never a pile ──────────────── */\n.lib-chips{\n  display: flex !important;\n  flex-wrap: nowrap !important;\n  align-items: center;\n  gap: 9px !important;\n  overflow-x: auto !important;\n  overflow-y: hidden;\n  padding: 4px 16px 8px !important;\n  margin: 14px -16px 0 !important;\n  scroll-snap-type: x proximity;\n  -webkit-overflow-scrolling: touch;\n}\n.lib-chips .chip, #lib-chips .chip, .chip{\n  position: static !important;\n  flex: 0 0 auto !important;\n  width: auto !important;\n  min-width: 0 !important;\n  height: auto !important;\n  min-height: 36px !important;\n  padding: 0 16px !important;\n  display: inline-flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  white-space: nowrap !important;\n  font-size: 12.5px !important;\n  line-height: 1 !important;\n  border-radius: 999px !important;\n  scroll-snap-align: start;\n  transform: none;\n}\n.lib-chips .chip.on, #lib-chips .chip.on{ transform: none; }\n@media (max-width:380px){\n  /* the old rule shrank every filter into a 33 px dot and they piled up */\n  .lib-chips .chip{ width: auto !important; height: auto !important; }\n  .lib-chips .chip svg{ width: auto; height: auto; }\n}\n\n/* ── 4 · the six tabs are there on all six screens ──────────────────────── */\nbody[data-screen=\"wish\"] .nav,\nbody[data-screen=\"premium\"] .nav,\nbody[data-screen=\"inbox\"] .nav,\nbody[data-screen=\"profile\"] .nav{ display: grid !important; }\n/* and never over a full-screen room */\nbody.on-live .nav, body.on-desk .nav, body.cast-live .nav{ display: none !important; }\n/* the screens keep their last inch clear for the bar */\n#wish-screen, #premium-screen, #inbox-screen, #profile-screen{\n  padding-bottom: calc(86px + env(safe-area-inset-bottom, 0px));\n}\n\n/* ── 5 · the inbox's word from the house: a peach that breathes ─────────── */\n.ibx-card.note{\n  position: relative;\n  background:\n    radial-gradient(120% 150% at 16% -30%, rgba(255,255,255,.85) 0%, rgba(255,255,255,0) 52%),\n    radial-gradient(90% 120% at 88% 118%, rgba(255,146,96,.55) 0%, rgba(255,146,96,0) 60%),\n    linear-gradient(158deg, #FFD9BC 0%, #FFC39C 26%, #F79B72 58%, #E97F58 100%) !important;\n  border-color: rgba(190,86,44,.42) !important;\n  box-shadow:\n    inset 0 1px 0 rgba(255,255,255,.92),\n    inset 0 -14px 26px -18px rgba(160,58,20,.55),\n    0 12px 26px -18px rgba(150,64,26,.75) !important;\n  overflow: hidden;\n}\n/* one slow shine crosses it, so the peach is lit rather than painted */\n.ibx-card.note::after{\n  content:\"\"; position:absolute; inset:-40% -60%;\n  background: linear-gradient(104deg, transparent 38%, rgba(255,255,255,.55) 47%, rgba(255,255,255,.08) 54%, transparent 63%);\n  transform: translate3d(-70%,0,0);\n  animation: ivPeach 7.6s cubic-bezier(.4,0,.2,1) infinite;\n  pointer-events: none; mix-blend-mode: screen;\n}\n@keyframes ivPeach{ 0%,26%{transform:translate3d(-70%,0,0)} 70%,100%{transform:translate3d(70%,0,0)} }\n.ibx-card.note .ic-body h3{ color:#4A1508 !important; }\n.ibx-card.note .ic-body p{ color:#6B2A14 !important; }\n.ibx-card.note .ic-eb{ color:#8A3412 !important; }\n.ibx-card.note .ic-time{ color:#8A4A2C !important; }\n.ibx-card.note .ic-mega{\n  background: radial-gradient(circle at 34% 26%, #FFF6E6, #FFD3AE 52%, #F09668 100%) !important;\n  box-shadow: inset 0 0 0 2px rgba(255,255,255,.92), 0 4px 10px -6px rgba(120,48,16,.8) !important;\n  color:#9A3C16 !important;\n}\n@media (prefers-reduced-motion: reduce){ .ibx-card.note::after{ animation:none; opacity:.5 } }\n\n/* ── 6 · the ladder stands in every bar, not only at home ───────────────── */\n.top-icons .med.ladder, .hp-icons .med.ladder{ order: -1; }\n.med.ladder{ width: 40px; height: 40px; }\n\n/* ── 9 · the wheel: a member always sees it, in her right hand ──────────\n   An earlier pass had switched the medallion off (a display:none rule);\n   that is why no screen ever showed it. It is put back for a member, and\n   only the desk and the room put it away. */\nbody.member .wof-med{ display: grid !important; }\nbody.on-desk .wof-med, body.on-live .wof-med, body.cast-live .wof-med{ display: none !important; }\n\n/* ── 9 · the wheel belongs in her right hand ────────────────────────────── */\n.wof-med{ left: auto !important; right: 16px !important;\n  bottom: calc(96px + env(safe-area-inset-bottom, 0px)) !important; }\nbody.on-desk .wof-med{ display: none !important; }\n\n/* ── 13 · the live room: her word sits low, the room stays quiet ──── */\n.lv-talk{ display: flex; flex-direction: column; justify-content: flex-end; }\n.lv-talkwrap{ height: min(34vh, 330px); }\n/* the broadcast camera: the preview is never turned, only mirrored */\n#lv-cast video, #lv-video, .lv-stage video, .lv-self video{ transform: none !important; }\n\n/* ── 16 · the two cards that were cut in half ───────────────────────────── */\n/* the Early Door and the Private Line sit on the same rail as the rest and\n   read at the same height; no more half-screen rooms inside a card */\n.hp-doorcard .card, .hp-tile{\n  display: flex; flex-direction: column;\n  min-height: 0; height: auto;\n}\n.hp-tile .tile-art, .hp-doorcard .card .card-art{ flex: 1 1 auto; min-height: 132px; max-height: 210px; }\n.hp-tile .tile-body, .hp-doorcard .card .card-in{ flex: 0 0 auto; }\n\n/* ═══════════════════════════════════════\n   10 · THE DESK, IN THE HOUSE'S OWN COLOURS — WITHOUT ITS WINE OR GOLD\n   Her words: \"remove all burgundy/red and gold; use exactly the member\n   application's colours, structure, for buttons/tabs/controls/everything.\"\n   So the desk is paper: cream ground, cocoa ink, one hairline, and a solid\n   ink key for the primary act — the same materials the member's own sheets\n   are made of. Not one red, not one gold, anywhere in the console.\n   ═══════════════════════════════════════ */\n#desk-screen{\n  background:\n    radial-gradient(120% 60% at 20% -10%, #FFFEFB 0%, rgba(255,254,251,0) 62%),\n    linear-gradient(172deg, #FBF7EC 0%, #F6EFDF 48%, #F1E8D3 100%) !important;\n  color: #3A2A1C !important;\n}\n#desk-screen::before{\n  background-image: radial-gradient(rgba(90,70,44,.055) 1px, transparent 1px) !important;\n}\n#desk-screen .dk-head{ background: transparent !important; border-bottom: 0 !important; box-shadow: none !important; }\n#desk-screen .dk-hair{ background: linear-gradient(90deg, rgba(58,42,28,0), rgba(58,42,28,.28), rgba(58,42,28,0)) !important; }\n#desk-screen .dk-name{ color: #2E2115 !important; }\n#desk-screen .dk-who{ color: #8A7660 !important; }\n#desk-screen .dk-badge{\n  background: #3A2A1C !important; color: #FFF9EC !important;\n  box-shadow: none !important; letter-spacing: .18em !important;\n}\n#desk-screen .dk-icon{\n  background: #FFFDF7 !important; color: #3A2A1C !important;\n  border: 1px solid #E2D3B6 !important; box-shadow: none !important;\n}\n#desk-screen .dk-crest{ background: #FFFDF7 !important; box-shadow: inset 0 0 0 1px #E2D3B6 !important; }\n#desk-screen .dk-crest i{ background: #FBF6EA !important; color: #3A2A1C !important; }\n\n/* the plate: a paper bar, hairline beneath */\n#desk-screen .dk-pane > .dk-plate{\n  background: rgba(251,247,236,.97) !important;\n  box-shadow: 0 1px 0 #E2D3B6 !important;\n}\n#desk-screen .dk-plate .dk-pico{\n  background: #FFFDF7 !important; color: #3A2A1C !important;\n  box-shadow: inset 0 0 0 1px #E2D3B6 !important;\n}\n#desk-screen .dk-plate .dk-pfam{ color: #3A2A1C !important; }\n\n/* type */\n#desk-screen .dk-h1{ color: #2E2115 !important; }\n#desk-screen .dk-h1 em{ color: #3A2A1C !important; }\n#desk-screen .dk-lede, #desk-screen .dk-note, #desk-screen .dk-empty{ color: #7C6A55 !important; }\n#desk-screen .dk-kick, #desk-screen .dk-label{ color: #8A7660 !important; }\n#desk-screen .dk-card .dk-note, #desk-screen .dk-card .dk-empty, #desk-screen .dk-card .dk-label,\n#desk-screen .dk-card .dk-kick{ color: #7C6A55 !important; }\n#desk-screen a{ color: #3A2A1C !important; text-decoration-color: #C9B99C !important; }\n\n/* cards: the member's own paper */\n#desk-screen .dk-card, #desk-screen .dk-sheet, #desk-screen .dk-tile,\n#desk-screen .dk-row-plate, #desk-screen .dk-rowcard{\n  background: #FFFDF7 !important;\n  border: 1px solid #E7D9BC !important;\n  color: #3A2A1C !important;\n  box-shadow: 0 10px 22px -20px rgba(74,54,30,.55) !important;\n}\n#desk-screen .dk-card.velvet{\n  background: #FBF4E4 !important; border-color: #E7D9BC !important;\n  box-shadow: 0 10px 22px -20px rgba(74,54,30,.55) !important;\n}\n#desk-screen .dk-rowcard b{ color: #2E2115 !important; }\n#desk-screen .dk-rowcard s, #desk-screen .dk-rowcard s.dk-when{ color: #8A7660 !important; }\n#desk-screen .dk-rowcard .dk-ico, #desk-screen .dk-rowcard i{\n  background: #F4EBDA !important; color: #3A2A1C !important; box-shadow: none !important;\n}\n/* inputs */\n#desk-screen input, #desk-screen textarea, #desk-screen select,\n#desk-screen .dk-input, #desk-screen .dk-select{\n  background: #FFFDF8 !important; color: #3A2A1C !important;\n  border: 1px solid #DCCAA6 !important; box-shadow: none !important;\n}\n#desk-screen input::placeholder, #desk-screen textarea::placeholder{ color: #A79680 !important; }\n#desk-screen input:focus, #desk-screen textarea:focus, #desk-screen select:focus,\n#desk-screen .dk-input:focus, #desk-screen .dk-select:focus{\n  border-color: #3A2A1C !important; box-shadow: 0 0 0 3px rgba(58,42,28,.12) !important; outline: none !important;\n}\n/* chips and segmented keys: paper, and ink when chosen */\n#desk-screen .dk-chip, #desk-screen [class*=\"-chip\"], #desk-screen .dk-seg > *{\n  background: #FFFDF7 !important; color: #5E4A36 !important;\n  border: 1px solid #E2D3B6 !important; box-shadow: none !important;\n}\n#desk-screen .dk-chip.on, #desk-screen [class*=\"-chip\"].on,\n#desk-screen .dk-seg > .on, #desk-screen [class*=\"seg\"] [aria-selected=\"true\"]{\n  background: #3A2A1C !important; color: #FFF9EC !important; border-color: #3A2A1C !important;\n}\n/* the keys: one solid ink for the primary act, paper for the rest */\n#desk-screen .dk-btn, #desk-screen button.dk-btn, #desk-screen .dk-go,\n#desk-screen .dk-pane button[type=\"submit\"]{\n  background: #3A2A1C !important; color: #FFF9EC !important;\n  border: 1px solid #3A2A1C !important;\n  box-shadow: 0 8px 18px -16px rgba(46,33,21,.9) !important; text-shadow: none !important;\n}\n#desk-screen .dk-btn.gold, #desk-screen .dk-btn.quiet, #desk-screen .dk-btn.ghost,\n#desk-screen .dk-pane .dk-quiet{\n  background: #FFFDF7 !important; color: #3A2A1C !important;\n  border: 1px solid #DCCAA6 !important; box-shadow: none !important;\n}\n#desk-screen .dk-btn[disabled], #desk-screen .dk-btn.off{\n  background: #F4EBDA !important; color: #A79680 !important; border-color: #E7D9BC !important;\n}\n/* the little state lights stop being lanterns */\n#desk-screen .dk-dot{ background: #3A2A1C !important; }\n#desk-screen .dk-live b{ color: #2E2115 !important; }\n#desk-screen .dk-live s, #desk-screen .dk-clock{ color: #7C6A55 !important; }\n#desk-screen .dk-err{ background: #FBF1E4 !important; border: 1px solid #E2CFAF !important; color: #6B5136 !important; }\n#desk-screen .dk-note.warn{ color: #6B5136 !important; }\n/* every family accent — dots, rails, underlines — goes quiet */\n#desk-screen, #desk-screen *, .dk-drawer, .dk-drawer *{ --fam: #C9B99C !important; }\n/* the drawer, in the same paper */\n.dk-drawer{\n  background: #FBF7EC !important; color: #3A2A1C !important;\n  border-right: 1px solid #E2D3B6 !important;\n  box-shadow: 26px 0 60px -30px rgba(58,42,28,.35) !important;\n}\n.dk-drawer .dk-dhead{ border-bottom: 1px solid #E2D3B6 !important; }\n.dk-drawer .dk-dhead b{ color: #2E2115 !important; }\n.dk-drawer .dk-dhead s{ color: #8A7660 !important; }\n.dk-drawer .dk-dshut{ background: #FFFDF7 !important; color: #3A2A1C !important; border: 1px solid #E2D3B6 !important; }\n.dk-drawer .dk-ditem{ color: #3A2A1C !important; background: transparent !important; }\n.dk-drawer .dk-ditem.on{ background: #F2EADA !important; color: #2E2115 !important; box-shadow: inset 3px 0 0 #3A2A1C !important; }\n.dk-drawer .dk-famhead{ color: #8A7660 !important; }\n.dk-drawer .dk-famhead s{ color: #A79680 !important; }\n.dk-veil, #dk-veil{ background: rgba(58,42,28,.22) !important; backdrop-filter: blur(2px); }\n\n/* ── the floor of every room ─────────────────────────────────────────────\n   The console's 26 rooms were drawn as light-gold words on wine. On paper\n   those words vanish. So: every word in a room is ink or its quiet sister,\n   no fill in a room is a gradient, and the components that need a body get\n   the member's paper and hairline back on top.                            */\n#desk-screen .dk-pane *{ background-image: none !important; }\n#desk-screen .dk-pane *:not(svg):not(path):not(circle):not(rect){ color: #3A2A1C !important; }\n#desk-screen .dk-pane :is(.dk-kick,.dk-label,.dk-lede,.dk-note,.dk-empty,.dk-who,small,s,em,i,time,.c2-pre,.c2-drop-draft){\n  color: #7C6A55 !important;\n}\n#desk-screen .dk-pane :is(.dk-card,.dk-sheet,.dk-tile,.dk-rowcard,.dk-row-plate,.dk-frame){\n  background: #FFFDF7 !important;\n  border: 1px solid #E7D9BC !important;\n  box-shadow: 0 10px 22px -20px rgba(74,54,30,.55) !important;\n  border-radius: 16px;\n}\n#desk-screen .dk-pane :is(input,textarea,select,.dk-input,.dk-select){\n  background: #FFFDF8 !important; border: 1px solid #DCCAA6 !important;\n}\n/* the kinds, the switches, the seal — the same three manners as the header */\n#desk-screen .dk-pane :is(.c2-kind,.c2-sw,.c2-tick,.dk-chip,[class*=\"-kind\"],[class*=\"-sw\"],[class*=\"-seg\"] > *){\n  background: #FFFDF7 !important; color: #5E4A36 !important;\n  box-shadow: inset 0 0 0 1px #E2D3B6 !important; border: 0 !important;\n}\n#desk-screen .dk-pane :is(.c2-kind,.c2-sw,.c2-tick,[class*=\"-kind\"],[class*=\"-sw\"]).on,\n#desk-screen .dk-pane :is(.dk-chip)[aria-selected=\"true\"]{\n  background: #3A2A1C !important; color: #FFF9EC !important;\n  box-shadow: none !important;\n}\n#desk-screen .dk-pane :is(.c2-kind,.c2-sw,.c2-tick).on *,\n#desk-screen .dk-pane .dk-chip[aria-selected=\"true\"] *{ color: #FFF9EC !important; }\n#desk-screen .dk-pane .c2-seal{\n  background: #3A2A1C !important; color: #FFF9EC !important;\n  box-shadow: 0 12px 26px -20px rgba(46,33,21,.85) !important;\n}\n#desk-screen .dk-pane .c2-seal *{ color: #FFF9EC !important; }\n#desk-screen .dk-pane .c2-seal:active{ transform: translateY(1px); }\n/* a hairline wherever the desk drew a coloured edge */\n#desk-screen .dk-pane [style*=\"border\"]{ border-color: #E7D9BC; }\n#desk-screen .dk-pane :is(hr,.dk-hair,.dk-rule){ background: #E7D9BC !important; }\n/* the little red/gold dots that mark a live thing */\n#desk-screen .dk-pane :is(.dk-dot,[class*=\"dot\"]){ background: #3A2A1C !important; }\n\n/* the champagne key that carries her in and out of the desk — the only key\n   left on the console — takes the desk's own paper and ink, so nothing gold\n   sits over a paper desk                                               */\nbody.on-desk .iv-admin-crest{\n  background: #FFFDF7 !important;\n  border: 1px solid #E2D3B6 !important;\n  box-shadow: 0 6px 16px -12px rgba(58,42,28,.7) !important;\n}\nbody.on-desk .iv-admin-crest .iv-admin-ring{\n  background: #F2EADA !important; color: #3A2A1C !important;\n  box-shadow: inset 0 0 0 1px #DCCAA6 !important;\n}\nbody.on-desk .iv-admin-crest svg, body.on-desk .iv-admin-crest svg *{\n  stroke: #3A2A1C !important; fill: none !important; color: #3A2A1C !important;\n}\n\n/* ── 11 · the twenty-six rooms live in the drawer alone ────────────────── */\n#desk-screen .dk-ribbon, #desk-screen .dk-fams{ display: none !important; }\n/* ── 10b · one key, not two: the champagne key opens the desk, so the\n   console's own power key is gone ─────────────────────────────────────── */\n#dk-exit{ display: none !important; }\n\n/* ── 12 · the saved frame sits around her face, not behind the card's edge ─ */\n#profile-screen .me-card .p92-ava-frame{\n  position: absolute; inset: -17px; pointer-events: none; z-index: 2;\n  display: grid; place-items: center;\n}\n#profile-screen .me-card .p92-ava-frame .iv-frame{ width: 100% !important; height: 100% !important; }\n#profile-screen .me-card .me-top{ position: relative; }\n#profile-screen .me-card #pf-ava{ position: relative; z-index: 1; }\n#profile-screen .me-card .p92-plaque{ display: flex; justify-content: center; margin: 6px 0 2px; }\n\n\n/* ═══════════════════════════════════════\n   16 · THE THREE DOOR CARDS, COMPOSED\n   She read the Golden Knock-off, the Early Door and the Private Line as\n   \"half-screen, half-gone\". Measured, their content does fit; what made them\n   read as broken was the struck line at 11.8 px in cream on gold, and the\n   three cards taking three different rhythms. So: the strike is drawn as a\n   strike, not as damage; the copy keeps one measure on all three; and each\n   card ends on the same beat.\n   ═══════════════════════════════════════ */\n#home-screen .card .lede.crossed,\n#home-screen .card.c-gold .lede,\n#home-screen .card.c-plum .lede,\n#home-screen .card.c-line .lede{\n  color: #FFF6E2 !important;\n  opacity: 1 !important;\n  font-size: 12.2px !important;\n  line-height: 1.45 !important;\n  text-decoration-color: rgba(255,246,226,.9) !important;\n  text-decoration-thickness: 1px !important;\n}\n#home-screen .card.c-gold .card-in,\n#home-screen .card.c-plum .card-in,\n#home-screen .card.c-line .card-in{\n  padding: 17px 18px 18px !important;\n  display: flex; flex-direction: column;\n}\n#home-screen .card.c-gold .title,\n#home-screen .card.c-plum .title,\n#home-screen .card.c-line .title{\n  font-size: 23px !important;\n  line-height: 1.12 !important;\n  margin: 4px 0 9px !important;\n}\n#home-screen .card .kicker{ margin-top: 10px !important; }\n#home-screen .card .clock{ margin: 4px 0 8px !important; }\n#home-screen .hp-feed > .card{ margin-bottom: 16px !important; }\n/* ═══════════════════════════════════════\n   16b · THE STORY CARDS, COMPOSED\n   Measured before this pass: the gold card carried 26 px of dead height from\n   three sparkles left in the flow; the Early Door put its copy in the top\n   115 px of a 204 px card, so its lower half was bare film (\"half-gone\"); the\n   Ten-Day ring spun across its own headline; and the last card ran under the\n   wheel. One skeleton now — copy rests on the card's base, one type scale, one\n   measure — and every card ends where its words end.\n   ═══════════════════════════════════════ */\n#home-screen .hp-feed{ padding-bottom: 118px !important; }\n\n#home-screen .hp-feed .card.c-gold .card-in,\n#home-screen .hp-feed .card.c-rose .card-in,\n#home-screen .hp-feed .card.c-plum .card-in,\n#home-screen .hp-feed .card.c-line .card-in{\n  display: flex !important; flex-direction: column !important;\n  justify-content: flex-end !important;\n  padding: 18px 18px 17px !important;\n}\n#home-screen .hp-feed .card.c-gold .eyebrow,\n#home-screen .hp-feed .card.c-rose .eyebrow,\n#home-screen .hp-feed .card.c-plum .eyebrow,\n#home-screen .hp-feed .card.c-line .eyebrow{\n  font-size: 9px !important; letter-spacing: .19em !important; line-height: 1.45 !important;\n  margin: 0 0 7px !important;\n}\n#home-screen .hp-feed .card.c-gold .title,\n#home-screen .hp-feed .card.c-rose .title,\n#home-screen .hp-feed .card.c-plum .title,\n#home-screen .hp-feed .card.c-line .title{\n  font-size: 23px !important; line-height: 1.07 !important; margin: 0 0 8px !important;\n}\n#home-screen .hp-feed .card.c-gold .lede,\n#home-screen .hp-feed .card.c-rose .lede,\n#home-screen .hp-feed .card.c-plum .lede,\n#home-screen .hp-feed .card.c-line .lede{\n  font-size: 12.3px !important; line-height: 1.5 !important; max-width: 272px !important;\n}\n\n/* the gold card: the sparkles take no line, and the note closes the card */\n#home-screen .card.c-gold .tw{ position: absolute !important; }\n#home-screen .card.c-gold .kicker{ margin: 8px 0 3px !important; }\n#home-screen .card.c-gold .note{ margin: 9px 0 0 !important; max-width: 268px !important; }\n#home-screen .card.c-gold .card-in{ padding-bottom: 16px !important; }\n\n/* the ten-day ring becomes a wreath around the key, not a screen over the word */\n#home-screen .hp-feed .card.c-rose .tenring{\n  left: auto !important; right: -6px !important; top: -12px !important;\n  margin-left: 0 !important;\n  width: 104px !important; height: 104px !important;\n  opacity: .78 !important; z-index: 2 !important;\n}\n#home-screen .card.c-rose .key-ring{ z-index: 3 !important; }\n#home-screen .card.c-rose .vaultfoot{ margin-top: 13px !important; }\n#home-screen .card.c-rose .note{ max-width: 262px !important; }\n\n/* the Early Door and the Private Line: one base, one height, one measure */\n#home-screen .card.c-plum .card-in,\n#home-screen .card.c-line .card-in{ min-height: 242px !important; }\n#home-screen .card.c-plum .ivf-scrim{\n  background:\n    linear-gradient(180deg, rgba(6,14,26,.05) 0%, rgba(6,12,22,.20) 36%, rgba(5,10,18,.78) 76%, rgba(4,8,15,.92) 100%),\n    linear-gradient(90deg, rgba(6,12,22,.40) 0%, rgba(6,12,22,0) 56%) !important;\n}\n#home-screen .card.c-plum .lede{ max-width: 252px !important; }\n#home-screen .card.c-line .lede{ max-width: 248px !important; }\n#home-screen .hp-feed .card.c-plum .note,\n#home-screen .hp-feed .card.c-line .note{\n  font-size: 11px !important; line-height: 1.45 !important; max-width: 250px !important; margin-top: 9px !important;\n}\n\n/* the seal: the title steps around its own seal */\n#home-screen .card.c-seal .title{\n  padding-right: 92px !important; font-size: 22px !important; line-height: 1.16 !important;\n}\n\n/* the wheel wears gold, not a sweet */\n#wof-med .wof-orbit{\n  background: conic-gradient(from 0deg, #FFF4D6, #E7C074, #B98733, #FFE7B4, #FFF4D6) !important;\n  opacity: .9 !important;\n}\n\n/* ═══════════════════════════════════════\n   22 · THE DESK, DRESSED IN THE MEMBER'S OWN CLOTHES\n   The desk was rebuilt on paper, but its furniture still spoke in the old\n   language: the room list drew cream words on a cream drawer — invisible —\n   and the family keys and the kind chips kept their wine. Everything below is\n   the member application's own palette: ink on paper, gold only where the\n   member app wears gold, and no wine anywhere on the desk.\n   ═══════════════════════════════════════ */\n\n/* the top scrolling row does not exist — the drawer is the only way through */\n#desk-screen .dk-ribbon{ display: none !important; }\n\n/* the room list, legible: ink on paper, the open room marked by a rule */\n#desk-screen .dk-dhead b,\n.dk-drawer .dk-dhead b{ color: #3A2A1C !important; }\n#desk-screen .dk-dhead s,\n.dk-drawer .dk-dhead s{ color: #7A5A2C !important; }\n#desk-screen .dk-ditem,\n.dk-drawer .dk-ditem,\n#desk-screen .dk-ditem span,\n.dk-drawer .dk-ditem span{ color: #3A2A1C !important; }\n#desk-screen .dk-ditem i,\n.dk-drawer .dk-ditem i{ color: #A88344 !important; }\n#desk-screen .dk-ditem.on,\n.dk-drawer .dk-ditem.on{\n  background: #EFE3C9 !important;\n  box-shadow: inset 3px 0 0 #3A2A1C !important;\n}\n#desk-screen .dk-ditem.on span,\n.dk-drawer .dk-ditem.on span{ color: #241A0E !important; }\n#desk-screen .dk-ditem:active,\n.dk-drawer .dk-ditem:active{ background: #F4EBD8 !important; }\n#desk-screen .dk-dshut,\n.dk-drawer .dk-dshut{\n  color: #3A2A1C !important; background: #FFFCF4 !important;\n  border-color: rgba(122,90,44,.36) !important;\n}\n#desk-screen .dk-famhead,\n.dk-drawer .dk-famhead,\n#desk-screen .dk-famhead s,\n.dk-drawer .dk-famhead s{ color: #8A6A44 !important; }\n#desk-screen .dk-ditem em,\n.dk-drawer .dk-ditem em{ color: #8A6A44 !important; border-color: rgba(122,90,44,.30) !important; }\n\n/* the family keys, on paper */\n#desk-screen .dk-fam{\n  color: #7A5A2C !important; background: #FFFCF4 !important;\n  border-color: rgba(122,90,44,.28) !important;\n}\n#desk-screen .dk-fam.on{\n  color: #3A2A1C !important; background: #F1E6CE !important;\n  border-color: rgba(122,90,44,.42) !important;\n}\n#desk-screen .dk-fam i{ background: #B8862E !important; }\n#desk-screen .dk-fam.on i{ background: #3A2A1C !important; }\n\n/* the kind chips are drawn exactly as the member app draws a chosen chip */\n#desk-screen .c2-kind.on,\n#desk-screen .c2-kinds .on,\n#desk-screen .dk-chip.on{\n  background: linear-gradient(180deg,#FFE9A9,#E7B94F 52%,#C08D2E) !important;\n  color: #3D0B14 !important;\n  border-color: rgba(150,97,15,.45) !important;\n  box-shadow: 0 1px 0 rgba(255,255,255,.62) inset !important;\n}\n#desk-screen .c2-kind:not(.on),\n#desk-screen .dk-chip:not(.on){\n  background: #FFFCF4 !important; color: #7A5A2C !important;\n  border-color: rgba(122,90,44,.30) !important;\n}\n\n/* the kinds: paper when unchosen, the member app's gold when chosen */\n#desk-screen .c2-kind,\n#desk-screen .dk-chip{\n  background: #FFFCF4 !important;\n  color: #7A5A2C !important;\n  border-color: rgba(150,97,15,.28) !important;\n}\n#desk-screen .c2-kind.on,\n#desk-screen .c2-kind[aria-pressed=\"true\"],\n#desk-screen .dk-chip.on{\n  background: linear-gradient(150deg,#E9CE86,#C9A227) !important;\n  color: #2A0709 !important;\n  border-color: #E9CE86 !important;\n  box-shadow: 0 8px 20px -12px rgba(201,162,39,.9) !important;\n}\n\n/* the drawer keeps its own heading, on paper */\n#desk-screen .dk-dhead b,\n#desk-screen .dk-dhead s{\n  display: block !important; position: static !important;\n  opacity: 1 !important; visibility: visible !important; transform: none !important;\n}\n\n/* ── the last word on the desk: an id beats a class, and the page's own late\n      rules are classes. Everything here is the member app's palette. ── */\n#desk-screen .dk-ribbon{ display: none !important; }\n#dk-drawer .dk-dhead b{ color: #3A2A1C !important; display: block !important; }\n#dk-drawer .dk-dhead s{ color: #7A5A2C !important; }\n#dk-drawer .dk-ditem,\n#dk-drawer .dk-ditem span{ color: #3A2A1C !important; }\n#dk-drawer .dk-ditem i{ color: #A88344 !important; }\n#dk-drawer .dk-ditem.on{\n  background: #EFE3C9 !important;\n  box-shadow: inset 3px 0 0 #3A2A1C !important;\n}\n#dk-drawer .dk-ditem.on span{ color: #241A0E !important; }\n#dk-drawer .dk-dshut{\n  color: #3A2A1C !important; background: #FFFCF4 !important;\n  border-color: rgba(122,90,44,.36) !important;\n}\n#dk-drawer .dk-famhead,\n#dk-drawer .dk-famhead s{ color: #8A6A44 !important; }\n#dk-drawer .dk-veil,#dk-veil{ background: rgba(58,42,28,.30) !important; }\n\n#desk-screen .c2 .c2-kind{\n  background: #FFFCF4 !important; color: #7A5A2C !important;\n  border-color: rgba(150,97,15,.28) !important;\n}\n#desk-screen .c2 .c2-kind.on,\n#desk-screen .c2 .c2-kind[aria-pressed=\"true\"]{\n  background: linear-gradient(150deg,#E9CE86,#C9A227) !important;\n  color: #2A0709 !important; border-color: #E9CE86 !important;\n  box-shadow: 0 8px 20px -12px rgba(201,162,39,.9) !important;\n}\n#desk-screen .dk-fam{\n  color: #7A5A2C !important; background: #FFFCF4 !important;\n  border-color: rgba(122,90,44,.28) !important;\n}\n#desk-screen .dk-fam.on{\n  color: #3A2A1C !important; background: #F1E6CE !important;\n  border-color: rgba(122,90,44,.42) !important;\n}\n\n/* the drawer's head reads as one line: the title on the left, the way out on\n   the right — never a button stranded under its own heading */\n#dk-drawer .dk-dhead{\n  display: grid !important;\n  grid-template-columns: 1fr auto !important;\n  column-gap: 12px; align-items: start;\n  padding-right: 16px !important;\n}\n#dk-drawer .dk-dhead b{ grid-column: 1; grid-row: 1; margin: 0 !important; }\n#dk-drawer .dk-dhead s{ grid-column: 1; grid-row: 2; }\n#dk-drawer .dk-dshut{\n  grid-column: 2; grid-row: 1 / span 2;\n  position: static !important; left: auto !important; right: auto !important;\n  top: auto !important; align-self: start; margin: 0 !important;\n}\n\n/* the line under the drawer's heading — who is sitting at the desk — in taupe */\n#dk-drawer .dk-who,\n#dk-drawer .dk-who-moved{\n  color: #8A6A44 !important; opacity: 1 !important;\n  font-family: Georgia, serif; font-style: italic;\n}\n\n/* ═══════════════════════════════════════\n   3 · THE LIBRARY'S CHIPS, IN ONE CLEAN RAIL\n   Measured on Explore at 390: the row started at x = 0 — flush against the\n   glass, while every word beneath it starts at 16 — and ran off the right edge\n   with the fourth chip cut through a letter, which is what read as \"scattered\".\n   One rail now: the page's own gutter, even gaps, no wrapping at any width, a\n   snap for each chip, and a soft edge so the fifth is visibly waiting.\n   ═══════════════════════════════════════ */\n#lib-chips{\n  display: flex !important; flex-wrap: nowrap !important;\n  gap: 8px !important;\n  margin: 14px -16px 0 !important;\n  padding: 2px 16px 6px !important;\n  overflow-x: auto !important; overflow-y: hidden !important;\n  scroll-snap-type: x proximity;\n  scroll-padding-left: 16px;\n  -webkit-overflow-scrolling: touch;\n  -webkit-mask: linear-gradient(90deg,#000 0,#000 calc(100% - 30px),transparent 100%) !important;\n  mask: linear-gradient(90deg,#000 0,#000 calc(100% - 30px),transparent 100%) !important;\n}\n#lib-chips > .chip{\n  flex: 0 0 auto !important;\n  margin: 0 !important;\n  scroll-snap-align: start;\n}\n#lib-chips > .chip:active{ transform: scale(.97) !important; }\n\n/* ═══════════════════════════════════════\n   8 · THE TEN-DAY VAULT ANSWERS THE HAND\n   The card had no listener at all. Its sheet is paper, like every other sheet\n   in the house: ten days, the one that is open, the hour it turns, and what\n   happens to an answer. The admin's walk is marked as a walk.\n   ═══════════════════════════════════════ */\n#sheet-vault .ivsheet-body{ padding: 6px 18px calc(28px + env(safe-area-inset-bottom)) !important; }\n#sheet-vault .ivsheet-head h2{ font-family: var(--f-display, Georgia), serif; }\n\n.p92v-card{\n  border-radius: 18px; padding: 16px 14px 14px; margin: 2px 0 0;\n  background: linear-gradient(168deg,#FFE8D6 0%,#F8CBB4 58%,#EFB79C 100%);\n  box-shadow: inset 0 1px 0 rgba(255,255,255,.92), 0 18px 32px -24px rgba(120,50,30,.65);\n  border: 1px solid rgba(170,100,70,.20);\n}\n.p92v-kick{\n  margin: 0 0 12px; font: 700 9px/1 Georgia, 'Times New Roman', serif;\n  letter-spacing: .20em; text-transform: uppercase; color: #8A4A2C;\n}\n.p92v-days{ display: grid; grid-template-columns: repeat(10, minmax(0,1fr)); gap: 4px; }\n.p92v-day{ display: flex; flex-direction: column; align-items: center; gap: 3px; }\n.p92v-day i{\n  width: 100%; aspect-ratio: 1; border-radius: 50%; display: grid; place-items: center;\n  background: rgba(255,255,255,.55); border: 1px solid rgba(150,80,50,.24); color: #B06A46;\n}\n.p92v-day i svg{ width: 62%; height: 62%; display: block; }\n.p92v-day.got i{\n  background: linear-gradient(180deg,#FFF0C4,#EAC468 58%,#C99A3A);\n  border-color: #B98A2E; color: #5A3A0A;\n  box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 4px 10px -6px rgba(120,74,8,.8);\n}\n.p92v-day.open i{\n  background: #FFFDF6; border-color: #8A4A2C; color: #8A4A2C;\n  box-shadow: 0 0 0 2px rgba(138,74,44,.18);\n}\n.p92v-day b{ font: 600 8.5px/1 Georgia, serif; color: #8A5A3C; }\n.p92v-clock{ margin: 13px 0 0; font: 400 15px/1.25 Georgia, serif; color: #4A2416; }\n.p92v-line, .p92v-rule, .p92v-seal{ margin: 16px 0 0; font: 400 13.5px/1.66 Georgia, serif; color: #4A2A1C; }\n.p92v-seal{ font-style: italic; }\n.p92v-admin{\n  margin: 18px 0 0; padding: 12px 13px; border-radius: 12px;\n  background: #F6EEDC; border: 1px solid rgba(150,97,15,.28);\n  font: 400 12.5px/1.6 Georgia, serif; color: #6A4A22;\n}\n\n/* ═══════════════════════════════════════\n   5 · THE PEACH NOTES, GLAZED\n   Measured: they were one flat wash — no light on them, no breath. Now they\n   are cut fruit: a lit shoulder, a glide of sheen that rises and falls, and\n   the ink kept dark enough to read on all of it.\n   ═══════════════════════════════════════ */\n#inbox-screen .ibx-card.note{\n  position: relative !important; overflow: hidden !important;\n  background:\n    radial-gradient(120% 90% at 14% -18%, rgba(255,255,255,.72) 0%, rgba(255,255,255,0) 56%),\n    linear-gradient(165deg,#FFC8AC 0%,#F9A582 40%,#EF8A63 78%,#E97C55 100%) !important;\n  border: 1px solid rgba(176,96,64,.22) !important;\n  box-shadow:\n    0 1px 0 rgba(255,255,255,.92) inset,\n    0 -14px 26px -18px rgba(130,50,24,.55) inset,\n    0 16px 30px -24px rgba(150,60,30,.6) !important;\n}\n#inbox-screen .ibx-card.note > *{ position: relative; z-index: 1; }\n#inbox-screen .ibx-card.note::after{\n  content: \"\"; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 0;\n  background:\n    linear-gradient(118deg, rgba(255,255,255,.58) 0%, rgba(255,255,255,.14) 22%, rgba(255,255,255,0) 42%);\n  animation: p92Peach 7.2s ease-in-out infinite;\n}\n@keyframes p92Peach{ 0%,100%{ opacity: .55 } 50%{ opacity: 1 } }\n@media (prefers-reduced-motion: reduce){ #inbox-screen .ibx-card.note::after{ animation: none; opacity: .8 } }\n\n/* ═══════════════════════════════════════\n   17 · THE RIBBONS, AFTER LOGIN, ON EVERY SCREEN\n   Measured: the layer was display:none everywhere because the intro screen\n   leaves iv-open.ivo behind for good after it has finished, and a guard\n   written for the intro's own moment never lets go. The guard now only holds\n   while the intro is actually taking the screen; once it is done the lane is\n   open again, on every room except her desk, which keeps its own quiet.\n   ═══════════════════════════════════════ */\nbody:has(#iv-open.ivo-done):not(.on-desk) .ribbonlay{ display:block !important }\nbody:has(#legal.on) .ribbonlay{ display:none !important }\n\n/* the lane sits just under the top bar, never on the screen's own title */\nbody:not(.rbn-video):not(.rbn-audio):not(.rbn-cast) .rbn{ --rbn-top: 68px !important }\n@media (max-width:400px){ body:not(.rbn-video):not(.rbn-audio):not(.rbn-cast) .rbn{ --rbn-top: 66px !important } }\n\n/* ═══════════════════════════════════════\n   11 · THE DESK'S LAST GOLD, AND ITS BLACK CHIP\n   Measured after 92c: no burgundy anywhere, and the only gold left was the\n   hidden top tab row (27 nodes, all of them display:none). This takes that\n   gold out of the skin as well, so it can never flash back, and it melts the\n   filled black ADMIN chip into the same paper pill the house uses everywhere.\n   A filled ink block is a badge you wear in a dark room; the house does not\n   have dark rooms.\n   ═══════════════════════════════════════ */\n#desk-screen .dk-tab,\n#desk-screen .dk-ribbon .dk-tab,\n#desk-screen .dk-tab.on,\n#desk-screen .dk-ribbon .dk-tab.on{\n  background: transparent !important;\n  color: #5E4A36 !important;\n  border-color: #E2D3B6 !important;\n  box-shadow: none !important;\n}\n#desk-screen .dk-tab.on{ color: #2E2115 !important; box-shadow: inset 0 -2px 0 #3A2A1C !important; }\n\n#desk-screen .dk-badge{\n  background: #FFFDF7 !important;\n  color: #5E4A36 !important;\n  box-shadow: inset 0 0 0 1px #E2D3B6 !important;\n  letter-spacing: .20em !important;\n}\n\n/* ── 11b · no filled black key, no gold fill — the house's paper key ──────\n   Measured in room 06: the primary act was a solid 358 × 44 cocoa block, and\n   every chosen chip a gold gradient. Both are the desk wearing someone else's\n   jewellery. On paper, the house's key is cream with one cocoa hairline: it\n   reads as the same act, and it never turns into a black slab.               */\n#desk-screen .dk-btn,\n#desk-screen button.dk-btn,\n#desk-screen .dk-go,\n#desk-screen .dk-pane button[type=\"submit\"],\n#desk-screen .dk-chip.on,\n#desk-screen .rp-chip.on,\n#desk-screen .dk-seg > .on,\n#desk-screen [class*=\"-chip\"].on,\n#desk-screen [class*=\"seg\"] [aria-selected=\"true\"]{\n  background: linear-gradient(180deg, #FFFDF7 0%, #F8F0DF 100%) !important;\n  color: #3A2A1C !important;\n  border: 1px solid #D9C6A4 !important;\n  box-shadow: inset 0 1px 0 #FFFFFF, 0 1px 2px rgba(90,70,44,.10) !important;\n  letter-spacing: .06em;\n}\n#desk-screen .dk-btn:active,\n#desk-screen .dk-chip.on:active,\n#desk-screen .rp-chip.on:active{ transform: translateY(1px); }\n#desk-screen .dk-btn b, #desk-screen .dk-btn strong{ color: #2E2115 !important; }\n/* the one exception: a destructive act keeps the ink, but only as an outline */\n#desk-screen .dk-btn.danger, #desk-screen .dk-btn[data-danger]{\n  background: #FFFDF7 !important; color: #8A2B1E !important; border-color: #C98C7E !important;\n}\n\n/* ── 11c · the last of the gold, taken out of the rooms ───────────────────\n   What the walk found: a gold-filled \"chosen\" tab in Create, a gold rule\n   under every room heading, and gold hairlines on trays, water, lanes and\n   empty states. None of it is jewellery now — one cocoa hairline, one paper\n   key, the member's own materials.                                          */\n#desk-screen .c2-kind.on,\n#desk-screen .c2-kind[aria-selected=\"true\"]{\n  background: linear-gradient(180deg,#FFFDF7 0%,#F8F0DF 100%) !important;\n  color: #3A2A1C !important;\n  border-color: #D9C6A4 !important;\n  box-shadow: inset 0 1px 0 #FFFFFF !important;\n}\n#desk-screen .dk-h1{ box-shadow: 0 1px 0 #D9C6A4 !important; }\n#desk-screen .dk-h2, #desk-screen .dk-h3{ box-shadow: none !important; }\n#desk-screen .dk-tab::after,\n#desk-screen .dk-ribbon .dk-tab::after{ background: transparent !important; box-shadow: none !important; }\n#desk-screen [class*=\"tray\"], #desk-screen [class*=\"water\"], #desk-screen [class*=\"ripple\"],\n#desk-screen [class*=\"lane\"], #desk-screen [class*=\"reh\"], #desk-screen .dk-empty,\n#desk-screen .c2-back, #desk-screen .c2-money{\n  border-color: #E2D3B6 !important;\n}\n#desk-screen .lvd-mark{ background: #EFE3CB !important; }\n#desk-screen .c2 i, #desk-screen .c2-step i, #desk-screen .c2-dot{\n  background: #D9C6A4 !important;\n  box-shadow: none !important;\n}\n\n/* 11d · the 92c rule that filled every chosen control with cocoa, outranked */\n#desk-screen .dk-pane :is(.c2-kind,.c2-sw,.c2-tick,[class*=\"-kind\"],[class*=\"-sw\"],[class*=\"-tick\"]).on{\n  background: linear-gradient(180deg,#FFFDF7 0%,#F8F0DF 100%) !important;\n  color: #3A2A1C !important;\n  border-color: #D9C6A4 !important;\n  box-shadow: inset 0 0 0 1px #D9C6A4 !important;\n}\n#desk-screen .dk-pane :is(.c2-kind,.c2-sw,.c2-tick,[class*=\"-kind\"],[class*=\"-sw\"],[class*=\"-tick\"]).on *{\n  color: #3A2A1C !important;\n}\n/* every decorative mark in a room is a warm hairline dot, never a coin */\n#desk-screen i[aria-hidden=\"true\"], #desk-screen .dk-pane i:empty{\n  background: #D9C6A4 !important;\n  box-shadow: none !important;\n}\n#desk-screen [class*=\"-new\"], #desk-screen [class*=\"-clear\"], #desk-screen [class*=\"-go\"],\n#desk-screen .tk-tape, #desk-screen .wh-hub{ border-color: #E2D3B6 !important; }\n#desk-screen .cd-new{ background: #FFFDF7 !important; }\n\n/* 11e · the seal — paper, like every other key in the console */\n#desk-screen .c2-seal{\n  background: linear-gradient(180deg,#FFFDF7 0%,#F7EEDC 100%) !important;\n  color: #2E2115 !important;\n  border: 1px solid #C9B492 !important;\n  box-shadow: inset 0 1px 0 #FFFFFF, inset 0 0 0 1px rgba(217,198,164,.55), 0 6px 14px -12px rgba(90,70,44,.55) !important;\n  letter-spacing: .10em;\n}\n#desk-screen .c2-seal:active{ transform: translateY(1px); }\n\n/* ═══════════════════════════════════════\n   11f · THE ROOMS STOP BEING VELVET\n   Every room is written against one palette: --cream is its ink, --gold its\n   gilding, and a handful of literal wine gradients its velvet blocks. The\n   tokens flip in one place here; the velvet blocks are re-cut one by one.\n   Nothing in the console is dark any more, and nothing is gilded.\n   ═══════════════════════════════════════ */\n#desk-screen .rm{\n  --ink:#2E2115;\n  --burg:#F3E8D2;\n  --burgL:#F7EEDC;\n  --wine:#8A4A2C;\n  --gold:#8A6E4E;\n  --goldL:#5E4A36;\n  --goldD:#7A5A2C;\n  --cream:#3A2A1C;\n  --paper:#FFFDF7;\n  --mute:#8A7660;\n  --dim:#7C6A55;\n}\n\n/* the wax seal becomes a paper seal */\n#desk-screen .cr-seal{\n  background: radial-gradient(circle at 34% 26%,#FFFDF7,#F3E8D2 68%,#EADCC0) !important;\n  box-shadow: inset 0 0 0 2px #D9C6A4, inset 0 1px 0 #FFFFFF, 0 10px 22px -18px rgba(90,70,44,.6) !important;\n}\n#desk-screen .cr-seal span{ color:#3A2A1C !important; }\n#desk-screen .cr-seal i{ border-color:#C9B492 !important; }\n\n/* the report docket's spine and hole */\n#desk-screen .rp-spine{\n  background: linear-gradient(180deg,#F7EEDC,#EFE3CB) !important;\n  color:#5E4A36 !important;\n}\n#desk-screen .rp-hole{ background:#EFE3CB !important; box-shadow: inset 0 1px 2px rgba(120,95,60,.35), 0 0 0 2px #FFFDF7 !important; }\n#desk-screen .rp-lanes{ background:#F7EEDC !important; }\n\n/* the well, the tray, the chest, the tape: paper, not velvet */\n#desk-screen .wi-water{\n  background: linear-gradient(180deg,#FFFDF7,#F6EBD6) !important;\n  border-color:#E2D3B6 !important;\n  box-shadow: inset 0 -14px 30px -22px rgba(138,110,74,.35) !important;\n}\n#desk-screen .wi-ripple{ border-color: rgba(138,110,74,.35) !important; }\n#desk-screen .wi-step.on{ background:#FFFDF7 !important; color:#2E2115 !important; border-color:#C9B492 !important; }\n#desk-screen .wi-save{\n  background: linear-gradient(180deg,#FFFDF7,#F7EEDC) !important;\n  color:#2E2115 !important; border:1px solid #C9B492 !important;\n  box-shadow: inset 0 1px 0 #fff !important;\n}\n#desk-screen .wh-hub{ background:#F7EEDC !important; border-color:#E2D3B6 !important; }\n#desk-screen .wh-dot.s0, #desk-screen .wh-dot.s2{ background:#C9B492 !important; }\n#desk-screen .wh-dot.s1{ background:#8A6E4E !important; }\n\n#desk-screen .en-tray{\n  background: linear-gradient(180deg,#FFFDF7,#F6EBD6) !important;\n  border-color:#E2D3B6 !important; box-shadow: inset 0 1px 0 #fff !important;\n}\n#desk-screen .en-lip{ background: linear-gradient(90deg,#D9C6A4,rgba(217,198,164,.15)) !important; }\n#desk-screen .en-act.link{ background:#FFFDF7 !important; color:#3A2A1C !important; border-color:#C9B492 !important; }\n\n#desk-screen .gd-tray{\n  background: linear-gradient(180deg,#FFFDF7,#F6EBD6) !important;\n  border-color:#E2D3B6 !important; box-shadow: inset 0 1px 0 #fff !important;\n}\n#desk-screen .gd-rim{ background: linear-gradient(90deg,rgba(217,198,164,.15),#C9B492,rgba(217,198,164,.15)) !important; }\n\n#desk-screen .tk-tape{\n  background: linear-gradient(180deg,#FFFDF7,#F6ECD8) !important;\n  border-color:#E2D3B6 !important; box-shadow: inset 0 1px 0 #fff !important;\n}\n#desk-screen .tk-tape::before{ background: linear-gradient(90deg,#F8F0DF,transparent) !important; }\n#desk-screen .tk-tape::after{ background: linear-gradient(270deg,#F8F0DF,transparent) !important; }\n#desk-screen .tk-run span{ color:#5E4A36 !important; }\n#desk-screen .tk-sw.on{ background:#FFFDF7 !important; color:#2E2115 !important; border-color:#C9B492 !important; }\n\n/* the small ink marks inside dockets and stories */\n#desk-screen .st-bulb b{ background:#F3E8D2 !important; box-shadow: 0 0 0 1px #D9C6A4 !important; }\n#desk-screen .st-mstop b{ color:#3A2A1C !important; }\n#desk-screen .cr-sel option, #desk-screen .cd-f select option{ background:#FFFDF7 !important; color:#3A2A1C !important; }\n#desk-screen .cr-tick input:checked::after{ background:#3A2A1C !important; }\n\n/* an empty room is quiet, not unfinished: a hairline, never a dashed box */\n#desk-screen .dk-empty, #desk-screen .rmx-wait{\n  border-style: solid !important;\n  border-color: #E7D9BC !important;\n  background: #FFFDF7 !important;\n  color: #7C6A55 !important;\n}\n\n/* the chosen kind must be obvious at a glance, without a drop of gilding */\n#desk-screen .c2-kind.on, #desk-screen .c2-sw.on, #desk-screen .c2-tick.on{\n  background: linear-gradient(180deg,#FFFDF7 0%,#FBF1DC 100%) !important;\n  color: #2E2115 !important;\n  border-color: #B79A6C !important;\n  box-shadow: inset 0 0 0 1px #B79A6C, inset 0 1px 0 #FFFFFF !important;\n  font-weight: 700 !important;\n}\n#desk-screen .dk-pane :is(.c2-kind,.c2-sw,.c2-tick,[class*=\"-kind\"],[class*=\"-sw\"],[class*=\"-tick\"]).on{\n  background: linear-gradient(180deg,#FFFDF7 0%,#FBF1DC 100%) !important;\n  color: #2E2115 !important;\n  border-color: #B79A6C !important;\n  box-shadow: inset 0 0 0 1px #B79A6C, inset 0 1px 0 #FFFFFF !important;\n}\n\n/* ═══════════════════════════════════════\n   1 · THE GOLD RIBBON, EDGE TO EDGE\n   Measured: the band is full width (0 → 390 at y 62), but a horizontal mask\n   faded it to nothing at both ends — and because the words inside it travel,\n   the fade read as a pale wedge at the top right that grew and shrank. The\n   mask is gone; the gold runs solid from one edge of the glass to the other.\n   ═══════════════════════════════════════ */\n.hp-ticker{\n  -webkit-mask-image: none !important;\n  mask-image: none !important;\n  background: linear-gradient(180deg,#F7E1A4 0%,#EAC873 34%,#D9AC4A 78%,#C99A3A 100%) !important;\n  box-shadow: inset 0 1px 0 rgba(255,255,255,.62), inset 0 -1px 0 rgba(120,80,14,.22) !important;\n}\n.hp-ticker::before, .hp-ticker::after{ background: none !important; }\n\n/* ═══════════════════════════════════════\n   1 · THE WHEEL'S TWO KEYS — the stage was standing on them\n   ═══════════════════════════════════════ */\n#wof .wof-stage{ pointer-events: none !important; }\n#wof .wof-head{ position: absolute !important; z-index: 9 !important; }\n#wof .wof-card{ z-index: 8 !important; }\n#wof .wof-card.on{ pointer-events: auto !important; }\n#wof .wof-hours-link{ pointer-events: auto !important; }\n#wof .wof-ok{ position: relative; z-index: 2; }\n\n/* ═══════════════════════════════════════\n   3 · THE SEAL'S WORDS WERE WHITE ON CREAM\n   Measured: \"PRESS THE SEAL\" is in the page, at 358 × 60 — but a 92c rule\n   painted every child of the seal #FFF9EC and the paper key behind it was\n   cream too. The words were there, unreadable. Now they are ink on paper.\n   ═══════════════════════════════════════ */\n#desk-screen .dk-pane .c2-seal *{ color: #2E2115 !important; }\n/* The generic empty-i hairline rule must not turn the seal's dashed ring\n   into a solid plaque above its words. */\n#desk-screen .dk-pane .c2-seal i{ background: transparent !important; pointer-events: none; }\n#desk-screen .dk-pane .c2-seal span{ position: relative; z-index: 1; }\n#desk-screen .dk-pane .c2-seal{\n  background: linear-gradient(180deg,#FFFDF7 0%,#F7EEDC 100%) !important;\n  color: #2E2115 !important;\n  border: 1px solid #C9B492 !important;\n  box-shadow: inset 0 1px 0 #FFFFFF, 0 8px 18px -16px rgba(90,70,44,.6) !important;\n}\n\n/* ═══════════════════════════════════════\n   4 · THE PICKER — lens or shelf, never one answer\n   ═══════════════════════════════════════ */\n.p92-pick{ z-index: 260 !important; }\n.p92-pick-card{\n  position: absolute; left: 50%; bottom: 0; transform: translateX(-50%);\n  width: min(100%, 460px); padding: 10px 16px calc(18px + env(safe-area-inset-bottom));\n  background: linear-gradient(176deg,#FFFDF7,#F8F0DF);\n  border-radius: 22px 22px 0 0; box-shadow: 0 -18px 40px -20px rgba(60,36,14,.45);\n  animation: p92PickUp .34s cubic-bezier(.2,.9,.25,1) both;\n}\n@keyframes p92PickUp{ from{ transform: translate(-50%, 22px); opacity: 0 } to{ transform: translate(-50%, 0); opacity: 1 } }\n.p92-pick-card::before{\n  content: \"\"; display: block; width: 40px; height: 4px; border-radius: 99px;\n  background: #E2D3B6; margin: 0 auto 12px;\n}\n.p92-pick-k{\n  margin: 0 0 2px; text-align: center; font: 700 9px/1 Georgia, serif;\n  letter-spacing: .24em; text-transform: uppercase; color: #8A7660;\n}\n.p92-pick-card h3{\n  margin: 0 0 12px; text-align: center; font: 400 19px/1.25 Georgia, serif; color: #2E2115;\n}\n.p92-pick-key{\n  display: flex; align-items: center; gap: 13px; width: 100%; margin: 0 0 9px;\n  padding: 13px 15px; border-radius: 15px; cursor: pointer; text-align: left;\n  background: #FFFDF7; border: 1px solid #E2D3B6;\n  box-shadow: inset 0 1px 0 #fff;\n}\n.p92-pick-key:active{ transform: translateY(1px); }\n.p92-pick-key svg{ width: 26px; height: 26px; flex: 0 0 auto; color: #5E4A36; }\n.p92-pick-key b{ display: block; font: 600 14.5px/1.2 Georgia, serif; color: #2E2115; }\n.p92-pick-key i{ display: block; margin-top: 3px; font: italic 400 11.6px/1.35 Georgia, serif; color: #8A7660; }\n.p92-pick-x{\n  display: block; width: 100%; margin-top: 4px; padding: 11px;\n  background: none; border: 0; cursor: pointer;\n  font: 600 10px/1 Georgia, serif; letter-spacing: .18em; text-transform: uppercase; color: #A08A6E;\n}\n\n/* ═══════════════════════════════════════\n   7 · THE FACE — large, centred, hers\n   ═══════════════════════════════════════ */\n.me-top.p92-face-wrap{ position: relative; display: flex; align-items: center; gap: 16px; }\n#pf-ava.p92-face{\n  background-repeat: no-repeat;\n  box-shadow: 0 0 0 1px rgba(150,101,18,.45), 0 10px 24px -14px rgba(70,40,10,.7);\n  border: 0 !important;\n}\n.p92-face-edit{\n  position: absolute; left: 58px; top: 58px; z-index: 3;\n  width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center;\n  background: #FFFDF7; color: #5E4A36; border: 1px solid #E2D3B6; cursor: pointer; padding: 0;\n  box-shadow: 0 4px 10px -6px rgba(70,40,10,.7);\n}\n.p92-face-edit svg{ width: 15px; height: 15px; }\n\n/* ═══════════════════════════════════════\n   8 · A BADGE NEVER CUTS HER WORDS\n   ═══════════════════════════════════════ */\n.iv-bd-word{ white-space: nowrap; }\n.iv-bd-plate{ overflow: visible; }\n\n/* ═══════════════════════════════════════\n   9 · THE FRAME FLAPS, THE BADGE SHINES\n   The frames shipped as still pictures, so they sat like a photograph\n   pinned over the face. They now breathe and sway the way a feathered\n   frame should, and the badge carries a slow sweep of light across the\n   gold with its glints answering — and the wings beat at the edges.\n   ═══════════════════════════════════════ */\n@keyframes p92Flap{\n  0%,100%{ transform: rotate(-1.1deg) scale(1); filter: brightness(1) }\n  50%    { transform: rotate(1.1deg) scale(1.022); filter: brightness(1.045) }\n}\n.pf-ava-frame{\n  animation: p92Flap 6.6s ease-in-out infinite;\n  transform-origin: 50% 62%;\n  will-change: transform;\n}\n.pf-ava-frame svg, .pf-ava-frame img{ display: block; }\n\n@keyframes p92Sweep{\n  0%   { transform: translateX(-130%) skewX(-16deg); opacity: 0 }\n  12%  { opacity: .85 }\n  46%  { opacity: .85 }\n  60%  { transform: translateX(130%) skewX(-16deg); opacity: 0 }\n  100% { transform: translateX(130%) skewX(-16deg); opacity: 0 }\n}\n.iv-badge{ position: relative; }\n.iv-badge::after{\n  content: \"\"; position: absolute; inset: 8% 4%; z-index: 3; border-radius: 999px;\n  background: linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.55) 46%, rgba(255,255,255,0) 62%);\n  mix-blend-mode: screen; pointer-events: none;\n  animation: p92Sweep 7.4s ease-in-out infinite;\n}\n@keyframes p92Glint{\n  0%,100%{ opacity: .45; transform: scale(.85) }\n  50%    { opacity: 1;   transform: scale(1.15) }\n}\n.iv-bd-glints > i{ animation: p92Glint 3.6s ease-in-out infinite; }\n.iv-bd-glints > i:nth-child(2){ animation-delay: .5s }\n.iv-bd-glints > i:nth-child(3){ animation-delay: 1.1s }\n.iv-bd-glints > i:nth-child(4){ animation-delay: 1.7s }\n@keyframes p92Wing{\n  0%,100%{ transform: rotate(0deg) scale(1) }\n  50%    { transform: rotate(-2.6deg) scale(1.04) }\n}\n.iv-badge .iv-bd-wing-l{ animation: p92Wing 5.2s ease-in-out infinite; transform-origin: 100% 50% }\n.iv-badge .iv-bd-wing-r{ animation: p92Wing 5.2s ease-in-out infinite reverse; transform-origin: 0% 50% }\n@media (prefers-reduced-motion: reduce){\n  .pf-ava-frame, .iv-badge::after, .iv-bd-glints > i,\n  .iv-badge .iv-bd-wing-l, .iv-badge .iv-bd-wing-r{ animation: none !important }\n}\n\n/* ═══════════════════════════════════════\n   6 · THE CHAT STOPPED BLINKING\n   Measured: drawTalk() writes the whole list again on every poll, and\n   every line carries animation lvIn .28s. So on a phone polling every\n   two or three seconds the entire conversation vanished and came back —\n   exactly the blink she saw, twice over, on \"IVORY Photo like\" and\n   \"IVORY Now I\". A line that is already in the room has been seen; it\n   does not need to arrive again.\n   ═══════════════════════════════════════ */\n.lv-talk .lv-m{ animation: none !important; }\n.lv-talk .lv-talk-in{ contain: layout style; }\n\n/* ═══════════════════════════════════════\n   2 · THE WHEEL, LARGER THAN THE ROOM\n   Measured on a 390 × 844 handset: the wheel was 74 vw = 288 px inside a\n   stage with 92 px of empty air above it and 150 px below. It now takes the\n   whole width the glass allows, the stage gives it the room, the feather\n   falls with weight, and the landing has a small honest bounce — a click of\n   the pin, a settle of the rim, one glint — instead of snapping still.\n   ═══════════════════════════════════════ */\n#wof .wof-stage{\n  padding-top: calc(60px + env(safe-area-inset-top, 0px)) !important;\n  padding-bottom: 148px !important;\n  justify-content: center !important;\n}\n#wof .wof-wheelwrap{\n  width: min(94vw, 96vh - 250px, 720px) !important;\n  max-width: none !important;\n  margin: 0 auto;\n}\n@media (min-width: 760px){\n  #wof .wof-wheelwrap{ width: min(62vw, 660px) !important; }\n}\n#wof .wof-hub span{ font-size: clamp(9px, 3.1vw, 17px) !important; }\n\n/* the feather: falls, lands, gives one short bounce, then rests */\n@keyframes p92FeatherLand{\n  0%   { transform: translateY(-9%) rotate(-3deg); }\n  54%  { transform: translateY(1.6%) rotate(1.4deg); }\n  70%  { transform: translateY(-0.7%) rotate(-.7deg); }\n  84%  { transform: translateY(0.4%) rotate(.35deg); }\n  100% { transform: translateY(0) rotate(0deg); }\n}\n\n/* the landing: one short settle, never a wobble that keeps going */\n#wof .wof-wheelwrap.p92-landed{\n  animation: p92RimSettle .62s cubic-bezier(.22,1.4,.36,1) both;\n}\n@keyframes p92RimSettle{\n  0%   { transform: scale(1); }\n  38%  { transform: scale(1.018); }\n  70%  { transform: scale(.995); }\n  100% { transform: scale(1); }\n}\n#wof .wof-wheelwrap.p92-landed::after{\n  animation: p92RimFlash 1.1s ease-out both !important;\n}\n@keyframes p92RimFlash{\n  0%   { opacity: 0; }\n  22%  { opacity: 1; }\n  100% { opacity: .55; }\n}\n@media (prefers-reduced-motion: reduce){\n  #wof .wof-wheelwrap.p92-landed{ animation: none !important; }\n}\n\n/* the chat shares the glass with the wide wheel without ever covering it */\n@media (max-height: 760px){\n  #wof .wof-stage{ padding-top: calc(56px + env(safe-area-inset-top, 0px)) !important }\n  #wof .wof-wheelwrap{ width: min(88vw, 420px) !important }\n}\n\n/* ═══════════════════════════════════════\n   9b · THE FRAMES, ALIVE — wings, stones, and a ring of gold\n   Two halves of the same picture turn from their shoulders, so the wings\n   open and close; the stones found in the art catch and flash; a ring of\n   light goes round the rim, then rests; the whole frame breathes beneath.\n   Transform and opacity only — this is composited, not computed.\n   ═══════════════════════════════════════ */\n.iv-frame.p92-alive{ --beat: 7.4s; overflow: visible; }\n\n.p92-wings{ position: absolute; inset: 0; z-index: 4; pointer-events: none; }\n.p92-half{ position: absolute; inset: 0; display: block; will-change: transform; }\n.p92-half img{\n  position: absolute; inset: 0; width: 100%; height: 100%;\n  object-fit: contain; display: block; pointer-events: none;\n}\n/* a soft seam down the middle so the two halves meet without a line */\n.p92-hl{ clip-path: polygon(0% 0%, 54% 0%, 44% 100%, 0% 100%);\n  transform-origin: 44% 86%; animation: p92WingL var(--beat) cubic-bezier(.42,0,.34,1) infinite; }\n.p92-hr{ clip-path: polygon(54% 0%, 100% 0%, 100% 100%, 44% 100%);\n  transform-origin: 56% 86%; animation: p92WingR var(--beat) cubic-bezier(.42,0,.34,1) infinite; }\n\n@keyframes p92WingL{\n  0%, 100% { transform: rotate(0deg) translateY(0) }\n  18%      { transform: rotate(-2.6deg) translateY(-.4%) }\n  38%      { transform: rotate(.6deg) translateY(.15%) }\n  58%      { transform: rotate(-1.9deg) translateY(-.25%) }\n  78%      { transform: rotate(.3deg) translateY(.1%) }\n}\n@keyframes p92WingR{\n  0%, 100% { transform: rotate(0deg) translateY(0) }\n  18%      { transform: rotate(2.6deg) translateY(-.4%) }\n  38%      { transform: rotate(-.6deg) translateY(.15%) }\n  58%      { transform: rotate(1.9deg) translateY(-.25%) }\n  78%      { transform: rotate(-.3deg) translateY(.1%) }\n}\n\n/* the sheen that runs out along the feathers as they move */\n.p92-sheen{ position: absolute; inset: 0; z-index: 5; pointer-events: none; mix-blend-mode: screen; }\n.p92-sheen i{\n  position: absolute; top: 4%; height: 92%; width: 34%;\n  background: linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,250,225,.42) 46%, rgba(255,255,255,0) 72%);\n  filter: blur(3px); opacity: 0;\n  animation: p92Sheen var(--beat) ease-in-out infinite;\n}\n.p92-sheen i:first-child{ left: -6%; }\n.p92-sheen i:last-child{ right: -6%; animation-delay: calc(var(--beat) / 2); }\n@keyframes p92Sheen{\n  0%, 100% { opacity: 0; transform: translateX(-12%) }\n  16%      { opacity: .85; }\n  34%      { opacity: 0; transform: translateX(16%) }\n}\n\n/* the ring of gold light — once round the rim, then it rests */\n.p92-ring{\n  position: absolute; inset: -5%; z-index: 6; border-radius: 50%; pointer-events: none;\n  background: conic-gradient(from 0deg,\n    rgba(255,242,200,0) 0deg, rgba(255,242,200,0) 34deg,\n    rgba(255,247,215,.95) 58deg, rgba(255,236,176,.35) 76deg,\n    rgba(255,242,200,0) 96deg, rgba(255,242,200,0) 360deg);\n  -webkit-mask: radial-gradient(circle, transparent 58%, #000 70%, #000 88%, transparent 97%);\n  mask: radial-gradient(circle, transparent 58%, #000 70%, #000 88%, transparent 97%);\n  opacity: 0; animation: p92Ring 9.8s linear infinite;\n}\n@keyframes p92Ring{\n  0%   { opacity: 0; transform: rotate(0deg) }\n  3%   { opacity: .95 }\n  22%  { opacity: .55 }\n  30%  { opacity: 0 }\n  31%  { opacity: 0; transform: rotate(360deg) }\n  100% { opacity: 0; transform: rotate(360deg) }\n}\n\n/* the stones the picture itself gave us */\n.p92-gem{\n  position: absolute; width: 12px; height: 12px; margin: -6px 0 0 -6px; z-index: 7;\n  pointer-events: none; opacity: 0;\n  background: radial-gradient(circle, #FFFFFF 0%, rgba(255,248,214,.85) 34%, rgba(255,226,150,0) 72%);\n  animation: p92Gem var(--t) ease-in-out infinite; animation-delay: var(--d);\n}\n.p92-gem::before, .p92-gem::after{\n  content: \"\"; position: absolute; left: 50%; top: 50%; pointer-events: none;\n  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, #FFFDF2 50%, rgba(255,255,255,0) 100%);\n  transform: translate(-50%, -50%);\n}\n.p92-gem::before{ width: 1500%; height: 1.5px; }\n.p92-gem::after{ width: 1.5px; height: 1500%; }\n@keyframes p92Gem{\n  0%, 100% { opacity: 0; transform: scale(.5) }\n  6%       { opacity: 1; transform: scale(1.15) }\n  14%      { opacity: .2; transform: scale(.75) }\n  22%      { opacity: .9; transform: scale(1) }\n  34%      { opacity: 0; transform: scale(.6) }\n}\n\n/* the badge's stones and its ring */\n.iv-badge{ overflow: visible; }\n.p92-bgem{\n  position: absolute; width: 10px; height: 10px; margin: -5px 0 0 -5px; z-index: 8;\n  pointer-events: none; opacity: 0;\n  background: radial-gradient(circle, #FFFFFF 0%, rgba(255,244,200,.9) 36%, rgba(255,222,140,0) 74%);\n  animation: p92Gem 5.4s ease-in-out infinite; animation-delay: var(--d);\n}\n.p92-bgem::before{\n  content: \"\"; position: absolute; left: 50%; top: 50%; width: 1100%; height: 1.4px;\n  transform: translate(-50%, -50%);\n  background: linear-gradient(90deg, rgba(255,255,255,0), #FFFDF2 50%, rgba(255,255,255,0));\n}\n.p92-bring{\n  position: absolute; inset: -12% -3%; z-index: 7; pointer-events: none;\n  background: linear-gradient(96deg,\n    rgba(255,255,255,0) 34%, rgba(255,252,232,.85) 50%, rgba(255,255,255,0) 66%);\n  -webkit-mask: linear-gradient(#000, #000);\n  opacity: 0; animation: p92BadgeRing 8.4s ease-in-out infinite;\n}\n@keyframes p92BadgeRing{\n  0%, 100% { opacity: 0 }\n  10%      { opacity: .9 }\n  16%      { opacity: .2 }\n  24%      { opacity: .7 }\n  34%      { opacity: 0 }\n}\n\n/* a slow gold bloom behind the whole frame, in time with the wings */\n.iv-frame.p92-alive::before{\n  content: \"\"; position: absolute; inset: -12%; border-radius: 50%; z-index: -1; pointer-events: none;\n  background: radial-gradient(circle at 50% 52%, rgba(255,226,150,.34) 0%, rgba(255,214,130,.12) 42%, transparent 70%);\n  animation: p92Bloom var(--beat) ease-in-out infinite;\n}\n@keyframes p92Bloom{\n  0%, 100% { opacity: .55; transform: scale(.97) }\n  18%      { opacity: 1; transform: scale(1.045) }\n  38%      { opacity: .6; transform: scale(.99) }\n}\n\n/* a light handset keeps the wings, the stones and the ring — and drops the\n   two soft layers that cost the most compositing */\n@media (prefers-reduced-motion: reduce){\n  .p92-half, .p92-sheen i, .p92-ring, .p92-gem, .p92-bgem, .p92-bring,\n  .iv-frame.p92-alive::before{ animation: none !important }\n  .p92-ring, .p92-sheen i, .p92-bring, .p92-gem, .p92-bgem{ display: none !important }\n}\nhtml.p92-lean .p92-sheen, html.p92-lean .iv-frame.p92-alive::before{ display: none !important; }\n\n/* ── 7b · the face gets the room, the frame sits on its rim ─────────────\n   Measured: the disc was 74 px with a 106 px frame overlapping it by 16 px,\n   so the picture the member chose was the smallest thing on her own card.\n   Now the disc is 104 and the frame is drawn around it, centred.        */\n.me-top.p92-face-wrap{ gap: 20px; }\n#profile-screen .me-card .me-avatar{\n  width: 104px !important; height: 104px !important; flex: 0 0 104px !important;\n  font-size: 38px !important;\n}\n.pf-ava-frame{\n  left: 52px !important; top: 52px !important; margin: 0 !important;\n  width: 152px !important; height: 152px !important;\n  transform: translate(-50%, -50%) !important;\n  z-index: 0 !important;\n}\n#profile-screen .me-card .pf-ava-frame .iv-frame{ width: 152px !important; height: 152px !important; }\n.me-card .me-top .pf-ava-frame + .me-avatar{ z-index: 2 !important; }\n.p92-face-edit{ left: 74px !important; top: 74px !important; }\n@media (max-width: 400px){\n  #profile-screen .me-card .me-avatar{ width: 96px !important; height: 96px !important; flex: 0 0 96px !important; }\n  .pf-ava-frame{ left: 48px !important; top: 48px !important; }\n  #profile-screen .me-card .pf-ava-frame .iv-frame{ width: 142px !important; height: 142px !important; }\n  .p92-face-edit{ left: 68px !important; top: 68px !important; }\n}\n\n/* ═══════════════════════════════════════\n   5 · THE BROADCAST WAS WATCHED THROUGH WINE GLASS\n   Measured: the live stage paints two gradients over the camera — 62 % of\n   #3A0410 across the top third and 78 % across the bottom. On a phone that\n   is the \"dark and dull\" she saw, before any appearance processing does anything at\n   all. The veils now only gather at the very edges, where the chrome sits,\n   and the picture is left alone in the middle. The self-view is also no\n   longer flipped: what she sees is what the house sees.\n   ═══════════════════════════════════════ */\n.lv-stage::after{\n  background:\n    linear-gradient(180deg, rgba(58,4,16,.46) 0%, rgba(58,4,16,.10) 11%, transparent 22%),\n    linear-gradient(0deg, rgba(58,4,16,.52) 0%, rgba(58,4,16,.14) 15%, transparent 34%) !important;\n}\n.lv-video video, .lv-tile video{ transform: none !important; }\n/* while she is the host with the camera on, the picture gets the glass:\n   only a thin vignette, nothing across her face */\nbody.on-live .lv-stage.p92-bare::after{\n  background:\n    linear-gradient(180deg, rgba(58,4,16,.34) 0%, transparent 14%),\n    linear-gradient(0deg, rgba(58,4,16,.34) 0%, transparent 18%) !important;\n}\n\n/* ═══════════════════════════════════════\n   10 · THE LITTLE PHONE\n   A 3 GB handset is told so once, at boot, and the house spends less on\n   paint from then on: no backdrop blur, no double shadows, no soft sheen\n   layers. The wings, the stones, the ring and the gold stay.\n   ═══════════════════════════════════════ */\nhtml.p92-lean .p92-wings .p92-sheen{ display: none !important; }\nhtml.p92-lean #desk-screen .dk-card,\nhtml.p92-lean #desk-screen .dk-sheet,\nhtml.p92-lean #desk-screen .dk-tile,\nhtml.p92-lean #desk-screen .dk-rowcard,\nhtml.p92-lean #desk-screen .dk-btn,\nhtml.p92-lean #desk-screen .dk-chip{\n  box-shadow: none !important;\n}\nhtml.p92-lean .ivsheet, html.p92-lean .p92-pick-card, html.p92-lean #wof .wof-card{\n  backdrop-filter: none !important; -webkit-backdrop-filter: none !important;\n}\nhtml.p92-lean .lv-stage::after{ box-shadow: none !important; }\nhtml.p92-lean .hp-plate, html.p92-lean .hp-ticker::before, html.p92-lean .hp-ticker::after{ filter: none !important; }\nhtml.p92-lean *{ animation-timing-function: cubic-bezier(.4,0,.6,1) !important; }\n\n/* ══════════════════════════════════════════════════════════════════════════\n   IVORY · PASS 94 · clarity, depth and low-end handset manners\n   ══════════════════════════════════════════════════════════════════════════ */\n\n/* 1 · a bright, sharp opening, and an eye she can actually see */\n#iv-open #ivo-film{filter:saturate(1.12) contrast(1.01) brightness(1.16) !important;}\n#iv-open.ivo.ivo-nofilm{background:radial-gradient(120% 90% at 50% 12%,#F5D78E 0%,#D6A64B 38%,#A87425 76%,#79501C 100%) !important;}\n#iv-open .ivo-glow{background:radial-gradient(70% 120% at 50% 118%,rgba(255,216,139,.38) 0%,rgba(244,184,85,.12) 48%,transparent 78%) !important;}\n#iv-open .ivo-beat::before{background:radial-gradient(58% 52% at 50% 46%,rgba(245,196,104,.28) 0%,rgba(179,119,35,.16) 48%,transparent 76%) !important;filter:none !important;}\n#iv-open .ivo-look{width:46px !important;height:46px !important;border-radius:14px !important;color:#3E1E05 !important;background:linear-gradient(180deg,#FFF8DF 0%,#F2D28D 58%,#D5A64D 100%) !important;box-shadow:inset 0 0 0 2px #6B3A0C,inset 0 1px 0 #FFFFFF,0 7px 16px -10px rgba(70,35,4,.8) !important;}\n#iv-open .ivo-eye{width:27px !important;height:18px !important;box-shadow:inset 0 0 0 2.2px #4A2506 !important;background:rgba(255,255,255,.28);}\n#iv-open .ivo-eye::after{inset:4px 8px !important;background:#4A2506 !important;box-shadow:0 0 0 1px rgba(255,248,220,.5);}\n#iv-open .ivo-look[aria-pressed=\"true\"]{background:linear-gradient(180deg,#FFF3C4,#E6B85F) !important;}\n#iv-open .ivo-look[aria-pressed=\"true\"] .ivo-eye::after{inset:4px 8px !important;background:#7A1020 !important;box-shadow:0 0 0 2px #FFF0C2 !important;}\n#iv-open .ivo-looktx{color:#FFF3D2 !important;opacity:1 !important;font-weight:700 !important;}\n\n/* 10/11 · a veil must never become an expensive cloudy glass pane */\n.ivsheet-scrim,.dk-veil,#ivx-veil,#rbn-veil,.p92-pick .ivsheet-scrim{backdrop-filter:none !important;-webkit-backdrop-filter:none !important;}\n.ivsheet-scrim{background:rgba(54,34,16,.30) !important;}\n#rbn-veil{background:rgba(54,34,16,.34) !important;}\n/* Invisible ribbons must never keep taking taps above another room. */\nbody.sheet-open .ribbonlay,body.sheet-open .hp-ticker,\nbody:has(#wof.show) .ribbonlay,body:has(#wof.show) .hp-ticker,\nbody:has(#rbn-sheet.on) .ribbonlay,body:has(#rbn-sheet.on) .hp-ticker,\nbody:has(.p92-pick.show) .ribbonlay,body:has(.p92-pick.show) .hp-ticker{opacity:0 !important;visibility:hidden !important;pointer-events:none !important;}\n.dk-veil,#ivx-veil{background:rgba(54,34,16,.28) !important;}\n\n/* 7/8/9 · Home: the film stays whole, the words keep to their own column */\n#home-screen .hp-feed{padding-bottom:30px !important;}\n#home-screen .hp-live{margin-top:0 !important;}\n/* The animated gold words are a real door, not inert lettering. */\n#home-screen .ex-line{pointer-events:auto !important;cursor:pointer;appearance:none;-webkit-appearance:none;border:0;background:none;color:inherit;width:100%;-webkit-tap-highlight-color:transparent;}\n#home-screen .ex-line:focus-visible{outline:2px solid #B77918;outline-offset:5px;border-radius:8px;}\n#home-screen .card.c-line .ivf-v{object-position:86% 40% !important;opacity:1 !important;}\n#home-screen .card.c-line .card-in{background-image:linear-gradient(90deg,rgba(54,8,20,.82) 0%,rgba(54,8,20,.64) 42%,rgba(54,8,20,.12) 54%,transparent 66%) !important;min-height:270px !important;padding:18px 16px 16px !important;}\n#home-screen .card.c-line .ivf-scrim{background-image:linear-gradient(90deg,rgba(54,8,20,.72) 0%,rgba(54,8,20,.42) 43%,transparent 58%) !important;}\n#home-screen .card.c-line::after{background:radial-gradient(45% 60% at 6% 100%,rgba(255,213,151,.16),transparent 72%) !important;}\n#home-screen .card.c-line .eyebrow{max-width:52% !important;font-size:10px !important;line-height:1.35 !important;}\n#home-screen .card.c-line .title{max-width:52% !important;font-size:23px !important;line-height:1.02 !important;margin:5px 0 7px !important;}\n#home-screen .card.c-line .lede{max-width:51% !important;font-size:11.4px !important;line-height:1.42 !important;}\n#home-screen .card.c-line .note{max-width:51% !important;font-size:10.5px !important;line-height:1.35 !important;}\n.hp-live h2 em{animation:none !important;opacity:1 !important;filter:none !important;}\n.eb-star{animation:none !important;opacity:1 !important;transform:none !important;}\n\n/* 12 · heart, bells, ladder; the crest dust and the climbing light return */\n.hp-icons .med.heart,.top-icons .med.heart{order:1 !important;}\n.hp-icons .med.bell,.top-icons .med.bell{order:2 !important;}\n.hp-icons .med.ladder,.top-icons .med.ladder{order:3 !important;}\n.med.heart>.crestdust{display:block !important;opacity:.95 !important;width:76px !important;height:76px !important;margin:-38px 0 0 -38px !important;pointer-events:none;}\n.med.bell .bellhalo{display:block !important;opacity:.8 !important;animation:p94BellHalo 4.8s ease-in-out infinite !important;}\n.med.bell .bellhalo.two{animation-delay:-2.4s !important;}\n.med.bell .bellsvg{animation:p94BellColour 7s ease-in-out infinite !important;transform-origin:50% 20%;}\n@keyframes p94BellHalo{0%,100%{opacity:.26;transform:scale(.86)}45%{opacity:.88;transform:scale(1.12)}70%{opacity:.46;transform:scale(1)}}\n@keyframes p94BellColour{0%,100%{filter:brightness(1) saturate(1) drop-shadow(0 0 3px rgba(238,184,65,.45))}35%{filter:brightness(1.14) saturate(.82) drop-shadow(0 0 7px rgba(255,232,164,.8))}68%{filter:brightness(1.05) saturate(1.15) hue-rotate(-10deg) drop-shadow(0 0 6px rgba(240,166,113,.65))}}\n.p94-climb .laddersvg g:nth-child(2) path{animation:p94Rung 4.8s ease-in-out infinite;}\n.p94-climb .laddersvg g:nth-child(2) path:nth-child(1){animation-delay:1.2s}.p94-climb .laddersvg g:nth-child(2) path:nth-child(2){animation-delay:.8s}.p94-climb .laddersvg g:nth-child(2) path:nth-child(3){animation-delay:.4s}.p94-climb .laddersvg g:nth-child(2) path:nth-child(4){animation-delay:0s}\n@keyframes p94Rung{0%,12%,42%,100%{stroke:#B98A32;filter:none}18%,30%{stroke:#FFF8D7;filter:drop-shadow(0 0 3px #F3C85F)}}\n.p94-climber{fill:#FFF8D7;stroke:#B57A17;stroke-width:.7;filter:drop-shadow(0 0 3px #E9B84D);animation:p94Climber 4.8s ease-in-out infinite;}\n@keyframes p94Climber{0%,8%{transform:translateY(0);opacity:0}14%{opacity:1}72%{transform:translateY(-14px);opacity:1}84%,100%{transform:translateY(-14px);opacity:0}}\n\n/* 10 · the wheel is large, quick and composed; no perpetual landing loop */\n#wof .wof-stage{padding-top:calc(58px + env(safe-area-inset-top,0px)) !important;padding-bottom:126px !important;}\n#wof .wof-wheelwrap{width:min(97vw,calc(100dvh - 206px)) !important;max-width:none !important;margin:0 !important;flex:0 0 auto;}\n#wof .wof-wheel{transition:transform 2.4s cubic-bezier(.12,.72,.12,1) !important;will-change:transform;}\n#wof .wof-hub span{font-weight:800 !important;text-shadow:0 1px 0 #FFF6D8,0 0 12px rgba(145,88,12,.28) !important;}\n#wof .wof-card{backdrop-filter:none !important;-webkit-backdrop-filter:none !important;}\n#wof.ivm-descending .wof-wheelwrap{pointer-events:none;}\nhtml.p92-lean #wof .wof-wheelwrap.ivm-settled .wof-wheel{animation:none !important;}\n@media(min-width:760px){#wof .wof-wheelwrap{width:min(calc(100vw - 40px),calc(100dvh - 190px)) !important;}}\n@media(max-height:680px){#wof .wof-stage{padding-bottom:100px !important;}#wof .wof-wheelwrap{width:min(94vw,calc(100dvh - 170px)) !important;}}\n\n/* 15 · only the outer feathers move. Crown, ring, centre and plaque are core. */\n.pf-ava-frame{animation:none !important;}\n.p94-frart{position:absolute;inset:0;z-index:4;pointer-events:none;transform-style:preserve-3d;}\n.p94-frcore,.p94-wing{position:absolute;inset:0;display:block;width:100%;height:100%;pointer-events:none;}\n.p94-frcore{z-index:1;}\n.p94-wing{z-index:2;will-change:transform;backface-visibility:hidden;transform-style:preserve-3d;}\n.p94-wl{transform-origin:31% 56%;animation:p94FeatherL 5.6s cubic-bezier(.45,0,.55,1) infinite;}\n.p94-wr{transform-origin:69% 56%;animation:p94FeatherR 5.6s cubic-bezier(.45,0,.55,1) infinite;}\n@keyframes p94FeatherL{0%,100%{transform:perspective(700px) rotateY(0deg) rotateZ(0deg) translateY(0)}38%{transform:perspective(700px) rotateY(-24deg) rotateZ(-2.2deg) translateY(-.7%)}62%{transform:perspective(700px) rotateY(-15deg) rotateZ(-1.1deg) translateY(-.3%)}}\n@keyframes p94FeatherR{0%,100%{transform:perspective(700px) rotateY(0deg) rotateZ(0deg) translateY(0)}38%{transform:perspective(700px) rotateY(24deg) rotateZ(2.2deg) translateY(-.7%)}62%{transform:perspective(700px) rotateY(15deg) rotateZ(1.1deg) translateY(-.3%)}}\n.p94-frlit .p92-ring{animation-duration:9.8s !important;}\n.p94-frlit .p92-gem{mix-blend-mode:screen;}\n\n/* 16 · the measured word, never an ellipsis or a hidden end */\n.iv-badge,.iv-bd-plate,.iv-bd-band{overflow:visible !important;}\n.iv-bd-word{overflow:visible !important;text-overflow:clip !important;white-space:nowrap !important;max-width:none !important;}\n\n/* 17 · every Create control says what it does, including after playback starts */\n.c2 .c2-del{flex:0 0 auto !important;width:auto !important;min-width:88px !important;height:38px !important;padding:0 11px !important;border-radius:999px !important;display:flex !important;align-items:center;justify-content:center;gap:6px;background:linear-gradient(180deg,#FFF9E9,#E9D3A5) !important;box-shadow:inset 0 0 0 1px rgba(138,90,20,.25),0 5px 12px -9px rgba(80,45,5,.6) !important;}\n.c2-deltx,.c2-watchtx,.c2-playword{display:inline !important;font:800 9px/1 system-ui,sans-serif !important;letter-spacing:.10em !important;}\n.c2 .c2-play{width:88px !important;height:46px !important;border-radius:999px !important;display:flex !important;align-items:center;justify-content:center;gap:6px;background:linear-gradient(180deg,rgba(255,246,218,.94),rgba(213,165,66,.94)) !important;color:#4A170D !important;box-shadow:inset 0 1px 0 #FFF,0 8px 22px -10px rgba(40,5,12,.75) !important;}\n.c2 .c2-playbtn{flex:0 0 88px !important;width:88px !important;border-radius:999px !important;display:flex !important;align-items:center;justify-content:center;gap:6px;}\n\n/* 18 · Cheers: the ticker hue, made into lacquer, metal and light */\n#rbn-sheet[data-tone=\"1\"]{--r1:#B9385C;--r2:#8E1B3A;--r3:#5C0F22;--rg:rgba(255,173,196,.55)}\n#rbn-sheet[data-tone=\"2\"]{--r1:#258365;--r2:#12684A;--r3:#5C490A;--rg:rgba(160,244,195,.46)}\n#rbn-sheet[data-tone=\"3\"]{--r1:#E96827;--r2:#C73F02;--r3:#7A2508;--rg:rgba(255,202,133,.52)}\n#rbn-sheet[data-tone=\"4\"]{--r1:#C99A22;--r2:#9A6E00;--r3:#654900;--rg:rgba(255,238,163,.52)}\n#rbn-sheet[data-tone=\"5\"]{--r1:#E34883;--r2:#C2185B;--r3:#76103F;--rg:rgba(255,180,217,.5)}\n#rbn-sheet[data-tone=\"6\"]{--r1:#ED7954;--r2:#D8502C;--r3:#8E3419;--rg:rgba(255,205,177,.52)}\n#rbn-sheet[data-tone=\"7\"]{--r1:#E44B59;--r2:#C41E2F;--r3:#7A0A14;--rg:rgba(255,180,180,.5)}\n#rbn-sheet[data-tone=\"8\"]{--r1:#C9A14B;--r2:#A87C24;--r3:#6B4E10;--rg:rgba(255,237,174,.52)}\n#rbn-sheet[data-tone=\"9\"]{--r1:#79AC27;--r2:#4E8A00;--r3:#355C00;--rg:rgba(214,244,149,.48)}\n#rbn-sheet[data-tone=\"10\"]{--r1:#C14678;--r2:#9C1C52;--r3:#5B0B2D;--rg:rgba(255,180,215,.5)}\n#rbn-sheet[data-tone]{isolation:isolate;overflow:hidden;background:radial-gradient(90% 72% at 12% 0%,var(--rg),transparent 62%),radial-gradient(70% 58% at 96% 22%,rgba(255,240,190,.25),transparent 70%),linear-gradient(160deg,var(--r1),var(--r2) 58%,var(--r3)) !important;border-top:2px solid rgba(255,244,211,.95) !important;box-shadow:0 -24px 60px -24px rgba(60,26,4,.75),inset 0 1px 0 #FFF8E6,inset 0 0 0 1px rgba(255,225,160,.24) !important;}\n#rbn-sheet::before{content:\"\";position:absolute;inset:-40% -25%;z-index:1;pointer-events:none;background:linear-gradient(108deg,transparent 38%,rgba(255,255,255,.20) 48%,rgba(255,246,214,.38) 51%,transparent 62%);transform:translateX(-36%);animation:p94CheersSheen 7.5s ease-in-out infinite;}\n#rbn-sheet::after{content:\"\";position:absolute;inset:0;z-index:1;pointer-events:none;border-radius:inherit;box-shadow:inset 0 0 46px rgba(64,22,4,.24),inset 0 0 0 1px rgba(255,246,218,.26);}\n#rbn-sheet>:not(.burst){position:relative;z-index:2;}\n#rbn-sheet .burst{z-index:3;}\n@keyframes p94CheersSheen{0%,58%{transform:translateX(-38%);opacity:0}68%{opacity:.9}88%,100%{transform:translateX(38%);opacity:0}}\n#rbn-sheet .peek{backdrop-filter:none !important;-webkit-backdrop-filter:none !important;background:linear-gradient(180deg,rgba(255,250,232,.24),rgba(255,244,214,.10)) !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 8px 18px -12px rgba(50,20,2,.6) !important;}\n#rbn-sheet .sty i{position:relative;overflow:hidden;box-shadow:inset 0 2px 3px rgba(255,255,255,.65),inset 0 -8px 12px rgba(60,20,2,.20),0 7px 14px -7px rgba(50,20,2,.7) !important;}\n#rbn-sheet .sty i::after{content:\"\";position:absolute;inset:1px;border-radius:inherit;background:linear-gradient(145deg,rgba(255,255,255,.52),transparent 42%,rgba(255,231,172,.14) 70%,transparent);pointer-events:none;}\n#rbn-sheet .open{position:relative;overflow:hidden;background:linear-gradient(180deg,#FFFBE8 0%,#F5D98F 42%,#D5A43D 72%,#B67B18 100%) !important;box-shadow:0 0 0 1px #FFF8DF,0 12px 24px -12px rgba(80,42,4,.8),inset 0 1px 0 #FFF,inset 0 -3px 6px rgba(128,75,5,.22) !important;}\n#rbn-sheet .x{background:linear-gradient(180deg,rgba(255,250,235,.30),rgba(255,244,214,.12)) !important;box-shadow:inset 0 0 0 1px rgba(255,247,230,.55),0 5px 12px -8px rgba(40,15,2,.7) !important;}\n\n/* Story Door */\n.p94-sheet{background:linear-gradient(180deg,#FFFCF3,#F7EBCF) !important;color:#3E250E;}\n.p94-story-intro,.p94-story-done{padding:4px 2px 22px;text-align:center;}\n.p94-story-intro h3,.p94-story-done h3{margin:4px 0 4px;font:italic 700 25px/1.2 Georgia,serif;color:#7A1020;}\n.p94-story-intro>p,.p94-story-done>p{margin:0 0 18px;color:#76573A;font:14px/1.5 Georgia,serif;}\n.p94-quill{display:block;width:48px;height:48px;margin:0 auto 8px;filter:drop-shadow(0 5px 6px rgba(130,80,10,.25));}.p94-quill.large{width:64px;height:64px}.p94-quill svg{width:100%;height:100%;}\n.p94-label{display:block;margin:14px 0 6px;text-align:left;font:800 11px/1.3 system-ui,sans-serif;letter-spacing:.08em;color:#6D4617;text-transform:uppercase;}\n#p94-story-body,#p94-story-credit{display:block;width:100%;box-sizing:border-box;border:1px solid #D6BA7C;border-radius:14px;background:#FFFDF7;color:#3E250E;padding:13px 14px;font:15px/1.5 Georgia,serif;box-shadow:inset 0 2px 5px rgba(105,65,10,.06);}\n#p94-story-body{min-height:168px;resize:vertical;}#p94-story-credit{height:48px;}\n#p94-story-body:focus,#p94-story-credit:focus{outline:3px solid rgba(202,153,49,.24);border-color:#B78420;}\n.p94-count{text-align:right;margin-top:4px;color:#93734C;font-size:11px;}.p94-fine{color:#8B6D4B;font-size:12px;line-height:1.45;}.p94-error{min-height:18px;color:#9E2331;font-size:13px;line-height:1.4;}\n.p94-goldkey{display:block;width:100%;min-height:50px;padding:13px 17px;border:1px solid #B27A16;border-radius:999px;cursor:pointer;background:linear-gradient(180deg,#FFF4C8 0%,#E8BF5F 45%,#C38B24 100%);color:#3E250E;font:900 11px/1.2 system-ui,sans-serif;letter-spacing:.12em;box-shadow:inset 0 1px 0 #FFF,0 10px 20px -14px rgba(83,45,3,.8);}\n.p94-goldkey:disabled{opacity:.58;cursor:wait}.p94-goldkey.rose{margin-top:10px;background:linear-gradient(180deg,#FFF0EA,#E7B2A4 55%,#B96B60);color:#5C1120}.p94-textkey{min-height:42px;padding:9px 13px;border:0;background:transparent;color:#7A5430;text-decoration:underline;text-underline-offset:3px;cursor:pointer;font:700 12px/1.3 system-ui,sans-serif;}\n.p94-join,.p94-confirm{padding:4px 2px 22px;}.p94-join p,.p94-confirm p{font:15px/1.55 Georgia,serif;color:#6E4C2E;}.p94-confirm h3{font:italic 700 24px/1.25 Georgia,serif;color:#7A1020;}.p94-confirm-keys{display:flex;align-items:center;gap:10px;margin-top:18px}.p94-confirm-keys .p94-textkey{flex:0 0 auto}.p94-confirm-keys .p94-goldkey{flex:1;}\n\n/* Golden Heart */\n/* Her original ten-frame flame film stays on the main Golden Heart sheet.\n   The newer liquid-gold SVG remains only on Ring my doorbell. */\n#sheet-heart .gh-art.p94-flame-art{position:absolute;left:0 !important;top:0 !important;width:100% !important;height:100% !important;max-width:none !important;aspect-ratio:auto !important;transform:none !important;object-fit:cover;object-position:center 44%;background:none !important;filter:saturate(1.05) contrast(1.02) !important;animation:none !important;}\n#sheet-heart .p94-heart-pulse{position:absolute;inset:-5%;z-index:1;pointer-events:none;opacity:0;background:radial-gradient(circle at 50% 40%,rgba(255,241,174,.52) 0%,rgba(255,177,55,.20) 34%,rgba(255,116,30,0) 68%);transform:scale(.96);}\n#sheet-heart .p94-heart-panel.p94-heart-sounding .p94-heart-pulse{animation:p94FlameHeartbeat 1.2s linear infinite;}\n@keyframes p94FlameHeartbeat{0%{opacity:.72;transform:scale(.97)}9%{opacity:.10;transform:scale(1.025)}20%{opacity:.52;transform:scale(.985)}31%{opacity:.07;transform:scale(1.02)}55%,100%{opacity:0;transform:scale(1.035)}}\n@media(prefers-reduced-motion:reduce){#sheet-heart .p94-heart-panel.p94-heart-sounding .p94-heart-pulse{animation:none !important;opacity:0;}}\n.p94-heart-svg{display:block;width:100%;height:100%;overflow:visible;}\n.p94-liquid{transform-box:view-box;transform-origin:0 0;transition:transform 1.05s cubic-bezier(.18,.78,.22,1);will-change:transform;}\n.p94-wave{animation:p94Wave 3.8s ease-in-out infinite;}.p94-bubbles circle{animation:p94Bubble 3.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}.p94-bubbles circle:nth-child(2){animation-delay:-1.2s}.p94-bubbles circle:nth-child(3){animation-delay:-2.1s}.p94-bubbles circle:nth-child(4){animation-delay:-.7s}\n@keyframes p94Wave{0%,100%{transform:translateX(-3px)}50%{transform:translateX(3px)}}@keyframes p94Bubble{0%,100%{opacity:.2;transform:translateY(5px) scale(.8)}48%{opacity:.85;transform:translateY(-7px) scale(1.15)}}\n#sheet-heart .gh-copy{text-align:center;color:#6B4A26;}\n#sheet-heart .gh-greet{display:flex;align-items:center;justify-content:center;gap:9px;min-height:52px;border:1px solid #B37B17;border-radius:999px;background:linear-gradient(180deg,#FFF6D5,#E7BB5C 52%,#C28A28);color:#442405;box-shadow:inset 0 1px 0 #FFF,0 10px 22px -14px rgba(83,45,3,.8);font-weight:800;}\n#sheet-heart .gh-greet:disabled{opacity:.68}.ghh{display:inline-flex;width:24px;height:24px}.ghh .p94-miniheart{width:24px;height:24px;color:#B47A14}.p94-miniheart{width:18px;height:18px;display:block;color:#C9B897;}.p94-miniheart.on{color:#D9A62E;filter:drop-shadow(0 0 4px rgba(255,210,105,.55))}\n#sheet-heart .gh-treasure{border-radius:16px;background:linear-gradient(180deg,#FFFDF5,#F1DFB8);box-shadow:inset 0 1px 0 #FFF,0 8px 18px -14px rgba(83,45,3,.65);}\n#sheet-heart .gg{border-radius:12px;background:rgba(255,250,232,.58);box-shadow:inset 0 0 0 1px rgba(176,127,42,.12);}#sheet-heart .ggi .p94-miniheart{width:17px;height:17px}.gg.done{background:rgba(239,221,171,.7) !important;}\n#sheet-heart .gh-week{display:grid !important;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px !important;align-items:stretch;}\n#sheet-heart .gh-week .gd{position:static !important;min-width:0 !important;min-height:66px !important;padding:6px 1px 5px !important;display:flex !important;flex-direction:column;align-items:center;justify-content:space-between;gap:2px;border-radius:12px;background:rgba(255,251,239,.62);box-shadow:inset 0 0 0 1px rgba(165,113,28,.14);}\n#sheet-heart .gh-week .gd i{position:static !important;margin:0 !important;font:800 8px/1 system-ui,sans-serif !important;letter-spacing:0 !important;color:#8B6B43;white-space:nowrap;}\n#sheet-heart .gh-week .gd.today i{font-size:7px !important;color:#7A1020;}\n#sheet-heart .gh-week .gd b{display:block;margin:0 !important;line-height:1;}#sheet-heart .gh-week .gd b svg{width:18px;height:18px;}#sheet-heart .gh-week .gd s{text-decoration:none;font:700 9px/1 system-ui,sans-serif;color:#8A5A12;}\n#sheet-heart .gh-week .gd.on{background:linear-gradient(180deg,#FFF8DF,#EBCB83);box-shadow:inset 0 0 0 1px rgba(166,105,14,.28),0 5px 12px -10px rgba(95,50,3,.6)}\n#sheet-heart .gh-mend .mh{display:inline-flex;width:25px;height:25px;}#sheet-heart .gh-mend .mh svg{width:24px;height:24px;}#sheet-heart .gh-mend .mh.dim{opacity:.35;}\n.p94-note{margin:8px 0;color:#8A3B2C;font-size:12.5px;line-height:1.4;text-align:center;}.p94-note:empty{display:none}.p94-note.on-dark{color:#7A3B2C;}\n\n/* Ring my doorbell: warm house lacquer, jewel bells, real server state */\n#sheet-bells .bl-arch{background:radial-gradient(circle at 50% 8%,rgba(255,255,255,.95),transparent 38%),radial-gradient(circle at 8% 40%,rgba(255,223,150,.52),transparent 44%),linear-gradient(165deg,#FFF9E9 0%,#F4DFAD 58%,#DFBC72 100%) !important;box-shadow:inset 0 1px 0 #FFF,inset 0 0 0 1px rgba(164,108,20,.20),0 16px 32px -24px rgba(87,47,4,.75) !important;}\n#sheet-bells .bl-title{color:#5C1120 !important;text-shadow:0 1px 0 #FFF;}#sheet-bells .bl-sub{color:#8A5A12 !important;}\n#sheet-bells .bl-bells{margin-top:30px;gap:4px;}#sheet-bells .bl-bell{min-width:0;}\n#sheet-bells .bl-svg.p94-bell-art{width:52px !important;height:68px !important;background:none !important;border:0 !important;box-shadow:none !important;filter:drop-shadow(0 7px 5px rgba(77,39,5,.24));opacity:1 !important;}\n#sheet-bells .bl-svg.p94-bell-art::before,#sheet-bells .bl-svg.p94-bell-art::after{display:none !important;}#sheet-bells .bl-svg svg{width:100%;height:100%;display:block;overflow:visible;}\n#sheet-bells .bl-bell:not(.is-open):not(.rung) .p94-bell-art{filter:saturate(.62) drop-shadow(0 5px 4px rgba(77,39,5,.16));opacity:.78 !important;}\n#sheet-bells .bl-bell.is-open .p94-bell-art{animation:p94BellFloat 3.8s ease-in-out infinite;}#sheet-bells .bl-bell.unseen .p94-bell-art{filter:drop-shadow(0 0 10px var(--bell));}\n@keyframes p94BellFloat{0%,100%{transform:rotate(0) translateY(0)}45%{transform:rotate(-2deg) translateY(-2px)}70%{transform:rotate(1deg) translateY(-1px)}}\n#sheet-bells .bl-bell b{font-size:10px !important;color:#4E2B0B !important;}#sheet-bells .bl-bell i{min-height:22px;font-size:8.6px !important;line-height:1.25 !important;color:#805B31 !important;}\n#sheet-bells .bl-heart{width:108px;height:108px;margin-top:14px;background:radial-gradient(circle,#FFFDF3,#F2D89C 66%,#C79536) !important;box-shadow:inset 0 1px 0 #FFF,0 0 0 1px rgba(156,99,13,.22),0 10px 22px -14px rgba(91,48,4,.7) !important;}\n#sheet-bells .bl-hcore{position:relative;inset:auto;width:84px;height:76px;background:none !important;animation:none !important;filter:drop-shadow(0 6px 5px rgba(105,57,4,.24));}#sheet-bells .bl-hcore::before,#sheet-bells .bl-hcore::after{display:none !important;}#sheet-bells .bl-hring{animation:p94HeartHalo 5.2s ease-in-out infinite !important;}\n@keyframes p94HeartHalo{0%,100%{opacity:.3;transform:scale(.9)}50%{opacity:.82;transform:scale(1.08)}}\n#sheet-bells .bl-count{color:#6E4521 !important;}#sheet-bells .bl-count b{color:#7A1020 !important;}\n#sheet-bells .bl-orbs{gap:5px;margin-top:16px;}#sheet-bells .bl-orb{min-width:0;padding:5px 1px;border-radius:15px;cursor:pointer;transition:transform .16s ease,background .16s ease;}#sheet-bells .bl-orb:active{transform:scale(.95)}#sheet-bells .bl-orb:focus-visible{outline:3px solid rgba(166,105,14,.35);}\n#sheet-bells .bl-orb>span{width:48px !important;height:48px !important;border:1px solid rgba(255,248,220,.85);background:radial-gradient(circle at 32% 22%,#FFFFFF 0%,var(--bell) 38%,var(--bell) 60%,#56324F 145%) !important;box-shadow:inset 0 2px 4px rgba(255,255,255,.7),inset 0 -8px 12px rgba(52,24,55,.20),0 7px 13px -7px rgba(67,34,5,.55) !important;color:#FFF !important;}\n#sheet-bells .bl-orb>span svg{width:22px;height:22px;display:block;}#sheet-bells .bl-orb.rung>span{box-shadow:inset 0 2px 4px rgba(255,255,255,.8),0 0 0 3px rgba(255,246,211,.7),0 0 16px var(--bell) !important;}\n#sheet-bells .bl-orb b{font-size:9px !important;color:#4E2B0B !important;}#sheet-bells .bl-orb i{min-height:21px;font-size:8.2px !important;line-height:1.25 !important;color:#805B31 !important;}\n#sheet-bells .bl-card{border:1px solid rgba(158,105,25,.20) !important;background:linear-gradient(145deg,#FFFDF6,#F2E2C0) !important;box-shadow:inset 0 1px 0 #FFF,0 9px 20px -16px rgba(83,45,3,.6) !important;}\n#sheet-bells .bl-pledge{gap:8px;}#sheet-bells .bl-pledge .pl{min-width:62px;min-height:44px;border:1px solid #C09238;border-radius:999px;background:linear-gradient(180deg,#FFF9E5,#E4C376 58%,#C79A3C);color:#57330A;box-shadow:inset 0 1px 0 #FFF,0 7px 14px -10px rgba(83,45,3,.7);font-weight:800;}\n.p94-pledge-now{padding:10px 12px;border-radius:14px;background:rgba(255,248,224,.72);text-align:center;}.p94-pledge-now b,.p94-pledge-now span{display:block}.p94-pledge-now b{color:#6B360D;font:700 15px/1.3 Georgia,serif}.p94-pledge-now span{margin:4px 0;color:#80603D;font-size:12px;}\n#sheet-bells .bl-set{border:1px solid #C49A4B !important;border-radius:18px;background:linear-gradient(145deg,#FFFDF4,#E9CE91) !important;box-shadow:inset 0 1px 0 #FFF,0 10px 22px -15px rgba(83,45,3,.65) !important;}\n#sheet-bells .bl-ring{border:1px solid rgba(167,110,23,.24);background:radial-gradient(circle at 35% 25%,#FFF,#F1DDAE 68%,#D5AE5C);box-shadow:inset 0 1px 0 #FFF,0 8px 16px -12px rgba(83,45,3,.65);}\n#sheet-bells .bl-togs .tog{background:linear-gradient(180deg,#D8C49B,#B89A67) !important;box-shadow:inset 0 2px 4px rgba(81,47,8,.18),0 3px 7px -4px rgba(70,40,5,.5) !important;}#sheet-bells .bl-togs .tog.on{background:linear-gradient(180deg,#FFE9A6,#D2A23E) !important;}#sheet-bells .bl-togs .tog i{box-shadow:inset 0 1px 0 #FFF,0 2px 5px rgba(70,40,5,.35) !important;}\n.p94-linecopy{font:italic 18px/1.55 Georgia,serif;color:#6B2330;white-space:pre-wrap;}.p94-setintro{font:14px/1.5 Georgia,serif;color:#755333;}.p94-setgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding-bottom:20px;}.p94-set-tile{position:relative;min-height:126px;padding:14px 10px;border:1px solid #D1B174;border-radius:18px;background:linear-gradient(145deg,#FFFDF6,#EFDCB4);color:#51300E;cursor:pointer;box-shadow:inset 0 1px 0 #FFF,0 8px 18px -14px rgba(83,45,3,.65);}.p94-set-tile.locked{filter:saturate(.55);opacity:.72}.p94-set-tile.wearing{outline:3px solid rgba(192,137,32,.28);border-color:#A87313}.p94-set-tile b,.p94-set-tile span{display:block}.p94-set-tile b{margin:9px 0 5px;font:700 15px/1.2 Georgia,serif}.p94-set-tile>span:not(.p94-setdots){font-size:11px;line-height:1.3}.p94-set-tile em{position:absolute;right:9px;top:8px;color:#9B6B13;font-style:normal;}.p94-setdots{display:flex!important;justify-content:center;gap:5px}.p94-setdots i{width:22px;height:22px;border-radius:50%;box-shadow:inset 0 2px 3px rgba(255,255,255,.75),0 3px 6px rgba(60,30,5,.22)}\n\n/* Live: Agora is explicitly unmirrored; no dark glass across the camera. */\n#lv-cast video,#lv-video,.lv-stage video,.lv-self video,.lv-video video,.lv-tile video{transform:none !important;}\nbody.on-live .lv-stage.p92-bare::after{background:linear-gradient(180deg,rgba(58,4,16,.18) 0%,transparent 10%),linear-gradient(0deg,rgba(58,4,16,.18) 0%,transparent 12%) !important;}\n\n@media(max-width:420px){\n  #home-screen .card.c-line .card-in{min-height:282px !important;padding-left:13px !important;}\n  #home-screen .card.c-line .title{font-size:21px !important;}\n  #home-screen .card.c-line .lede{font-size:10.8px !important;}\n  #sheet-bells .bl-svg.p94-bell-art{width:46px !important;height:61px !important;}\n  #sheet-bells .bl-orb>span{width:44px !important;height:44px !important;}\n  #sheet-heart .gh-art.p94-heart-orb{width:172px;height:156px;}\n}\n@media(prefers-reduced-motion:reduce){\n  #iv-open #ivo-film{transition:none !important}.med.bell .bellsvg,.med.bell .bellhalo,.p94-climb .laddersvg g:nth-child(2) path,.p94-climber,#rbn-sheet::before,.p94-wave,.p94-bubbles circle,#sheet-bells .bl-bell.is-open .p94-bell-art,#sheet-bells .bl-hring{animation:none !important;}\n  .p94-liquid{transition:none !important;}\n}\nhtml.p92-lean .p94-frlit .p92-sheen,html.p92-lean .p94-frlit::before{display:none !important;}\nhtml.p92-lean #rbn-sheet::before{display:none !important;}\n";
var s=document.createElement('style');s.id='iv-pass92-css';s.textContent=c;
function last(){(document.body||document.head||document.documentElement).appendChild(s);}
last();document.addEventListener('DOMContentLoaded',function(){setTimeout(last,0);});
window.addEventListener('load',function(){last();setTimeout(last,120);});setTimeout(last,1800);
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
  var VISITOR_COPY = 'you are 4028 visitor of the day';

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
      if (strip.getAttribute('data-pulse') !== '4028') strip.setAttribute('data-pulse', '4028');
      setFrozen(tx, VISITOR_COPY);
    });
    /* The number and the words are one fixed line, on Home and Profile. */
    $$('.pulse-card').forEach(function (card) {
      var lead = $('.pulse-lead', card), tail = $('.pulse-tail', card);
      var ord = $('#pf-pulse-ord', card) || $('.pulse-ord', card);
      var number = $('#pf-pulse-n', card), copy = $('#pf-pulse-copy', card);
      if (lead && lead.textContent.trim() !== 'you are') lead.textContent = 'you are';
      if (tail && tail.textContent.trim() !== 'visitor of the day') tail.textContent = 'visitor of the day';
      if (number) {
        if (number.getAttribute('data-to') !== '4028') number.setAttribute('data-to', '4028');
        setFrozen(number, '4028');
      }
      if (ord) { if (ord.textContent) ord.textContent = ''; if (ord.style.display !== 'none') ord.style.display = 'none'; }
      if (copy) setFrozen(copy, VISITOR_COPY);
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
        var sheet = d.getElementById('sheet-' + id);
        /* Two handlers may ask for the same visible sheet in one tick. A sheet
           which has since been closed is a new intention, never a duplicate:
           content sheets close their old post before opening the next one. */
        if (id === lastId && t - last < 260 && sheet && sheet.classList.contains('show')) return;
        last = t; lastId = id;
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
      if (w.IVORY_STORY_DOOR && w.IVORY_STORY_DOOR.open) w.IVORY_STORY_DOOR.open();
      else if (w.openSheet) w.openSheet('story');
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

  /* ══ 1 · the wheel's two keys, and why they were dead ══════════════════
     Measured on a 390 × 844 handset, with the wheel open:
       · the cross sits at 332,16 — and the element at that point is
         `.wof-stage`, a 390 × 844 sheet painted after the header, which
         eats every tap meant for the cross;
       · the prize card carries `pointer-events:none` and `.on` never puts
         it back, so KEEP IT can never receive a finger, only a script.
     The stage no longer takes the hand, the head and card stand above it,
     and the card takes its taps back the moment it is on.                */
  function wheelFind() {
    var stage = $('#wof .wof-stage'), head = $('#wof .wof-head'), card = $('#wof .wof-card');
    if (stage) stage.style.pointerEvents = 'none';
    if (head) { head.style.position = 'absolute'; head.style.zIndex = '7'; }
    if (card && card.classList.contains('on')) card.style.pointerEvents = 'auto';
  }

  /* ══ 4 · the well asks where the picture comes from ═══════════════════
     Her words: it "opens straight to the camera" and the gallery is never
     offered. So the well stops being one hidden input: it asks, in the
     house's own voice, whether the picture comes from the lens or the
     shelf — and the answer is handed to the room's real input.          */
  var pickerEl = null;
  function closePicker() {
    if (pickerEl && pickerEl.parentNode) pickerEl.parentNode.removeChild(pickerEl);
    pickerEl = null;
    d.body.classList.remove('p92-pick');
  }
  function pickSheet(kind, cb) {
    closePicker();
    var isImg = kind === 'image', isAud = kind === 'audio';
    var acc = isImg ? 'image/*' : isAud ? 'audio/*' : 'video/*';
    var cap = isImg ? 'environment' : isAud ? '' : 'camcorder';
    pickerEl = d.createElement('div');
    pickerEl.className = 'ivsheet-wrap p92-pick show';
    pickerEl.innerHTML =
      '<div class="ivsheet-scrim" data-p92p-close></div>' +
      '<div class="p92-pick-card">' +
        '<p class="p92-pick-k">' + (isImg ? 'A picture' : isAud ? 'A recording' : 'A film') + '</p>' +
        '<h3>Where does it come from?</h3>' +
        '<button class="p92-pick-key" data-p92p="cam">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.2h3.1L8.6 6h6.8l1.5 2.2H20a1.6 1.6 0 011.6 1.6v8a1.6 1.6 0 01-1.6 1.6H4a1.6 1.6 0 01-1.6-1.6v-8A1.6 1.6 0 014 8.2z" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="13.6" r="3.4" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>' +
          '<span><b>' + (isAud ? 'Record it now' : 'Take it now') + '</b><i>' + (isImg ? 'the camera opens' : isAud ? 'the recorder opens' : 'the camera records') + '</i></span>' +
        '</button>' +
        '<button class="p92-pick-key" data-p92p="shelf">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.2" y="4.4" width="17.6" height="15.2" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="8.6" cy="9.6" r="1.8" fill="currentColor"/><path d="M4.4 17.4l4.9-4.6 3.4 3.1 3-2.7 4.1 4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>' +
          '<span><b>' + (isAud ? 'Choose a file' : 'From the gallery') + '</b><i>' + (isImg ? 'what is already on this phone' : isAud ? 'music, notes, a recording' : 'a film already on this phone') + '</i></span>' +
        '</button>' +
        '<button class="p92-pick-x" data-p92p-close>Not now</button>' +
        '<input type="file" class="p92-pick-in" data-p92p-in accept="' + acc + '" hidden>' +
      '</div>';
    d.body.appendChild(pickerEl);
    d.body.classList.add('p92-pick');
    var input = pickerEl.querySelector('.p92-pick-in');
    pickerEl.addEventListener('click', function (e) {
      var t = e.target;
      if (t.closest('[data-p92p-close]')) { e.preventDefault(); closePicker(); return; }
      var b = t.closest('[data-p92p]');
      if (!b) return;
      e.preventDefault();
      if (b.getAttribute('data-p92p') === 'cam' && cap) input.setAttribute('capture', cap);
      else input.removeAttribute('capture');
      /* IVCAPTURE also listens to this programmatic click. Let this explicit
         choice through unchanged: Gallery must not be turned back into Camera. */
      input.__ivpass = true;
      input.click();
    }, false);
    input.addEventListener('change', function () {
      var f = input.files && input.files[0];
      closePicker();
      if (f && cb) cb(f);
    }, false);
  }

  function mediaPickers() {
    if (d.__p92pick) return;
    d.__p92pick = 1;
    on(d, 'click', function (e) {
      var drop = e.target.closest && e.target.closest('#c2-drop');
      if (!drop) return;
      e.preventDefault();
      e.stopPropagation();
      var file = d.getElementById('c2-file');
      var acc = file ? (file.getAttribute('accept') || '') : '';
      var kind = /image/.test(acc) ? 'image' : /audio/.test(acc) ? 'audio' : 'video';
      pickSheet(kind, function (f) {
        if (!file) return;
        try {
          var dt = new DataTransfer();
          dt.items.add(f);
          file.files = dt.files;
          file.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (err) {
          /* older handsets: hand the room a real change another way */
          try { Object.defineProperty(file, 'files', { value: dt.files, configurable: true }); } catch (e2) {}
          file.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }, true);
  }

  /* ══ 7 · the face she chooses ══════════════════════════════════════════
     There was no way to set a picture at all. Now the disc itself is the
     door: one tap asks lens or shelf, the frame is squared from its centre
     and kept at 512, and it is worn large and centred — on her own screen
     and in the keeper's desk, because it is the same card.                */
  var AVA_KEY = 'ivory.face';
  function faceOf() {
    try { return localStorage.getItem(AVA_KEY) || ''; } catch (e) { return ''; }
  }
  function squareFace(file, done) {
    var img = new Image(), url = URL.createObjectURL(file);
    img.onload = function () {
      var s = Math.min(img.width, img.height);
      var c = d.createElement('canvas');
      c.width = c.height = 512;
      var g = c.getContext('2d');
      g.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 512, 512);
      URL.revokeObjectURL(url);
      try { done(c.toDataURL('image/jpeg', 0.9)); } catch (e) { done(''); }
    };
    img.onerror = function () { URL.revokeObjectURL(url); done(''); };
    img.src = url;
  }
  function paintFace() {
    var ava = d.getElementById('pf-ava');
    if (!ava) return;
    var url = faceOf();
    if (url) {
      ava.style.backgroundImage = 'url(' + url + ')';
      ava.style.backgroundSize = 'cover';
      ava.style.backgroundPosition = '50% 50%';
      ava.classList.add('p92-face');
      ava.textContent = '';
    }
  }
  function avatarPicker() {
    var ava = d.getElementById('pf-ava');
    if (!ava || ava.__p92ava) return;
    ava.__p92ava = 1;
    ava.removeAttribute('aria-hidden');
    ava.setAttribute('role', 'button');
    ava.setAttribute('tabindex', '0');
    ava.setAttribute('aria-label', 'Change your picture');
    var badge = d.createElement('button');
    badge.type = 'button';
    badge.className = 'p92-face-edit';
    badge.setAttribute('aria-label', 'Change your picture');
    badge.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.2h3.1L8.6 6h6.8l1.5 2.2H20a1.6 1.6 0 011.6 1.6v8a1.6 1.6 0 01-1.6 1.6H4a1.6 1.6 0 01-1.6-1.6v-8A1.6 1.6 0 014 8.2z" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="13.6" r="3.4" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>';
    var top = ava.closest('.pf-reg-stage') || ava.closest('.me-top') || ava.parentNode;
    top.classList.add('p92-face-wrap');
    top.appendChild(badge);
    function ask(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      pickSheet('image', function (f) {
        squareFace(f, function (url) {
          if (url) { try { localStorage.setItem(AVA_KEY, url); } catch (err) {} }
          paintFace();
        });
      });
    }
    on(ava, 'click', ask, true);
    on(badge, 'click', ask, true);
    on(ava, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') ask(e); });
    paintFace();
  }

  /* ══ 8 · nothing she types is ever cut off a badge ═════════════════════
     The plaque shrinks its word until it fits the plate it is drawn on,
     but the plate's inner band is narrower than the plate's box, so a long
     line still ran under both ends. This measures the word against the
     band the gold actually gives it and scales what does not fit.        */
  function badgeFit() {
    if (w.IVREG && w.IVREG.fitBadges) {
      try { w.IVREG.fitBadges(d); } catch (e) {}
    }
  }

  /* ══ 2b · one natural landing tick, reported by the wheel itself ════ */
  w.ivWheelTick = function () { tickOnce(); };
  function tickOnce() {
    try {
      var A = w.AudioContext || w.webkitAudioContext;
      if (!A) return;
      w.__p92ac = w.__p92ac || new A();
      var ac = w.__p92ac;
      if (ac.state === 'suspended') ac.resume();
      var t0 = ac.currentTime;
      /* the wooden click of the pin */
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = 'triangle'; o.frequency.setValueAtTime(1180, t0);
      o.frequency.exponentialRampToValueAtTime(420, t0 + 0.055);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.10, t0 + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.13);
      o.connect(g); g.connect(ac.destination); o.start(t0); o.stop(t0 + 0.15);
      /* and the room answering it, one soft high chime */
      var o2 = ac.createOscillator(), g2 = ac.createGain();
      o2.type = 'sine'; o2.frequency.setValueAtTime(1760, t0 + 0.03);
      g2.gain.setValueAtTime(0.0001, t0 + 0.03);
      g2.gain.exponentialRampToValueAtTime(0.045, t0 + 0.05);
      g2.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.62);
      o2.connect(g2); g2.connect(ac.destination); o2.start(t0 + 0.03); o2.stop(t0 + 0.66);
    } catch (e) {}
  }

  /* ══ 9 · THE FRAMES COME ALIVE ═════════════════════════════════════════
     She asked for the real thing: slow angel wings, feathers that move,
     gemstones that catch and flash, and a ring of gold light that goes
     round the frame every so often.

     There is no animation in the files — all nine frames are still WebP.
     So the movement is built from the pictures themselves:
       · the art is split down the middle and each half turns from its
         shoulder, so the wings open and close like wings and not like a
         photograph being rotated;
       · the glass is found by looking at the picture — every small, bright,
         saturated spot is a stone — and the sparkles are put exactly there,
         which is why they sit on the stones and not beside them;
       · a ring of light goes round the rim once, then rests;
       · the whole frame breathes under it all.
     Everything is transform and opacity only, so a 3 GB handset composites
     it rather than computes it.                                          */
  var GEMS = {};                       /* src → [[x%, y%], …]            */

  function gemsFrom(src, done) {
    if (GEMS[src]) { done(GEMS[src]); return; }
    var img = new Image();
    img.onload = function () {
      var N = 96, c = d.createElement('canvas'), out = [];
      c.width = c.height = N;
      try {
        var g = c.getContext('2d', { willReadFrequently: true });
        g.drawImage(img, 0, 0, N, N);
        var px = g.getImageData(0, 0, N, N).data;
        var cells = {};
        for (var y = 0; y < N; y++) {
          for (var x = 0; x < N; x++) {
            var i = (y * N + x) * 4, r = px[i], gg = px[i + 1], b = px[i + 2], a = px[i + 3];
            if (a < 140) continue;
            var mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
            var sat = mx ? (mx - mn) / mx : 0;
            var val = mx / 255;
            var coloured = sat >= 0.38 && val >= 0.52;
            var diamond = sat < 0.30 && val >= 0.86;
            if (!coloured && !diamond) continue;
            var key = Math.floor(x / 12) + ':' + Math.floor(y / 12);
            var cell = cells[key] || (cells[key] = { n: 0, x: 0, y: 0, s: 0 });
            cell.n++; cell.x += x; cell.y += y; cell.s += coloured ? sat * val : val * 0.72;
          }
        }
        var list = Object.keys(cells).map(function (k) {
          var c2 = cells[k];
          return { x: (c2.x / c2.n) / N * 100, y: (c2.y / c2.n) / N * 100, s: c2.s };
        }).filter(function (o) { return o.s > 1.1; })
          .sort(function (a, b) { return b.s - a.s; });
        /* keep the strongest, drop anything hugging another stone */
        var keep = [];
        list.forEach(function (o) {
          if (keep.length >= 8) return;
          for (var j = 0; j < keep.length; j++) {
            if (Math.abs(keep[j].x - o.x) < 9 && Math.abs(keep[j].y - o.y) < 9) return;
          }
          keep.push(o);
        });
        out = keep.map(function (o) { return [Math.round(o.x), Math.round(o.y)]; });
      } catch (e) { out = []; }
      GEMS[src] = out;
      done(out);
    };
    img.onerror = function () { GEMS[src] = []; done([]); };
    img.src = src;
  }

  function lightFrame(fr) {
    if (!fr || fr.__p92alive || fr.classList.contains('iv-mount')) return;
    var art = fr.querySelector('.iv-frame-art');
    if (!art) return;
    var src = art.getAttribute('src');
    if (!src) return;
    fr.__p92alive = 1;

    var img = new Image();
    img.onload = function () {
      try {
        var S = 512;
        var base = d.createElement('canvas'); base.width = base.height = S;
        var bg = base.getContext('2d', { willReadFrequently: true });
        bg.drawImage(img, 0, 0, S, S);
        var source = bg.getImageData(0, 0, S, S);
        var key = (src.match(/([^/]+)\.webp/) || [])[1] || '';
        var winged = { a3: 1, a4: 1, s1: 1, s2: 1, s3: 1, s4: 1, s5: 1 }[key];
        var core = d.createElement('canvas'); core.width = core.height = S;
        core.className = 'p94-frcore';
        var cg = core.getContext('2d');
        var corePx = cg.createImageData(S, S);
        corePx.data.set(source.data);

        var wrap = d.createElement('span');
        wrap.className = 'p92-wings p94-frart';
        wrap.setAttribute('aria-hidden', 'true');
        wrap.appendChild(core);

        if (winged) {
          var left = d.createElement('canvas'), right = d.createElement('canvas');
          left.width = left.height = right.width = right.height = S;
          left.className = 'p94-wing p94-wl'; right.className = 'p94-wing p94-wr';
          var lg = left.getContext('2d'), rg = right.getContext('2d');
          var lp = lg.createImageData(S, S), rp = rg.createImageData(S, S);
          var top = key === 's2' || key === 's5' ? 0.07 : 0.13;
          var bottom = key === 's2' ? 0.67 : key === 's5' ? 0.50 : 0.88;
          for (var y = 0; y < S; y++) {
            var ny = y / S;
            for (var x = 0; x < S; x++) {
              var nx = x / S, i = (y * S + x) * 4;
              if (source.data[i + 3] < 8 || ny < top || ny > bottom) continue;
              var ex = (nx - 0.5) / 0.335, ey = (ny - 0.52) / 0.39;
              var outsideRing = ex * ex + ey * ey > 1;
              var isLeft = nx < 0.31, isRight = nx > 0.69;
              if (!outsideRing || (!isLeft && !isRight)) continue;
              var target = isLeft ? lp.data : rp.data;
              target[i] = source.data[i]; target[i + 1] = source.data[i + 1];
              target[i + 2] = source.data[i + 2]; target[i + 3] = source.data[i + 3];
              corePx.data[i + 3] = 0;
            }
          }
          cg.putImageData(corePx, 0, 0);
          lg.putImageData(lp, 0, 0); rg.putImageData(rp, 0, 0);
          wrap.appendChild(left); wrap.appendChild(right);
          wrap.classList.add('p94-haswings');
        } else {
          cg.putImageData(source, 0, 0);
          wrap.classList.add('p94-nowings');
        }

        var sheen = d.createElement('span'); sheen.className = 'p92-sheen';
        sheen.innerHTML = '<i></i><i></i>';
        var ring = d.createElement('span'); ring.className = 'p92-ring';
        wrap.appendChild(sheen); wrap.appendChild(ring);
        fr.appendChild(wrap);
        art.style.visibility = 'hidden';
        fr.classList.add('p92-alive', 'p94-frlit');
      } catch (e) {
        art.style.visibility = '';
      }
    };
    img.onerror = function () { fr.__p92alive = 0; };
    img.src = src;

    gemsFrom(src, function (list) {
      list.forEach(function (p, i) {
        var s = d.createElement('span');
        s.className = 'p92-gem';
        s.style.left = p[0] + '%';
        s.style.top = p[1] + '%';
        s.style.setProperty('--d', (i * 0.83).toFixed(2) + 's');
        s.style.setProperty('--t', (3.8 + (i % 4) * 0.72).toFixed(2) + 's');
        fr.appendChild(s);
      });
    });
  }

  function stageBare() {
    var st = d.querySelector('.lv-stage');
    if (!st) return;
    var live = !!st.querySelector('.lv-video video');
    if (live !== st.classList.contains('p92-bare')) st.classList.toggle('p92-bare', live);
  }

  function framesAlive() {
    $$('.iv-frame').forEach(lightFrame);
    $$('.iv-badge').forEach(function (b) {
      if (!b.__p92g) {
        b.__p92g = 1;
        /* the plaque's own stones: the two flanking jewels and the crown one */
        [[50, 12, '0s'], [11.5, 50, '.9s'], [88.5, 50, '1.7s'], [50, 88, '2.4s']].forEach(function (p) {
          var s = d.createElement('span');
          s.className = 'p92-bgem';
          s.style.left = p[0] + '%';
          s.style.top = p[1] + '%';
          s.style.setProperty('--d', p[2]);
          b.appendChild(s);
        });
      }
      if (!b.__p92ring) {
        b.__p92ring = 1;
        var r = d.createElement('span');
        r.className = 'p92-bring';
        r.setAttribute('aria-hidden', 'true');
        b.appendChild(r);
      }
    });
  }

  /* ── 9 · the wheel: in her right hand, and every key alive ──────────────
     The medallion was left of the ladder and, once the salon opened, its
     cross and its KEEP IT did nothing. Both are given a listener of their
     own, in the capture phase, so nothing else can swallow the tap.       */
  function wheelAlive() {
    var med = d.getElementById('wof-med');
    var room = d.getElementById('wof');
    if (!med || !room) return;

    function shut(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      if (w.IVORY_WHEEL && w.IVORY_WHEEL.close) w.IVORY_WHEEL.close();
      else {
        room.classList.remove('show', 'has-card');
        room.setAttribute('aria-hidden', 'true');
        d.body.classList.remove('wof-open', 'sheet-open');
        if (w.IVMEDALLION && w.IVMEDALLION.cancel) w.IVMEDALLION.cancel();
      }
      var salon = $('.wof-salon', room);
      if (salon) salon.classList.remove('on');
    }
    function openIt(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      if (w.IVORY_WHEEL && w.IVORY_WHEEL.open) w.IVORY_WHEEL.open();
      else {
        var wheel = d.getElementById('wof-wheel'); if (wheel) wheel.style.transition = '';
        room.classList.add('show'); room.setAttribute('aria-hidden', 'false');
        d.body.classList.add('wof-open');
      }
    }
    if (!med.__p92) {
      med.__p92 = 1;
      on(med, 'click', openIt, true);
    }
    $$('#wof .wof-x, #wof .ws-x, #wof [data-wof-close], #wof .wof-ok, #wof-ok, #wof .wof-keep, #wof .wof-salon-scrim', room)
      .forEach(function (b) {
        if (b.__p92x) return;
        b.__p92x = 1;
        on(b, 'click', shut, true);
      });
    on(d, 'keydown', function (e) {
      if (e.key === 'Escape' && room.classList.contains('show')) shut(e);
    }, true);
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
    /* Pass 87 now owns frame-only and canonical server regalia. This old
       fallback must never put a second frame inside the face. */
    if (w.IVBADGE && w.IVBADGE.dressFromPage) {
      Array.prototype.forEach.call(card.querySelectorAll('.p92-ava-frame, #pf-regalia92'), function (n) {
        if (n.parentNode) n.parentNode.removeChild(n);
      });
      if (card.getAttribute('data-p92dress') !== 'badge87') {
        card.setAttribute('data-p92dress', 'badge87');
        try { w.IVBADGE.dressFromPage(); } catch (e) {}
      }
      return;
    }
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
  var beatBusy = false, beatEvery = 900, lastFit = 0;
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
    try { wheelFind(); } catch (e) {}
    try {
      var nowT = Date.now();
      if (nowT - lastFit > 3500) { lastFit = nowT; badgeFit(); framesAlive(); }
      try { stageBare(); } catch (e) {}
    } catch (e) {}
    try { dressProfile(); } catch (e) {}
    try { if (w.IVP94 && w.IVP94.beat) w.IVP94.beat(); } catch (e) {}
    beatBusy = false;
  }
  function boot() {
    vaultAlways();
    vaultSheet();
    mediaPickers();
    avatarPicker();
    framesAlive();
    wheelAlive();
    heartbeat();
    /* 10 · a small handset gets a lighter pulse. The house answers a tap
       before it does its housekeeping: on a 3 GB phone this interval is the
       difference between a screen that waits and a screen that stutters.  */
    var light = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
    if (light) d.documentElement.classList.add('p92-lean');
    beatEvery = light ? 1600 : 900;
    setInterval(heartbeat, beatEvery);
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

/* ══════════════════════════════════════════════════════════════════════════
   IVORY · PASS 94 · the story door, the living heart and the four bells
   Server state is the authority. No static score, pledge, set or bell is
   presented as though it were the member's own.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.IVP94) return;
  var d = document, w = window;
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }
  function on(el, ev, fn, cap) { if (el) el.addEventListener(ev, fn, !!cap); }
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function num(o, k, fallback) {
    var n = Number(o && o[k]);
    return isFinite(n) ? n : (fallback || 0);
  }
  function map(r) {
    if (Array.isArray(r)) return r[0] || {};
    return r && typeof r === 'object' ? r : {};
  }
  function signed() {
    try { return !!(w.IVSESS && IVSESS.ident() && IVSESS.ident().id); } catch (e) { return false; }
  }
  function rpc(name, params) {
    if (!signed()) return Promise.reject(new Error('Sign in to continue.'));
    return IVSESS.call('/rest/v1/rpc/' + name, params || {});
  }
  function message(e) {
    return String(e && (e.message || e.error_description || e.error) || e || 'The house could not answer.').replace(/^Exception:\s*/, '');
  }
  function toast(s, bad) { if (w.ivoryToast) w.ivoryToast(s, !!bad); }
  function closeById(id) {
    var el = d.getElementById(id);
    if (!el) return;
    var b = $('.ivsheet-back', el) || $('[data-close]', el);
    if (b) b.click();
    else { el.classList.remove('show'); el.setAttribute('aria-hidden', 'true'); }
  }
  function makeSheet(id, title, body, cls) {
    if (d.getElementById(id)) return d.getElementById(id);
    var wrap = d.createElement('div');
    wrap.className = 'ivsheet-wrap ' + (cls || '');
    wrap.id = id;
    wrap.setAttribute('aria-hidden', 'true');
    wrap.setAttribute('role', 'dialog');
    wrap.innerHTML =
      '<div class="ivsheet-scrim" data-close></div>' +
      '<section class="ivsheet p94-sheet" aria-label="' + esc(title) + '">' +
        '<span class="ivsheet-grip" aria-hidden="true"></span>' +
        '<header class="ivsheet-head">' +
          '<button class="ivsheet-back" data-close aria-label="Back"><svg viewBox="0 0 24 24"><path d="M14.4 5.6L8 12l6.4 6.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
          '<h2>' + esc(title) + '</h2><span class="ivsheet-head-sp"></span>' +
        '</header><div class="ivsheet-body">' + body + '</div>' +
      '</section>';
    d.body.appendChild(wrap);
    return wrap;
  }
  function openSheet(id) { if (w.openSheet) w.openSheet(id); }
  function isolateSheets() {
    if (!w.openSheet || w.openSheet.__p94) return;
    var base = w.openSheet;
    function wrapped(id) {
      /* Cheers has its own high veil. It must not remain above a newly asked-for sheet. */
      var cheer = d.getElementById('rbn-sheet');
      if (cheer && cheer.classList.contains('on')) {
        var x = cheer.querySelector('.x'); if (x) x.click();
      }
      return base.apply(this, arguments);
    }
    wrapped.__p94 = 1;
    if (base.__p92) wrapped.__p92 = base.__p92;
    if (base.__folio) wrapped.__folio = base.__folio;
    w.openSheet = wrapped;
  }

  /* ── THE STORY DOOR ───────────────────────────────────────────────────── */
  function storySheet() {
    makeSheet('sheet-story', 'The Story Door',
      '<div class="p94-story-intro" id="p94-story-form">' +
        '<span class="p94-quill" aria-hidden="true"><img class="iv-feather" src="media/art/feather.webp" alt="" draggable="false"></span>' +
        '<h3>The door is open.</h3><p>Yours, or one you carry. Free, always.</p>' +
        '<label class="p94-label" for="p94-story-body">Your story</label>' +
        '<textarea id="p94-story-body" maxlength="7000" rows="7" placeholder="Leave the story at the door…"></textarea>' +
        '<div class="p94-count" id="p94-story-count">0 / 7000</div>' +
        '<label class="p94-label" for="p94-story-credit">Name to stamp on it (optional)</label>' +
        '<input id="p94-story-credit" maxlength="40" autocomplete="name" placeholder="Anonymous is fine">' +
        '<p class="p94-fine">Anonymous is fine — I will write “from the door”.</p>' +
        '<p class="p94-error" id="p94-story-error" role="alert"></p>' +
        '<button class="p94-goldkey" id="p94-story-send" type="button">LEAVE IT AT THE DOOR</button>' +
      '</div>' +
      '<div class="p94-story-done" id="p94-story-done" hidden>' +
        '<span class="p94-quill large" aria-hidden="true"><img class="iv-feather" src="media/art/feather.webp" alt="" draggable="false"></span>' +
        '<h3>It is through the door.</h3><p>I read everything.</p>' +
        '<button class="p94-goldkey" type="button" data-close>CLOSE</button>' +
      '</div>', 'p94-story-wrap');
    var body = d.getElementById('p94-story-body');
    on(body, 'input', function () {
      d.getElementById('p94-story-count').textContent = body.value.length + ' / 7000';
      d.getElementById('p94-story-error').textContent = '';
    });
    on(d.getElementById('p94-story-send'), 'click', sendStory);
  }
  function openStory() {
    storySheet();
    var done = d.getElementById('p94-story-done');
    if (done && !done.hidden) {
      done.hidden = true;
      d.getElementById('p94-story-form').hidden = false;
      d.getElementById('p94-story-body').value = '';
      d.getElementById('p94-story-credit').value = '';
      d.getElementById('p94-story-count').textContent = '0 / 7000';
    }
    d.getElementById('p94-story-error').textContent = '';
    openSheet('story');
    setTimeout(function () { try { d.getElementById('p94-story-body').focus(); } catch (e) {} }, 300);
  }
  var storyBusy = false;
  function sendStory() {
    if (storyBusy) return;
    var body = d.getElementById('p94-story-body'), credit = d.getElementById('p94-story-credit');
    var err = d.getElementById('p94-story-error'), send = d.getElementById('p94-story-send');
    var text = body.value.trim(), name = credit.value.trim();
    if (text.length < 20) { err.textContent = 'A few more lines — I need enough to feel the story.'; body.focus(); return; }
    if (text.length > 7000) { err.textContent = 'The door holds 7000 characters.'; return; }
    if (!signed()) { err.textContent = 'Sign in to leave your story.'; return; }
    storyBusy = true; send.disabled = true; send.textContent = 'LEAVING IT AT THE DOOR…'; err.textContent = '';
    var id = IVSESS.ident().id;
    IVSESS.call('/rest/v1/story_submissions', {
      member_id: id, body: text, credit_name: name ? name.slice(0, 40) : null
    }, { extra: { Prefer: 'return=representation' } }).then(function () {
      d.getElementById('p94-story-form').hidden = true;
      d.getElementById('p94-story-done').hidden = false;
      if (w.Sound && Sound.play) Sound.play('chime');
      loadTally();
      var close = $('#p94-story-done [data-close]'); if (close) close.focus();
    }).catch(function (e) {
      err.textContent = message(e);
    }).then(function () {
      storyBusy = false; send.disabled = false; send.textContent = 'LEAVE IT AT THE DOOR';
    });
  }
  function loadTally() {
    if (!signed()) return;
    rpc('door_tally').then(function (r) {
      var n = typeof r === 'number' ? r : Number(r && (r.door_tally || r.tally || r.count || r[0]));
      if (!isFinite(n)) n = 0;
      $$('.door-tally').forEach(function (el) {
        el.hidden = n <= 0;
        el.textContent = n === 1 ? '1 story has already become Ivory’s voice' : String(n) + ' stories have already become Ivory’s voice';
      });
    }).catch(function () {});
  }

  /* ── DIMENSIONAL LIQUID-GOLD HEARTS ───────────────────────────────────── */
  function heartSVG(suffix) {
    var gold = 'p94gold-' + suffix, glass = 'p94glass-' + suffix, clip = 'p94clip-' + suffix;
    return '<svg class="p94-heart-svg" viewBox="0 0 120 110" aria-hidden="true">' +
      '<defs>' +
        '<linearGradient id="' + gold + '" x1="0" y1="0" x2="1" y2=".25"><stop offset="0" stop-color="#9B5B08"/><stop offset=".16" stop-color="#E3AC32"/><stop offset=".31" stop-color="#FFF4B8"/><stop offset=".43" stop-color="#C88512"/><stop offset=".61" stop-color="#FFE787"/><stop offset=".78" stop-color="#B66B08"/><stop offset="1" stop-color="#FFF0A6"/></linearGradient>' +
        '<radialGradient id="' + glass + '" cx=".32" cy=".20" r=".9"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".92"/><stop offset=".26" stop-color="#FFF7DC" stop-opacity=".62"/><stop offset=".62" stop-color="#E9C56A" stop-opacity=".25"/><stop offset="1" stop-color="#6B3508" stop-opacity=".44"/></radialGradient>' +
        '<clipPath id="' + clip + '"><path d="M60 103C50 94 13 70 9 41 5 15 34 4 49 20L60 33 71 20C86 4 115 15 111 41 107 70 70 94 60 103Z"/></clipPath>' +
      '</defs>' +
      '<path class="p94-heart-glass" d="M60 103C50 94 13 70 9 41 5 15 34 4 49 20L60 33 71 20C86 4 115 15 111 41 107 70 70 94 60 103Z" fill="url(#' + glass + ')"/>' +
      '<g clip-path="url(#' + clip + ')"><g class="p94-liquid">' +
        '<path d="M-8 5Q8-3 24 5T56 5T88 5T120 5T152 5V116H-8Z" fill="url(#' + gold + ')"/>' +
        '<path class="p94-wave" d="M-8 5Q8-3 24 5T56 5T88 5T120 5T152 5" fill="none" stroke="#FFF8D7" stroke-width="2.2" opacity=".9"/>' +
        '<g class="p94-bubbles" fill="#FFF9DB"><circle cx="35" cy="40" r="2.4"/><circle cx="77" cy="57" r="1.7"/><circle cx="55" cy="79" r="2"/><circle cx="89" cy="29" r="1.3"/></g>' +
      '</g></g>' +
      '<path d="M60 103C50 94 13 70 9 41 5 15 34 4 49 20L60 33 71 20C86 4 115 15 111 41 107 70 70 94 60 103Z" fill="none" stroke="url(#' + gold + ')" stroke-width="3.2"/>' +
      '<path class="p94-heart-shine" d="M28 28C34 18 44 20 48 27 39 25 32 32 28 43 24 52 26 60 30 66 18 57 15 42 28 28Z" fill="#FFFFFF" opacity=".48"/>' +
      '<path d="M87 25C96 30 99 39 96 49" fill="none" stroke="#FFF9E6" stroke-width="3" stroke-linecap="round" opacity=".58"/>' +
    '</svg>';
  }
  function fillHeart(root, fraction) {
    if (!root) return;
    var f = Math.max(0, Math.min(1, Number(fraction) || 0));
    var liquid = $('.p94-liquid', root);
    if (liquid) liquid.style.transform = 'translateY(' + ((1 - f) * 110).toFixed(2) + 'px)';
    root.setAttribute('aria-label', 'Golden heart, ' + Math.round(f * 100) + ' percent full');
    root.style.setProperty('--fill', f);
  }
  function miniHeart(on) {
    return '<svg class="p94-miniheart ' + (on ? 'on' : '') + '" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21C9 18 2 13 2 7 2 2 8 1 12 6 16 1 22 2 22 7 22 13 15 18 12 21Z" fill="currentColor" stroke="#8A5A12" stroke-width=".8"/><path d="M6 6C7 4 9 4 10 6" fill="none" stroke="#FFF8DD" stroke-width="1.4" stroke-linecap="round"/></svg>';
  }

  var HS = null, heartBusy = false, heartDirty = true;
  function buildHeart() {
    var body = $('#sheet-heart .ivsheet-body');
    if (!body || body.__p94) return;
    body.__p94 = 1;
    body.innerHTML =
      '<div class="gh-panel p94-heart-panel">' +
        '<span class="gh-vignette" aria-hidden="true"></span><span class="gh-sheen" aria-hidden="true"></span>' +
        '<span class="gh-mote g1" aria-hidden="true"></span><span class="gh-mote g2" aria-hidden="true"></span><span class="gh-mote g3" aria-hidden="true"></span><span class="gh-mote g4" aria-hidden="true"></span><span class="gh-mote g5" aria-hidden="true"></span>' +
        '<img class="gh-art p94-flame-art" src="media/golden_heart.webp" alt="The original golden flame heart" draggable="false">' +
        '<div class="gh-glow" aria-hidden="true"></div><span class="p94-heart-pulse" aria-hidden="true"></span>' +
        '<div class="gh-num"><b>—</b><span>days of glow</span></div><div class="gh-flame">Flame</div>' +
      '</div>' +
      '<p class="gh-copy">Reading your heart…</p><p class="p94-note" id="p94-heart-note" role="status"></p>' +
      '<button class="gh-greet p94-action" type="button"><span class="ghh">' + miniHeart(true) + '</span><span>Greet your heart</span></button>' +
      '<button class="gh-treasure" type="button" data-open="treasure"><span class="ght">✦</span><span class="ghx"><b>My treasures</b><i>What your days have earned</i></span><svg class="chev" viewBox="0 0 24 24"><path d="M9.4 5.6L15.8 12l-6.4 6.4" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/></svg></button>' +
      '<p class="gh-lab">Today’s gold</p><div class="gg-list"></div>' +
      '<p class="gh-fine">Some of these appear only when there is a live, a poll or a vault key.</p>' +
      '<p class="gh-lab">The next glow</p><div class="gh-next"><b>Reading the next glow…</b><div class="gh-bar"><i style="width:0"></i></div></div>' +
      '<p class="gh-lab">Mends</p><div class="gh-mend"></div>' +
      '<p class="gh-lab">The last seven days</p><div class="gh-week"></div><p class="gh-week-note"></p>' +
      '<p class="foot">This platform is maintained by \'Infinity\'. All rights reserved 2026</p>';
  }
  function renderHeart(m) {
    buildHeart(); HS = map(m);
    var body = $('#sheet-heart .ivsheet-body');
    var points = num(HS, 'points'), need = Math.max(1, num(HS, 'lit_points', 60));
    var lit = HS.lit === true, streak = num(HS, 'streak'), best = num(HS, 'best_streak');
    /* The main sheet keeps her original flame film. The liquid fill belongs
       only to the small doorbell heart, not to this artwork. */
    $('.gh-num b', body).textContent = String(streak);
    $('.gh-num span', body).textContent = 'days of glow';
    $('.gh-flame', body).textContent = String(HS.tier_name || 'Flame');
    $('.gh-copy', body).textContent = points + ' of ' + need + (lit ? ' — today’s heart is lit.' : ' to light today’s heart.') + ' Your ' + streak + '-day glow is ' + (lit ? 'growing.' : 'waiting for it.');
    var greet = $('.gh-greet', body), action = null;
    (HS.actions || []).forEach(function (a) { if (a.key === 'greet') action = a; });
    var greeted = !!(action && (action.done === true || Number(action.done) > 0));
    greet.disabled = greeted || heartBusy;
    greet.innerHTML = '<span class="ghh">' + miniHeart(true) + '</span><span>' + (greeted ? 'Heart greeted today' : 'Greet your heart') + '</span>' + (!greeted && action ? '<b>+' + num(action, 'points', 20) + '</b>' : '');
    var list = $('.gg-list', body); list.innerHTML = '';
    (HS.actions || []).forEach(function (a) {
      var row = d.createElement('div'); row.className = 'gg' + (a.done ? ' done' : '');
      var done = typeof a.done === 'number' ? a.done : (a.done ? 1 : 0);
      var cap = num(a, 'cap');
      row.innerHTML = '<span class="ggi">' + miniHeart(!!done) + '</span><span class="ggt">' + esc(a.label || a.key) + '</span>' +
        (cap ? '<span class="ggsub">' + done + '/' + cap + '</span>' : (done ? '<span class="ggsub">done</span>' : '')) +
        '<span class="ggp">+' + num(a, 'points') + '</span>';
      list.appendChild(row);
    });
    if (!HS.actions || !HS.actions.length) list.innerHTML = '<p class="p94-fine">Today’s actions will appear here.</p>';
    var nextN = Math.max(0, num(HS, 'next_tier_days'));
    var denom = streak + nextN;
    var progress = denom > 0 ? Math.max(0, Math.min(1, streak / denom)) : 1;
    $('.gh-next b', body).textContent = HS.next_tier_name ? nextN + ' more lit ' + (nextN === 1 ? 'day' : 'days') + ' in a row to ' + String(HS.next_tier_name).toUpperCase() : 'Your next glow is being written';
    $('.gh-bar i', body).style.width = (progress * 100).toFixed(1) + '%';
    var mends = num(HS, 'mends'), maxMends = num(HS, 'mend_max');
    var away = Math.max(1, num(HS, 'mend_every') - num(HS, 'mend_progress'));
    var mh = '';
    for (var i = 0; i < Math.min(Math.max(maxMends, 1), 6); i++) mh += '<span class="mh ' + (i < mends ? '' : 'dim') + '">' + miniHeart(i < mends) + '</span>';
    mh += '<span class="ghmt"><b>' + mends + (mends === 1 ? ' mend held' : ' mends held') + '</b><i>' + (maxMends && mends >= maxMends ? 'The mender’s shelf is full.' : away + ' more lit ' + (away === 1 ? 'day' : 'days') + ' to the next mend.') + '</i></span>';
    $('.gh-mend', body).innerHTML = mh;
    var week = $('.gh-week', body); week.innerHTML = '';
    (HS.week || []).forEach(function (day, i, all) {
      var label = 'TODAY';
      if (i !== all.length - 1) {
        var dt = new Date(String(day.day || '') + 'T12:00:00Z');
        label = isNaN(dt.getTime()) ? String(day.day || '').slice(-2) : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][dt.getUTCDay()];
      }
      var cell = d.createElement('span'); cell.className = 'gd ' + (day.lit ? 'on ' : '') + (i === all.length - 1 ? 'today' : '');
      cell.innerHTML = '<i>' + esc(label) + '</i><b>' + miniHeart(!!day.lit) + '</b><s>' + num(day, 'points') + '</s>';
      week.appendChild(cell);
    });
    $('.gh-week-note', body).textContent = 'Best glow ' + best + ' days · ' + num(HS, 'total_lit') + ' lit days in all';
    heartDirty = false;
    if (BS) renderBellHeart();
  }
  function loadHeart() {
    if (heartBusy || !signed()) return Promise.resolve();
    heartBusy = true; buildHeart();
    var note = d.getElementById('p94-heart-note'); if (note) note.textContent = '';
    return rpc('heart_state').then(function (m) {
      renderHeart(m);
    }).catch(function (e) {
      if (note) note.textContent = message(e);
    }).then(function () { heartBusy = false; if (HS) renderHeart(HS); });
  }
  function greetHeart(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (heartBusy) return;
    var before = HS;
    heartBusy = true;
    rpc('heart_greet').then(function (m) {
      renderHeart(m); heartDirty = false;
      if (w.Sound && Sound.play) Sound.play('heartlit');
      if ($('#sheet-bells.show')) loadBells();
    }).catch(function (e) {
      if (before) renderHeart(before);
      var note = d.getElementById('p94-heart-note'); if (note) note.textContent = message(e);
    }).then(function () { heartBusy = false; if (HS) renderHeart(HS); });
  }

  /* ── THE ORIGINAL FLAME, WITH A REAL HEARTBEAT ──────────────────────────
     Twenty seconds of thumps would be an effect; this is a phrase. Loud,
     reverberant lub-dub cycles fill 25 seconds, then the room rests
     for 60 seconds. The WebP loop is 1.2 seconds: frame 0 is the lub and
     frame 2, at 240 ms, is the dub. No audio file or network request. */
  var HEART_PLAY = 25000, HEART_REST = 60000, HEART_STEP = 1.2, HEART_DUB = .24;
  var HEART_ART = 'media/golden_heart.webp';
  var heartActive = false, heartSounding = false, heartAway = false, heartCycles = 0, heartBeats = 0;
  var heartStartedAt = 0, heartStopAt = 0, heartRestartAt = 0;
  var heartPhraseTimer = 0, heartRestTimer = 0, heartScheduleTimer = 0, heartSuspendTimer = 0;
  var heartAudio = null, heartBus = null, heartVerb = null, heartNoise = null;
  var heartAudioEpoch = 0, heartNextNote = 0, heartVoices = [];

  function heartSoundOn() {
    var sw = $('[aria-label="Golden Heart sounds"]');
    if (sw && sw.getAttribute('aria-checked') === 'false') return false;
    try { if (w.Sound && Sound.isOn && !Sound.isOn()) return false; } catch (e) {}
    return true;
  }
  function restartHeartArt() {
    /* A fresh image element restarts an animated WebP at frame zero without
       a cache-busting URL or another download. */
    var art = $('#sheet-heart .p94-flame-art');
    if (!art || !art.parentNode) return;
    var fresh = art.cloneNode(false);
    fresh.setAttribute('src', HEART_ART);
    art.parentNode.replaceChild(fresh, art);
  }
  function heartImpulse(c) {
    var len = Math.floor(c.sampleRate * 1.15), buf = c.createBuffer(2, len, c.sampleRate);
    for (var ch = 0; ch < 2; ch++) {
      var a = buf.getChannelData(ch);
      for (var i = 0; i < len; i++) {
        var x = 1 - i / len;
        a[i] = (Math.random() * 2 - 1) * Math.pow(x, 3.8) * .42;
      }
    }
    return buf;
  }
  function heartNoiseBuffer(c) {
    var len = Math.floor(c.sampleRate * .16), buf = c.createBuffer(1, len, c.sampleRate), a = buf.getChannelData(0);
    for (var i = 0; i < len; i++) a[i] = Math.random() * 2 - 1;
    return buf;
  }
  function disconnectHeartVoice(voice) {
    if (!voice) return;
    var at = heartVoices.indexOf(voice); if (at >= 0) heartVoices.splice(at, 1);
    voice.nodes.forEach(function (n) { try { n.disconnect(); } catch (e) {} });
    voice.nodes.length = 0; voice.sources.length = 0;
  }
  function makeHeartThump(c, bus, verb, noise, t, second, track) {
    if (!c || !bus) return;
    var dur = second ? .31 : .38, peak = second ? .68 : .90;
    var f0 = second ? 68 : 82, f1 = second ? 40 : 45;
    var out = c.createGain(); out.gain.value = 1;
    out.connect(bus); if (verb) out.connect(verb);
    var osc = c.createOscillator(), env = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env.gain.setValueAtTime(.0001, t);
    env.gain.exponentialRampToValueAtTime(peak, t + .014);
    env.gain.exponentialRampToValueAtTime(.0001, t + dur);
    osc.connect(env); env.connect(out);
    /* A quiet upper body keeps the thump audible on a small phone speaker. */
    var harmonic = c.createOscillator(), hg = c.createGain();
    harmonic.type = 'sine';
    harmonic.frequency.setValueAtTime(f0 * 2.04, t);
    harmonic.frequency.exponentialRampToValueAtTime(f1 * 2.04, t + dur * .82);
    hg.gain.setValueAtTime(.0001, t);
    hg.gain.exponentialRampToValueAtTime(second ? .15 : .22, t + .010);
    hg.gain.exponentialRampToValueAtTime(.0001, t + dur * .78);
    harmonic.connect(hg); hg.connect(out);
    var nodes = [out, osc, env, harmonic, hg], sources = [osc, harmonic];
    if (noise) {
      var ns = c.createBufferSource(), filter = c.createBiquadFilter(), ng = c.createGain();
      ns.buffer = noise; filter.type = 'lowpass'; filter.frequency.setValueAtTime(second ? 170 : 220, t); filter.Q.value = .7;
      ng.gain.setValueAtTime(.0001, t);
      ng.gain.exponentialRampToValueAtTime(second ? .055 : .085, t + .008);
      ng.gain.exponentialRampToValueAtTime(.0001, t + .13);
      ns.connect(filter); filter.connect(ng); ng.connect(out);
      ns.start(t); ns.stop(t + .15);
      nodes.push(ns, filter, ng); sources.push(ns);
    }
    osc.start(t); harmonic.start(t);
    osc.stop(t + dur + .04); harmonic.stop(t + dur + .04);
    if (track) {
      var voice = { sources: sources, nodes: nodes };
      heartVoices.push(voice); heartBeats++;
      osc.onended = function () { disconnectHeartVoice(voice); };
    }
  }
  function ensureHeartAudio() {
    if (heartAudio) return heartAudio;
    var AC = w.AudioContext || w.webkitAudioContext;
    if (!AC) return null;
    try {
      var c = new AC({ latencyHint: 'interactive' });
      var bus = c.createGain(), comp = c.createDynamicsCompressor();
      bus.gain.value = 0;
      comp.threshold.value = -18; comp.knee.value = 16; comp.ratio.value = 3;
      comp.attack.value = .003; comp.release.value = .22;
      bus.connect(comp); comp.connect(c.destination);
      var verb = c.createConvolver(), wet = c.createGain();
      verb.buffer = heartImpulse(c); wet.gain.value = .22;
      verb.connect(wet); wet.connect(bus);
      heartAudio = c; heartBus = bus; heartVerb = verb; heartNoise = heartNoiseBuffer(c);
      return c;
    } catch (e) { return null; }
  }
  function scheduleHeartAudio() {
    if (!heartSounding || !heartAudio || !heartAudioEpoch) return;
    var now = heartAudio.currentTime, horizon = now + .55;
    if (heartNextNote < now) heartNextNote = now + .025;
    while (heartNextNote < horizon && heartNextNote - heartAudioEpoch + .86 < 25) {
      makeHeartThump(heartAudio, heartBus, heartVerb, heartNoise, heartNextNote, false, true);
      makeHeartThump(heartAudio, heartBus, heartVerb, heartNoise, heartNextNote + HEART_DUB, true, true);
      heartNextNote += HEART_STEP;
    }
  }
  function armHeartAudio() {
    var c = ensureHeartAudio(); if (!c) return;
    function ready() {
      if (!heartSounding || c !== heartAudio) return;
      var now = c.currentTime;
      heartBus.gain.cancelScheduledValues(now); heartBus.gain.setValueAtTime(.86, now);
      if (!heartAudioEpoch) { heartAudioEpoch = now + .045; heartNextNote = heartAudioEpoch; }
      scheduleHeartAudio();
    }
    if (c.state === 'suspended' && c.resume) {
      try { var p = c.resume(); if (p && p.then) p.then(ready, function () {}); else ready(); } catch (e) {}
    } else ready();
  }
  function silenceHeartAudio() {
    if (heartScheduleTimer) { clearInterval(heartScheduleTimer); heartScheduleTimer = 0; }
    heartVoices.slice().forEach(function (voice) {
      voice.sources.forEach(function (s) { try { s.stop(0); } catch (e) {} });
      disconnectHeartVoice(voice);
    });
    if (!heartAudio || !heartBus) return;
    try {
      var now = heartAudio.currentTime;
      heartBus.gain.cancelScheduledValues(now); heartBus.gain.setValueAtTime(0, now);
    } catch (e) {}
    if (heartSuspendTimer) clearTimeout(heartSuspendTimer);
    heartSuspendTimer = setTimeout(function () {
      if (!heartSounding && heartAudio && heartAudio.state === 'running' && heartAudio.suspend) {
        try { var p = heartAudio.suspend(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
      }
    }, 60);
  }
  function beginHeartPhrase() {
    if (!heartActive) return;
    if (heartRestTimer) { clearTimeout(heartRestTimer); heartRestTimer = 0; }
    if (heartPhraseTimer) clearTimeout(heartPhraseTimer);
    if (heartSuspendTimer) { clearTimeout(heartSuspendTimer); heartSuspendTimer = 0; }
    heartSounding = true; heartStartedAt = Date.now(); heartStopAt = heartStartedAt + HEART_PLAY; heartRestartAt = 0;
    heartAudioEpoch = 0; heartNextNote = 0;
    restartHeartArt();
    var panel = $('#sheet-heart .p94-heart-panel');
    if (panel) {
      panel.classList.remove('p94-heart-sounding');
      void panel.offsetWidth;
      panel.classList.add('p94-heart-sounding');
    }
    armHeartAudio();
    if (heartScheduleTimer) clearInterval(heartScheduleTimer);
    heartScheduleTimer = setInterval(scheduleHeartAudio, 160);
    heartPhraseTimer = setTimeout(endHeartPhrase, HEART_PLAY);
  }
  function endHeartPhrase() {
    if (!heartActive) return;
    if (heartPhraseTimer) { clearTimeout(heartPhraseTimer); heartPhraseTimer = 0; }
    heartSounding = false; heartStopAt = 0;
    var panel = $('#sheet-heart .p94-heart-panel'); if (panel) panel.classList.remove('p94-heart-sounding');
    silenceHeartAudio();
    heartRestartAt = Date.now() + HEART_REST;
    heartRestTimer = setTimeout(function () {
      heartRestTimer = 0;
      if (!heartActive || !$('#sheet-heart.show') || d.hidden || !heartSoundOn()) { stopHeartbeat(); return; }
      heartCycles++; beginHeartPhrase();
    }, HEART_REST);
  }
  function stopHeartbeat() {
    heartActive = false; heartSounding = false;
    if (heartPhraseTimer) { clearTimeout(heartPhraseTimer); heartPhraseTimer = 0; }
    if (heartRestTimer) { clearTimeout(heartRestTimer); heartRestTimer = 0; }
    if (heartScheduleTimer) { clearInterval(heartScheduleTimer); heartScheduleTimer = 0; }
    heartStartedAt = 0; heartStopAt = 0; heartRestartAt = 0; heartAudioEpoch = 0; heartNextNote = 0;
    var panel = $('#sheet-heart .p94-heart-panel'); if (panel) panel.classList.remove('p94-heart-sounding');
    silenceHeartAudio();
  }
  function syncHeartbeat() {
    var open = !!$('#sheet-heart.show') && !d.hidden && !heartAway;
    if (open && heartSoundOn()) {
      if (!heartActive) { heartActive = true; heartCycles++; beginHeartPhrase(); }
    } else if (heartActive) stopHeartbeat();
  }
  function heartbeatState() {
    return { active: heartActive, sounding: heartSounding, cycles: heartCycles, beats: heartBeats,
      playMs: HEART_PLAY, restMs: HEART_REST, periodMs: HEART_STEP * 1000, dubMs: HEART_DUB * 1000,
      startedAt: heartStartedAt, stopAt: heartStopAt, restartAt: heartRestartAt,
      audioState: heartAudio ? heartAudio.state : 'uncreated', voices: heartVoices.length };
  }
  function probeHeartbeat() {
    /* Render the same two thumps offline so loudness and the lingering tail
       can be measured without turning a device speaker on during an audit. */
    var OAC = w.OfflineAudioContext || w.webkitOfflineAudioContext;
    if (!OAC) return Promise.resolve(null);
    var off = new OAC(2, 44100 * 3, 44100);
    var bus = off.createGain(), comp = off.createDynamicsCompressor(); bus.gain.value = .86;
    comp.threshold.value = -18; comp.knee.value = 16; comp.ratio.value = 3; comp.attack.value = .003; comp.release.value = .22;
    bus.connect(comp); comp.connect(off.destination);
    var verb = off.createConvolver(), wet = off.createGain(); verb.buffer = heartImpulse(off); wet.gain.value = .22;
    verb.connect(wet); wet.connect(bus);
    var noise = heartNoiseBuffer(off);
    makeHeartThump(off, bus, verb, noise, .05, false, false);
    makeHeartThump(off, bus, verb, noise, .05 + HEART_DUB, true, false);
    return off.startRendering().then(function (buf) {
      var a = buf.getChannelData(0), peak = 0, peakAt = 0, sum = 0, last = 0;
      var end = Math.min(a.length, Math.floor(buf.sampleRate * 1.2));
      for (var i = 0; i < a.length; i++) {
        var v = Math.abs(a[i]); if (v > peak) { peak = v; peakAt = i; }
        if (v > .005) last = i;
        if (i < end) sum += a[i] * a[i];
      }
      return { peak: +peak.toFixed(4), rms: +Math.sqrt(sum / end).toFixed(4),
        peakAt: +(peakAt / buf.sampleRate).toFixed(3), tailTo: +(last / buf.sampleRate).toFixed(3),
        dubMs: HEART_DUB * 1000, periodMs: HEART_STEP * 1000 };
    });
  }
  function watchHeartbeat() {
    var sheet = d.getElementById('sheet-heart');
    if (sheet && w.MutationObserver) {
      var observer = new MutationObserver(syncHeartbeat);
      observer.observe(sheet, { attributes: true, attributeFilter: ['class'] });
    }
    on(d, 'visibilitychange', function () { heartAway = !!d.hidden; if (heartAway) stopHeartbeat(); else syncHeartbeat(); });
    on(w, 'pagehide', function () { heartAway = true; stopHeartbeat(); });
    on(w, 'pageshow', function () { heartAway = false; setTimeout(syncHeartbeat, 0); });
    on(w, 'ivory:ready', function () { setTimeout(syncHeartbeat, 0); });
    on($('[aria-label="Golden Heart sounds"]'), 'click', function () { setTimeout(syncHeartbeat, 0); });
    on(d.getElementById('sound'), 'click', function () { setTimeout(syncHeartbeat, 0); });
    on(sheet, 'pointerdown', function () { if (heartSounding && heartAudio && heartAudio.state === 'suspended') armHeartAudio(); });
  }

  /* ── THE FOUR JEWEL BELLS ─────────────────────────────────────────────── */
  var LOOKS = {
    jewel: ['#FF6B8B', '#4DF0A8', '#FFA42B', '#52C7FF'],
    opal: ['#FFB3D9', '#B5F5EC', '#C8B6FF', '#FFE9A8'],
    sunset: ['#FF5E62', '#FF8A47', '#FFC145', '#FF7BAC'],
    ocean: ['#2EC4FF', '#3DDAD7', '#5B8DEF', '#8EE3EF'],
    aurora: ['#5CFFB1', '#4DD2FF', '#A06CFF', '#FF6BD6'],
    orchid: ['#E56BFF', '#FF7EC9', '#B66CFF', '#8F9BFF'],
    citrus: ['#FFE14D', '#B6F23A', '#FF9F1C', '#7DF0A0'],
    lagoon: ['#22E4C4', '#3AA8FF', '#1ECFA0', '#7B9BFF'],
    ember: ['#FF4D4D', '#FF7A29', '#FFB020', '#FF5C8A'],
    twilight: ['#8E7DFF', '#C86BFF', '#5C9DFF', '#FF7AB6'],
    meadow: ['#7BE05A', '#3DDC97', '#C6F25C', '#5AD1E0'],
    lotus: ['#FF9ECF', '#FFC2E2', '#FFD6A5', '#C9B6FF'],
    crystal: ['#BFF0FF', '#D8E6FF', '#F4FAFF', '#E3D4FF'],
    celestial: ['#FFD84D', '#FF8AE2', '#7DF0FF', '#B6A0FF']
  };
  function look(key) { return LOOKS[key] || LOOKS.jewel; }
  function bellSVG(i) {
    return '<svg viewBox="0 0 64 84" aria-hidden="true"><defs><linearGradient id="p94bell' + i + '" x1="0" y1="0" x2="1" y2=".3"><stop offset="0" stop-color="#5C3270"/><stop offset=".25" stop-color="#FFFFFF"/><stop offset=".42" stop-color="var(--bell)"/><stop offset=".75" stop-color="var(--bell)"/><stop offset="1" stop-color="#5C3270"/></linearGradient></defs>' +
      '<path d="M32 3L38 10 32 17 26 10Z" fill="var(--bell)" stroke="#FFF4D2" stroke-width=".8"/>' +
      '<path d="M32 15C20 15 14 25 14 38c0 8-3 12-8 16v5h52v-5c-5-4-8-8-8-16 0-13-6-23-18-23Z" fill="url(#p94bell' + i + ')" stroke="#FFF0C2" stroke-width="1.1"/>' +
      '<path d="M8 57H56" stroke="#FFF8E5" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M32 59v8" stroke="var(--bell)" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="71" r="6" fill="var(--bell)" stroke="#FFF0C2"/>' +
      '<path class="p94-bell-shine" d="M23 24C18 30 18 39 17 44" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity=".65"/>' +
      '<ellipse cx="27" cy="28" rx="5" ry="8" fill="#FFFFFF" opacity=".22"/></svg>';
  }
  function orbIcon(key, rung) {
    if (rung) return '<svg viewBox="0 0 24 24"><path d="M5 12.5L10 17 19 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    if (key === 'dawn') return miniHeart(true);
    if (key === 'noon') return '<svg viewBox="0 0 24 24"><path d="M5 4.5h6.2a3 3 0 013 3V20a2.6 2.6 0 00-2.6-2.6H5zM19 4.5h-4.8a3 3 0 00-3 3V20a2.6 2.6 0 012.6-2.6H19z" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>';
    if (key === 'dusk') return '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 20c0-4 2-6 5.5-6s5.5 2 5.5 6M16 7a3 3 0 010 5M17 14c2 .5 3.5 2.5 3.5 6" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>';
    return '<svg viewBox="0 0 24 24"><path d="M18 15.5A8 8 0 018.5 6 8 8 0 1018 15.5Z" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>';
  }
  function hourLabel(h) {
    h = Number(h) || 0;
    return String(h % 12 === 0 ? 12 : h % 12) + ' ' + (h < 12 ? 'AM' : 'PM');
  }
  function buildBells() {
    var body = $('#sheet-bells .bells-body');
    if (!body || body.__p94) return;
    body.__p94 = 1;
    body.innerHTML =
      '<div class="bl-arch"><span class="bl-rain" aria-hidden="true"></span><span class="bl-stars" aria-hidden="true"></span>' +
        '<h3 class="bl-title">Ring my doorbell</h3><p class="bl-sub">Reading your bells…</p><div class="bl-wire" aria-hidden="true"></div>' +
        '<div class="bl-bells" id="p94-bells"></div>' +
        '<div class="bl-heart p94-heart-orb" role="img" aria-label="Golden Heart"><span class="bl-hring" aria-hidden="true"></span><span class="bl-hcore">' + heartSVG('bl') + '</span></div>' +
        '<p class="bl-count">Your Golden Heart</p><div class="bl-orbs" id="p94-orbs"></div>' +
        '<p class="p94-note on-dark" id="p94-bell-note" role="status"></p>' +
      '</div>' +
      '<div class="bl-card p94-linecard" id="p94-linecard" hidden><p class="bl-lab">Ivory’s closing line</p><p class="p94-linecopy"></p></div>' +
      '<div class="bl-card"><p class="bl-lab">Make a pledge</p><p class="bl-copy">Promise yourself a number of Full Days in a row. It is free and nothing is at stake. A heart mend carries a missed day.</p><div class="bl-pledge" id="p94-pledges"></div><div id="p94-active-pledge"></div></div>' +
      '<button class="bl-set" id="p94-set-button" type="button"><span class="bl-minis"><i></i><i></i><i></i><i></i></span><span class="bx"><b>Choose your bells</b><i>Reading your sets…</i></span><svg class="chev" viewBox="0 0 24 24"><path d="M9.4 5.6L15.8 12l-6.4 6.4" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/></svg></button>' +
      '<div class="bl-card"><p class="bl-lab">How each bell rings</p><div id="p94-how"></div></div>' +
      '<div class="bl-card"><p class="bl-lab">Your counts</p><div class="bl-counts"><div class="bl-ring r1"><b>—</b><i>full days<br>in a row</i></div><div class="bl-ring r2"><b>—</b><i>best<br>run</i></div><div class="bl-ring r3"><b>—</b><i>all full<br>days</i></div></div></div>' +
      '<div class="bl-togs">' +
        '<div class="bl-tog"><span class="bti">♪</span><span class="bx"><b>Bell sounds</b></span><button class="tog on" id="p94-sound" role="switch" aria-checked="true" aria-label="Bell sounds"><i></i></button></div>' +
        '<div class="bl-tog"><span class="bti">◌</span><span class="bx"><b>Bell reminders</b><i id="p94-push-copy">A gentle reminder when a bell opens and is still waiting.</i></span><button class="tog on" id="p94-push" role="switch" aria-checked="true" aria-label="Bell reminders"><i></i></button></div>' +
      '</div><p class="foot dark">This platform is maintained by \'Infinity\'. All rights reserved 2026</p>';
    on(d.getElementById('p94-set-button'), 'click', openSets);
    on(d.getElementById('p94-sound'), 'click', toggleSound);
    on(d.getElementById('p94-push'), 'click', togglePush);
  }
  var BS = null, bellsBusy = false, bellsDirty = true, pushState = null;
  var bellSoundOn = true, bellAudio = null;
  try { bellSoundOn = localStorage.getItem('ivory.bell.sound') !== '0'; } catch (e) {}
  var BELL_NOTES = {
    jewel:[523.25,659.25,783.99,987.77,1], opal:[587.33,739.99,880,1108.73,1],
    sunset:[466.16,587.33,698.46,880,1.2], ocean:[523.25,587.33,783.99,880,1.15],
    aurora:[659.25,830.61,987.77,1244.51,1.3], orchid:[698.46,880,1046.5,1318.51,1],
    citrus:[783.99,987.77,1174.66,1479.98,.8], lagoon:[440,554.37,659.25,830.61,1.25],
    ember:[392,493.88,587.33,739.99,1.4], twilight:[523.25,622.25,783.99,932.33,1.3],
    meadow:[587.33,659.25,880,987.77,1], lotus:[349.23,440,523.25,698.46,1.35],
    crystal:[1046.5,1318.51,1567.98,1975.53,1.5], celestial:[1046.5,1567.98,1318.51,2093,1.8]
  };
  function bellSound(index) {
    if (!bellSoundOn) return;
    try {
      var AC = w.AudioContext || w.webkitAudioContext; if (!AC) return;
      if (!bellAudio) bellAudio = new AC({ latencyHint: 'interactive' });
      var c = bellAudio; if (c.state === 'suspended' && c.resume) c.resume().catch(function () {});
      var tone = BELL_NOTES[BS && BS.wear] || BELL_NOTES.jewel, now = c.currentTime + .015;
      var indexes = index === 'full' ? [0,1,2,3] : [Math.max(0, Math.min(3, Number(index) || 0))];
      indexes.forEach(function (at, chord) {
        var hz = tone[at]; [0.5,1,1.19,1.5,2].forEach(function (ratio, k) {
          var o = c.createOscillator(), g = c.createGain(), t = now + chord * .055;
          o.type = 'sine'; o.frequency.value = hz * ratio; o.detune.value = k < 2 ? 0 : (k % 2 ? 3 : -2);
          var peak = .105 / (1 + k * .8), end = t + (1.35 + k * .12) * tone[4];
          g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(peak,t+.006); g.gain.exponentialRampToValueAtTime(.0001,end);
          o.connect(g); g.connect(c.destination); o.start(t); o.stop(end+.03);
        });
      });
    } catch (e) {}
  }
  function bellNote(s) { var n = d.getElementById('p94-bell-note'); if (n) n.textContent = s || ''; }
  function renderBellHeart() {
    if (!BS) return;
    var points = HS ? num(HS, 'points') : 0, need = HS ? Math.max(1, num(HS, 'lit_points', 60)) : 60;
    var fill = HS && HS.lit ? 1 : Math.max(0, Math.min(1, points / need));
    fillHeart($('#sheet-bells .bl-heart'), fill);
    var count = $('#sheet-bells .bl-count');
    if (count) count.innerHTML = '<b>' + points + '</b> of ' + need + ' to light today’s heart';
  }
  function renderBells(m) {
    buildBells(); BS = map(m);
    var body = $('#sheet-bells .bells-body');
    var colours = look(BS.wear || 'jewel');
    var bells = BS.bells || [];
    $('.bl-sub', body).textContent = num(BS, 'rung_n') + ' of ' + num(BS, 'need', 4) + ' bells rung · ' + num(BS, 'waiting_n') + ' waiting';
    $('.bl-arch', body).classList.toggle('p94-full', !!BS.full);
    var holder = d.getElementById('p94-bells'), orbs = d.getElementById('p94-orbs');
    holder.innerHTML = ''; orbs.innerHTML = '';
    bells.forEach(function (it, i) {
      var colour = colours[i % 4], time = hourLabel(it.hour);
      var remembered = it.done && !it.is_line && !it.is_open;
      var sub = it.rung ? 'rung' : remembered ? 'ready at ' + time : it.is_open ? 'tap to ring' : 'opens ' + time;
      var bell = d.createElement('div');
      bell.className = 'bl-bell ' + (it.is_open ? 'is-open ' : '') + (it.rung ? 'rung ' : '') + (it.unseen ? 'unseen' : '');
      bell.innerHTML = '<span class="bl-svg p94-bell-art b' + (i + 1) + '">' + bellSVG(i) + '</span><b>' + esc(it.label || it.key) + '</b><i>' + esc(sub) + '</i>';
      bell.style.setProperty('--bell', colour);
      holder.appendChild(bell);
      var orb = d.createElement('div');
      orb.className = 'bl-orb o' + (i + 1) + (it.rung ? ' rung' : '') + (it.is_open ? ' is-open' : '');
      orb.setAttribute('role', 'button'); orb.tabIndex = 0;
      orb.setAttribute('data-bell', String(it.key || ''));
      orb.setAttribute('aria-label', String(it.label || it.key) + ': ' + sub);
      orb.innerHTML = '<span>' + orbIcon(it.key, !!it.rung) + '</span><b>' + esc(it.rung ? 'Rung' : ({ dawn: 'Greet', noon: 'Read', dusk: 'Join in', night: 'Open line' }[it.key] || 'Ring')) + '</b><i>' + esc(sub) + '</i>';
      orb.style.setProperty('--bell', colour);
      orbs.appendChild(orb);
    });
    if (!bells.length) bellNote('The house has not returned its bells yet. Open the sheet again to retry.');
    renderBellHeart();
    var line = $('#p94-linecard');
    if (line) { line.hidden = !BS.line; $('.p94-linecopy', line).textContent = BS.line || ''; }
    var lens = BS.pledge_lens && BS.pledge_lens.length ? BS.pledge_lens : [3, 7, 14, 30];
    var ph = d.getElementById('p94-pledges'); ph.innerHTML = '';
    if (BS.pledge) {
      ph.hidden = true;
      var left = Math.max(0, num(BS.pledge, 'len') - num(BS.pledge, 'got'));
      d.getElementById('p94-active-pledge').innerHTML = '<div class="p94-pledge-now"><b>' + num(BS.pledge, 'len') + ' Full Days · ' + num(BS.pledge, 'got') + ' kept</b><span>' + left + ' to go. Nothing is at stake.</span><button class="p94-textkey p94-action" id="p94-release" type="button">Let go of this pledge</button></div>';
    } else {
      ph.hidden = false; d.getElementById('p94-active-pledge').innerHTML = '';
      lens.forEach(function (n) {
        var b = d.createElement('button'); b.type = 'button'; b.className = 'pl p94-action'; b.setAttribute('data-pledge', n); b.textContent = n + ' days'; ph.appendChild(b);
      });
    }
    if (!BS.new_sets || !BS.new_sets.length) bellSetsShown = '';
    if (!BS.pledge_result) bellResultShown = false;
    var worn = null;
    (BS.sets || []).forEach(function (s) { if (s.key === BS.wear) worn = s; });
    var setButton = d.getElementById('p94-set-button');
    $('.bx b', setButton).textContent = 'Wearing ' + (worn ? worn.name : String(BS.wear || 'Jewel'));
    $('.bx i', setButton).textContent = 'Round ' + num(BS, 'round', 1) + ' · ' + num(BS, 'cycle', 1) + ' Full Days a round';
    $$('.bl-minis i', setButton).forEach(function (el, i) { el.style.setProperty('background', colours[i % 4], 'important'); });
    var how = d.getElementById('p94-how'), copy = '';
    bells.forEach(function (it) {
      var action = ({ dawn: 'rings when you greet your heart', noon: 'when you read a story', dusk: 'when you join in', night: 'when you open Ivory’s closing line' })[it.key] || 'rings with your day';
      copy += '<p class="bl-copy"><b>' + esc(it.label || it.key) + '</b> (' + esc(hourLabel(it.hour)) + ') ' + esc(action) + '.</p>';
    });
    copy += '<p class="bl-copy dim">A bell opens at its hour and stays open until the day turns, and anything you already did today is remembered. Each bell adds ' + num(BS, 'ring_points', 20) + ' to your Golden Heart. Ring all ' + num(BS, 'need', 4) + ' and the day is a Full Day.</p>';
    how.innerHTML = copy;
    var counts = $$('.bl-ring b', body);
    if (counts[0]) counts[0].textContent = num(BS, 'peal');
    if (counts[1]) counts[1].textContent = num(BS, 'best_peal');
    if (counts[2]) counts[2].textContent = num(BS, 'full_days');
    bellsDirty = false;
    if ($('#sheet-bellsets.show')) renderSets();
  }
  var bellShown = {}, bellFullShown = false, bellSetsShown = '', bellResultShown = false, bellPlaying = false, bellPlaySeq = 0, bellCeremonyDone = null;
  function bellsVisible() { return !!($('#sheet-bells.show') || $('#sheet-bell-ceremony.show')) && !d.hidden; }
  function waitBell(ms, seq) { return new Promise(function (resolve) { setTimeout(function () { resolve(seq === bellPlaySeq && bellsVisible()); }, ms); }); }
  function bellCeremony(kind, data) {
    var title = kind === 'full' ? 'A Full Day, kept.' : kind === 'set' ? 'A new bell set is yours.' : (data.result === 'kept' ? 'Pledge kept.' : 'The pledge has ended.');
    var copy = kind === 'full' ? 'Full Day ' + num(BS, 'full_days') + ' is now in your stars. Every bell answered.' : kind === 'set' ? String(data.name || data.key) + ' has opened. Wear it now, or keep it for later.' : data.result === 'kept' ? num(data, 'got') + ' Full Days in a row. Your promise is counted.' : 'It reached ' + num(data, 'got') + ' of ' + num(data, 'len') + ' days. Nothing was lost.';
    /* A ceremony is a sequence, not a static sheet. makeSheet reuses an old
       node, so retire the last stage or Full Day would also stand in for the
       new set and the pledge with the wrong copy and controls. */
    var prior = d.getElementById('sheet-bell-ceremony'); if (prior) prior.remove();
    makeSheet('sheet-bell-ceremony', 'The Bells', '<div class="p94-confirm p94-bell-ceremony"><span class="p94-ceremony-star">✦</span><h3>' + esc(title) + '</h3><p>' + esc(copy) + '</p><div class="p94-confirm-keys">' + (kind === 'set' ? '<button class="p94-textkey" type="button" data-bell-ceremony="later">NOT NOW</button><button class="p94-goldkey" type="button" data-bell-ceremony="wear">WEAR THIS SET</button>' : '<button class="p94-goldkey" type="button" data-bell-ceremony="close">KEEP IT CLOSE</button>') + '</div></div>', 'p94-confirm-wrap');
    openSheet('bell-ceremony');
    return new Promise(function (resolve) { bellCeremonyDone = { kind: kind, data: data, resolve: resolve }; });
  }
  function finishBellCeremony(action) {
    var active = bellCeremonyDone; if (!active) return; bellCeremonyDone = null;
    var finish = function () { closeById('sheet-bell-ceremony'); openSheet('bells'); active.resolve(true); };
    if (action === 'wear' && active.kind === 'set') {
      rpc('bell_set_wear', { k: active.data.key }).then(function (b) { renderBells(b); finish(); }).catch(function (e) { bellNote(message(e)); finish(); });
    } else finish();
  }
  function playBellUnseen() {
    if (bellPlaying || !BS || !bellsVisible()) return Promise.resolve();
    bellPlaying = true; var seq = ++bellPlaySeq, fresh = [], unseen = [];
    (BS.bells || []).forEach(function (b) { if (b.rung && !b.unseen) bellShown[b.key] = true; if (b.rung && b.unseen) unseen.push(b); });
    if (unseen.some(function (b) { return bellShown[b.key]; }) && num(BS, 'rung_n') <= Object.keys(bellShown).length) { bellShown = {}; bellFullShown = false; }
    fresh = unseen.filter(function (b) { return !bellShown[b.key]; });
    if (BS.full && !BS.full_unseen) bellFullShown = true;
    var chain = Promise.resolve(true);
    fresh.forEach(function (b, index) {
      chain = chain.then(function (ok) { if (!ok) return false; return waitBell(650, seq); }).then(function (ok) {
        if (!ok) return false;
        var actual = (BS.bells || []).indexOf(b), el = $('#p94-bells .bl-bell:nth-child(' + (actual + 1) + ')');
        if (el) { el.classList.remove('p94-just-rung'); void el.offsetWidth; el.classList.add('p94-just-rung'); }
        bellSound(actual); bellShown[b.key] = true;
        return waitBell(1300, seq);
      });
    });
    return chain.then(function (ok) {
      if (!ok) return false;
      if (!BS.full_unseen || bellFullShown) return true;
      return waitBell(900, seq).then(function (ok) {
        if (!ok) return false; bellFullShown = true; bellSound('full');
        var arch = $('#sheet-bells .bl-arch'); if (arch) arch.classList.add('p94-full-ceremony');
        return waitBell(2500, seq);
      }).then(function (ok) { if (!ok) return false; return bellCeremony('full', {}); });
    }).then(function (ok) {
      if (!ok) return false;
      var sets = BS.new_sets || [], key = sets.join(',');
      if (!sets.length || key === bellSetsShown) return true;
      bellSetsShown = key;
      return waitBell(500, seq).then(function (ok) {
        if (!ok) return false; var chosen = null; (BS.sets || []).forEach(function (x) { if (x.key === sets[sets.length - 1]) chosen = x; });
        return bellCeremony('set', chosen || { key: sets[sets.length - 1], name: sets[sets.length - 1] });
      });
    }).then(function (ok) {
      if (!ok) return false; var pr = BS.pledge_result;
      if (!pr || bellResultShown) return true; bellResultShown = true;
      return waitBell(500, seq).then(function (ok) { return ok ? bellCeremony('pledge', pr) : false; });
    }).then(function (ok) {
      if (!ok || !bellsVisible()) return null;
      if (fresh.length || BS.full_unseen || (BS.new_sets && BS.new_sets.length) || BS.pledge_result) return rpc('bells_mark_seen').catch(function () {});
      return null;
    }).then(function () { bellPlaying = false; }, function () { bellPlaying = false; });
  }
  function loadBells() {
    if (bellsBusy || !signed()) return Promise.resolve();
    bellsBusy = true; buildBells(); bellNote('');
    var work = rpc('bells_state').then(function (m) { renderBells(m); }).catch(function (e) { bellNote(message(e)); });
    rpc('bell_push_state').then(function (r) { pushState = map(r); paintPush(); }).catch(function () {});
    if (!HS) loadHeart(); else renderBellHeart();
    return work.then(function () { bellsBusy = false; playBellUnseen(); });
  }
  function ringBell(key, e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (bellsBusy || !BS) return;
    var it = null;
    (BS.bells || []).forEach(function (b) { if (b.key === key) it = b; });
    if (!it) return;
    bellSound((BS.bells || []).indexOf(it));
    if (it.rung) { bellNote(String(it.label || key) + ' has already rung today.'); return; }
    if (key === 'dawn') {
      var greeted = HS && (HS.actions || []).some(function (a) { return a.key === 'greet' && !!a.done; });
      if (!greeted) {
        bellsBusy = true;
        rpc('heart_greet').then(function (h) {
          renderHeart(h); return rpc('bells_state');
        }).then(function (b) { renderBells(b); }).catch(function (e) { bellNote(message(e)); }).then(function () { bellsBusy = false; });
      } else if (!it.is_open) bellNote('Dawn rings at ' + hourLabel(it.hour) + '. Your greeting is remembered.');
      return;
    }
    if (key === 'noon') {
      if (it.done && !it.is_open) bellNote('Noon rings at ' + hourLabel(it.hour) + '. Your reading is remembered.');
      else goRoom('explore');
      return;
    }
    if (key === 'dusk') {
      if (it.done && !it.is_open) bellNote('Dusk rings at ' + hourLabel(it.hour) + '. What you did is remembered.');
      else openJoin();
      return;
    }
    if (key === 'night') {
      if (!it.is_open) { bellNote('Ivory’s line for tonight opens at ' + hourLabel(it.hour) + '.'); return; }
      bellsBusy = true;
      rpc('bell_open_line').then(function (b) { renderBells(b); }).catch(function (e) { bellNote(message(e)); }).then(function () { bellsBusy = false; });
    }
  }
  on(d, 'click', function (e) {
    var t = e.target && e.target.closest ? e.target : null;
    if (t && t.closest('#sheet-bell-ceremony [data-close]') && bellCeremonyDone) finishBellCeremony('close');
  }, true);

  function goRoom(room) {
    if (w.ivShell && ivShell.shutAll) ivShell.shutAll();
    if (w.ivoryShow) ivoryShow(room);
  }
  function openJoin() {
    makeSheet('sheet-join', 'Join in to ring Dusk',
      '<div class="p94-join"><p>Turn a Ten-Day Vault key, vote in a poll, join a live, or read a second story. A wish or a gift counts too.</p><button class="p94-goldkey" type="button" data-go="home">Go to Home</button><button class="p94-goldkey rose" type="button" data-go="wish">Make a wish</button></div>', 'p94-join-wrap');
    openSheet('join');
  }
  function askPledge(n) {
    makeSheet('sheet-pledge-confirm', 'Your pledge',
      '<div class="p94-confirm"><h3 id="p94-confirm-title"></h3><p id="p94-confirm-copy"></p><div class="p94-confirm-keys"><button class="p94-textkey" type="button" data-close id="p94-confirm-cancel">NOT NOW</button><button class="p94-goldkey p94-action" type="button" id="p94-confirm-go">I PLEDGE</button></div></div>', 'p94-confirm-wrap');
    d.getElementById('p94-confirm-title').textContent = 'Pledge ' + n + ' Full Days?';
    d.getElementById('p94-confirm-copy').textContent = 'You promise yourself to ring all the bells every day, in a row. It is free and nothing is at stake. A heart mend carries a missed day. If it ends, you can begin another at once.';
    var go = d.getElementById('p94-confirm-go'); go.textContent = 'I PLEDGE'; go.setAttribute('data-confirm-pledge', n); go.removeAttribute('data-confirm-release');
    d.getElementById('p94-confirm-cancel').textContent = 'NOT NOW';
    openSheet('pledge-confirm');
  }
  function askRelease() {
    askPledge(0);
    d.getElementById('p94-confirm-title').textContent = 'Let go of this pledge?';
    d.getElementById('p94-confirm-copy').textContent = 'It ends quietly, with no message and nothing lost. Pledges you have kept stay counted, and you can begin another whenever you like.';
    var go = d.getElementById('p94-confirm-go'); go.textContent = 'LET GO'; go.setAttribute('data-confirm-release', '1'); go.removeAttribute('data-confirm-pledge');
    d.getElementById('p94-confirm-cancel').textContent = 'KEEP IT';
  }
  function confirmPledge(go) {
    var release = go.hasAttribute('data-confirm-release'), n = Number(go.getAttribute('data-confirm-pledge')) || 0;
    if (!release && !n) return;
    closeById('sheet-pledge-confirm'); bellsBusy = true;
    rpc(release ? 'bell_pledge_release' : 'bell_pledge_make', release ? {} : { n: n }).then(function (b) {
      renderBells(b); if (!release && w.Sound && Sound.play) Sound.play('chime');
    }).catch(function (e) { bellNote(message(e)); }).then(function () { bellsBusy = false; });
  }
  function openSets() {
    makeSheet('sheet-bellsets', 'The Bell Sets',
      '<p class="p94-setintro">Every set is earned with Full Days. Wear any set you have earned; after the last set, a new round begins.</p><div class="p94-setgrid" id="p94-setgrid"></div>', 'p94-sets-wrap');
    renderSets(); openSheet('bellsets');
  }
  function renderSets() {
    var grid = d.getElementById('p94-setgrid'); if (!grid || !BS) return;
    grid.innerHTML = '';
    (BS.sets || []).forEach(function (s) {
      var colours = look(s.key), b = d.createElement('button');
      b.type = 'button'; b.className = 'p94-set-tile p94-action ' + (s.owned ? 'owned ' : 'locked ') + (s.key === BS.wear ? 'wearing' : '');
      b.setAttribute('data-set', String(s.key));
      var dots = '';
      colours.forEach(function (c) { dots += '<i style="background:' + c + '"></i>'; });
      b.innerHTML = '<span class="p94-setdots">' + dots + '</span><b>' + esc(s.name || s.key) + '</b><span>' + (s.owned ? (s.key === BS.wear ? 'Wearing' : 'Earned · tap to wear') : num(s, 'remaining') + ' Full Days to go') + '</span>' + (num(s, 'stars') ? '<em>★ ' + num(s, 'stars') + '</em>' : '');
      grid.appendChild(b);
    });
    if (!BS.sets || !BS.sets.length) grid.innerHTML = '<p class="p94-fine">No bell sets have been returned by the house.</p>';
  }
  function wearSet(key) {
    if (!BS || bellsBusy) return;
    var chosen = null;
    (BS.sets || []).forEach(function (s) { if (s.key === key) chosen = s; });
    if (!chosen) return;
    if (!chosen.owned) { toast(num(chosen, 'remaining') + ' Full Days still to go for ' + (chosen.name || key) + '.'); return; }
    bellsBusy = true;
    rpc('bell_set_wear', { k: key }).then(function (b) { renderBells(b); closeById('sheet-bellsets'); bellSound(); }).catch(function (e) { toast(message(e), true); }).then(function () { bellsBusy = false; });
  }
  function toggleSound() {
    bellSoundOn = !bellSoundOn;
    try { localStorage.setItem('ivory.bell.sound', bellSoundOn ? '1' : '0'); } catch (e) {}
    paintSound(); if (bellSoundOn) bellSound();
  }
  function paintSound() {
    var b = d.getElementById('p94-sound'); if (!b) return;
    b.classList.toggle('on', bellSoundOn); b.setAttribute('aria-checked', bellSoundOn ? 'true' : 'false');
  }
  function togglePush() {
    if (bellsBusy) return;
    var next = !(pushState && pushState.on !== false);
    bellsBusy = true;
    rpc('bell_push_set', { v: next }).then(function (r) { pushState = map(r); paintPush(); }).catch(function (e) { bellNote(message(e)); }).then(function () { bellsBusy = false; });
  }
  function paintPush() {
    var b = d.getElementById('p94-push'); if (!b) return;
    var house = !pushState || pushState.house_on === true, on = !pushState || pushState.on !== false;
    b.disabled = !house; b.classList.toggle('on', house && on); b.setAttribute('aria-checked', house && on ? 'true' : 'false');
    var copy = d.getElementById('p94-push-copy');
    if (copy) copy.textContent = house ? 'A gentle reminder when a bell opens and is still waiting.' : 'The house has paused reminders.';
  }

  /* ── HEADER: HEART · BELLS · LADDER ───────────────────────────────────── */
  function headerAlive() {
    $$('.hp-icons, .top-icons').forEach(function (row) {
      var heart = $('.med.heart', row), bell = $('.med.bell', row), ladder = $('.med.ladder', row);
      if (heart && bell && ladder) {
        var kids = Array.prototype.slice.call(row.children);
        if (kids[0] !== heart || kids[1] !== bell || kids[2] !== ladder) {
          row.insertBefore(heart, row.firstChild);
          row.insertBefore(bell, heart.nextSibling);
          row.insertBefore(ladder, bell.nextSibling);
        }
        [heart, bell, ladder].forEach(function (el) { el.style.removeProperty('order'); });
      }
      if (ladder) {
        ladder.classList.add('p94-climb');
        var svg = $('.laddersvg', ladder);
        if (svg && !$('.p94-climber', svg)) {
          var c = d.createElementNS('http://www.w3.org/2000/svg', 'circle');
          c.setAttribute('class', 'p94-climber'); c.setAttribute('cx', '16'); c.setAttribute('cy', '24'); c.setAttribute('r', '2.2');
          svg.appendChild(c);
        }
      }
    });
  }

  /* All dynamic actions are delegated so server redraws never detach them. */
  on(d, 'click', function (e) {
    var t = e.target && e.target.closest ? e.target : null;
    if (!t) return;
    if (t.closest('#home-explore')) { e.preventDefault(); goRoom('explore'); return; }
    var setOpen = t.closest('#p94-set-button'); if (setOpen) { e.preventDefault(); e.stopImmediatePropagation(); openSets(); return; }
    var ceremony = t.closest('[data-bell-ceremony]'); if (ceremony) { e.preventDefault(); e.stopImmediatePropagation(); finishBellCeremony(ceremony.getAttribute('data-bell-ceremony')); return; }
    var greet = t.closest('.gh-greet'); if (greet && $('#sheet-heart')) { greetHeart(e); return; }
    var orb = t.closest('.bl-orb[data-bell]'); if (orb) { ringBell(orb.getAttribute('data-bell'), e); return; }
    var pledge = t.closest('[data-pledge]'); if (pledge) { e.preventDefault(); askPledge(Number(pledge.getAttribute('data-pledge'))); return; }
    if (t.closest('#p94-release')) { e.preventDefault(); askRelease(); return; }
    var confirm = t.closest('#p94-confirm-go'); if (confirm) { e.preventDefault(); confirmPledge(confirm); return; }
    var set = t.closest('[data-set]'); if (set) { e.preventDefault(); wearSet(set.getAttribute('data-set')); return; }
    var go = t.closest('[data-go]'); if (go) { e.preventDefault(); goRoom(go.getAttribute('data-go')); return; }
  }, true);
  on(d, 'keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.matches && e.target.matches('.bl-orb[data-bell]')) ringBell(e.target.getAttribute('data-bell'), e);
  }, true);
  on(d, 'click', function (e) {
    var t = e.target && e.target.closest ? e.target : null; if (!t) return;
    if (t.closest('.med.heart')) { heartDirty = true; setTimeout(loadHeart, 40); }
    if (t.closest('.med.bell')) { bellsDirty = true; setTimeout(loadBells, 40); }
  }, true);

  function beat() {
    headerAlive(); syncHeartbeat();
    if ($('#sheet-heart.show') && heartDirty && !heartBusy) loadHeart();
    if ($('#sheet-bells.show') && bellsDirty && !bellsBusy) loadBells();
  }
  function boot() {
    isolateSheets(); storySheet(); buildHeart(); buildBells(); headerAlive(); paintSound(); paintPush(); watchHeartbeat();
    $$('.door-tally').forEach(function (el) { el.hidden = true; });
    loadTally();
  }
  if (d.readyState === 'loading') on(d, 'DOMContentLoaded', boot); else boot();

  window.IVP94 = {
    beat: beat,
    heart: loadHeart,
    bells: loadBells,
    renderHeart: renderHeart,
    renderBells: renderBells,
    openStory: openStory,
    heartbeat: { state: heartbeatState, sync: syncHeartbeat, probe: probeHeartbeat },
    state: function () { return { heart: HS, bells: BS }; }
  };
  window.IVORY_STORY_DOOR = { open: openStory, submit: sendStory, tally: loadTally };
})();
