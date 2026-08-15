/**
 * ============================================================
 *  ONAM -> BMW M5 MICROSITE — SPLIT PORTAL SLIDER CONTROLLER
 *  High-Performance Container-Relative Drag & Touch Controller
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
    this.container = document.querySelector('.portal-container') || document.body;
    this.sliderBar = document.getElementById('portal-slider-bar');
    this.sliderHandle = document.getElementById('portal-slider-handle');
    this.onamWorld = document.getElementById('onam-world');
    this.porscheWorld = document.getElementById('porsche-world');

    // Ensure ONAM panel does not contain any link or redirect click behavior
    if (this.onamWorld) {
      this.onamWorld.addEventListener('click', (e) => {
        // Prevent any unexpected parent anchor or redirect
        const target = e.target;
        if (target && target.closest && target.closest('.event-card')) {
          // Event cards trigger modal popups via EventSystem, not redirects
          return;
        }
      });
    }
  }

  bindEvents() {
    if (!this.sliderBar) return;

    const getClientX = (e) => {
      if (e.touches && e.touches.length > 0) {
        return e.touches[0].clientX;
      }
      if (e.changedTouches && e.changedTouches.length > 0) {
        return e.changedTouches[0].clientX;
      }
      return e.clientX;
    };

    const startDrag = (e) => {
      this.isDragging = true;
      this.handleDrag(getClientX(e));
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    };

    const doDrag = (e) => {
      if (!this.isDragging) return;
      this.handleDrag(getClientX(e));
    };

    const stopDrag = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };

    // Pointer Events (Unified Mouse, Touch, Pen)
    this.sliderBar.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      startDrag(e);
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isDragging) doDrag(e);
    }, { passive: true });

    window.addEventListener('pointerup', stopDrag, { passive: true });
    window.addEventListener('pointercancel', stopDrag, { passive: true });

    // Touch Events Fallback
    this.sliderBar.addEventListener('touchstart', (e) => {
      startDrag(e);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging) doDrag(e);
    }, { passive: true });

    window.addEventListener('touchend', stopDrag, { passive: true });

    // Mouse Events Fallback
    this.sliderBar.addEventListener('mousedown', (e) => {
      startDrag(e);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) doDrag(e);
    }, { passive: true });

    window.addEventListener('mouseup', stopDrag, { passive: true });

    // Click anywhere on portal container to move split smoothly
    if (this.container) {
      this.container.addEventListener('click', (e) => {
        const target = e.target;
        if (target && target.closest && (target.closest('.event-card') || target.closest('.navbar') || target.closest('#ignite-engine-btn') || target.closest('.modal-card') || target.closest('.modal-overlay'))) {
          return;
        }
        if (target === this.sliderBar || (this.sliderHandle && this.sliderHandle.contains(target))) {
          return;
        }
      });
    }
  }

  handleDrag(clientX) {
    if (typeof clientX !== 'number' || isNaN(clientX)) return;

    const rect = this.container ? this.container.getBoundingClientRect() : { left: 0, width: window.innerWidth };
    const relativeX = clientX - rect.left;
    let normVal = relativeX / rect.width;
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
