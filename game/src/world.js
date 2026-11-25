// World state and rules for Warung 41 Detik. Pure logic: no DOM, no canvas,
// so tests and the staged screenshot scenes drive the same code the player
// does. `step(dt, input)` advances one frame; input is { dx, dy, interact }
// with interact true only on the frame the key or click fires.
import {
  CHEF_RADIUS,
  CHEF_SPEED,
  FLOOR,
  ORDER_MAX,
  ORDER_PATIENCE_SECONDS,
  ORDER_SPAWN_SECONDS,
  PERFECT_HIGH,
  PERFECT_LOW,
  SHIFT_SECONDS,
  STATIONS,
  TRAY_MAX,
  WOK_BURNT,
  WOK_COOK_RATE,
  WOK_DONE,
  stationById,
} from './config.js';
import { DISHES, REGULARS, dishById, matchDish } from './recipes.js';
import { createRng, pick } from './rng.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_OVER = 'over';

export function createWorld(seed = 41) {
  const rng = createRng(seed);
  const world = {
    seed,
    rng,
    screen: SCREEN_TITLE,
    time: 0,
    timeLeft: SHIFT_SECONDS,
    chef: { x: 640, y: 470 },
    tray: [],
    wok: { items: [], progress: 0 },
    plate: [],
    orders: [],
    orderSeq: 0,
    spawnIn: 2,
    score: 0,
    coins: 0,
    served: 0,
    combo: 0,
    bestCombo: 0,
    fails: 0,
    perfects: 0,
    message: 'WASD / arrows to walk — E or click to cook',
    messageT: 0,
    flash: 0,
  };
  spawnOrder(world);
  spawnOrder(world);
  return world;
}

export function startGame(world) {
  world.screen = SCREEN_PLAY;
  world.time = 0;
  world.timeLeft = SHIFT_SECONDS;
  world.message = 'Shift started — first orders are up!';
  world.messageT = 3;
}

function spawnOrder(world) {
  if (world.orders.length >= ORDER_MAX) return;
  // Prefer a dish that is not already on the board, so tickets stay varied.
  const open = DISHES.filter((d) => !world.orders.some((o) => o.dishId === d.id));
  const dish = pick(world.rng, open.length > 0 ? open : DISHES);
  const regular = pick(world.rng, REGULARS);
  world.orderSeq += 1;
  world.orders.push({
    id: world.orderSeq,
    dishId: dish.id,
    customer: regular.name,
    memory: regular.memory,
    patience: ORDER_PATIENCE_SECONDS,
    maxPatience: ORDER_PATIENCE_SECONDS,
  });
}

export function nearestStation(world) {
  let best = null;
  let bestD = Infinity;
  for (const s of STATIONS) {
    const d = Math.hypot(world.chef.x - s.x, world.chef.y - s.y);
    if (d < s.r + 30 && d < bestD) {
      best = s;
      bestD = d;
    }
  }
  return best;
}

function setMessage(world, text, seconds = 2.5) {
  world.message = text;
  world.messageT = seconds;
}

function serveDish(world, dish) {
  const ticketIndex = world.orders.findIndex((o) => o.dishId === dish.id);
  if (ticketIndex === -1) return false;
  const ticket = world.orders[ticketIndex];
  const timeBonus = Math.round((ticket.patience / ticket.maxPatience) * 50);
  const golden = dish.golden && world.wokPerfect;
  let points = dish.price + timeBonus;
  if (golden) points *= 3;
  if (world.combo >= 2) points += world.combo * 10;
  world.score += points;
  world.coins += dish.price * 100;
  world.served += 1;
  world.combo += 1;
  world.bestCombo = Math.max(world.bestCombo, world.combo);
  if (golden) world.perfects += 1;
  world.orders.splice(ticketIndex, 1);
  world.plate = [];
  world.wokPerfect = false;
  world.flash = 0.6;
  setMessage(
    world,
    golden
      ? `WARISAN AYAH! Telur 41 Detik — perfect! +${points}`
      : `Served ${dish.name} to ${ticket.customer} — +${points}`,
    3,
  );
  return true;
}

function interact(world) {
  const station = nearestStation(world);
  if (!station) return 'none';
  if (station.ingredient) {
    if (world.tray.length >= TRAY_MAX) {
      setMessage(world, 'Tray is full — cook or bin something first');
      return 'deny';
    }
    world.tray.push(station.ingredient);
    setMessage(world, `Picked up ${station.label.toLowerCase()}`, 1.2);
    return 'pickup';
  }
  if (station.id === 'wok') {
    if (world.wok.items.length > 0 && world.wok.progress >= WOK_BURNT) {
      world.wok = { items: [], progress: 0 };
      world.combo = 0;
      world.fails += 1;
      setMessage(world, 'Burnt! Scraped the wok — combo lost', 2.5);
      return 'burn';
    }
    if (world.tray.length > 0) {
      world.wok.items.push(...world.tray);
      world.tray = [];
      setMessage(world, 'Into the wok — watch the flame!', 1.5);
      return 'drop';
    }
    if (world.wok.items.length > 0 && world.wok.progress >= WOK_DONE) {
      const perfect =
        world.wok.progress >= PERFECT_LOW && world.wok.progress <= PERFECT_HIGH;
      world.plate = world.wok.items.slice();
      world.wokPerfect = perfect;
      world.wok = { items: [], progress: 0 };
      setMessage(
        world,
        perfect ? 'Scooped at the golden moment!' : 'Plated — check the order board',
        2,
      );
      return 'scoop';
    }
    setMessage(world, 'Wok is empty — bring ingredients first', 1.5);
    return 'deny';
  }
  if (station.id === 'plate') {
    if (world.plate.length === 0) {
      setMessage(world, 'Plate is empty — scoop from the wok', 1.5);
      return 'deny';
    }
    const dish = matchDish(world.plate);
    setMessage(
      world,
      dish ? `${dish.name} is plated — take it to the hatch!` : 'This mix matches no order — bin it and retry',
      2,
    );
    return dish ? 'ready' : 'deny';
  }
  if (station.id === 'hatch') {
    if (world.plate.length === 0) {
      setMessage(world, 'Nothing to serve — plate a dish first', 1.5);
      return 'deny';
    }
    const dish = matchDish(world.plate);
    if (!dish) {
      setMessage(world, 'No order matches this plate', 2);
      return 'deny';
    }
    return serveDish(world, dish) ? 'serve' : 'deny';
  }
  if (station.id === 'bin') {
    if (world.tray.length === 0 && world.plate.length === 0) {
      setMessage(world, 'Nothing to throw away', 1.2);
      return 'deny';
    }
    world.tray = [];
    world.plate = [];
    world.wokPerfect = false;
    setMessage(world, 'Binned — fresh start', 1.5);
    return 'bin';
  }
  return 'none';
}

export function step(world, dt, input) {
  const events = [];
  if (world.screen !== SCREEN_PLAY) return events;
  world.time += dt;
  world.timeLeft = Math.max(0, SHIFT_SECONDS - world.time);
  if (world.messageT > 0) world.messageT -= dt;
  if (world.flash > 0) world.flash -= dt;

  // Movement.
  const len = Math.hypot(input.dx, input.dy);
  if (len > 0) {
    const nx = world.chef.x + (input.dx / len) * CHEF_SPEED * dt;
    const ny = world.chef.y + (input.dy / len) * CHEF_SPEED * dt;
    world.chef.x = Math.min(FLOOR.x + FLOOR.w - CHEF_RADIUS, Math.max(FLOOR.x + CHEF_RADIUS, nx));
    world.chef.y = Math.min(FLOOR.y + FLOOR.h - CHEF_RADIUS, Math.max(FLOOR.y + CHEF_RADIUS, ny));
  }

  if (input.interact) {
    const ev = interact(world);
    if (ev !== 'none') events.push(ev);
  }

  // Wok cooks while it holds food.
  if (world.wok.items.length > 0) {
    const before = world.wok.progress;
    world.wok.progress += WOK_COOK_RATE * dt;
    if (before < WOK_DONE && world.wok.progress >= WOK_DONE) {
      events.push('done');
      setMessage(world, 'Wok is ready — scoop it onto the plate!', 2);
    }
    if (before < WOK_BURNT && world.wok.progress >= WOK_BURNT) {
      events.push('burnt');
      setMessage(world, 'Burning! Clear the wok at once!', 2.5);
    }
  }

  // Orders age; an expired ticket walks out angry.
  world.spawnIn -= dt;
  if (world.spawnIn <= 0) {
    spawnOrder(world);
    world.spawnIn = ORDER_SPAWN_SECONDS;
  }
  for (let i = world.orders.length - 1; i >= 0; i -= 1) {
    const order = world.orders[i];
    order.patience -= dt;
    if (order.patience <= 0) {
      const dish = dishById(order.dishId);
      world.orders.splice(i, 1);
      world.combo = 0;
      world.fails += 1;
      world.score = Math.max(0, world.score - 50);
      setMessage(world, `${order.customer} left hungry — ${dish ? dish.name : 'order'} lost (-50)`, 3);
      events.push('expire');
    }
  }

  // Last-minute tick.
  if (world.timeLeft <= 10.5 && world.timeLeft > 0) {
    const whole = Math.ceil(world.timeLeft);
    if (whole !== world.lastTick) {
      world.lastTick = whole;
      events.push('tick');
    }
  }

  if (world.timeLeft <= 0) {
    world.screen = SCREEN_OVER;
    events.push('over');
  }
  return events;
}

export function restart(world) {
  const fresh = createWorld(world.seed);
  Object.assign(world, fresh);
  startGame(world);
}
