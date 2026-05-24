// ─── Input ─────────────────────────────────────────────────────────────────────
// Tracks which keys are currently held. Touch buttons write into the same
// object so the game loop doesn't need to know which input device is active.

const input = {
  left:  false,
  right: false,
};

function initInput(wrapEl) {
  // ── Keyboard ──────────────────────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { input.left  = true; e.preventDefault(); }
    if (e.key === 'ArrowRight') { input.right = true; e.preventDefault(); }
    wrapEl.focus();
  });

  document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft')  input.left  = false;
    if (e.key === 'ArrowRight') input.right = false;
  });

  wrapEl.addEventListener('click', () => wrapEl.focus());

  // ── Touch buttons ─────────────────────────────────────────────────────────
  const btnLeft  = document.getElementById('btn-left');
  const btnRight = document.getElementById('btn-right');

  function bindTouch(btn, side) {
    btn.addEventListener('touchstart', e => { e.preventDefault(); input[side] = true;  }, { passive: false });
    btn.addEventListener('touchend',   e => { e.preventDefault(); input[side] = false; }, { passive: false });
    btn.addEventListener('touchcancel',e => { e.preventDefault(); input[side] = false; }, { passive: false });
  }

  bindTouch(btnLeft,  'left');
  bindTouch(btnRight, 'right');
}
