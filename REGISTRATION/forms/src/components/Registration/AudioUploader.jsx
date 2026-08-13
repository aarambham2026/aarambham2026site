import React, { useState, useRef } from 'react';
import { UploadCloud, FileAudio, X, AlertCircle, CheckCircle } from 'lucide-react';
import { validateAudioFile } from '../../utils/validation';

const AudioUploader = ({ audioFile, onFileSelect, onFileRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    const validation = validateAudioFile(file);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    setError('');
    
    // Simulate upload progress UI
    setUploadProgress(10);
    let progress = 10;
    const interval = setInterval(() => {
      progress += 30;
      if (progress >= 100) {
        setUploadProgress(100);
        clearInterval(interval);
        onFileSelect(file);
      } else {
        setUploadProgress(progress);
      }
    }, 120);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setUploadProgress(0);
    setError('');
    onFileRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="onam-reg-form-group full-width">
      <label className="onam-reg-label">
        <span>Performance Audio Track</span>
        <span style={{ fontSize: '0.78rem', opacity: 0.6, fontWeight: 400 }}> (Optional for audition / Max 15 MB)</span>
      </label>

      {!audioFile ? (
        <div
          className={`onam-reg-uploader ${isDragging ? 'is-dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          aria-label="Upload performance audio"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFile(e.target.files?.[0])}
            accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/m4a"
            style={{ display: 'none' }}
          />

          <div className="onam-reg-upload-icon">
            <UploadCloud size={28} />
          </div>

          <div style={{ fontWeight: 600, fontSize: '0.98rem', marginBottom: '0.3rem', color: '#FFF8E7' }}>
            Click to upload or drag & drop audio track
          </div>
          <div style={{ fontSize: '0.82rem', color: 'rgba(255, 248, 231, 0.6)' }}>
            Supported formats: MP3, WAV, M4A &nbsp;|&nbsp; Maximum size: 15 MB
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div style={{ marginTop: '1rem', width: '100%', background: 'rgba(255,248,231,0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--onam-warm-gold)', transition: 'width 0.15s linear' }} />
            </div>
          )}
        </div>
      ) : (
        <div className="onam-reg-uploader-file-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <FileAudio size={24} color="var(--onam-warm-gold)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFF8E7' }}>{audioFile.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255, 248, 231, 0.6)' }}>
                {formatFileSize(audioFile.size)} &nbsp;•&nbsp; Ready for submission
              </div>
            </div>
          </div>

          <button
            type="button"
            className="onam-reg-remove-member-btn"
            onClick={handleRemove}
            title="Remove audio file"
            style={{ padding: '0.4rem 0.7rem', background: 'rgba(122, 38, 58, 0.4)', borderRadius: '6px' }}
          >
            <X size={16} /> Remove
          </button>
        </div>
      )}

      {error && (
        <div className="onam-reg-error-msg">
          <AlertCircle size={14} /> {error}
        </div>
      )}
    </div>
  );
};

export default AudioUploader;
