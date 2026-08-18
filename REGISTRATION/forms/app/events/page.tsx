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
          <a href="/loading">Registration</a>
          <a href="/coordinators">Meet the Coordinators</a>
        </nav>
      </header>

      {/* ONAM FESTIVAL PORTAL CONTAINER */}
      <div className="portal-container">
        {/* WORLD 1: ONAM FESTIVAL */}
        <section className="world-layer onam-world" id="onam-world">
          <div className="onam-viewport">
            <p className="onam-hero-tag">Amrita Vishwa Vidyapeetham · Cultural Festival 2026</p>
            <h1 className="onam-hero-title">THAKRITHI'26</h1>
            <p className="onam-hero-desc">
              The grand festival of tradition, rhythm & celebration. Experience the traditional lineup of dance, music fusion, Onam games, and floral art championships.
            </p>

            <h2 className="section-divider">FEATURED EVENT LINEUP</h2>
            <div className="events-grid" id="events-grid">
              {/* Populated by events.js */}
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
      <Script src="/events-assets/js/events.js?v=3" strategy="afterInteractive" />
      <Script src="/events-assets/js/preloader.js" strategy="afterInteractive" />
    </>
  );
}
