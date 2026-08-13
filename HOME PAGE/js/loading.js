/* ============================================================
   ONAM FEST — CUSTOM LOADING SCREEN SCRIPT
   Animates the 6-segment progress bar and transitions to site
   ============================================================ */

(function () {
  const screen = document.getElementById('loading-screen');
  const mainSite = document.getElementById('main-site');
  const barSegments = document.querySelectorAll('.bar-segment');

  // Prevent flash before loader is ready
  document.body.classList.add('loading');

  let currentSegment = 0;
  const totalSegments = barSegments.length;
  const segmentInterval = 300; // 300ms per segment

  function updateProgress() {
    if (currentSegment < totalSegments) {
      if (barSegments[currentSegment]) {
        barSegments[currentSegment].classList.add('active');
      }
      currentSegment++;
      setTimeout(updateProgress, segmentInterval);
    } else {
      // Progress complete -> reveal main site
      setTimeout(revealSite, 250);
    }
  }

  function revealSite() {
    screen.classList.add('fade-out');
    document.body.classList.remove('loading');

    screen.addEventListener('transitionend', () => {
      screen.classList.add('hidden');
      if (mainSite) mainSite.style.opacity = '1';
    }, { once: true });
  }

  // Start progress bar animation after short initial delay
  setTimeout(updateProgress, 200);

  // Skip button
  const skipBtn = document.getElementById('loading-skip');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      barSegments.forEach(s => s.classList.add('active'));
      revealSite();
    });
  }

  // Reduced motion: skip immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealSite();
  }
})();
