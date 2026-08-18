/**
 * ============================================================
 *  ONAM -> PORSCHE MICROSITE — 3D EVENT CARDS SYSTEM
 * ============================================================
 */

const eventDataLineup = [
  {
    id: 'dance',
    category: 'Cultural Showcase',
    name: 'DANCE SPECTACLE',
    shortDesc: 'Graceful Thiruvathira, classical Kathakali & energetic fusion showcases.',
    fullDesc: 'Experience the rhythmic soul of Kerala! Featuring classical Kathakali story-dances and electrifying group Thiruvathira performances by university departments.',
    date: 'August 22, 2026',
    time: '10:00 AM - 01:00 PM',
    venue: 'Civil Hall Auditorium',
    rules: [],
  },
  {
    id: 'music',
    category: 'Live Performances',
    name: 'MUSIC & RHYTHMS',
    shortDesc: 'Live campus orchestral fusion, Chenda Melam & DJ.',
    fullDesc: 'Experience the vibrant energy of Shinkari Melam, soulful Carnatic fusion vocals, and an electrifying celebration of tradition and modern spirit.',
    date: 'August 22, 2026',
    time: '02:00 PM - 05:00 PM',
    venue: 'Civil Block Auditorium',
    rules: [],
  },
  {
    id: 'games',
    category: 'Interactive Competitions',
    name: 'ONAM GAMES & ARENA',
    shortDesc: 'Traditional Tug-of-War (Vadamvali), Uriyadi & Onam games.',
    fullDesc: 'Brace yourself for high-energy campus sports! Test your team muscle in Vadamvali (Tug of War), blindfolded pot breaking (Uriyadi), and traditional Kerala Games.',
    date: 'August 22, 2026',
    time: '11:30 AM - 03:00 PM',
    venue: 'Playground',
    rules: [],
  },
  {
    id: 'cultural',
    category: 'Arts & Heritage',
    name: 'POOKALAM & ARTS',
    shortDesc: 'Floral art design competitions & traditional craft exhibits.',
    fullDesc: 'Watch the campus courtyard transform into a kaleidoscope of fresh flower petals in the annual Inter-Department Pookalam Championship.',
    date: 'August 22, 2026',
    time: '08:00 AM - 12:00 PM',
    venue: 'School of Computing and Civil Block',
    rules: [],
  },
];

class EventSystem {
  constructor() {
    this.gridContainer = document.getElementById('events-grid');
    this.modalOverlay = document.getElementById('event-modal-overlay');
    this.modalCard = document.getElementById('event-modal-card');
    
    this.renderCards();
    this.bindCardInteractions();
    this.bindModalEvents();
    this.fetchLiveSettings();
  }

  async fetchLiveSettings() {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const s = json.data;
          let [h, m] = (s.eventStartTime || '14:00').split(':').map(Number);
          const formatTime = (hour, min) => {
            const period = hour >= 12 ? 'PM' : 'AM';
            const h12 = hour % 12 || 12;
            const mStr = min < 10 ? '0' + min : min;
            return `${h12 < 10 ? '0' + h12 : h12}:${mStr} ${period}`;
          };

          const danceStartMin = h * 60 + m;
          const danceEndMin = danceStartMin + 120;
          const musicStartMin = danceEndMin + (s.setupGap || 15);
          const musicEndMin = musicStartMin + 180;

          const danceEv = eventDataLineup.find((e) => e.id === 'dance');
          if (danceEv) {
            danceEv.time = `${formatTime(Math.floor(danceStartMin / 60), danceStartMin % 60)} - ${formatTime(Math.floor(danceEndMin / 60), danceEndMin % 60)}`;
          }

          const musicEv = eventDataLineup.find((e) => e.id === 'music');
          if (musicEv) {
            musicEv.time = `${formatTime(Math.floor(musicStartMin / 60), musicStartMin % 60)} - ${formatTime(Math.floor(musicEndMin / 60), musicEndMin % 60)}`;
          }

          this.renderCards();
          this.bindCardInteractions();
        }
      }
    } catch (e) {
      console.warn('Could not fetch live event settings:', e);
    }
  }

  renderCards() {
    if (!this.gridContainer) return;

    this.gridContainer.innerHTML = eventDataLineup.map((ev) => `
      <div class="event-card" data-id="${ev.id}">
        <span class="event-tag">${ev.category}</span>
        <h3 class="event-name">${ev.name}</h3>
        <p class="event-desc">${ev.shortDesc}</p>
        <div class="event-meta">
          <span>${ev.date}</span>
          <span class="event-action">EXPLORE &rarr;</span>
        </div>
      </div>
    `).join('');
  }

  bindCardInteractions() {
    const cards = document.querySelectorAll('.event-card');
    cards.forEach((card) => {
      let isHovering = false;
      let animationFrameId = null;

      card.addEventListener('mousemove', (e) => {
        if (!isHovering) isHovering = true;
        
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        
        animationFrameId = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -10;
          const rotateY = ((x - centerX) / centerX) * 10;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        isHovering = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });

      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const ev = eventDataLineup.find((item) => item.id === id);
        if (ev) this.openModal(ev);
      });
    });
  }

  openModal(ev) {
    if (!this.modalOverlay || !this.modalCard) return;

    this.modalCard.innerHTML = `
      <button class="modal-close" id="modal-close-btn">&times;</button>
      <span class="event-tag">${ev.category}</span>
      <h2 style="font-family: var(--font-serif-luxury); font-size: 2.2rem; color: #fff; margin: 0.5rem 0 1rem 0;">${ev.name}</h2>
      <p style="font-size: 1rem; line-height: 1.6; color: rgba(255,255,255,0.85); margin-bottom: 1.5rem;">${ev.fullDesc}</p>
      
      <div style="background: rgba(255,255,255,0.06); padding: 1.25rem; border-radius: 12px; margin-bottom: 1.5rem; border: 1px solid rgba(255,255,255,0.12);">
        <p style="font-size: 0.85rem; color: #ffc4b8; margin-bottom: 0.4rem;"><strong>DATE:</strong> ${ev.date}</p>
        <p style="font-size: 0.85rem; color: #fff;"><strong>VENUE:</strong> ${ev.venue}</p>
      </div>

      ${ev.rules && ev.rules.length > 0 ? `
        <h4 style="font-family: var(--font-tech); font-size: 0.8rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.7); margin-bottom: 0.75rem; text-transform: uppercase;">Guidelines & Rules</h4>
        <ul style="list-style: disc; padding-left: 1.2rem; color: rgba(255,255,255,0.75); font-size: 0.88rem; margin-bottom: 2rem;">
          ${ev.rules.map((rule) => `<li style="margin-bottom: 0.35rem;">${rule}</li>`).join('')}
        </ul>
      ` : ''}
    `;

    this.modalOverlay.classList.add('active');

    document.getElementById('modal-close-btn')?.addEventListener('click', () => this.closeModal());
  }

  closeModal() {
    if (this.modalOverlay) {
      this.modalOverlay.classList.remove('active');
    }
  }

  bindModalEvents() {
    if (this.modalOverlay) {
      this.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.modalOverlay) this.closeModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
  }
}

if (typeof window !== 'undefined') {
  const initEventSystem = () => {
    if (!window.__eventSystemInstance) {
      window.__eventSystemInstance = new EventSystem();
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventSystem);
  } else {
    initEventSystem();
  }
}
