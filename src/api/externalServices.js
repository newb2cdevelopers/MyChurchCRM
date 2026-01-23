import { getAsyncResult } from "../utils/getAsyncResults";
import * as tokenService from "../services/tokenService";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

// Queue to store failed requests during token refresh
let isRefreshing = false;
let failedQueue = [];

/**
 * Process all queued requests after token refresh
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Refresh the access token using the refresh token
 */
const refreshAccessToken = async () => {
  const refreshToken = tokenService.getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/login/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  tokenService.setAccessToken(data.access_token);
  return data.access_token;
};

/**
 * Enhanced fetch with automatic token refresh on 401
 */
const fetchWithAuth = async (url, options = {}) => {
  const token = tokenService.getAccessToken();
  
  // Add auth header if token exists and not already present
  if (token && !options.headers?.['Authorization']) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  let response = await fetch(url, options);

  // Handle 401 Unauthorized - token expired
  if (response.status === 401) {
    if (isRefreshing) {
      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          options.headers['Authorization'] = `Bearer ${token}`;
          return fetch(url, options);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);
      
      // Retry original request with new token
      options.headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, options);
      
      isRefreshing = false;
      return response;
    } catch (error) {
      processQueue(error, null);
      isRefreshing = false;
      
      // Clear tokens and redirect to login
      tokenService.clearTokens();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
      
      throw error;
    }
  }

  return response;
};

export const genericGetService = async (url, options = {}) => {
  return await getAsyncResult(fetchWithAuth(url, options));
}

export const genericPostService = async (url, payload,
  options = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }) => {

  return await getAsyncResult(fetchWithAuth(url, {
    headers: options.headers,
    method: "POST",
    body: JSON.stringify(payload),
  }));
}

export const genericPutService = async (url, payload,
  options = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }) => {

  return await getAsyncResult(fetchWithAuth(url, {
    headers: options.headers,
    method: "PUT",
    body: JSON.stringify(payload),
  }));
}

export const getAuthHeaders = (token) => {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
}
