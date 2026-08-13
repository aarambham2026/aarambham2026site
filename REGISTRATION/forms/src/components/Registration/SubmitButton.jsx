import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const SubmitButton = ({ isSubmitting, text = 'REGISTER FOR EVENT' }) => {
  return (
    <button
      type="submit"
      className="onam-reg-submit-btn"
      disabled={isSubmitting}
      aria-busy={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <div className="onam-reg-spinner" />
          <span>Processing Registration...</span>
        </>
      ) : (
        <>
          <Sparkles size={20} color="#101612" />
          <span>{text}</span>
          <ArrowRight size={20} color="#101612" style={{ transition: 'transform 0.25s ease' }} />
        </>
      )}
    </button>
  );
};

export default SubmitButton;
