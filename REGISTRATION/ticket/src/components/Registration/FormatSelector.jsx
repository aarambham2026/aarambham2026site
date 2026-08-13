import React, { useState } from 'react';
import { User, Users, UserPlus, Sparkles, ArrowRight } from 'lucide-react';
import { FORMAT_DESCRIPTIONS } from './config';

const FormatSelector = ({ formats, onSelectFormat, eventTitle }) => {
  const [selectedFormat, setSelectedFormat] = useState(null);

  const handleFormatClick = (fmt) => {
    setSelectedFormat(fmt);
    setTimeout(() => {
      onSelectFormat(fmt);
    }, 450);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="onam-reg-badge" style={{ margin: '0 auto 0.8rem auto' }}>
        <Sparkles size={14} /> STEP 1: CHOOSE FORMAT
      </div>

      <h2 className="onam-reg-title" style={{ fontSize: '2.4rem', marginBottom: '0.2rem' }}>
        Select Performance Format
      </h2>
      
      <div className="onam-reg-script-title" style={{ fontSize: '1.6rem', marginBottom: '0.8rem' }}>
        Solo, Duo or Group Acts for {eventTitle}
      </div>

      <p className="onam-reg-subtitle" style={{ fontSize: '0.95rem', marginBottom: '2rem' }}>
        Choose your participation format to reveal the custom registration entry form.
      </p>

      <div className="onam-reg-format-grid">
        {formats.map((fmt) => {
          const config = FORMAT_DESCRIPTIONS[fmt];
          const isSelected = selectedFormat === fmt;
          const isOtherSelected = selectedFormat !== null && !isSelected;

          let cardClass = 'onam-reg-format-card';
          if (isSelected) cardClass += ' selected-expanding';
          if (isOtherSelected) cardClass += ' animating-away';

          return (
            <div
              key={fmt}
              className={cardClass}
              data-format={fmt}
              onClick={() => !selectedFormat && handleFormatClick(fmt)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !selectedFormat && handleFormatClick(fmt)}
              aria-label={`Select ${config.title} format`}
            >
              {/* SOLO UNIQUE HOVER VISUAL: Golden Ripple */}
              {fmt === 'solo' && (
                <>
                  <div className="onam-reg-solo-ripple" />
                  <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    margin: '0 auto 1.2rem auto', 
                    borderRadius: '50%',
                    background: 'rgba(232, 219, 204, 0.15)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    color: 'var(--onam-gold-warm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User size={32} />
                  </div>
                </>
              )}

              {/* DUO UNIQUE HOVER VISUAL: Converging Twin Icons */}
              {fmt === 'duo' && (
                <div className="onam-reg-duo-twin-container">
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    background: 'rgba(232, 219, 204, 0.15)', 
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    color: 'var(--onam-gold-warm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User size={25} />
                  </div>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    background: 'rgba(232, 219, 204, 0.15)', 
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    color: 'var(--onam-gold-warm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <UserPlus size={25} />
                  </div>
                </div>
              )}

              {/* GROUP UNIQUE HOVER VISUAL: Orbit Ring */}
              {fmt === 'group' && (
                <div className="onam-reg-group-orbit-ring">
                  <div style={{ 
                    position: 'absolute', 
                    inset: '4px',
                    borderRadius: '50%', 
                    background: 'rgba(232, 219, 204, 0.15)', 
                    color: 'var(--onam-gold-warm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Users size={28} />
                  </div>
                </div>
              )}

              <h3 style={{ 
                fontFamily: 'var(--onam-font-title)', 
                fontSize: '1.6rem', 
                color: 'var(--onam-cream)', 
                margin: '0 0 0.3rem 0',
                letterSpacing: '0.05em'
              }}>
                {config.title}
              </h3>

              <div style={{ fontSize: '0.85rem', color: 'var(--onam-gold-warm)', fontWeight: 700, marginBottom: '0.8rem' }}>
                {config.label}
              </div>

              <p style={{ fontSize: '0.88rem', color: 'rgba(232, 219, 204, 0.75)', lineHeight: 1.5, margin: '0 0 1.4rem 0' }}>
                {config.description}
              </p>

              <div className="onam-reg-card-pill-btn" style={{ fontSize: '0.85rem', padding: '0.6rem 1.4rem' }}>
                Select Format <ArrowRight size={16} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormatSelector;
