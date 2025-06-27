import React from 'react';
import { Repository } from '../types';
import { Github, Star, GitFork, Clock, Lock, Globe } from 'lucide-react';

interface RepositoryListProps {
  repositories: Repository[];
  onRepoSelect: (repo: Repository) => void;
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repositories, onRepoSelect }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Your Repositories</h1>
        <p className="text-gray-400">Select a repository to start editing code</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            onClick={() => onRepoSelect(repo)}
            className="bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer hover:shadow-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Github className="h-6 w-6 text-blue-500" />
                <div>
                  <h3 className="text-white font-semibold text-lg">{repo.name}</h3>
                  <p className="text-gray-400 text-sm">@{repo.owner.login}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {repo.private ? (
                  <Lock className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Globe className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>

            {repo.description && (
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {repo.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                {repo.language && (
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-400 mr-2"></span>
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  {repo.stargazers_count}
                </span>
                <span className="flex items-center">
                  <GitFork className="h-4 w-4 mr-1" />
                  {repo.forks_count}
                </span>
              </div>
              <span className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {formatDate(repo.updated_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepositoryList;