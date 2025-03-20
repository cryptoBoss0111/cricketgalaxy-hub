
// Global flag to prevent concurrent validation
let isValidating = false;
// Store verified admin status for faster access
let cachedAdminVerified = false;
// Cache expiry time (15 minutes)
const CACHE_EXPIRY = 15 * 60 * 1000;
let lastVerificationTime = 0;

// Cache management functions
export const getCacheStatus = () => {
  const now = Date.now();
  const isCacheValid = cachedAdminVerified && (now - lastVerificationTime < CACHE_EXPIRY);
  return {
    isValidating,
    cachedAdminVerified,
    isCacheValid,
    now
  };
};

export const setValidationStatus = (status: boolean) => {
  isValidating = status;
};

export const setCacheVerified = (status: boolean) => {
  cachedAdminVerified = status;
  if (status) {
    lastVerificationTime = Date.now();
  }
};

export const resetCache = () => {
  cachedAdminVerified = false;
  lastVerificationTime = 0;
  isValidating = false;
};
