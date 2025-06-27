import React, { useState, useEffect } from 'react';
import { User, Repository } from '../types';
import Sidebar from './Sidebar';
import RepositoryList from './RepositoryList';
import CodeEditor from './CodeEditor';
import { githubService } from '../services/githubService';
import { authService } from '../services/authService';

interface DashboardProps {
  user: User;
  setUser: (user: User | null) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setUser }) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    loadRepositories();
  }, []);

  const loadRepositories = async () => {
    try {
      const repos = await githubService.getRepositories();
      setRepositories(repos);
    } catch (error) {
      console.error('Failed to load repositories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar
        user={user}
        repositories={repositories}
        selectedRepo={selectedRepo}
        onRepoSelect={setSelectedRepo}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-80'}`}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : selectedRepo ? (
          <CodeEditor repository={selectedRepo} />
        ) : (
          <RepositoryList
            repositories={repositories}
            onRepoSelect={setSelectedRepo}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;