/* ============================================================
   ONAM FEST — ABOUT 3D GLASS TILT
   ============================================================ */

(function () {
  const glassEl = document.querySelector('.about-glass');
  if (!glassEl) return;

  // Skip if reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const MAX_ROT = 7; // max degrees of tilt

  function handleMouseMove(e) {
    const rect = glassEl.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;

    // Normalized -1 to 1
    const nx = (e.clientX - cx) / (rect.width  / 2);
    const ny = (e.clientY - cy) / (rect.height / 2);

    const rotX = -ny * MAX_ROT;
    const rotY =  nx * MAX_ROT;

    glassEl.style.transform =
      `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }

  function handleMouseLeave() {
    glassEl.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
  }

  // Track on parent for large hit area
  const outer = document.querySelector('.about-glass-outer') || glassEl.parentElement;
  outer.addEventListener('mousemove', handleMouseMove, { passive: true });
  outer.addEventListener('mouseleave', handleMouseLeave);

  // Reset on touch
  outer.addEventListener('touchend', handleMouseLeave);
})();
