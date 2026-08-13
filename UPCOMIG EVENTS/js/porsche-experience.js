/**
 * ============================================================
 *  ONAM -> PORSCHE MICROSITE — INSTANT PORSCHE IGNITION
 *  (No 3s timer delay)
 * ============================================================
 */

class PorscheExperience {
  constructor(threeScene) {
    this.scene = threeScene;
    this.isIgnited = false;

    this.initCarDisplay();
    this.initIgniteButton();
  }

  initCarDisplay() {
    const carGif = document.getElementById('car-gif');
    const posterCanvas = document.getElementById('car-poster-canvas');
    const gifSrc = 'Caranimation-ezgif.com-censor.gif';

    if (carGif && posterCanvas) {
      // Draw first frame onto poster canvas for static standby
      const img = new Image();
      img.src = gifSrc;
      img.onload = () => {
        const ctx = posterCanvas.getContext('2d');
        posterCanvas.width = img.naturalWidth || 900;
        posterCanvas.height = img.naturalHeight || 450;
        ctx.drawImage(img, 0, 0, posterCanvas.width, posterCanvas.height);
      };
    }
  }

  initIgniteButton() {
    const igniteBtn = document.getElementById('ignite-engine-btn');
    const statusText = document.getElementById('engine-status-text');
    const carGif = document.getElementById('car-gif');
    const posterCanvas = document.getElementById('car-poster-canvas');
    const gifSrc = 'Caranimation-ezgif.com-censor.gif';

    if (!igniteBtn) return;

    igniteBtn.addEventListener('click', () => {
      this.isIgnited = !this.isIgnited;

      if (this.isIgnited) {
        // INSTANTLY START GIF ANIMATION ON CLICK (NO 3s DELAY)
        if (posterCanvas) posterCanvas.style.display = 'none';

        if (carGif) {
          carGif.style.display = 'block';
          carGif.style.opacity = '1';
          carGif.src = `${gifSrc}?t=${Date.now()}`;
        }

        if (this.scene) {
          this.scene.triggerEngineIgnition();
        }

        igniteBtn.classList.add('ignited');
        igniteBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          ENGINE ONLINE
        `;
        if (statusText) {
          statusText.textContent = 'ENGINE ONLINE · ANIMATION PLAYING';
          statusText.style.color = '#86efac';
        }

      } else {
        // INSTANTLY RESET TO STANDBY
        if (carGif) {
          carGif.style.display = 'none';
          carGif.src = '';
        }

        if (posterCanvas) {
          posterCanvas.style.display = 'block';
          posterCanvas.style.opacity = '1';
        }

        igniteBtn.classList.remove('ignited');
        igniteBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
          IGNITE THE ENGINE
        `;
        if (statusText) {
          statusText.textContent = 'STATUS: STANDBY · PRESS BUTTON TO START ANIMATION';
          statusText.style.color = 'rgba(255,255,255,0.7)';
        }
      }
    });
  }
}
