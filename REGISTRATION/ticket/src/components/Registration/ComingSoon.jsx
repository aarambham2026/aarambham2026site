import React from 'react';
import { Gamepad2, Clock, X } from 'lucide-react';

const ComingSoon = ({ onClose, eventConfig }) => {
  return (
    <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
      <div 
        style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          background: 'rgba(212, 175, 55, 0.15)', 
          border: '1px solid rgba(212, 175, 55, 0.4)',
          color: 'var(--onam-warm-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
          boxShadow: '0 0 25px rgba(212, 175, 55, 0.25)'
        }}
      >
        <Gamepad2 size={42} />
      </div>

      <div className="onam-reg-badge" style={{ margin: '0 auto 0.8rem auto' }}>
        <Clock size={14} /> ONAKALIKAL 2026
      </div>

      <h2 className="onam-reg-title" style={{ fontSize: '2.4rem', marginBottom: '0.4rem' }}>
        GAMES
      </h2>

      <div style={{ 
        fontFamily: 'var(--onam-font-heading)', 
        fontSize: '1.4rem', 
        color: 'var(--onam-warm-gold)', 
        fontWeight: 700,
        letterSpacing: 0.05,
        marginBottom: '1rem'
      }}>
        Coming Soon
      </div>

      <p style={{ color: 'rgba(255, 248, 231, 0.8)', fontSize: '1.05rem', maxWidth: '420px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
        Game registrations (Vadam Vali, Sundari Kk Pottu Thottal, Kayyamkali & more) will open shortly! Stay tuned for slot announcements.
      </p>

      <button
        type="button"
        className="onam-reg-back-btn"
        onClick={onClose}
        style={{ padding: '0.75rem 2rem', fontSize: '1rem', borderRadius: '50px', background: 'rgba(212, 175, 55, 0.2)' }}
      >
        <X size={18} /> CLOSE
      </button>
    </div>
  );
};

export default ComingSoon;
