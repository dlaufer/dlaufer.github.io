// ─── Foreground props ──────────────────────────────────────────────────────────
// Street-level objects that sit in front of the character — lampposts, etc.
// Scrolls at FG_SPEED (1.10×), slightly faster than the ground, for a subtle
// foreground-depth effect.

const LAMPPOST_SPACING = 120; // px between lampposts
const LAMPPOST_COUNT   = 24;  // per tile (24 × 120 = 2880 = FG_W)

/**
 * Create a single lamppost element.
 * @returns {HTMLElement}
 */
function createLamppost(leftPx) {
  const lp = document.createElement('div');
  lp.className  = 'lamppost';
  lp.style.left = leftPx + 'px';
  lp.innerHTML  = `
    <div class="arm"   style="top:4px;left:2px;width:6px;height:3px;"></div>
    <div class="light" style="width:16px;height:8px;"></div>
    <div class="pole"  style="width:4px;height:36px;"></div>
  `;
  return lp;
}

/**
 * Build two copies of the lamppost strip into fgInnerEl.
 * @param {HTMLElement} fgInnerEl
 * @param {HTMLElement} fgWrapEl
 * @param {number} H
 */
function buildForeground(fgInnerEl, fgWrapEl, H) {
  fgInnerEl.innerHTML = '';

  for (let copy = 0; copy < 2; copy++) {
    for (let i = 0; i < LAMPPOST_COUNT; i++) {
      const x = copy * FG_W + i * LAMPPOST_SPACING + 40;
      fgInnerEl.appendChild(createLamppost(x));
    }
  }

  fgInnerEl.style.width = (FG_W * 2) + 'px';
  layoutForeground(fgWrapEl, H);
}

/**
 * Position the wrapper for the current viewport height.
 * The foreground sits at the top of the sidewalk.
 * @param {HTMLElement} fgWrapEl
 * @param {number} H
 */
function layoutForeground(fgWrapEl, H) {
  fgWrapEl.style.bottom = Math.round(H * SW_BOTTOM_FRAC) + 'px';
  fgWrapEl.style.height = Math.round(H * 0.10) + 'px';
}

/**
 * Apply the scroll transform for this frame.
 * @param {HTMLElement} fgInnerEl
 * @param {number} worldX
 */
function scrollForeground(fgInnerEl, worldX) {
  fgInnerEl.style.transform = `translateX(${layerX(worldX, FG_SPEED, FG_W)}px)`;
}
