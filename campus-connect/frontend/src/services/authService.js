import api from './api';

export const authService = {
  async register(userData) {
    return await api.post('/auth/register', userData);
  },

  async login(credentials) {
    return await api.post('/auth/login', credentials);
  },

  async getCurrentUser() {
    return await api.get('/auth/me');
  },

  logout() {
    localStorage.removeItem('cc_auth_token');
    localStorage.removeItem('cc_auth_user');
  }
};

export default authService;
