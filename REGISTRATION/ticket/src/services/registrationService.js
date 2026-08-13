/**
 * Registration API Service Abstraction
 * Fully decoupled from UI components.
 * Easily replaceable with a real POST /api/registrations backend endpoint.
 */

export const submitRegistration = async (registrationData) => {
  // Simulate network latency (1.5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate occasional network error testing flag if needed, otherwise success
  const isRandomError = false; 
  if (isRandomError) {
    throw new Error('Server connectivity issue. Please try submitting again.');
  }

  // Generate unique registration ID e.g. ONAM-8F3A19
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const registrationId = `ONAM-${randomSuffix}`;

  return {
    success: true,
    registrationId,
    timestamp: new Date().toISOString(),
    details: {
      event: registrationData.event,
      format: registrationData.format,
      primaryContact: registrationData.teamLeader?.name || registrationData.participant?.name || registrationData.participant1?.name,
    }
  };
};
