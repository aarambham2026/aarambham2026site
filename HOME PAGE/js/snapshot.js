/* ============================================================
   ONAM FEST — SNAPSHOT FILM ROLLS & LIGHTBOX
   ============================================================ */

(function () {
  const snapshots = (window.eventData && eventData.snapshots) ? eventData.snapshots : [];

  // Create Lightbox DOM structure if missing
  function getOrCreateLightbox() {
    let lightbox = document.getElementById('snapshot-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'snapshot-lightbox';
      lightbox.className = 'snapshot-lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-backdrop"></div>
        <div class="lightbox-content">
          <button class="lightbox-close" aria-label="Close photo preview">✕</button>
          <img class="lightbox-img" src="" alt="Enlarged Onam photo" />
          <div class="lightbox-caption">Onam Celebration Snapshot</div>
        </div>
      `;
      document.body.appendChild(lightbox);

      // Event listeners to close
      lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
      lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
      });
    }
    return lightbox;
  }

  function openLightbox(src, title) {
    const lb = getOrCreateLightbox();
    const img = lb.querySelector('.lightbox-img');
    const caption = lb.querySelector('.lightbox-caption');
    img.src = src;
    caption.textContent = title || 'Onam Celebration Snapshot';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const lb = document.getElementById('snapshot-lightbox');
    if (lb) lb.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Build individual photo frame
  function makeFrame(src, idx) {
    const frame = document.createElement('div');
    frame.className = 'film-frame';

    if (src) {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Onam snapshot photo ${idx + 1}`;
      img.loading = 'lazy';

      // Click to open lightbox
      frame.addEventListener('click', () => {
        openLightbox(src, `Onam Memory #${(idx % snapshots.length) + 1}`);
      });

      frame.appendChild(img);
    }
    return frame;
  }

  // Distribute across 3 film strip columns
  function distributeImages(arr, colsCount) {
    const result = Array.from({ length: colsCount }, () => []);
    if (arr.length === 0) return result;

    arr.forEach((item, i) => {
      result[i % colsCount].push(item);
    });
    return result;
  }

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

  function buildFilmStrip(containerId, images, direction, duration) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const [leftEdge, rightEdge] = makeSprockets(30);
    container.appendChild(leftEdge);
    container.appendChild(rightEdge);

    const track = document.createElement('div');
    track.className = `film-track ${direction === 'up' ? 'scroll-up' : 'scroll-down'}`;
    track.style.setProperty('--scroll-duration', `${duration}s`);

    // Duplicate images for infinite seamless loop animation
    const duplicated = [...images, ...images, ...images];
    duplicated.forEach((src, i) => {
      track.appendChild(makeFrame(src, i));
    });

    container.appendChild(track);
  }

  // Initialize columns
  const cols = distributeImages(snapshots, 3);

  buildFilmStrip('film-col-1', cols[0], 'down', 28);
  buildFilmStrip('film-col-2', cols[1], 'up',   24);
  buildFilmStrip('film-col-3', cols[2], 'down', 30);
})();
