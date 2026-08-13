import React from 'react';
import { User, Users, Mail, Phone, BookOpen, GraduationCap, AlertCircle } from 'lucide-react';
import { DEPARTMENTS, ACADEMIC_YEARS } from './config';

const SingleParticipantGroup = ({ prefix, title, values, errors, onChange, isSolo = false }) => {
  const getVal = (field) => values[field] || '';
  const getErr = (field) => errors[`${prefix}_${field}`] || errors[field];

  return (
    <div className="onam-reg-form-section">
      <div className="onam-reg-section-title">
        <User size={20} /> {title}
      </div>

      <div className="onam-reg-form-grid">
        {/* Full Name */}
        <div className={`onam-reg-form-group ${getErr('name') ? 'has-error' : ''}`}>
          <label className="onam-reg-label">
            <span>Full Name</span> <span className="onam-reg-required">*</span>
          </label>
          <input
            type="text"
            className="onam-reg-input"
            placeholder="Participant Full Name"
            value={getVal('name')}
            onChange={(e) => onChange(prefix, 'name', e.target.value)}
          />
          {getErr('name') && (
            <div className="onam-reg-error-msg">
              <AlertCircle size={12} /> {getErr('name')}
            </div>
          )}
        </div>

        {/* Roll Number */}
        <div className={`onam-reg-form-group ${getErr('rollNo') ? 'has-error' : ''}`}>
          <label className="onam-reg-label">
            <span>Roll Number</span> <span className="onam-reg-required">*</span>
          </label>
          <input
            type="text"
            className="onam-reg-input"
            placeholder="e.g. 21CS045"
            value={getVal('rollNo')}
            onChange={(e) => onChange(prefix, 'rollNo', e.target.value)}
          />
          {getErr('rollNo') && (
            <div className="onam-reg-error-msg">
              <AlertCircle size={12} /> {getErr('rollNo')}
            </div>
          )}
        </div>

        {/* Department */}
        <div className={`onam-reg-form-group ${getErr('department') ? 'has-error' : ''}`}>
          <label className="onam-reg-label">
            <span>Department</span> <span className="onam-reg-required">*</span>
          </label>
          <select
            className="onam-reg-select"
            value={getVal('department')}
            onChange={(e) => onChange(prefix, 'department', e.target.value)}
          >
            <option value="">Select Department</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {getErr('department') && (
            <div className="onam-reg-error-msg">
              <AlertCircle size={12} /> {getErr('department')}
            </div>
          )}
        </div>

        {/* Year / Semester */}
        <div className={`onam-reg-form-group ${getErr('year') ? 'has-error' : ''}`}>
          <label className="onam-reg-label">
            <span>Year / Semester</span> <span className="onam-reg-required">*</span>
          </label>
          <select
            className="onam-reg-select"
            value={getVal('year')}
            onChange={(e) => onChange(prefix, 'year', e.target.value)}
          >
            <option value="">Select Academic Year</option>
            {ACADEMIC_YEARS.map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
          {getErr('year') && (
            <div className="onam-reg-error-msg">
              <AlertCircle size={12} /> {getErr('year')}
            </div>
          )}
        </div>

        {/* Email & Phone only for Solo or Primary Contact */}
        {isSolo && (
          <>
            <div className={`onam-reg-form-group ${getErr('email') ? 'has-error' : ''}`}>
              <label className="onam-reg-label">
                <span>Email Address</span> <span className="onam-reg-required">*</span>
              </label>
              <input
                type="email"
                className="onam-reg-input"
                placeholder="student@college.edu"
                value={getVal('email')}
                onChange={(e) => onChange(prefix, 'email', e.target.value)}
              />
              {getErr('email') && (
                <div className="onam-reg-error-msg">
                  <AlertCircle size={12} /> {getErr('email')}
                </div>
              )}
            </div>

            <div className={`onam-reg-form-group ${getErr('phone') ? 'has-error' : ''}`}>
              <label className="onam-reg-label">
                <span>Phone Number</span> <span className="onam-reg-required">*</span>
              </label>
              <input
                type="tel"
                className="onam-reg-input"
                placeholder="10-digit mobile number"
                value={getVal('phone')}
                onChange={(e) => onChange(prefix, 'phone', e.target.value)}
              />
              {getErr('phone') && (
                <div className="onam-reg-error-msg">
                  <AlertCircle size={12} /> {getErr('phone')}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ParticipantFields = ({ format, formData, errors, onChange }) => {
  if (format === 'solo') {
    return (
      <SingleParticipantGroup
        prefix="participant"
        title="Participant Details"
        values={formData.participant || {}}
        errors={errors}
        onChange={onChange}
        isSolo={true}
      />
    );
  }

  if (format === 'duo') {
    return (
      <>
        <SingleParticipantGroup
          prefix="participant1"
          title="Participant 1 (Lead)"
          values={formData.participant1 || {}}
          errors={errors}
          onChange={onChange}
          isSolo={true}
        />
        <SingleParticipantGroup
          prefix="participant2"
          title="Participant 2 (Partner)"
          values={formData.participant2 || {}}
          errors={errors}
          onChange={onChange}
          isSolo={false}
        />
      </>
    );
  }

  if (format === 'group') {
    return (
      <SingleParticipantGroup
        prefix="teamLeader"
        title="Team Leader Details"
        values={formData.teamLeader || {}}
        errors={errors}
        onChange={onChange}
        isSolo={true}
      />
    );
  }

  return null;
};

export default ParticipantFields;
