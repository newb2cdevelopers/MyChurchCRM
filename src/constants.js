// Use environment variable if available, otherwise fallback to localhost
export const B2C_BASE_URL =
  process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:4000';

// Alternative URLs commented for reference
// export const B2C_BASE_URL = "http://localhost:4000";
// export const B2C_BASE_URL = "https://mychurchcrm.azurewebsites.net/api";
// export const B2C_BASE_URL = "https://b2c-back.herokuapp.com";
