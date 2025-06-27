import axios from 'axios';
import { Repository, FileItem } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Configure axios defaults
axios.defaults.withCredentials = true;

export const githubService = {
  getRepositories: async (): Promise<Repository[]> => {
    const response = await axios.get(`${API_URL}/api/github/repos`);
    return response.data;
  },

  getContents: async (owner: string, repo: string, path = ''): Promise<FileItem[]> => {
    const response = await axios.get(`${API_URL}/api/github/repos/${owner}/${repo}/contents`, {
      params: { path }
    });
    return Array.isArray(response.data) ? response.data : [response.data];
  },

  getFile: async (owner: string, repo: string, path: string): Promise<FileItem> => {
    const response = await axios.get(`${API_URL}/api/github/repos/${owner}/${repo}/contents/${path}`);
    return response.data;
  },

  updateFile: async (
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    sha: string
  ): Promise<any> => {
    const response = await axios.put(`${API_URL}/api/github/repos/${owner}/${repo}/contents/${path}`, {
      content,
      message,
      sha
    });
    return response.data;
  },

  createFile: async (
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string
  ): Promise<any> => {
    const response = await axios.post(`${API_URL}/api/github/repos/${owner}/${repo}/contents/${path}`, {
      content,
      message
    });
    return response.data;
  }
};