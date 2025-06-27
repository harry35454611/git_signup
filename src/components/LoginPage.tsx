import React from 'react';
import { Github, Code2, GitBranch, Users } from 'lucide-react';
import { authService } from '../services/authService';

const LoginPage: React.FC = () => {
  const handleLogin = () => {
    authService.login();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <Code2 className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">GitHub IDE</h2>
          <p className="text-gray-400 text-lg">
            Professional code editing with GitHub integration
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4">
                Connect Your GitHub Account
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Access your repositories and edit code directly in the browser
              </p>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 border border-gray-600 hover:border-gray-500"
            >
              <Github className="h-6 w-6" />
              <span>Continue with GitHub</span>
            </button>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <GitBranch className="h-8 w-8 text-blue-500" />
                  <span className="text-xs text-gray-400">Repository Access</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Code2 className="h-8 w-8 text-green-500" />
                  <span className="text-xs text-gray-400">Code Editor</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Users className="h-8 w-8 text-purple-500" />
                  <span className="text-xs text-gray-400">Collaboration</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            By continuing, you agree to our terms and privacy policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;