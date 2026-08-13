/* ============================================================
   ONAM FEST — DYNAMIC SECTIONS (Events, Register, Coordinators)
   Reads from window.eventData
   ============================================================ */

(function () {
  const data = window.eventData || {};
  if (!data.upcomingEvents && !data.coordinators) return;

  // ── UPCOMING EVENTS ───────────────────────────────────────
  const eventsGrid = document.getElementById('events-grid');
  if (eventsGrid && data.upcomingEvents) {
    data.upcomingEvents.forEach((ev, i) => {
      const card = document.createElement('div');
      card.className = 'event-card reveal';
      card.style.transitionDelay = `${i * 0.08}s`;
      card.innerHTML = `
        <span class="event-category">${ev.category || 'Event'}</span>
        <h3 class="event-name">${ev.name}</h3>
        <div class="event-meta">
          <div class="event-meta-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            ${ev.date}
          </div>
          <div class="event-meta-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            ${ev.time}
          </div>
          <div class="event-meta-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${ev.venue}
          </div>
        </div>
        <p class="event-desc">${ev.description}</p>
        <a href="#register" class="btn-outline" onclick="event.preventDefault(); document.querySelector('#register').scrollIntoView({behavior:'smooth'})">
          Register →
        </a>
      `;
      eventsGrid.appendChild(card);
    });
  }

  // ── COORDINATORS ──────────────────────────────────────────
  const coordGrid = document.getElementById('coordinators-grid');
  if (coordGrid && data.coordinators) {
    data.coordinators.forEach((coord, i) => {
      const card = document.createElement('div');
      card.className = 'coord-card reveal';
      card.style.transitionDelay = `${i * 0.08}s`;

      const photoHtml = coord.photo
        ? `<img class="coord-photo" src="${coord.photo}" alt="${coord.name}" loading="lazy">`
        : `<div class="coord-photo-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
           </div>`;

      const socialsHtml = (coord.instagram || coord.linkedin) ? `
        <div class="coord-socials">
          ${coord.instagram ? `<a href="${coord.instagram}" class="coord-social-link" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>` : ''}
          ${coord.linkedin ? `<a href="${coord.linkedin}" class="coord-social-link" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>` : ''}
        </div>` : '';

      card.innerHTML = `
        <div class="coord-photo-wrap">
          <div class="coord-photo-ring"></div>
          ${photoHtml}
        </div>
        <div class="coord-name">${coord.name}</div>
        <div class="coord-position">${coord.position}</div>
        <div class="coord-dept">${coord.department}</div>
        ${socialsHtml}
      `;
      coordGrid.appendChild(card);
    });
  }

  // ── REGISTER FORM ─────────────────────────────────────────
  const eventSelect = document.getElementById('reg-event');
  if (eventSelect && data.upcomingEvents) {
    data.upcomingEvents.forEach(ev => {
      const opt = document.createElement('option');
      opt.value = ev.name;
      opt.textContent = ev.name;
      eventSelect.appendChild(opt);
    });
  }

  const form = document.getElementById('register-form');
  const successEl = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      let valid = true;
      const required = form.querySelectorAll('[required]');
      required.forEach(field => {
        const err = field.parentElement.querySelector('.form-error-msg');
        if (!field.value.trim()) {
          field.classList.add('error');
          if (err) err.textContent = 'This field is required';
          valid = false;
        } else {
          field.classList.remove('error');
          field.classList.add('valid');
          if (err) err.textContent = '';
        }
      });

      // Email validation
      const emailField = document.getElementById('reg-email');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.classList.add('error');
        const err = emailField.parentElement.querySelector('.form-error-msg');
        if (err) err.textContent = 'Enter a valid email address';
        valid = false;
      }

      if (!valid) return;

      // ── Connect your backend here ──────────────────────────
      // Example: fetch('/api/register', { method: 'POST', body: new FormData(form) })
      // Or: emailjs.send(...), Formspree, Google Apps Script, etc.
      // ──────────────────────────────────────────────────────

      // Show success state
      form.style.display = 'none';
      if (successEl) {
        successEl.classList.add('show');
      }
    });

    // Live validation on blur
    form.querySelectorAll('.form-input, .form-select').forEach(field => {
      field.addEventListener('blur', function () {
        if (this.value.trim()) {
          this.classList.remove('error');
          this.classList.add('valid');
        }
      });
      field.addEventListener('input', function () {
        if (this.classList.contains('error') && this.value.trim()) {
          this.classList.remove('error');
          const err = this.parentElement.querySelector('.form-error-msg');
          if (err) err.textContent = '';
        }
      });
    });
  }

})();
