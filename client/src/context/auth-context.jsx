import { createContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, refreshToken as refreshTokenAPI } from '../api/auth.js';
import { getProfile, updateProfile } from '../api/user.js';
import { setAuthContext } from '../api/client.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Expose methods to auth context for API interceptor
  const contextValue = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!user && !!accessToken,
    setTokens: (newAccessToken, newRefreshToken) => {
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
    },
    logout: null,
  };

  // Try to restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // In a real app, you might store token in sessionStorage or memory
        // For now, check if we have a token from previous session
        const storedToken = sessionStorage.getItem('accessToken');
        const storedRefresh = sessionStorage.getItem('refreshToken');

        if (storedToken) {
          setAccessToken(storedToken);
          setRefreshToken(storedRefresh);

          // Try to fetch user profile to verify token
          try {
            const profile = await getProfile();
            setUser(profile);
          } catch (err) {
            // Token invalid, clear it
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
          }
        }
      } catch (err) {
        console.error('Session restore error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Update auth context for API client
  useEffect(() => {
    contextValue.accessToken = accessToken;
    contextValue.refreshToken = refreshToken;
    contextValue.logout = logout;
    setAuthContext(contextValue);
  }, [accessToken, refreshToken]);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loginUser({ email, password });
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setUser(data.user);

      // Store tokens in session storage
      sessionStorage.setItem('accessToken', data.accessToken);
      sessionStorage.setItem('refreshToken', data.refreshToken);

      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, phoneNumber, dncRegistered) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await registerUser({
        email,
        password,
        phoneNumber,
        dncRegistered,
      });
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setUser(data.user);

      // Store tokens in session storage
      sessionStorage.setItem('accessToken', data.accessToken);
      sessionStorage.setItem('refreshToken', data.refreshToken);

      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setError(null);
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  }, []);

  const updateUser = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await updateProfile(data);
      setUser(updated);
      return updated;
    } catch (err) {
      const message = err.response?.data?.message || 'Update failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
