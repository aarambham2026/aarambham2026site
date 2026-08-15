(function () {
  if (typeof window === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;

  if (window.__ONAM_CURSOR_CLEANUP__) {
    try { window.__ONAM_CURSOR_CLEANUP__(); } catch (e) {}
  }

  function initCursor() {
    let cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.className = 'custom-cursor';
      cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
      document.body.appendChild(cursor);
    }

    let mouseGlow = document.querySelector('.mouse-glow');
    if (!mouseGlow) {
      mouseGlow = document.createElement('div');
      mouseGlow.className = 'mouse-glow';
      document.body.appendChild(mouseGlow);
    }

    const cursorRing = cursor.querySelector('.cursor-ring');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId = null;

    function onMouseMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    function animate() {
      if (cursor) {
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;

      if (cursorRing) {
        cursorRing.style.transform = `translate3d(${ringX - mouseX}px, ${ringY - mouseY}px, 0)`;
      }

      if (mouseGlow) {
        mouseGlow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        mouseGlow.style.opacity = '1';
      }

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);

    function onMouseOver(e) {
      const target = e.target;
      if (target && target.closest && target.closest('a, button, input, select, textarea, [role="button"], .card, .btn, .interactive, .hub-card, .event-card, .team-card')) {
        document.body.classList.add('cursor-hover');
      } else {
        document.body.classList.remove('cursor-hover');
      }
    }

    document.addEventListener('mouseover', onMouseOver, { passive: true });

    window.__ONAM_CURSOR_CLEANUP__ = function () {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor, { once: true });
  } else {
    initCursor();
  }
})();
