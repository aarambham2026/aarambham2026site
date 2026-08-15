'use client';

import React, { useEffect, useState } from 'react';
import RegistrationSection from '@/src/components/Registration/RegistrationSection';

export default function RegistrationPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Animate the 6 Theyyam preloader progress segments on registration mount
    const totalSteps = 6;
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < totalSteps) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(() => {
              setIsLoaded(true);
            }, 800);
          }, 300);
          return prev;
        }
      });
    }, 280);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Unified Theyyam Preloader Stylesheet */}
      <link rel="stylesheet" href="/coordinators-assets/preloader.css" />

      {/* UNIFIED THEYAM PRELOADER */}
      {!isLoaded && (
        <div
          id="loading-screen"
          className={`unified-preloader ${isFading ? 'fade-out' : ''}`}
          role="status"
          aria-label="Loading Onam Cultural Fest Portal"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999999,
            background: '#161022',
            backgroundImage: 'radial-gradient(circle at 50% 40%, #1d0916 0%, #11070e 70%, #080307 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.8s ease',
            opacity: isFading ? 0 : 1,
            visibility: isFading ? 'hidden' : 'visible',
            pointerEvents: isFading ? 'none' : 'auto'
          }}
        >
          <div className="loader-container">
            <div className="loader-art-card">
              <img
                src="/coordinators-assets/Theyyam stick.gif"
                alt="Onam Cultural Fest Mascot"
                className="loader-art-img"
              />
            </div>
            <div className="loader-university-title">AMRITA VISHWA VIDYAPEETHAM</div>
            <div className="loader-status-wrap">
              <span className="loader-spinner"></span>
              <span className="loader-status-text">LOADING ONAM CULTURAL FEST PORTAL...</span>
            </div>
            <div className="loader-progress-bar">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <span
                  key={index}
                  className={`bar-segment ${index < activeStep ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#1b1226] text-zinc-100 flex flex-col font-sans selection:bg-[#F2C94C]/30 selection:text-[#F2C94C]">
        {/* Top Navigation Bar */}
        <header className="border-b border-[#F2C94C]/20 bg-[#1b1226]/95 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#9B111E] to-[#F2C94C] flex items-center justify-center font-serif text-white font-black text-sm shadow-md shadow-[#9B111E]/40 border border-[#F2C94C]/30">
              O'26
            </div>
            <div>
              <div className="font-serif font-bold text-sm tracking-wide text-white">
                AMRITA VISHWA VIDYAPEETHAM
              </div>
              <div className="text-[11px] text-[#F2C94C] font-semibold tracking-wider uppercase">
                Onam Cultural Fest 2026 • Registration & E-Ticket Module
              </div>
            </div>
          </div>

          {/* Top-Level Cross-Application Sibling Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-amber-100/80">
            <a href="/" className="hover:text-amber-400 transition-colors">Home</a>
            <a href="/events" className="hover:text-amber-400 transition-colors">Upcoming Events</a>
            <a href="/registration" className="text-amber-400 font-extrabold border-b-2 border-amber-400 pb-0.5">Registration</a>
            <a href="/coordinators" className="hover:text-amber-400 transition-colors">Meet the Coordinators</a>
          </nav>
        </header>

        {/* Main Registration Content */}
        <main className="flex-1">
          <RegistrationSection />
        </main>

        {/* Footer */}
        <footer className="border-t border-[#F2C94C]/20 py-6 px-4 text-center text-xs text-zinc-500 bg-[#150d1e]">
          <p className="font-medium">
            Official Cultural Event Registration Portal • Amrita Vishwa Vidyapeetham
          </p>
          <p className="mt-1 text-[11px] text-zinc-600">
            Built for Onam 2026 • Real-time Sequential Queue Allocation & Database Verification
          </p>
        </footer>
      </div>
    </>
  );
}
