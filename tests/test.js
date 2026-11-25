// Tests for Warung 41 Detik. Run: node --test tests/
// Pure game logic (recipes, world rules, staging) runs in Node with no DOM;
// the entry program (main.ts) is tested end to end.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { matchDish, dishById } from '../game/src/recipes.js';
import { createWorld, nearestStation, startGame, step } from '../game/src/world.js';
import { stageShot } from '../game/src/scenes.js';
import { stationById } from '../game/src/config.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('recipes: matchDish matches a recipe in any order and refuses a wrong mix', () => {
  assert.equal(matchDish(['kecap', 'egg', 'rice']).id, 'nasi-goreng-41');
  assert.equal(matchDish(['egg', 'kecap']).id, 'telur-41-detik');
  assert.equal(matchDish(['rice', 'egg']), null);
  assert.equal(matchDish(['rice', 'egg', 'kecap', 'chilli']), null);
  assert.equal(dishById('ayam-geprek').needs.join(','), 'chicken,chilli,rice');
});

test('world: a fresh world opens with two orders and a full shift', () => {
  const world = createWorld(41);
  assert.equal(world.screen, 'title');
  assert.equal(world.orders.length, 2);
  assert.equal(world.timeLeft, 180);
  assert.equal(world.tray.length, 0);
});

test('world: picking up, cooking and serving scores', () => {
  const world = createWorld(41);
  startGame(world);
  const dish = dishById(world.orders[0].dishId);
  // Walk the chef onto each ingredient station and pick it up.
  for (const ingredient of dish.needs) {
    const station = stationById(
      { rice: 'rice', egg: 'egg', chicken: 'chicken', chilli: 'chilli', kecap: 'kecap', veg: 'veg' }[ingredient],
    );
    world.chef.x = station.x;
    world.chef.y = station.y;
    const events = step(world, 1 / 60, { dx: 0, dy: 0, interact: true });
    assert.ok(events.includes('pickup'), `expected pickup of ${ingredient}, got ${events}`);
  }
  assert.deepEqual(world.tray.slice().sort(), dish.needs.slice().sort());
  // Drop into the wok and cook until done.
  const wok = stationById('wok');
  world.chef.x = wok.x;
  world.chef.y = wok.y;
  step(world, 1 / 60, { dx: 0, dy: 0, interact: true });
  assert.deepEqual(world.wok.items.slice().sort(), dish.needs.slice().sort());
  let guard = 0;
  while (world.wok.progress < 100 && guard < 600) {
    step(world, 1 / 60, { dx: 0, dy: 0, interact: false });
    guard += 1;
  }
  assert.ok(world.wok.progress >= 100, 'wok should reach done');
  step(world, 1 / 60, { dx: 0, dy: 0, interact: true });
  assert.equal(world.plate.length, dish.needs.length);
  // Serve at the hatch.
  const hatch = stationById('hatch');
  world.chef.x = hatch.x;
  world.chef.y = hatch.y;
  const before = world.score;
  const events = step(world, 1 / 60, { dx: 0, dy: 0, interact: true });
  assert.ok(events.includes('serve'), `expected serve, got ${events}`);
  assert.ok(world.score > before);
  assert.equal(world.served, 1);
});

test('world: a burnt wok must be cleared and costs the combo', () => {
  const world = createWorld(7);
  startGame(world);
  world.chef.x = stationById('egg').x;
  world.chef.y = stationById('egg').y;
  step(world, 1 / 60, { dx: 0, dy: 0, interact: true });
  world.chef.x = stationById('wok').x;
  world.chef.y = stationById('wok').y;
  step(world, 1 / 60, { dx: 0, dy: 0, interact: true });
  let guard = 0;
  while (world.wok.progress < 150 && guard < 900) {
    step(world, 1 / 60, { dx: 0, dy: 0, interact: false });
    guard += 1;
  }
  assert.ok(world.wok.progress >= 150, 'wok should burn');
  const events = step(world, 1 / 60, { dx: 0, dy: 0, interact: true });
  assert.ok(events.includes('burn'));
  assert.equal(world.wok.items.length, 0);
});

test('world: an expired order costs 50 points and a fail', () => {
  const world = createWorld(3);
  startGame(world);
  world.orders[0].patience = 0.01;
  const score = world.score;
  step(world, 0.1, { dx: 0, dy: 0, interact: false });
  assert.equal(world.orders.length, 1);
  assert.equal(world.fails, 1);
  assert.equal(world.score, Math.max(0, score - 50));
});

test('world: the shift ends at zero and the screen flips to over', () => {
  const world = createWorld(3);
  startGame(world);
  world.time = 179.9;
  const events = step(world, 0.2, { dx: 0, dy: 0, interact: false });
  assert.ok(events.includes('over'));
  assert.equal(world.screen, 'over');
});

test('scenes: staged shots are deterministic and complete', () => {
  for (const name of ['start', 'rush', 'plate']) {
    const a = createWorld(41);
    const b = createWorld(41);
    stageShot(name, a);
    stageShot(name, b);
    assert.equal(JSON.stringify(a.orders), JSON.stringify(b.orders));
    assert.equal(a.score, b.score);
    assert.equal(a.served, b.served);
    assert.deepEqual(a.plate, b.plate);
    assert.equal(a.timeLeft, b.timeLeft);
  }
  const rush = createWorld(41);
  stageShot('rush', rush);
  assert.ok(rush.plate.length > 0, 'rush shot must have a dish plated and ready');
  assert.ok(rush.wok.items.length > 0, 'rush shot must have a dish mid-cook in the wok');
  assert.ok(rush.orders.length > 0, 'rush shot must show the order board');
  const plate = createWorld(41);
  stageShot('plate', plate);
  assert.ok(plate.plate.length > 0, 'plate shot must have a dish ready to serve');
  const end = createWorld(41);
  stageShot('end', end);
  assert.equal(end.screen, 'over');
});

test('world: nearestStation finds the wok when the chef stands on it', () => {
  const world = createWorld(41);
  world.chef.x = stationById('wok').x;
  world.chef.y = stationById('wok').y;
  assert.equal(nearestStation(world).id, 'wok');
});

test('main.ts: entry program writes game/, screenshots/ and a dossier, twice identically', () => {
  const out1 = join(ROOT, 'out-test-1');
  const out2 = join(ROOT, 'out-test-2');
  for (const out of [out1, out2]) {
    rmSync(out, { recursive: true, force: true });
    const run = spawnSync('node', ['main.ts'], {
      cwd: ROOT,
      env: { ...process.env, MAKEFUN_OUTPUT_DIR: out },
      encoding: 'utf8',
    });
    assert.equal(run.status, 0, run.stderr);
    assert.ok(existsSync(join(out, 'game', 'index.html')));
    assert.ok(existsSync(join(out, 'dossier.json')));
    assert.ok(readdirSync(join(out, 'screenshots')).length >= 3);
  }
  const d1 = readFileSync(join(out1, 'dossier.json'));
  const d2 = readFileSync(join(out2, 'dossier.json'));
  assert.ok(d1.equals(d2), 'two runs must write identical dossier bytes');
  rmSync(out1, { recursive: true, force: true });
  rmSync(out2, { recursive: true, force: true });
});

test('repo: screenshots are within the gate caps', () => {
  const dir = join(ROOT, 'screenshots');
  const files = readdirSync(dir).filter((f) => !f.startsWith('.'));
  assert.ok(files.length >= 3 && files.length <= 4, `expected 3-4 screenshots, got ${files.length}`);
  for (const f of files) {
    const size = statSync(join(dir, f)).size;
    assert.ok(size <= 262144, `${f} is ${size} bytes, over the 256 KiB cap`);
  }
});
