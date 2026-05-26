// ─── Proximity & Entry ─────────────────────────────────────────────────────────
// Each frame, checks whether the character is standing in front of an enterable
// building door. If so, shows an entry prompt and listens for the "enter" input.
//
// How the math works:
//   The mid-building layer scrolls at MID_SPEED. A building's door sits at
//   doorWorldX within the tile. After applying the seamless-tile transform,
//   its current screen X is:
//
//     screenX = layerX(worldX, MID_SPEED, MID_W) + doorWorldX
//
//   But since the inner div can be on either tile copy, we also check the
//   position offset by MID_W. The character is always at screen center (W/2).
//   We pick whichever copy is closest to center.

// ─── Prompt element ────────────────────────────────────────────────────────────
// Created once, shown/hidden as needed. Floats above the door on screen.

let promptEl    = null;
let currentUrl  = null;   // URL of the building currently in range
let entryLocked = false;  // prevents double-navigation on held key

function initProximity(wrapEl) {
  promptEl = document.createElement('div');
  promptEl.id = 'entry-prompt';
  promptEl.style.cssText = `
    display:          none;
    position:         absolute;
    z-index:          30;
    transform:        translateX(-50%);
    background:       rgba(0,0,0,0.72);
    color:            #fff;
    font-family:      monospace;
    border:           2px solid #fff;
    border-radius:    4px;
    padding:          4px 10px;
    white-space:      nowrap;
    pointer-events:   none;
    letter-spacing:   1px;
    text-shadow:      1px 1px 0 #000;
  `;
  wrapEl.appendChild(promptEl);

  // ── Keyboard: Up arrow or Enter ──────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if ((e.key === 'ArrowUp' || e.key === 'Enter') && currentUrl) {
      e.preventDefault();
      navigate(currentUrl);
    }
  });

  // ── Mobile: tap the prompt itself (pointer-events re-enabled below) ──────
  promptEl.style.pointerEvents = 'auto';
  promptEl.addEventListener('click', () => {
    if (currentUrl) navigate(currentUrl);
  });
  promptEl.addEventListener('touchstart', e => {
    e.preventDefault();
    if (currentUrl) navigate(currentUrl);
  }, { passive: false });
}

/**
 * Navigate to a building's page.
 * Swap this for a router call (e.g. window.location.href) if needed.
 */
function navigate(url) {
  if (entryLocked) return;
  entryLocked = true;
  window.location.href = url;
}

/**
 * Called every frame from main.js.
 * Finds the closest enterable door to screen center and updates the prompt.
 *
 * @param {number} worldX      - current raw world scroll offset
 * @param {number} screenW     - viewport width
 * @param {number} screenH     - viewport height
 * @param {number} promptBottomY - px from top where the prompt sits (above sidewalk)
 */
function updateProximity(worldX, screenW, screenH, promptBottomY) {
  const center    = screenW / 2;
  const baseShift = layerX(worldX, MID_SPEED, MID_W); // current layer translateX

  let closest     = null;
  let closestDist = Infinity;

  enterableBuildings.forEach(b => {
    // Check both tile copies — pick the one nearer to screen center
    [0, MID_W].forEach(tileOffset => {
      const screenX = baseShift + b.doorWorldX + tileOffset;
      const dist    = Math.abs(screenX - center);
      if (dist < closestDist) {
        closestDist = dist;
        closest     = { ...b, screenX };
      }
    });
  });

  if (closest && closestDist < ENTRY_THRESHOLD) {
    currentUrl = closest.url;
    entryLocked = false;

    promptEl.textContent  = `[ ↑ ENTER ${closest.label} ]`;
    promptEl.style.display = 'block';
    promptEl.style.left    = closest.screenX + 'px';
    promptEl.style.bottom  = promptBottomY   + 'px';
    promptEl.style.fontSize= Math.max(9, Math.round(screenH / 52)) + 'px';
  } else {
    currentUrl             = null;
    promptEl.style.display = 'none';
  }
}
