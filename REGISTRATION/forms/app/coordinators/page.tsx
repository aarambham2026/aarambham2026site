'use client';

import React from 'react';
import Script from 'next/script';

export default function CoordinatorsPage() {
  return (
    <>
      {/* Font Awesome & Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />

      {/* Stylesheets */}
      <link rel="stylesheet" href="/coordinators-assets/style.css" />
      <link rel="stylesheet" href="/coordinators-assets/preloader.css" />

      {/* UNIFIED THEYAM PRELOADER */}
      <div id="loading-screen" className="unified-preloader" role="status" aria-label="Loading Onam Cultural Fest Portal">
        <div className="loader-container">
          <div className="loader-art-card">
            <img src="/coordinators-assets/Theyyam stick.gif" alt="Onam Cultural Fest Mascot" className="loader-art-img" />
          </div>
          <div className="loader-university-title">AMRITA VISHWA VIDYAPEETHAM</div>
          <div className="loader-status-wrap">
            <span className="loader-spinner"></span>
            <span className="loader-status-text">LOADING ONAM CULTURAL FEST PORTAL...</span>
          </div>
          <div className="loader-progress-bar">
            <span className="bar-segment"></span>
            <span className="bar-segment"></span>
            <span className="bar-segment"></span>
            <span className="bar-segment"></span>
            <span className="bar-segment"></span>
            <span className="bar-segment"></span>
          </div>
        </div>
      </div>

      {/* Top Navigation Header */}
      <header className="top-navbar">
        <a href="/" className="top-nav-brand">
          <img src="/assets/onam-logo.png" alt="Onam'26 Logo" />
          <span>ONAM '26</span>
        </a>
        <nav className="top-nav-links">
          <a href="/">Home</a>
          <a href="/events">Upcoming Events</a>
          <a href="/registration">Registration</a>
          <a href="/coordinators" className="active">Meet the Coordinators</a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="brand">
          <div className="brand-logo">
            <img src="/assets/onam-logo.png" alt="Onam'26 Logo" />
          </div>
          <div className="brand-line"></div>
          <span>ONAM'26</span>
        </div>

        <div className="hero-content">
          <div className="eyebrow">
            <span className="eyebrow-line"></span>
            THE PEOPLE BEHIND IT ALL
            <span className="eyebrow-line"></span>
          </div>

          <h1>
            The <span className="accent-word">humans</span> behind the curtain
            <br />
          </h1>

          <p className="hero-description">
            Somehow, between google forms, panic, and questionable group chat ideas, we made things happen.
          </p>

          <p className="hero-secondary">
            Would we do it again? <span>...unfortunately, NO.</span>
          </p>

          <div className="hero-divider"></div>

          <p className="hero-connect">
            Want to connect with an organizer that you saw at the Event?<br />
            <span>Well, scroll down. You're welcome.</span>
          </p>
        </div>

        {/* EXPANDABLE MEMORY GALLERY */}
        <div className="memory-gallery-section">
          <div className="photo-label">
            <span className="label-dot"></span>
            ONAM'26 MEMORIES
            <span className="label-dot"></span>
          </div>

          <div className="memory-gallery" id="memoryGallery">
            <img src="/assets/photo-5.jpg" alt="Onam'26 memory 01" loading="eager" />
            <img src="/assets/photo-4.jpg" alt="Onam'26 memory 02" loading="lazy" />
            <img src="/assets/photo-2.jpg" alt="Onam'26 memory 03" loading="lazy" />
            <img src="/assets/photo-1.jpg" alt="Onam'26 memory 04" loading="lazy" />
            <img src="/assets/photo-3.jpg" alt="Onam'26 memory 05" loading="lazy" />
            <img src="/assets/photo-6.jpg" alt="Onam'26 memory 06" loading="lazy" />
            <img src="/assets/photo-7.jpg" alt="Onam'26 memory 07" loading="lazy" />
          </div>

          <div className="memory-gallery-caption">
            <span>HOVER TO EXPAND</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <a href="#team" className="scroll-indicator" aria-label="Scroll to team">
          <span className="scroll-text">SCROLL TO MEET THE COORDINATORS</span>
          <span className="scroll-arrow">
            <i className="fa-solid fa-arrow-down"></i>
          </span>
        </a>
      </section>

      {/* TEAM SECTION */}
      <section className="team-section" id="team">
        <div className="section-heading reveal">
          <div className="section-eyebrow">
            <span></span>
            THE CREW
            <span></span>
          </div>

          <h2>
            Meet The <em>COORDINATORS</em>
          </h2>

          <p>The humans who turned ideas, chaos and caffeine into reality.</p>
        </div>

        {/* TEAM GRID */}
        <div className="team-grid">
          {/* MEMBER 01: Abiram */}
          <article className="team-card reveal" style={{ '--delay': '0s' } as React.CSSProperties}>
            <div className="card-number">01</div>
            <div className="profile-image">
              <img src="/assets/thakirthi_coordinator_photos/Abiram.jpeg" alt="Abiram" loading="lazy" />
              <div className="portrait-overlay"></div>
            </div>
            <div className="member-info">
              <h3>Abiram</h3>
              <p>Event Coordinator</p>
            </div>
            <div className="social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer" className="social instagram" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="social linkedin" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </article>

          {/* MEMBER 02: Adhwaith Ashok */}
          <article className="team-card reveal" style={{ '--delay': '.08s' } as React.CSSProperties}>
            <div className="card-number">02</div>
            <div className="profile-image">
              <img src="/assets/thakirthi_coordinator_photos/Adhwaith_Ashok.jpeg" alt="Adhwaith Ashok" loading="lazy" />
              <div className="portrait-overlay"></div>
            </div>
            <div className="member-info">
              <h3>Adhwaith Ashok</h3>
              <p>Event Coordinator</p>
            </div>
            <div className="social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer" className="social instagram" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="social linkedin" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </article>

          {/* MEMBER 03: Adithyan A */}
          <article className="team-card reveal" style={{ '--delay': '.16s' } as React.CSSProperties}>
            <div className="card-number">03</div>
            <div className="profile-image">
              <img src="/assets/thakirthi_coordinator_photos/Adithyan_A.jpeg" alt="Adithyan A" loading="lazy" />
              <div className="portrait-overlay"></div>
            </div>
            <div className="member-info">
              <h3>Adithyan A</h3>
              <p>Event Coordinator</p>
            </div>
            <div className="social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer" className="social instagram" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="social linkedin" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </article>

          {/* MEMBER 04: Adithyan V Pillai */}
          <article className="team-card reveal" style={{ '--delay': '.24s' } as React.CSSProperties}>
            <div className="card-number">04</div>
            <div className="profile-image">
              <img src="/assets/thakirthi_coordinator_photos/Adithyan_V_Pillai.jpeg" alt="Adithyan V Pillai" loading="lazy" />
              <div className="portrait-overlay"></div>
            </div>
            <div className="member-info">
              <h3>Adithyan V Pillai</h3>
              <p>Event Coordinator</p>
            </div>
            <div className="social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer" className="social instagram" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="social linkedin" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </article>

          {/* MEMBER 05: Akhil N */}
          <article className="team-card reveal" style={{ '--delay': '.08s' } as React.CSSProperties}>
            <div className="card-number">05</div>
            <div className="profile-image">
              <img src="/assets/thakirthi_coordinator_photos/Akhil_N.jpeg" alt="Akhil N" loading="lazy" />
              <div className="portrait-overlay"></div>
            </div>
            <div className="member-info">
              <h3>Akhil N</h3>
              <p>Event Coordinator</p>
            </div>
            <div className="social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer" className="social instagram" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="social linkedin" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </article>

          {/* MEMBER 06: Arunima */}
          <article className="team-card reveal" style={{ '--delay': '.16s' } as React.CSSProperties}>
            <div className="card-number">06</div>
            <div className="profile-image">
              <img src="/assets/thakirthi_coordinator_photos/Arunima.jpeg" alt="Arunima" loading="lazy" />
              <div className="portrait-overlay"></div>
            </div>
            <div className="member-info">
              <h3>Arunima</h3>
              <p>Event Coordinator</p>
            </div>
            <div className="social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer" className="social instagram" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="social linkedin" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </article>

          {/* MEMBER 07: Gautham Suresh */}
          <article className="team-card reveal" style={{ '--delay': '.24s' } as React.CSSProperties}>
            <div className="card-number">07</div>
            <div className="profile-image">
              <img src="/assets/thakirthi_coordinator_photos/Gautham_Suresh.jpeg" alt="Gautham Suresh" loading="lazy" />
              <div className="portrait-overlay"></div>
            </div>
            <div className="member-info">
              <h3>Gautham Suresh</h3>
              <p>Event Coordinator</p>
            </div>
            <div className="social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer" className="social instagram" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="social linkedin" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </article>

          {/* MEMBER 08: Karthika S */}
          <article className="team-card reveal" style={{ '--delay': '.32s' } as React.CSSProperties}>
            <div className="card-number">08</div>
            <div className="profile-image">
              <img src="/assets/thakirthi_coordinator_photos/Karthika_S.jpeg" alt="Karthika S" loading="lazy" />
              <div className="portrait-overlay"></div>
            </div>
            <div className="member-info">
              <h3>Karthika S</h3>
              <p>Event Coordinator</p>
            </div>
            <div className="social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer" className="social instagram" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="social linkedin" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </article>

          {/* MEMBER 09: Kashinath S */}
          <article className="team-card reveal" style={{ '--delay': '.40s' } as React.CSSProperties}>
            <div className="card-number">09</div>
            <div className="profile-image">
              <img src="/assets/thakirthi_coordinator_photos/Kashinath_S.jpeg" alt="Kashinath S" loading="lazy" />
              <div className="portrait-overlay"></div>
            </div>
            <div className="member-info">
              <h3>Kashinath S</h3>
              <p>Event Coordinator</p>
            </div>
            <div className="social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer" className="social instagram" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="social linkedin" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </article>

          {/* MEMBER 10: Kiran R */}
          <article className="team-card reveal" style={{ '--delay': '.48s' } as React.CSSProperties}>
            <div className="card-number">10</div>
            <div className="profile-image">
              <img src="/assets/thakirthi_coordinator_photos/Kiran_R.jpeg" alt="Kiran R" loading="lazy" />
              <div className="portrait-overlay"></div>
            </div>
            <div className="member-info">
              <h3>Kiran R</h3>
              <p>Event Coordinator</p>
            </div>
            <div className="social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer" className="social instagram" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="social linkedin" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </article>

          {/* MEMBER 11: Nandhan J S */}
          <article className="team-card reveal" style={{ '--delay': '.56s' } as React.CSSProperties}>
            <div className="card-number">11</div>
            <div className="profile-image">
              <img src="/assets/thakirthi_coordinator_photos/Nandhan_J_S.jpeg" alt="Nandhan J S" loading="lazy" />
              <div className="portrait-overlay"></div>
            </div>
            <div className="member-info">
              <h3>Nandhan J S</h3>
              <p>Event Coordinator</p>
            </div>
            <div className="social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer" className="social instagram" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="social linkedin" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </article>
        </div>

        {/* BOTTOM STATEMENT */}
        <div className="bottom-statement reveal">
          <div className="statement-line"></div>
          <p>
            <span>ONAM'26</span> — made with chaos, caffeine &amp; commitment.
          </p>
          <div className="statement-line"></div>
        </div>

        {/* BACK TO TOP BUTTON */}
        <button className="back-to-top" id="backToTop" aria-label="Back to top" title="Back to top">
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      </section>

      {/* MEMORY IMAGE LIGHTBOX */}
      <div className="memory-lightbox" id="memoryLightbox" aria-hidden="true">
        <div className="memory-lightbox-backdrop"></div>
        <button className="memory-lightbox-close" id="memoryLightboxClose" type="button" aria-label="Close image">
          <i className="fa-solid fa-xmark"></i>
        </button>
        <button className="memory-lightbox-prev" id="memoryLightboxPrev" type="button" aria-label="Previous image">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div className="memory-lightbox-image-wrap">
          <img id="memoryLightboxImage" src="" alt="Onam'26 memory" />
        </div>
        <button className="memory-lightbox-next" id="memoryLightboxNext" type="button" aria-label="Next image">
          <i className="fa-solid fa-chevron-right"></i>
        </button>
        <div className="memory-lightbox-counter" id="memoryLightboxCounter">01 / 12</div>
      </div>

      {/* SCRIPTS */}
      <Script src="/coordinators-assets/script.js" strategy="afterInteractive" />
      <Script src="/coordinators-assets/preloader.js" strategy="afterInteractive" />
    </>
  );
}
