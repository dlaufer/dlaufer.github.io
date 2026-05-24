// ─── Scroll helpers ────────────────────────────────────────────────────────────

/**
 * Always-positive modulo.
 * JavaScript's % can return negative values for negative operands.
 */
function posMod(n, m) {
  return ((n % m) + m) % m;
}

/**
 * Given the raw accumulated world offset (worldX) and a layer's scroll
 * speed multiplier + tile width, returns the CSS translateX value that
 * keeps the layer seamlessly tiled.
 *
 * @param {number} worldX   - Raw accumulated scroll offset (grows forever)
 * @param {number} speed    - Parallax multiplier for this layer
 * @param {number} tileW    - Width of one tile (content repeated twice in DOM)
 * @returns {number}        - Pixel offset to apply via translateX
 */
function layerX(worldX, speed, tileW) {
  return -posMod(-(worldX * speed), tileW);
}
