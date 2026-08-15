/* ============================================================
   ONAM FEST — HEADER & SIDEBAR
   ============================================================ */

(function () {
  const header  = document.getElementById('header');
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebar-overlay');
  const menuBtn  = document.getElementById('menu-btn');
  const closeBtn = document.getElementById('sidebar-close');
  const navLinks = document.querySelectorAll('.header-nav a');
  const sideLinks= document.querySelectorAll('.sidebar-nav a');
  const sections = document.querySelectorAll('section[id]');

  // ── Sticky header ─────────────────────────────────────────
  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Active section detection ───────────────────────────────
  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(a => {
      const href = a.getAttribute('href').replace('#', '');
      a.classList.toggle('active', href === current);
    });
  }

  // ── Smooth scroll for all nav links ───────────────────────
  function smoothScrollTo(e) {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeSidebar();
    }
  }

  navLinks.forEach(a => a.addEventListener('click', smoothScrollTo));
  sideLinks.forEach(a => a.addEventListener('click', smoothScrollTo));

  // ── Sidebar open/close ─────────────────────────────────────
  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuBtn)  menuBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay)  overlay.addEventListener('click', closeSidebar);

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSidebar();
  });
})();
