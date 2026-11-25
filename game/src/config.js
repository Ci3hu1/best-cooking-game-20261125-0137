// Tuning constants for Warung 41 Detik — Chef Darma's midnight wok stall.
// One file, one job: every number the game balances on lives here.
export const VIEW = { width: 1280, height: 720 };
export const SHIFT_SECONDS = 180;
export const TRAY_MAX = 3;
export const WOK_DONE = 100; // cook progress at which food is ready
export const WOK_BURNT = 150; // cook progress at which food burns
export const WOK_COOK_RATE = 17; // progress per second in the wok
export const PERFECT_LOW = 95; // golden window for the 41-second egg
export const PERFECT_HIGH = 120;
export const ORDER_MAX = 3;
export const ORDER_SPAWN_SECONDS = 18;
export const ORDER_PATIENCE_SECONDS = 50;
export const CHEF_SPEED = 280;
export const CHEF_RADIUS = 22;

// Floor the chef can walk on (below the order board, inside the walls).
export const FLOOR = { x: 36, y: 196, w: 1208, h: 496 };

// Stations: id, label, ingredient it gives (null for work stations),
// centre + interaction radius, and the colour the counter is drawn in.
export const STATIONS = [
  { id: 'rice', label: 'NASI', sub: 'Rice pot', ingredient: 'rice', x: 130, y: 252, r: 78, color: '#e8dcc0' },
  { id: 'egg', label: 'TELUR', sub: 'Egg basket', ingredient: 'egg', x: 320, y: 252, r: 78, color: '#f6e3a1' },
  { id: 'chicken', label: 'AYAM', sub: 'Chicken', ingredient: 'chicken', x: 510, y: 252, r: 78, color: '#e8a06a' },
  { id: 'chilli', label: 'CABAI', sub: 'Chilli', ingredient: 'chilli', x: 700, y: 252, r: 78, color: '#d84a2f' },
  { id: 'kecap', label: 'KECAP', sub: 'Sweet soy', ingredient: 'kecap', x: 890, y: 252, r: 78, color: '#5a3a22' },
  { id: 'veg', label: 'SAYUR', sub: 'Greens', ingredient: 'veg', x: 1080, y: 252, r: 78, color: '#5da24a' },
  { id: 'wok', label: 'WOK', sub: 'Fire — E to cook', ingredient: null, x: 320, y: 520, r: 96, color: '#3a3f4a' },
  { id: 'plate', label: 'PIRING', sub: 'Assembly plate', ingredient: null, x: 700, y: 520, r: 96, color: '#f2ede2' },
  { id: 'hatch', label: 'SAJIKAN', sub: 'Serve hatch', ingredient: null, x: 1080, y: 520, r: 96, color: '#c98a2e' },
  { id: 'bin', label: 'BIN', sub: 'Throw away', ingredient: null, x: 130, y: 640, r: 56, color: '#6b7280' },
];

export function stationById(id) {
  return STATIONS.find((s) => s.id === id) ?? null;
}
