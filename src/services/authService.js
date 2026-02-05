import * as tokenService from './tokenService';
import { B2C_BASE_URL } from '../constants';

/**
 * Logout user and revoke refresh token on backend
 */
export const logout = async (dispatch, navigate) => {
  const refreshToken = tokenService.getRefreshToken();

  // Try to revoke token on backend, but proceed with logout even if it fails
  if (refreshToken) {
    try {
      await fetch(`${B2C_BASE_URL}/login/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch (error) {
      console.error('Error revoking token:', error);
      // Continue with logout even if backend call fails
    }
  }

  // Clear all storage
  tokenService.clearTokens();
  localStorage.clear();
  sessionStorage.clear();

  // Clear Redux state if dispatch is provided
  if (dispatch) {
    const { logout: logoutAction } = require('../features/user/userSlice');
    dispatch(logoutAction());
  }

  // Redirect to login if navigate is provided
  if (navigate) {
    navigate('/login');
  }
};
