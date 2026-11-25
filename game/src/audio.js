// Synthesized sounds for Warung 41 Detik — every sound is a short WebAudio
// blip or filtered noise burst, no audio files, no network. The context is
// created lazily on the first user gesture so the page never autoplays.
let ctx = null;
let sizzleNode = null;

export function ensureAudio() {
  if (ctx) {
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  }
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  } catch {
    ctx = null;
  }
  return ctx;
}

function tone(freq, dur, type = 'sine', gain = 0.12, when = 0) {
  if (!ctx) return;
  const t0 = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(g).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noiseBurst(dur, gain = 0.08, filterFreq = 4000) {
  if (!ctx) return;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = filterFreq;
  const g = ctx.createGain();
  g.gain.value = gain;
  src.connect(filter).connect(g).connect(ctx.destination);
  src.start();
}

// A looping wok sizzle while food cooks; call with true/false.
export function setSizzle(on) {
  if (!ctx) return;
  if (on && !sizzleNode) {
    const len = ctx.sampleRate;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3000;
    const g = ctx.createGain();
    g.gain.value = 0.03;
    src.connect(filter).connect(g).connect(ctx.destination);
    src.start();
    sizzleNode = { src, g };
  } else if (!on && sizzleNode) {
    try {
      sizzleNode.g.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
      sizzleNode.src.stop(ctx.currentTime + 0.3);
    } catch {
      /* already stopped */
    }
    sizzleNode = null;
  }
}

export function playEvent(name) {
  if (!ctx) return;
  switch (name) {
    case 'pickup':
      tone(520, 0.08, 'triangle', 0.1);
      break;
    case 'drop':
      noiseBurst(0.25, 0.12, 3500);
      tone(180, 0.15, 'sine', 0.08);
      break;
    case 'scoop':
      tone(660, 0.1, 'triangle', 0.1);
      tone(880, 0.12, 'triangle', 0.08, 0.08);
      break;
    case 'done':
      tone(740, 0.12, 'sine', 0.1);
      tone(988, 0.16, 'sine', 0.1, 0.1);
      break;
    case 'serve':
      tone(523, 0.12, 'triangle', 0.12);
      tone(659, 0.12, 'triangle', 0.12, 0.1);
      tone(784, 0.2, 'triangle', 0.12, 0.2);
      break;
    case 'burnt':
    case 'burn':
      tone(140, 0.3, 'sawtooth', 0.1);
      tone(110, 0.35, 'sawtooth', 0.08, 0.12);
      break;
    case 'expire':
      tone(330, 0.2, 'sine', 0.1);
      tone(247, 0.3, 'sine', 0.1, 0.15);
      break;
    case 'tick':
      tone(980, 0.05, 'square', 0.05);
      break;
    case 'deny':
      tone(200, 0.09, 'square', 0.06);
      break;
    case 'ready':
      tone(587, 0.1, 'triangle', 0.1);
      tone(880, 0.14, 'triangle', 0.09, 0.08);
      break;
    case 'over':
      tone(392, 0.25, 'triangle', 0.1);
      tone(330, 0.25, 'triangle', 0.1, 0.2);
      tone(262, 0.4, 'triangle', 0.1, 0.4);
      break;
    default:
      break;
  }
}
