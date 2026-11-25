// Recipes and regulars for Warung 41 Detik.
// The one detail no other entry has: the Telur 41 Detik — Chef Darma's late
// father timed the perfect soft egg at exactly 41 seconds, and the stall
// still cooks it by that count. Serve an egg dish scooped inside the golden
// window and the "Warisan Ayah" bonus triples the dish.

// Ingredient metadata: label shown on tickets, and the colour its dot is
// drawn in on the wok, the plate and the tray.
export const INGREDIENTS = {
  rice: { label: 'Nasi', color: '#f3ead2', ring: '#cbb98a' },
  egg: { label: 'Telur', color: '#ffd94a', ring: '#d9a521' },
  chicken: { label: 'Ayam', color: '#e8a06a', ring: '#b06a35' },
  chilli: { label: 'Cabai', color: '#d84a2f', ring: '#8f2413' },
  kecap: { label: 'Kecap', color: '#6b4423', ring: '#3d2410' },
  veg: { label: 'Sayur', color: '#5da24a', ring: '#2f5c24' },
};

export const DISHES = [
  {
    id: 'nasi-goreng-41',
    name: 'Nasi Goreng 41',
    needs: ['rice', 'egg', 'kecap'],
    price: 120,
    blurb: 'The house signature — wok-tossed, kecap-dark.',
  },
  {
    id: 'telur-41-detik',
    name: 'Telur 41 Detik',
    needs: ['egg', 'kecap'],
    price: 150,
    golden: true,
    blurb: "Ayah's egg: 41 seconds, no more, no less.",
  },
  {
    id: 'ayam-geprek',
    name: 'Ayam Geprek Darma',
    needs: ['chicken', 'chilli', 'rice'],
    price: 130,
    blurb: 'Smashed chilli chicken, Darma style.',
  },
  {
    id: 'nasi-ayam-kecap',
    name: 'Nasi Ayam Kecap',
    needs: ['rice', 'chicken', 'kecap'],
    price: 110,
    blurb: 'Slow-glazed chicken over rice.',
  },
  {
    id: 'tumis-sayur',
    name: 'Tumis Sayur Senja',
    needs: ['veg', 'egg', 'chilli'],
    price: 100,
    blurb: 'Dusk greens, chilli heat, soft egg.',
  },
];

// Regulars order by memory, not by menu number: each ticket carries the
// customer's name and the line they actually say at the hatch.
export const REGULARS = [
  { name: 'Pak Slamet', memory: '"Like 1987 — extra chilli, no rush."' },
  { name: 'Bu Ratna', memory: '"The one my late husband loved."' },
  { name: 'Mbak Sari', memory: '"Rainy Tuesday taste, please."' },
  { name: 'Mas Joko', memory: '"Double egg. I skipped lunch."' },
  { name: 'Nek Minah', memory: '"Soft, soft — my teeth are old."' },
  { name: 'Bang Udin', memory: '"Spiciest you dare, chef."' },
  { name: 'Kak Dewi', memory: '"Same as last night. You remember."' },
  { name: 'Pak RT', memory: '"For the whole ronda patrol."' },
];

export function dishById(id) {
  return DISHES.find((d) => d.id === id) ?? null;
}

// True when the plate's ingredients are exactly a dish's recipe, in any order.
export function matchDish(plateItems) {
  const sorted = plateItems.slice().sort().join(',');
  return DISHES.find((d) => d.needs.slice().sort().join(',') === sorted) ?? null;
}
