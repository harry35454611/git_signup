import React from 'react';
import { User, Repository } from '../types';
import { Github, LogOut, Menu, Code2, Star, GitFork } from 'lucide-react';

interface SidebarProps {
  user: User;
  repositories: Repository[];
  selectedRepo: Repository | null;
  onRepoSelect: (repo: Repository) => void;
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  repositories,
  selectedRepo,
  onRepoSelect,
  onLogout,
  collapsed,
  onToggleCollapse
}) => {
  return (
    <div className={`fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-700 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-80'
    } z-50`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <Code2 className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold text-white">GitHub IDE</span>
              </div>
            )}
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <img
              src={user.avatar}
              alt={user.displayName}
              className="w-10 h-10 rounded-full border-2 border-gray-600"
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user.displayName}</p>
                <p className="text-gray-400 text-sm truncate">@{user.username}</p>
              </div>
            )}
          </div>
        </div>

        {/* Repositories */}
        <div className="flex-1 overflow-y-auto">
          {!collapsed && (
            <div className="p-4">
              <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-3">
                Repositories ({repositories.length})
              </h3>
            </div>
          )}
          
          <div className="space-y-1 px-2">
            {repositories.slice(0, 20).map((repo) => (
              <button
                key={repo.id}
                onClick={() => onRepoSelect(repo)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedRepo?.id === repo.id
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
                title={collapsed ? repo.name : undefined}
              >
                <div className="flex items-center space-x-3">
                  <Github className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{repo.name}</p>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-gray-400">
                        {repo.language && (
                          <span className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-blue-400 mr-1"></span>
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center">
                          <GitFork className="h-3 w-3 mr-1" />
                          {repo.forks_count}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors text-gray-300"
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;