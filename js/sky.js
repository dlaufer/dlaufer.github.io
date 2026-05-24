// ─── Sky ───────────────────────────────────────────────────────────────────────
// Builds the static sky backdrop and places cloud divs using fractional
// positions so they look natural at any viewport size.

const cloudData = [
  { t: 0.04, l: 0.06, w: 0.050, h: 0.030 },
  { t: 0.03, l: 0.08, w: 0.030, h: 0.040 },
  { t: 0.05, l: 0.09, w: 0.020, h: 0.025 },
  { t: 0.09, l: 0.20, w: 0.060, h: 0.030 },
  { t: 0.07, l: 0.22, w: 0.035, h: 0.040 },
  { t: 0.03, l: 0.40, w: 0.040, h: 0.030 },
  { t: 0.03, l: 0.42, w: 0.025, h: 0.040 },
  { t: 0.10, l: 0.56, w: 0.055, h: 0.025 },
  { t: 0.06, l: 0.70, w: 0.040, h: 0.030 },
  { t: 0.04, l: 0.75, w: 0.025, h: 0.035 },
  { t: 0.08, l: 0.85, w: 0.050, h: 0.025 },
  { t: 0.03, l: 0.90, w: 0.030, h: 0.040 },
];

/**
 * Populate the sky element with clouds and size it to cover the top portion
 * of the viewport.
 * @param {HTMLElement} skyEl
 * @param {number} H - viewport height in px
 */
function buildSky(skyEl, H) {
  // Clear any previously built clouds on resize
  skyEl.innerHTML = '';

  skyEl.style.height = Math.round(H * SKY_FRAC) + 'px';

  cloudData.forEach(c => {
    const el = document.createElement('div');
    el.className = 'cloud';
    el.style.cssText = `
      top:    ${c.t * 100}%;
      left:   ${c.l * 100}%;
      width:  ${c.w * 100}%;
      height: ${c.h * 100}%;
    `;
    skyEl.appendChild(el);
  });
}

/**
 * Update sky height on viewport resize (clouds are % positioned so they
 * move automatically).
 * @param {HTMLElement} skyEl
 * @param {number} H
 */
function resizeSky(skyEl, H) {
  skyEl.style.height = Math.round(H * SKY_FRAC) + 'px';
}
