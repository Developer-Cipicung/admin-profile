import { api } from './api';

export const authService = {
  login: async (username, password) => {
    return api.post('/auth/login', { username, password });
  }
};
