// Keyboard and mouse input for Warung 41 Detik.
// WASD / arrows move the chef; E or Space interacts; a mouse click sets a
// walk target and auto-interacts on arrival, so the game plays fully by
// mouse alone too. R restarts from the game-over screen.
export function createInput() {
  return {
    keys: new Set(),
    click: null, // { x, y } in canvas pixels, consumed by main.js
    interactPressed: false,
    startPressed: false,
    restartPressed: false,
  };
}

export function attachInput(input, canvas) {
  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
      event.preventDefault();
    }
    if (event.repeat) return;
    input.keys.add(key);
    if (key === 'e' || key === ' ') input.interactPressed = true;
    if (key === 'enter') input.startPressed = true;
    if (key === 'r') input.restartPressed = true;
  });
  window.addEventListener('keyup', (event) => {
    input.keys.delete(event.key.toLowerCase());
  });
  canvas.addEventListener('mousedown', (event) => {
    const rect = canvas.getBoundingClientRect();
    input.click = {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  });
  window.addEventListener('blur', () => input.keys.clear());
}

// Direction vector from the held movement keys.
export function moveVector(input) {
  let dx = 0;
  let dy = 0;
  if (input.keys.has('a') || input.keys.has('arrowleft')) dx -= 1;
  if (input.keys.has('d') || input.keys.has('arrowright')) dx += 1;
  if (input.keys.has('w') || input.keys.has('arrowup')) dy -= 1;
  if (input.keys.has('s') || input.keys.has('arrowdown')) dy += 1;
  return { dx, dy };
}
