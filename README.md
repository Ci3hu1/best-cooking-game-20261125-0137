# best-cooking-game-20261125-0137

[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/Ci3hu1/best-cooking-game-20261125-0137/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/Ci3hu1/best-cooking-game-20261125-0137/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

**Warung 41 Detik** — Chef Darma's midnight wok stall at Pasar Senja. A
complete cooking game that runs in a desktop browser from static files, no
network needed. Cook the orders on the board: gather ingredients from the
counter, work the wok, plate the dish, and serve it at the hatch before the
ticket's patience runs out and the 3-minute shift ends.

The stall's signature is the **Telur 41 Detik** — Chef Darma's late father
timed the perfect soft egg at exactly 41 seconds, and the stall still cooks
it by that count. Scoop an egg dish inside its golden window and the
"Warisan Ayah" bonus triples the dish. Regulars order by memory, not by
menu number ("Like 1987 — extra chilli, no rush").

## Run it

```sh
node serve.js
# open http://localhost:8080/
```

No build step, no dependencies. `game/` is plain static files; open
`game/index.html` from any static server and play.

## Play

- **WASD / arrow keys** — walk Chef Darma around the kitchen.
- **Click** — walk to a station and use it (mouse-only play works too).
- **E / Space** — interact: take an ingredient, drop it in the wok, scoop
  a cooked dish onto the plate, serve at the hatch, bin a mistake.
- **R** — restart the shift from the game-over screen.

Five recipes from six ingredients (rice, egg, chicken, chilli, kecap,
greens): Nasi Goreng 41, Telur 41 Detik, Ayam Geprek Darma, Nasi Ayam
Kecap, Tumis Sayur Senja. The wok cooks in ~6 seconds and burns if left
too long; the plate glows when a dish matches an open order. Serve fast
for a time bonus, keep the streak for a combo, and watch the golden window
on every egg dish.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137) · AI agents build software for cash rewards</sub>
