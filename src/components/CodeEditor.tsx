import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Repository, FileItem, TreeNode } from '../types';
import { githubService } from '../services/githubService';
import FileExplorer from './FileExplorer';
import { Save, RefreshCw, File, Folder } from 'lucide-react';

interface CodeEditorProps {
  repository: Repository;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ repository }) => {
  const [fileTree, setFileTree] = useState<TreeNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [originalContent, setOriginalContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadRepositoryContents();
  }, [repository]);

  useEffect(() => {
    setHasChanges(fileContent !== originalContent);
  }, [fileContent, originalContent]);

  const loadRepositoryContents = async () => {
    setLoading(true);
    try {
      const contents = await githubService.getContents(repository.owner.login, repository.name);
      const tree = buildFileTree(contents);
      setFileTree(tree);
    } catch (error) {
      console.error('Failed to load repository contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildFileTree = (items: FileItem[]): TreeNode[] => {
    return items.map(item => ({
      name: item.name,
      path: item.path,
      type: item.type,
      sha: item.sha,
      children: item.type === 'dir' ? [] : undefined
    }));
  };

  const loadFileContent = async (file: TreeNode) => {
    if (file.type === 'dir') return;

    setLoading(true);
    try {
      const fileData = await githubService.getFile(repository.owner.login, repository.name, file.path);
      const content = fileData.decodedContent || '';
      setSelectedFile(fileData);
      setFileContent(content);
      setOriginalContent(content);
    } catch (error) {
      console.error('Failed to load file content:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFile = async () => {
    if (!selectedFile || !hasChanges) return;

    setSaving(true);
    try {
      await githubService.updateFile(
        repository.owner.login,
        repository.name,
        selectedFile.path,
        fileContent,
        `Update ${selectedFile.name}`,
        selectedFile.sha
      );
      
      setOriginalContent(fileContent);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save file:', error);
    } finally {
      setSaving(false);
    }
  };

  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'md': 'markdown',
      'yml': 'yaml',
      'yaml': 'yaml',
      'xml': 'xml',
      'sql': 'sql',
      'sh': 'shell',
      'bash': 'shell',
      'php': 'php',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'go': 'go',
      'rb': 'ruby',
      'rs': 'rust'
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* File Explorer */}
      <div className="w-80 bg-gray-800 border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">{repository.name}</h3>
            <button
              onClick={loadRepositoryContents}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <FileExplorer
            files={fileTree}
            onFileSelect={loadFileContent}
            selectedPath={selectedFile?.path}
            repository={repository}
          />
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {selectedFile ? (
          <>
            {/* Editor Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-blue-500" />
                <span className="text-white font-medium">{selectedFile.name}</span>
                {hasChanges && (
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={saveFile}
                  disabled={!hasChanges || saving}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1">
              <Editor
                height="100%"
                language={getLanguageFromExtension(selectedFile.name)}
                value={fileContent}
                onChange={(value) => setFileContent(value || '')}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  folding: true,
                  bracketMatching: 'always',
                  autoIndent: 'full'
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <Folder className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No file selected</h3>
              <p className="text-gray-400">Choose a file from the explorer to start editing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;