/* ============================================================
   ONAM FEST — REALISTIC ANIMATED 3D COUNTDOWN TIMER
   ============================================================ */

(function () {
  const eventDate = new Date("2026-08-22T09:00:00");

  const state = { days: -1, hours: -1, minutes: -1, seconds: -1 };

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, '0');
  }

  function updateUnit(unit, value) {
    if (state[unit] === value) return;
    state[unit] = value;

    const formatted = pad(value);
    const card = document.getElementById(`cd-${unit}-card`);
    const numEl = document.getElementById(`cd-${unit}`);

    if (!card || !numEl) return;

    // Trigger 3D flip card animation
    card.classList.remove('flip-animate');
    void card.offsetWidth; // Force reflow
    card.classList.add('flip-animate');

    // Update the numerical value half-way through the 3D fold for realism
    setTimeout(() => {
      numEl.textContent = formatted;
      const topHalf = card.querySelector('.flip-top-num');
      const botHalf = card.querySelector('.flip-bot-num');
      if (topHalf) topHalf.textContent = formatted;
      if (botHalf) botHalf.textContent = formatted;
    }, 150);
  }

  function tick() {
    const wrapEl = document.getElementById('countdown-wrap');
    const overEl = document.getElementById('countdown-over');
    const now = Date.now();
    const diff = eventDate.getTime() - now;

    if (diff <= 0) {
      if (wrapEl) wrapEl.style.display = 'none';
      if (overEl) overEl.style.display = 'block';
      return;
    }

    const totalSec = Math.floor(diff / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    updateUnit('days', days);
    updateUnit('hours', hours);
    updateUnit('minutes', minutes);
    updateUnit('seconds', seconds);
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    tick();
    setInterval(tick, 1000);
  });

  // Fallback in case DOM is already ready
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    tick();
    setInterval(tick, 1000);
  }
})();
