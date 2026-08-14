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
    const carVideo = document.getElementById('car-video');
    const carGif = document.getElementById('car-gif');
    const posterCanvas = document.getElementById('car-poster-canvas');
    const videoSrc = 'bmwgif.mp4';
    const gifSrc = 'bmwgif.gif';

    if (carVideo) {
      carVideo.src = videoSrc;
      carVideo.preload = 'auto';
    }
    if (carGif) {
      carGif.src = gifSrc;
    }

    if (posterCanvas) {
      const renderPosterFrame = (source) => {
        const ctx = posterCanvas.getContext('2d');
        if (!ctx) return;
        posterCanvas.width = source.videoWidth || source.naturalWidth || 900;
        posterCanvas.height = source.videoHeight || source.naturalHeight || 450;
        try {
          ctx.drawImage(source, 0, 0, posterCanvas.width, posterCanvas.height);
        } catch (e) {}
      };

      if (carVideo) {
        carVideo.onloadeddata = () => renderPosterFrame(carVideo);
        carVideo.onseeked = () => renderPosterFrame(carVideo);
        carVideo.currentTime = 0.1;
      }

      const img = new Image();
      img.src = gifSrc;
      img.onload = () => renderPosterFrame(img);
    }
  }

  initIgniteButton() {
    const igniteBtn = document.getElementById('ignite-engine-btn');
    const statusText = document.getElementById('engine-status-text');
    const carVideo = document.getElementById('car-video');
    const carGif = document.getElementById('car-gif');
    const posterCanvas = document.getElementById('car-poster-canvas');

    if (!igniteBtn) return;

    igniteBtn.addEventListener('click', () => {
      this.isIgnited = !this.isIgnited;

      if (this.isIgnited) {
        if (posterCanvas) posterCanvas.style.display = 'none';

        // Play audio engine sound synthesis if available
        if (window.soundEngine && typeof window.soundEngine.playEngineRev === 'function') {
          window.soundEngine.playEngineRev();
        }

        // Trigger WebGL particles engine pulse
        if (this.scene && typeof this.scene.triggerEngineIgnition === 'function') {
          this.scene.triggerEngineIgnition();
        }

        // Play video directly without reloading src
        if (carVideo) {
          carVideo.style.display = 'block';
          carVideo.currentTime = 0;
          const playPromise = carVideo.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                if (carGif) carGif.style.display = 'none';
              })
              .catch(() => {
                if (carGif) {
                  carGif.style.display = 'block';
                  carGif.style.opacity = '1';
                }
              });
          }
        } else if (carGif) {
          carGif.style.display = 'block';
          carGif.style.opacity = '1';
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
        // Return to standby
        if (carVideo) {
          try {
            carVideo.pause();
          } catch (e) {}
          carVideo.style.display = 'none';
        }

        if (carGif) {
          carGif.style.display = 'none';
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
