const wrap      = document.getElementById('game-wrap');
const sky       = document.getElementById('sky');
const farInner  = document.getElementById('far-inner');
const midInner  = document.getElementById('mid-inner');
const swInner   = document.getElementById('sw-inner');
const roadInner = document.getElementById('road-inner');
const fgInner   = document.getElementById('fg-inner');
const farWrap   = document.getElementById('far-wrap');
const midWrap   = document.getElementById('mid-wrap');
const fgWrap    = document.getElementById('fg-wrap');
const sidewalk  = document.getElementById('sidewalk');
const road      = document.getElementById('road');
const charEl    = document.getElementById('character');
const charHead  = document.getElementById('char-head');
const charBody  = document.getElementById('char-body');
const charLegs  = document.getElementById('char-legs');
const legL      = document.getElementById('leg-l');
const legR      = document.getElementById('leg-r');
const hud       = document.getElementById('hud');

// ── Tile widths (must be multiples of each layer's visual period) ──
const FAR_W  = 2000;
const MID_W  = 2000;
const ROAD_W = 3840;   // 48 dashes × 80px period
const SW_W   = 3840;
const FG_W   = 2880;   // 24 lampposts × 120px

const FAR_SPEED  = 0.25;
const MID_SPEED  = 0.70;
const ROAD_SPEED = 1.00;
const SW_SPEED   = 1.00;
const FG_SPEED   = 1.10;

// Layout proportions (fraction of screen height)
const SKY_FRAC        = 0.55;  // sky takes top 55%
const FAR_BOTTOM_FRAC = 0.42;  // far buildings bottom edge
const MID_BOTTOM_FRAC = 0.36;  // mid buildings bottom edge
const SW_BOTTOM_FRAC  = 0.28;  // sidewalk bottom edge
const SW_HEIGHT_FRAC  = 0.08;
const ROAD_HEIGHT_FRAC= 0.28;

let W, H, SPEED, CHAR_W, CHAR_H, HEAD_H, BODY_H, LEG_H, LEG_W, SIGN_FONT;

function computeSizes() {
    W = window.innerWidth;
    H = window.innerHeight;

    // Character scales with height, capped so it doesn't get huge on desktop
    const scale = Math.min(H / 420, 2);
    CHAR_W   = Math.round(16 * scale);
    CHAR_H   = Math.round(24 * scale);
    HEAD_H   = Math.round(10 * scale);
    BODY_H   = Math.round(14 * scale);
    LEG_H    = Math.round(6  * scale);
    LEG_W    = Math.round(5  * scale);
    SIGN_FONT= Math.max(6, Math.round(6 * scale));
    SPEED    = 2.5 * scale;
}

function layoutScene() {
    const swBottom = Math.round(H * SW_BOTTOM_FRAC);
    const swHeight = Math.round(H * SW_HEIGHT_FRAC);
    const roadH    = Math.round(H * ROAD_HEIGHT_FRAC);

    sky.style.height = Math.round(H * SKY_FRAC) + 'px';

    farWrap.style.bottom = Math.round(H * FAR_BOTTOM_FRAC) + 'px';
    farWrap.style.height = Math.round(H * 0.20) + 'px';

    midWrap.style.bottom = Math.round(H * MID_BOTTOM_FRAC) + 'px';
    midWrap.style.height = Math.round(H * 0.33) + 'px';

    sidewalk.style.bottom = swBottom + 'px';
    sidewalk.style.height = swHeight + 'px';

    road.style.height = roadH + 'px';

    fgWrap.style.bottom = swBottom + 'px';
    fgWrap.style.height = Math.round(H * 0.10) + 'px';

    // Character sits on top of sidewalk
    charEl.style.bottom  = swBottom + 'px';
    charEl.style.width   = CHAR_W + 'px';
    charEl.style.height  = CHAR_H + 'px';

    const headW = Math.round(CHAR_W * 0.65);
    charHead.style.cssText = `
    width:${headW}px; height:${HEAD_H}px;
    bottom:${BODY_H}px;
    left:${Math.round((CHAR_W - headW) / 2)}px;
    `;
    charBody.style.cssText = `
    width:${Math.round(CHAR_W * 0.80)}px; height:${BODY_H}px;
    left:${Math.round(CHAR_W * 0.10)}px;
    `;
    charLegs.style.cssText = `
    width:${Math.round(CHAR_W * 0.80)}px; height:${LEG_H}px;
    left:${Math.round(CHAR_W * 0.10)}px;
    gap:${Math.max(1, Math.round(CHAR_W * 0.12))}px;
    `;
    const lw = Math.round((Math.round(CHAR_W * 0.80) - Math.max(1, Math.round(CHAR_W * 0.12))) / 2);
    legL.style.cssText = `width:${lw}px; height:${LEG_H}px;`;
    legR.style.cssText = `width:${lw}px; height:${LEG_H}px;`;

    hud.style.fontSize = Math.max(10, Math.round(H / 42)) + 'px';

    // Road dashes scale with screen
    const dashH = Math.max(4, Math.round(roadH * 0.10));
    roadInner.style.top = Math.round(roadH * 0.50) + 'px';
    roadInner.style.height = dashH + 'px';
    roadInner.querySelectorAll('.dash').forEach(d => {
    d.style.height = dashH + 'px';
    });

    // Sidewalk marks
    const markH = Math.max(3, Math.round(swHeight * 0.40));
    swInner.querySelectorAll('.sw-mark').forEach(m => {
    m.style.height = markH + 'px';
    m.style.top = Math.round((swHeight - markH) / 2) + 'px';
    });
}

// ─── Build world (once) ───────────────────────────────────────────

function buildWorld() {
    // Clouds
    const cloudData = [
    {t:0.04,l:0.06,w:0.05,h:0.03},{t:0.03,l:0.08,w:0.03,h:0.04},
    {t:0.05,l:0.09,w:0.02,h:0.025},{t:0.09,l:0.20,w:0.06,h:0.03},
    {t:0.07,l:0.22,w:0.035,h:0.04},{t:0.03,l:0.40,w:0.04,h:0.03},
    {t:0.025,l:0.42,w:0.025,h:0.04},{t:0.10,l:0.56,w:0.055,h:0.025},
    {t:0.06,l:0.70,w:0.04,h:0.03},{t:0.04,l:0.75,w:0.025,h:0.035},
    {t:0.08,l:0.85,w:0.05,h:0.025},{t:0.03,l:0.90,w:0.03,h:0.04},
    ];
    cloudData.forEach(c => {
    const el = document.createElement('div');
    el.className = 'cloud';
    el.style.cssText = `top:${c.t*100}%;left:${c.l*100}%;width:${c.w*100}%;height:${c.h*100}%;`;
    sky.appendChild(el);
    });

    // Far buildings
    const farData = [
    {x:0,w:80,h:50},{x:100,w:60,h:65},{x:180,w:90,h:40},{x:290,w:70,h:55},
    {x:380,w:100,h:45},{x:500,w:55,h:70},{x:575,w:80,h:48},{x:675,w:65,h:60},
    {x:760,w:90,h:42},{x:870,w:75,h:58},{x:970,w:60,h:50},{x:1050,w:85,h:65},
    {x:1160,w:70,h:44},{x:1250,w:95,h:55},{x:1370,w:55,h:68},{x:1450,w:80,h:48},
    ];
    farData.forEach(d => {
    [0, FAR_W].forEach(ox => {
        const el = document.createElement('div');
        el.className = 'far-b';
        el.style.cssText = `left:${d.x+ox}px;width:${d.w}px;height:${d.h}px;`;
        farInner.appendChild(el);
    });
    });
    farInner.style.width = (FAR_W * 2) + 'px';

    // Road dashes
    for (let copy = 0; copy < 2; copy++) {
    for (let i = 0; i < 48; i++) {
        const d = document.createElement('div');
        d.className = 'dash';
        d.style.left = (copy * ROAD_W + i * 80) + 'px';
        d.style.width = '48px';
        roadInner.appendChild(d);
    }
    }
    roadInner.style.width = (ROAD_W * 2) + 'px';

    // Sidewalk marks
    for (let copy = 0; copy < 2; copy++) {
    for (let i = 0; i < 48; i++) {
        const m = document.createElement('div');
        m.className = 'sw-mark';
        m.style.left = (copy * SW_W + i * 80 + 8) + 'px';
        m.style.width = '32px';
        swInner.appendChild(m);
    }
    }
    swInner.style.width = (SW_W * 2) + 'px';

    // Mid buildings
    const midData = [
    {x:20,  w:70, h:90,  color:'#e8c98a',border:'#c9a55a',windows:[{x:8,y:15},{x:8,y:35},{x:8,y:55},{x:40,y:15},{x:40,y:35},{x:40,y:55}],door:28,roof:true, sign:null},
    {x:130, w:90, h:110, color:'#d4e8aa',border:'#9ab850',windows:[{x:10,y:20},{x:10,y:45},{x:10,y:70},{x:50,y:20},{x:50,y:45},{x:50,y:70}],door:38,roof:true, sign:{x:15,y:8,w:60,h:14,text:'TOWN HALL'}},
    {x:260, w:80, h:95,  color:'#f0c8a0',border:'#c88050',windows:[{x:8,y:18},{x:8,y:42},{x:8,y:66},{x:45,y:18},{x:45,y:42},{x:45,y:66}],door:33,roof:true, sign:null},
    {x:380, w:100,h:85,  color:'#c8d8f0',border:'#6090c8',windows:[{x:10,y:15},{x:10,y:38},{x:60,y:15},{x:60,y:38}],door:43,roof:false,sign:{x:20,y:10,w:60,h:14,text:'SHOP'}},
    {x:520, w:75, h:100, color:'#f0d0c0',border:'#c87050',windows:[{x:8,y:20},{x:8,y:48},{x:8,y:76},{x:45,y:20},{x:45,y:48},{x:45,y:76}],door:31,roof:true, sign:null},
    {x:630, w:110,h:120, color:'#d8e0c8',border:'#8aa060',windows:[{x:10,y:18},{x:10,y:45},{x:10,y:72},{x:65,y:18},{x:65,y:45},{x:65,y:72}],door:48,roof:true, sign:{x:22,y:10,w:66,h:14,text:'POST OFFICE'}},
    {x:790, w:80, h:90,  color:'#e8c8e8',border:'#a060a0',windows:[{x:8,y:15},{x:8,y:40},{x:8,y:65},{x:48,y:15},{x:48,y:40},{x:48,y:65}],door:33,roof:true, sign:null},
    {x:910, w:95, h:105, color:'#f8e8b0',border:'#c0a030',windows:[{x:10,y:20},{x:10,y:50},{x:10,y:80},{x:55,y:20},{x:55,y:50},{x:55,y:80}],door:40,roof:true, sign:{x:18,y:10,w:60,h:14,text:'MALL'}},
    {x:1050,w:70, h:88,  color:'#e0d0b8',border:'#a08050',windows:[{x:8,y:15},{x:8,y:40},{x:8,y:65},{x:40,y:15},{x:40,y:40},{x:40,y:65}],door:28,roof:true, sign:null},
    {x:1160,w:85, h:98,  color:'#c8e8d8',border:'#50a080',windows:[{x:10,y:18},{x:10,y:45},{x:10,y:72},{x:50,y:18},{x:50,y:45},{x:50,y:72}],door:36,roof:true, sign:{x:15,y:10,w:55,h:14,text:'BANK'}},
    {x:1300,w:75, h:92,  color:'#f0d8e8',border:'#b06090',windows:[{x:8,y:16},{x:8,y:42},{x:8,y:68},{x:44,y:16},{x:44,y:42},{x:44,y:68}],door:30,roof:true, sign:null},
    {x:1420,w:90, h:105, color:'#d8f0e0',border:'#50a060',windows:[{x:10,y:20},{x:10,y:50},{x:10,y:80},{x:55,y:20},{x:55,y:50},{x:55,y:80}],door:38,roof:true, sign:{x:18,y:10,w:55,h:14,text:'CAFE'}},
    {x:1560,w:70, h:88,  color:'#e8e0c8',border:'#b0a050',windows:[{x:8,y:15},{x:8,y:40},{x:8,y:65},{x:40,y:15},{x:40,y:40},{x:40,y:65}],door:28,roof:true, sign:null},
    {x:1680,w:80, h:100, color:'#c8e0f0',border:'#5080c0',windows:[{x:8,y:18},{x:8,y:45},{x:8,y:72},{x:48,y:18},{x:48,y:45},{x:48,y:72}],door:33,roof:true, sign:{x:12,y:10,w:56,h:14,text:'LIBRARY'}},
    {x:1830,w:75, h:90,  color:'#f0e8d0',border:'#c0a060',windows:[{x:8,y:16},{x:8,y:42},{x:8,y:68},{x:44,y:16},{x:44,y:42},{x:44,y:68}],door:30,roof:true, sign:null},
    {x:1940,w:20, h:90,  color:'#e0d8c0',border:'#a09050',windows:[],door:0,roof:false,sign:null},
    ];
    midData.forEach(d => {
    [0, MID_W].forEach(ox => {
        const el = document.createElement('div');
        el.className = 'mid-b';
        el.style.cssText = `left:${d.x+ox}px;width:${d.w}px;height:${d.h}px;background:${d.color};border-color:${d.border};`;
        if (d.roof) {
        const r = document.createElement('div');
        r.className = 'roof';
        el.appendChild(r);
        }
        if (d.sign) {
        const s = document.createElement('div');
        s.className = 'sign';
        s.style.cssText = `left:${d.sign.x}px;top:${d.sign.y}px;width:${d.sign.w}px;height:${d.sign.h}px;font-size:${SIGN_FONT}px;`;
        s.textContent = d.sign.text;
        el.appendChild(s);
        }
        d.windows.forEach(w => {
        const win = document.createElement('div');
        win.className = 'window';
        win.style.cssText = `left:${w.x}px;top:${w.y}px;width:10px;height:12px;`;
        el.appendChild(win);
        });
        if (d.w > 15) {
        const door = document.createElement('div');
        door.className = 'door';
        door.style.cssText = `left:${d.door}px;width:14px;height:20px;`;
        el.appendChild(door);
        }
        midInner.appendChild(el);
    });
    });
    midInner.style.width = (MID_W * 2) + 'px';

    // Lampposts
    for (let copy = 0; copy < 2; copy++) {
    for (let i = 0; i < 24; i++) {
        const lp = document.createElement('div');
        lp.className = 'lamppost';
        lp.style.left = (copy * FG_W + i * 120 + 40) + 'px';
        lp.innerHTML = `
        <div class="arm"  style="top:4px;left:2px;width:6px;height:3px;"></div>
        <div class="light" style="width:16px;height:8px;"></div>
        <div class="pole"  style="width:4px;height:36px;"></div>
        `;
        fgInner.appendChild(lp);
    }
    }
    fgInner.style.width = (FG_W * 2) + 'px';
}

// ─── Seamless scroll ──────────────────────────────────────────────

function posMod(n, m) { return ((n % m) + m) % m; }
function layerX(speed, tileW) {
    return -posMod(-(worldX * speed), tileW);
}

let worldX = 0;
let facing = 1;
let legFrame = 0;
let legTimer = 0;
const keys = {};

// ─── Input: keyboard ─────────────────────────────────────────────

document.addEventListener('keydown', e => {
    keys[e.key] = true;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.preventDefault();
    wrap.focus();
});
document.addEventListener('keyup', e => { keys[e.key] = false; });
wrap.addEventListener('click', () => wrap.focus());

// ─── Input: touch buttons ─────────────────────────────────────────

const btnLeft  = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');

function setTouch(btn, key, down) {
    btn.addEventListener(down ? 'touchstart' : 'touchend', e => {
    e.preventDefault();
    keys[key] = down;
    }, { passive: false });
}
setTouch(btnLeft,  'ArrowLeft',  true);
setTouch(btnLeft,  'ArrowLeft',  false);
setTouch(btnRight, 'ArrowRight', true);
setTouch(btnRight, 'ArrowRight', false);

// ─── Game loop ────────────────────────────────────────────────────

function loop() {
    if (keys['ArrowRight']) { worldX -= SPEED; facing =  1; }
    if (keys['ArrowLeft'])  { worldX += SPEED; facing = -1; }

    const moving = keys['ArrowRight'] || keys['ArrowLeft'];

    farInner.style.transform  = `translateX(${layerX(FAR_SPEED,  FAR_W)}px)`;
    midInner.style.transform  = `translateX(${layerX(MID_SPEED,  MID_W)}px)`;
    roadInner.style.transform = `translateX(${layerX(ROAD_SPEED, ROAD_W)}px)`;
    swInner.style.transform   = `translateX(${layerX(SW_SPEED,   SW_W)}px)`;
    fgInner.style.transform   = `translateX(${layerX(FG_SPEED,   FG_W)}px)`;

    charEl.style.transform = `translateX(-50%) scaleX(${facing})`;

    if (moving) {
    legTimer++;
    if (legTimer % 8 === 0) legFrame = (legFrame + 1) % 4;
    const poses = [[6,4],[4,6],[6,4],[8,3]];
    const lh = Math.round(poses[legFrame][0] * (LEG_H / 6));
    const rh = Math.round(poses[legFrame][1] * (LEG_H / 6));
    legL.style.height = lh + 'px';
    legR.style.height = rh + 'px';
    legL.style.marginTop = (LEG_H - lh) + 'px';
    legR.style.marginTop = (LEG_H - rh) + 'px';
    } else {
    legL.style.height = legR.style.height = LEG_H + 'px';
    legL.style.marginTop = legR.style.marginTop = '0';
    }

    requestAnimationFrame(loop);
}

// ─── Resize handler ───────────────────────────────────────────────

function onResize() {
    computeSizes();
    layoutScene();
}

window.addEventListener('resize', onResize);

// ─── Init ─────────────────────────────────────────────────────────

computeSizes();
buildWorld();
layoutScene();
wrap.focus();
loop();