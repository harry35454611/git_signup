import axios from 'axios';
import { User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Configure axios defaults
axios.defaults.withCredentials = true;

export const authService = {
  getCurrentUser: async (): Promise<User> => {
    const response = await axios.get(`${API_URL}/auth/user`);
    return response.data;
  },

  login: () => {
    window.location.href = `${API_URL}/auth/github`;
  },

  logout: async (): Promise<void> => {
    await axios.post(`${API_URL}/auth/logout`);
  }
};