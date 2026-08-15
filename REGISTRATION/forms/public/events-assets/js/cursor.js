(function () {
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;

  function initCursor() {
    if (!document.querySelector('.custom-cursor')) {
      const cursorDiv = document.createElement('div');
      cursorDiv.className = 'custom-cursor';
      cursorDiv.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
      document.body.appendChild(cursorDiv);
    }

    if (!document.querySelector('.mouse-glow')) {
      const glowDiv = document.createElement('div');
      glowDiv.className = 'mouse-glow';
      document.body.appendChild(glowDiv);
    }

    const cursor = document.querySelector('.custom-cursor');
    const cursorRing = document.querySelector('.cursor-ring');
    const mouseGlow = document.querySelector('.mouse-glow');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let glowPending = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!glowPending) {
        glowPending = true;
        requestAnimationFrame(() => {
          if (mouseGlow) {
            mouseGlow.style.left = mouseX + 'px';
            mouseGlow.style.top = mouseY + 'px';
            mouseGlow.style.opacity = '1';
          }
          glowPending = false;
        });
      }
    }, { passive: true });

    function updateCursor() {
      if (cursor) {
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
      }

      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;

      if (cursorRing) {
        cursorRing.style.transform = `translate(${ringX - mouseX}px, ${ringY - mouseY}px)`;
      }

      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    function attachHoverListeners() {
      const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"], .card, .btn, .interactive, .hub-card, .event-card, .team-card');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
    }

    attachHoverListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
  } else {
    initCursor();
  }
})();
