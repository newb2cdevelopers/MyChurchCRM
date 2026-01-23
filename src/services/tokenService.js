// Token service for managing authentication tokens in localStorage or sessionStorage

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Get the appropriate storage based on whether tokens exist in localStorage or sessionStorage
 */
const getStorage = () => {
  // Check if tokens exist in localStorage first (persistent session)
  if (
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    localStorage.getItem(REFRESH_TOKEN_KEY)
  ) {
    return localStorage;
  }
  // Otherwise use sessionStorage (non-persistent session)
  if (
    sessionStorage.getItem(ACCESS_TOKEN_KEY) ||
    sessionStorage.getItem(REFRESH_TOKEN_KEY)
  ) {
    return sessionStorage;
  }
  // Default to sessionStorage if no tokens exist
  return sessionStorage;
};

/**
 * Save both access and refresh tokens to localStorage or sessionStorage
 * @param {string} accessToken - The access token
 * @param {string} refreshToken - The refresh token
 * @param {boolean} persist - If true, uses localStorage (persistent). If false, uses sessionStorage (non-persistent)
 */
export const setTokens = (accessToken, refreshToken, persist = false) => {
  const storage = persist ? localStorage : sessionStorage;

  if (accessToken) {
    storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

/**
 * Get the access token from localStorage or sessionStorage
 */
export const getAccessToken = () => {
  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    sessionStorage.getItem(ACCESS_TOKEN_KEY)
  );
};

/**
 * Get the refresh token from localStorage or sessionStorage
 */
export const getRefreshToken = () => {
  return (
    localStorage.getItem(REFRESH_TOKEN_KEY) ||
    sessionStorage.getItem(REFRESH_TOKEN_KEY)
  );
};

/**
 * Update only the access token (used after refresh)
 * Uses the same storage where tokens currently exist
 */
export const setAccessToken = accessToken => {
  if (accessToken) {
    const storage = getStorage();
    storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
};

/**
 * Clear all tokens from both localStorage and sessionStorage
 */
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Check if user has valid tokens (doesn't verify expiration)
 */
export const isAuthenticated = () => {
  return !!(getAccessToken() && getRefreshToken());
};

const tokenService = {
  setTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearTokens,
  isAuthenticated,
};

export default tokenService;
