import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Check, Sparkles, Calendar, Ticket } from 'lucide-react';

const SuccessScreen = ({ registrationResult, onDone, eventTitle, formatTitle }) => {
  useEffect(() => {
    // Burst Onam-themed golden flower confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F2C94C', '#FFF8E7', '#7A263A', '#1F5C45']
      });
    } catch (e) {
      // Graceful fallback if canvas-confetti blocked
    }
  }, []);

  const regId = registrationResult?.registrationId || 'ONAM-94A21F';

  return (
    <div className="onam-reg-success-container">
      {/* Animated Golden Ring + Drawing Checkmark */}
      <div className="onam-reg-success-ring">
        <svg className="checkmark" viewBox="0 0 52 52">
          <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div>

      <div className="onam-reg-badge" style={{ margin: '0 auto 1rem auto' }}>
        <Sparkles size={14} /> ONAM CULTURAL EVENT
      </div>

      <h2 className="onam-reg-title" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
        REGISTRATION COMPLETE
      </h2>

      <p style={{ color: 'rgba(255, 248, 231, 0.8)', fontSize: '1.05rem', margin: '0 0 1.5rem 0' }}>
        Your registration for <strong>{eventTitle} ({formatTitle.toUpperCase()})</strong> has been received successfully!
      </p>

      <div style={{ fontSize: '0.85rem', color: 'rgba(255, 248, 231, 0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Official Registration Pass ID
      </div>

      <div className="onam-reg-id-badge">
        <Ticket size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
        {regId}
      </div>

      <div style={{ 
        background: 'rgba(18, 55, 42, 0.4)', 
        border: '1px solid rgba(212, 175, 55, 0.2)', 
        borderRadius: '12px', 
        padding: '1rem',
        maxWidth: '480px',
        margin: '0 auto 2rem auto',
        fontSize: '0.88rem',
        color: 'rgba(255, 248, 231, 0.75)',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--onam-warm-gold)', fontWeight: 700, marginBottom: '0.4rem' }}>
          <Calendar size={16} /> Confirmation Note
        </div>
        A confirmation receipt with performance schedule details will be sent to the registered contact details. Please keep your Registration ID handy for desk check-in.
      </div>

      <button
        type="button"
        className="onam-reg-submit-btn"
        onClick={onDone}
        style={{ maxWidth: '280px', margin: '0 auto' }}
      >
        <span>DONE</span>
      </button>
    </div>
  );
};

export default SuccessScreen;
