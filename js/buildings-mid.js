// ─── Mid buildings ─────────────────────────────────────────────────────────────
// The main interactive building layer — coloured buildings with windows,
// doors, roofs, and signs. Scrolls at MID_SPEED (0.70×).

const midBuildingData = [
  { x: 20,   w: 70,  h: 90,  color: '#e8c98a', border: '#c9a55a', roof: true,  sign: null,
    windows: [{x:8,y:15},{x:8,y:35},{x:8,y:55},{x:40,y:15},{x:40,y:35},{x:40,y:55}], door: 28 },

  { x: 130,  w: 90,  h: 110, color: '#d4e8aa', border: '#9ab850', roof: true,  sign: {x:15,y:8, w:60,h:14,text:'TOWN HALL'},
    windows: [{x:10,y:20},{x:10,y:45},{x:10,y:70},{x:50,y:20},{x:50,y:45},{x:50,y:70}], door: 38 },

  { x: 260,  w: 80,  h: 95,  color: '#f0c8a0', border: '#c88050', roof: true,  sign: null,
    windows: [{x:8,y:18},{x:8,y:42},{x:8,y:66},{x:45,y:18},{x:45,y:42},{x:45,y:66}], door: 33 },

  { x: 380,  w: 100, h: 85,  color: '#c8d8f0', border: '#6090c8', roof: false, sign: {x:20,y:10,w:60,h:14,text:'SHOP'},
    windows: [{x:10,y:15},{x:10,y:38},{x:60,y:15},{x:60,y:38}], door: 43 },

  { x: 520,  w: 75,  h: 100, color: '#f0d0c0', border: '#c87050', roof: true,  sign: null,
    windows: [{x:8,y:20},{x:8,y:48},{x:8,y:76},{x:45,y:20},{x:45,y:48},{x:45,y:76}], door: 31 },

  { x: 630,  w: 110, h: 120, color: '#d8e0c8', border: '#8aa060', roof: true,  sign: {x:22,y:10,w:66,h:14,text:'POST OFFICE'},
    windows: [{x:10,y:18},{x:10,y:45},{x:10,y:72},{x:65,y:18},{x:65,y:45},{x:65,y:72}], door: 48 },

  { x: 790,  w: 80,  h: 90,  color: '#e8c8e8', border: '#a060a0', roof: true,  sign: null,
    windows: [{x:8,y:15},{x:8,y:40},{x:8,y:65},{x:48,y:15},{x:48,y:40},{x:48,y:65}], door: 33 },

  { x: 910,  w: 95,  h: 105, color: '#f8e8b0', border: '#c0a030', roof: true,  sign: {x:18,y:10,w:60,h:14,text:'MALL'},
    windows: [{x:10,y:20},{x:10,y:50},{x:10,y:80},{x:55,y:20},{x:55,y:50},{x:55,y:80}], door: 40 },

  { x: 1050, w: 70,  h: 88,  color: '#e0d0b8', border: '#a08050', roof: true,  sign: null,
    windows: [{x:8,y:15},{x:8,y:40},{x:8,y:65},{x:40,y:15},{x:40,y:40},{x:40,y:65}], door: 28 },

  { x: 1160, w: 85,  h: 98,  color: '#c8e8d8', border: '#50a080', roof: true,  sign: {x:15,y:10,w:55,h:14,text:'BANK'},
    windows: [{x:10,y:18},{x:10,y:45},{x:10,y:72},{x:50,y:18},{x:50,y:45},{x:50,y:72}], door: 36 },

  { x: 1300, w: 75,  h: 92,  color: '#f0d8e8', border: '#b06090', roof: true,  sign: null,
    windows: [{x:8,y:16},{x:8,y:42},{x:8,y:68},{x:44,y:16},{x:44,y:42},{x:44,y:68}], door: 30 },

  { x: 1420, w: 90,  h: 105, color: '#d8f0e0', border: '#50a060', roof: true,  sign: {x:18,y:10,w:55,h:14,text:'CAFE'},
    windows: [{x:10,y:20},{x:10,y:50},{x:10,y:80},{x:55,y:20},{x:55,y:50},{x:55,y:80}], door: 38 },

  { x: 1560, w: 70,  h: 88,  color: '#e8e0c8', border: '#b0a050', roof: true,  sign: null,
    windows: [{x:8,y:15},{x:8,y:40},{x:8,y:65},{x:40,y:15},{x:40,y:40},{x:40,y:65}], door: 28 },

  { x: 1680, w: 80,  h: 100, color: '#c8e0f0', border: '#5080c0', roof: true,  sign: {x:12,y:10,w:56,h:14,text:'LIBRARY'},
    windows: [{x:8,y:18},{x:8,y:45},{x:8,y:72},{x:48,y:18},{x:48,y:45},{x:48,y:72}], door: 33 },

  { x: 1830, w: 75,  h: 90,  color: '#f0e8d0', border: '#c0a060', roof: true,  sign: null,
    windows: [{x:8,y:16},{x:8,y:42},{x:8,y:68},{x:44,y:16},{x:44,y:42},{x:44,y:68}], door: 30 },

  // Narrow filler block at the tile seam so there's no visible gap
  { x: 1940, w: 20,  h: 90,  color: '#e0d8c0', border: '#a09050', roof: false, sign: null,
    windows: [], door: null },
];

/**
 * Create a single building element from a data descriptor.
 * @param {object} d   - Building descriptor
 * @param {number} ox  - X offset (0 or MID_W for the second copy)
 * @param {number} signFontSize
 * @returns {HTMLElement}
 */
function createMidBuilding(d, ox, signFontSize) {
  const el = document.createElement('div');
  el.className = 'mid-b';
  el.style.cssText = `
    left: ${d.x + ox}px;
    width: ${d.w}px;
    height: ${d.h}px;
    background: ${d.color};
    border-color: ${d.border};
  `;

  if (d.roof) {
    const r = document.createElement('div');
    r.className = 'roof';
    el.appendChild(r);
  }

  if (d.sign) {
    const s = document.createElement('div');
    s.className = 'sign';
    s.style.cssText = `
      left: ${d.sign.x}px; top: ${d.sign.y}px;
      width: ${d.sign.w}px; height: ${d.sign.h}px;
      font-size: ${signFontSize}px;
    `;
    s.textContent = d.sign.text;
    el.appendChild(s);
  }

  d.windows.forEach(w => {
    const win = document.createElement('div');
    win.className = 'window';
    win.style.cssText = `left:${w.x}px; top:${w.y}px; width:10px; height:12px;`;
    el.appendChild(win);
  });

  if (d.door !== null && d.w > 15) {
    const door = document.createElement('div');
    door.className = 'door';
    door.style.cssText = `left:${d.door}px; width:14px; height:20px;`;
    el.appendChild(door);
  }

  return el;
}

/**
 * Build two copies of the mid-building strip into the inner div.
 * @param {HTMLElement} midInnerEl
 * @param {HTMLElement} midWrapEl
 * @param {number} H
 * @param {number} signFontSize
 */
function buildMidBuildings(midInnerEl, midWrapEl, H, signFontSize) {
  midInnerEl.innerHTML = '';

  midBuildingData.forEach(d => {
    [0, MID_W].forEach(ox => {
      midInnerEl.appendChild(createMidBuilding(d, ox, signFontSize));
    });
  });

  midInnerEl.style.width = (MID_W * 2) + 'px';
  layoutMidBuildings(midWrapEl, H);
}

/**
 * Position the wrapper for the current viewport height.
 * @param {HTMLElement} midWrapEl
 * @param {number} H
 */
function layoutMidBuildings(midWrapEl, H) {
  midWrapEl.style.bottom = Math.round(H * MID_BOTTOM_FRAC) + 'px';
  midWrapEl.style.height = Math.round(H * 0.33) + 'px';
}

/**
 * Apply the scroll transform for this frame.
 * @param {HTMLElement} midInnerEl
 * @param {number} worldX
 */
function scrollMidBuildings(midInnerEl, worldX) {
  midInnerEl.style.transform = `translateX(${layerX(worldX, MID_SPEED, MID_W)}px)`;
}
