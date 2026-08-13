/* ============================================================
   ONAM FEST — ABOUT SECTION SCRIPT
   ============================================================ */

(function () {
  const video = document.getElementById('about-character-video');
  if (video) {
    video.play().catch(() => {
      // Autoplay fallback handler
    });
  }
})();
