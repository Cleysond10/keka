import React from 'react';
import { Folder, FolderOpen } from 'lucide-react';
import { isFileSystemAccessSupported } from '../utils/fileSystem';

interface DirectoryPickerProps {
  onPickDirectory: () => Promise<void>;
  loading: boolean;
  directoryName: string;
}

const DirectoryPicker: React.FC<DirectoryPickerProps> = ({ 
  onPickDirectory, 
  loading,
  directoryName
}) => {
  const isSupported = isFileSystemAccessSupported();
  
  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-red-50 text-red-700 rounded-lg">
        <p>Seu navegador não suporta a API de Acesso ao Sistema de Arquivos.</p>
        <p className="text-sm mt-2">Por favor, use Chrome, Edge ou outro navegador baseado em Chromium.</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center sm:flex-row sm:justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center mb-4 sm:mb-0">
        {directoryName ? (
          <>
            <FolderOpen className="w-5 h-5 text-blue-500 mr-2" />
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {directoryName}
            </span>
          </>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">Nenhuma pasta selecionada</span>
        )}
      </div>
      
      <button
        onClick={onPickDirectory}
        disabled={loading}
        className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 
                 text-white font-medium rounded-lg transition-colors duration-200
                 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        <Folder className="w-4 h-4 mr-2" />
        {loading ? 'Carregando...' : directoryName ? 'Trocar Pasta' : 'Escolher Pasta'}
      </button>
    </div>
  );
};

export default DirectoryPicker;