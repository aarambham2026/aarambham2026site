/**
 * ============================================================
 *  THAKRITHI BEFORE/AFTER SPLIT SLIDER CONTROLLER
 *  Features: Pointer Capture, Container-Relative Math,
 *  Touch Support, Click-to-Position & Keyboard Accessibility.
 * ============================================================
 */

class ExperienceSlider {
  constructor(onUpdateCallback) {
    this.currentSplitPos = 0.5; // 50% split default
    this.targetSplitPos = 0.5;
    this.isDragging = false;
    this.activePointerId = null;
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

    if (this.sliderHandle) {
      this.sliderHandle.setAttribute('role', 'slider');
      this.sliderHandle.setAttribute('tabindex', '0');
      this.sliderHandle.setAttribute('aria-label', 'Before and After Image Split Slider');
      this.sliderHandle.setAttribute('aria-valuenow', '50');
      this.sliderHandle.setAttribute('aria-valuemin', '0');
      this.sliderHandle.setAttribute('aria-valuemax', '100');
    }
  }

  bindEvents() {
    if (!this.sliderBar) return;

    const startDrag = (e) => {
      this.isDragging = true;
      this.activePointerId = e.pointerId;

      if (e.target && typeof e.target.setPointerCapture === 'function' && e.pointerId !== undefined) {
        try {
          e.target.setPointerCapture(e.pointerId);
        } catch (err) {}
      } else if (this.sliderBar && typeof this.sliderBar.setPointerCapture === 'function' && e.pointerId !== undefined) {
        try {
          this.sliderBar.setPointerCapture(e.pointerId);
        } catch (err) {}
      }

      this.handleDrag(e.clientX);
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    };

    const doDrag = (e) => {
      if (!this.isDragging) return;
      this.handleDrag(e.clientX);
    };

    const stopDrag = (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;

      if (e && e.target && typeof e.target.releasePointerCapture === 'function' && e.pointerId !== undefined) {
        try {
          e.target.releasePointerCapture(e.pointerId);
        } catch (err) {}
      }
      this.activePointerId = null;
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };

    // 1. Unified Pointer Events (Mouse, Touch, Pen)
    this.sliderBar.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      startDrag(e);
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isDragging) {
        doDrag(e);
      }
    }, { passive: true });

    window.addEventListener('pointerup', stopDrag, { passive: true });
    window.addEventListener('pointercancel', stopDrag, { passive: true });

    // 2. Touch Event Fallback for Older Browsers
    const getTouchX = (e) => {
      if (e.touches && e.touches.length > 0) return e.touches[0].clientX;
      if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0].clientX;
      return e.clientX;
    };

    this.sliderBar.addEventListener('touchstart', (e) => {
      this.isDragging = true;
      this.handleDrag(getTouchX(e));
      document.body.style.userSelect = 'none';
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging) {
        this.handleDrag(getTouchX(e));
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
      document.body.style.userSelect = '';
    }, { passive: true });

    // 3. Click-to-Position on Slider Bar or Container
    if (this.container) {
      this.container.addEventListener('click', (e) => {
        const target = e.target;
        // Do not intercept clicks on interactive cards, buttons, modals, or navbar links
        if (
          target &&
          target.closest &&
          (target.closest('.event-card') ||
            target.closest('.navbar') ||
            target.closest('#ignite-engine-btn') ||
            target.closest('.modal-card') ||
            target.closest('.modal-overlay') ||
            target.closest('a') ||
            target.closest('button'))
        ) {
          return;
        }

        // Calculate click position relative to slider container
        const rect = this.container.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        let normVal = relativeX / rect.width;
        normVal = Math.max(0, Math.min(1, normVal));

        this.targetSplitPos = normVal;
        this.currentSplitPos = normVal;
        this.updateUI(normVal);
        if (this.onUpdate) {
          this.onUpdate(normVal);
        }
      });
    }

    // 4. Keyboard Accessibility Support (ArrowLeft, ArrowRight, Home, End)
    if (this.sliderHandle) {
      this.sliderHandle.addEventListener('keydown', (e) => {
        let delta = 0;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          delta = -0.02; // Move left 2%
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          delta = 0.02; // Move right 2%
        } else if (e.key === 'Home') {
          this.targetSplitPos = 0;
          this.currentSplitPos = 0;
          this.updateUI(0);
          if (this.onUpdate) this.onUpdate(0);
          e.preventDefault();
          return;
        } else if (e.key === 'End') {
          this.targetSplitPos = 1;
          this.currentSplitPos = 1;
          this.updateUI(1);
          if (this.onUpdate) this.onUpdate(1);
          e.preventDefault();
          return;
        }

        if (delta !== 0) {
          let newVal = this.currentSplitPos + delta;
          newVal = Math.max(0, Math.min(1, newVal));
          this.targetSplitPos = newVal;
          this.currentSplitPos = newVal;
          this.updateUI(newVal);
          if (this.onUpdate) this.onUpdate(newVal);
          e.preventDefault();
        }
      });
    }
  }

  handleDrag(clientX) {
    if (typeof clientX !== 'number' || isNaN(clientX)) return;

    const rect = this.container ? this.container.getBoundingClientRect() : { left: 0, width: window.innerWidth };
    const relativeX = clientX - rect.left;
    let normVal = relativeX / rect.width;

    // Clamp normalized position strictly between 0 and 1 (0% to 100%)
    normVal = Math.max(0, Math.min(1, normVal));

    this.targetSplitPos = normVal;
    this.currentSplitPos = normVal; // Immediate responsive feedback
    this.updateUI(normVal);

    if (this.onUpdate) {
      this.onUpdate(normVal);
    }
  }

  startAnimationLoop() {
    const loop = () => {
      const diff = this.targetSplitPos - this.currentSplitPos;
      if (Math.abs(diff) > 0.0001) {
        this.currentSplitPos += diff * 0.3;
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
    const pct = (val * 100).toFixed(2);
    document.documentElement.style.setProperty('--split-pos', `${pct}%`);

    if (this.sliderHandle) {
      this.sliderHandle.setAttribute('aria-valuenow', Math.round(val * 100).toString());
    }

    if (val > 0.5) {
      document.documentElement.style.setProperty('--theme-color', '#f59e0b');
    } else {
      document.documentElement.style.setProperty('--theme-color', '#e11d48');
    }
  }
}
