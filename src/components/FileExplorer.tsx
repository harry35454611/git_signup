import React, { useState } from 'react';
import { TreeNode, Repository } from '../types';
import { githubService } from '../services/githubService';
import { File, Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';

interface FileExplorerProps {
  files: TreeNode[];
  onFileSelect: (file: TreeNode) => void;
  selectedPath?: string;
  repository: Repository;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files, 
  onFileSelect, 
  selectedPath,
  repository 
}) => {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [loadingDirs, setLoadingDirs] = useState<Set<string>>(new Set());
  const [dirContents, setDirContents] = useState<Map<string, TreeNode[]>>(new Map());

  const toggleDirectory = async (dir: TreeNode) => {
    const isExpanded = expandedDirs.has(dir.path);
    
    if (isExpanded) {
      setExpandedDirs(prev => {
        const newSet = new Set(prev);
        newSet.delete(dir.path);
        return newSet;
      });
    } else {
      // Load directory contents if not already loaded
      if (!dirContents.has(dir.path)) {
        setLoadingDirs(prev => new Set(prev).add(dir.path));
        
        try {
          const contents = await githubService.getContents(
            repository.owner.login, 
            repository.name, 
            dir.path
          );
          
          const treeNodes = contents.map(item => ({
            name: item.name,
            path: item.path,
            type: item.type,
            sha: item.sha,
            children: item.type === 'dir' ? [] : undefined
          }));
          
          setDirContents(prev => new Map(prev).set(dir.path, treeNodes));
        } catch (error) {
          console.error('Failed to load directory contents:', error);
        } finally {
          setLoadingDirs(prev => {
            const newSet = new Set(prev);
            newSet.delete(dir.path);
            return newSet;
          });
        }
      }
      
      setExpandedDirs(prev => new Set(prev).add(dir.path));
    }
  };

  const renderFileTree = (nodes: TreeNode[], level = 0) => {
    return nodes.map((node) => {
      const isExpanded = expandedDirs.has(node.path);
      const isLoading = loadingDirs.has(node.path);
      const isSelected = selectedPath === node.path;
      const children = dirContents.get(node.path) || [];

      return (
        <div key={node.path} className="select-none">
          <div
            className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
              isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'
            }`}
            style={{ paddingLeft: `${level * 20 + 8}px` }}
            onClick={() => {
              if (node.type === 'dir') {
                toggleDirectory(node);
              } else {
                onFileSelect(node);
              }
            }}
          >
            {node.type === 'dir' && (
              <div className="w-4 h-4 flex items-center justify-center">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-3 w-3 border border-gray-400 border-t-transparent"></div>
                ) : isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </div>
            )}
            
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              {node.type === 'dir' ? (
                isExpanded ? (
                  <FolderOpen className="h-4 w-4 text-blue-400 flex-shrink-0" />
                ) : (
                  <Folder className="h-4 w-4 text-blue-400 flex-shrink-0" />
                )
              ) : (
                <File className="h-4 w-4 text-gray-400 flex-shrink-0" />
              )}
              <span className="truncate text-sm">{node.name}</span>
            </div>
          </div>
          
          {node.type === 'dir' && isExpanded && children.length > 0 && (
            <div>
              {renderFileTree(children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="space-y-1">
      {files.length > 0 ? (
        renderFileTree(files)
      ) : (
        <div className="text-gray-500 text-center py-4">
          <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No files found</p>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;