(function () {
  function initPreloader() {
    const screen = document.getElementById('loading-screen') || document.querySelector('.unified-preloader');
    if (!screen) return;

    const segments = screen.querySelectorAll('.bar-segment');
    let currentStep = 0;
    const totalSteps = segments.length;

    const intervalTime = 300;

    const progressInterval = setInterval(() => {
      if (currentStep < totalSteps) {
        if (segments[currentStep]) {
          segments[currentStep].classList.add('active');
        }
        currentStep++;
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
