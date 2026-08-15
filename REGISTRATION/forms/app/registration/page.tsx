'use client';

import React from 'react';
import Script from 'next/script';
import RegistrationSection from '@/src/components/Registration/RegistrationSection';

export default function RegistrationPage() {
  return (
    <>
      {/* Unified Theyyam Preloader Stylesheet */}
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

      {/* Preloader Script */}
      <Script src="/coordinators-assets/preloader.js" strategy="afterInteractive" />
    </>
  );
}
