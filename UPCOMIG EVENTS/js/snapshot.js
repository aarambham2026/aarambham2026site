/* ============================================================
   ONAM FEST — SNAPSHOT FILM ROLLS
   Reads snapshots array from window.eventData
   ============================================================ */

(function () {
  // ── Placeholder colors used when no photos are provided ───
  const PLACEHOLDER_COLORS = [
    '#1a2e22', '#162819', '#1d3424', '#12271d',
    '#0f2019', '#1a2e22', '#162819', '#1d3424',
    '#2a3d2a', '#132218', '#1b3020', '#111f16',
  ];

  const snapshots = (window.eventData && eventData.snapshots) ? eventData.snapshots : [];

  // ── Build photo markup ─────────────────────────────────────
  function makeFrame(src, idx) {
    const frame = document.createElement('div');
    frame.className = 'film-frame';

    if (src) {
      const img = document.createElement('img');
      img.src   = src;
      img.alt   = `Onam snapshot ${idx + 1}`;
      img.loading = 'lazy';
      frame.appendChild(img);
    } else {
      // Colored placeholder tile
      const ph = document.createElement('div');
      ph.className = 'film-frame-placeholder';
      const color = PLACEHOLDER_COLORS[idx % PLACEHOLDER_COLORS.length];
      ph.style.setProperty('--placeholder-color', color);
      ph.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="m21 15-5-5L5 21"/>
        </svg>
        <span>Photo</span>
      `;
      frame.appendChild(ph);
    }
    return frame;
  }

  // ── Distribute images across 3 columns ────────────────────
  function distributeImages(arr, cols) {
    const result = Array.from({ length: cols }, () => []);
    // Ensure enough items by generating placeholders to minimum 12 total
    const minItems = Math.max(arr.length, 12);
    const extended = [];
    for (let i = 0; i < minItems; i++) {
      extended.push(arr[i] || null); // null = placeholder
    }
    extended.forEach((item, i) => {
      result[i % cols].push(item);
    });
    return result;
  }

  // ── Sprocket holes ─────────────────────────────────────────
  function makeSprockets(count) {
    const el = document.createElement('div');
    el.className = 'film-edge-left';
    for (let i = 0; i < count; i++) {
      const s = document.createElement('div');
      s.className = 'sprocket';
      el.appendChild(s);
    }
    const er = el.cloneNode(true);
    er.className = 'film-edge-right';
    return [el, er];
  }

  // ── Build a film strip ─────────────────────────────────────
  function buildFilmStrip(containerId, images, direction, duration) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Create sprocket edges
    const [leftEdge, rightEdge] = makeSprockets(30);
    container.appendChild(leftEdge);
    container.appendChild(rightEdge);

    // Create track
    const track = document.createElement('div');
    track.className = `film-track ${direction === 'up' ? 'scroll-up' : 'scroll-down'}`;
    track.style.setProperty('--scroll-duration', `${duration}s`);

    // Add images × 2 for seamless loop
    const doubled = [...images, ...images];
    doubled.forEach((src, i) => {
      track.appendChild(makeFrame(src, i));
    });

    container.appendChild(track);
  }

  // ── Initialize ─────────────────────────────────────────────
  const cols = distributeImages(snapshots, 3);

  buildFilmStrip('film-col-1', cols[0], 'down', 30);
  buildFilmStrip('film-col-2', cols[1], 'up',   25);
  buildFilmStrip('film-col-3', cols[2], 'down', 28);

})();
