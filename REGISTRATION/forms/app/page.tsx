'use client';

import React from 'react';
import Script from 'next/script';

export default function HomePage() {
  return (
    <>
      {/* Stylesheets for Main Home Page */}
      <link rel="stylesheet" href="/home-assets/css/globals.css" />
      <link rel="stylesheet" href="/home-assets/css/loading-header.css" />
      <link rel="stylesheet" href="/home-assets/css/hero.css" />
      <link rel="stylesheet" href="/home-assets/css/about.css" />
      <link rel="stylesheet" href="/home-assets/css/snapshot.css" />
      <link rel="stylesheet" href="/home-assets/css/sections.css" />
      <link rel="stylesheet" href="/home-assets/css/cursor.css" />
      <link rel="stylesheet" href="/home-assets/css/preloader.css" />

      {/* ═══════════════════════════════════════════════════════════
           LOADING SCREEN
           ═══════════════════════════════════════════════════════════ */}
      <div id="loading-screen" role="status" aria-label="Loading Onam Cultural Fest Portal">
        <div className="loader-container">
          <div className="loader-art-card">
            <img
              src="/resources/loading/Theyyam stick.gif"
              alt="Onam Cultural Fest Mascot"
              className="loader-art-img"
            />
          </div>

          <div className="loader-university-title">
            AMRITA VISHWA VIDYAPEETHAM
          </div>

          <div className="loader-status-wrap">
            <span className="loader-spinner"></span>
            <span className="loader-status-text">LOADING ONAM CULTURAL FEST PORTAL...</span>
          </div>

          <div className="loader-progress-bar" id="loader-progress-bar">
            <span className="bar-segment"></span>
            <span className="bar-segment"></span>
            <span className="bar-segment"></span>
            <span className="bar-segment"></span>
            <span className="bar-segment"></span>
            <span className="bar-segment"></span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
           MAIN SITE (hidden until loading screen fades)
           ═══════════════════════════════════════════════════════════ */}
      <div id="main-site" style={{ opacity: 0, transition: 'opacity 0.5s ease' }}>

        {/* ── SIDEBAR OVERLAY ──────────────────────────────────── */}
        <div id="sidebar-overlay" role="presentation"></div>

        {/* ── SIDEBAR ──────────────────────────────────────────── */}
        <aside id="sidebar" role="navigation" aria-label="Site navigation">
          <div className="sidebar-deco"></div>
          <button id="sidebar-close" className="sidebar-close" aria-label="Close menu">✕</button>

          <div className="sidebar-brand">
            <div className="sidebar-brand-name">THAKRITHI'26</div>
          </div>

          <ul className="sidebar-nav" role="list">
            <li>
              <a href="/">
                <span className="sidebar-nav-num">01</span>
                Home
              </a>
            </li>
            <li>
              <a href="/events">
                <span className="sidebar-nav-num">02</span>
                Upcoming Events
              </a>
            </li>
            <li>
              <a href="/registration">
                <span className="sidebar-nav-num">03</span>
                Registration
              </a>
            </li>
            <li>
              <a href="/coordinators">
                <span className="sidebar-nav-num">04</span>
                Meet The Coordinators
              </a>
            </li>
          </ul>

          <div className="sidebar-footer">
            <p className="sidebar-footer-text">Thakrithi'26 · August 22</p>
          </div>
        </aside>

        {/* ── HEADER ────────────────────────────────────────────── */}
        <header id="header" role="banner">
          <a href="/" className="header-logo" style={{ textDecoration: 'none' }}>
            THAKRITHI'26
          </a>

          <nav aria-label="Primary navigation">
            <ul className="header-nav" role="list">
              <li><a href="/">Home</a></li>
              <li><a href="/events">Upcoming Events</a></li>
              <li><a href="/registration">Registration</a></li>
              <li><a href="/coordinators">Meet The Coordinators</a></li>
            </ul>
          </nav>

          <button id="menu-btn" className="menu-btn" aria-label="Open menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </header>

        {/* ════════════════════════════════════════════════════════
             SECTION 1 — HOME / HERO
             ════════════════════════════════════════════════════════ */}
        <section id="home" aria-label="Hero section">
          <div className="hero-bg" role="img" aria-label="Onam festival background">
            <div className="hero-bg-placeholder"></div>
          </div>
          <div className="hero-pattern" aria-hidden="true"></div>

          <div className="hero-content">
            <span className="hero-label">University Cultural Festival · August 22, 2026</span>

            <div className="hero-heading-wrap">
              <img
                id="heading-gif"
                src="/resources/heading/THAKRITHI FINAL gif.gif"
                alt="THAKRITHI Onam 2026 Heading Animation"
                className="hero-heading-img"
              />
              <div className="hero-heading-fallback" id="heading-fallback" style={{ display: 'none' }}>
                THAKRITHI ONAM 2026
              </div>
            </div>

            <div className="hero-sub">
              <span className="hero-sub-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                August 22, 2026
              </span>
              <div className="hero-sub-dot" aria-hidden="true"></div>
              <span className="hero-sub-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Amrita Vishwa Vidyapeetham, Nagercoil
              </span>
              <div className="hero-sub-dot" aria-hidden="true"></div>
              <span className="hero-sub-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                All Are Welcome
              </span>
            </div>

            <div id="countdown-wrap" className="countdown-wrap" role="timer" aria-live="polite" aria-label="Countdown to Onam 2026">
              <div className="countdown-card" id="cd-days-card">
                <div className="flip-card-inner">
                  <div className="flip-card-top-half"><span className="flip-top-num">00</span></div>
                  <div className="flip-card-bot-half"><span className="flip-bot-num">00</span></div>
                  <div className="flip-card-divider"></div>
                  <span className="countdown-number" id="cd-days">00</span>
                </div>
                <span className="countdown-label">Days</span>
              </div>
              <div className="countdown-separator" aria-hidden="true">:</div>

              <div className="countdown-card" id="cd-hours-card">
                <div className="flip-card-inner">
                  <div className="flip-card-top-half"><span className="flip-top-num">00</span></div>
                  <div className="flip-card-bot-half"><span className="flip-bot-num">00</span></div>
                  <div className="flip-card-divider"></div>
                  <span className="countdown-number" id="cd-hours">00</span>
                </div>
                <span className="countdown-label">Hours</span>
              </div>

              <div className="countdown-separator" aria-hidden="true">:</div>

              <div className="countdown-card" id="cd-minutes-card">
                <div className="flip-card-inner">
                  <div className="flip-card-top-half"><span className="flip-top-num">00</span></div>
                  <div className="flip-card-bot-half"><span className="flip-bot-num">00</span></div>
                  <div className="flip-card-divider"></div>
                  <span className="countdown-number" id="cd-minutes">00</span>
                </div>
                <span className="countdown-label">Minutes</span>
              </div>

              <div className="countdown-separator" aria-hidden="true">:</div>

              <div className="countdown-card" id="cd-seconds-card">
                <div className="flip-card-inner">
                  <div className="flip-card-top-half"><span className="flip-top-num">00</span></div>
                  <div className="flip-card-bot-half"><span className="flip-bot-num">00</span></div>
                  <div className="flip-card-divider"></div>
                  <span className="countdown-number" id="cd-seconds">00</span>
                </div>
                <span className="countdown-label">Seconds</span>
              </div>
            </div>
            <div id="countdown-over" className="countdown-over" style={{ display: 'none' }} aria-live="assertive">
              ✦ THE WAIT IS OVER ✦
            </div>

          </div>

          <div className="hero-scroll-hint" aria-hidden="true">
            <span>Scroll</span>
            <div className="scroll-arrow"></div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
             SECTION 2 — ABOUT US
             ════════════════════════════════════════════════════════ */}
        <section id="about" aria-labelledby="about-title">
          <div className="about-inner">
            <header className="about-header reveal">
              <span className="section-label">Our Story</span>
              <h2 className="section-title" id="about-title">About</h2>
            </header>

            <div className="about-glass-outer">
              <div className="about-glass reveal-scale">
                <div className="about-grid">
                  <div className="about-character-col">
                    <div className="about-character-frame">
                      <video
                        className="about-character-img"
                        src="/resources/about us/Kathakali load.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        id="about-character-video"
                      ></video>
                      <div className="character-glow" aria-hidden="true"></div>
                    </div>
                  </div>

                  <div className="about-text-col">
                    <div className="about-text-inner">
                      <div className="about-accent-bar" aria-hidden="true"></div>
                      <div className="about-content-wrapper">
                        <h3 className="about-title">
                          ABOUT THE<br />
                          <span>EVENT</span>
                        </h3>
                        <div className="about-body-text" id="about-body">
                          <p>Thakrithi ’26 is the grand Onam celebration of Amrita Vishwa Vidyapeetham, Nagercoil Campus, bringing together students, faculty, and the campus community to celebrate the spirit, traditions, and vibrant culture of Kerala.</p>
                          <p>The event is designed as a lively celebration of Onam, blending traditional elements with a modern campus experience. From the grandeur of Maveli’s arrival and Chenda Melam to the beauty of Pookalam, traditional decorations, Onam games, music, and cultural activities, Thakrithi ’26 aims to create an atmosphere of joy, togetherness, and celebration.</p>
                          <p>More than just an event, Thakrithi ’26 is a celebration of unity and belonging, where everyone comes together beyond classrooms and departments to experience the colours, traditions, and festive spirit of Onam.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
             SECTION 3 — SNAPSHOT / GALLERY
             ════════════════════════════════════════════════════════ */}
        <section id="snapshot" aria-labelledby="snapshot-title">
          <div className="snapshot-inner">
            <header className="snapshot-header reveal">
              <span className="section-label">Memories</span>
              <h2 className="section-title" id="snapshot-title">
                Snapshot<span className="gold-text">s</span>
              </h2>
              <p>A living wall of Onam memories</p>
            </header>

            <div className="film-rolls-container" aria-label="Photo gallery in film strip style">
              <div className="film-strip" id="film-col-1" aria-hidden="true"></div>
              <div className="film-strip" id="film-col-2" aria-hidden="true"></div>
              <div className="film-strip" id="film-col-3" aria-hidden="true"></div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────── */}
        <footer id="footer" role="contentinfo">
          <nav className="footer-links" aria-label="Footer navigation">
            <a href="/">Home</a>
            <a href="/events">Upcoming Events</a>
            <a href="/registration">Registration</a>
            <a href="/coordinators">Meet the Coordinators</a>
          </nav>
        </footer>
      </div>

      {/* SCRIPTS */}
      <Script src="/home-assets/js/data.js" strategy="afterInteractive" />
      <Script src="/home-assets/js/header.js" strategy="afterInteractive" />
      <Script src="/home-assets/js/countdown.js" strategy="afterInteractive" />
      <Script src="/home-assets/js/snapshot.js" strategy="afterInteractive" />
      <Script src="/home-assets/js/sections.js" strategy="afterInteractive" />
      <Script src="/home-assets/js/about-tilt.js" strategy="afterInteractive" />
      <Script src="/home-assets/js/scroll-reveal.js" strategy="afterInteractive" />
      <Script src="/home-assets/js/preloader.js" strategy="afterInteractive" />
    </>
  );
}
