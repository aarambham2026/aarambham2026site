'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

declare const DualWorldScene: any;
declare const ExperienceSlider: any;
declare const EventSystem: any;
declare const PorscheExperience: any;
declare const PreloaderController: any;

export default function EventsPage() {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    function initEventsSystems() {
      if (typeof window === 'undefined') return;

      if (
        typeof DualWorldScene !== 'undefined' &&
        typeof ExperienceSlider !== 'undefined' &&
        typeof EventSystem !== 'undefined' &&
        typeof PorscheExperience !== 'undefined'
      ) {
        const scene3D = new DualWorldScene('webgl-canvas');
        const slider = new ExperienceSlider((splitVal: number) => {
          if (scene3D && typeof scene3D.setProgress === 'function') {
            scene3D.setProgress(splitVal);
          }
        });
        const eventSys = new EventSystem();
        const porscheSys = new PorscheExperience(scene3D);
        if (typeof PreloaderController !== 'undefined') {
          const preloader = new PreloaderController();
        }
      } else {
        timer = setTimeout(initEventsSystems, 100);
      }
    }

    timer = setTimeout(initEventsSystems, 100);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <link rel="stylesheet" href="/events-assets/css/styles.css" />
      <link rel="stylesheet" href="/events-assets/css/cursor.css" />
      <link rel="stylesheet" href="/events-assets/css/preloader.css" />

      {/* UNIFIED THEYAM PRELOADER */}
      <div id="loading-screen" className="unified-preloader" role="status" aria-label="Loading Onam Cultural Fest Portal">
        <div className="loader-container">
          <div className="loader-art-card">
            <img src="/events-assets/Theyyam stick.gif" alt="Onam Cultural Fest Mascot" className="loader-art-img" />
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

      {/* 3D WEBGL CANVAS BACKGROUND */}
      <canvas id="webgl-canvas"></canvas>

      {/* NAVBAR */}
      <header className="navbar">
        <a href="/" className="nav-brand" style={{ textDecoration: 'none' }}>
          THAKRITHI'26
        </a>
        <nav className="nav-links-wrap">
          <a href="/">Home</a>
          <a href="/events" className="active">Upcoming Events</a>
          <a href="/registration">Registration</a>
          <a href="/coordinators">Meet the Coordinators</a>
        </nav>
      </header>

      {/* SPLIT PORTAL CONTAINER */}
      <div className="portal-container">

        {/* DRAGGABLE SPLIT SLIDER HANDLE */}
        <div className="portal-slider-bar" id="portal-slider-bar">
          <div className="portal-slider-handle" id="portal-slider-handle">
            ⤞ ⤝
          </div>
          <div className="slider-mode-tags">
            <span className="tag-left">◀ ONAM FEST</span>
            <span className="tag-right">BMW M5 WORLD ▶</span>
          </div>
        </div>

        {/* WORLD 1: ONAM FESTIVAL (Left Side of Split) */}
        <section className="world-layer onam-world" id="onam-world">
          <div className="onam-viewport">
            <p className="onam-hero-tag">Amrita Vishwa Vidyapeetham · Cultural Festival 2026</p>
            <h1 className="onam-hero-title">ONAM '26</h1>
            <p className="onam-hero-desc">
              The grand festival of tradition, rhythm & celebration. Experience the traditional lineup of dance, music fusion, Onam games, and floral art championships.
            </p>

            <h2 className="section-divider">FEATURED EVENT LINEUP</h2>
            <div className="events-grid" id="events-grid">
              {/* Populated by events.js */}
            </div>
          </div>
        </section>

        {/* WORLD 2: BMW M5 EXPERIENCE (Right Side of Split) */}
        <section className="world-layer porsche-world" id="porsche-world">
          <div className="porsche-viewport">
            <div className="upside-down-badge">Ignite the onam with M5 👀</div>
            <h1 className="porsche-main-title">BMW M5</h1>
            <p className="porsche-tagline">ONAM MEETS PERFORMANCE — EXPERIENCE THE MACHINE.</p>

            <div className="car-display-container">
              <div className="car-media-wrap">
                <video
                  id="car-video"
                  className="car-gif-img"
                  src="/events-assets/bmwgif.mp4"
                  loop
                  muted
                  playsInline
                  preload="auto"
                  style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                ></video>
                <img
                  id="car-gif"
                  className="car-gif-img"
                  src="/events-assets/bmwgif.gif"
                  alt="BMW M5 Showcase"
                  style={{ display: 'none', width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="car-display-overlay">
                <button className="ignite-engine-btn" id="ignite-engine-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                  IGNITE THE ENGINE
                </button>
                <p className="engine-status-text" id="engine-status-text">
                  STATUS: STANDBY · PRESS BUTTON TO START ANIMATION & ENGINE
                </p>
              </div>
            </div>

          </div>
        </section>

      </div>

      {/* MODAL OVERLAY */}
      <div className="modal-overlay" id="event-modal-overlay">
        <div className="modal-card" id="event-modal-card">
        </div>
      </div>

      {/* THREE.JS & CUSTOM SCRIPTS */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="beforeInteractive" />
      <Script src="/events-assets/js/audio.js" strategy="afterInteractive" />
      <Script src="/events-assets/js/three-scene.js" strategy="afterInteractive" />
      <Script src="/events-assets/js/slider.js" strategy="afterInteractive" />
      <Script src="/events-assets/js/events.js" strategy="afterInteractive" />
      <Script src="/events-assets/js/porsche-experience.js" strategy="afterInteractive" />
      <Script src="/events-assets/js/preloader.js" strategy="afterInteractive" />
    </>
  );
}
