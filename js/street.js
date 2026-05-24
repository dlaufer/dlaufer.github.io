// ─── Street & Sidewalk ─────────────────────────────────────────────────────────
// Road (dark asphalt with dashed centre line) and the sidewalk strip above it.
// Both scroll at ROAD_SPEED / SW_SPEED (1.0×) — the "ground truth" speed that
// the character's walk pace is measured against.

/**
 * Build road dashes and sidewalk marks. Two copies of each are placed so the
 * seamless tile always has content offscreen ready to scroll into view.
 *
 * @param {HTMLElement} roadInnerEl
 * @param {HTMLElement} swInnerEl
 * @param {HTMLElement} sidewalkEl
 * @param {HTMLElement} roadEl
 * @param {number} H - Viewport height in px
 */
function buildStreet(roadInnerEl, swInnerEl, sidewalkEl, roadEl, H) {
  roadInnerEl.innerHTML = '';
  swInnerEl.innerHTML   = '';

  // Road dashes — dash width 48, gap 32, period 80 × 48 dashes = 3840 (ROAD_W)
  for (let copy = 0; copy < 2; copy++) {
    for (let i = 0; i < 48; i++) {
      const d = document.createElement('div');
      d.className = 'dash';
      d.style.left  = (copy * ROAD_W + i * 80) + 'px';
      d.style.width = '48px';
      roadInnerEl.appendChild(d);
    }
  }
  roadInnerEl.style.width = (ROAD_W * 2) + 'px';

  // Sidewalk marks — same period as road
  for (let copy = 0; copy < 2; copy++) {
    for (let i = 0; i < 48; i++) {
      const m = document.createElement('div');
      m.className   = 'sw-mark';
      m.style.left  = (copy * SW_W + i * 80 + 8) + 'px';
      m.style.width = '32px';
      swInnerEl.appendChild(m);
    }
  }
  swInnerEl.style.width = (SW_W * 2) + 'px';

  layoutStreet(sidewalkEl, roadEl, roadInnerEl, swInnerEl, H);
}

/**
 * Position road and sidewalk elements for the current viewport.
 * Also scales the road-dash height and sidewalk-mark height proportionally.
 *
 * @param {HTMLElement} sidewalkEl
 * @param {HTMLElement} roadEl
 * @param {HTMLElement} roadInnerEl
 * @param {HTMLElement} swInnerEl
 * @param {number} H
 */
function layoutStreet(sidewalkEl, roadEl, roadInnerEl, swInnerEl, H) {
  const swBottom = Math.round(H * SW_BOTTOM_FRAC);
  const swHeight = Math.round(H * SW_HEIGHT_FRAC);
  const roadH    = Math.round(H * ROAD_HEIGHT_FRAC);

  sidewalkEl.style.bottom = swBottom + 'px';
  sidewalkEl.style.height = swHeight + 'px';
  roadEl.style.height     = roadH    + 'px';

  // Road dash height
  const dashH = Math.max(4, Math.round(roadH * 0.10));
  roadInnerEl.style.top    = Math.round(roadH * 0.50) + 'px';
  roadInnerEl.style.height = dashH + 'px';
  roadInnerEl.querySelectorAll('.dash').forEach(d => {
    d.style.height = dashH + 'px';
  });

  // Sidewalk mark height
  const markH = Math.max(3, Math.round(swHeight * 0.40));
  swInnerEl.querySelectorAll('.sw-mark').forEach(m => {
    m.style.height = markH + 'px';
    m.style.top    = Math.round((swHeight - markH) / 2) + 'px';
  });
}

/**
 * Apply scroll transforms for the road and sidewalk layers each frame.
 * @param {HTMLElement} roadInnerEl
 * @param {HTMLElement} swInnerEl
 * @param {number} worldX
 */
function scrollStreet(roadInnerEl, swInnerEl, worldX) {
  roadInnerEl.style.transform = `translateX(${layerX(worldX, ROAD_SPEED, ROAD_W)}px)`;
  swInnerEl.style.transform   = `translateX(${layerX(worldX, SW_SPEED,   SW_W)}px)`;
}
