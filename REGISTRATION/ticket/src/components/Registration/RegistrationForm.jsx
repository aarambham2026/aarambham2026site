import React, { useState } from 'react';
import { ArrowLeft, Music, Disc, Clock, AlertCircle } from 'lucide-react';
import ParticipantFields from './ParticipantFields';
import DynamicMemberList from './DynamicMemberList';
import AudioUploader from './AudioUploader';
import SubmitButton from './SubmitButton';
import { validateRollNumber, validateEmail, validatePhone } from '../../utils/validation';

const RegistrationForm = ({ eventConfig, format, onBack, onSubmit, isSubmitting }) => {
  // Form State
  const [formData, setFormData] = useState({
    participant: { name: '', rollNo: '', department: '', year: '', email: '', phone: '' },
    participant1: { name: '', rollNo: '', department: '', year: '', email: '', phone: '' },
    participant2: { name: '', rollNo: '', department: '', year: '' },
    teamLeader: { name: '', rollNo: '', department: '', year: '', email: '', phone: '' },
    members: [
      { id: 'm1', name: '', rollNo: '' },
      { id: 'm2', name: '', rollNo: '' },
      { id: 'm3', name: '', rollNo: '' }
    ],
    performance: {
      type: '',
      musicType: '',
      danceType: '',
      genre: '',
      duration: '',
      numPerformers: ''
    },
    audioFile: null
  });

  const [errors, setErrors] = useState({});

  // Field change handler for nested objects
  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    // Clear error for this field
    const errKey = `${section}_${field}`;
    if (errors[errKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errKey];
        return next;
      });
    }
  };

  const handlePerformanceChange = (field, value) => {
    handleNestedChange('performance', field, value);
  };

  // Group Members Handlers
  const handleAddMember = () => {
    if (1 + formData.members.length >= 12) return;
    setFormData((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        { id: `m_${Date.now()}`, name: '', rollNo: '' }
      ]
    }));
  };

  const handleRemoveMember = (index) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index)
    }));
  };

  const handleMemberChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedMembers = [...prev.members];
      updatedMembers[index] = { ...updatedMembers[index], [field]: value };
      return { ...prev, members: updatedMembers };
    });

    const errKey = `member_${index}_${field}`;
    if (errors[errKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errKey];
        return next;
      });
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    const checkSinglePerson = (prefix, dataObj, isSoloContact = false) => {
      if (!dataObj?.name?.trim()) newErrors[`${prefix}_name`] = 'Name is required';
      
      const rollVal = validateRollNumber(dataObj?.rollNo);
      if (!rollVal.isValid) newErrors[`${prefix}_rollNo`] = rollVal.message;

      if (!dataObj?.department) newErrors[`${prefix}_department`] = 'Select department';
      if (!dataObj?.year) newErrors[`${prefix}_year`] = 'Select year';

      if (isSoloContact) {
        const emailVal = validateEmail(dataObj?.email);
        if (!emailVal.isValid) newErrors[`${prefix}_email`] = emailVal.message;

        const phoneVal = validatePhone(dataObj?.phone);
        if (!phoneVal.isValid) newErrors[`${prefix}_phone`] = phoneVal.message;
      }
    };

    if (format === 'solo') {
      checkSinglePerson('participant', formData.participant, true);
    } else if (format === 'duo') {
      checkSinglePerson('participant1', formData.participant1, true);
      checkSinglePerson('participant2', formData.participant2, false);
    } else if (format === 'group') {
      checkSinglePerson('teamLeader', formData.teamLeader, true);

      // Validate group members
      formData.members.forEach((mem, idx) => {
        if (!mem.name?.trim()) newErrors[`member_${idx}_name`] = 'Member name required';
        const memRoll = validateRollNumber(mem.rollNo);
        if (!memRoll.isValid) newErrors[`member_${idx}_rollNo`] = memRoll.message;
      });
    }

    // Performance details validation
    if (eventConfig.id === 'music') {
      if (!formData.performance.musicType) newErrors['perf_musicType'] = 'Select music category';
      if (!formData.performance.genre?.trim()) newErrors['perf_genre'] = 'Genre is required';
    } else if (eventConfig.id === 'dance') {
      if (!formData.performance.danceType) newErrors['perf_danceType'] = 'Select dance style';
    }

    if (!formData.performance.duration?.trim()) newErrors['perf_duration'] = 'Duration is required';

    if (format === 'group' && eventConfig.id === 'dance') {
      if (!formData.performance.numPerformers) newErrors['perf_numPerformers'] = 'Specify number of performers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        event: eventConfig.id,
        format,
        ...formData
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="onam-reg-form">
      {/* Top Form Navigation */}
      <div className="onam-reg-form-nav">
        <button type="button" className="onam-reg-back-btn" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Format Selection
        </button>

        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--onam-gold-warm)' }}>
          {eventConfig.title} &nbsp;•&nbsp; {format.toUpperCase()} REGISTRATION
        </div>
      </div>

      {/* Participant(s) Section */}
      <ParticipantFields
        format={format}
        formData={formData}
        errors={errors}
        onChange={handleNestedChange}
      />

      {/* Dynamic Group Member System for Group format */}
      {format === 'group' && (
        <DynamicMemberList
          members={formData.members}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          onMemberChange={handleMemberChange}
          errors={errors}
        />
      )}

      {/* Performance Information Section */}
      <div className="onam-reg-form-section">
        <div className="onam-reg-section-title">
          <Disc size={20} /> Performance Details
        </div>

        <div className="onam-reg-form-grid">
          {/* Event Specific Performance Type */}
          {eventConfig.id === 'music' ? (
            <>
              <div className={`onam-reg-form-group ${errors['perf_musicType'] ? 'has-error' : ''}`}>
                <label className="onam-reg-label">
                  <span>Music Type</span> <span className="onam-reg-required">*</span>
                </label>
                <select
                  className="onam-reg-select"
                  value={formData.performance.musicType}
                  onChange={(e) => handlePerformanceChange('musicType', e.target.value)}
                >
                  <option value="">Select Music Type</option>
                  {eventConfig.musicTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors['perf_musicType'] && (
                  <div className="onam-reg-error-msg">
                    <AlertCircle size={12} /> {errors['perf_musicType']}
                  </div>
                )}
              </div>

              <div className={`onam-reg-form-group ${errors['perf_genre'] ? 'has-error' : ''}`}>
                <label className="onam-reg-label">
                  <span>Genre / Style</span> <span className="onam-reg-required">*</span>
                </label>
                <input
                  type="text"
                  className="onam-reg-input"
                  placeholder="e.g. Classical Carnatic / Acoustic Fusion"
                  value={formData.performance.genre}
                  onChange={(e) => handlePerformanceChange('genre', e.target.value)}
                />
                {errors['perf_genre'] && (
                  <div className="onam-reg-error-msg">
                    <AlertCircle size={12} /> {errors['perf_genre']}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={`onam-reg-form-group ${errors['perf_danceType'] ? 'has-error' : ''}`}>
              <label className="onam-reg-label">
                <span>Dance Style</span> <span className="onam-reg-required">*</span>
              </label>
              <select
                className="onam-reg-select"
                value={formData.performance.danceType}
                onChange={(e) => handlePerformanceChange('danceType', e.target.value)}
              >
                <option value="">Select Dance Style</option>
                {eventConfig.danceTypes.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
              {errors['perf_danceType'] && (
                <div className="onam-reg-error-msg">
                  <AlertCircle size={12} /> {errors['perf_danceType']}
                </div>
              )}
            </div>
          )}

          {/* Performance Duration */}
          <div className={`onam-reg-form-group ${errors['perf_duration'] ? 'has-error' : ''}`}>
            <label className="onam-reg-label">
              <span>Expected Duration</span> <span className="onam-reg-required">*</span>
            </label>
            <input
              type="text"
              className="onam-reg-input"
              placeholder="e.g. 4 Mins 30 Secs (Max 6 Mins)"
              value={formData.performance.duration}
              onChange={(e) => handlePerformanceChange('duration', e.target.value)}
            />
            {errors['perf_duration'] && (
              <div className="onam-reg-error-msg">
                <AlertCircle size={12} /> {errors['perf_duration']}
              </div>
            )}
          </div>

          {/* Dance Group: Number of Performers */}
          {format === 'group' && eventConfig.id === 'dance' && (
            <div className={`onam-reg-form-group ${errors['perf_numPerformers'] ? 'has-error' : ''}`}>
              <label className="onam-reg-label">
                <span>Number of On-stage Performers</span> <span className="onam-reg-required">*</span>
              </label>
              <input
                type="number"
                min="3"
                max="12"
                className="onam-reg-input"
                placeholder="e.g. 8"
                value={formData.performance.numPerformers}
                onChange={(e) => handlePerformanceChange('numPerformers', e.target.value)}
              />
              {errors['perf_numPerformers'] && (
                <div className="onam-reg-error-msg">
                  <AlertCircle size={12} /> {errors['perf_numPerformers']}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Audio Uploader Component */}
      <AudioUploader
        audioFile={formData.audioFile}
        onFileSelect={(file) => setFormData((prev) => ({ ...prev, audioFile: file }))}
        onFileRemove={() => setFormData((prev) => ({ ...prev, audioFile: null }))}
      />

      {/* Submit Action */}
      <SubmitButton isSubmitting={isSubmitting} text={`SUBMIT ${eventConfig.title} (${format.toUpperCase()}) REGISTRATION`} />
    </form>
  );
};

export default RegistrationForm;
