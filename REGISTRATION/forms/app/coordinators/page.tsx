'use client';

import React from 'react';
import Script from 'next/script';

const coordinatorsData = [
  {
    id: "01",
    name: "Abhijith P",
    role: "Event Coordinator",
    image: "/coordinators-assets/thakirthi_coordinator_photos/Abhijith_P.jpeg",
    instagram: "https://www.instagram.com/a6hi.exe/",
    delay: "0s"
  },
  {
    id: "02",
    name: "Abhishek Krishna",
    role: "Event Coordinator",
    image: "/coordinators-assets/thakirthi_coordinator_photos/Abhishek_Krishna.jpeg",
    instagram: "https://www.instagram.com/a6hizhekkk/",
    delay: ".08s"
  },
  {
    id: "03",
    name: "Abiram",
    role: "Event Coordinator",
    image: "/coordinators-assets/thakirthi_coordinator_photos/Abiram.jpeg",
    instagram: "https://www.instagram.com/nyt__foxy/",
    delay: ".16s"
  },
  {
    id: "04",
    name: "Adhwaith Ashok",
    role: "Event Coordinator",
    image: "/coordinators-assets/thakirthi_coordinator_photos/Adhwaith_Ashok.jpeg",
    instagram: "https://www.instagram.com/adx._waith/",
    delay: ".24s"
  },
  {
    id: "05",
    name: "Adithyan A",
    role: "Event Coordinator",
    image: "/coordinators-assets/thakirthi_coordinator_photos/Adithyan_A.jpeg",
    instagram: "https://www.instagram.com/who.tf_adithyan/",
    delay: ".08s"
  },
  {
    id: "06",
    name: "Adithyan V Pillai",
    role: "Event Coordinator",
    image: "/coordinators-assets/thakirthi_coordinator_photos/Adithyan_V_Pillai.jpeg",
    instagram: "https://www.instagram.com/adi7hyan__/",
    delay: ".16s"
  },
  {
    id: "07",
    name: "Advaith S",
    role: "Event Coordinator",
    image: "/coordinators-assets/thakirthi_coordinator_photos/Advaith_S.jpeg",
    instagram: "https://www.instagram.com/ad6iiiii/",
    delay: ".24s"
  },
  {
    id: "08",
    name: "Adwaith A",
    role: "Event Coordinator",
    image: "/coordinators-assets/thakirthi_coordinator_photos/Adwaith_A.jpeg",
    instagram: "https://www.instagram.com/ad.waiiiithh/",
    delay: ".32s"
  },
  {
    id: "09",
    name: "Akhil N",
    role: "Event Coordinator",
    image: "/coordinators-assets/thakirthi_coordinator_photos/Akhil_N.jpeg",
    instagram: "https://www.instagram.com/akhiiill.n/",
    delay: ".40s"
  },
  {
    id: "10",
    name: "Arunima",
    role: "Event Coordinator",
    image: "/coordinators-assets/thakirthi_coordinator_photos/Arunima.jpeg",
    instagram: "https://www.instagram.com/_arx.nxm.x_/",
    delay: ".48s"
  },
  {
    id: "11",
    name: "Devika V G",
    role: "Event Coordinator",
    image: "/coordinators-assets/thakirthi_coordinator_photos/Devika_V_G.jpeg",
    instagram: "https://www.instagram.com/___devika___.__/",
    delay: ".56s"
  },
  {
    id: "12",
    name: "Gautham Suresh",
    role: "Event Coordinator",
    image: "/coordinators-assets/thakirthi_coordinator_photos/Gautham_Suresh.jpeg",
    instagram: "https://www.instagram.com/gauthamsuresh._/",
    delay: ".08s"
  },
  {
    id: "13",
    name: "Kashinath S",
    role: "Event Coordinator",
    image: "/coordinators-assets/thakirthi_coordinator_photos/Kashinath_S.jpeg",
    instagram: "https://www.instagram.com/kashiiiiiii_pvt/",
    delay: ".16s"
  },
  {
    id: "14",
    name: "Kiran R",
    role: "Event Coordinator",
    image: "/coordinators-assets/thakirthi_coordinator_photos/Kiran_R.jpeg",
    instagram: "https://www.instagram.com/garudan014/",
    delay: ".24s"
  },
  {
    id: "15",
    name: "Krishnanunni V",
    role: "Event Coordinator",
    image: "/coordinators-assets/thakirthi_coordinator_photos/Krishnanunni_V.jpeg",
    instagram: "https://www.instagram.com/i.kichxu/",
    delay: ".32s"
  },
  {
    id: "16",
    name: "Nandhan J S",
    role: "Event Coordinator",
    image: "/coordinators-assets/thakirthi_coordinator_photos/Nandhan_J_S.jpeg",
    instagram: "https://www.instagram.com/nandhan_616/",
    delay: ".40s"
  },
  {
    id: "17",
    name: "Pranav M Biju",
    role: "Event Coordinator",
    image: "/coordinators-assets/thakirthi_coordinator_photos/Pranav_M_Biju.jpeg",
    instagram: "https://www.instagram.com/pran4vvvvv/",
    delay: ".48s"
  }
];

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
        <a href="/" className="top-nav-brand" style={{ textDecoration: 'none' }}>
          THAKRITHI'26
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
            AARAMBHAM'25 MEMORIES
            <span className="label-dot"></span>
          </div>

          <div className="memory-gallery" id="memoryGallery">
            <img src="/assets/photo-5.jpg" alt="Aarambham'25 memory 01" loading="eager" />
            <img src="/assets/photo-4.jpg" alt="Aarambham'25 memory 02" loading="lazy" />
            <img src="/assets/photo-2.jpg" alt="Aarambham'25 memory 03" loading="lazy" />
            <img src="/assets/photo-1.jpg" alt="Aarambham'25 memory 04" loading="lazy" />
            <img src="/assets/photo-3.jpg" alt="Aarambham'25 memory 05" loading="lazy" />
            <img src="/assets/photo-6.jpg" alt="Aarambham'25 memory 06" loading="lazy" />
            <img src="/assets/photo-7.jpg" alt="Aarambham'25 memory 07" loading="lazy" />
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
          {coordinatorsData.map((member) => (
            <article
              key={member.id}
              className="team-card reveal"
              style={{ '--delay': member.delay } as React.CSSProperties}
            >
              <div className="card-number">{member.id}</div>
              <div className="profile-image">
                <img src={member.image} alt={member.name} loading="lazy" />
                <div className="portrait-overlay"></div>
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
              <div className="social-icons">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social instagram"
                  aria-label={`Instagram for ${member.name}`}
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
              </div>
            </article>
          ))}
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
