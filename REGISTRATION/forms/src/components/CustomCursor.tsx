'use client';

import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [isMounted, setIsMounted] = useState(false);
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [hoverState, setHoverState] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const isEmbedded = window.self !== window.top;

    const handleMove = (e: MouseEvent | PointerEvent) => {
      const target = e.target as HTMLElement | null;
      let hover = '';

      if (target) {
        if (target.closest('.onam-reg-card, .onam-reg-format-card, .onam-reg-modal-backdrop')) {
          hover = 'cursor-card';
        } else if (
          target.closest(
            'button, a, input, select, option, textarea, label, [role="button"], [role="option"], .onam-reg-badge, .onam-reg-pill-btn, .onam-reg-back-btn, .onam-reg-input, .onam-reg-select'
          )
        ) {
          hover = 'cursor-hover';
        }
      }

      if (isEmbedded) {
        window.parent.postMessage(
          {
            type: 'MASTER_CURSOR_MOVE',
            x: e.clientX,
            y: e.clientY + 65,
            hoverState: hover
          },
          '*'
        );
        return;
      }

      setPos({ x: e.clientX, y: e.clientY });
      setHoverState(hover);
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      if (isEmbedded) {
        window.parent.postMessage({ type: 'MASTER_CURSOR_LEAVE' }, '*');
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMove, { capture: true });
    window.addEventListener('pointermove', handleMove, { capture: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove, { capture: true });
      window.removeEventListener('pointermove', handleMove, { capture: true });
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMounted]);

  // Don't render on SSR to ensure client/server HTML match 100%, and suppress if embedded in iframe
  if (!isMounted || (typeof window !== 'undefined' && window.self !== window.top)) {
    return null;
  }

  return (
    <>
      <div
        className="mouse-glow"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          opacity: isVisible ? 1 : 0
        }}
      />
      <div
        className={`custom-cursor ${hoverState}`}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          opacity: isVisible ? 1 : 0
        }}
      >
        <div className="cursor-dot" />
        <div className="cursor-ring" />
      </div>
    </>
  );
}
