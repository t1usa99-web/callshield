import axios from 'axios';

let authContext = null;

export const setAuthContext = (ctx) => {
  authContext = ctx;
};

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Request interceptor to attach auth token
client.interceptors.request.use(
  (config) => {
    if (authContext?.accessToken) {
      config.headers.Authorization = `Bearer ${authContext.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and refresh token
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (authContext?.refreshToken) {
        try {
          const { data } = await axios.post(`${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`, {
            refreshToken: authContext.refreshToken,
          });

          // Update auth context with new tokens
          if (authContext.setTokens) {
            authContext.setTokens(data.accessToken, data.refreshToken);
          }

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          if (authContext?.logout) {
            authContext.logout();
          }
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, redirect to login
        if (authContext?.logout) {
          authContext.logout();
        }
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default client;
