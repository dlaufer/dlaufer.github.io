// ─── Far buildings ─────────────────────────────────────────────────────────────
// The distant silhouette layer — muted blue-grey rectangles that scroll at
// FAR_SPEED (0.25×) to create depth.

// const farBuildingData = [
//   { x: 0,    w: 80,  h: 50 },
//   { x: 100,  w: 60,  h: 65 },
//   { x: 180,  w: 90,  h: 40 },
//   { x: 290,  w: 70,  h: 55 },
//   { x: 380,  w: 100, h: 45 },
//   { x: 500,  w: 55,  h: 70 },
//   { x: 575,  w: 80,  h: 48 },
//   { x: 675,  w: 65,  h: 60 },
//   { x: 760,  w: 90,  h: 42 },
//   { x: 870,  w: 75,  h: 58 },
//   { x: 970,  w: 60,  h: 50 },
//   { x: 1050, w: 85,  h: 65 },
//   { x: 1160, w: 70,  h: 44 },
//   { x: 1250, w: 95,  h: 55 },
//   { x: 1370, w: 55,  h: 68 },
//   { x: 1450, w: 80,  h: 48 },
// ];

// /**
//  * Build two copies of the far-building strip side by side so the seamless
//  * scroll loop always has content to show.
//  * @param {HTMLElement} farInnerEl  - The scrolling inner div
//  * @param {HTMLElement} farWrapEl   - The clipping wrapper div
//  * @param {number} H                - Viewport height in px
//  */
// function buildFarBuildings(farInnerEl, farWrapEl, H) {
//   farInnerEl.innerHTML = '';

//   farBuildingData.forEach(d => {
//     [0, FAR_W].forEach(ox => {
//       const el = document.createElement('div');
//       el.className = 'far-b';
//       el.style.cssText = `left:${d.x + ox}px; width:${d.w}px; height:${d.h}px;`;
//       farInnerEl.appendChild(el);
//     });
//   });

//   farInnerEl.style.width = (FAR_W * 2) + 'px';
//   layoutFarBuildings(farWrapEl, H);
// }

function buildFarBuildings(farInnerEl, farWrapEl, H) {
  farInnerEl.innerHTML = '';
  // center the image in the frame
  farInnerEl.style.cssText = `
    position: absolute;
    bottom: 0;
    left: -20%;
    width: 1000px;
    height: 100%;
    background-image: url('images/wholecity.png');
    background-repeat: no-repeat;
    background-position: bottom center;
    background-size: auto 100%;
    image-rendering: pixelated;
  `;
  layoutFarBuildings(farWrapEl, H);
}

/**
 * Position the wrapper so its bottom edge sits at FAR_BOTTOM_FRAC of the
 * viewport. Called on build and on every resize.
 * @param {HTMLElement} farWrapEl
 * @param {number} H
 */
function layoutFarBuildings(farWrapEl, H) {
  farWrapEl.style.bottom = Math.round(H * FAR_BOTTOM_FRAC) + 'px';
  farWrapEl.style.height = Math.round(H * 0.20) + 'px';
}

/**
 * Apply the scroll transform for this frame.
 * @param {HTMLElement} farInnerEl
 * @param {number} worldX
 */
function scrollFarBuildings(farInnerEl, worldX) {
  farInnerEl.style.transform = `translateX(${scrollWithNoRepeat(worldX, FAR_SPEED)}px)`;
}
