import React, { useEffect, useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import FormatSelector from './FormatSelector';
import RegistrationForm from './RegistrationForm';
import SuccessScreen from './SuccessScreen';
import ComingSoon from './ComingSoon';
import { submitRegistration } from '../../services/registrationService';

const EventModal = ({ selectedEvent, onClose }) => {
  // Modal internal state machine: 'FORMAT_SELECTION' | 'REGISTRATION_FORM' | 'SUBMITTING' | 'SUCCESS' | 'COMING_SOON'
  const [modalState, setModalState] = useState(() => {
    return selectedEvent?.comingSoon ? 'COMING_SOON' : 'FORMAT_SELECTION';
  });

  const [selectedFormat, setSelectedFormat] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationResult, setRegistrationResult] = useState(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Close with ESC key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        attemptClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalState, selectedFormat]);

  const attemptClose = () => {
    // If user is inside the form or has selected a format (and not success/coming soon), confirm discard
    if (modalState === 'REGISTRATION_FORM' || (modalState === 'FORMAT_SELECTION' && selectedFormat)) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const handleFormatSelect = (format) => {
    setSelectedFormat(format);
    setModalState('REGISTRATION_FORM');
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const result = await submitRegistration(formData);
      setRegistrationResult(result);
      setModalState('SUCCESS');
    } catch (err) {
      alert(err?.message || 'Registration submission failed. Please try submitting again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedEvent) return null;

  return (
    <div
      className="onam-reg-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) attemptClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="onam-reg-modal">
        {/* Modal Header Close Button */}
        <button
          type="button"
          className="onam-reg-modal-close"
          onClick={attemptClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="onam-reg-modal-body">
          {/* STATE 1: GAMES COMING SOON */}
          {modalState === 'COMING_SOON' && (
            <ComingSoon onClose={onClose} eventConfig={selectedEvent} />
          )}

          {/* STATE 2: FORMAT SELECTION (SOLO / DUO / GROUP) */}
          {modalState === 'FORMAT_SELECTION' && (
            <FormatSelector
              formats={selectedEvent.formats || ['solo', 'duo', 'group']}
              onSelectFormat={handleFormatSelect}
              eventTitle={selectedEvent.title}
            />
          )}

          {/* STATE 3: DYNAMIC REGISTRATION FORM */}
          {modalState === 'REGISTRATION_FORM' && selectedFormat && (
            <RegistrationForm
              eventConfig={selectedEvent}
              format={selectedFormat}
              onBack={() => setModalState('FORMAT_SELECTION')}
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {/* STATE 4: SUCCESS STATE */}
          {modalState === 'SUCCESS' && (
            <SuccessScreen
              registrationResult={registrationResult}
              onDone={onClose}
              eventTitle={selectedEvent.title}
              formatTitle={selectedFormat || ''}
            />
          )}
        </div>
      </div>

      {/* DISCARD UNCONFIRMED FORM DATA MODAL */}
      {showDiscardConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000,
            background: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: '#17221B',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '16px',
              padding: '1.8rem',
              maxWidth: '420px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
            }}
          >
            <div style={{ color: '#F2C94C', display: 'flex', justifyContent: 'center', marginBottom: '0.8rem' }}>
              <AlertTriangle size={40} />
            </div>

            <h3 style={{ fontFamily: 'var(--onam-font-heading)', fontSize: '1.4rem', margin: '0 0 0.5rem 0', color: '#FFF8E7' }}>
              Discard registration?
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 248, 231, 0.75)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              You have unsubmitted details in your registration form. Are you sure you want to discard them and exit?
            </p>

            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
              <button
                type="button"
                className="onam-reg-back-btn"
                onClick={() => setShowDiscardConfirm(false)}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Continue Editing
              </button>

              <button
                type="button"
                className="onam-reg-back-btn"
                onClick={() => {
                  setShowDiscardConfirm(false);
                  onClose();
                }}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  background: 'rgba(122, 38, 58, 0.6)',
                  borderColor: '#FF5A5A',
                  color: '#FFF'
                }}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventModal;
