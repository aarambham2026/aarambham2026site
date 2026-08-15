/**
 * ============================================================
 *  ONAM -> BMW M5 MICROSITE — INSTANT BMW M5 IGNITION & MEDIA
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
    const videoSrc = '/events-assets/bmwgif.mp4';
    const gifSrc = '/events-assets/bmwgif.gif';

    if (carVideo) {
      carVideo.src = videoSrc;
      carVideo.preload = 'auto';
      carVideo.style.display = 'block';

      // Play muted autoplay loop immediately so the media box is NEVER black
      const playPromise = carVideo.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (carGif) carGif.style.display = 'none';
          })
          .catch(() => {
            // Fallback to animated GIF if video autoplay is restricted
            if (carGif) {
              carGif.src = gifSrc;
              carGif.style.display = 'block';
            }
          });
      }
    } else if (carGif) {
      carGif.src = gifSrc;
      carGif.style.display = 'block';
    }
  }

  initIgniteButton() {
    const igniteBtn = document.getElementById('ignite-engine-btn');
    const statusText = document.getElementById('engine-status-text');
    const carVideo = document.getElementById('car-video');
    const carGif = document.getElementById('car-gif');

    if (!igniteBtn) return;

    igniteBtn.addEventListener('click', () => {
      this.isIgnited = !this.isIgnited;

      if (this.isIgnited) {
        // Play audio engine sound synthesis if available
        if (window.soundEngine && typeof window.soundEngine.playEngineRev === 'function') {
          window.soundEngine.playEngineRev();
        }

        // Trigger WebGL particles engine pulse
        if (this.scene && typeof this.scene.triggerEngineIgnition === 'function') {
          this.scene.triggerEngineIgnition();
        }

        // Start video playback on IGNITE click
        if (carVideo) {
          carVideo.style.display = 'block';
          carVideo.muted = false;
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
        if (carVideo) {
          carVideo.muted = true;
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
          statusText.textContent = 'STATUS: STANDBY · PRESS BUTTON TO START ANIMATION & ENGINE';
          statusText.style.color = 'rgba(255,255,255,0.7)';
        }
      }
    });
  }
}
