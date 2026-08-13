/* ============================================================
   ONAM FEST — SCROLL REVEAL (Intersection Observer)
   ============================================================ */

(function () {
  // Skip for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve once revealed to save memory
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1,
    }
  );

  // Observe all reveal elements (including dynamically added ones)
  function observeAll() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      observer.observe(el);
    });
  }

  // Initial pass
  observeAll();

  // Re-scan after dynamic content is built (sections.js runs after this)
  window.addEventListener('load', observeAll);
  setTimeout(observeAll, 500);
})();
