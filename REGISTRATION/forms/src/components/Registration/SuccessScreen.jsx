import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { Sparkles, Calendar, Ticket, Download } from 'lucide-react';

const SuccessScreen = ({ registrationResult, onDone, eventTitle, formatTitle }) => {
  const [qrDataUrl, setQrDataUrl] = useState('');

  const regId = registrationResult?.registrationId || 'EVT-0001';
  const slotStart = registrationResult?.slotStart || '2:00 PM';
  const slotEnd = registrationResult?.slotEnd || '2:10 PM';
  const ticketUrl = registrationResult?.ticketUrl || `/api/ticket/${regId}`;
  const teamLeader = registrationResult?.details?.primaryContact || 'Participant';
  const eventCategory = (eventTitle || 'MUSIC').toUpperCase();
  const memberCount = registrationResult?.details?.membersCount || 1;

  useEffect(() => {
    // Burst Onam-themed golden flower confetti
    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F2C94C', '#FFF8E7', '#7A263A', '#1F5C45']
      });
    } catch (e) {
      // Fallback
    }

    // Generate high-res QR code encoding Event ID (e.g. EVT-0001)
    QRCode.toDataURL(regId, { width: 300, margin: 1, color: { dark: '#000000', light: '#FFFFFF' } })
      .then(url => setQrDataUrl(url))
      .catch(() => {});
  }, [regId]);

  return (
    <div className="onam-reg-success-container" style={{ textAlign: 'center', padding: '0.5rem 0' }}>
      {/* Animated Golden Ring + Checkmark */}
      <div className="onam-reg-success-ring" style={{ margin: '0 auto 0.8rem auto' }}>
        <svg className="checkmark" viewBox="0 0 52 52">
          <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div>

      <div className="onam-reg-badge" style={{ margin: '0 auto 0.6rem auto' }}>
        <Sparkles size={14} /> ONAM CULTURAL EVENT
      </div>

      <h2 className="onam-reg-title" style={{ fontSize: '1.9rem', marginBottom: '0.3rem' }}>
        Registration Successful!
      </h2>

      <p style={{ color: 'rgba(255, 248, 231, 0.85)', fontSize: '0.95rem', margin: '0 0 1rem 0' }}>
        Your stage performance slot for <strong>{eventCategory}</strong> is confirmed.
      </p>

      {/* Badges Row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.8rem',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <div className="onam-reg-id-badge" style={{ margin: 0, padding: '0.4rem 1.2rem', fontSize: '1.05rem' }}>
          <Ticket size={18} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
          {regId}
        </div>

        <div style={{
          background: 'rgba(242, 201, 76, 0.15)',
          border: '1px solid rgba(242, 201, 76, 0.45)',
          borderRadius: '50px',
          padding: '0.45rem 1.2rem',
          fontSize: '0.9rem',
          fontWeight: 800,
          color: 'var(--onam-gold-warm)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <Calendar size={16} /> Slot: {slotStart} - {slotEnd}
        </div>
      </div>

      {/* INSTANT VISUAL TICKET CARD (Matching Printed PDF Ticket 100%) */}
      <div style={{
        margin: '0 auto 1.2rem auto',
        maxWidth: '320px',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '2px solid rgba(242, 201, 76, 0.55)',
        boxShadow: '0 18px 45px rgba(0,0,0,0.75)',
        background: '#1b1226',
        position: 'relative'
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '267 / 822',
          backgroundImage: 'url(/templates/ticket-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          textAlign: 'left',
          fontFamily: "'Montserrat', 'Outfit', sans-serif",
          color: '#FFFFFF',
          boxSizing: 'border-box'
        }}>
          {/* Line 1: EVENT: MUSIC */}
          <div style={{
            position: 'absolute',
            top: '52.5%',
            left: '6.7%',
            right: '6.7%',
            fontSize: '0.78rem',
            fontWeight: 900,
            color: '#F2C94C',
            textShadow: '0 2px 4px rgba(0,0,0,0.85)'
          }}>
            EVENT: {eventCategory}
          </div>

          {/* Line 2: TEAM LEADER: Gautham Suresh */}
          <div style={{
            position: 'absolute',
            top: '55.5%',
            left: '6.7%',
            right: '6.7%',
            fontSize: '0.78rem',
            fontWeight: 900,
            color: '#FFFFFF',
            textShadow: '0 2px 4px rgba(0,0,0,0.85)'
          }}>
            TEAM LEADER: {teamLeader}
          </div>

          {/* Line 3: NO. OF MEMBERS: 1 */}
          <div style={{
            position: 'absolute',
            top: '58.5%',
            left: '6.7%',
            right: '6.7%',
            fontSize: '0.74rem',
            fontWeight: 800,
            color: '#FFFFFF',
            textShadow: '0 2px 4px rgba(0,0,0,0.85)'
          }}>
            NO. OF MEMBERS: {memberCount}
          </div>

          {/* Line 4: SLOT TIME: 2:08 PM - 2:13 PM */}
          <div style={{
            position: 'absolute',
            top: '61.5%',
            left: '6.7%',
            right: '6.7%',
            fontSize: '0.78rem',
            fontWeight: 900,
            color: '#FFFFFF',
            textShadow: '0 2px 4px rgba(0,0,0,0.85)'
          }}>
            SLOT TIME: <span style={{ color: '#F2C94C' }}>{slotStart} - {slotEnd}</span>
          </div>

          {/* Line 5: REGISTRATION ID: EVT-0002 */}
          <div style={{
            position: 'absolute',
            top: '64.5%',
            left: '6.7%',
            right: '6.7%',
            fontSize: '0.78rem',
            fontWeight: 900,
            color: '#E65100',
            textShadow: '0 2px 4px rgba(0,0,0,0.85)'
          }}>
            REGISTRATION ID: {regId}
          </div>

          {/* Bottom White Space Section: Centered QR Code */}
          {qrDataUrl && (
            <div style={{
              position: 'absolute',
              bottom: '5.5%',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center'
            }}>
              <img
                src={qrDataUrl}
                alt={`QR Code for ${regId}`}
                style={{
                  width: '145px',
                  height: '145px',
                  borderRadius: '6px',
                  border: '1px solid #DDD',
                  display: 'block'
                }}
              />
            </div>
          )}

          {/* Text Centered BELOW QR Code in Bottom White Section */}
          <div style={{
            position: 'absolute',
            bottom: '2.5%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.64rem',
            fontWeight: 900,
            color: '#111111',
            letterSpacing: '0.04em',
            textAlign: 'center',
            width: '100%',
            fontFamily: "'Montserrat', sans-serif"
          }}>
            SUCCESSFULLY REGISTERED
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', maxWidth: '400px', margin: '0 auto' }}>
        <a
          href={ticketUrl}
          download={`ticket-${regId}.pdf`}
          className="onam-reg-submit-btn"
          style={{
            flex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            padding: '0.85rem 1rem',
            fontSize: '0.9rem'
          }}
        >
          <Download size={18} />
          <span>DOWNLOAD E-TICKET PDF</span>
        </a>

        <button
          type="button"
          className="onam-reg-back-btn"
          onClick={onDone}
          style={{ padding: '0.85rem 1.4rem' }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
