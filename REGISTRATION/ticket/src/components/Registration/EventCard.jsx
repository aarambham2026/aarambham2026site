import React, { useRef, useState } from 'react';
import { Music, Activity, Gamepad2, ArrowRight, Sparkles } from 'lucide-react';

const EventCard = ({ event, onClick }) => {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('rotateX(0deg) rotateY(0deg) translateZ(0px)');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set cursor position CSS variables for spotlight glow
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);

    // Calculate 3D tilt angles (Max 10 degrees tilt)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransformStyle(`rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(20px)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle('rotateX(0deg) rotateY(0deg) translateZ(0px)');
  };

  const renderAnimatedLogo = () => {
    switch (event.iconType) {
      case 'music':
        return (
          <div className="onam-reg-animated-logo music-logo-anim">
            <Music size={56} color="var(--onam-gold-warm)" />
            <div className="music-pulse-ring" />
          </div>
        );
      case 'dance':
        return (
          <div className="onam-reg-animated-logo dance-logo-anim">
            <Activity size={56} color="var(--onam-gold-warm)" />
            <div className="dance-aura-glow" />
          </div>
        );
      case 'games':
        return (
          <div className="onam-reg-animated-logo games-logo-anim">
            <Gamepad2 size={56} color="var(--onam-gold-warm)" />
            <div className="games-bounce-ring" />
          </div>
        );
      default:
        return <Sparkles size={56} color="var(--onam-gold-warm)" />;
    }
  };

  return (
    <div className="onam-reg-card-wrapper">
      <div
        ref={cardRef}
        className="onam-reg-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onClick(event)}
        style={{ transform: transformStyle }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(event)}
        aria-label={`Open registration for ${event.title}`}
      >
        {/* Dynamic Cursor-Following Spotlight Glow */}
        <div className="onam-reg-card-spotlight" />

        {/* Card Main Content */}
        <div className="onam-reg-card-content">
          {/* Top Category Badge */}
          <div className="onam-reg-badge" style={{ fontSize: '0.75rem', padding: '0.3rem 0.9rem', marginBottom: '0.5rem' }}>
            {event.badge}
          </div>

          {/* CENTRALIZED PICTURE / LOGO FRAME WITH ANIMATED LOGO */}
          <div className="onam-reg-central-art-frame">
            {renderAnimatedLogo()}
          </div>

          {/* HEADING & SUBHEADING WRITTEN CENTERED BELOW THE PICTURE */}
          <h3 className="onam-reg-card-title">{event.title}</h3>
          
          {/* Script Cursive Subheading */}
          <div className="onam-reg-card-script-sub">{event.scriptSub}</div>

          <div className="onam-reg-card-subtitle">{event.subtitle}</div>
          <p className="onam-reg-card-desc">{event.tagline}</p>

          {/* PILL BUTTON */}
          <div className="onam-reg-card-pill-btn">
            <span>{event.comingSoon ? 'EXPLORE' : 'EXPLORE & REGISTER'}</span>
            <ArrowRight size={18} />
          </div>
        </div>

        {/* EVENT-SPECIFIC BACKGROUND VISUALIZER ANIMATIONS */}
        <div className="onam-reg-visualizer-container">
          {event.iconType === 'music' && (
            <div className="onam-reg-eq-bars">
              <div className="onam-reg-eq-bar" />
              <div className="onam-reg-eq-bar" />
              <div className="onam-reg-eq-bar" />
              <div className="onam-reg-eq-bar" />
              <div className="onam-reg-eq-bar" />
            </div>
          )}

          {event.iconType === 'dance' && (
            <>
              <div className="onam-reg-flow-particle" />
              <div className="onam-reg-flow-particle" />
              <div className="onam-reg-flow-particle" />
            </>
          )}

          {event.iconType === 'games' && (
            <div className="onam-reg-games-orbit">
              <div className="onam-reg-orbit-token" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
