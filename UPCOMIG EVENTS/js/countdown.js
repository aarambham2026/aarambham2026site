/* ============================================================
   ONAM FEST — COUNTDOWN TIMER
   ============================================================ */

(function () {
  // ── CHANGE THIS to your event date/time ───────────────────
  const eventDate = new Date("2026-08-22T09:00:00");

  const daysEl   = document.getElementById('cd-days');
  const hoursEl  = document.getElementById('cd-hours');
  const minsEl   = document.getElementById('cd-minutes');
  const secsEl   = document.getElementById('cd-seconds');
  const wrapEl   = document.getElementById('countdown-wrap');
  const overEl   = document.getElementById('countdown-over');

  if (!daysEl) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  // Flip animation on value change
  function updateEl(el, value) {
    const current = el.textContent;
    const next    = pad(value);
    if (current !== next) {
      el.textContent = next;
      el.classList.remove('flip');
      void el.offsetWidth; // reflow
      el.classList.add('flip');
    }
  }

  function tick() {
    const now  = Date.now();
    const diff = eventDate.getTime() - now;

    if (diff <= 0) {
      // Event has started
      if (wrapEl) wrapEl.style.display = 'none';
      if (overEl) overEl.style.display = 'block';
      return;
    }

    const totalSec = Math.floor(diff / 1000);
    const days     = Math.floor(totalSec / 86400);
    const hours    = Math.floor((totalSec % 86400) / 3600);
    const minutes  = Math.floor((totalSec % 3600) / 60);
    const seconds  = totalSec % 60;

    updateEl(daysEl, days);
    updateEl(hoursEl, hours);
    updateEl(minsEl, minutes);
    updateEl(secsEl, seconds);
  }

  tick();
  setInterval(tick, 1000);
})();
