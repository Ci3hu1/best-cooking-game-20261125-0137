// All canvas drawing for Warung 41 Detik. Procedural art only — every pixel
// is drawn from the game's own code, no image files. The frame is built to
// read at a glance when shrunk: a warm kitchen, a white order board, big
// station labels, a large timer, and the plate glowing when a dish is ready.
import { FLOOR, STATIONS, VIEW, stationById } from './config.js';
import { INGREDIENTS, dishById } from './recipes.js';
import { SCREEN_OVER, SCREEN_TITLE, nearestStation } from './world.js';

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function text(ctx, str, x, y, size, color, weight = 'bold', align = 'left') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

// One ingredient drawn as a small pictogram, used on tickets, tray, wok,
// plate and station counters alike.
export function drawIngredient(ctx, key, x, y, r) {
  const ing = INGREDIENTS[key];
  if (!ing) return;
  ctx.save();
  ctx.translate(x, y);
  if (key === 'rice') {
    ctx.fillStyle = '#f3ead2';
    ctx.beginPath();
    ctx.arc(0, 2, r, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = '#c98a2e';
    ctx.fillRect(-r, 0, r * 2, 3);
    ctx.fillStyle = '#fff8e6';
    for (let i = -1; i <= 1; i += 1) {
      ctx.beginPath();
      ctx.arc(i * r * 0.5, -r * 0.45, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (key === 'egg') {
    ctx.fillStyle = '#fff6d8';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.85, r * 1.05, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd94a';
    ctx.beginPath();
    ctx.arc(r * 0.15, r * 0.1, r * 0.45, 0, Math.PI * 2);
    ctx.fill();
  } else if (key === 'chicken') {
    ctx.fillStyle = '#e8a06a';
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.15, r * 0.8, r * 0.65, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f3ead2';
    ctx.lineWidth = r * 0.22;
    ctx.beginPath();
    ctx.moveTo(r * 0.55, r * 0.35);
    ctx.lineTo(r * 0.95, r * 0.85);
    ctx.stroke();
  } else if (key === 'chilli') {
    ctx.fillStyle = '#d84a2f';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.95, r * 0.42, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2f5c24';
    ctx.lineWidth = r * 0.2;
    ctx.beginPath();
    ctx.moveTo(-r * 0.8, -r * 0.35);
    ctx.quadraticCurveTo(-r * 1.2, -r * 0.7, -r * 1.05, -r * 0.95);
    ctx.stroke();
  } else if (key === 'kecap') {
    ctx.fillStyle = '#6b4423';
    rr(ctx, -r * 0.45, -r * 0.7, r * 0.9, r * 1.5, r * 0.25);
    ctx.fill();
    ctx.fillStyle = '#d84a2f';
    rr(ctx, -r * 0.45, -r * 0.7, r * 0.9, r * 0.4, r * 0.2);
    ctx.fill();
    ctx.fillStyle = '#f3ead2';
    ctx.fillRect(-r * 0.45, -r * 0.1, r * 0.9, r * 0.45);
  } else if (key === 'veg') {
    ctx.fillStyle = '#5da24a';
    for (let i = 0; i < 3; i += 1) {
      const a = -0.6 + i * 0.6;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * r * 0.4, Math.sin(a) * r * 0.4, r * 0.55, r * 0.3, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#7ec96a';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawStation(ctx, world, station, t) {
  const x = station.x;
  const y = station.y;
  const near = nearestStation(world) === station && world.screen === 'play';
  // Counter body.
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  rr(ctx, x - 78, y - 34 + 6, 156, 76, 12);
  ctx.fill();
  ctx.fillStyle = station.id === 'wok' ? '#3a3f4a' : '#8a5a33';
  rr(ctx, x - 78, y - 34, 156, 76, 12);
  ctx.fill();
  ctx.fillStyle = station.id === 'wok' ? '#2c3038' : '#a06a3e';
  ctx.fillRect(x - 78, y - 34, 156, 12);
  if (near) {
    ctx.strokeStyle = '#ffd94a';
    ctx.lineWidth = 4;
    rr(ctx, x - 82, y - 38, 164, 84, 14);
    ctx.stroke();
  }
  if (station.ingredient) {
    drawIngredient(ctx, station.ingredient, x, y - 2, 22);
  } else if (station.id === 'wok') {
    // Flame under the wok, flickering with time.
    const flick = 1 + Math.sin(t * 9) * 0.12;
    ctx.fillStyle = '#ff7a1a';
    ctx.beginPath();
    ctx.ellipse(x, y + 22, 46 * flick, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffc93a';
    ctx.beginPath();
    ctx.ellipse(x, y + 20, 30 * flick, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Wok bowl with its contents.
    ctx.fillStyle = '#20242c';
    ctx.beginPath();
    ctx.ellipse(x, y - 6, 62, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#31363f';
    ctx.beginPath();
    ctx.ellipse(x, y - 10, 54, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    world.wok.items.forEach((key, i) => {
      const a = (i / Math.max(1, world.wok.items.length)) * Math.PI * 2;
      drawIngredient(ctx, key, x + Math.cos(a) * 26, y - 10 + Math.sin(a) * 10, 11);
    });
    if (world.wok.items.length > 0) {
      const p = world.wok.progress;
      const burnt = p >= 150;
      const done = p >= 100;
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      rr(ctx, x - 52, y + 38, 104, 12, 6);
      ctx.fill();
      ctx.fillStyle = burnt ? '#d84a2f' : done ? '#5da24a' : '#ffc93a';
      rr(ctx, x - 50, y + 40, Math.min(100, p) * 1.0, 8, 4);
      ctx.fill();
      text(ctx, burnt ? 'BURNT!' : done ? 'READY!' : `${Math.floor(p)}%`, x + 60, y + 44, 12, burnt ? '#ff8a70' : '#ffd94a', 'bold', 'left');
    }
  } else if (station.id === 'plate') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(x, y - 2, 56, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d8cdb4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y - 2, 44, 14, 0, 0, Math.PI * 2);
    ctx.stroke();
    world.plate.forEach((key, i) => {
      const a = (i / Math.max(1, world.plate.length)) * Math.PI * 2;
      drawIngredient(ctx, key, x + Math.cos(a) * 20, y - 2 + Math.sin(a) * 7, 10);
    });
  } else if (station.id === 'hatch') {
    ctx.fillStyle = '#f2ede2';
    rr(ctx, x - 56, y - 22, 112, 44, 8);
    ctx.fill();
    ctx.fillStyle = '#c98a2e';
    text(ctx, 'PICK UP', x, y, 15, '#5a3a22', 'bold', 'center');
  } else if (station.id === 'bin') {
    ctx.fillStyle = '#4b5563';
    rr(ctx, x - 26, y - 20, 52, 44, 6);
    ctx.fill();
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(x - 30, y - 26, 60, 8);
  }
  text(ctx, station.label, x, y + 52, 15, '#ffe9b0', 'bold', 'center');
  text(ctx, station.sub, x, y + 68, 11, '#c9b48a', 'normal', 'center');
}

function drawTickets(ctx, world) {
  const x0 = 48;
  const y0 = 88;
  const w = 372;
  const h = 104;
  const gap = 12;
  text(ctx, 'ORDER BOARD', x0, y0 - 9, 14, '#ffd94a', 'bold');
  world.orders.forEach((order, i) => {
    const dish = dishById(order.dishId);
    const x = x0 + i * (w + gap);
    const y = y0;
    const urgent = order.patience < 15;
    ctx.fillStyle = urgent ? '#5a1f16' : '#fff8e6';
    rr(ctx, x, y, w, h, 10);
    ctx.fill();
    ctx.strokeStyle = urgent ? '#d84a2f' : '#c9b48a';
    ctx.lineWidth = urgent ? 3 : 2;
    rr(ctx, x, y, w, h, 10);
    ctx.stroke();
    text(ctx, `#${order.id}  ${dish.name}`, x + 12, y + 20, 17, '#2b2118');
    text(ctx, `${order.customer} — ${order.memory}`, x + 12, y + 42, 11.5, '#6b5a44', 'normal');
    dish.needs.forEach((key, j) => {
      drawIngredient(ctx, key, x + 24 + j * 34, y + 72, 12);
      text(ctx, INGREDIENTS[key].label, x + 24 + j * 34, y + 94, 10, '#6b5a44', 'normal', 'center');
    });
    // Patience bar.
    const pw = 150;
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    rr(ctx, x + w - pw - 12, y + 62, pw, 10, 5);
    ctx.fill();
    ctx.fillStyle = urgent ? '#d84a2f' : '#5da24a';
    rr(ctx, x + w - pw - 12, y + 62, pw * Math.max(0, order.patience / order.maxPatience), 10, 5);
    ctx.fill();
    text(ctx, `${Math.ceil(order.patience)}s`, x + w - 12, y + 88, 12, urgent ? '#d84a2f' : '#6b5a44', 'bold', 'right');
  });
  if (world.orders.length === 0) {
    text(ctx, 'No orders — breathe, chef.', x0 + 8, y0 + 50, 15, '#ffe9b0', 'normal');
  }
}

function drawChef(ctx, world, t) {
  const { x, y } = world.chef;
  // Shadow.
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(x, y + 20, 24, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // Body (white apron) and head.
  ctx.fillStyle = '#f2ede2';
  ctx.beginPath();
  ctx.arc(x, y + 6, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c98a2e';
  ctx.fillRect(x - 20, y + 2, 40, 6);
  ctx.fillStyle = '#f0c08a';
  ctx.beginPath();
  ctx.arc(x, y - 16, 14, 0, Math.PI * 2);
  ctx.fill();
  // Chef hat.
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x - 9, y - 28, 8, 0, Math.PI * 2);
  ctx.arc(x, y - 32, 9, 0, Math.PI * 2);
  ctx.arc(x + 9, y - 28, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x - 14, y - 28, 28, 6);
  // Eyes.
  ctx.fillStyle = '#2b2118';
  ctx.beginPath();
  ctx.arc(x - 5, y - 16, 1.8, 0, Math.PI * 2);
  ctx.arc(x + 5, y - 16, 1.8, 0, Math.PI * 2);
  ctx.fill();
  // Tray items above the hat.
  world.tray.forEach((key, i) => {
    drawIngredient(ctx, key, x - (world.tray.length - 1) * 14 + i * 28, y - 48, 11);
  });
  // Interaction prompt.
  const station = nearestStation(world);
  if (station && world.screen === 'play') {
    const label = station.ingredient
      ? `E — take ${station.label.toLowerCase()}`
      : station.id === 'wok'
        ? world.tray.length > 0
          ? 'E — drop into wok'
          : world.wok.items.length > 0 && world.wok.progress >= 100
            ? 'E — scoop to plate'
            : 'E — wok'
        : station.id === 'hatch'
          ? 'E — serve!'
          : `E — ${station.label.toLowerCase()}`;
    ctx.fillStyle = 'rgba(20,16,10,0.85)';
    const w = ctx.measureText(label).width + 120;
    rr(ctx, x - 90, y - 88, 180, 26, 13);
    ctx.fill();
    ctx.fillStyle = '#ffd94a';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y - 75);
  }
}

function drawTopBar(ctx, world) {
  ctx.fillStyle = '#241a12';
  ctx.fillRect(0, 0, VIEW.width, 64);
  ctx.fillStyle = '#c98a2e';
  ctx.fillRect(0, 64, VIEW.width, 4);
  text(ctx, 'WARUNG 41 DETIK', 24, 24, 24, '#ffd94a');
  text(ctx, "Chef Darma's midnight wok — the 41-second egg", 24, 48, 12, '#c9b48a', 'normal');
  // Shift timer, big in the centre.
  const mm = Math.floor(world.timeLeft / 60);
  const ss = Math.floor(world.timeLeft % 60).toString().padStart(2, '0');
  const low = world.timeLeft <= 30 && world.screen === 'play';
  text(ctx, `${mm}:${ss}`, 640, 30, 34, low ? '#ff6a4a' : '#ffffff', 'bold', 'center');
  text(ctx, low ? 'LAST ORDERS!' : 'SHIFT TIMER', 640, 54, 11, low ? '#ff8a70' : '#c9b48a', 'bold', 'center');
  text(ctx, `SCORE ${world.score}`, 1256, 22, 18, '#ffffff', 'bold', 'right');
  text(ctx, `Rp ${world.coins.toLocaleString('id-ID')}  •  served ${world.served}  •  combo x${world.combo}`, 1256, 46, 12, '#c9b48a', 'normal', 'right');
}

function drawPlateReady(ctx, world, t) {
  if (world.plate.length === 0) return;
  const dish = dishById((world.orders.find((o) => {
    const d = dishById(o.dishId);
    return d && d.needs.slice().sort().join(',') === world.plate.slice().sort().join(',');
  }) || {}).dishId);
  if (!dish) return;
  const plate = stationById('plate');
  const pulse = 0.6 + Math.sin(t * 5) * 0.4;
  ctx.strokeStyle = `rgba(255,217,74,${0.5 + pulse * 0.5})`;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(plate.x, plate.y - 2, 78, 34, 0, 0, Math.PI * 2);
  ctx.stroke();
  text(ctx, `${dish.name.toUpperCase()} — READY TO SERVE!`, plate.x, plate.y - 78, 16, '#ffd94a', 'bold', 'center');
}

export function render(ctx, world, t) {
  // Kitchen walls and floor.
  ctx.fillStyle = '#3d2b1f';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  ctx.fillStyle = '#5a4030';
  for (let x = 0; x < VIEW.width; x += 64) {
    ctx.fillRect(x, FLOOR.y, 2, FLOOR.h);
  }
  ctx.fillStyle = '#6b4f38';
  for (let y = FLOOR.y; y < FLOOR.y + FLOOR.h; y += 64) {
    ctx.fillRect(FLOOR.x, y, FLOOR.w, 2);
  }
  // Warm wall band above the floor with hanging lamps.
  ctx.fillStyle = '#2e2015';
  ctx.fillRect(0, 68, VIEW.width, 8);
  for (let x = 90; x < VIEW.width; x += 180) {
    ctx.strokeStyle = '#8a6a45';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 76);
    ctx.lineTo(x, 96);
    ctx.stroke();
    ctx.fillStyle = '#ffd94a';
    ctx.beginPath();
    ctx.arc(x, 102, 7 + Math.sin(t * 3 + x) * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
  text(ctx, 'PASAR SENJA — STALL 41', 1256, 206, 12, '#8a6a45', 'bold', 'right');

  drawTopBar(ctx, world);
  drawTickets(ctx, world);
  for (const station of STATIONS) drawStation(ctx, world, station, t);
  drawPlateReady(ctx, world, t);
  drawChef(ctx, world, t);

  // Toast message.
  if (world.messageT > 0 && world.screen === 'play') {
    ctx.fillStyle = 'rgba(20,16,10,0.88)';
    const w = Math.min(760, ctx.measureText(world.message).width + 140);
    rr(ctx, 640 - w / 2, 668, w, 34, 17);
    ctx.fill();
    ctx.fillStyle = '#ffe9b0';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(world.message, 640, 686);
  }

  if (world.screen === SCREEN_TITLE) {
    ctx.fillStyle = 'rgba(16,10,6,0.72)';
    ctx.fillRect(0, 0, VIEW.width, VIEW.height);
    text(ctx, 'WARUNG 41 DETIK', 640, 210, 64, '#ffd94a', 'bold', 'center');
    text(ctx, "Chef Darma's midnight wok stall — open 41 minutes a night", 640, 268, 20, '#ffe9b0', 'normal', 'center');
    text(ctx, 'Cook the orders on the board. Mind the flame: the Telur 41 Detik', 640, 320, 17, '#ffffff', 'normal', 'center');
    text(ctx, 'must be scooped inside its golden window — serve it perfect and', 640, 346, 17, '#ffffff', 'normal', 'center');
    text(ctx, "the Warisan Ayah bonus triples the dish.", 640, 372, 17, '#ffffff', 'normal', 'center');
    text(ctx, 'WASD / arrows — walk      E / click — cook, plate, serve      R — restart', 640, 430, 16, '#c9b48a', 'normal', 'center');
    const blink = Math.sin(t * 4) > -0.2;
    if (blink) text(ctx, 'Press ENTER or click to start the shift', 640, 500, 22, '#ffd94a', 'bold', 'center');
    text(ctx, 'A complete cooking game: kitchen, order board, counter, wok, plate, timer.', 640, 560, 13, '#8a6a45', 'normal', 'center');
  }

  if (world.screen === SCREEN_OVER) {
    ctx.fillStyle = 'rgba(16,10,6,0.78)';
    ctx.fillRect(0, 0, VIEW.width, VIEW.height);
    text(ctx, 'SHIFT OVER', 640, 200, 56, '#ffd94a', 'bold', 'center');
    text(ctx, 'The wok cools. The last regular walks home happy.', 640, 252, 18, '#ffe9b0', 'normal', 'center');
    text(ctx, `SCORE  ${world.score}`, 640, 330, 30, '#ffffff', 'bold', 'center');
    text(ctx, `Dishes served: ${world.served}    •    Best combo: x${world.bestCombo}    •    Perfect 41s eggs: ${world.perfects}`, 640, 380, 17, '#ffffff', 'normal', 'center');
    text(ctx, `Tips lost: ${world.fails}    •    Earned: Rp ${world.coins.toLocaleString('id-ID')}`, 640, 412, 17, '#c9b48a', 'normal', 'center');
    text(ctx, 'Press R to cook another shift', 640, 480, 20, '#ffd94a', 'bold', 'center');
  }
}
