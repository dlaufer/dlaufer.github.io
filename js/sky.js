// ─── Sky ───────────────────────────────────────────────────────────────────────
// Static sky backdrop with clouds that drift slowly and independently of the
// character's movement. Clouds scroll on their own timer using a separate
// inner div so the same seamless-tile math from scroll.js applies cleanly.

const CLOUD_SPEED = 0.08;  // px per frame — tweak for faster/slower drift
const CLOUD_W     = 3200;  // tile width for the cloud strip (must be wide
                            // enough that no seam is ever on screen at once)

// Cloud layout — positions as fractions of sky width (x) and sky height (y)
const cloudData = [
  { x: 0.03,  y: 0.08, w: 0.050, h: 0.060 },
  { x: 0.05,  y: 0.06, w: 0.030, h: 0.080 },
  { x: 0.06,  y: 0.10, w: 0.020, h: 0.050 },
  { x: 0.18,  y: 0.18, w: 0.060, h: 0.060 },
  { x: 0.20,  y: 0.14, w: 0.035, h: 0.080 },
  { x: 0.34,  y: 0.06, w: 0.040, h: 0.060 },
  { x: 0.36,  y: 0.05, w: 0.025, h: 0.080 },
  { x: 0.50,  y: 0.20, w: 0.055, h: 0.050 },
  { x: 0.60,  y: 0.12, w: 0.040, h: 0.060 },
  { x: 0.64,  y: 0.08, w: 0.025, h: 0.070 },
  { x: 0.74,  y: 0.16, w: 0.050, h: 0.050 },
  { x: 0.78,  y: 0.06, w: 0.030, h: 0.080 },
  { x: 0.88,  y: 0.10, w: 0.045, h: 0.055 },
  { x: 0.92,  y: 0.18, w: 0.028, h: 0.060 },
];

/**
 * Build the sky element, creating a cloud-inner strip with two tiled copies.
 * Returns the inner element so main.js can drive it each frame.
 *
 * @param {HTMLElement} skyEl
 * @param {number} H - viewport height
 * @returns {HTMLElement} cloudInnerEl
 */
function buildSky(skyEl, H) {
  skyEl.innerHTML = '';
  skyEl.style.height   = Math.round(H * SKY_FRAC) + 'px';
  skyEl.style.overflow = 'hidden';
  skyEl.style.position = 'absolute';
  skyEl.style.top      = '0';
  skyEl.style.left     = '0';
  skyEl.style.right    = '0';

  // Cloud strip lives inside sky so it clips naturally at the sky boundary
  const inner = document.createElement('div');
  inner.id             = 'cloud-inner';
  inner.style.cssText  = `
    position: absolute;
    top: 0; left: 0;
    width: ${CLOUD_W * 2}px;
    height: 100%;
    will-change: transform;
  `;

  // Two copies side-by-side for seamless repeat
  [0, CLOUD_W].forEach(ox => {
    cloudData.forEach(c => {
      const el = document.createElement('div');
      el.className = 'cloud';
      // x is a fraction of CLOUD_W so clouds are evenly spread across the tile
      el.style.cssText = `
        position: absolute;
        left:   ${Math.round((ox + c.x * CLOUD_W))}px;
        top:    ${c.y * 100}%;
        width:  ${c.w * CLOUD_W}px;
        height: ${c.h * 100}%;
        border-radius: 4px;
      `;
      inner.appendChild(el);
    });
  });

  skyEl.appendChild(inner);
  return inner;
}

/**
 * Update the sky container height on viewport resize.
 * Cloud positions are %-based so they reflow automatically.
 *
 * @param {HTMLElement} skyEl
 * @param {number} H
 */
function resizeSky(skyEl, H) {
  skyEl.style.height = Math.round(H * SKY_FRAC) + 'px';
}

/**
 * Move the cloud strip one frame forward using its own independent offset.
 * Called every frame from main.js with an ever-increasing cloudX value.
 *
 * @param {HTMLElement} cloudInnerEl
 * @param {number} cloudX - raw accumulated cloud offset (grows forever)
 */
function scrollClouds(cloudInnerEl, cloudX) {
  cloudInnerEl.style.transform =
    `translateX(${-posMod(cloudX, CLOUD_W)}px)`;
}
