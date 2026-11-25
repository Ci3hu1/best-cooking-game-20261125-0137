# Strategy — Warung 41 Detik

## What the judge rewards (in order)

1. **A complete cooking game in one frame.** The cover screenshot must show,
   at a glance: the kitchen, the order board, ingredients on the counter, one
   dish mid-assembly, a timer, and a plate ready to serve. Everything else is
   secondary to this frame.
2. **Fun and depth.** Orders that push you to plan a route through the
   kitchen, recipes that combine in different ways, and pressure that grows
   without adding chores.
3. **Feel and polish.** Chopping and plating that answer at once, a timer you
   can feel, and a service rush that reads in a glance.
4. **Look and originality.** Food drawn so it looks worth serving, counters
   you can read at a glance, and a kitchen with a look of its own.
5. **Structure.** The source split into files with one clear job each, named
   for what they do.

## How this entry answers each one

**1. One readable frame.** The game is a single 1280×720 kitchen. The cover
screenshot is staged at the busiest honest moment: a Nasi Goreng 41 plated
and glowing READY TO SERVE on the assembly plate while a second dish cooks
in the wok, three tickets on the order board with patience bars, six
ingredient counters in a row, the shift timer at ~2:30, and Chef Darma
mid-stride with eggs on his tray. High contrast on purpose — warm wood
counters, cream tickets, yellow timer, red chilli — so the frame still reads
when the judge's contact sheet shrinks it.

**2. Depth.** Five recipes from six ingredients, so the same stations combine
in different ways every shift. Orders arrive on a timer and age out; the
route matters because the wok is the only cooking station and the plate is
the only assembly point, so two dishes in flight force a real plan: plate
the first while the second cooks. The golden window adds a timing decision
on every egg dish — scoop early and it is underdone, late and it burns.

**3. Fairness.** The wok takes ~6 seconds to cook and only burns past 150
progress, so a mistake is recoverable; the plate can be binned and rebuilt.
Patience bars are generous (50s) and the score rewards fast serves rather
than punishing slow ones. The combo rewards streaks without ending the run
on one slip.

**4. Original look and the one specific detail.** A midnight warung at Pasar
Senja, not a generic diner: string lamps, a wooden stall, Indonesian dish
names (Nasi Goreng 41, Ayam Geprek Darma, Tumis Sayur Senja). The detail no
other entry has is the **Telur 41 Detik** — Chef Darma's late father timed
the perfect soft egg at exactly 41 seconds, and the stall still cooks it by
that count; scooping an egg dish inside the golden window triggers the
"Warisan Ayah" bonus, which triples the dish. Regulars order by memory
("Like 1987 — extra chilli, no rush"), not by menu number. All art is
procedural canvas drawing; all sounds are synthesized WebAudio blips and
sizzle — no borrowed assets, names, or music.

**5. Structure.** One job per file, named for it: `config.js` (tuning),
`rng.js` (seeded randomness), `recipes.js` (dishes, ingredients, regulars),
`world.js` (state and rules, no DOM), `input.js` (keyboard and mouse),
`audio.js` (synthesized sounds), `render.js` (all canvas drawing),
`scenes.js` (staged screenshot moments), `main.js` (the loop). Pure logic
(recipes, world) has no DOM dependency, so tests drive the same code the
player does.

## What was tried and dropped

- A click-to-move-only scheme: dropped in favour of WASD/arrows plus click
  as a walk target, so the game plays fully by keyboard and fully by mouse.
- A seventh ingredient (noodles): dropped — six stations already fill the
  counter row, and five recipes from six ingredients is the right density
  for a 3-minute shift.
- A customer-walking animation: dropped — tickets with patience bars read
  better in a still screenshot than walking sprites do.

## Expected outcomes

- A valid gate pass: plain static files, no network, 4 screenshots under
  256 KiB, dossier byte-identical to what the library writes.
- Judge-visible completeness in the cover alone: all five required elements
  in one frame, plus a second dish mid-assembly for depth.
- The Telur 41 Detik golden window is the memorable hook the judge can cite
  when comparing this game against the field's generic rush clones.
