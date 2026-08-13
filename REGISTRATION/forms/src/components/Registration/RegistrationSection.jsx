import React, { useState } from 'react';
import EventCard from './EventCard';
import EventModal from './EventModal';
import { EVENT_CONFIG } from './config';
import { Sparkles, Calendar } from 'lucide-react';
import './registration.css';

const RegistrationSection = () => {
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  const handleCardClick = (eventData) => {
    setActiveModalEvent(eventData);
  };

  const handleCloseModal = () => {
    setActiveModalEvent(null);
  };

  const events = Object.values(EVENT_CONFIG);

  return (
    <section className="onam-reg-container" id="onam-registration-module">
      {/* Background Crumpled Paper & Kathakali Pattern */}
      <div className="onam-reg-bg-pattern" />

      {/* Header Section */}
      <div className="onam-reg-header">
        <div className="onam-reg-badge">
          <Sparkles size={14} /> CULTURAL REGISTRATION MODULE
        </div>

        <h1 className="onam-reg-title">EVENT REGISTRATION</h1>

        <div className="onam-reg-wireframe-line" />

        <p className="onam-reg-subtitle">
          Step into the vibrant spirit of Onam! Explore our event categories below to register for Solo, Duo, or Group cultural performances.
        </p>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '1.5rem',
          fontSize: '0.9rem',
          color: 'var(--onam-gold-warm)',
          fontWeight: 700
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} /> Open for All Batches
          </div>
        </div>
      </div>

      {/* Primary 3 Event Cards Grid */}
      <div className="onam-reg-grid">
        {events.map((eventObj) => (
          <EventCard
            key={eventObj.id}
            event={eventObj}
            onClick={handleCardClick}
          />
        ))}
      </div>

      {/* Centralized Registration Modal */}
      {activeModalEvent && (
        <EventModal
          selectedEvent={activeModalEvent}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
};

export const Registration = RegistrationSection;
export default RegistrationSection;
