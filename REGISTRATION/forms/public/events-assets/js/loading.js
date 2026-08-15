/* ============================================================
   ONAM FEST — LOADING SCREEN
   Drop your video at: assets/loading/loading-video.mp4
   ============================================================ */

(function () {
  const screen   = document.getElementById('loading-screen');
  const video    = document.getElementById('loading-video');
  const mainSite = document.getElementById('main-site');

  // Prevent flash before loader is ready
  document.body.classList.add('loading');

  function revealSite() {
    // Short pause then fade out
    setTimeout(() => {
      screen.classList.add('fade-out');
      document.body.classList.remove('loading');

      // After fade, fully hide
      screen.addEventListener('transitionend', () => {
        screen.classList.add('hidden');
        mainSite.style.opacity = '1';
      }, { once: true });
    }, 350);
  }

  if (video) {
    // Try to play the video
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked — reveal after short delay
        setTimeout(revealSite, 1200);
      });
    }

    // Primary exit: video ends
    video.addEventListener('ended', revealSite);

    // Safety fallback: if video never loads, reveal after 6s
    setTimeout(revealSite, 6000);
  } else {
    // No video element → use fallback duration
    setTimeout(revealSite, 2000);
  }

  // Skip button
  const skipBtn = document.getElementById('loading-skip');
  if (skipBtn) {
    skipBtn.addEventListener('click', revealSite);
  }

  // Reduced motion: skip instantly
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealSite();
  }
})();
