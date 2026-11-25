// Entry point for Warung 41 Detik. Owns the animation loop, wires keyboard
// and mouse input into world.step, plays sounds for world events, and stages
// the deterministic screenshot scenes behind ?shot=start|rush|plate|end.
import { VIEW, stationById } from './config.js';
import { attachInput, createInput, moveVector } from './input.js';
import { render } from './render.js';
import { stageShot } from './scenes.js';
import { SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE, createWorld, restart, startGame, step } from './world.js';
import { ensureAudio, playEvent, setSizzle } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = VIEW.width;
canvas.height = VIEW.height;

const params = new URLSearchParams(window.location.search);
const seed = Number(params.get('seed') || 41);
const shot = params.get('shot');
const world = createWorld(seed);
const input = createInput();
attachInput(input, canvas);

let shotMode = false;
if (shot) {
  shotMode = true;
  const staged = stageShot(shot, world);
  world.screen = staged.screen;
}

let moveTarget = null;
let last = performance.now();
let t = 0;

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  t += dt;

  if (!shotMode) {
    if (world.screen === SCREEN_TITLE) {
      if (input.startPressed || input.click) {
        ensureAudio();
        startGame(world);
      }
    } else if (world.screen === SCREEN_OVER) {
      if (input.restartPressed || input.click) {
        ensureAudio();
        restart(world);
      }
    } else {
      // Keyboard movement wins over a click target.
      const kv = moveVector(input);
      let dx = kv.dx;
      let dy = kv.dy;
      if (dx === 0 && dy === 0 && moveTarget) {
        const mdx = moveTarget.x - world.chef.x;
        const mdy = moveTarget.y - world.chef.y;
        const len = Math.hypot(mdx, mdy);
        if (len < 10) {
          moveTarget = null;
        } else {
          dx = mdx / len;
          dy = mdy / len;
        }
      } else if (dx !== 0 || dy !== 0) {
        moveTarget = null;
      }
      if (input.click) {
        ensureAudio();
        moveTarget = { x: input.click.x, y: input.click.y };
        input.click = null;
      }
      const interact = input.interactPressed;
      input.interactPressed = false;
      const events = step(world, dt, { dx, dy, interact });
      for (const event of events) playEvent(event);
      setSizzle(world.wok.items.length > 0 && world.screen === SCREEN_PLAY);
      // Arrived at a clicked station: interact once, automatically.
      if (moveTarget && world.screen === SCREEN_PLAY) {
        const d = Math.hypot(moveTarget.x - world.chef.x, moveTarget.y - world.chef.y);
        if (d < 12) {
          const ev = step(world, dt, { dx: 0, dy: 0, interact: true });
          for (const event of ev) playEvent(event);
          moveTarget = null;
        }
      }
    }
    input.startPressed = false;
    input.restartPressed = false;
    input.click = null;
  }

  render(ctx, world, t);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
