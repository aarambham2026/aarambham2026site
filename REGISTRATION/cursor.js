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

    function setCursorPosition(x, y, hoverState) {
      mouseX = x;
      mouseY = y;

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

      if (hoverState) {
        document.body.classList.add('cursor-hover');
      } else {
        document.body.classList.remove('cursor-hover');
      }
    }

    document.addEventListener('mousemove', (e) => {
      const isHover = Boolean(e.target && e.target.closest('a, button, input, select, textarea, [role="button"], .nav-links a, .nav-brand'));
      setCursorPosition(e.clientX, e.clientY, isHover);
    }, { passive: true });

    // Master cursor bridge: receive seamless mouse coordinates from embedded iframe
    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'MASTER_CURSOR_MOVE') {
        setCursorPosition(e.data.x, e.data.y, Boolean(e.data.hoverState));
      }
    });

    function updateCursor() {
      if (cursor) {
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
      }

      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (cursorRing) {
        cursorRing.style.transform = `translate(${ringX - mouseX}px, ${ringY - mouseY}px)`;
      }

      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    function attachHoverListeners() {
      const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"], .nav-links a, .nav-brand');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
    }

    attachHoverListeners();
    const observer = new MutationObserver(attachHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
  } else {
    initCursor();
  }
})();
