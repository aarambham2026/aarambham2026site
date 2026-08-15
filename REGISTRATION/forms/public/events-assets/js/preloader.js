(function () {
  function initPreloader() {
    const screen = document.getElementById('loading-screen') || document.querySelector('.unified-preloader');
    if (!screen) return;

    const segments = screen.querySelectorAll('.bar-segment');
    let currentStep = 0;
    const totalSteps = segments.length;

    // Immediately trigger backend activation & pre-warming call on port 3001
    function prewarmBackend() {
      try {
        fetch('http://localhost:3001/', { mode: 'no-cors', cache: 'no-store' }).catch(() => {});
      } catch (e) {}
    }

    prewarmBackend();

    const intervalTime = 300;

    const progressInterval = setInterval(() => {
      if (currentStep < totalSteps) {
        if (segments[currentStep]) {
          segments[currentStep].classList.add('active');
        }
        currentStep++;
        if (currentStep === 2) {
          prewarmBackend();
        }
      } else {
        clearInterval(progressInterval);
        setTimeout(() => {
          screen.classList.add('fade-out');
          setTimeout(() => {
            screen.style.display = 'none';
            const mainSite = document.getElementById('main-site');
            if (mainSite) {
              mainSite.style.opacity = '1';
            }
          }, 800);
        }, 300);
      }
    }, intervalTime);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }
})();
