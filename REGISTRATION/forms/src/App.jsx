import React from 'react';
import RegistrationSection from './components/Registration/RegistrationSection';

function App() {
  return (
    <div className="demo-host-page" style={{ minHeight: '100vh', background: 'transparent' }}>
      {/* Amrita Vishwa Vidyapeetham Header Banner */}
      <header
        style={{
          background: 'rgba(27, 18, 38, 0.95)',
          color: '#fff5ec',
          padding: '1rem 2rem',
          textAlign: 'center',
          borderBottom: '1px solid rgba(242, 201, 76, 0.35)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem'
        }}
      >
        <div 
          style={{ 
            fontFamily: "'Cinzel', serif", 
            fontSize: '1.4rem', 
            fontWeight: 800, 
            letterSpacing: '0.25em',
            color: '#FFFFFF',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}
        >
          AMRITA VISHWA VIDYAPEETHAM
        </div>
        <div style={{ fontSize: '0.78rem', color: '#F2C94C', letterSpacing: '0.15em', fontWeight: 600, textTransform: 'uppercase' }}>
          Onam Cultural Fest 2026 • Registration Module
        </div>
      </header>

      {/* THE EVENT REGISTRATION MODULE COMPONENT */}
      <main>
        <RegistrationSection />
      </main>

      {/* Footer */}
      <footer 
        style={{ 
          textAlign: 'center', 
          padding: '2rem 1rem', 
          borderTop: '1px solid rgba(242, 201, 76, 0.2)',
          background: 'rgba(27, 18, 38, 0.95)',
          color: 'rgba(255, 245, 236, 0.7)',
          fontSize: '0.85rem'
        }}
      >
        Amrita Vishwa Vidyapeetham • Onam Cultural Registration System
      </footer>
    </div>
  );
}

export default App;
