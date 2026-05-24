// ─── Character ─────────────────────────────────────────────────────────────────
// Manages the player sprite: sizing, positioning, leg animation, and direction.
// The character is always visually centred horizontally — the world scrolls
// around it rather than the character moving across the screen.

// Walk cycle: 4 frames of [left-leg-height, right-leg-height] pairs.
const WALK_FRAMES = [
  [6, 4],
  [4, 6],
  [6, 4],
  [8, 3],
];
const FRAMES_PER_STEP = 8; // game-loop ticks between leg-frame advances

// Module-level state
let charScale   = 1;
let legBaseH    = 6;    // px at 1× scale
let legTimer    = 0;
let legFrame    = 0;
let facing      = 1;    // 1 = right, -1 = left

/**
 * Compute the character's display scale from the viewport height.
 * Capped at 2× so the sprite doesn't become enormous on large screens.
 * @param {number} H - Viewport height in px
 * @returns {number} scale
 */
function charScaleFromHeight(H) {
  return Math.min(H / 420, 2);
}

/**
 * Build and size all character sub-elements, then position the character
 * on top of the sidewalk.
 *
 * @param {HTMLElement} charEl
 * @param {HTMLElement} charHead
 * @param {HTMLElement} charBody
 * @param {HTMLElement} charLegs
 * @param {HTMLElement} legL
 * @param {HTMLElement} legR
 * @param {number} H - Viewport height in px
 */
function buildCharacter(charEl, charHead, charBody, charLegs, legL, legR, H) {
  layoutCharacter(charEl, charHead, charBody, charLegs, legL, legR, H);
}

/**
 * Apply dimensions and positions based on current viewport height.
 * Safe to call on every resize.
 */
function layoutCharacter(charEl, charHead, charBody, charLegs, legL, legR, H) {
  charScale = charScaleFromHeight(H);

  const charW  = Math.round(16 * charScale);
  const charH  = Math.round(24 * charScale);
  const headH  = Math.round(10 * charScale);
  const bodyH  = Math.round(14 * charScale);
  legBaseH     = Math.round(6  * charScale);

  const swBottom = Math.round(H * SW_BOTTOM_FRAC);

  charEl.style.bottom = swBottom + 'px';
  charEl.style.width  = charW   + 'px';
  charEl.style.height = charH   + 'px';

  const headW  = Math.round(charW * 0.65);
  const bodyW  = Math.round(charW * 0.80);
  const bodyL  = Math.round(charW * 0.10);
  const gap    = Math.max(1, Math.round(charW * 0.12));
  const legW   = Math.round((bodyW - gap) / 2);

  charHead.style.cssText = `
    width:  ${headW}px;
    height: ${headH}px;
    bottom: ${bodyH}px;
    left:   ${Math.round((charW - headW) / 2)}px;
  `;

  charBody.style.cssText = `
    width:  ${bodyW}px;
    height: ${bodyH}px;
    left:   ${bodyL}px;
  `;

  charLegs.style.cssText = `
    width:  ${bodyW}px;
    height: ${legBaseH}px;
    left:   ${bodyL}px;
    gap:    ${gap}px;
  `;

  legL.style.cssText = `width:${legW}px; height:${legBaseH}px;`;
  legR.style.cssText = `width:${legW}px; height:${legBaseH}px;`;
}

/**
 * Advance the walk animation one game-loop tick.
 * @param {boolean} moving   - Whether the character is moving this frame
 * @param {number}  dir      - +1 (right) or -1 (left)
 * @param {HTMLElement} charEl
 * @param {HTMLElement} legL
 * @param {HTMLElement} legR
 */
function updateCharacter(moving, dir, charEl, legL, legR) {
  if (dir !== 0) facing = dir;

  charEl.style.transform = `translateX(-50%) scaleX(${facing})`;

  if (moving) {
    legTimer++;
    if (legTimer % FRAMES_PER_STEP === 0) {
      legFrame = (legFrame + 1) % WALK_FRAMES.length;
    }

    const [lf, rf] = WALK_FRAMES[legFrame];
    const lh = Math.round(lf * (legBaseH / 6));
    const rh = Math.round(rf * (legBaseH / 6));

    legL.style.height    = lh + 'px';
    legR.style.height    = rh + 'px';
    legL.style.marginTop = (legBaseH - lh) + 'px';
    legR.style.marginTop = (legBaseH - rh) + 'px';
  } else {
    legFrame = 0;
    legTimer = 0;
    legL.style.height = legR.style.height = legBaseH + 'px';
    legL.style.marginTop = legR.style.marginTop = '0';
  }
}
