'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function CustomCursor() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [hoverState, setHoverState] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  const mouseXRef = useRef<number>(-200);
  const mouseYRef = useRef<number>(-200);
  const ringXRef = useRef<number>(-200);
  const ringYRef = useRef<number>(-200);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Set up global physical pointer listener once on window
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

  // Synchronize pointer position immediately when pathname / route changes
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
      setIsVisible(true);

      // Force immediate DOM transform sync on route mount
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${globalX}px, ${globalY}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(0px, 0px, 0)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${globalX}px, ${globalY}px, 0) translate(-50%, -50%)`;
      }
    }
  }, [pathname, isMounted]);

  // Main high-performance GPU animation loop
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    // Check touchscreen / coarse pointer
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handlePointerMove = (e: MouseEvent | PointerEvent) => {
      mouseXRef.current = e.clientX;
      mouseYRef.current = e.clientY;
      (window as any).__ONAM_POINTER_X__ = e.clientX;
      (window as any).__ONAM_POINTER_Y__ = e.clientY;
      (window as any).__ONAM_POINTER_ACTIVE__ = true;

      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !target.closest) return;

      if (
        target.closest(
          'a, button, input, select, option, textarea, label, [role="button"], [role="option"], .card, .btn, .interactive, .hub-card, .event-card, .team-card, .social, .back-to-top, .onam-reg-card, .onam-reg-pill-btn'
        )
      ) {
        document.body.classList.add('cursor-hover');
        setHoverState('cursor-hover');
      } else {
        document.body.classList.remove('cursor-hover');
        setHoverState('');
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { capture: true, passive: true });
    window.addEventListener('mousemove', handlePointerMove, { capture: true, passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    function animate() {
      const mx = mouseXRef.current;
      const my = mouseYRef.current;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }

      ringXRef.current += (mx - ringXRef.current) * 0.22;
      ringYRef.current += (my - ringYRef.current) * 0.22;

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
  }, [isMounted, isVisible]);

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
          opacity: isVisible ? 1 : 0
        }}
      />
      <div
        ref={cursorRef}
        className={`custom-cursor ${hoverState}`}
        style={{
          opacity: isVisible ? 1 : 0
        }}
      >
        <div className="cursor-dot" />
        <div ref={ringRef} className="cursor-ring" />
      </div>
    </>
  );
}
