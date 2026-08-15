/**
 * ============================================================
 *  ONAM 2026 -> PORSCHE MICROSITE — AMBIENT BACKGROUND CANVAS
 * ============================================================
 */

class DualWorldScene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.splitPos = 0.5; // 0 = Porsche, 1 = Onam
    this.targetSplitPos = 0.5;
    this.mouseX = 0;
    this.mouseY = 0;
    this.ignitionPulse = 0;
    this.isTabActive = true;

    this.initScene();
    this.createAmbientParticles();
    this.addEventListeners();
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050507);
    this.scene.fog = new THREE.FogExp2(0x050507, 0.06);

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      500
    );
    this.camera.position.set(0, 0, 10);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  }

  createAmbientParticles() {
    this.particleCount = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    this.particleVelocities = [];

    const goldColor = new THREE.Color(0xf59e0b);

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      colors[i * 3] = goldColor.r;
      colors[i * 3 + 1] = goldColor.g;
      colors[i * 3 + 2] = goldColor.b;

      this.particleVelocities.push({
        x: (Math.random() - 0.5) * 0.008,
        y: Math.random() * 0.01 + 0.003,
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(geometry, particleMat);
    this.scene.add(this.particles);
  }

  triggerEngineIgnition() {
    this.ignitionPulse = 1.0;
  }

  setCarColor(hex) {
    // Handled by UI themes
  }

  setProgress(val) {
    this.targetSplitPos = Math.max(0, Math.min(1, val));
  }

  addEventListeners() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.addEventListener('visibilitychange', () => {
      this.isTabActive = !document.hidden;
    });

    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.isTabActive) return;

    this.splitPos += (this.targetSplitPos - this.splitPos) * 0.1;

    // Particle color morphing between gold and red based on split
    const positions = this.particles.geometry.attributes.position.array;
    const colors = this.particles.geometry.attributes.color.array;
    const gold = new THREE.Color(0xf59e0b);
    const red = new THREE.Color(0xe11d48);

    const activeColor = gold.clone().lerp(red, 1 - this.splitPos);

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3 + 1] += this.particleVelocities[i].y * (1 + this.ignitionPulse * 3);
      if (positions[i * 3 + 1] > 10) positions[i * 3 + 1] = -10;

      colors[i * 3] = activeColor.r;
      colors[i * 3 + 1] = activeColor.g;
      colors[i * 3 + 2] = activeColor.b;
    }

    this.particles.geometry.attributes.position.needsUpdate = true;
    this.particles.geometry.attributes.color.needsUpdate = true;

    if (this.ignitionPulse > 0) {
      this.ignitionPulse -= 0.03;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
