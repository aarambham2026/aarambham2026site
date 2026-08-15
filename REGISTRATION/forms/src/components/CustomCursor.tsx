'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function CustomCursor() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  const mouseXRef = useRef<number>(-200);
  const mouseYRef = useRef<number>(-200);
  const ringXRef = useRef<number>(-200);
  const ringYRef = useRef<number>(-200);
  const isVisibleRef = useRef<boolean>(false);
  const isHoveringRef = useRef<boolean>(false);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Single global physical pointer listener attached to window once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!(window as any).__ONAM_POINTER_LISTENER_SET__) {
      (window as any).__ONAM_POINTER_LISTENER_SET__ = true;

      const updateGlobalPointer = (e: MouseEvent | PointerEvent) => {
        (window as any).__ONAM_POINTER_X__ = e.clientX;
        (window as any).__ONAM_POINTER_Y__ = e.clientY;
        (window as any).__ONAM_POINTER_ACTIVE__ = true;
      };

      window.addEventListener('pointermove', updateGlobalPointer, { capture: true, passive: true });
      window.addEventListener('mousemove', updateGlobalPointer, { capture: true, passive: true });
    }
  }, []);

  // 2. Synchronize pointer position immediately across Next.js SPA route transitions
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    const globalX = (window as any).__ONAM_POINTER_X__;
    const globalY = (window as any).__ONAM_POINTER_Y__;
    const isActive = (window as any).__ONAM_POINTER_ACTIVE__;

    if (typeof globalX === 'number' && typeof globalY === 'number' && isActive) {
      mouseXRef.current = globalX;
      mouseYRef.current = globalY;
      ringXRef.current = globalX;
      ringYRef.current = globalY;
      isVisibleRef.current = true;

      // Direct DOM update with zero React re-render delay
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${globalX}px, ${globalY}px, 0)`;
        cursorRef.current.style.opacity = '1';
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(0px, 0px, 0)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${globalX}px, ${globalY}px, 0) translate(-50%, -50%)`;
        glowRef.current.style.opacity = '1';
      }
    }
  }, [pathname, isMounted]);

  // 3. Ultra-high performance 120Hz/144Hz GPU RAF Animation Loop
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    // Suppress on touch / coarse pointer devices
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handlePointerMove = (e: MouseEvent | PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      mouseXRef.current = x;
      mouseYRef.current = y;
      (window as any).__ONAM_POINTER_X__ = x;
      (window as any).__ONAM_POINTER_Y__ = y;
      (window as any).__ONAM_POINTER_ACTIVE__ = true;

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        if (cursorRef.current) cursorRef.current.style.opacity = '1';
        if (glowRef.current) glowRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
      if (glowRef.current) glowRef.current.style.opacity = '0';
    };

    // Direct DOM class toggle on hover (zero React re-render latency)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !target.closest) return;

      const isInteractive = target.closest(
        'a, button, input, select, option, textarea, label, [role="button"], [role="option"], .card, .btn, .interactive, .hub-card, .event-card, .team-card, .social, .back-to-top, .onam-reg-card, .onam-reg-pill-btn'
      );

      if (isInteractive) {
        if (!isHoveringRef.current) {
          isHoveringRef.current = true;
          document.body.classList.add('cursor-hover');
          if (cursorRef.current) cursorRef.current.classList.add('cursor-hover');
        }
      } else {
        if (isHoveringRef.current) {
          isHoveringRef.current = false;
          document.body.classList.remove('cursor-hover');
          if (cursorRef.current) cursorRef.current.classList.remove('cursor-hover');
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { capture: true, passive: true });
    window.addEventListener('mousemove', handlePointerMove, { capture: true, passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    lastTimeRef.current = performance.now();

    // Frame-rate independent delta-time Lerp loop
    function animate(now: number) {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      const mx = mouseXRef.current;
      const my = mouseYRef.current;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }

      // Smooth framerate-independent easing factor
      const factor = 1 - Math.pow(1 - 0.28, dt * 60);

      ringXRef.current += (mx - ringXRef.current) * factor;
      ringYRef.current += (my - ringYRef.current) * factor;

      const rx = ringXRef.current;
      const ry = ringYRef.current;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx - mx}px, ${ry - my}px, 0)`;
      }

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('pointermove', handlePointerMove, { capture: true });
      window.removeEventListener('mousemove', handlePointerMove, { capture: true });
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isMounted]);

  // Suppress rendering on SSR, coarse touch, or embedded iframes
  if (
    !isMounted ||
    (typeof window !== 'undefined' &&
      (window.self !== window.top || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)))
  ) {
    return null;
  }

  return (
    <>
      <div
        ref={glowRef}
        className="mouse-glow"
        style={{
          opacity: 0,
          willChange: 'transform, opacity',
          pointerEvents: 'none'
        }}
      />
      <div
        ref={cursorRef}
        className="custom-cursor"
        style={{
          opacity: 0,
          willChange: 'transform, opacity',
          pointerEvents: 'none'
        }}
      >
        <div className="cursor-dot" style={{ willChange: 'transform' }} />
        <div ref={ringRef} className="cursor-ring" style={{ willChange: 'transform' }} />
      </div>
    </>
  );
}
