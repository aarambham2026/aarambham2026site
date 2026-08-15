'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import RegistrationSection from '../src/components/Registration/RegistrationSection';
import { Ticket, Loader2 } from 'lucide-react';

export default function HomePage() {
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [activeBlocks, setActiveBlocks] = useState(0);

  useEffect(() => {
    const isEmbedded = typeof window !== 'undefined' && window.self !== window.top;
    
    // If embedded inside parent window iframe, suppress internal splash loader
    if (isEmbedded) {
      setIsInitialLoading(false);
      return;
    }

    setIsInitialLoading(true);

    // Block by block loading progress animation
    const blockInterval = setInterval(() => {
      setActiveBlocks((prev) => {
        if (prev < 6) return prev + 1;
        return prev;
      });
    }, 220);

    // Fade out splash loader on completion
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1800);

    return () => {
      clearInterval(blockInterval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#1b1226] text-[#fff5ec] relative">
      {/* Initial Loading Splash Overlay (Suppressed when embedded in iframe) */}
      {isInitialLoading && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1b1226] transition-opacity duration-500 p-4"
          style={{ opacity: isInitialLoading ? 1 : 0 }}
        >
          <div className="relative flex items-center justify-center mb-4 max-w-sm w-full">
            {/* Pulsating Golden Background Glow */}
            <div className="absolute w-64 h-64 rounded-full bg-amber-500/15 blur-2xl animate-pulse"></div>

            {/* Complete Theyyam Animated GIF */}
            <div
              className="relative z-10 flex items-center justify-center"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 98%)',
                maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 98%)'
              }}
            >
              <img
                src="/loading.gif"
                alt="Theyyam Loading Animation"
                className="max-h-72 w-auto object-contain block"
              />
            </div>
          </div>

          <h2
            className="text-2xl font-extrabold tracking-widest text-amber-400 mb-2 font-serif text-center px-4"
            style={{ fontFamily: "'Cinzel', serif", textShadow: '0 0 20px rgba(242, 201, 76, 0.4)' }}
          >
            AMRITA VISHWA VIDYAPEETHAM
          </h2>

          <p className="text-xs text-amber-100/90 font-mono tracking-wider uppercase mb-5 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            Loading Onam Cultural Fest Portal...
          </p>

          {/* Block-by-Block Loading Progress Indicator */}
          <div className="flex items-center gap-2 justify-center">
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const isActive = idx <= activeBlocks;
              return (
                <div
                  key={idx}
                  className={`w-6 h-2.5 rounded-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_10px_rgba(242,201,76,0.8)] scale-105'
                      : 'bg-zinc-800/80 border border-amber-500/20'
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Top Header Banner */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-amber-500/30 backdrop-blur-md shadow-2xl"
        style={{ background: 'rgba(27, 18, 38, 0.95)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-amber-950/50">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <div
              className="font-extrabold tracking-widest text-sm text-white"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              AMRITA VISHWA VIDYAPEETHAM
            </div>
            <div className="text-[11px] text-[#F2C94C] font-semibold tracking-wider uppercase">
              Onam Cultural Fest 2026 • Registration & E-Ticket Module
            </div>
          </div>
        </div>

        {/* Top-Level Cross-Application Sibling Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-amber-100/80">
          <a href="https://thakrithi.vercel.app/" className="hover:text-amber-400 transition-colors">Home</a>
          <a href="https://thakrithi.vercel.app/UPCOMIG%20EVENTS/index.html" className="hover:text-amber-400 transition-colors">Upcoming Events</a>
          <a href="https://thakrithi.vercel.app/REGISTRATION/index.html" className="text-amber-400 font-extrabold border-b-2 border-amber-400 pb-0.5">Registration</a>
          <a href="https://thakrithi.vercel.app/MEET%20THE%20CORRDINATES/index.html" className="hover:text-amber-400 transition-colors">Meet the Coordinators</a>
        </nav>
      </header>

      {/* Main Registration Content */}
      <main className="flex-1">
        <RegistrationSection />
      </main>

      {/* Footer */}
      <footer
        className="text-center py-6 px-4 border-t border-amber-500/20 text-xs text-amber-100/70"
        style={{ background: 'rgba(27, 18, 38, 0.95)' }}
      >
        Amrita Vishwa Vidyapeetham • Onam Cultural Registration & Automatic Slot Allocation System
      </footer>
    </div>
  );
}
