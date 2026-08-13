/**
 * Validation utilities for the Onam Registration Module
 */

/**
 * Validates roll numbers.
 * Easily customizable for specific university/college formats (e.g. 21BCE0123, CS2201, etc.)
 */
export const validateRollNumber = (rollNo) => {
  if (!rollNo || typeof rollNo !== 'string') {
    return { isValid: false, message: 'Roll number is required' };
  }
  
  const trimmed = rollNo.trim();
  if (trimmed.length < 3) {
    return { isValid: false, message: 'Roll number must be at least 3 characters' };
  }
  
  if (trimmed.length > 20) {
    return { isValid: false, message: 'Roll number is too long' };
  }

  // Alpha-numeric pattern allowing hyphens/slashes
  const rollRegex = /^[A-Za-z0-9\/-]+$/;
  if (!rollRegex.test(trimmed)) {
    return { isValid: false, message: 'Roll number contains invalid characters' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validates email addresses
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { isValid: false, message: 'Email address is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validates phone numbers
 */
export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) {
    return { isValid: false, message: 'Phone number is required' };
  }
  
  // Accepts standard 10-digit formats with optional country code (+91, etc.)
  const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
  if (!phoneRegex.test(phone.trim().replace(/[\s-]/g, ''))) {
    return { isValid: false, message: 'Please enter a valid 10-digit phone number' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validates audio file uploads (Formats: MP3, WAV, M4A, Max Size: 15MB)
 */
export const validateAudioFile = (file) => {
  if (!file) {
    return { isValid: true, message: '' }; // Audio file might be optional or required depending on form
  }

  const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
  const ALLOWED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/m4a', 'audio/x-m4a', 'audio/aac'];
  const ALLOWED_EXTENSIONS = ['.mp3', '.wav', '.m4a'];

  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));

  if (!hasValidExtension && !ALLOWED_TYPES.includes(file.type)) {
    return { isValid: false, message: 'Unsupported audio format. Allowed: MP3, WAV, M4A' };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { isValid: false, message: 'File exceeds the 15 MB limit.' };
  }

  return { isValid: true, message: '' };
};
