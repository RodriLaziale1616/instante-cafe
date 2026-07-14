import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('instante_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';

    const isLoginRequest =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/api/auth/login');

    /*
     * No recargar la página cuando las credenciales del login sean incorrectas.
     * El mensaje será gestionado por handleLogin().
     */
    if (status === 401 && !isLoginRequest) {
      localStorage.removeItem('instante_token');

      window.dispatchEvent(new CustomEvent('instante:unauthorized'));
    }

    return Promise.reject(error);
  }
);

export default api;