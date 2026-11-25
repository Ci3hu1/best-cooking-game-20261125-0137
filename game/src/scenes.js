// Staged screenshot scenes for Warung 41 Detik.
// Each scene plays the REAL rules forward from a fresh seeded world, steered
// by a small autopilot that walks the chef, picks ingredients, works the wok
// and serves — so every screenshot is a frame of a genuine game, and the
// same seed always gives the same frame.
import { PERFECT_LOW, WOK_DONE, stationById } from './config.js';
import { dishById, matchDish } from './recipes.js';
import { SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE, createWorld, startGame, step } from './world.js';

const STEP = 1 / 60;
const MAX_STEPS = 90000;

function moveToward(world, tx, ty) {
  const dx = tx - world.chef.x;
  const dy = ty - world.chef.y;
  const len = Math.hypot(dx, dy);
  if (len < 8) return { dx: 0, dy: 0, interact: false };
  return { dx: dx / len, dy: dy / len, interact: false };
}

function atStation(world, station) {
  return Math.hypot(world.chef.x - station.x, world.chef.y - station.y) < station.r + 12;
}

function runTo(world, station, budget) {
  let used = 0;
  while (!atStation(world, station) && used < budget) {
    step(world, STEP, moveToward(world, station.x, station.y));
    used += 1;
  }
  return used;
}

function press(world) {
  return step(world, STEP, { dx: 0, dy: 0, interact: true });
}

function waitUntil(world, cond, maxSeconds) {
  let used = 0;
  const cap = Math.ceil(maxSeconds / STEP);
  while (!cond(world) && used < cap) {
    step(world, STEP, { dx: 0, dy: 0, interact: false });
    used += 1;
  }
  return used;
}

function ingredientStation(ingredient) {
  return stationById(
    { rice: 'rice', egg: 'egg', chicken: 'chicken', chilli: 'chilli', kecap: 'kecap', veg: 'veg' }[ingredient],
  );
}

// Cook one dish end to end: gather, wok, scoop. Returns true when the plate
// holds the dish.
function cookDish(world, dish) {
  for (const ingredient of dish.needs) {
    runTo(world, ingredientStation(ingredient), 600);
    press(world);
  }
  runTo(world, stationById('wok'), 600);
  press(world);
  waitUntil(world, (w) => w.wok.progress >= WOK_DONE, 9);
  runTo(world, stationById('wok'), 600);
  press(world);
  return matchDish(world.plate) !== null;
}

function servePlate(world) {
  runTo(world, stationById('hatch'), 600);
  press(world);
}

function clearPlate(world) {
  runTo(world, stationById('bin'), 600);
  press(world);
}

// One full service cycle against the first open ticket.
function serveOneCycle(world) {
  const order = world.orders[0];
  if (!order) return false;
  const dish = dishById(order.dishId);
  if (!dish) return false;
  if (!cookDish(world, dish)) {
    clearPlate(world);
    return false;
  }
  servePlate(world);
  return true;
}

/**
 * Set `world` to the named scene and return the screen to draw.
 * start: title screen over a fresh kitchen. rush: a dish plated and ready
 * plus a second dish mid-cook in the wok. plate: a ready dish at the hatch.
 * end: a finished shift, game-over screen.
 */
export function stageShot(name, world) {
  const fresh = createWorld(world.seed);
  Object.assign(world, fresh);
  if (name === 'end') {
    startGame(world);
    let guard = 0;
    while (world.screen === SCREEN_PLAY && guard < MAX_STEPS) {
      const before = world.served + world.fails;
      serveOneCycle(world);
      guard += 1;
      // If a cycle made no progress (burnt, expired, stuck), keep the
      // clock moving instead of looping on the same ticket forever.
      if (world.served + world.fails === before) {
        waitUntil(world, (w) => w.timeLeft <= 0, 5);
      }
      if (world.orders.length === 0) waitUntil(world, (w) => w.orders.length > 0, 3);
    }
    if (world.screen !== SCREEN_OVER) {
      world.timeLeft = 0;
      world.screen = SCREEN_OVER;
    }
    return { screen: SCREEN_OVER };
  }
  if (name === 'rush' || name === 'plate') {
    startGame(world);
    const first = world.orders[0];
    if (first) {
      cookDish(world, dishById(first.dishId));
    }
    if (name === 'plate') {
      runTo(world, stationById('hatch'), 600);
      return { screen: SCREEN_PLAY };
    }
    // Rush: start a second dish and freeze it mid-cook, wok half done.
    const second = world.orders[0];
    if (second) {
      const dish = dishById(second.dishId);
      for (const ingredient of dish.needs) {
        runTo(world, ingredientStation(ingredient), 600);
        press(world);
      }
      runTo(world, stationById('wok'), 600);
      press(world);
      waitUntil(world, (w) => w.wok.progress >= 55, 5);
    }
    return { screen: SCREEN_PLAY };
  }
  // Default: title screen.
  world.screen = SCREEN_TITLE;
  return { screen: SCREEN_TITLE };
}

export { PERFECT_LOW, SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE };
