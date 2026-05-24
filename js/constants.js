// ─── Tile widths ───────────────────────────────────────────────────────────────
// Each value must be a multiple of that layer's visual repeat period so the
// seamless-loop math (posMod) lands cleanly.
const FAR_W  = 2000;   // far-building strip
const MID_W  = 2000;   // mid-building strip
const ROAD_W = 3840;   // 48 dashes × 80 px period
const SW_W   = 3840;   // sidewalk marks, same period as road
const FG_W   = 2880;   // 24 lampposts × 120 px

// ─── Parallax multipliers ──────────────────────────────────────────────────────
const FAR_SPEED  = 0.25;
const MID_SPEED  = 0.70;
const ROAD_SPEED = 1.00;
const SW_SPEED   = 1.00;
const FG_SPEED   = 1.10;

// ─── Layout fractions (of screen height) ──────────────────────────────────────
const SKY_FRAC         = 0.55;
const FAR_BOTTOM_FRAC  = 0.42;
const MID_BOTTOM_FRAC  = 0.36;
const SW_BOTTOM_FRAC   = 0.28;
const SW_HEIGHT_FRAC   = 0.08;
const ROAD_HEIGHT_FRAC = 0.28;

// ─── Walk speed (px per frame at base scale) ──────────────────────────────────
const BASE_SPEED = 2.5;
