export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  avatar?: string;
  accessToken: string;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  updated_at: string;
  language?: string;
  stargazers_count: number;
  forks_count: number;
}

export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  sha: string;
  download_url?: string;
  content?: string;
  decodedContent?: string;
}

export interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'dir';
  children?: TreeNode[];
  sha?: string;
}