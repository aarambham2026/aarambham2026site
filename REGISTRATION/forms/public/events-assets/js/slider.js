/**
 * ============================================================
 *  ONAM -> PORSCHE MICROSITE — SPLIT PORTAL SLIDER CONTROLLER
 *  Reference: Upside Down Split Portal Interaction (makeaton.in)
 * ============================================================
 */

class ExperienceSlider {
  constructor(onUpdateCallback) {
    this.currentSplitPos = 0.5; // 0.5 = 50% split
    this.targetSplitPos = 0.5;
    this.isDragging = false;
    this.onUpdate = onUpdateCallback;

    this.initElements();
    this.bindEvents();
    this.startAnimationLoop();
  }

  initElements() {
    this.sliderBar = document.getElementById('portal-slider-bar');
    this.sliderHandle = document.getElementById('portal-slider-handle');
    this.onamWorld = document.getElementById('onam-world');
    this.porscheWorld = document.getElementById('porsche-world');
  }

  bindEvents() {
    if (!this.sliderBar) return;

    const startDrag = (e) => {
      this.isDragging = true;
      this.handleDrag(e);
      document.body.style.userSelect = 'none';
    };

    const doDrag = (e) => {
      if (!this.isDragging) return;
      this.handleDrag(e);
    };

    const stopDrag = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      document.body.style.userSelect = '';
    };

    this.sliderBar.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', doDrag, { passive: true });
    window.addEventListener('mouseup', stopDrag);

    // Touch support for mobile
    this.sliderBar.addEventListener('touchstart', (e) => startDrag(e.touches[0]), { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (this.isDragging) doDrag(e.touches[0]);
    }, { passive: true });
    window.addEventListener('touchend', stopDrag);
  }

  handleDrag(e) {
    let normVal = e.clientX / window.innerWidth;
    normVal = Math.max(0.01, Math.min(0.99, normVal));
    this.targetSplitPos = normVal;
  }

  startAnimationLoop() {
    const loop = () => {
      const diff = this.targetSplitPos - this.currentSplitPos;
      if (Math.abs(diff) > 0.0001) {
        this.currentSplitPos += diff * 0.25;
        this.updateUI(this.currentSplitPos);
        if (this.onUpdate) {
          this.onUpdate(this.currentSplitPos);
        }
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  updateUI(val) {
    const pct = val * 100;
    document.documentElement.style.setProperty('--split-pos', `${pct}%`);

    if (val > 0.5) {
      document.documentElement.style.setProperty('--theme-color', '#f59e0b');
    } else {
      document.documentElement.style.setProperty('--theme-color', '#e11d48');
    }
  }
}
