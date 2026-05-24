// ─── Main ──────────────────────────────────────────────────────────────────────
// Orchestrates all modules: initialises the scene, wires up resize handling,
// and runs the requestAnimationFrame game loop.
//
// Load order in index.html must be:
//   constants.js → scroll.js → input.js → sky.js → buildings-far.js →
//   buildings-mid.js → street.js → foreground.js → character.js → main.js

(function () {

  // ── DOM refs ────────────────────────────────────────────────────────────────
  const wrap        = document.getElementById('game-wrap');
  const skyEl       = document.getElementById('sky');
  const farWrapEl   = document.getElementById('far-wrap');
  const farInnerEl  = document.getElementById('far-inner');
  const midWrapEl   = document.getElementById('mid-wrap');
  const midInnerEl  = document.getElementById('mid-inner');
  const sidewalkEl  = document.getElementById('sidewalk');
  const swInnerEl   = document.getElementById('sw-inner');
  const roadEl      = document.getElementById('road');
  const roadInnerEl = document.getElementById('road-inner');
  const fgWrapEl    = document.getElementById('fg-wrap');
  const fgInnerEl   = document.getElementById('fg-inner');
  const charEl      = document.getElementById('character');
  const charHead    = document.getElementById('char-head');
  const charBody    = document.getElementById('char-body');
  const charLegs    = document.getElementById('char-legs');
  const legL        = document.getElementById('leg-l');
  const legR        = document.getElementById('leg-r');
  const hudEl       = document.getElementById('hud');

  // ── State ───────────────────────────────────────────────────────────────────
  let worldX  = 0;   // character-driven world scroll — never reset
  let cloudX  = 0;   // independent cloud scroll — never reset
  let SPEED   = BASE_SPEED;

  // cloudInnerEl is returned by buildSky so we can drive it every frame
  let cloudInnerEl = null;

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function getScale(H) {
    return Math.min(H / 420, 2);
  }

  // ── Init ────────────────────────────────────────────────────────────────────
  function init() {
    const H     = window.innerHeight;
    const scale = getScale(H);
    SPEED = BASE_SPEED * scale;

    initInput(wrap);

    // buildSky now returns the cloud inner element
    cloudInnerEl = buildSky(skyEl, H);

    buildFarBuildings(farInnerEl, farWrapEl, H);
    buildMidBuildings(midInnerEl, midWrapEl, H, Math.max(6, Math.round(6 * scale)));
    buildStreet(roadInnerEl, swInnerEl, sidewalkEl, roadEl, H);
    buildForeground(fgInnerEl, fgWrapEl, H);
    buildCharacter(charEl, charHead, charBody, charLegs, legL, legR, H);

    hudEl.style.fontSize = Math.max(10, Math.round(H / 42)) + 'px';

    wrap.focus();
  }

  // ── Resize ──────────────────────────────────────────────────────────────────
  function onResize() {
    const H     = window.innerHeight;
    const scale = getScale(H);
    SPEED = BASE_SPEED * scale;

    resizeSky(skyEl, H);
    layoutFarBuildings(farWrapEl, H);
    layoutMidBuildings(midWrapEl, H);
    layoutStreet(sidewalkEl, roadEl, roadInnerEl, swInnerEl, H);
    layoutForeground(fgWrapEl, H);
    layoutCharacter(charEl, charHead, charBody, charLegs, legL, legR, H);

    hudEl.style.fontSize = Math.max(10, Math.round(H / 42)) + 'px';
  }

  window.addEventListener('resize', onResize);

  // ── Game loop ────────────────────────────────────────────────────────────────
  function loop() {
    const movingRight = (worldX > MAX_RIGHT_DISTANCE) && input.right;
    const movingLeft  = (worldX < MAX_LEFT_DISTANCE) && input.left;
    
    const moving      = movingRight || movingLeft;
    const dir         = movingRight ? 1 : movingLeft ? -1 : 0;

    // Character-driven world scroll
    if (movingRight) worldX -= SPEED;
    if (movingLeft) worldX += SPEED;

    // Clouds drift on their own — always advancing regardless of input
    cloudX += CLOUD_SPEED;

    // Scroll world layers
    scrollFarBuildings(farInnerEl, worldX);
    scrollMidBuildings(midInnerEl, worldX);
    scrollStreet(roadInnerEl, swInnerEl, worldX);
    scrollForeground(fgInnerEl, worldX);

    // Scroll clouds independently
    scrollClouds(cloudInnerEl, cloudX);

    // Animate character
    updateCharacter(moving, dir, charEl, legL, legR);

    requestAnimationFrame(loop);
  }

  // ── Start ────────────────────────────────────────────────────────────────────
  init();
  loop();

})();
