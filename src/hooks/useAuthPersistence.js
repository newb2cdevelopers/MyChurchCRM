import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login, setSelectedChurch } from '../features/user/userSlice';
import * as tokenService from '../services/tokenService';
import { B2C_BASE_URL } from '../constants';

/**
 * Hook to restore user session from localStorage or sessionStorage on app start
 */
export const useAuthPersistence = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      const accessToken = tokenService.getAccessToken();
      const refreshToken = tokenService.getRefreshToken();

      // No tokens, user needs to login
      if (!accessToken && !refreshToken) {
        return;
      }

      // We have a refresh token, try to get user data
      if (refreshToken) {
        try {
          // Try to refresh the token to get fresh user data
          const response = await fetch(`${B2C_BASE_URL}/login/refresh-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (response.ok) {
            const data = await response.json();

            // Update access token in the same storage (localStorage or sessionStorage)
            tokenService.setAccessToken(data.access_token);

            // Update the stored email with the real email from backend
            if (data.email) {
              localStorage.setItem('userEmail', data.email);
              sessionStorage.setItem('userEmail', data.email);
            }

            // Restore Redux state with email from the backend
            dispatch(
              login({
                userEmail: data.email || '',
                token: data.access_token,
                roles: data.roles || [],
                workfront: data.workfront || null,
              }),
            );

            if (data.churchId) {
              dispatch(
                setSelectedChurch({
                  selectedChurchId: data.churchId,
                }),
              );
            }
          } else {
            // Refresh token expired or invalid, clear only auth tokens
            tokenService.clearTokens();
            localStorage.removeItem('userEmail');
            sessionStorage.removeItem('userEmail');
          }
        } catch (error) {
          // Error restoring session, clear tokens
          tokenService.clearTokens();
        }
      }
    };

    restoreSession();
  }, [dispatch]);
};

export default useAuthPersistence;
