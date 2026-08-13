import React from 'react';
import { Plus, Trash2, Users, AlertCircle } from 'lucide-react';
import { validateRollNumber } from '../../utils/validation';

const DynamicMemberList = ({ members, onAddMember, onRemoveMember, onMemberChange, errors }) => {
  const TOTAL_MAX_MEMBERS = 12;
  // Total participants = 1 (Team Leader) + members.length
  const totalCount = 1 + members.length;
  const isMaxReached = totalCount >= TOTAL_MAX_MEMBERS;

  return (
    <div className="onam-reg-form-section">
      <div className="onam-reg-members-header">
        <div className="onam-reg-section-title" style={{ borderBottom: 'none', paddingBottom: 0, margin: 0 }}>
          <Users size={20} /> Team Members List
        </div>

        <div className="onam-reg-members-counter">
          Members: {totalCount} / {TOTAL_MAX_MEMBERS}
        </div>
      </div>

      <div style={{ fontSize: '0.82rem', color: 'rgba(255, 248, 231, 0.65)', marginBottom: '1.2rem' }}>
        Team Leader + up to 11 additional team members (Maximum 12 total performers).
      </div>

      {members.map((member, index) => {
        const nameError = errors[`member_${index}_name`];
        const rollError = errors[`member_${index}_rollNo`];

        return (
          <div key={member.id || index} className="onam-reg-member-card entering">
            <div className="onam-reg-member-top">
              <span className="onam-reg-member-name-tag">
                Member {index + 1}
              </span>

              <button
                type="button"
                className="onam-reg-remove-member-btn"
                onClick={() => onRemoveMember(index)}
                aria-label={`Remove Member ${index + 1}`}
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>

            <div className="onam-reg-form-grid">
              <div className={`onam-reg-form-group ${nameError ? 'has-error' : ''}`}>
                <label className="onam-reg-label">
                  <span>Member Name</span> <span className="onam-reg-required">*</span>
                </label>
                <input
                  type="text"
                  className="onam-reg-input"
                  placeholder="Full Name"
                  value={member.name || ''}
                  onChange={(e) => onMemberChange(index, 'name', e.target.value)}
                />
                {nameError && (
                  <div className="onam-reg-error-msg">
                    <AlertCircle size={12} /> {nameError}
                  </div>
                )}
              </div>

              <div className={`onam-reg-form-group ${rollError ? 'has-error' : ''}`}>
                <label className="onam-reg-label">
                  <span>Roll Number</span> <span className="onam-reg-required">*</span>
                </label>
                <input
                  type="text"
                  className="onam-reg-input"
                  placeholder="e.g. 21CS045"
                  value={member.rollNo || ''}
                  onChange={(e) => onMemberChange(index, 'rollNo', e.target.value)}
                />
                {rollError && (
                  <div className="onam-reg-error-msg">
                    <AlertCircle size={12} /> {rollError}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {!isMaxReached ? (
        <button
          type="button"
          className="onam-reg-add-member-btn"
          onClick={onAddMember}
        >
          <Plus size={18} /> + ADD NEW MEMBER
        </button>
      ) : (
        <div style={{ textStyle: 'italic', fontSize: '0.85rem', color: 'var(--onam-warm-gold)', textAlign: 'center', marginTop: '0.8rem' }}>
          Maximum limit of 12 participants reached.
        </div>
      )}
    </div>
  );
};

export default DynamicMemberList;
