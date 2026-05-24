// ─── Sky ───────────────────────────────────────────────────────────────────────
// Static sky backdrop with randomly generated clouds that drift independently
// of character movement.

const CLOUD_SPEED = 0.18;  // px per frame
const CLOUD_W     = 3200;  // tile width for the cloud strip
const CLOUD_COUNT = 14;    // how many clouds per tile

/**
 * Generate an array of random cloud descriptors.
 * Each cloud is a cluster of 2-3 overlapping rectangles to give a puffy shape.
 * Positions are spread evenly across the tile width with jitter so they don't
 * bunch up or leave giant empty gaps.
 *
 * @returns {Array<{x, y, w, h}>} positions as fractions of CLOUD_W / sky height
 */
function generateClouds() {
  const clouds = [];
  const slotW  = 1 / CLOUD_COUNT;  // fraction of tile width per cloud slot

  for (let i = 0; i < CLOUD_COUNT; i++) {
    // Spread evenly across the tile with random jitter within each slot
    const baseX = (i + 0.1 + Math.random() * 0.8) * slotW;

    // Random vertical position — keep clouds in the upper 65% of sky
    const baseY = 0.05 + Math.random() * 0.60;

    // Random cloud size
    const coreW = 0.030 + Math.random() * 0.045;  // fraction of CLOUD_W
    const coreH = 0.10  + Math.random() * 0.25;   // fraction of sky height

    // Main body
    clouds.push({ x: baseX, y: baseY, w: coreW, h: coreH });

    // Left puff — slightly smaller, offset up-left
    clouds.push({
      x: baseX - coreW * 0.35,
      y: baseY + coreH * 0.20,
      w: coreW * 0.65,
      h: coreH * 0.70,
    });

    // Right puff — slightly smaller, offset up-right
    clouds.push({
      x: baseX + coreW * 0.55,
      y: baseY + coreH * 0.15,
      w: coreW * 0.60,
      h: coreH * 0.65,
    });
  }

  return clouds;
}

/**
 * Build the sky element with a randomly generated cloud strip.
 * Returns the inner cloud element so main.js can scroll it each frame.
 *
 * @param {HTMLElement} skyEl
 * @param {number} H - viewport height
 * @returns {HTMLElement} cloudInnerEl
 */
function buildSky(skyEl, H) {
  skyEl.innerHTML      = '';
  skyEl.style.height   = Math.round(H * SKY_FRAC) + 'px';
  skyEl.style.overflow = 'hidden';
  skyEl.style.position = 'absolute';
  skyEl.style.top      = '0';
  skyEl.style.left     = '0';
  skyEl.style.right    = '0';

  const inner = document.createElement('div');
  inner.id            = 'cloud-inner';
  inner.style.cssText = `
    position: absolute;
    top: 0; left: 0;
    width: ${CLOUD_W * 2}px;
    height: 100%;
    will-change: transform;
  `;

  const cloudData = generateClouds();

  // Two copies side-by-side for seamless repeat
  [0, CLOUD_W].forEach(ox => {
    cloudData.forEach(c => {
      const el        = document.createElement('div');
      el.className    = 'cloud';
      el.style.cssText = `
        position: absolute;
        left:          ${Math.round(ox + c.x * CLOUD_W)}px;
        top:           ${c.y * 100}%;
        width:         ${Math.round(c.w * CLOUD_W)}px;
        height:        ${c.h * 100}%;
        border-radius: 4px;
      `;
      inner.appendChild(el);
    });
  });

  skyEl.appendChild(inner);
  return inner;
}

/**
 * Update sky height on resize — cloud positions are % or px-from-tile so
 * they reflow automatically.
 *
 * @param {HTMLElement} skyEl
 * @param {number} H
 */
function resizeSky(skyEl, H) {
  skyEl.style.height = Math.round(H * SKY_FRAC) + 'px';
}

/**
 * Advance clouds one frame using their own independent offset.
 *
 * @param {HTMLElement} cloudInnerEl
 * @param {number} cloudX - raw accumulated offset (grows forever)
 */
function scrollClouds(cloudInnerEl, cloudX) {
  cloudInnerEl.style.transform = `translateX(${-posMod(cloudX, CLOUD_W)}px)`;
}
